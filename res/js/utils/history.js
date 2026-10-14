
let history = [];
let h = 0;
let maxH = 999;
let redoHistory = [];
let rh = 0;
let restoreThumb = [];
let restoreCanvas = [];
let restorePanel = [];
let restorePin = [];
//THE LAYERS UNDER A REMOVED LAYER, NEAREST FIRST, SO UNDO / REDO PUTS IT BACK IN ITS PLACE
let restoreBelow = [];

//================================CREATE HISTORY===========================

function createHistory(f, name, type, id, id2, fontCase) {

    let tempHistory = "";

    if(type == "pattern") {

        tempHistory = 'Created*';
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxPattern: ${name}`;
        tempHistory += `\nid: ${id}`;
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
        tempHistory += `\ndropdown 2: Default`;

        makeNewHistory(tempHistory)
    }

    else if(type == "image") {

        tempHistory = 'Created*';
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxImage: ${name}`;
        tempHistory += `\nthumbno: ${id}`;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;
        tempHistory += `\ntxtWidthLayer: ${cnvLayers[f].clientWidth}`;
        tempHistory += `\ntxtHeightLayer: ${cnvLayers[f].clientHeight}`;
        tempHistory += `\ntxtXLayer: ${cnvLayers[f].offsetLeft}`;
        tempHistory += `\ntxtYLayer: ${cnvLayers[f].offsetTop}`;
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

        //THE SWAP BUTTON'S CAPTION AND THE IMAGE'S REFERENCE, READ OFF THE LIVE LAYER.
        //redoCreate RESTORES dataLayer WHOLESALE FROM THIS RECORD, SO WRITING THEM EMPTY HERE
        //WOULD WIPE THE REFERENCE ON UNDO-CREATE THEN REDO-CREATE
        tempHistory += `\nfilename: ${valueFinder(dataLayer[f], 'filename') || ""}`;
        tempHistory += `\nimageLink: ${valueFinder(dataLayer[f], 'imageLink') || ""}`;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Remove`;

        makeNewHistory(tempHistory)

    }

    else if(type == "line") {

        tempHistory = 'Created*';
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxLine: ${name}`;
        tempHistory += `\nthumbno: ${id}`;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;

        tempHistory += `\ntxtWidthLayer: ${cnvLayers[f].clientWidth}`;
        tempHistory += `\ntxtHeightLayer: ${cnvLayers[f].clientHeight}`;
        tempHistory += `\ntxtXLayer: ${cnvLayers[f].offsetLeft}`;
        tempHistory += `\ntxtYLayer: ${cnvLayers[f].offsetTop}`;
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

        makeNewHistory(tempHistory)
    }

    else if(type == "vector") {

        tempHistory = 'Created*';
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxVector: ${name}`;
        tempHistory += `\nthumbno: ${id}`;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;
        
        tempHistory += `\ntxtWidthLayer: ${cnvLayers[f].clientWidth}`;
        tempHistory += `\ntxtHeightLayer: ${cnvLayers[f].clientHeight}`;
        tempHistory += `\ntxtXLayer: ${cnvLayers[f].offsetLeft}`;
        tempHistory += `\ntxtYLayer: ${cnvLayers[f].offsetTop}`;
        tempHistory += `\nchkFlipX: false`;
        tempHistory += `\nchkFlipY: false`;
        tempHistory += `\ntxtOpacityLayer: 100`;
        tempHistory += `\ntxtRotationLayer: 0`;

        tempHistory += `\ntxtSubLayer: 0`;
        tempHistory += `\ntxtVectorStrokeColor: rgba(0, 0, 0, 1)`;
        tempHistory += `\ntxtVectorFillColor: rgba(0, 0, 0, 1)`;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Stroke`;

        makeNewHistory(tempHistory)

    }
    
    else if(type == "element") {

        tempHistory = 'Created*';
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxElement: ${name}`;
        tempHistory += `\nthumbno: ${id}`;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;

        tempHistory += `\ntxtWidthLayer: ${cnvLayers[f].clientWidth}`;
        tempHistory += `\ntxtHeightLayer: ${cnvLayers[f].clientHeight}`;
        tempHistory += `\ntxtXLayer: ${cnvLayers[f].offsetLeft}`;
        tempHistory += `\ntxtYLayer: ${cnvLayers[f].offsetTop}`;
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

        makeNewHistory(tempHistory)
    }

    else if(type == "3DMockup") {

        tempHistory = 'Created*';
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBox3DMockup: ${name}`;
        tempHistory += `\nthumbno: ${id}`;
        tempHistory += `\nid: ${id2}`;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;

        tempHistory += `\ntxtWidthLayer: ${cnvLayers[f].clientWidth}`;
        tempHistory += `\ntxtHeightLayer: ${cnvLayers[f].clientHeight}`;
        tempHistory += `\ntxtXLayer: ${cnvLayers[f].offsetLeft}`;
        tempHistory += `\ntxtYLayer: ${cnvLayers[f].offsetTop}`;
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

        makeNewHistory(tempHistory)

    }

    else if(type == "text") {

        tempHistory = 'Created*';
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxText: ${name}`;
        tempHistory += `\nfontName: ${id}`;
        tempHistory += `\nfontClass: ${id2}`;
        tempHistory += `\nshow: visible`;
        tempHistory += `\nlock: unlock`;
        tempHistory += `\nmask: unmask`;
        
        tempHistory += `\ntxtWidthLayer: ${cnvLayers[f].clientWidth}`;
        tempHistory += `\ntxtHeightLayer: ${cnvLayers[f].clientHeight}`;
        tempHistory += `\ntxtXLayer: ${cnvLayers[f].offsetLeft}`;
        tempHistory += `\ntxtYLayer: ${cnvLayers[f].offsetTop}`;
        tempHistory += `\nchkFlipX: false`;
        tempHistory += `\nchkFlipY: false`;
        tempHistory += `\ntxtOpacityLayer: 100`;
        tempHistory += `\ntxtRotationLayer: 0`;

        tempHistory += `\ntxtResizeText: 48`;
        tempHistory += `\ntxtTextColor: rgba(148, 158, 255, 1)`;
        tempHistory += `\ntxtLetterSpacing: 0`;
        tempHistory += `\ntxtLineHeight: Auto`;
        tempHistory += `\nselTextCase: ${fontCase}`;
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
        tempHistory += `\ninnerText: ${encodeURIComponent(cnvLayers[f].children[0].textContent)}`;

        tempHistory += `\ndropdown 0: Normal`;
        tempHistory += `\ndropdown 1: Regular`;
        tempHistory += `\ndropdown 2: Remove`;

        makeNewHistory(tempHistory)

    }
    
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
        console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
        console.log(redoHistory[a])
    }
    */
}

//================================ENCODE CHANGES===========================

function valueSwitcher(text, category, key) {

    let result = '';

    let data = text.trim().split('\n');

    for(let a = 0; a < data.length; a++) {

        if(data[a].includes(category)) {
            data[a] = `${data[a].split(': ')[0]}: ${key}`;
        }

        result += '\n' + data[a]
    }

    return result;
}

function valueFinder(text, category) {

    let data = text.trim().split('\n');

    for(let a = 0; a < data.length; a++) {
        
        if(data[a].includes(category)) {

            //[!] slice NOT split(': ')[1] - split TRUNCATED ANY VALUE HOLDING ': ' AT THE
            //[!] SECOND COLON ("Ratio: 16 by 9" READ BACK AS "Ratio"). indexOf TAKES ONLY
            //[!] THE FIRST SEPARATOR. A LINE WITH NO ': ' MUST STILL YIELD undefined -
            //[!] checkDataUpdate TESTS valueFinder(...) == null TO DECIDE WHAT TO BACKFILL
            let value = data[a].includes(': ')? data[a].slice(data[a].indexOf(': ') + 2): undefined;
            
            return value;
        }
    }

}


function decodeText(text) {

    if(text == null) return text;

    try { return decodeURIComponent(text); }
    catch { return text; }
}

function alphaFinder(text, category) {

    let data = text.trim().split('\n');
 
    for(let a = 0; a < data.length; a++) {

        if(data[a].includes(category)) {

            let value = data[a].split(': ')[1];
            //AFTER GETTING THE CURRENT COLOR VALUE IN RGBA
            //REMOVE THE PREFIX 'RGBA('
            let splitRGBA = value.replace(')', '');
            //NOW SPLIT ALL REMAINING VALUES BY COMMA
            splitRGBA = splitRGBA.split(',');

            //REJOINED ONLY THE FIRST 3 VALUES SEPARATED BY COMMA R,G,B
            let alpha = splitRGBA[3].trim();

            return alpha;
        }
    }

}

function dataSwitcher(data, f, category, newKey) {
  
    for(let a = 0; a < data.length; a++) {
        if(data[a] != null) {
            if(data[a].includes(`ref: ${f}`)) {

                data[a] = valueSwitcher(data[a], category, newKey);
            }
        }
        
    }
}

async function makeNewHistory(tempHistory) {

    //IF H IS NOT YET LIMIT
    if(h < maxH) {

        h++;
        history[h] = tempHistory
    
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

    //[!] IMPORTANT IF NEW ACTION IS CREATED THAT IS NOT REDO
    //RESET ALL REDO
    //CHECK FIRST IF NEW HISTORY WILL AFFECT PENDING REDOS
    if(redoHistory[0] != null || redoHistory[0] != "" || redoHistory[0] !== undefined) {
        for(let a = 0; a < redoHistory.length; a++) {
            redoHistory[a] = "";
            redoHistory[a] = null;
            rh--;
        }
        rh = 0;
    }

    /*
    console.clear();
    for(let a = 1; a <= maxH; a++) {
       console.log(history[a], a)
    }
    console.log("--------REDO---------")
    for(let a = 1; a <= maxH; a++) {
       console.log(redoHistory[a], a)
    }
    */
}

async function historyToRedo() {

    if (h > 0) {
        rh++;
        redoHistory[rh] = history[h];
        history[h] = null;
        h--;
        
    }

    /*
    console.clear();
    for(let a = 1; a < maxH; a++) {
        if(history[a] != null || history[a] != undefined) console.log(history[a], a)
    }
    console.log("--------REDO---------")
    for(let a = 1; a <= maxH; a++) {

       if(redoHistory[a] != null || redoHistory[a] != undefined) console.log(redoHistory[a], a)
    }
    */
}

async function redoToHistory() {

    if (rh > 0) {
        h++;
        history[h] = redoHistory[rh];
        redoHistory[rh] = null;
        rh--;
    }

    /*
    console.clear();
    for(let a = 1; a < maxH; a++) {
       console.log(history[a], a)
    }
    console.log("--------REDO---------")
    for(let a = 1; a < maxH; a++) {
       console.log(redoHistory[a], a)
    }
    */
}
//================================FORWARD ENCODING=========================

function pauseEncoding() {
    
    //FOR PROPERTIES BOX (RIGHT SIDE)
    document.querySelector('#propertiesBox').querySelectorAll('input').forEach(function(input) {

        if(input.className.includes('Color')) {
          
            input.removeEventListener('change', encodeColorMulti);
        }
        else {
            input.removeEventListener('change', encodeTextMulti);
        }
        
    })
    document.querySelector('#menuSettings').querySelectorAll('input').forEach(function(input) {

        if(input.className.includes('Color')) {
          
            input.removeEventListener('change', encodeColorMulti);
        }
        else {
            input.removeEventListener('change', encodeTextMulti);
        }
        
    })
    document.querySelector('#pnlBoxSave').querySelectorAll('input').forEach(function(input) {

        if(input.id != "txtProjectTitle") {

            input.removeEventListener('change', encodeTextMulti);
        }
        
    })
    document.querySelector('#propertiesBox').querySelectorAll('[class*=opt]').forEach(function(input) {
        input.removeEventListener('pointerdown', encodeDropdownMulti);
    })
    document.getElementById('pnlBoxText').querySelectorAll('.optTextWeight').forEach(function(input) {
        input.removeEventListener('pointerdown', encodeTextWeight);
    })
    document.querySelector('#pnlBoxSave').querySelectorAll('[class*=opt]').forEach(function(input) {
        input.removeEventListener('pointerdown', encodeDropdownMulti);
    })
    document.querySelector('#propertiesBox').querySelectorAll('[class*=chk]').forEach(function(input) {
        if(input.className != "chkSwitch") {
            input.removeEventListener('click', encodeCheckboxMulti);
        }
    })
    document.querySelector('#menuSettings').querySelectorAll('[class*=chk]').forEach(function(input) {
        if(input.className != "chkSwitch") {
            input.removeEventListener('click', encodeCheckboxMulti);
        }
    })
    document.querySelector('#propertiesBox').querySelectorAll('[class*=sel]').forEach(function(input) {  

        let btn = input.querySelectorAll('[class*=btn]');
    
        btn.forEach(input => {
            input.removeEventListener('click', encodeSelectMulti);
        })
    })
    document.querySelectorAll('.btnLockUnlock').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        btn.removeEventListener('click', encodeLockUnlock);
    })
    document.querySelectorAll('.btnShowHide').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        btn.removeEventListener('click', encodeShowHide);
    })
    document.querySelectorAll('.btnMaskUnmask').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        btn.removeEventListener('click', encodeMaskUnmask);
    })

    // SPECIAL CASE FOR REMOVE MOCKUP
    //THIS BUTTON CARRIES ONE LISTENER ONLY AND THE REMOVAL WORK LIVES INSIDE IT,
    //SO WHILE PAUSED THE BUTTON DOES NOTHING AT ALL. undoRemoveMockup AND
    //redoRemoveMockup ACT DIRECTLY INSTEAD OF CLICKING IT
    document.getElementById('btnRemoveMockup').removeEventListener('click', encodeRemoveMockup);

    document.getElementById('chkMode').removeEventListener('click', encodeCheckboxMode);
}

function resumeEncoding() {

    //FOR PROPERTIES BOX (RIGHT SIDE)
    document.querySelector('#propertiesBox').querySelectorAll('input').forEach(function(input) {

        if(input.className.includes('Color')) {

            input.addEventListener('change', encodeColorMulti);
        }
        else {

            input.addEventListener('change', encodeTextMulti);
        }
        
    })
    document.querySelector('#menuSettings').querySelectorAll('input').forEach(function(input) {

        if(input.className.includes('Color')) {

            input.addEventListener('change', encodeColorMulti);
        }
        else {

            input.addEventListener('change', encodeTextMulti);
        }
        
    })
    document.querySelector('#pnlBoxSave').querySelectorAll('input').forEach(function(input) {

        if(input.id != "txtProjectTitle") {

            input.addEventListener('change', encodeTextMulti);
        }
        
    })
    //optTextWeight IS EXCLUDED BECAUSE IT HAS ITS OWN ENCODER. WITHOUT THIS THE GENERIC
    //ONE COMES BACK AFTER THE FIRST UNDO AND BOTH RECORD THE SAME CHANGE
    document.querySelector('#propertiesBox').querySelectorAll('[class*=opt]').forEach(function(input) {
        if(input.className != 'optTextWeight') input.addEventListener('pointerdown', encodeDropdownMulti);
    })
    document.getElementById('pnlBoxText').querySelectorAll('.optTextWeight').forEach(function(input) {
        input.addEventListener('pointerdown', encodeTextWeight);
    })
    document.querySelector('#pnlBoxSave').querySelectorAll('[class*=opt]').forEach(function(input) {
        input.addEventListener('pointerdown', encodeDropdownMulti);
    })
    document.querySelector('#propertiesBox').querySelectorAll('[class*=chk]').forEach(function(input) {
        if(input.className != "chkSwitch") {
            input.addEventListener('click', encodeCheckboxMulti);
        }
    })
    document.querySelector('#menuSettings').querySelectorAll('[class*=chk]').forEach(function(input) {
        if(input.className != "chkSwitch") {
            input.addEventListener('click', encodeCheckboxMulti);
        }
    })
    document.querySelector('#propertiesBox').querySelectorAll('[class*=sel]').forEach(function(input) {  

        let btn = input.querySelectorAll('[class*=btn]');
    
        btn.forEach(input => {
            input.addEventListener('click', encodeSelectMulti);
        })
    })
    document.querySelectorAll('.btnLockUnlock').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        btn.addEventListener('click', encodeLockUnlock);
    })
    document.querySelectorAll('.btnShowHide').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        btn.addEventListener('click', encodeShowHide);
    })
    document.querySelectorAll('.btnMaskUnmask').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        btn.addEventListener('click', encodeMaskUnmask);
    })
    // SPECIAL CASE FOR REMOVE MOCKUP
    document.getElementById('btnRemoveMockup').addEventListener('click', encodeRemoveMockup);

    document.getElementById('chkMode').addEventListener('click', encodeCheckboxMode);
}

//////////////////////////////////////ENCODING COLORS/////////////////////////////////

function hex2RGBStringEncoding(hex) {
    let z = [];
    let s = [];
    let append = "";
    
    for(let a=0; a < 6; a++) {

        z[a] = hex.substring(a, a+1);

        let NAN = Number(z[a]);
        
        if(isNaN(NAN)) {

            s[a] = z[a].toUpperCase();
            z[a] = hexaToDecimal(z[a])
        }
        else {
            s[a] = z[a];
            z[a] = Number(z[a]);
        }
        
        append += s[a];
    }
    
    let newred = (z[0] * 16) + z[1];
    let newgreen = (z[2] * 16) + z[3];
    let newblue = (z[4] * 16) + z[5];

    return `${newred}, ${newgreen}, ${newblue}`

}

function rgbaString2HexEncoding(rgba) {
    
    rgba = rgba.replace('rgba(', '');
    rgba = rgba.split(',');

    let channel = [];

    for(let a=0; a < 3; a++) {
        if(a == 0) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgba[0]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgba[0]) % 16));
        }
        else if(a == 1) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgba[1]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgba[1]) % 16));
        }
        else if(a == 2) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgba[2]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgba[2]) % 16));
        }    
    }

    return channel[0] + channel[1] + channel[2]; 
}

function rgbString2HexEncoding(rgb) {
    
    rgb = rgb.replace('rgb(', '');
    rgb = rgb.replace(')', '');
    rgb = rgb.trim();
    rgb = rgb.split(',');

    let channel = [];

    for(let a=0; a < 3; a++) {
        if(a == 0) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgb[0]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgb[0]) % 16));
        }
        else if(a == 1) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgb[1]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgb[1]) % 16));
        }
        else if(a == 2) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgb[2]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgb[2]) % 16));
        }    
    }

    return channel[0] + channel[1] + channel[2]; 
}

function rgbaString2AlphaEncoding(rgba) {
    
    rgba = rgba.replace('rgba(', '');
    rgba = rgba.replace(')', '');
    rgba = rgba.split(',');

    rgba[3] = Number(rgba[3]) * 100;

    return rgba[3];
}

function rgb2HexEncoding(rgb) {

    let channel = [];

    for(let a=0; a < 3; a++) {
        if(a == 0) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgb[0]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgb[0]) % 16));
        }
        else if(a == 1) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgb[1]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgb[1]) % 16));
        }
        else if(a == 2) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(Number(rgb[2]) / 16));
            channel[a] += decimalToHexa(Math.floor(Number(rgb[2]) % 16));
        }    
    }

    return channel[0] + channel[1] + channel[2]; 
}

function hex2HSBEncoding(hex) {
    let rgb = hex2RGBStringEncoding(hex);
    rgb = rgb.split(',');

    let newred = Number(rgb[0]) / 255;
    let newgreen = Number(rgb[1]) / 255;
    let newblue = Number(rgb[2]) / 255;

    let max = Math.max(newred, newgreen, newblue);
    let min = Math.min(newred, newgreen, newblue);
    let delta = max - min;

    // Calculate hue and sat, default to 0 until calculated
    let newhue = 0;
    let newsat = 0;

    if (delta !== 0) {
        if (max === newred) {
            newhue = ((newgreen - newblue) / delta) % 6;
        } else if (max === newgreen) {
            newhue = (newblue - newred) / delta + 2;
        } else {
            newhue = (newred - newgreen) / delta + 4;
        }

        newhue = Math.round(newhue * 60);

        if (newhue < 0) newhue += 360;

        // Calculate saturation
        if(max != 0) {
            newsat = delta/max;
        }
        else {
            newsat = 0;
        }
    }

    // Calculate value of brightness
    let newbright = max;

    let hsb = [];
    hsb[0] = Math.round(newhue);
    hsb[1] = Math.round(newsat * 100);
    hsb[2] = Math.round(newbright * 100);

    return hsb;
}

function hsb2RGBEncoding(hsb) {

    let h = hsb[0];
    let s = hsb[1];
    let b = hsb[2];

    let newred, newgreen, newblue;

    let newchroma = (b/100) * (s/100);
    let newchroma2 = newchroma * (1- Math.abs(((h/60) % 2) - 1));
    let newminLight = (b/100) - newchroma;

    if(h >= 0 && h < 60) {
        newred = (newchroma + newminLight) * 255;
        newgreen = (newchroma2 + newminLight) * 255;
        newblue = (0 + newminLight) * 255;
    }
    else if(h >= 60 && h < 120) {
        newred = (newchroma2 + newminLight) * 255;
        newgreen = (newchroma + newminLight) * 255;
        newblue = (0 + newminLight) * 255;
    }
    else if(h >= 120 && h < 180) {
        newred = (0 + newminLight) * 255;
        newgreen = (newchroma + newminLight) * 255;
        newblue = (newchroma2 + newminLight) * 255;
    }
    else if(h >= 180 && h < 240) {
        newred = (0 + newminLight) * 255;
        newgreen = (newchroma2 + newminLight) * 255;
        newblue = (newchroma + newminLight) * 255;
    }
    else if(h >= 240 && h < 300) {
        newred = (newchroma2 + newminLight) * 255;
        newgreen = (0 + newminLight) * 255;
        newblue = (newchroma + newminLight) * 255;
    }
    else if(h >= 300 && h < 360) {
        newred = (newchroma + newminLight) * 255;
        newgreen = (0 + newminLight) * 255;
        newblue = (newchroma2 + newminLight) * 255;
    }
    else {
        newred = (newchroma + newminLight) * 255;
        newgreen = (newchroma2 + newminLight) * 255;
        newblue = (0 + newminLight) * 255;
    }

    let rgb = [];
    rgb[0] = Math.round(newred);
    rgb[1] = Math.round(newgreen);
    rgb[2] = Math.round(newblue);

    return rgb;
}

function gradientString2Defs(f, pnlBox, type, strokeOrFill, gradientString) {

    //PARSE GRADIENT STRING TO GET DEGREE, STOP, STOP-COLOR, STOP-ALPHA
    if(gradientString.includes('linear')) {
        gradientString = gradientString.replace('linear-gradient', '');

    }
    else if(gradientString.includes('radial')) {
        gradientString = gradientString.replace('radial-gradient', '');
    }

    gradientString = gradientString.split(', rgba');

    //GET DEGREE IF THERE'S ANY AND REPLACE
    if(gradientString[0].includes('deg')) {
        gradientString[0] = gradientString[0].replace('(', '');
        gradientString[0] = gradientString[0].replace('deg', '');
    }

    //ADD 180 TO FLIP
    let angle = Number(gradientString[0]) + 90;
    let angleRadians = angle * Math.PI / 180;

    strokeOrFill = strokeOrFill.toLowerCase();
    type = type.toLowerCase();

    //THIS IS FOR THE ANGLE TO VECTOR
    //ONLY APPLICABLE FOR LINEAR GRADIENT TYPE
    let x1 = 0.5 + (0.5 * Math.cos(angleRadians));
    let y1 = 0.5 + (0.5 * Math.sin(angleRadians));
    let x2 = 0.5 - (0.5 * Math.cos(angleRadians));
    let y2 = 0.5 - (0.5 * Math.sin(angleRadians));

    //COMPILE ALL STOPS FOR FINAL DEFS ADDITION
    let stopAppend = "";

    for(let a=1; a < gradientString.length; a++) {

        let rgba = gradientString[a].split(') ')[0];
        let alpha = rgba.split(',')[3].trim();
        let rgb = `rgb${rgba.split(',')[0]},${rgba.split(',')[1]},${rgba.split(',')[2]})`;
        let stop = gradientString[a].split(') ')[1].replace(')', '');

        stopAppend += `<stop offset="${stop}" stop-color="${rgb}" stop-opacity="${alpha}"/>\n`
    }

    //LASTLY CREATE DEFS WITH STOPS
    if(type == 'linear') {
        let defs = 
        `<${type}Gradient id="${pnlBox}_${type}_${strokeOrFill}_${f}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="objectBoundingBox">
            ${stopAppend}
        </${type}Gradient>`;

        return defs;

    }
    else if(type == 'radial') {
        let defs = 
        `<${type}Gradient id="${pnlBox}_${type}_${strokeOrFill}_${f}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientUnits="objectBoundingBox">
                ${stopAppend}
        </${type}Gradient>`;

        return defs;
    }

    
}

function gradientString2DefsVector(f, pnlBox, type, strokeOrFill, sublayer, gradientString) {
    
    //PARSE GRADIENT STRING TO GET DEGREE, STOP, STOP-COLOR, STOP-ALPHA
    if(gradientString.includes('linear')) {
        gradientString = gradientString.replace('linear-gradient', '');

    }
    else if(gradientString.includes('radial')) {
        gradientString = gradientString.replace('radial-gradient', '');
    }

    gradientString = gradientString.split(', rgba');

    //GET DEGREE IF THERE'S ANY AND REPLACE
    if(gradientString[0].includes('deg')) {
        gradientString[0] = gradientString[0].replace('(', '');
         gradientString[0] = gradientString[0].replace('deg', '');
    }

    //ADD 180 TO FLIP
    let angle = Number(gradientString[0]) + 90;
    let angleRadians = angle * Math.PI / 180;

    strokeOrFill = strokeOrFill.toLowerCase();
    type = type.toLowerCase();

    //THIS IS FOR THE ANGLE TO VECTOR
    //ONLY APPLICABLE FOR LINEAR GRADIENT TYPE
    let x1 = 0.5 + (0.5 * Math.cos(angleRadians));
    let y1 = 0.5 + (0.5 * Math.sin(angleRadians));
    let x2 = 0.5 - (0.5 * Math.cos(angleRadians));
    let y2 = 0.5 - (0.5 * Math.sin(angleRadians));

    //COMPILE ALL STOPS FOR FINAL DEFS ADDITION
    let stopAppend = "";

    for(let a=1; a < gradientString.length; a++) {

        let rgba = gradientString[a].split(') ')[0];
        let alpha = rgba.split(',')[3].trim();
        let rgb = `rgb${rgba.split(',')[0]},${rgba.split(',')[1]},${rgba.split(',')[2]})`;
        let stop = gradientString[a].split(') ')[1].replace(')', '');

        stopAppend += `<stop offset="${stop}" stop-color="${rgb}" stop-opacity="${alpha}"/>\n`
    }

    //LASTLY CREATE DEFS WITH STOPS
    if(type == 'linear') {
        let defs = 
        `<${type}Gradient id="${pnlBox}_${type}_${strokeOrFill}_sublayer${sublayer}_${f}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="objectBoundingBox">
                ${stopAppend}
            </${type}Gradient>`;

        return defs;

    }
    else if(type == 'radial') {
        //A VECTOR'S COLOR IS READ BACK FROM THIS DEF, NOT FROM A STRING, SO THE RADIAL'S ANGLE IS
        //KEPT ON IT - SEE radialAtWithRotation IN colorManager.js AND defsGradient2GradientString
        let rotation = radialRotationFromString(gradientString[0]);
        let keep = rotation != 0 ? ` data-rotation="${rotation}"` : '';

        let defs = 
         `<${type}Gradient id="${pnlBox}_${type}_${strokeOrFill}_sublayer${sublayer}_${f}"${keep} cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientUnits="objectBoundingBox">
                ${stopAppend}
            </${type}Gradient>`;

        return defs;
    }
   
}

function defsGradient2GradientString(defsGradient) {

    let stopAppend = "";
    let gradientString = ""

    let div = document.createElement('div');
    div.innerHTML = defsGradient;

    //GET DIRECTION AND DEGREE
    if(defsGradient.includes('linear')) {

        let x1 = div.firstElementChild.getAttribute('x1');
        let y1 = div.firstElementChild.getAttribute('y1');
        let x2 = div.firstElementChild.getAttribute('x2');
        let y2 = div.firstElementChild.getAttribute('y2');

        let x = x2 - x1;
        let y = y2 - y1;
        let radians = Math.atan2(-y, x);
        let degree = (((radians * 180) / Math.PI) + 360) % 360;
        //[!] IMPORTANT, SVG DEGREE IS - 90 TO CSS GRADIENT DEGREE
        degree = degree - 90;

        gradientString = `linear-gradient(${degree}deg, `

    }
    else if(defsGradient.includes('radial')) {
        //THE ANGLE gradientString2DefsVector KEPT ON THE DEF - SEE radialAtWithRotation
        gradientString = `radial-gradient(circle at ${radialAtWithRotation(div.firstElementChild.getAttribute('data-rotation'))},`;
    }

    //GET STOPS
    for(let a = 0; a < div.firstElementChild.childElementCount; a++) {

        let hex, rgb, alpha, offset;
        let stop = div.firstElementChild.children[a];

        //GET STOP COLOR IN RGB FORM
        if(stop.hasAttribute('stop-color')) {
            //IF VALUE IS NOT PERCENTAGE
            if(stop.getAttribute('stop-color').includes('#')) {
                hex = stop.getAttribute('stop-color').replace('#', '');
                rgb = hex2RGBStringEncoding(hex);
            }
            else if(stop.getAttribute('stop-color').includes('rgb')) {
                hex = rgbString2HexEncoding(stop.getAttribute('stop-color'));
                rgb = hex2RGBStringEncoding(hex);
            }
        }
        else {
            rgb = '0, 0, 0'
        }

        //GET STOP OPACITY OR ALPHA
        if(stop.hasAttribute('stop-opacity')) {
            alpha = stop.getAttribute('stop-opacity');
        }
        else {
            alpha = 1;
        }

        //CHECK IF STOP HAS OFFSET
        if(stop.hasAttribute('offset')) {
            //IF VALUE IS NOT PERCENTAGE
            if(!stop.getAttribute('offset').includes('%')) {
                offset = (Number(stop.getAttribute('offset')) * 100) + '%';
            }
            else {
                offset = stop.getAttribute('offset');
            }
        }
        else {
            offset = "0%";
        }

        //BUILD STOP STRING
        stopAppend += `rgba(${rgb}, ${alpha}) ${offset}`
        
        //ADD COMMA IF NOT YET LAST VALUE
        if(a + 1 < div.firstElementChild.childElementCount) {
            stopAppend += ', '
        }
    }

    //FINALLY APPEND ALL STOPS TO GRADIENT STRING
    gradientString = gradientString + stopAppend + ')';

    return gradientString
}

function encodeColorMulti() {

    let f;
    let name;
    let rgb, alpha, rgba;
    let tempHistory = "";
    let hex = testHexCode(this);

    if(hex == "Linear" || hex == "Radial") {
        rgba = this.dataset.gradient;
    }
    else {
        rgb = hex2RGBStringEncoding(hex);
        alpha = this.dataset.alpha;
        rgba = `rgba(${rgb}, ${alpha})`;
    }
    
    let newClassName = this.className;
    let panel = this.closest('[id*=pnlBox]');
    let panelName = panel.id.replace('pnlBox', '');

    //check first if this panel is canvas or not
    //if not, then transfer the data to append temporarily
    if(panel.id == 'pnlBoxCanvas') {
    
        layerSequence = valueFinder(dataCanvas, newClassName);

        if(layerSequence != rgba) {

            tempHistory = `Modified*`;
            tempHistory += `\npnlBoxCanvas: Canvas`;
            tempHistory += `\n${newClassName}: ${rgba}`; //SPLITRGBA[3] IS THE ALPHA VALUE + ')'
            tempHistory += `\n_`;
            tempHistory += `\n${newClassName}: ${layerSequence}\n`;

            dataCanvas = valueSwitcher(dataCanvas, newClassName, rgba);

            makeNewHistory(tempHistory);
        }
    }

    else if(panel.id == 'pnlBoxPattern') {

        tempHistory = "\nModified";

        for(let a = 0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    f = Number(focusPanel[a].dataset.ref);
                    name = focusPanel[a].querySelector('.txtHeader').value;

                    layerSequence = valueFinder(dataPattern[f], newClassName);

                    if(layerSequence != rgba) {
                        tempHistory += `*`;
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBoxPattern: ${name}`;
                        tempHistory += `\n${newClassName}: ${rgba}`;
                        tempHistory += `\n_`;
                        tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                        dataPattern[f] = valueSwitcher(dataPattern[f], newClassName, rgba);

                    }
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);
    }

    else if(panel.id == 'pnlBoxVector') {

        //CREATE A DIFFERENT FORMAT FOR VECTOR
        //SINCE THE VALUE OF PATHS CHANGES USING SLIDER
        //AND DEPENDS ON FOCUSED VECTOR
        tempHistory = "\nModified";

        f = Number(leadPanel.dataset.ref);
        name = leadPanel.querySelector('.txtHeader').value;

        //[!] SPECIAL CASE
        //LAYER SEQUENCE FOR VECTOR IS ADDED IN TABVECTOR.JS
        //CLICK EVENTS ON TXTSTROKE AND TXTFILL
        //ALTERNATIVE, LOG DATALAYER AFTER CHANGE IN TXTSTROKE AND TXTFILL
        //IN CASE CHANGES IN COLORPICKER, USE DATALAYER FOR LAYER SEQUENCE
  
        if(layerSequence == null) {
            layerSequence = valueFinder(history[h], newClassName)
        }

        if(layerSequence != rgba) {
            tempHistory += `*`;
            tempHistory += `\nref: ${f}`;
            tempHistory += `\npnlBoxVector: ${name}`;
            tempHistory += `\n${newClassName}: ${rgba}`;
            tempHistory += `\n_`;
            tempHistory += `\n${newClassName}: ${layerSequence}\n`;

            dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, rgba);

            makeNewHistory(tempHistory);
            
        }
    }

    else if(panel.id == 'pnlBox3DMockup') {

        tempHistory = "\nModified";
        
        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    f = Number(focusPanel[a].dataset.ref);

                    name = focusPanel[a].querySelector('.txtHeader').value;

                    layerSequence = valueFinder(dataLayer[f], newClassName);

                    if(layerSequence != rgba) {
                        tempHistory += `*`;
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBox${panelName}: ${name}`;
                        tempHistory += `\n${newClassName}: ${rgba}`;
                        tempHistory += `\n_`;
                        tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                        //RECORD OTHER PNLBOXMOCKUP VALUES
                        dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, rgba);
                    }
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);
    }

    else if(panel.id == 'pnlBox3DEnvironment') {

        layerSequence = valueFinder(dataEnv, newClassName);

        if(layerSequence != value) {

            tempHistory = "\nModified*";
            tempHistory += `\npnlBox3DEnvironment: Environment`;
            tempHistory += `\n${newClassName}: ${value}`;
            tempHistory += `\n_`;
            tempHistory += `\n${newClassName}: ${layerSequence}\n`;

            dataEnv = valueSwitcher(dataEnv, newClassName, value);

            makeNewHistory(tempHistory);

        }
    }
    
    else if(panel.id == 'pnlBoxSettings') {
    
        layerSequence = valueFinder(dataSettings, newClassName);

        if(layerSequence != rgba) {

            tempHistory = `Modified*`;
            tempHistory += `\npnlBoxSettings: Settings`;
            tempHistory += `\n${newClassName}: ${rgba}`; //SPLITRGBA[3] IS THE ALPHA VALUE + ')'
            tempHistory += `\n_`;
            tempHistory += `\n${newClassName}: ${layerSequence}\n`;

            dataSettings = valueSwitcher(dataSettings, newClassName, rgba);

            makeNewHistory(tempHistory);
            //console.log(tempHistory)
        }
    }
    
    else {

        //reset the value using valueSwitcher
        tempHistory = "\nModified";

        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    f = Number(focusPanel[a].dataset.ref);

                    name = focusPanel[a].querySelector('.txtHeader').value;

                    layerSequence = valueFinder(dataLayer[f], newClassName);
    
                    if(layerSequence != rgba) {

                        tempHistory += `*`;
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBox${panelName}: ${name}`;
                        tempHistory += `\n${newClassName}: ${rgba}`;
                        tempHistory += `\n_`;
                        tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                        dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, rgba);

                    }
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);
    }
    
    //[!] IMPORTANT FOR VECTOR
    //UNVERIFIED IF THIS IS AFFECTING OTHER LAYERSEQUENCE FOR ELEMENTS
    layerSequence = null;
    
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
    
}
document.querySelector('#propertiesBox').querySelectorAll('input[type="text"]').forEach(function(input) {
    //INCLUDES ONLY INPUT COLORS
    if(input.className.includes('Color')) {
        input.addEventListener('change', encodeColorMulti)
    }
})
document.getElementById('menuSettings').querySelectorAll('input[type="text"]').forEach(function(input) {
    //INCLUDES ONLY INPUT COLORS
    if(input.className.includes('Color')) {
        input.addEventListener('change', encodeColorMulti)
    }
})

