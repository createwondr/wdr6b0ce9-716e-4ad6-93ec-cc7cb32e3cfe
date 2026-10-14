
//============================START DECLARING COMPONENTS==============

let colorBoardBool = false;
let colorBarBool = false;
let red = 255;
let green = 255;
let blue = 255;
let alpha = 100;
let hexcode = "FFFFFF";
let huePercent = 0;
let hue = 0;
let sat = 0;
let bright = 100;
let chroma, chroma2, minLight;
let colorPickerTrigger = null;
let colorPickerTrigger2 = null;

let cnvCapture = document.getElementById('cnvCapture');
let ctxCapture = cnvCapture.getContext('2d', { willReadFrequently: true });

//[!] OWN FLAG, NOT ISRAF. HOVERING IS THE ONLY THROTTLE HERE DRIVEN BY A DIFFERENT INPUT
//THAN THE POINTER GESTURES, SO IT CAN OVERLAP WITH WHEEL ZOOM AND STEAL THEIR FRAME
let isEyedropperRAF = false;

//[!] ONE COPY OF THE EYEDROPPER CURSOR, IT WAS WRITTEN OUT TWICE PER POINTERMOVE BEFORE
let eyedropperCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='13' height='25' viewBox='0 0 13 25'><path d='M0.121056 22.0506L0.805096 20.1712L4.56387 21.5393L3.87983 23.4187C3.50204 24.4567 2.35436 24.9918 1.3164 24.6141C0.278445 24.2363 -0.256729 23.0886 0.121056 22.0506Z' fill='black'/><path d='M3.28515 10.4321L8.9233 12.4843L6.18714 20.0018C5.62046 21.5587 3.87937 23.4185 1.99998 22.7345C0.120597 22.0505 -0.0176926 19.5066 0.548985 17.9497L3.28515 10.4321Z' fill='black'/><path d='M4.22506 10.7742L7.98383 12.1423L5.24767 19.6598C4.68099 21.2168 3.89916 22.3616 2.34222 21.7949C0.78529 21.2282 0.922222 19.8487 1.4889 18.2918L4.22506 10.7742Z' fill='white'/><path d='M1.40273 21.4529L1.74475 20.5132L3.62413 21.1973L3.28211 22.137C2.90433 23.1749 2.59788 24.0163 1.65838 23.6743C0.718884 23.3324 1.02494 22.4909 1.40273 21.4529Z' fill='white'/><path d='M6.36309 1.9748C6.92977 0.417864 8.6513 -0.384897 10.2082 0.18178C11.7652 0.748458 12.5679 2.46999 12.0012 4.02692L9.94913 9.66507L4.31097 7.61295L6.36309 1.9748Z' fill='black'/><path d='M1.91855 8.33845C2.20189 7.55999 3.06266 7.1586 3.84112 7.44194L10.419 9.83608C11.1974 10.1194 11.5988 10.9802 11.3155 11.7587C11.0321 12.5371 10.1714 12.9385 9.39291 12.6552L2.81506 10.261C2.0366 9.97768 1.63522 9.11692 1.91855 8.33845Z' fill='black'/><path d='M8.54425 0.796165C8.79452 0.679461 9.09194 0.787713 9.20864 1.03798C9.3252 1.28821 9.21703 1.5857 8.96682 1.70238C8.85473 1.75466 8.78683 1.80124 8.71371 1.88669C8.62821 1.98674 8.52126 2.15733 8.37054 2.48405C8.0665 3.14332 7.47731 4.7611 6.70338 6.88745C6.60883 7.14677 6.32192 7.2807 6.06252 7.18629C5.80313 7.09188 5.66943 6.80485 5.76369 6.54543C6.52849 4.44417 7.13684 2.77212 7.46325 2.06445C7.62742 1.70862 7.78015 1.44054 7.95483 1.23635C8.14195 1.01778 8.33617 0.893214 8.54425 0.796165Z' fill='white'/></svg>") -12 24, auto`;

//==============SUMMON THIS COLOR PICKER TO EXISTENCE==========

