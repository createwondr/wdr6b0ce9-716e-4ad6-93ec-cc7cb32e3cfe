let leadPanel;
let firstPanel;
let focusObj = [];
let focusPanel = [];
let ctrlAFocus;

let resX;
let resY;
let selectedAll = false;

//=============CHECK DOCUMENT CLICKS TO HIDE DROPDOWN MENUS ===========

function linkCanvasWithPanelLayer(key, pin) {
    
    let f = Number(pin.dataset.ref);
    let configScroll = document.getElementsByClassName('configScroll');
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)
    let panel = configScroll[5].querySelector(`[data-ref="${f}"]`);
    let txtHeader = configScroll[5].querySelectorAll('.txtHeader');

    if(key == null) {
        
        if(checkObjFocusCount() > 1) {

            if(checkCanvasFocusBool(canvas)) {
                chooseLeadDrag(pin)
                leadPanel = panel;
                hideAllContextMenu();
            }
            else {
                resetAllFocus();
                canvas2Focus(canvas);
                firstPanel = panel;
            }

        }
        else {
            
            if(pin != leadDrag) resetAllFocus();
            canvas2Focus(canvas);
            firstPanel = panel;
        }

    }

    else if(key == 'ctrl') {
        
        if(checkPanelFocusBool(panel)) {

            canvasUnfocus(f)
        }

        else {

            if(checkObjFocusCount() <= 1) {
                firstPanel = panel;
            }
            
            //blur all txtHeaders
            for(let a = 0; a < txtHeader.length; a++) {
                txtHeader[a].blur();
            }
            
            //remove other pnlboxthumb focus
            thumbUnfocusAll();
            canvas2Focus(canvas);
        }

    }

    //[!] FOCUS JUST CHANGED SO THE FLAG HAS TO FOLLOW. EVERY LAYER FOCUSED IS SELECT ALL,
    //WHICH IS ALSO TRUE THE MOMENT A LONE LAYER IS CLICKED OR RIGHT CLICKED
    selectedAll = checkObjFocusCount() == cnvGrpLayers.querySelectorAll('.cnvLayers').length;
}

//=====================CHOOSE LEAD DRAG================================
function chooseLeadDrag(pin) {

    if(checkObjFocusCount() > 1) {

        //this function will reset which should be on top
        resetLeadDrag();

        leadDrag = pin;
        leadDragX = leadDrag.offsetLeft;
        leadDragY = leadDrag.offsetTop;
    }

    else if (checkObjFocusCount() <= 1) {

        //EVERY PIN STAYS AT 0 IN LAYER ORDER, SO A PRESS ALWAYS SELECTS WHAT IS REALLY ON TOP. A FOCUSED PIN
        //RAISED TO 1 USED TO SWALLOW EVERY PRESS INSIDE ITS BOX, SO THE LAYER ABOVE IT COULD NOT BE SELECTED
        for(let a = 0; a < pinBody.length; a++) {
            if(pinBody[a] != null) {
                pinBody[a].style.zIndex = "0";
            }
        }

        leadDrag = pin;
        leadDragX = leadDrag.offsetLeft;
        leadDragY = leadDrag.offsetTop;
        leadDragR = leadDrag.dataset.rotation;
        leadDragW = leadDrag.offsetWidth;
        leadDragH = leadDrag.offsetHeight;
    }
}

function resetLeadDrag() {
    
    let cnvPin = document.getElementById('cnvPin');

    for(let a = 0; a < cnvPin.childElementCount; a++) {
        
        if(cnvPin.children[a].className == 'pinBody') {
            cnvPin.children[a].style.zIndex = "0";
        }
    }

    leadDrag = null;
}

//==================RESET ALL FOCUS==================================
function resetAllFocus() {

    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');
    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');
    let cnvPin = document.getElementById('cnvPin');

    //[!]DO NOT USE PANELUNFOCUSALL AND CANVASUNFOCUSALL
    //THERE'S CONFLICT IN THUMBNAIL AS PNLBOXLAYER
    
    for(let a = 0; a < pnlBoxThumb.length; a++) {
        
        if(pnlBoxThumb[a] != null) {

            pnlBoxThumb[a].style.borderColor = "transparent";
            pnlBoxThumb[a].style.backgroundColor = "transparent";
            pnlBoxThumb[a].style.borderWidth = "1px";
            focusPanel[a] = null;
        }
    }

    for(let a = 0; a < pnlBoxLayer.length; a++) {
        
        if(pnlBoxLayer[a] != null) {

            //HIDDEN LAYERS LOSE THEIR BOUNDARY ON A FULL RESET
            let btn = pnlBoxLayer[a].querySelector('.btnShowHide');
            let pin = f2PinBody(pnlBoxLayer[a].dataset.ref);
            if(btn != null && pin != null && btn.dataset.show == "hidden") pin.style.visibility = "hidden";

            pnlBoxLayer[a].style.background = "transparent";
            pnlBoxLayer[a] = null;
            focusPanel[a] = null;
        }
    }

    for(let a = 0; a < focusObj.length; a++) {
        focusObj[a] = null;
    }

    for(let a = 0; a < focusPanel.length; a++) {
        focusPanel[a] = null;
    }

    //THROUGH THE ONE OWNER NOW THAT NOTHING IS FOCUSED, A DIRECT NULL LEFT ITS RECORD STALE
    moveableUpdateTargets();
    
    for(let a = 0; a < cnvLayers.length; a++) {

        if(cnvLayers[a] != null && cnvLayers[a].children[0] != null) {

            if(cnvLayers[a].children[0].className == "textArea") {

                cnvLayers[a].children[0].blur();
            }
        }
    }

    document.querySelectorAll(`input`).forEach((input)=> {
        input.blur();
    })

    //[!] NEVER ADD ISDRAGGING, ISRESIZING, ISROTATING, ISSELECTING 
    // AS IT WILL VOID THEIR VALUES EVERYTIME CHANGING FOCUS
    leadPanel = null;
    firstPanel = null;
    selectedAll = false;
    isOptionVisible = false;

    highlight = false;
        
    hideAllContextMenu();
    hideAllOptions();
    resetLeadDrag();

    //THE SINGLE CANCEL HOOK FOR EITHER SWAP MODE. deleteObject CALLS resetAllFocus, AND SO
    //DOES THE OUTSIDE CLICK else, SO BOTH CANCEL PATHS ARRIVE HERE
    cancelSwap();
}

//==================RESET ALL DATA==================================
function resetAllData() {
    
    dataCanvas = null;
    dataEnv = null;
    dataMode = null;

    for(let a = 0; a < dataPattern.length; a++) {
        dataPattern[a] = "";
        dataPattern[a] = null;
    }
    for(let a = 0; a < dataLayer.length; a++) {
        dataLayer[a] = "";
        dataLayer[a] = null;
    }
    for(let a = 0; a < data3D.length; a++) {
        data3D[a] = "";
        data3D[a] = null;
    }
}

//==================RESET ALL HISTORY AND REDO========================
function resetAllHistory() {
    for(let a = 0; a < h; a++) {
        history[a] = null;
    }
    for(let a = 0; a < rh; a++) {
        redoHistory[a] = null;
    }
    
    h = 0;
    rh = 0;
}

//====================DECODE DATA================

//sir, 2026-09-28: "import with gradient ... shows on txt...Color input a default solid color:
//A9AEFF from default html value ... when click the thumbnail it works like the input value is
//the actual color and wiped the gradient". THE THUMB CLICK IN delegation.js AND testHexCode TELL
//A GRADIENT FROM A SOLID BY THE INPUT'S TEXT, BUT EVERY GRADIENT BRANCH THAT LOADS A LAYER INTO
//THE SHARED PANEL WROTE ONLY dataset.gradient - SO THE TEXT STAYED WHATEVER THAT INPUT LAST
//SHOWED: THE HTML DEFAULT AFTER AN IMPORT, OR ANOTHER LAYER'S HEX AFTER A LAYER SWITCH, AND THE
//SOLID PICKER OPENED ON IT AT 0% ALPHA. ONE WRITER FOR ALL SIX, SO THE LABEL ALWAYS GOES WITH IT
function showGradientInInput(input, gradient) {

    input.value = gradient.includes('radial-gradient') ? "Radial" : "Linear";
    input.dataset.alpha = "";
    input.dataset.gradient = gradient;
    input.nextElementSibling.children[1].style.background = gradient;
}

