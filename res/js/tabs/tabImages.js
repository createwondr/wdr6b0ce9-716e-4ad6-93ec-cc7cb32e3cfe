let dataLayer = [];


//==============================IMAGE BLUR========================
function adjustBlur() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {
                if(canvas.style.filter.includes('blur')) {
                    canvas.style.filter = canvas.style.filter.replace(/blur\([^\)]+\)/, `blur(${this.value}px)`)
                }
                else {
                    canvas.style.filter += `blur(${this.value}px)\n`;
                }
            }

            maskImageBelow(f2Panel(f))
        }
    }

}
document.getElementById('pnlBoxImage').querySelector('.txtBlur').addEventListener('change', adjustBlur);
document.getElementById('pnlBoxImage').querySelector('.txtBlur').previousElementSibling.addEventListener('input', adjustBlur);


function adjustBrightness() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {
                
                if(canvas.style.filter.includes('brightness')) {
                    canvas.style.filter = canvas.style.filter.replace(/brightness\([^\)]+\)/, `brightness(${this.value}%)`)
                }
                else {
                    canvas.style.filter += `brightness(${this.value}%)\n`;
                }
            }

            maskImageBelow(f2Panel(f))
        }
    }

}
document.getElementById('pnlBoxImage').querySelector('.txtBrightness').addEventListener('change', adjustBrightness);
document.getElementById('pnlBoxImage').querySelector('.txtBrightness').previousElementSibling.addEventListener('input', adjustBrightness);

function adjustContrast() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {

                if(canvas.style.filter.includes('contrast')) {
                    canvas.style.filter = canvas.style.filter.replace(/contrast\([^\)]+\)/, `contrast(${this.value}%)`)
                }
                else {
                    canvas.style.filter += `contrast(${this.value}%)\n`;
                }
            }

            maskImageBelow(f2Panel(f))
        }
    }
    
}
document.getElementById('pnlBoxImage').querySelector('.txtContrast').addEventListener('change', adjustContrast);
document.getElementById('pnlBoxImage').querySelector('.txtContrast').previousElementSibling.addEventListener('input', adjustContrast);

function adjustSaturation() {
    
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {

                if(canvas.style.filter.includes('saturate')) {
                    canvas.style.filter = canvas.style.filter.replace(/saturate\([^\)]+\)/, `saturate(${this.value}%)\n`)
                }
                else {
                    canvas.style.filter += `saturate(${this.value}%)\n`;
                }
            }

            maskImageBelow(f2Panel(f))
        }
    }
}
document.getElementById('pnlBoxImage').querySelector('.txtSaturation').addEventListener('change', adjustSaturation);
document.getElementById('pnlBoxImage').querySelector('.txtSaturation').previousElementSibling.addEventListener('input', adjustSaturation);

//====================================OUTLINE==============================

document.getElementById('pnlBoxImage').querySelector('.txtOutlineColor').addEventListener('change', adjustStyleOutlineColor);

document.getElementById('pnlBoxImage').querySelector('.txtOutlineSize').addEventListener('change', adjustStyleOutlineSize);
document.getElementById('pnlBoxImage').querySelector('.txtOutlineSize').previousElementSibling.addEventListener('input', adjustStyleOutlineSize);

//===================================GLOW==================================

document.getElementById('pnlBoxImage').querySelector('.txtGlowColor').addEventListener('change', adjustStyleGlowColor);
document.getElementById('pnlBoxImage').querySelector('.txtGlowSpread').addEventListener('change', adjustStyleGlowColor);
document.getElementById('pnlBoxImage').querySelector('.txtGlowSpread').previousElementSibling.addEventListener('input', adjustStyleGlowColor);

//===================================SHADOW==================================

document.getElementById('pnlBoxImage').querySelector('.txtShadowColor').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxImage').querySelector('.txtShadowSize').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxImage').querySelector('.txtShadowSize').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

document.getElementById('pnlBoxImage').querySelector('.txtShadowSpread').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxImage').querySelector('.txtShadowSpread').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

document.getElementById('pnlBoxImage').querySelector('.txtShadowRotation').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxImage').querySelector('.txtShadowRotation').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

//===================================LAYER STYLE==============================

