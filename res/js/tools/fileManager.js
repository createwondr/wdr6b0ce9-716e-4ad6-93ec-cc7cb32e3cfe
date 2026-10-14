
let panelCountMax = 0;
let initPanel = 0; 
let uploadHistory = null;
let uploadRedo = null;
let uploadData = null;
let uploadRestoreThumb = null;
let uploadRestorePanel = null;
let uploadRestoreCanvas = null;
let uploadRestorePin = null;
let uploadFonts = null;

//sir, 2026-10-13: "i want the document fully loaded before hideLoading()". ONE PROMISE PER GOOGLE
//STYLESHEET THE FILE ASKED FOR, READ AND EMPTIED BY waitForFileFonts AT THE END OF loadWondrFile
let fileFontLinks = [];

//SAVE PANEL VALUES. SAME SHAPE AS dataSettings - LIVE ONLY, NEVER COMPILED INTO A FILE.
//txtProjectTitle IS NOT HERE, IT HAS ITS OWN ENCODING
let dataSave = `\n*`;
dataSave += `\npnlBoxSave: Save`;
dataSave += `\ndropdown 0: Local Drive`;
dataSave += `\nchkIncludeHistory: false`;
dataSave += `\ndropdown 1: PNG Format`;
dataSave += `\ntxtOutputWidth: 1080`;
dataSave += `\ntxtOutputHeight: 1080`;



///////////////////////////////////////COMPILE CONTENT///////////////////////////////
function compileContent(includeHistory = true) {

    let fontLinks = document.head.querySelectorAll('link[href*="https://fonts.googleapis.com/"]')
    let wrapUploads = document.getElementById('wrapUploads');
    let configScroll = document.getElementsByClassName('configScroll');

    let uuidSplitter = crypto.randomUUID();
    let content = uuidSplitter + '*\n';

    content += "History*";

    if(includeHistory) {

        for(let a = 0; a <= h; a++) {
            if(history[a] != null) {
                
                //DO NOT ADD IF HISTORY IS FOR PNLBOXSETTINGS OR PNLBOXSAVE
                if(!history[a].includes('pnlBoxSettings: Settings') && !history[a].includes('pnlBoxSave: Save')) {
                    content += '\n'
                    content += history[a];
                    content += '\n~'
                }
                
            }
        }
    }

    content += uuidSplitter + "\nRedo*";

    if(includeHistory) {

        for(let a = 0; a <= rh; a++) {
            if(redoHistory[a] != null) {
                //DO NOT ADD IF HISTORY IS FOR PNLBOXSETTINGS OR PNLBOXSAVE
                if(!redoHistory[a].includes('pnlBoxSettings: Settings') && !redoHistory[a].includes('pnlBoxSave: Save')) {
                    content += '\n'
                    content += redoHistory[a];
                    content += '\n~'
                }
            }
        }
    }

    //NOW EMBED FONTS
    content += uuidSplitter + "\n";
    content += "embedFonts*";

    fontLinks.forEach(link => {
        content += '\n'
        content += link.getAttribute('href');
        content += '\n~'
    })

    //////////////////NOW RESTORE DATA///////////////////
    //THE restore* SECTIONS ARE WHAT UNDO OF A DELETE PUTS BACK, SO WITHOUT HISTORY NOTHING CAN
    //EVER READ THEM. sir, 2026-09-27: "dont include it since it's useless if history not
    //included, autosave and export. basically they have the same compilecontent so it's the
    //same path". MEASURED IN sir's CONSOLE: restoreCanvas 3839.5 KB FOR ONE DELETED IMAGE. THE
    //HEADERS STAY SO THE SECTION ORDER - AND THE LOADER - ARE UNTOUCHED; AN EMPTY SECTION IS
    //ALREADY SKIPPED BY EVERY useRestore*
    content += uuidSplitter + "\n";
    content += "restoreThumb*";

    if(includeHistory) {

        for(let n = 0; n < restoreThumb.length; n++) {
            if(restoreThumb[n] != null || restoreThumb[n] != undefined) {
                content += '\n'
                content += restoreThumb[n];
                content += '\n~'
            }
        }
    }

    content += uuidSplitter + "\n";
    content += "restorePanel*";
    
    if(includeHistory) {

        for(let f = 0; f < restorePanel.length; f++) {
            if(restorePanel[f] != null || restorePanel[f] != undefined) {
                content += '\n'
                content += restorePanel[f];
                content += '\n~'
            }
        }
    }

    content += uuidSplitter + "\n";
    content += "restoreCanvas*";
    
    if(includeHistory) {

        for(let f = 0; f < restoreCanvas.length; f++) {
            if(restoreCanvas[f] != null || restoreCanvas[f] != undefined) {
                content += '\n'
                content += restoreCanvas[f];
                content += '\n~'
            }
        }
    }

    content += uuidSplitter + "\n";
    content += "restorePin*";
    
    if(includeHistory) {

        for(let f = 0; f < restorePin.length; f++) {
            if(restorePin[f] != null || restorePin[f] != undefined) {
                content += '\n'
                content += restorePin[f];
                content += '\n~'
            }
        }
    }
    
    content += "\n" + uuidSplitter;

    //////////////////NOW APPEND CANVAS SETTINGS///////////////
    content += dataCanvas;
    content += "\n" + uuidSplitter;

    ///////////////////////////NOW APPEND DATA FROM ENVIRONMENT//////////////
    content+= dataEnv;
    content += "\n" + uuidSplitter;

    ///////////////////////////NOW APPEND DATA FROM CHKMODE 2D 3D//////////////
    content+= dataMode;
    content += "\n" + uuidSplitter;

    ///////////////////////////NOW APPEND DATA TITLE//////////////
    content+= dataTitle;
    content += "\n" + uuidSplitter;

    ///////////////////////////NOW APPEND DATA FROM DATA THUMB////////////////
    for(let a = 0; a < wrapUploads.childElementCount; a++) {
        if(wrapUploads.children[a] != null) {
            
            let n = wrapUploads.children[a].dataset.thumbno;
            content += dataThumb[n]
        }
    }

    content += "\n" + uuidSplitter;

    ///////////////////////////NOW APPEND DATA FROM CONFIG 5////////////////

    for(let a = 0; a < configScroll[5].childElementCount; a++) {
        if(configScroll[5].children[a] != null) {
            if(configScroll[5].children[a].dataset.type == "pattern") {
                let f = configScroll[5].children[a].dataset.ref;
                content += dataPattern[f];
            }
            else {
                let f = configScroll[5].children[a].dataset.ref;
                content += dataLayer[f];
            }
        }
    }

    content += "\n" + uuidSplitter;

    ////////////////////////////NOW APPEND DATA 3D//////////////////////
    for(let a = 0; a < maxF; a++) {
        if(data3D[a] != null) {
            content += '*';
            content += JSON.stringify(data3D[a]);
        }
    }
    content += "\n" + uuidSplitter + "\n";

    ////////////////////////////NOW APPEND THUMB////////////////////////
    content += configScroll[2].innerHTML;
    content += "\n" + uuidSplitter + "\n";

    ////////////////////////////NOW APPEND LAYERS///////////////////////
    content += configScroll[5].innerHTML;
    content += "\n" + uuidSplitter + "\n";

    ////////////////////////////NOW APPEND CANVASES//////////////////////

    let cnvPin = document.getElementById('cnvPin');
    let cnvBoxScaler = document.getElementById('cnvBoxScaler');

    let pinClone = cnvPin.cloneNode(true);

    pinClone.querySelectorAll('.moveable-control-box').forEach((box) => box.remove());

    //THE "Failed to fetch image. Retry?" OVERLAY IS LIVE UI, NOT ARTWORK. CLONE THE CANVAS AND
    //STRIP IT, OR A FILE SAVED WHILE ONE LAYER WAS IN THAT STATE WOULD CARRY THE MESSAGE BACK
    //IN AS PART OF THE DESIGN. THE img UNDERNEATH IS UNTOUCHED, SO NOTHING ELSE IS LOST
    //THE BLEED IS SIZED FOR THIS ZOOM, SO IT STAYS OUT OF THE FILE
    bleedFillLayers(true);
    let canvasClone = cnvBoxScaler.cloneNode(true);
    bleedFillLayers();

    canvasClone.querySelectorAll('[data-strip]').forEach((box) => box.remove());

    content += canvasClone.outerHTML + pinClone.outerHTML;

    content += "\n" + uuidSplitter + "\n";
    
   
    //RETURN THE CONTENT
    return content

}
////////////////////////////////////////ENCRYPT CONTENT//////////////////////////

