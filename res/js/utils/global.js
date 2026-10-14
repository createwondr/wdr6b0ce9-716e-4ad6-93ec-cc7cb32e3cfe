let counter = 0;
let cnvLayers = [];
let pinBody = [];
let defLeftScroll;
let defTopScroll;
let leadFlip;
let maxF = 0;
let maxG = 0;
let highlight = false;
let isOptionVisible = false;
let previousDrop = null;


//============ADJUST WORKAREA OVERFLOW==========

function containWorkArea() {

    let z = rngZoom.value/100;
    let cnvBox = document.getElementById('cnvBox');
    let cnvPin = document.getElementById('cnvPin');
    let canvasBorder = document.getElementById('canvasBorder');
    let cnvBoxScaler = document.getElementById('cnvBoxScaler');

    //THE BOTTOM SCROLLBAR IS ALWAYS THERE NOW (overflow: scroll) AND ONLY TAKES ROOM AT THE BOTTOM. HALF OF IT MOVES FROM THE
    //BOTTOM PADDING TO THE TOP, SO THE CANVAS SITS WHERE IT DID WITH NO BAR, AND THE TWO PADDINGS STILL ADD UP TO THE 96 BELOW
    let bar = canvasBorder.offsetHeight - canvasBorder.clientHeight;

    canvasBorder.style.paddingTop = `calc(3em + ${bar / 2}px)`;
    canvasBorder.style.paddingBottom = `calc(3em - ${bar / 2}px)`;

    //THE SAME FOR THE SIDE BAR, WHICH ONLY TAKES ROOM ON THE RIGHT, SO THE CANVAS STAYS CENTRED UNDER #divZoom. NO LEFT
    //GUTTER (workarea.css), SO offsetLeft AND left: 0 COUNT FROM THE SAME EDGE AND THE PINS LAND ON THEIR LAYERS
    let side = canvasBorder.offsetWidth - canvasBorder.clientWidth;

    canvasBorder.style.paddingLeft = `calc(3em + ${side / 2}px)`;
    canvasBorder.style.paddingRight = `calc(3em - ${side / 2}px)`;

    //WHOLE SCREEN PIXELS FOR THE CANVAS. AT 1080 x 0.57 = 615.6 THE RIGHT AND BOTTOM EDGES LANDED MID PIXEL AND THE WHITE UNDER THE LAYERS SHOWED AS A LINE
    let snapW = Math.round(cnvBox.clientWidth * z);
    let snapH = Math.round(cnvBox.clientHeight * z);

    cnvBox.style.transform = `scale(${snapW / cnvBox.clientWidth}, ${snapH / cnvBox.clientHeight})`;

    cnvBoxScaler.style.width = snapW + 'px';
    cnvBoxScaler.style.height = snapH + 'px';

    if(canvasBorder.clientWidth >= canvasBorder.scrollWidth) {
        cnvPin.style.width = '100%';
    }
    else {
        cnvPin.style.width = canvasBorder.scrollWidth + 'px';
    }

    if(canvasBorder.clientHeight >= canvasBorder.scrollHeight) {
        cnvPin.style.height = '100%';
    }
    else {
        cnvPin.style.height = canvasBorder.scrollHeight + 'px';
    }

    //[!] THIS IS FOR ZOOMING TO CENTER AUTOMATICALLY
    //CENTRED ON clientWidth / clientHeight, THE AREA YOU SEE. offsetWidth / offsetHeight INCLUDED THE SCROLLBARS
    let actualcnvBoxH = cnvBox.clientHeight * z + 96;
    let scrollH = (actualcnvBoxH - canvasBorder.clientHeight) / 2;
    let actualcnvBoxW = cnvBox.clientWidth * z + 96;
    let scrollW = (actualcnvBoxW - canvasBorder.clientWidth) / 2;

    canvasBorder.scrollLeft = scrollW;
    canvasBorder.scrollTop = scrollH;

    //NOTHING TO SCROLL: THE BARS TAKE THE PAGE COLOUR (workarea.css). ANYTHING TO SCROLL: THE NORMAL THUMB
    canvasBorder.classList.toggle('isOverflowing', canvasBorder.scrollWidth > canvasBorder.clientWidth || canvasBorder.scrollHeight > canvasBorder.clientHeight);
    
    adjustBorder();
    updateMoveableRect();

    //THE CANVAS SCALE JUST CHANGED, SO THE BLEED FOLLOWS THE NEW ZOOM
    bleedFillLayers();
}
window.addEventListener('load', containWorkArea)

window.addEventListener('resize', containWorkArea);

//==============ZOOM CONTROLS====================

function rangeZoomFormat() { //reformatting txtZoom removing %
    let getPercent = Math.round((Number(rngZoom.value) / Number(rngZoom.max))*100);

    rngZoom.style.background = `linear-gradient(to right, var(--muted-track) ${getPercent-4}%, transparent ${4}%)`;
    txtZoom.children[0].innerText = rngZoom.value + "%";

    hideAllOptions()
}
rangeZoomFormat()
rngZoom.addEventListener('input', rangeZoomFormat) //change format of slider


rngZoom.addEventListener('change', function() {
    this.blur();
});


//===============ZOOM CANVAS====================
//sir, 2026-09-27: "zooming in and out whether sliding rngZoom or ctrl + scroll sometimes not
//accurate pinbody or moveable target position on click". THE ZOOM SHARED ONE isRAF WITH
//updateMoveableRect, AND THIS FRAME CALLS updateMoveableRect, WHICH HELD THE FLAG INTO THE NEXT
//FRAME - SO THE NEXT ZOOM INPUT WAS DROPPED AND THE PINS STAYED AT AN OLDER ZOOM. ITS OWN FLAG
let isZoomRAF = false;

//WHERE THE CURSOR WAS FOR A CTRL + SCROLL ZOOM, OR null. ONLY scrollToZoom SETS IT, SO THE SLIDER, THE % DROPDOWN,
//A WINDOW RESIZE AND A CANVAS RESIZE STILL ZOOM FROM THE CENTRE (sir, 2026-10-03: METHOD A, PHOTOSHOP STYLE)
let zoomAnchor = null;

//THE SPOT OF THE LAST CTRL + SCROLL NOTCH AND WHERE IT LEFT THE SCROLLBARS. THE NEXT NOTCH REUSES IT WHILE THE CURSOR HAS NOT
//MOVED AND NOTHING ELSE SCROLLED. RE-READING IT EVERY NOTCH LET THE WHOLE-PIXEL ROUNDING OF scrollLeft / scrollTop ADD UP:
//MEASURED LIVE 2026-10-03, 2.6px OFF THE CURSOR AFTER 10 NOTCHES
let zoomSpot = null;

