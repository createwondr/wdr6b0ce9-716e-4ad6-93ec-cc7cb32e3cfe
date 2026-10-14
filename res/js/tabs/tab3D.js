let scene = [];
let engine = [];
let camera = [];
let sceneEnv, engineEnv, focusEnv, cameraEnv, skybox, skyboxMaterial;
let envRotation;
let hdrTexture = [];
let cubemapURL = [];

//data3D is object lists for 3D canvas layers
let data3D = [];

function renderScene(f) {
    if(scene[f] != null && engine[f] != null) scene[f].render();
}

////////////////////////CREATE 3D PANEL////////////////////
function createPnlBox3DMockup(n, id, modelcolor) {

    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;

    let name = autoIncrementHeader("Element");
    let configScroll = document.getElementsByClassName('configScroll');

    let new3D = 
    `<div class="pnlBoxLayer" data-cloudID="${n}" data-type="3DMockup" data-ref="${f}" data-id="${id}">
        <div class="pnlTitleLayer" style="height: 40px;">
            <div class="iconLayer">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 5.30442L0.556633 3.13708M6.5 5.30442L12.4452 3.14425M6.5 5.30442V12.5M1.92332 10.9444L5.79 12.3277C6.05313 12.4218 6.18467 12.4689 6.3196 12.4876C6.43933 12.5041 6.56067 12.5041 6.6804 12.4876C6.81533 12.4689 6.94687 12.4218 7.21 12.3277L11.0767 10.9444C11.5891 10.7611 11.8453 10.6694 12.0345 10.505C12.2015 10.3599 12.3306 10.1751 12.4101 9.96706C12.5 9.73156 12.5 9.45613 12.5 8.90526V4.0947C12.5 3.54386 12.5 3.26844 12.4101 3.03295C12.3306 2.82495 12.2015 2.64013 12.0345 2.49495C11.8453 2.33058 11.5891 2.23892 11.0767 2.05559L7.21 0.672301C6.94687 0.57817 6.81533 0.531104 6.6804 0.512427C6.56067 0.495858 6.43933 0.495858 6.3196 0.512427C6.18467 0.531104 6.05313 0.57817 5.79 0.672301L1.92332 2.05559C1.41086 2.23892 1.15463 2.33058 0.965493 2.49495C0.79844 2.64013 0.669427 2.82495 0.589967 3.03295C0.5 3.26844 0.5 3.54386 0.5 4.0947V8.90526C0.5 9.45613 0.5 9.73156 0.589967 9.96706C0.669427 10.1751 0.79844 10.3599 0.965493 10.505C1.15463 10.6694 1.41086 10.7611 1.92332 10.9444Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
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

    configScroll[5].insertAdjacentHTML('afterbegin', new3D); //add the child on top of the previous one
    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);
    
    addPnlBox3DMockup(f, name, n, id, modelcolor);
    
}

function addPnlBox3DMockup(f, name, n, id, modelcolor) {

    dataLayer[f] = '\n*';
    dataLayer[f] += `\nref: ${f}`;
    dataLayer[f] += `\npnlBox3DMockup: ${name}`;
    dataLayer[f] += `\nthumbno: ${n}`;
    dataLayer[f] += `\nid: ${id}`;
    dataLayer[f] += `\nshow: visible`;
    dataLayer[f] += `\nlock: unlock`;
    dataLayer[f] += `\ndropdown 0: Normal`;
    dataLayer[f] += `\ntxtWidthLayer: 0`;
    dataLayer[f] += `\ntxtHeightLayer: 0`;
    dataLayer[f] += `\ntxtXLayer: 0`;
    dataLayer[f] += `\ntxtYLayer: 0`;
    dataLayer[f] += `\nchkFlipX: false`;
    dataLayer[f] += `\nchkFlipY: false`;
    dataLayer[f] += `\ntxtOpacityLayer: 100`;
    dataLayer[f] += `\ntxtRotationLayer: 0`;

    dataLayer[f] += `\ntxtColorDiffuse: ${modelcolor}`;
    dataLayer[f] += `\ntxtXRotation: 0`;
    dataLayer[f] += `\ntxtYRotation: 0`;
    dataLayer[f] += `\ntxtZRotation: 0`;

    dataLayer[f] += `\ndropdown 1: Front`;
    dataLayer[f] += `\ndropdown 2: Remove Mockup`;

    let area = 'Front';

    data3D[f] = {};
    data3D[f].ref = f;
    data3D[f].lastArea = area;
    data3D[f][area] = {};
    data3D[f][area].thumbno = "";
    data3D[f][area].thumbname = "";
    data3D[f][area].source = "";
    data3D[f][area].texture = "";
    data3D[f][area].xOffset = 0;
    data3D[f][area].yOffset = 0;
    data3D[f][area].xMin = 0;
    data3D[f][area].xMax = 0;
    data3D[f][area].yMin = 0;
    data3D[f][area].yMax = 0;
    data3D[f][area].scale = 100;

    //after all assigned controls then create the actual pattern layer
    createCanvas3DMockup(f, name, n, id);
}

function createCanvas3DMockup(f, name, n, id) {

    let txtSizeWidth = document.querySelector('.txtSizeWidth');
    let txtSizeHeight = document.querySelector('.txtSizeHeight');

    cnvLayers[f] = document.createElement('div');
    cnvLayers[f].classList.add('cnvLayers');
    cnvLayers[f].dataset.rotation = 0;
    cnvLayers[f].dataset.ref = f;
    cnvLayers[f].dataset.id = id;
    cnvLayers[f].dataset.thumbno = n;
    cnvLayers[f].dataset.type = "3DMockup";
    cnvLayers[f].dataset.lock = "unlock";
    cnvLayers[f].dataset.mask = "unmask";
    //1x1 IS THE DESIGN FLOOR. THE 20px ON SCREEN IS THE PIN'S - SEE PIN_MIN_PX IN tabLayers.js
    cnvLayers[f].style.minWidth = 1 + 'px';
    cnvLayers[f].style.minHeight = 1 + 'px';
    cnvLayers[f].style.overflow = "visible";
    cnvLayers[f].style.visibility = "visible";

    //APPEND FIRST TO GROUP SO CAN POSITION LEFT AND TOP
    cnvGrpLayers.appendChild(cnvLayers[f]);

    //RESIZE AND POSITION NOW THE CNVLAYERS
    //AFTER APPENDING TO CNVGRPLAYERS
    cnvLayers[f].style.width = Math.min(txtSizeWidth.value, txtSizeHeight.value) /2 + 'px';
    cnvLayers[f].style.height = Math.min(txtSizeWidth.value, txtSizeHeight.value) /2 + 'px';
    cnvLayers[f].style.left = `${(txtSizeWidth.value / 2) - (cnvLayers[f].clientWidth/2)}px`;
    cnvLayers[f].style.top = `${(txtSizeHeight.value / 2) - (cnvLayers[f].clientHeight/2)}px`;

    //REGISTER DATALAYER
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtWidthLayer', `${cnvLayers[f].clientWidth}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtHeightLayer', `${cnvLayers[f].clientHeight}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', `${cnvLayers[f].offsetLeft}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', `${cnvLayers[f].offsetTop}`);

    //CREATE CANVAS
    let canvas = document.createElement('canvas');
    cnvLayers[f].appendChild(canvas);
    canvas.width = "100%";
    canvas.height = "100%";
    canvas.classList.add('canvas3D');

    //CHECK FIRST IF THERE'S SAME 3D MODEL IN THE CNVMAIN
    //TO AVOID LOADING AGAIN BY DEFAULT, SAME ID WILL BE 1 SINCE IT APPEND ALREADY
    //BUT WITH EMPTY CANVAS SO IT'S 1 COUNT SO WE SHOW LOADING ONLY IF THERE'S 1 OR NEW
    if(cnvGrpLayers.querySelectorAll(`[data-id="${id}"]`).length <= 1) {
        showLoading();
    }
    
    create3DMockup(cnvLayers[f], id)
    .then(() => {
        
        //add border
        addBorderLayer(cnvLayers[f], f);

        createHistory(f, name, "3DMockup", n, id);
    
        canvas2Focus(f2Canvas(f))
        
        hideLoading();
    })
    
};

async function create3DMockup(cnvLayer, id) {

    let f = cnvLayer.dataset.ref;
    let canvas = cnvLayer.querySelector('canvas');

    let globalEnv = pnlBox3DEnvironment.querySelector('.dropdown').innerText.trim();

    engine[f]?.dispose();
    engine[f] = new BABYLON.Engine(canvas, true);
    scene[f] = new BABYLON.Scene(engine[f]);
    scene[f].clearColor = new BABYLON.Color4(0,0,0,0);

    ///////////////////////ENVIRONMENT/////////////////////////
    let env = await fetchEnvironmentFromCache(globalEnv)
    .then((env) => {
        return env;
    })

    let i = env.index;
    let envURL = URL.createObjectURL(env.source);

    //[!] IMPORTANT
    //WHEN USING CUBETEXTURE ONLY WITHOUT PREFILTERED, USE NEW BABYLON TO WORK
    //ALSO USE FORCE EXTENSION WHICH IS THE 10TH PARAMETER AND ENFORCE WHAT FILE TYPE THIS IS
    //IF WILL BE USING CUBETEXTURE.CREATEPREFILTEREDDATA, DON'T USE 'NEW' BABYLON
    //ALSO USE A DIRECT URL STRING THAT ENDS WITH .ENV
    //ONLY 2 PARAMETERS ARE NEEDED, STRING URL AND SCENE

    hdrTexture[i] = new BABYLON.CubeTexture(envURL, scene[f], null, false, null, null, null, null, null, '.env');
    scene[f].environmentTexture = hdrTexture[i];
    scene[f].environmentTexture.rotationY = degToRad(envRotation);
    hdrTexture[i].onLoadObservable.addOnce(() => {
        URL.revokeObjectURL(envURL);
    });
    
    ////////////////////////CAMERA///////////////////
    camera[f] = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3.Zero(), scene[f]);
    camera[f].setPosition(new BABYLON.Vector3(0, 0, -2));
    camera[f].setTarget(BABYLON.Vector3.Zero());
    camera[f].attachControl(canvas, true);
    
    ////////////////////////MODEL/MESH///////////////
    
    let element = await fetchRowByIdFromCache('elements', id)
    .then((element) => {
        return element;
    })

    let glbURL = URL.createObjectURL(element.source);

    let model = await BABYLON.SceneLoader.ImportMeshAsync("", "", glbURL, scene[f], null, '.glb');
    model.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
    model.meshes[0].position = BABYLON.Vector3.Zero();
    model.meshes[0].scale = new BABYLON.Vector3(.7, .7, .7);
    URL.revokeObjectURL(glbURL);
    
    //[!] RECOLOR ALL AVAILABLE MESHES
    let rgba = valueFinder(dataLayer[f], 'txtColorDiffuse');
    let alpha = rgbaString2AlphaEncoding(rgba) / 100;

    for(let b = 1; b < scene[f].meshes.length; b++) {

        let matName = scene[f].meshes[b].material.name;

        if(matName.includes('delta_')) {
            scene[f].meshes[b].material.albedoColor = rgba2BabylonRGB(rgba);
            scene[f].meshes[b].material.alpha = alpha;
        }
    }

    hideShowMesh(f, true);
    ///////////////////////NOW START UPDATING THE SETTINGS/////////////////////

    //UPDATE THE FILMIC OR SRGB COLOR PROFILE
    change3DEnvironmentFilmic();

    //UPDATE THE BLUR OR FOCUS
    adjust3DEnvironmentBlur();

    //UPDATE THE ROTATION
    adjust3DEnvironmentRotation();

    //UPDATE THE EXPOSURE
    adjust3DEnvironmentExposure();
    
    //[!] executeWhenReady, NOT A BARE render() - THE MODEL AND ITS TEXTURES FINISH
    //LOADING AFTER THIS POINT, AND THE FIRST RENDER IS ALSO WHAT COMPILES THE
    //SHADERS. RENDERING TOO EARLY DRAWS AN EMPTY OR UNLIT SCENE
    scene[f].executeWhenReady(() => renderScene(f));

    consoleMsg();
}

function hideShowMesh(f, visible) {
    
    for(let a = 0; a < scene[f].meshes.length; a++) {
        if(scene[f] != null) {

            if(visible) {

                if(scene[f].meshes[a].name.includes('print')) {

                    if(scene[f].meshes[a].material.albedoTexture == null) {
                        scene[f].meshes[a]._isVisible = false;
                    }
                    else {
                        scene[f].meshes[a]._isVisible = true;
                    }   
                }
                else {
                    scene[f].meshes[a]._isVisible = true;
                }
            }
            else {
                scene[f].meshes[a]._isVisible = false;
            }
        }
    }
    
    renderScene(f);
}

///////////////////////////////////COLOR AND 3D FUNCTIONS////////////////////////////
function adjust3DModelRotation() {
    
    let pnlBox3DMockup = document.getElementById('pnlBox3DMockup');
    let xRotation = pnlBox3DMockup.querySelector('.txtXRotation').value;
    let yRotation = pnlBox3DMockup.querySelector('.txtYRotation').value * -1;
    let zRotation = pnlBox3DMockup.querySelector('.txtZRotation').value * -1;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            //let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            let radianX = degToRad(xRotation);
            let radianY = degToRad(yRotation);
            let radianZ = degToRad(zRotation);

            if(type == "3DMockup") {

                scene[f].meshes[0].rotation = new BABYLON.Vector3(radianX, radianY, radianZ); //alpha, beta, gamma in radians

                //[!] INSIDE THE LOOP - f IS PER LAYER, AND A MULTI SELECT ROTATES
                //EVERY FOCUSED MOCKUP
                renderScene(f);
            }
        }
    }
}

document.getElementById('pnlBox3DMockup').querySelector('.txtXRotation').addEventListener('change', adjust3DModelRotation);
document.getElementById('pnlBox3DMockup').querySelector('.txtXRotation').previousElementSibling.addEventListener('input', adjust3DModelRotation);
document.getElementById('pnlBox3DMockup').querySelector('.txtYRotation').addEventListener('change', adjust3DModelRotation);
document.getElementById('pnlBox3DMockup').querySelector('.txtYRotation').previousElementSibling.addEventListener('input', adjust3DModelRotation);
document.getElementById('pnlBox3DMockup').querySelector('.txtZRotation').addEventListener('change', adjust3DModelRotation);
document.getElementById('pnlBox3DMockup').querySelector('.txtZRotation').previousElementSibling.addEventListener('input', adjust3DModelRotation);


function chooseDiffuseColor() {

    let thumbPicker = this.nextElementSibling;
    let rgb = hex2RGBStringEncoding(testHexCode(this));
    let alpha = this.dataset.alpha;
    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "3DMockup") {
                
                for(let b = 1; b < scene[f].meshes.length; b++) {

                    let matName = scene[f].meshes[b].material.name;

                    if(matName.includes('delta_')) {
                        scene[f].meshes[b].material.albedoColor = hex2BabylonRGB(this);
                        scene[f].meshes[b].material.alpha = alpha;
                    }
                }

                //[!] ONCE PER LAYER, NOT PER MESH - THE MESH LOOP ABOVE ONLY
                //STAGES MATERIAL VALUES, ONE FRAME SHOWS THEM ALL
                renderScene(f);
            }
        }
    }

}
document.getElementById('pnlBox3DMockup').querySelector('.txtColorDiffuse').addEventListener('change', chooseDiffuseColor);

//[!]THIS IS A DEDICATED HEX2RGB FORMATTING ONLY FOR BABYLON JS
//DO NOT DELETE THIS, DO NOT REPLACE IT WITH HEX2RGBSTRING
function hex2BabylonRGB(textbox) {
    
    testHexCode(textbox)
    
    // Parse the R, G, B values from the hex string
    const r = parseInt(textbox.value.substring(0, 2), 16) / 255;
    const g = parseInt(textbox.value.substring(2, 4), 16) / 255;
    const b = parseInt(textbox.value.substring(4, 6), 16) / 255;

    return new BABYLON.Color3(r, g, b);
}

function rgba2BabylonRGB(rgba) {
    
    rgba = rgba.replace('rgba(', '');
    rgba = rgba.replace(')', '');
    rgba = rgba.trim();
    rgba = rgba.split(',');

    return new BABYLON.Color3(Number(rgba[0])/255, Number(rgba[1])/255, Number(rgba[2])/255);
}

///////////////////////////////////MOCKUP FUNCTIONS////////////////////////

//RESET THE MOCKUP TEXTBOXES
function resetMockupTexts() {

    let txtMockupXOffset = document.querySelector('.txtMockupXOffset');
    let txtMockupYOffset = document.querySelector('.txtMockupYOffset');
    let txtMockupScale = document.querySelector('.txtMockupScale');

    txtMockupXOffset.value = 0;
    txtMockupYOffset.value = 0;
    txtMockupScale.value = 100;
}

//ASSIGN VALUES TO MOCKUP TEXTBOXES
function showMockupTexts(f) {

    let area = data3D[f].lastArea;
    let txtMockupXOffset = document.querySelector('.txtMockupXOffset');
    let txtMockupYOffset = document.querySelector('.txtMockupYOffset');
    let txtMockupScale = document.querySelector('.txtMockupScale');

    txtMockupXOffset.value = data3D[f][area].xOffset;
    txtMockupXOffset.min = data3D[f][area].xMin;
    txtMockupXOffset.max = data3D[f][area].xMax;

    txtMockupYOffset.value = data3D[f][area].yOffset;
    txtMockupYOffset.min = data3D[f][area].yMin;
    txtMockupYOffset.max = data3D[f][area].yMax;

    txtMockupScale.value = data3D[f][area].scale;
}

//SAVE CURRENT VALUES TO MOCKUP DATA3D
function saveMockupTexts() {
    
    
    let f = Number(leadPanel.dataset.ref);
    let tabMockupBox = document.querySelector('.tabMockupBox')
    let area = tabMockupBox.querySelector('h2').innerHTML;
    let txtMockupXOffset = document.querySelector('.txtMockupXOffset');
    let txtMockupYOffset = document.querySelector('.txtMockupYOffset');
    let txtMockupScale = document.querySelector('.txtMockupScale');

    data3D[f][area].xOffset = txtMockupXOffset.value;
    data3D[f][area].yOffset = txtMockupYOffset.value;
    data3D[f][area].scale = txtMockupScale.value;
}

////////////////////////ADD OPTIONS FOR MOCKUP AREA BEFORE SWAPPING PANELS///////////////////
function addAreaMockupOptions() {

    let f = leadPanel.dataset.ref;

    let tabMockupBox = document.querySelector('.tabMockupBox');
    let dropMockupArea = tabMockupBox.querySelectorAll('.dropOptionVerti')[0];

    //RESET MOCKUP AREA OPTIONS
    dropMockupArea.innerHTML = '';
    
    //CHECK ALL AVAILABLE MOCKUP AREAS
    for(let b = 1; b < scene[f].meshes.length; b++) {

        if(scene[f].meshes[b].material.name.includes('print')) {

            let newArea = scene[f].meshes[b].material.name.replace('print_', '');
            
            let div = document.createElement('div');
            div.classList.add('optLayerMockup');
            div.innerText = newArea;
            dropMockupArea.appendChild(div);
            dropMockupArea.lastElementChild.addEventListener('pointerdown', chooseMockupArea);
        }
    }
}

////////////////////////CHOOSE MOCKUP AREA///////////////
function chooseMockupArea() {

    let f = leadPanel.dataset.ref;
    let area = this.innerText;

    //SAVE THE LAST AREA AS AREA
    data3D[f].lastArea = area;

    //CHANGE DROPDOWN TEXT
    this.closest('.pnlDrop').querySelector('h2').innerText = area;

    if(data3D[f][area] == null) {

        //ENCODE THE DATA3D
        data3D[f][area] = {}
        data3D[f][area].thumbno = "";
        data3D[f][area].thumbname = "";
        data3D[f][area].source = "";
        data3D[f][area].texture = "";
        data3D[f][area].xOffset = 0;
        data3D[f][area].yOffset = 0;
        data3D[f][area].xMin = 0;
        data3D[f][area].xMax = 0;
        data3D[f][area].yMin = 0;
        data3D[f][area].yMax = 0;
        data3D[f][area].scale = 100;
    }

    addImageMockupOptions(area);
}

////////////////////////ADD OPTIONS FOR MOCKUP IMAGE BEFORE SWAPPING PANELS///////////////////
function addImageMockupOptions(area) {

    let f = leadPanel.dataset.ref;
    let tabMockupBox = document.querySelector('.tabMockupBox');
    let imgName = data3D[f][area].thumbname;
    let contMockup = tabMockupBox.querySelector('.contMockup');
    let dropOptionImage = tabMockupBox.querySelectorAll('.dropOptionVerti')[1];
    let dropMockupImage = tabMockupBox.querySelectorAll('.dropdown')[1];
    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');
    let btnRemoveMockup = document.getElementById('btnRemoveMockup');
    
    //RESET MOCKUP IMAGE OPTIONS
    dropOptionImage.innerHTML = '';
    
    if(imgName.trim() == "") {

        if(pnlBoxThumb.length > 0) {

            dropOptionImage.innerHTML = '';
    
            for(let a = 0; a < pnlBoxThumb.length; a++) {
    
                let div = document.createElement('div');
                div.classList.add('optLayerMockupImage');
                div.dataset.thumbno = pnlBoxThumb[a].dataset.thumbno;
                pnlBoxThumb[a].dataset.filename.length >= 16? div.innerText = pnlBoxThumb[a].dataset.filename.substr(0, 16) + '...': div.innerText = pnlBoxThumb[a].dataset.filename;
                dropOptionImage.appendChild(div);

            }
        }
        else {
            dropOptionImage.innerHTML = `<div class="optLayerMockupImage">No uploaded images yet</div>`;
        }

        //RESET MOCKUP DROPDOWN INNERTEXT
        dropMockupImage.querySelector('h2').innerText = 'Mockup Image';

        //NO MOCKUP ON THIS AREA. ONLY THE PICKER IS OFFERED
        dropMockupImage.closest('.pnlDrop').style.display = "flex";
        btnRemoveMockup.style.display = "none";

        dropOptionImage.querySelectorAll(`[class*='opt']`)

        .forEach((opt) => {

            opt.addEventListener('pointerdown', function() {

                if(this.innerText == "No uploaded images yet") {
                    
                    let pnldrop = this.closest('.pnlDrop');
                    pnldrop.querySelector('h2').textContent = "Mockup Image";
                }
                else {
                    
                        chooseTexture.call(this, leadPanel);
                    
                    
                }
            })
        })

        //NO MOCKUP ON THIS AREA. MUTE ON ENTRY, NOT ONLY ON REMOVAL
        disableContainer(contMockup)

        resetMockupTexts();

    }
    
    else {

        //RESET MOCKUP DROPDOWN INNERTEXT
        dropMockupImage.querySelector('h2').innerText = imgName;

        //MOCKUP APPLIED. THE PICKER HAS NOTHING LEFT TO PICK
        dropMockupImage.closest('.pnlDrop').style.display = "none";
        btnRemoveMockup.style.display = "flex";

        //SHOW THE TEXTBOXES VALUES FROM DATA3D
        showMockupTexts(f);

        //SHOW ALL TEXTBOXES AND ADD TRANSITIONS
        contMockup.querySelectorAll(`input[data-unit]`).forEach((text) => {
            text.style.transition = '0s';
        })

        //SHOW CONTAINER FOR MOCKUP
        //contMockup.style.opacity = "1";
        enableContainer(contMockup)

        //ADD INPUT NUMBER TRANSITION AGAIN
        contMockup.querySelectorAll(`input[data-unit]`).forEach((text) => {
            text.style.transition = '0.2s';
        })

    }
}

function chooseTexture(panel) {

    let aRatio;

    // panel IS THE CAPTURED leadPanel. THE GLOBAL IS ALREADY null BY THE TIME THE
    //CALLER'S TIMER FIRES. img2Canvas RESTORES FOCUS ITSELF WITH panel2Focus
    let f = Number(panel.dataset.ref);

    let configScroll = document.querySelectorAll('.configScroll');
    let thumb = configScroll[2].querySelector(`[data-thumbno="${this.dataset.thumbno}"]`)

    //CHOOSE ASPECT RATIO DEPENDS ON THE ID
    if(panel.dataset.id.toLowerCase().includes('shirt')) {
        aRatio = 0.707;
    }
    else if(panel.dataset.id.toLowerCase().includes('laptop')) {
        aRatio = 1.77777777778;
    }
    else if(panel.dataset.id.toLowerCase().includes('smartphone portrait')) {
        aRatio = 0.5625;
    }
    else if(panel.dataset.id.toLowerCase().includes('smartphone landscape')) {
        aRatio = 1.77777777778;
    }
    else if(panel.dataset.id.toLowerCase().includes('mug')) {
        aRatio = 2.28571428571;
    }

    img2Canvas(f, thumb, this.dataset.thumbno, this.innerText, aRatio);
   
}

function removeTexture(f, area) {

    // NO this, NO ENCODING. THE ONLY CALLERS ARE encodeRemoveMockup AND redoRemoveMockup,
    //AND BOTH ALREADY OWN f AND area. A DIRECT encode CALL IN HERE IS WHAT pauseEncoding
    //COULD NOT REMOVE, SO REPLAY REACHED makeNewHistory AND WIPED THE REDO STACK
    let contMockup = document.querySelector('.contMockup');

    disableContainer(contMockup)
    //CREATE A BLANK CANVAS FOR DYNAMIC TEXTURE
    let canvas = document.createElement('canvas');
    canvas.width = data3D[f][area].xMax;
    canvas.height = data3D[f][area].yMax;

    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // THE h2 RESET IS NOT REPEATED HERE. addImageMockupOptions AT THE FOOT OF THIS
    //FUNCTION RUNS ITS EMPTY BRANCH, WHICH SETS IT BACK TO 'Mockup Image' ANYWAY

    //REMOVE TEXTURE FROM SCENE MESH MATERIAL
    for(let b = 1; b < scene[f].meshes.length; b++) {

        let matName = scene[f].meshes[b].material.name;

        if(matName.includes(`print_${area}`)) {

            if(scene[f].meshes[b].material.albedoTexture != null) {
                scene[f].meshes[b].material.albedoTexture.dispose();
            }

            if(scene[f].meshes[b].material.opacityTexture != null && scene[f].meshes[b].material.opacityTexture !== scene[f].meshes[b].material.albedoTexture) {
                scene[f].meshes[b].material.opacityTexture.dispose();
            }

            let dynamicTexture = new BABYLON.DynamicTexture("", canvas, scene[f]);
            dynamicTexture.update();

            scene[f].meshes[b].material.albedoTexture = dynamicTexture;
            scene[f].meshes[b].material.opacityTexture = dynamicTexture;
            scene[f].meshes[b].material.transparencyMode = BABYLON.Engine.ALPHA_COMBINE;
            
        }
    }

    // Clean up canvas after use
    canvas.width = 0;
    canvas.height = 0;
    canvas = null;
    ctx = null;


    //UPDATE DATA3D OBJECTS
    data3D[f][area].thumbno = '';
    data3D[f][area].thumbname = '';
    data3D[f][area].source = '';
    data3D[f][area].xOffset = 0;
    data3D[f][area].yOffset = 0;
    data3D[f][area].xMin = 0;
    data3D[f][area].xMax = 0;
    data3D[f][area].yMin = 0;
    data3D[f][area].yMax = 0;
    data3D[f][area].scale = 1;

    addImageMockupOptions(area);

    //[!] REMOVING A TEXTURE ALSO CHANGES THE SHADER VARIANT, SO THE EFFECT HAS TO
    //RECOMPILE BEFORE THE MODEL CAN DRAW WITHOUT ITS PRINT
    scene[f].executeWhenReady(() => renderScene(f));
}

async function img2Canvas(f, thumb, thumbno, thumbname, aRatio) {

    let oldW, oldH, newW, newH;
    let newThumb = document.createElement('div');
    let txtSizeWidth = document.querySelector('.txtSizeWidth');
    let txtSizeHeight = document.querySelector('.txtSizeHeight');

    let contMockup = document.querySelector('.contMockup');
 
    let tabMockupBox = document.querySelector('.tabMockupBox');
    let dropMockupArea = tabMockupBox.querySelectorAll('.dropdown')[0];
    let dropMockupImage = tabMockupBox.querySelectorAll('.dropdown')[1];

    //reset the text values
    let txtMockupXOffset = tabMockupBox.querySelector('.txtMockupXOffset');
    let txtMockupYOffset = tabMockupBox.querySelector('.txtMockupYOffset');
    let txtMockupScale = tabMockupBox.querySelector('.txtMockupScale');

    //CHECK FIRST IF THUMB CHILD IS IMG OR SVG
    if(thumb.dataset.type == 'image') {

        //let thumbImg = thumb.firstChild.cloneNode(true);
        let thumbImg = new Image();
        thumbImg.src = valueFinder(dataThumb[thumbno], 'source');
        thumbImg.style.objectFit = "contain";
    
        await thumbImg.decode();

        //IF RASTER IMAGE
        oldW = thumbImg.naturalWidth;
        oldH = thumbImg.naturalHeight;

        let imgRatio = oldW/oldH;

        oldW > 200? oldW = 200: oldW = oldW;
        oldH = oldW / imgRatio;

        if(oldW >= oldH) {

            if(aRatio >= 1) {
                
                newH = oldH;
                newW = oldH * aRatio;

            }
            else {
            
                newW = oldW;
                newH = newW / aRatio;
            }
            

            newThumb.style.width = newW + 'px';
            newThumb.style.height = newH + 'px';
            newThumb.style.display = "flex";
            newThumb.style.margin = "auto";
            newThumb.appendChild(thumbImg);
            newThumb.querySelector('img').style.margin = "auto";
            newThumb.querySelector('img').style.width = oldW + 'px';
            newThumb.querySelector('img').style.height = oldH + 'px';
            
        }
        else {

            if(aRatio >= 1) {
                
                newH = oldH;
                newW = oldH * aRatio;

            }
            else {
            
                newW = oldW;
                newH = newW / aRatio;
            }

            newThumb.style.width = newW + 'px';
            newThumb.style.height = newH + 'px';
            newThumb.style.display = "flex";
            newThumb.style.margin = "auto";

            newThumb.appendChild(thumbImg);
            newThumb.querySelector('img').style.margin = "auto";
            newThumb.querySelector('img').style.height = oldH + 'px';
            newThumb.querySelector('img').style.width = oldW + 'px';
        
        }

    }

    else if(thumb.dataset.type == 'vector') {

        let div = document.createElement('div');
        div.innerHTML = decodeURIComponent(valueFinder(dataThumb[thumbno], 'source'));
        let thumbSVG = div.firstElementChild;

        oldW = parseFloat(thumbSVG.getAttribute('width'));
        oldH = parseFloat(thumbSVG.getAttribute('height'));
        
        if(Number.isNaN(oldW) || Number.isNaN(oldH) || oldW == null || oldH == null) {
            oldW = txtSizeWidth.value;
            oldH = txtSizeHeight.value;
        }

        let imgRatio = oldW/oldH;

        oldW > 200? oldW = 200: oldW = oldW;
        oldH = oldW / imgRatio;

        if(oldW >= oldH) {
        
            if(aRatio >= 1) {
                
                newH = oldH;
                newW = oldH * aRatio;

            }
            else {
            
                newW = oldW;
                newH = newW / aRatio;
            }
            
            newThumb.style.width = newW + 'px';
            newThumb.style.height = newH + 'px';
            newThumb.style.display = "flex";
            newThumb.style.margin = "auto";
            newThumb.appendChild(thumbSVG);
            newThumb.querySelector('svg').style.margin = "auto";
            newThumb.querySelector('svg').style.width = oldW + 'px';
            newThumb.querySelector('svg').style.height = oldH + 'px';

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
            newThumb.querySelector('svg').style.height = oldH + 'px';
            newThumb.querySelector('svg').style.width = oldW + 'px';
        
        }
    }

    snapdiv.children[0]?.remove();
    snapdiv.appendChild(newThumb);

    let img = await snapdom.toPng(snapdiv, {fast: true, width: newW, height: newH});

    await img.decode();

    let area = dropMockupArea.innerText.trim();

    //START CREATING OR RECREATING OBJECT KEYS
    //BASED FROM TEXTURES AND AREA SELECTED
    data3D[f][area].thumbno = thumbno;
    data3D[f][area].thumbname = thumbname;
    data3D[f][area].source = img.src;
    data3D[f][area].texture = img.src;
    data3D[f][area].xOffset = 0;
    data3D[f][area].yOffset = 0;
    data3D[f][area].xMin = img.naturalWidth * -1;
    data3D[f][area].xMax = img.naturalWidth;
    data3D[f][area].yMin = img.naturalHeight * -1;
    data3D[f][area].yMax = img.naturalHeight;
    data3D[f][area].scale = 100;

    //SHOW CONTAINER FOR MOCKUP
    //enableContainer(contMockup)


    //[!]DO NOT RESET THE VALUES OF TEXTBOXES BY DEFAULT
    //SINCE IMG CANVAS CAN BE UNDO OR REDO
    //USE THE DATA3D INSTEAD
    showMockupTexts(f);

    //CHANGE THE DROPDOWN INNERTEXT
    dropMockupImage.querySelector('h2').innerText = thumbname;

    //MOCKUP APPLIED. SWAP THE PICKER FOR THE REMOVE BUTTON
    dropMockupImage.closest('.pnlDrop').style.display = "none";
    document.getElementById('btnRemoveMockup').style.display = "flex";
    
    panel2Focus(f2Panel(f));
    adjustTexture(f, area, Number(txtMockupXOffset.value), Number(txtMockupYOffset.value), Number(txtMockupScale.value)/100);

    
    hideLoading();
}

function adjustTexture(f, area, x, y, scale) {

    //USE DATA3D[F] XMAX AND YMAX VALUES AS NATURAL WIDTH AND NATURAL HEIGHT
    //SINCE IT HAS THE SAME VALUE OF IMAGE' NATURAL WIDTH AND NATURAL HEIGHT
    let oldX = (x / 100) * data3D[f][area].xMax;
    let oldY = (y / 100) * data3D[f][area].yMax;

    let canvas = document.createElement('canvas');
    canvas.width = data3D[f][area].xMax;
    canvas.height = data3D[f][area].yMax;

    let ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.setTransform(1, 0, 0, -1, 0, canvas.height);

    //LOAD SOURCE AS NEW IMAGE
    let img = new Image();
    img.src = data3D[f][area].source;

    img.onload = function() {

        let newWidth = img.naturalWidth * scale;
        let newHeight = img.naturalHeight * scale;

        let newX = (img.naturalWidth - newWidth) / 2;
        let newY = (img.naturalHeight - newHeight) / 2;

        ctx.drawImage(img, oldX + newX, oldY + newY, newWidth, newHeight);

        for(let b = 1; b < scene[f].meshes.length; b++) {

            let matName = scene[f].meshes[b].material.name;

            if(matName.includes(`print_${area}`)) {

                if(scene[f].meshes[b].material.albedoTexture != null) {
                    scene[f].meshes[b].material.albedoTexture.dispose();
                }

                if(scene[f].meshes[b].material.opacityTexture != null && scene[f].meshes[b].material.opacityTexture !== scene[f].meshes[b].material.albedoTexture) {
                    scene[f].meshes[b].material.opacityTexture.dispose();
                }

                let dynamicTexture = new BABYLON.DynamicTexture("", canvas, scene[f]);
                
                dynamicTexture.update();

                data3D[f][area].texture = canvas.toDataURL();
                
                scene[f].meshes[b].material.albedoTexture = dynamicTexture;
                scene[f].meshes[b].material.opacityTexture = dynamicTexture;
                scene[f].meshes[b].material.transparencyMode = BABYLON.Engine.ALPHA_COMBINE;
                hideShowMesh(f, true);
            }
        }

        scene[f].executeWhenReady(() => renderScene(f));

        // Clean up canvas after use
        canvas.width = 0;
        canvas.height = 0;
        canvas = null;
        ctx = null;

    }
}

function adjustMockup() {

    let tabMockupBox = document.querySelector('.tabMockupBox');
    let dropMockupArea = tabMockupBox.querySelector('.dropdown');

    let xOffset = document.getElementById('pnlBox3DMockup').querySelector('.txtMockupXOffset');
    let yOffset = document.getElementById('pnlBox3DMockup').querySelector('.txtMockupYOffset');
    let scale = document.getElementById('pnlBox3DMockup').querySelector('.txtMockupScale');

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "3DMockup") {

                for(let b = 1; b < scene[f].meshes.length; b++) {

                    let matName = scene[f].meshes[b].material.name;

                    if(matName.includes(`print_${dropMockupArea.innerText}`)) {

                        adjustTexture(f, dropMockupArea.innerText, Number(xOffset.value), Number(yOffset.value), Number(scale.value) / 100);
                        
                    }
                }
            }
        }
    }

}

document.getElementById('pnlBox3DMockup').querySelector('.txtMockupXOffset').addEventListener('change', adjustMockup);
document.getElementById('pnlBox3DMockup').querySelector('.txtMockupXOffset').previousElementSibling.addEventListener('input', adjustMockup);
document.getElementById('pnlBox3DMockup').querySelector('.txtMockupYOffset').addEventListener('change', adjustMockup);
document.getElementById('pnlBox3DMockup').querySelector('.txtMockupYOffset').previousElementSibling.addEventListener('input', adjustMockup);
document.getElementById('pnlBox3DMockup').querySelector('.txtMockupScale').addEventListener('change', adjustMockup);
document.getElementById('pnlBox3DMockup').querySelector('.txtMockupScale').previousElementSibling.addEventListener('input', adjustMockup);


function showBasicBox3D(){
    this.closest('#pnlBox3DMockup').children[0].children[0].innerText = "Basic Properties";
    this.closest('#pnlBox3DMockup').querySelector('.tabSliderBox3').style.translate = "0%"; //slide tab
    this.closest('#pnlBox3DMockup').querySelector('.pnlBottomBoxThumb3').style.translate = "0%"; //slide scroll thumb
}

document.getElementById('pnlBox3DMockup').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.getElementById('pnlBox3DMockup').querySelector('.btnBasicBox').addEventListener('mouseover', btnBottomHover);
document.getElementById('pnlBox3DMockup').querySelector('.btnBasicBox').addEventListener('mouseleave', btnBottomLeave);
document.getElementById('pnlBox3DMockup').querySelector('.btnBasicBox').addEventListener('click', showBasicBox3D);
document.getElementById('pnlBox3DMockup').querySelector('.btnBasicBox').children[0].style.filter = "saturate(0) brightness(2)";
document.getElementById('pnlBox3DMockup').querySelector('.btnBasicBox').children[0].style.transition = ".2s";

//[!] PNLBOX3DENVIRONMENT HAS A SINGLE BOTTOM TAB, SO IT IS PERMANENTLY THE ACTIVE ONE.
//THE FILTER STRING HAS TO MATCH EXACTLY, IT IS WHAT BTNBOTTOMHOVER AND BTNBOTTOMLEAVE
//TEST AGAINST TO LEAVE AN ACTIVE TAB ALONE
document.getElementById('pnlBox3DEnvironment').querySelector('.btn3DEnvBox').children[0].style.filter = "saturate(0) brightness(2)";
document.getElementById('pnlBox3DEnvironment').querySelector('.btn3DEnvBox').children[0].style.transition = ".2s";


function showSceneBox3D() {
    this.closest('#pnlBox3DMockup').children[0].children[0].innerText = "3D Model Properties";
    this.closest('#pnlBox3DMockup').querySelector('.tabSliderBox3').style.translate = "-100%"; //slide tab to left
    this.closest('#pnlBox3DMockup').querySelector('.pnlBottomBoxThumb3').style.translate = "100%"; //slide thumb to right
}
document.getElementById('pnlBox3DMockup').querySelector('.btn3DBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.getElementById('pnlBox3DMockup').querySelector('.btn3DBox').addEventListener('mouseover', btnBottomHover);
document.getElementById('pnlBox3DMockup').querySelector('.btn3DBox').addEventListener('mouseleave', btnBottomLeave);
document.getElementById('pnlBox3DMockup').querySelector('.btn3DBox').addEventListener('click', showSceneBox3D);
document.getElementById('pnlBox3DMockup').querySelector('.btn3DBox').children[0].style.transition = ".2s";

function showMockupBox3D() {
    this.closest('#pnlBox3DMockup').children[0].children[0].innerText = "3D Model Mockup";
    this.closest('#pnlBox3DMockup').querySelector('.tabSliderBox3').style.translate = "-200%"; //slide tab to left
    this.closest('#pnlBox3DMockup').querySelector('.pnlBottomBoxThumb3').style.translate = "202%"; //slide thumb to right
}
document.getElementById('pnlBox3DMockup').querySelector('.btnMockupBox').addEventListener('click', btnBottomClick); //default the btnStyle to white
document.getElementById('pnlBox3DMockup').querySelector('.btnMockupBox').addEventListener('mouseover', btnBottomHover);
document.getElementById('pnlBox3DMockup').querySelector('.btnMockupBox').addEventListener('mouseleave', btnBottomLeave);
document.getElementById('pnlBox3DMockup').querySelector('.btnMockupBox').addEventListener('click', showMockupBox3D);
document.getElementById('pnlBox3DMockup').querySelector('.btnMockupBox').children[0].style.transition = ".2s";

////////////////////////////RECREATE////////////////////////////

async function recreate3DMockup(f, id) {
    
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

    let globalEnv = valueFinder(dataEnv, 'dropdown 0');
    
    let canvas = cnvGrpLayers.querySelector(`[data-ref='${f}']`).firstElementChild;

    engine[f]?.dispose();
    engine[f] = new BABYLON.Engine(canvas, true);
    scene[f] = new BABYLON.Scene(engine[f]);
    scene[f].clearColor = new BABYLON.Color4(0,0,0,0);

    ///////////////////////ENVIRONMENT/////////////////////////
    let env = await fetchEnvironmentFromCache(globalEnv)
    .then((env) => {
        return env;
    })

    let i = env.index;
    let envURL = URL.createObjectURL(env.source);

    //[!] IMPORTANT
    //WHEN USING CUBETEXTURE ONLY WITHOUT PREFILTERED, USE NEW BABYLON TO WORK
    //ALSO USE FORCE EXTENSION WHICH IS THE 10TH PARAMETER AND ENFORCE WHAT FILE TYPE THIS IS
    //IF WILL BE USING CUBETEXTURE.CREATEPREFILTEREDDATA, DON'T USE 'NEW' BABYLON
    //ALSO USE A DIRECT URL STRING THAT ENDS WITH .ENV
    //ONLY 2 PARAMETERS ARE NEEDED, STRING URL AND SCENE

    hdrTexture[i] = new BABYLON.CubeTexture(envURL, scene[f], null, false, null, null, null, null, null, '.env');
    scene[f].environmentTexture = hdrTexture[i];
    scene[f].environmentTexture.rotationY = degToRad(envRotation);
    hdrTexture[i].onLoadObservable.addOnce(() => {
        URL.revokeObjectURL(envURL);
    });
    
    ////////////////////////CAMERA///////////////////
    camera[f] = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3.Zero(), scene[f]);
    camera[f].setPosition(new BABYLON.Vector3(0, 0, -2));
    camera[f].setTarget(BABYLON.Vector3.Zero());
    camera[f].attachControl(canvas, true);
    
    ////////////////////////MODEL/MESH///////////////
    let element = await fetchRowByIdFromCache('elements', id)
    .then((element) => {
        return element;
    })

    let glbURL = URL.createObjectURL(element.source);

    let model = await BABYLON.SceneLoader.ImportMeshAsync("", "", glbURL, scene[f], null, '.glb');
    model.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
    model.meshes[0].position = BABYLON.Vector3.Zero();
    model.meshes[0].scale = new BABYLON.Vector3(.7, .7, .7);
    URL.revokeObjectURL(glbURL);

    //[!] RECOLOR ALL AVAILABLE MESHES
    let rgba = valueFinder(dataLayer[f], 'txtColorDiffuse');
    let alpha = rgbaString2AlphaEncoding(rgba) / 100;

    for(let b = 1; b < scene[f].meshes.length; b++) {

        let matName = scene[f].meshes[b].material.name;

        if(matName.includes('delta_')) {
            scene[f].meshes[b].material.albedoColor = rgba2BabylonRGB(rgba);
            scene[f].meshes[b].material.alpha = alpha;
        }
    }

    hideShowMesh(f, true);
    ///////////////////////NOW START UPDATING THE SETTINGS/////////////////////
    
    //UPDATE THE FILMIC OR SRGB COLOR PROFILE
    change3DEnvironmentFilmic();

    //UPDATE THE BLUR OR FOCUS
    adjust3DEnvironmentBlur();

    //UPDATE THE ROTATION
    adjust3DEnvironmentRotation();

    //UPDATE THE EXPOSURE
    adjust3DEnvironmentExposure();
    
    scene[f].executeWhenReady(() => renderScene(f));

    await recreateTexture(f);
}

async function recreateTexture(f) {

    //sir, 2026-10-13: THE CALLERS ALREADY await THIS, BUT IT RETURNED BEFORE ANY IMAGE HAD LOADED,
    //SO THE PRINT APPEARED AFTER THE COVER LIFTED. ONE PROMISE PER AREA NOW, AND THIS WAITS FOR ALL
    let loads = [];

    for(let area in data3D[f]) {

        //make sure the area is not 'lastArea' or 'ref'
        if(area != 'lastArea' && area != 'ref') {

            if(data3D[f][area].texture != "") {

                loads.push(new Promise((resolve) => {

                    let img = new Image();

                    //AN IMAGE THAT NEVER ANSWERS MUST NOT HOLD THE FILE OPEN OR AN UNDO
                    let cap = setTimeout(resolve, 8000);
                    let done = () => { clearTimeout(cap); resolve(); };

                    img.onerror = done;

                    img.onload = function() {

                        //try SO A MISSING MATERIAL CANNOT LEAVE THE PROMISE PENDING
                        try {

                            let canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;

                            let ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            
                            for(let b = 1; b < scene[f].meshes.length; b++) {

                                let matName = scene[f].meshes[b].material.name;

                                if(matName.includes(`print_${area}`)) {

                                    let dynamicTexture = new BABYLON.DynamicTexture("", canvas, scene[f]);
                                    
                                    dynamicTexture.update();

                                    scene[f].meshes[b].material.albedoTexture = dynamicTexture;
                                    scene[f].meshes[b].material.opacityTexture = dynamicTexture;
                                    scene[f].meshes[b].material.transparencyMode = BABYLON.Engine.ALPHA_COMBINE;
                                    
                                    hideShowMesh(f, true);

                                    //NO hideLoading() - NOTHING HERE CALLED showLoading(), SO IT RELEASED
                                    //THE CALLER'S COUNT AND LIFTED THE COVER EARLY. THE CALLERS LIFT IT

                                    //[!] SAME SHADER RECOMPILE AS adjustTexture - A BARE
                                    //RENDER HERE DRAWS THE MODEL WITHOUT ITS PRINT
                                    scene[f].executeWhenReady(() => renderScene(f));

                                }
                            }
                        }
                        finally {
                            done();
                        }
                    };

                    img.src = data3D[f][area].texture;
                }));
            }
        }
        
    }

    await Promise.all(loads);
}

///////////////////////////THIS IS FOR OPENING FILE WITH 3D///////////////////////

async function recreateAll3DMockup() {

    let globalEnv = valueFinder(dataEnv, 'dropdown 0');
    
    ///////////////////////ENVIRONMENT/////////////////////////
    let env = await fetchEnvironmentFromCache(globalEnv)
    .then((env) => {
        return env;
    })

    let i = env.index;

    for(let f = 0; f < maxF; f++) {

        if(data3D[f] != null) {

            let id = valueFinder(dataLayer[f], 'id')

            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`).querySelector('canvas');

            //get model rotation from datalayer
            //flip Y and Z since it's flipped too in slider
            //convert to radian
            let modelXRotation = degToRad(Number(valueFinder(dataLayer[f], 'txtXRotation')));
            let modelYRotation = degToRad(Number(valueFinder(dataLayer[f], 'txtYRotation'))*-1);
            let modelZRotation = degToRad(Number(valueFinder(dataLayer[f], 'txtZRotation'))*-1);

            //replace space with %20
            engine[f]?.dispose();
            engine[f] = new BABYLON.Engine(canvas, true);
            scene[f] = new BABYLON.Scene(engine[f]);
            scene[f].clearColor = new BABYLON.Color4(0,0,0,0);

            let envURL = URL.createObjectURL(env.source);
            hdrTexture[i] = await new BABYLON.CubeTexture(envURL, null, null, false, null, null, null, null, null, '.env');
            scene[f].environmentTexture = hdrTexture[i];
            scene[f].environmentTexture.rotationY = degToRad(envRotation);
            hdrTexture[i].onLoadObservable.addOnce(() => {
                URL.revokeObjectURL(envURL);
            });

            ////////////////////////CAMERA///////////////////
            camera[f] = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3.Zero(), scene[f]);
            camera[f].setPosition(new BABYLON.Vector3(0, 0, -2));
            camera[f].setTarget(BABYLON.Vector3.Zero());
            camera[f].attachControl(canvas, true);
            
            ////////////////////////MODEL/MESH///////////////
            let element = await fetchRowByIdFromCache('elements', id)
            .then((element) => {
                return element;
            })

            let glbURL = URL.createObjectURL(element.source);

            let model = await BABYLON.SceneLoader.ImportMeshAsync("", "", glbURL, scene[f], null, '.glb');
            model.meshes[0].rotation = new BABYLON.Vector3(modelXRotation, modelYRotation, modelZRotation);
            model.meshes[0].position = BABYLON.Vector3.Zero();
            model.meshes[0].scale = new BABYLON.Vector3(.7, .7, .7);
            URL.revokeObjectURL(glbURL);

            //[!] RECOLOR ALL AVAILABLE MESHES
            let rgba = valueFinder(dataLayer[f], 'txtColorDiffuse');
            let alpha = rgbaString2AlphaEncoding(rgba) / 100;

            for(let b = 1; b < scene[f].meshes.length; b++) {

                let matName = scene[f].meshes[b].material.name;

                if(matName.includes('delta_')) {
                    scene[f].meshes[b].material.albedoColor = rgba2BabylonRGB(rgba);
                    scene[f].meshes[b].material.alpha = alpha;
                }
            }

            hideShowMesh(f, true);
            ///////////////////////NOW START UPDATING THE SETTINGS/////////////////////

            //UPDATE THE FILMIC OR SRGB COLOR PROFILE
            change3DEnvironmentFilmic();

            //UPDATE THE BLUR OR FOCUS
            adjust3DEnvironmentBlur();

            //UPDATE THE ROTATION
            adjust3DEnvironmentRotation();

            //UPDATE THE EXPOSURE
            adjust3DEnvironmentExposure();
            
            scene[f].executeWhenReady(() => renderScene(f));

            await recreateTexture(f)
            
        }
    }

}






