function decodeData3() {

    if(leadPanel != null) {

        pauseEncoding();

        let f = Number(leadPanel.dataset.ref);

        //THE DISPATCHED OPTIONS PAINT EVERY FOCUSED LAYER, THE PANEL ONLY DESCRIBES THE LEAD
        let keepFocus = focusPanel;
        focusPanel = [];
        focusPanel[f] = leadPanel;

        let type = leadPanel.dataset.type.replace(leadPanel.dataset.type.charAt(0), leadPanel.dataset.type.charAt(0).toUpperCase());
        let panel = document.getElementById(`pnlBox${type}`);

        panel.querySelectorAll(`input[type="text"], input[type="number"]`).forEach(input => {
            input.blur();
        })
        
        if(leadPanel.dataset.type == "pattern") {

            panel.querySelector(`.txtXPattern`).value = valueFinder(dataPattern[f], `txtXPattern`);
            panel.querySelector(`.txtYPattern`).value = valueFinder(dataPattern[f], `txtYPattern`);
            panel.querySelector(`.txtSizePattern`).value = valueFinder(dataPattern[f], `txtSizePattern`);
            panel.querySelector(`.txtOpacityPattern`).value = valueFinder(dataPattern[f], `txtOpacityPattern`);
            panel.querySelector(`.txtRotationPattern`).value = valueFinder(dataPattern[f], `txtRotationPattern`);
            panel.querySelector(`.txtRandomSpinPattern`).value = valueFinder(dataPattern[f], `txtRandomSpinPattern`);

            panel.querySelector(`.txtStrokeWidthPattern`).value = valueFinder(dataPattern[f], `txtStrokeWidthPattern`);

            //VALIDATION FOR COLOR VALUE
            //IF SOLID RGBA CONVERT TO HEX
            //IF GRADIENT THEN SHOW 'LINEAR' OR 'RADIAL'
            if(valueFinder(dataPattern[f], `txtColorPattern`).includes('gradient')) {
                showGradientInInput(panel.querySelector(`.txtColorPattern`), valueFinder(dataPattern[f], `txtColorPattern`));
            }
            else {
               
                let hex = rgbaString2HexEncoding(valueFinder(dataPattern[f], `txtColorPattern`));
                let alpha = alphaFinder(dataPattern[f], 'txtColorPattern');
            
                panel.querySelector(`.txtColorPattern`).value = hex;
                panel.querySelector(`.txtColorPattern`).dataset.gradient = "";
                panel.querySelector(`.txtColorPattern`).dataset.alpha = alpha;
                panel.querySelector(`.txtColorPattern`).nextElementSibling.children[1].style.background = valueFinder(dataPattern[f], `txtColorPattern`);
            }

            panel.querySelector(`.txtScalingPattern`).value = valueFinder(dataPattern[f], `txtScalingPattern`);
            panel.querySelector(`.txtSpacingPattern`).value = valueFinder(dataPattern[f], `txtSpacingPattern`);
            
            panel.querySelector(`.chkRandomSeed`).dataset.value = valueFinder(dataPattern[f], `chkRandomSeed`);
            chkBoxFormat(panel.querySelector(`.chkRandomSeed`));
            
            panel.querySelectorAll(`.dropdown`)[0].children[0].innerText =  valueFinder(dataPattern[f], `dropdown 0`);
            panel.querySelectorAll(`.dropdown`)[1].children[0].innerText =  valueFinder(dataPattern[f], `dropdown 1`);
            panel.querySelectorAll(`.dropdown`)[2].children[0].innerText =  valueFinder(dataPattern[f], `dropdown 2`);

            //MUTE AND COVER RANDOM SEED IF THIS LAYER SITS ON A PRESET THAT IGNORES IT
            coverPatternPreset(valueFinder(dataPattern[f], `dropdown 2`));

            //SHOW OR HIDE STROKE WIDTH FOR PATTERN
            //DEPENDS ON WHAT IS THE DROPDOWN PART VALUE
            if(panel.querySelectorAll(`.dropdown`)[1].children[0].innerText == "Stroke") {
                document.querySelector('.txtStrokeWidthPattern').closest('.pnlEntry').style.display = "flex";
            }
            else if(panel.querySelectorAll(`.dropdown`)[1].children[0].innerText == "Fill") {
                document.querySelector('.txtStrokeWidthPattern').closest('.pnlEntry').style.display = "none";
            }

        }

        else {

            panel.querySelector(`.txtWidthLayer`).value = valueFinder(dataLayer[f], `txtWidthLayer`);
            panel.querySelector(`.txtHeightLayer`).value = valueFinder(dataLayer[f], `txtHeightLayer`);
            panel.querySelector(`.txtXLayer`).value = valueFinder(dataLayer[f], `txtXLayer`);
            panel.querySelector(`.txtYLayer`).value = valueFinder(dataLayer[f], `txtYLayer`);

            panel.querySelector(`.chkFlipX`).dataset.value = valueFinder(dataLayer[f], `chkFlipX`);
            chkBoxFormat(panel.querySelector(`.chkFlipX`));

            panel.querySelector(`.chkFlipY`).dataset.value = valueFinder(dataLayer[f], `chkFlipY`);
            chkBoxFormat(panel.querySelector(`.chkFlipY`));

            panel.querySelector(`.txtOpacityLayer`).value = valueFinder(dataLayer[f], `txtOpacityLayer`);
            panel.querySelector(`.txtRotationLayer`).value = valueFinder(dataLayer[f], `txtRotationLayer`);

            if(leadPanel.dataset.type == "image") {

                //THE SWAP BUTTON'S CAPTION. IT COMES FROM dataLayer AND NOT FROM THE GALLERY,
                //SO IT SURVIVES EXPORT, IMPORT, UNDO AND REDO, AND STILL READS CORRECTLY AFTER
                //THE THUMB IT CAME FROM HAS BEEN DELETED FROM menuUpload
                fitSwapLabel(panel.querySelector('.btnImageLabel'), imageLabelOf(f));

                panel.querySelector(`.txtBlur`).value = valueFinder(dataLayer[f], `txtBlur`);
                panel.querySelector(`.txtBrightness`).value = valueFinder(dataLayer[f], `txtBrightness`);
                panel.querySelector(`.txtContrast`).value = valueFinder(dataLayer[f], `txtContrast`);
                panel.querySelector(`.txtSaturation`).value = valueFinder(dataLayer[f], `txtSaturation`);

                let hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtOutlineColor`));
                let alpha = alphaFinder(dataLayer[f], 'txtOutlineColor');
            
                panel.querySelector(`.txtOutlineColor`).value = hex;
                panel.querySelector(`.txtOutlineColor`).dataset.gradient = "";
                panel.querySelector(`.txtOutlineColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtOutlineColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtOutlineColor`);
                
                panel.querySelector(`.txtOutlineSize`).value = valueFinder(dataLayer[f], `txtOutlineSize`);
                
                hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtGlowColor`));
                alpha = alphaFinder(dataLayer[f], 'txtGlowColor');

                panel.querySelector(`.txtGlowColor`).value = hex;
                panel.querySelector(`.txtGlowColor`).dataset.gradient = "";
                panel.querySelector(`.txtGlowColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtGlowColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtGlowColor`);

                panel.querySelector(`.txtGlowSpread`).value = valueFinder(dataLayer[f], `txtGlowSpread`);
                
                hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtShadowColor`));
                alpha = alphaFinder(dataLayer[f], 'txtShadowColor');

                panel.querySelector(`.txtShadowColor`).value = hex;
                panel.querySelector(`.txtShadowColor`).dataset.gradient = "";
                panel.querySelector(`.txtShadowColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtShadowColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtShadowColor`);

                panel.querySelector(`.txtShadowSize`).value = valueFinder(dataLayer[f], `txtShadowSize`);
                panel.querySelector(`.txtShadowSpread`).value = valueFinder(dataLayer[f], `txtShadowSpread`);
                panel.querySelector(`.txtShadowRotation`).value = valueFinder(dataLayer[f], `txtShadowRotation`);

                panel.querySelectorAll(`.dropdown`)[0].children[0].innerText =  valueFinder(dataLayer[f], `dropdown 0`);
                panel.querySelectorAll(`.dropdown`)[1].children[0].innerText =  valueFinder(dataLayer[f], `dropdown 1`);

                let options = panel.querySelectorAll(`.dropdown`)[0].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 0')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                })

                options = panel.querySelectorAll(`.dropdown`)[1].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 1')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                })

            }
            else if(leadPanel.dataset.type == "line") {

                
                let hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtLineStrokeColor`));
                let alpha = alphaFinder(dataLayer[f], 'txtLineStrokeColor');

                panel.querySelector(`.txtLineStrokeColor`).value = hex;
                panel.querySelector(`.txtLineStrokeColor`).dataset.gradient = "";
                panel.querySelector(`.txtLineStrokeColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtLineStrokeColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtLineStrokeColor`);

                panel.querySelector(`.txtLineStrokeWidth`).value = valueFinder(dataLayer[f], `txtLineStrokeWidth`);
                panel.querySelector(`.txtLineStrokeDash`).value = valueFinder(dataLayer[f], `txtLineStrokeDash`);
                panel.querySelector(`.txtLineStrokeGap`).value = valueFinder(dataLayer[f], `txtLineStrokeGap`);

                panel.querySelector(`.chkLineStrokeCap`).dataset.value = valueFinder(dataLayer[f], `chkLineStrokeCap`);
                chkBoxFormat(panel.querySelector(`.chkLineStrokeCap`));

                hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtGlowColor`));
                alpha = alphaFinder(dataLayer[f], 'txtGlowColor');

                panel.querySelector(`.txtGlowColor`).value = hex;
                panel.querySelector(`.txtGlowColor`).dataset.gradient = "";
                panel.querySelector(`.txtGlowColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtGlowColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtGlowColor`);

                panel.querySelector(`.txtGlowSpread`).value = valueFinder(dataLayer[f], `txtGlowSpread`);
                
                hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtShadowColor`));
                alpha = alphaFinder(dataLayer[f], 'txtShadowColor');

                panel.querySelector(`.txtShadowColor`).value = hex;
                panel.querySelector(`.txtShadowColor`).dataset.gradient = "";
                panel.querySelector(`.txtShadowColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtShadowColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtShadowColor`);

                panel.querySelector(`.txtShadowSize`).value = valueFinder(dataLayer[f], `txtShadowSize`);
                panel.querySelector(`.txtShadowSpread`).value = valueFinder(dataLayer[f], `txtShadowSpread`);
                panel.querySelector(`.txtShadowRotation`).value = valueFinder(dataLayer[f], `txtShadowRotation`);


                let options = panel.querySelectorAll(`.dropdown`)[0].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 0')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                })
                
                //HEADS AND STYLE ARE PAINTED ONTO THE PANEL, NOT DISPATCHED. A DISPATCHED PICK RUNS
                //chooseLineHead / chooseLayerStyle, AND BOTH APPLY TO EVERY SELECTED LAYER - SO
                //ADDING A LINE TO A SELECTION STAMPED ITS HEADS AND STYLE ONTO THE OTHERS, WITH
                //ENCODING PAUSED, AND FOCUSING A LINE REDREW IT FROM WHATEVER THE PANEL HELD. THE
                //CANVAS ALREADY SHOWS ITS OWN HEADS AND STYLE; ONLY THE PANEL NEEDS TO CATCH UP.
                for(let side of ['Start', 'End']) {

                    let head = valueFinder(dataLayer[f], `dropdownLine${side} 0`);
                    let opts = [...panel.querySelectorAll(`.dropOptionLine${side} .optLineHead`)];

                    //A FILE SAVED BEFORE 2026-09-24 CAN CARRY "" FOR THE LEFT HEAD. SHOW MITER, THE
                    //FIRST OPTION AND THE DEFAULT, RATHER THAN THE PREVIOUS LAYER'S HEAD;
                    //organizeLine LEAVES THAT END OF THE CANVAS ALONE.
                    let opt = opts.find(o => o.children[0].id == head);
                    if(opt == null) opt = opts[0];

                    if(opt != null) paintLineHead(opt);
                }

                //SAME PANEL STATE A REAL PICK LEAVES: delegation.js WRITES THE LABEL FOR Glow/Shadow,
                //chooseLayerStyle WRITES "Choose a Style" FOR Remove AND OPENS THE MATCHING TAB
                let style = valueFinder(dataLayer[f], 'dropdown 1');
                let dropStyle = panel.querySelectorAll(`.dropdown`)[1];
                let named = style == "Glow" || style == "Shadow";

                dropStyle.children[0].innerText = named ? style : "Choose a Style";
                dropStyle.dataset.default = named ? style : "Remove";

                if(panel.querySelector('.tabOutlineLayer') != null) panel.querySelector('.tabOutlineLayer').style.display = "none";
                if(panel.querySelector('.tabGlowLayer') != null) panel.querySelector('.tabGlowLayer').style.display = style == "Glow" ? "block" : "none";
                if(panel.querySelector('.tabShadowLayer') != null) panel.querySelector('.tabShadowLayer').style.display = style == "Shadow" ? "block" : "none";

            }
            else if(leadPanel.dataset.type == "vector") {

                let getSVG = cnvGrpLayers.querySelector(`[data-ref="${f}"]`).children[0];

                let tabVectorPreview = panel.querySelector('.tabVectorPreview');
                tabVectorPreview.innerHTML = getSVG.outerHTML;
                
                let getMax = tabVectorPreview.querySelectorAll('svg *[fill], svg *[stroke]').length;

                panel.querySelector(`.txtSubLayer`).value = valueFinder(dataLayer[f], `txtSubLayer`);
                panel.querySelector(`.txtSubLayer`).max = getMax;
                panel.querySelector(`.txtSubLayer`).previousElementSibling.max = getMax;

                panel.querySelector(`.txtSubLayer`).dispatchEvent(new Event('change'));

                let options = panel.querySelectorAll(`.dropdown`)[0].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 0')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                })

                options = panel.querySelectorAll(`.dropdown`)[1].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 1')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                });

                //IF TXTSUBLAYER IS VALUE == 0
                //HIDE ALL PARTS
                if(panel.querySelector(`.txtSubLayer`).value == "0") {
                    document.getElementById('pnlBoxVector').querySelector('.contNoPath').style.display = "block";
                    document.getElementById('pnlBoxVector').querySelector('.contPath').style.display = "none";
                }      
                else {       
                    document.getElementById('pnlBoxVector').querySelector('.contNoPath').style.display = "none";
                    document.getElementById('pnlBoxVector').querySelector('.contPath').style.display = "block";         
                }

            }
            else if(leadPanel.dataset.type == "element") {

                //VALIDATION FOR COLOR VALUE
                //IF SOLID RGBA CONVERT TO HEX
                //IF GRADIENT THEN SHOW 'LINEAR' OR 'RADIAL'
                if(valueFinder(dataLayer[f], `txtElementStrokeColor`).includes('gradient')) {
                    showGradientInInput(panel.querySelector(`.txtElementStrokeColor`), valueFinder(dataLayer[f], `txtElementStrokeColor`));
                }
                else {
                
                    let hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtElementStrokeColor`));
                    let alpha = alphaFinder(dataLayer[f], 'txtElementStrokeColor');
                
                    panel.querySelector(`.txtElementStrokeColor`).value = hex;
                    panel.querySelector(`.txtElementStrokeColor`).dataset.gradient = "";
                    panel.querySelector(`.txtElementStrokeColor`).dataset.alpha = alpha;
                    panel.querySelector(`.txtElementStrokeColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtElementStrokeColor`);
                }

                panel.querySelector(`.txtElementStrokeWidth`).value = valueFinder(dataLayer[f], `txtElementStrokeWidth`);
                panel.querySelector(`.txtElementCornerRadius`).value = valueFinder(dataLayer[f], `txtElementCornerRadius`);
                panel.querySelector(`.txtElementStrokeDash`).value = valueFinder(dataLayer[f], `txtElementStrokeDash`);
                panel.querySelector(`.txtElementStrokeGap`).value = valueFinder(dataLayer[f], `txtElementStrokeGap`);

                panel.querySelector(`.chkElementStrokeCap`).dataset.value = valueFinder(dataLayer[f], `chkElementStrokeCap`);
                chkBoxFormat(panel.querySelector(`.chkElementStrokeCap`));

                if(valueFinder(dataLayer[f], `txtElementFillColor`).includes('gradient')) {
                    showGradientInInput(panel.querySelector(`.txtElementFillColor`), valueFinder(dataLayer[f], `txtElementFillColor`));
                }
                else {
                
                    let hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtElementFillColor`));
                    let alpha = alphaFinder(dataLayer[f], 'txtElementFillColor');
                
                    panel.querySelector(`.txtElementFillColor`).value = hex;
                    panel.querySelector(`.txtElementFillColor`).dataset.gradient = "";
                    panel.querySelector(`.txtElementFillColor`).dataset.alpha = alpha;
                    panel.querySelector(`.txtElementFillColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtElementFillColor`);
                }

                hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtGlowColor`));
                alpha = alphaFinder(dataLayer[f], 'txtGlowColor');

                panel.querySelector(`.txtGlowColor`).value = hex;
                panel.querySelector(`.txtGlowColor`).dataset.gradient = "";
                panel.querySelector(`.txtGlowColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtGlowColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtGlowColor`);

                panel.querySelector(`.txtGlowSpread`).value = valueFinder(dataLayer[f], `txtGlowSpread`);
                
                hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtShadowColor`));
                alpha = alphaFinder(dataLayer[f], 'txtShadowColor');

                panel.querySelector(`.txtShadowColor`).value = hex;
                panel.querySelector(`.txtShadowColor`).dataset.gradient = "";
                panel.querySelector(`.txtShadowColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtShadowColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtShadowColor`);

                panel.querySelector(`.txtShadowSize`).value = valueFinder(dataLayer[f], `txtShadowSize`);
                panel.querySelector(`.txtShadowSpread`).value = valueFinder(dataLayer[f], `txtShadowSpread`);
                panel.querySelector(`.txtShadowRotation`).value = valueFinder(dataLayer[f], `txtShadowRotation`);

                let options = panel.querySelectorAll(`.dropdown`)[0].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 0')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                });

                options = panel.querySelectorAll(`.dropdown`)[1].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 1')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                });

                options = panel.querySelectorAll(`.dropdown`)[2].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 2')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                });

            }
            else if(leadPanel.dataset.type == "3DMockup") {

                //GET FIRST THE AREA VALUE
                //SO WE CAN GET DATA3D FOR TEXTBOXES VALUES
                let area = data3D[f].lastArea;

                let hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtColorDiffuse`));
                let alpha = alphaFinder(dataLayer[f], 'txtColorDiffuse');
                
                panel.querySelector(`.txtColorDiffuse`).value = hex;
                panel.querySelector(`.txtColorDiffuse`).dataset.gradient = "";
                panel.querySelector(`.txtColorDiffuse`).dataset.alpha = alpha;
                panel.querySelector(`.txtColorDiffuse`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtColorDiffuse`);
                
                panel.querySelector(`.txtXRotation`).value = valueFinder(dataLayer[f], `txtXRotation`);
                panel.querySelector(`.txtYRotation`).value = valueFinder(dataLayer[f], `txtYRotation`);
                panel.querySelector(`.txtZRotation`).value = valueFinder(dataLayer[f], `txtZRotation`);

                //IF LEAD DATA3D AREA DOES NOT EXIST
                //THEN DEFAULT THE AREA TO 'FRONT'
                if(data3D[f][area] == null) {
                    area = 'Front';
                }

                //ADD DATA3D VALUES TO CHANGE TEXTBOXES
                //showMockupTexts(f);

                let options = panel.querySelectorAll(`.dropdown`)[0].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 0')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                });

                options = panel.querySelectorAll(`.dropdown`)[1].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == area) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                });

                options = panel.querySelectorAll(`.dropdown`)[2].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == area) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                });

                

            }
            else if(leadPanel.dataset.type == "text") {
                
                if(valueFinder(dataLayer[f], `txtTextColor`).includes('gradient')) {
                    showGradientInInput(panel.querySelector(`.txtTextColor`), valueFinder(dataLayer[f], `txtTextColor`));
                }
                else {
                
                    let hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtTextColor`));
                    let alpha = alphaFinder(dataLayer[f], 'txtTextColor');
                
                    panel.querySelector(`.txtTextColor`).value = hex;
                    panel.querySelector(`.txtTextColor`).dataset.gradient = "";
                    panel.querySelector(`.txtTextColor`).dataset.alpha = alpha;
                    panel.querySelector(`.txtTextColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtTextColor`);
                }

                //THROUGH fitSwapLabel, NOT STRAIGHT ONTO THE h2 - THAT IS WHAT APPLIES THE
                //CHARACTER LIMIT AND STORES THE WHOLE NAME ON dataset.full FOR THE CANCEL TO
                //PUT BACK. sir ASKED FOR THE LIMIT ON BOTH SWAP BUTTONS (2026-09-24)
                fitSwapLabel(panel.querySelector(`.btnFontLabel`), valueFinder(dataLayer[f], `fontName`));
                panel.querySelector(`.btnFontLabel`).dataset.font = valueFinder(dataLayer[f], `fontName`);

                panel.querySelector(`.txtResizeText`).value = valueFinder(dataLayer[f], `txtResizeText`);
                panel.querySelector(`.txtLetterSpacing`).value = valueFinder(dataLayer[f], `txtLetterSpacing`);
                panel.querySelector(`.txtLineHeight`).value = valueFinder(dataLayer[f], `txtLineHeight`);
                
                //THE CASE IS READ FROM WHAT THE TEXT ACTUALLY SHOWS, NOT TRUSTED FROM dataLayer.
                //sir, 2026-09-26: "the AB uppercase always white ... misleading unless the datalayer
                //of that canvas says so". IT DID SAY SO: encodeSelectMulti RECORDED THE CLICKED
                //BUTTON, SO TURNING A CASE OFF LEFT dataLayer ON UpperCase WHILE THE TEXT WENT
                //NORMAL, AND THE font swap's panel2Focus REPAINTED AB FROM THAT. THE ENCODER IS
                //FIXED; THIS HEALS EVERY LAYER ALREADY SAVED WITH THE WRONG VALUE. 'none' HAS NO
                //BUTTON, WHICH IS WHY THE PAINT IS DONE HERE AND NOT THROUGH btnTextClick
                let textCanvas = f2Canvas(f);
                let shownCase = textCanvas != null && textCanvas.lastElementChild != null ? getComputedStyle(textCanvas.lastElementChild).textTransform : 'none';
                let textCase = { uppercase: 'UpperCase', capitalize: 'Capitalize', lowercase: 'LowerCase' }[shownCase] || 'none';

                if(valueFinder(dataLayer[f], `selTextCase`) != textCase) dataLayer[f] = valueSwitcher(dataLayer[f], `selTextCase`, textCase);

                //currCase IS WHAT adjustTextTransform TOGGLES AGAINST. IT WAS NEVER SET ON FOCUS, SO
                //IT STILL HELD THE LAST LAYER TOUCHED AND A CASE CLICK COULD TOGGLE THE WRONG WAY
                currCase = textCase;
                panel.querySelector(`.selTextCase`).dataset.value = textCase;

                for(let b = 0; b < panel.querySelector(`.selTextCase`).childElementCount; b++) {
                    panel.querySelector(`.selTextCase`).children[b].children[0].style.color = "var(--muted-blue-text)";
                }

                if(textCase != 'none') panel.querySelector(`.btn${textCase}`).children[0].style.color = "var(--sharp)";

                //SAME FOR THE RESIZE MODE. currResizeBox ONLY MOVED WHEN A RESIZE BUTTON WAS CLICKED,
                //SO IT WAS OFTEN ANOTHER LAYER'S MODE - adjustTextArea NOW READS dataLayer ITSELF,
                //BUT EVERY OTHER READER OF THE GLOBAL SHOULD SEE THE LAYER THAT IS ACTUALLY FOCUSED
                let textResize = valueFinder(dataLayer[f], `selTextResize`) || "AutoWidth";

                currResizeBox = textResize;
                panel.querySelector(`.selTextResize`).dataset.value = textResize;

                btnOptionClick.call(panel.querySelector(`.selTextResize`).querySelector(`.btn${textResize}`));
                btnOptionClick.call(panel.querySelector(`.selTextHori`).querySelector(`.btn${valueFinder(dataLayer[f], `selTextHori`)}`));
                btnOptionClick.call(panel.querySelector(`.selTextVerti`).querySelector(`.btn${valueFinder(dataLayer[f], `selTextVerti`)}`));
                
                //STROKE COLOR FORMATTING
                if(valueFinder(dataLayer[f], `txtOutlineColor`).includes('gradient')) {
                    showGradientInInput(panel.querySelector(`.txtOutlineColor`), valueFinder(dataLayer[f], `txtOutlineColor`));
                }
                else {
                
                    let hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtOutlineColor`));
                    let alpha = alphaFinder(dataLayer[f], 'txtOutlineColor');
                
                    panel.querySelector(`.txtOutlineColor`).value = hex;
                    panel.querySelector(`.txtOutlineColor`).dataset.gradient = "";
                    panel.querySelector(`.txtOutlineColor`).dataset.alpha = alpha;
                    panel.querySelector(`.txtOutlineColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtOutlineColor`);
                }
                panel.querySelector(`.txtOutlineSize`).value = valueFinder(dataLayer[f], `txtOutlineSize`);
        
                //THERE'S NO GRADIENT FOR TXTGLOWCOLOR
                let hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtGlowColor`));
                let alpha = alphaFinder(dataLayer[f], 'txtGlowColor');
            
                panel.querySelector(`.txtGlowColor`).value = hex;
                panel.querySelector(`.txtGlowColor`).dataset.gradient = "";
                panel.querySelector(`.txtGlowColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtGlowColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtGlowColor`);
                
                panel.querySelector(`.txtGlowSpread`).value = valueFinder(dataLayer[f], `txtGlowSpread`);
        
                //THERE'S NO GRADIENT FOR TXTGLOWCOLOR
                hex = rgbaString2HexEncoding(valueFinder(dataLayer[f], `txtShadowColor`));
                alpha = alphaFinder(dataLayer[f], 'txtShadowColor');
            
                panel.querySelector(`.txtShadowColor`).value = hex;
                panel.querySelector(`.txtShadowColor`).dataset.gradient = "";
                panel.querySelector(`.txtShadowColor`).dataset.alpha = alpha;
                panel.querySelector(`.txtShadowColor`).nextElementSibling.children[1].style.background = valueFinder(dataLayer[f], `txtShadowColor`);

                //panel.querySelector(`.txtShadowColor`).value = valueFinder(dataLayer[f], `txtShadowColor`);
                //panel.querySelector(`.txtShadowColor`).nextElementSibling.style.backgroundColor = '#' + valueFinder(dataLayer[f], `txtShadowColor`);
                panel.querySelector(`.txtShadowSize`).value = valueFinder(dataLayer[f], `txtShadowSize`);
                panel.querySelector(`.txtShadowSpread`).value = valueFinder(dataLayer[f], `txtShadowSpread`);
                panel.querySelector(`.txtShadowRotation`).value = valueFinder(dataLayer[f], `txtShadowRotation`);
        
                panel.querySelectorAll(`.dropdown`)[0].children[0].innerText =  valueFinder(dataLayer[f], `dropdown 0`);
                panel.querySelectorAll(`.dropdown`)[1].children[0].innerText =  valueFinder(dataLayer[f], `dropdown 1`);
                panel.querySelectorAll(`.dropdown`)[2].children[0].innerText =  valueFinder(dataLayer[f], `dropdown 2`);
                
                let options = panel.querySelectorAll(`.dropdown`)[0].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 0')) {
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                })

                //THE WEIGHT LIST IS REBUILT ASYNCHRONOUSLY BY addFontWeights, SO DISPATCHING ON IT
                //HERE WOULD HIT THE PREVIOUS LAYER'S OPTIONS. APPLY THE VALUE DIRECTLY
                applyTextWeight(f, valueFinder(dataLayer[f], 'dropdown 1'));
                panel.querySelectorAll(`.dropdown`)[1].dataset.default = valueFinder(dataLayer[f], 'dropdown 1');
                
                options = panel.querySelectorAll(`.dropdown`)[2].nextElementSibling.querySelectorAll(`[class*="opt"]`);
                options.forEach(opt => {
                    if(opt.innerText == valueFinder(dataLayer[f], 'dropdown 2')) {
                
                        opt.dispatchEvent(new PointerEvent ("pointerdown", {bubbles: false}))
                    }
                })
            }

        }

        //COPY ALL TXT VALUES TO RNGS
        panel.querySelectorAll(`input[type="range"]`)
        .forEach((range) => {
            range.value = range.nextElementSibling.value;
        })

        focusPanel = keepFocus;

        resumeEncoding();
    } 
}

//========================SWAP PANELS=================================
function swapPanels(type) {
    //hide all pnlboxes first
    let propertiesBox = document.getElementById('propertiesBox');
    let pnlBoxes = propertiesBox.querySelectorAll('[id*="pnlBox"]');
    //let e = Number(leadPanel.dataset.layer);
    pnlBoxes.forEach(pnlBox=> {
        pnlBox.style.display = 'none';
    })

    if(type == 'canvas') {
        //CHECK FIRST WHAT IS THE CURRENT MODE
        //CANVAS NO NEED FOR DECODE SINCE IT'S JUST ONE
        //AND NO LAYERS TO SWITCH THE VALUES FROM AND TO
        if(chkMode.dataset.value == '2D') {
            document.getElementById('pnlBoxCanvas').style.display = 'flex'; 
        }
        else if (chkMode.dataset.value == '3D') {
            document.getElementById('pnlBox3DEnvironment').style.display = 'flex'; 
        }

        decodeData3();
    }
    else if(type == 'pattern') {

        document.getElementById('pnlBoxPattern').style.display = 'flex';
        decodeData3();

    }
    else if(type == 'image') {

        document.getElementById('pnlBoxImage').style.display = 'flex';
        decodeData3();
     
    }
    else if(type.includes('vector')) {

        document.getElementById('pnlBoxVector').style.display = 'flex';

        let txtSubLayer = document.getElementById('pnlBoxVector').querySelector('.txtSubLayer');
        txtSubLayer.value = 0;
        txtSubLayer.previousElementSibling.value = 0;

        decodeData3();
    
    }
    else if(type == 'element') {

        document.getElementById('pnlBoxElement').style.display = 'flex';
        decodeData3();
    }
    else if(type == '3DMockup') {

        document.getElementById('pnlBox3DMockup').style.display = 'flex';
        addAreaMockupOptions();
        decodeData3();
    }
    else if(type == 'line') {

        document.getElementById('pnlBoxLine').style.display = 'flex';
        decodeData3();
    
    }
    else if(type == 'text') {

        document.getElementById('pnlBoxText').style.display = 'flex';
        //no need to encode data since
        //addfontweights has encode
        addFontWeights()
        .then(decodeData3);
    }
    else if(type == 'textEditor') {
        document.getElementById('pnlBoxTextEditor').style.display = 'flex';
        document.getElementById('pnlBoxEmojiSymbol').style.display = 'flex';
    }

}

//================CHECK PNLBOXTHUMB FOCUS==============================
function addPnlBoxThumbFocus(key, thumb) {

    highlight = false;
    let wrapUploads = document.getElementById('wrapUploads');

    if(key == null) {

        //if no key is pressed, remove all border first
        resetAllFocus();
        swapPanels('canvas');
        thumbUnfocusAll();
        thumb2Focus(thumb);
        firstPanel = thumb;
    }

    else if(key == 'ctrl') {

        if(checkPanelFocusBool(thumb)) {

            thumbUnfocus(thumb);

            if(checkPanelFocusCount() == 0) {
                resetAllFocus();
                swapPanels('canvas');
            }
            
        }

       else {

            //remove all focus object
            if(checkObjFocusCount() > 0) {
              
                resetAllFocus();
                thumb2Focus(thumb);
                swapPanels('canvas');
            }
            else {

                thumb2Focus(thumb);
            }
       }
    }

    else if(key == 'shift') {

        if(checkPanelFocusBool(thumb)) {

            thumbUnfocus(thumb);
            firstPanel = thumb;

            if(checkPanelFocusCount() == 0) {
                resetAllFocus();
                swapPanels('canvas');
            }
            
        }
        else {

            thumb2Focus(thumb);
            
            if(checkPanelFocusCount() > 1) {

                //[!] DO NOT USE CHECKPANELPOSITION
                //IT'S ONLY FOR PNLBOXLAYER
                //USE DATASET THUMBNO FOR CORRECT ORDER
                let a = Number(firstPanel.dataset.thumbno);
                let z = Number(thumb.dataset.thumbno);

                thumbUnfocusAll();
                
                if(a > z) {
                    for(let c = z; c <= a; c++) {
                        
                        //[!] USE QUERYSELECTOR SINCE WE WILL SELECT 
                        //USING DATASET THUMBNO AND NOT THE ACTUAL
                        //POSITION OF THE THUMB FROM TOP TO BOTTOM
                        thumb2Focus(wrapUploads.querySelector(`[data-thumbno="${c}"]`));
                    }
                }
                
                else {
                    for(let c = a; c <= z; c++) {

                        //[!] USE QUERYSELECTOR SINCE WE WILL SELECT 
                        //USING DATASET THUMBNO AND NOT THE ACTUAL
                        //POSITION OF THE THUMB FROM TOP TO BOTTOM
                        thumb2Focus(wrapUploads.querySelector(`[data-thumbno="${c}"]`));
                      
                    }
                }
            }

            else {
                if(firstPanel == null) {
                    firstPanel = thumb;
                }
            }
        
        }   
    }
}
//================CHECK PNLBOXTHUMB FOCUS==============================

function addPnlBoxLayerFocus(key, panel) {
    
    let f = Number(panel.dataset.ref);
    let type = panel.dataset.type;
    let pin = cnvPin.querySelector(`[data-ref="${f}"]`)
    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');

    if(key == null) {
    
        if(checkPanelFocusCount() >= 1) {

            if(checkPanelFocusBool(panel)) {
                if(type != "pattern") {
                    chooseLeadDrag(pin); 
                    leadPanel = panel;
                    hideAllContextMenu();
                }
            }
            else {
                resetAllFocus();
                panel2Focus(panel);
                firstPanel = panel;
            }
        }
        else {
            
            panelUnfocusAll()
            panel2Focus(panel);
            firstPanel = panel;
        }
    }

    else if(key == 'ctrl') {

        if(checkPanelFocusBool(panel)) {

            panelUnfocus(panel);

            if(checkPanelFocusCount() == 0) {
                resetAllFocus();
                swapPanels('canvas');
            }
        }

       else {

            panel2Focus(panel);

       }

    }

    else if(key == 'shift') {

        if(checkPanelFocusBool(panel)[0]) {

            panelUnfocus(panel)
        }

        else {

            panel2Focus(panel);

            if(checkPanelFocusCount() > 1) {

                let a = Number(checkPanelPosition(firstPanel));
                let z = Number(checkPanelPosition(panel));

                panelUnfocusAll();
                
                if(a > z) {
                    for(let c = z; c <= a; c++) {
                        panel2Focus(pnlBoxLayer[c]);
                    }
                }
                else {
                    for(let c = a; c <= z; c++) {
                        panel2Focus(pnlBoxLayer[c]);
                    }
                }

            }
            else {
                if(firstPanel == null) {
                    firstPanel = panel;
                }
            }
                
        }
    }

}

//=======================DELETE AN OBJECT===============================

function checkInputFocus() {

    let inFocus = false;

    let checkInputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    
    //for(let b = 0; b < checkInputs.length; b++) { //go thru each input type
    checkInputs.forEach(function(input) {
        if(input == document.activeElement) {
            inFocus = true; //return true if there's atleast one
            return inFocus; 
        }
    })

    return inFocus;
}

async function restoreAllMockups(thumb) {
    
    let oldW, oldH, newW, newH;
    let newThumb = document.createElement('div');

    //CHECK FIRST IF THUMB CHILD IS IMG OR SVG
    if(thumb.dataset.type == 'image') {

        let thumbImg = thumb.firstChild.cloneNode(true);

        //IF RASTER IMAGE
        oldW = thumb.firstChild.naturalWidth;
        oldH = thumb.firstChild.naturalHeight;

        if(oldW >= oldH) {

            newW = oldW;
            newH = newW / aRatio;

            newThumb.style.width = newW + 'px';
            newThumb.style.height = newH + 'px';
            newThumb.style.display = "flex";
            newThumb.style.margin = "auto";
            newThumb.appendChild(thumbImg);
            newThumb.querySelector('img').style.margin = "auto";
            newThumb.querySelector('img').style.width = "100%";
            newThumb.querySelector('img').style.height = "auto";
            
        }
        else {

            newH = oldH;
            newW = newH * aRatio;

            newThumb.style.width = newW + 'px';
            newThumb.style.height = newH + 'px';
            newThumb.style.display = "flex";
            newThumb.style.margin = "auto";
            //newThumb.style.backgroundColor = "blue"
            newThumb.appendChild(thumbImg);
            newThumb.querySelector('img').style.margin = "auto";
            newThumb.querySelector('img').style.height = "100%";
            newThumb.querySelector('img').style.width = "auto";
        
        }

    }

    else if(thumb.dataset.type == 'vector') {

        let thumbSVG = thumb.querySelector('svg').cloneNode(true);

        oldW = Number(thumb.querySelector('svg').getAttribute('width').replace('px', ''));
        oldH = Number(thumb.querySelector('svg').getAttribute('height').replace('px', ''));
        
        if(oldW >= oldH) {

            newW = oldW;
            newH = newW / aRatio;
            
            newThumb.style.width = newW + 'px';
            newThumb.style.height = newH + 'px';
            newThumb.style.display = "flex";
            newThumb.style.margin = "auto";
            newThumb.appendChild(thumbSVG);
            newThumb.querySelector('svg').style.margin = "auto";
            newThumb.querySelector('svg').style.width = "100%";
            newThumb.querySelector('svg').style.height = "auto";

        }
        else {

            newH = oldH;
            newW = newH * aRatio;

            newThumb.style.width = newW + 'px';
            newThumb.style.height = newH + 'px';
            newThumb.style.display = "flex";
            newThumb.style.margin = "auto";
            newThumb.appendChild(thumbSVG);
            newThumb.querySelector('svg').style.margin = "auto";
            newThumb.querySelector('svg').style.height = "100%";
            newThumb.querySelector('svg').style.width = "auto";
        
        }

    }

    snapdiv.children[0]?.remove();
    snapdiv.appendChild(newThumb);

    let img = await snapdom.toPng(snapdiv, {fast: true, width: newW, height: newH});

    await img.decode();

    for(let f = 0; f < maxF; f++) {

        for(let area in data3D[f]) {

            if(data3D[f][area].thumbno == thumb.dataset.thumbno) {
                
                data3D[f][area].thumbname = thumb.dataset.filename;
                data3D[f][area].source = img.src;

            }
        }
    }
        

}

function deleteAllThumbs(n) {   
    
    //////////////////TRANSFER THUMB DATA////////////////////
    let thumb = n2Thumb(n);
    restoreThumb[n] = thumb.outerHTML;

    ////////////////////REMOVE ALL PANELS//////////////////////
    //A COPY, THE LIVE LIST SHRANK UNDER THE LOOP AND EVERY OTHER LAYER OF THE UPLOAD SURVIVED
    let pnlBoxLayer = [...document.getElementsByClassName('pnlBoxLayer')];

    //get tempPanel index
    for(let b = 0; b < pnlBoxLayer.length; b++) {
        
        //FILTER NON 3D PNLBOX TYPES
        //SINCE PNLBOX3D THUMBNO IS FOR SUPABASE ID
        //AND NOT FROM LOCAL THUMBNAIL
        if(!pnlBoxLayer[b].dataset.type.includes('3DMockup')) {
            if(Number(pnlBoxLayer[b].dataset.thumbno) == n) {
                let f = Number(pnlBoxLayer[b].dataset.ref)
                deleteAllLayers(f);
            }
        }
    }

    //////////////////DELETE THE THUMB/////////////////////
    thumb.remove();
    thumb = null;

}

function deleteAllLayers(f) {

    let panel = f2Panel(f);

    if(panel.dataset.type == "image") {
        unmaskImageBelowViaDelete(panel);
    }
    
    deleteAllCanvas(f);

    restorePanel[f] = panel.outerHTML;

    restoreBelow[f] = [];
    for(let p = panel.nextElementSibling; p != null; p = p.nextElementSibling) restoreBelow[f].push(p.dataset.ref);

    panel.remove()
    panel = null;

}

function deleteAllPatterns(f) {

    let panel = f2Panel(f);
    let canvas = f2Canvas(f);

    restoreCanvas[f] = canvas.outerHTML;
    canvas.remove();
    canvas = null;

    restorePanel[f] = panel.outerHTML;

    restoreBelow[f] = [];
    for(let p = panel.nextElementSibling; p != null; p = p.nextElementSibling) restoreBelow[f].push(p.dataset.ref);

    panel.remove();
    panel = null;

}

function deleteAllCanvas(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let pin = cnvPin.querySelector(`[data-ref="${f}"]`);

    ////////////////////REMOVE ALL letIABLES////////////////
    aRatio[f] = null;
    
    //////////////////REMOVE ALL CANVAS LAYERS////////////////
    //IF CANVAS IS 3D
    if(canvas.dataset.type.includes('3D')) {
        restoreCanvas[f] = canvas.outerHTML;
        
        engine[f]?.dispose(); 
        engine[f] = null;
        scene[f] = null;
        cnvGrpLayers.querySelector(`[data-ref="${f}"]`)?.remove();

    }
    else {
        restoreCanvas[f] = canvas.outerHTML;
        cnvGrpLayers.querySelector(`[data-ref="${f}"]`)?.remove();
    }
    
    canvas.remove();
    canvas = null;

    //FOR SOME REASONS, F2PIN DOES NOT WORK
    //NEEDS TO FILTER PINBODY INDIVIDUALLY
    restorePin[f] = pin.outerHTML;
    
    pin?.remove();
    pin = null;

    moveableUpdateTargets();
}

function deleteObject() {

    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');

    if(!checkInputFocus()) {

        //delete if pnlBoxPattern
        h++;
        history[h] = "";

        ////////////////ADD STACKED INFO BEFORE REMOVING ACTUAL OBJECTS///////////
        layerSequence = "Stacked: ";

        for(let a = 0; a < pnlBoxLayer.length; a++) {
            layerSequence += ` ${Number(pnlBoxLayer[a].dataset.ref)} `;
        }
        layerSequence += '*\n';

        for(let a = 0; a < focusPanel.length; a++) { // run until focuspanel length

            if(focusPanel[a] != null) { // if focus panel has not skipped or null
                
                let f = Number(focusPanel[a].dataset.ref);

                if(focusPanel[a].className == "pnlBoxThumb") { //pnlboxthumb

                    let n = focusPanel[a].dataset.thumbno;

                    deleteAllThumbs(n)

                    history[h] += dataThumb[a];
                    history[h] = history[h].replace(history[h].split('*')[0], 'Deleted');
    
                }

                else if(focusPanel[a].className == "pnlBoxLayer") { //pnlboxlayer

                    if(focusPanel[a].dataset.type == "pattern") {

                        deleteAllPatterns(f)

                        history[h] += dataPattern[f];
                        history[h] = history[h].replace(history[h].split('*')[0], 'Deleted')
                        
                    }
                    
                    else {

                        deleteAllLayers(f);
                        history[h] += dataLayer[f];
                        history[h] = history[h].replace(history[h].split('*')[0], 'Deleted');
                        
                    }

                }
            }

        }

        history[h] = layerSequence + "\n" + history[h];

        resetAllFocus();

        swapPanels('canvas');
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
    
    //this block is for checking memory leaks
    /*
    for(let a = 0; a < 5; a++) {
        let chk = document.body.querySelectorAll(`[data-layer='${a}']`);

        chk.forEach(function(input) {
            console.log(input);
        })

        console.log('focusObj', a, focusObj[a])
        console.log('focusPanel', a, focusPanel[a])
    }
    */

}


///////////////////////////////SELECT ALL////////////////////////////
function selectDeselectAll() {

    let cnvGrpLayers = document.getElementById('cnvGrpLayers');
    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');

    //check first if there's input focus, if not proceed
    if(!checkInputFocus()) {

        //[!] THE DIRECTION MUST BE CAPTURED BEFORE selectAllTarget RUNS. RE-EVALUATING THE
        //[!] CONDITION AFTERWARDS RETURNS THE OPPOSITE, SO THE RECORD WOULD BE INVERTED
        if(ctrlAFocus == "menuUploads") {

            let selected = checkPanelFocusCount() < pnlBoxThumb.length;

            selectAllTarget("thumbs", selected);
            encodeSelectAll("thumbs", selected);
        }

        else if(ctrlAFocus == "menuLayers") {

            let selected = checkPanelFocusCount() < focusPanel.length;

            selectAllTarget("panels", selected);
            encodeSelectAll("panels", selected);
        }
        
        else if(ctrlAFocus == "workArea") {

            let selected = checkObjFocusCount() < cnvGrpLayers.querySelectorAll('.cnvLayers').length;

            selectAllTarget("canvas", selected);
            encodeSelectAll("canvas", selected);
        }
    }
}

function ctrlA(e) {

    if((e.ctrlKey && e.key == 'a') || (e.ctrlKey && e.key  == 'A')) {

        //CTRL+A INSIDE A TEXTBOX SELECTS THE TEXT, NOT EVERY LAYER
        if(!checkInputFocus()) {
            selectDeselectAll();
        }
    }
    
}
document.addEventListener('keydown', ctrlA);

function selectAreaToCtrlA(e) {
    let configScroll = document.getElementsByClassName('configScroll');

    if(e.target.closest('#workArea')) {
        ctrlAFocus = "workArea";
        configScroll[2].children[0].style.backgroundColor = "transparent";
    }
    else if(e.target.closest('#menuPatterns')) {
        ctrlAFocus = "menuPatterns";
    }
    else if(e.target.closest('#menuUploads')) {
        ctrlAFocus = "menuUploads";
    }
    else if(e.target.closest('#menuLayers')) {
        ctrlAFocus = "menuLayers";
    }
}
document.addEventListener('pointerover', selectAreaToCtrlA);

///////////////////////////////////////SHORTCUT SAVE///////////////////////////
function ctrlS(e) {

    if(e.ctrlKey) {
        if(e.key.toLowerCase() == 's') {
            e.preventDefault();
            decideHowToDownload();
        }
    }
}
document.addEventListener('keydown', ctrlS);

///////////////////////////////////////SHORTCUT DOWNLOAD//////////////////////
function ctrlD(e) {
    if(e.ctrlKey) {
        if(e.key.toLowerCase() == 'd') {
            e.preventDefault();

            //NOT WHILE TYPING
            if(!checkInputFocus()) {

                //SAME ENTRY POINT AS BTNDOWNLOAD. GOING STRAIGHT TO downloadFile SKIPPED THE
                //LOADING COVER AND THE 3D ENVIRONMENT SCREENSHOT
                convertEnvToImage();
            }
        }
    }
}
document.addEventListener('keydown', ctrlD);

///////////////////////////////////////SHORTCUT PASTE/////////////////////////
function ctrlV(e) {

    let initFiles = 0;
    let reader = [];
    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');
    let configScroll = document.getElementsByClassName('configScroll');

    let tempHistory = 'Uploaded';
    
    let files = e.clipboardData.files; // Get clipboard items
    
    if(files.length > 0) {
      
        for(let a = 0; a < files.length; a++) {
  
            let filename = files[a].name;
            //if file is an image
            if(files[a].type.match("image")) {

                //check if file is svg
                let chkSVG = /svg/;

                let resultSVG = chkSVG.test(files[a].type);

                if(resultSVG) {

                    reader[a] = new FileReader(); //create a file reader to read the format
                    reader[a].readAsText(files[a]); //read the file to dataURL for raster output
                    reader[a].onload = async function() {
                        
                        initFiles++;
                        //DOM PURIFY
                        let purifiedSVG = DOMPurify.sanitize(this.result, { USE_PROFILES: { svg: true } });

                        //MATERIALIZE SVG STRING
                        let div = document.createElement('div');
                        div.innerHTML = purifiedSVG;

                        //FORMAT THE SVG DOM
                        let newSVG = svg2ObjectBoundingBox(div.firstElementChild);

                        div.innerHTML = newSVG.outerHTML;

                        let thumbnail = await convert2Thumbnail(div.firstElementChild, 'svg')
   
                        div.classList.add('pnlBoxThumb');
                        div.setAttribute('draggable', 'false');
                        div.dataset.thumbno = pnlBoxThumb.length;
                        div.dataset.type = "image";
                        div.dataset.filename = filename;

                        div.innerHTML = `<img src="${thumbnail}">`;
                        configScroll[2].children[0].children[0].prepend(div);
                        
                        dataThumb[div.dataset.thumbno] = '*';
                        dataThumb[div.dataset.thumbno] += `\npnlBoxThumb:`;
                        dataThumb[div.dataset.thumbno] += `\ntype: svg`;
                        dataThumb[div.dataset.thumbno] += `\nthumbno: ${div.dataset.thumbno}`;
                        //[!] NO thumbnail: FIELD. IT WAS WRITE-ONLY - NOTHING EVER CALLED
                        //[!] valueFinder(dataThumb[n], 'thumbnail'). THE GALLERY ICON IS RESTORED FROM
                        //[!] restoreThumb[n] ON UNDO/REDO AND FROM THE configContainer HTML ON FILE LOAD.
                        //[!] IT ALSO SAT BEFORE source: AND valueFinder MATCHES BY SUBSTRING, SO A 34KB
                        //[!] BASE64 BLOB COULD SHADOW A LOOKUP FOR source:. DO NOT RE-ADD IT.
                        dataThumb[div.dataset.thumbno] += `\nsource: ${encodeURIComponent(this.result)}`;

                        tempHistory += `*`;
                        tempHistory += `\npnlBoxThumb:`;
                        tempHistory += `\ntype: svg`;
                        tempHistory += `\nthumbno: ${div.dataset.thumbno}`;
                        tempHistory += `\nsource: ${encodeURIComponent(this.result)}\n`;

                        makeNewHistory(tempHistory);
                        //thumb2Focus(configScroll[2].querySelector('.pnlBoxThumb'))

                        img = null;
                        reader[a] = null;

                        if(initFiles == files.length) {

                            reader.forEach((read) => {
                                read = null;
                            })

                            createCanvasFromThumb();
                        }

                    }
            
                }

                else {

                    reader[a] = new FileReader();

                    reader[a].readAsDataURL(files[a]);

                    reader[a].onload = async function() {

                        let img = new Image();
                        img.src = this.result;
                        await img.decode();

                        initFiles++;

                        let thumbnail = await convert2Thumbnail(img, 'image')
                        
                        let div = document.createElement('div');
                        div.classList.add('pnlBoxThumb');
                        div.setAttribute('draggable', 'false');
                        div.dataset.thumbno = pnlBoxThumb.length;
                        div.dataset.type = "image";
                        div.dataset.filename = filename;

                        div.innerHTML = `<img src="${thumbnail}">`;
                        configScroll[2].children[0].children[0].prepend(div);
                        
                        dataThumb[div.dataset.thumbno] = '*';
                        dataThumb[div.dataset.thumbno] += `\npnlBoxThumb:`;
                        dataThumb[div.dataset.thumbno] += `\ntype: image`;
                        dataThumb[div.dataset.thumbno] += `\nthumbno: ${div.dataset.thumbno}`;
                        dataThumb[div.dataset.thumbno] += `\nsource: ${this.result}`;

                        tempHistory += `*`;
                        tempHistory += `\npnlBoxThumb:`;
                        tempHistory += `\ntype: image`;
                        tempHistory += `\nthumbno: ${div.dataset.thumbno}`;
                        tempHistory += `\nsource: ${this.result}\n`;

                        makeNewHistory(tempHistory);

                        img = null;
                        reader[a] = null;

                        if(initFiles == files.length) {

                            reader.forEach((read) => {
                                read = null;
                            })

                            createCanvasFromThumb();
                        } 
                        
                    }
                }
            }
        
        }

    }
    
}   
document.addEventListener('paste', ctrlV);

///////////////////////////////////////PASTE FROM THE MENU////////////////////
//A MENU CLICK CARRIES NO paste EVENT, SO THE CLIPBOARD IS READ HERE AND HANDED
//TO CTRLV IN THE SHAPE IT ALREADY EXPECTS
async function pasteFromClipboard() {

    let files = [];
    let items;

    try {
        items = await navigator.clipboard.read();
    }
    catch {
        showModal("Clipboard is not available", "Your browser blocked clipboard access for this page. Allow it in the site settings, or press Ctrl+V instead.", "Close", null, 0);
        return;
    }

    for(let a = 0; a < items.length; a++) {

        for(let b = 0; b < items[a].types.length; b++) {

            if(items[a].types[b].match("image")) {

                let blob = await items[a].getType(items[a].types[b]);

                files.push(new File([blob], `Pasted.${items[a].types[b].split('/')[1]}`, {type: items[a].types[b]}));
            }
        }
    }

    ctrlV({clipboardData: {files: files}});
}


///////////////////////////////////////SHORTCUT CLONE/////////////////////////
function ctrlC(e)  {
    if(e.ctrlKey) {

        if(e.key.toLowerCase() == 'c') {

            if(!checkInputFocus()) {
                e.preventDefault();

                cloneCanvas();
            }
            
        }
    }
}
document.addEventListener('keydown', ctrlC);

///////////////////////////////////////SHORTCUT DELETE//////////////////////////

function ctrlX(e) {

    //CTRL+X AND Delete BOTH BELONG TO THE TEXT WHILE A TEXTBOX HAS FOCUS
    if(checkInputFocus()) return;

    if(e.ctrlKey) {

        if(e.key.toLowerCase() == 'x') {
            e.preventDefault();

            deleteObject();
        }
    }

    if(e.key == "Delete") {
        deleteObject();
    }
}
document.addEventListener('keydown', ctrlX);

///////////////////////////////////////SHORTCUT END EDIT//////////////////////////

function ctrlE(e) {

    if(e.ctrlKey) {
        if(e.key.toLowerCase() == "e") {
            e.preventDefault();

            if(document.activeElement.className == "txtEditorBox") {
                saveTextEditor();
            }

            //ONLY FROM THE CANVAS, NOT FROM ANY OTHER TEXTBOX
            else if(!checkInputFocus()) {
                editCanvasTextLayer();
            }
        }
    } 
}
document.addEventListener('keydown', ctrlE);

///////////////////////////////////////SHORTCUT SHOW-HIDE//////////////////////

//ONE CLICK ON EACH FOCUSED EYE BUTTON, SO DELEGATION RUNS showHideLayers AND THE
//DIRECT LISTENER RUNS encodeShowHide, EXACTLY LIKE CLICKING THEM BY HAND
function showHideFocusLayers() {

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let panel = focusPanel[a];
            let btn = panel.querySelector('.btnShowHide');

            if(btn != null) {

                btn.click();

                //CTRL+H HIDES THE BOUNDARY WITH THE LAYER, A PANEL CLICK BRINGS IT BACK
                if(btn.dataset.show == "hidden") canvasUnfocus(panel.dataset.ref);
            }
        }
    }
}

function ctrlH(e) {

    if(e.ctrlKey) {
        if(e.key.toLowerCase() == 'h') {
            e.preventDefault();

            if(!checkInputFocus()) {
                showHideFocusLayers();
            }
        }
    }
}
document.addEventListener('keydown', ctrlH);

///////////////////////////////////////SHORTCUT TO UNDO-REDO/////////////////////////
function ctrlZ(e) {
    if(!checkInputFocus()) {

        if(e.ctrlKey && !e.shiftKey) {

            if(e.key == 'z' || e.key == 'Z') {
                
                e.preventDefault();

                undo();
            }
        }

        //A BARE z REACHED THIS ELSE AND REDID, THE REDO IS CTRL+SHIFT+Z
        else if(e.ctrlKey && e.shiftKey) {

            if(e.key == 'z' || e.key == 'Z') {
                
                redo();             
            }
        }
    }
}
document.addEventListener('keydown', ctrlZ);

//////////////////////////SHORTCUT TO MOVE FOCUS OBJECTS USING ARROW KEYS/////////////////////

function arrowMove(e) {

    if(!checkInputFocus()) {
        if(e.key.includes('Arrow')) {

            if(checkObjFocusCount() > 0) {

                e.preventDefault();

                isDragging = true;
                isSelecting = false;

                for(let a = 0; a < focusObj.length; a++) {
                    
                    //A LOCKED LAYER CAN STILL BE SELECTED FROM THE LAYERS PANEL, BUT NOT MOVED
                    if(focusObj[a] != null && f2PinBody(focusObj[a].dataset.ref)?.dataset.lock != "lock") {

                        let f = focusObj[a].dataset.ref;
                        let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

                        if(e.key == 'ArrowUp') {
                            
                            canvas.style.top = canvas.offsetTop - 2 + 'px';

                        }
                        else if(e.key == 'ArrowRight') {

                            canvas.style.left = canvas.offsetLeft + 2 + 'px';

                        }
                        else if(e.key == 'ArrowDown') {
                            
                            canvas.style.top = canvas.offsetTop + 2 + 'px';

                        }
                        else if(e.key == 'ArrowLeft') {
                            
                            canvas.style.left = canvas.offsetLeft - 2 + 'px';
                        
                        }
                        
                    }
                }
                
                let f = Number(leadDrag.dataset.ref);

                let leadCanvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

                adjustBorder();

                // adjustBasicsFromCanvas TAKES (canvas, pin) AND READS pin.getBoundingClientRect.
                //THIS CALL PASSED ONE ARGUMENT, SO EVERY ARROW NUDGE THREW. READ THE PIN AFTER
                //adjustBorder, WHICH IS WHAT REPOSITIONS IT
                let leadPin = cnvPin.querySelector(`[data-ref="${f}"]`);

                adjustBasicsFromCanvas(leadCanvas, leadPin);
            }
        }
    }
    
}
document.addEventListener('keydown', arrowMove);

function arrowUp(e) {

    if(e.key != null) {
        
        if(e.key.includes('Arrow')) {

            if(checkObjFocusCount() > 0) {

                if(isDragging) {
        
                    isDragging = false;
                    isRotating = false;
                    isResizing = false;
                    isScaling = false;
                    
                    encodeBasicsFromCanvas('drag');
        
                }
            }
        }
    }
    
}
document.addEventListener('keyup', arrowUp);

//////////////////////////SHORTCUT TO MOVE FOCUS OBJECTS USING ARROW KEYS/////////////////////