function encodeColorSwitch() {

    let tempHistory = "";

    let panelName;

    if(colorPickerPanel.dataset.show == "true") {
        panelName = colorPickerPanel.dataset.pnlbox;
    }
    else if(colorManagerPanel.dataset.show == "true") {
        panelName = colorManagerPanel.dataset.pnlbox;
    }

    let txtGradient = document.querySelector('.txtGradient');
    let newClassName = colorPickerTrigger.previousElementSibling.className;
  
    let key, oldColor, name;

    //IF INNERTEXT IS SOLID THEN IT WAS CLICKED IN COLORMANAGER
    if(this.firstElementChild.innerText == "Solid") {
        oldColor = "Gradient";
        //GET KEY AS NEW VALUE
        //THE FIRST TXTGRADIENT VALUE
        //AS DEFAULT SOLID COLOR
        key = `rgba(${hex2RGBStringEncoding(txtGradient.value)}, ${txtGradient.dataset.alpha})`;
        
    }
    //IF INNERTEXT IS GRADIENT THEN IT WAS CLICKED IN COLORPICKERPANEL
    else if(this.firstElementChild.innerText == "Gradient") {
        oldColor = "Solid";
        //GET KEY AS NEW VALUE
        //DATASET GRADIENT
        key = colorPickerTrigger.previousElementSibling.dataset.gradient;
    }

    if(panelName == 'pnlBoxCanvas') {
    
        if(oldColor != this.firstElementChild.innerText) {

            tempHistory = 'Switch Color*';
            tempHistory += `\npnlBoxCanvas: Canvas`
            tempHistory += `\ncolor: ${this.firstElementChild.innerText}`;
            tempHistory += `\n${newClassName}: ${key}`;
            tempHistory += `\n_`;
            tempHistory += `\ncolor: ${oldColor}`;
            tempHistory += `\n${newClassName}: ${layerSequence}\n`;
            
            dataCanvas = valueSwitcher(dataCanvas, newClassName, key);
            
            makeNewHistory(tempHistory);

        }
    }

    else if(panelName == 'pnlBoxPattern') {

        tempHistory = "\nSwitch Color";

        for(let a = 0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    f = Number(focusPanel[a].dataset.ref);
                    name = focusPanel[a].querySelector('.txtHeader').value;

                    if(oldColor != this.firstElementChild.innerText) {
                        
                        tempHistory += `*`;
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBoxPattern: ${name}`;
                        tempHistory += `\ncolor: ${this.firstElementChild.innerText}`;
                        tempHistory += `\n${newClassName}: ${key}`;
                        tempHistory += `\n_`;
                        tempHistory += `\ncolor: ${oldColor}`;
                        tempHistory += `\n${newClassName}: ${layerSequence}\n`;
                        
                        dataPattern[f] = valueSwitcher(dataPattern[f], newClassName, key);
                        
                    }
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);
    }

    else if(panelName == 'pnlBoxVector') {

        //CREATE A DIFFERENT FORMAT FOR VECTOR
        //SINCE THE VALUE OF PATHS CHANGES USING SLIDER
        //AND DEPENDS ON FOCUSED VECTOR
        tempHistory = "\nSwitch Color";

        f = Number(leadPanel.dataset.ref);
        name = leadPanel.querySelector('.txtHeader').value;

        if(oldColor != this.firstElementChild.innerText) {
            tempHistory += `*`;
            tempHistory += `\nref: ${f}`;
            tempHistory += `\npnlBoxVector: ${name}`;
            tempHistory += `\ncolor: ${this.firstElementChild.innerText}`;
            tempHistory += `\n${newClassName}: ${key}`;
            tempHistory += `\n_`;
            tempHistory += `\ncolor: ${oldColor}`;
            tempHistory += `\n${newClassName}: ${layerSequence}\n`;
            
            dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, key);
            
            makeNewHistory(tempHistory);
            
        }
    }

    else if(panelName == 'pnlBox3DMockup') {

    }

    else if(panelName == 'pnlBox3DEnvironment') {

    }

    else {

        //reset the value using valueSwitcher
        tempHistory = "\nSwitch Color";

        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

      
                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase().replace('pnlbox', '')) {

                    f = Number(focusPanel[a].dataset.ref);
                    name = focusPanel[a].querySelector('.txtHeader').value;
                    
                    if(oldColor != this.firstElementChild.innerText) {

                        tempHistory += `*`;
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBox${panelName}: ${name}`;
                        tempHistory += `\ncolor: ${this.firstElementChild.innerText}`;
                        tempHistory += `\n${newClassName}: ${key}`;
                        tempHistory += `\n_`;
                        tempHistory += `\ncolor: ${oldColor}`;
                        tempHistory += `\n${newClassName}: ${layerSequence}\n`;
                        
                        dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, key);

                    }
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);
    }

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
    
}
/////////////////////////////////////////ENCODING DATA////////////////////////////////
function encodeTextMulti(e) {

    //if(e.key == "Enter") {
        
        let newClassName;
        let tempHistory = "";

        ////////////////////DETECT FIRST IF THE INPUT IS RNG THEN CHANGE CLASS NAME///////////
        if(this.className.includes('rng')) {
            newClassName = this.nextElementSibling.className;
        }
        else {
            newClassName = this.className;
        }

        let f;
        let name;
        let panel = this.closest('[id*=pnlBox]');
        let panelName = panel.id.replace('pnlBox', '');
        
        //check first if this panel is canvas or not
        //if not, then transfer the data to append temporarily
        if(panel.id == 'pnlBoxCanvas') {

            //ONLY TWO SIZE FIELDS HERE AND THE LOCK MOVES BOTH, SO BOTH GO IN ONE ENTRY
            let oldW = valueFinder(dataCanvas, 'txtSizeWidth');
            let oldH = valueFinder(dataCanvas, 'txtSizeHeight');
            let newW = panel.querySelector('.txtSizeWidth').value;
            let newH = panel.querySelector('.txtSizeHeight').value;

            if(oldW != newW || oldH != newH) {

                tempHistory = `Modified*`;
                tempHistory += `\npnlBoxCanvas: Canvas`;
                tempHistory += `\ntxtSizeWidth: ${newW}`;
                tempHistory += `\ntxtSizeHeight: ${newH}`;
                tempHistory += `\n_`;
                tempHistory += `\ntxtSizeWidth: ${oldW}`;
                tempHistory += `\ntxtSizeHeight: ${oldH}\n`;

                dataCanvas = valueSwitcher(dataCanvas, 'txtSizeWidth', newW);
                dataCanvas = valueSwitcher(dataCanvas, 'txtSizeHeight', newH);

                makeNewHistory(tempHistory);
            }
        }

        else if(panel.id == 'pnlBoxPattern') {

            tempHistory = "\nModified";

            for(let a=0; a < focusPanel.length; a++) {

                if(focusPanel[a] != null) {

                    if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                        f = Number(focusPanel[a].dataset.ref);
                        name = focusPanel[a].querySelector('.txtHeader').value;
                        
                        layerSequence = valueFinder(dataPattern[f], newClassName);

                        if(layerSequence != this.value) {
                            tempHistory += `*`;
                            tempHistory += `\nref: ${f}`;
                            tempHistory += `\npnlBoxPattern: ${name}`;
                            tempHistory += `\n${newClassName}: ${this.value}`;
                            tempHistory += `\n_`;
                            tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                            dataPattern[f] = valueSwitcher(dataPattern[f], newClassName, this.value);

                        }
                    }
                }
                
            }

            //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
            if(tempHistory.includes('*')) makeNewHistory(tempHistory);

        }

        else if(panel.id == 'pnlBoxVector') {

            //CREATE A DIFFERENT FORMAT FOR VECTOR
            //SINCE THE VALUE OF PATHS CHANGES USING SLIDER
            //AND DEPENDS ON FOCUSED VECTOR
            tempHistory = "\nModified";

            //SEPARATE TXTSUBLAYER SINCE THE VALUE DIFFERS FROM ONE VECTOR TO ANOTHER
            if(newClassName == "txtSubLayer") {

                f = Number(leadDrag.dataset.ref);
                name = leadPanel.querySelector('.txtHeader').value;
                let txtVectorStrokeColor = panel.querySelector('.txtVectorStrokeColor');           
                let txtVectorFillColor = panel.querySelector('.txtVectorFillColor');
    
                layerSequence = valueFinder(dataLayer[f], newClassName);

                if(layerSequence != this.value) {

                    tempHistory += `*`;
                    tempHistory += `\nref: ${f}`;
                    tempHistory += `\npnlBoxVector: ${name}`;
                    tempHistory += `\n${newClassName}: ${this.value}`;
                    tempHistory += `\n_`;
                    tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                    //[!]THIS WILL ADD STROKE AND FILL COLOR DATA
                    //THIS IS FOR HISTORY 
                    //BY DEFAULT ALL COLOR VALUES ARE #000000
                    dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, this.value);
                    dataLayer[f] = valueSwitcher(dataLayer[f], "txtVectorStrokeColor", txtVectorStrokeColor.value);
                    dataLayer[f] = valueSwitcher(dataLayer[f], "txtVectorFillColor", txtVectorFillColor.value);

                    makeNewHistory(tempHistory);
                    
                }
            }
            else {

                for(let a=0; a < focusPanel.length; a++) {

                    if(focusPanel[a] != null) {

                        if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                            f = Number(focusPanel[a].dataset.ref);
                            name = focusPanel[a].querySelector('.txtHeader').value;

                            layerSequence = valueFinder(dataLayer[f], newClassName);

                            if(layerSequence != this.value) {
                                tempHistory += `*`;
                                tempHistory += `\nref: ${f}`;
                                tempHistory += `\npnlBoxVector: ${name}`;
                                tempHistory += `\n${newClassName}: ${this.value}`;
                                tempHistory += `\n_`;
                                tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                                dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, this.value);

                                
                            }
                        }
                    }
                }

                //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
                if(tempHistory.includes('*')) makeNewHistory(tempHistory);
            } 
        }

        else if(panel.id == 'pnlBox3DMockup') {

            tempHistory = "\nModified";
            
            let tabMockupBox = panel.querySelector('.tabMockupBox');
            let area = tabMockupBox.querySelector('h2').innerHTML;

            for(let a=0; a < focusPanel.length; a++) {

                if(focusPanel[a] != null) {

                    if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                        f = Number(focusPanel[a].dataset.ref);

                        name = focusPanel[a].querySelector('.txtHeader').value;

                        //[!]IF WE ARE RECORDING FROM 3D MODEL MOCKUP TAB
                        //THEN CHANGE THE LAYERSEQUENCE TO DATA3D OBJECT KEY
                        if(this.closest('.tabMockupBox')) {
                            let key = newClassName.replace('txtMockup', '');
                            key = key.replace(key.charAt(0), key.charAt(0).toLowerCase());
                            
                            layerSequence = data3D[f][area][key];

                            if(layerSequence != this.value) {

                                tempHistory += `*`;
                                tempHistory += `\nref: ${f}`;
                                tempHistory += `\npnlBox${panelName}: ${name}`;
                                tempHistory += `\n${newClassName}: ${this.value}`;
                                tempHistory += `\n_`;
                                tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                                //RECORD OTHER PNLBOXMOCKUP VALUES
                                dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, this.value);

                                //RECORD ANY ADJUSTMENTS TO DATA3D
                                //FOR ANY VALUES IN MOCKUP TAB
                                data3D[f][area][key] = this.value;

                            }
                        }
                        else {
                            layerSequence = valueFinder(dataLayer[f], newClassName);

                            if(layerSequence != this.value) {
                                tempHistory += `*`;
                                tempHistory += `\nref: ${f}`;
                                tempHistory += `\npnlBox${panelName}: ${name}`;
                                tempHistory += `\n${newClassName}: ${this.value}`;
                                tempHistory += `\n_`;
                                tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                                //RECORD OTHER PNLBOXMOCKUP VALUES
                                dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, this.value);
                            }
                        } 
                    }
                }
            }

            //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
            if(tempHistory.includes('*')) makeNewHistory(tempHistory);
        }

        else if(panel.id == 'pnlBox3DEnvironment') {

            layerSequence = valueFinder(dataEnv, newClassName);

            if(layerSequence != this.value) {

                tempHistory = "\nModified*";
                tempHistory += `\npnlBox3DEnvironment: Environment`;
                tempHistory += `\n${newClassName}: ${this.value}`;
                tempHistory += `\n_`;
                tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                dataEnv = valueSwitcher(dataEnv, newClassName, this.value);

                makeNewHistory(tempHistory);

            }
        }

        else if(panel.id == 'pnlBoxSettings') {
        
            //reset the value using valueSwitcher
            layerSequence = valueFinder(dataSettings, newClassName);

            if(layerSequence != this.value) {

                tempHistory = `Modified*`;
                tempHistory += `\npnlBoxSettings: Settings`;
                tempHistory += `\n${newClassName}: ${this.value}`;
                tempHistory += `\n_`;
                tempHistory += `\n${newClassName}: ${layerSequence}\n`;

                dataSettings = valueSwitcher(dataSettings, newClassName, this.value);

                makeNewHistory(tempHistory);
            }
        }

        else if(panel.id == 'pnlBoxSave') {

            //chooseOutputSize IS A PERMANENT ASPECT LOCK AND MOVES BOTH FIELDS, BUT ONLY THE
            //TOUCHED ONE FIRES change. BOTH GO IN ONE ENTRY, SAME AS pnlBoxCanvas
            let oldW = valueFinder(dataSave, 'txtOutputWidth');
            let oldH = valueFinder(dataSave, 'txtOutputHeight');
            let newW = panel.querySelector('.txtOutputWidth').value;
            let newH = panel.querySelector('.txtOutputHeight').value;

            if(oldW != newW || oldH != newH) {

                tempHistory = `Modified*`;
                tempHistory += `\npnlBoxSave: Save`;
                tempHistory += `\ntxtOutputWidth: ${newW}`;
                tempHistory += `\ntxtOutputHeight: ${newH}`;
                tempHistory += `\n_`;
                tempHistory += `\ntxtOutputWidth: ${oldW}`;
                tempHistory += `\ntxtOutputHeight: ${oldH}\n`;

                dataSave = valueSwitcher(dataSave, 'txtOutputWidth', newW);
                dataSave = valueSwitcher(dataSave, 'txtOutputHeight', newH);

                makeNewHistory(tempHistory);
            }
        }

        else {

            //reset the value using valueSwitcher
            tempHistory = "\nModified";

            for(let a=0; a < focusPanel.length; a++) {

                if(focusPanel[a] != null) {

                    if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                        f = Number(focusPanel[a].dataset.ref);

                        name = focusPanel[a].querySelector('.txtHeader').value;

                        layerSequence = valueFinder(dataLayer[f], newClassName);

                        if(layerSequence != this.value) {

                            //A TYPED TEXT SIZE MAKES A FIXED BOX. MODE BEFORE THE NEW SIZE, AFTER THE OLD ONE, OR AutoWidth RE-FITS IT
                            let sized = focusPanel[a].dataset.type == "text" && (newClassName == "txtWidthLayer" || newClassName == "txtHeightLayer");

                            tempHistory += `*`;
                            tempHistory += `\nref: ${f}`;
                            tempHistory += `\npnlBox${panelName}: ${name}`;
                            if(sized) tempHistory += `\nselTextResize: FixedSize`;
                            tempHistory += `\n${newClassName}: ${this.value}`;
                            tempHistory += `\n_`;
                            tempHistory += `\n${newClassName}: ${layerSequence}`;
                            if(sized) tempHistory += `\nselTextResize: ${valueFinder(dataLayer[f], 'selTextResize')}`;
                            tempHistory += `\n`;

                            dataLayer[f] = valueSwitcher(dataLayer[f], newClassName, this.value);
                            if(sized) dataLayer[f] = valueSwitcher(dataLayer[f], 'selTextResize', 'FixedSize');

                        }
                    }
                }
            }

            //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
            if(tempHistory.includes('*')) makeNewHistory(tempHistory);
        }
    //}
    
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
    
}
document.getElementById('propertiesBox').querySelectorAll('input').forEach((input) => {
    //EXCEPT ALL TEXT INPUT FOR COLOR
    if(!input.className.includes('Color')) {
       
        input.addEventListener('change', encodeTextMulti)
    }
})
//ADD ENCODING TO MENU FOR SETTINGS
document.getElementById('menuSettings').querySelectorAll('input').forEach((input) => {
    //EXCEPT ALL TEXT INPUT FOR COLOR
    if(!input.className.includes('Color')) {
       
        input.addEventListener('change', encodeTextMulti)
    }
})

