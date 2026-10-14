
let dataCanvas = '';

dataCanvas = 'Default*';
dataCanvas += `\npnlBoxCanvas: Canvas`;
dataCanvas += `\ntxtSizeWidth: 1080`;
dataCanvas += `\ntxtSizeHeight: 1080`;
dataCanvas += `\ntxtBackgroundColor: rgba(255, 255, 255, 1)`;
dataCanvas += `\nchkLockAspectRatio: false`;

dataCanvas += `\ndropdown 0: Resize to Center`;

let dataMode = '\n*';
dataMode += `\nchkMode: 2D`;

let dataEnv = `\n*`;
dataEnv += `\npnlBox3DEnvironment: Environment`;
dataEnv += `\nchkFilmic: false`;
dataEnv += `\ntxtEnvBlur: 0`;
dataEnv += `\ntxtEnvRotation: 0`;
dataEnv += `\ntxtEnvExposure: 100`;
dataEnv += `\ndropdown 0: Indoor White Light`;

let dataTitle = `\n*`;
dataTitle += `\ntitle: Untitled`;

//NO NEED FOR HISTORY[0] SINCE NEW HISTORY WILL GET VALUE FROM THEIR DATA STRINGS
//ALSO UNDO HAS MINIMUM OF 0

//===============RESIZE CANVAS=========================

function adjustCnvGrpLayers(moveX, moveY) {

    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

    for(let a = 0; a < cnvGrpLayers.childElementCount; a++) {

        let element = cnvGrpLayers.children[a];

        if(element != null && element.dataset.type != "pattern") {
            let f = element.dataset.ref;

            element.style.left = element.offsetLeft + moveX + 'px';
            element.style.top = element.offsetTop + moveY + 'px';

            dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', element.offsetLeft);
            dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', element.offsetTop);
        }
    }
}

function resizeBoxCanvas() {

    let cnvBox = document.getElementById('cnvBox');
    let panel = document.getElementById('pnlBoxCanvas');
    let txtSizeWidth = panel.querySelector('.txtSizeWidth');
    let txtSizeHeight = panel.querySelector('.txtSizeHeight');
    let dropAnchor = panel.querySelectorAll('.dropdown')[0];
    let cnvPatterns = document.getElementsByClassName('cnvPatterns');
    
    //START CROPPING FROM THE DROPDOWN POSITION
    if(dropAnchor.dataset.default == "Resize to Center") {
        let moveX = (Number(txtSizeWidth.value) - cnvBox.clientWidth) / 2;
        let moveY = (Number(txtSizeHeight.value) - cnvBox.clientHeight) / 2;
        adjustCnvGrpLayers(moveX, moveY)
    }
    else if(dropAnchor.dataset.default == "Resize to Left") {
        let moveX = (Number(txtSizeWidth.value) - cnvBox.clientWidth);
        let moveY = (Number(txtSizeHeight.value) - cnvBox.clientHeight) / 2;
        adjustCnvGrpLayers(moveX, moveY)
    }

    else if(dropAnchor.dataset.default == "Resize to Right") {
        let moveX = 0;
        let moveY = (Number(txtSizeHeight.value) - cnvBox.clientHeight) / 2;
        adjustCnvGrpLayers(moveX, moveY)
    }

    else if(dropAnchor.dataset.default == "Resize to Top") {
        let moveX = (Number(txtSizeWidth.value) - cnvBox.clientWidth) / 2;
        let moveY = (Number(txtSizeHeight.value) - cnvBox.clientHeight);
        adjustCnvGrpLayers(moveX, moveY)
    }

    else if(dropAnchor.dataset.default == "Resize to Top Left") {
        let moveX = (Number(txtSizeWidth.value) - cnvBox.clientWidth);
        let moveY = (Number(txtSizeHeight.value) - cnvBox.clientHeight);
        adjustCnvGrpLayers(moveX, moveY)
    }

    else if(dropAnchor.dataset.default == "Resize to Top Right") {
        let moveX = 0;
        let moveY = (Number(txtSizeHeight.value) - cnvBox.clientHeight);
        adjustCnvGrpLayers(moveX, moveY)
    }

    else if(dropAnchor.dataset.default == "Resize to Bottom") {
        let moveX = (Number(txtSizeWidth.value) - cnvBox.clientWidth) / 2;
        let moveY = 0;
        adjustCnvGrpLayers(moveX, moveY)
    }

    else if(dropAnchor.dataset.default == "Resize to Bottom Left") {
        let moveX = (Number(txtSizeWidth.value) - cnvBox.clientWidth);
        let moveY = 0;
        adjustCnvGrpLayers(moveX, moveY)
    }

    else if(dropAnchor.dataset.default == "Resize to Bottom Right") {
        let moveX = 0;
        let moveY = 0;
        adjustCnvGrpLayers(moveX, moveY)
    }    

    cnvBox.style.width = txtSizeWidth.value + "px";
    cnvBox.style.height = txtSizeHeight.value + "px";

    ////////////////ADJUST CNVPATTERNS POSITION BASED ON ADJUST X AND ADJUST Y////////////////
    for(let a = 0; a < cnvPatterns.length; a++) {

        if(cnvPatterns[a] != null) {

            let f = cnvPatterns[a].dataset.ref;

            let xAxis = Number(valueFinder(dataPattern[f], 'txtXPattern'));
            let yAxis = Number(valueFinder(dataPattern[f], 'txtYPattern'));
            let boxSize = Number(valueFinder(dataPattern[f], 'txtSizePattern'));

            //ADJUST FOR X AXIS
            cnvPatterns[a].style.width = Number(txtSizeWidth.value) - (Number(boxSize) * Math.abs(Number(xAxis))) + 'px';
            cnvPatterns[a].style.height = txtSizeHeight.value + 'px';

            if(Number(xAxis > 0)) {
                cnvPatterns[a].style.left = (Number(boxSize) * Number(xAxis)) + 'px';
            }
            else {
                cnvPatterns[a].style.left = '0px';
            }

            //ADJUST FOR Y AXIS
            cnvPatterns[a].style.top = (Number(boxSize) * Number(yAxis)) + 'px';

            renderPattern(f, null, null, null);
            updatePatternColor(f);

        }
        
    }

    //THE 3D ENVIRONMENT IS BUILT IN THE BACKGROUND AFTER LOGIN AND MAY NOT EXIST YET (EMPTY CACHE STILL DOWNLOADING,
    //OR A FAILED DOWNLOAD). A 2D CANVAS RESIZE MUST NEVER STOP HERE, OR zoomMainCanvas AND resetOutputSize NEVER RUN
    engineEnv?.resize();
    
    zoomMainCanvas();

    resetOutputSize();

}
document.querySelector('#pnlBoxCanvas').querySelector('.txtSizeWidth').addEventListener('change', resizeBoxCanvas);
document.querySelector('#pnlBoxCanvas').querySelector('.txtSizeHeight').addEventListener('change', resizeBoxCanvas);

