
let snapped = "false";
let snapSensitivity; //PAUSE WHEN SNAPPING (1-10)
let snapLineColor = "";
let selectLineColor = "";
let handlerColor = "";

let dataSettings = `\n*`;
dataSettings += `\npnlBoxSettings: Settings`;
dataSettings += `\nchkSnap: false`;
dataSettings += `\ntxtSnapSensitivity: 5`;
dataSettings += `\ntxtSnapColor: rgba(255, 62, 157, 1)`;
dataSettings += `\ntxtSelectionColor: rgba(104, 133, 204, 1)`;
dataSettings += `\ntxtHandlerColor: rgba(104, 133, 204, 1)`;

//[!] THE PRESET, ONE KEY PER SETTING SO BTNRESETSETTINGS CAN READ THEM BACK
localStorage.setItem("snapped", "false");
localStorage.setItem("snapSensitivity", "5");
localStorage.setItem("snapLineColor", "rgba(255, 62, 157, 1)");
localStorage.setItem("selectLineColor", "rgba(104, 133, 204, 1)");
localStorage.setItem("handlerColor", "rgba(104, 133, 204, 1)");

/////////////////////////GET PREFERENCE VALUES////////////////

////////////////////////////SNAP GUIDE/////////////////////
if(sessionStorage.getItem("snapped") == null) {
    sessionStorage.setItem("snapped", "false");
} 
else {
    snapped = sessionStorage.getItem("snapped");

    if(snapped == "true") {
        snapped = "false"; //[!]REVERT BEFORE CLICK
        document.querySelector('.chkSnap').click();
    }
}

///////////////////////SNAP SENSITIVITY//////////////////////
if(sessionStorage.getItem("snapSensitivity") == null) {
    snapSensitivity = 5;
    sessionStorage.setItem("snapSensitivity", "5");
    moveable.snapThreshold = snapSensitivity;
    moveable.snapHorizontalThreshold = snapSensitivity;
    moveable.snapVerticalThreshold   = snapSensitivity;
}
else {
    snapSensitivity = Number(sessionStorage.getItem("snapSensitivity"));
    document.querySelector('.txtSnapSensitivity').value = snapSensitivity;
    document.querySelector('.txtSnapSensitivity').previousElementSibling.value = snapSensitivity;
    moveable.snapThreshold = snapSensitivity;
    moveable.snapHorizontalThreshold = snapSensitivity;
    moveable.snapVerticalThreshold   = snapSensitivity;
}


////////////////////SNAP LINE COLOR AND ALPHA////////////////////
if(sessionStorage.getItem("snapLineColor") == null) {
    snapLineColor = 'rgba(255, 62, 157, 1)';
    sessionStorage.setItem("snapLineColor", snapLineColor);

    let hex = rgbaString2HexEncoding(snapLineColor);
    document.querySelector('.txtSnapColor').value = hex;
    document.documentElement.style.setProperty('--snap', snapLineColor);
} 
else {
    snapLineColor = sessionStorage.getItem("snapLineColor");

    let hex = rgbaString2HexEncoding(snapLineColor);
    document.querySelector('.txtSnapColor').value = hex;

    let alpha = rgbaString2AlphaEncoding(snapLineColor) /100;
    document.querySelector('.txtSnapColor').dataset.alpha = alpha;

    document.querySelector('.txtSnapColor').nextElementSibling.querySelector('.thumbColor').style.background = snapLineColor;
    document.documentElement.style.setProperty('--snap', snapLineColor);
}

////////////////////SELECTION LINE COLOR AND ALPHA////////////////////
//sessionStorage.removeItem('selectLineColor')
if(sessionStorage.getItem("selectLineColor") == null) {
    selectLineColor = 'rgba(104, 133, 204, 1)';
    sessionStorage.setItem("selectLineColor", selectLineColor);

    let hex = rgbaString2HexEncoding(selectLineColor);
    document.querySelector('.txtSelectionColor').value = hex;
    
} 
else {
    selectLineColor = sessionStorage.getItem("selectLineColor");

    let hex = rgbaString2HexEncoding(selectLineColor);
    document.querySelector('.txtSelectionColor').value = hex;

    let alpha = rgbaString2AlphaEncoding(selectLineColor) /100;
    document.querySelector('.txtSelectionColor').dataset.alpha = alpha;

    document.querySelector('.txtSelectionColor').nextElementSibling.querySelector('.thumbColor').style.background = selectLineColor;
}