async function encryptSignContent(content) {

  try {

    // Call your edge function
    const { data, error } = await wondrSupabase.functions.invoke('wondr-file-encrypt', {
      body: { content: content }
    })

    // Handle edge function errors
    
    if (error) {
      hideLoading();
      return null;
    }

    hideLoading();
    return data.file

  } 
  catch (error) {
    hideLoading();
    return null;
  }

}

//////////////////////////////AUTOSAVE FUNCTIONS///////////////////////

function clearAutosave() {

    let bannerAutosave = document.getElementById('bannerAutosave');

    bannerAutosave.innerHTML = "";
    bannerAutosave.style.display = "none";

    setTimeout(async () => {
        await caches.delete(`res_project`);
    }, 200)
}

async function loadAutosave() {

    let menuFooterDesign = document.querySelector('.menuFooter');

    showLoading();

    menuFooterDesign.innerHTML = "";
    menuFooterDesign.style.background = "transparent";
    
    let raw;

    //RLS DOES THE AUTHORISING, SO A PLAIN download() ON A PRIVATE BUCKET IS ENOUGH -
    //NO SIGNED URL, NO EDGE HOP. DECRYPTION IS GONE FROM THIS PATH - THE OBJECT IS
    //PLAIN GZIP - SO THE ONLY WAYS IT FAILS ARE A DOWNLOAD/NETWORK ERROR (supabase
    //RETURNS error) OR AN OUTRIGHT FETCH THROW. throw error FOLDS THE FIRST INTO THE
    //SAME ONE HANDLER. loadWondrFile PURIFIES THE CONTENT ON THE WAY IN.
    try {

        const { data, error } = await wondrSupabase.storage
        .from('wondr_files')
        .download(`save_files/${fileID}/file.wdr`);

        if(error) throw error;

        raw = await new Response(data.stream().pipeThrough(new DecompressionStream('gzip'))).text();
    }

    catch {

        hideLoading();
        showModal("Something went wrong", "We are unable to process your request this time. Please check your connection and try again.", "Close", null, 0);
        document.getElementById('btnModalClose').addEventListener('click', e => hideModal());

        return;
    }

    //THE TITLE COMES FROM THE TABLE, RESOLVED AT BOOT. THE OBJECT IS THE DESIGN
    //AND NOTHING ELSE, SO THERE IS NO WRAPPER TO PARSE.
    autosaveTitle = autosaveTitle?.trim() || "Untitled";

    txtProjectTitle.value = purifyTitle(autosaveTitle);
        
    //CHECK THE PAYLOAD BEFORE TOUCHING THE CANVAS. resetProject() USED TO RUN FIRST,
    //SO ANYTHING loadWondrFile COULD NOT READ LEFT AN EMPTIED CANVAS AND NO MESSAGE
    //AT ALL - THE WORK WAS WIPED FROM THE SCREEN TO LOAD SOMETHING UNREADABLE.
    if(raw.split('*')[0].length != 36) {


        hideLoading();
        showModal("Something went wrong", "We are unable to process your request this time. Please check your connection and try again.", "Close", null, 0);
        document.getElementById('btnModalClose').addEventListener('click', e => hideModal());

        return;
    }

    resetProject();
    await loadWondrFile(raw);

    dataTitle = valueSwitcher(dataTitle, "title", txtProjectTitle.value);

    //THE OFFER HAS BEEN CLAIMED. loadWondrFile() ALREADY RESYNCED tempH TO h, SO THE
    //NEXT TICK SEES NO MOVEMENT AND WILL NOT RE-UPLOAD WHAT WAS JUST RESTORED.
    restorePending = false;
    clearAutosave();

    //showLoading() AT THE TOP INCREMENTED activeAsync AND NOTHING RELEASED IT ON THE
    //SUCCESS PATH, SO THE COUNTER DRIFTED UP BY ONE PER LOAD AND A LATER hideLoading()
    //COULD NEVER REACH ZERO - THE OVERLAY STICKS FOR THE REST OF THE SESSION.
    hideLoading();

}

////////////////////////////VERIFY THE FILE//////////////////

async function verifyWondrFile(file) {

    //THE source ARGUMENT AND THE wondr_autosave_decrypt BRANCH ARE GONE. ONLINE SAVE
    //IS PLAIN GZIP IN A PRIVATE BUCKET NOW, SO NOTHING PASSED 'autosave' ANY MORE AND
    //THAT EDGE FUNCTION WAS UNREACHABLE. BOTH CALLERS SEND A FILE.
    try {

        const { data, error } = await wondrSupabase.functions.invoke('wondr-file-decrypt', file != null ? { body: { file } } : {})

        if(error) {

            //[!] error.context IS THE RAW RESPONSE ON A NON-2XX (invoke throws BEFORE
            //[!] parsing the body, so it is unconsumed). READ OUR OWN code: 'INVALID_FILE'.
            //[!] A NETWORK FAILURE HAS NO RESPONSE, SO .json() THROWS → code STAYS NULL.
            let code = null;
            try { code = (await error.context.json()).code; } catch {}

            //NOTHING TO READ IS NOT AN ERROR. NO_AUTOSAVE IS THE OLD NAME, KEPT SO THE
            //ORDER OF REDEPLOYING THE EDGE FUNCTIONS CANNOT BREAK ANYTHING.
            if(code === 'NOT_FOUND' || code === 'NO_AUTOSAVE') {
                hideLoading();
                return null;
            }

            let title = "Something went wrong";
            let message = "We are unable to process your request this time. Please check your connection and try again.";

            //ONE CODE FOR EVERY UNREADABLE PAYLOAD. THIS FUNCTION ONLY EVER SEES A
            //LOCAL .wdr NOW, SO THERE IS ONE WORDING. THE source CHECK THAT USED TO
            //BE HERE OUTLIVED ITS PARAMETER AND THREW ReferenceError ON THIS BRANCH.
            if(code === 'INVALID_FILE' || code === 'INVALID_AUTOSAVE') {
                title = "Invalid file format";
                message = "It looks like this file might be modified or invalid. To keep your project safe, let's skip opening it.";
            }

            hideLoading();
            showModal(title, message, "Close", null, 0);
            document.getElementById('btnModalClose').addEventListener('click', e => hideModal());

            return null;
        }

        return await new Response(data.stream().pipeThrough(new DecompressionStream('gzip'))).text();
    }

    catch {

        hideLoading();
        showModal("Something went wrong", "We are unable to process your request this time. Please check your connection and try again.", "Close", null, 0);
        document.getElementById('btnModalClose').addEventListener('click', e => hideModal());

        return null;
    }
   
}


