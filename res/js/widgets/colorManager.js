let isSliding = false;
let sliderPick = null;


function letsSummonColorManager(me, defaultGradient) {
    
    let colorManagerPanel = document.getElementById('colorManagerPanel');

    //[!] THE MANAGER IS A GRADIENT SWATCH LIST, NOT A COLOR BOARD. THE
    //EYEDROPPER BELONGS TO COLORPICKERPANEL ONLY, SO THE PICKER GOES DOWN
    //WHENEVER THE MANAGER TAKES OVER. ONE CALL CLEARS ISCOLORPICKING,
    //RCEYEDROPPER AND THE CNVPIN CURSOR
    hideColorPickerPanel();

    let pnlbox = me.closest(`[id*='pnlBox']`)?.id;
    colorManagerPanel.dataset.pnlbox = pnlbox;

    colorPickerTrigger = me;
    
    let meLeft = colorPickerTrigger.getBoundingClientRect().left;
    let meTop = colorPickerTrigger.getBoundingClientRect().top;
    let meWidth = colorPickerTrigger.clientWidth;
    let meHeight = colorPickerTrigger.clientHeight;

    colorPickerTrigger.previousElementSibling.removeEventListener('change', encodeColorMulti);

    if(colorManagerPanel.dataset.show == "false") {
        
        colorManagerPanel.dataset.show = "true";
        colorManagerPanel.style.display = "flex";
        colorManagerPanel.style.left = meLeft - (colorManagerPanel.clientWidth - 10) + (meWidth/2) + 'px';
        
        if(meTop + colorManagerPanel.clientHeight > window.innerHeight) {
            colorManagerPanel.style.top = meTop - colorManagerPanel.clientHeight - 8 + 'px';
        }
        else {
            colorManagerPanel.style.top = meTop + meHeight + 8 + 'px';
        }

        txtHexValue.value = "Gradient";

    }

    else if(colorManagerPanel.dataset.show == "true") {

        colorManagerPanel.dataset.show = "false";
        colorManagerPanel.style.display = "none";
        return
    }

    //AFTER SHOWING THE PANEL
    //THEN POSITION EVERYTHING IN DEFAULT
    if(defaultGradient) {
        let hex1 = colorPickerTrigger.previousElementSibling.value;
        //GET DATASET ALPHA
        let alpha = colorPickerTrigger.previousElementSibling.dataset.alpha;
        //CONVERT TO HSB TO GET CURRENT BRIGHTNESS
        let hsb = hex2HSBEncoding(hex1);
        //GET FIRST RGB
        let rgb1 = hsb2RGBEncoding(hsb);

        let newbright;

        if(hsb[2] > 50) {
            newbright = hsb[2] - 25;
        }
        else {
            newbright = hsb[2] + 25;
        }

        //ASSIGN NEW VALUE OF BRIGHTNESS TO HSB ARRAY
        hsb[2] = newbright
        //GET FIRST RGB2
        let rgb2 = hsb2RGBEncoding(hsb);
        let hex2 = rgb2HexEncoding(rgb2);

        let divSliderGradient = document.getElementById('divSliderGradient');
        let divGradientContainer = document.getElementById('divGradientContainer');

        divSliderGradient.innerHTML = 
        `<div id="divGradientMeter">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAYCAYAAAAYuwRKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB9SURBVHgB7dmxDcMgAAVRHGUW9l8HlnEyAJIL67r3SvuXJyTEtda6x8Gc8/R57L2Hvf3T/jMgICwSwiIhLBLCInHdf6cfbjf2b/ZOLBLCIiEsEsIiISwSX7cb+2LvxCIhLBLCIiEsEsIi4a3QPtk7sUgIi4SwSAiLhLBI/ACJi55AaHxJKQAAAABJRU5ErkJggg=="/>
            <div id="gradientMeter" style="background: linear-gradient(90deg, rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, ${alpha}) 0%, rgba(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]}, ${alpha}) 100%)"></div>
        </div> 
        <div class="sliderGradient" data-index="0" style="left: ${-6}px;">
            <svg width="12" height="14" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V5.98083C8 6.2657 7.87851 6.53705 7.66602 6.72677L4.66602 9.40534C4.28662 9.74409 3.71338 9.74409 3.33398 9.40534L0.333984 6.72677C0.121491 6.53705 0 6.2657 0 5.98083V1Z" fill="rgba(${rgb1}, ${alpha})"/>
            </svg>
        </div>
        <div class="sliderGradient" data-index="1" style="left: ${divGradientContainer.offsetWidth - 6}px;">
            <svg width="12" height="14" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V5.98083C8 6.2657 7.87851 6.53705 7.66602 6.72677L4.66602 9.40534C4.28662 9.74409 3.71338 9.74409 3.33398 9.40534L0.333984 6.72677C0.121491 6.53705 0 6.2657 0 5.98083V1Z" fill="rgba(${rgb2}, ${alpha})"/>
            </svg>
        </div>`

        divGradientContainer.innerHTML = 
        `<div class="colorManagerEntry" data-index="0">
            <div class="divGradientStop">
                <svg width="12" height="14" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V5.98083C8 6.2657 7.87851 6.53705 7.66602 6.72677L4.66602 9.40534C4.28662 9.74409 3.71338 9.74409 3.33398 9.40534L0.333984 6.72677C0.121491 6.53705 0 6.2657 0 5.98083V1Z" fill="white"/>
                </svg>
                <input type="text" class="txtGradientStop" value="0%" data-index="0" spellcheck = "false" data-gramm="false" data-gramm_editor = "false" data-enable-grammarly = "false">
            </div>
            <input type="text" class="txtGradient" value="${hex1}" data-alpha="1" data-gradient="" data-index="0" spellcheck = "false" data-gramm="false" data-gramm_editor = "false" data-enable-grammarly = "false">
            <div class="thumbPickerGradient">
                <img class="thumbCheckered" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABLSURBVHgB7ZSxDQAgCARf4yzsvw4sgw6ABVFjwV8JJFfw+aaqjgARicYwM2TuOx5DwX9B80W0yKZld88fFBCMW2lhFxUWsIsoOGcC0gAgQNZZQskAAAAASUVORK5CYII=">
                <div class="thumbGradient" data-index="0" style="background: rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, ${alpha})"></div>
            </div>
            <div class="btnDelGradient" style="opacity: 1;" data-index = "0">
                <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" width="2" height="10" transform="rotate(90 10 0)" fill="salmon"/>
                </svg>
            </div>
        </div>
        <div class="colorManagerEntry" data-index="0">
            <div class="divGradientStop">
                <svg width="12" height="14" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V5.98083C8 6.2657 7.87851 6.53705 7.66602 6.72677L4.66602 9.40534C4.28662 9.74409 3.71338 9.74409 3.33398 9.40534L0.333984 6.72677C0.121491 6.53705 0 6.2657 0 5.98083V1Z" fill="white"/>
                </svg>
                <input type="text" class="txtGradientStop" value="100%" data-index="1" spellcheck = "false" data-gramm="false" data-gramm_editor = "false" data-enable-grammarly = "false">
            </div>
            <input type="text" class="txtGradient" value="${hex2}" data-alpha="1" data-gradient="" data-index="1" spellcheck = "false" data-gramm="false" data-gramm_editor = "false" data-enable-grammarly = "false">
            <div class="thumbPickerGradient">
                <img class="thumbCheckered" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABLSURBVHgB7ZSxDQAgCARf4yzsvw4sgw6ABVFjwV8JJFfw+aaqjgARicYwM2TuOx5DwX9B80W0yKZld88fFBCMW2lhFxUWsIsoOGcC0gAgQNZZQskAAAAASUVORK5CYII=">
                <div class="thumbGradient" data-index="1" style="background: rgba(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]}, ${alpha})"></div>
            </div>
            <div class="btnDelGradient" style="opacity: 1;" data-index = "1">
                <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" width="2" height="10" transform="rotate(90 10 0)" fill="salmon"/>
                </svg>
            </div>
        </div>`

        colorPickerTrigger.previousElementSibling.value = "Linear";
        colorPickerTrigger.previousElementSibling.dataset.gradient = `linear-gradient(180deg, rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, ${alpha}) 0%, rgba(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]}, ${alpha}) 100%)`;

        //THE NEW GRADIENT IS LINEAR AT 180deg, WHICH THE PANEL SHOWS AS 0°. THE MODE AND THE ANGLE
        //USED TO BE LEFT AS THE LAST GRADIENT HAD THEM - MEASURED 2026-09-28: A FRESH GRADIENT SHOWED
        //45° FROM ANOTHER LAYER, AND A LATER Radial -> Linear APPLIED THAT 45 TO THIS ONE
        document.getElementById('dropdownGradientMode').firstElementChild.innerText = "Linear";
        document.getElementById('txtGradientRotation').type = "text";
        document.getElementById('txtGradientRotation').value = "0°";
        setGradientRotationState(true);
        colorPickerTrigger.querySelector('.thumbColor').style.background = `linear-gradient(180deg, rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, ${alpha}) 0%, rgba(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]}, ${alpha}) 100%)`;

    }
    else {

        parseGradient2Panel(colorPickerTrigger.previousElementSibling.dataset.gradient)

    }
    
}