function zoomMainCanvas() {

    if(isZoomRAF) return;

    isZoomRAF = true;

    requestAnimationFrame(() => {

        isZoomRAF = false;

        let cnvBox = document.getElementById('cnvBox');
        let cnvPin = document.getElementById('cnvPin');
        let rngZoom = document.getElementById('rngZoom');
        let z = rngZoom.value / 100;
        let pinBody = document.getElementsByClassName('pinBody');
        let canvasBorder = document.getElementById('canvasBorder');
        let cnvBoxScaler = document.getElementById('cnvBoxScaler');

        //CTRL + SCROLL: WHICH SPOT OF THE DESIGN IS UNDER THE CURSOR, READ BEFORE THE SCALE CHANGES. A FRACTION OF THE
        //CANVAS, SO IT HOLDS WHATEVER THE NEW SIZE IS. SEVERAL NOTCHES IN ONE FRAME SHARE ONE SPOT
        let anchor = zoomAnchor;
        let spot = null;

        zoomAnchor = null;

        if(anchor != null) {

            //SAME GESTURE: THE CURSOR HAS NOT MOVED AND THE SCROLLBARS ARE WHERE THE LAST NOTCH LEFT THEM
            if(zoomSpot != null && zoomSpot.x == anchor.x && zoomSpot.y == anchor.y && zoomSpot.left == canvasBorder.scrollLeft && zoomSpot.top == canvasBorder.scrollTop) {
                spot = zoomSpot;
            }
            else {

                let before = cnvBox.getBoundingClientRect();

                spot = { x: anchor.x, y: anchor.y, fx: (anchor.x - before.left) / before.width, fy: (anchor.y - before.top) / before.height };
            }
        }

        //WHOLE SCREEN PIXELS FOR THE CANVAS, SAME AS containWorkArea
        let snapW = Math.round(cnvBox.clientWidth * z);
        let snapH = Math.round(cnvBox.clientHeight * z);

        cnvBox.style.transform = `scale(${snapW / cnvBox.clientWidth}, ${snapH / cnvBox.clientHeight})`;

        cnvBoxScaler.style.width = snapW + 'px';
        cnvBoxScaler.style.height = snapH + 'px';

        cnvPin.style.width = canvasBorder.scrollWidth + 'px';
        cnvPin.style.height = canvasBorder.scrollHeight + 'px';

        //[!]ADJUST WIDTH + 3EM (96PX)
        if((cnvBox.clientWidth * z + 96) > canvasBorder.clientWidth) {
            cnvPin.style.width = cnvBox.clientWidth * z + 96 + 'px';
        }
        else {
            cnvPin.style.width = '100%';
        }

        //[!]ADJUST HEIGHT + 3EM (96PX)
        if((cnvBox.clientHeight * z + 96) > canvasBorder.clientHeight) {
            cnvPin.style.height = cnvBox.clientHeight * z + 96 + 'px';
        }
        else {
            cnvPin.style.height = '100%';
        }

        //[!] THIS IS FOR ZOOMING TO CENTER AUTOMATICALLY
        //CENTRED ON clientWidth / clientHeight, THE AREA YOU SEE. offsetWidth / offsetHeight INCLUDED THE SCROLLBARS
        let actualcnvBoxH = cnvBox.clientHeight * z + 96;
        let scrollH = (actualcnvBoxH - canvasBorder.clientHeight) / 2;
        let actualcnvBoxW = cnvBox.clientWidth * z + 96;
        let scrollW = (actualcnvBoxW - canvasBorder.clientWidth) / 2;

        canvasBorder.scrollLeft = scrollW;
        canvasBorder.scrollTop = scrollH;

        //THEN THE SAME SPOT BACK UNDER THE CURSOR: BOTH SCROLLBARS MOVE BY HOW FAR IT LANDED FROM IT. THE BROWSER STOPS
        //THEM AT EACH END, SO WHILE THE WHOLE CANVAS FITS THE VIEW IT SIMPLY STAYS CENTRED
        if(spot != null) {

            let after = cnvBox.getBoundingClientRect();

            canvasBorder.scrollLeft += after.left + spot.fx * after.width - anchor.x;
            canvasBorder.scrollTop += after.top + spot.fy * after.height - anchor.y;

            //KEPT ONLY IF THE SCROLLBARS REALLY PUT IT BACK UNDER THE CURSOR. WHILE THE CANVAS STILL FITS, OR AT AN END, THEY
            //CANNOT, AND HOLDING ON WOULD YANK THE VIEW BACK TO AN OLD SPOT THE MOMENT SCROLLING BECOMES POSSIBLE
            let landed = cnvBox.getBoundingClientRect();

            if(Math.abs(landed.left + spot.fx * landed.width - anchor.x) <= 1 && Math.abs(landed.top + spot.fy * landed.height - anchor.y) <= 1) {
                zoomSpot = { x: spot.x, y: spot.y, fx: spot.fx, fy: spot.fy, left: canvasBorder.scrollLeft, top: canvasBorder.scrollTop };
            }
            else {
                zoomSpot = null;
            }
        }
        else {

            //A CENTRE ZOOM (SLIDER, % DROPDOWN, CANVAS RESIZE) ENDS THE GESTURE
            zoomSpot = null;
        }

        //NOTHING TO SCROLL: THE BARS TAKE THE PAGE COLOUR (workarea.css). ANYTHING TO SCROLL: THE NORMAL THUMB
        canvasBorder.classList.toggle('isOverflowing', canvasBorder.scrollWidth > canvasBorder.clientWidth || canvasBorder.scrollHeight > canvasBorder.clientHeight);

        //[!] UPDATE BORDERS
        adjustBorder();

        //THE BLEED IS ONE SCREEN PIXEL, SO ITS WIDTH IN DESIGN UNITS FOLLOWS THE ZOOM
        bleedFillLayers();

        //IN THIS FRAME, NOT THE NEXT. THE DEFERRED ONE LEFT MOVEABLE'S BOX ONE ZOOM BEHIND THE
        //PINS FOR A FRAME, AND A CLICK IN THAT FRAME LANDED ON THE OLD GEOMETRY
        updateMoveableRectNow();
    })
    
}

rngZoom.addEventListener('input', zoomMainCanvas); //resize canvas using rngzoom
rngZoom.addEventListener('input', function() {  //separate function for white txtzoom text color
    txtZoom.children[0].style.color = "var(--sharp)";  
})
rngZoom.addEventListener('pointerdown', function() {  //separate function for white txtzoom text color
    hideMoveableRect();
})

rngZoom.addEventListener('pointerup', function() {  //separate function for white txtzoom text color
    showMoveableRect();
})

//================HOVER ON ZOOM=================
dropdownZoom.addEventListener('pointerover', function() {
    txtZoom.children[0].style.color = "var(--sharp)";
})

dropdownZoom.addEventListener('pointerleave', function() { 
    txtZoom.children[0].style.color = "var(--muted-blue-text)";
})

//================CTRL + SCROLL TO ZOOM===========
function scrollToZoom(e) {

    if(e.ctrlKey) {

        e.preventDefault();

        //OVER THE WORK AREA THE ZOOM GOES INTO THE SPOT UNDER THE CURSOR. OVER A PANEL IT ZOOMS FROM THE CENTRE AS BEFORE
        let view = canvasBorder.getBoundingClientRect();

        if(e.clientX >= view.left && e.clientX <= view.right && e.clientY >= view.top && e.clientY <= view.bottom) {
            zoomAnchor = { x: e.clientX, y: e.clientY };
        }

        if(e.deltaY < 0) {
            rngZoom.value = Number(rngZoom.value) + 2;
            rangeZoomFormat();
            zoomMainCanvas();
        }
        else if(e.deltaY > 0) {
            rngZoom.value = Number(rngZoom.value) - 2;
            rangeZoomFormat();
            zoomMainCanvas();
        }

        txtZoom.children[0].style.color = "var(--sharp)";
        hideMoveableRect();
    }
    else {
        updateMoveableRect();
    }

}
document.addEventListener('wheel', scrollToZoom, {passive: false});