/////////////////////////////////////////3D ENVIRONMENT////////////////////////////////

//CREATE 3DEnvironment
async function create3DEnvironment() {

    let globalEnv = 'Indoor White Light';
    
    let cnvEnv = document.getElementById('cnvEnv');

    let canvas = cnvEnv.querySelector('canvas');

    ////////////////////CUBEMAPS//////////////
    let data = await fetchCubemapsFromCache(globalEnv);
    
    //RETRY IF NULL
    if(data == null) {
        data = await fetchCubemapsFromCache(globalEnv);
    }

    //STILL NULL MEANS A DOWNLOAD FAILED. STOP HERE INSTEAD OF THROWING
    if(data == null) return;

    /////////////////////USE INDEX FOR CUBEMAPURL ARRAY//////////////////
    let i = data[0].index;
    envRotation = data[0].default_rotation;

    //CHECK IF THERE'S CUBEMAPURL[i] ALREADY THEN USE IT
    //IF NO THEN DECLARE
    if(!cubemapURL[i] || cubemapURL[i].length < 6) {

        cubemapURL[i] = [];

        //THEN GET ALL DATA CUBEMAP URL
        for(let a = 0; a < data.length; a++) {
            cubemapURL[i][a] = data[a].source;
        }
    }

    engineEnv?.dispose()
    engineEnv = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    sceneEnv = new BABYLON.Scene(engineEnv);
    sceneEnv.imageProcessingConfiguration.exposure = 3;
    sceneEnv.clearColor = new BABYLON.Color4(0,0,0,0);
    sceneEnv.imageProcessingConfiguration.toneMappingEnabled = true;
    sceneEnv.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;

    skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100.0 }, sceneEnv);
    skybox.rotation = new BABYLON.Vector3(0, degToRad(envRotation), 0);
    skybox.position = new BABYLON.Vector3.Zero();

    skyboxMaterial = new BABYLON.StandardMaterial("skyBox", sceneEnv);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture.CreateFromImages(cubemapURL[i], sceneEnv);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.backFaceCulling = false;
    
    skybox.material = skyboxMaterial;

    cameraEnv = new BABYLON.ArcRotateCamera("Camera", degToRad(0), degToRad(0), 0, new BABYLON.Vector3.Zero(), sceneEnv);
    cameraEnv.setPosition(new BABYLON.Vector3(0, 0, 0));
    cameraEnv.setTarget(BABYLON.Vector3.Zero());
    cameraEnv.alpha = degToRad(0);
    
    focusEnv = new BABYLON.LensRenderingPipeline('lensEffects', {
        blur_noise: false,
		dof_focus_distance: 100,
		dof_aperture: 1.2,			// set this very high for tilt-shift effect
    }, sceneEnv, 1.0, cameraEnv);

    
    engineEnv.runRenderLoop(function () {
        if(chkMode.dataset.value != "3D") return;
        sceneEnv.render();
    });
    

    /*
    console.clear();
    for(let a = 0; a < maxH; a++) {
       console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < maxH; a++) {
       console.log(redoHistory[a])
    }
    */

}