function selectSliderGradient(e) {
    //MAKE ALL SLIDER GRADIENT ZINDEX = 1
    let sliderGradient = document.querySelectorAll('.sliderGradient');
    sliderGradient.forEach((slider) => {
        slider.style.zIndex = 1;
    })
    //CHECK IF CLOSEST IS SLIDERGRADIENT CLASS
    if(e.target.closest('.sliderGradient')) {

        isSliding = true;
        //MAKE THIS SLIDER GRADIENT ZINDEX = 99
        sliderPick = e.target.closest('.sliderGradient');
        sliderPick.style.zIndex = 99;
    }
}
//USE DOCUMENT FOR DELEGATION AND BUBBLE EVENT
//UNLIKE COLORBAR, SLIDER GRADIENT DOES NOT CLICK ON BAR
//BUT ON ACTUAL SLIDER THUMB
document.addEventListener('pointerdown', selectSliderGradient)

function moveSliderGradient(e) {

    if(isSliding) {

        let txtGradientStop = document.querySelectorAll('.txtGradientStop');
        let divSliderGradient = document.getElementById('divSliderGradient').getBoundingClientRect();

        let pos;

        if(e.clientX >= divSliderGradient.left && e.clientX <= divSliderGradient.right) {
            sliderPick.style.left = e.clientX - divSliderGradient.left - (sliderPick.clientWidth/2) + 'px';
            pos = ((e.clientX - divSliderGradient.left) / divSliderGradient.width) * 100;
            
        }
        else if(e.clientX < divSliderGradient.left) {
            sliderPick.style.left = '-6px';
            pos = 0;
        }
        else if(e.clientX > divSliderGradient.right) {
            sliderPick.style.left = '194px';
            pos = 100;
        }
        
        let index = Number(sliderPick.dataset.index)
        txtGradientStop[index].value = Math.round(pos) + '%';
        txtGradientStop[index].setAttribute('value', Math.round(pos) + '%');
    
        stringifyGradient()
    }
}
document.addEventListener('pointermove', moveSliderGradient);


