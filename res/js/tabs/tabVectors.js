let svgOldW = [];
let svgOldH = [];

//===============================VECTOR LAYER==============================
//actual function to create pnlBoxProperties
function addPnlBoxVector(f, n, name, source, post, subtype) {  //adding controls only for 'IMAGE' panel boxes

    dataLayer[f] = '\n*';
    dataLayer[f] += `\nref: ${f}`;
    dataLayer[f] += `\npnlBoxVector: ${name}`;
    dataLayer[f] += `\nthumbno: ${n}`;
    dataLayer[f] += `\nshow: visible`;
    dataLayer[f] += `\nlock: unlock`;
    dataLayer[f] += `\nmask: unmask`;
    dataLayer[f] += `\ndropdown 0: Normal`;
    dataLayer[f] += `\ntxtWidthLayer: 0`;
    dataLayer[f] += `\ntxtHeightLayer: 0`;
    dataLayer[f] += `\ntxtXLayer: 0`;
    dataLayer[f] += `\ntxtYLayer: 0`;
    dataLayer[f] += `\nchkFlipX: false`;
    dataLayer[f] += `\nchkFlipY: false`;
    dataLayer[f] += `\ntxtOpacityLayer: 100`;
    dataLayer[f] += `\ntxtRotationLayer: 0`;

    dataLayer[f] += `\ntxtSubLayer: 0`;
    dataLayer[f] += `\ndropdown 1: Stroke`;
    dataLayer[f] += `\ntxtVectorStrokeColor: rgba(0, 0, 0, 1)`;
    dataLayer[f] += `\ntxtVectorFillColor: rgba(0, 0, 0, 1)`;

    createCanvasVector(f, n, name, 'vector', source, post, subtype)

}