//assign dropOptionVerti selection for blend mode
for(let b = 0; b < document.getElementById('pnlBoxImage').querySelectorAll('.optLayerStyleImage').length; b++) {
    
    if(b == 3) {
        document.getElementById('pnlBoxImage').querySelectorAll('.optLayerStyleImage')[b].style.color = "salmon";
        document.getElementById('pnlBoxImage').querySelectorAll('.optLayerStyleImage')[b].addEventListener('mouseover', hoverLayerStyle)
        document.getElementById('pnlBoxImage').querySelectorAll('.optLayerStyleImage')[b].addEventListener('mouseout', outLayerStyle)
    }
}

function hoverLayerStyle() {
    this.style.backgroundColor = "salmon";
    this.style.color = "var(--sharp)";
}

function outLayerStyle() {
    this.style.backgroundColor = "transparent";
    this.style.color = "salmon";
}



//=============================CREATE CANVAS FOR LAYERS=====================

//===================ADD CONTROLS TO PANEL IMAGE==================

//actual function to create pnlBoxProperties
function addPnlBoxImage(f, name, n, type, source, link) {  //adding controls only for 'IMAGE' panel boxes

    dataLayer[f] = '\n*';
    dataLayer[f] += `\nref: ${f}`;
    dataLayer[f] += `\npnlBoxImage: ${name}`;
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

    dataLayer[f] += `\ntxtBlur: 0`;
    dataLayer[f] += `\ntxtBrightness: 100`;
    dataLayer[f] += `\ntxtContrast: 100`;
    dataLayer[f] += `\ntxtSaturation: 100`;
    
    dataLayer[f] += `\ntxtOutlineColor: rgba(0, 0, 0, 1)`;
    dataLayer[f] += `\ntxtOutlineSize: 10`;

    dataLayer[f] += `\ntxtGlowColor: rgba(148, 158, 255, 1)`;
    dataLayer[f] += `\ntxtGlowSpread: 100`;

    dataLayer[f] += `\ntxtShadowColor: rgba(0, 0, 0, 1)`;
    dataLayer[f] += `\ntxtShadowSize: 20`;
    dataLayer[f] += `\ntxtShadowSpread: 0`;
    dataLayer[f] += `\ntxtShadowRotation: 0`;
    dataLayer[f] += '\nnewImageSource: ';

    //THE SWAP BUTTON'S CAPTION AND THE PEXELS REFERENCE. BOTH LIVE ON THE LAYER, NOT ON THE
    //GALLERY THUMB, SO THEY SURVIVE EXPORT, IMPORT AND THE THUMB BEING DELETED.
    //
    //imageLink IS EMPTY FOR AN UPLOAD - thumbno ALREADY POINTS AT dataThumb[n], WHICH IS
    //WRITTEN ONCE, NEVER NULLED AND SAVED INTO THE FILE. FOR A PEXELS LAYER THERE IS NO
    //dataThumb ROW, SO THE LINK IS THE ONLY REFERENCE AND UNDO RE-FETCHES IT
    //(sir, 2026-09-24: "the tool is online and designed to work online").
    //A "raster graphics" ELEMENT'S n IS ITS ROW INDEX IN THE SUPABASE elements TABLE, NOT A
    //GALLERY NUMBER. LOOKING IT UP IN THE GALLERY COULD MATCH AN UNRELATED UPLOAD WITH THE SAME
    //NUMBER AND STEAL ITS FILENAME, SO A GRAPHIC STARTS WITH NONE AND CAPTIONS WITH THE LAYER NAME.
    //
    //link IS THE GRAPHIC'S REFERENCE, "elements:<row id>", PASSED BY createPnlBoxImageGraphics.
    //WITHOUT IT UNDO HAD NOTHING TO RESOLVE AND SHOWED THE RETRY OVERLAY (sir, 2026-09-24)
    dataLayer[f] += `\nfilename: ${type == "graphics" ? "" : imageNameOfThumb(n)}`;
    dataLayer[f] += `\nimageLink: ${link || ""}`;

    dataLayer[f] += `\ndropdown 0: Normal`;
    dataLayer[f] += `\ndropdown 1: Remove`;

    createCanvasImage(f, name, n, type, source)
    
}