////////////////////////////LOAD FILE////////////////////////
async function loadWondrFile(file) {

    let canvasBorder = document.getElementById('canvasBorder');
    let rebuild3D = null;
    let configScroll = document.getElementsByClassName('configScroll');

    let uuidSplitter = file.split('*')[0];

    //A MALFORMED PAYLOAD USED TO RETURN SILENTLY. BY THEN THE CALLER HAS ALREADY RUN
    //resetProject(), SO THE ONLY SYMPTOM WAS A BLANK CANVAS WITH NOTHING LOGGED.
    //SAY WHAT WAS WRONG AND HAND THE CALLER A FALSE IT CAN ACT ON.
    if(uuidSplitter.length != 36) {
        return false;
    }

    let data = file.split(uuidSplitter);

    /////////STARTS AT A=1 SINCE A=0 IS " "
    for(let a = 1; a <= data.length; a++) {

        if(data[a] != null && data[a].trim() != "") {

            data[a] = data[a].trim();

            ////////////////////////////OPENING HISTORY///////////////////
            if(data[a].includes('History*')) {

                //THE FILE SENTINEL FROM `uuidSplitter + '*\n'` IS GLUED TO THIS ONE SECTION, SO THE
                //CHUNK ALWAYS ARRIVES AS "*\nHistory*...". REMOVING ONLY THE HEADER LEFT A BARE "*"
                //WELDED TO THE FRONT OF THE FIRST ENTRY - "*\n\nModified*..." - AND EVERY UNDO
                //HANDLER DOES history[h].trim().split('*') AND INDEXES THE PARTS, SO THAT ONE STEP
                //READ EVERY BLOCK ONE SLOT OFF. WITH NO ENTRIES AT ALL THE "*" BECAME AN ENTRY OF
                //ITS OWN: h = 1, history[1] = "*", A PHANTOM UNDO STEP THAT UNDID NOTHING. A SAVE
                //WITH THE SWITCH OFF IS EXACTLY THAT EMPTY CASE, SO THE TWO SHIP TOGETHER.
                //THE SECOND replace IS THE FALLBACK FOR ANY SHAPE THE FIRST DOES NOT MATCH
                data[a] = data[a].replace('*\nHistory*', '').replace('History*', '');

                uploadHistory = data[a];
                useHistory();
            
            }
            ////////////////////////////OPENING REDO///////////////////
            else if(data[a].includes('Redo*')) {
                data[a] = data[a].replace('Redo*', '');

                uploadRedo = data[a];
                useRedo();
            }
            else if(data[a].includes('embedFonts*')) {
                data[a] = data[a].replace('embedFonts*', '');

                uploadFonts = data[a];
                useEmbedFonts();
            }

            ////////////////////////////OPENING restoreThumb///////////////////
            else if(data[a].includes('restoreThumb*')) {
                data[a] = data[a].replace('restoreThumb*', '');

                uploadRestoreThumb = data[a];
                useRestoreThumb();
            }
            ////////////////////////////OPENING restorePanel///////////////////
            else if(data[a].includes('restorePanel*')) {
                data[a] = data[a].replace('restorePanel*', '');

                uploadRestorePanel = data[a];
                useRestorePanel();
            }
            ////////////////////////////OPENING restoreCanvas///////////////////
            else if(data[a].includes('restoreCanvas*')) {
                data[a] = data[a].replace('restoreCanvas*', '');

                uploadRestoreCanvas = data[a];
                useRestoreCanvas();
            }
            ////////////////////////////OPENING restorePin///////////////////
            else if(data[a].includes('restorePin*')) {
                data[a] = data[a].replace('restorePin*', '');

                uploadRestorePin = data[a];
                useRestorePin();
            }
            ////////////////////LOAD THUMBS/////////////////
            else if(data[a].includes('<div id="configContainer"')) {

                configScroll[2].innerHTML = purifyHTML(data[a]);
            }

            ////////////////////LOAD PNLBOXPATTERNS OR PNLBOXLAYERS/////////////////
            else if(data[a].includes('<div class="pnlBox')) {
                
                configScroll[5].innerHTML = purifyHTML(data[a]);
            }

            ////////////////////LOAD CANVAS MAIN/////////////////
            else if(data[a].includes('<div id="cnvBoxScaler"')) {

                //THIS IS THE LAST IN THE WONDR FORMAT
                useData();
                canvasBorder.innerHTML =  purifyHTML(data[a]);
                normalizeLayerFloors();
                getMaxF();
                //THE 3D ENVIRONMENT AND MOCKUPS REBUILD IN THE BACKGROUND - KEPT SO THE END OF THIS
                //FUNCTION CAN WAIT FOR IT
                rebuild3D = addListeners();
                updatePnlBoxCanvas();
                rebuildMoveable();

                //THE FILE BRINGS BACK THE CANVAS SCALE IT WAS SAVED AT. THE ZOOM IS RE-APPLIED SO THE CANVAS, THE PINS AND THE
                //BLEED ALL FOLLOW THE SLIDER AGAIN. containWorkArea ENDS WITH adjustBorder, updateMoveableRect AND bleedFillLayers
                containWorkArea();

            }

            ////////////////////LOAD ALL DATA[F]/////////////////
            else {
                //THIS IS NOT THE LAST IN THE WONDR FORMAT
                //BUT SINCE THERE ARE LOTS OF PNLBOXES
                //WE PUT THIS IN 'ELSE'
                uploadData += data[a] + '*';
            }  
        }
    }

    //[!] OPENING A FILE REPLAYS THE EVENT LOG SO h JUMPS 0 -> N WHILE tempH IS STILL 0.
    //[!] THE NEXT AUTOSAVE TICK WOULD CREDIT N MOVEMENTS, TRIP THE BURST BRANCH AND
    //[!] RE-UPLOAD THE FILE THAT WAS JUST OPENED, UNCHANGED. THIS HAS TO SIT AT THE END -
    //[!] useHistory() SETS h EARLIER INSIDE THIS FUNCTION.
    tempH = h;

    //THE GOOGLE LINKS ARE display=swap, SO WITHOUT THIS THE COVER LIFTED ON THE FALLBACK FONT
    //AND EVERY TEXT, OUTLINE AND SHADOW SWAPPED IN FRONT OF THE USER. ALL THREE CALLERS AWAIT
    //THIS FUNCTION BEFORE hideLoading(), SO WAITING HERE COVERS TEMPLATE, LOCAL FILE AND RESTORE
    //sir, 2026-10-13: THE REBUILD'S OWN hideLoading() HAD NO showLoading() - IT RELEASED THE
    //CALLER'S COUNT AND LIFTED THE COVER ~400ms IN, BEFORE THE FONTS. THE COVER IS THE CALLER'S
    //NOW, SO WAIT HERE. A FAILED BUILD IS CAUGHT AND A HUNG ONE LET GO AT 10s, SO THE LOADER
    //CANNOT STICK
    if(rebuild3D != null) await Promise.race([rebuild3D.catch(() => {}), new Promise(resolve => setTimeout(resolve, 10000))]);

    await waitForFileFonts();

    return true;
}