function createCanvasVector(f, n, name, type, source, post, subtype) {

    let txtSizeWidth = document.querySelector('.txtSizeWidth');
    let txtSizeHeight = document.querySelector('.txtSizeHeight');

    cnvLayers[f] = document.createElement('div');
    cnvLayers[f].style.visibility = "visible";
    cnvLayers[f].classList.add('cnvLayers');
    cnvLayers[f].dataset.rotation = 0;
    cnvLayers[f].dataset.ref = f;
    cnvLayers[f].dataset.thumbno = n;
    cnvLayers[f].dataset.source = encodeURIComponent(source);
    cnvLayers[f].dataset.type = type;
    cnvLayers[f].dataset.subtype = subtype;
    cnvLayers[f].dataset.type = 'vector';
    cnvLayers[f].dataset.lock = "unlock";
    cnvLayers[f].dataset.mask = "unmask";

    //add first image  so we can adjust the left and right of the cnvlayer
    //use [f] to get pnlBoxLayer dataset of thumbNo 
    //index it back to pnlBoxThumb and get children[0] which is img and get src
    let getSVG = null;

    if(type == "vector") {
        
        if(subtype == "vector") {
            getSVG = decodeURIComponent(valueFinder(dataThumb[n], 'source'));
        }
        else {
            getSVG = source;
        }
    }
    
    getSVG = reformatImportedSVG(f, getSVG);

    cnvLayers[f].innerHTML = getSVG;

    cnvLayers[f].children[0].style.filter = "none";
    //cnvLayers[f].querySelector('svg').setAttribute('width', '100%');
    //cnvLayers[f].querySelector('svg').setAttribute('height', '100%');
    cnvLayers[f].children[0].style.width = "100%";
    cnvLayers[f].children[0].style.height = "100%";

    //then append cnvlayer to cnvmain
    cnvGrpLayers.appendChild(cnvLayers[f]);
    
    //get which is smaller if canvas width or canvas height
    let aspectRatio;
    let vectorW = parseFloat(cnvLayers[f].querySelector('svg').getAttribute('width'));
    let vectorH = parseFloat(cnvLayers[f].querySelector('svg').getAttribute('height'));

    if(Number(txtSizeWidth.value) > Number(txtSizeHeight.value)) {
        aspectRatio = vectorW / vectorH;

        if(Number.isNaN(aspectRatio) || aspectRatio == null || aspectRatio === undefined) {
            aspectRatio = Number(txtSizeWidth.value) / Number(txtSizeHeight.value);
        }

        if(vectorH >= Math.round(txtSizeHeight.value * 0.5)) {
            cnvLayers[f].style.height = `${Math.round(txtSizeHeight.value * 0.5)}px`;
            cnvLayers[f].style.width =  `${Math.round(cnvLayers[f].clientHeight * aspectRatio)}px`;
        }
        else {
            cnvLayers[f].style.height = `${Math.round(txtSizeHeight.value * 0.5)}px`;
            cnvLayers[f].style.width =  `${Math.round(txtSizeHeight.value * 0.5) * aspectRatio}px`;
        }
        
    }
    else if(Number(txtSizeWidth.value) < Number(txtSizeHeight.value)) {
        aspectRatio = vectorH / vectorW;

        if(Number.isNaN(aspectRatio) || aspectRatio == null || aspectRatio === undefined) {
            aspectRatio = Number(txtSizeHeight.value) / Number(txtSizeWidth.value);
        }

        if(vectorW >= Math.round(txtSizeWidth.value * 0.5)) {
            cnvLayers[f].style.width = `${Math.round(txtSizeWidth.value * 0.5)}px`;
            cnvLayers[f].style.height = `${Math.round(cnvLayers[f].clientWidth * aspectRatio)}px`;
        }
        else {
            cnvLayers[f].style.width = `${Math.round(txtSizeWidth.value * 0.5)}px`;
            cnvLayers[f].style.height = `${Math.round(txtSizeWidth.value * 0.5) * aspectRatio}px`;
        }
        
    }
    else if(Number(txtSizeWidth.value) == Number(txtSizeHeight.value)) {
        
        aspectRatio = vectorH / vectorW;

        if(Number.isNaN(aspectRatio) || aspectRatio == null || aspectRatio === undefined) {
            aspectRatio = Number(txtSizeHeight.value) / Number(txtSizeWidth.value);
        }

        if(vectorW >= Math.round(txtSizeWidth.value * 0.5)) {
            cnvLayers[f].style.width = `${Math.round(txtSizeWidth.value * 0.5)}px`;
            cnvLayers[f].style.height = `${Math.round(cnvLayers[f].clientWidth * aspectRatio)}px`;
        }
        else {
            cnvLayers[f].style.width = `${Math.round(txtSizeWidth.value * 0.5)}px`;
            cnvLayers[f].style.height = `${Math.round(txtSizeWidth.value * 0.5) * aspectRatio}px`;
        }
    }

    //set min width and height
    //1x1 IS THE DESIGN FLOOR. THE 20px ON SCREEN IS THE PIN'S - SEE PIN_MIN_PX IN tabLayers.js
    cnvLayers[f].style.minWidth = 1 + 'px';
    cnvLayers[f].style.minHeight = 1 + 'px';

    //position cnvlayer to center
    positionCanvas(cnvLayers[f]);

    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtWidthLayer', `${cnvLayers[f].clientWidth}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtHeightLayer', `${cnvLayers[f].clientHeight}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', `${cnvLayers[f].offsetLeft}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', `${cnvLayers[f].offsetTop}`);

    createHistory(f, name, 'vector', n);

    //add border
    addBorderLayer(cnvLayers[f], f);

     //DO NOT USE CLICK HERE [!]
    //USING CLICK IS MAKING UP ERROR
    //SINCE MULTIPLE IMAGES AND VECTORS
    //CAN BE UPLOADED AT ONCE
    //IT'S CAUSING CLICK ERROR
    //JUST USE FOCUS FUNCTION INSTEAD 
    canvas2Focus(cnvLayers[f]);

}