//================SIDE SCROLL ON ZOOM=============
function saveDefaultScroll() {

    defLeftScroll = (this.scrollLeft / this.scrollWidth) * 100;
    defTopScroll = (this.scrollTop / this.scrollHeight) * 100;

}
canvasBorder.addEventListener('scroll', saveDefaultScroll);

//===============OUT OF ZOOM======================

document.addEventListener('keyup', function(e) {
    if(e.key == "Control") {
        blurZoomMainCanvas();
    }
})

function blurZoomMainCanvas() {
    txtZoom.children[0].style.color = "var(--muted-blue-text)";
    let getPercent = Math.round((Number(rngZoom.value) / Number(rngZoom.max))*100);
    rngZoom.style.background = `linear-gradient(to right, var(--muted-track) ${getPercent-4}%, transparent ${4}%)`;
    showMoveableRect();
}
rngZoom.addEventListener('change', blurZoomMainCanvas); //resize canvas using rngzoom

//change zoom text and range via dropdown

function changeTextZoom() {
    rngZoom.value = Number(this.innerText.substr(0, this.innerText.length-1))
    rangeZoomFormat(); 
    zoomMainCanvas();
}

//add event listener for all optZooms
let optZoom = document.querySelectorAll('.optZoom');
for(let a = 0; a < optZoom.length; a++) {
    optZoom[a].addEventListener('pointerdown', changeTextZoom);
}

//=============CHANGE COLOR OF ALL TEXTS===============
function changeTextColor() {
    
    let inputs = document.querySelectorAll('input');
    
    let testRng = 'rng';
    let testColor = 'Color';
    let testSearch = 'Search';

    inputs.forEach(function(input) {
        
        //ONLY APPLIES THESE NESTED CONDITIONS
        //IF TEXTBOX INPUT IS NOT TXT PANEL HEADER
       
        //SPECIAL CONDITION FOR TXTCOLORS
        if(input.className.includes(testColor)) {
            input.style.color = "var(--sharp)";
        }
        //SPECIAL CONDITION FOR RNGS
        else if(input.className.includes(testRng)) {
            input.addEventListener('input', function() {
                input.nextElementSibling.style.color = "var(--sharp)";
            })

            input.addEventListener('change', function() {
                input.nextElementSibling.style.color = "var(--muted-blue-text)";
            })
        }
        else if(input.className.includes(testSearch)) {
            input.style.color = "var(--sharp)";
        }
        else {
            
            input.style.color = "var(--muted-blue-text)";
            
            input.addEventListener('focus', function() {
                input.style.color = "var(--sharp)";
            })
            input.addEventListener('blur', function() {
                input.style.color = "var(--muted-blue-text)";
            })
            
        }
    })
}
changeTextColor();

//=============HIDE ALL DROPDOWN SELECTIONS=============

function hideAllOptions() { 
    
    let dropOption = document.querySelectorAll(`[class*='dropOption']`);

    dropOption.forEach((opt) => {
        opt.style.display = "none";

    })

    //[!] THE FLAGS ARE PART OF WHAT IT MEANS FOR THE OPTIONS TO BE HIDDEN. CLEARING
    //THEM HERE IS WHY THEY CANNOT GO STALE WHEN SOMETHING ELSE CLOSES A LIST
    isOptionVisible = false;
    previousDrop = null;

} 

//===============VALIDATE THE KEYWORDS IN SEARCHBOX============
function validateSearch(e) {

    let regex = /^[a-zA-Z0-9 ]+$/;

    if(e.type == "input") {

        if(!regex.test(e.data)) {

            if(this.value.length > 0) {
                let original = this.value;
                let sanitized = original.replace(e.data, '');
                this.value = sanitized;
            }
        }
    }
    
    else if(e.type == "change") {
        if(!regex.test(e.key)) {
            this.value = "";
        }
    }

}
document.querySelectorAll('.txtSearch').forEach((input) => {
    input.addEventListener('input', validateSearch)
})

//================RENAMING PANEL HEADERS================
let renameDefault = "";

//function to rename txtHeader
function validateTxtHeader(e) {
    let regex = /^[a-zA-Z0-9 ]+$/;

    if(!regex.test(e.key) && !['Enter', 'Escape'].includes(e.key)) {
        e.preventDefault();
    }
}

function renameTxtHeader() {

    panel2Focus(this.closest('.pnlBoxLayer'));

    renameDefault = this.value;

    this.style.border= "1px solid var(--muted-blue-text)";
    this.closest(`[class*="pnlBox"]`).style.background = "transparent";
}

//function to  save header's name
function saveTxtHeader() {

    let regex =  /^[a-zA-Z0-9 ]+$/;
    
    if(this.value.trim() == "") {
        this.value = renameDefault;
    }
    else if(!regex.test(this.value)) {
        this.value = renameDefault;
    }

    this.style.border= "none";
    this.style.background = "transparent"
    this.style.textAlign = "center";
    this.style.paddingLeft = "0px";
    this.style.paddingRight = "0px";
}

//===============CHECKBOXES BUTTONS LISTENERS============

function chkBoxHover() {

    this.style.transition = ".2s";
    this.style.borderColor = "var(--muted-blue-text)";
    this.children[0].style.transition = ".2s";
    this.children[0].style.backgroundColor = "white";
        
}

function chkBoxLeave() {
    
    if(this.dataset.value == "false") {
        this.style.borderColor = "var(--sharp-track)";
        this.children[0].style.backgroundColor = "var(--muted-blue-text)";
    }
    
    else if(this.dataset.value == "true") {
        this.children[0].style.backgroundColor = "white";
    }
    
    this.addEventListener('pointerover', chkBoxHover)
}

function chkBoxClick() {

    leadFlip = this;

    if(leadFlip.dataset.value == "false") {
        
        leadFlip.dataset.value = "true";
        leadFlip.style.transition = ".2s";
        leadFlip.style.borderColor = "transparent";
        leadFlip.style.backgroundColor = "var(--accent)";
        leadFlip.children[0].style.transition = ".2s";
        leadFlip.children[0].style.translate = `${leadFlip.children[0].clientWidth -1}px`;
        leadFlip.children[0].style.backgroundColor = "white";
    }

    else if(this.dataset.value == "true") { 

        leadFlip.dataset.value = "false";
        leadFlip.style.transition = ".2s";
        leadFlip.style.borderColor = "var(--muted-blue-text)";

        leadFlip.style.backgroundColor = "transparent";
        leadFlip.children[0].style.transition = ".2s";
        leadFlip.children[0].style.translate = "0px";
        leadFlip.children[0].style.backgroundColor = "white";

        leadFlip.removeEventListener('pointerover', chkBoxHover);
    }

}