function letsSummonColorPicker(me, showSwitch) {

    let colorPickerPanel = document.getElementById('colorPickerPanel');

    //[!] SAME THUMB WHILE THE PANEL IS OPEN IS THE OFF TOGGLE. DECIDE IT HERE,
    //COLORPICKERTRIGGER STILL HOLDS THE PREVIOUS THUMB AT THIS POINT.
    //A DIFFERENT THUMB FALLS THROUGH AND JUST RE POINTS THE PANEL, SO THE
    //GRADIENT STOPS IN THE COLOR MANAGER CAN BE STEPPED THROUGH ONE CLICK EACH
    if(colorPickerPanel.dataset.show == "true" && colorPickerTrigger == me) {

        rcEyeDropper.innerHTML = "";
        hideColorPickerPanel();
        return
    }

    let pnlbox = me.closest(`[id*='pnlBox']`)?.id;
    //[!] A GRADIENT STOP THUMB LIVES INSIDE COLORMANAGERPANEL, NOT INSIDE A PNLBOX,
    //SO CLOSEST RETURNS UNDEFINED. WRITING THAT HERE WIPES THE OWNING PANEL NAME
    //THAT ENCODECOLORSWITCH LATER READS BACK
    if(pnlbox) colorPickerPanel.dataset.pnlbox = pnlbox;

    if(showSwitch) {

        colorPickerTrigger = me;
        colorPickerPanel.firstElementChild.style.display = "flex";
        txtAlpha.value = (colorPickerTrigger.previousElementSibling.dataset.alpha * 100) + '%';
        
    }
    else {

        //THIS IS ONLY FOR SPECIAL CASE
        //TO SHOW COLORPICKER WITHOUT GRADIENT
        //IN THIS CASE IT'S FOR PNLBOXLINE WITHOUT GRADIENT

        //[!] GRADIENT STOP THUMB CLICKED FROM INSIDE THE COLOR MANAGER.
        //THIS USED TO BE THE LAST ELSE AND WAS UNREACHABLE, ITS GUARD ASKED FOR
        //COLORPICKERTRIGGER2 != NULL WHICH IS THE VERY STATE IT IS MEANT TO CREATE.
        //SO THE OWNING THUMBPICKER WAS SILENTLY OVERWRITTEN AND LOST, AND EVERY
        //LATER READ OF COLORPICKERTRIGGER POINTED AT THE STOP THUMB
        if(me.closest('#colorManagerPanel')) {

            //PARK THE OWNING THUMBPICKER. DO NOT CLOBBER IT IF ANOTHER STOP
            //WAS ALREADY OPENED FROM THIS SAME COLOR MANAGER
            if(colorPickerTrigger2 == null && colorPickerTrigger != null) {
                colorPickerTrigger2 = colorPickerTrigger;
            }

            colorPickerTrigger = me;

            //[!] CLOSEST, NOT PARENTELEMENT. DELEGATION HANDS OVER .THUMBGRADIENT
            //WHOSE PREVIOUSELEMENTSIBLING IS THE CHECKERED IMG, NOT THE TXTGRADIENT
            colorPickerPanel.dataset.index = colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling.dataset.index;
            colorPickerPanel.firstElementChild.style.display = "none";

            let index = Number(colorPickerPanel.dataset.index);
            txtAlpha.value = (Number(document.querySelector(`input.txtGradient[data-index="${index}"]`).dataset.alpha) * 100) + '%';
            txtHexValue.value = document.querySelector(`input.txtGradient[data-index="${index}"]`).value;
        }

        else if(colorPickerTrigger == null) {
            colorPickerTrigger = me;
            colorPickerPanel.firstElementChild.style.display = "none";
            colorPickerPanel.dataset.index = colorPickerTrigger.previousElementSibling.dataset.index;
            txtAlpha.value = (colorPickerTrigger.previousElementSibling.dataset.alpha * 100) + '%';
            
        }

        else {
            colorPickerTrigger = me;
            colorPickerPanel.firstElementChild.style.display = "none";
            colorPickerPanel.dataset.index = colorPickerTrigger.previousElementSibling.dataset.index;

            txtAlpha.value = (colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling.dataset.alpha * 100) + '%';
            
        }
    }

    let triggerSibling = colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling;

    if(triggerSibling != null) {
      
        triggerSibling.removeEventListener('change', encodeColorMulti);
        txtHexValue.value = triggerSibling.value;

    }

    let meLeft = colorPickerTrigger.getBoundingClientRect().left;
    let meTop = colorPickerTrigger.getBoundingClientRect().top;
    let meWidth = colorPickerTrigger.clientWidth;
    let meHeight = colorPickerTrigger.clientHeight;

    //[!] DISPLAY FIRST, CLIENTWIDTH BELOW READS 0 WHILE IT IS NONE.
    //THIS RUNS FOR A FRESH OPEN AND FOR A SWITCH TO ANOTHER THUMB
    colorPickerPanel.style.display = "flex";
    colorPickerPanel.style.left = meLeft - (colorPickerPanel.clientWidth - 10) + (meWidth/2) + 'px';

    if(meTop + colorPickerPanel.clientHeight > window.innerHeight) {
        colorPickerPanel.style.top = meTop - colorPickerPanel.clientHeight - 8 + 'px';
    }
    else {
        colorPickerPanel.style.top = meTop + meHeight + 8 + 'px';
    }

    hex2Thumb();

    //[!] ONLY A FRESH OPEN ARMS THE EYEDROPPER. A SWITCH BETWEEN THUMBS LEAVES
    //IT RUNNING, NO TEARDOWN AND NO SECOND 300MS RECAPTURE
    if(colorPickerPanel.dataset.show == "false") {

        colorPickerPanel.dataset.show = "true";

        isColorPicking = true;

        //[!] SET ONCE HERE, CURSOR INHERITS SO EVERY CHILD OF CNVPIN PICKS IT UP
        cnvPin.style.cursor = eyedropperCursor;
        //cnvPin.style.cursor = `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cg transform="rotate(135 0 0) scale(0.9 0.9) translate(13 13)" transform-origin="13 13"%3E%3Cpath fill="%236885CC" d="M5.00022 24.0001C4 24.0001 2.71814 23.2158 2.71814 21.8573C2.71814 21.1974 2.75022 19.4699 2.58233 19.0001C2.5 18.5001 1.99997 18.5001 2.00017 18.0001C2.00025 17.8049 2.00002 17.7516 2 17.5001C1.99987 15.3465 2.00022 11.0001 2.00022 11.0001H8C8 11.0001 8.0003 15.3465 8.00017 17.5001C8.00015 17.7516 7.99992 17.8049 8 18.0001C8.0002 18.5001 7.5 18.5001 7.41789 19.0001C7.25 19.4699 7.28208 21.1974 7.28208 21.8573C7.28208 23.2158 6.00044 24.0001 5.00022 24.0001Z"/%3E%3Cpath fill="white" d="M4 18.0001V11.0001H6V18.0001C6 18.5001 5.75 19.9858 5.75 21.0001C5.75 22.2681 5.5 22.5001 5 22.5001C4.5 22.5001 4.25 22.2681 4.25 21.0001C4.25 19.9858 4 18.5001 4 18.0001Z"/%3E%3Cpath fill="%236885CC" d="M0 10.0001C0 9.44784 0.447715 9.00012 1 9.00012H9C9.55228 9.00012 10 9.44784 10 10.0001C10 10.5524 9.55228 11.0001 9 11.0001H1C0.447716 11.0001 0 10.5524 0 10.0001Z"/%3E%3Cpath fill="%236885CC" d="M0.979492 4.00012C0.979492 2.89555 1.97949 0 5 0C8.02051 0 9 2.89555 9 4.00012V9.00012H0.979492V4.00012Z"/%3E%3C/g%3E%3C/svg%3E') 13 13, auto`;

        //SHOW RCEYEDROPPER WHEN THE COLORPICKER OPENS
        rcEyeDropper.innerHTML = 
        `<div></div>
        <div></div>
        <div></div>
        <div></div>
        <div style="border: 1px solid white; box-sizing: border-box; filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));"></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>`

        setTimeout(() => {
            captureEyeDropperScreenshot()
        }, 300)
    }
}

//===============REPOSITION COLORPICKER PANEL================
window.addEventListener('resize', e => {
    let colorPickerPanel = document.querySelector('#colorPickerPanel');

    if(colorPickerTrigger != null) {
        colorPickerPanel.style.left = (colorPickerTrigger.getBoundingClientRect().right - colorPickerPanel.offsetWidth) + 'px';
    }
    
})