function previewVector() {

    //NOTE: this i is index of the 'option' not index of the tabStyle
    let i = Number(this.value)-1;
    let panel = document.getElementById('pnlBoxVector');

    //preview in panel
    let tabVectorPreview = this.closest('.tabSubLayer').querySelector('.tabVectorPreview');
    let svgChildren = tabVectorPreview.querySelectorAll('svg *:not(g)[fill], svg *:not(g)[stroke]');
    
    //grayscale all svg children
    if(i+1 > 0) {

        for(let a = 0; a < svgChildren.length; a++) {
            svgChildren[a].setAttribute("style", "filter: opacity(0%)");
        }

        //now recolor this
        svgChildren[i]?.setAttribute("style", "filter: opacity(100%)");

        //APPEND SELECTIONS WHEN THERE'S A PATH SELECTED
        panel.querySelector('.contNoPath').style.display = "none";
        panel.querySelector('.contPath').style.display = "block";

    }

    else if(i+1 == 0) {

        for(let a = 0; a < svgChildren.length; a++) {
            svgChildren[a].setAttribute("style", "filter: opacity(100%)");
        }

        //EMPTY OUT THE TAB SINCE NO PATH IS SELECTED
        panel.querySelector('.contNoPath').style.display = "block";
        panel.querySelector('.contPath').style.display = "none";

    }
}

