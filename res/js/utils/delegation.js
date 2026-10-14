let previousInput = null;
let isColorPicking = false;

//null WHEN OFF, "font" OR "image" WHILE LIVE. WHILE SET, CHOOSING A FONT IN menuText OR AN
//IMAGE IN menuUpload REPLACES IT ON swapTargets INSTEAD OF CREATING A LAYER. THE TARGETS ARE
//CAPTURED WHEN THE MODE STARTS, NOT READ FROM focusPanel LATER, SO THE SWAP DOES NOT DEPEND ON
//FOCUS SURVIVING EVERY BRANCH OF THIS CHAIN.
//
//ONE VARIABLE FOR BOTH MODES - THEY CANNOT RUN AT THE SAME TIME (sir, 2026-09-24). swapMenu()
//AND swapPinType() IN global.js ANSWER WHERE THE LIVE MODE IS ALLOWED TO LIVE
let swapMode = null;
let swapTargets = [];

// SET AT pointerdown, CONSUMED AT contextmenu. THE RIGHT BUTTON FIRES
//pointerdown -> pointerup -> contextmenu, AND pointerdown ALREADY CLEARS
//isColorPicking, SO rightClick COULD NEVER SEE THAT PICKING HAD BEEN LIVE
let cancelledColorPicking = false;
//let isColorPicking2 = false;


/////////////////////////CLICKS/////////////////////

document.addEventListener('click', async(e) => {
    
    if(e.button == 0) {
 
        let key = null;
        let clicked = e.target;

        if(e.ctrlKey) { //ctrl key is pressed
            key = 'ctrl';
        }
        else if(e.shiftKey) { //shift key is pressed
            key = 'shift';
        }
        //[!] ID
        if(clicked.id == "btnSaveEdit") {
            saveTextEditor();
        }
        else if(clicked.id == "modalOverlay") {

            //A LOCKED OVERLAY HAS NO DISMISS. THE LAPSE MODAL SETS dataset.lock
            //BECAUSE THERE IS NO WORKING STUDIO BEHIND IT TO GO BACK TO - ITS ONLY
            //WAYS OUT ARE ITS OWN TWO BUTTONS. Esc IS ALREADY UNBOUND WHILE A MODAL
            //IS OPEN (blockEventsForModal), AND NEITHER TEMPLATE HAS A CLOSE BUTTON,
            //SO THIS LINE IS THE LAST DISMISS PATH THERE WAS.
            if(clicked.dataset.lock == "1") return;

            hideModal();
        }
        else if(clicked.closest('#btnLogOut')) {
     
            await logout();
        }
        else if(clicked.closest('#btnClearCache')) {
     
            clearCache();
        }
        else if(clicked.id == "cnvPin") {
           
        }
        //[!] CLASSNAME
        else if(clicked.className == "pinBody") {
            //EMPTY CONDITION
        }
        else if(clicked.className == 'thumbColor') {

            let thumbPicker = clicked.closest('.thumbPicker');
            thumbPicker.previousElementSibling.blur();
            let pnlBox = clicked.closest(`[id*='pnlBox']`).id;
      
            let tab = thumbPicker.closest(`[class*="tab"]`).className;

            let except = [`tabGlowLayer`, `tabShadowLayer`, `tabOutlineLayer`, `tabGlowText`, `tabShadowText`, `tabLineStroke`, `tab3DBox`, `tabSettings`];
            
            if(except.includes(tab)) {

                letsSummonColorPicker(thumbPicker, false);
            }
            else {
                
                if(thumbPicker.previousElementSibling.value == "Linear" || thumbPicker.previousElementSibling.value == "Radial") {
            
                    letsSummonColorManager(thumbPicker, false)
                }
                else {
             
                    letsSummonColorPicker(thumbPicker, true);
                }
            }            

        }
        else if(clicked.className == 'thumbGradient') {

            let thumbPickerGradient = clicked;
            //[!] CLICKED IS .THUMBGRADIENT, ITS PREVIOUSELEMENTSIBLING IS THE
            //CHECKERED IMG. BLUR THE TXTGRADIENT INPUT THAT OWNS THE STOP INSTEAD
            thumbPickerGradient.closest('.thumbPickerGradient').previousElementSibling.blur();
            letsSummonColorPicker(thumbPickerGradient, false);
  
        }
        else if(clicked.className == 'txtGradientStop') {
            convertTextInput2NumberGradientStop.call(clicked);
        }
        //[!] CLOSEST
        else if(clicked.closest('.chkFlipX')) {
            adjustFlipX.call(clicked.closest('.chkFlipX'));
        }
        else if(clicked.closest('.chkFlipY')) {
            adjustFlipY.call(clicked.closest('.chkFlipY'));
        }
        else if(clicked.closest('.chkSnap')) {
            chkSnapClick.call(clicked.closest('.chkSnap'));
        }
        else if(clicked.closest(`.btnViewAll`)) {
            showPreviewOrCategory.call(clicked);
        }
        else if(clicked.closest(`.btnRetry`)) {
           
            let configScroll = document.getElementsByClassName('configScroll');
            resetContentPreview(configScroll[3], 'elements');
        }
        else if(clicked.closest('.btnDelSearch')) {

            clicked.closest('.btnDelSearch').style.visibility = "hidden";
            clicked.closest('.btnDelSearch').previousElementSibling.value = "";
            clicked.closest('.btnDelSearch').previousElementSibling.select();

            let textbox = clicked.closest('.btnDelSearch').previousElementSibling.className;

            if(textbox == "txtSearchEmojiSymbol") {
                resetAllEmojis();
                resetAllSymbols();
            }
            else if(textbox != "txtSearchEmojiSymbol" && textbox != "txtSearchFont") {

                if(clicked.closest('.btnDelSearch').previousElementSibling.className == "txtSearchTemplate") {

                    await resetContentPreviewTemplates();
                }
                else {
  
                    await resetPreviewOrCategory.call(clicked.closest('.btnDelSearch'));
                }   
            }

        }
        else if(clicked.closest('.btnDelGradient')) {
            deleteGradientColor.call(clicked.closest('.btnDelGradient'));
            stringifyGradient();
        }
        else if(clicked.closest(`[class*="dropdown"]`)) {
            
            let drop = clicked.closest(`[class*="dropdown"]`);

            if(isOptionVisible) {
                
                if(previousDrop == clicked.closest(`[class*="dropdown"]`)) {
                    hideAllOptions();
                }

                else {

                    hideAllOptions();
                    isOptionVisible = true;
                    previousDrop = clicked.closest(`[class*="dropdown"]`);

                    if(clicked.closest(`[class*="dropdown"]`).id == "dropdownZoom") {
                        
                        drop.parentElement.nextElementSibling.style.display = "block";
                    }
                    else {
      
                        drop.nextElementSibling.style.display = "block";
        
                    }
                }
            }
            else {


                if(previousDrop == clicked.closest(`[class*="dropdown"]`)) {
                    isOptionVisible = true;
                    drop.nextElementSibling.style.display = "block";
                }
                else {

                    if(clicked.closest(`[class*="dropdown"]`).id == "dropdownZoom") {
                        
                        drop.parentElement.nextElementSibling.style.display = "block";
                    }
                    else {
         
                        drop.nextElementSibling.style.display = "block";
                        
                    }
                    
                    isOptionVisible = true;
                    previousDrop = clicked.closest(`[class*="dropdown"]`);
                }

            }

            hideAllContextMenu();
            
        }
        else if(clicked.closest(`[class*='opt']`)) {
            //[!] DO NOT DELETE
            //BLANK TO AVOID FAST CLICK AND WILL TRIGGER ELSE
        }
        else if(clicked.closest('input[type = "text"]:not([data-unit]), textarea')) {
            //NEED CLICK EVENT FOR ACCURATE CARETPOST
            let input = clicked.closest('input[type = "text"]:not([data-unit]), textarea');

            //TXTHEADER HAS DIFFERENT TREATMENT AND CONDITION HERE
            //IT HAS READONLY ATTRIBUTE AND RELATED TO DRAGGING PNLBOXLAYER
            
            if(input.className == 'txtHeader') {

                //IF THE TXT HEADER ALREADY DOUBLE CLICKED
                //IT REMOVES READONLY AND READY FOR EDITING
                if(input.dataset.readonly == "false") {

                    //GET CARETPOST FROM THE END NOT FROM THE START
                    //THIS WILL MAKE MORE ACCURATE SUBSTRING
                    caretPost = input.value.length - input.selectionStart;

                    if(highlight) {

                        if(input == previousInput) {
                            input.setSelectionRange(input.selectionEnd, input.selectionEnd);
                        }
                        else {
                            previousInput = input;
                            input.select();
                            highlight = true;
                        }
                    }
                    else {
                        previousInput = input;
                        input.select();
                        highlight = true;
                    }

                }
               
            }
            else
                if(input.className == 'txtSearchFont') {

                //GET CARETPOST FROM THE END NOT FROM THE START
                //THIS WILL MAKE MORE ACCURATE SUBSTRING
                
                caretPost = input.value.length - input.selectionStart;

                if(highlight) {
                    input.setSelectionRange(input.selectionEnd, input.selectionEnd);
                }
                else {
                    input.select();
                    highlight = true;
                }

                //THIS IS TO SHOW DROPOPTION SEARCH
                if(input.value.length >= 2) {
    
                    //JUST SHOW THE DROPDOWN
                    //NO NEED TO RESET ALWAYS
                    input.parentElement.nextElementSibling.style.display = "block";
                }

            }
            else if(input.className == 'txtSearch') {

                //GET CARETPOST FROM THE END NOT FROM THE START
                //THIS WILL MAKE MORE ACCURATE SUBSTRING
                caretPost = input.value.length - input.selectionStart;

                if(highlight) {
                    input.setSelectionRange(input.selectionEnd, input.selectionEnd);
                }
                else {
                    input.select();
                    highlight = true;
                }

                //THIS IS TO SHOW DROPOPTION SEARCH
                if(input.value.length >= 2 ) {
                    
                    //JUST SHOW THE DROPDOWN
                    //NO NEED TO RESET ALWAYS
                    input.parentElement.nextElementSibling.style.display = "block";
                    
                }
            
            }
            else {

                //GET CARETPOST FROM THE END NOT FROM THE START
                //THIS WILL MAKE MORE ACCURATE SUBSTRING
                caretPost = input.value.length - input.selectionStart;

                if(highlight) {

                    if(input == previousInput) {
                        input.setSelectionRange(input.selectionEnd, input.selectionEnd);
                    }
                    else {
                        previousInput = input;
                        input.select();
                        highlight = true;
                    }
                }
                else {
                    previousInput = input;
                    input.select();
                    highlight = true;
                }
            }
            
        }
        else if(clicked.closest('input[data-unit], input[type = "number"]')) {
            
            //EMPTY FOR CLICKING INPUT NUMBERS (TEXT BOXES WITH data-unit, SEE formatNumberInput, AND THE COLOUR PICKER'S NATIVE NUMBER BOXES)
            //SO NOT TO LOSE FOCUS
        }
        else if(clicked.closest('.pnlBoxThumb')) {

            //THE UPLOADS GALLERY IS WHERE AN IMAGE SWAP IS PICKED. WITHOUT THIS BRANCH THE
            //CLICK WOULD FOCUS THE THUMB AND CREATE A NEW LAYER INSTEAD OF REPLACING ONE
            if(swapMode == "image") swapImageFromThumb(clicked.closest('.pnlBoxThumb'));
            else addPnlBoxThumbFocus(key, clicked.closest('.pnlBoxThumb'));

        }
        else if(clicked.closest('.pnlBoxStylish')) {
            //EMPTY CONDITION
        }
        else if(clicked.closest('.pnlBoxSerif')) {
            //EMPTY CONDITION
        }
        else if(clicked.closest('.pnlBoxSansSerif')) {
            //EMPTY CONDITION
        }
        else if(clicked.closest('.pnlBoxLayer') && !clicked.closest('.btnShowHide') && !clicked.closest('.btnExpandCollapse') && !clicked.closest('.btnLockUnlock') && !clicked.closest('.btnMaskUnmask')) {
            //EMPTY
        }
        else if(clicked.closest('.btnMaskUnmask')) {
            let btn = clicked.closest('.btnMaskUnmask');
            showMaskUnmask.call(btn);
        }
        else if(clicked.closest('.btnShowHide')) {
            let btn = clicked.closest('.btnShowHide');
            showHideLayers.call(btn);
        }
        else if(clicked.closest('.btnLockUnlock')) {
            let btn = clicked.closest('.btnLockUnlock');
            lockUnlockLayers.call(btn);
        }
        else if(clicked.closest('.btnExpandCollapse')) {
            //SHOW HIDE LAYERS WITHOUT FOCUSING
            expandCollapsePanel.call(clicked.closest('.btnExpandCollapse'))
        }
        else if(clicked.closest('.pinBody')) {
            //empty condition just for pins
        }
        else if(clicked.closest('.tabFonts')) {
            //empty
        }
        else if(clicked.closest('#rightPanel')) {
            //EMPTY CONDITION FOR CLICKING EMOJIS AND SYMBOLS
            //TO AVOID RESETTING FOCUS OBJECTS
            //BUT ALLOW HIDING OPTIONS
            if(!clicked.closest(`[class*="dropdown"]`)) {

                hideAllOptions();
                hideAllContextMenu();
            }
        }
        else if(clicked.closest('#colorPickerPanel')) {
            //empty condition for any textboxes from colorpicker
            //so it will not remove any focus
        }
        else if(clicked.closest('#colorManagerPanel')) {
            //empty condition for any textboxes from colorpicker
            //so it will not remove any focus
        }
        else if(clicked.closest(`[class*='rcOption']`)) {
            e.preventDefault();
            hideAllContextMenu();
        }
        else if(clicked.closest(`[id*='rcCanvas']`)) {
            //EMPTY CONDITION TO NOT LOSE FOCUS
        }
        else if(clicked.closest(`[id*='divZoom']`)) {
            //EMPTY CONDITION TO NOT LOSE FOCUS
        }
        else if(clicked.closest('#btnSwitchSolid')) {

        }
        else if(clicked.closest('#btnSwitchGradient')) {
            
        }
        else if(clicked.closest('#btnLoadAutosave')) {

            await loadAutosave()
        }
        else if(clicked.closest('#btnClearAutosave')) {
            bannerAutosave.style.display = "none";

            //DECLINED. THE SLOT IS THE USER'S TO OVERWRITE FROM HERE ON.
            restorePending = false;
        }
        else if(clicked.closest('#modalLoading')) {

        }
        else {

            //A DOUBLE CLICK FIRES TWO click EVENTS BEFORE dblclick, SO WITHOUT THIS EVERY
            //ATTEMPT TO PICK A FONT WOULD CANCEL SWAP FONT MODE BEFORE THE SWAP RAN
            if(colorPickerPanel.dataset.show == "false" && colorManagerPanel.dataset.show == "false"
            && !(swapMode && clicked.closest(swapMenu()))) {
   
                resetAllFocus();
                swapPanels('canvas');   
                cnvGrpLayers.style.boxSizing = "border-box";
                cnvGrpLayers.style.overflow = "hidden";
            }
        }
    }
   
})