//=============================CREATE CANVAS FOR LAYERS=====================
async function createCanvasImage(f, name, n, type, source) {     

    //PAIRED WITH THE hideLoading() AT THE END OF img.onload, NOT WITH THE END OF THIS FUNCTION -
    //THE FUNCTION RETURNS WHILE THE PICTURE IS STILL DECODING. THE OVERLAY ONLY APPEARS IF THAT
    //WAIT PASSES LOADING_DELAY, SO A PRELOADED GRAPHIC SHOWS NOTHING AT ALL
    showLoading();


    let src;
        let snapdiv = document.getElementById('snapdiv');
        let panel = document.getElementById('pnlBoxCanvas');
        let txtSizeWidth = panel.querySelector('.txtSizeWidth');
        let txtSizeHeight = panel.querySelector('.txtSizeHeight');

        cnvLayers[f] = document.createElement('div');
        cnvLayers[f].style.visibility = "visible";
        cnvLayers[f].classList.add('cnvLayers');
        cnvLayers[f].dataset.rotation = 0;
        cnvLayers[f].dataset.ref = f;
        cnvLayers[f].dataset.thumbno = n;
        cnvLayers[f].dataset.type = "image";
        cnvLayers[f].dataset.lock = "unlock";
        cnvLayers[f].dataset.mask = "unmask";

        //A GRAPHIC ALWAYS BRINGS ITS OWN source, SO IT IS TESTED BEFORE dataThumb. ITS n IS A
        //SUPABASE ROW INDEX, AND WHEN THAT NUMBER MATCHED AN UPLOAD'S GALLERY NUMBER THE LAYER
        //WAS BUILT FROM THE UPLOAD INSTEAD - MEASURED 2026-09-24: A GRAPHIC WITH INDEX 1 PLACED
        //WHILE TWO UPLOADS SAT IN menuUploads RENDERED upload #1
        if(type == "graphics" || dataThumb[n] == null || dataThumb[n] == undefined) {

            if(type == "graphics") {
                
                src = source;
            }
            else {

                let photo = null;

                if(dataPexelsCurated != null && dataPexelsSearched == null) {
                    photo = dataPexelsCurated.photos.find(photo => photo.id == n);
                }
                else {
                    photo = dataPexelsSearched.photos.find(photo => photo.id == n);
                }

                if(photo != null) {

                    //PEXELS HAS NO FILENAME - ITS PHOTO OBJECT IS id/width/height/photographer/
                    //photographer_url/photographer_id/avg_color/liked/alt/url/src. alt IS THE
                    //ONLY HUMAN LABEL, SO IT IS THE CAPTION, AND large2x IS THE REFERENCE THAT
                    //UNDO RE-FETCHES INSTEAD OF CARRYING THE WHOLE BASE64 THROUGH HISTORY
                    dataLayer[f] = valueSwitcher(dataLayer[f], 'filename', photo.alt || "");
                    dataLayer[f] = valueSwitcher(dataLayer[f], 'imageLink', photo.src.large2x);

                    //sir, 2026-09-27: "just use the pexels original jpeg no need to snapdom comment
                    //out the conversion even on image swap". THE PNG RE-ENCODE BELOW MADE ONE PHOTO
                    //4578.7 KB OF A SAVED FILE. THE PHOTO'S OWN BYTES GO IN NOW - SEE fetchImageAsDataURL
                    //let img = new Image();
                    //img.src = photo.src.large2x;

                    //await img.decode()

                    //snapdiv.children[0]?.remove();
                    //snapdiv.appendChild(img);
                    //img = await snapdom.toPng(snapdiv, {fast: true, width: img.naturalWidth, height: img.naturalHeight, quality: 1});
                    //src = img.src;

                    src = await fetchImageAsDataURL(photo.src.large2x);
                    
                }
            }
        }
        else {
            src = valueFinder(dataThumb[n], 'source')
        }

       

        let img = new Image();
        img.src = src;
        img.onload = function() { 
            //when image is loaded, append img to cnvlayer
            cnvLayers[f].appendChild(img); 

            //then append cnvlayer to cnvmain
            cnvGrpLayers.appendChild(cnvLayers[f]);
            
            //get which is smaller if canvas width or canvas height
            let aspectRatio;

            if(Number(txtSizeWidth.value) > Number(txtSizeHeight.value)) {
                aspectRatio = img.naturalWidth / img.naturalHeight;
                cnvLayers[f].style.height = `${Math.round(txtSizeHeight.value * 0.5)}px`;
                cnvLayers[f].style.width =  `${Math.round(cnvLayers[f].clientHeight * aspectRatio)}px`;
                
            }
            else if(Number(txtSizeWidth.value) < Number(txtSizeHeight.value)) {
                aspectRatio = img.naturalHeight / img.naturalWidth;

                cnvLayers[f].style.width = `${Math.round(txtSizeWidth.value * 0.5)}px`;
                cnvLayers[f].style.height = `${Math.round(cnvLayers[f].clientWidth * aspectRatio)}px`;
            }

            else if(Number(txtSizeWidth.value) == Number(txtSizeHeight.value)) {
                
                aspectRatio = img.naturalHeight / img.naturalWidth;

                cnvLayers[f].style.width = `${Math.round(txtSizeWidth.value * 0.5)}px`;
                cnvLayers[f].style.height = `${Math.round(cnvLayers[f].clientWidth * aspectRatio)}px`;
            }

            //set min width and height
            aspectRatio = img.naturalWidth / img.naturalHeight;
            //1x1 IS THE DESIGN FLOOR. THE 20px ON SCREEN IS THE PIN'S - SEE PIN_MIN_PX IN tabLayers.js
            cnvLayers[f].style.minWidth = 1 + 'px';
            cnvLayers[f].style.minHeight = 1 + 'px';

            //position cnvlayer to center
            positionCanvas(cnvLayers[f])

            dataLayer[f] = valueSwitcher(dataLayer[f], 'txtWidthLayer', `${cnvLayers[f].clientWidth}`);
            dataLayer[f] = valueSwitcher(dataLayer[f], 'txtHeightLayer', `${cnvLayers[f].clientHeight}`);
            dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', `${cnvLayers[f].offsetLeft}`);
            dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', `${cnvLayers[f].offsetTop}`);

            createHistory(f, name, 'image', n);
        
            addBorderLayer(cnvLayers[f], f)
            
            //DO NOT USE CLICK HERE [!]
            //USING CLICK IS MAKING UP ERROR
            //SINCE MULTIPLE IMAGES AND VECTORS
            //CAN BE UPLOADED AT ONCE
            //IT'S CAUSING CLICK ERROR
            //JUST USE FOCUS FUNCTION INSTEAD 
            canvas2Focus(cnvLayers[f]);    

            hideLoading();
       
        }

        //A BROKEN OR UNREACHABLE SOURCE NEVER FIRES onload, AND WITHOUT THIS activeAsync WOULD
        //NEVER RETURN TO 0 - THE KEYBOARD WOULD STAY BLOCKED FOR THE REST OF THE SESSION
        img.onerror = function() {

            hideLoading();
        }

}