function getAllPathProperties() {

    let f = Number(leadPanel.dataset.ref);
    let tabColorBox = document.getElementById('pnlBoxVector').querySelector('.tabColorBox');
    let tabVectorPreview = document.querySelector('.tabVectorPreview');
    let preview = tabVectorPreview.querySelectorAll('svg *[fill], svg *[stroke]');
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let b = Number(this.value)-1;

    tabColorBox.querySelector('.dropOptionVerti').innerHTML = "";

    if(b >= 0) {

        /////////////////ONLY STROKE IS PRESENT/////////////////////
        if(preview[b].hasAttribute('stroke') && !preview[b].hasAttribute('fill')) {

            //simulate click on stroke
            tabColorBox.querySelector('.dropOptionVerti').innerHTML = 
            `<div class="optVectorColor">Stroke</div>`;
            
            document.querySelectorAll('.optVectorColor').addEventListener('pointerdown', chooseVectorTab);

            tabColorBox.querySelector('.optVectorColor').dispatchEvent(new PointerEvent ("pointerdown", {bubbles: true}))

            let strokeColor = preview[b].getAttribute('stroke');

            //GRADIENT COLOR
            if(strokeColor.includes('url')) {

                let defsID = strokeColor.replace('url(#', '');
                defsID = defsID.replace(')', '');

                 let defsGradient = canvas.querySelector(`#${defsID}`).outerHTML;
                defsGradient = defsGradient2GradientString(defsGradient);

                document.querySelector('.txtVectorStrokeColor').dataset.gradient = defsGradient;

                if(defsGradient.includes('linear')) {
                    document.querySelector('.txtVectorStrokeColor').value = "Linear";
                }
                else if(defsGradient.includes('radial')) {
                    document.querySelector('.txtVectorStrokeColor').value = "Radial";
                }

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorStrokeColor').nextElementSibling;
                thumbPicker.children[1].style.background = defsGradient;
                
            }
            //RGBA COLOR
            else if(strokeColor.includes('rgba')) {

                let hex = rgbaString2HexEncoding(strokeColor);
                
                document.querySelector('.txtVectorStrokeColor').value = hex;

                let alpha = rgbaString2AlphaEncoding(strokeColor);

                if(alpha != null || alpha != undefined || alpha != NaN) {
                    document.querySelector('.txtVectorStrokeColor').dataset.alpha = Number(alpha/100);
                }  

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorStrokeColor').nextElementSibling;
                thumbPicker.children[1].style.background = strokeColor;
                
            }
            //HEX COLOR
            else {

                document.querySelector('.txtVectorStrokeColor').value = strokeColor;
                testHexCode(document.querySelector('.txtVectorStrokeColor'))

                //[!] INCLUDE THIS HERE THIS IS FOR DATASET ALPHA FOR RGB AND GRADIENT
                //FOR ENCODING AND CONVERSION
                if(preview[b].hasAttribute('stroke-opacity')) {
                    document.querySelector('.txtVectorStrokeColor').dataset.alpha = preview[b].getAttribute('stroke-opacity');
                }
                else {
                    document.querySelector('.txtVectorStrokeColor').dataset.alpha = "1";
                }  

                let rgb = hex2RGBStringEncoding(document.querySelector('.txtVectorStrokeColor').value);
                let alpha = document.querySelector('.txtVectorStrokeColor').dataset.alpha;

                if(alpha == null || alpha == undefined || null == NaN) {
                    if(preview[b].hasAttribute('stoke-opacity')) {
                        alpha = preview[b].getAttribute('stroke-opacity');
                    }
                    else {
                        alpha = "1";
                    }
                }

                let rgba = `rgba(${rgb}, ${alpha})`;

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorStrokeColor').nextElementSibling;
                thumbPicker.children[1].style.background = rgba;

            }

        }

        /////////////////ONLY FILL IS PRESENT/////////////////////
        else if(!preview[b].hasAttribute('stroke') && preview[b].hasAttribute('fill')) {
            
            //simulate click on stroke
            tabColorBox.querySelector('.dropOptionVerti').innerHTML = 
            `<div class="optVectorColor">Fill</div>`;

            document.querySelector('.optVectorColor').addEventListener('pointerdown', chooseVectorTab);

            tabColorBox.querySelector('.optVectorColor').dispatchEvent(new PointerEvent ("pointerdown", {bubbles: true}))

            let fillColor = preview[b].getAttribute('fill');

            //GRADIENT COLOR
            if(fillColor.includes('url')) {

                let defsID = fillColor.replace('url(#', '');
                defsID = defsID.replace(')', '');

                let defsGradient = canvas.querySelector(`#${defsID}`).outerHTML;
                defsGradient = defsGradient2GradientString(defsGradient);

                document.querySelector('.txtVectorFillColor').dataset.gradient = defsGradient;

                if(defsGradient.includes('linear')) {
                    document.querySelector('.txtVectorFillColor').value = "Linear";
                }
                else if(defsGradient.includes('radial')) {
                    document.querySelector('.txtVectorFillColor').value = "Radial";
                }

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorFillColor').nextElementSibling;
                thumbPicker.children[1].style.background = defsGradient;

            }
            //RGBA COLOR
            else if(fillColor.includes('rgba')) {

                let hex = rgbaString2HexEncoding(fillColor);
                
                document.querySelector('.txtVectorFillColor').value = hex;

                let alpha = rgbaString2AlphaEncoding(fillColor);

                if(alpha != null || alpha != undefined || alpha != NaN) {
                    document.querySelector('.txtVectorFillColor').dataset.alpha = Number(alpha/100);
                }  
                
                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorFillColor').nextElementSibling;
                thumbPicker.children[1].style.background = fillColor;
            }
            //HEX COLOR
            else {

                document.querySelector('.txtVectorFillColor').value = fillColor;
                testHexCode(document.querySelector('.txtVectorFillColor'))

                //[!] INCLUDE THIS HERE THIS IS FOR DATASET ALPHA FOR RGB AND GRADIENT
                //FOR ENCODING AND CONVERSION
                if(preview[b].hasAttribute('fill-opacity')) {
                    document.querySelector('.txtVectorFillColor').dataset.alpha = preview[b].getAttribute('fill-opacity');
                }
                else {
                    document.querySelector('.txtVectorFillColor').dataset.alpha = "1";
                }

                let rgb = hex2RGBStringEncoding(document.querySelector('.txtVectorFillColor').value);
                let alpha = document.querySelector('.txtVectorFillColor').dataset.alpha;

                if(alpha == null || alpha == undefined || null == NaN) {
                    if(preview[b].hasAttribute('fill-opacity')) {
                        alpha = preview[b].getAttribute('fill-opacity');
                    }
                    else {
                        alpha = "1";
                    }
                }
                
                let rgba = `rgba(${rgb}, ${alpha})`;

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorFillColor').nextElementSibling;
                thumbPicker.children[1].style.background = rgba;

            }
            
        }

        /////////////////ELSE BOTH STROKE AND FILL IS PRESENT/////////////////////
        else {

            /////////////////////////STROKE/////////////////////
            tabColorBox.querySelector('.dropOptionVerti').innerHTML = 
            `<div class="optVectorColor">Stroke</div>
            <div class="optVectorColor">Fill</div>`;

            document.querySelectorAll('.optVectorColor')
            .forEach((opt) => {
                opt.addEventListener('pointerdown', chooseVectorTab);
            });

            tabColorBox.querySelector('.optVectorColor').dispatchEvent(new PointerEvent ("pointerdown", {bubbles: true}))

            let strokeColor = preview[b].getAttribute('stroke');
      
            //GRADIENT COLOR
            if(strokeColor.includes('url')) {

                let defsID = strokeColor.replace('url(#', '');
                defsID = defsID.replace(')', '');

                let defsGradient = canvas.querySelector(`#${defsID}`).outerHTML;
                defsGradient = defsGradient2GradientString(defsGradient);

                document.querySelector('.txtVectorStrokeColor').dataset.gradient = defsGradient;

                if(defsGradient.includes('linear')) {
                    document.querySelector('.txtVectorStrokeColor').value = "Linear";
                }
                else if(defsGradient.includes('radial')) {
                    document.querySelector('.txtVectorStrokeColor').value = "Radial";
                }

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorStrokeColor').nextElementSibling;
                thumbPicker.children[1].style.background = defsGradient;
            }
            //RGBA COLOR
            else if(strokeColor.includes('rgba')) {

                let hex = rgbaString2HexEncoding(strokeColor);
                
                document.querySelector('.txtVectorStrokeColor').value = hex;

                let alpha = rgbaString2AlphaEncoding(strokeColor);

                if(alpha != null || alpha != undefined || alpha != NaN) {
                    document.querySelector('.txtVectorStrokeColor').dataset.alpha = Number(alpha/100);
                }  

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorStrokeColor').nextElementSibling;
                thumbPicker.children[1].style.background = strokeColor;

            }
            //HEX COLOR
            else {

                document.querySelector('.txtVectorStrokeColor').value = strokeColor;
                testHexCode(document.querySelector('.txtVectorStrokeColor'))

                //[!] INCLUDE THIS HERE THIS IS FOR DATASET ALPHA FOR RGB AND GRADIENT
                //FOR ENCODING AND CONVERSION
                if(preview[b].hasAttribute('stroke-opacity')) {
                    document.querySelector('.txtVectorStrokeColor').dataset.alpha = preview[b].getAttribute('stroke-opacity');
                }
                else {
                    document.querySelector('.txtVectorStrokeColor').dataset.alpha = "1";
                }  

                let rgb = hex2RGBStringEncoding(document.querySelector('.txtVectorStrokeColor').value);
                let alpha = document.querySelector('.txtVectorStrokeColor').dataset.alpha;

                if(alpha == null || alpha == undefined || null == NaN) {
                    if(preview[b].hasAttribute('stoke-opacity')) {
                        alpha = preview[b].getAttribute('stroke-opacity');
                    }
                    else {
                        alpha = "1";
                    }
                }

                let rgba = `rgba(${rgb}, ${alpha})`;

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorStrokeColor').nextElementSibling;
                thumbPicker.children[1].style.background = rgba;
            }

            //////////////////////////////FILL///////////////////////////////////
            let fillColor = preview[b].getAttribute('fill');

            //GRADIENT COLOR
            if(fillColor.includes('url')) {

                let defsID = fillColor.replace('url(#', '');
                defsID = defsID.replace(')', '');

                 let defsGradient = canvas.querySelector(`#${defsID}`).outerHTML;
                defsGradient = defsGradient2GradientString(defsGradient);

                document.querySelector('.txtVectorFillColor').dataset.gradient = defsGradient;

                if(defsGradient.includes('linear')) {
                    document.querySelector('.txtVectorFillColor').value = "Linear";
                }
                else if(defsGradient.includes('radial')) {
                    document.querySelector('.txtVectorFillColor').value = "Radial";
                }

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorFillColor').nextElementSibling;
                thumbPicker.children[1].style.background = defsGradient;
            }
            //RGBA COLOR
            else if(fillColor.includes('rgba')) {

                let hex = rgbaString2HexEncoding(fillColor);
                
                document.querySelector('.txtVectorFillColor').value = hex;

                let alpha = rgbaString2AlphaEncoding(fillColor);

                if(alpha != null || alpha != undefined || alpha != NaN) {
                    document.querySelector('.txtVectorFillColor').dataset.alpha = Number(alpha/100);
                }  
                
                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorFillColor').nextElementSibling;
                thumbPicker.children[1].style.background = fillColor;
   
            }
            //HEX COLOR
            else {

                document.querySelector('.txtVectorFillColor').value = fillColor;
                testHexCode(document.querySelector('.txtVectorFillColor'))

                //[!] INCLUDE THIS HERE THIS IS FOR DATASET ALPHA FOR RGB AND GRADIENT
                //FOR ENCODING AND CONVERSION
                if(preview[b].hasAttribute('fill-opacity')) {
                    document.querySelector('.txtVectorFillColor').dataset.alpha = preview[b].getAttribute('fill-opacity');
                }
                else {
                    document.querySelector('.txtVectorFillColor').dataset.alpha = "1";
                }

                let rgb = hex2RGBStringEncoding(document.querySelector('.txtVectorFillColor').value);
                let alpha = document.querySelector('.txtVectorFillColor').dataset.alpha;

                if(alpha == null || alpha == undefined || null == NaN) {
                    if(preview[b].hasAttribute('fill-opacity')) {
                        alpha = preview[b].getAttribute('fill-opacity');
                    }
                    else {
                        alpha = "1";
                    }
                }

                let rgba = `rgba(${rgb}, ${alpha})`;

                //CHANGE THUMBPICKER COLOR
                let thumbPicker = document.querySelector('.txtVectorFillColor').nextElementSibling;
                thumbPicker.children[1].style.background = rgba;

                //dataLayer[f] = valueSwitcher(dataLayer[f], 'txtVectorFillColor', rgba);
            }   
            
        }

    }

}

