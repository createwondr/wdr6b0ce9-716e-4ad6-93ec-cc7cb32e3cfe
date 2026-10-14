
let dataThumb = [];

///////////////////UPLOAD IMAGE VIA BUTTON//////////////////
function uploadImg() {

    let reader = [];
    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');
    let configScroll = document.getElementsByClassName('configScroll');
    let inputFile = document.createElement('input');
    inputFile.type = "file";
    inputFile.accept ="image/png, image/gif, image/jpeg, image/jpg, image/webp, image/avif, image/svg+xml, .glb";
    inputFile.setAttribute('multiple', 'multiple')
    inputFile.click();

    inputFile.onchange = function() { //once selected a file
        
        //init reader array
        let tempHistory = 'Uploaded';

        for(let a = 0; a < inputFile.files.length; a++) {

            let filename = inputFile.files[a].name;

            let fileExt = inputFile.files[a].name.split('.'); // get file extension if SVG or raster

            if(fileExt[fileExt.length-1].toLowerCase() == "svg") {

                reader[a] = new FileReader(); //create a file reader to read the format
                reader[a].readAsText(inputFile.files[a]); //read the file as text since it's SVG
                reader[a].onload = async function() {
                    
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
                    div.dataset.type = "vector";
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
                    thumb2Focus(configScroll[2].querySelector('.pnlBoxThumb'));

                    img = null;
                    reader[a] = null;   
                }
            }
            else { //if image file is raster
                
                reader[a] = new FileReader(); //create a file reader to read the format
                reader[a].readAsDataURL(inputFile.files[a]); //read the file to dataURL for raster output

                reader[a].onload = async function() {
                    
                    let img = new Image();
                    img.src = this.result;
                    await img.decode();
    
                    let thumbnail = await convert2Thumbnail(img, 'image');
                    //let webPURL = await convert2Webp(img);
                    let webPURL = this.result;
                    
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
                    dataThumb[div.dataset.thumbno] += `\nsource: ${webPURL}`;

                    tempHistory += `*`;
                    tempHistory += `\npnlBoxThumb:`;
                    tempHistory += `\ntype: image`;
                    tempHistory += `\nthumbno: ${div.dataset.thumbno}`;
                    tempHistory += `\nsource: ${webPURL}\n`;

                    makeNewHistory(tempHistory);
                    thumb2Focus(configScroll[2].querySelector('.pnlBoxThumb'))

                    img = null;
                    reader[a] = null;
                }
            }
        }
    }
}
document.getElementById('btnUploadImg').addEventListener('click', uploadImg);

///////////////////UPLOAD IMAGE BY DRAG AND DROP ON TOOL MENU/////////////
function dragDropUploadThumb(e) {

    let reader = [];
    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');
    let configScroll = document.getElementsByClassName('configScroll');
    
    let tempHistory = 'Uploaded';

    for(let a = 0; a < e.dataTransfer.files.length; a++) {

        let filename = e.dataTransfer.files[a].name;

        //if dropped is a file
        if(e.dataTransfer.items[a].kind == "file") {

            //if file is an image
            if(e.dataTransfer.items[a].type.match("image")) {

                //check if file is svg
                let chkSVG = /svg/;

                let resultSVG = chkSVG.test(e.dataTransfer.items[a].type);

                if(resultSVG) {

                    reader[a] = new FileReader(); //create a file reader to read the format
                    reader[a].readAsText(e.dataTransfer.files[a]); //read the file to dataURL for raster output

                    reader[a].onload = async function() {
                        
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
                        div.dataset.type = "vector";
                        div.dataset.filename = filename;

                        div.innerHTML = `<img src="${thumbnail}">`;

                        configScroll[2].children[0].children[0].prepend(div);

                        dataThumb[div.dataset.thumbno] = '*';
                        dataThumb[div.dataset.thumbno] += `\npnlBoxThumb:`;
                        dataThumb[div.dataset.thumbno] += `\ntype: svg`;
                        dataThumb[div.dataset.thumbno] += `\nthumbno: ${div.dataset.thumbno}`;
                        dataThumb[div.dataset.thumbno] += `\nsource: ${encodeURIComponent(this.result)}`;

                        tempHistory += `*`;
                        tempHistory += `\npnlBoxThumb:`;
                        tempHistory += `\ntype: svg`;
                        tempHistory += `\nthumbno: ${div.dataset.thumbno}`;
                        tempHistory += `\nsource: ${encodeURIComponent(this.result)}\n`;

                        makeNewHistory(tempHistory);
                        thumb2Focus(configScroll[2].querySelector('.pnlBoxThumb'));

                        img = null;
                        reader[a] = null;   
                    }

                }
                
                else {

                    reader[a] = new FileReader();
                    reader[a].readAsDataURL(e.dataTransfer.files[a]);

                    reader[a].onload = async function() {

                        let img = new Image();
                        img.src = this.result;
                        await img.decode();
      
                        let thumbnail = await convert2Thumbnail(img, 'image')
                        //let webPURL = await convert2Webp(img);
                        let webPURL = this.result;

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
                        dataThumb[div.dataset.thumbno] += `\nsource: ${webPURL}`;

                        tempHistory += `*`;
                        tempHistory += `\npnlBoxThumb:`;
                        tempHistory += `\ntype: image`;
                        tempHistory += `\nthumbno: ${div.dataset.thumbno}`;
                        tempHistory += `\nsource: ${webPURL}\n`;

                        makeNewHistory(tempHistory);
                        thumb2Focus(configScroll[2].querySelector('.pnlBoxThumb'))

                        img = null;
                        reader[a] = null;
                        
                    }
                }
            }
        }
    }

    configScroll[2].children[0].style.backgroundColor = "transparent";
}
document.querySelectorAll('.configScroll')[2].addEventListener('drop', dragDropUploadThumb);