////////////////////HANDLER COLOR AND ALPHA////////////////////
if(sessionStorage.getItem("handlerColor") == null) {
    handlerColor = 'rgba(104, 133, 204, 1)';
    sessionStorage.setItem("handlerColor", handlerColor);

    let hex = rgbaString2HexEncoding(handlerColor);
    document.querySelector('.txtHandlerColor').value = hex;
    document.documentElement.style.setProperty('--moveableHandler', handlerColor);
}
else {
    handlerColor = sessionStorage.getItem("handlerColor");

    let hex = rgbaString2HexEncoding(handlerColor);
    document.querySelector('.txtHandlerColor').value = hex;

    let alpha = rgbaString2AlphaEncoding(handlerColor) /100;
    document.querySelector('.txtHandlerColor').dataset.alpha = alpha;

    document.querySelector('.txtHandlerColor').nextElementSibling.querySelector('.thumbColor').style.background = handlerColor;
    document.documentElement.style.setProperty('--moveableHandler', handlerColor);
}

///////////////////////////CHECKBOX MODE 2D/3D//////////////////////////

function chkModeHover() {

    this.style.transition = ".2s";
    //this.style.borderColor = "var(--muted-blue-text)";
    this.children[0].style.transition = ".2s";
        
}
document.getElementById('chkMode').addEventListener('pointerover', chkModeHover)

function chkModeLeave() {
    
    //this.style.borderColor = "var(--sharp-track)";
    this.addEventListener('pointerover', chkModeHover)
}
document.getElementById('chkMode').addEventListener('pointerleave', chkModeLeave)

function chkModeClick() {
    
    let canvas = document.getElementById('cnvEnv').querySelector('canvas');
    let chkMode = document.getElementById('chkMode');

    if(chkMode.dataset.value == "2D") {
        
        //canvas.style.clipPath = 'inset(0 0 0 0)';
        canvas.style.clipPath = "circle(100% at 50% 50%)";
        chkMode.dataset.value = "3D";
        //chkMode.style.transition = ".2s";
        chkMode.children[1].children[0].style.color = "var(--muted-blue-text)";
        chkMode.children[1].children[1].style.color = "var(--sharp)";
        chkMode.children[0].style.transition = ".2s";
        chkMode.children[0].style.translate = `${chkMode.children[0].clientWidth + 2}px`;

        swapPanels('canvas');

        //THE DEFAULT ENVIRONMENT (Indoor White Light) IS PRELOADED ON THE LOGIN PAGE (auth.js storeDefaultEnvironment) AND
        //BUILT AFTER LOGIN (create3DEnvironment FROM auth2.0.js). A FAST SIGN-IN CAN CUT THE PRELOAD SHORT, AND IF THE STUDIO
        //DOWNLOAD FAILED OR IS STILL RUNNING THERE IS NO ENGINE YET. BUILD IT HERE UNDER THE COVER INSTEAD OF A BLANK 3D.
        //create3DEnvironment READS THE CACHE FIRST AND DOWNLOADS + STORES WHAT IS MISSING, AS ALWAYS
        if(engineEnv == null) {

            showLoading();

            create3DEnvironment()
            .finally(() => {
                hideLoading();
            })
        }
    }

    else if(chkMode.dataset.value == "3D") { 

        //canvas.style.clipPath = 'inset(0 100% 0 0)';
        canvas.style.clipPath = "circle(0% at 50% 50%)";
        chkMode.dataset.value = "2D";
        //chkMode.style.transition = ".2s";
        chkMode.children[1].children[0].style.color = "var(--sharp)";
        chkMode.children[1].children[1].style.color = "var(--muted-blue-text)";
        chkMode.children[0].style.transition = ".2s";
        chkMode.children[0].style.translate = "0px";
        
        chkMode.removeEventListener('pointerover', chkModeHover);

        swapPanels('canvas');
    }

}
document.getElementById('chkMode').addEventListener('click', chkModeClick);
document.getElementById('chkMode').addEventListener('click', encodeCheckboxMode);