//EVERY STYLESHEET, THEN EVERY TEXT LAYER'S EXACT FACE AND TEXT, THEN A RE-FIT SO THE BOXES MATCH
//THE REAL FONT, THEN TWO FRAMES SO THE FIRST FRAME UNDER THE COVER IS ALREADY RIGHT. CAPPED AT
//4s: A BROKEN OR OFFLINE FONT SHOWS THE FALLBACK INSTEAD OF A STUCK LOADER. A FACE ALREADY IN
//THE CACHE RESOLVES AT ONCE, SO REOPENING A FILE COSTS NOTHING
async function waitForFileFonts() {

    let links = fileFontLinks;
    fileFontLinks = [];

    let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let settle = (async () => {

        await Promise.allSettled(links);

        let layers = [...document.getElementById('cnvGrpLayers').querySelectorAll('.cnvLayers[data-type="text"]')];
        let loads = [];

        //EVERY CHILD: THE OUTLINE COPY CARRIES THE SAME FACE BUT IS ITS OWN TEXT NODE
        layers.forEach((canvas) => {
            for(let a = 0; a < canvas.childElementCount; a++) {
                let child = canvas.children[a];
                let cs = getComputedStyle(child);
                let family = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
                let face = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) || 48}px "${family}"`;
                loads.push(document.fonts.load(face, child.innerText || ' '));
            }
        });

        await Promise.allSettled(loads);
        await document.fonts.ready;

        layers.forEach((canvas) => {
            if(canvas.isConnected && canvas.childElementCount > 0) adjustTextArea(Number(canvas.dataset.ref));
        });

        adjustBorder();

        //A HIDDEN TAB NEVER PAINTS, SO THE FRAMES ARE CAPPED TOO
        await Promise.race([new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))), wait(100)]);
    })();

    await Promise.race([settle.catch(() => {}), wait(4000)]);
}

//sir, 2026-09-27: "make 20px on screen but min in design and in datalayer and in pnlbox input
//values". EVERY LAYER USED TO BE BUILT WITH AN INLINE 20px min-width/min-height AND THAT INLINE
//STYLE IS SAVED WITH THE LAYER, SO A FILE OR AUTOSAVE MADE BEFORE THE 1px FLOOR WOULD KEEP
//CLAMPING AT 20. BROUGHT DOWN ON OPEN. A LINE'S min-width IS ITS HEAD PAIR AND ITS min-height
//IS ITS STROKE - REAL GEOMETRY, NOT THE OLD CONSTANT - SO LINES ARE LEFT ALONE
function normalizeLayerFloors() {

    document.getElementById('cnvGrpLayers').querySelectorAll('.cnvLayers').forEach((canvas) => {

        if(canvas.dataset.type == "line") return;

        canvas.style.minWidth = 1 + 'px';
        canvas.style.minHeight = 1 + 'px';
    });
}

///////////////////////////////////////ACTUAL DOWNLOAD THE FILE//////////////////////
let fileHandle;
async function fileSystemAccessApi(blob) {

    let txtProjectTitle = document.getElementById('txtProjectTitle');

    try {
        if (!fileHandle) {
            // First time: Show save dialog
            fileHandle = await window.showSaveFilePicker({
            suggestedName: `${txtProjectTitle.value}.wdr`,
            types: [
                {
                description: "Wondr File",
                accept: { "application/x-wondr": [".wdr"] },
                },
            ],
            });
        }

        const writable = await fileHandle.createWritable();
        await writable.write(blob); // data can be a Blob, string, etc.
        await writable.close();

        //txtProjectTitle.value = fileHandle.name.replaceAll('.wdr', '');
        dataTitle = valueSwitcher(dataTitle, "title", txtProjectTitle.value);
    }
    catch {
        //JUST BLANK ONLY IF THE PROMISE IS UNFULFILLED
        //TO AVOID CONSOLE ERROR MESSAGE
    }
}

//////////////////////////////////////DECIDE HOW TO SAVE THE FILE//////////////////////
async function decideHowToDownload() {

    //THE ONLY CALLER THAT ASKS THE SWITCH. OFF BY DEFAULT, SO A SAVED .wdr CARRIES NO UNDO
    //STEPS UNLESS THE USER TURNED IT ON FOR THIS SAVE
    let content = compileContent(valueFinder(dataSave, 'chkIncludeHistory') == "true");

    showLoading();

    let file = await encryptSignContent(content);

    if(file == null) {

        hideLoading();

        let title = "Something went wrong";
        let message = "We are unable to process your request this time. Please check your connection and try again.";

        showModal(title, message, "Close", null, 25);

        document.getElementById('btnModalClose').addEventListener('click', e => {
            hideModal()
        })

        return;
    }

    //THE SAVE IS A TEXT FILE. NO THUMBNAIL MEANS NO SNAPDOM RENDER AND NO BABYLON
    //SCREENSHOT OF THE ENVIRONMENT OR OF EVERY 3D MOCKUP, WHICH IS THE WHOLE COST
    let txtProjectTitle = document.querySelector('#txtProjectTitle');
    let filename;
    txtProjectTitle.value.trim().length == 0? filename = 'Untitled': filename = txtProjectTitle.value;

    let link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([file]));
    link.download = `${filename}.wdr`;
    link.click();
    link.remove();

    hideLoading();
}
document.getElementById('btnSave').addEventListener('click', decideHowToDownload)

////////////////////////////OPEN FILE////////////////////////
function openFile() {

    let inputFile = document.createElement('input');
    inputFile.type = "file";
    inputFile.accept =".wdr";
    inputFile.click();

    inputFile.onchange = async function() { 

        //instant. sir, 2026-09-27: "it should exempt the import file since the file is local and
        //it should be no delay". LOADING_DELAY IS THERE SO A FAST NETWORK CALL SHOWS NOTHING - A
        //FILE OPEN IS NEVER THAT FAST, AND THE PARSE BELOW HOLDS THE MAIN THREAD, SO THE DELAYED
        //PAINT WAITED FOR IT. ONE FRAME IS YIELDED SO THE COVER IS ON SCREEN BEFORE ANY WORK
        showLoading(true);
        //FOLLOW UP SET TIMEOUT FO AVOID OVERLAPPING RESULT VS LOADING

        await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
 
        let reader = new FileReader(); //create a file reader to read the format
        reader.readAsText(inputFile.files[0]); //read the file as text since it's SVG
        reader.onload = async function() {

            let file = await verifyWondrFile(reader.result);
            
            if(file != null) {
                resetProject();
                await loadWondrFile(file);
                clearAutosave();

                //verifyWondrFile RELEASES THE COUNTER ON ITS FAILURE PATHS ONLY, SO
                //THE SUCCESS PATH HAS TO RELEASE IT HERE OR activeAsync NEVER RETURNS
                //TO ZERO AND THE OVERLAY STICKS LATER IN THE SESSION.
                hideLoading();
            }
        }

    }
}
document.getElementById('btnUploadFile').addEventListener('click', openFile);


function resetProject()  {
    
    let cnvPin = document.getElementById('cnvPin');
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');
    let configScroll = document.getElementsByClassName('configScroll');

    resetAllHistory();
    resetAllFocus();
    resetAllData();

    cnvGrpLayers.innerHTML = "";

    //PINS LIVE IN A SEPARATE TREE AND WERE NEVER CLEARED HERE.
    //cnvGrpLayers WAS EMPTIED, cnvPin WAS NOT - ONLY #selectPin WAS SWAPPED - SO EVERY
    //pinBody FROM THE PREVIOUS PROJECT SURVIVED. 8 LAYERS + NEW + 8 LAYERS = 16 PINS,
    //AND compileContent() CLONES THE PIN TREE, SO THE ORPHANS WERE SAVED INTO THE .wdr.
    cnvPin.querySelectorAll('.pinBody').forEach(p => p.remove());
    pinBody.length = 0;

    document.querySelector('#selectPin')?.remove();
    cnvPin.insertAdjacentHTML('afterbegin', `<div id="selectPin"></div>`);

    configScroll[2].children[0].children[0].innerHTML = "";
    configScroll[5].innerHTML = "";
    
    h = 0;
    rh = 0;
    maxF = 0;
}

////////////////////////////USE HISTORY////////////////////
function useHistory() {
    
    if(uploadHistory != null) {

        let partHistory = uploadHistory.trim().split('~');

        //SKIP B = 0 SINCE UNDO AND REDO BASED ON HISTORY H > 0
        //SO START ASSIGNING NEW HISTORY TO HISTORY[1]
     
        for(let b = 0; b < partHistory.length; b++) {

            if(partHistory[b] != null && partHistory[b].trim() != "") {
                
                partHistory[b] = partHistory[b].trim();

                if(b < maxH) {

                    h++;
                    history[h] = partHistory[b]
                
                }
                //ELSE
                else {
                    
                    for(let a = 1; a <= maxH; a++) {

                        if(history[a+1] != null) {

                            //GET F AND LAYERS RELATED TO CURRENT HISTORY TO BE DELETED
                            let f = valueFinder(history[a], 'ref');
                            let layer = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                            
                            //IF NO MORE LAYER OR PATTERN EXISTS WITH REF SIMILAR TO HISTORY[A]
                            //DELETE ALL DATA[F]
                            
                            if(layer == null) {
                                dataLayer[f] = null;
                                data3D[f] = null;
                                dataPattern[f] = null;
                            }
                            
                            history[a] = history[a+1];
                            
                        }
                        else {

                            history[a] = tempHistory;
                            h = a;
                        }
                    }
                }

            }
        }
    }
}

////////////////////////////USE REDO///////////////////////
function useRedo() {

    if(uploadRedo != null) {
        let partHistory = uploadRedo.trim().split('~');
                
        for(let b = 0; b < partHistory.length; b++) {

            if(partHistory[b] != null && partHistory[b].trim() != "") {
                
                partHistory[b] = partHistory[b].trim();

                rh = b + 1;
                redoHistory[rh] = partHistory[b];
                
            }
        }

        uploadRedo = null;

    }
}

function useRestoreThumb() {

    if(uploadRestoreThumb != null) {

        let partHistory = uploadRestoreThumb.trim().split('~');
                
        for(let b = 0; b < partHistory.length; b++) {

            if(partHistory[b] != null && partHistory[b].trim() != "") {
                
                partHistory[b] = partHistory[b].trim();

                let n = partHistory[b].match(/data-thumbno="(.*?)"/);

                if(n != null) restoreThumb[n[1]] = purifyHTML(partHistory[b]);
            }
        }

        uploadRestoreThumb = null;
    }
}

function useEmbedFonts() {

    if(uploadFonts != null) {

        let partHistory = uploadFonts.trim().split('~');
                
        for(let b = 0; b < partHistory.length; b++) {

            if(partHistory[b] != null && partHistory[b].trim() != "") {
                
                partHistory[b] = partHistory[b].trim();

                //THE FILE IS UNTRUSTED - ONLY GOOGLE FONTS MAY BE APPENDED TO document.head
                if(!partHistory[b].startsWith('https://fonts.googleapis.com/') || partHistory[b].includes('"')) continue;

                let fontLink = document.head.querySelector(`link[href*="${partHistory[b]}"]`);
                
                if(fontLink == null) {

                    let link = document.createElement('link');
                    
                    link.href = partHistory[b];
                    link.rel = "stylesheet";
                    link.setAttribute('crossorigin', '');

                    //SET BEFORE appendChild SO A CACHED SHEET CANNOT FIRE load FIRST. error TOO -
                    //A DEAD URL MUST NOT HOLD THE LOADER
                    fileFontLinks.push(new Promise(resolve => { link.onload = resolve; link.onerror = resolve; }));

                    document.head.appendChild(link)
                }
                //ALREADY IN THE HEAD BUT MAYBE STILL ON ITS WAY - A sheet MEANS IT HAS ARRIVED
                else if(fontLink.sheet == null) {
                    fileFontLinks.push(new Promise(resolve => {
                        fontLink.addEventListener('load', resolve, { once: true });
                        fontLink.addEventListener('error', resolve, { once: true });
                    }));
                }

            }
        }

        uploadFonts = null;
    }
}

function useRestorePanel() {

    if(uploadRestorePanel != null) {

        let partHistory = uploadRestorePanel.trim().split('~');
                
        for(let b = 0; b < partHistory.length; b++) {

            if(partHistory[b] != null && partHistory[b].trim() != "") {
                
                partHistory[b] = partHistory[b].trim();

                let f = partHistory[b].match(/data-ref="(.*?)"/);

                if(f != null) restorePanel[f[1]] = purifyHTML(partHistory[b]);
            }
        }
        
        uploadRestorePanel = null;
    }
}

function useRestoreCanvas() {

    if(uploadRestoreCanvas != null) {

        let partHistory = uploadRestoreCanvas.trim().split('~');
                
        for(let b = 0; b < partHistory.length; b++) {

            if(partHistory[b] != null && partHistory[b].trim() != "") {
                
                partHistory[b] = partHistory[b].trim();

                let f = partHistory[b].match(/data-ref="(.*?)"/);

                if(f != null) restoreCanvas[f[1]] = purifyHTML(partHistory[b]);
            }
        }
        
        uploadRestoreCanvas = null;
    }
}

function useRestorePin() {

    if(uploadRestorePin != null) {

        let partHistory = uploadRestorePin.trim().split('~');
                
        for(let b = 0; b < partHistory.length; b++) {

            if(partHistory[b] != null && partHistory[b].trim() != "") {
                
                partHistory[b] = partHistory[b].trim();

                let f = partHistory[b].match(/data-ref="(.*?)"/);
                let type = partHistory[b].match(/data-type="(.*?)"/);

                if(f != null && type != null && type[1] != 'pattern') {
                    restorePin[f[1]] = purifyHTML(partHistory[b]);
                }
                
            }
        }
        
        uploadRestorePin = null;
    }
}

function useData() {
    
    if(uploadData != null) {

        let partData = uploadData.trim().split('*');

        for(let a = partData.length-1; a > 0; a--) {

            if(partData[a] != null && partData[a].trim() != "") {
                
                if(partData[a].includes('pnlBoxCanvas: Canvas')) {
    
                    dataCanvas = 'Default*' + partData[a];
                    dataCanvas = checkDataUpdate(dataCanvas);
                }   

                else if(partData[a].includes('pnlBoxPattern:')) {
                    let f = valueFinder(partData[a], "ref");
                    dataPattern[f] = '*' + partData[a];

                    dataPattern[f] = checkDataUpdate(dataPattern[f]);
                }

                //PART DATA FOR 
                else if(partData[a].includes(`pnlBoxThumb:`)) {
                    let n = valueFinder(partData[a], "thumbno");
                    dataThumb[n] = partData[a];

                }

                else if(partData[a].includes('pnlBox3DEnvironment:')) {

                    dataEnv = '\n*\n' + partData[a];
                    dataEnv = checkDataUpdate(dataEnv);
                }
                
                //PART DATA IS FOR DATA3D
                else if(partData[a].includes(`{"ref":`)) {

                    let data = JSON.parse(partData[a]);
                    let f = data.ref;
                    data3D[f] = data;
                }

                //PART DATA IS FOR CHKMODE
                else if(partData[a].includes(`chkMode:`)) {
                    dataMode = '\n*\n' + partData[a];
                }

                else if(partData[a].includes(`title:`)) {
                    txtProjectTitle.value = purifyTitle(valueFinder(partData[a], "title"));
                    //[!] dataTitle CANNOT KEEP THE RAW CHUNK OR IT DESYNCS FROM THE INPUT
                    dataTitle = valueSwitcher('\n*\n' + partData[a], "title", txtProjectTitle.value);
                }

                else {

                    let f = valueFinder(partData[a], "ref");
                    dataLayer[f] = '*' + partData[a];

                    dataLayer[f] = checkDataUpdate(dataLayer[f]);
                }
            }
        }
    }
}

function checkDataUpdate(data) {

    let tempHistory = "";
    let type = "";
    let values = data.split('\n');

    //GET TYPE OF DATA
    for(let a = 0; a < values.length; a++) {
        if(values[a].includes('pnlBox')) {
            type = values[a].split(': ')[0].replace('pnlBox', '').toLowerCase();
        }
    }

    if(type == "canvas") { 

        tempHistory = 'Default*';
        tempHistory += `\npnlBoxCanvas: Canvas`;
        tempHistory += `\ntxtSizeWidth: 1080`;
        tempHistory += `\ntxtSizeHeight: 1080`;
        tempHistory += `\ntxtBackgroundColor: rgba(255, 255, 255, 1)`;
        tempHistory += `\nchkLockAspectRatio: false`;

        tempHistory += `\ndropdown 0: Resize to Center`;
    }
    else if(type == "3denvironment") { 

        tempHistory = `*`;
        tempHistory += `\npnlBox3DEnvironment: Environment`;
        tempHistory += `\nchkFilmic: false`;
        tempHistory += `\ntxtEnvBlur: 0`;
        tempHistory += `\ntxtEnvRotation: 0`;
        tempHistory += `\ntxtEnvExposure: 100`;
        tempHistory += `\ndropdown 0: Indoor White Light`;
    }
    else if(type == "pattern") {

        tempHistory = 'Created*';
        tempHistory += `\nref: `;
        tempHistory += `\npnlBoxPattern: `;
        tempHistory += `\nid: `;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;
        
        tempHistory += `\ntxtXPattern: 0`;
        tempHistory += `\ntxtYPattern: 0`;
        tempHistory += `\ntxtSizePattern: 60`;
        tempHistory += `\ntxtOpacityPattern: 100`;
        tempHistory += `\ntxtRotationPattern: 0`;
        tempHistory += `\ntxtRandomSpinPattern: 0`;
        
        tempHistory += `\ntxtColorPattern: rgba(148, 158, 255, 1)`;
        tempHistory += `\ntxtStrokeWidthPattern: 2`;
        tempHistory += `\ntxtScalingPattern: 3`;
        tempHistory += `\ntxtSpacingPattern: 0`;
        tempHistory += `\nchkRandomSeed: false`;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Stroke`;
        
    }

    else if(type == "image") {

        tempHistory = 'Created*';
        tempHistory += `\nref: `;
        tempHistory += `\npnlBoxImage: `;
        tempHistory += `\nthumbno: `;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;
        tempHistory += `\ntxtWidthLayer: `;
        tempHistory += `\ntxtHeightLayer: `;
        tempHistory += `\ntxtXLayer: `;
        tempHistory += `\ntxtYLayer: `;
        tempHistory += `\nchkFlipX: false`;
        tempHistory += `\nchkFlipY: false`;
        tempHistory += `\ntxtOpacityLayer: 100`;
        tempHistory += `\ntxtRotationLayer: 0`;

        tempHistory += `\ntxtBlur: 0`;
        tempHistory += `\ntxtBrightness: 100`;
        tempHistory += `\ntxtContrast: 100`;
        tempHistory += `\ntxtSaturation: 100`;

        tempHistory += `\ntxtOutlineColor: rgba(0, 0, 0, 1)`;
        tempHistory += `\ntxtOutlineSize: 10`;

        tempHistory += `\ntxtGlowColor: rgba(148, 158, 255, 1)`;
        tempHistory += `\ntxtGlowSpread: 100`;

        tempHistory += `\ntxtShadowColor: rgba(0, 0, 0, 1)`;
        tempHistory += `\ntxtShadowSize: 20`;
        tempHistory += `\ntxtShadowSpread: 0`;
        tempHistory += `\ntxtShadowRotation: 0`;
        tempHistory += '\nnewImageSource: ';

        //THE SWAP BUTTON'S CAPTION AND THE PEXELS REFERENCE - ADDED 2026-09-24 WITH THE IMAGE
        //SWAP BUTTON. A LAYER RESTORED FROM AN OLDER FILE HAS NEITHER, AND imageLabelOf FALLS
        //BACK TO THE PANEL'S LAYER NAME, SO AN OLD FILE STILL CAPTIONS CORRECTLY
        tempHistory += `\nfilename: `;
        tempHistory += `\nimageLink: `;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Remove`;

    }

    else if(type == "line") {

        tempHistory = 'Created*';
        tempHistory += `\nref: `;
        tempHistory += `\npnlBoxLine: `;
        tempHistory += `\nthumbno: `;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;

        tempHistory += `\ntxtWidthLayer: `;
        tempHistory += `\ntxtHeightLayer: `;
        tempHistory += `\ntxtXLayer: `;
        tempHistory += `\ntxtYLayer: `;
        tempHistory += `\nchkFlipX: false`;
        tempHistory += `\nchkFlipY: false`;
        tempHistory += `\ntxtOpacityLayer: 100`;
        tempHistory += `\ntxtRotationLayer: 0`;
     
        tempHistory += `\ntxtLineStrokeColor: rgba(100, 116, 153, 1)`;
        tempHistory += `\ntxtLineStrokeWidth: 10`;
        tempHistory += `\ntxtLineStrokeDash: 0`;
        tempHistory += `\ntxtLineStrokeGap: 0`;
        tempHistory += `\nchkLineStrokeCap: false`;

        tempHistory += `\ntxtGlowColor: rgba(148, 158, 255, 1)`;
        tempHistory += `\ntxtGlowSpread: 100`;

        tempHistory += `\ntxtShadowColor: rgba(0, 0, 0, 1)`;
        tempHistory += `\ntxtShadowSize: 20`;
        tempHistory += `\ntxtShadowSpread: 0`;
        tempHistory += `\ntxtShadowRotation: 0`;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdownLineStart 0: line miter`;
        tempHistory += `\ndropdownLineEnd 0: line miter`;
        tempHistory += `\ndropdown 1: Remove`;

    }

    else if(type == "vector") {

        tempHistory = 'Created*';
        tempHistory += `\nref: `;
        tempHistory += `\npnlBoxVector: `;
        tempHistory += `\nthumbno: `;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;
        
        tempHistory += `\ntxtWidthLayer: `;
        tempHistory += `\ntxtHeightLayer: `;
        tempHistory += `\ntxtXLayer: `;
        tempHistory += `\ntxtYLayer: `;
        tempHistory += `\nchkFlipX: false`;
        tempHistory += `\nchkFlipY: false`;
        tempHistory += `\ntxtOpacityLayer: 100`;
        tempHistory += `\ntxtRotationLayer: 0`;

        tempHistory += `\ntxtSubLayer: 0`;
        tempHistory += `\ntxtVectorStrokeColor: rgba(0, 0, 0, 1)`;
        tempHistory += `\ntxtVectorFillColor: rgba(0, 0, 0, 1)`;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Stroke`;

    }
    
    else if(type == "element") {

        tempHistory = 'Created*';
        tempHistory += `\nref: `;
        tempHistory += `\npnlBoxElement: `;
        tempHistory += `\nthumbno: `;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;

        tempHistory += `\ntxtWidthLayer: `;
        tempHistory += `\ntxtHeightLayer: `;
        tempHistory += `\ntxtXLayer: `;
        tempHistory += `\ntxtYLayer: `;
        tempHistory += `\nchkFlipX: false`;
        tempHistory += `\nchkFlipY: false`;
        tempHistory += `\ntxtOpacityLayer: 100`;
        tempHistory += `\ntxtRotationLayer: 0`;

        tempHistory += `\ntxtElementStrokeColor: rgba(100, 116, 153, 1)`;
        tempHistory += `\ntxtElementStrokeWidth: 20`;
        tempHistory += `\ntxtElementCornerRadius: 0`;
        tempHistory += `\ntxtElementStrokeDash: 0`;
        tempHistory += `\ntxtElementStrokeGap: 0`;
        tempHistory += `\nchkElementStrokeCap: false`;

        tempHistory += `\ntxtElementFillColor: rgba(169, 174, 255, 1)`;

        tempHistory += `\ntxtGlowColor: rgba(148, 158, 255, 1)`;
        tempHistory += `\ntxtGlowSpread: 100`;

        tempHistory += `\ntxtShadowColor: rgba(0, 0, 0, 1)`;
        tempHistory += `\ntxtShadowSize: 20`;
        tempHistory += `\ntxtShadowSpread: 0`;
        tempHistory += `\ntxtShadowRotation: 0`;
        
        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Stroke`;
        tempHistory += `\ndropdown 2: Remove`;
        
    }

    else if(type == "3DMockup") {

        tempHistory = 'Created*';
        tempHistory += `\nref: `;
        tempHistory += `\npnlBox3DMockup: `;
        tempHistory += `\nthumbno: `;
        tempHistory += `\nid: `;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;

        tempHistory += `\ntxtWidthLayer: `;
        tempHistory += `\ntxtHeightLayer: `;
        tempHistory += `\ntxtXLayer: `;
        tempHistory += `\ntxtYLayer: `;
        tempHistory += `\nchkFlipX: false`;
        tempHistory += `\nchkFlipY: false`;
        tempHistory += `\ntxtOpacityLayer: 100`;
        tempHistory += `\ntxtRotationLayer: 0`;

        tempHistory += `\ntxtColorDiffuse: rgba(255, 255, 255, 1)`;
        tempHistory += `\ntxtXRotation: 0`;
        tempHistory += `\ntxtYRotation: 0`;
        tempHistory += `\ntxtZRotation: 0`;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Front`;
        tempHistory += `\ndropdown 2: Remove Mockup`;

    }

    else if(type == "text") {

        tempHistory = 'Created*';
        tempHistory += `\nref: `;
        tempHistory += `\npnlBoxText: `;
        tempHistory += `\nfontName: `;
        tempHistory += `\nfontClass: `;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;
        
        tempHistory += `\ntxtWidthLayer: `;
        tempHistory += `\ntxtHeightLayer: `;
        tempHistory += `\ntxtXLayer: `;
        tempHistory += `\ntxtYLayer: `;
        tempHistory += `\nchkFlipX: false`;
        tempHistory += `\nchkFlipY: false`;
        tempHistory += `\ntxtOpacityLayer: 100`;
        tempHistory += `\ntxtRotationLayer: 0`;

        tempHistory += `\ntxtResizeText: 48`;
        tempHistory += `\ntxtTextColor: rgba(148, 158, 255, 1)`;
        tempHistory += `\ntxtLetterSpacing: 0`;
        tempHistory += `\ntxtLineHeight: Auto`;
        tempHistory += `\nselTextCase: `;
        tempHistory += `\nselTextResize: AutoWidth`;
        tempHistory += `\nselTextHori: AlignLeft`;
        tempHistory += `\nselTextVerti: AlignTop`;
  
        tempHistory += `\ntxtOutlineColor: rgba(104, 133, 204, 1)`;
        tempHistory += `\ntxtOutlineSize: 1`;

        tempHistory += `\ntxtGlowColor: rgba(104, 133, 204, 1)`;
        tempHistory += `\ntxtGlowSpread: 10`;

        tempHistory += `\ntxtShadowColor: rgba(0, 0, 0, 1)`;
        tempHistory += `\ntxtShadowSize: 20`;
        tempHistory += `\ntxtShadowSpread: 0`;
        tempHistory += `\ntxtShadowRotation: 0`;
        tempHistory += `\ninnerText: `;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Regular`;
        tempHistory += `\ndropdown 2: Remove`;

    }

    //CHECK TEMPHISTORY ON OLD DATA THEN ADD
    values = tempHistory.split('\n');

    for(let a = 0; a < values.length; a++) {
        
        let category = values[a].split(': ')[0];

        if(!category.includes('*')) {

            if(valueFinder(data, category) == null) {
                //ADD MISSING VALUES AND UPDATE THE DATA
                data = data.replace(data.charAt(data.length), '');
                data += '\n' + values[a];
            }
        }
    }

    return data;
}

/////////////////////////////LAST FUNCTIONS WHEN OPENING FILE///////////////////////////
function getMaxF() {

    let arr = [];

    let partData = uploadData.trim().split('*');

    for(let a = 0; a < partData.length; a++) {

        if(partData[a] != null && partData[a].trim() != "") {

            if(partData[a].includes('ref:')) {

                let f = valueFinder(partData[a], "ref");

                arr.push(Number(f))
            }
        }
    }

    uploadData = null;

    maxF = Math.max(...arr);

    //IF THERE'S NO DATA MAXF WILL BE INFINITE
    maxF == -Infinity? maxF = 0: maxF++;
}

function addListeners() {

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    document.querySelectorAll('.btnLockUnlock').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        //THE BEHAVIOUR IS ALREADY DELEGATED IN delegation.js. BINDING IT HERE TOO MADE ONE CLICK
        //RUN IT TWICE: THE FIRST CALL SWAPS THE ICON, THE CLICK REACHES THE DOCUMENT ON A DETACHED
        //<path> AND FALLS INTO resetAllFocus, AND UNDO'S btn.click() TOGGLED IT BACK. ONLY THE
        //ENCODER NEEDS BINDING HERE, BECAUSE IT HAS TO PAUSE AND RESUME
        //btn.addEventListener('click', lockUnlockLayers);
        btn.addEventListener('click', encodeLockUnlock);
    })

    document.querySelectorAll('.btnShowHide').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        //SAME REASON AS LOCK ABOVE
        //btn.addEventListener('click', showHideLayers);
        btn.addEventListener('click', encodeShowHide);
    })

    //RETURNED SO loadWondrFile CAN WAIT FOR IT - ITS ONLY CALLER
    return recreate3DEnvironment().then( async ()=> {

        //////////////////ACTIVATE CHKMODE AND SWITCH IF NECESSARY///////////////
        let value = valueFinder(dataMode, 'chkMode');
        let chkMode = document.getElementById('chkMode');
        
        if(value != chkMode.dataset.value) {
            pauseEncoding();
            chkMode.click();
            chkMode.dispatchEvent(new Event ('pointerleave'));
            resumeEncoding();
        }

        await recreateAll3DMockup();

        updatePnlBox3DEnvironment();

        //NO hideLoading() HERE - NOTHING IN THIS CHAIN CALLED showLoading(), SO IT RELEASED THE
        //FILE OPEN'S OWN COUNT AND LIFTED THE COVER EARLY. THE CALLER OF loadWondrFile LIFTS IT
        adjustBorder();

        //DELETE IF THERE'S EXISTING TABLE
        await caches.delete(`res_project`);

        swapPanels('canvas')
        /*
        console.clear();
        for(let a = 1; a < maxH; a++) {
        console.log(history[a], a)
        }
        console.log("--------REDO---------")
        for(let a = 1; a <= maxH; a++) {
        console.log(redoHistory[a], a)
        }
        */
    })
}