document.querySelectorAll('[class*=chk]').forEach(chk => {
    
    if(!chk.className.includes('chkSwitch') && !chk.closest(`#chkMode`)) {

        chk.addEventListener('click', chkBoxClick);
        chk.addEventListener('pointerover', chkBoxHover);
        chk.addEventListener('pointerleave', chkBoxLeave);
    }
})


function chkBoxFormat(leadFlip) {
    
    if(leadFlip.dataset.value == "false") {

        leadFlip.style.transition = "0s";
        leadFlip.style.backgroundColor = "transparent";
        leadFlip.children[0].style.transition = "0s";
        leadFlip.children[0].style.translate = "0px";
        leadFlip.style.borderColor = "var(--sharp-track)";
        leadFlip.children[0].style.backgroundColor = "var(--muted-blue-text)";        
    }

    else if(leadFlip.dataset.value == "true") { 

        leadFlip.style.transition = "0s";
        leadFlip.style.borderColor = "transparent";
        leadFlip.style.backgroundColor = "var(--accent)";
        leadFlip.children[0].style.transition = "0s";
        leadFlip.children[0].style.translate = "12px";
        leadFlip.children[0].style.backgroundColor = "white";

        leadFlip.removeEventListener('mouseover', chkBoxHover);
    }
    
}


//===============PANEL BOTTOM BUTTONS LISTENERS==========

function btnBottomClick() {

    //don't change to 'this.closer' because it needs closer 'pattern' and closer 'layer'
    for(let b = 0; b < this.parentElement.parentElement.childElementCount; b++) {
        this.parentElement.parentElement.children[b].children[0].children[0].style.filter = "none";
    }

    this.children[0].style.filter = "saturate(0) brightness(2)";
    hideShowBottomClick.call(this)
}

function hideShowBottomClick() {

    let tabName = 'tab' + this.className.replace('btn', '')
    let pnlBox = this.closest('[id*="pnlBox"]');
    let tabSlider = pnlBox.querySelector('.contentBox').children[0];

    //START HIDING FIRST ALL TABS
    for(let a = 0; a < tabSlider.childElementCount; a++) {
        if(tabSlider.children[a].className == tabName) {
            tabSlider.children[a].style.visibility = 'visible';
        }
        else {
            tabSlider.children[a].style.visibility = 'hidden';
        }
    }
}

function btnBottomHover() {
    if(this.children[0].style.filter != "saturate(0) brightness(2)") {
        this.children[0].style.filter = "saturate(1) brightness(1.5)";
    }
}

function btnBottomLeave() {
    if(this.children[0].style.filter != "saturate(0) brightness(2)") {
        this.children[0].style.filter = "none";
    }
}

//===============TEXT PANEL BUTTONS LISTENERS==============

function btnOptionClick(){
    
    //don't change to 'this.closer' because it needs closer 'pattern' and closer 'layer'
  
    for(let b = 0; b < this.parentElement.childElementCount; b++) {
        this.parentElement.children[b].children[0].style.filter = "none";
    }
    this.children[0].style.filter = "saturate(0) brightness(2)";
}

function btnOptionHover() {
    if(this.children[0].style.filter != "saturate(0) brightness(2)") {
        this.children[0].style.filter = "saturate(1) brightness(1.5)";
    }
}

function btnOptionLeave() {
    if(this.children[0].style.filter != "saturate(0) brightness(2)") {
        this.children[0].style.filter = "none";
    }
}

//===============TEXT PANEL BUTTONS TEXT LISTENERS==========


function btnTextClick(){
    //don't change to 'this.closer' because it needs closer 'pattern' and closer 'layer'
    for(let b = 0; b < this.parentElement.childElementCount; b++) {
        
        let icon = this.parentElement.children[b].children[0];

        icon.style.color = "var(--muted-blue-text)";
        if(icon.tagName == "DIV") icon.style.filter = "none";
    }

    this.children[0].style.color = "var(--sharp)";

}

/////////////////////////////LINK TEXTBOXES TO RANGE///////////////////////

function linkRangeToTextbox() {

    for(var a = 0; a < document.getElementsByClassName('rngInput').length; a++) {
        document.getElementsByClassName('rngInput')[a].addEventListener('input', adjustRangeToTextbox);
    }

}
linkRangeToTextbox();

function adjustRangeToTextbox() {
    this.nextElementSibling.value = this.value;
}

function validateTextboxToRange() {
    this.value = Math.round(Number(this.value));

    var max = Number(this.max);
    var min = Number(this.min);
    var me = Number(this.value);

    if(me > max && max != 0) {
        this.value = max;
        //WE NEED THIS VALIDATION FOR NUMBER INPUT WITHOUT RANGE SLIDER BESIDE
        //EX. RGB NUMBER INPUT IN COLOR PICKER WHERE 255,255,255 TEXT INPUTS ARE BESIDE EACH OTHER
        if(this.previousElementSibling != null && this.previousElementSibling.type == "range") {
            this.previousElementSibling.value = max;
        }
        
    }
    else if(me < min) {
        this.value = min;
        //WE NEED THIS VALIDATION FOR NUMBER INPUT WITHOUT RANGE SLIDER BESIDE
        //EX. RGB NUMBER INPUT IN COLOR PICKER WHERE 255,255,255 TEXT INPUTS ARE BESIDE EACH OTHER
        if(this.previousElementSibling != null && this.previousElementSibling.type == "range") {
            this.previousElementSibling.value = min;
        }
    }
    
    else {
        this.value = me;
        //WE NEED THIS VALIDATION FOR NUMBER INPUT WITHOUT RANGE SLIDER BESIDE
        //EX. RGB NUMBER INPUT IN COLOR PICKER WHERE 255,255,255 TEXT INPUTS ARE BESIDE EACH OTHER
        if(this.previousElementSibling != null && this.previousElementSibling.type == "range") {
            this.previousElementSibling.value = me;
        }
    }

}

function enterTextbox(e) {
    if(e.key === "Enter") {
        this.blur();
        
        this.value = Math.round(Number(this.value));

        var max = Number(this.max);
        var min = Number(this.min);
        var me = Number(this.value);

        if(me > max && max != 0) {
            me = max;
            if(this.previousElementSibling != null && this.previousElementSibling.type == "range") {
                this.previousElementSibling.value = max;
            }
        }
        else if(me < min && min != 0) {
            me = min;
            if(this.previousElementSibling != null && this.previousElementSibling.type == "range") {
                this.previousElementSibling.value = min;
            }
        }
        else {

            this.previousElementSibling.value = me;
            if(this.previousElementSibling != null && this.previousElementSibling.type == "range") {
                this.previousElementSibling.value = me;
            }
        }
    }
}