function upSliderGradient(e) {    
    e.preventDefault();

    if(isSliding) {
        sliderPick.style.zIndex = 1;
        isSliding = false;
        sliderPick = null;

        colorPickerTrigger.previousElementSibling.addEventListener('change', encodeColorMulti);
        colorPickerTrigger.previousElementSibling.dispatchEvent(new Event('change'));
        colorPickerTrigger.previousElementSibling.removeEventListener('change', encodeColorMulti);
    }
}
document.addEventListener('pointerup', upSliderGradient);


////////////////////////SWITCH TO SOLID/////////////////////


btnSwitchSolid.addEventListener('click', function() {
    
    let colorManagerPanel = document.getElementById('colorManagerPanel');

    if(colorManagerPanel.dataset.show == "true") {
        
        let txtGradient = document.querySelectorAll('.txtGradient');

        //[!] A GRADIENT STOP PICKER CAN BE SITTING ON TOP OF THE MANAGER.
        //WHEN IT IS, COLORPICKERTRIGGER POINTS AT THAT STOP THUMB AND
        //COLORPICKERPANEL IS ALREADY SHOWING, SO THE LETSSUMMONCOLORPICKER
        //CALL BELOW WOULD TOGGLE IT BACK OFF AND BOTH PANELS WOULD VANISH.
        //CLOSE IT FIRST, WHICH ALSO HANDS COLORPICKERTRIGGER BACK TO THE
        //OWNING THUMBPICKER. THE ELSE COVERS THE CASE WHERE THE STOP PICKER
        //WAS ALREADY DISMISSED BUT THE TRIGGER IS STILL PARKED
        if(colorPickerPanel.dataset.show == "true") {
            hideColorPickerPanel();
        }
        else if(colorPickerTrigger2 != null) {
            colorPickerTrigger = colorPickerTrigger2;
            colorPickerTrigger2 = null;
        }

        colorManagerPanel.style.display = "none";
        colorManagerPanel.dataset.show = "false";

        colorPickerPanel.dataset.pnlbox = colorManagerPanel.dataset.pnlbox;
        
        colorPickerTrigger.previousElementSibling.value = txtGradient[0].value;
        colorPickerTrigger.previousElementSibling.dataset.alpha = txtGradient[0].dataset.alpha;

        layerSequence = `rgba(${hex2RGBStringEncoding(txtGradient[0].value)}, ${txtGradient[0].dataset.alpha})`;

        letsSummonColorPicker(colorPickerTrigger, true)
        //colorPickerPanel.dataset.show = "true";

        colorPickerTrigger.previousElementSibling.dispatchEvent(new Event('change'));

        colorPickerTrigger2 = null;

    }

})
//THEN ENCODE THE SWITCH
btnSwitchSolid.addEventListener('click', encodeColorSwitch);


//===============LOSE FOCUS ON COLOR MANAGER=================

function hideColorManagerPanel() {

    let colorManagerPanel = document.getElementById('colorManagerPanel');

    hideColorPickerPanel();

    if(colorManagerPanel.dataset.show == "true") {

        colorManagerPanel.style.display = "none";
        colorManagerPanel.dataset.show = "false";
    }

    colorPickerTrigger = null;
    colorPickerTrigger2 = null;
}