///////////////////UPLOAD IMAGE DIRECTLY IN MAIN CANVAS///////////////////
function dragDropUpload(e) {

    let initFiles = 0;
    let reader = [];
    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');
    let configScroll = document.getElementsByClassName('configScroll');

    let tempHistory = 'Uploaded';

    let maxFiles = e.dataTransfer.files.length;

    for(let a = 0; a < maxFiles; a++) {

        let filename = e.dataTransfer.files[a].name;

        //if dropped is a file
        if(e.dataTransfer.items[a].kind == "file") {

            //if file is an image
            if(e.dataTransfer.items[a].type.match("image")) {

                //check if file is svg
                let chkSVG = /svg/;

                let resultSVG = chkSVG.test(e.dataTransfer.items[a].type);

                if(resultSVG) {

                    reader[a] = new FileReader(); //create a file reader to read the format
                    reader[a].readAsText(e.dataTransfer.files[a]); //read the file to dataURL for raster output
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

                        if(initFiles == maxFiles) {

                            reader.forEach((read) => {
                                read = null;
                            })

                            createCanvasFromThumb();
                        }

                    }
            
                }

                else {

                    reader[a] = new FileReader();

                    reader[a].readAsDataURL(e.dataTransfer.files[a]);

                    reader[a].onload = async function() {

                        let img = new Image();
                        img.src = this.result;
                        await img.decode();

                        initFiles++;

                        let thumbnail = await convert2Thumbnail(img, 'image')
                        //let webPURL = await convert2Webp(img);
                        let webPURL = this.result;

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
                        dataThumb[div.dataset.thumbno] += `\nsource: ${webPURL}`;

                        tempHistory += `*`;
                        tempHistory += `\npnlBoxThumb:`;
                        tempHistory += `\ntype: image`;
                        tempHistory += `\nthumbno: ${div.dataset.thumbno}`;
                        tempHistory += `\nsource: ${webPURL}\n`;

                        makeNewHistory(tempHistory);
             
                        img = null;
                        reader[a] = null;

                        if(initFiles == maxFiles) {

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
    resetAllFocus();
   
}
cnvPin.addEventListener('drop', dragDropUpload);

//==================CREATE IMAGE PANELBOX========================
function createPnlBoxImage(n) {

    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;
    let name = autoIncrementHeader("Image");
    let configScroll = document.getElementsByClassName('configScroll');

    let newImage = 
    `<div class="pnlBoxLayer" data-type="image" data-thumbno="${n}" data-ref="${f}">
        <div class="pnlTitleLayer">
            <div class="iconLayer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.7998 1.7998C4.79377 1.7998 5.59937 2.6057 5.59961 3.59961C5.59961 4.59372 4.79392 5.40039 3.7998 5.40039C2.80578 5.40029 2 4.59366 2 3.59961C2.00024 2.60576 2.80593 1.79991 3.7998 1.7998Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2041 0.0107422C11.2128 0.113005 12 0.96435 12 2V10C12 10.036 11.9978 10.0715 11.9941 10.1064L11.9893 10.2041C11.8938 11.1457 11.1457 11.8938 10.2041 11.9893L10 12H2C0.96435 12 0.113005 11.2128 0.0107422 10.2041L0 10V2C1.28853e-07 0.895431 0.895431 3.22128e-08 2 0H10L10.2041 0.0107422ZM2 1C1.48232 1 1.05621 1.39333 1.00488 1.89746L1 2V8.8916L2.31445 8.19922C2.68429 8.00433 3.13682 8.06001 3.44824 8.33887L4.35645 9.15234C4.7362 9.49228 5.31074 9.4924 5.69043 9.15234L8.54199 6.59766C8.92177 6.25744 9.49718 6.25744 9.87695 6.59766L11 7.60352V2C11 1.48232 10.6067 1.05621 10.1025 1.00488L10 1H2Z" fill="white"/>
                </svg>
                <svg style = "display: none;" width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.00019 1H3.00019L3 7.99998M3 7.99998L1 5.99998M3 7.99998L5 5.99998" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <input type="text" class="txtHeader" value="${name}" data-readonly="true">
            <div class="btnMaskUnmask" data-mask="unmask">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C3.57258 12 1.48282 10.5581 0.538086 8.48438C0.531433 8.4698 0.525094 8.45507 0.518555 8.44043C0.478569 8.35075 0.440924 8.2599 0.405273 8.16797C0.397923 8.14904 0.389975 8.13034 0.382812 8.11133C0.303993 7.90173 0.235942 7.6868 0.180664 7.4668C0.174387 7.44186 0.169049 7.41667 0.163086 7.3916C0.144808 7.31465 0.127586 7.23725 0.112305 7.15918C0.102469 7.10901 0.0945126 7.05842 0.0859375 7.00781C0.076014 6.94916 0.0668016 6.89028 0.0585938 6.83105C0.0512098 6.77786 0.0440634 6.72453 0.0380859 6.6709C0.0300152 6.59837 0.0240163 6.52543 0.0185547 6.45215C0.0160073 6.41802 0.0127153 6.3839 0.0107422 6.34961C0.00409377 6.23391 0 6.11737 0 6C0 5.8823 0.00405669 5.76544 0.0107422 5.64941C0.0127208 5.61513 0.0160018 5.581 0.0185547 5.54688C0.024028 5.47359 0.0300036 5.40065 0.0380859 5.32812C0.0440719 5.27449 0.0512014 5.22116 0.0585938 5.16797C0.066811 5.10875 0.0760048 5.04987 0.0859375 4.99121C0.091179 4.96031 0.0948731 4.92918 0.100586 4.89844L0.12207 4.79102C0.13467 4.72943 0.148616 4.6683 0.163086 4.60742C0.169053 4.58236 0.174383 4.55716 0.180664 4.53223C0.235974 4.31225 0.303964 4.09727 0.382812 3.8877C0.385755 3.87989 0.388627 3.87205 0.391602 3.86426L0.47168 3.66406C0.486682 3.6286 0.502893 3.5937 0.518555 3.55859C0.525096 3.54395 0.531431 3.52923 0.538086 3.51465C1.483 1.44141 3.57289 0 6 0ZM6 1C4.9986 1 4.06624 1.29481 3.28418 1.80176C4.34529 2.88352 5 4.36488 5 6C5 7.63487 4.345 9.11555 3.28418 10.1973C4.06633 10.7044 4.99841 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1Z" fill="white"/>
                </svg>
            </div>
            <div class="btnLockUnlock" data-lock = "unlock">
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

    configScroll[5].insertAdjacentHTML('afterbegin', newImage);

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);

    addPnlBoxImage(f, name, n);

}

function createPnlBoxImageGraphics(n, source, id) {
    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;
    let name = autoIncrementHeader("Image");
    let configScroll = document.getElementsByClassName('configScroll');

    let newImage = 
    `<div class="pnlBoxLayer" data-type="image" data-thumbno="${n}" data-ref="${f}">
        <div class="pnlTitleLayer">
            <div class="iconLayer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.7998 1.7998C4.79377 1.7998 5.59937 2.6057 5.59961 3.59961C5.59961 4.59372 4.79392 5.40039 3.7998 5.40039C2.80578 5.40029 2 4.59366 2 3.59961C2.00024 2.60576 2.80593 1.79991 3.7998 1.7998Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2041 0.0107422C11.2128 0.113005 12 0.96435 12 2V10C12 10.036 11.9978 10.0715 11.9941 10.1064L11.9893 10.2041C11.8938 11.1457 11.1457 11.8938 10.2041 11.9893L10 12H2C0.96435 12 0.113005 11.2128 0.0107422 10.2041L0 10V2C1.28853e-07 0.895431 0.895431 3.22128e-08 2 0H10L10.2041 0.0107422ZM2 1C1.48232 1 1.05621 1.39333 1.00488 1.89746L1 2V8.8916L2.31445 8.19922C2.68429 8.00433 3.13682 8.06001 3.44824 8.33887L4.35645 9.15234C4.7362 9.49228 5.31074 9.4924 5.69043 9.15234L8.54199 6.59766C8.92177 6.25744 9.49718 6.25744 9.87695 6.59766L11 7.60352V2C11 1.48232 10.6067 1.05621 10.1025 1.00488L10 1H2Z" fill="white"/>
                </svg>
                <svg style = "display: none;" width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.00019 1H3.00019L3 7.99998M3 7.99998L1 5.99998M3 7.99998L5 5.99998" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <input type="text" class="txtHeader" value="${name}" data-readonly="true">
            <div class="btnMaskUnmask" data-mask="unmask">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C3.57258 12 1.48282 10.5581 0.538086 8.48438C0.531433 8.4698 0.525094 8.45507 0.518555 8.44043C0.478569 8.35075 0.440924 8.2599 0.405273 8.16797C0.397923 8.14904 0.389975 8.13034 0.382812 8.11133C0.303993 7.90173 0.235942 7.6868 0.180664 7.4668C0.174387 7.44186 0.169049 7.41667 0.163086 7.3916C0.144808 7.31465 0.127586 7.23725 0.112305 7.15918C0.102469 7.10901 0.0945126 7.05842 0.0859375 7.00781C0.076014 6.94916 0.0668016 6.89028 0.0585938 6.83105C0.0512098 6.77786 0.0440634 6.72453 0.0380859 6.6709C0.0300152 6.59837 0.0240163 6.52543 0.0185547 6.45215C0.0160073 6.41802 0.0127153 6.3839 0.0107422 6.34961C0.00409377 6.23391 0 6.11737 0 6C0 5.8823 0.00405669 5.76544 0.0107422 5.64941C0.0127208 5.61513 0.0160018 5.581 0.0185547 5.54688C0.024028 5.47359 0.0300036 5.40065 0.0380859 5.32812C0.0440719 5.27449 0.0512014 5.22116 0.0585938 5.16797C0.066811 5.10875 0.0760048 5.04987 0.0859375 4.99121C0.091179 4.96031 0.0948731 4.92918 0.100586 4.89844L0.12207 4.79102C0.13467 4.72943 0.148616 4.6683 0.163086 4.60742C0.169053 4.58236 0.174383 4.55716 0.180664 4.53223C0.235974 4.31225 0.303964 4.09727 0.382812 3.8877C0.385755 3.87989 0.388627 3.87205 0.391602 3.86426L0.47168 3.66406C0.486682 3.6286 0.502893 3.5937 0.518555 3.55859C0.525096 3.54395 0.531431 3.52923 0.538086 3.51465C1.483 1.44141 3.57289 0 6 0ZM6 1C4.9986 1 4.06624 1.29481 3.28418 1.80176C4.34529 2.88352 5 4.36488 5 6C5 7.63487 4.345 9.11555 3.28418 10.1973C4.06633 10.7044 4.99841 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1Z" fill="white"/>
                </svg>
            </div>
            <div class="btnLockUnlock" data-lock = "unlock">
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

    configScroll[5].insertAdjacentHTML('afterbegin', newImage);

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);

    //THE ROW id IS THE ONLY THING THAT CAN FETCH THIS GRAPHIC AGAIN - n IS ITS INDEX. IT RIDES
    //ON imageLink SO AN IMAGE SWAP'S UNDO CAN RESOLVE IT THE SAME WAY IT RESOLVES A PEXELS LINK
    addPnlBoxImage(f, name, n, 'graphics', source, id != null ? `elements:${id}` : "");
}
//===================CREATE VECTOR PANELBOX======================

function createPnlBoxVector(n) {

    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;
    
    let name = autoIncrementHeader("Vector");
    let configScroll = document.getElementsByClassName('configScroll');

    let newVector = 
    `<div class="pnlBoxLayer" data-type="vector" data-thumbno="${n}" data-ref="${f}">
        <div class="pnlTitleLayer">
            <div class="iconLayer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.60059 0.00976562C2.82855 0.056292 3 0.258287 3 0.5V1H9V0.5C9 0.223858 9.22386 8.05319e-09 9.5 0H11.5L11.6006 0.00976562C11.8286 0.056292 12 0.258287 12 0.5V2.5L11.9902 2.60059C11.9503 2.79608 11.7961 2.95034 11.6006 2.99023L11.5 3H11V9H11.5C11.7761 9 12 9.22386 12 9.5V11.5C12 11.7761 11.7761 12 11.5 12H9.5C9.22386 12 9 11.7761 9 11.5V11H3V11.5C3 11.7761 2.77614 12 2.5 12H0.5C0.223858 12 8.05326e-09 11.7761 0 11.5V9.5C3.2213e-08 9.22386 0.223858 9 0.5 9H1V3H0.5C0.258287 3 0.056292 2.82855 0.00976562 2.60059L0 2.5V0.5C3.2213e-08 0.223858 0.223858 8.05319e-09 0.5 0H2.5L2.60059 0.00976562ZM3 2.5L2.99023 2.60059C2.95034 2.79608 2.79608 2.95034 2.60059 2.99023L2.5 3H2V9H2.5C2.77614 9 3 9.22386 3 9.5V10H9V9.5C9 9.22386 9.22386 9 9.5 9H10V3H9.5C9.25829 3 9.05629 2.82855 9.00977 2.60059L9 2.5V2H3V2.5Z" fill="white"/>
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

    configScroll[5].insertAdjacentHTML('afterbegin', newVector);

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);
    addPnlBoxVector(f, n, name, null, "center", "vector");
}

function createPnlBoxVectorGraphics(n, source, post, subtype) {

    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;
    
    let name = autoIncrementHeader("Vector");
    let configScroll = document.getElementsByClassName('configScroll');

    let newVector = 
    `<div class="pnlBoxLayer" data-thumbno="${n}" data-type="vector" data-subtype="${subtype}" data-ref="${f}">
        <div class="pnlTitleLayer">
            <div class="iconLayer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.60059 0.00976562C2.82855 0.056292 3 0.258287 3 0.5V1H9V0.5C9 0.223858 9.22386 8.05319e-09 9.5 0H11.5L11.6006 0.00976562C11.8286 0.056292 12 0.258287 12 0.5V2.5L11.9902 2.60059C11.9503 2.79608 11.7961 2.95034 11.6006 2.99023L11.5 3H11V9H11.5C11.7761 9 12 9.22386 12 9.5V11.5C12 11.7761 11.7761 12 11.5 12H9.5C9.22386 12 9 11.7761 9 11.5V11H3V11.5C3 11.7761 2.77614 12 2.5 12H0.5C0.223858 12 8.05326e-09 11.7761 0 11.5V9.5C3.2213e-08 9.22386 0.223858 9 0.5 9H1V3H0.5C0.258287 3 0.056292 2.82855 0.00976562 2.60059L0 2.5V0.5C3.2213e-08 0.223858 0.223858 8.05319e-09 0.5 0H2.5L2.60059 0.00976562ZM3 2.5L2.99023 2.60059C2.95034 2.79608 2.79608 2.95034 2.60059 2.99023L2.5 3H2V9H2.5C2.77614 9 3 9.22386 3 9.5V10H9V9.5C9 9.22386 9.22386 9 9.5 9H10V3H9.5C9.25829 3 9.05629 2.82855 9.00977 2.60059L9 2.5V2H3V2.5Z" fill="white"/>
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

    configScroll[5].insertAdjacentHTML('afterbegin', newVector);

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);
    addPnlBoxVector(f, n, name, source, post, subtype);
}

//=================DROPPING ON CONFIGSCROLL[2]====================


//this is for configcontainer color
menuUploads.addEventListener('dragover', function(e) {
    
    let configScroll = document.getElementsByClassName('configScroll');

    if(e.target.closest('#configContainer')) {
        configScroll[2].children[0].style.backgroundColor = "var(--muted-line)";
    }
    else {
        //e.preventDefault();
        //e.stopPropagation();
        configScroll[2].children[0].style.backgroundColor = "transparent";
    }
})

document.getElementById('toolbox').addEventListener('dragover', function(e) {
    //e.preventDefault();
    //e.stopPropagation();
    let configScroll = document.getElementsByClassName('configScroll');
    configScroll[2].children[0].style.backgroundColor = "transparent";
})

//================HOVER AND LEAVE FROM THUMB=================-

function dblClickThumb() {

    let pnlBoxThumb = document.getElementsByClassName('pnlBoxThumb');

    for(let b = 0; b < focusPanel.length; b++) {
        focusPanel[b] = null;
    }

    for(let a = 0; a < pnlBoxThumb.length; a++) {
        pnlBoxThumb[a].style.borderColor = "transparent";
        pnlBoxThumb[a].style.borderWidth = "1px";
        this.style.backgroundColor = "transparent"
    }

    if(this.dataset.type == "image") {
        createPnlBoxImage(this.dataset.thumbno);
    }
    else if(this.dataset.type == "vector") {
        createPnlBoxVector(this.dataset.thumbno);
    }

    this.removeEventListener('pointerover', pointerOverThumb);
}

function pointerOverThumb() {

    this.style.borderColor = "var(--muted-blue-text)";
    this.style.borderWidth = "1px"; //highlight
}

function pointerLeaveThumb() {

    let leadPanel = this.closest('.pnlBoxThumb');
    let matching = false;

    for(let a = 0; a < focusPanel.length; a++) {
        if(leadPanel == focusPanel[a]) {
            matching = true;
            break;
        }
    }

    if(matching) {
        
        this.style.borderColor = "var(--muted-blue-text)";
        this.style.borderWidth = "1px";
 
    }
    else {
        this.style.borderColor = "transparent";
        this.style.borderWidth = "1px";
        this.style.backgroundColor = "transparent"
        this.addEventListener('pointerover', pointerOverThumb)
    }
    
}

//=================DRAG AND DROP ON CNVPIN / WORKAREA=================

function createCanvasFromThumb() {

    let partHistory = history[h].trim().split('*');

    for(let a = 1; a < partHistory.length; a++) {

        let type = valueFinder(partHistory[a], 'type');
        let n = valueFinder(partHistory[a], 'thumbno');
        
        if(n != null) {
   
            if(type == 'svg') {
                createPnlBoxVector(n);
            }
            else if(type == 'image') {
                createPnlBoxImage(n);
            }
        }

    }
    
}

function draggingUpload() {
    let configScroll = document.getElementsByClassName('configScroll');
    configScroll[2].children[0].style.backgroundColor = "transparent";
}
cnvPin.addEventListener('dragover', draggingUpload);

//////////////////////////REFORMAT IMPORTED SVG/////////////////

function svg2ObjectBoundingBox(svg) {
    let defsID;
    //REPLACE FILL AND STROKE
    svg.querySelectorAll('*[fill], *[stroke]').forEach((part) => {

        if(part.hasAttribute('stroke') && part.getAttribute('stroke').includes('url')) {
            defsID = part.getAttribute('stroke').replace('url(#', '');
            defsID = defsID.replace(')', '');

            //NOW SEARCH ID IN DEFS
            let defs = svg.querySelector(`defs #${defsID}`);

            //CHECK IF DEFS GRADIENTUNITS IS USERSPACEONUSE
            if(defs.getAttribute('gradientUnits') == "userSpaceOnUse" && defs.tagName == 'linearGradient') {

                //GET THE DEGREE OF ROTATION FIRST
                let x1 = defs.getAttribute('x1');
                let x2 = defs.getAttribute('x2');
                let y1 = defs.getAttribute('y1');
                let y2 = defs.getAttribute('y2');

                let dx = x2 - x1;
                let dy = y2 - y1;

                let radian = Math.atan2(-dy, dx);
                //let degree = (((radian * 180) / Math.PI) + 360 ) % 360;
                //AFTER  GETTING THE RADIAN ANGLE, GET THE NORMALIZE DIFFERENCE X AND Y
                //JUST REUSE THE VARIABLE
                dx = Math.cos(radian);
                dy = -Math.sin(radian);

                //0.5 IS THE CENTER OF THE BOX (OBJECTBOUNDINGBOX) 0-1 
                x1 = 0.5 - (dx * 0.5);
                y1 = 0.5 - (dy * 0.5);
                x2 = 0.5 + (dx * 0.5);
                y2 = 0.5 + (dy * 0.5);

                //ASSIGN NEW COORDINATES
                defs.setAttribute('x1', x1);
                defs.setAttribute('x2', x2);
                defs.setAttribute('y1', y1);
                defs.setAttribute('y2', y2);

                //CHANGE GRADIENTUNITS TO OBJECTBOUNDINGBOX
                defs.setAttribute('gradientUnits', 'objectBoundingBox');
            }

            if(defs.getAttribute('gradientUnits') == "userSpaceOnUse" && defs.tagName == 'radialGradient') {

                //REASSIGN NORMALIZE VALUES
                defs.setAttribute('cx', "50%");
                defs.setAttribute('cy', "50%");
                defs.setAttribute('r', "50%");
                defs.setAttribute('fx', "50%");
                defs.setAttribute('fy', "50%");

                //REMOVE GRADIENT TRANSFORM IF THERE'S ANY
                defs.removeAttribute("gradientTransform");

                //CHANGE GRADIENTUNITS TO OBJECTBOUNDINGBOX
                defs.setAttribute('gradientUnits', 'objectBoundingBox');
            }

        }

        if(part.hasAttribute('fill') && part.getAttribute('fill').includes('url')) {
            defsID = part.getAttribute('fill').replace('url(#', '');
            defsID = defsID.replace(')', '');

            //NOW SEARCH ID IN DEFS
            let defs = svg.querySelector(`defs #${defsID}`);

            //CHECK IF DEFS GRADIENTUNITS IS USERSPACEONUSE
            if(defs.getAttribute('gradientUnits') == "userSpaceOnUse" && defs.tagName == 'linearGradient') {

                
                //GET THE DEGREE OF ROTATION FIRST
                let x1 = defs.getAttribute('x1');
                let x2 = defs.getAttribute('x2');
                let y1 = defs.getAttribute('y1');
                let y2 = defs.getAttribute('y2');

                let dx = x2 - x1;
                let dy = y2 - y1;

                let radian = Math.atan2(-dy, dx);
                //let degree = (((radian * 180) / Math.PI) + 360 ) % 360;
                //AFTER  GETTING THE RADIAN ANGLE, GET THE NORMALIZE DIFFERENCE X AND Y
                //JUST REUSE THE VARIABLE
                dx = Math.cos(radian);
                dy = -Math.sin(radian);

                //0.5 IS THE CENTER OF THE BOX (OBJECTBOUNDINGBOX) 0-1 
                x1 = 0.5 - (dx * 0.5);
                y1 = 0.5 - (dy * 0.5);
                x2 = 0.5 + (dx * 0.5);
                y2 = 0.5 + (dy * 0.5);

                //ASSIGN NEW COORDINATES
                defs.setAttribute('x1', x1);
                defs.setAttribute('x2', x2);
                defs.setAttribute('y1', y1);
                defs.setAttribute('y2', y2);

                //CHANGE GRADIENTUNITS TO OBJECTBOUNDINGBOX
                defs.setAttribute('gradientUnits', 'objectBoundingBox');
            }

            if(defs.getAttribute('gradientUnits') == "userSpaceOnUse" && defs.tagName == 'radialGradient') {

                //REASSIGN NORMALIZE VALUES
                defs.setAttribute('cx', "50%");
                defs.setAttribute('cy', "50%");
                defs.setAttribute('r', "50%");
                defs.setAttribute('fx', "50%");
                defs.setAttribute('fy', "50%");

                //REMOVE GRADIENT TRANSFORM IF THERE'S ANY
                defs.removeAttribute("gradientTransform");
    
                //CHANGE GRADIENTUNITS TO OBJECTBOUNDINGBOX
                defs.setAttribute('gradientUnits', 'objectBoundingBox');
            }
        }
    })

    //REPLACE SVG SIZE
    let w = svg.getAttribute('width');
    w = unit2Pixels(w);
    svg.setAttribute('width', w);

    let h = svg.getAttribute('height');
    h = unit2Pixels(h);
    svg.setAttribute('height', h);

    //REPLACE ALL SVG CHILD SIZE UNITS
    svg.querySelectorAll('*[width], *[height]').forEach((part) => {

        if(part.hasAttribute('width')) {
            let val = part.getAttribute('width');

            val = unit2Pixels(val);

            part.setAttribute('width', val);
        }

        if(part.hasAttribute('height')) {
            let val = part.getAttribute('height');

            val = unit2Pixels(val);

            part.setAttribute('height', val);
        }
    })
    
    return svg
}

function unit2Pixels(val) {
    //IF UNIT IS PX
    val.includes('px')? val = val.replace('px', '') : val = val;
    //IF UNIT IS INCHES
    val.includes('in')? val = Number(val.replace('in', '')) * 96 : val = val;
    //IF UNIT IS CM
    val.includes('cm')? val = Number(val.replace('cm', '')) * 37.8 : val = val;
    //IF UNIT IS MM
    val.includes('mm')? val = Number(val.replace('mm', '')) * 3.78 : val = val;
    //IF UNIT IS PT
    val.includes('pt')? val = Number(val.replace('pt', '')) * 1.333 : val = val;
    //IF UNIT IS PICA
    val.includes('pc')? val = Number(val.replace('pc', '')) * 16 : val = val;
    //IF UNIT IS PICA
    val.includes('em')? val = Number(val.replace('em', '')) * 16 : val = val;

    return val;
}

function reformatImportedSVG(f, src) {
    
    let i = 0;
    let newDefs = "";
    let allowed = ['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon']
    
    let div = document.createElement('div');
    div.innerHTML = src;
    
    //QUERY ALL G TAGS
    div.querySelectorAll('g').forEach((g) => {

        //LOOP INSIDE THIS CURRENT G TAG
        for(let a = 0; a < g.childElementCount; a++) {
            //IF G TAG CHILD TAG NAME IS INCLUDED IN ALLOWED
            if(allowed.includes(g.children[a].tagName)) {
                if(g.hasAttribute('stroke') && !g.children[a].hasAttribute('stroke')) {
                    g.children[a].setAttribute('stroke', g.getAttribute('stroke'));
                }
                else if(g.hasAttribute('stroke-opacity') && !g.children[a].hasAttribute('stroke-opacity')) {
                    g.children[a].setAttribute('stroke-opacity', g.getAttribute('stroke-opacity'));
                }
                else if(g.hasAttribute('stroke-width') && !g.children[a].hasAttribute('stroke-width')) {
                    g.children[a].setAttribute('stroke-width', g.getAttribute('stroke-width'));
                }
                else if(g.hasAttribute('stroke-dash') && !g.children[a].hasAttribute('stroke-dash')) {
                    g.children[a].setAttribute('stroke-dash', g.getAttribute('stroke-dash'));
                }
                else if(g.hasAttribute('stroke-gap') && !g.children[a].hasAttribute('stroke-gap')) {
                    g.children[a].setAttribute('stroke-gap', g.getAttribute('stroke-gap'));
                }
                else if(g.hasAttribute('fill') && !g.children[a].hasAttribute('fill')) {
                    g.children[a].setAttribute('fill', g.getAttribute('fill'));
                }
                else if(g.hasAttribute('fill-opacity') && !g.children[a].hasAttribute('fill-opacity')) {
                    g.children[a].setAttribute('fill-opacity', g.getAttribute('fill-opacity'));
                }
            }
        }
    })

    //NOW QUERY ALL ALLOWED
    div.querySelectorAll(allowed.join(',')).forEach((part) => {
        //CHECK IF PART HAS STROKE ATTRIBUTE
        if(part.hasAttribute('stroke')) {
            if(part.getAttribute('stroke').includes('url')) {
                let tempID = part.getAttribute('stroke').replace('url(#', '');
                tempID = tempID.replace(')', '');

                //FIND ORIGINAL DEFS USING THE ID
                let gradient = div.querySelector(`defs #${tempID}`)?.cloneNode(true);
                
                //CREATE NEW ID
                let type;
                if(gradient.outerHTML.includes('linear')) {
                    type = "linear"
                }
                else if(gradient.outerHTML.includes('radial')) {
                    type = "radial"
                }

                let newID = `vector_${type}_stroke_sublayer${i}_${f}`;

                //RENEW THE ID
                part.setAttribute('stroke', `url(#${newID})`)

                //APPEND TO NEW DEFS STRING FOR LATER
                gradient.setAttribute('id', newID);
                newDefs += gradient.outerHTML;
                newDefs += '\n';
                i++;
            }
        }
        if(part.hasAttribute('fill')) {
            if(part.getAttribute('fill').includes('url')) {

                let tempID = part.getAttribute('fill').replace('url(#', '');
                tempID = tempID.replace(')', '');

                //FIND ORIGINAL DEFS USING THE ID
                let gradient = div.querySelector(`defs #${tempID}`)?.cloneNode(true);
                
                //CREATE NEW ID
                let type;
                if(gradient.outerHTML.includes('linear')) {
                    type = "linear"
                }
                else if(gradient.outerHTML.includes('radial')) {
                    type = "radial"
                }

                let newID = `vector_${type}_fill_sublayer${i}_${f}`;

                //RENEW THE ID
                part.setAttribute('fill', `url(#${newID})`)

                //APPEND TO NEW DEFS STRING FOR LATER
                gradient.setAttribute('id', newID);
                newDefs += gradient.outerHTML;
                newDefs += '\n';
                i++;
            }
        }
        
    })

    //REMOVE ALL DEFS
    div.querySelectorAll('defs').forEach((defs) => {
        defs?.remove()
    })

    //CREATE NEW DEFS
    div.querySelector('svg').innerHTML += 
    `<defs>
        ${newDefs}
    </defs>`;

    return div.querySelector('svg').outerHTML;

}

/////////////////////////CONVERT TO THUMBNAIL SIZE//////////////////////
async function convert2Thumbnail(img, type) {
    let maxSize = 98;

    if(type == 'image') {

        let w = img.naturalWidth;
        let h = img.naturalHeight;
        let scale = Math.min(maxSize / w, maxSize / h);
        let newW = w * scale;
        let newH = h * scale;

        let canvas = document.createElement('canvas');
        canvas.width = newW;
        canvas.height = newH;
        canvas.style.background = "transparent";

        let ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get the thumbnail data
        let dataURL = canvas.toDataURL("image/png");

        return dataURL;
    }

    else if(type == 'svg') {

        let w = Number(img.getAttribute('width'));
        let h = Number(img.getAttribute('height'));
  
        let scale = Math.min(maxSize / w, maxSize / h);
        let newW = w * scale;
        let newH = h * scale;

        let svgBlob = new Blob([img.outerHTML], { type: "image/svg+xml" });
        let url = URL.createObjectURL(svgBlob);

        img = new Image();
        img.src = url;

        await img.decode();

        let canvas = document.createElement('canvas');
        canvas.width = newW;
        canvas.height = newH;
        canvas.style.background = "transparent";

        let ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get the thumbnail data
        let dataURL = canvas.toDataURL("image/png");

        URL.revokeObjectURL(url);

        return dataURL;
    }
}


/////////////////////////CONVERT TO THUMBNAIL SIZE//////////////////////
async function convert2Webp(img) {

    let w = img.naturalWidth;
    let h = img.naturalHeight;

    let imgRatio = w/h;

    w > 1080? w = 1080: w = w;
    h = w / imgRatio;

    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.style.background = "transparent";

    let ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get the thumbnail data
    let dataURL = canvas.toDataURL("image/webp", 0.5);

    return dataURL;

}
