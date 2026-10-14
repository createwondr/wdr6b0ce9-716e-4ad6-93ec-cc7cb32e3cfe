
function createPnlBoxElement(n, source, post, subtype) {

    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;
    let name = autoIncrementHeader("Element");
    let configScroll = document.getElementsByClassName('configScroll');

    let newElement = 
    `<div class="pnlBoxLayer" data-thumbno="${n}" data-type="element" data-subtype="${subtype}" data-ref="${f}">
        <div class="pnlTitleLayer" style="height: 40px;">
            <div class="iconLayer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.10254 0.00488281C5.60667 0.0562145 6 0.482323 6 1V11C6 11.5177 5.60667 11.9438 5.10254 11.9951L5 12H1C0.482323 12 0.0562145 11.6067 0.00488281 11.1025L0 11V1C0 0.447715 0.447715 1.61064e-08 1 0H5L5.10254 0.00488281ZM1 11H5V1H1V11Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11 6C11.5523 6 12 6.44772 12 7V11L11.9951 11.1025C11.9472 11.573 11.573 11.9472 11.1025 11.9951L11 12H8L7.89746 11.9951C7.42703 11.9472 7.05278 11.573 7.00488 11.1025L7 11V7C7 6.44772 7.44772 6 8 6H11ZM8 11H11V7H8V11Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11 0C11.5523 0 12 0.447715 12 1V4C12 4.51768 11.6067 4.94379 11.1025 4.99512L11 5H8L7.89746 4.99512C7.42703 4.94722 7.05278 4.57297 7.00488 4.10254L7 4V1C7 0.447715 7.44772 8.05319e-09 8 0H11ZM8 4H11V1H8V4Z" fill="white"/>
                </svg>
            </div>

            <input type="text" class="txtHeader" value="${name}" data-readonly="true">
            <div class="btnLockUnlock" data-lock ="unlock">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 7C11.5523 7 12 7.44772 12 8V11C12 11.5523 11.5523 12 11 12H1C0.447715 12 8.05325e-09 11.5523 0 11V8C0 7.44772 0.447715 7 1 7H9V5C9 3.34315 7.65685 2 6 2C4.34315 2 3 3.34315 3 5H1C1 2.23858 3.23858 0 6 0C8.76142 0 11 2.23858 11 5V7Z" fill="white"/>
                </svg>
            </div>
            <div class="btnShowHide" data-show = "visible">
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.00014 2.71429C5.57998 2.71429 4.42871 3.86555 4.42871 5.28572C4.42871 6.70588 5.57998 7.85714 7.00014 7.85714C8.4203 7.85714 9.57157 6.70588 9.57157 5.28572C9.57157 3.86555 8.4203 2.71429 7.00014 2.71429Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9119 4.87535C12.4818 1.69741 9.79075 1.19209e-07 7 0C4.20925 -1.78814e-07 1.51815 1.69741 0.0880784 4.87535C-0.0293595 5.13632 -0.0293595 5.43511 0.0880784 5.69608C1.51815 8.87402 4.20925 10.5714 7 10.5714C9.79075 10.5714 12.4818 8.87401 13.9119 5.69608C14.0294 5.4351 14.0294 5.13632 13.9119 4.87535ZM7 8.57143C5.18342 8.57143 3.27797 7.53709 2.11033 5.28572C3.27797 3.03434 5.18342 2 7 2C8.81657 2 10.722 3.03434 11.8897 5.28571C10.722 7.53708 8.81657 8.57143 7 8.57143Z" fill="white"/>
                </svg>
            </div>
        </div>
    </div>`;

    configScroll[5].insertAdjacentHTML('afterbegin', newElement); //add the child on top of the previous one
    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);
    
    addPnlBoxElement(f, n, name, source, post, subtype);
}