////////////////////CHANGE TXTGRADIENT VALUE///////////////////
function adjustGradientValue(me) {

    let alpha = me.dataset.alpha;
    let index = Number(me.dataset.index);
    let thumbPicker = me.nextElementSibling;
    let rgb = hex2RGBStringEncoding(testHexCode(me));
    let sliderGradient = document.querySelectorAll('.sliderGradient');

    me.setAttribute('value', testHexCode(me))
    //change thumbpick color
    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
    //change color of corresponding gradient stop
    sliderGradient[index].querySelector('path').setAttribute('fill', `#${testHexCode(me)}`);
}

////////////////////CHANGE TXTGRADIENT VALUE///////////////////
function adjustGradientStop(me) {
    
    let numVal = Number(me.value.replace('%', ''));
    let index = Number(me.dataset.index);
    let sliderGradient = document.querySelectorAll('.sliderGradient');
    let divSliderGradient = document.getElementById('divSliderGradient')

    sliderGradient.forEach((slider) => {
        slider.style.zIndex = 1;
    })

    let pos = ((Number(numVal) / 100) * divSliderGradient.offsetWidth)
    sliderGradient[index].style.left = pos - 6 + 'px';
    sliderGradient[index].style.zIndex = 99;

}

function convertTextInput2NumberGradientStop() {

    this.value = Number(this.value.replace('%', ''));
    this.type = 'number';
    this.select();
    this.setAttribute('max', '100');
    this.setAttribute('min', '0');
}

function convertNumberInput2TextGradientStop() {

    if(Number(this.value) > Number(this.max)) {
        this.value = this.max;
    }
    else if(Number(this.value) < Number(this.min)) {
        this.value = this.min;
    }

    this.type = 'text';
    this.value = this.value.toString() + '%';
    this.blur();

}

///////////////////STRINGIFY GRADIENT CHANGES//////////////////

function stringifyGradient() {

    let arr = [];
    let hex, rgb, alpha, stop;
    let gradientString = "";
    let appendRGBA = "";
    let gradientMeter = document.getElementById('gradientMeter');
    let txtGradientRotation = document.querySelector('#txtGradientRotation');
    let dropdownGradientMode = document.querySelector('#dropdownGradientMode');
    let newDegree = txtGradientRotation.value.replace('°', '');
    newDegree = Number(newDegree) + 180 + 'deg'; //ADD 180 TO FLIP

    //REFORMAT FIRST ALL TXTGRADIENTSTOP VALUE
    //REMOVE '%' AND ADD VALUE TO ARRAY FOR SORTING
    for(let a = 0; a < document.querySelectorAll('.txtGradientStop').length; a++) { 
        arr[a] = Number(document.querySelectorAll('.txtGradientStop')[a].value.replace('%', ''));
    }

    arr.sort((a,b) => a-b)

    for(let a = 0; a < arr.length; a++) {

        //GET THE TXTGRADIENTSTOP WITH VALUE OF CURRENT ARRAY
        let txtGradientStop = document.getElementsByClassName('txtGradientStop');
        let txtGradient = document.getElementsByClassName('txtGradient');

        for(let b = 0; b < txtGradientStop.length; b++) {

            if(Number(txtGradientStop[b].value.replace('%', '')) == arr[a]) {
                stop = Number(txtGradientStop[b].value.replace('%', ''));
                
                hex = testHexCode(txtGradient[b]);
                rgb = hex2RGBStringEncoding(hex);
                alpha = txtGradient[b].dataset.alpha;
                
                if(a < arr.length-1) {
                    appendRGBA += `rgba(${rgb}, ${alpha}) ${stop}%, `
                }
                else if(a == arr.length-1) {
                    appendRGBA += `rgba(${rgb}, ${alpha}) ${stop}%`
                }
            }          
        }

        
    }

    if(dropdownGradientMode.firstElementChild.innerText == "Linear") {
        gradientString = `linear-gradient(${newDegree}, ${appendRGBA})`;
    }
    else if(dropdownGradientMode.firstElementChild.innerText == "Radial") {
        //THE ROTATION BOX IS KEPT IN THE STRING - SEE radialAtWithRotation
        gradientString = `radial-gradient(circle at ${radialAtWithRotation(txtGradientRotation.value.replace('°', ''))}, ${appendRGBA})`;
    }

    //APPLY GRADIENT STRING TO GRADIENT METER FOR ACTUAL PREVIEW
    gradientMeter.style.background = `linear-gradient(90deg, ${appendRGBA})`;

    //SWITCH TO COLOROPICKERTRIGGER2 WHEN COLORPICKERTRIGGER1 NOT AVAILABLE
    //VICE VERSA
    
    if(colorPickerTrigger2 != null) {

        //IF STRIGIFYGRADIENT IS CALLED BUT NOT USING SLIDERGRADIENT
        //ADD ENCODECOLORMULTI
        colorPickerTrigger2.previousElementSibling.dataset.gradient = gradientString;
        colorPickerTrigger2.previousElementSibling.value = dropdownGradientMode.firstElementChild.innerText;

        if(!isSliding) {
            
            colorPickerTrigger2.previousElementSibling.addEventListener('change', encodeColorMulti);
        }

        colorPickerTrigger2.previousElementSibling.dispatchEvent(new Event('change'));
    }
    else {

        //IF STRIGIFYGRADIENT IS CALLED BUT NOT USING SLIDERGRADIENT
        //ADD ENCODECOLORMULTI
        colorPickerTrigger.previousElementSibling.dataset.gradient = gradientString;
        colorPickerTrigger.previousElementSibling.value = dropdownGradientMode.firstElementChild.innerText;

        if(!isSliding) {
        
            colorPickerTrigger.previousElementSibling.addEventListener('change', encodeColorMulti);
        }
        
        colorPickerTrigger.previousElementSibling.dispatchEvent(new Event('change'));
    }
    
}