//////////////////////////POINTER DOWN//////////////
document.addEventListener('pointerdown', e => {
    
    let key = null;
    let clicked = e.target;
    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');

    if(e.button == 0) {

        //A SWAP MODE HAS EXACTLY TWO PLACES IT LIVES IN: ITS OWN MENU, AND A PIN OF ITS OWN
        //LAYER TYPE. ANYTHING ELSE ENDS IT. THIS RUNS BEFORE THE BRANCH CHAIN SO A PIN OF THE
        //WRONG TYPE CANCELS AND THEN SELECTS NORMALLY, WHILE A MATCHING PIN SURVIVES FOR THE
        //.pinBody BRANCH
        //THE BUSY SWAP BUTTON ITSELF IS EXEMPT. sir, 2026-09-26: "select a new font on click
        //(busy) looks passive component but i tried clicking / pointerdown again, it
        //reactivates". IT SITS IN THE PANEL, NOT THE MENU, SO THIS USED TO CANCEL ON THE PRESS -
        //AND THE CANCEL PUTS THE BUTTON'S click LISTENER BACK, SO THE click THAT FOLLOWED STARTED
        //A FRESH SWAP AND REPLAYED THE MENU SLIDE. WHILE .swapping THE BUTTON HAS NO click
        //LISTENER, SO SKIPPING IT HERE MAKES THE PRESS DO NOTHING, WHICH IS WHAT IT LOOKS LIKE
        if(swapMode && !clicked.closest(swapMenu())
        && !clicked.closest('.btnFontLabel.swapping, .btnImageLabel.swapping')
        && !(clicked.closest('.pinBody') && clicked.closest('.pinBody').dataset.type == swapPinType())) {
            cancelSwap();
        }

        if(e.ctrlKey) { //ctrl key is pressed
            key = 'ctrl';
        }

        else if(e.shiftKey) { //shift key is pressed
            key = 'shift';
        }

        ////////////CLASS NAME//////////////
        if(clicked.id == 'cnvPin') {

            //[!] CAPTURE FIRST IF THE EYEDROPPER IS LIVE, THEN CLOSE EITHER WAY.
            //THE EYEDROPPER CURSOR IS STAMPED ON THE HOVERED ELEMENT TOO, NOT JUST CNVPIN
            if(isColorPicking) {
                clicked.style.cursor = "default";
                copyEyeDropperHex();
            }
            else {
                resetAllFocus();
                swapPanels('canvas');
            }

            hideColorManagerPanel();
        }

        else if(clicked.closest(".pinBody")) {

            if(isColorPicking) {
                clicked.style.cursor = "default";
                copyEyeDropperHex();
            }
            else if(swapMode == "font") swapFontFromCanvas(clicked.closest('.pinBody'));
            else if(swapMode == "image") swapImageFromCanvas(clicked.closest('.pinBody'));
            else if(clicked.dataset.lock == "unlock") linkCanvasWithPanelLayer(key, clicked);

            hideColorManagerPanel();
            hideAllContextMenu();
            hideAllOptions();

        }
        else if(clicked.closest(".moveable-area")) {
            
            hideColorManagerPanel();
            hideAllContextMenu();
            hideAllOptions();
        }
        else if(clicked.closest(".moveable-control-box")) {
            //EMPTY CONDITION FOR MOVEABLE
            hideColorManagerPanel();
            hideAllContextMenu();
            hideAllOptions();
        }
        else if(clicked.closest(".moveable-control")) {
            //EMPTY CONDITION FOR MOVEABLE
            hideColorManagerPanel();
            hideAllContextMenu();
            hideAllOptions();
        }
        else if(clicked.closest(".moveable-direction")) {
            //EMPTY CONDITION FOR MOVEABLE
            hideColorManagerPanel();
            hideAllContextMenu();
            hideAllOptions();
        }
        //[!]IMPORTANT DO NOT REMOVE
        //THIS WILL AFFECT VISIBILITY OF CONTEXT
        //AND EXCEPTION TO ELSE STATEMENT
        else if(clicked.closest(`[class*="dropdown"]`)) {
            isColorPicking = false;
            //THE COLOR PANELS ONLY CLOSE IN THE FINAL ELSE AND THIS BRANCH SITS ABOVE IT
            hideColorManagerPanel();
        }
        //[!]IMPORTANT DO NOT REMOVE
        //THIS WILL AFFECT VISIBILITY OF CONTEXT
        //AND EXCEPTION TO ELSE STATEMENT
        else if(clicked.closest(`[class*='opt']`)) {
            //hideAllContextMenu();
            let opt = clicked.closest(`[class*='opt']`);
 
            //ALL SEARCH OPTIONS FROM SEARCH
            if(opt.className == "optSearch") {
                chooseSearch.call(clicked.closest('.optSearch'));
            }
            //ALL SEARCH OPTIONS FROM FONT SEARCH
            else if(opt.className == "optSearchFont") {
                chooseFontSearch.call(clicked.closest('.optSearchFont'));
            }
            
            if(opt.closest('.pnlDrop') != null || opt.closest('.pnlDrop') != undefined) {

                if(opt.innerText != "Remove" && opt.className != "optZoom" && opt.className != "optLayerMockupImage") {
                    if(opt.innerText.trim().length > 0) {
                        opt.closest('.pnlDrop').children[0].dataset.default = opt.innerText;
                        opt.closest('.pnlDrop').children[0].children[0].innerText = opt.innerText;
                    }
                }
                else if(opt.className == "optLayerMockupImage" && opt.innerText != 'No uploaded images yet') {
                    showLoading();
                    
                }

            }
            isOptionVisible = false;
            hideAllOptions();
            hideAllContextMenu();
        }

        else if(clicked.closest('input[data-unit], input[type = "number"]')) {
            let input = clicked.closest('input[data-unit], input[type = "number"]');

            input.select();
        }

        else if(clicked.closest('input[type = "text"], textarea')) { 

            let input = clicked.closest('input[type = "text"], textarea');

            if(input.className == 'txtHeader') {

                if(input.dataset.readonly == "true") {

                    addPnlBoxLayerFocus(key, clicked.closest('.pnlBoxLayer'))

                }
            }

            //[!] THIS CATCHES THE HEX INPUTS BEFORE THE PANEL BRANCHES FURTHER DOWN, SO
            //CLICKING ONE TO TYPE MUST CLOSE. THE PANEL'S OWN TEXTBOXES LAND HERE TOO
            //AND HAVE TO BE EXEMPT
            if(!clicked.closest('#colorPickerPanel') && !clicked.closest('#colorManagerPanel')) {
                hideColorManagerPanel();
                hideAllContextMenu();
            }
        }

        else if(clicked.closest('.tabFonts')) {
            //empty
        }

        else if(clicked.closest('.pnlBoxThumb')) {

            //DO NOT ADD ANYTHING HERE
            //THIS IS CANVAS FOCUS
            //ALREADY TRIED AND IT'S CAUSING BUG
            //THIS IS POINTER DOWN EVENT CAUSING CONFLICT WITH 'CLICK'

        }

        else if(clicked.closest('.pnlBoxStylish') || clicked.closest('.pnlBoxSerif' || clicked.closest('.pnlBoxSansSerif'))) {

            //addPnlBoxThumbFocus(key, clicked.closest('.pnlBoxThumb'))
            for(let a = 0; a < focusObj.length; a++) {
                if(focusObj[a] != null) {

                    pnlBoxLayer[a].style.borderColor = "var(--sharp-track)";
                    focusPanel[a] = null;
                    
                    let inputs = pinBody[a].querySelectorAll('div');
            
                    inputs.forEach(function(input) {
                        input.style.visibility = "hidden";
                    })

                    focusObj[a] = null;
                }
            }
        }

        else if(clicked.closest('.pnlBoxLayer') ) {

            //CLICK ANYWHERE PNLBOXLAYER BUT NOT BTNSHOWHIDE
            //WILL FOCUS PNLBOXLAYER
            addPnlBoxLayerFocus(key, clicked.closest('.pnlBoxLayer'));
            
        }
        else if(clicked.closest('.txtHeader') ) {

            //CLICK ANYWHERE PNLBOXLAYER BUT NOT BTNSHOWHIDE
            //WILL FOCUS PNLBOXLAYER
            addPnlBoxLayerFocus(key, clicked.closest('.pnlBoxLayer'));
            
        }

        else if(clicked.closest('#colorPickerPanel')) {
            //empty condition for any textboxes from colorpicker
            //so it will not remove any focus
        }

        else if(clicked.closest('#colorManagerPanel')) {
            //empty condition for any textboxes from colorpicker
            //so it will not remove any focus

            //CLOSE ONLY THE STOP PICKER, THE MANAGER STAYS. THUMBPICKERGRADIENT OWNS ITS OWN TOGGLE
            if(!clicked.closest('.thumbPickerGradient')) hideColorPickerPanel();
        }

        else if(clicked.closest(`[class*='rcOption']`)) {
            //LEAVE THIS BLANK
            //THIS IS POINTERDOWN EVENT
            //THIS SHOULD NOT REMOVE RIGHT CLICK OPTIONS
            //AND RCCANVAS SHOULD NOT DISAPPEAR WHEN POINTER IS DOWN
            //LOOKS WEIRD SO LEAVE BLANK [!]
        }

        else if(clicked.closest('#rightPanel')) {
            //EMPTY CONDITION FOR CLICKING EMOJIS AND SYMBOLS
            //TO AVOID RESETTING FOCUS OBJECTS
            isOptionVisible = false;
            hideAllOptions();
            hideAllContextMenu();

            //[!] THUMBPICKER IS THE TRIGGER, IT OWNS ITS OWN SHOW AND HIDE
            if(!clicked.closest('.thumbPicker')) hideColorManagerPanel();
        }

        else if(clicked.closest(`[id*='rcCanvas']`)) {
            //EMPTY CONDITION TO NOT LOSE FOCUS
        }
        
        else if(clicked.closest(`[id*='divZoom']`)) {
            //EMPTY CONDITION TO NOT LOSE FOCUS
        }
        else if(clicked.closest('.chkFlipX')) {
            //console.log(clicked)
            //adjustFlipX.call(clicked);
        }
        else if(clicked.closest('.chkFlipY')) {
            //console.log(clicked)
            //adjustFlipY.call(clicked);
        }
        else if(clicked.closest('#modalLoading')) {
            
        }
        else {

            //A SWAP MODE SURVIVES ANY CLICK INSIDE ITS OWN MENU, OTHERWISE THIS WOULD CLOSE
            //THE PANEL AND TAKE THE BUTTON WITH IT
            if(swapMode && clicked.closest(swapMenu())) {

            }
            else {
                resetAllFocus();
                hideColorManagerPanel();
                swapPanels('canvas');
            }
        }
    }
    else if(e.button == 2) {

        // LATCH BEFORE ANY BRANCH RUNS. A #cnvPin RIGHT CLICK FALLS THROUGH TO THE FINAL
        //else, WHERE hideColorManagerPanel CLEARS isColorPicking - AND contextmenu FIRES
        //LATER IN THIS SAME GESTURE, TOO LATE TO KNOW PICKING HAD BEEN LIVE.
        //THE PANEL EXCLUSIONS MATCH THE TRAILING BLOCK IN rightClick: A RIGHT CLICK INSIDE
        //THE COLOR PANELS MUST NOT CANCEL PICKING
        cancelledColorPicking = isColorPicking && !clicked.closest('#colorPickerPanel') && !clicked.closest('#colorManagerPanel');

        if(clicked.type == "text" || clicked.type == "number") {
            e.preventDefault();
            clicked.blur()
        }

        if(clicked.className == "pinBody") {

            linkCanvasWithPanelLayer(null, clicked)
        }
        else if(clicked.closest(".moveable-area")) {

        }
        else if(clicked.closest('#modalLoading')) {
            
        }
        else {
            resetAllFocus()
            hideAllOptions();
            hideColorManagerPanel();
            hideAllContextMenu();
            swapPanels('canvas');
        }
    } 

})

