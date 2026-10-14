//SAME THREE LINES AS auth.js. THIS PAGE DOES NOT LOAD auth.js - THAT FILE'S GATE IS THE
//LOGIN PAGE'S (IT REVEALS #blurWrapper AND WRITES #lblLogin), SO BILLING CARRIES ITS OWN.
const supabaseUrl = 'https://mdskbqpghlptskglsekp.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kc2ticXBnaGxwdHNrZ2xzZWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjg5MzQsImV4cCI6MjA1MzY0NDkzNH0.73MEv89D96Uzm0Ft65lRPhY0gQghia8jvVdwK1G5UkU";
const wondrSupabase = supabase.createClient(supabaseUrl, supabaseKey);

let sessionUser = null;
let payWindow = null;

//THE WHOLE supabase-validate-access PAYLOAD, KEPT SO THE PRICE NEVER HAS TO BE FETCHED
//TWICE. IT CARRIES access, offer, country, founding_usd AND monthly_usd - THE LAST TWO
//ARE THE ONLY PLACE A PRICE COMES FROM ON THIS PAGE.
//
//THERE IS NO HARDCODED PRICE ANY MORE. Wondr IS PRICED PER COUNTRY OUT OF
//wondr_pricing, SO A CONSTANT IN THIS FILE COULD ONLY EVER BE WRONG FOR 148 OF THE
//149 ROWS. IF IT EVER COMES BACK, IT IS A BUG.
let quote = null;

let sfx = "";

async function codeOf(error) {

    try { return (await error.context.json()).code || ""; }
    catch { return ""; }
}

function show(id, on) {

    document.getElementById(id).hidden = !on;
}

function fail(message) {

    show('stateBusy' + sfx, false);
    show('stateDone' + sfx, false);

    document.getElementById('lblFail' + sfx).innerText = message;

    show('stateFail' + sfx, true);
}

//FADE OUT TO THE BG FIRST SO THE PAGE SWITCH IS NOT ABRUPT. SAME 200ms AS login.js,
//WHICH IS THE #blurWrapper TRANSITION IN THE CSS - CHANGE ONE AND CHANGE THE OTHER.
function leavePage(url) {

    blurWrapper.style.opacity = "0";

    setTimeout(() => {
        window.location.replace(url);
    }, 200)
}

//////////////////////////[1] SESSION GATE/////////////////////////////////////////

async function checkUserSession() {

    const { data: { session } } = await wondrSupabase.auth.getSession();

    if(session == null) {

        window.location.replace(window.location.origin);
        return;
    }

    sessionUser = session.user;

    document.getElementById('lblEmail').innerText = session.user.email || "";
    document.getElementById('lblEmailSub').innerText = session.user.email || "";

    const { data, error } = await wondrSupabase.functions.invoke('supabase-validate-access', {
        headers: { Authorization: `Bearer ${session.access_token}` }
    });

    if(!error && data != null && data.access == "subscriber") {

        window.location.replace(`${window.location.origin}/design.html`);
        return;
    }

    //A PAGE WITH NO QUOTE CANNOT HONESTLY OFFER ANYTHING. SHOWING IT WITH AN EMPTY
    //PRICE WOULD BE WORSE THAN SAYING SO - THE BUTTON WOULD EITHER LIE OR DO NOTHING.
    if(error || data == null) {

        showPage();
        document.getElementById('btnCheckout').disabled = true;
        fail("We are unable to load pricing. Please refresh the page.");
        return;
    }

    quote = data;

    //WHICH PRODUCT IS OFFERED IS THE SERVER'S CALL, NOT THIS PAGE'S. supabase-validate-access
    //COUNTS THE FOUNDING SEATS AND ANSWERS offer; BILLING ONLY PAINTS IT.
    if(quote.offer == "monthly") {

        sfx = "Sub";
        offerFounding.style.display = "none";
        offerSubscription.style.display = "flex";
    }

    paintOffer();

    showPage();
}
checkUserSession();

function showPage() {

    blurWrapper.style.opacity = "1";
}

//////////////////////////[2] THE PRICE///////////////////////////////////////////