/////////////////////////////SNAPPING BOOLEAN////////////////////////
function chkSnapClick() {

    if(snapped == 'false') {
        sessionStorage.setItem("snapped", "true");
        snapped = "true";
        moveable.snappable = true;
    }
    else if(snapped == 'true') { 
        sessionStorage.setItem("snapped", "false");
        snapped = "false";
        moveable.snappable = false;
    }   
}

function adjustSnapSensitivity() {
    snapSensitivity = Number(this.value);
    sessionStorage.setItem("snapSensitivity", snapSensitivity.toString());
    moveable.snapThreshold = snapSensitivity;
    moveable.snapHorizontalThreshold = snapSensitivity;
    moveable.snapVerticalThreshold   = snapSensitivity;
}
document.querySelector('.txtSnapSensitivity').addEventListener('change', adjustSnapSensitivity);
document.querySelector('.txtSnapSensitivity').previousElementSibling.addEventListener('change', adjustSnapSensitivity);

function adjustSnapLineColor() {

    let hex = testHexCode(this);
    let rgb = hex2RGBStringEncoding(hex);
    let alpha = this.dataset.alpha;

    snapLineColor = `rgba(${rgb}, ${alpha})`;
    sessionStorage.setItem('snapLineColor', snapLineColor);

    this.nextElementSibling.querySelector('.thumbColor').style.background = `rgba(${rgb}, ${alpha})`;
    document.documentElement.style.setProperty('--snap', snapLineColor);
}
document.querySelector('.txtSnapColor').addEventListener('change', adjustSnapLineColor);


function adjustSelectLineColor() {

    let hex = testHexCode(this);
    let rgb = hex2RGBStringEncoding(hex);
    let alpha = this.dataset.alpha;

    selectLineColor = `rgba(${rgb}, ${alpha})`;
    sessionStorage.setItem('selectLineColor', selectLineColor);

    this.nextElementSibling.querySelector('.thumbColor').style.background = `rgba(${rgb}, ${alpha})`;
}
document.querySelector('.txtSelectionColor').addEventListener('change', adjustSelectLineColor);


function adjustHandlerColor() {

    let hex = testHexCode(this);
    let rgb = hex2RGBStringEncoding(hex);
    let alpha = this.dataset.alpha;

    handlerColor = `rgba(${rgb}, ${alpha})`;
    sessionStorage.setItem('handlerColor', handlerColor);

    this.nextElementSibling.querySelector('.thumbColor').style.background = `rgba(${rgb}, ${alpha})`;
    document.documentElement.style.setProperty('--moveableHandler', handlerColor);
}
document.querySelector('.txtHandlerColor').addEventListener('change', adjustHandlerColor);