function hex2Thumb() {
    let z = [];
    let s = [];
    let append = "";
    
    for(let a=0; a < 6; a++) {

        z[a] = txtHexValue.value.substring(a, a+1);

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
    
    red = (z[0] * 16) + z[1];
    green = (z[2] * 16) + z[3];
    blue = (z[4] * 16) + z[5];

    txtRedValue.value = red;
    txtGreenValue.value = green;
    txtBlueValue.value = blue;
    
    hexcode = append.toUpperCase();
    
    //rgb to hsb-------------------------------------------------

    red = txtRedValue.value / 255;
    green = txtGreenValue.value / 255;
    blue = txtBlueValue.value / 255;

    let max = Math.max(red, green, blue);
    let min = Math.min(red, green, blue);
    let delta = max - min;

    // Calculate hue and sat, default to 0 until calculated
    hue = 0;
    sat = 0;

    if (delta !== 0) {
        if (max === red) {
            hue = ((green - blue) / delta) % 6;
        } else if (max === green) {
            hue = (blue - red) / delta + 2;
        } else {
            hue = (red - green) / delta + 4;
        }

        hue = Math.round(hue * 60);

        if (hue < 0) hue += 360;

        // Calculate saturation
        if(max != 0) {
            sat = delta/max;
        }
        else {
            sat = 0;
        }
    }

    // Calculate value of brightness
    bright = max;
    
    //RGB2HSB
    txtHueValue.value = Math.round(hue);
    txtSatValue.value = Math.round(sat * 100);
    txtBrightValue.value = Math.round(bright * 100);

    //hsb to thumb----------------------------------------------

    //color bar hue
    huePercent = Math.round((txtHueValue.value/360)*93);
    colorBarThumb.style.left = Math.round((huePercent/100) * colorBarHue.clientWidth) + "px";

    //color board 
    //saturation from txtbox
    colorBoardThumb.style.left = ((txtSatValue.value/100) * colorBoard.clientWidth) - 6 + 'px';  
    //brightness from txtbox
    colorBoardThumb.style.top = ((1-(txtBrightValue.value/100)) * colorBoard.clientHeight) - 6 + 'px';  

    colorBoard.style.background = `linear-gradient(to right, white, hsl(${txtHueValue.value}, 100%, 50%))`;
}

//===============HEX FORMAT===================
//===============VALIDATE THE HEX IN TEXTBOX============
function testHexCode(me) {

    let hex = me.value.toLowerCase();
    hex = hex.replaceAll('#', '');

    let regex = /^#?([0-9A-Fa-f]{6})$/;

    //IF THE USER INPUT IS NOT IN THE FORMAT
    if(!regex.test(hex)) {

        //CHECK FIRST IF THE USER INPUT IS ACTUAL COLOR NAME
        let result = colorName.find(color => color.name === hex)

        if(result == null) {
            //FORMAT THE TEXT INPUT VALUE HERE ALREADY
            if(me.value.toLowerCase() == "linear") {
                if(me.dataset.gradient.trim() == "" || me.dataset.gradient == null || me.dataset.gradient === undefined) {
                    me.value = 'FFFFFF';
            
                    return 'FFFFFF'
                }
                else {
                    me.value = "Linear";
                    return "Linear";
                }
            }
            else if(me.value.toLowerCase() == "radial") {
                if(me.dataset.gradient.trim() == "" || me.dataset.gradient == null || me.dataset.gradient == undefined) {
                    me.value = 'FFFFFF';
               
                    return 'FFFFFF'
                }
                else {
                    me.value = "Radial";
                    return "Radial";
                }
            }
            else {
                me.value = 'FFFFFF';
                
                return 'FFFFFF'
            }
            
        }
        else {
            //FORMAT THE TEXT INPUT VALUE HERE ALREADY
            me.value = result.hex;
          
            return result.hex;
        }
        
    }
    else {
        //FORMAT THE TEXT INPUT VALUE HERE ALREADY
        me.value = hex.toUpperCase();

        return hex.toUpperCase();
    }
        
}

//===============SHOW HEX TEXT VALUES===========
document.querySelector('.divColorValues').style.display = "flex";

//===============ADD DROPDOWN FUNCTION=============

function switchColorSpace() {

    let divColorValues = document.getElementsByClassName('divColorValues');
    
    //hide all textbox containers
    for(let a=0; a < divColorValues.length; a++) {
        divColorValues[a].style.display = "none";
    }

    if(this.children[0].innerText == "Hex") {
        
        this.children[0].innerText = "RGB";
        divColorValues[1].style.display = "flex";
    }

    else if(this.children[0].innerText == "RGB") {
  
        this.children[0].innerText = "HSB";
        divColorValues[2].style.display = "flex";
    }

    else if(this.children[0].innerText == "HSB") {

        this.children[0].innerText = "Hex";
        divColorValues[0].style.display = "flex";
    }
}
document.getElementById("dropdownColorValue").addEventListener('click', switchColorSpace);

//=====================COLOR BOARD======================

function selectFromTheColorBoard(e) {
    e.preventDefault();

    colorBoardBool = true;
    colorBarBool = false;

    if(colorBoardBool) {

        let rect = colorBoard.getBoundingClientRect();
        //REMOVE ENCODING
        colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling.removeEventListener('change', encodeColorMulti);

        if(e.clientX > rect.left && e.clientX < rect.right) {
            sat = null
            colorBoardThumb.style.left = e.clientX - rect.left - 6 + "px"; //-5 is half the thumb width
        }
        else if(e.clientX >= rect.right) {
            sat = 100;
        }
        else if(e.clientX <= rect.left) {
            sat = 0;
        }

        if(e.clientY > rect.top && e.clientY < rect.bottom) {
            bright = null;
            colorBoardThumb.style.top = e.clientY - rect.top - 6 + "px"; //-5 is half the thumb height
        }
        else if(e.clientY <= rect.top) {
            bright = 100;
            sat = 0;
        }
        else if(e.clientY >= rect.bottom) {
            bright = 0;
            sat = 0;
        }
        
        thumb2All(e);
        dispatchTriggerChange();
    }
    
}
colorBoard.addEventListener('pointerdown', selectFromTheColorBoard);

function moveFromTheColorBoard(e) {
    e.preventDefault();

    if(colorBoardBool) {

        let rect = colorBoard.getBoundingClientRect();

        if(e.clientX > rect.left && e.clientX < rect.right) {
            sat = null;
            colorBoardThumb.style.left = e.clientX - rect.left - 6 + "px"; //-5 is half the thumb width
        }
        else if(e.clientX >= rect.right) {
            sat = 100;
        }
        else if(e.clientX <= rect.left) {
            sat = 0;
        }

        if(e.clientY > rect.top && e.clientY < rect.bottom) {
            bright = null;
            colorBoardThumb.style.top = e.clientY - rect.top - 6 + "px"; //-5 is half the thumb height
        }
        else if(e.clientY <= rect.top) {
            //[!] NO NEED TO SET SAT = 0
            //LEFT TO RIGHT IS WHITE TO COLORED
            //SAT VALUE SHOULD CHANGE FREELY NOT SET TO 0
            bright = 100;
        }
        else if(e.clientY >= rect.bottom) {
            bright = 0;
            //[!] ONLY MAKE SAT = 0 WHEN THE PICKER AT THE BOTTOM
            //SINCE IT'S ABSOLUTE BLACK EVEN FROM LEFT TO RIGHT
            sat = 0;
        }

        thumb2All(e);
        dispatchTriggerChange();
    }   
    
}
document.addEventListener('pointermove', moveFromTheColorBoard);

//=====================COLOR BAR========================

function selectFromTheColorBar(e) {

    e.preventDefault();
    colorBarBool = true;
    colorBoardBool = false;

    if(colorBarBool) {

        let rect = colorBarHue.getBoundingClientRect();
        //REMOVE ENCODING
        colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling.removeEventListener('change', encodeColorMulti);

        if(e.clientX > rect.left + 7 && e.clientX < rect.right - 7) {
            
            bright = null;
            colorBarThumb.style.left = e.clientX - rect.left - 7 + "px"; //-7 is half the thumb width

        }
        
        thumb2All();
        dispatchTriggerChange();
    }   
    
}
colorBarHue.addEventListener('pointerdown', selectFromTheColorBar);

function moveFromTheColorBar(e) {
    //e.preventDefault();

    if(colorBarBool) {

        let rect = colorBarHue.getBoundingClientRect();

        if(e.clientX > rect.left + 7 && e.clientX < rect.right - 7) {
            bright = null;
            colorBarThumb.style.left = e.clientX - rect.left - 7 + "px"; //-7 is half the thumb width
        }
        else if(e.clientX <= rect.left) {
            colorBarThumb.style.left = 0 + "px"; //-7 is half the thumb width
        }
        else if(e.clientX >= rect.right) {
            colorBarThumb.style.left = colorBarHue.offsetWidth - colorBarThumb.offsetWidth + "px"; //-7 is half the thumb width
        }

        thumb2All(e);
        dispatchTriggerChange();
    }   
}
document.addEventListener('pointermove', moveFromTheColorBar);


//////////////////////CONVERSIONS/////////////////////////
function dispatchTriggerEncoding() {

    let triggerSibling = colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling;

    //pass txtHexValue to the link txtHex
    if(triggerSibling != null) {

        triggerSibling.value = txtHexValue.value;
        
        triggerSibling.dataset.alpha = Number(txtAlpha.value.replace('%', ''))/100;

        if(triggerSibling.className.includes('Color')) {
            //triggerSibling.addEventListener('change', encodeColorMulti);
            resumeEncoding();
        }
    
        triggerSibling.dispatchEvent(new Event('change', { bubbles: true }));
        pauseEncoding();

    }
}

function dispatchTriggerChange() {
    let triggerSibling = colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling;
    //pass txtHexValue to the link txtHex
    if(triggerSibling != null) {

        triggerSibling.value = txtHexValue.value;
        triggerSibling.dataset.alpha = alpha;
 
        triggerSibling.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

function thumb2All(e) {

    //[!] ALWAYS USE == NULL
    //IF (!SAT) IS NOT ACCURATE FOR 0 VALUE
    //saturation
    if(sat == null) { 
        //DO NOT ASSIGN DIRECTLY TO SAT VARIABLE
        //SINCE THIS CALCULATION IS DIRECT VALUE DECIMAL AND NOT RAW FLOAT
        //ASSIGNING DIRECTLY WILL CAUSE ERROR
        txtSatValue.value = Math.round((((colorBoardThumb.getBoundingClientRect().left + 6) - colorBoard.getBoundingClientRect().left)/colorBoard.clientWidth)*100);
    }
   
    //lightness
    if(bright == null) {
        //DO NOT ASSIGN DIRECTLY TO SAT VARIABLE
        //SINCE THIS CALCULATION IS DIRECT VALUE DECIMAL AND NOT RAW FLOAT
        //ASSIGNING DIRECTLY WILL CAUSE ERROR
        txtBrightValue.value = Math.round(((colorBoard.getBoundingClientRect().bottom -(colorBoardThumb.getBoundingClientRect().top + 6))/colorBoard.clientHeight)*100);
    }
    
    huePercent = Math.round((((colorBarThumb.getBoundingClientRect().left + 7) - colorBoard.getBoundingClientRect().left)/colorBarHue.clientWidth)*100);
    //360 is max hue degree divided by 93, since bar starts at 4 and maxed at 97, out of 100 it's missing 7 hence only use 93
    hue = Math.round((360/92) * (huePercent-4)); //huePercent starts at 4 and deduct by 4 to get 0 as base value

    colorBoard.style.background = `linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`;
    
    txtHueValue.value = hue;

    //------------HSB TO RGB--------------
    
    chroma = (txtBrightValue.value/100) * (txtSatValue.value/100);
    chroma2 = chroma * (1- Math.abs(((txtHueValue.value/60) % 2) - 1));
    minLight = (txtBrightValue.value/100) - chroma;

    if(txtHueValue.value > 0 && txtHueValue.value < 60) {
        red = (chroma + minLight) * 255;
        green = (chroma2 + minLight) * 255;
        blue = (0 + minLight) * 255;
    }
    else if(txtHueValue.value >= 60 && txtHueValue.value < 120) {
        red = (chroma2 + minLight) * 255;
        green = (chroma + minLight) * 255;
        blue = (0 + minLight) * 255;
    }
    else if(txtHueValue.value >= 120 && txtHueValue.value < 180) {
        red = (0 + minLight) * 255;
        green = (chroma + minLight) * 255;
        blue = (chroma2 + minLight) * 255;
    }
    else if(txtHueValue.value >= 180 && txtHueValue.value < 240) {
        red = (0 + minLight) * 255;
        green = (chroma2 + minLight) * 255;
        blue = (chroma + minLight) * 255;
    }
    else if(txtHueValue.value >= 240 && txtHueValue.value < 300) {
        red = (chroma2 + minLight) * 255;
        green = (0 + minLight) * 255;
        blue = (chroma + minLight) * 255;
    }
    else if(txtHueValue.value >= 300 && txtHueValue.value < 360) {
        red = (chroma + minLight) * 255;
        green = (0 + minLight) * 255;
        blue = (chroma2 + minLight) * 255;
    }
    else {
        
        red = (chroma + minLight) * 255;
        green = (chroma2 + minLight) * 255;
        blue = (0 + minLight) * 255;
    }

    red = Math.round(red);
    green = Math.round(green);
    blue = Math.round(blue);

    txtRedValue.value = red;
    txtGreenValue.value = green;
    txtBlueValue.value = blue;
    alpha = Number(txtAlpha.value.replace('%', ''))/100;

    //--------------RGB TO HEX--------------
    
    let channel = [];

    for(let a=0; a < 3; a++) {
        if(a == 0) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtRedValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtRedValue.value % 16));
        }
        else if(a == 1) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtGreenValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtGreenValue.value % 16));
        }
        else if(a == 2) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtBlueValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtBlueValue.value % 16));
        }    
    }


    hexcode = channel[0] + channel[1] + channel[2]; 
    txtHexValue.value = hexcode;

}