function showBasicBoxImage(){
    this.closest('#pnlBoxImage').children[0].children[0].innerText = "Basic Properties";
    this.closest('#pnlBoxImage').querySelector('.tabSliderBox3').style.translate = "0%"; //slide tab
    this.closest('#pnlBoxImage').querySelector('.pnlBottomBoxThumb3').style.translate = "0%"; //slide scroll thumb
}

document.querySelector('#pnlBoxImage').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.querySelector('#pnlBoxImage').querySelector('.btnBasicBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxImage').querySelector('.btnBasicBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxImage').querySelector('.btnBasicBox').addEventListener('click', showBasicBoxImage);
document.querySelector('#pnlBoxImage').querySelector('.btnBasicBox').children[0].style.filter = "saturate(0) brightness(2)";
document.querySelector('#pnlBoxImage').querySelector('.btnBasicBox').children[0].style.transition = ".2s";


function showColorBoxImage() {
    this.closest('#pnlBoxImage').children[0].children[0].innerText = "Image Color";
    this.closest('#pnlBoxImage').querySelector('.tabSliderBox3').style.translate = "-100%"; //slide tab to left
    this.closest('#pnlBoxImage').querySelector('.pnlBottomBoxThumb3').style.translate = "100%"; //slide thumb to right
}

document.querySelector('#pnlBoxImage').querySelector('.btnColorBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxImage').querySelector('.btnColorBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxImage').querySelector('.btnColorBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxImage').querySelector('.btnColorBox').addEventListener('click', showColorBoxImage);
document.querySelector('#pnlBoxImage').querySelector('.btnColorBox').children[0].style.transition = ".2s";

function showStyleBoxImage() {
    this.closest('#pnlBoxImage').children[0].children[0].innerText = "Image Style";
    this.closest('#pnlBoxImage').querySelector('.tabSliderBox3').style.translate = "-200%"; //slide tab to left
    this.closest('#pnlBoxImage').querySelector('.pnlBottomBoxThumb3').style.translate = "202%"; //slide thumb to right
}