/////////////////////////////RESET SETTINGS////////////////////////
function resetSettings() {

    //[!] NOTHING TO RESET WHEN EVERY VALUE IS ALREADY THE PRESET, OTHERWISE THE
    //BUTTON PILES UP IDENTICAL ENTRIES THAT ALL UNDO TO THE SAME STATE
    if(snapped != "false" || Number(snapSensitivity) != 5 || snapLineColor != 'rgba(255, 62, 157, 1)' || selectLineColor != 'rgba(104, 133, 204, 1)' || handlerColor != 'rgba(104, 133, 204, 1)') {

        pauseEncoding()
        //[!] NEW VALUES ARE THE PRESET, OLD ONES ARE THE LIVE GLOBALS TAKEN BEFORE THE RESET
        let tempHistory = `Modified*`;
        tempHistory += `\npnlBoxSettings: Settings`;
        tempHistory += `\nchkSnap: false`;
        tempHistory += `\ntxtSnapSensitivity: 5`;
        tempHistory += `\ntxtSnapColor: rgba(255, 62, 157, 1)`;
        tempHistory += `\ntxtSelectionColor: rgba(104, 133, 204, 1)`;
        tempHistory += `\ntxtHandlerColor: rgba(104, 133, 204, 1)`;
        tempHistory += `\n_`;
        tempHistory += `\nchkSnap: ${snapped}`;
        tempHistory += `\ntxtSnapSensitivity: ${snapSensitivity}`;
        tempHistory += `\ntxtSnapColor: ${snapLineColor}`;
        tempHistory += `\ntxtSelectionColor: ${selectLineColor}`;
        tempHistory += `\ntxtHandlerColor: ${handlerColor}\n`;

        //[!] CHKSNAPCLICK ONLY TOGGLES, SO THE OFF STATE IS SET HERE. SAME PAINT AS
        //CHKBOXFORMAT BUT AT .2S SO IT SLIDES LIKE THE UNDO CHECKBOXES DO
        snapped = "false";
        sessionStorage.setItem("snapped", snapped);
        moveable.snappable = false;

        document.querySelector('.chkSnap').dataset.value = snapped;
        document.querySelector('.chkSnap').style.transition = ".2s";
        document.querySelector('.chkSnap').style.borderColor = "var(--sharp-track)";
        document.querySelector('.chkSnap').style.backgroundColor = "transparent";
        document.querySelector('.chkSnap').children[0].style.transition = ".2s";
        document.querySelector('.chkSnap').children[0].style.translate = "0px";
        document.querySelector('.chkSnap').children[0].style.backgroundColor = "var(--muted-blue-text)";

        snapSensitivity = 5;
        sessionStorage.setItem("snapSensitivity", "5");
        document.querySelector('.txtSnapSensitivity').value = snapSensitivity;
        document.querySelector('.txtSnapSensitivity').previousElementSibling.value = snapSensitivity;
        moveable.snapThreshold = snapSensitivity;
        moveable.snapHorizontalThreshold = snapSensitivity;
        moveable.snapVerticalThreshold   = snapSensitivity;

        snapLineColor = 'rgba(255, 62, 157, 1)';
        sessionStorage.setItem("snapLineColor", snapLineColor);
        document.querySelector('.txtSnapColor').value = rgbaString2HexEncoding(snapLineColor);
        document.querySelector('.txtSnapColor').dataset.alpha = rgbaString2AlphaEncoding(snapLineColor) /100;
        document.querySelector('.txtSnapColor').nextElementSibling.querySelector('.thumbColor').style.background = snapLineColor;
        document.documentElement.style.setProperty('--snap', snapLineColor);

        selectLineColor = 'rgba(104, 133, 204, 1)';
        sessionStorage.setItem("selectLineColor", selectLineColor);
        document.querySelector('.txtSelectionColor').value = rgbaString2HexEncoding(selectLineColor);
        document.querySelector('.txtSelectionColor').dataset.alpha = rgbaString2AlphaEncoding(selectLineColor) /100;
        document.querySelector('.txtSelectionColor').nextElementSibling.querySelector('.thumbColor').style.background = selectLineColor;

        handlerColor = 'rgba(104, 133, 204, 1)';
        sessionStorage.setItem("handlerColor", handlerColor);
        document.querySelector('.txtHandlerColor').value = rgbaString2HexEncoding(handlerColor);
        document.querySelector('.txtHandlerColor').dataset.alpha = rgbaString2AlphaEncoding(handlerColor) /100;
        document.querySelector('.txtHandlerColor').nextElementSibling.querySelector('.thumbColor').style.background = handlerColor;
        document.documentElement.style.setProperty('--moveableHandler', handlerColor);

        dataSettings = valueSwitcher(dataSettings, 'chkSnap', snapped);
        dataSettings = valueSwitcher(dataSettings, 'txtSnapSensitivity', snapSensitivity);
        dataSettings = valueSwitcher(dataSettings, 'txtSnapColor', snapLineColor);
        dataSettings = valueSwitcher(dataSettings, 'txtSelectionColor', selectLineColor);
        dataSettings = valueSwitcher(dataSettings, 'txtHandlerColor', handlerColor);


        makeNewHistory(tempHistory);

        resumeEncoding();
    }
}
document.getElementById('btnResetSettings').addEventListener('click', resetSettings);


///////////////////////////////DELETE CACHE API///////////////////////////////
async function clearCache() {

    await caches.keys().then(names => names.forEach(name => caches.delete(name)));
    logout();
}

////////////////////////LOG OUT////////////////////

async function logout() {

    document.querySelector('#blurWrapper').style.opacity = 0;
    
    setTimeout(async () => {

        await wondrSupabase.auth.signOut();

    }, 200)
}