//======================CONVERSIONS===================
function hex2All() {

    //---------HEX TO RGB-----------

    let z = [];
    let s = [];
    let append = "";

    testHexCode(this)
    
    for(let a=0; a < 6; a++) {

        z[a] = this.value.substring(a, a+1);

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
    
    red = (z[0] * 16) + z[1];
    green = (z[2] * 16) + z[3];
    blue = (z[4] * 16) + z[5];

    txtRedValue.value = red;
    txtGreenValue.value = green;
    txtBlueValue.value = blue;
    
    hexcode = append.toUpperCase();

    //---------RGB TO HSB------------

    red = txtRedValue.value / 255;
    green = txtGreenValue.value / 255;
    blue = txtBlueValue.value / 255;
    alpha = Number(txtAlpha.value.replace('%', ''))/100;

    let max = Math.max(red, green, blue);
    let min = Math.min(red, green, blue);
    let delta = max - min;

    // Calculate hue and sat, default to 0 until calculated
    hue = 0;
    sat = 0;

    if (delta !== 0) {
        if (max === red) {
            hue = ((green - blue) / delta) % 6;
        } else if (max === green) {
            hue = (blue - red) / delta + 2;
        } else {
            hue = (red - green) / delta + 4;
        }

        hue = Math.round(hue * 60);

        if (hue < 0) hue += 360;

        // Calculate saturation
        if(max != 0) {
            sat = delta/max;
        }
        else {
            sat = 0;
        }
    }

    // Calculate value of brightness
    bright = max;

    //RGB2HSB
    txtHueValue.value = Math.round(hue);
    txtSatValue.value = Math.round(sat * 100);
    txtBrightValue.value = Math.round(bright * 100);

    //-----------HSB TO THUMB-----------

    //color bar hue
    huePercent = Math.round((txtHueValue.value/360)*93);
    colorBarThumb.style.left = Math.round((huePercent/100) * colorBarHue.clientWidth) + "px";

    //color board 
    //saturation from txtbox
    colorBoardThumb.style.left = ((txtSatValue.value/100) * colorBoard.clientWidth) - 6 + 'px';  
    //brightness from txtbox
    colorBoardThumb.style.top = ((1-(txtBrightValue.value/100)) * colorBoard.clientHeight) - 6 + 'px';  

    colorBoard.style.background = `linear-gradient(to right, white, hsl(${txtHueValue.value}, 100%, 50%))`;

}
txtHexValue.addEventListener('change', hex2All);
txtHexValue.addEventListener('change', dispatchTriggerEncoding);

function rgb2All() {

    //-----------------RGB TO HEX----------------

    let channel = [];

    for(let a=0; a < 3; a++) {
        if(a == 0) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtRedValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtRedValue.value % 16));
        }
        else if(a == 1) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtGreenValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtGreenValue.value % 16));
        }
        else if(a == 2) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtBlueValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtBlueValue.value % 16));
        }    
    }

    hexcode = channel[0] + channel[1] + channel[2]; 
    txtHexValue.value = hexcode;

    //-----------------RGB TO HSB------------------

    red = txtRedValue.value / 255;
    green = txtGreenValue.value / 255;
    blue = txtBlueValue.value / 255;
    alpha = Number(txtAlpha.value.replace('%', ''))/100;

    let max = Math.max(red, green, blue);
    let min = Math.min(red, green, blue);
    let delta = max - min;

    // Calculate hue and sat, default to 0 until calculated
    hue = 0;
    sat = 0;

    if (delta !== 0) {
        if (max === red) {
            hue = ((green - blue) / delta) % 6;
        } else if (max === green) {
            hue = (blue - red) / delta + 2;
        } else {
            hue = (red - green) / delta + 4;
        }

        hue = Math.round(hue * 60);

        if (hue < 0) hue += 360;

        // Calculate saturation
        if(max != 0) {
            sat = delta/max;
        }
        else {
            sat = 0;
        }
    }

    // Calculate value of brightness
    bright = max;

    //RGB2HSB
    txtHueValue.value = Math.round(hue);
    txtSatValue.value = Math.round(sat * 100);
    txtBrightValue.value = Math.round(bright * 100);

    //----------------HSB TO THUMB-----------------

    //color bar hue
    huePercent = Math.round((txtHueValue.value/360)*93);
    colorBarThumb.style.left = Math.round((huePercent/100) * colorBarHue.clientWidth) + "px";

    //color board 
    //saturation from txtbox
    colorBoardThumb.style.left = ((txtSatValue.value/100) * colorBoard.clientWidth) - 6 + 'px';  
    //brightness from txtbox
    colorBoardThumb.style.top = ((1-(txtBrightValue.value/100)) * colorBoard.clientHeight) - 6 + 'px';  

    colorBoard.style.background = `linear-gradient(to right, white, hsl(${txtHueValue.value}, 100%, 50%))`;

    //-------------HEX TO SOURCE HEX-----------

    //colorPickerTrigger.style.background = `rgba(${txtRedValue.value}, ${txtGreenValue.value}, ${txtBlueValue.value}, ${alpha})`;

    let triggerSibling = colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling;
    
    //pass txtHexValue to the link txtHex
    if(triggerSibling != null) {

        triggerSibling.value = txtHexValue.value;
        triggerSibling.dataset.alpha = alpha;

        if(triggerSibling.className.includes('Color')) {
            triggerSibling.addEventListener('change', encodeColorMulti);
        }
    
        triggerSibling.dispatchEvent(new Event('change'));
    }

}
txtRedValue.addEventListener('change', rgb2All);
txtGreenValue.addEventListener('change', rgb2All);
txtBlueValue.addEventListener('change', rgb2All);
txtRedValue.addEventListener('change', dispatchTriggerEncoding);
txtGreenValue.addEventListener('change', dispatchTriggerEncoding);
txtBlueValue.addEventListener('change', dispatchTriggerEncoding);