document.querySelector('#pnlBoxImage').querySelector('.btnStyleBox').addEventListener('click', btnBottomClick); //default the btnStyle to white
document.querySelector('#pnlBoxImage').querySelector('.btnStyleBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxImage').querySelector('.btnStyleBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxImage').querySelector('.btnStyleBox').addEventListener('click', showStyleBoxImage);
document.querySelector('#pnlBoxImage').querySelector('.btnStyleBox').children[0].style.transition = ".2s";



//===============SWAP IMAGE MODE==================
//THE TWIN OF SWAP FONT MODE IN tabFonts.js. sir, 2026-09-24: "on pnlBoxImage we add the same
//button like in changing fonts... this works only on the menuUpload (uploaded images) only and
//the images existing in the canvas. same how the swap fonts work."
//
//BOTH MODES SHARE swapMode AND swapTargets - THEY CANNOT RUN AT THE SAME TIME.

//THE NAME ON A GALLERY THUMB. IT IS THE ONLY PLACE AN UPLOAD'S REAL FILE NAME EXISTS: the
//upload handlers WRITE dataset.filename AND NOTHING COPIES IT INTO dataThumb
function imageNameOfThumb(n) {

    let configScroll = document.getElementsByClassName('configScroll');
    let thumb = configScroll[2].querySelector(`.pnlBoxThumb[data-thumbno="${n}"]`);

    return thumb != null ? (thumb.dataset.filename || "") : "";
}

//WHAT THE BUTTON READS. A PEXELS PHOTO WITH AN EMPTY alt AND AN IMAGE FROM menuElements BOTH
//LAND HERE WITH NOTHING, SO THE PANEL'S OWN LAYER NAME IS THE FALLBACK - sir, 2026-09-24:
//"yes do that fallback same as panel layer name"
function imageLabelOf(f) {

    let name = valueFinder(dataLayer[f], 'filename');
    let panel = f2Panel(f);

    if(name != null && String(name).trim() != "") return name;

    return panel != null ? panel.querySelector('.txtHeader').value : "";
}

function startSwapImage() {

    //CAPTURE THE TARGETS NOW. resetAllFocus RUNS ON ALMOST EVERY CLICK OUTSIDE THE CANVAS,
    //SO focusPanel CANNOT BE TRUSTED TO STILL HOLD THEM BY THE TIME AN IMAGE IS CHOSEN
    swapTargets = [];

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null && focusPanel[a].dataset.type == "image") {
            swapTargets.push(Number(focusPanel[a].dataset.ref));
        }
    }

    if(swapTargets.length == 0) return;

    swapMode = "image";

    let btn = document.getElementById('pnlBoxImage').querySelector('.btnImageLabel');

    //dataset.full IS THE WHOLE NAME fitSwapLabel STORED. STASHING THE VISIBLE LABEL INSTEAD
    //WOULD PUT A TRUNCATED "seaside-sunse..." BACK ON CANCEL
    btn.dataset.image = btn.dataset.full || btn.querySelector('h2').innerText;

    btn.querySelector('h2').innerText = "Select a new image";
    btn.querySelector('svg').style.display = "none";
    btn.querySelector('.spinImageLabel').style.display = "flex";
    btn.classList.add('swapping');

    //THE BUTTON STOPS RESPONDING WHILE THE MODE IS LIVE, SO REPEAT CLICKS CANNOT REPLAY THE
    //MENU SLIDE. cancelSwapImage PUTS IT BACK, AND ONLY IN THE BRANCH THAT ACTUALLY RESTORES
    btn.removeEventListener('click', startSwapImage);

    //SNAP THE MENU BACK TO ITS HIDDEN POSITION WITHOUT ANIMATING, SO showToolMenu SLIDES IT IN
    //AGAIN EVEN WHEN menuUpload WAS ALREADY OPEN. WITHOUT THE FORCED REFLOW BOTH TRANSFORMS
    //LAND IN THE SAME FRAME AND THE BROWSER PAINTS ONLY THE LAST ONE - NOTHING MOVES
    toolmenu.style.transition = "0s";
    toolmenu.style.transform = `translateX(-${toolmenu.offsetWidth}px)`;
    void toolmenu.offsetWidth;
    toolmenu.style.transition = "";

    //NOT .click(). A SYNTHETIC CLICK BUBBLES TO THE DELEGATED click HANDLER, WHERE #toolbox IS
    //UNGUARDED AND THE CATCH-ALL else RUNS resetAllFocus - WHICH CANCELS THIS MODE
    showToolMenu('toolUploads');
}