//PUT ENCODING OPT HERE SINCE IT'S SAME TRIGGER 'POINTERDOWN'
//HOWEVER IT CAN'T BE ON EVENT DELEGATION SINCE IT NEEDS TO BE PAUSED AND RESUME
//ALSO IT NEEDS TO BE ADDED HERE INSTEAD IN HISTORY SINCE IT'S BEING FIRED THERE FIRST
//WHICH CAUSES BUG AS IT ENCODES FIRST BEFORE FIRING ACTUAL FUNCTION
document.querySelector('#propertiesBox').querySelectorAll('[class*=opt]').forEach(function(input) {
    if(input.innerText != 'Remove Mockup') input.addEventListener('pointerdown', encodeDropdownMulti);
});

//SAVE PANEL SITS OUTSIDE PROPERTIESBOX SO IT NEEDS ITS OWN BINDING
document.querySelector('#pnlBoxSave').querySelectorAll('[class*=opt]').forEach(function(input) {
    input.addEventListener('pointerdown', encodeDropdownMulti);
});

//////////////////////////POINTER UP////////////////

document.addEventListener('pointerup', e => {

    if(e.button == 0) {

        isSelecting = false;

        let clicked = e.target;

        if(isSelecting2) {

            if(checkObjFocusCount() == 0) {
                
                isScaling = false;
                isRotating = false;
                isResizing = false;
                isDragging = false;

                isSelecting2 = false;
                
                selectPin.style.width = `0px`;
                selectPin.style.height = `0px`;
                selectPin.style.visibility = `hidden`;

                cnvBox.style.position = "relative";
                cnvGrpLayers.style.boxSizing = "border-box";
                cnvGrpLayers.style.overflow = "hidden";
            }
            
        }
        else {
            
            //////////////////CLICKED AS CLOSEST///////////////
            if(clicked.closest('.pnlBoxLayer') ) {
                //[!]IMPORTANT SO IT WILL SELECT PNLBOXLAYER USING CTRL AND SHIFT
            }
            else if(clicked.closest('input[type = "text"]:not([data-unit]), textarea') && clicked.className != "txtHeader") { 
                hideAllOptions();
                //THIS IS A MUST
                //SO POINTERDOWN WON'T PASS TO ELSE STATEMENT
                //THIS WILL RUIN THE CLICK EVENT
            }   
            else if(clicked.closest('input[data-unit], input[type = "number"]')) {
                hideAllOptions();
                //EMPTY FOR CLICKING INPUT NUMBERS
                //SO NOT TO LOSE FOCUS
            }
            else if(clicked.closest('.pinBody')) {
                //empty condition just for pins
            }
            else if(clicked.closest(".moveable-area")) {
            //EMPTY CONDITION FOR MOVEABLE
            }
            else if(clicked.closest(".moveable-control-box")) {
                //EMPTY CONDITION FOR MOVEABLE
            }
            else if(clicked.closest(".moveable-control")) {
                //EMPTY CONDITION FOR MOVEABLE
            }
            else if(clicked.closest(".moveable-direction")) {
                //EMPTY CONDITION FOR MOVEABLE
            }
            else if(clicked.closest(`[class*="dropdown"]`)) {
                //[!] DO NOT DELETE. POINTERUP RUNS BEFORE CLICK, AND WITHOUT THIS THE
                //LEFT MENU DROPDOWNS FALL THROUGH TO THE FINAL ELSE, WHICH CALLS
                //RESETALLFOCUS AND CLEARS THE FLAGS THE CLICK HANDLER IS ABOUT TO READ
            }
            else if(clicked.closest(`[class*='opt']`)) {
                //[!] DO NOT DELETE
                //BLANK TO AVOID FAST CLICK AND WILL TRIGGER ELSE
            }
            else if(clicked.closest('#rightPanel')) {
                //EMPTY CONDITION FOR CLICKING EMOJIS AND SYMBOLS
                //TO AVOID RESETTING FOCUS OBJECTS
                //BUT ALLOW HIDING OPTIONS
                //hideAllOptions();
   
                isColorPicking = false;
        
            }
            else if(clicked.closest('#colorPickerPanel')) {
                //empty condition for any textboxes from colorpicker
                //so it will not remove any focus
            }
            else if(clicked.closest('#colorManagerPanel')) {
                //empty condition for any textboxes from colorpicker
                //so it will not remove any focus
            }
            else if(clicked.closest(`[class*='rcOption']`)) {
                e.preventDefault();
                hideAllContextMenu();
            }
            else if(clicked.closest(`[id*='rcCanvas']`)) {
                //EMPTY CONDITION TO NOT LOSE FOCUS
            }
            else if(clicked.closest(`[id*='divZoom']`)) {
                //EMPTY CONDITION TO NOT LOSE FOCUS
            }
            else if(clicked.id == "cnvPin") {  

                /*
                if(isColorPicking2 == true) {
                    isColorPicking2 = false;
                }
                else {
                    resetAllFocus()
                    swapPanels('canvas'); 
                }
                */
            }
            else if(clicked.closest('.chkFlipX')) {
                //console.log(clicked)
                //adjustFlipX.call(clicked);
            }
            else if(clicked.closest('.chkFlipY')) {
                //console.log(clicked)
                //adjustFlipY.call(clicked);
            }
            else if(clicked.closest('#btnSwitchSolid')) {

            }
            else if(clicked.closest('#btnSwitchGradient')) {
                
            }
            else if(clicked.closest('#modalLoading')) {
            
            }
            else {

                if(colorPickerPanel.dataset.show == "false" && colorManagerPanel.dataset.show == "false"
                && !(swapMode && clicked.closest(swapMenu()))) {

                    resetAllFocus();
                    swapPanels('canvas');   

                    //enable back cnvGrpLayers css
                    cnvGrpLayers.style.boxSizing = "border-box";
                    cnvGrpLayers.style.overflow = "hidden";
                }
                
            }
        }
    }
})