function addPnlBoxElement(f, n, name, source, post, subtype) {

    dataLayer[f] = '\n*';
    dataLayer[f] += `\nref: ${f}`;
    dataLayer[f] += `\npnlBoxElement: ${name}`;
    dataLayer[f] += `\nthumbno: ${n}`;
    dataLayer[f] += `\nshow: visible`;
    dataLayer[f] += `\nlock: unlock`;
    dataLayer[f] += `\nmask: unmask`;
    
    dataLayer[f] += `\ntxtWidthLayer: 0`;
    dataLayer[f] += `\ntxtHeightLayer: 0`;
    dataLayer[f] += `\ntxtXLayer: 0`;
    dataLayer[f] += `\ntxtYLayer: 0`;
    dataLayer[f] += `\nchkFlipX: false`;
    dataLayer[f] += `\nchkFlipY: false`;
    dataLayer[f] += `\ntxtOpacityLayer: 100`;
    dataLayer[f] += `\ntxtRotationLayer: 0`;

    dataLayer[f] += `\ntxtElementStrokeColor: rgba(100, 116, 153, 1)`;
    dataLayer[f] += `\ntxtElementStrokeWidth: 20`;
    dataLayer[f] += `\ntxtElementCornerRadius: 0`;
    dataLayer[f] += `\ntxtElementStrokeDash: 0`;
    dataLayer[f] += `\ntxtElementStrokeGap: 0`;
    dataLayer[f] += `\nchkElementStrokeCap: false`;

    dataLayer[f] += `\ntxtElementFillColor: rgba(169, 174, 255, 1)`;

    dataLayer[f] += `\ntxtGlowColor: rgba(148, 158, 255, 1)`;
    dataLayer[f] += `\ntxtGlowSpread: 100`;

    dataLayer[f] += `\ntxtShadowColor: rgba(0, 0, 0, 1)`;
    dataLayer[f] += `\ntxtShadowSize: 20`;
    dataLayer[f] += `\ntxtShadowSpread: 0`;
    dataLayer[f] += `\ntxtShadowRotation: 0`;

    dataLayer[f] += `\ndropdown 0: Normal`;
    dataLayer[f] += `\ndropdown 1: Stroke`;
    dataLayer[f] += `\ndropdown 2: Remove`;

    //after all assigned controls then create the actual pattern layer
    createCanvasElement(f, n, name, 'element', source, post, subtype);
}

function createCanvasElement(f, n, name, type, source, post, subtype) {     

    cnvLayers[f] = document.createElement('div');
    cnvLayers[f].classList.add('cnvLayers');
    cnvLayers[f].dataset.rotation = 0;
    cnvLayers[f].dataset.ref = f;
    cnvLayers[f].dataset.thumbno = n;
    cnvLayers[f].dataset.source = encodeURIComponent(source);
    cnvLayers[f].dataset.type = type;
    cnvLayers[f].dataset.subtype = subtype;
    cnvLayers[f].dataset.lock = "unlock";
    cnvLayers[f].dataset.mask = "unmask";
    //1x1 IS THE DESIGN FLOOR. THE 20px ON SCREEN IS THE PIN'S - SEE PIN_MIN_PX IN tabLayers.js
    cnvLayers[f].style.minWidth = 1 + 'px';
    cnvLayers[f].style.minHeight = 1 + 'px';
    cnvLayers[f].style.overflow = "visible";
    cnvLayers[f].style.visibility = "visible";

    
    // append cnvlayer to cnvmain
    cnvGrpLayers.appendChild(cnvLayers[f]);

    createSVG(f,source, post);

    //add border
    addBorderLayer(cnvLayers[f], f);

    createHistory(f, name, type, n);
    
    canvas2Focus(cnvLayers[f]);
}

function chooseElementTab() {

    let opt = this.innerText;
    let contPath = this.closest('.contPath');

    contPath.querySelector('.dropdown').children[0].innerText = opt;
    if(opt == 'Stroke') {
  
        contPath.children[1].style.display = "block";
        contPath.children[2].style.display = "none";
    }
    else if(opt == 'Fill') {

        contPath.children[1].style.display = "none";
        contPath.children[2].style.display = "block";
    }
}
document.querySelectorAll('.optElementColor')
.forEach((opt) => {
    opt.addEventListener('pointerdown', chooseElementTab)
})

