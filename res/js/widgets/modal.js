let activeAsync = 0;

function hideModal() {
    
    let modalPopup = document.getElementById('modalPopup');
    let modalOverlay = document.getElementById('modalOverlay');
    let blurWrapper = document.getElementById('blurWrapper');
    
    if(modalPopup != null) {
        modalPopup.style.display = "none";
        modalOverlay.style.opacity = "0";
    }
    
    modalOverlay.style.transition = ".2s";
    modalOverlay.style.opacity = "0";

    setTimeout(() => {
        modalOverlay.style.display = "none";
        //SOME SHOWMODAL CALL IS IN THE ACTUAL DESIGN TOOL THAT REQUIRES + 35PX LEFT PADDING
        //SHOW BLURWRAPPER AGAIN
        blurWrapper.style.filter = "blur(0px)";
        modalOverlay.dataset.show = "hidden";
        
    }, 200)
    
    addEventsAfterModal();
}

function showModal(title, message, button1, button2, padding) {

    let append = "";
    let modalOverlay = document.getElementById('modalOverlay');
    let modalPopup = document.getElementById('modalPopup');

    let blurWrapper = document.getElementById('blurWrapper');

    blurWrapper.style.filter = "blur(0px)";

    if(button1 != null && button2 !=null) {

        append = 
        `<div id="modalTitle">
            <h2>${title}</h2>
        </div>
        <div id="modalMessage">
            <h2>${message}</h2>
        </div>
        <div id="modalActions">
            <div id="modalButtonSet">
                <div id="btnModalOkay" class="btnModal"><h2>${button2}</h2></div>
                <div id="btnModalClose" class="btnModal"><h2>${button1}</h2></div>
            </div>
        </div>`;
    }
    
    else if(button1 != null && button2 == null) {
        append = 
        `<div id="modalTitle">
            <h2>${title}</h2>
        </div>
        <div id="modalMessage">
            <h2>${message}</h2>
        </div>
        <div id="modalActions">
            <div id="modalButtonSet">
                <div id="btnModalClose" class="btnModal"><h2>${button1}</h2></div>
            </div>
        </div>`;
    }

    //A LONE AFFIRMATIVE BUTTON. sir, 2026-09-25: "the format for single button on right is
    //always blue... right button is always the nearest in the right mouse". THE BRANCH ABOVE
    //CAN ONLY EVER RENDER #btnModalClose, WHICH modal.css PAINTS --sharp - RIGHT FOR Close,
    //WRONG FOR Okay. PASS button1 AS null AND button2 AS THE CAPTION TO GET #btnModalOkay ALONE:
    //--accent, AND ON THE RIGHT BECAUSE #modalButtonSet IS row-reverse. NO EXISTING CALLER
    //PASSES A null button1, SO NOTHING THAT RENDERS TODAY CHANGES
    else if(button1 == null && button2 != null) {
        append = 
        `<div id="modalTitle">
            <h2>${title}</h2>
        </div>
        <div id="modalMessage">
            <h2>${message}</h2>
        </div>
        <div id="modalActions">
            <div id="modalButtonSet">
                <div id="btnModalOkay" class="btnModal"><h2>${button2}</h2></div>
            </div>
        </div>`;
    }

    modalOverlay.dataset.show = "visible";

    modalOverlay.style.transition = '0.2s';
    modalOverlay.style.opacity = "1";
    modalOverlay.style.display = "flex";
    modalOverlay.style.paddingLeft = padding + 'px';
    
    modalPopup.innerHTML = append;

    setTimeout(() => {
        
        modalPopup.style.display = "flex";
   
    }, 200)
 

    blockEventsForModal();
    return true;
}