//////////////////////////POINTER CANCEL////////////

//[!]THE BROWSER CAN TAKE A POINTER AWAY MID GESTURE
//TOUCH INTERRUPTION, PALM REJECTION, OR THE OS GRABBING THE POINTER
//NO POINTERUP EVER ARRIVES IN THAT CASE SO THE PIN WOULD STAY GLUED
//TO THE CURSOR - SAME EXIT AS POINTERUP
//NO E.BUTTON CHECK HERE SINCE POINTERCANCEL REPORTS -1
document.addEventListener('pointercancel', e => {

    if(e.button == 0) {

        isSelecting = false;

        if(isSelecting2) {

            if(checkObjFocusCount() == 0) {

                isScaling = false;
                isRotating = false;
                isResizing = false;
                isDragging = false;

                isSelecting2 = false;
                
                selectPin.style.width = `0px`;
                selectPin.style.height = `0px`;
                selectPin.style.visibility = `hidden`;

                cnvBox.style.position = "relative";
                cnvGrpLayers.style.boxSizing = "border-box";
                cnvGrpLayers.style.overflow = "hidden";
            }
        }
    }
})

/////////////////////DOUBLE CLICKS/////////////////
document.addEventListener('dblclick', async (e) => {
    
    let clicked = e.target;

    if(clicked.closest('input[type = "text"]:not([data-unit]), textarea')) {
        
        //NEED CLICK EVENT FOR ACCURATE CARETPOST
        let input = clicked.closest('input[type = "text"]:not([data-unit]), textarea');

        input.select();
        highlight = true;
        
        if(input.className == 'txtHeader') {
            input.dataset.readonly = "false";
            previousInput = input;
            input.style.paddingLeft = "0.25em";
            input.style.paddingRight = "0.25em";
            input.style.textAlign = "left";
            renameTxtHeader.call(clicked.closest('.txtHeader'))
        }
        
    }
    else if(clicked.closest('.wrapFonts')) {

        clicked.closest('.wrapFonts').style.borderColor = "var(--accent)";

        if(swapMode == "font") {
            let wrap = clicked.closest('.wrapFonts');
            swapFontOnTargets(wrap.dataset.font, wrap.dataset.class, wrap.dataset.source);
        }
        else createPnlBoxText.call(clicked.closest('.wrapFonts'));
    }
    else if(clicked.closest(`[class*='thumbPreview']`)) {

        clicked.closest(`[class*='thumbPreview']`).style.borderColor = "transparent";
        clicked.closest(`[class*='thumbPreview']`).style.backgroundColor = "transparent";

        let me = clicked.closest(`[class*='thumbPreview']`);
        let menu = clicked.closest(`[id*='menu']`);

        if(menu.id == 'menuDesigns') {
            showLoading();
            await fetchTemplateFromCacheByIndex(me.dataset.index);
        }
        else if(menu.id == 'menuPatterns') {
            showLoading();
            createPnlBoxPattern(me.querySelector('svg').id, me.querySelector('svg').outerHTML);
        }
        else if(menu.id == 'menuElements') {

            if(me.dataset.type == "shape") {
                createPnlBoxElement(me.dataset.cloudid, me.querySelector('svg').outerHTML, me.dataset.post, me.dataset.type);
            }
            else if(me.dataset.type == "image") {
               
                createPnlBoxImage(me.dataset.cloudid);
            }
            else if(me.dataset.type == "3D mockup") {
                createPnlBox3DMockup(me.dataset.cloudid, me.dataset.id, me.dataset.modelcolor);
            }
            else if(me.dataset.type == "line") {
                createPnlBoxLine();
            }
            else if(me.dataset.type == "raster graphics") {

                //THE COVER STARTS AT THE CLICK, NOT AFTER THE FETCH. fetchRowById READS THE
                //CACHE API AND FALLS THROUGH TO SUPABASE ON A MISS, AND NOTHING WAS COVERING
                //THAT - sir, 2026-09-24: "i was staring at blank". menuDesigns AND menuPatterns
                //BESIDE THIS ONE BOTH ALREADY DO IT.
                //
                //createCanvasImage TAKES ITS OWN activeAsync REFERENCE SYNCHRONOUSLY, BEFORE
                //THE hideLoading BELOW RUNS, SO THE COUNTER NEVER RETURNS TO 0 IN BETWEEN AND
                //THE COVER RUNS UNBROKEN FROM THE CLICK TO THE PICTURE
                showLoading();

                try {

                    let data = await fetchRowById('elements', me.dataset.id);

                    if(data != null && data.length > 0) {
                        createPnlBoxImageGraphics(me.dataset.cloudid, data[0].source, me.dataset.id);
                    }
                }
                finally {

                    //A FETCH THAT THROWS USED TO LEAVE NOTHING BEHIND. NOW IT WOULD LEAVE THE
                    //COUNTER HELD AND THE KEYBOARD BLOCKED FOR THE REST OF THE SESSION
                    hideLoading();
                }
            }
            else if(me.dataset.type == "icon") {

                let n = me.dataset.thumbno;
                let source = decodeURIComponent(me.dataset.source)
                let post = me.dataset.post;
                let subtype = "icon";
                createPnlBoxVectorGraphics(n, source, post, subtype)
            }
        }
        

    }
    else if(clicked.closest(`.pnlBoxThumb`)) {
        dblClickThumb.call(clicked.closest(`.pnlBoxThumb`));
    }

})