//ONE FUNCTION PAINTS EITHER PANEL. sfx IS THE ONLY DIFFERENCE BETWEEN THEM, AND IT IS
//ALREADY SET BY THE TIME THIS RUNS, SO THERE IS NO SECOND COPY OF THIS LOGIC TO DRIFT.
function paintOffer() {

    const price = (sfx == "Sub") ? quote.monthly_usd : quote.founding_usd;

    //NULL MEANS wondr_pricing GAVE NOTHING BACK - AN UNSEEDED TABLE, OR A COUNTRY CODE
    //WITH NO ROW AND NO 'ZZ' FALLBACK. NO PRICE MEANS NO HONEST CHECKOUT, SO THE BUTTON
    //IS DISABLED RATHER THAN LEFT CLICKABLE OVER AN EMPTY AMOUNT.
    if(price == null) {

        document.getElementById('btnCheckout' + sfx).disabled = true;
        fail("We are unable to load pricing. Please refresh the page.");
        return;
    }

    document.getElementById('btnCheckout' + sfx).disabled = false;

    //numeric(6,2) ARRIVES AS A JSON NUMBER, SO 9.9 WOULD RENDER AS "$9.9" WITHOUT THIS.
    document.getElementById('lblPrice' + sfx).innerText = '$' + Number(price).toFixed(2);
}

//BOTH BUTTONS ARE WIRED ONCE, HERE, AND THE HANDLER READS sfx TO KNOW WHICH PANEL IT IS
//SERVING. ATTACHING THEM INSIDE THE PAINT WOULD ADD A SECOND LISTENER EVERY TIME THE
//PANEL SWAPS, AND THE SECOND CLICK WOULD OPEN TWO PAYPAL WINDOWS.
document.getElementById('btnCheckout').addEventListener('click', payWithPayPal);
document.getElementById('btnCheckoutSub').addEventListener('click', payWithPayPal);

//////////////////////////[3] PAYPAL///////////////////////////////////////////////

async function payWithPayPal() {

    //[!] OPENED IN THE CLICK ITSELF, BEFORE ANY await, OR EVERY BROWSER BLOCKS IT.
    payWindow = window.open(
        '',
        'PayPal Checkout for Wondr',
        `width=500,height=600, left=${(screen.width/2) - 250}, top=${(screen.height/2) - 300}`,
    );

    show('stateFail' + sfx, false);
    document.getElementById('lblBusy' + sfx).innerText = "Creating your order…";
    show('stateBusy' + sfx, true);

    //NO BODY MEANS "MAKE ME AN ORDER". THE SAME FUNCTION CAPTURES IT LATER WITH A BODY
    //CARRYING orderID - PRESENCE OF THAT KEY IS THE ONLY THING THAT TELLS THE TWO STEPS
    //APART, WHICH IS WHY THIS CALL SENDS NOTHING AT ALL RATHER THAN AN EMPTY OBJECT.
    //
    //IT SENDS NO PRICE AND NO COUNTRY EITHER. THE FUNCTION RESOLVES BOTH SERVER SIDE
    //FROM wondr_prebilling_country AND wondr_pricing. ANYTHING THIS PAGE SENT ABOUT
    //MONEY WOULD BE A NUMBER THE BUYER COULD EDIT.
    const { data, error } = await wondrSupabase.functions.invoke('paypal-checkout');

    if(error || data == null || data.link == null) {

        if(payWindow != null) payWindow.close();
        payWindow = null;

        const code = error? await codeOf(error): "";

        //ALREADY_MEMBER IS NOT A FAILURE - THE SEAT IS ALREADY THEIRS, SO THEY GO
        //STRAIGHT TO THE STUDIO INSTEAD OF BEING SOLD SOMETHING THEY OWN.
        if(code == "ALREADY_MEMBER")
            leavePage(`${window.location.origin}/design.html`);

        //ONE WORDING FOR EVERY OTHER CREATE FAILURE. THE BLOCKED AND UNAUTHORIZED
        //BRANCHES ARE GONE: A BANNED ACCOUNT IS SIGNED OUT GLOBALLY BY
        //supabase-validate-access BEFORE IT CAN REACH THIS PAGE, AND AN EXPIRED JWT IS
        //JUST A FAILED CREATE WITH THE SAME FIX AS ANY OTHER. THREE MESSAGES FOR ONE
        //OUTCOME ONLY MADE THE BUYER WONDER WHAT THE DIFFERENCE WAS.
        //
        //NOTHING WAS CHARGED HERE AND THAT IS CERTAIN - PAYPAL HAS NOT BEEN REACHED YET.
        else
            fail("We are unable to process your payment. No charge was made. Please try again.");

        return;
    }

    //THE SEATS CAN GO WHILE SOMEBODY IS SITTING ON THE FOUNDING PANEL. paypal-checkout
    //COUNTS THEM AT CREATE TIME AND ANSWERS kind, SO THE ORDER IT JUST MADE MAY BE A
    //MONTHLY ONE UNDER A LIFETIME HEADLINE.
    //
    //THERE IS NO SOLD_OUT ERROR TO CATCH - THE FUNCTION DOES NOT REFUSE, IT SWITCHES
    //PRODUCT. SO THE MISMATCH IS THE SIGNAL, AND IT IS CAUGHT HERE BEFORE THE BUYER
    //EVER SEES PAYPAL. THE ORDER IS ABANDONED UNAPPROVED AND EXPIRES ON PAYPAL'S SIDE.
    const offered = (sfx == "Sub") ? "MONTHLY" : "FOUNDING";

    if(data.kind != offered) {

        if(payWindow != null) payWindow.close();
        payWindow = null;

        let left = 5;

        fail(`Founding member seats are now full. Switching to monthly subscription in ${left}...`);

        let tick = setInterval(() => {

            left--;

            if(left > 0) {

                document.getElementById('lblFail' + sfx).innerText =
                    `Founding member seats are now full. Switching to monthly subscription in ${left}...`;
                return;
            }

            clearInterval(tick);

            show('stateFail' + sfx, false);

            sfx = "Sub";
            offerFounding.style.display = "none";
            offerSubscription.style.display = "flex";

            paintOffer();
        }, 1000);

        return;
    }

    //A BLOCKED POPUP LEAVES A LIVE ORDER NOBODY CAN APPROVE, SO SAY SO RATHER THAN
    //SPIN FOREVER. NOTHING IS CHARGED - AN UNAPPROVED ORDER EXPIRES ON PAYPAL'S SIDE.
    if(payWindow == null) {

        fail("Unable to open the payment window. Please allow browser popups and try again.");
        return;
    }

    document.getElementById('lblBusy' + sfx).innerText = "Waiting for PayPal…";

    payWindow.location = data.link;

    //CLOSING THE PAYPAL WINDOW IS A CANCEL AND IT FIRES NO EVENT ANYWHERE, SO THE HANDLE
    //HAS TO BE POLLED. getPayPalData NULLS payWindow THE MOMENT A REAL ANSWER ARRIVES,
    //WHICH IS WHAT STOPS THIS FROM WIPING "Confirming your payment…" OFF THE SCREEN -
    //THE CALLBACK PAGE CLOSES ITSELF ON SUCCESS TOO, SO closed IS TRUE EITHER WAY.
    let watch = setInterval(() => {

        if(payWindow == null) {
            clearInterval(watch);
            return;
        }

        if(!payWindow.closed) return;

        clearInterval(watch);
        payWindow = null;

        show('stateBusy' + sfx, false);
    }, 500);
}