function hsb2All() {

    //------------HSB TO RGB--------------

    chroma = (txtBrightValue.value/100) * (txtSatValue.value/100);
    chroma2 = chroma * (1- Math.abs(((txtHueValue.value/60) % 2) - 1));
    minLight = (txtBrightValue.value/100) - chroma;

    if(txtHueValue.value >= 0 && txtHueValue.value < 60) {
        red = (chroma + minLight) * 255;
        green = (chroma2 + minLight) * 255;
        blue = (0 + minLight) * 255;
    }
    else if(txtHueValue.value >= 60 && txtHueValue.value < 120) {
        red = (chroma2 + minLight) * 255;
        green = (chroma + minLight) * 255;
        blue = (0 + minLight) * 255;
    }
    else if(txtHueValue.value >= 120 && txtHueValue.value < 180) {
        red = (0 + minLight) * 255;
        green = (chroma + minLight) * 255;
        blue = (chroma2 + minLight) * 255;
    }
    else if(txtHueValue.value >= 180 && txtHueValue.value < 240) {
        red = (0 + minLight) * 255;
        green = (chroma2 + minLight) * 255;
        blue = (chroma + minLight) * 255;
    }
    else if(txtHueValue.value >= 240 && txtHueValue.value < 300) {
        red = (chroma2 + minLight) * 255;
        green = (0 + minLight) * 255;
        blue = (chroma + minLight) * 255;
    }
    else if(txtHueValue.value >= 300 && txtHueValue.value < 360) {
        red = (chroma + minLight) * 255;
        green = (0 + minLight) * 255;
        blue = (chroma2 + minLight) * 255;
    }
    else {
        red = (chroma + minLight) * 255;
        green = (chroma2 + minLight) * 255;
        blue = (0 + minLight) * 255;
    }

    red = Math.round(red);
    green = Math.round(green);
    blue = Math.round(blue);
    alpha = Number(txtAlpha.value.replace('%', ''))/100;

    txtRedValue.value = red;
    txtGreenValue.value = green;
    txtBlueValue.value = blue;

    //-----------HSB TO THUMB-----------
    huePercent = Math.round((txtHueValue.value/360)*93);
    colorBarThumb.style.left = Math.round((huePercent/100) * colorBarHue.clientWidth) + "px";

    //color board 
    //saturation from txtbox
    colorBoardThumb.style.left = ((txtSatValue.value/100) * colorBoard.clientWidth) - 6 + 'px';  
    //brightness from txtbox
    colorBoardThumb.style.top = ((1-(txtBrightValue.value/100)) * colorBoard.clientHeight) - 6 + 'px';  

    colorBoard.style.background = `linear-gradient(to right, white, hsl(${txtHueValue.value}, 100%, 50%))`;

    //--------------RGB TO HEX--------------

    let channel = [];

    for(let a=0; a < 3; a++) {
        if(a == 0) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtRedValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtRedValue.value % 16));
        }
        else if(a == 1) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtGreenValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtGreenValue.value % 16));
        }
        else if(a == 2) {
            channel[a] = "";
            channel[a] += decimalToHexa(Math.floor(txtBlueValue.value / 16));
            channel[a] += decimalToHexa(Math.floor(txtBlueValue.value % 16));
        }    
    }

    hexcode = channel[0] + channel[1] + channel[2]; 
    txtHexValue.value = hexcode;

    //-------------HEX TO SOURCE HEX-----------

    //colorPickerTrigger.style.background = `rgba(${txtRedValue.value}, ${txtGreenValue.value}, ${txtBlueValue.value}, ${alpha})`;

    let triggerSibling = colorPickerTrigger.closest(`[class*='thumbPicker']`).previousElementSibling;

    //pass txtHexValue to the link txtHex
    if(triggerSibling != null) {

        triggerSibling.value = txtHexValue.value;
        triggerSibling.dataset.alpha = alpha;

        if(triggerSibling.className.includes('Color')) {
            triggerSibling.addEventListener('change', encodeColorMulti);
        }
        triggerSibling.dispatchEvent(new Event('change'));
    }
}
txtHueValue.addEventListener('change', hsb2All);
txtSatValue.addEventListener('change', hsb2All);
txtBrightValue.addEventListener('change', hsb2All);
txtHueValue.addEventListener('change', dispatchTriggerEncoding);
txtSatValue.addEventListener('change', dispatchTriggerEncoding);
txtBrightValue.addEventListener('change', dispatchTriggerEncoding);