function updatePnlBoxCanvas() {

    pauseEncoding();

    let panel = document.getElementById(`pnlBoxCanvas`);

    if(valueFinder(dataCanvas, `txtBackgroundColor`).includes('gradient')) {
        showGradientInInput(panel.querySelector(`.txtBackgroundColor`), valueFinder(dataCanvas, `txtBackgroundColor`));
    }
    else {
        
        let hex = rgbaString2HexEncoding(valueFinder(dataCanvas, `txtBackgroundColor`));
        let alpha = alphaFinder(dataCanvas, 'txtBackgroundColor');
    
        panel.querySelector(`.txtBackgroundColor`).value = hex;
        panel.querySelector(`.txtBackgroundColor`).dataset.gradient = "";
        panel.querySelector(`.txtBackgroundColor`).dataset.alpha = alpha;
        panel.querySelector(`.txtBackgroundColor`).nextElementSibling.children[1].style.background = valueFinder(dataCanvas, `txtBackgroundColor`);
    }

    panel.querySelector(`.txtSizeWidth`).value = valueFinder(dataCanvas, `txtSizeWidth`);
    panel.querySelector(`.txtSizeHeight`).value = valueFinder(dataCanvas, `txtSizeHeight`);

    panel.querySelector(`.chkLockAspectRatio`).dataset.value = valueFinder(dataCanvas, `chkLockAspectRatio`);
    chkBoxFormat(panel.querySelector(`.chkLockAspectRatio`));

    resetOutputSize();

    panel.querySelectorAll(`.dropdown`)[0].children[0].innerText =  valueFinder(dataCanvas, `dropdown 0`);

    let options = panel.querySelectorAll(`.dropdown`)[0].nextElementSibling.querySelectorAll(`[class*="opt"]`);
    options.forEach(opt => {
        if(opt.innerText == valueFinder(dataCanvas, 'dropdown 0')) {
            opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: true}))
        }
    })

    resumeEncoding();
}