function adjustElementStrokeColor() {

    let gradientString = this.dataset.gradient;
    let thumbPicker = this.nextElementSibling;
    
    if(testHexCode(this) == "Linear" || testHexCode(this) == "Radial") {
        //change thumbpick color
        thumbPicker.children[1].style.background = this.dataset.gradient;

        for(let a = 0; a < focusPanel.length; a++) {
            if(focusPanel[a] != null) {
                let f = Number(focusPanel[a].dataset.ref);
                let type = focusPanel[a].dataset.type;
                let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                
                if(type == "element") {
                 
                    let defs = gradientString2Defs(f, "element", testHexCode(this), "Stroke", gradientString);
                    let defsID = `element_${testHexCode(this).toLowerCase()}_stroke_${f}`;
                    
                    if(canvas.querySelector(`defs`) == null) {
                        canvas.querySelector(`svg`).innerHTML += `<defs>${defs}</defs>`;
                    } 
                    else {
                        canvas.querySelector(`defs #${defsID}`)?.remove();
                        canvas.querySelector('defs').innerHTML += defs;
                    }
                    
                    canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke', `url(#${defsID})`);
                }   
            }
        }
    }
    else {
 
        this.dataset.gradient = "";
        let alpha = this.dataset.alpha;
        let rgb = hex2RGBStringEncoding(testHexCode(this));

        thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
        
        for(let a = 0; a < focusPanel.length; a++) {
            if(focusPanel[a] != null) {
                let f = Number(focusPanel[a].dataset.ref);
                let type = focusPanel[a].dataset.type;
                let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                
                if(type == "element") {
                    canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke', `rgba(${rgb}, ${alpha})`);  
                }
            }
        }
    }
}
document.getElementById('pnlBoxElement').querySelector('.txtElementStrokeColor').addEventListener('change', adjustElementStrokeColor);

function adjustElementStrokeWidth() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "element") {

                canvas.querySelector('svg').children[1].firstElementChild.setAttribute('stroke-width', this.value);

                //THE STROKE SHOWS OUTSIDE THE SHAPE ONLY, SO THE SVG NEEDS ROOM FOR IT - THE SAME ROOM renderSVG GIVES
                if(canvas.dataset.subtype == "shape") {

                    let svg = canvas.querySelector('svg');
                    let room = Number(this.value) || 0;
                    let skew = svg.children[1].firstElementChild.tagName == 'rect' ? (Number(svg.dataset.skew) || 0) * 6 : 0;

                    svg.querySelector('mask').setAttribute('x', -room);
                    svg.querySelector('mask').setAttribute('y', -room);
                    svg.querySelector('mask').firstElementChild.setAttribute('x', -room);
                    svg.querySelector('mask').firstElementChild.setAttribute('y', -room);

                    svg.children[1].setAttribute('transform', `translate(${room - (skew/2)}, ${room})`);
                    svg.children[2].setAttribute('transform', `translate(${room - (skew/2)}, ${room})`);

                    svg.setAttribute('width', canvas.clientWidth + room*2);
                    svg.setAttribute('height', canvas.clientHeight + room*2);
                    svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth + room*2} ${canvas.clientHeight + room*2}`);

                    svg.style.left = 0 - room + 'px';
                    svg.style.top = 0 - room + 'px';

                    //A RECT NEVER GIVEN A CORNER RADIUS STILL CARRIES THE SOURCE'S rx 0.01, WHICH ROUNDS A THICK STROKE
                    svg.querySelectorAll('rect[rx="0.01"]').forEach((rect) => {
                        rect.setAttribute('rx', 0);
                        rect.setAttribute('ry', 0);
                    });
                }
            }
        }
    }
}
document.getElementById('pnlBoxElement').querySelector('.txtElementStrokeWidth').addEventListener('change', adjustElementStrokeWidth);

function adjustElementCornerRadius() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)
            let subtype = canvas.dataset.subtype;

            if(type == "element" && subtype == "shape") {
                curveSVG(f);

                //A MASKED IMAGE'S CLIP IS A COPY OF THE OUTLINE, REBUILD IT ON THE NEW CORNERS
                canvas.querySelector(`#image_mask_${f}`)?.closest('[clip-path]')?.remove();
                maskImageBelow(f2Panel(f));
            }
        }
    }

}
document.getElementById('pnlBoxElement').querySelector('.txtElementCornerRadius').addEventListener('change', adjustElementCornerRadius);

function adjustElementStrokeDash() {

    let panel = document.getElementById('pnlBoxElement');

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "element") {
                canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke-dasharray', `${panel.querySelector('.txtElementStrokeDash').value} ${panel.querySelector('.txtElementStrokeGap').value}`);
            }
        }
    }
    adjustBorder();
}
document.getElementById('pnlBoxElement').querySelector('.txtElementStrokeDash').addEventListener('change', adjustElementStrokeDash);
document.getElementById('pnlBoxElement').querySelector('.txtElementStrokeGap').addEventListener('change', adjustElementStrokeDash);

function adjustElementStrokeCap() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "element") {
                if(this.dataset.value == "true") {

                    canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke-linecap', "round");
                }
            
                else if(this.dataset.value == "false") { 
            
                    canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke-linecap', "butt");
                    
                }
            }
        }
    }

}
document.getElementById('pnlBoxElement').querySelector('.chkElementStrokeCap').addEventListener('click', adjustElementStrokeCap);