//==============LINK COLOR PICKER HEX WITH DEFAULT HEX========

document.addEventListener('pointerup', function(e){

    if(colorBoardBool || colorBarBool) {

        colorBoardBool = false;
        colorBarBool = false;

        if(colorPickerPanel.dataset.show == "true") {

            if(e.target.parentElement != null) {
                if(!e.target.closest('#colorValuesContainer') && e.target != colorPickerTrigger && !e.target.closest('#btnSwitchGradient')) {
    
                    dispatchTriggerEncoding();
    
                }
            }   
        }
    }
});

//=========================BIT CONVERSIONS======================

function decimalToHexa(e) {
    let hexa = "ABCDEF";
    if(e > 9) {
        let z = e-9;
        let y = z - 1;
        return (hexa.substring(y,z)).toString();
    }
    else {
        return e.toString();
    }
}

function hexaToDecimal(e) {
    let hexa = "ABCDEF";

    return hexa.search(e.toUpperCase()) + 10;
}

//===============LOSE FOCUS ON COLOR PICKER=================

function hideColorPickerPanel() {

    if(colorPickerPanel.dataset.show == "true") {

        //IF THIS COLOR PICKER WAS USED FOR GRADIENT
        //THEN THERE IS COLORPICKER TRIGGER 2
        //STORE IT BACK TO COLORPICKER TRIGGER 1
        //UPON CLOSING COLORPICKER PANEL
        if(colorPickerTrigger2 != null) {
            colorPickerTrigger = colorPickerTrigger2;
            colorPickerTrigger2 = null;
        }

        colorPickerPanel.style.display = "none";
        colorPickerPanel.dataset.show = "false";

        resumeEncoding();
    }

    //[!] CLOSING THE PANEL ALWAYS KILLS THE EYEDROPPER AND THE MAGNIFIER
    isColorPicking = false;
    rcEyeDropper.style.display = "none";
    rcEyeDropper.style.left = "100vw";
    cnvPin.style.cursor = "default";
}


// THE Escape LISTENER THAT SAT HERE WAS REMOVED. IT CLOSED THE COLOR PANELS ON EVERY
//Escape NO MATTER WHAT ELSE WAS OPEN, SO IT WOULD HAVE FIRED ALONGSIDE EVERY RUNG OF THE
//ESC HIERARCHY IN tabMenu.js - CLOSING A CONTEXT MENU WOULD HAVE TAKEN THE COLOR PANEL
//WITH IT. escToolMenu OWNS Escape NOW AND CLOSES THESE PANELS ON ITS SECOND RUNG

//===============ADJUST TRANSPARENCY========================

function convertTextInput2NumberAlpha() {
    //[!] IMPORTANT REMOVE FIRST CHANGE EVENT LISTENER
    //AS THE TRANSITION FROM STRING TYPE TO NUMBER TYPE
    //ALSO CHANGES THE VALUE AND TRIGGER ENCODING
    //this.removeEventListener('change', alpha2All);
    this.value = Number(this.value.replace('%', ''));
    this.type = 'number';
    this.select();
    this.setAttribute('max', '100');
    this.setAttribute('min', '0');

    //[!]IMPORTANT ADD THE CHANGE EVENT AGAIN
    //this.addEventListener('change', alpha2All);
}
txtAlpha.addEventListener('click', convertTextInput2NumberAlpha)

function convertNumberInput2TextAlpha() {
    
    //ADD AGAIN THIS RESTRICTION
    //SINCE BY DEFAULT TEXT INPUT IS 'TEXT' AND NOT NUMBER
    //HENCE IT WAS UNAFFECTED FROM GLOBAL FUNCTION FOR ALL INPUT NUMBERS
    if(Number(this.value) > Number(this.max)) {
        this.value = this.max;
    }
    else if(Number(this.value) < Number(this.min)) {
        this.value = this.min;
    }

    this.type = 'text';
    this.value = this.value.toString().replace('%', '');
    this.value = this.value + '%';

    this.blur();

}
txtAlpha.addEventListener('focusout', function() {
    convertNumberInput2TextAlpha.call(this);
    dispatchTriggerEncoding();
})

txtAlpha.addEventListener('keydown', function(e) {
    if(e.key == "Enter") {
        this.blur();
    }
})

btnSwitchGradient.addEventListener('click', function() {

    if(colorPickerPanel.dataset.show == "true") {

        //[!] LETSSUMMONCOLORMANAGER OWNS TAKING THE PICKER DOWN NOW, IT ALSO
        //CLEARS ISCOLORPICKING AND THE EYEDROPPER WHICH THE RAW LINES DID NOT
        colorManagerPanel.dataset.pnlbox = colorPickerPanel.dataset.pnlbox;

        //GET NOW THE DEFAULT VALUE BEFORE CHANGING AND GETTING GRADIENT VALUE
        let triggerSibling = colorPickerTrigger.previousElementSibling;
        layerSequence = `rgba(${hex2RGBStringEncoding(triggerSibling.value)}, ${triggerSibling.dataset.alpha})`;
        
        //SUMMON COLOR MANAGER = GETTING NEW GRADIENT COLOR
        letsSummonColorManager(colorPickerTrigger, true);

        colorPickerTrigger.previousElementSibling.dispatchEvent(new Event('change'));
    }
})

btnSwitchGradient.addEventListener('click', encodeColorSwitch);


//sir, 2026-09-27: "cnvCapture and colorpicking magnifier does not work on file open". "FRESH"
//USED TO MEAN history[1] IS EMPTY. A FILE SAVED WITHOUT HISTORY - THE DEFAULT - OPENS WITH AN
//EMPTY history[1] AND A FULL CANVAS, SO THE SCREENSHOT WAS SKIPPED AND EVERY PIXEL WAS FORCED
//WHITE. FRESH IS NOW WHAT IS ACTUALLY ON THE CANVAS: NO LAYERS AND AN UNTOUCHED WHITE cnvBG
function isCanvasFresh() {

    if(history[1] != null) return false;

    if(document.getElementById('cnvGrpLayers').querySelector('[data-ref]') != null) return false;

    let bg = document.getElementById('cnvBG');

    if(bg == null) return true;

    let cs = getComputedStyle(bg);

    if(cs.backgroundImage != "none") return false;

    let color = cs.backgroundColor.replace(/\s/g, '');

    return color == "rgb(255,255,255)" || color == "rgba(255,255,255,1)" || color == "rgba(0,0,0,0)";
}