function updatePnlBox3DEnvironment() {

    pauseEncoding();

    let panel = document.getElementById(`pnlBox3DEnvironment`);

    panel.querySelector(`.txtEnvBlur`).value = valueFinder(dataEnv, `txtEnvBlur`);
    panel.querySelector(`.txtEnvBlur`).previousElementSibling.value = valueFinder(dataEnv, `txtEnvBlur`);

    panel.querySelector(`.txtEnvRotation`).value = valueFinder(dataEnv, `txtEnvRotation`);
    panel.querySelector(`.txtEnvRotation`).previousElementSibling.value = valueFinder(dataEnv, `txtEnvRotation`);

    panel.querySelector(`.txtEnvExposure`).value = valueFinder(dataEnv, `txtEnvExposure`);
    panel.querySelector(`.txtEnvExposure`).previousElementSibling.value = valueFinder(dataEnv, `txtEnvExposure`);

    panel.querySelector(`.chkFilmic`).dataset.value = valueFinder(dataEnv, `chkFilmic`);
    chkBoxFormat(panel.querySelector(`.chkFilmic`));

    panel.querySelectorAll(`.dropdown`)[0].dataset.default = valueFinder(dataEnv, `dropdown 0`);
    panel.querySelectorAll(`.dropdown`)[0].children[0].innerText = valueFinder(dataEnv, `dropdown 0`);

    //THE MOCKUP SCENES EXIST BY NOW AND recreate3DMockup LEAVES THEM ON THE CUBEMAP DEFAULT,
    //SO THESE FOUR PUSH THE FILE'S VALUES INTO EVERY scene[f] AS WELL AS sceneEnv
    change3DEnvironmentFilmic();
    adjust3DEnvironmentBlur();
    adjust3DEnvironmentRotation();
    adjust3DEnvironmentExposure();

    resumeEncoding();
}