/////////////////////POINTER ENTER/////////////////
document.addEventListener('pointerover', e => {

    let clicked = e.target;

    if(clicked.closest('.wrapFonts')) {

        clicked.closest('.wrapFonts').style.border = "1px solid var(--sharp-track)";

        if(clicked.closest('.wrapFonts').firstElementChild) {
            clicked.closest('.wrapFonts').children[0].style.color = "var(--sharp)";
            clicked.closest('.wrapFonts').children[0].style.filter = "none";
        }
        
    }
    else if(clicked.closest(`[class*='thumbPreview']`)) {
        clicked.closest(`[class*='thumbPreview']`).style.borderColor = "var(--sharp-track)";
    }
    else if(clicked.closest(`.pnlBoxThumb`)) {
        pointerOverThumb.call(clicked.closest(`.pnlBoxThumb`));
    } 
    else if(clicked.closest(`.pnlBoxLayer`)) {
        let panel = clicked.closest(`.pnlBoxLayer`);
        hoverPanelBoxLayer(panel);
    }

    //[!] SKIP EVERY HOVER CURSOR WHILE A GESTURE IS LIVE. THE BRANCH BELOW WRITES
    //clicked.style.cursor ON #CNVPIN ITSELF, WHICH IS THE SAME INLINE PROPERTY
    //setGestureCursor() USES - LAST WRITE WINS, SO WITHOUT THIS GUARD EVERY
    //POINTERMOVE ACROSS THE CANVAS WIPED THE LOCKED CURSOR AND IT FLICKERED
    if(!isColorPicking && clicked.closest('#cnvPin') && !isGestureLive()) {

        if(clicked.className == "pinBody" || clicked.id == "cnvPin") {
            clicked.style.cursor = "default";
        }
        else if(clicked.className == "pinL" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M0.400005 13.6928C-0.133329 13.3848 -0.133329 12.615 0.400005 12.3071L7 8.49661C7.53334 8.18869 8.2 8.57359 8.2 9.18943V16.8105C8.2 17.4263 7.53334 17.8112 7 17.5033L0.400005 13.6928Z' fill='%23000000'/%3E%3Cpath d='M1.21432 13.1733C1.08099 13.0964 1.08099 12.9039 1.21432 12.8269L7.04289 9.4618C7.17623 9.38482 7.34289 9.48105 7.34289 9.63501L7.34289 16.3653C7.34289 16.5192 7.17623 16.6154 7.04289 16.5385L1.21432 13.1733Z' fill='white'/%3E%3Cpath d='M25.6 12.3071C26.1333 12.615 26.1333 13.3848 25.6 13.6928L19 17.5033C18.4666 17.8112 17.8 17.4263 17.8 16.8104L17.8 9.18943C17.8 8.57359 18.4666 8.18868 19 8.4966L25.6 12.3071Z' fill='%23000000'/%3E%3Cpath d='M24.7857 12.8265C24.919 12.9035 24.919 13.096 24.7857 13.1729L18.9571 16.5381C18.8238 16.6151 18.6571 16.5188 18.6571 16.3649L18.6571 9.63462C18.6571 9.48066 18.8238 9.38443 18.9571 9.46141L24.7857 12.8265Z' fill='white'/%3E%3Cpath d='M7.99993 14.9999V10.9999L17.9999 10.9999V14.9999L7.99993 14.9999Z' fill='%23000000'/%3E%3Cpath d='M6.99993 13.9999V11.9999L18.9999 11.9999V13.9999L6.99993 13.9999Z' fill='white'/%3E%3C/g%3E%3C/svg%3E") 13 13, auto`;
        }
        else if(clicked.className == "pinL2" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M0.400005 13.6928C-0.133329 13.3848 -0.133329 12.615 0.400005 12.3071L7 8.49661C7.53334 8.18869 8.2 8.57359 8.2 9.18943V16.8105C8.2 17.4263 7.53334 17.8112 7 17.5033L0.400005 13.6928Z' fill='%23000000'/%3E%3Cpath d='M1.21432 13.1733C1.08099 13.0964 1.08099 12.9039 1.21432 12.8269L7.04289 9.4618C7.17623 9.38482 7.34289 9.48105 7.34289 9.63501L7.34289 16.3653C7.34289 16.5192 7.17623 16.6154 7.04289 16.5385L1.21432 13.1733Z' fill='white'/%3E%3Cpath d='M25.6 12.3071C26.1333 12.615 26.1333 13.3848 25.6 13.6928L19 17.5033C18.4666 17.8112 17.8 17.4263 17.8 16.8104L17.8 9.18943C17.8 8.57359 18.4666 8.18868 19 8.4966L25.6 12.3071Z' fill='%23000000'/%3E%3Cpath d='M24.7857 12.8265C24.919 12.9035 24.919 13.096 24.7857 13.1729L18.9571 16.5381C18.8238 16.6151 18.6571 16.5188 18.6571 16.3649L18.6571 9.63462C18.6571 9.48066 18.8238 9.38443 18.9571 9.46141L24.7857 12.8265Z' fill='white'/%3E%3Cpath d='M7.99993 14.9999V10.9999L17.9999 10.9999V14.9999L7.99993 14.9999Z' fill='%23000000'/%3E%3Cpath d='M6.99993 13.9999V11.9999L18.9999 11.9999V13.9999L6.99993 13.9999Z' fill='white'/%3E%3C/g%3E%3C/svg%3E") 13 13, auto`;
        }
        else if(clicked.className == "pinR" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M0.400005 13.6928C-0.133329 13.3848 -0.133329 12.615 0.400005 12.3071L7 8.49661C7.53334 8.18869 8.2 8.57359 8.2 9.18943V16.8105C8.2 17.4263 7.53334 17.8112 7 17.5033L0.400005 13.6928Z' fill='%23000000'/%3E%3Cpath d='M1.21432 13.1733C1.08099 13.0964 1.08099 12.9039 1.21432 12.8269L7.04289 9.4618C7.17623 9.38482 7.34289 9.48105 7.34289 9.63501L7.34289 16.3653C7.34289 16.5192 7.17623 16.6154 7.04289 16.5385L1.21432 13.1733Z' fill='white'/%3E%3Cpath d='M25.6 12.3071C26.1333 12.615 26.1333 13.3848 25.6 13.6928L19 17.5033C18.4666 17.8112 17.8 17.4263 17.8 16.8104L17.8 9.18943C17.8 8.57359 18.4666 8.18868 19 8.4966L25.6 12.3071Z' fill='%23000000'/%3E%3Cpath d='M24.7857 12.8265C24.919 12.9035 24.919 13.096 24.7857 13.1729L18.9571 16.5381C18.8238 16.6151 18.6571 16.5188 18.6571 16.3649L18.6571 9.63462C18.6571 9.48066 18.8238 9.38443 18.9571 9.46141L24.7857 12.8265Z' fill='white'/%3E%3Cpath d='M7.99993 14.9999V10.9999L17.9999 10.9999V14.9999L7.99993 14.9999Z' fill='%23000000'/%3E%3Cpath d='M6.99993 13.9999V11.9999L18.9999 11.9999V13.9999L6.99993 13.9999Z' fill='white'/%3E%3C/g%3E%3C/svg%3E") 13 13, auto`;
        }
        else if(clicked.className == "pinR2" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M0.400005 13.6928C-0.133329 13.3848 -0.133329 12.615 0.400005 12.3071L7 8.49661C7.53334 8.18869 8.2 8.57359 8.2 9.18943V16.8105C8.2 17.4263 7.53334 17.8112 7 17.5033L0.400005 13.6928Z' fill='%23000000'/%3E%3Cpath d='M1.21432 13.1733C1.08099 13.0964 1.08099 12.9039 1.21432 12.8269L7.04289 9.4618C7.17623 9.38482 7.34289 9.48105 7.34289 9.63501L7.34289 16.3653C7.34289 16.5192 7.17623 16.6154 7.04289 16.5385L1.21432 13.1733Z' fill='white'/%3E%3Cpath d='M25.6 12.3071C26.1333 12.615 26.1333 13.3848 25.6 13.6928L19 17.5033C18.4666 17.8112 17.8 17.4263 17.8 16.8104L17.8 9.18943C17.8 8.57359 18.4666 8.18868 19 8.4966L25.6 12.3071Z' fill='%23000000'/%3E%3Cpath d='M24.7857 12.8265C24.919 12.9035 24.919 13.096 24.7857 13.1729L18.9571 16.5381C18.8238 16.6151 18.6571 16.5188 18.6571 16.3649L18.6571 9.63462C18.6571 9.48066 18.8238 9.38443 18.9571 9.46141L24.7857 12.8265Z' fill='white'/%3E%3Cpath d='M7.99993 14.9999V10.9999L17.9999 10.9999V14.9999L7.99993 14.9999Z' fill='%23000000'/%3E%3Cpath d='M6.99993 13.9999V11.9999L18.9999 11.9999V13.9999L6.99993 13.9999Z' fill='white'/%3E%3C/g%3E%3C/svg%3E") 13 13, auto`;
        }
        else if(clicked.className == "pinT" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M12.3072 0.399759C12.6151 -0.133575 13.3849 -0.133575 13.6928 0.399759L17.5033 6.99976C17.8113 7.53309 17.4263 8.19976 16.8105 8.19976H9.18949C8.57365 8.19976 8.18875 7.53309 8.49667 6.99976L12.3072 0.399759Z' fill='%23000000'/%3E%3Cpath d='M12.8266 1.21408C12.9036 1.08074 13.096 1.08074 13.173 1.21408L16.5381 7.04265C16.6151 7.17598 16.5189 7.34265 16.3649 7.34265H9.63468C9.48072 7.34265 9.38449 7.17598 9.46147 7.04265L12.8266 1.21408Z' fill='white'/%3E%3Cpath d='M13.6928 25.5997C13.3849 26.133 12.6151 26.133 12.3072 25.5997L8.49667 18.9997C8.18875 18.4663 8.57365 17.7997 9.18949 17.7997H16.8105C17.4264 17.7997 17.8113 18.4663 17.5033 18.9997L13.6928 25.5997Z' fill='%23000000'/%3E%3Cpath d='M13.1734 24.7854C13.0964 24.9187 12.904 24.9187 12.827 24.7854L9.46186 18.9568C9.38488 18.8235 9.48111 18.6568 9.63507 18.6568H16.3653C16.5193 18.6568 16.6155 18.8235 16.5385 18.9568L13.1734 24.7854Z' fill='white'/%3E%3Cpath d='M11 7.99968H15V17.9997H11V7.99968Z' fill='%23000000'/%3E%3Cpath d='M12 6.99968H14V18.9997H12V6.99968Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 13 13, auto`;
        }
        else if(clicked.className == "pinT2" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M12.3072 0.399759C12.6151 -0.133575 13.3849 -0.133575 13.6928 0.399759L17.5033 6.99976C17.8113 7.53309 17.4263 8.19976 16.8105 8.19976H9.18949C8.57365 8.19976 8.18875 7.53309 8.49667 6.99976L12.3072 0.399759Z' fill='%23000000'/%3E%3Cpath d='M12.8266 1.21408C12.9036 1.08074 13.096 1.08074 13.173 1.21408L16.5381 7.04265C16.6151 7.17598 16.5189 7.34265 16.3649 7.34265H9.63468C9.48072 7.34265 9.38449 7.17598 9.46147 7.04265L12.8266 1.21408Z' fill='white'/%3E%3Cpath d='M13.6928 25.5997C13.3849 26.133 12.6151 26.133 12.3072 25.5997L8.49667 18.9997C8.18875 18.4663 8.57365 17.7997 9.18949 17.7997H16.8105C17.4264 17.7997 17.8113 18.4663 17.5033 18.9997L13.6928 25.5997Z' fill='%23000000'/%3E%3Cpath d='M13.1734 24.7854C13.0964 24.9187 12.904 24.9187 12.827 24.7854L9.46186 18.9568C9.38488 18.8235 9.48111 18.6568 9.63507 18.6568H16.3653C16.5193 18.6568 16.6155 18.8235 16.5385 18.9568L13.1734 24.7854Z' fill='white'/%3E%3Cpath d='M11 7.99968H15V17.9997H11V7.99968Z' fill='%23000000'/%3E%3Cpath d='M12 6.99968H14V18.9997H12V6.99968Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 13 13, auto`;
        }
        else if(clicked.className == "pinB" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M12.3072 0.399759C12.6151 -0.133575 13.3849 -0.133575 13.6928 0.399759L17.5033 6.99976C17.8113 7.53309 17.4263 8.19976 16.8105 8.19976H9.18949C8.57365 8.19976 8.18875 7.53309 8.49667 6.99976L12.3072 0.399759Z' fill='%23000000'/%3E%3Cpath d='M12.8266 1.21408C12.9036 1.08074 13.096 1.08074 13.173 1.21408L16.5381 7.04265C16.6151 7.17598 16.5189 7.34265 16.3649 7.34265H9.63468C9.48072 7.34265 9.38449 7.17598 9.46147 7.04265L12.8266 1.21408Z' fill='white'/%3E%3Cpath d='M13.6928 25.5997C13.3849 26.133 12.6151 26.133 12.3072 25.5997L8.49667 18.9997C8.18875 18.4663 8.57365 17.7997 9.18949 17.7997H16.8105C17.4264 17.7997 17.8113 18.4663 17.5033 18.9997L13.6928 25.5997Z' fill='%23000000'/%3E%3Cpath d='M13.1734 24.7854C13.0964 24.9187 12.904 24.9187 12.827 24.7854L9.46186 18.9568C9.38488 18.8235 9.48111 18.6568 9.63507 18.6568H16.3653C16.5193 18.6568 16.6155 18.8235 16.5385 18.9568L13.1734 24.7854Z' fill='white'/%3E%3Cpath d='M11 7.99968H15V17.9997H11V7.99968Z' fill='%23000000'/%3E%3Cpath d='M12 6.99968H14V18.9997H12V6.99968Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 13 13, auto`;
        }
        else if(clicked.className == "pinB2" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M12.3072 0.399759C12.6151 -0.133575 13.3849 -0.133575 13.6928 0.399759L17.5033 6.99976C17.8113 7.53309 17.4263 8.19976 16.8105 8.19976H9.18949C8.57365 8.19976 8.18875 7.53309 8.49667 6.99976L12.3072 0.399759Z' fill='%23000000'/%3E%3Cpath d='M12.8266 1.21408C12.9036 1.08074 13.096 1.08074 13.173 1.21408L16.5381 7.04265C16.6151 7.17598 16.5189 7.34265 16.3649 7.34265H9.63468C9.48072 7.34265 9.38449 7.17598 9.46147 7.04265L12.8266 1.21408Z' fill='white'/%3E%3Cpath d='M13.6928 25.5997C13.3849 26.133 12.6151 26.133 12.3072 25.5997L8.49667 18.9997C8.18875 18.4663 8.57365 17.7997 9.18949 17.7997H16.8105C17.4264 17.7997 17.8113 18.4663 17.5033 18.9997L13.6928 25.5997Z' fill='%23000000'/%3E%3Cpath d='M13.1734 24.7854C13.0964 24.9187 12.904 24.9187 12.827 24.7854L9.46186 18.9568C9.38488 18.8235 9.48111 18.6568 9.63507 18.6568H16.3653C16.5193 18.6568 16.6155 18.8235 16.5385 18.9568L13.1734 24.7854Z' fill='white'/%3E%3Cpath d='M11 7.99968H15V17.9997H11V7.99968Z' fill='%23000000'/%3E%3Cpath d='M12 6.99968H14V18.9997H12V6.99968Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 13 13, auto`;
        }
        else if(clicked.className == "pinTL" && !isResizing && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='11 11'%3E%3Cpath d='M5.22599 21.661C4.96521 22.1127 4.31328 22.1127 4.05251 21.661L0.0920152 14.8013C-0.168758 14.3496 0.157209 13.785 0.678755 13.785H8.59974C9.12128 13.785 9.44725 14.3496 9.18648 14.8013L5.22599 21.661Z' fill='%23000000'/%3E%3Cpath d='M4.81984 20.7294C4.75465 20.8424 4.59166 20.8424 4.52647 20.7294L1.15272 14.886C1.08752 14.7731 1.16902 14.6319 1.2994 14.6319L8.04691 14.6319C8.17729 14.6319 8.25879 14.7731 8.19359 14.886L4.81984 20.7294Z' fill='white'/%3E%3Cpath d='M21.6615 4.05199C22.1132 4.31276 22.1132 4.96469 21.6615 5.22546L14.8017 9.18591C14.35 9.44668 13.7854 9.12072 13.7854 8.59918V0.678268C13.7854 0.156727 14.35 -0.169236 14.8017 0.0915348L21.6615 4.05199Z' fill='%23000000'/%3E%3Cpath d='M20.7299 4.49204C20.8428 4.55723 20.8428 4.72021 20.7299 4.78541L14.8864 8.15913C14.7735 8.22432 14.6323 8.14283 14.6323 8.01244V1.265C14.6323 1.13462 14.7735 1.05313 14.8864 1.11832L20.7299 4.49204Z' fill='white'/%3E%3Cpath d='M14.3784 2.52153C8.76577 2.52153 2.52203 8.5957 2.52203 14.2083H6.75657C6.75657 10.8208 10.5674 6.75592 14.3784 6.75592V2.52153Z' fill='%23000000'/%3E%3Cpath d='M14.8019 3.36841C8.87367 3.36841 3.36892 8.87311 3.36892 14.8013H5.90957C5.90957 9.71999 10.5673 5.90904 14.8019 5.90904V3.36841Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 11 11, auto`;
        }
        else if(clicked.className == "pinTL2" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M2.89321 3.87335C2.73382 3.27849 3.27815 2.73416 3.87301 2.89355L11.2343 4.86602C11.8292 5.02541 12.0284 5.76898 11.593 6.20445L6.2041 11.5933C5.76864 12.0288 5.02507 11.8295 4.86568 11.2347L2.89321 3.87335Z' fill='%23000000'/%3E%3Cpath d='M3.83631 4.08187C3.79646 3.93316 3.93254 3.79708 4.08126 3.83692L10.5822 5.57884C10.7309 5.61869 10.7807 5.80458 10.6718 5.91345L5.91283 10.6725C5.80397 10.7813 5.61807 10.7315 5.57823 10.5828L3.83631 4.08187Z' fill='white'/%3E%3Cpath d='M23.1063 22.1265C23.2657 22.7213 22.7214 23.2656 22.1265 23.1063L14.7652 21.1338C14.1703 20.9744 13.9711 20.2308 14.4065 19.7954L19.7954 14.4065C20.2309 13.971 20.9744 14.1703 21.1338 14.7651L23.1063 22.1265Z' fill='%23000000'/%3E%3Cpath d='M22.1632 21.9179C22.2031 22.0666 22.067 22.2027 21.9183 22.1629L15.4173 20.421C15.2686 20.3811 15.2188 20.1952 15.3277 20.0864L20.0867 15.3274C20.1955 15.2185 20.3814 15.2683 20.4213 15.417L22.1632 21.9179Z' fill='white'/%3E%3Cpath d='M7.34285 10.1716L10.1713 7.34318L18.6566 15.8285L15.8281 18.6569L7.34285 10.1716Z' fill='%23000000'/%3E%3Cpath d='M7.34285 8.7574L8.75706 7.34318L18.6566 17.2427L17.2423 18.6569L7.34285 8.7574Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 13 13, auto`;
        }
        else if(clicked.className == "pinTR" && !isResizing && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(-0.9 0.9)' transform-origin='11 11'%3E%3Cpath d='M5.22599 21.661C4.96521 22.1127 4.31328 22.1127 4.05251 21.661L0.0920152 14.8013C-0.168758 14.3496 0.157209 13.785 0.678755 13.785H8.59974C9.12128 13.785 9.44725 14.3496 9.18648 14.8013L5.22599 21.661Z' fill='%23000000'/%3E%3Cpath d='M4.81984 20.7294C4.75465 20.8424 4.59166 20.8424 4.52647 20.7294L1.15272 14.886C1.08752 14.7731 1.16902 14.6319 1.2994 14.6319L8.04691 14.6319C8.17729 14.6319 8.25879 14.7731 8.19359 14.886L4.81984 20.7294Z' fill='white'/%3E%3Cpath d='M21.6615 4.05199C22.1132 4.31276 22.1132 4.96469 21.6615 5.22546L14.8017 9.18591C14.35 9.44668 13.7854 9.12072 13.7854 8.59918V0.678268C13.7854 0.156727 14.35 -0.169236 14.8017 0.0915348L21.6615 4.05199Z' fill='%23000000'/%3E%3Cpath d='M20.7299 4.49204C20.8428 4.55723 20.8428 4.72021 20.7299 4.78541L14.8864 8.15913C14.7735 8.22432 14.6323 8.14283 14.6323 8.01244V1.265C14.6323 1.13462 14.7735 1.05313 14.8864 1.11832L20.7299 4.49204Z' fill='white'/%3E%3Cpath d='M14.3784 2.52153C8.76577 2.52153 2.52203 8.5957 2.52203 14.2083H6.75657C6.75657 10.8208 10.5674 6.75592 14.3784 6.75592V2.52153Z' fill='%23000000'/%3E%3Cpath d='M14.8019 3.36841C8.87367 3.36841 3.36892 8.87311 3.36892 14.8013H5.90957C5.90957 9.71999 10.5673 5.90904 14.8019 5.90904V3.36841Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 11 11, auto`;
        }
        else if(clicked.className == "pinTR2" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M22.1267 2.89348C22.7216 2.73409 23.2659 3.27842 23.1065 3.87328L21.1341 11.2346C20.9747 11.8295 20.2311 12.0287 19.7956 11.5933L14.4068 6.20437C13.9713 5.76891 14.1705 5.02534 14.7654 4.86595L22.1267 2.89348Z' fill='%23000000'/%3E%3Cpath d='M21.9182 3.83658C22.0669 3.79673 22.203 3.93281 22.1632 4.08153L20.4213 10.5825C20.3814 10.7312 20.1955 10.781 20.0866 10.6721L15.3276 5.9131C15.2188 5.80424 15.2686 5.61834 15.4173 5.5785L21.9182 3.83658Z' fill='white'/%3E%3Cpath d='M3.87326 23.1066C3.2784 23.266 2.73407 22.7216 2.89346 22.1268L4.86593 14.7654C5.02532 14.1706 5.76889 13.9713 6.20435 14.4068L11.5932 19.7957C12.0287 20.2311 11.8295 20.9747 11.2346 21.1341L3.87326 23.1066Z' fill='%23000000'/%3E%3Cpath d='M4.08178 22.1635C3.93307 22.2033 3.79698 22.0672 3.83683 21.9185L5.57875 15.4176C5.6186 15.2689 5.80449 15.2191 5.91336 15.3279L10.6724 20.0869C10.7812 20.1958 10.7314 20.3817 10.5827 20.4216L4.08178 22.1635Z' fill='white'/%3E%3Cpath d='M15.8285 7.34313L18.6569 10.1716L10.1716 18.6568L7.34319 15.8284L15.8285 7.34313Z' fill='%23000000'/%3E%3Cpath d='M17.2427 7.34313L18.6569 8.75734L8.7574 18.6568L7.34319 17.2426L17.2427 7.34313Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 13 13, auto`;
        }
        else if(clicked.className == "pinBL" && !isResizing && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 -0.9)' transform-origin='11 11'%3E%3Cpath d='M5.22599 21.661C4.96521 22.1127 4.31328 22.1127 4.05251 21.661L0.0920152 14.8013C-0.168758 14.3496 0.157209 13.785 0.678755 13.785H8.59974C9.12128 13.785 9.44725 14.3496 9.18648 14.8013L5.22599 21.661Z' fill='%23000000'/%3E%3Cpath d='M4.81984 20.7294C4.75465 20.8424 4.59166 20.8424 4.52647 20.7294L1.15272 14.886C1.08752 14.7731 1.16902 14.6319 1.2994 14.6319L8.04691 14.6319C8.17729 14.6319 8.25879 14.7731 8.19359 14.886L4.81984 20.7294Z' fill='white'/%3E%3Cpath d='M21.6615 4.05199C22.1132 4.31276 22.1132 4.96469 21.6615 5.22546L14.8017 9.18591C14.35 9.44668 13.7854 9.12072 13.7854 8.59918V0.678268C13.7854 0.156727 14.35 -0.169236 14.8017 0.0915348L21.6615 4.05199Z' fill='%23000000'/%3E%3Cpath d='M20.7299 4.49204C20.8428 4.55723 20.8428 4.72021 20.7299 4.78541L14.8864 8.15913C14.7735 8.22432 14.6323 8.14283 14.6323 8.01244V1.265C14.6323 1.13462 14.7735 1.05313 14.8864 1.11832L20.7299 4.49204Z' fill='white'/%3E%3Cpath d='M14.3784 2.52153C8.76577 2.52153 2.52203 8.5957 2.52203 14.2083H6.75657C6.75657 10.8208 10.5674 6.75592 14.3784 6.75592V2.52153Z' fill='%23000000'/%3E%3Cpath d='M14.8019 3.36841C8.87367 3.36841 3.36892 8.87311 3.36892 14.8013H5.90957C5.90957 9.71999 10.5673 5.90904 14.8019 5.90904V3.36841Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 11 11, auto`;
        }
        else if(clicked.className == "pinBL2" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M22.1267 2.89348C22.7216 2.73409 23.2659 3.27842 23.1065 3.87328L21.1341 11.2346C20.9747 11.8295 20.2311 12.0287 19.7956 11.5933L14.4068 6.20437C13.9713 5.76891 14.1705 5.02534 14.7654 4.86595L22.1267 2.89348Z' fill='%23000000'/%3E%3Cpath d='M21.9182 3.83658C22.0669 3.79673 22.203 3.93281 22.1632 4.08153L20.4213 10.5825C20.3814 10.7312 20.1955 10.781 20.0866 10.6721L15.3276 5.9131C15.2188 5.80424 15.2686 5.61834 15.4173 5.5785L21.9182 3.83658Z' fill='white'/%3E%3Cpath d='M3.87326 23.1066C3.2784 23.266 2.73407 22.7216 2.89346 22.1268L4.86593 14.7654C5.02532 14.1706 5.76889 13.9713 6.20435 14.4068L11.5932 19.7957C12.0287 20.2311 11.8295 20.9747 11.2346 21.1341L3.87326 23.1066Z' fill='%23000000'/%3E%3Cpath d='M4.08178 22.1635C3.93307 22.2033 3.79698 22.0672 3.83683 21.9185L5.57875 15.4176C5.6186 15.2689 5.80449 15.2191 5.91336 15.3279L10.6724 20.0869C10.7812 20.1958 10.7314 20.3817 10.5827 20.4216L4.08178 22.1635Z' fill='white'/%3E%3Cpath d='M15.8285 7.34313L18.6569 10.1716L10.1716 18.6568L7.34319 15.8284L15.8285 7.34313Z' fill='%23000000'/%3E%3Cpath d='M17.2427 7.34313L18.6569 8.75734L8.7574 18.6568L7.34319 17.2426L17.2427 7.34313Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 13 13, auto`;
        }
        else if(clicked.className == "pinBR" && !isResizing && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(-0.9 -0.9)' transform-origin='11 11'%3E%3Cpath d='M5.22599 21.661C4.96521 22.1127 4.31328 22.1127 4.05251 21.661L0.0920152 14.8013C-0.168758 14.3496 0.157209 13.785 0.678755 13.785H8.59974C9.12128 13.785 9.44725 14.3496 9.18648 14.8013L5.22599 21.661Z' fill='%23000000'/%3E%3Cpath d='M4.81984 20.7294C4.75465 20.8424 4.59166 20.8424 4.52647 20.7294L1.15272 14.886C1.08752 14.7731 1.16902 14.6319 1.2994 14.6319L8.04691 14.6319C8.17729 14.6319 8.25879 14.7731 8.19359 14.886L4.81984 20.7294Z' fill='white'/%3E%3Cpath d='M21.6615 4.05199C22.1132 4.31276 22.1132 4.96469 21.6615 5.22546L14.8017 9.18591C14.35 9.44668 13.7854 9.12072 13.7854 8.59918V0.678268C13.7854 0.156727 14.35 -0.169236 14.8017 0.0915348L21.6615 4.05199Z' fill='%23000000'/%3E%3Cpath d='M20.7299 4.49204C20.8428 4.55723 20.8428 4.72021 20.7299 4.78541L14.8864 8.15913C14.7735 8.22432 14.6323 8.14283 14.6323 8.01244V1.265C14.6323 1.13462 14.7735 1.05313 14.8864 1.11832L20.7299 4.49204Z' fill='white'/%3E%3Cpath d='M14.3784 2.52153C8.76577 2.52153 2.52203 8.5957 2.52203 14.2083H6.75657C6.75657 10.8208 10.5674 6.75592 14.3784 6.75592V2.52153Z' fill='%23000000'/%3E%3Cpath d='M14.8019 3.36841C8.87367 3.36841 3.36892 8.87311 3.36892 14.8013H5.90957C5.90957 9.71999 10.5673 5.90904 14.8019 5.90904V3.36841Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 11 11, auto`;
        }
        else if(clicked.className == "pinBR2" && !isRotating && !isScaling) {
            let pin = clicked.closest('.pinBody');
            clicked.style.cursor = `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(${Number(pin.dataset.rotation)} 0 0) scale(0.9 0.9)' transform-origin='13 13'%3E%3Cpath d='M2.89321 3.87335C2.73382 3.27849 3.27815 2.73416 3.87301 2.89355L11.2343 4.86602C11.8292 5.02541 12.0284 5.76898 11.593 6.20445L6.2041 11.5933C5.76864 12.0288 5.02507 11.8295 4.86568 11.2347L2.89321 3.87335Z' fill='%23000000'/%3E%3Cpath d='M3.83631 4.08187C3.79646 3.93316 3.93254 3.79708 4.08126 3.83692L10.5822 5.57884C10.7309 5.61869 10.7807 5.80458 10.6718 5.91345L5.91283 10.6725C5.80397 10.7813 5.61807 10.7315 5.57823 10.5828L3.83631 4.08187Z' fill='white'/%3E%3Cpath d='M23.1063 22.1265C23.2657 22.7213 22.7214 23.2656 22.1265 23.1063L14.7652 21.1338C14.1703 20.9744 13.9711 20.2308 14.4065 19.7954L19.7954 14.4065C20.2309 13.971 20.9744 14.1703 21.1338 14.7651L23.1063 22.1265Z' fill='%23000000'/%3E%3Cpath d='M22.1632 21.9179C22.2031 22.0666 22.067 22.2027 21.9183 22.1629L15.4173 20.421C15.2686 20.3811 15.2188 20.1952 15.3277 20.0864L20.0867 15.3274C20.1955 15.2185 20.3814 15.2683 20.4213 15.417L22.1632 21.9179Z' fill='white'/%3E%3Cpath d='M7.34285 10.1716L10.1713 7.34318L18.6566 15.8285L15.8281 18.6569L7.34285 10.1716Z' fill='%23000000'/%3E%3Cpath d='M7.34285 8.7574L8.75706 7.34318L18.6566 17.2427L17.2423 18.6569L7.34285 8.7574Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A") 13 13, auto`;
        }
    }
    
});