function linkTextboxToRange() {

    let inputs = document.querySelector('#propertiesBox').querySelectorAll('input[data-unit], input[type="number"]');
    inputs.forEach(function(input) {
        input.addEventListener('change', validateTextboxToRange);
        input.addEventListener('focusout', validateTextboxToRange);
        input.addEventListener('keydown', enterTextbox);
    })

    inputs = document.querySelector('#menuSettings').querySelectorAll('input[data-unit], input[type="number"]');
    inputs.forEach(function(input) {
        input.addEventListener('change', validateTextboxToRange);
        input.addEventListener('focusout', validateTextboxToRange);
        input.addEventListener('keydown', enterTextbox);
    })

    inputs = document.querySelector('#menuSave').querySelectorAll('input[data-unit], input[type="number"]');
    inputs.forEach(function(input) {
        input.addEventListener('change', validateTextboxToRange);
        input.addEventListener('focusout', validateTextboxToRange);
        input.addEventListener('keydown', enterTextbox);
    })

}
linkTextboxToRange();

//================NUMBER BOXES: SUMS AND UNITS================
//EVERY NUMBER BOX IS type="text" WITH A data-unit, SO IT CAN TAKE "200 + 50", "1em", "50%". THE TEXT IS ONLY FOR
//TYPING. ON Enter OR LEAVING THE BOX IT BECOMES A WHOLE NUMBER, AND EVERY HANDLER AND history.js ONLY EVER SEE THAT
//  px      NUMBER, px, em, rem (16)          % OF THE VALUE AT FOCUS (1080 AND 50% IS 540)
//  LAYER W / X  H / Y                       % OF THE CANVAS WIDTH / HEIGHT (1080 CANVAS AND 50% IS 540)
//  deg     NUMBER, deg, THE DEGREE SIGN      % OF THE VALUE AT FOCUS
//  %       NUMBER                            % OF THE BOX'S max (OPACITY 0-100 AND 50% IS 50, BRIGHTNESS 0-200 IS 100)
//  plain   NUMBER                            % OF THE BOX'S max (SNAP 1-20 AND 50% IS 10)
//  + - * / AND ( ) IN ALL OF THEM. ANY OTHER UNIT IS INVALID AND THE BOX FALLS BACK TO numberDefault
//  THE COLOUR PICKER'S RGB AND HSB BOXES ARE NOT PART OF THIS. THEY STAYED NATIVE type="number" (sir, 2026-10-03)

//THE VALUE A NUMBER BOX HELD WHEN IT WAS FOCUSED. SAME JOB AS renameDefault FOR THE HEADERS
let numberDefault = "";

//RETURNS THE WHOLE NUMBER THE TEXT ADDS UP TO, OR null WHEN IT DOES NOT
function formatNumberInput(input) {

    let unit = input.dataset.unit;
    let text = input.value.trim().toLowerCase();
    //A PERCENTAGE BOX OR A FIXED RANGE GOES BY ITS max, A MEASUREMENT BY WHAT IT HELD (sir, 2026-10-03)
    //A LAYER'S SIZE AND POSITION GO BY THE CANVAS (sir, 2026-10-07)
    let canvasBox = input.matches('.txtWidthLayer, .txtXLayer') ? '.txtSizeWidth' : input.matches('.txtHeightLayer, .txtYLayer') ? '.txtSizeHeight' : null;
    let base = canvasBox != null ? Number(document.getElementById('pnlBoxCanvas').querySelector(canvasBox).value)
        : (unit == "%" || unit == "plain") && input.max != "" ? Number(input.max) : Number(numberDefault);
    let tokens = [];
    let pattern = /\s*(?:(\d*\.?\d+)\s*(rem|em|px|deg|\u00b0|%)?|([-+*/()]))/y;
    let at = 0;

    if(text == "") return null;

    while(at < text.length) {

        pattern.lastIndex = at;

        let match = pattern.exec(text);

        if(match == null) return null;

        at = pattern.lastIndex;

        if(match[3] != null) {
            tokens.push(match[3]);
            continue;
        }

        let number = Number(match[1]);
        let suffix = match[2];

        if(suffix == null) tokens.push(number);
        else if(suffix == "px" && unit == "px") tokens.push(number);
        else if((suffix == "em" || suffix == "rem") && unit == "px") tokens.push(number * 16);
        else if((suffix == "deg" || suffix == "\u00b0") && unit == "deg") tokens.push(number);
        else if(suffix == "%") tokens.push(number / 100 * base);
        else return null;
    }

    //+ - BEFORE * /, BRACKETS FIRST, A LEADING - OR + ON ANY NUMBER
    let next = 0;

    function readSum() {

        let value = readProduct();

        while(tokens[next] == "+" || tokens[next] == "-") {
            let sign = tokens[next++];
            value = sign == "+" ? value + readProduct() : value - readProduct();
        }

        return value;
    }

    function readProduct() {

        let value = readNumber();

        while(tokens[next] == "*" || tokens[next] == "/") {
            let sign = tokens[next++];
            value = sign == "*" ? value * readNumber() : value / readNumber();
        }

        return value;
    }

    function readNumber() {

        let token = tokens[next++];

        if(token == "-") return -readNumber();
        if(token == "+") return readNumber();

        if(token == "(") {
            let value = readSum();
            if(tokens[next++] != ")") return NaN;
            return value;
        }

        return typeof token == "number" ? token : NaN;
    }

    let value = readSum();

    //LEFTOVER TOKENS, A BROKEN BRACKET OR A DIVISION BY ZERO
    if(next != tokens.length || !Number.isFinite(value)) return null;

    return Math.round(value);
}

//Enter OR LEAVING THE BOX. ONE change, WITH THE FINAL NUMBER, AND ONLY IF IT DIFFERS FROM THE VALUE AT FOCUS
function commitNumberInput(input) {

    let value = formatNumberInput(input);

    input.value = value == null ? numberDefault : value;

    if(input.value == numberDefault) return;

    //input FIRST SO THE LIVE LISTENERS (CANVAS AND OUTPUT ASPECT LOCK) SEE THE FINAL NUMBER TOO
    input.dispatchEvent(new Event('input', {bubbles: true}));
    input.dispatchEvent(new Event('change', {bubbles: true}));

    //AFTER THE change, SO A CLAMP INSIDE IT (validateTextboxToRange) IS WHAT THE NEXT COMMIT COMPARES AGAINST
    numberDefault = input.value;
}

window.addEventListener('focusin', (e) => {
    if(e.target.matches?.('input[data-unit]')) numberDefault = e.target.value;
}, true);

//A HALF TYPED SUM ("200 +") NEVER REACHES A HANDLER. A PLAIN NUMBER STILL DOES, SO THE ASPECT LOCK FOLLOWS THE TYPING
window.addEventListener('input', (e) => {
    if(!e.isTrusted || !e.target.matches?.('input[data-unit]')) return;
    if(!/^-?\d+(\.\d+)?$/.test(e.target.value.trim())) e.stopImmediatePropagation();
}, true);

//THE BROWSER'S OWN change WOULD CARRY THE RAW TEXT, AND IT NEVER FIRES AFTER AN ARROW KEY (A VALUE SET FROM JS).
//commitNumberInput SENDS THE ONLY change THESE BOXES GET
window.addEventListener('change', (e) => {
    if(e.isTrusted && e.target.matches?.('input[data-unit]')) e.stopImmediatePropagation();
}, true);

//CAPTURE RUNS BEFORE validateTextboxToRange AND THE DELEGATED focusout, SO THEY READ THE NUMBER
window.addEventListener('focusout', (e) => {
    if(e.target.matches?.('input[data-unit]')) commitNumberInput(e.target);
}, true);