//THE EXPORT SIZE IS ALWAYS THE CANVAS ASPECT RATIO, SO ONE FIELD DRIVES THE OTHER
function chooseOutputSize() {

    let panel = document.getElementById('pnlBoxSave');
    let w = Number(valueFinder(dataCanvas, 'txtSizeWidth'));
    let h = Number(valueFinder(dataCanvas, 'txtSizeHeight'));

    if(w < 1 || h < 1) return;

    if(this.className == "txtOutputWidth") {
        panel.querySelector('.txtOutputHeight').value = Math.round(Number(this.value) * h / w);
    }
    else {
        panel.querySelector('.txtOutputWidth').value = Math.round(Number(this.value) * w / h);
    }
}
document.querySelector('#menuSave').querySelector('.txtOutputWidth').addEventListener('input', chooseOutputSize);
document.querySelector('#menuSave').querySelector('.txtOutputHeight').addEventListener('input', chooseOutputSize);

//A NEW CANVAS SIZE RESETS THE EXPORT BACK TO 100 PERCENT OF IT
function resetOutputSize() {

    let panel = document.getElementById('pnlBoxSave');

    panel.querySelector('.txtOutputWidth').value = valueFinder(dataCanvas, 'txtSizeWidth');
    panel.querySelector('.txtOutputHeight').value = valueFinder(dataCanvas, 'txtSizeHeight');

    //NO CHANGE EVENT FIRES HERE SO NOTHING ENCODES, BUT dataSave MUST FOLLOW OR THE NEXT
    //DELIBERATE EDIT RECORDS ITS OLD VALUE FROM BEFORE THE CANVAS RESIZE
    dataSave = valueSwitcher(dataSave, 'txtOutputWidth', panel.querySelector('.txtOutputWidth').value);
    dataSave = valueSwitcher(dataSave, 'txtOutputHeight', panel.querySelector('.txtOutputHeight').value);
}

//=====================INCLUDE HISTORY - LIVE ONLY, NEVER COMPILED=====================
//sir, 2026-09-25: "if yes (chkbox) it will add history/undo/redo to the compilecontent but
//never add chkbox value to compilecontent since this is menuSave same as menuSettings".
//
//dataSave IS THE SAME SHAPE AS dataSettings AND compileContent() NEVER APPENDS IT, SO THE FLAG
//CANNOT REACH A .wdr. IT IS NOT BOUND TO encodeCheckboxMulti EITHER - THAT ENCODER ONLY BINDS
//INSIDE #propertiesBox AND #menuSettings - SO TICKING IT COSTS NO UNDO STEP.
//
//global.js BINDS chkBoxClick TO EVERY [class*=chk] AT LOAD AND IS LISTED BEFORE THIS FILE, SO
//dataset.value IS ALREADY FLIPPED WHEN THIS RUNS - IT READS THE NEW STATE, NOT THE OLD ONE.
function chkIncludeHistoryClick() {

    dataSave = valueSwitcher(dataSave, 'chkIncludeHistory', this.dataset.value);

    if(this.dataset.value == "true") {

        showModal("Export with history", "Including history steps will increase the file size but will still allow you to undo and redo changes when you open this project.", null, "Okay", 0);
        document.getElementById('btnModalOkay').addEventListener('click', e => hideModal());
    }
}
document.getElementById('pnlBoxSave').querySelector('.chkIncludeHistory').addEventListener('click', chkIncludeHistoryClick);




























////////////////////////////FUNCTIONS FOR PROJECT TITLE////////////////////
function purifyTitle(title) {

    let regex = /^[a-zA-Z0-9 _()\-]+$/;

    if(title == null || !regex.test(title.trim())) {
        return "Untitled";
    }
    return title.trim();
}