/////////////////////POINTER MOVE////////////////////

document.addEventListener('pointermove', e => {

    let clicked = e.target;

    if(clicked.closest(`[class*='thumbPreview']`)) {
        clicked.closest(`[class*='thumbPreview']`).style.borderColor = "var(--sharp-track)";

        tooltip(e, clicked.closest(`[class*='thumbPreview']`), true);
    }
    else {

        if(isColorPicking) {
            
            captureEyeDropperPixels(e);
        }
    }

})

/////////////////////POINTER LEAVE/////////////////
document.addEventListener('pointerout', e => {

    let clicked = e.target;

    if(clicked.closest('.wrapFonts')) {
        clicked.closest('.wrapFonts').style.backgroundColor = "transparent";
        clicked.closest('.wrapFonts').style.border = "1px solid transparent";
        if(clicked.closest('.wrapFonts').firstElementChild) {
            clicked.closest('.wrapFonts').children[0].style.color = "var(--muted-blue-text)";
            clicked.closest('.wrapFonts').children[0].style.filter = "saturate(1) brightness(1.5)";
        }
    }
    else if (clicked.closest(`[class*='thumbPreview']`)) {
   
        clicked.closest(`[class*='thumbPreview']`).style.borderColor = "transparent";
        clicked.closest(`[class*='thumbPreview']`).style.backgroundColor = "transparent";

        tooltip(e, clicked.closest(`[class*='thumbPreview']`), false);
    }
    else if(clicked.closest(`.pnlBoxThumb`)) {
        pointerLeaveThumb.call(clicked.closest(`.pnlBoxThumb`));
    }
    else if(clicked.closest(`.pnlBoxLayer`)) {
        let panel = clicked.closest(`.pnlBoxLayer`);
        outPanelBoxLayer(panel);
    }  
})