window.addEventListener('keydown', (e) => {

    if(!e.target.matches?.('input[data-unit]')) return;

    if(e.key == "Enter") {
        commitNumberInput(e.target);
    }

    //A TEXT BOX HAS NO STEPPING OF ITS OWN. 1 PER PRESS. LIKE A NUMBER BOX IT ONLY FIRES input,
    //THE change COMES ON Enter OR LEAVING THE BOX, SO HOLDING AN ARROW IS ONE HISTORY STEP
    else if(e.key == "ArrowUp" || e.key == "ArrowDown") {

        e.preventDefault();

        let input = e.target;
        let value = formatNumberInput(input);

        if(value == null) value = Number(numberDefault);

        value += e.key == "ArrowUp" ? 1 : -1;

        if(input.max != "" && value > Number(input.max)) value = Number(input.max);
        if(input.min != "" && value < Number(input.min)) value = Number(input.min);

        input.value = value;
        input.dispatchEvent(new Event('input', {bubbles: true}));
    }
}, true);

function autoIncrementHeader(name) {

    let txtHeader = document.getElementsByClassName('txtHeader');

    var counter = 1;
    var arrName = null;

    for(var a = 0; a < txtHeader.length; a++) {
        arrName = txtHeader[a].value.split(" ");
        if(arrName[0] == name) {
            if(Number(arrName[1]) >= counter ) {
                counter = Number(arrName[1]) + 1;
            }
        }
    }
    
    return newHeader = name + " " + counter;
}

//////////////////////FUNCTIONS ABOUT FOCUS//////////////////////

function thumb2Focus(thumb) {

    let n = thumb.dataset.thumbno;
    focusPanel[n] = thumb;
    focusPanel[n].style.borderColor = "var(--muted-blue-text)";
    focusPanel[n].style.borderWidth = "1px"; //highlight

    canvasUnfocusAll();
}

function thumbUnfocus(thumb) {

    let wrapUploads = document.getElementById('wrapUploads');

    for(let a = 0; a < wrapUploads.childElementCount; a++) {
        if(focusPanel[a] == thumb) {
            focusPanel[a].removeEventListener('pointerover', pointerOverThumb)
            focusPanel[a].style.borderColor = "transparent";
            focusPanel[a].style.backgroundColor = "transparent";
            focusPanel[a].style.borderWidth = "1px";
            focusPanel[a] = null;
        }
    }
}

function thumbUnfocusAll() {

    let wrapUploads = document.getElementById('wrapUploads');

    for(let a = 0; a < wrapUploads.childElementCount; a++) {
        
        if(wrapUploads.children[a] != null) {

            wrapUploads.children[a].style.borderColor = "transparent";
            wrapUploads.children[a].style.backgroundColor = "transparent";
            wrapUploads.children[a].style.borderWidth = "1px";
            focusPanel[a] = null;
        }
    }
}

function n2Thumb(n) {
    let configScroll = document.getElementsByClassName('configScroll');

    let thumb = configScroll[2].querySelector(`[data-thumbno="${n}"]`);
    return thumb;
}

function f2Canvas(f) {
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    return canvas;
}

function f2Panel(f) {
    let configScroll = document.getElementsByClassName('configScroll');

    let panel = configScroll[5].querySelector(`[data-ref="${f}"]`);
    return panel;
}

function f2PinBody(f) {
    let cnvPin = document.getElementById('cnvPin');

    let pin = cnvPin.querySelector(`[data-ref="${f}"]`);
    return pin;
}

function panel2Focus(panel) {
    
    let f = panel.dataset.ref;
 
    //NO NEED FOR LEADDRAG = PIN
    //IT'S THERE IN CHOOSELEADDRAG(PIN) FUNCTION ALREADY
    focusPanel[f] = panel;
    leadPanel = focusPanel[f];

    focusPanel[f].style.background = "var(--accent)";

    if(panel.dataset.type != "pattern") {

        let cnvPin = document.getElementById('cnvPin');
        let pin = cnvPin.querySelector(`[data-ref="${f}"]`);

        focusObj[f] = f2Canvas(f);

        //A HIDDEN LAYER STILL SHOWS ITS BOUNDARY WHILE ITS PANEL IS FOCUSED
        if(pin != null) {

            pin.style.visibility = "visible";

            chooseLeadDrag(pin);
            moveableUpdateTargets();
        }
    }
    
    swapPanels(panel.dataset.type);
}

function panelFocusAll() {

    resetAllFocus();

    let configScroll = document.getElementsByClassName('configScroll');
    
    for(let a = configScroll[5].childElementCount-1; a >= 0; a--) {
        panel2Focus(configScroll[5].children[a])
    }
}

//[!] ONE SETTER FOR ALL THREE SELECT-ALL CONTEXTS. undo/redo NEED TO *SET* A STATE,
//[!] WHILE selectDeselectAll ONLY KNOWS HOW TO *TOGGLE* - HENCE THIS, NOT A REUSE OF IT.
//[!] panels VS canvas IS NOT COSMETIC: canvasFocusAll SKIPS LOCKED LAYERS, panelFocusAll
//[!] DOES NOT. thumbs DELIBERATELY DOES NOT TOUCH selectedAll - context.js READS THAT FLAG
//[!] TO PICK THE RIGHT-CLICK MENU AND THE UPLOADS PANEL NEVER SET IT
function selectAllTarget(target, selected) {

    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');

    if(target == "thumbs") {

        for(let a = 0; a < pnlBoxThumb.length; a++) {
            pnlBoxThumb[a].style.borderColor = selected? "var(--muted-blue-text)": "transparent";
            pnlBoxThumb[a].style.borderWidth = "1px";
            focusPanel[a] = selected? pnlBoxThumb[a]: null;
        }
    }
    else if(target == "panels") {

        selected? panelFocusAll(): panelUnfocusAll();
        selectedAll = selected;
    }
    else {

        selected? canvasFocusAll(): canvasUnfocusAll();
        selectedAll = selected;
    }
}

function panelUnfocus(panel) {

    let f = panel.dataset.ref;

    panel.style.background = "transparent";

    if(panel.dataset.type != "pattern") {

        let pin = f2PinBody(f);

        focusObj[f] = null;
        focusPanel[f] = null;

        moveableUpdateTargets();

        //A HIDDEN LAYER LOSES ITS BOUNDARY WITH ITS FOCUS
        if(pin != null && panel.querySelector('.btnShowHide')?.dataset.show == "hidden") pin.style.visibility = "hidden";
    }
           
}

function panelUnfocusAll() {

    for(let a = 0; a < maxF; a++) {

        if(focusPanel[a] != null) {

            if(focusPanel[a].dataset.type == "group") {

                focusPanel[a].firstElementChild.style.background = "transparent";
            }

            else {
                let f = focusPanel[a].dataset.ref;

                if(focusPanel[a].dataset.type != 'pattern') {

                    let pin = f2PinBody(f);
                    if(pin != null && focusPanel[a].querySelector('.btnShowHide')?.dataset.show == "hidden") pin.style.visibility = "hidden";
                }
                
                focusPanel[a].style.background = "transparent";
            }
        }
           
        focusObj[a] = null;
        focusPanel[a] = null;
    }

    //THROUGH THE ONE OWNER, A DIRECT NULL HERE LEAVES ITS RECORD OF THE TARGET STALE
    moveableUpdateTargets();
}