///////////////////////////THIS IS FOR CHOOSING 3D ENVIRONMENT///////////////////////
function choose3DEnvironment() {
    showLoading();

    //finally, NOT then. A BUILD THAT THROWS (A FAILED DOWNLOAD, OR NO ENGINE TO SWAP THE SKYBOX ON) WOULD OTHERWISE LEAVE
    //THE COVER UP AND THE KEYBOARD BLOCKED FOR GOOD
    setTimeout( async ()=> {
        await update3DEnvironment.call(this)
        .finally(() => {
            hideLoading();
        })
    },200)
}
document.querySelectorAll('.optEnvironment')
.forEach((opt) => {
    opt.addEventListener('pointerdown', choose3DEnvironment);
})


//CHANGE 3DENVIRONMENT AND UPDATE ALL 3D OBJECTS
async function update3DEnvironment() {

    //CHANGE FIRST THE DROPDOWN TEXT (BASIC)
    this.closest('.pnlDrop').children[0].children[0].innerText = this.innerText;

    let globalEnv = this.innerText;

    ////////////////////CUBEMAPS//////////////
    let data = await fetchCubemapsFromCache(globalEnv);
    
    //RETRY IF NULL
    if(data == null) {
        data = await fetchCubemapsFromCache(globalEnv);
    }

    //STILL NULL MEANS A DOWNLOAD FAILED. STOP HERE INSTEAD OF THROWING
    if(data == null) return;

    /////////////////////USE INDEX FOR CUBEMAPURL ARRAY//////////////////
    let i = data[0].index;
    envRotation = data[0].default_rotation;

    //CHECK IF THERE'S CUBEMAPURL[i] ALREADY THEN USE IT
    //IF NO THEN DECLARE
    if(!cubemapURL[i] || cubemapURL[i].length < 6) {

        cubemapURL[i] = [];

        //THEN GET ALL DATA CUBEMAP URL
        for(let a = 0; a < data.length; a++) {
            cubemapURL[i][a] = data[a].source;
        }
    } 

    skybox.material.reflectionTexture.dispose();
    skyboxMaterial = new BABYLON.StandardMaterial("skyBox", sceneEnv);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture.CreateFromImages(cubemapURL[i], sceneEnv);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.backFaceCulling = false;
    skybox.material = skyboxMaterial;
  
    skybox.rotation = new BABYLON.Vector3(0, degToRad(envRotation), 0);

    /////////////////////////.ENV MAP//////////////////
    let env = await fetchEnvironmentFromCache(globalEnv)
    .then((env) => {
        return env;
    })

    for(let f = 0; f < maxF; f++) {

        if(scene[f] != null) {
            
            let envURL = URL.createObjectURL(env.source);

            //if(hdrTexture[i] != null) {
                hdrTexture[i] = new BABYLON.CubeTexture(envURL, scene[f], null, false, null, null, null, null, null, '.env');
            //}

            if(hdrTexture[i] != scene[f].environmentTexture) {
                scene[f].environmentTexture.dispose();
                scene[f].environmentTexture = hdrTexture[i];
            }

            //[!] INSIDE THE CALLBACK - THE ENV MAP LANDS ASYNCHRONOUSLY, SO A
            //RENDER ISSUED BELOW THIS LOOP WOULD DRAW THE OLD LIGHTING.
            //executeWhenReady ON TOP OF THAT, BECAUSE SWAPPING THE ENVIRONMENT
            //TEXTURE ALSO FORCES THE MATERIALS TO RECOMPILE
            hdrTexture[i].onLoadObservable.addOnce(() => {
                URL.revokeObjectURL(envURL);
                scene[f].executeWhenReady(() => renderScene(f));
            });

        }
    }

    //UPDATE THE FILMIC OR SRGB COLOR PROFILE
    change3DEnvironmentFilmic();

    //UPDATE THE BLUR OR FOCUS
    adjust3DEnvironmentBlur();

    //UPDATE THE ROTATION
    adjust3DEnvironmentRotation();

    //UPDATE THE EXPOSURE
    adjust3DEnvironmentExposure();
    
}