//LOCKED RATIO MIRRORS THE EDITED FIELD ONTO THE OTHER ONE WHILE TYPING
//CNVBOX STILL HOLDS THE COMMITTED SIZE SO IT IS THE PREVIOUS RATIO
function chooseLockAspectRatio() {

    let cnvBox = document.getElementById('cnvBox');
    let panel = document.getElementById('pnlBoxCanvas');

    if(valueFinder(dataCanvas, 'chkLockAspectRatio') != "true") return;
    if(cnvBox.clientWidth < 1 || cnvBox.clientHeight < 1) return;

    if(this.className == "txtSizeWidth") {
        panel.querySelector('.txtSizeHeight').value = Math.round(Number(this.value) * cnvBox.clientHeight / cnvBox.clientWidth);
    }
    else {
        panel.querySelector('.txtSizeWidth').value = Math.round(Number(this.value) * cnvBox.clientWidth / cnvBox.clientHeight);
    }
}
document.querySelector('#pnlBoxCanvas').querySelector('.txtSizeWidth').addEventListener('input', chooseLockAspectRatio);
document.querySelector('#pnlBoxCanvas').querySelector('.txtSizeHeight').addEventListener('input', chooseLockAspectRatio);


function chooseCropDirection() {
    this.closest('.pnlDrop').children[0].children[0].innerText = this.innerText;
    this.closest('.pnlDrop').children[0].dataset.default = this.innerText;

    resizeBoxCanvas();
}
document.querySelectorAll('.optResize')
.forEach((opt) => {
    opt.addEventListener('pointerdown', chooseCropDirection);
})


//=======================SOLID BG COLOR PICKER==================

function chooseBackgroundColor() {

    let cnvBG = document.getElementById('cnvBG');
    let thumbPicker = this.nextElementSibling;

    if(testHexCode(this) == "Linear" || testHexCode(this) == "Radial") {
        //change thumbpick color
        thumbPicker.children[1].style.background = this.dataset.gradient;
        //change the cnvBG color now
        cnvBG.style.background = this.dataset.gradient;
    }
    else {
 
        this.dataset.gradient = "";
        let alpha = this.dataset.alpha;
        let rgb = hex2RGBStringEncoding(testHexCode(this));

        thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
        cnvBG.style.background = `rgba(${rgb}, ${alpha})`;
    }
}
document.querySelector('#pnlBoxCanvas').querySelector('.txtBackgroundColor').addEventListener('change', chooseBackgroundColor);

//============================GRADIENTS==========================