document.getElementById('pnlBoxSave').querySelectorAll('input').forEach((input) => {
    //EXCEPT ALL TEXT INPUT FOR COLOR. txtProjectTitle HAS ITS OWN ENCODING
    if(!input.className.includes('Color') && input.id != "txtProjectTitle") {
       
        input.addEventListener('change', encodeTextMulti)
    }
})

function encodeTxtHeader() {

    let tempHistory = "";
    let f = Number(this.closest(`[class*=pnlBox]`).dataset.ref);
    let type = this.closest(`[class*=pnlBox]`).dataset.type;
    type = type.replace(type.charAt(0), type.charAt(0).toUpperCase());
    let category = `pnlBox${type}`;
    let newKey = this.value;

    /////////////////ENCODE RENAME HISTORY//////////
    if(newKey != renameDefault) {

        tempHistory = "\nRenamed*";
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBox${type}: ${newKey}`;
        tempHistory += `\npnlBox${type}: ${renameDefault}\n`;

        /////////////////ENCODE ALL REF DATA TOO///////////////
        if(type == "Pattern") {
            dataSwitcher(dataPattern, f, category, newKey);
        }
        else {
            dataSwitcher(dataLayer, f, category, newKey)
        }

        makeNewHistory(tempHistory);
    }
    
}

function encodeTitle() {

    //[!] VALIDATE, THEN ENCODE. THIS IS NOW THE ONLY change LISTENER ON THE TITLE.
    //[!] THE fileManager.js ONE IS DELETED - IT FIRED AFTER THIS ONE AND RESET THE INPUT
    //[!] AFTER THIS HAD ALREADY WRITTEN THE RAW VALUE INTO dataTitle AND THE RECORD
    this.value = purifyTitle(this.value);

    let tempHistory = "";
    let projectTitle  = valueFinder(dataTitle, "title");

    if(this.value != projectTitle) {

        tempHistory = "\nRetitled*";
        tempHistory += `\ntitle: ${this.value}`;
        tempHistory += `\n_`;
        tempHistory += `\ntitle: ${projectTitle}\n`;

        dataTitle = valueSwitcher(dataTitle, "title", this.value);

        makeNewHistory(tempHistory);
    }
}
document.querySelector('#txtProjectTitle').addEventListener('change', encodeTitle);

//THE WEIGHT DROPDOWN RECORDS THE LEAD LAYER ONLY. chooseTextWeight RESTYLES ONLY THE LEAD
//BECAUSE ONE FONT'S WEIGHT LIST DOES NOT APPLY TO ANOTHER FONT, AND encodeDropdownMulti
//WOULD HAVE WRITTEN HISTORY AND dataLayer FOR EVERY FOCUSED TEXT LAYER
function encodeTextWeight() {

    if(leadPanel == null) return;

    let f = Number(leadPanel.dataset.ref);
    let name = leadPanel.querySelector('.txtHeader').value;
    let newValue = this.innerText;

    layerSequence = valueFinder(dataLayer[f], `dropdown 1`);

    if(newValue != layerSequence) {

        let tempHistory = "\nModified*";
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxText: ${name}`;
        tempHistory += `\ndropdown 1: ${newValue}`;
        tempHistory += `\n_`;
        tempHistory += `\ndropdown 1: ${layerSequence}\n`;

        dataLayer[f] = valueSwitcher(dataLayer[f], `dropdown 1`, newValue);

        makeNewHistory(tempHistory);
    }
}