function canvas2Focus(canvas) {

    let cnvPin = document.getElementById('cnvPin');
    let configScroll = document.getElementsByClassName('configScroll');

    let f = canvas.dataset.ref;
    let panel = configScroll[5].querySelector(`[data-ref="${f}"]`);
    let pin = f2PinBody(f);

    //[!]THERE'S A DIFFERENCE HOW THIS WORKS
    //COMPARED TO PANEL2FOCUS
    //SINCE CANVAS IS NOT CLICKABLE AND CAN'T FOCUS
    //IF LINKED PANEL IS HIDDEN STATUS
    if(panel.dataset.type != "pattern") {

        if(panel.querySelector('.btnShowHide').dataset.show == "visible") {

            focusPanel[f] = panel;
            focusPanel[f].style.background = "var(--accent)";
            
            leadPanel = focusPanel[f];

            //NO NEED FOR LEADDRAG = PIN
            //IT'S THERE IN CHOOSELEADDRAG(PIN) FUNCTION ALREADY
            focusObj[f] = canvas;

            if(pin != null) {   
                
                chooseLeadDrag(pin);
                moveableUpdateTargets();

            }

            swapPanels(canvas.dataset.type);
        }
    }
}

function canvasFocusAll() {

    resetAllFocus();

    let configScroll = document.getElementsByClassName('configScroll');
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

    for(let a = 0; a < configScroll[5].childElementCount; a++) {
        
        let panel = configScroll[5].children[a];

        if(panel.type != "pattern") {

            if(panel.querySelector('.btnLockUnlock').dataset.lock == "unlock") {
                let f = panel.dataset.ref;
                let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

                canvas2Focus(canvas);
            }
        
        }
    }
}

function canvasUnfocus(f) {

    focusObj[f] = null;

    let pin = f2PinBody(f);

    moveableUpdateTargets();

    if(focusPanel[f] != null) {
        panelUnfocus(focusPanel[f])
    }

}

function canvasUnfocusAll() {

    for(let a = 0; a < focusObj.length; a++) {

        if(focusObj[a] != null) {
            let f = focusObj[a].dataset.ref;
            focusObj[a] = null;

            let pin = f2PinBody(f);
            if(pin != null && focusPanel[a].querySelector('.btnShowHide')?.dataset.show == "hidden") pin.style.visibility = "hidden";

            focusPanel[a].style.background = "transparent"
            focusPanel[a] = null;
        }
    }

    moveableUpdateTargets();
}

function checkObjFocusCount() {
    let b = 0;

    for(let a = 0; a < focusObj.length; a++) {
        if(focusObj[a] != null) {
            b++;
        }
    }
    return b;
}

function checkPanelFocusCount() {
    let b = 0;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            b++;
        }
    }
    return b;
}

function checkPanelFocusBool(panel) {
    
    let bool = false;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            if(focusPanel[a] == panel) {
                bool = true;
                break;
            }
        }
    }
    return bool;
}

function checkPanelPosition(panel) {
    
    let post = 0;
    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');

    for(let a = 0; a < pnlBoxLayer.length; a++) {
        
        if(pnlBoxLayer[a] == panel) {
            post = a;
            break;
        }
    }

    return post;
}

function checkCanvasFocusBool(canvas) {
    
    let bool = false;

    for(let a = 0; a < focusObj.length; a++) {
        if(focusObj[a] != null) {
            if(focusObj[a] == canvas) {
                bool = true;
                break;
            }
        }
    }
    return bool;
}

//////////////////////FUNCTIONS ABOUT DATA////////////////
function removeData(data, f) {
    for(let a = 0; a < data.length; a++) {
        if(data[a] != null) {
            if(data[a].includes(`ref: ${f}`)) {
                data[a] = null;
            }
        }
    }
}

//===============PREVENT DROP ON DOCUMENTS==============
function stopDragDrop(e) {
    e.preventDefault();
    e.stopPropagation();
}
document.addEventListener('drop', stopDragDrop);
document.addEventListener('dragover', stopDragDrop);
document.addEventListener('dragenter', stopDragDrop);


//////////////////CONVERT DEGREE TO RADIAN//////////////

function degToRad(degree) {
    let radian = degree * (Math.PI / 180);

    return radian;
}

/////////////////THUMB HOVER TOOLTIP/////////////////
let tmrTooltip = null;

function tooltip(e, thumbPreviewMini, show) {

    let delay = 1000;
    let tooltip = document.querySelector('#tooltip');
    let type = thumbPreviewMini.dataset.type;
    let x = e.clientX;
    let y = e.clientY;

    //A ONE-SHOT. IT WAS setInterval, SO THE TEXT WAS WRITTEN AGAIN EVERY SECOND OF THE HOVER
    clearTimeout(tmrTooltip);
    tmrTooltip = null;
    tooltip.style.opacity = "0";
    tooltip.dataset.show = "false";
    tooltip.style.left = x + 8 + 'px';
    tooltip.style.top = y + 8 + 'px';

    if(!show) {
        tooltip.style.display = "none";
        return;
    }

    //[label, value, lowercase] PER LINE. A TEMPLATE TILE SHOWS ITS id, WHATEVER type ITS ROW CARRIES.
    //sir, 2026-10-14: NO LABEL ON A TEMPLATE - THE USER KNOWS IT IS A TEMPLATE, THE TITLE IS ENOUGH
    let lines = null;

    if(thumbPreviewMini.closest('#menuDesigns')) {
        lines = [[null, thumbPreviewMini.dataset.id, false]];
    }
    else if(type == "image") {
        lines = [["By", thumbPreviewMini.dataset.photog, false], ["From", thumbPreviewMini.dataset.photogurl, true]];
    }
    else if(type == "3D mockup") {
        lines = [["By", thumbPreviewMini.dataset.artist, false], ["From", thumbPreviewMini.dataset.artisturl, true], ["Aspect Ratio", thumbPreviewMini.dataset.aspectratio, true]];
    }

    if(lines == null) return;

    tmrTooltip = setTimeout(() => {

        //textContent: NAMES AND URLS COME FROM PEXELS AND THE DATABASE, NOT FROM US
        tooltip.innerHTML = "";

        lines.forEach(([label, value, lower]) => {
            let h2 = document.createElement('h2');
            let strong = document.createElement('strong');
            h2.textContent = label != null ? label + ": " : "";
            strong.textContent = value ?? "";
            if(lower) strong.style.textTransform = "lowercase";
            h2.appendChild(strong);
            tooltip.appendChild(h2);
        });

        tooltip.style.display = "flex";

        //sir, 2026-10-13: WRAPS AT 300px, SO IT CAN GROW TALL. FLIP TO THE OTHER SIDE OF THE
        //CURSOR WHEN IT WOULD LEAVE THE WINDOW. MEASURED AT left 0: NEAR THE RIGHT EDGE A
        //SHRINK-TO-FIT BOX WRAPS NARROWER AND WOULD ALWAYS LOOK LIKE IT FITS. ONLY OPACITY
        //ANIMATES, SO THE FLIP DOES NOT SLIDE ACROSS THE CURSOR
        tooltip.style.transition = "opacity .2s";
        tooltip.style.left = 0 + 'px';
        let w = tooltip.offsetWidth;
        let h = tooltip.offsetHeight;
        tooltip.style.left = (x + 8 + w > window.innerWidth ? Math.max(0, x - 8 - w) : x + 8) + 'px';
        tooltip.style.top = (y + 8 + h > window.innerHeight ? Math.max(0, y - 8 - h) : y + 8) + 'px';

        tooltip.style.opacity = "1";
        tooltip.dataset.show = "true";
    }, delay)
}