document.getElementById('pnlBoxVector').querySelector('.txtSubLayer').addEventListener('change', previewVector);
document.getElementById('pnlBoxVector').querySelector('.txtSubLayer').addEventListener('change', getAllPathProperties);
document.getElementById('pnlBoxVector').querySelector('.txtSubLayer').previousElementSibling.addEventListener('input', previewVector);
document.getElementById('pnlBoxVector').querySelector('.txtSubLayer').previousElementSibling.addEventListener('input', getAllPathProperties);
document.getElementById('pnlBoxVector').querySelector('.txtSubLayer').previousElementSibling.addEventListener('change', getAllPathProperties);


for(let b = 0; b < document.querySelectorAll('.optVectorColor').length; b++) {
    //document.querySelectorAll('.optVectorColor')[b].addEventListener('click', chooseVectorTab)
}


function chooseVectorTab() {

    let opt = this.innerText;
    let contPath = this.closest('.contPath');
    
    contPath.querySelector('.dropdown').children[0].innerText = opt;

    if(opt == 'Stroke') {
        
        contPath.children[1].style.display = "block";
        contPath.children[2].style.display = "none";

        layerSequence = `\ntxtSubLayer: ${document.querySelector('.txtSubLayer').value}`;
        layerSequence += `\ntxtVectorStrokeColor: ${document.querySelector('.txtVectorStrokeColor').value}\n`;
        
    }
    else if(opt == 'Fill') {

        contPath.children[1].style.display = "none";
        contPath.children[2].style.display = "block";

        layerSequence = `\ntxtSubLayer: ${document.querySelector('.txtSubLayer').value}`;
        layerSequence += `\ntxtVectorFillColor: ${document.querySelector('.txtVectorFillColor').value}\n`;
        
    }

}