function encodeDropdownMulti() {

    let i = 0;
    let name;
    let tempHistory = "";
    let panel = this.closest('[id*=pnlBox]');
    let panelName = panel.id.replace('pnlBox', '');
    let dropdown = panel.querySelectorAll('[class*=dropdown]');

    //check first the index of this dropdown
    for(let a = 0; a < dropdown.length; a++) {

        if(dropdown[a] == this.parentElement.previousElementSibling) {
            i = a;
        }
    }
    //check first if this panel is canvas or not
    if(panel.id == 'pnlBoxCanvas') {

        layerSequence = valueFinder(dataCanvas, `dropdown ${i}`);

        //CHECK IF OLD VALUE MATCHES THE NEW VALUE
        //IF SO, DON'T ADD HISTORY
        
        if(layerSequence != this.innerText) {

            tempHistory = 'Modified*';
            tempHistory += `\npnlBoxCanvas: Canvas`;
            tempHistory += `\ndropdown ${i}: ${this.innerText}`;
            tempHistory += `\n_`;
            tempHistory += `\ndropdown ${i}: ${layerSequence}\n`;

            dataCanvas = valueSwitcher(dataCanvas, `dropdown ${i}`, this.innerText);

            makeNewHistory(tempHistory);

        }
        
    }
    else if(panel.id == 'pnlBoxPattern') {

        tempHistory = "\nModified";

        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    //e = Number(focusPanel[a].dataset.layer);
                    f = Number(focusPanel[a].dataset.ref);
                    name = focusPanel[a].querySelector('.txtHeader').value;

                    ///////////////CHANGE THE VALUE IF DEFAULTED TO CHOOSE STYLE/////////////
                    let newValue = this.innerText;

                    layerSequence = valueFinder(dataPattern[f], `dropdown ${i}`);

                    if(newValue != layerSequence) {
                        tempHistory += `*`;
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBoxPattern: ${name}`;
                        tempHistory += `\ndropdown ${i}: ${newValue}`;
                        tempHistory += `\n_`;
                        tempHistory += `\ndropdown ${i}: ${layerSequence}\n`;

                        dataPattern[f] = valueSwitcher(dataPattern[f], `dropdown ${i}`, newValue);
                    }
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);

    }
    else if(panel.id == 'pnlBox3DEnvironment') {

        layerSequence = valueFinder(dataEnv, `dropdown ${i}`);

        //CHECK IF OLD VALUE MATCHES THE NEW VALUE
        //IF SO, DON'T ADD HISTORY
        if(layerSequence != this.innerText) {
            tempHistory = 'Modified*';
            tempHistory += `\npnlBox3DEnvironment: Environment`;
            tempHistory += `\ndropdown ${i}: ${this.innerText}`;
            tempHistory += `\n_`;
            tempHistory += `\ndropdown ${i}: ${layerSequence}\n`;

            dataEnv = valueSwitcher(dataEnv, `dropdown ${i}`, this.innerText);

            makeNewHistory(tempHistory);
        }
        
    }
    else if(panel.id == 'pnlBoxSave') {

        //INDEX IS POSITIONAL INSIDE THE PANEL. 0 IS LOCATION, 1 IS FILE EXPORT.
        //fileManager decideHowToDownload READS [1] THE SAME WAY, SO THEY RENUMBER TOGETHER
        layerSequence = valueFinder(dataSave, `dropdown ${i}`);

        if(layerSequence != this.innerText) {
            tempHistory = 'Modified*';
            tempHistory += `\npnlBoxSave: Save`;
            tempHistory += `\ndropdown ${i}: ${this.innerText}`;
            tempHistory += `\n_`;
            tempHistory += `\ndropdown ${i}: ${layerSequence}\n`;

            dataSave = valueSwitcher(dataSave, `dropdown ${i}`, this.innerText);

            makeNewHistory(tempHistory);
        }
        
    }
    else if(panel.id == 'pnlBoxLine') {

        tempHistory = "\nModified";

        //THE LINE PANEL NUMBERS ITS PLAIN DROPDOWNS AMONG .dropdown ONLY - blend 0, style 1 - WHICH
        //IS WHAT addPnlBoxLine, createHistory AND decodeData3 ALREADY READ. i ABOVE ALSO COUNTS
        //THE TWO HEAD DROPDOWNS, SO THE STYLE CAME OUT AS dropdown 3: A KEY NOTHING READS AND
        //valueSwitcher NEVER APPENDS. THE STYLE WAS NEVER SAVED.
        let d = [...panel.querySelectorAll('.dropdown')].indexOf(this.parentElement.previousElementSibling);

        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    f = Number(focusPanel[a].dataset.ref);
                    let newValue = this.innerText;
                    name = focusPanel[a].querySelector('.txtHeader').value;

                    //A HEAD OPTION HOLDS ONLY AN SVG, SO ITS innerText IS "" - THE LEFT HEAD WAS SAVED
                    //AS "" AND CAME BACK AS MITER ON THE NEXT FOCUS. ITS id IS THE VALUE, FOR BOTH ENDS.
                    //
                    //THE HEAD BRANCH IS EXCLUSIVE NOW. IT USED TO FALL THROUGH TO THE dropdown ${i}
                    //BLOCK, AND A LEFT-HEAD PICK (i == 1) WROTE "" OVER THE SAVED STYLE.
                    if(this.parentElement.className == "dropOptionLineStart" || this.parentElement.className == "dropOptionLineEnd") {

                        let key = this.parentElement.className == "dropOptionLineStart" ? `dropdownLineStart 0` : `dropdownLineEnd 0`;
                        newValue = this.children[0].getAttribute('id');

                        layerSequence = valueFinder(dataLayer[f], key);

                        if(newValue != layerSequence) {
                            tempHistory += '*';
                            tempHistory += `\nref: ${f}`;
                            tempHistory += `\npnlBox${panelName}: ${name}`;
                            tempHistory += `\n${key}: ${newValue}`;
                            tempHistory += `\n_`;
                            tempHistory += `\n${key}: ${layerSequence}\n`;

                            dataLayer[f] = valueSwitcher(dataLayer[f], key, newValue);

                        }

                    }
                    else {

                        if(newValue == "Choose style") {
                            newValue = "Remove";
                        }

                        layerSequence = valueFinder(dataLayer[f], `dropdown ${d}`);

                        if(newValue != layerSequence) {

                            tempHistory += `*`;
                            tempHistory += `\nref: ${f}`;
                            tempHistory += `\npnlBox${panelName}: ${name}`;
                            tempHistory += `\ndropdown ${d}: ${newValue}`;
                            tempHistory += `\n_`;
                            tempHistory += `\ndropdown ${d}: ${layerSequence}\n`;

                            dataLayer[f] = valueSwitcher(dataLayer[f], `dropdown ${d}`, newValue);
                        }
                    }
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);


    }
    else {

        tempHistory = "\nModified";

        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    f = Number(focusPanel[a].dataset.ref);
                    name = focusPanel[a].querySelector('.txtHeader').value;

                    ///////////////CHANGE THE VALUE IF DEFAULTED TO CHOOSE STYLE/////////////
                    let newValue = this.innerText;

                    if(newValue == "Choose style") {
                        newValue = "Remove";
                    }

                    layerSequence = valueFinder(dataLayer[f], `dropdown ${i}`);

                    if(newValue != layerSequence) {

                        tempHistory += `*`;
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBox${panelName}: ${name}`;
                        tempHistory += `\ndropdown ${i}: ${newValue}`;
                        tempHistory += `\n_`;
                        tempHistory += `\ndropdown ${i}: ${layerSequence}\n`;

                        dataLayer[f] = valueSwitcher(dataLayer[f], `dropdown ${i}`, newValue);
                    }
                }
            }
        } 

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);
    }

    /*
    console.clear();
    for(let a = 0; a < 4; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
}

function encodeCheckboxMulti() {

    let name;
    let f;
    let tempHistory = "";
    let panel = this.closest('[id*=pnlBox]');
    let panelName = panel.id.replace('pnlBox', '');

    //check first if this panel is canvas or not
    if(panel.id == 'pnlBoxCanvas') {

        layerSequence = valueFinder(dataCanvas, `${this.className}`);

        if(layerSequence != this.dataset.value) {

            tempHistory = 'Modified*';
            tempHistory += `\npnlBoxCanvas: Canvas`;
            tempHistory += `\n${this.className}: ${this.dataset.value}`;
            tempHistory += `\n_`;
            tempHistory += `\n${this.className}: ${layerSequence}\n`;

            dataCanvas = valueSwitcher(dataCanvas, `${this.className}`, this.dataset.value);

            makeNewHistory(tempHistory);
        }
        
    }
    else if(panel.id == 'pnlBoxPattern') {

        tempHistory = "\nModified";

        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    
                    f = Number(focusPanel[a].dataset.ref);
                    name = focusPanel[a].querySelector('.txtHeader').value;

                    layerSequence = valueFinder(dataPattern[f], `${this.className}`);

                    if(layerSequence != this.dataset.value) {

                        tempHistory += '*';
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBoxPattern: ${name}`;
                        tempHistory += `\n${this.className}: ${this.dataset.value}`;
                        tempHistory += `\n_`;
                        tempHistory += `\n${this.className}: ${layerSequence}\n`;

                        dataPattern[f] = valueSwitcher(dataPattern[f], `${this.className}`, this.dataset.value);

                    }
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);

    }
    else if(panel.id == 'pnlBox3DEnvironment') {

        layerSequence = valueFinder(dataEnv, `${this.className}`);

        if(layerSequence != this.dataset.value) {

            tempHistory = 'Modified*';
            tempHistory += `\npnlBox3DEnvironment: Environment`;
            tempHistory += `\n${this.className}: ${this.dataset.value}`;
            tempHistory += `\n_`;
            tempHistory += `\n${this.className}: ${layerSequence}\n`;

            dataEnv = valueSwitcher(dataEnv, `${this.className}`, this.dataset.value);

            makeNewHistory(tempHistory);
        }
    
    }
    else if(panel.id == 'pnlBoxSettings') {

        layerSequence = valueFinder(dataSettings, `${this.className}`);

        if(layerSequence != this.dataset.value) {

            tempHistory = 'Modified*';
            tempHistory += `\npnlBoxSettings: Settings`;
            tempHistory += `\n${this.className}: ${this.dataset.value}`;
            tempHistory += `\n_`;
            tempHistory += `\n${this.className}: ${layerSequence}\n`;

            dataSettings = valueSwitcher(dataSettings, `${this.className}`, this.dataset.value);

            makeNewHistory(tempHistory);
        }
        
    }
    else {

        tempHistory = "\nModified";

        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    f = Number(focusPanel[a].dataset.ref);
                    name = focusPanel[a].querySelector('.txtHeader').value;

                    layerSequence = valueFinder(dataLayer[f], `${this.className}`);

                    if(layerSequence != this.dataset.value) {
                        tempHistory += '*';
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBox${panelName}: ${name}`;
                        tempHistory += `\n${this.className}: ${this.dataset.value}`;
                        tempHistory += `\n_`;
                        tempHistory += `\n${this.className}: ${layerSequence}\n`;

                        dataLayer[f] = valueSwitcher(dataLayer[f], `${this.className}`, this.dataset.value);

                    }
                    
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);
    }


    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
}
document.querySelector('#propertiesBox').querySelectorAll('[class*=chk]').forEach(function(input) {
    if(input.className != "chkSwitch") {
        input.addEventListener('click', encodeCheckboxMulti);
    }
})
document.getElementById('menuSettings').querySelectorAll('[class*=chk]').forEach(function(input) {
    input.addEventListener('click', encodeCheckboxMulti);
})

function encodeCheckboxMode() {
    
    let tempHistory = "";

    layerSequence = valueFinder(dataMode, 'chkMode');

    if(layerSequence != this.dataset.value) {

        tempHistory = 'Switch Mode*';
        tempHistory += `\nchkMode: ${this.dataset.value}`;
        tempHistory += `\n_`;
        tempHistory += `\nchkMode: ${layerSequence}\n`;

        dataMode = valueSwitcher(dataMode, `chkMode`, this.dataset.value);

        makeNewHistory(tempHistory);
        
    }
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
}

function encodeSelectMulti(){

    let name;
    let tempHistory = "";
    let panel = this.closest('[id*=pnlBox]');
    let panelName = panel.id.replace('pnlBox', '');

    //THIS BLOCK IS ONLY FOR PNLBOXTEXT SINCE IT'S THE ONLY PANEL THAT USES
    //SELECT AS OF THIS BUILD
    if(panel.id == 'pnlBoxText') {

        tempHistory = "\nModified";

        for(let a=0; a < focusPanel.length; a++) {

            if(focusPanel[a] != null) {

                if(focusPanel[a].dataset.type.toLowerCase() == panelName.toLowerCase()) {

                    f = Number(focusPanel[a].dataset.ref);
                    name = focusPanel[a].querySelector('.txtHeader').value;   
                    
                    layerSequence = valueFinder(dataLayer[f], `${this.parentElement.className}`);

                    //THE RESULT OF THE CLICK, NOT THE BUTTON CLICKED. THE CASE BUTTONS TOGGLE: A
                    //CLICK ON THE LIT ONE TURNS CASING OFF. THIS LISTENER RUNS BEFORE
                    //adjustTextTransform (history.js LOADS FIRST), SO currCase IS STILL THE VALUE
                    //THAT FUNCTION IS ABOUT TO TEST - THE SAME RULE, SO THE RECORD AND THE CANVAS
                    //CANNOT DISAGREE. RECORDING THE BUTTON LEFT dataLayer ON UpperCase AFTER A
                    //TOGGLE OFF, AND THE NEXT REPAINT LIT AB OVER NORMAL TEXT
                    let chosen = this.className.replace('btn', '');

                    if(this.parentElement.className == 'selTextCase' && currCase == chosen) chosen = 'none';

                    if(layerSequence != chosen) {

                        tempHistory += '*';
                        tempHistory += `\nref: ${f}`;
                        tempHistory += `\npnlBox${panelName}: ${name}`;
                        tempHistory += `\n${this.parentElement.className}: ${chosen}`;
                        tempHistory += `\n_`;
                        tempHistory += `\n${this.parentElement.className}: ${layerSequence}\n`;

                        dataLayer[f] = valueSwitcher(dataLayer[f], `${this.parentElement.className}`, chosen);

                    }   
                }
            }
        }

        //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
        if(tempHistory.includes('*')) makeNewHistory(tempHistory);
    }

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
}

document.querySelector('#propertiesBox').querySelectorAll('[class*=sel]').forEach(function(input) {  

    let btn = input.querySelectorAll('[class*=btn]');

    btn.forEach(input => {
        input.addEventListener('click', encodeSelectMulti);
    })
})

function encodeBasicsFromCanvas(event) {

    let tempHistory = "";
    let oldValue;

    tempHistory = "\nModified";
    
    for(let f = 0; f < maxF; f++) {

        //A LOCKED LAYER CAN BE SELECTED FROM THE LAYERS PANEL BUT IS NEVER MOVED, RESIZED OR ROTATED -
        //MOVEABLE DOES NOT TARGET IT AND arrowMove SKIPS IT - SO IT HAS NOTHING TO RECORD HERE
        if(focusObj[f] != null && f2PinBody(f)?.dataset.lock != "lock") {

            let type = focusObj[f].dataset.type;
        
            let panelName = focusObj[f].dataset.type;
            panelName = panelName.replace(panelName.charAt(0), panelName.charAt(0).toUpperCase());

            let name = f2Panel(f).querySelector('.txtHeader').value;

            if(event == "scale" || event == "resize") {
            
                tempHistory += `*`;
                tempHistory += `\nref: ${f}`;
                tempHistory += `\npnlBox${panelName}: ${name}`;

                //[!]INJECT THIS PART IF THE TYPE IS TEXT
                //AS THIS WILL AFFECT THE AUTOWIDTH, AUTOHEIGHT OR FIXED SIZE
                //IT GOES BEFORE THE GEOMETRY ON BOTH SIDES: UNDO AND REDO REPLAY LINES IN ORDER, AND A
                //WIDTH APPLIED WHILE THE LAYER IS STILL AutoWidth IS RESET TO FIT THE TEXT. THE MODE
                //IS THE PRECONDITION FOR THE WIDTH, SO IT HAS TO LAND FIRST
                if(type == "text") {
                    tempHistory += `\nselTextResize: ${currResizeBox}`;
                } 

                tempHistory += `\ntxtWidthLayer: ${Math.round(focusObj[f].clientWidth)}`;
                tempHistory += `\ntxtHeightLayer: ${Math.round(focusObj[f].clientHeight)}`;
                tempHistory += `\ntxtXLayer: ${Math.round(focusObj[f].offsetLeft)}`;
                tempHistory += `\ntxtYLayer: ${Math.round(focusObj[f].offsetTop)}`;

                tempHistory += `\n_`;

                //process current history and get old value
                if(type == "text") {
                    oldValue = valueFinder(dataLayer[f], 'selTextResize');
                    tempHistory += `\nselTextResize: ${oldValue}`;
                }

                oldValue = valueFinder(dataLayer[f], `txtWidthLayer`);
                tempHistory += `\ntxtWidthLayer: ${oldValue}`;

                oldValue = valueFinder(dataLayer[f], `txtHeightLayer`);
                tempHistory += `\ntxtHeightLayer: ${oldValue}`;

                oldValue = valueFinder(dataLayer[f], `txtXLayer`);
                tempHistory += `\ntxtXLayer: ${oldValue}`;

                oldValue = valueFinder(dataLayer[f], `txtYLayer`);
                tempHistory += `\ntxtYLayer: ${oldValue}`;

                //[!] DO NOT MERGE WITH ABOVE (HISTORY)
                //THIS IS FOR DATALAYER AND TEXT
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtWidthLayer', Math.round(focusObj[f].clientWidth));
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtHeightLayer', Math.round(focusObj[f].clientHeight));

                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', Math.round(focusObj[f].offsetLeft));
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', Math.round(focusObj[f].offsetTop));
                
                if(type == "text") {
                    dataLayer[f] = valueSwitcher(dataLayer[f], 'selTextResize', currResizeBox);
                }

            }
            else if(event == "drag") {

                tempHistory += `*`;
                tempHistory += `\nref: ${f}`;
                tempHistory += `\npnlBox${panelName}: ${name}`;
                tempHistory += `\ntxtXLayer: ${Math.round(focusObj[f].offsetLeft)}`;
                tempHistory += `\ntxtYLayer: ${Math.round(focusObj[f].offsetTop)}`;
                tempHistory += `\n_`;
                
                oldValue = valueFinder(dataLayer[f], `txtXLayer`);
                tempHistory += `\ntxtXLayer: ${oldValue}`;

                oldValue = valueFinder(dataLayer[f], `txtYLayer`);
                tempHistory += `\ntxtYLayer: ${oldValue}\n`;

                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', Math.round(focusObj[f].offsetLeft));
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', Math.round(focusObj[f].offsetTop));
                
            }
            else if(event == "rotate") {
                
                tempHistory += `*`;
                tempHistory += `\nref: ${f}`;
                tempHistory += `\npnlBox${panelName}: ${name}`;
                tempHistory += `\ntxtRotationLayer: ${Math.round(focusObj[f].dataset.rotation)}`;
                tempHistory += `\ntxtXLayer: ${Math.round(focusObj[f].offsetLeft)}`;
                tempHistory += `\ntxtYLayer: ${Math.round(focusObj[f].offsetTop)}`;
                tempHistory += `\n_`;

                oldValue = valueFinder(dataLayer[f], `txtRotationLayer`);
                tempHistory += `\ntxtRotationLayer: ${oldValue}`;

                oldValue = valueFinder(dataLayer[f], `txtXLayer`);
                tempHistory += `\ntxtXLayer: ${oldValue}`;

                oldValue = valueFinder(dataLayer[f], `txtYLayer`);
                tempHistory += `\ntxtYLayer: ${oldValue}`;

                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtRotationLayer', Math.round(focusObj[f].dataset.rotation));
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', Math.round(focusObj[f].offsetLeft));
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', Math.round(focusObj[f].offsetTop));
            }
                
        }
    }

    //A SELECTION OF ONLY LOCKED LAYERS LEAVES NO BLOCK - WRITING IT WOULD BE AN UNDO STEP THAT DOES NOTHING
    if(tempHistory.includes('*')) makeNewHistory(tempHistory);

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
        console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
        console.log(redoHistory[a])
    }
    */
}