//////////////////////////DISABLE AND ENABLE A CONTAINER//////////////////////////
//MAKES EVERY CONTROL INSIDE LOOK PASSIVE AND DROPS THE COVER OVER IT.
//NOTHING HERE CHANGES A VALUE OR A HANDLER, IT IS APPEARANCE ONLY, SO UNDO AND
//REDO STILL RESTORE THROUGH THESE CONTROLS WHILE THEY ARE COVERED
function disableContainer(container) {

    container.querySelectorAll('h2').forEach(label => {
        label.style.color = "var(--muted-track)";
    })

    container.querySelectorAll('input').forEach(input => {

        if(input.type == "range") {
            input.style.background = "var(--muted-track)";
            input.style.setProperty('--thumb', 'var(--muted-track)');
        }
        else {
            input.style.color = "var(--muted-track)";
        }
    })

    container.querySelectorAll('[class*=chk]').forEach(chk => {

        //chkSwitch IS THE THUMB INSIDE, NOT A CHECKBOX
        if(chk.className == "chkSwitch") return;

        chk.style.borderColor = "var(--muted-track)";
        chk.style.backgroundColor = "transparent";
        chk.children[0].style.backgroundColor = "var(--muted-track)";
    })

    let cover = container.querySelector('.divCoverDisabler');

    if(cover != null) cover.style.visibility = "visible";
}

function enableContainer(container) {

    //CLEARING THE INLINE VALUE HANDS THE COLOR BACK TO THE STYLESHEET, SO NOTHING
    //HAS TO BE STORED AND CALLING THIS TWICE IS HARMLESS
    container.querySelectorAll('h2').forEach(label => {
        label.style.color = "";
    })

    //changeTextColor OWNS THE RESTING COLOR INLINE, SO CLEARING FALLS BACK TO THE
    //STYLESHEET SHARP INSTEAD OF THE MUTED BLUE EVERY INPUT ACTUALLY SITS AT
    container.querySelectorAll('input').forEach(input => {

        if(input.type == "range") {
            input.style.background = "";
            input.style.removeProperty('--thumb');
        }
        else if(input.className.includes('Color') || input.className.includes('Search')) {
            input.style.color = "var(--sharp)";
        }
        else {
            input.style.color = "var(--muted-blue-text)";
        }
    })

    container.querySelectorAll('[class*=chk]').forEach(chk => {

        if(chk.className == "chkSwitch") return;

        chkBoxFormat(chk);
    })

    let cover = container.querySelector('.divCoverDisabler');

    if(cover != null) cover.style.visibility = "hidden";
}

//===============SWAP MODE - SHARED BY FONT SWAP AND IMAGE SWAP==================
//sir, 2026-09-24: "the boolean variable name used for the font swapping, maybe we can make it
//generic name... since they can't work simultaneously so they can share a generic boolean".
//
//IT HOLDS THE KIND RATHER THAN true/false, AND EVERY ON/OFF TEST IS STILL JUST if(swapMode).
//A PLAIN BOOLEAN COULD NOT ANSWER THE ONE QUESTION delegation ASKS FOUR TIMES - WHICH MENU AND
//WHICH PIN TYPE THIS MODE IS ALLOWED TO LIVE IN - SO FONT MODE WOULD HAVE SURVIVED A CLICK IN
//menuUpload AND IMAGE MODE A CLICK IN menuText.
function swapMenu() {

    return swapMode == "image" ? '#menuUploads' : '#menuText';
}

function swapPinType() {

    return swapMode == "image" ? "image" : "text";
}

//ONE CANCEL FOR BOTH. THE HANDLERS THEMSELVES EARLY-RETURN WHEN THEIR OWN BUTTON IS NOT LIVE,
//SO CALLING THE WRONG ONE IS FREE - resetAllFocus CALLS THIS CONSTANTLY
function cancelSwap() {

    if(typeof cancelSwapFont === 'function') cancelSwapFont();
    if(typeof cancelSwapImage === 'function') cancelSwapImage();
}

//===============ONE CAPTION FITTER FOR BOTH SWAP BUTTONS==================
//THE FONT NAME ON pnlBoxText AND THE FILE NAME ON pnlBoxImage.
//sir, 2026-09-24: "2em on left and 2 em on right safe distance so button width - 4em"
//
//THE CUT IS MEASURED, NOT COUNTED. A FIXED CHARACTER LIMIT OVER-CUTS "IIII" AND UNDER-CUTS
//"MMMM" - the 16 CHARACTER VERSION IN tab3D.js IS THE ONE THAT SHOWS IT.
//
//THE ELLIPSIS IS PART OF THE STRING, NOT A CSS text-overflow. sir ASKED FOR THE CONCAT SO
//THE THREE DOTS ARE REAL CHARACTERS. THE FULL TEXT IS KEPT ON dataset.full, WHICH IS WHAT
//A RE-FIT READS - RE-FITTING FROM THE VISIBLE LABEL WOULD EAT THE NAME ONE PASS AT A TIME.
function fitSwapLabel(btn, text) {

    if(btn == null) return;

    let label = btn.querySelector('h2');

    if(label == null) return;

    if(text == null) text = btn.dataset.full || "";

    text = String(text);
    btn.dataset.full = text;
    label.innerText = text;

    //4em OF THE LABEL'S OWN FONT SIZE, PER sir'S RULE. clientWidth EXCLUDES THE BORDER ALREADY
    let room = btn.clientWidth - parseFloat(getComputedStyle(label).fontSize) * 4;

    //A PANEL THAT IS STILL display:none MEASURES 0. LEAVE THE WHOLE STRING RATHER THAN CUTTING
    //EVERY CAPTION DOWN TO "..." - THE NEXT CALL, MADE WHILE THE PANEL IS VISIBLE, FITS IT
    if(room <= 0) return;
    if(label.scrollWidth <= room) return;

    //BINARY SEARCH ON THE CUT: ~8 MEASUREMENTS FOR A LONG NAME INSTEAD OF ONE PER CHARACTER
    let low = 0;
    let high = text.length;

    while(low < high) {

        let mid = Math.ceil((low + high) / 2);

        label.innerText = text.slice(0, mid) + '...';

        if(label.scrollWidth <= room) low = mid;
        else high = mid - 1;
    }

    label.innerText = text.slice(0, low) + '...';
}