async function captureEyeDropperScreenshot() {

    let txtSizeWidth = document.querySelector('.txtSizeWidth');
    let txtSizeHeight = document.querySelector('.txtSizeHeight');

    //[!] THIS IS IMPORTANT! DO NOT USE DOMTOIMAGE IF CANVAS IS FRESH
    if(!isCanvasFresh()) {

        try {
            //[!] SNAPDOM MAKES ITS OWN CANVAS AND CALLS GETCONTEXT('2D') ON IT FIRST, SO
            //ASKING IT FOR WILLREADFREQUENTLY LATER IS IGNORED. BLIT INTO OUR OWN CANVAS
            //INSTEAD SO THE CONTEXT WE SAMPLE IS THE ONE BUILT FOR READBACK
            let shot = await snapdom.toCanvas(cnvMain, {fast: true, width: txtSizeWidth.value, height: txtSizeHeight.value})

            cnvCapture.width = shot.width;
            cnvCapture.height = shot.height;
            ctxCapture.drawImage(shot, 0, 0);
        }
        catch {}
    }

}

function captureEyeDropperPixels(e) {

    //[!] HIDING IS CHEAP AND MUST NOT BE THROTTLED, OTHERWISE A SKIPPED FRAME LEAVES
    //THE MAGNIFIER SITTING OUTSIDE THE CANVAS
    if(isColorPicking && !e.target.closest('#cnvPin') && !e.target.closest('.pinBody')) {

        rcEyeDropper.style.display = "none";
        return;
    }

    if(isEyedropperRAF) return;

    isEyedropperRAF = true;

    requestAnimationFrame(() => {

        isEyedropperRAF = false;

        if(isColorPicking && (e.target.closest('#cnvPin') || e.target.closest('.pinBody'))) {


            let z = rngZoom.value / 100;
            let txtSizeWidth = document.querySelector('.txtSizeWidth');
            let txtSizeHeight = document.querySelector('.txtSizeHeight');

            //[!] ONE RECT READ INSTEAD OF TWO, EACH ONE FORCES A LAYOUT ON EVERY POINTERMOVE
            let boxRect = cnvBox.getBoundingClientRect();
            let coorX = Math.round(e.clientX - boxRect.left) / z;
            let coorY = Math.round(e.clientY - boxRect.top) / z;

            //[!] CNVPIN ALREADY CARRIES IT FROM SHOWCOLORPICKERPANEL AND CURSOR INHERITS.
            //ONLY ELEMENTS WITH THEIR OWN INLINE CURSOR, LIKE THE MOVEABLE HANDLES, NEED IT
            if(e.target.style.cursor != "") e.target.style.cursor = eyedropperCursor;

            if(coorX >= 1 && coorX <= txtSizeWidth.value - 1 && coorY >= 1 && coorY <= txtSizeHeight.value - 1) {

                    if(isCanvasFresh()) {
                        //FOR LOOP REFORMAT AND NORMALIZE RGBA TO STRING HEX
                        for(let a = 0; a < rcEyeDropper.childElementCount; a++) {
                            //FORCE THE PIXELS TO BE WHITE WHEN THE PROJECT IS FRESH AND NOT CHANGES YET
                            rcEyeDropper.children[a].style.background = `white`;

                            if(a == 4) {
                                rcEyeDropper.children[a].dataset.background = "white";
                            }
                        }
                    }

                    else {

                        try {
                            //[!] ONE READBACK FOR THE WHOLE 3X3 INSTEAD OF NINE. GETIMAGEDATA IS
                            //ROW MAJOR SO THE ORDER MATCHES THE OLD PIXEL[0..8] EXACTLY
                            let pixel = ctxCapture.getImageData(coorX - 1, coorY - 1, 3, 3).data;

                            //FOR LOOP REFORMAT AND NORMALIZE RGBA TO STRING HEX
                            for(let a = 0; a < 9; a++) {

                                let p = a * 4;
                                let hex = rgbaString2HexEncoding(`rgba(${pixel[p]}, ${pixel[p + 1]}, ${pixel[p + 2]}, 1)`);

                                rcEyeDropper.children[a].style.background = `#${hex}`;

                                if(a == 4) {
                                    rcEyeDropper.children[a].dataset.background = `#${hex}`;
                                }
                            }
                        }
                        catch {}
                    }
            }
            else {
                //FOR LOOP REFORMAT AND NORMALIZE RGBA TO STRING HEX
                for(let a = 0; a < rcEyeDropper.childElementCount; a++) {

                    rcEyeDropper.children[a].style.background = document.body.dataset.background;

                    if(a == 4) {
                        rcEyeDropper.children[a].dataset.background = document.body.dataset.background;
                    }
                }
            }

            rcEyeDropper.style.display = "grid";
            rcEyeDropper.style.left = e.clientX + 'px';
            rcEyeDropper.style.top = e.clientY + 'px';

        }
    })
    
}

function copyEyeDropperHex() {

    let hex = rcEyeDropper.children[4].dataset.background;

    txtHexValue.value = hex;
    txtHexValue.dispatchEvent(new Event('change', { bubbles: true }));   
    
    isColorPicking = false;
    rcEyeDropper.style.display = "none";
}   

//===============THE CHECKER UNDER A SWATCH==================
//sir, 2026-09-28: "the thumbpicker has checkered and thumbcolor stack, the problem is because of
//border radius, if the color is dark there's some grey and white pixels on the corners from the
//gradient checkered png. this also applies to divGradientMeter stack."
//
//THE CHECKER AND THE COLOR ARE TWO ROUNDED LAYERS IN ONE CLIP. A CORNER PIXEL IS ONLY PART
//COVERED BY EACH, AND TWO PART COVERED LAYERS ALWAYS LET THE LOWER ONE SHOW - THAT IS THE GREY.
//MEASURED IN HEADLESS CHROMIUM: clip-path, A GROUP MASK AND ONE ELEMENT WITH TWO BACKGROUNDS ALL
//STILL LEAK, AND A BIGGER CHECKER RADIUS STILL LEAKS AT 125% SCREEN SCALE. THE ONLY CLEAN ANSWER
//IS NO CHECKER WHERE THE COLOR IS SOLID, SO:
//  SOLID OPAQUE   - NO CHECKER
//  SOLID SEE-THROUGH - THE FULL CHECKER, AS BEFORE
//  GRADIENT       - THE FULL CHECKER, MINUS A THIN BAND AT EVERY FULLY OPAQUE STOP. THE COLOR IS
//                   ~90% SOLID INSIDE THE BAND, SO THE MISSING CHECKER CANNOT BE SEEN, AND THE
//                   FADE ELSEWHERE IS PIXEL FOR PIXEL WHAT IT WAS
//
//NOTHING THAT PAINTS A SWATCH HAD TO CHANGE. ABOUT SEVENTY LINES ACROSS TWELVE FILES WRITE
//thumbPicker.children[1].style.background, SO THIS WATCHES THE PAINTED LAYERS INSTEAD AND READS
//THE COLOR THE BROWSER ALREADY WORKED OUT - COMPUTED STYLE SAYS rgb() FOR OPAQUE AND rgba() FOR
//SEE-THROUGH, WHATEVER FORMAT THE WRITER USED
const SWATCH_LAYERS = '.thumbColor, .thumbGradient, #gradientMeter';
const SWATCH_BAND_PX = 4;