function cancelSwapImage() {

    //ONLY THIS MODE'S OWN CANCEL. cancelSwap() CALLS BOTH
    if(swapMode == "font") return;

    swapMode = null;
    swapTargets = [];

    let btn = document.getElementById('pnlBoxImage').querySelector('.btnImageLabel');

    if(btn == null) return;

    //GUARD ON THE SPINNER, NOT ON swapMode. swapImageOnTargets CLEARS THE MODE BEFORE ITS
    //await, SO A FLAG GUARD HERE WOULD SKIP THE RESTORE AND LEAVE THE SPINNER RUNNING
    if(btn.querySelector('.spinImageLabel').style.display == "none") return;

    btn.querySelector('svg').style.display = "flex";
    btn.querySelector('.spinImageLabel').style.display = "none";
    fitSwapLabel(btn, btn.dataset.image);
    btn.classList.remove('swapping');
    btn.addEventListener('click', startSwapImage);
}

//PICKED FROM THE UPLOADS GALLERY. THE SOURCE IS dataThumb[n], WHICH IS ALREADY BASE64
function swapImageFromThumb(thumb) {

    if(thumb.dataset.type != "image") {
        cancelSwapImage();
        return;
    }

    let n = thumb.dataset.thumbno;

    swapImageOnTargets({
        thumbno: n,
        filename: thumb.dataset.filename || "",
        link: "",
        src: valueFinder(dataThumb[n], 'source')
    });
}

//PICKED FROM ANOTHER IMAGE LAYER ON CANVAS. ITS base64 IS READ OFF THE LIVE img RATHER THAN
//LOOKED UP - A PEXELS LAYER HAS NO dataThumb ROW, SO THE CANVAS IS THE ONLY COPY THERE IS
function swapImageFromCanvas(pin) {

    let f = Number(pin.dataset.ref);
    let canvas = f2Canvas(f);

    //NOTHING TO SWAP WHEN THE SOURCE IS ONE OF THE TARGETS
    if(swapTargets.includes(f) || canvas == null || canvas.querySelector('img') == null) {
        cancelSwapImage();
        return;
    }

    swapImageOnTargets({
        thumbno: valueFinder(dataLayer[f], 'thumbno'),
        filename: valueFinder(dataLayer[f], 'filename') || "",
        link: valueFinder(dataLayer[f], 'imageLink') || "",
        src: canvas.querySelector('img').src
    });
}