async function getPayPalData(e) {

    if (e.origin !== window.location.origin) return;
    if (e.source !== payWindow) return;

    //NULLED BEFORE THE await SO THE CANCEL WATCHER ABOVE STANDS DOWN - THE CALLBACK
    //PAGE IS ABOUT TO CLOSE ITSELF AND THAT MUST NOT READ AS A CANCEL.
    payWindow = null;

    let { orderID } = e.data;

    //BOTH PRODUCTS ARE ORDERS NOW, SO ONE KEY COMES BACK AND ONE PATH HANDLES IT.
    //THE OLD subscriptionID BRANCH IS GONE WITH paypal-subscription: A PAYPAL PLAN IS A
    //FIXED-PRICE OBJECT AND wondr_pricing HOLDS 149 PRICES, SO PLANS COULD NEVER CARRY
    //PER-COUNTRY PRICING. MONTHLY IS A ONE-MONTH ORDER THAT SETS access_exp.
    if(orderID == null) {

        show('stateBusy' + sfx, false);
        return;
    }

    document.getElementById('lblBusy' + sfx).innerText = "Confirming your payment…";
    show('stateBusy' + sfx, true);

    //SAME FUNCTION AS THE CREATE CALL ABOVE. orderID IN THE BODY IS THE ONLY THING
    //THAT TELLS THE TWO STEPS APART - NO BODY MEANS "MAKE ME AN ORDER", A BODY MEANS
    //"CAPTURE THIS ONE". SENDING THE WRONG SHAPE WOULD SILENTLY CREATE A SECOND ORDER
    //INSTEAD OF TAKING THE MONEY, WHICH IS WHY THE SERVER BRANCHES ON PRESENCE OF THE
    //KEY AND NOT ON WHETHER IT IS TRUTHY.
    const { data: res, error } = await wondrSupabase.functions.invoke('paypal-checkout', {
        body: { orderID }
    });

    show('stateBusy' + sfx, false);

    //THE CAPTURE STEP ANSWERS { access, granted }. access == "subscriber" IS THE
    //ONLY SUCCESS, AND IT COVERS THE RETRY CASE TOO - A SECOND ARRIVAL COMES BACK
    //granted: "ALREADY" WITH THE SAME access.
    if(error || res == null || res.access != "subscriber") {

        const code = error? await codeOf(error): "";

        //THE SPLIT HERE IS ABOUT MONEY, NOT ABOUT WHICH ERROR IT WAS.
        //
        //THESE TWO ARE THE ONLY CODES AT THIS STEP WHERE WE KNOW FOR CERTAIN NOTHING
        //WAS TAKEN: A DECLINE MEANS THE FUNDING SOURCE REFUSED, AND INVALID_ORDER
        //MEANS WE REFUSED BEFORE CAPTURING. THE DECLINE REASON ITSELF ALREADY
        //APPEARED IN PAYPAL'S OWN WINDOW, WHICH IS THE RIGHT PLACE FOR IT - REPEATING
        //IT HERE TELLS THE BUYER NOTHING NEW.
        if(code == "INSTRUMENT_DECLINED" || code == "INVALID_ORDER")
            fail("We are unable to process your payment. No charge was made. Please try again.");

        //EVERYTHING ELSE AT THIS STEP MIGHT HAVE TAKEN THE MONEY: A GRANT THAT FAILED
        //AFTER CAPTURE, A NETWORK DROP MID-CAPTURE, A 502 WITH NO READABLE BODY. THE
        //TWO WRONG ANSWERS ARE NOT EQUAL - TELLING A CHARGED BUYER "no charge was made"
        //INVITES THEM TO PAY TWICE, WHILE TELLING AN UNCHARGED ONE TO EMAIL US COSTS
        //ONE REPLY. SO THE UNCERTAIN CASE ALWAYS ASSUMES THE MONEY MOVED.
        //
        //THE WORDING CARRIES NO ALARM ON PURPOSE. THEY PAID SECONDS AGO AND THIS IS
        //THE MOMENT THEY TRUST US LEAST; "access" RATHER THAN "account" BECAUSE THE
        //ACCOUNT EXISTS AND IS SIGNED IN - IT IS THE ACCESS THAT IS MISSING.
        else
            fail("Payment completed. Please email support@createwondr.io to activate your access.");

        return;
    }

    show('stateDone' + sfx, true);

    for(let a = 0; a < 10; a++) {

        await new Promise(done => setTimeout(done, 1200));

        const { data: { session } } = await wondrSupabase.auth.getSession();
        if(session == null) break;

        const { data: check, error: checkErr } = await wondrSupabase.functions.invoke('supabase-validate-access', {
            headers: { Authorization: `Bearer ${session.access_token}` }
        });

        if(!checkErr && check.access == "subscriber") {
            leavePage(`${window.location.origin}/design.html`);
            return;
        }
    }

    //NOTHING IS WRITTEN WHEN THE POLL GIVES UP, AND NOTHING NEEDS TO BE. THE DONE
    //PANEL HAS ONE OUTCOME PER PRODUCT AND ITS OWN <h3> ALREADY SAYS IT - A SECOND
    //ELEMENT EXISTED ONLY TO BE FILLED ON THIS PATH.
    //
    //THE PATH IS ALL BUT UNREACHABLE ANYWAY: THIS BLOCK IS ONLY ENTERED AFTER THE
    //CAPTURE CALL ITSELF ANSWERED access: 'subscriber', SO THE WHITELIST ROW IS
    //ALREADY WRITTEN AND THE FIRST POLL 1.2s LATER READS IT BACK. TEN FAILED POLLS
    //WOULD MEAN THE DATABASE COULD NOT SEE ITS OWN COMMITTED WRITE.
    //
    //THE FAIL PANEL KEEPS ITS DYNAMIC LABEL BECAUSE IT CARRIES SIX DIFFERENT
    //MESSAGES. THIS ONE CARRIES ONE.
}
window.addEventListener('message', getPayPalData)

async function signOut() {

    await wondrSupabase.auth.signOut();

    localStorage.clear();
    sessionStorage.clear();

    leavePage(window.location.origin);
}
document.getElementById('btnSignOut').addEventListener('click', signOut);
document.getElementById('btnSignOutSub').addEventListener('click', signOut);