//sir, 2026-09-28: "i change the gradient rotation 90 then changed the linear to radial, then
//export. then reimport i checked, it's still radial but 0 degrees wtf". A RADIAL GRADIENT HAS NO
//ANGLE, SO radial-gradient(circle at center, ...) SAVED NOTHING AND THE 90 ONLY LIVED IN THE
//ROTATION BOX UNTIL THE PAGE CLOSED. THE ANGLE NOW RIDES INSIDE THE STRING ITSELF AS A POSITION
//THAT ADDS UP TO THE CENTRE: calc(50% + 90px - 90px) IS EXACTLY 50%, SO THE BROWSER DRAWS IT PIXEL
//FOR PIXEL LIKE circle at center (MEASURED IN HEADLESS CHROMIUM). BECAUSE IT IS PART OF THE STRING
//IT GOES WHEREVER THE STRING ALREADY GOES - dataLayer, dataCanvas, dataPattern, HISTORY, THE SAVED
//FILE, AUTOSAVE. NO *, _, ~ OR ': ', WHICH HISTORY AND THE FILE SPLIT ON, AND NO 'deg', WHICH EVERY
//PARSER READS AS A LINEAR ANGLE. 0 STAYS THE PLAIN circle at center
function radialAtWithRotation(rotation) {

    rotation = Number(rotation) || 0;

    return rotation == 0 ? "center" : `calc(50% + ${rotation}px - ${rotation}px) 50%`;
}

//THE ANGLE BACK OUT OF A RADIAL STRING, OR 0 FOR ONE MADE BEFORE THIS (OR AT 0)
function radialRotationFromString(gradientString) {

    let memo = /calc\(50% \+ (-?\d+(?:\.\d+)?)px - \1px\)/.exec(gradientString);

    return memo ? Number(memo[1]) : 0;
}