function adjustElementFillColor() {

    let gradientString = this.dataset.gradient;
    let thumbPicker = this.nextElementSibling;
    
    if(testHexCode(this) == "Linear" || testHexCode(this) == "Radial") {
        //change thumbpick color
        thumbPicker.children[1].style.background = this.dataset.gradient;

        for(let a = 0; a < focusPanel.length; a++) {
            if(focusPanel[a] != null) {

                let f = Number(focusPanel[a].dataset.ref);
                let type = focusPanel[a].dataset.type;
                let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                
                if(type == "element") {

                    let defs = gradientString2Defs(f, "element", testHexCode(this), "Fill", gradientString);
                    let defsID = `element_${testHexCode(this).toLowerCase()}_fill_${f}`;

                    if(canvas.querySelector(`defs`) == null) {
                        canvas.querySelector(`svg`).innerHTML += `<defs>${defs}</defs>`;
                    }
                    else {
                        canvas.querySelector(`defs #${defsID}`)?.remove();
                        canvas.querySelector('defs').innerHTML += defs;
                    }

                    //[!] THE DEFS ABOVE GO IN EITHER WAY - MASKED OR NOT - OR UNMASKING
                    //WOULD POINT AT A GRADIENT THAT WAS NEVER BUILT. ONLY THE LIVE FILL
                    //IS HELD BACK WHILE MASKED, BECAUSE THE CLIPPED IMAGE COVERS IT.
                    //THE VALUE ITSELF IS ALREADY IN dataLayer VIA ENCODECOLORMULTI
                    if(canvas.dataset.mask == "unmask") {
                        canvas.querySelectorAll('g')[2].children[0].setAttribute('fill', `url(#${defsID})`);
                    }
                }
            }
        }
    }
    else {
 
        this.dataset.gradient = "";
        let alpha = this.dataset.alpha;
        let rgb = hex2RGBStringEncoding(testHexCode(this));

        thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
        
        for(let a = 0; a < focusPanel.length; a++) {
            if(focusPanel[a] != null) {
                let f = Number(focusPanel[a].dataset.ref);
                let type = focusPanel[a].dataset.type;
                let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                
                //MAKE SURE LAYER IS ELEMENT AND NOT MASKED
                if(type == "element" && canvas.dataset.mask == "unmask") {
                    canvas.querySelectorAll('g')[2].children[0].setAttribute('fill', `rgba(${rgb}, ${alpha})`);
                }
            }
        }
    }

    //A NEW FILL CAN TURN THE BLEED ON OR OFF, A TRANSPARENT STOP OR ALPHA TURNS IT OFF
    bleedFillLayers();
}
document.getElementById('pnlBoxElement').querySelector('.txtElementFillColor').addEventListener('change', adjustElementFillColor);

function showBasicBoxElement(){
    this.closest('#pnlBoxElement').children[0].children[0].innerText = "Basic Properties";
    this.closest('#pnlBoxElement').querySelector('.tabSliderBox2').style.translate = "0%"; //slide tab
    this.closest('#pnlBoxElement').querySelector('.pnlBottomBoxThumb2').style.translate = "0%"; //slide scroll thumb
}
document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').addEventListener('pointerover', btnBottomHover);
//document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').addEventListener('mouseleave', btnBottomLeave);
//document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').addEventListener('click', showBasicBoxElement);
//document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').children[0].style.filter = "saturate(0) brightness(2)";
//document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').children[0].style.transition = ".2s";

function showColorBoxElement() {
    this.closest('#pnlBoxElement').children[0].children[0].innerText = "Element Style";
    this.closest('#pnlBoxElement').querySelector('.tabSliderBox2').style.translate = "-100%"; //slide tab to left
    this.closest('#pnlBoxElement').querySelector('.pnlBottomBoxThumb2').style.translate = "100%"; //slide thumb to right
}

//assign dropOptionVerti selection for blend mode
for(let b = 0; b < document.getElementById('pnlBoxElement').querySelectorAll('.optLayerStyleElement').length; b++) {
    
    if(b == 3) {
        document.getElementById('pnlBoxElement').querySelectorAll('.optLayerStyleElement')[b].style.color = "salmon";
        document.getElementById('pnlBoxElement').querySelectorAll('.optLayerStyleElement')[b].addEventListener('pointerover', hoverLayerStyle)
        document.getElementById('pnlBoxElement').querySelectorAll('.optLayerStyleElement')[b].addEventListener('pointerout', outLayerStyle)
    }
}