function encodeLockUnlock() {

    let panel = this.closest('[class*="pnlBox"]')
    let f = panel.dataset.ref;

    //THIS RUNS BEFORE lockUnlockLayers - IT IS BOUND ON THE BUTTON, THE BEHAVIOUR IS DELEGATED ON
    //THE DOCUMENT - SO THE BUTTON STILL HOLDS THE PRE-CLICK STATE. THE LAYER DATA IS WRITTEN BY
    //lockUnlockLayers, WHICH IS WHAT MAKES IT CORRECT ON UNDO/REDO TOO
    let oldLock = this.dataset.lock;
    let newLock = oldLock == "lock"? "unlock": "lock";

    let tempHistory = "";
    tempHistory = "\nLocked*";
    tempHistory += `\nref: ${f}`;
    tempHistory += `\nlock: ${newLock}`;
    tempHistory += `\n_`;
    tempHistory += `\nlock: ${oldLock}\n`;
    
    makeNewHistory(tempHistory);
    
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
    
}

function encodeShowHide() {

    let panel = this.closest('[class*="pnlBox"]')
    let f = panel.dataset.ref;

    //SAME ORDER AS encodeLockUnlock - PRE-CLICK STATE, AND showHideLayers WRITES THE LAYER DATA
    let oldShow = this.dataset.show;
    let newShow = oldShow == "visible"? "hidden": "visible";

    let tempHistory = "";
    tempHistory = "\nShowed*";
    tempHistory += `\nref: ${f}`;
    tempHistory += `\nshow: ${newShow}`;
    tempHistory += `\n_`;
    tempHistory += `\nshow: ${oldShow}\n`;
    
    makeNewHistory(tempHistory);
    
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
    
}

function encodeMaskUnmask() {

    let panel = this.closest('[class*="pnlBox"]')
    let f = panel.dataset.ref;

    let tempHistory = "";
    tempHistory = "\nMasked*";
    tempHistory += `\nref: ${f}`;
    tempHistory += `\nmask: ${this.dataset.mask}`;
    tempHistory += `\n_`;
    tempHistory += `\nmask: ${layerSequence}\n`;

    dataLayer[f] = valueSwitcher(dataLayer[f], `mask`, this.dataset.show);
    
    makeNewHistory(tempHistory);
    
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
    
}

function encodeRemoveMockup() {

    let f = Number(leadPanel.dataset.ref);
    let tabMockupBox = document.querySelector('.tabMockupBox');
    let area = tabMockupBox.querySelector('.dropdown').innerText.trim();

    // ONE BLOCK, NO '_' SEPARATOR. valueFinder RETURNS THE FIRST MATCHING LINE, SO AN
    //OLD/NEW PAIR WOULD HAND UNDO THE NEW VALUE. UNDO ALWAYS WANTS THE OLD thumbno AND
    //REDO ALWAYS WANTS REMOVAL, SO ONE BLOCK IS UNAMBIGUOUS
    let tempHistory = "";
    tempHistory = "\nRemoved Mockup*";
    tempHistory += `\nref: ${f}`;
    tempHistory += `\narea: ${area}`;
    tempHistory += `\nthumbno: ${data3D[f][area].thumbno}\n`;

    makeNewHistory(tempHistory);

    showLoading();
    setTimeout(() => {
        removeTexture(f, area);
        hideLoading();
    }, 200)
}
// BOUND ONCE AT LOAD. resumeEncoding ONLY EVER RUNS AFTER A pauseEncoding, SO WITHOUT
//THIS LINE THE BUTTON WOULD BE DEAD UNTIL THE FIRST UNDO. SAME SHAPE AS encodeTitle.
//addEventListener IGNORES A DUPLICATE OF THE SAME TYPE AND FUNCTION, SO resumeEncoding IS SAFE
document.getElementById('btnRemoveMockup').addEventListener('click', encodeRemoveMockup);

///////////////////////////////////////UNDO / REDO PROPERTIES////////////////////////////

//THE PANEL A HISTORY BLOCK BELONGS TO. IT MUST BE READ PER BLOCK, NEVER ONCE FOR THE WHOLE
//RECORD: encodeBasicsFromCanvas WRITES ONE RECORD WITH A BLOCK PER FOCUSED LAYER, SO A GROUP
//RESIZE OF MIXED TYPES CARRIES pnlBoxImage AND pnlBoxText IN THE SAME RECORD. RESOLVING ONCE
//PICKED WHICHEVER NAME CAME FIRST AND THEN LOOKED FOR THE OTHER PANEL'S CONTROLS INSIDE IT,
//WHICH RETURNS null. THE dataLayer WRITES AT THE TAIL OF THE SAME LOOP ALREADY TEST PER BLOCK
function historyPanel(text) {

    let names = ['pnlBoxCanvas', 'pnlBoxPattern', 'pnlBoxImage', 'pnlBoxVector', 'pnlBoxElement',
                 'pnlBox3DMockup', 'pnlBox3DEnvironment', 'pnlBoxLine', 'pnlBoxText',
                 'pnlBoxSettings', 'pnlBoxSave'];

    for(let a = 0; a < names.length; a++) {

        if(text.includes(names[a] + ':')) return document.getElementById(names[a]);
    }

    return null;
}


function undoProperties() {

    let partHistory = history[h].trim().split('*');

    try {
        for(let a = 1; a < partHistory.length; a++) {

            if(partHistory[a] != null) {

                //RESOLVED FROM THIS BLOCK. THE WHOLE RECORD IS ONLY A FALLBACK FOR A BLOCK THAT
                //CARRIES NO PANEL NAME, WHICH KEEPS THE OLD BEHAVIOUR FOR THOSE
                let pnlBox = historyPanel(partHistory[a]);
                if(pnlBox == null) pnlBox = historyPanel(history[h]);

                let data = partHistory[a].split('_');
                let f = valueFinder(data[0], 'ref');
                let panel, canvas, type;

                if(f != null) {
                    canvas = f2Canvas(f)
                    panel = f2Panel(f);
                    panel2Focus(panel);
                    type = panel.dataset.type;
                }
            
                let oldData = data[1].trim().split('\n');

                for(let b = 0; b < oldData.length; b++) {

                    pauseEncoding();
                    //for each data, split and get category
                    let category = oldData[b].split(': ')[0];
                    let key = oldData[b].split(': ')[1];

                    if(category.includes('txt')) {
                        //IF TXT INPUT IS RELATED TO COLOR

                        if(category.includes('Color')) {

                            //CHECK IF KEY COLOR IS SOLID OR GRADIENT
                            if(key.includes("linear")) {

                                pnlBox.querySelector(`.${category}`).value = "Linear";
                                pnlBox.querySelector(`.${category}`).dataset.gradient = key;

                                parseGradient2Panel(key);
                            }
                            else if(key.includes("radial")) {
                                pnlBox.querySelector(`.${category}`).value = "Radial";
                                pnlBox.querySelector(`.${category}`).dataset.gradient = key;
                            
                                parseGradient2Panel(key);

                            }
                            else {
                                ////////THESE HEX LINES ARE SAFE THEY ARE FOR COLOR PICKER/////////
                                //CHANGE DEFAULT VALUES IN COLOR PICKER ACCORDING TO KEY VALUES

                                txtHexValue.value = rgbaString2HexEncoding(key);
                                txtAlpha.value = rgbaString2AlphaEncoding(key) + '%';

                                hex2Thumb();

                                pnlBox.querySelector(`.${category}`).value = txtHexValue.value;
                                pnlBox.querySelector(`.${category}`).dataset.alpha = rgbaString2AlphaEncoding(key)/100;
                            }

                            pnlBox.querySelector(`.${category}`).dispatchEvent(new Event('change')); 
                            //restore event listener encoding for manual addition

                        }
                        else {
                        
                            if(checkPanelFocusCount() > 1) {

                                pnlBox.querySelector(`.${category}`).value = key;
                            
                                if(category == "txtXLayer") {
                                    canvas.style.left = key + 'px';
                                    adjustCanvas(canvas)
                                }
                                else if(category == "txtYLayer") {
                                    canvas.style.top = key + 'px';
                                    adjustCanvas(canvas)
                                }
                                else if(category == "txtWidthLayer") {
                                    canvas.style.width = key + 'px';
                                    adjustCanvas(canvas)
                                }
                                else if(category == "txtHeightLayer") {
                                    canvas.style.height = key + 'px';
                                    adjustCanvas(canvas)
                                }
                                else {
                                    pnlBox.querySelector(`.${category}`).dispatchEvent(new Event ("change", {bubbles: true}));
                                }

                            }
                            else {
                                //trigger change using undo data
                                pnlBox.querySelector(`.${category}`).value = key;
                                pnlBox.querySelector(`.${category}`).dispatchEvent(new Event ("change", {bubbles: true}));
                            }

                            hideAllOptions();

                            //DO NOT EXECUTE MASK FUNCTION IF THE PNLBOX IS FROM SETTINGS OR SAVE
                            //THEY DO NOT CONTAIN ANY PANELS AND CANVAS
                            if(pnlBox.id != 'pnlBoxSettings' && pnlBox.id != 'pnlBoxSave') maskImageBelow(panel)
                        }

                    }

                    //LINE HEADS FIRST - THEIR KEYS ALSO CONTAIN 'dropdown', AND THE GENERIC BRANCH BELOW
                    //READ 'dropdownLineStart 0' AS INDEX 0 (THE BLEND LIST) AND MATCHED ON innerText,
                    //WHICH A HEAD OPTION DOES NOT HAVE. UNDO OF A HEAD WAS A NO-OP.
                    else if(category.includes('dropdownLine')) {

                        setLineHead(f, category, key);
                        hideAllOptions();
                    }

                    else if(category.includes('dropdown')) {
                    
                        let i = Number(category.split(' ')[1]);

                        //THE WEIGHT LIST IS REBUILT ASYNCHRONOUSLY BY addFontWeights, SO DISPATCHING
                        //ON IT HERE WOULD HIT THE PREVIOUS LAYER'S OPTIONS. APPLY THE VALUE DIRECTLY
                        if(pnlBox.id == 'pnlBoxText' && i == 1) {
                            applyTextWeight(f, key);
                            pnlBox.querySelectorAll('.dropdown')[1].children[0].innerText = key;
                            pnlBox.querySelectorAll('.dropdown')[1].dataset.default = key;
                        }
                        else {

                            //THE LINE PANEL NUMBERS ITS PLAIN DROPDOWNS AMONG .dropdown ONLY, SAME AS
                            //encodeDropdownMulti. AN ENTRY WRITTEN BEFORE 2026-09-24 CAN STILL SAY
                            //dropdown 3, WHICH HAS NO LIST UNDER THIS RULE - SKIPPED, NOT THROWN
                            let drops = pnlBox.id == 'pnlBoxLine' ? pnlBox.querySelectorAll('.dropdown') : pnlBox.querySelectorAll(`[class*=dropdown]`);
                            let options = drops[i] != null ? drops[i].nextElementSibling : null;
                        
                            //A LINE BLOCK APPLIES TO ITS OWN LAYER ONLY. panel2Focus ABOVE KEEPS EVERY EARLIER
                            //BLOCK FOCUSED AND chooseLayerStyle APPLIES TO ALL FOCUSED, SO UNDOING ONE STYLE
                            //CHANGE ACROSS LINES THAT HAD DIFFERENT STYLES GAVE THEM ALL THE LAST BLOCK'S
                            //(DATA SAID Glow, CANVAS SHOWED Shadow). focusPanel IS PUT BACK RIGHT AFTER
                            let keepFocus = focusPanel;

                            try {
                                if(pnlBox.id == 'pnlBoxLine' && f != null) {
                                    focusPanel = [];
                                    focusPanel[f] = f2Panel(f);
                                }

                                if(options != null) for(let d = 0; d < options.childElementCount; d++) {

                                    if(options.children[d].innerText == key) {
                            
                                        options.children[d].dispatchEvent(new PointerEvent('pointerdown', {bubbles: true}))
                                    }
                                }
                            }
                            finally {
                                focusPanel = keepFocus;
                            }
                        }

                        hideAllOptions();
                    
                    }
                
                    else if(category.includes('chk')) {

                        if(pnlBox != null && pnlBox.querySelector(`.${category}`) != null) {
                            pnlBox.querySelector(`.${category}`).click();
                            pnlBox.querySelector(`.${category}`).dispatchEvent(new Event ('pointerleave'));
                        }
                  
                        hideAllOptions();
                    }

                    else if(category.includes('sel')) { 

                        replaySelection(pnlBox, category, key, f);

                        hideAllOptions();

                    }

                    else if(category.includes('innerText')) {
                    
                        let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

                        canvas.children[0].innerText = decodeText(key);

                        hideAllOptions();
                    }

                    //UPDATE DATA LAYER OR DATA PATTERN DEPENDS ON PARTHISTORY
                    if(partHistory[a].includes('pnlBoxCanvas:')) {
                        //EMPTY CONDITION FOR PNLBOXCANVAS BEC. NO 'F'
                        dataCanvas = valueSwitcher(dataCanvas, category, key);
                        swapPanels('canvas');
                    }
                    else if(partHistory[a].includes('pnlBoxPattern:')) {
                        dataPattern[f] = valueSwitcher(dataPattern[f], category, key);
                    }
                    else if(partHistory[a].includes('pnlBox3DMockup:')) {
                        saveMockupTexts();
                        dataLayer[f] = valueSwitcher(dataLayer[f], category, key);
                    }
                    else if(partHistory[a].includes('pnlBox3DEnvironment:')) {
                        dataEnv = valueSwitcher(dataEnv, category, key);
                    }
                    else if(partHistory[a].includes('pnlBoxSettings:')) {
                        dataSettings = valueSwitcher(dataSettings, category, key);
                    }
                    else if(partHistory[a].includes('pnlBoxSave:')) {
                        dataSave = valueSwitcher(dataSave, category, key);
                    }
                    else {
                        dataLayer[f] = valueSwitcher(dataLayer[f], category, key);
                    }

                    resumeEncoding();
                }
            }
        }
    }
    finally {

        //ANY THROW INSIDE THE LOOP USED TO LEAVE ENCODING PAUSED FOR THE REST OF THE
        //SESSION, SILENTLY, BECAUSE resumeEncoding SITS AT THE BOTTOM OF THE INNER LOOP.
        //ONE BROKEN UNDO STEP IS RECOVERABLE. A DEAD HISTORY IS NOT
        resumeEncoding();
    }

    adjustBorder();
    historyToRedo();
    
    /*
    console.clear();
    for(let a = 1; a < maxH; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 1; a < maxH; a++) {
       console.log(redoHistory[a])
    }
    */
    
}