//WORK THAT FINISHES INSIDE THIS WINDOW NEVER PAINTS THE OVERLAY AT ALL. sir, 2026-09-24:
//"if the image loads too fast it's racing to the showloading transition fade... user can see
//the image already (peek) before showloading". THE OVERLAY USED TO PAINT ON THE CALL AND FADE
//IN OVER 0.2s, SO A FAST OPERATION LANDED UNDERNEATH A HALF-TRANSPARENT COVER.
//
//"how do we know?" - WE DO NOT, AND WE DO NOT HAVE TO. img.complete ONLY ANSWERS FOR THE
//NETWORK AND IS FALSE FOR A data: URL UNTIL IT DECODES; caches.match ANSWERS FOR A PRELOADED
//GRAPHIC BUT NOT FOR snapdom OR THE DECODE AFTER IT. THIS TIMER MEASURES THE REAL WAIT ON THE
//REAL MACHINE EVERY TIME, WHICH IS WHAT BOTH OF THOSE WERE ONLY GUESSING AT.
const LOADING_DELAY = 200;

//ONCE IT IS UP IT STAYS UP THIS LONG. WITHOUT IT, WORK THAT RUNS 210ms WOULD BLINK THE COVER
//FOR 10ms - WORSE THAN NEVER SHOWING IT.
//
//sir, 2026-09-24, RAISING IT FROM 300ms: "i want minimum of 1 second so it wont look like a
//premature placeholder and it has a proper timing". THE COST IS DELIBERATE - WORK THAT ENDS AT
//250ms IS HELD FOR ANOTHER 950ms AFTER IT IS ALREADY DONE. LOADING_DELAY ABOVE IS THE KNOB
//THAT DECIDES HOW OFTEN THAT HAPPENS: RAISE IT AND ONLY GENUINELY SLOW WORK EVER PAYS THE 1s.
const LOADING_MIN = 1000;

let loadingTimer = null;
let loadingShownAt = 0;

//THE PAINT ONLY. SPLIT OUT SO THE DELAY AND THE ESCAPE HATCH SHARE ONE COPY OF IT
function paintLoading() {

    let modalLoading = document.getElementById('modalLoading');

    loadingTimer = null;

    if(modalLoading.dataset.show != "hidden") return;

    modalLoading.style.opacity = "1";
    modalLoading.style.visibility = "visible";
    modalLoading.dataset.show = "visible";

    loadingShownAt = Date.now();

    modalLoading.querySelectorAll('g').forEach((g)=> {
        g.style.animationPlayState = 'running';
    })
}

//instant SKIPS THE DELAY FOR A CALLER THAT WANTS THE SCREEN COVERED THE MOMENT IT ASKS.
//NOTHING USES IT YET - IT EXISTS SO ONE SLOW PATH CAN OPT OUT WITHOUT THE OTHER SEVENTEEN
//LOSING THE DELAY
function showLoading(instant) {

    activeAsync++;

    //THE INPUT BLOCK IS NOT DELAYED, ONLY THE PAINT. IT USED TO SIT INSIDE THE PAINT BRANCH,
    //AND LEAVING IT THERE WOULD LET A FAST Ctrl+Z LAND IN THE MIDDLE OF AN OPERATION THAT HAD
    //NOT PAINTED YET. BLOCKED ON THE 0 -> 1 EDGE ONLY, SO NESTED CALLS DO NOT RE-BLOCK
    if(activeAsync == 1) blockEventsForModal();

    if(instant) {

        if(loadingTimer != null) clearTimeout(loadingTimer);
        paintLoading();
        return true;
    }

    if(loadingTimer == null && document.getElementById('modalLoading').dataset.show == "hidden") {
        loadingTimer = setTimeout(paintLoading, LOADING_DELAY);
    }

    return true;
}

async function hideLoading() {

    activeAsync--;  
    activeAsync < 0? activeAsync = 0: activeAsync = activeAsync;

    let modalLoading = document.getElementById('modalLoading');

    if(activeAsync == 0) {

        //THE TIMER NEVER FIRED, SO NOTHING WAS EVER PAINTED. DISARM IT AND LEAVE THE SCREEN
        //ALONE - THIS IS THE CASE sir DESCRIBED, AND THE RIGHT ANSWER IS THAT HE SEES NOTHING
        if(loadingTimer != null) {

            clearTimeout(loadingTimer);
            loadingTimer = null;
        }

        //THE UNBLOCK IS OWNED BY THE COUNTER, NOT BY THE PAINT. AN OPERATION THAT NEVER SHOWED
        //THE COVER STILL BLOCKED THE KEYBOARD ABOVE, SO IT STILL HAS TO GIVE IT BACK
        if(modalLoading.dataset.show == "hidden") {

            addEventsAfterModal();
            return;
        }

        //ALREADY VISIBLE: SERVE OUT WHATEVER IS LEFT OF ITS MINIMUM. THE FLAT 1000ms THIS
        //REPLACES RAN ON EVERY CALL, WHICH IS WHY A 5ms OPERATION STILL FROZE THE SCREEN FOR
        //A SECOND AND THE PICTURE WAS ALREADY THERE WHEN THE COVER LIFTED
        let left = LOADING_MIN - (Date.now() - loadingShownAt);

        setTimeout(() => {
            
            modalLoading.style.opacity = "0";
            modalLoading.style.visibility = "hidden";
            modalLoading.dataset.show = "hidden";
            addEventsAfterModal();

            modalLoading.querySelectorAll('g').forEach((g)=> {
                g.style.animationPlayState = 'paused';
            })

        }, left > 0 ? left : 0)
        
    }
}