/////////////////////FOCUSOUT///////////////////
document.addEventListener('focusout', async (e) => {

    let clicked = e.target;

    if(clicked.className == 'txtHeader') {
        saveTxtHeader.call(clicked);
        clicked.dataset.readonly = "true";
    }
    
    else if(clicked.className.includes('Color') && clicked.type == "text") {
        
        testHexCode(clicked);

        if(clicked.value == "Linear" || clicked.value == "Radial") {
            layerSequence = clicked.dataset.gradient;
            
        }
        else {
            let rgb = hex2RGBStringEncoding(clicked.value);
            let alpha = clicked.dataset.alpha;
            layerSequence = `rgba(${rgb}, ${alpha})`;
            
        }

        setTimeout(() => {
            captureEyeDropperScreenshot()
        }, 300)
        
    }

    else if(!clicked.className.includes('Color') && !clicked.className.includes('txtSearch')) {
        clicked.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: "Enter"}));
    }

    else if(clicked.className == 'txtGradientStop') {
        convertNumberInput2TextGradientStop.call(clicked);
    }
    
    highlight = false;

});

//////////////////////CHANGE////////////////////
document.addEventListener('change', e => {

    let clicked = e.target;

    if(clicked.closest('.txtHeader')) {
        saveTxtHeader.call(clicked.closest('.txtHeader'))
        encodeTxtHeader.call(clicked.closest('.txtHeader'))
    }
    else if(clicked.className == 'txtGradient') {
        adjustGradientValue(clicked)
        stringifyGradient();
    }
    else if(clicked.className == 'txtGradientStop') {
        adjustGradientStop(clicked);
        stringifyGradient();
    }
    else if(clicked.className == "txtWidthLayer") {
        adjustLayerWidth.call(clicked);
    }
    else if(clicked.className == "txtHeightLayer") {
        adjustLayerHeight.call(clicked);
    }
    else if(clicked.className == "txtXLayer") {
        adjustLayerX.call(clicked);
    }
    else if(clicked.className == "txtYLayer") {
        adjustLayerY.call(clicked);
    }
    else if(clicked.className == "txtOpacityLayer") {
        chooseLayerOpacity.call(clicked);
    }
    else if(clicked.className == "txtRotationLayer") {
        chooseLayerRotation.call(clicked);
    }

    //[!]THIS IS IMPORTANT ONLY FOR TEXT TO BLUR
    //DONT BLUR NUMBER INPUT SINCE THEY CAN INCREASE USING UP AND DOWN ARROW
    if(clicked.dataset.unit == null && clicked.type != 'number') {
        clicked.blur();
        highlight = false;
    }

    /*
    if(clicked.className.includes('txtSearch')) {
        let opt = clicked.closest('.pnlDropHeader').querySelector(`[class*='opt']`);
        if(opt != null) {
            opt.click();
            hideAllOptions();
            isOptionVisible = false;
        }
    }
    */
    
});