function redoProperties() {

    redoToHistory();

    let partHistory = history[h].trim().split('*');

    try {
        for(let a = 1; a < partHistory.length; a++) {

            //RESOLVED FROM THIS BLOCK, SAME REASON AS undoProperties
            let pnlBox = historyPanel(partHistory[a]);
            if(pnlBox == null) pnlBox = historyPanel(history[h]);

            //scrape each lines first
            let data = partHistory[a].split('_');
            let f = valueFinder(data[0], 'ref');
            let canvas, type;

            if(f != null) {
                canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                panel2Focus(f2Panel(f));
                type = f2Panel(f).dataset.type;
            }
       
            let newData = data[0].trim().split('\n');
    
            for(let b = 0; b < newData.length; b++) {

                let category = newData[b].split(': ')[0];
                let key = newData[b].split(': ')[1];

                pauseEncoding();

                if(category.includes('txt')) {
                
                    //SEPARATE IF CATEGORY IS TXT + COLOR
                    if(category.includes('Color')) {
   
                        //CHECK IF KEY COLOR IS SOLID OR GRADIENT
                        if(key.includes("linear")) {

                            pnlBox.querySelector(`.${category}`).value = "Linear";
                            pnlBox.querySelector(`.${category}`).dataset.gradient = key;

                            parseGradient2Panel(key);
                        }
                        else if(key.includes("radial")) {
                            pnlBox.querySelector(`.${category}`).value = "Radial";
                            pnlBox.querySelector(`.${category}`).dataset.gradient = key;
                        
                            parseGradient2Panel(key);
                        }
                        else {
                            ////////THESE HEX LINES ARE SAFE THEY ARE FOR COLOR PICKER/////////
                            //CHANGE DEFAULT VALUES IN COLOR PICKER ACCORDING TO KEY VALUES
                            txtHexValue.value = rgbaString2HexEncoding(key);
                            txtAlpha.value = rgbaString2AlphaEncoding(key) + '%';
                            hex2Thumb();

                            pnlBox.querySelector(`.${category}`).value = txtHexValue.value;
                            pnlBox.querySelector(`.${category}`).dataset.alpha = rgbaString2AlphaEncoding(key)/100;
                        }

                        pnlBox.querySelector(`.${category}`).dispatchEvent(new Event ("change", {bubbles: true}));
 
                    }
                    //SEPARATE IF CATEGORY IS NORMAL TEXT INPUT AND NOT COLOR
                    else {

                        if(checkPanelFocusCount() > 1) {

                            pnlBox.querySelector(`.${category}`).value = key;
                            
                            if(category == "txtXLayer") {
                                canvas.style.left = key + 'px';
                                adjustCanvas(canvas)
                            }
                            else if(category == "txtYLayer") {
                                canvas.style.top = key + 'px';
                                adjustCanvas(canvas)
                            }
                            else if(category == "txtWidthLayer") {
                                canvas.style.width = key + 'px';
                                adjustCanvas(canvas)
                            }
                            else if(category == "txtHeightLayer") {
                                canvas.style.height = key + 'px';
                                adjustCanvas(canvas)
                            }
                            else {
                                pnlBox.querySelector(`.${category}`).dispatchEvent(new Event ("change", {bubbles: true}));
                            }

                        }
                        else {
                        
                            //trigger change using undo data
                            pnlBox.querySelector(`.${category}`).value = key;
                            pnlBox.querySelector(`.${category}`).dispatchEvent(new Event ("change", {bubbles: true}));
                        }

                        hideAllOptions();
                    }
                }

                //SAME REASON AS THE UNDO BRANCH ABOVE
                else if(category.includes('dropdownLine')) {

                    setLineHead(f, category, key);
                    hideAllOptions();
                }

                else if(category.includes('dropdown')) {
                
                    let i = Number(category.split(' ')[1]);

                    //SAME REASON AS THE UNDO BRANCH ABOVE
                    if(pnlBox.id == 'pnlBoxText' && i == 1) {
                        applyTextWeight(f, key);
                        pnlBox.querySelectorAll('.dropdown')[1].children[0].innerText = key;
                        pnlBox.querySelectorAll('.dropdown')[1].dataset.default = key;
                    }
                    else {

                        //SAME NUMBERING AS THE UNDO BRANCH ABOVE
                        let drops = pnlBox.id == 'pnlBoxLine' ? pnlBox.querySelectorAll('.dropdown') : pnlBox.querySelectorAll(`[class*=dropdown]`);
                        let options = drops[i] != null ? drops[i].nextElementSibling : null;

                        //SAME REASON AS THE UNDO BRANCH ABOVE - A LINE BLOCK APPLIES TO ITS OWN LAYER ONLY
                        let keepFocus = focusPanel;

                        try {
                            if(pnlBox.id == 'pnlBoxLine' && f != null) {
                                focusPanel = [];
                                focusPanel[f] = f2Panel(f);
                            }

                            if(options != null) for(let d = 0; d < options.childElementCount; d++) {
                                if(options.children[d].innerText == key) {
                                
                                    options.children[d].dispatchEvent(new PointerEvent('pointerdown', {bubbles: true}))
                                }
                            }
                        }
                        finally {
                            focusPanel = keepFocus;
                        }
                    }
                
                }
            
                else if(category.includes('chk')) {

                    //pnlBox.querySelector(`.${category}`).removeEventListener('click', encodeCheckboxMulti);
                    if(pnlBox != null && pnlBox.querySelector(`.${category}`) != null) {
                        pnlBox.querySelector(`.${category}`).click();
                        pnlBox.querySelector(`.${category}`).dispatchEvent(new Event ('pointerleave'));
                    }
                    //pnlBox.querySelector(`.${category}`).addEventListener('click', encodeCheckboxMulti);
            
                }

                else if(category.includes('sel')) { 

                    replaySelection(pnlBox, category, key, f);

                }

                else if(category.includes('innerText')) {
                    
                    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

                    canvas.children[0].innerText = decodeText(key);
                }
                //UPDATE DATA LAYER OR DATA PATTERN DEPENDS ON PARTHISTORY
                if(partHistory[a].includes('pnlBoxCanvas:')) {
                    //EMPTY CONDITION FOR PNLBOXCANVAS BEC. NO 'F'
                    dataCanvas = valueSwitcher(dataCanvas, category, key);
                    swapPanels('canvas');
                }
                else if(partHistory[a].includes('pnlBoxPattern:')) {
                    dataPattern[f] = valueSwitcher(dataPattern[f], category, key);
                }
                else if(partHistory[a].includes('pnlBox3DMockup:')) {
                    saveMockupTexts();
                    dataLayer[f] = valueSwitcher(dataLayer[f], category, key);
                }
                else if(partHistory[a].includes('pnlBox3DEnvironment:')) {
                    dataEnv = valueSwitcher(dataEnv, category, key);
                }
                else if(partHistory[a].includes('pnlBoxSettings:')) {
                    dataSettings = valueSwitcher(dataSettings, category, key);
                }
                else if(partHistory[a].includes('pnlBoxSave:')) {
                    dataSave = valueSwitcher(dataSave, category, key);
                }
                else {
                    dataLayer[f] = valueSwitcher(dataLayer[f], category, key);
                }

                resumeEncoding();
            }
        }
    }
    finally {

        //ANY THROW INSIDE THE LOOP USED TO LEAVE ENCODING PAUSED FOR THE REST OF THE
        //SESSION, SILENTLY, BECAUSE resumeEncoding SITS AT THE BOTTOM OF THE INNER LOOP.
        //ONE BROKEN UNDO STEP IS RECOVERABLE. A DEAD HISTORY IS NOT
        resumeEncoding();
    }

    adjustBorder();

    /*
    console.clear();
    for(let a = 1; a < maxH; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 1; a < maxH; a++) {
       console.log(redoHistory[a])
    }
    */
}

///////////////////////////////////////UNDO / REDO DELETE///////////////////////////////

//================REARRANGE PANELBOXES==================
function rearrangePanelBoxes(text) {

    let partStacking = text.split('*');
    let prevStack = partStacking[0];
    let ref = prevStack.split(' ');
    let cnvPin = document.getElementById('cnvPin');
    let configScroll = document.getElementsByClassName('configScroll');
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

    for(let a = 1; a < ref.length; a++) {
        if(ref[a] != '') {
            let panel = configScroll[5].querySelector(`[data-ref="${ref[a]}"]`)
            configScroll[5].appendChild(panel)

            let canvas = cnvGrpLayers.querySelector(`[data-ref="${ref[a]}"]`);
            cnvGrpLayers.prepend(canvas);

            if(panel.dataset.type != "pattern") {
                let pin = cnvPin.querySelector(`[data-ref="${ref[a]}"]`);
                cnvPin.prepend(pin);
            }
        }
    }

    rearrangeMaskingLayers();
}

//PUT A LAYER BACK DIRECTLY ABOVE THE NEAREST LAYER THAT WAS UNDER IT. NO RECORD (A FILE'S HISTORY) KEEPS THE OLD TOP
function restoreStack(f, panelHTML, canvasHTML, pinHTML) {

    let configScroll = document.getElementsByClassName('configScroll')[5];

    if(restoreBelow[f] == null) {
        configScroll.insertAdjacentHTML('afterbegin', panelHTML);
        cnvGrpLayers.insertAdjacentHTML('beforeend', canvasHTML);
        if(pinHTML != null) cnvPin.insertAdjacentHTML('beforeend', pinHTML);
        return;
    }

    let below = restoreBelow[f].find((ref) => f2Panel(ref) != null);
    let pinBelow = restoreBelow[f].map((ref) => cnvPin.querySelector(`[data-ref="${ref}"]`)).find((pin) => pin != null);

    if(below != null) {
        f2Panel(below).insertAdjacentHTML('beforebegin', panelHTML);
        f2Canvas(below).insertAdjacentHTML('afterend', canvasHTML);
    }
    else {
        configScroll.insertAdjacentHTML('beforeend', panelHTML);
        cnvGrpLayers.insertAdjacentHTML('afterbegin', canvasHTML);
    }

    //A PATTERN HAS NO PIN
    if(pinHTML != null) {
        if(pinBelow != null) pinBelow.insertAdjacentHTML('afterend', pinHTML);
        else cnvPin.insertAdjacentHTML('afterbegin', pinHTML);
    }

    restoreBelow[f] = null;
}

function undoDelete() {

    let partHistory = history[h].trim().split('*');
    let configScroll = document.getElementsByClassName('configScroll');
    
    //RUN LOOP AND STARTS AT 2
    //SINCE PARTHISTORY[0] = 'STACKED'
    //SINCE PARTHISTORY[1] = 'DELETED'

    for(let a = 2; a < partHistory.length; a++) {

        let f = Number(valueFinder(partHistory[a], 'ref'));

        let tempCanvas = document.createElement('div');
        let tempThumb = document.createElement('div');
        let tempPanel = document.createElement('div');
        
        if(partHistory[a].includes('pnlBoxPattern:')) {
            
            /////////////////RESTORE PATTERN/////////////////
            let name = valueFinder(partHistory[a], "pnlBoxPattern");
            let id = valueFinder(partHistory[a], "id");

            //transfer redoHistory to dataPattern
            dataPattern[f] = '*' + partHistory[a];
            
            recreatePnlBoxPattern(f, name, id);
            
            panel2Focus(f2Panel(f));
        }

        else if(partHistory[a].includes('pnlBoxThumb:')) {

            
            let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');

            let n = Number(valueFinder(partHistory[a], "thumbno"));
            
            //transfer redoHistory to dataPattern
            dataThumb[n] = '*' + partHistory[a];
        
            //////////////////////RESTORE THUMBS////////////////////
            for(let b = 0; b < restoreThumb.length; b++) {
                
                if(restoreThumb[b] != null) {

                    if(restoreThumb[b].includes(`thumbno="${n}"`)) {

                        tempThumb.innerHTML = restoreThumb[n];
                        focusPanel[n] = tempThumb.children[0];
                        
                        configScroll[2].children[0].children[0].appendChild(tempThumb.children[0])
                        configScroll[2].querySelector(`[data-thumbno="${n}"]`).style.borderColor = "var(--muted-blue-text)";
                        //configScroll[2].querySelector(`[data-thumbno="${n}"]`).addEventListener('dblclick', dblClickThumb)
                        //configScroll[2].querySelector(`[data-thumbno="${n}"]`).addEventListener('pointerover', pointerOverThumb);
                        //configScroll[2].querySelector(`[data-thumbno="${n}"]`).addEventListener('pointerleave', pointerLeaveThumb);

                        //RESTORE THUMBS TO ALL EXISTING 3D MOCKUP
                        //THIS CAN BE DONE HERE EVEN BEFORE RESTORING PANELS
                        //SINCE 3D MOCKUPS DON'T GET DELETED WHEN THUMBS ARE DELETED
                        //SO AS SOON AS THE THUMBNAIL IS BACK
                        //REATTACHED THEM BACK TO EXISTING 3D MOCKUP FACES
                        //restoreAllMockups(focusPanel[n]);

                        restoreThumb[n] = null;
                        tempThumb = null;
                    }
                }
                
            }

            ////////////////////REARRANGE PNLBOXTHUMBS////////////////////
            for(let b = pnlBoxThumb.length + 1; b >= 0; b--) {
                if(pnlBoxThumb[b] != null) {

                    let current;
                    let before;

                    if(b > 0) {
                        current = Number(pnlBoxThumb[b].dataset.thumbno);
                        before = Number(pnlBoxThumb[b-1].dataset.thumbno);
    
                        if(current > before) {
                            configScroll[2].children[0].children[0].insertBefore(pnlBoxThumb[b], pnlBoxThumb[b-1]);
                        }
                    }
                    else {
                        configScroll[2].children[0].children[0].prepend(pnlBoxThumb[b]);
                    } 

                }
            }

            //////////////////////RESTORE PANELS//////////////////////
            for(let b = 0; b < restorePanel.length; b++) {

                if(restorePanel[b] != null) {
                    
                    if(restorePanel[b].includes(`thumbno="${n}"`)) {

                        //b IS THE LAYER'S REF. NULLING tempPanel HERE MADE A SECOND LAYER OF THE SAME UPLOAD THROW
                        restoreStack(b, restorePanel[b], restoreCanvas[b], restorePin[b]);
                        cnvLayers[b] = f2Canvas(b);

                        restorePin[b] = null;
                        restorePanel[b] = null;
                        restoreCanvas[b] = null;
                    }
                }
                    
            } 

            //A THUMB IS NOT A LAYER, panel2Focus DECODED dataLayer[undefined] AND THREW
            thumb2Focus(n2Thumb(n));
            
        }

        else {

            //get datalayer
            dataLayer[f] = '*' + partHistory[a];

            //[!]NEVER USE ADDBORDER SINCE RESTOREPIN IS BETTER
            //RESTOREPIN WORKS ALSO WITH IMPORT AND AUTOSAVE
            restoreStack(f, restorePanel[f], restoreCanvas[f], restorePin[f]);

            if(partHistory[a].includes('pnlBox3DMockup:')) {
                
                showLoading();
                setTimeout( async () => {

                    let id = valueFinder(partHistory[a], 'id');
                    await recreate3DMockup(f, id);
                    canvas2Focus(f2Canvas(f));
                    hideLoading();
                 
                }, 200)
            }
            else {

                canvas2Focus(f2Canvas(f));
                
            }
        }

        tempPanel = null;
        tempCanvas = null;
        restorePanel[f] = null;
        restoreCanvas[f] = null;
        restorePin[f] = null;

    } 

    //////////////////////RESTORE PANEL SHOW HIDE AND RENAME/////////////////
    rearrangePanelBoxes(history[h]);
    hideAllOptions();
    historyToRedo();   
}