//SWITCH TO FILMIC OR SRGB COLOR PROFILE
function change3DEnvironmentFilmic() {

    let pnlBox3DEnvironment = document.getElementById('pnlBox3DEnvironment');
    let chkFilmic = pnlBox3DEnvironment.querySelector('.chkFilmic');

    if(chkFilmic.dataset.value == "true") {
        //SWITCH THE ENV TO FILMIC
        sceneEnv.imageProcessingConfiguration.toneMappingEnabled = true;
        sceneEnv.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_STANDARD;

        //SWITCH ALL THE 3D SCENESE TO sRGB
        for(let f = 0; f < maxF; f++) {
            
            if(scene[f] != null) {
                scene[f].imageProcessingConfiguration.toneMappingEnabled = true;
                scene[f].imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_STANDARD;
                renderScene(f);
            }
        }
    }
    else {

        //SWITCH THE ENV TO FILMIC
        sceneEnv.imageProcessingConfiguration.toneMappingEnabled = true;
        sceneEnv.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;

        //SWITCH ALL THE 3D SCENESE TO sRGB
        for(let f = 0; f < maxF; f++) {
            
            if(scene[f] != null) {
                scene[f].imageProcessingConfiguration.toneMappingEnabled = true;
                scene[f].imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
                renderScene(f);
            }
        }
    }
}
document.getElementById('pnlBox3DEnvironment').querySelector('.chkFilmic').addEventListener('click', change3DEnvironmentFilmic);