///////////////////PARSE GRADIENT//////////////////////////////
function parseGradient2Panel(gradientString) {

    let appendRGBA = "";

    let txtAlpha = document.getElementById('txtAlpha');
    let txtGradientRotation = document.querySelector('#txtGradientRotation');
    let dropdownGradientMode = document.querySelector('#dropdownGradientMode');
    let divGradientContainer = document.querySelector('#divGradientContainer');
    let divSliderGradient = document.querySelector('#divSliderGradient');

    if(gradientString.includes('linear')) {
        gradientString = gradientString.replace('linear-gradient', '');
        dropdownGradientMode.firstElementChild.innerText = "Linear";
    }
    else if(gradientString.includes('radial')) {
        gradientString = gradientString.replace('radial-gradient', '');
        dropdownGradientMode.firstElementChild.innerText = "Radial";
    }

    gradientString = gradientString.split(', rgba');

    //GET DEGREE IF THERE'S ANY AND REPLACE
    //sir, 2026-09-28: "then try to undo, then rotation value gets fucked ... like fucking blank".
    //A RADIAL GRADIENT USED TO HIDE THIS INPUT WITH visibility, AND NOTHING EVER SHOWED IT AGAIN -
    //MEASURED ON THE LIVE APP: FROM THE FIRST UNDO THAT LANDED ON Radial THE BOX STAYED EMPTY
    //THROUGH EVERY LATER UNDO, REDO AND GRADIENT. THE DROPDOWN DIMS AND DISABLES IT INSTEAD, SO
    //THE TWO PATHS DISAGREED. BOTH GO THROUGH setGradientRotationState NOW. type IS SET BACK TO
    //text FIRST: A NUMBER INPUT CANNOT HOLD THE ° AND WOULD EMPTY ITSELF
    txtGradientRotation.type = "text";

    if(gradientString[0].includes('deg')) {
   
        gradientString[0] = gradientString[0].replace('(', '');
        txtGradientRotation.value = Number(gradientString[0].replace('deg', '')) - 180;
        txtGradientRotation.value = txtGradientRotation.value + '°';

        setGradientRotationState(true);
    }
    //IF NO 'DEG' MEANS IT'S RADIAL. ITS ANGLE IS THE ONE STORED IN THE STRING, SO SWITCHING BACK TO
    //LINEAR RESUMES FROM IT - AFTER A RELOAD OR AN IMPORT TOO, NOT JUST IN THIS TAB
    else {
        txtGradientRotation.value = radialRotationFromString(gradientString[0]) + '°';
        setGradientRotationState(false);
    }

    //RESET OUT DIVSLIDERGRADIENT
    divSliderGradient.innerHTML = 
    `<div id="divGradientMeter">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAYCAYAAAAYuwRKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB9SURBVHgB7dmxDcMgAAVRHGUW9l8HlnEyAJIL67r3SvuXJyTEtda6x8Gc8/R57L2Hvf3T/jMgICwSwiIhLBLCInHdf6cfbjf2b/ZOLBLCIiEsEsIiISwSX7cb+2LvxCIhLBLCIiEsEsIi4a3QPtk7sUgIi4SwSAiLhLBI/ACJi55AaHxJKQAAAABJRU5ErkJggg=="/>
        <div id="gradientMeter"></div>
    </div> `;

    //EMPTY OUT DIVGRADIENTCONTAINER
    divGradientContainer.innerHTML = "";

    for(let a = 1; a < gradientString.length; a++) {

        let split = gradientString[a].split(' ');
        let rgb = 'rgb' + split[0] + split[1] + split[2].replace(',', ')');

        let alpha = split[3].replace(')', '');

        let rgba = 'rgba' + split[0] + split[1] + split[2] + split[3];
        
        //reformat split[4] or stop %
        split[4] = split[4].replace(')', '');

        let pos = ((Number(split[4].replace('%', '')) / 100) * divSliderGradient.offsetWidth)
        
        let hex = rgbaString2HexEncoding(rgba);
        
        if(a < gradientString.length-1) {
            appendRGBA += `${rgba} ${split[4]}, `
        }
        else if(a == gradientString.length -1) {
            appendRGBA += `${rgba} ${split[4]}`
        }

        divSliderGradient.innerHTML += 
        `<div class="sliderGradient" data-index="${a-1}" style="left: ${pos - 6}px">
            <svg width="12" height="14" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V5.98083C8 6.2657 7.87851 6.53705 7.66602 6.72677L4.66602 9.40534C4.28662 9.74409 3.71338 9.74409 3.33398 9.40534L0.333984 6.72677C0.121491 6.53705 0 6.2657 0 5.98083V1Z" fill="${rgb}"/>
            </svg>
        </div>`

        divGradientContainer.innerHTML += 
        `<div class="colorManagerEntry">
            <div class="divGradientStop">
                <svg width="12" height="14" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V5.98083C8 6.2657 7.87851 6.53705 7.66602 6.72677L4.66602 9.40534C4.28662 9.74409 3.71338 9.74409 3.33398 9.40534L0.333984 6.72677C0.121491 6.53705 0 6.2657 0 5.98083V1Z" fill="white"/>
                </svg>
                <input type="text" class="txtGradientStop" value="${split[4]}" data-index="${a-1}" spellcheck = "false" data-gramm="false" data-gramm_editor = "false" data-enable-grammarly = "false">
            </div>
            <input type="text" class="txtGradient" value="${hex}" data-alpha="${alpha}" data-index="${a-1}" spellcheck = "false" data-gramm="false" data-gramm_editor = "false" data-enable-grammarly = "false">
            <div class="thumbPickerGradient">
                <img class="thumbCheckered" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABLSURBVHgB7ZSxDQAgCARf4yzsvw4sgw6ABVFjwV8JJFfw+aaqjgARicYwM2TuOx5DwX9B80W0yKZld88fFBCMW2lhFxUWsIsoOGcC0gAgQNZZQskAAAAASUVORK5CYII=">
                <div class="thumbGradient" style="background: #${hex}" data-index=${a-1}></div>
            </div>
            <div class="btnDelGradient" style="opacity: ${a-1 < 2 ? 0.5: 1};" data-index="${a-1}">
                <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" width="2" height="10" transform="rotate(90 10 0)" fill="salmon"/>
                </svg>
            </div>
        </div>`

        
    }

    //RECOLOR GRADIENT METER AFTER ADDING
    let gradientMeter = document.getElementById('gradientMeter');
    gradientMeter.style.background = `linear-gradient(90deg, ${appendRGBA})`;

    //THIS IS FOR THE COLORPICKERPANEL TXTALPHA
    //IF THE COLORPICKERPANEL STILL OPEN FOR GRADIENT
    //IT HAS TO SHOW THE UNDONE TXT ALPHA VALUE
    let index = Number(colorPickerPanel.dataset.index);

    //txtAlpha.value = (Number(alpha) * 100) + '%';
    txtAlpha.value = (Number(document.querySelector(`input.txtGradient[data-index="${index}"]`).dataset.alpha) * 100) + '%';
    txtHexValue.value = document.querySelector(`input.txtGradient[data-index="${index}"]`).value;
    hex2Thumb();
    
}

