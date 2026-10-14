

//////////////////////////GOOGLE SIGNIN 2.0 OAUTH INDEPENDENT/////////////////////
let authWindow;
let hashedNonce;

(async () => {

    let nonce = crypto.randomUUID();
    let digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(nonce));

    hashedNonce = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');

    //[!] localStorage NOT sessionStorage - THE CALLBACK IS A SEPARATE WINDOW AND ONLY
    //[!] localStorage IS RELIABLY SHARED ACROSS SAME-ORIGIN WINDOWS.
    localStorage.setItem('wondrNonce', nonce);
})();

function loginWithGoogle() {
    //GOOGLE CONSOLE CLOUD 
    //SWAPPED 2026-09-25 TO THE CLIENT IN sir'S NEW PROJECT - PUBLISHED, BRANDED WITH
    //support@createwondr.io. THE OLD ID WAS 1097873557901-orita5epgg0auknqj8qp8tasphh9qlsi
    //AND ITS PROJECT IS STILL IN Testing, SO ITS REFRESH TOKENS DIE EVERY 7 DAYS.
    //
    //IT IS ALSO HARDCODED IN THE EDGE FUNCTION google-oAuth-validate-login, WHICH REFUSES
    //ANY TOKEN WHOSE aud DOES NOT MATCH. CHANGE BOTH OR EVERY LOGIN FAILS SILENTLY.
    const googleClientID = '674845921085-iu8sf99rke6k75i6csnsrpd87mpu90c5.apps.googleusercontent.com';

    //GOOGLE CLOUD REDIRECT URI
    const redirectUri = `${window.location.origin}/google_authentication_callback.html`; // must be set in Google Console
    const scope = [
    'openid',
    'email',
    ].join(' ');

    //USE JOIN TO MAKE A STRING SEPARATED BY WHITESPACE
    
    //BUILD THE URL FOR STRING BY APPENDING
    //THIS IS THE TRADITIONAL OAUTH 2.0 (FOR GETTING ACCESS TOKEN, GOOGLE GIVING PERMISSION TO MY APP) AND OPENID CONNECT (PASSING MY ACCESS TOKEN TO GOOGLE AGAIN TO GET USER'S INFO)
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${googleClientID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` + 
    `&response_type=id_token` + 
    `&scope=${encodeURIComponent(scope)}` + 
    `&nonce=${hashedNonce}` +
    `&prompt=consent`;

    //FINALLY OPEN A SUB WINDOW AND USE THE AUTH URL
    authWindow = window.open(
        authUrl,
        'Google Authentication for Wondr',
        `width=500,height=600, left=${(screen.width/2) - 250}, top=${(screen.height/2) - 300}`,
    );    
}
document.getElementById('btnLogin').addEventListener('click', loginWithGoogle);

/////////THIS FUNCTION WILL BE USED AGAIN AFTER THE TOKEN WAS PASSED ON/////////////
async function getGoogleData(e) {

    if (e.origin !== window.location.origin) return;
    if (e.source !== authWindow) return;

    let {access} = e.data;

    //access DECIDES THE DESTINATION, THE SESSION ONLY CONFIRMS IT. EVERY VERIFIED
    //SIGN-IN NOW HAS A SESSION, SO A BARE "if(session) -> design.html" WOULD SEND A
    //BRAND-NEW USER INTO THE STUDIO GATE, WHICH IMMEDIATELY BOUNCES THEM BACK HERE.
    //THAT IS AN INFINITE ROUND TRIP, AND IT IS WHY THIS CHECK MOVED BELOW access.
    if(access == "subscriber") {

        //ENTRY STILL HINGES ON A REAL SESSION, NOT THE POSTED STRING
        const { data: { session } } = await wondrSupabase.auth.getSession();

        if(session) {

            //FADE THE WHOLE BODY, NOT JUST blurWrapper. THE GLOW IS ON body, SO FADING THE
            //WRAPPER ALONE LEFT IT LIT UNTIL THE DOCUMENT WAS REPLACED AND design.html HAS
            //NO GLOW, WHICH READ AS THE GLOW SNAPPING OFF ON ARRIVAL
            document.body.style.opacity = "0";

            setTimeout(() => {
                window.location.replace(`${window.location.origin}/design.html`);
            }, 200)
        }

        return;
    }

    //A BAN IS NOT A SALES OPPORTUNITY, AND THE CALLBACK ALREADY CLEARED STORAGE AND
    //MINTED NO SESSION - SENDING THEM TO BILLING WOULD ONLY BOUNCE THEM STRAIGHT BACK
    //HERE WHEN ITS SESSION GATE FINDS NOTHING. THEY STAY ON THE LOGIN PAGE.
    if(access == "blocked") return;

    //EVERYBODY ELSE GOES TO BILLING: null FOR SOMEBODY NEVER WHITELISTED, 'free' FOR A
    //LAPSED MEMBER, AND WHATEVER STATE GETS ADDED NEXT YEAR.
    //
    //THIS USED TO READ if(access == null), WHICH LEFT 'free' MATCHING NEITHER BRANCH -
    //THE POPUP CLOSED AND THE LOGIN PAGE JUST SAT THERE WITH NO ROUTE AND NO MESSAGE.
    //google-oAuth-validate-login HAS RESOLVED A LAPSED MEMBER TO 'free' ALL ALONG.
    //IT HID BECAUSE auth2.0.js AND billing.js BOTH TEST != "subscriber" AND ROUTE ANY
    //OTHER STRING CORRECTLY; THIS FILE WAS THE ONLY ONE TESTING FOR A SPECIFIC VALUE.
    //TEST FOR THE ONE STATE THAT EARNS THE STUDIO, NEVER FOR THE ONES THAT DO NOT.
    blurWrapper.style.opacity = "0";

    setTimeout(() => {
         window.location.replace(`${window.location.origin}/billing.html`);
    }, 200)

}
window.addEventListener('message', getGoogleData)