//ADD STROKE EVENTS----------------------------------------

function adjustVectorStrokeColor() {

    let f = Number(leadPanel.dataset.ref);
    let thumbPicker = this.nextElementSibling;
    let type = leadPanel.dataset.type;
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let i = Number(document.getElementById('pnlBoxVector').querySelector('.txtSubLayer').value) - 1;
    let tabVectorPreview = document.querySelector('.tabVectorPreview');
    let preview = tabVectorPreview.querySelectorAll('svg *:not(g)[stroke], svg *:not(g)[fill]');

    if(type == "vector") {

        if(testHexCode(this) == 'Linear' || testHexCode(this) == 'Radial') {

            if(i >= 0) {

                let defs = gradientString2DefsVector(f, "vector", testHexCode(this), "Stroke", i, this.dataset.gradient);
                let defsID = `vector_${testHexCode(this).toLowerCase()}_stroke_sublayer${i}_${f}`;

                //CHECK FIRST IF THERE'S NO EXISTING DEFS
                
                if(canvas.querySelector('defs') == null) {
                    canvas.querySelector('svg').innerHTML += `<defs>${defs}</defs>`;
                }
                else {
                  
                    canvas.querySelector(`#${defsID}`)?.remove();
                    canvas.querySelector('defs').innerHTML += defs;
                }
                
                //ADD ACTUAL GRADIENT TO THE CANVAS
                canvas.querySelectorAll('svg *:not(g)[stroke], svg *:not(g)[fill]')[i].setAttribute('stroke', `url(#${defsID})`);
                //ADD ACTUAL GRADIENT ON THE PREVIEW
                preview[i].setAttribute('stroke', `url(#${defsID})`);

                thumbPicker.children[1].style.background = this.dataset.gradient;
            }

        }
        else {

            let rgb = hex2RGBStringEncoding(this.value);
            let alpha = this.dataset.alpha;

            let rgba = `rgba(${rgb}, ${alpha})`;
            
            if(i >= 0) {
                //ADD ACTUAL GRADIENT TO THE CANVAS
                canvas.querySelectorAll('svg *:not(g)[stroke], svg *:not(g)[fill]')[i].setAttribute('stroke', rgba);
                //ADD ACTUAL GRADIENT ON THE PREVIEW
                preview[i].setAttribute('stroke', rgba);
                
                thumbPicker.children[1].style.background = rgba;
            }
        }
    }

}
document.getElementById('pnlBoxVector').querySelector('.txtVectorStrokeColor').addEventListener('change', adjustVectorStrokeColor);

