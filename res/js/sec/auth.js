
//CHECK FIRST IF USER IS STILL AUTHENTICATED OR IN SESSION
// Function to check if user is still in session

const supabaseUrl = 'https://mdskbqpghlptskglsekp.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kc2ticXBnaGxwdHNrZ2xzZWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjg5MzQsImV4cCI6MjA1MzY0NDkzNH0.73MEv89D96Uzm0Ft65lRPhY0gQghia8jvVdwK1G5UkU";
const wondrSupabase = supabase.createClient(supabaseUrl, supabaseKey);
//THE PAGE REVEAL, AND NOTHING ELSE NOW. auth.css HOLDS #blurWrapper AT opacity 0 SO THE
//LOGIN PANEL CANNOT FLASH AT SOMEONE WHO IS ABOUT TO BE REDIRECTED. THE SESSION GATE
//DECIDES FIRST, THEN THIS UNCOVERS THE PAGE.
//
//THE body visibility LINE IS GONE. IT HID THE BACKGROUND ALONG WITH THE CONTENT, SO THE
//GLOW ONLY APPEARED AFTER THE SESSION CHECK - AND #blurWrapper IS THE ONLY VISIBLE CHILD
//OF body, SO IT WAS DOING NOTHING THE opacity WAS NOT ALREADY DOING.
//
//IT EXISTS BECAUSE getYear() BELOW IS ASLEEP AND getYear() WAS ALSO WHAT DID THE REVEAL.
//WITHOUT THIS NOTHING EVER FADES IN AND index.html STAYS AT opacity 0.
function showPage() {

    //FADE IN FROM THE BG, ALSO COVERS A REFRESH
    blurWrapper.style.opacity = "1";
}


//=========================================================================
// async function getYear() {
//
//     const { data, error } = await wondrSupabase
//     .schema('public')
//     .from('wondr_time_date')
//     .update({
//         random: crypto.randomUUID()
//     })
//     .eq('index', 0)
//     .select('get_date')
//
//     formatted = data[0].get_date;
//     formatted = formatted.split(/\D/g);
//
//     //CHANGE LAST ONLINE TO UTC+8
//     document.getElementById('lblLogin').innerHTML = `By logging in, you agree to our <a href = "${window.location.origin}/terms-of-service">terms of service</a> and <a href = "${window.location.origin}/privacy-policy">privacy policy</a>. © ${formatted[0]} Wondr. All rights reserved.`;
//     document.body.style.visibility = "visible";
//
//     //FADE IN FROM THE BG, ALSO COVERS A REFRESH
//     blurWrapper.style.opacity = "1";
// }

//[1] CHECK FIRST IF THERE IS A TOKEN TO SEND, NO TRUST IS PLACED ON IT
async function checkUserSession() {

    const{ data: {session} , error} = await wondrSupabase.auth.getSession()

   
    if (session != null) {

        //THE DEPLOYED NAME IS supabase-validate-access. 'validate-access' 404s, and a
        //404 IS AN error, SO EVERY !error BRANCH BELOW WAS DEAD - A LOGGED-IN
        //SUBSCRIBER WAS NEVER REDIRECTED AND A BLOCKED USER WAS NEVER SIGNED OUT.
        const { data, error } = await wondrSupabase.functions.invoke('supabase-validate-access', {
            headers: { Authorization: `Bearer ${session.access_token}` }
        })

        //ONLY THE SERVER CAN SAY SUBSCRIBER
        if(!error && data.access == "subscriber") {

            window.location.replace(`${window.location.origin}/design.html`);
        }

        //BLOCKED IS ALREADY SIGNED OUT ON THE SERVER, STAY ON THE LOGIN PAGE
        else if(!error && data.access == "blocked") {

            localStorage.clear();
            sessionStorage.clear();

            showPage();
        }

        //ANYTHING ELSE IS A SIGNED-IN USER WHO IS NOT A MEMBER YET - access null (never
        //whitelisted), 'free', OR A FAILED CHECK. THEY MUST SEE THE LOGIN PAGE.
        //
        //WITHOUT THIS BRANCH NOTHING MATCHED, SO getYear() NEVER RAN AND body STAYED
        //visibility: hidden - A NEW USER WHO RELOADED THIS PAGE GOT A PERMANENTLY BLANK
        //SCREEN. THAT WAS INVISIBLE BEFORE ONLY BECAUSE A NON-MEMBER NEVER HAD A SESSION.
        //
        //STORAGE IS NOT CLEARED HERE ON PURPOSE. THAT SESSION IS THE JWT billing.html
        //NEEDS TO PAY WITH - WIPING IT WOULD BREAK THE SIGNUP FLOW AT ITS LAST STEP.
        else {

            showPage();
        }

    }
    else {

        localStorage.clear();
        sessionStorage.clear();

        showPage();
    }

}
checkUserSession();


//[2] DEFAULT ENV AND CUBEMAPS INTO CACHE WHILE THE USER IS STILL ON THE LOGIN PAGE
//[!] KEY FORMAT MUST MATCH storeEnvironmentAndCubeMapsToCache IN connect.js
async function storeDefaultEnvironment() {

    //NO TABLE READ - THE wondr SCHEMA IS AUTH + WHITELIST ONLY NOW
    //THESE MUST MATCH THE res_environments ROW, connect.js REBUILDS IT FROM THE KEY
    let index = 0;
    let id = 'Indoor White Light';
    let rotation = 222;
    let cubemapUrl = 'https://mdskbqpghlptskglsekp.supabase.co/storage/v1/object/public/3d-cubemap-public/Indoor%20White%20Light/';
    let envUrl = 'https://mdskbqpghlptskglsekp.supabase.co/storage/v1/object/public/3d-environment-public/Indoor%20White%20Light/indoor-white-light.env';

    let cache = await caches.open('res_environments');
    let keys = await cache.keys();
    let fileCount = 0;

    for(let a = 0; a < keys.length; a++) {

        let values = keys[a].url.replace(window.location.origin, '').split('/');

        if(decodeURIComponent(values[2]) == id) {
            fileCount++;
        }
    }

    if(fileCount == 7) return;

    let file = ["_nx", "_ny", "_nz", "_px" , "_py" , "_pz"];

    for(let b = 0; b < 7; b++) {

        let key = "";

        if(b < 6) {
            key += index + '/';
            key += encodeURIComponent(id) + '/';
            key += encodeURIComponent(cubemapUrl) + '/';
            key += rotation + '/';
            key += file[b];

            let response = await fetch(`${cubemapUrl}${file[b]}.jpg`, { mode: 'cors'});

            //NEVER CACHE A FAILED FETCH - fileCount WOULD HIT 7 AND NEVER RETRY
            if(!response.ok) return;

            await cache.put(key, response);
        }
        else {
            key += index + '/';
            key += encodeURIComponent(id) + '/';
            key += encodeURIComponent(envUrl) + '/';

            let response = await fetch(`${envUrl}`, { mode: 'cors'});

            if(!response.ok) return;

            await cache.put(key, new Response(await response.blob()));
        }
    }
}
storeDefaultEnvironment();