function redoDelete() {
  
    redoToHistory();

    let partHistory = history[h].trim().split('*');
    
    //RUN LOOP AND STARTS AT 1
    //SINCE PARTHISTORY[0] IS JUST THE TITLE 'DELETED'
    
    for(let a = 2; a < partHistory.length; a++) {

        let f = Number(valueFinder(partHistory[a], 'ref'));

        if (partHistory[a].includes('pnlBoxPattern:')) {

            deleteAllPatterns(f)

            removeData(dataPattern, f)
        }
        else if (history[h].includes('pnlBoxThumb:')) {

            let n = Number(valueFinder(partHistory[a], 'thumbno'));

            deleteAllThumbs(n)

        }
        else {

            deleteAllLayers(f)
        }
    }
    
    swapPanels("canvas");

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */

}

///////////////////////////////////////UNDO / REDO CREATE///////////////////////////////
function undoCreate() {
    
    let f = Number(valueFinder(history[h], "ref"));

    if (history[h].includes('pnlBoxPattern:')) {
  

        deleteAllPatterns(f);
        
    }
    
    else {

        deleteAllLayers(f);
        
    }

    
    resetLeadDrag();
    resetAllFocus();
    swapPanels('canvas');
    hideAllOptions();
    historyToRedo();
    
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
}

async function redoCreate() { 

    redoToHistory();
    resetAllFocus();

    let partHistory = history[h].trim().split('*');
    let configScroll = document.querySelectorAll('.configScroll');

    //RUN LOOP AND STARTS AT 1
    //SINCE PARTHISTORY[0] IS JUST THE TITLE 'DELETED'
    
    for(let a = 1; a < partHistory.length; a++) {

        let f = Number(valueFinder(partHistory[a], 'ref'));

        if(partHistory[a].includes('pnlBoxPattern:')) {

            //transfer redoHistory to dataPattern
            dataPattern[f] = '*' + partHistory[a];

            //innerHTML += RE-PARSED EVERY OTHER PANEL AND CANVAS, KILLING THEIR LISTENERS AND 3D CANVASES
            restoreStack(f, restorePanel[f], restoreCanvas[f], null);
            cnvPatterns[f] = f2Canvas(f);

            panel2Focus(f2Panel(f));
        }
        
        else {

            //get datalayer
            dataLayer[f] = '*' + partHistory[a];

            //[!]NEVER USE ADDBORDER SINCE RESTOREPIN IS BETTER
            //RESTOREPIN WORKS ALSO WITH IMPORT AND AUTOSAVE
            restoreStack(f, restorePanel[f], restoreCanvas[f], restorePin[f]);

            //IF 3D MOCKUP
            if (partHistory[a].includes('pnlBox3DMockup:')) {

                showLoading();
                setTimeout( async () => {

                    let id = valueFinder(partHistory[a], 'id');
                    await recreate3DMockup(f, id);
                    hideLoading();
                    canvas2Focus(f2Canvas(f));
                }, 200)
            }
            else {
                canvas2Focus(f2Canvas(f));
            }

            //[!] ONLY ADD BORDER EVENTS HERE FOR NON-PATTERN
            //IT WILL CAUSE ERROR OUTSIDE OF THIS ELSE BLOCK
            //SINCE PATTERN HAS NO NEED FOR BORDER
            //addBorderEvents(f);
        }

        restorePanel[f] = null;
        restoreCanvas[f] = null;
        restorePin[f] = null;

    }

    document.querySelectorAll('.btnLockUnlock').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        btn.addEventListener('click', encodeLockUnlock);
    })

    document.querySelectorAll('.btnShowHide').forEach(function(btn) {
        //[!] SPECIAL CASE FOR LOCK/UNLOCK
        btn.addEventListener('click', encodeShowHide);
    })
    
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
}

///////////////////////////////////////UNDO / REDO UPLOAD///////////////////////////////

function undoUpload() {

    let partHistory = history[h].trim().split('*');

    //starts at 2 since created** has double stars
    for(let a = 1; a < partHistory.length; a++) {

        let n = Number(valueFinder(partHistory[a], "thumbno"));

        if(!isNaN(n) || n != null) {
            deleteAllThumbs(n)
        } 
        
    }

    historyToRedo();
    
    swapPanels('canvas');
    hideAllOptions();
    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
       console.log(redoHistory[a])
    }
    */
}

function redoUpload() {

    redoToHistory();
    resetAllFocus();

    let partHistory = history[h].trim().split('*');
    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');
    let configScroll = document.getElementsByClassName('configScroll');

    for(let a = 1; a < partHistory.length; a++) {

        let tempThumb = document.createElement('div');

        let n = Number(valueFinder(partHistory[a], "thumbno"));
        let f = Number(valueFinder(partHistory[a], "ref"));
        dataThumb[n] = '*' + partHistory[a];
        
        //////////////////////RESTORE THUMBS////////////////////

        for(let b = 0; b < restoreThumb.length; b++) {
            
            if(restoreThumb[b] != null) {

                if(restoreThumb[b].includes(`thumbno="${n}"`)) {

                    tempThumb.innerHTML = restoreThumb[n];

                    configScroll[2].children[0].children[0].appendChild(tempThumb.children[0])
                    
                    restoreThumb[n] = null;
                    tempThumb = null;
                }
            } 
        }

         ////////////////////REARRANGE PNLBOXTHUMBS////////////////////
         for(let b = pnlBoxThumb.length + 1; b >= 0; b--) {
            if(pnlBoxThumb[b] != null) {

                if(b > 0) {
                    let current = Number(pnlBoxThumb[b].dataset.thumbno);
                    let before = Number(pnlBoxThumb[b-1].dataset.thumbno);

                    if(current > before) {
                        configScroll[2].children[0].children[0].insertBefore(pnlBoxThumb[b], pnlBoxThumb[b-1]);
                    }
                }
                else {
                    configScroll[2].children[0].children[0].prepend(pnlBoxThumb[b]);
                } 

                //////////////////REFORMATTING PANELBOXES/////////////

                pnlBoxThumb[b].style.borderColor = "transparent";
                pnlBoxThumb[b].style.backgroundColor = "transparent";
                pnlBoxThumb[b].style.borderWidth = "1px";
   
            }
        }

    }
}

///////////////////////////////////////UNDO / REDO STACKING///////////////////////////////

function undoStacking() {
    
    let partStacking = history[h].split('*');
    let prevStack = partStacking[0];
    let ref = prevStack.split(' ');
    let cnvPin = document.getElementById('cnvPin');
    let configScroll = document.getElementsByClassName('configScroll');
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');
    
    for(let a = 1; a < ref.length; a++) {

        if(ref[a] != '') {
            let panel = configScroll[5].querySelector(`[data-ref="${ref[a]}"]`)
            configScroll[5].appendChild(panel)

            let canvas = cnvGrpLayers.querySelector(`[data-ref="${ref[a]}"]`);
            cnvGrpLayers.prepend(canvas);

            let pin = cnvPin.querySelector(`[data-ref="${ref[a]}"]`);
            cnvPin.prepend(pin);

            swapPanels(panel.dataset.type);
        }

    }
    
    rearrangeMaskingLayers();
    hideAllOptions();
    historyToRedo();
}

function redoStacking() {

    redoToHistory();

    let partStacking = history[h].split('*');
    let prevStack = partStacking[1];
    let ref = prevStack.split(' ');
    let cnvPin = document.getElementById('cnvPin');
    let configScroll = document.getElementsByClassName('configScroll');
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

    for(let a = 1; a < ref.length; a++) {

        if(ref[a] != '') {
            let panel = configScroll[5].querySelector(`[data-ref="${ref[a]}"]`)
            configScroll[5].appendChild(panel)

            let canvas = cnvGrpLayers.querySelector(`[data-ref="${ref[a]}"]`);
            cnvGrpLayers.prepend(canvas);

            let pin = cnvPin.querySelector(`[data-ref="${ref[a]}"]`);
            cnvPin.prepend(pin);

            swapPanels(panel.dataset.type);
        }

    }
    
    rearrangeCanvasLayers();
    rearrangeMaskingLayers();
}

///////////////////////////////////////UNDO / REDO RENAMING///////////////////////////////
function undoRenaming() {

    let part = history[h].split('*');
    let data = part[1].split('\n');
    let configScroll = document.getElementsByClassName('configScroll');

    let f = valueFinder(data[1], 'ref');
    let category = data[2].split(': ')[0];
    let oldTxtHeader = data[3].split(': ')[1];

    let panel = configScroll[5].querySelector(`[data-ref="${f}"]`);

    panel.querySelector('.txtHeader').value = oldTxtHeader;

    /////////////////ENCODE ALL REF DATA TOO///////////////
    if(category == "pnlBoxPattern") {
        dataSwitcher(dataPattern, f, category, oldTxtHeader);
    }
    else {
        dataSwitcher(dataLayer, f, category, oldTxtHeader)
    }

    swapPanels(panel.dataset.type);
    hideAllOptions();
    historyToRedo();
}

function redoRenaming() {

    redoToHistory();

    let part = history[h].split('*');
    let data = part[1].split('\n');
    let configScroll = document.getElementsByClassName('configScroll');

    let f = valueFinder(data[1], 'ref');
    let category = data[2].split(': ')[0];
    let newTxtHeader = data[2].split(': ')[1];

    let panel = configScroll[5].querySelector(`[data-ref="${f}"]`);
    panel.querySelector('.txtHeader').value = newTxtHeader;

    /////////////////ENCODE ALL REF DATA TOO///////////////
    if(category == "pnlBoxPattern") {
        dataSwitcher(dataPattern, f, category, newTxtHeader);
    }
    else {
        
        dataSwitcher(dataLayer, f, category, newTxtHeader)
    }

    swapPanels(panel.dataset.type)
}

///////////////////////////////UNDO / REDO EDITING FOR EDITING TEXT///////////////////////////

function undoEditing() {
    
    let part = history[h].split('*');

    for(let a = 1; a < part.length; a++) {

        if(part[a] != null && part[a].trim().length > 0) {

            let data = part[a].split('_');

            let width = valueFinder(data[1], 'txtWidthLayer');
            let height = valueFinder(data[1], 'txtHeightLayer');
            let x = valueFinder(data[1], 'txtXLayer');
            let y = valueFinder(data[1], 'txtYLayer');
            let innerText = decodeText(valueFinder(data[1], 'innerText'));
        
            let f = valueFinder(data[0], 'ref');
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.style.left = x + 'px';
            canvas.style.top = y + 'px';

            canvas.children[0].innerText = innerText;

            inputFormatResizeBox(f);
        }
    }
    
    hideAllOptions();
    historyToRedo();
}

function redoEditing() {

    redoToHistory();

    let part = history[h].split('*');

    for(let a = 1; a < part.length; a++) {

        if(part[a] != null && part[a].trim().length > 0) {

            let data = part[a].split('_');

            let width = valueFinder(data[0], 'txtWidthLayer');
            let height = valueFinder(data[0], 'txtHeightLayer');
            let x = valueFinder(data[0], 'txtXLayer');
            let y = valueFinder(data[0], 'txtYLayer');
            let innerText = decodeText(valueFinder(data[0], 'innerText'));
        
            let f = valueFinder(data[0], 'ref');
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.style.left = x + 'px';
            canvas.style.top = y + 'px';

            canvas.children[0].innerText = innerText;

            inputFormatResizeBox(f);
        }
    }
}

///////////////////////////////UNDO / REDO EDITING FOR SELECT ALL///////////////////////////

//[!] NO ref: FIELD - THERE IS NO SINGLE ref FOR A SELECT-ALL. Retitled* OMITS IT TOO,
//[!] SO THE makeNewHistory BUFFER-FULL SWEEP ALREADY HANDLES A ref-LESS RECORD
function encodeSelectAll(target, selected) {

    let tempHistory = "";
    tempHistory = "\nSelect All*";
    tempHistory += `\ntarget: ${target}`;
    tempHistory += `\nselected: ${selected}`;
    tempHistory += `\n_`;
    tempHistory += `\ntarget: ${target}`;
    tempHistory += `\nselected: ${!selected}`;

    makeNewHistory(tempHistory);
}

function undoSelectAll() {

    let part = history[h].split('*');
    let data = part[1].split('_');

    //[!] data[1] IS THE OLD STATE, SAME CONVENTION AS undoTitle
    selectAllTarget(valueFinder(data[1], 'target'), valueFinder(data[1], 'selected') == "true");

    resetLeadDrag();
    hideAllOptions();
    //transfer to redo
    historyToRedo();
}

function redoSelectAll() {

    //transfer back to history
    redoToHistory();

    let part = history[h].split('*');
    let data = part[1].split('_');

    //[!] data[0] IS THE NEW STATE
    selectAllTarget(valueFinder(data[0], 'target'), valueFinder(data[0], 'selected') == "true");
}

///////////////////////////////UNDO / REDO REMOVE BACKGROUND///////////////////////////

function undoRemoveBackground() {

    let f = valueFinder(history[h], 'ref');
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let img = canvas.querySelector('img');

    let part = history[h].split('_');
    let source = valueFinder(part[1], 'newImageSource')
    //A HIDDEN LAYER STAYS HIDDEN, THE EYE IS THE TRUTH
    let show = f2Panel(f).querySelector('.btnShowHide').dataset.show;

    canvas.style.visibility = "hidden";
    img.src = source;
    img.onload = function() {
        canvas.style.visibility = show;
    }

    dataLayer[f] = valueSwitcher(dataLayer[f], 'newImageSource', source);
    hideAllOptions();

    historyToRedo();
}

function redoRemoveBackground() {

    redoToHistory();

    let f = valueFinder(history[h], 'ref');
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let img = canvas.querySelector('img');

    let part = history[h].split('_');
    let source = valueFinder(part[0], 'newImageSource')
    let show = f2Panel(f).querySelector('.btnShowHide').dataset.show;

    canvas.style.visibility = "hidden";
    img.src = source;
    img.onload = function() {
        canvas.style.visibility = show;
    }

    dataLayer[f] = valueSwitcher(dataLayer[f], 'newImageSource', source);
    hideAllOptions();
    
}

///////////////////////////////UNDO / REDO REMOVE BACKGROUND///////////////////////////

function undoTitle() {

    let part = history[h].split('*');
    let data = part[1].split('_');
    let txtProjectTitle = document.getElementById('txtProjectTitle');

    txtProjectTitle.value = purifyTitle(valueFinder(data[1], "title"));

    dataTitle = valueSwitcher(dataTitle, 'title', txtProjectTitle.value);

    hideAllOptions();
    historyToRedo();
}

function redoTitle() {

    redoToHistory();

    let part = history[h].split('*');
    let data = part[1].split('_');
    let txtProjectTitle = document.getElementById('txtProjectTitle');

    txtProjectTitle.value = purifyTitle(valueFinder(data[0], "title"));

    dataTitle = valueSwitcher(dataTitle, 'title', txtProjectTitle.value);

}

///////////////////////////////UNDO / REDO SWITCHING 2D 3D MODES/////////////////////////
function undoSwitchMode() {

    let chkMode = document.getElementById('chkMode');
    pauseEncoding();

    chkMode.click();
    chkMode.dispatchEvent(new Event ('pointerleave'));
    resumeEncoding();

    hideAllOptions();
    historyToRedo();
}

function redoSwitchMode() {
    redoToHistory();

    let chkMode = document.getElementById('chkMode');

    pauseEncoding();
    chkMode.click();
    chkMode.dispatchEvent(new Event ('pointerleave'));
    resumeEncoding();

}

///////////////////////////////UNDO / REDO SWITCHING SOLID TO GRADIENT/////////////////////////
function undoSwitchColor() {

    let part = history[h].split('*');
    let data = part[1].split('_');
    let colorManagerPanel = document.getElementById('colorManagerPanel');
    let colorPickerPanel = document.getElementById('colorPickerPanel');
    //GET PREVIOUS COLOR SWITCH 
    let oldColor = valueFinder(data[1], 'color');

    //THE SWITCH BUTTON ONLY FLIPS THE OPEN PANEL. IT NEVER PUT THE OLD COLOR BACK ON THE LAYER:
    //undo() CLEARS THE SELECTION BEFORE THIS RUNS, SO THE change IT FIRES PAINTED NOTHING AND
    //dataLayer KEPT THE GRADIENT. MEASURED ON THE LIVE APP 2026-09-28: UNDOING Solid -> Gradient
    //WITH THE MANAGER OPEN LEFT THE INPUT ON 637499 WHILE THE LAYER AND dataLayer STAYED
    //linear-gradient(...). THE BUTTON STILL FLIPS THE PANEL, THEN undoProperties - THE SAME PATH
    //THE CLOSED-PANEL CASE ALREADY TAKES - FOCUSES THE LAYER, RESTORES THE EXACT OLD VALUE AND
    //MOVES THE STEP TO REDO
    //IF IT'S SOLID THEN CLICK SOLID SWITCH
    if(oldColor == "Solid") {
        if(colorManagerPanel.dataset.show == "true") {
            //TEMPORARILY REMOVE ENCODING TO AVOID ADDING ANOTHER PARADOX HISTORY
            btnSwitchSolid.removeEventListener('click', encodeColorSwitch);
            btnSwitchSolid.click();
            //ADD AGAIN
            btnSwitchSolid.addEventListener('click', encodeColorSwitch);
        }

        undoProperties();
    }
    //IF IT'S GRADIENT THEN CLICK BACK GRADIENT
    else if(oldColor == "Gradient") { 
        if(colorPickerPanel.dataset.show == "true") {
            //TEMPORARILY REMOVE ENCODING TO AVOID ADDING ANOTHER PARADOX HISTORY
            btnSwitchGradient.removeEventListener('click', encodeColorSwitch);
            btnSwitchGradient.click();
            //ADD AGAIN
            btnSwitchGradient.addEventListener('click', encodeColorSwitch);
        }

        undoProperties();
    }

    hideAllOptions();
    /*
    console.clear();
    for(let a = 1; a < maxH; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 1; a < maxH; a++) {
       console.log(redoHistory[a])
    }
    */
}