//EVERY HTML RECORD FROM A .wdr IS UNTRUSTED - SANITISE BEFORE IT REACHES THE DOM
let purifyConfig = {
    ADD_TAGS: ['use'],
    ADD_ATTR: ['vector-effect', 'stroke-dash', 'stroke-gap', 'touch-action'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'base', 'form', 'style'],
    FORBID_ATTR: ['srcdoc', 'formaction', 'ping', 'target']
};

//A PATTERN ONLY EVER REFERENCES ITS OWN SYMBOL - BLOCK EXTERNAL <use> FETCHES
DOMPurify.addHook('afterSanitizeAttributes', function(node) {

    if(node.nodeName.toLowerCase() != 'use') return;

    let ref = node.getAttribute('href') || node.getAttribute('xlink:href') || "";

    if(!ref.startsWith('#')) node.remove();
});

function purifyHTML(html) {

    if(html == null) return html;

    let clean = DOMPurify.sanitize(html, purifyConfig);

    //TUNING ONLY - DELETE THIS LINE ONCE THE ALLOWLIST IS CONFIRMED AGAINST REAL FILES
    if(DOMPurify.removed.length > 0) console.warn('purifyHTML removed', DOMPurify.removed);

    return clean;
}



/////////////////////////////FUNCTION FOR DOWNLOAD///////////////////////////

function convertEnvToImage() {

    //instant. THE DOWNLOAD IS LOCAL WORK THAT HOLDS THE MAIN THREAD, SO THE DELAYED PAINT
    //WAITED FOR IT. hideLoading STILL SERVES OUT LOADING_MIN, SO THE COVER LASTS ONE SECOND
    showLoading(true);
    
    let cnvEnv = document.getElementById('cnvEnv');
    let chkMode = document.getElementById('chkMode');

    if(chkMode.dataset.value == '3D') {
        BABYLON.Tools.CreateScreenshotUsingRenderTarget(engineEnv, cameraEnv, {precision: 1}, (dataUrl) => {
            let img = new Image();
            img.src = dataUrl;

            img.onload = function() {
                cnvEnv.querySelector('canvas').style.display = 'none';
                cnvEnv.appendChild(img)
                convertSceneToImage();
            }
        });
    }
    else {

        convertSceneToImage();
    }
   
}

function convertSceneToImage() {

    let min = 0;
    let max = 0;
    
    for(let f = 0; f < maxF; f++) {

        if(scene[f] != null) {

            max++;
        }   
    }

    if(max > 0) {
        for(let f = 0; f < maxF; f++) {

            if(scene[f] != null) { 

                BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine[f], camera[f], {precision: 1}, (dataUrl) => {
                
                    // Create a new image from the screenshot dataUrl
                    let img = new Image();
                    img.src = dataUrl;

                    img.onload = function() {

                        min++;

                        if(min == max) {
                            downloadFile();
                        }
                    
                    }
                });
            }
        }
    }
    else {
        downloadFile();
    }
}

async function downloadFile() {

    let cnvEnv = document.getElementById('cnvEnv');

    let txtProjectTitle = document.querySelector('#txtProjectTitle');
    let txtSizeWidth = document.querySelector('.txtSizeWidth');
    let txtSizeHeight = document.querySelector('.txtSizeHeight');
    //PNLBOXSAVE HOLDS TWO DROPDOWNS NOW, LOCATION IS [0] AND FORMAT IS [1]
    let pnlBoxSave = document.getElementById('pnlBoxSave');
    let drop = pnlBoxSave.querySelectorAll('.dropdown')[1].dataset.default.split(' ')[0];

    //THE CANVAS IS THE DOCUMENT SIZE, THE OUTPUT IS HOW MANY PIXELS GET RENDERED
    let txtOutputWidth = document.querySelector('.txtOutputWidth');
    let txtOutputHeight = document.querySelector('.txtOutputHeight');

    let canvasWidth = Number(txtSizeWidth.value);
    let canvasHeight = Number(txtSizeHeight.value);
    let outputWidth = Number(txtOutputWidth.value);
    let outputHeight = Number(txtOutputHeight.value);

    let filename;
    txtProjectTitle.value.trim().length == 0? filename = 'Untitled': filename = txtProjectTitle.value;

    //PDF WENT THROUGH toJpg, SO IT IS jpeg TOO. JPEG, WEBP AND PDF GET THE WHITE BACKGROUND snapdom GAVE THEM
    let type = drop == 'PNG'? 'png': drop == 'WEBP'? 'webp': 'jpeg';
    let extension = type == 'jpeg'? 'jpg': type;

    //A WHOLE MULTIPLE OF THE CANVAS, THEN ONE SHRINK. AT ANY OTHER SCALE A JOINT BETWEEN TWO LAYERS LANDS MID PIXEL AS A HAIRLINE
    let k = Math.max(1, Math.ceil(Math.max(outputWidth / canvasWidth, outputHeight / canvasHeight)));

    //SAME REASON AS THE SAVE PATH: THE RETRY OVERLAY MUST NOT BE RENDERED INTO THE
    //EXPORTED PICTURE. HIDDEN FOR THE SNAPSHOT AND PUT BACK IMMEDIATELY AFTER, SO THE
    //USER STILL SEES IT ON CANVAS AND CAN STILL CLICK IT
    let failed = cnvMain.querySelectorAll('[data-strip]');

    failed.forEach((box) => box.style.display = "none");

    let render;

    //A FONT NAME THAT MATCHES ITS @font-face ONLY WHEN CASE IS IGNORED (A LAYER SAVED AS "MS Madi", GOOGLE'S FAMILY IS "Ms Madi")
    //SHOWS LIVE, BECAUSE CSS IGNORES CASE, BUT snapdom EMBEDS BY THE EXACT NAME AND EXPORTED TIMES NEW ROMAN (MEASURED 2026-10-05).
    //THE LAYER TAKES THE EXACT FAMILY THROUGH applyFontToLayer, SO THE NEXT SAVE STORES THE RIGHT NAME TOO. SAME FACE, SAME BOX
    let families = [];
    document.fonts.forEach((face) => families.push(face.family.replace(/["']/g, '')));

    cnvGrpLayers.querySelectorAll('.cnvLayers[data-type="text"]').forEach((canvas) => {

        let font = canvas.dataset.font || "";
        let exact = families.find((family) => family.toLowerCase() == font.toLowerCase());

        if(exact != null && exact != font) {
            let f = Number(canvas.dataset.ref);
            applyFontToLayer(f, exact, canvas.dataset.class, valueFinder(dataLayer[f], 'dropdown 1'));
        }
    });

    //THE EXPORT RENDERS AT A WHOLE MULTIPLE OF THE CANVAS, SO ITS JOINTS ARE CRISP WITHOUT A BLEED
    bleedFillLayers(true);

    try {
        render = await snapdom.toCanvas(cnvMain, {fast: true, width: canvasWidth * k, height: canvasHeight * k, dpr: 1, backgroundColor: type == 'png'? null: '#ffffff', embedFonts: true});
    }
    finally {
        failed.forEach((box) => box.style.display = "flex");
        bleedFillLayers();
    }

    let output = document.createElement('canvas');
    output.width = outputWidth;
    output.height = outputHeight;

    let ctx = output.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(render, 0, 0, outputWidth, outputHeight);

    if(drop == 'PDF') {

        //ONLY THE RASTER TAKES THE OUTPUT SIZE. THE PAGE BELOW STAYS THE CANVAS SIZE,
        //SO A LARGER OUTPUT IS A SHARPER PAGE, NOT A BIGGER ONE
        let file = output.toDataURL('image/jpeg', 1);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            //orientation: orientation,
            unit: "px",
            format: [canvasWidth, canvasHeight]
            });
            
        doc.addImage(file, 'JPEG', 0, 0, canvasWidth, canvasHeight);

        doc.save(`${filename}.pdf`);
    }

    else {

        let link = document.createElement('a');
        link.href = output.toDataURL(`image/${type}`, 1);
        link.download = `${filename}.${extension}`;
        link.click();
        link.remove();
    }

    //ONLY THE PDF PATH TOOK THE 3D SCREENSHOT DOWN, SO PNG LEFT THE SCENE FROZEN AS A PICTURE
    let envShot = cnvEnv.querySelector('img');

    if(envShot != null) {
        envShot.remove();
        cnvEnv.querySelector('canvas').style.display = "block";
    }

    hideLoading();
}
document.getElementById('btnDownload').addEventListener('click', convertEnvToImage);


