const supabaseUrl = 'https://mdskbqpghlptskglsekp.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kc2ticXBnaGxwdHNrZ2xzZWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjg5MzQsImV4cCI6MjA1MzY0NDkzNH0.73MEv89D96Uzm0Ft65lRPhY0gQghia8jvVdwK1G5UkU";
const wondrSupabase = supabase.createClient(supabaseUrl, supabaseKey);

//THIS FUNCTION WILL AUTH IN SUPABASE
async function loginWithSupabase(token) {

    //[!] RAW NONCE THAT login.js STORED. SUPABASE HASHES IT AND COMPARES TO THE nonce
    //[!] CLAIM SEALED IN THE TOKEN, SO AN INJECTED OR REPLAYED TOKEN IS REFUSED.
    //[!] A MISSING NONCE MAKES THE SIGN IN FAIL, WHICH IS THE CORRECT FAIL CLOSED.
    let nonce = localStorage.getItem('wondrNonce');

    const { data, error } = await wondrSupabase.auth.signInWithIdToken({
        provider: 'google',
        token: token,
        nonce: nonce
    });

    //[!] SINGLE USE. REMOVE IT WHETHER OR NOT THE SIGN IN WORKED.
    localStorage.removeItem('wondrNonce');

    return data;
}

async function validateAccess(idToken) {

    //EDGE FUNCTION VERIFIES THE GOOGLE TOKEN, READS THE WHITELIST AND STAMPS LAST_LOGIN
    const { data, error } = await wondrSupabase.functions.invoke('google-oAuth-validate-login', {
        body: { idToken }
    })

    let access = (!error && data.access != null) ? data.access : null;

    //A BLOCKED ACCOUNT GETS NO SESSION AT ALL. THAT IS NOT "PENDING", IT IS REVOKED,
    //AND MINTING A JWT FOR IT WOULD ONLY BE THROWN AWAY BY supabase-validate-access
    //ON THE NEXT CALL, WHICH SIGNS blocked OUT GLOBALLY.
    if(access == "blocked") {

        localStorage.clear();
        sessionStorage.clear();

        window.opener.postMessage({ access }, window.location.origin);
        window.close();
        return;
    }

    //EVERY OTHER VERIFIED GOOGLE SIGN-IN GETS A SESSION, MEMBER OR NOT. A BRAND-NEW
    //USER HAS TO BE SIGNED IN FOR billing.html TO HAVE A JWT TO SEND - WITHOUT ONE,
    //paypal-create-order ANSWERS UNAUTHORIZED AND THERE IS NO WAY TO PAY. THE
    //WHITELIST STILL DECIDES WHERE THEY GO; IT NO LONGER DECIDES WHETHER THEY ARE
    //SIGNED IN. NOTHING WIDENS: wondr_whitelist IS REVOKED FROM authenticated, AND
    //EVERY OTHER FUNCTION GATES ON check_access(), WHICH REFUSES ANYTHING THAT IS NOT
    //EXACTLY 'free' OR 'subscriber'.
    //
    //THE SESSION IS MINTED LAST, AFTER ANY CLEARING - signInWithIdToken WRITES THE
    //SESSION INTO localStorage, SO A CLEAR AFTER IT WOULD DELETE WHAT IT JUST STORED.
    await loginWithSupabase(idToken)

    window.opener.postMessage({ access }, window.location.origin);
    window.close();
}

async function passGoogleData() {
    //HASH GETS FRAGMENT IDENTIFIER '#' AND SUCCEEDING CHARACTERS
    //SUBSTRING(1) REMOVES THE '#' AND JUST GET THE SUCCEEDING CHARACTERS
    let hash = location.hash.substring(1);
    //URLSEARCH PARAMS NATIVE JAVASCRIPT CONSTRUCTOR TO GET FRAGMENT ID PART BY PART
    let params = new URLSearchParams(hash);
    //WE ONLY GET THE TOKEN PART
    //let accessToken = params.get('access_token'); // ACCESS TOKEN IS FOR MY APP'S PRIVILEGE REQUESTS TO GOOGLE
    let idToken = params.get('id_token'); // ID TOKEN IS THE USER/CLIENTS CREDENTIALS

    //IF NO TOKEN CLOSE THE POPUP
    if (idToken == null || !idToken) {
        window.close(); // No token, nothing to do
        return;
    }

    //THE EMAIL IS NO LONGER DECODED HERE, THE EDGE FUNCTION DOES IT AFTER VERIFYING
    await validateAccess(idToken)
}
passGoogleData();