//////////////////////DISABLE ALL MAIN FUNCTIONS//////////////////////
function blockEventsForModal() {

    //CHECK IF HOMEPAGE
    //IF NOT BLOCK EVENTS TEMPORARILY
    if(location.pathname !== '/') {
    
        document.removeEventListener('keyup', arrowUp);
        document.removeEventListener('keydown', arrowMove);
        document.removeEventListener('keydown', ctrlZ);
        document.removeEventListener('keydown', ctrlE);
        document.removeEventListener('keydown', ctrlX);
        document.removeEventListener('keydown', ctrlC);
        document.removeEventListener('paste', ctrlV);
        document.removeEventListener('keydown', ctrlD);
        document.removeEventListener('keydown', ctrlS);
        document.removeEventListener('keydown', ctrlH);
        document.removeEventListener('keydown', ctrlA);
        document.removeEventListener('pointerover', selectAreaToCtrlA);
        document.removeEventListener('wheel', scrollToZoom, {passive: false});
        document.removeEventListener('keydown', escToolMenu)

        //THIS IS REVERSE,
        //THIS WILL PREVENT SCROLL ZOOM WHILE OVERLAY IS THERE
        document.addEventListener('wheel', preventScrollZoom, {passive: false});
    }
}

function addEventsAfterModal() {

    if(location.pathname !== '/') {

        document.addEventListener('keyup', arrowUp);
        document.addEventListener('keydown', arrowMove);
        document.addEventListener('keydown', ctrlZ);
        document.addEventListener('keydown', ctrlE);
        document.addEventListener('keydown', ctrlX);
        document.addEventListener('keydown', ctrlC);
        document.addEventListener('paste', ctrlV);
        document.addEventListener('keydown', ctrlD);
        document.addEventListener('keydown', ctrlS);
        document.addEventListener('keydown', ctrlH);
        document.addEventListener('keydown', ctrlA);
        document.addEventListener('pointerover', selectAreaToCtrlA);
        document.addEventListener('wheel', scrollToZoom, {passive: false});
        document.addEventListener('keydown', escToolMenu);

        //THIS IS REVERSE,
        //THIS WILL NOW REMOVE SCROLL ZOOM WHILE OVERLAY IS THERE
        document.removeEventListener('wheel', preventScrollZoom, {passive: false});
    }
}

function preventScrollZoom(e) {

    if(e.ctrlKey) {

        e.preventDefault();

    } 
}

function preventModalContext(e) {
    let target = e.target;

    if(target.closest('#modalOverlay')) {
        e.preventDefault();
    }
}
document.getElementById('modalOverlay').addEventListener('contextmenu', preventModalContext)

function consoleMsg() {
    /*
    console.clear();
    console.log(
    "%cThank you for using Wondr!\n%c\tA design tool elegantly created with HTML, CSS and Vanilla JS to be simple, easy-to-use, and functional.\n%c\tAll the time and effort put into this work is dedicated to the memory of Wanda Dela Cruz.",
    "font-weight: 700; font-size:16px; letter-spacing: 2px; margin-bottom: 1em;",
    "margin-bottom: 1em; letter-spacing: 2px; line-height: 1.3em;",
    "font-style: italic; letter-spacing: 2px; line-height: 1.3em;");
    */
} 