//ADJUST 3DENVIRONMENT BLUR
function adjust3DEnvironmentBlur() {

    let pnlBox3DEnvironment = document.getElementById('pnlBox3DEnvironment');
    let txtEnvBlur = pnlBox3DEnvironment.querySelector('.txtEnvBlur');

    let distance = Number(txtEnvBlur.value) / 10;
    let aperture = Number(txtEnvBlur.value) / 100;

    focusEnv._dofDistance = distance;
    focusEnv._dofAperture = aperture;
    
}
document.getElementById('pnlBox3DEnvironment').querySelector('.txtEnvBlur').addEventListener('change', adjust3DEnvironmentBlur);
document.getElementById('pnlBox3DEnvironment').querySelector('.txtEnvBlur').previousElementSibling.addEventListener('input', adjust3DEnvironmentBlur);

//ADJUST 3DENVIRONMENT ROTATION
function adjust3DEnvironmentRotation() {

    let pnlBox3DEnvironment = document.getElementById('pnlBox3DEnvironment');

    let rotation = pnlBox3DEnvironment.querySelector('.txtEnvRotation').value *-1;

    let newAlpha = degToRad(rotation);

    //ROTATE ENVIRONMENT CAMERA
    cameraEnv.alpha = newAlpha;
    //SWITCH ALL THE 3D SCENESE TO sRGB
    for(let f = 0; f < maxF; f++) {
        
        if(scene[f] != null) {
            scene[f].environmentTexture.rotationY = degToRad(envRotation) - newAlpha;
            renderScene(f);
        }
    }
}
document.getElementById('pnlBox3DEnvironment').querySelector('.txtEnvRotation').addEventListener('change', adjust3DEnvironmentRotation);
document.getElementById('pnlBox3DEnvironment').querySelector('.txtEnvRotation').previousElementSibling.addEventListener('input', adjust3DEnvironmentRotation);