function showBasicBoxElement(){
    this.closest(`[id*='pnlBox']`).children[0].children[0].innerText = "Basic Properties";
    this.closest(`[id*='pnlBox']`).querySelector('.tabSliderBox3').style.translate = "0%"; //slide tab
    this.closest(`[id*='pnlBox']`).querySelector('.pnlBottomBoxThumb3').style.translate = "0%"; //slide scroll thumb
}
document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').addEventListener('click', showBasicBoxElement);
document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').children[0].style.filter = "saturate(0) brightness(2)";
document.querySelector('#pnlBoxElement').querySelector('.btnBasicBox').children[0].style.transition = ".2s";

function showColorBoxElement() {
    if(this.closest(`[id*='pnlBox']`).id == "pnlBoxLine") {
        this.closest(`[id*='pnlBox']`).children[0].children[0].innerText = "Line Properties";
    }
    else {
        this.closest(`[id*='pnlBox']`).children[0].children[0].innerText = "Element Color";
    }
    
    this.closest(`[id*='pnlBox']`).querySelector('.tabSliderBox3').style.translate = "-100%"; //slide tab to left
    this.closest(`[id*='pnlBox']`).querySelector('.pnlBottomBoxThumb3').style.translate = "100%"; //slide thumb to right
}
document.querySelector('#pnlBoxElement').querySelector('.btnColorBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxElement').querySelector('.btnColorBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxElement').querySelector('.btnColorBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxElement').querySelector('.btnColorBox').addEventListener('click', showColorBoxElement);
document.querySelector('#pnlBoxElement').querySelector('.btnColorBox').children[0].style.transition = ".2s";


function showStyleBoxElement() {
    if(this.closest(`[id*='pnlBox']`).id == "pnlBoxLine") {
        this.closest(`[id*='pnlBox']`).children[0].children[0].innerText = "Line Style";
    }
    else {
        this.closest(`[id*='pnlBox']`).children[0].children[0].innerText = "Element Style";
    }
    this.closest(`[id*='pnlBox']`).querySelector('.tabSliderBox3').style.translate = "-200%"; //slide tab to left
    this.closest(`[id*='pnlBox']`).querySelector('.pnlBottomBoxThumb3').style.translate = "202%"; //slide thumb to right
}
document.querySelector('#pnlBoxElement').querySelector('.btnStyleBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxElement').querySelector('.btnStyleBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxElement').querySelector('.btnStyleBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxElement').querySelector('.btnStyleBox').addEventListener('click', showStyleBoxElement);
document.querySelector('#pnlBoxElement').querySelector('.btnStyleBox').children[0].style.transition = ".2s";

//===================================GLOW==================================

document.getElementById('pnlBoxElement').querySelector('.txtGlowColor').addEventListener('change', adjustStyleGlowColor);
document.getElementById('pnlBoxElement').querySelector('.txtGlowSpread').addEventListener('change', adjustStyleGlowColor);
document.getElementById('pnlBoxElement').querySelector('.txtGlowSpread').previousElementSibling.addEventListener('input', adjustStyleGlowColor);

//===================================SHADOW==================================

document.getElementById('pnlBoxElement').querySelector('.txtShadowColor').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxElement').querySelector('.txtShadowSize').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxElement').querySelector('.txtShadowSize').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

document.getElementById('pnlBoxElement').querySelector('.txtShadowSpread').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxElement').querySelector('.txtShadowSpread').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

document.getElementById('pnlBoxElement').querySelector('.txtShadowRotation').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxElement').querySelector('.txtShadowRotation').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

//===================================LAYER STYLE==============================

//assign dropOptionVerti selection for blend mode
for(let b = 0; b < document.getElementById('pnlBoxElement').querySelectorAll('.optLayerStyleElement').length; b++) {
    
    if(b == 2) {
        document.getElementById('pnlBoxElement').querySelectorAll('.optLayerStyleElement')[b].style.color = "salmon";
        document.getElementById('pnlBoxElement').querySelectorAll('.optLayerStyleElement')[b].addEventListener('mouseover', hoverLayerStyle)
        document.getElementById('pnlBoxElement').querySelectorAll('.optLayerStyleElement')[b].addEventListener('mouseout', outLayerStyle)
    }
}