//THE ALPHA OF ONE COMPUTED COLOR. rgb() IS 1, rgba() CARRIES ITS OWN, transparent IS 0
function swatchAlpha(color) {

    color = color.trim().toLowerCase();

    if(color == "transparent") return 0;

    let inner = /^rgba?\(([^)]*)\)$/.exec(color);

    if(inner == null) return 1;

    let parts = inner[1].split(/[\s,\/]+/).filter(p => p != "");

    if(parts.length < 4) return 1;

    let a = parts[3];

    return a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a);
}

//SPLITS ON THE COMMAS THAT ARE NOT INSIDE rgba( ) OR calc( )
function swatchSplit(text) {

    let parts = [];
    let depth = 0;
    let start = 0;

    for(let a = 0; a < text.length; a++) {

        if(text[a] == '(') depth++;
        else if(text[a] == ')') depth--;
        else if(text[a] == ',' && depth == 0) {
            parts.push(text.slice(start, a).trim());
            start = a + 1;
        }
    }

    parts.push(text.slice(start).trim());

    return parts;
}

//THE MASK FOR THE CHECKER UNDER ONE COMPUTED GRADIENT. RETURNS "full" (CHECKER AS IT WAS),
//"none" (NO CHECKER AT ALL) OR THE mask-image. ANYTHING IT CANNOT READ FALLS BACK TO "full" -
//THE OLD LOOK - RATHER THAN GUESSING
function swatchGradientMask(image) {

    let match = /^(linear|radial)-gradient\((.*)\)$/.exec(image.trim());

    if(match == null) return "full";

    let parts = swatchSplit(match[2]);
    let head = "";

    //THE FIRST PART IS THE ANGLE OR THE SHAPE UNLESS IT ALREADY IS A COLOR. CHROME DROPS THE
    //DEFAULT 180deg, SO A LINEAR GRADIENT CAN START STRAIGHT WITH ITS FIRST STOP
    if(!/^(rgba?\(|#|transparent)/.test(parts[0])) head = parts.shift();

    let stops = [];

    for(let a = 0; a < parts.length; a++) {

        let color = /^(rgba?\([^)]*\)|#[0-9a-f]+|transparent)\s*(.*)$/i.exec(parts[a]);

        if(color == null) return "full";

        let alpha = swatchAlpha(color[1]);
        let positions = color[2].trim() == "" ? [] : color[2].trim().split(/\s+/);

        //A PERCENT IS THE ONLY UNIT THE GRADIENT MANAGER WRITES
        for(let b = 0; b < positions.length; b++) {
            if(!positions[b].endsWith('%')) return "full";
        }

        if(positions.length == 0) stops.push({alpha: alpha, pos: null});
        positions.forEach(p => stops.push({alpha: alpha, pos: parseFloat(p)}));
    }

    if(stops.length < 2) return "full";

    //A STOP WITH NO POSITION SITS WHERE CSS PUTS IT: FIRST 0, LAST 100, THE REST SPREAD EVENLY
    if(stops[0].pos == null) stops[0].pos = 0;
    if(stops[stops.length - 1].pos == null) stops[stops.length - 1].pos = 100;

    for(let a = 1; a < stops.length; a++) {

        if(stops[a].pos != null) continue;

        let b = a;
        while(stops[b].pos == null) b++;

        let from = stops[a - 1].pos;
        let step = (stops[b].pos - from) / (b - a + 1);

        for(let c = a; c < b; c++) stops[c].pos = from + step * (c - a + 1);
    }

    let opaque = stops.map(s => s.alpha >= 1);

    if(opaque.every(o => o)) return "none";
    if(opaque.every(o => !o)) return "full";

    //CHECKER OFF AT AN OPAQUE STOP AND BACK ON WITHIN SWATCH_BAND_PX TOWARDS A SEE-THROUGH
    //NEIGHBOUR. A RUN OF OPAQUE STOPS STAYS OFF ALL THE WAY ACROSS. A LATER STOP THAT LANDS
    //BEFORE AN EARLIER ONE IS PUSHED UP BY CSS ITSELF, SO NOTHING HERE HAS TO SORT
    let mask = [];

    for(let a = 0; a < stops.length; a++) {

        let p = stops[a].pos;

        if(opaque[a]) {

            if(a > 0 && !opaque[a - 1]) mask.push(`#000 calc(${p}% - ${SWATCH_BAND_PX}px)`);

            mask.push(`transparent ${p}%`);

            if(a < stops.length - 1 && !opaque[a + 1]) mask.push(`#000 calc(${p}% + ${SWATCH_BAND_PX}px)`);
        }
        else {
            mask.push(`#000 ${p}%`);
        }
    }

    return `${match[1]}-gradient(${head != "" ? head + ', ' : ''}${mask.join(', ')})`;
}

function paintSwatchChecker(layer) {

    let checker = layer.parentElement?.querySelector(':scope > img');

    if(checker == null) return;

    let cs = getComputedStyle(layer);
    let result;

    if(cs.backgroundImage != "" && cs.backgroundImage != "none") {
        result = swatchGradientMask(cs.backgroundImage);
    }
    else {
        result = swatchAlpha(cs.backgroundColor) >= 1 ? "none" : "full";
    }

    checker.style.visibility = result == "none" ? "hidden" : "";

    let mask = result == "none" || result == "full" ? "" : result;

    checker.style.webkitMaskImage = mask;
    checker.style.maskImage = mask;
}

//ONE WATCHER FOR EVERY SWATCH. THE PANEL THUMBS ARE STATIC IN design.html AND ARE WATCHED ONE BY
//ONE, ONLY FOR style. THE COLOR MANAGER REBUILDS ITS METER AND ITS STOP THUMBS WITH innerHTML, SO
//THAT PANEL IS WATCHED AS A TREE. THE CANVAS IS NEVER WATCHED - ITS STYLES MOVE EVERY FRAME
let swatchObserver = new MutationObserver((records) => {

    let layers = new Set();

    records.forEach((record) => {

        if(record.type == "attributes") {

            if(record.target.matches?.(SWATCH_LAYERS)) layers.add(record.target);
        }
        else {

            record.addedNodes.forEach((node) => {

                if(node.nodeType != 1) return;

                if(node.matches(SWATCH_LAYERS)) layers.add(node);

                node.querySelectorAll(SWATCH_LAYERS).forEach(n => layers.add(n));
            });
        }
    });

    layers.forEach(paintSwatchChecker);
});

document.querySelectorAll(SWATCH_LAYERS).forEach((layer) => {

    if(layer.closest('#colorManagerPanel') == null) {
        swatchObserver.observe(layer, {attributes: true, attributeFilter: ['style']});
    }

    paintSwatchChecker(layer);
});

swatchObserver.observe(document.getElementById('colorManagerPanel'), {subtree: true, childList: true, attributes: true, attributeFilter: ['style']});

