//////////////////ADD NEW COLORS//////////////////
function addGradientColor() {

    let gap = null;
    let stop = null;
    let arr = [];
    let txtGradientStop = document.querySelectorAll('.txtGradientStop');
    let divSliderGradient = document.getElementById('divSliderGradient');
    let divGradientContainer = document.querySelector('#divGradientContainer');

    //FIRST, INSERT ALL EXISTING VALUES TO AN ARRAY
    for(let a = 0; a < divGradientContainer.childElementCount; a++) {
        txtGradientStop[a].value = Number(txtGradientStop[a].value.replace('%', ''));
        arr.push(txtGradientStop[a].value);
    }

    //THEN SORT IN ASCENDING ORDER
    //a,b are only pair parameter for comparison 1 is to 1
    //a - b is to know which is higher in current pair
    //if difference is negative then a is lower than b
    //if positive, a is higher then b so they switch places
    arr.sort((a, b) => a - b);

    //NOW HERE IS TO CHECK WHICH GAP IS HIGHER FOR EACH ASCENDING PAIR
    //AND GET STOP VALUE FOR EVERY HIGHEST GAP
    for(let a = 0; a < arr.length; a++) {
        if(arr[a+1] != null || arr[a+1] !== undefined) {
            if(gap == null) {
                gap = Math.abs(Number(arr[a]) - Number(arr[a+1]));
                stop = Math.round((Number(arr[a]) + Number(arr[a+1]))/2);
            }
            else {

                let newGap = Math.abs(Number(arr[a]) - Number(arr[a+1]));

                if(newGap > gap) {
                    gap = newGap;
                    stop = Math.round((Number(arr[a]) + Number(arr[a+1]))/2);
                }
            }
        }
        else {
            break;
        }
    }

    //NOW WE GOT THE STOP, WE CAN SET THE SLIDER POSITION TOO
    let pos = (stop / 100) * divSliderGradient.offsetWidth;

    //LIMIT GRADIENT COLORS TO 7 + 1 WHICH IS GRADIENT METER
    if(divSliderGradient.childElementCount < 8) {
        //-1 DONT INCLUDE GRADIENT METER
        let index = divSliderGradient.childElementCount - 1;
        divSliderGradient.innerHTML += 
        `<div class="sliderGradient" data-index="${index}" style="z-index: 99; left: ${pos - 6}px">
            <svg width="12" height="14" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V5.98083C8 6.2657 7.87851 6.53705 7.66602 6.72677L4.66602 9.40534C4.28662 9.74409 3.71338 9.74409 3.33398 9.40534L0.333984 6.72677C0.121491 6.53705 0 6.2657 0 5.98083V1Z" fill="#A9AEFF"/>
            </svg>
        </div>`;

        
        divGradientContainer.insertAdjacentHTML('beforeend', 
        `<div class="colorManagerEntry" data-index="${index}">
            <div class="divGradientStop">
                <svg width="12" height="14" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V5.98083C8 6.2657 7.87851 6.53705 7.66602 6.72677L4.66602 9.40534C4.28662 9.74409 3.71338 9.74409 3.33398 9.40534L0.333984 6.72677C0.121491 6.53705 0 6.2657 0 5.98083V1Z" fill="white"/>
                </svg>
                <input type="text" class="txtGradientStop" value="${stop}%" data-index="${index}" spellcheck = "false" data-gramm="false" data-gramm_editor = "false" data-enable-grammarly = "false">
            </div>
            <input type="text" class="txtGradient" value="A9AEFF" data-alpha="1" data-index="${index}" spellcheck = "false" data-gramm="false" data-gramm_editor = "false" data-enable-grammarly = "false">
            <div class="thumbPickerGradient">
                <img class="thumbCheckered" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABLSURBVHgB7ZSxDQAgCARf4yzsvw4sgw6ABVFjwV8JJFfw+aaqjgARicYwM2TuOx5DwX9B80W0yKZld88fFBCMW2lhFxUWsIsoOGcC0gAgQNZZQskAAAAASUVORK5CYII=">
                <div class="thumbGradient" data-index="${index}" style="background: #A9AEFF"></div>
            </div>
            <div class="btnDelGradient" style="opacity: 1; background: salmon;" data-index = "${index}">
                <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" width="2" height="10" transform="rotate(90 10 0)" fill="white"/>
                </svg>
            </div>
        </div>`);
        
    }

    stringifyGradient();
}
document.getElementById('btnAddGradient').addEventListener('click', addGradientColor)