//ADJUST 3DENVIRONMENT EXPOSURE/BRIGHTNESS
function adjust3DEnvironmentExposure() {

    //ENV EXPOSURE DEFAULT = 3
    let pnlBox3DEnvironment = document.getElementById('pnlBox3DEnvironment');
    let val = pnlBox3DEnvironment.querySelector('.txtEnvExposure').value;

    let envVal = val * (3/100);

    sceneEnv.imageProcessingConfiguration.exposure = envVal;
    
    for(let f = 0; f < maxF; f++) {
        if(scene[f] != null) {
            scene[f].environmentIntensity = envVal * 0.333;
            renderScene(f);
        }
    }

}
document.getElementById('pnlBox3DEnvironment').querySelector('.txtEnvExposure').addEventListener('change', adjust3DEnvironmentExposure);
document.getElementById('pnlBox3DEnvironment').querySelector('.txtEnvExposure').previousElementSibling.addEventListener('input', adjust3DEnvironmentExposure);

///////////////////////////THIS IS FOR OPENING FILE WITH 3D///////////////////////
async function recreate3DEnvironment() {

    let globalEnv = valueFinder(dataEnv, 'dropdown 0');

    //THE FILE'S OWN ENVIRONMENT VALUES, NOT DEFAULTS. SAME MATHS AS THE ADJUST FUNCTIONS
    let envExposure = Number(valueFinder(dataEnv, 'txtEnvExposure')) * (3/100);
    let envBlur = Number(valueFinder(dataEnv, 'txtEnvBlur'));
    let envAlpha = degToRad(Number(valueFinder(dataEnv, 'txtEnvRotation')) * -1);
    let envFilmic = valueFinder(dataEnv, 'chkFilmic') == "true";

    let cnvEnv = document.getElementById('cnvEnv');

    let canvas = cnvEnv.querySelector('canvas');

    ////////////////////CUBEMAPS//////////////
    let data = await fetchCubemapsFromCache(globalEnv);
    
    //RETRY IF NULL
    //if(!data) {
    //    data = await fetchCubemapsFromCache(globalEnv);
    //}

    /////////////////////USE INDEX FOR CUBEMAPURL ARRAY//////////////////
    let i = data[0].index;
    envRotation = data[0].default_rotation;

    //CHECK IF THERE'S CUBEMAPURL[i] ALREADY THEN USE IT
    //IF NO THEN DECLARE
    if(!cubemapURL[i] || cubemapURL[i].length < 6) {

        cubemapURL[i] = [];

        //THEN GET ALL DATA CUBEMAP URL
        for(let a = 0; a < data.length; a++) {
            cubemapURL[i][a] = data[a].source;
        }
    } 

    engineEnv?.dispose()
    engineEnv = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    sceneEnv = new BABYLON.Scene(engineEnv);
    sceneEnv.imageProcessingConfiguration.exposure = envExposure;
    sceneEnv.clearColor = new BABYLON.Color4(0,0,0,0);
    sceneEnv.imageProcessingConfiguration.toneMappingEnabled = true;
    sceneEnv.imageProcessingConfiguration.toneMappingType = envFilmic ? BABYLON.ImageProcessingConfiguration.TONEMAPPING_STANDARD : BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;

    skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100.0 }, sceneEnv);
    skybox.rotation = new BABYLON.Vector3(0, degToRad(envRotation), 0);
    skybox.position = new BABYLON.Vector3.Zero();

    skyboxMaterial = new BABYLON.StandardMaterial("skyBox", sceneEnv);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture.CreateFromImages(cubemapURL[i], sceneEnv);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.backFaceCulling = false;
    
    skybox.material = skyboxMaterial;

    cameraEnv = new BABYLON.ArcRotateCamera("Camera", degToRad(0), degToRad(0), 0, new BABYLON.Vector3.Zero(), sceneEnv);
    cameraEnv.setPosition(new BABYLON.Vector3(0, 0, 0));
    cameraEnv.setTarget(BABYLON.Vector3.Zero());
    cameraEnv.alpha = envAlpha;
    
    focusEnv = new BABYLON.LensRenderingPipeline('lensEffects', {
        blur_noise: false,
		dof_focus_distance: 100,
		dof_aperture: 1.2,			// set this very high for tilt-shift effect
    }, sceneEnv, 1.0, cameraEnv);

    //BLUR GOES ON THE PIPELINE AFTER IT EXISTS, SAME TWO FIELDS adjust3DEnvironmentBlur WRITES
    focusEnv._dofDistance = envBlur / 10;
    focusEnv._dofAperture = envBlur / 100;

    engineEnv.runRenderLoop(function () {
        if(chkMode.dataset.value != "3D") return;
        sceneEnv.render();
    });
 
}