function redoSwitchColor() {

    redoToHistory();
    let part = history[h].split('*');
    let data = part[1].split('_');
    //GET PREVIOUS COLOR SWITCH 
    let newColor = valueFinder(data[0], 'color');

    //SAME AS undoSwitchColor: THE BUTTON FLIPS THE PANEL, redoProperties PUTS THE VALUE ON THE
    //LAYER. IT MOVES THE STEP ITSELF, SO THE ONE redoToHistory ABOVE IS HANDED BACK FIRST
    //IF IT'S SOLID THEN CLICK SOLID SWITCH
    if(newColor == "Solid") {
        if(colorManagerPanel.dataset.show == "true") {
            
            //TEMPORARILY REMOVE ENCODING TO AVOID ADDING ANOTHER PARADOX HISTORY
            btnSwitchSolid.removeEventListener('click', encodeColorSwitch);
            btnSwitchSolid.click();
            //ADD AGAIN
            btnSwitchSolid.addEventListener('click', encodeColorSwitch);
        }

        historyToRedo();
        redoProperties();
    }
    //IF IT'S GRADIENT THEN CLICK BACK GRADIENT
    else {
        if(colorPickerPanel.dataset.show == "true") {
           
            //TEMPORARILY REMOVE ENCODING TO AVOID ADDING ANOTHER PARADOX HISTORY
            btnSwitchGradient.removeEventListener('click', encodeColorSwitch);
            btnSwitchGradient.click();
            //ADD AGAIN
            btnSwitchGradient.addEventListener('click', encodeColorSwitch);
        }

        historyToRedo();
        redoProperties();
    }
    /*
    console.clear();
    for(let a = 1; a < maxH; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 1; a < maxH; a++) {
       console.log(redoHistory[a])
    }
    */
}

///////////////////////////////UNDO / REDO LOCKING PANEL/////////////////////////
function undoLockUnlock() {

    pauseEncoding();

    let f = valueFinder(history[h], 'ref');
    let configScroll = document.querySelectorAll('.configScroll')[5];

    let panel = configScroll.querySelector(`[data-ref="${f}"]`);
    let btnLockUnlock = panel.querySelector('.btnLockUnlock');

    btnLockUnlock.click();
    
    resumeEncoding();
    historyToRedo();

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
}

function redoLockUnlock() {

    redoToHistory();
    pauseEncoding();

    let f = valueFinder(history[h], 'ref');
    let configScroll = document.querySelectorAll('.configScroll')[5];

    let panel = configScroll.querySelector(`[data-ref="${f}"]`);
    let btnLockUnlock = panel.querySelector('.btnLockUnlock');
    btnLockUnlock.click();
    
    resumeEncoding();

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
}

///////////////////////////////UNDO / REDO SHOW HIDE PANEL/////////////////////////
function undoShowHide() {

    pauseEncoding();

    let f = valueFinder(history[h], 'ref');
    let configScroll = document.querySelectorAll('.configScroll')[5];

    let panel = configScroll.querySelector(`[data-ref="${f}"]`);
    let btnShowHide = panel.querySelector('.btnShowHide');

    btnShowHide.click();

    //SAME AS EVERY OTHER LAYER STEP, THE LAYER COMES BACK FOCUSED SO A HIDDEN ONE KEEPS ITS BOUNDARY
    panel2Focus(panel);
    
    resumeEncoding();
    historyToRedo();

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
}

function redoShowHide() {

    redoToHistory();
    pauseEncoding();

    let f = valueFinder(history[h], 'ref');
    let configScroll = document.querySelectorAll('.configScroll')[5];

    let panel = configScroll.querySelector(`[data-ref="${f}"]`);
    let btnShowHide = panel.querySelector('.btnShowHide');

 
    btnShowHide.click();

    panel2Focus(panel);
    
    resumeEncoding();

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
}

///////////////////////////////UNDO / REDO SWITCH FONT/////////////////////////
//A Modified* ENTRY WOULD NOT WORK HERE. fontName AND fontClass MATCH NONE OF
//undoProperties' CATEGORY BRANCHES, SO IT WOULD UPDATE dataLayer AND LEAVE THE CANVAS
//UNTOUCHED. ONE ENTRY CARRIES EVERY SWAPPED LAYER, SO ONE UNDO REVERTS THE WHOLE SWAP
function switchFontReplay(source) {

    pauseEncoding();

    let partHistory = source.trim().split('*');

    for(let a = 1; a < partHistory.length; a++) {

        let data = partHistory[a].split('_');
        let f = Number(valueFinder(data[0], 'ref'));

        applyFontToLayer(f, valueFinder(data[1], 'fontName'), valueFinder(data[1], 'fontClass'), valueFinder(data[1], 'dropdown 1'));
    }

    resumeEncoding();
}

///////////////////////////////UNDO / REDO SWITCH IMAGE/////////////////////////
//THE ENTRY CARRIES REFERENCES, NOT base64: thumbno FOR AN UPLOAD, imageLink FOR A PEXELS
//PHOTO. resolveImageSource TURNS EITHER BACK INTO A PICTURE - dataThumb IS INSTANT AND
//OFFLINE, A LINK IS A FETCH. A FETCH THAT FAILS LEAVES THE RETRY OVERLAY ON THE LAYER RATHER
//THAN A BROKEN BOX (sir, 2026-09-24).
//
//async, AND THE ONLY async VERB IN THIS FILE. historyToRedo AND THE FOCUS RUN BEFORE THE
//await SO THE STACK IS ALREADY CORRECT WHILE THE PICTURES ARE STILL LOADING
async function switchImageReplay(source, side) {

    pauseEncoding();

    try {

        let partHistory = source.trim().split('*');

        for(let a = 1; a < partHistory.length; a++) {

            let data = partHistory[a].split('_');
            let f = Number(valueFinder(data[0], 'ref'));

            //data[0] IS THE NEW SIDE, data[1] THE OLD ONE
            let want = data[side];

            let thumbno = valueFinder(want, 'thumbno');
            let filename = valueFinder(want, 'filename') || "";
            let link = valueFinder(want, 'imageLink') || "";

            let src = await resolveImageSource(thumbno, link);

            if(src == null) {

                //THE REFERENCES STILL MOVE. THE LAYER IS THAT PICTURE NOW EVEN THOUGH THE
                //PIXELS COULD NOT BE FETCHED, AND THE OVERLAY CARRIES THE SAME REFERENCES SO
                //A RETRY FINISHES THE JOB
                dataLayer[f] = valueSwitcher(dataLayer[f], 'thumbno', thumbno);
                dataLayer[f] = valueSwitcher(dataLayer[f], 'filename', filename);
                dataLayer[f] = valueSwitcher(dataLayer[f], 'imageLink', link);

                showImageFailed(f, thumbno, link);
                continue;
            }

            applyImageToLayer(f, src, thumbno, filename, link);
        }
    }
    finally {
        resumeEncoding();
    }
}

function undoSwitchImage() {

    let partHistory = history[h].trim().split('*');
    let source = history[h];

    let f = Number(valueFinder(partHistory[1].split('_')[0], 'ref'));

    panel2Focus(f2Panel(f));
    historyToRedo();

    switchImageReplay(source, 1);
}

function redoSwitchImage() {

    redoToHistory();

    let partHistory = history[h].trim().split('*');

    panel2Focus(f2Panel(Number(valueFinder(partHistory[1].split('_')[0], 'ref'))));

    switchImageReplay(history[h], 0);
}

function undoSwitchFont() {

    let partHistory = history[h].trim().split('*');

    switchFontReplay(history[h]);

    let f = Number(valueFinder(partHistory[1].split('_')[0], 'ref'));

    panel2Focus(f2Panel(f));
    historyToRedo();
}

function redoSwitchFont() {

    redoToHistory();

    let partHistory = history[h].trim().split('*');

    //REDO APPLIES THE NEW SIDE, SO THE BLOCK BEFORE THE UNDERSCORE
    pauseEncoding();

    for(let a = 1; a < partHistory.length; a++) {

        let data = partHistory[a].split('_');
        let f = Number(valueFinder(data[0], 'ref'));

        applyFontToLayer(f, valueFinder(data[0], 'fontName'), valueFinder(data[0], 'fontClass'), valueFinder(data[0], 'dropdown 1'));
    }

    resumeEncoding();

    panel2Focus(f2Panel(Number(valueFinder(partHistory[1].split('_')[0], 'ref'))));
}

///////////////////////////////UNDO / REDO REMOVE MOCKUP/////////////////////////
function undoRemoveMockup() {

    pauseEncoding();

    let f = Number(valueFinder(history[h], 'ref'));
    let thumbno = valueFinder(history[h], 'thumbno');

    panel2Focus(f2Panel(f));

    let dropOptionImage = document.querySelector('.tabMockupBox').querySelectorAll('.dropOptionVerti')[1];
    let opt = dropOptionImage.querySelector(`[data-thumbno="${thumbno}"]`);

    // THE UPLOAD CAN BE GONE. BAIL QUIETLY RATHER THAN THROW - UNDO RUNS BACKWARDS, SO A
    //DELETED UPLOAD IS RESTORED BEFORE UNDO EVER REACHES THIS ENTRY IN NORMAL USE
    if(opt != null) {
        opt.dispatchEvent(new PointerEvent('pointerdown', {bubbles: false}));
    }

    resumeEncoding();
    historyToRedo();
}

function redoRemoveMockup() {

    redoToHistory();
    pauseEncoding();

    let f = Number(valueFinder(history[h], 'ref'));
    let area = valueFinder(history[h], 'area');

    panel2Focus(f2Panel(f));

    showLoading();
    setTimeout(() => {
        removeTexture(f, area);
        hideLoading();
    }, 200)

    resumeEncoding();
}

///////////////////////////////UNDO / REDO SHOW HIDE PANEL/////////////////////////
function undoMaskUnmask() {

    pauseEncoding();

    let f = valueFinder(history[h], 'ref');
    let configScroll = document.querySelectorAll('.configScroll')[5];

    let panel = configScroll.querySelector(`[data-ref="${f}"]`);
    let btnMaskUnmask = panel.querySelector('.btnMaskUnmask');

    btnMaskUnmask.click();
    
    resumeEncoding();
    historyToRedo();

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
}

function redoMaskUnmask() {

    redoToHistory();
    pauseEncoding();

    let f = valueFinder(history[h], 'ref');
    let configScroll = document.querySelectorAll('.configScroll')[5];

    let panel = configScroll.querySelector(`[data-ref="${f}"]`);
    let btnMaskUnmask = panel.querySelector('.btnMaskUnmask');

 
    btnMaskUnmask.click();
    
    resumeEncoding();

    /*
    console.clear();
    for(let a = 0; a < 10; a++) {
    console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < 10; a++) {
    console.log(redoHistory[a])
    }
    */
}


//=====================REPLAY ONE sel VALUE (UNDO AND REDO SHARE THIS)=====================
//THE TWO BRANCHES WERE COPIES THAT CLICKED THE BUTTON NAMED BY THE VALUE. THAT WAS WRONG TWICE:
//
//1. THE CASE BUTTONS TOGGLE. adjustTextTransform TESTS currCase, SO CLICKING THE BUTTON THAT IS
//   ALREADY ON TURNS IT OFF - AND 'none' HAS NO BUTTON AT ALL, SO AN UNDO BACK TO NO CASING DID
//   NOTHING. currCase IS SET FROM THE LAYER ON FOCUS (decodeData3, VIA THE panel2Focus EACH BLOCK
//   RUNS FIRST), SO IT IS THIS LAYER'S VALUE HERE.
//
//2. EVERY sel HANDLER (CASE, RESIZE, ALIGN) APPLIES TO ALL OF focusPanel, AND panel2Focus KEEPS
//   EARLIER BLOCKS FOCUSED - SO A STEP COVERING TWO LAYERS GAVE THE FIRST ONE THE SECOND'S VALUE.
//   THE SAME ISOLATION THE LINE DROPDOWNS USE: focusPanel IS JUST THIS LAYER FOR THE CLICK
function replaySelection(pnlBox, category, key, f) {

    let selection = pnlBox != null ? pnlBox.querySelector(`.${category}`) : null;

    if(selection == null) return;

    let target = key;

    if(category == 'selTextCase') {

        if(key == currCase) return;

        if(key == 'none') target = currCase;
    }

    let btn = null;

    for(let d = 0; d < selection.childElementCount; d++) {
        if(selection.children[d].className == 'btn' + target) btn = selection.children[d];
    }

    if(btn == null) return;

    let keepFocus = focusPanel;

    try {
        if(f != null) {
            focusPanel = [];
            focusPanel[f] = f2Panel(f);
        }

        btn.click();
    }
    finally {
        focusPanel = keepFocus;
    }
}

function undo() {
    
    if(h > 0) {

        //ONE STEP, ONE SELECTION. sir, 2026-09-26: "undoing makes a double focus or multi select
        //going backwards ... need to fix the history focus and must not overlap". panel2Focus ADDS
        //TO THE SELECTION - RIGHT INSIDE ONE STEP, SO A TWO-LAYER MOVE RE-SELECTS BOTH - BUT NOTHING
        //CLEARED IT BETWEEN STEPS, SO EACH UNDO KEPT THE LAST ONE'S LAYERS. ONLY A STEP THAT NAMES A
        //LAYER (ref:) CLEARS: UNDOING A CANVAS, SETTINGS, TITLE OR STACKING STEP FOCUSES NOTHING,
        //AND CLEARING THERE WOULD JUST DROP THE USER'S CURRENT SELECTION FOR NO REASON
        if(history[h].includes('\nref: ')) resetAllFocus();

        if(history[h].includes('Modified*')) {
           
            undoProperties();
        }
        else if(history[h].includes('Created*')) {
            undoCreate();  
        }
        else if(history[h].includes('Deleted*')) {

            undoDelete()

        }
        else if(history[h].includes('Uploaded*')) {
            undoUpload();
        }
        else if(history[h].includes('Stacked:')) {
            undoStacking();
        }
        else if(history[h].includes('Renamed*')) {
            undoRenaming();
        }
        else if(history[h].includes('Edited*')) {
            undoEditing();
        }
        else if(history[h].includes('Select All*')) {
            undoSelectAll();
        }
        else if(history[h].includes('Remove Background*')) {
            undoRemoveBackground();
        }
        else if(history[h].includes('Switch Mode*')) {
            undoSwitchMode();
        }
        else if(history[h].includes('Retitled*')) {
            undoTitle();
        }
        else if(history[h].includes('Switch Color*')) {
            undoSwitchColor();
        }
        else if(history[h].includes('Locked*')) {
            undoLockUnlock();
        }
        else if(history[h].includes('Showed*')) {
            undoShowHide();
        }
        else if(history[h].includes('Masked*')) {
            undoMaskUnmask();
        }
        else if(history[h].includes('Switch Font*')) {
            undoSwitchFont();
        }
        else if(history[h].includes('Switch Image*')) {
            undoSwitchImage();
        }
        else if(history[h].includes('Removed Mockup*')) {
            undoRemoveMockup();
        }

        //A RESTORED CANVAS CARRIES THE BLEED OF WHATEVER ZOOM IT WAS SNAPPED AT
        bleedFillLayers();
    }
    else {
        resetAllFocus();   
    }
}

function redo() {
    //limit the redo

    if(rh > 0) {

        //SAME RULE AS undo()
        if(redoHistory[rh].includes('\nref: ')) resetAllFocus();

        if(redoHistory[rh].includes('Modified*')) {
            redoProperties();
        }
        else if(redoHistory[rh].includes('Created*')) {
            
            redoCreate()
               
        }
        else if(redoHistory[rh].includes('Deleted*')) {
            redoDelete();
        }
        else if(redoHistory[rh].includes('Uploaded*')) {  
            redoUpload();
        }
        else if(redoHistory[rh].includes('Stacked:')) {
            redoStacking();
        }
        else if(redoHistory[rh].includes('Renamed*')) {
            redoRenaming();
        }
        else if(redoHistory[rh].includes('Edited*')) {
            redoEditing();
        }
        else if(redoHistory[rh].includes('Select All*')) {
            redoSelectAll();
        }
        else if(redoHistory[rh].includes('Remove Background*')) {
            redoRemoveBackground();
        }
        else if(redoHistory[rh].includes('Switch Mode*')) {
            redoSwitchMode();
        }
        else if(redoHistory[rh].includes('Retitled*')) {
            redoTitle();
        }
        else if(redoHistory[rh].includes('Switch Color*')) {
            redoSwitchColor();
        }
        else if(redoHistory[rh].includes('Locked*')) {
            redoLockUnlock();
        }
        else if(redoHistory[rh].includes('Showed*')) {
            redoShowHide();
        }
        else if(redoHistory[rh].includes('Masked*')) {
            redoMaskUnmask();
        }
        else if(redoHistory[rh].includes('Switch Font*')) {
            redoSwitchFont();
        }
        else if(redoHistory[rh].includes('Switch Image*')) {
            redoSwitchImage();
        }
        else if(redoHistory[rh].includes('Removed Mockup*')) {
            redoRemoveMockup();
        }

        bleedFillLayers();
    } 
}