//////////////////CHANGE GRADIENT MODE//////////////////
function changeGradientMode() {

    if(this.firstElementChild.innerText == "Linear") {
        this.firstElementChild.innerText = "Radial";
        setGradientRotationState(false);
    }
    else if(this.firstElementChild.innerText == "Radial") {
        this.firstElementChild.innerText = "Linear";
        setGradientRotationState(true);
    }
    stringifyGradient();
}

//THE ONE OWNER OF THE ROTATION BOX'S ON/OFF LOOK. LINEAR: FULL, ENABLED, HOVER BORDER. RADIAL:
//DIMMED AND DISABLED, THE VALUE LEFT ALONE. THE DROPDOWN, AN UNDO/REDO AND OPENING A GRADIENT ALL
//CALL THIS, SO THEY CAN NO LONGER LEAVE THE BOX IN TWO DIFFERENT STATES. visibility IS CLEARED
//EVERY TIME TO UNDO THE OLD HIDE ON ANY BOX THAT IS STILL CARRYING IT
function setGradientRotationState(isLinear) {

    let divGradientRotation = document.getElementById('divGradientRotation');
    let txtGradientRotation = document.getElementById('txtGradientRotation');

    txtGradientRotation.style.visibility = "";

    if(isLinear) {
        divGradientRotation.style.opacity = "1";
        txtGradientRotation.disabled = false;
        divGradientRotation.addEventListener('pointerover', hoverDivGradientRotation)
        divGradientRotation.addEventListener('pointerout', outDivGradientRotation)
    }
    else {
        divGradientRotation.style.opacity = "0.5";
        txtGradientRotation.disabled = true;
        divGradientRotation.removeEventListener('pointerover', hoverDivGradientRotation)
        divGradientRotation.removeEventListener('pointerout', outDivGradientRotation)

        //THE HOVER BORDER CAN BE LEFT ON IF THE POINTER WAS OVER THE BOX WHEN IT WENT OFF
        divGradientRotation.style.borderColor = "var(--muted-track)";
    }
}
dropdownGradientMode.addEventListener('click', changeGradientMode)

//////////////////ADJUST GRADIENT ROTATION//////////////////

function convertTextInput2GradientRotation() {

    this.value = Number(this.value.replace('°', ''));
    this.type = 'number';
    this.select();
    this.setAttribute('max', '360');
    this.setAttribute('min', '0');
}
document.getElementById('txtGradientRotation').addEventListener('click', convertTextInput2GradientRotation)

function convertNumberInput2GradientRotation() {

    if(Number(this.value) > Number(this.max)) {
        this.value = this.max;
    }
    else if(Number(this.value) < Number(this.min)) {
        this.value = this.min;
    }

    this.type = 'text';
    this.value = this.value.toString().replaceAll('°', '');
    this.value = this.value + '°';
    this.blur();
    highlight = false;
}

//[!]DONT USE CHANGE ANYMORE IT GETS BUGGY
//ALSO THIS TEXT INPUT CHANGES TYPE TO NUMBER
//USING 'CHANGE' EVENT WILL STOP THIS INPUT TYPE FROM UP AND DOWN ARROW CHANGES
document.getElementById('txtGradientRotation').addEventListener('focusout', function() {
    convertNumberInput2GradientRotation.call(this);
    stringifyGradient();
});

document.getElementById('txtGradientRotation').addEventListener('change', function() {
    stringifyGradient();
});

document.getElementById('txtGradientRotation').addEventListener('keydown', function(e) {

    if(e.key == "Enter") {
        this.blur();
    }
});


function hoverDivGradientRotation() {
    this.style.borderColor = "var(--sharp-track)";
}
document.getElementById('divGradientRotation').addEventListener('pointerover', hoverDivGradientRotation);

function outDivGradientRotation() {
    this.style.borderColor = "var(--muted-track)";
}
document.getElementById('divGradientRotation').addEventListener('pointerout', outDivGradientRotation);

//////////////////////DELETE GRADIENT COLOR//////////////////////

function deleteGradientColor() {

    let index = Number(this.dataset.index);

    if(index > 1) {
        //REMOVE SLIDER GRADIENT
        let sliderGradient = document.querySelector(`.sliderGradient[data-index="${index}"]`);
        sliderGradient.remove();

        //REMOVE COLORMANAGER ENTRY OF THIS COLOR
        //REMOVE FROM THE LIST
        let divGradientContainer = document.getElementById('divGradientContainer');
        let colorManagerEntry = divGradientContainer.querySelector(`.colorManagerEntry[data-index="${index}"]`);
        colorManagerEntry.remove();

        stringifyGradient();
    }
    
}