//SPECIAL LAYER SEQUENCE FOR TXTVECTORSTROKECOLOR

document.getElementById('pnlBoxVector').querySelector('.txtVectorStrokeColor').addEventListener('click', function() {
    let rgb = hex2RGBStringEncoding(this.value);
    let alpha = this.dataset.alpha;

    layerSequence = `rgba(${rgb}, ${alpha})`;
});


//SPECIAL LAYER SEQUENCE FOR THUMBCOLOR

document.getElementById('pnlBoxVector').querySelector('.txtVectorStrokeColor').nextElementSibling.querySelector('.thumbColor').addEventListener('click', function() {
    let rgb = hex2RGBStringEncoding(document.getElementById('pnlBoxVector').querySelector('.txtVectorStrokeColor').value);
    let alpha = document.getElementById('pnlBoxVector').querySelector('.txtVectorStrokeColor').dataset.alpha;

    layerSequence = `rgba(${rgb}, ${alpha})`;
});


function adjustVectorFillColor() {

    let f = Number(leadPanel.dataset.ref);
    let thumbPicker = this.nextElementSibling;
    let type = leadPanel.dataset.type;
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let i = Number(document.getElementById('pnlBoxVector').querySelector('.txtSubLayer').value) - 1;
    let tabVectorPreview = document.querySelector('.tabVectorPreview');
    let preview = tabVectorPreview.querySelectorAll('svg *:not(g)[stroke], svg *:not(g)[fill]');

    if(type == "vector") {

        if(testHexCode(this) == 'Linear' || testHexCode(this) == 'Radial') {

            if(i >= 0) {

                let defs = gradientString2DefsVector(f, "vector", testHexCode(this), "Fill", i, this.dataset.gradient);
                let defsID = `vector_${testHexCode(this).toLowerCase()}_fill_sublayer${i}_${f}`;

                if(canvas.querySelector('defs') == null) {
                    canvas.querySelector('svg').innerHTML += `<defs>${defs}</defs>`;
                }
                else {
                  
                    canvas.querySelector(`#${defsID}`)?.remove();
                    canvas.querySelector('defs').innerHTML += defs;
                }

                //ADD ACTUAL GRADIENT TO THE CANVAS
                canvas.querySelectorAll('svg *:not(g)[stroke], svg *:not(g)[fill]')[i].setAttribute('fill', `url(#${defsID})`);
                //ADD ACTUAL GRADIENT ON THE PREVIEW
                preview[i].setAttribute('fill', `url(#${defsID})`);

                thumbPicker.children[1].style.background = this.dataset.gradient;
            }

        }
        else {

            let rgb = hex2RGBStringEncoding(this.value);
            let alpha = this.dataset.alpha;

            let rgba = `rgba(${rgb}, ${alpha})`;
            
            if(i >= 0) {

                //ADD ACTUAL GRADIENT TO THE CANVAS
                canvas.querySelectorAll('svg *:not(g)[stroke], svg *:not(g)[fill]')[i].setAttribute('fill', rgba);
                //ADD ACTUAL GRADIENT ON THE PREVIEW
                preview[i].setAttribute('fill', rgba);
                thumbPicker.children[1].style.background = rgba;

            }

        }
    }
   
}
document.getElementById('pnlBoxVector').querySelector('.txtVectorFillColor').addEventListener('change', adjustVectorFillColor);