//////////////////////CHANGE////////////////////
document.addEventListener('input', e => {

    let clicked = e.target;
    
    if(clicked.className == 'rngInput') {

        if(clicked.nextElementSibling.className == "txtWidthLayer") {
            adjustLayerWidth.call(clicked.nextElementSibling);
        }
        else if(clicked.nextElementSibling.className == "txtHeightLayer") {
            adjustLayerHeight.call(clicked.nextElementSibling);
        }
        else if(clicked.nextElementSibling.className == "txtXLayer") {
            adjustLayerX.call(clicked.nextElementSibling);
        }
        else if(clicked.nextElementSibling.className == "txtYLayer") {
            adjustLayerY.call(clicked.nextElementSibling);
        }
        else if(clicked.nextElementSibling.className == "txtOpacityLayer") {
            chooseLayerOpacity.call(clicked.nextElementSibling);
        }
        else if(clicked.nextElementSibling.className == "txtRotationLayer") {
            chooseLayerRotation.call(clicked.nextElementSibling);
        }
    }
});

//////////////////////SELECT////////////////////
document.addEventListener('select', e => {

    let input = e.target;

    if (input.selectionStart === 0 && input.selectionEnd === input.value.length && input.value.length > 0) {
        highlight = true
    }
});


//////////////////////KEYDOWN////////////////////
document.addEventListener('keydown', async (e) => {
    
    let clicked = e.target;

    if(clicked.closest('.txtHeader')) {
        validateTxtHeader(e)
    }

    //FOR GRADIENT COLOR MANAGER PANEL
    //IF YOU PRESS ENTER THEN CONVERT THE VALUE
    //THEN BLUR TO TRIGGER FOCUSOUT EVENT ABOVE
    if(clicked.className == 'txtGradientStop') {
        if(e.key == "Enter") {
            clicked.blur();
        }
    }

    else if(clicked.className == 'txtEditorBox') {
        if(e.key == "Escape") {
            saveInnerTextData();
            document.querySelector('.txtEditorBox').blur();
            swapPanels('text');
        }
    }

    else if(clicked.className.includes('txtSearch') && !clicked.className.includes('EmojiSymbol')) {

        if(e.key == "Enter") {
            
            let opt = clicked.closest('.pnlDropHeader').querySelector(`[class*='opt']`);

            if(opt != null) {
              
                opt.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true}));
                hideAllOptions();
         
            }
            else {
                hideAllOptions();
            }
        }

        else if(e.key == "Backspace") {
            
            if(clicked.value.trim().length < 2) {
                hideAllOptions();
                clicked.nextElementSibling.style.visibility = "hidden"
                isOptionVisible = false;
            }
        }

        else if(e.key == "Delete") { 
        
            clicked.value = "";
            clicked.nextElementSibling.style.visibility = "hidden";
            clicked.parentElement.nextElementSibling.style.display = "none";
            isOptionVisible = false;
           
        }
    }
    else if(clicked.className.includes('txtSearch') && clicked.className.includes('EmojiSymbol')) {
        
        if(e.key == "Backspace") {
            
            if(clicked.value.trim().length == 0) {
                resetAllEmojis();
                resetAllSymbols();
                clicked.nextElementSibling.style.visibility = "hidden";
            }
        }

        else if(e.key == "Delete") { 
            clicked.value = "";
            resetAllEmojis();
            resetAllSymbols();
            clicked.nextElementSibling.style.visibility = "hidden";
           
        }
    }

    if(e.key == "Tab") {
        e.preventDefault();
    }
    //[!] SCOPED. THIS WAS UNSCOPED AND BLURRED ANYTHING ON ANY Enter, SO THE TEXTAREA
    //[!] COULD NEVER TAKE A NEWLINE. EVERYTHING ELSE STILL BLURS AS BEFORE
    else if(e.key == "Enter" && clicked.className != "txtEditorBox") {
        clicked.blur();
    }

});


//////////////////////KEYUP////////////////////
//NO async, NO await BELOW. ALL THREE SUGGESTION FUNCTIONS READ LOCAL KEYWORD LISTS NOW,
//SO THE WHOLE PATH IS SYNCHRONOUS AND A KEYSTROKE CANNOT BE OUTRUN BY A REQUEST STILL IN
//THE AIR. THAT IS WHY THIS NEEDS NO DEBOUNCE AND NO STALE-RESPONSE GUARD.
document.addEventListener('keyup', (e) => {
    
    let clicked = e.target;

    if(clicked.className.includes('txtSearch') && !clicked.className.includes('EmojiSymbol') && e.key != "Enter") {

        if(clicked.value.trim().length >= 2) {

            clicked.nextElementSibling.style.visibility = "visible";
            
            if(clicked.className == 'txtSearchFont') {
                searchFontSuggestions.call(clicked);
            }
            else if(clicked.className == 'txtSearchTemplate') { 
                searchTemplateSuggestions.call(clicked)
            }
            else {
                searchSuggestions.call(clicked);
            }
            
        }
        else if(clicked.value.trim().length == 1) {
            isOptionVisible = false;
            clicked.nextElementSibling.style.visibility = "visible";
        }
        else if(clicked.value.trim().length == 0) {
            isOptionVisible = false;
            clicked.parentElement.nextElementSibling.style.display = "none";
            clicked.nextElementSibling.style.visibility = "hidden";
        }
    }
    
});

async function reset() {
    //RESET TEMPLATE
    await showFillers(document.getElementsByClassName('configScroll')[0])
    await showFillers(document.getElementsByClassName('configScroll')[1])
    await showFillers(document.getElementsByClassName('configScroll')[3])

    await resetContentPreviewTemplates();

    //RESET PATTERNS
    await resetContentPreviewPattern();

    //RESET ELEMENTS
    await resetContentPreview(document.getElementsByClassName('configScroll')[3], 'elements');
    
}
reset();

//////////////////////SCROLL///////////////////
document.addEventListener('scroll', function(e) {
    let clicked = e.target;

    if(clicked.className == "wrapThumbScroller") {
        categoryLazyLoad.call(clicked)
    }
}, true)