function swapImageOnTargets(pick) {

    let targets = swapTargets.slice();

    //THE MODE ENDS THE MOMENT THE CHOICE IS MADE. THE TARGETS ARE ALREADY COPIED
    swapMode = null;
    swapTargets = [];

    if(targets.length == 0 || pick.src == null) {
        cancelSwapImage();
        return;
    }

    //ONE ENTRY FOR ALL TARGETS, NOT ONE PER LAYER - THE RED-9 RULE.
    //
    //THE base64 IS NOT IN HERE. thumbno POINTS AT dataThumb FOR AN UPLOAD AND imageLink AT
    //PEXELS FOR A PHOTO, SO ONE SWAP COSTS A LINE INSTEAD OF TWO COPIES OF THE IMAGE.
    //sir, 2026-09-24: "at least it wont consume too much bulky history from one image"
    let tempHistory = "\nSwitch Image";

    for(let a = 0; a < targets.length; a++) {

        let f = targets[a];
        let canvas = f2Canvas(f);
        let panel = f2Panel(f);

        if(canvas == null || panel == null) continue;

        let oldThumb = valueFinder(dataLayer[f], 'thumbno');
        let oldName = valueFinder(dataLayer[f], 'filename') || "";
        let oldLink = valueFinder(dataLayer[f], 'imageLink') || "";

        //SAME PICTURE ALREADY ON THIS LAYER
        if(String(oldThumb) == String(pick.thumbno) && oldLink == pick.link) continue;

        tempHistory += `*`;
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxImage: ${panel.querySelector('.txtHeader').value}`;
        tempHistory += `\nthumbno: ${pick.thumbno}`;
        tempHistory += `\nfilename: ${pick.filename}`;
        tempHistory += `\nimageLink: ${pick.link}`;
        tempHistory += `\n_`;
        tempHistory += `\nthumbno: ${oldThumb}`;
        tempHistory += `\nfilename: ${oldName}`;
        tempHistory += `\nimageLink: ${oldLink}\n`;

        applyImageToLayer(f, pick.src, pick.thumbno, pick.filename, pick.link);
    }

    if(tempHistory.includes('*')) makeNewHistory(tempHistory);

    //cancelSwapImage RESTORES THE LABEL FROM dataset.image, SO POINT IT AT THE NEW NAME FIRST
    let btn = document.getElementById('pnlBoxImage').querySelector('.btnImageLabel');
    btn.dataset.image = pick.filename;
    btn.dataset.full = pick.filename;

    cancelSwapImage();

    if(f2Panel(targets[0]) != null) panel2Focus(f2Panel(targets[0]));
}

//THE BOX NEVER MOVES AND NEVER RESIZES. sir, 2026-09-24: "the box canvas wrapper remains.
//regardless if the image was landscape and replaced by portrait. the idea is the user already
//positioned the box, exact left/x-axis, top/y-axis". .cnvLayers img IS object-fit: cover, so a
//mismatched picture crops to fill instead of stretching
function applyImageToLayer(f, src, thumbno, filename, link) {

    let canvas = f2Canvas(f);
    let panel = f2Panel(f);

    if(canvas == null || panel == null) return;

    clearImageFailed(canvas);

    let img = canvas.querySelector('img');

    if(img == null) return;

    //DROP createCanvasImage'S onload FIRST. IT IS STILL BOUND TO THIS img, AND IT SIZES THE
    //LAYER FROM naturalWidth/naturalHeight, RE-CENTRES IT AND CALLS createHistory AGAIN.
    //MEASURED 2026-09-24: A SWAP MOVED A 540x540 BOX TO 540x864 AND ADDED THREE HISTORY
    //ENTRIES INSTEAD OF ONE. THE BOX MUST NOT MOVE - sir, 2026-09-24.
    img.onload = null;

    img.src = src;

    canvas.dataset.thumbno = thumbno;
    panel.dataset.thumbno = thumbno;

    dataLayer[f] = valueSwitcher(dataLayer[f], 'thumbno', thumbno);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'filename', filename);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'imageLink', link);

    //newImageSource IS THE BACKGROUND-REMOVAL FIELD AND IT HOLDS WHATEVER IS ON THE LAYER NOW.
    //LEAVING A STALE ONE BEHIND WOULD LET ITS UNDO PUT THE PREVIOUS PICTURE BACK
    dataLayer[f] = valueSwitcher(dataLayer[f], 'newImageSource', '');

    if(leadPanel != null && Number(leadPanel.dataset.ref) == f) {
        fitSwapLabel(document.getElementById('pnlBoxImage').querySelector('.btnImageLabel'), imageLabelOf(f));
    }
}

//===============RESOLVING A SOURCE FROM A REFERENCE==================
//AN UPLOAD IS INSTANT AND WORKS OFFLINE - dataThumb IS IN THE FILE. A PEXELS PHOTO IS A FETCH,
//WHICH IS THE PRICE sir ACCEPTED FOR NOT CARRYING base64 THROUGH HISTORY
async function resolveImageSource(thumbno, link) {

    //THE LINK IS CHECKED FIRST. A GRAPHIC'S thumbno IS A SUPABASE ROW INDEX AND A PEXELS
    //thumbno IS A PHOTO ID - EITHER CAN COLLIDE WITH AN UPLOAD'S GALLERY NUMBER, AND READING
    //dataThumb FIRST WOULD THEN PUT THAT UNRELATED UPLOAD BACK ON UNDO, SILENTLY. ONLY AN
    //UPLOAD HAS AN EMPTY LINK, SO ONLY AN UPLOAD REACHES dataThumb
    if(link != null && link.startsWith("elements:")) {

        try {

            //SAME CALL delegation MAKES WHEN THE GRAPHIC IS FIRST PLACED - CACHE FIRST,
            //SUPABASE ON A MISS - AND ITS source GOES ON THE img AS IS, EXACTLY LIKE
            //createCanvasImage'S graphics BRANCH
            let data = await fetchRowById('elements', link.replace("elements:", ""));

            if(data != null && data.length > 0 && data[0].source) return data[0].source;
        }
        catch {}

        return null;
    }

    if(link == null || link == "") {

        if(dataThumb[thumbno] != null) {

            let src = valueFinder(dataThumb[thumbno], 'source');
            if(src != null && src != "") return src;
        }

        return null;
    }

    try {

        //SAME PIPELINE createCanvasImage USES FOR A FRESH PEXELS PHOTO, SO AN UNDONE LAYER IS
        //BYTE FOR BYTE THE SAME KIND OF IMAGE AS A PLACED ONE. THAT PIPELINE IS THE ORIGINAL
        //JPEG NOW - sir, 2026-09-27: "comment out the conversion even on image swap"
        //let snapdiv = document.getElementById('snapdiv');
        //let img = new Image();

        //img.crossOrigin = "anonymous";
        //img.src = link;

        //await img.decode();

        //snapdiv.children[0]?.remove();
        //snapdiv.appendChild(img);

        //let out = await snapdom.toPng(snapdiv, {fast: true, width: img.naturalWidth, height: img.naturalHeight, quality: 1});

        //return out.src;

        return await fetchImageAsDataURL(link);
    }
    catch {
        return null;
    }
}

//===============A PHOTO'S OWN BYTES AS A data: URL==================
//WHAT PEXELS SERVES IS WHAT IS EMBEDDED - NO CANVAS, NO RE-ENCODE, SO A JPEG STAYS A JPEG AT
//ITS OWN SIZE. images.pexels.com SENDS CORS HEADERS - THE SWAP PATH ALREADY LOADED IT WITH
//crossOrigin = "anonymous". A FAILED FETCH THROWS, EXACTLY AS img.decode() DID BEFORE, SO BOTH
//CALLERS KEEP THEIR OWN FAILURE PATHS
async function fetchImageAsDataURL(url) {

    let response = await fetch(url, {mode: "cors"});

    if(!response.ok) throw new Error(`image ${response.status}`);

    let blob = await response.blob();

    return await new Promise((resolve, reject) => {

        let reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

//===============THE FAILED FETCH OVERLAY==================
//sir, 2026-09-24: "'Failed to fetch image. Retry?' with underline but on click it will fetch
//the image. on click, it will be replaced by our spinning loading busy icon... then if failed
//show the fake hyperlink again to give chance to redownload."
//
//THE img IS LEFT IN PLACE UNDERNEATH, SO A SUCCESSFUL RETRY ONLY HAS TO SET src AND REMOVE
//THIS. data-strip IS WHAT KEEPS IT OUT OF A SAVED .wdr AND OUT OF A DOWNLOADED PNG
function clearImageFailed(canvas) {

    if(canvas == null) return;

    let old = canvas.querySelector('.cnvImageFailed');

    if(old != null) old.remove();
}

function showImageFailed(f, thumbno, link) {

    let canvas = f2Canvas(f);

    if(canvas == null) return;

    clearImageFailed(canvas);

    let box = document.createElement('div');
    box.classList.add('cnvImageFailed');
    box.dataset.strip = "true";
    box.dataset.thumbno = thumbno;
    box.dataset.link = link;
    box.innerHTML = `<h2>Failed to fetch image. <span>Retry?</span></h2>`;

    //NAMED, AND RE-ARMED AFTER EVERY FAILURE. THE innerHTML SWAP DESTROYS THE span THE
    //LISTENER WAS ON, SO WITHOUT RE-ARMING THE SECOND "Retry?" WOULD BE DEAD TEXT
    async function retryFetch() {

        box.innerHTML = `<div class="spinImageFailed"></div>`;

        let src = await resolveImageSource(box.dataset.thumbno, box.dataset.link);

        if(src == null) {

            box.innerHTML = `<h2>Failed to fetch image. <span>Retry?</span></h2>`;
            box.querySelector('span').addEventListener('click', retryFetch);
            return;
        }

        let img = canvas.querySelector('img');
        if(img != null) img.src = src;

        clearImageFailed(canvas);
    }

    box.querySelector('span').addEventListener('click', retryFetch);

    canvas.appendChild(box);
}

document.getElementById('pnlBoxImage').querySelector('.btnImageLabel').addEventListener('click', startSwapImage);