//SPECIAL LAYER SEQUENCE FOR TXTVECTORFILLCOLOR

document.getElementById('pnlBoxVector').querySelector('.txtVectorFillColor').addEventListener('click', function() {
    let rgb = hex2RGBStringEncoding(this.value);
    let alpha = this.dataset.alpha;

    layerSequence = `rgba(${rgb}, ${alpha})`;
});



//SPECIAL LAYER SEQUENCE FOR THUMBCOLOR
document.getElementById('pnlBoxVector').querySelector('.txtVectorFillColor').nextElementSibling.querySelector('.thumbColor').addEventListener('click', function() {
    let rgb = hex2RGBStringEncoding(document.getElementById('pnlBoxVector').querySelector('.txtVectorFillColor').value);
    let alpha = document.getElementById('pnlBoxVector').querySelector('.txtVectorFillColor').dataset.alpha;

    layerSequence = `rgba(${rgb}, ${alpha})`;
});
































function showBasicBoxVector(){
    this.closest('#pnlBoxVector').children[0].children[0].innerText = "Basic Properties";
    this.closest('#pnlBoxVector').querySelector('.tabSliderBox3').style.translate = "0%"; //slide tab
    this.closest('#pnlBoxVector').querySelector('.pnlBottomBoxThumb3').style.translate = "0%"; //slide scroll thumb
}

document.querySelector('#pnlBoxVector').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.querySelector('#pnlBoxVector').querySelector('.btnBasicBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxVector').querySelector('.btnBasicBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxVector').querySelector('.btnBasicBox').addEventListener('click', showBasicBoxVector);
document.querySelector('#pnlBoxVector').querySelector('.btnBasicBox').children[0].style.filter = "saturate(0) brightness(2)";
document.querySelector('#pnlBoxVector').querySelector('.btnBasicBox').children[0].style.transition = ".2s";


function showSubLayer() {
    this.closest('#pnlBoxVector').children[0].children[0].innerText = "Vector Paths";
    this.closest('#pnlBoxVector').querySelector('.tabSliderBox3').style.translate = "-100%"; //slide tab to left
    this.closest('#pnlBoxVector').querySelector('.pnlBottomBoxThumb3').style.translate = "100%"; //slide thumb to right
}
document.querySelector('#pnlBoxVector').querySelector('.btnSubLayer').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxVector').querySelector('.btnSubLayer').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxVector').querySelector('.btnSubLayer').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxVector').querySelector('.btnSubLayer').addEventListener('click', showSubLayer);
document.querySelector('#pnlBoxVector').querySelector('.btnSubLayer').children[0].style.transition = ".2s";

function showColorBoxVector() {
    this.closest('#pnlBoxVector').children[0].children[0].innerText = "Vector Color";
    this.closest('#pnlBoxVector').querySelector('.tabSliderBox3').style.translate = "-200%"; //slide tab to left
    this.closest('#pnlBoxVector').querySelector('.pnlBottomBoxThumb3').style.translate = "202%"; //slide thumb to right
}

document.querySelector('#pnlBoxVector').querySelector('.btnColorBox').addEventListener('click', btnBottomClick); //default the btnStyle to white
document.querySelector('#pnlBoxVector').querySelector('.btnColorBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxVector').querySelector('.btnColorBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxVector').querySelector('.btnColorBox').addEventListener('click', showColorBoxVector);
document.querySelector('#pnlBoxVector').querySelector('.btnColorBox').children[0].style.transition = ".2s";


