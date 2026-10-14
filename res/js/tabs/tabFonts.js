let fontSelected = "Stylish";
let currFontSize = 48; 
let currFontColor = "#949EFF";
let currLetterSpacing = 0;
let currLineHeight = "Auto";
let currCase = "Capitalize";
let currResizeBox = "AutoWidth";
let currHoriAlignment = "Left";
let currVertiAlignment = "Top"


/////////////////////////////////////CREATE PNLBOXTEXT//////////////////////////
function createPnlBoxText() {

    let newText;
    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;
    let name = autoIncrementHeader("Text");
    let configScroll = document.getElementsByClassName('configScroll');

    newText = 
    `<div class="pnlBoxLayer" data-font="${this.dataset.font}" data-class="${this.dataset.class}" data-type = "text" data-ref="${f}">
        <div class="pnlTitleLayer"style="height: 40px;">
            <div class="iconLayer">
                <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 0V3.24779H10.6749C10.4822 2.49853 10.2685 1.96165 10.0337 1.63717C9.79885 1.30678 9.47674 1.04425 9.06732 0.849558C8.83853 0.743363 8.43815 0.690266 7.86617 0.690266H6.95402V9.9469C6.95402 10.5605 6.98714 10.944 7.05337 11.0973C7.12562 11.2507 7.26108 11.3864 7.45977 11.5044C7.66448 11.6165 7.94143 11.6726 8.29064 11.6726H8.69704V12H2.28489V11.6726H2.6913C3.04652 11.6726 3.33251 11.6106 3.54926 11.4867C3.7058 11.4041 3.82923 11.2625 3.91954 11.0619C3.98577 10.9204 4.01888 10.5487 4.01888 9.9469V0.690266H3.13383C2.30898 0.690266 1.70991 0.861357 1.33662 1.20354C0.812808 1.68142 0.481664 2.36283 0.343186 3.24779H0V0H11Z" fill="white"/>
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
    
    configScroll[5].insertAdjacentHTML('afterbegin', newText);

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);

    addPnlBoxText(f, name, this.dataset.font, this.dataset.class, this.dataset.case);
}

//actual function to create pnlBoxProperties
function addPnlBoxText(f, name, font, clas, fontCase) {  //adding controls only for 'IMAGE' panel boxes

    dataLayer[f] = '\n*';
    dataLayer[f] += `\nref: ${f}`;
    dataLayer[f] += `\npnlBoxText: ${name}`;
    dataLayer[f] += `\nfontName: ${font}`;
    dataLayer[f] += `\nfontClass: ${clas}`;
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

    dataLayer[f] += `\ntxtResizeText: 48`;
    dataLayer[f] += `\ntxtTextColor: rgba(148, 158, 255, 1)`;
    dataLayer[f] += `\ntxtLetterSpacing: 0`;
    dataLayer[f] += `\ntxtLineHeight: Auto`;
    dataLayer[f] += `\nselTextCase: ${fontCase}`;
    dataLayer[f] += `\nselTextResize: AutoWidth`;
    dataLayer[f] += `\nselTextHori: AlignLeft`;
    dataLayer[f] += `\nselTextVerti: AlignTop`;
 
    dataLayer[f] += `\ntxtOutlineColor: rgba(104, 133, 204, 1)`;
    dataLayer[f] += `\ntxtOutlineSize: 1`;

    dataLayer[f] += `\ntxtGlowColor: rgba(104, 133, 204, 1)`;
    dataLayer[f] += `\ntxtGlowSpread: 10`;

    dataLayer[f] += `\ntxtShadowColor: rgba(0, 0, 0, 1)`;
    dataLayer[f] += `\ntxtShadowSize: 20`;
    dataLayer[f] += `\ntxtShadowSpread: 0`;
    dataLayer[f] += `\ntxtShadowRotation: 0`;

    dataLayer[f] += `\ndropdown 0: Normal`;
    dataLayer[f] += `\ndropdown 1: Regular`;
    dataLayer[f] += `\ndropdown 2: Remove`;

    //after all assigned controls then create the actual pattern layer
    createCanvasText(f, name, font, clas, fontCase);

}

function createCanvasText(f, name, font, clas, fontCase) {

    cnvLayers[f] = document.createElement('div');
    cnvLayers[f].style.visibility = "visible";
    cnvLayers[f].classList.add('cnvLayers');
    cnvLayers[f].dataset.rotation = 0;
    cnvLayers[f].dataset.ref = f;
    cnvLayers[f].dataset.font = font;
    cnvLayers[f].dataset.class = clas;
    cnvLayers[f].dataset.type = "text";
    cnvLayers[f].dataset.lock = "unlock";
    cnvLayers[f].dataset.mask = "unmask";
    cnvLayers[f].dataset.fontSize = 48;
    //1x1 IS THE DESIGN FLOOR. sir, 2026-09-27: "make 20px on screen but min in design and in
    //datalayer and in pnlbox input values" - THE 20px ON SCREEN IS THE PIN'S, SEE PIN_MIN_PX
    cnvLayers[f].style.minWidth = 1 + 'px';
    cnvLayers[f].style.minHeight = 1 + 'px';
    cnvLayers[f].style.width = "auto";
    
    //create textarea
    let textArea = document.createElement('p');
    textArea.classList.add('textArea');
    textArea.innerText = font;
    textArea.style.fontFamily = font;
    textArea.style.fontWeight = 400;
    textArea.style.fontStyle = 'normal';
    textArea.style.fontSize = 48 + 'px';
    textArea.style.textTransform = fontCase;
    textArea.style.position = "relative";

    textArea.setAttribute('spellcheck', "false");
    textArea.setAttribute('data-gramm', "false");
    textArea.setAttribute('data-gramm_editor', "false");
    textArea.setAttribute('data-enable-grammarly', 'false');

    cnvLayers[f].prepend(textArea);

    //append cnvLayers[f] to cnvGrpLayers
    cnvGrpLayers.appendChild(cnvLayers[f]);
    
    //position cnvlayer to center
    positionCanvas(cnvLayers[f]);

    //append the content of the textarea
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtWidthLayer', `${cnvLayers[f].clientWidth}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtHeightLayer', `${cnvLayers[f].clientHeight}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', `${cnvLayers[f].offsetLeft}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', `${cnvLayers[f].offsetTop}`);
    dataLayer[f] += `\ninnerText: ${encodeURIComponent(cnvLayers[f].children[0].innerText)}`;

    //create history stamp
    createHistory(f, name, 'text', font, clas, fontCase);

    //add border
    addBorderLayer(cnvLayers[f], f);
    
    currCase = fontCase;

    //A NEW TEXT LAYER IS THE DEFAULTS addPnlBoxText WROTE, PLUS THE FONT'S OWN CASE. sir, 2026-10-04: THE LAST TEXT'S
    //SETTINGS ARE A NUISANCE, CTRL + C CLONES A CAPTION 100%. checkCurrTextSettings RESTYLED THE CANVAS FROM THE curr GLOBALS
    //AFTER THE SIZE AND THE HISTORY WERE RECORDED AND NEVER WROTE BACK, SO THE PANEL SHOWED 48 ON A 60px LAYER
    canvas2Focus(cnvLayers[f])
}

//=================RESIZE TABSLIDER AND TABFONTCATEGORY================
function resizeContent() {
    tabFontCategory.style.height = tabFontCategory.parentElement.clientHeight + 'px';
    tabSliderFont.style.height = tabSliderFont.parentElement.clientHeight + 'px';
}
resizeContent();


//----------START SELECTING FONT TAB-----------------

function fontSelectClick() {

    let fontSelect = document.getElementsByClassName('fontSelect');

    for(let a = 0; a < fontSelect.length; a++) {

        fontSelect[a].removeEventListener('mouseover', fontSelectHover);
        fontSelect[a].removeEventListener('mouseleave', fontSelectLeave);
        fontSelect[a].removeEventListener('click', fontSelectClick);

        fontSelect[a].addEventListener('mouseover', fontSelectHover);
        fontSelect[a].addEventListener('mouseleave', fontSelectLeave);
        fontSelect[a].addEventListener('click', fontSelectClick);
   
        fontSelect[a].style.backgroundColor = "transparent";
        //fontSelect[a].style.border = "1px solid #363F52";
        fontSelect[a].children[0].style.filter = "none";
    }

    //this.style.border = "1px solid var(--muted-blue-text)";
    this.style.backgroundColor = "var(--accent)";
    this.children[0].style.filter = "brightness(200)";
    this.removeEventListener('mouseleave', fontSelectLeave);

    if(this.id.includes('Stylish')) {

        breaklineThumbFonts.style.width = "33%";
        tabSansSerif.style.overflowY = "hidden";
        tabSerif.style.overflowY = "hidden";

        let timeOut = setTimeout(function() {
            tabStylish.style.overflowY = "auto";
            clearTimeout(timeOut);
        }, 200);

        breaklineThumbFonts.style.translate = "0%";
        tabSliderFont.style.translate = "0%";

    }
    else if(this.id.includes('SansSerif')) {

        breaklineThumbFonts.style.width = "33%";
        tabStylish.style.overflowY = "hidden";
        tabSerif.style.overflowY = "hidden";

        let timeOut = setTimeout(function() {
            tabSansSerif.style.overflowY = "auto";
            clearTimeout(timeOut);
        }, 200);

        breaklineThumbFonts.style.translate = "100%"
        tabSliderFont.style.translate = "-100%";

    }
    else if(this.id.includes('Serif')) {

        breaklineThumbFonts.style.width = "33%";
        tabStylish.style.overflowY = "hidden";
        tabSansSerif.style.overflowY = "hidden";
       
        let timeOut = setTimeout(function() {
            tabSerif.style.overflowY = "auto";
            clearTimeout(timeOut);
        }, 200);

        breaklineThumbFonts.style.translate = "200%";
        tabSliderFont.style.translate = "-200%";

    }
}

function fontSelectHover() {
    if(fontSelected != this.children[0].innerText) {
        
        this.children[0].style.filter = "brightness(200)";
    }
}

function fontSelectLeave() {
    if(fontSelected != this.children[0].innerText) {
        this.children[0].style.filter = "none";
    }
}

for(let a = 0; a < document.getElementsByClassName('fontSelect').length; a++) {

    document.getElementsByClassName('fontSelect')[a].addEventListener('mouseover', fontSelectHover);
    document.getElementsByClassName('fontSelect')[a].addEventListener('mouseleave', fontSelectLeave);
    document.getElementsByClassName('fontSelect')[a].addEventListener('click', fontSelectClick);
}
document.getElementsByClassName('fontSelect')[0].click();

///////////////////////////////LAZY LOAD ALL FONTS///////////////////////////

async function fontLazyLoad() {

    let font = "";
    let dataLength;
    
    if(this.id == 'tabStylish') {
        font = "stylish";
        dataLength = stylishLength;
    }
    else if(this.id == 'tabSansSerif') {
        font = "sans_serif";
        dataLength = sansSerifLength;
    }
    else if(this.id == 'tabSerif') {
        font = "serif";
        dataLength = serifLength;
    }

    //ONE LOAD AT A TIME PER TAB. A FAST SCROLL FIRES MANY scroll EVENTS AND THEY USED TO START LOADS ON TOP OF EACH OTHER
    if(this.dataset.loading == "true" || this.firstElementChild == null) return;

    let maxEntries = 6;

    //ONE ROW BEFORE EITHER EDGE, NOT AT IT. THE NEXT BATCH IS USUALLY READY BEFORE THE USER GETS THERE, AND AN EXACT
    //scrollTop == END TEST COULD NEVER BE TRUE AT A FRACTIONAL SCROLL (BROWSER ZOOM, 125% SCALING)
    let row = this.firstElementChild.offsetHeight;

    //SCROLLING TO BOTTOM AND RELOADING FUTURE FONTS
    if(this.scrollTop + this.clientHeight >= this.scrollHeight - row) {

        let i = Number(this.lastElementChild.dataset.thumbno);
        let count = Math.min(maxEntries, dataLength - 1 - i);

        if(!(count > 0)) return;

        this.dataset.loading = "true";

        await lazyFontFillers(this, count, "down");

        //EXACTLY THE ROWS THE FILLERS WERE MADE FOR: i + 1 TO i + count
        let data = await fetchLimitedFonts(font, i + 1, i + count);

        (data || []).forEach((font) => {

            let wrapFont = font != null ? this.querySelector(`[data-thumbno='${font.index}']`) : null;

            if(wrapFont != null) fillFontRow(wrapFont, font);
        });

        lazyFontDeleteUp.call(this);

        this.dataset.loading = "false";
    }

    //SCROLLING TO TOP AND RELOADING PREVIOUS FONTS
    else if(this.scrollTop <= row) {

        let i = Number(this.firstElementChild.dataset.thumbno);
        let count = Math.min(maxEntries, i);

        if(!(count > 0)) return;

        this.dataset.loading = "true";

        let oldScrollTop = this.scrollTop;
        let oldScrollH = this.scrollHeight;

        await lazyFontFillers(this, count, "up");

        //THE ROWS WENT IN ABOVE THE VIEW. THE SCROLL MOVES DOWN BY EXACTLY THEIR HEIGHT, SO WHAT THE USER IS LOOKING AT STAYS
        //PUT. THE BROWSER CANNOT DO THIS ITSELF AT scrollTop 0, AND THE OLD FIXED scrollTop = 33 THREW THE VIEW ~280px
        this.scrollTop = oldScrollTop + (this.scrollHeight - oldScrollH);

        //THE FILLERS ARE i - 1 DOWN TO i - count. IT FETCHED i - 5 TO i, SO THE TOP ROW STAYED BLANK EVERY TIME
        let data = await fetchLimitedFonts(font, i - count, i - 1);

        (data || []).forEach((font) => {

            let wrapFont = font != null ? this.querySelector(`[data-thumbno='${font.index}']`) : null;

            if(wrapFont != null) fillFontRow(wrapFont, font);
        });

        lazyFontDeleteDown.call(this);

        this.dataset.loading = "false";
    }
}
tabStylish.addEventListener('scroll', fontLazyLoad);
tabSansSerif.addEventListener('scroll', fontLazyLoad);
tabSerif.addEventListener('scroll', fontLazyLoad);

//ONE ROW OF THE FONT MENU, FROM ONE res_font ROW. THE LAZY LOAD BOTH WAYS AND THE BOOT REFRESH (fetchStylishLength AND
//ITS TWINS) ALL FILL ROWS HERE. THE NAME IS WRITTEN ONLY ONCE THE FONT ITSELF HAS LOADED, SO A ROW NEVER SHOWS ITS NAME IN
//THE FALLBACK FONT. THE WAIT IS CAPPED SO ONE SLOW OR BROKEN FONT NEVER HOLDS THE LIST
async function fillFontRow(wrapFont, data) {

    //THE STYLESHEET ALREADY IN THE HEAD, FOUND BY ITS EXACT href. head.innerHTML NEVER MATCHED: THE BROWSER WRITES & AS &amp; AND
    //crossorigin AS crossorigin="", SO EVERY LOAD ADDED THE SAME <link> AGAIN. EXACT, BECAUSE A PRECONNECT TO fonts.googleapis.com
    //IS A PREFIX OF EVERY FONT URL
    let href = (data.source.match(/href=["']([^"']+)["']/) || [])[1];
    let link = [...document.head.querySelectorAll('link[rel="stylesheet"]')].find((link) => link.getAttribute('href') == href);

    if(link == null) {
        document.head.insertAdjacentHTML('beforeend', data.source);
        link = document.head.lastElementChild;
    }

    let cursive = data.tags.includes('cursive');

    //THE ROW KNOWS WHAT IT IS RIGHT AWAY, SO A CLICK OR A LOOKUP BY thumbno NEVER MEETS A HALF FILLED ROW
    wrapFont.dataset.font = data.name;
    wrapFont.dataset.class = data.class;
    wrapFont.dataset.case = cursive ? "Capitalize" : "UpperCase";
    wrapFont.dataset.thumbno = data.index;

    let cap = new Promise((resolve) => setTimeout(resolve, 3000));

    //FIRST THE STYLESHEET, OR document.fonts HAS NO @font-face TO LOAD AND ANSWERS AT ONCE, THEN THE FONT FILE ITSELF
    if(link.sheet == null) {
        await Promise.race([new Promise((resolve) => { link.addEventListener('load', resolve, {once: true}); link.addEventListener('error', resolve, {once: true}); }), cap]);
    }

    await Promise.race([document.fonts.load(`400 16px "${data.name}"`).catch(() => {}), cap]);

    //A LATER FILL OF THE SAME ROW (BOOT REFRESH, A FAST SCROLL BACK) WINS. THIS ONE STOPS IF THE ROW MOVED ON
    if(wrapFont.dataset.font != data.name) return;

    if(cursive) {
        wrapFont.innerHTML = `<h2 style="font-family: '${data.name}'; font-size: 130%; font-weight: 400; text-transform: capitalize;">${data.name}</h2>`;
    }
    else {
        wrapFont.innerHTML = `<h2 style="font-family: '${data.name}'; font-weight: 400; text-transform: uppercase;">${data.name.toUpperCase()}</h2>`;
    }

    wrapFont.style.backgroundColor = "transparent";
}

//////////////////////////////LAZY REMOVE EXCESS FONTS///////////////////////
//MEASURED AGAINST THE LIST'S OWN BOX, NOT THE WINDOW. WITH THE MENU CLOSED THE LIST SITS FAR BELOW THE WINDOW AND ONE LOAD
//DELETED EVERY ROW. ONE SCREEN OF ROWS STAYS ON EACH SIDE, SO A SHORT SCROLL BACK NEVER WAITS FOR A RELOAD
function lazyFontDeleteUp() {

    let box = this.getBoundingClientRect();

    if(box.height == 0) return;

    let oldScrollTop = this.scrollTop;
    let oldScrollH = this.scrollHeight;

    this.querySelectorAll('.wrapFonts').forEach((wrapFont) => {
        if(wrapFont.getBoundingClientRect().bottom < box.top - box.height) {
            wrapFont.remove();
        }
    })

    //ROWS LEFT FROM ABOVE THE VIEW, SO THE SCROLL COMES UP BY THEIR HEIGHT AND NOTHING THE USER SEES MOVES
    this.scrollTop = oldScrollTop - (oldScrollH - this.scrollHeight);
}

function lazyFontDeleteDown() {

    let box = this.getBoundingClientRect();

    if(box.height == 0) return;

    this.querySelectorAll('.wrapFonts').forEach((wrapFont) => {
        if(wrapFont.getBoundingClientRect().top > box.bottom + box.height) {
            wrapFont.remove();
        }
    })
}



function adjustTextArea(f) {

    let z = rngZoom.value / 100;
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

    //THE LAYER'S OWN MODE, NOT THE GLOBAL. currResizeBox IS ONE VALUE FOR THE WHOLE APP AND IT
    //ONLY MOVES WHEN A RESIZE BUTTON IS CLICKED, SO IT WAS OFTEN ANOTHER LAYER'S. dataLayer IS
    //KEPT CURRENT BY encodeSelectMulti, BY THE RESIZE ENCODER AND BY UNDO/REDO
    let mode = valueFinder(dataLayer[f], 'selTextResize') || currResizeBox;

    let text = canvas.childElementCount == 1 ? canvas.children[0] : canvas.children[1];

    //THE 1px SHRINK MEASURE IS ONLY TRUE FOR TEXT THAT NEVER WRAPS. sir, 2026-09-26: "the box
    //does not resize or fixed sometimes making the text go to vertical 1 line". A FixedSize OR
    //AutoHeight LAYER WRAPS, SO AT 1px IT BROKE TO ONE CHARACTER PER LINE AND KEPT THAT WIDTH -
    //AND A HANDLE DRAG MAKES ANY TEXT FixedSize, SO EVERY FONT SWAP ON A RESIZED LAYER DID IT
    if(mode == "AutoWidth") {

        text.style.width = 1 + 'px';
        text.style.width = text.scrollWidth + 'px';
        text.style.height = 1 + 'px';
        text.style.height = text.scrollHeight + 'px';

        canvas.style.width = text.scrollWidth + 'px';
        canvas.style.height = text.scrollHeight + 'px';
    }
    else {

        //WRAPPING LAYER: THE BOX WIDTH IS THE DESIGN, THE TEXT FILLS IT. EVERY CHILD, SO THE
        //OUTLINE COPY WRAPS AT THE SAME WIDTH AS THE FILL
        for(let a = 0; a < canvas.childElementCount; a++) {
            canvas.children[a].style.width = canvas.clientWidth + 'px';
        }

        text.style.height = 1 + 'px';
        text.style.height = text.scrollHeight + 'px';

        //AutoHeight GROWS THE BOX TO THE TEXT. FixedSize LEAVES THE BOX EXACTLY AS DRAWN
        if(mode == "AutoHeight") canvas.style.height = text.scrollHeight + 'px';
    }
    
    adjustBorder();

    //enable back cnvGrpLayers css
    cnvGrpLayers.style.boxSizing = "border-box";
    cnvGrpLayers.style.overflow = "hidden";
    
}

//===========================================================================
//////////////////////////////////TEXT FORMAT////////////////////////////////
//===========================================================================

async function addFontWeights() {
  
    if(leadPanel != null) {

        let font = leadPanel.dataset.font;
        let clas = leadPanel.dataset.class;

        let append = ""

        if(clas == "serif") {

            let serif = await fetchFontByName('serif', font);

            let normal = serif.normal.split(', ');

            for(let b = 0; b < normal.length; b++) {
                append += `<div class="optTextWeight">${normal[b]}</div>`;
            }

            if(serif.italics != "") {
                append += `<div class="breaklineVerti"></div> `;

                let italics = serif.italics.split(', ');

                for(let b = 0; b < italics.length; b++) {
                    append += `<div class="optTextWeight">${italics[b]} Italic</div>`;
                }
            }
          
        }

        else if(clas == "sans serif") {

            let sansSerif = await fetchFontByName('sans_serif', font);
            
            let normal = sansSerif.normal.split(', ');
            
            for(let b = 0; b < normal.length; b++) {
                append += `<div class="optTextWeight">${normal[b]}</div>`;
            }

            if(sansSerif.italics != "") {
                append += `<div class="breaklineVerti"></div> `;

                let italics = sansSerif.italics.split(', ');

                for(let b = 0; b < italics.length; b++) {
                    append += `<div class="optTextWeight">${italics[b]} Italic</div>`;
                }
            }

        }

        else if(clas == "stylish") {

            let stylish = await fetchFontByName('stylish', font);

            let normal = stylish.normal.split(', ');

            for(let b = 0; b < normal.length; b++) {
                append += `<div class="optTextWeight">${normal[b]}</div>`;
            }

            if(stylish.italics != "") {
                append += `<div class="breaklineVerti"></div> `;

                let italics = stylish.italics.split(', ');

                for(let b = 0; b < italics.length; b++) {
                    append += `<div class="optTextWeight">${italics[b]} Italic</div>`;
                }
            }
        }

        
        let drop = document.getElementById('pnlBoxText').querySelectorAll('.dropOptionVerti');
        drop[1].innerHTML = append;
            
        document.getElementById('pnlBoxText').querySelectorAll('.optTextWeight')
        .forEach((opt) => {
            opt.addEventListener('pointerdown', chooseTextWeight);
            opt.addEventListener('pointerdown', encodeTextWeight);
        })
    }
}

//===============SWAP FONT MODE==================

function startSwapFont() {

    //CAPTURE THE TARGETS NOW. resetAllFocus RUNS ON ALMOST EVERY CLICK OUTSIDE THE CANVAS,
    //SO focusPanel CANNOT BE TRUSTED TO STILL HOLD THEM BY THE TIME A FONT IS CHOSEN
    swapTargets = [];

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null && focusPanel[a].dataset.type == "text") {
            swapTargets.push(Number(focusPanel[a].dataset.ref));
        }
    }

    if(swapTargets.length == 0) return;

    swapMode = "font";

    let btn = document.getElementById('pnlBoxText').querySelector('.btnFontLabel');

    //STASH THE LABEL BEFORE OVERWRITING IT. WITHOUT THIS A CANCEL BEFORE decodeData3 HAS
    //EVER RUN WOULD LEAVE THE BUTTON READING "Selecting a new font"
    //dataset.full IS WHAT fitSwapLabel STORES, AND IT IS THE WHOLE NAME - dataset.font WOULD
    //HAVE STASHED THE TRUNCATED LABEL AND THE CANCEL WOULD HAVE PUT "Helvetica Neu..." BACK
    btn.dataset.font = btn.dataset.full || btn.querySelector('h2').innerText;

    btn.querySelector('h2').innerText = "Select a new font";
    btn.querySelector('svg').style.display = "none";
    btn.querySelector('.spinFontLabel').style.display = "flex";
    btn.classList.add('swapping');

    //THE BUTTON STOPS RESPONDING WHILE THE MODE IS LIVE, SO REPEAT CLICKS CANNOT REPLAY THE
    //MENU SLIDE. cancelSwapFont PUTS IT BACK, AND IT ONLY DOES SO IN THE BRANCH THAT ACTUALLY
    //RESTORES, SO THE PAIR CANNOT DRIFT
    btn.removeEventListener('click', startSwapFont);

    //SNAP THE MENU BACK TO ITS HIDDEN POSITION WITHOUT ANIMATING, SO showToolMenu SLIDES IT
    //IN AGAIN EVEN WHEN menuText WAS ALREADY OPEN. WITHOUT THE FORCED REFLOW BOTH TRANSFORMS
    //LAND IN THE SAME FRAME AND THE BROWSER PAINTS ONLY THE LAST ONE - NOTHING MOVES
    toolmenu.style.transition = "0s";
    toolmenu.style.transform = `translateX(-${toolmenu.offsetWidth}px)`;
    void toolmenu.offsetWidth;
    toolmenu.style.transition = "";

    //NOT .click(). A SYNTHETIC CLICK BUBBLES TO THE DELEGATED click HANDLER, WHERE #toolbox
    //IS UNGUARDED AND THE CATCH-ALL else RUNS resetAllFocus - WHICH CANCELS THIS MODE
    showToolMenu('toolText');
}

function cancelSwapFont() {

    //ONLY THIS MODE'S OWN CANCEL. cancelSwap() CALLS BOTH, SO WITHOUT THIS AN IMAGE SWAP
    //WOULD BE TORN DOWN BY THE FONT HANDLER
    if(swapMode == "image") return;

    swapMode = null;
    swapTargets = [];

    let btn = document.getElementById('pnlBoxText').querySelector('.btnFontLabel');

    //GUARD ON THE SPINNER, NOT ON swapMode. swapFontOnTargets CLEARS THE FLAG BEFORE ITS
    //await SO A SECOND DOUBLE CLICK CANNOT RE-ENTER, WHICH MEANT A FLAG GUARD HERE SKIPPED
    //THE RESTORE AND LEFT THE SPINNER RUNNING. resetAllFocus CALLS THIS CONSTANTLY, SO THE
    //EARLY RETURN STILL MATTERS
    if(btn.querySelector('.spinFontLabel').style.display == "none") return;

    btn.querySelector('svg').style.display = "flex";
    btn.querySelector('.spinFontLabel').style.display = "none";
    fitSwapLabel(btn, btn.dataset.font);
    btn.classList.remove('swapping');
    btn.addEventListener('click', startSwapFont);
}

//A TEXT LAYER ALREADY ON CANVAS HAS ITS link IN THE HEAD, SO THERE IS NOTHING TO LOAD.
//THE FONT COMES FROM dataLayer AND NOT FROM cnvLayers - createCanvasText WRITES
//dataset.font BUT dataset.class ONLY ARRIVED WITH THIS CHANGE, SO OLDER LAYERS IN A
//SAVED FILE STILL HAVE NO CLASS ON THE CANVAS. dataLayer HAS CARRIED BOTH SINCE CREATION
function swapFontFromCanvas(pin) {

    let f = Number(pin.dataset.ref);

    //NOTHING TO SWAP WHEN THE SOURCE IS ONE OF THE TARGETS
    if(swapTargets.includes(f)) {
        cancelSwapFont();
        return;
    }

    swapFontOnTargets(valueFinder(dataLayer[f], 'fontName'), valueFinder(dataLayer[f], 'fontClass'), null, true);
}

async function swapFontOnTargets(font, clas, source, instant) {

    let targets = swapTargets.slice();

    //THE MODE ENDS THE MOMENT THE CHOICE IS MADE. THE TARGETS ARE ALREADY COPIED
    swapMode = null;
    swapTargets = [];

    if(targets.length == 0) return;

    //instant IS THE CANVAS PICK. THAT FONT IS ALREADY RENDERING ON ANOTHER LAYER, SO ITS
    //link IS IN THE HEAD AND ITS FACE IS DOWNLOADED - THERE IS NOTHING TO WAIT FOR AND AN
    //OVERLAY WOULD ONLY FLASH
    if(!instant) showLoading();

    //THE LIST INJECTS EACH FONT'S link AS IT RENDERS, BUT A SEARCH RESULT ONLY DOES SO IN
    //chooseFontSearch. INJECT AGAIN IF IT IS MISSING, THEN WAIT FOR THE FACE TO BE USABLE
    //OR adjustTextArea MEASURES AGAINST THE FALLBACK
    if(source != null && !document.head.innerHTML.includes(source)) {
        document.head.insertAdjacentHTML('beforeend', source);
    }

    if(!instant) {
        try { await document.fonts.load(`400 48px "${font}"`); } catch {}
    }

    let table = clas.replace(' ', '_');
    let normals = "";
    let italics = "";

    try {
        let data = await fetchFontByName(table, font);
        normals = data.normal;
        italics = data.italics;
    }
    catch {}

    let tempHistory = "\nSwitch Font";

    for(let a = 0; a < targets.length; a++) {

        let f = targets[a];
        let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
        let panel = f2Panel(f);

        if(canvas == null || panel == null) continue;

        let oldFont = valueFinder(dataLayer[f], 'fontName');
        let oldClass = valueFinder(dataLayer[f], 'fontClass');
        let oldWeight = valueFinder(dataLayer[f], 'dropdown 1');

        if(oldFont == font) continue;

        //KEEP THE WEIGHT WHEN THE NEW FONT HAS IT, OTHERWISE Regular. AN ITALIC WEIGHT
        //ALSO NEEDS THE NEW FONT TO SHIP ITALICS AT ALL, NOT JUST THAT WEIGHT NAME
        let newWeight = oldWeight;

        if(normals != "") {

            let plain = oldWeight.replace(" Italic", "");
            let list = oldWeight.includes(" Italic")? italics: normals;

            if(list == "" || !list.split(', ').includes(plain)) newWeight = "Regular";
        }

        tempHistory += `*`;
        tempHistory += `\nref: ${f}`;
        tempHistory += `\npnlBoxText: ${panel.querySelector('.txtHeader').value}`;
        tempHistory += `\nfontName: ${font}`;
        tempHistory += `\nfontClass: ${clas}`;
        tempHistory += `\ndropdown 1: ${newWeight}`;
        tempHistory += `\n_`;
        tempHistory += `\nfontName: ${oldFont}`;
        tempHistory += `\nfontClass: ${oldClass}`;
        tempHistory += `\ndropdown 1: ${oldWeight}\n`;

        applyFontToLayer(f, font, clas, newWeight);
    }

    if(tempHistory.includes('*')) makeNewHistory(tempHistory);

    //cancelSwapFont RESTORES THE LABEL FROM dataset.font, SO POINT IT AT THE NEW FONT FIRST
    document.getElementById('pnlBoxText').querySelector('.btnFontLabel').dataset.font = font;
    document.getElementById('pnlBoxText').querySelector('.btnFontLabel').dataset.full = font;

    cancelSwapFont();

    if(f2Panel(targets[0]) != null) panel2Focus(f2Panel(targets[0]));

    if(!instant) hideLoading();
}

//THE CASING IS NEVER TOUCHED HERE. selTextCase IS THE USER'S DESIGN DECISION AND THE FONT'S
//OWN data-case ONLY SEEDS A NEW LAYER
function applyFontToLayer(f, font, clas, weight) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let panel = f2Panel(f);

    if(canvas == null || panel == null) return;

    panel.dataset.font = font;
    panel.dataset.class = clas;
    canvas.dataset.font = font;
    canvas.dataset.class = clas;

    //EVERY CHILD. WITH AN OUTLINE THE STROKE COPY IS children[0] AND THE FILL IS children[1],
    //SO WRITING children[0] ONLY LEFT THE FILL - THE ONE adjustTextArea MEASURES - ON THE OLD
    //FONT, AND THE BOX WAS SIZED FOR A FACE THAT WAS NO LONGER ON SCREEN
    for(let a = 0; a < canvas.childElementCount; a++) {
        canvas.children[a].style.fontFamily = font;
    }

    dataLayer[f] = valueSwitcher(dataLayer[f], 'fontName', font);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'fontClass', clas);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'dropdown 1', weight);

    applyTextWeight(f, weight);

    adjustTextArea(f);
    adjustBorder();
}

document.getElementById('pnlBoxText').querySelector('.btnFontLabel').addEventListener('click', startSwapFont);

function chooseTextWeight() {
   
    //change dropoptionverti text
    let f = Number(leadPanel.dataset.ref);
    let panel = document.getElementById('pnlBoxText');

    let drop = panel.querySelectorAll('.dropdown');

    drop[1].children[0].innerText = this.innerText;
    drop[1].dataset.default = this.innerText;

    applyTextWeight(f, this.innerText);
}

//TAKES THE WEIGHT AS A PARAMETER INSTEAD OF READING IT OFF A CLICKED OPTION, SO THE
//RESTORE AND REPLAY PATHS NEVER DEPEND ON THE OPTION LIST EXISTING. addFontWeights
//REBUILDS THAT LIST ASYNCHRONOUSLY, SO ANYTHING READING IT ON THE SAME TICK GETS THE
//PREVIOUS LAYER'S OPTIONS
function applyTextWeight(f, value) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

    if(canvas == null || value == null) return;

    let style = value.includes('Italic') ? "italic" : "normal";
    let weight = convertWeight(value.replace(" Italic", ""));

    //EVERY CHILD, FOR THE SAME REASON AS applyFontToLayer: children[0] IS THE STROKE COPY WHEN
    //THERE IS AN OUTLINE, AND THE FILL NEXT TO IT KEPT THE OLD WEIGHT
    for(let a = 0; a < canvas.childElementCount; a++) {

        let child = canvas.children[a];

        if(child.style.fontStyle != style) child.style.fontStyle = style;
        if(weight != undefined && child.style.fontWeight != weight) child.style.fontWeight = weight;
    }

    adjustTextArea(f);
    refitTextWhenLoaded(f);
}

//sir, 2026-09-27: "font eyedropper and changing weight does not scale the text layer boundary".
//A FACE IS ONLY DOWNLOADED WHEN SOMETHING FIRST ASKS FOR IT, SO A MEASURE ON THE SAME TICK AS
//THE NEW WEIGHT READS THE FALLBACK FONT AND THE BOX KEEPS THE OLD SIZE. THE OLD 300ms TIMER
//ONLY HID THAT - IT NEVER MEASURED AGAIN. THIS WAITS FOR THE EXACT FACE, THEN MEASURES. A FACE
//THAT IS ALREADY LOADED RESOLVES AT ONCE, SO A WEIGHT THAT IS ON SCREEN COSTS NOTHING
let textFitTickets = {};

async function refitTextWhenLoaded(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

    if(canvas == null || canvas.childElementCount == 0) return;

    //A NEWER CALL FOR THE SAME LAYER OWNS THE MEASURE. TWO QUICK WEIGHT PICKS MUST NOT LET THE
    //SLOWER, OLDER FACE RESOLVE LAST AND SIZE THE BOX FOR IT
    let ticket = (textFitTickets[f] || 0) + 1;
    textFitTickets[f] = ticket;

    //THE FILL IS THE LAST CHILD WITH OR WITHOUT AN OUTLINE
    let text = canvas.lastElementChild;
    let cs = getComputedStyle(text);
    let family = (text.style.fontFamily || cs.fontFamily).split(',')[0].replace(/["']/g, '').trim();
    let face = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) || 48}px "${family}"`;

    //HIDDEN ONLY WHILE THE FACE IS STILL COMING. FOCUSING A LAYER RUNS THIS TOO, AND ITS FACE
    //IS ALREADY HERE - HIDING THEN WOULD BLINK THE TEXT ON EVERY CLICK
    let ready = false;

    //document.fonts.check SAID true FOR UNLOADED FACES (MEASURED, Poppins italic 800), SO THE TEXT SHOWED THE TIMES FALLBACK. READ THE FACES
    let weight = Number(cs.fontWeight);
    let wanted = [...document.fonts].filter((ff) => {
        let [lo, hi = lo] = ff.weight.split(' ').map(Number);
        return ff.family.replace(/["']/g, '') == family && ff.style == cs.fontStyle && weight >= lo && weight <= hi;
    });

    ready = wanted.length == 0 || wanted.some((ff) => ff.status == "loaded");

    if(!ready) {
        for(let a = 0; a < canvas.childElementCount; a++) canvas.children[a].style.visibility = "hidden";
    }

    //AN EMPTY ANSWER MEANS THE FONT'S STYLESHEET HAS NOT DECLARED THE FACE YET - A SEARCH RESULT
    //INJECTS ITS link ON THE SAME TICK. ASK AGAIN FOR A MOMENT BEFORE MEASURING ANYWAY
    for(let tries = 0; tries < 10; tries++) {

        let faces = [];

        try { faces = await document.fonts.load(face, text.innerText || ' '); } catch {}

        if(textFitTickets[f] != ticket) return;

        if(faces.length > 0) break;

        //THE TEXT COMES BACK AFTER THE FIRST ANSWER AND THE RETRIES ONLY WAIT, SO A SYSTEM FONT
        //WITH NO @font-face IS NEVER LEFT INVISIBLE FOR THE WHOLE 1.5s
        for(let a = 0; a < canvas.childElementCount; a++) canvas.children[a].style.visibility = "";

        await new Promise(resolve => setTimeout(resolve, 150));

        if(textFitTickets[f] != ticket) return;
    }

    //"" AND NOT "visible": A CHILD SET TO visible SHOWS THROUGH A HIDDEN PARENT, SO A LAYER THE
    //USER HAD HIDDEN WOULD REAPPEAR. EMPTY HANDS VISIBILITY BACK TO THE LAYER
    for(let a = 0; a < canvas.childElementCount; a++) canvas.children[a].style.visibility = "";

    //DELETED WHILE ITS FACE WAS LOADING
    if(!canvas.isConnected) return;

    adjustTextArea(f);
    adjustBorder();
}


function convertWeight(weight) {
   
    if(weight == "Thin") {
        return "100";
    }
    else if(weight == "Extra Light") {
        return "200";
    }
    else if(weight == "Light") {
        return "300";
    }
    else if(weight == "Regular") {
        return "400";
    }
    else if(weight == "Medium") {
        return "500";
    }
    else if(weight == "Semi Bold") {
        return "600";
    }
    else if(weight == "Bold") {
        return "700";
    }
    else if(weight == "Extra Bold") {
        return "800";
    }
    else if(weight == "Black") {
        return "900";
    }

}

function adjustTextSize() {

    currFontSize = this.value;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {
                for(let b = 0; b < canvas.childElementCount; b++) {
                    canvas.children[b].style.fontSize = this.value + 'px';
                }
                
                canvas.dataset.fontSize = this.value;
            }

            adjustTextArea(f);
        }
    }

}
document.getElementById('pnlBoxText').querySelector('.txtResizeText').addEventListener('change', adjustTextSize);

function adjustTextColor() {
    
    currFontColor = this.value;
    let gradientString = this.dataset.gradient;
    let thumbPicker = this.nextElementSibling;
    
    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            let fillChild = canvas.lastElementChild;

            if(type == "text") {
                
                fillChild.style.textShadow = "none";

                if(testHexCode(this) == "Linear" || testHexCode(this) == "Radial") {
                    fillChild.style.background = gradientString;
                    fillChild.style.webkitBackgroundClip = 'text';
                    fillChild.style.webkitTextFillColor = 'transparent';
                    fillChild.style.backgroundClip = 'text';
                    fillChild.style.color = 'transparent';

                    //change thumbpick color
                    thumbPicker.children[1].style.background = this.dataset.gradient;
                }
                else {

                    this.dataset.gradient = "";
                    let alpha = this.dataset.alpha;
                    let rgb = hex2RGBStringEncoding(testHexCode(this));
                    fillChild.style.color = `rgba(${rgb}, ${alpha})`;
                    fillChild.style.background = '';
                    fillChild.style.webkitBackgroundClip = '';
                    fillChild.style.webkitTextFillColor = '';
                    fillChild.style.backgroundClip = '';

                    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
                }
                
            }   
        }
    }
    
}
document.getElementById('pnlBoxText').querySelector('.txtTextColor').addEventListener('change',  adjustTextColor);

function adjustLetterSpacing() {
    
    let panel = document.getElementById('pnlBoxText');
    panel.querySelector('.txtLetterSpacing').value = this.value;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {
                for(let b = 0; b < canvas.childElementCount; b++) {
                    canvas.children[b].style.letterSpacing = this.value + 'px';
                }
                adjustTextArea(f);
            }
        }
    }

    currLetterSpacing = this.value;

}
document.getElementById('pnlBoxText').querySelector('.txtLetterSpacing').addEventListener('change', adjustLetterSpacing);

function adjustLineHeight() {

    let panel = document.getElementById('pnlBoxText');

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {

                if(Number.isInteger(Number(this.value)) && this.value !== null && this.value !== "" && this.value.trim() !== '') {

                    panel.querySelector('.txtLineHeight').value = this.value.trim();

                    for(let b = 0; b < canvas.childElementCount; b++) {
                        canvas.children[b].style.lineHeight = this.value.trim() / 10;
                    }

                    currLineHeight = this.value.trim();
                }
            
                else {
            
                    panel.querySelector('.txtLineHeight').value = "Auto";

                    for(let b = 0; b < canvas.childElementCount; b++) {
                        canvas.children[b].style.lineHeight = "normal";
                    }

                    currLineHeight = "normal";
                }
            }
        }
    }

}

function rollLineHeight(e) {

    let panel = document.getElementById('pnlBoxText');
    //start formatting
    if(e.key == "ArrowDown") {
        if(Number.isInteger(Number(this.value))) {
            if(this.value > 0) {
                this.value--;
            }
            else {
                this.value = "Auto";
                currLineHeight = "normal";
            }
        }
        else {

            this.value = "Auto";
            currLineHeight = "normal";

        }
    }

    else if(e.key == "ArrowUp") {
        if(Number.isInteger(Number(this.value))) {
            
            this.value++;
            currLineHeight = this.value /10;
            
        }
        else {

            this.value = 0;
            currLineHeight = this.value /10;

        }
    }

    else if(e.key == " ") {
        e.preventDefault();
    }

    else {
        return;
    }

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {

                if(Number.isInteger(Number(this.value))) {
                    canvas.children[0].style.lineHeight = this.value / 10;
                    panel.querySelector('.txtLineHeight').value = this.value;
                    currLineHeight = this.value /10;
                }
                
                else {
                    canvas.children[0].style.lineHeight = "normal";
                    panel.querySelector('.txtLineHeight').value = "Auto";
                    currLineHeight = "normal";
                }
            
                adjustTextArea(f);

            }
        }
    }
}

document.getElementById('pnlBoxText').querySelector('.txtLineHeight').addEventListener('keydown', rollLineHeight);
document.getElementById('pnlBoxText').querySelector('.txtLineHeight').addEventListener('change', adjustLineHeight);

function adjustTextTransform() {

    let panel = document.getElementById('pnlBoxText');
    let thisCase = this.className.replace('btn', '');
    if(currCase == thisCase) {
        currCase = 'none';
    }
    else {
        currCase = thisCase;
    }

    panel.querySelector('.selTextCase').dataset.value = currCase;

    // btnTextClick CANNOT DO THIS. IT PAINTS THE CLICKED BUTTON --sharp UNCONDITIONALLY
    //AND KNOWS NOTHING ABOUT THE TOGGLE, SO TURNING A CASE OFF LEFT ITS h2 LIT WHILE THE
    //TEXT REVERTED. ONLY THIS FUNCTION KNOWS WHETHER THE CLICK TURNED A CASE ON OR OFF
    for(let b = 0; b < this.parentElement.childElementCount; b++) {
        this.parentElement.children[b].children[0].style.color = "var(--muted-blue-text)";
    }

    if(currCase != 'none') this.children[0].style.color = "var(--sharp)";

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {

                for(let b = 0; b < canvas.childElementCount; b++) {
                    //[!] USE LOWER CASE FIRST SINCE CAPITALIZE HAS CAPITAL LETTERS ALREADY
                    //CHANGES CAN'T BE SEEN IF ALL CAPS SO IT MUST BE TRANSFORMED TO LOWERCASE FIRST
                    if(currCase == "Capitalize") canvas.children[b].style.textTransform = 'lowercase';
                    canvas.children[b].style.textTransform = currCase;
                }
  
                if(currResizeBox == "AutoHeight" || currResizeBox == "AutoWidth") {
                    adjustTextArea(f);
                }
            }
        }
    }
}

// btnTextClick IS NOT BOUND HERE. adjustTextTransform OWNS THE HIGHLIGHT FOR THE CASE
//BUTTONS BECAUSE THEY TOGGLE OFF, AND btnTextClick ALWAYS PAINTS --sharp. decodeData3
//CALLS btnTextClick DIRECTLY AT controls.js 649, SO RESTORE IS UNAFFECTED
document.getElementById('pnlBoxText').querySelector('.btnCapitalize').addEventListener('pointerover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnCapitalize').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnCapitalize').addEventListener('click', adjustTextTransform);

// NO btnTextClick HERE EITHER - SEE btnCapitalize ABOVE
document.getElementById('pnlBoxText').querySelector('.btnUpperCase').addEventListener('pointerover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnUpperCase').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnUpperCase').addEventListener('click', adjustTextTransform);

// NO btnTextClick HERE EITHER - SEE btnCapitalize ABOVE
document.getElementById('pnlBoxText').querySelector('.btnLowerCase').addEventListener('pointerover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnLowerCase').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnLowerCase').addEventListener('click', adjustTextTransform);

function adjustAutoWidth() {
   
    let panel = document.getElementById('pnlBoxText');

    //curr settings
    currResizeBox = "AutoWidth";

    panel.querySelector('.selTextResize').dataset.value = currResizeBox;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "text") {
                inputFormatResizeBox(f);
            }
        }
    }

    adjustBorder();
}
document.getElementById('pnlBoxText').querySelector('.btnAutoWidth').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnAutoWidth').addEventListener('pointerover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnAutoWidth').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnAutoWidth').addEventListener('click', adjustAutoWidth);

function adjustAutoHeight() {
    
    let panel = document.getElementById('pnlBoxText');

    //curr settings
    currResizeBox = "AutoHeight";
    panel.querySelector('.selTextResize').dataset.value = currResizeBox;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "text") {
                inputFormatResizeBox(f);
            }
        }
    }

    adjustBorder();

}
document.getElementById('pnlBoxText').querySelector('.btnAutoHeight').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnAutoHeight').addEventListener('pointerover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnAutoHeight').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnAutoHeight').addEventListener('click', adjustAutoHeight);

function adjustFixedSize() {

    let panel = document.getElementById('pnlBoxText');

    //curr settings
    currResizeBox = "FixedSize";
    panel.querySelector('.selTextResize').dataset.value = currResizeBox;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "text") {
                inputFormatResizeBox(f);
            }
        }
    }

    adjustBorder();
}

document.getElementById('pnlBoxText').querySelector('.btnFixedSize').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnFixedSize').addEventListener('pointerover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnFixedSize').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnFixedSize').addEventListener('click', adjustFixedSize);

function adjustAlignHori() {

    let panel = document.getElementById('pnlBoxText');
    let hori = this.className.replace('btnAlign', '');
    
    currHoriAlignment = hori;
    panel.querySelector('.selTextHori').dataset.value = 'Align' + hori;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {
                for(let b = 0; b < canvas.childElementCount; b++) {
                    canvas.children[b].style.textAlign = hori;
                }
            }
        }
    }

}
document.getElementById('pnlBoxText').querySelector('.btnAlignLeft').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnAlignLeft').addEventListener('pointerover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnAlignLeft').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnAlignLeft').addEventListener('click', adjustAlignHori);

document.getElementById('pnlBoxText').querySelector('.btnAlignCenter').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnAlignCenter').addEventListener('mouseover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnAlignCenter').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnAlignCenter').addEventListener('click', adjustAlignHori);

document.getElementById('pnlBoxText').querySelector('.btnAlignRight').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnAlignRight').addEventListener('mouseover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnAlignRight').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnAlignRight').addEventListener('click', adjustAlignHori);

function adjustAlignVerti() {
    
    let z = rngZoom.value/100;
    let panel = document.getElementById('pnlBoxText');
    let verti = this.className.replace('btnAlign', '');
    
    currVertiAlignment = verti;

    panel.querySelector('.selTextVerti').dataset.value = 'Align' + verti;
    
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {

                if(verti == "Top") {
                    for(let b = 0; b < canvas.childElementCount; b++) {
                        canvas.children[b].style.position = "static";
                        canvas.children[b].style.marginTop = "0px";
                        canvas.children[b].style.marginBottom = "auto";
                    }
                }
            
                else if(verti == "Middle") {
                    for(let b = 0; b < canvas.childElementCount; b++) {
                        canvas.children[b].style.marginTop = "auto";
                        canvas.children[b].style.marginBottom = "auto";
                
                        //align if overflowing
                        if(canvas.children[b].clientHeight * z > canvas.clientHeight * z) {
                            let val = canvas.children[b].clientHeight * z - canvas.clientHeight * z;
                            canvas.children[b].style.position = "absolute";
                            canvas.children[b].style.top = 0 - val + 'px';
                        }
                    }
                }
            
                else if(verti == "Bottom") {
                    for(let b = 0; b < canvas.childElementCount; b++) {
                        canvas.children[b].style.marginTop = "auto";
                        canvas.children[b].style.marginBottom = "0px";
                
                        //align if overflowing
                        if(canvas.children[b].clientHeight * z > canvas.clientHeight * z) {
                            let val = canvas.children[b].clientHeight * z - canvas.clientHeight * z;
                            canvas.children[b].style.position = "absolute";
                            canvas.children[b].style.top = 0 - val * 2 + 'px';
                        }
                    }
                }
            }
        }
    }
}
document.getElementById('pnlBoxText').querySelector('.btnAlignTop').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnAlignTop').addEventListener('pointerover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnAlignTop').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnAlignTop').addEventListener('click', adjustAlignVerti);

document.getElementById('pnlBoxText').querySelector('.btnAlignMiddle').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnAlignMiddle').addEventListener('mouseover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnAlignMiddle').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnAlignMiddle').addEventListener('click', adjustAlignVerti);

document.getElementById('pnlBoxText').querySelector('.btnAlignBottom').addEventListener('click', btnOptionClick);
document.getElementById('pnlBoxText').querySelector('.btnAlignBottom').addEventListener('mouseover', btnOptionHover);
document.getElementById('pnlBoxText').querySelector('.btnAlignBottom').addEventListener('mouseleave', btnOptionLeave);
document.getElementById('pnlBoxText').querySelector('.btnAlignBottom').addEventListener('click', adjustAlignVerti);



for(let b = 0; b < document.getElementById('pnlBoxText').querySelectorAll('.optLayerStyleText').length; b++) {
 
    if(b == 3) {
        document.getElementById('pnlBoxText').querySelectorAll('.optLayerStyleText')[b].style.color = "salmon";
        document.getElementById('pnlBoxText').querySelectorAll('.optLayerStyleText')[b].addEventListener('mouseover', hoverLayerStyle)
        document.getElementById('pnlBoxText').querySelectorAll('.optLayerStyleText')[b].addEventListener('mouseout', outLayerStyle)
    }
}


//===========================REMOVE ALL TEXT STYLE======================
function removeTextStyle() {
 
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {

                if(canvas.children[1] != null) {
                    canvas.firstElementChild.remove();
                }

                canvas.lastElementChild.style.textShadow = "none";
            }
        }
    }

}
//==============================CREATE TEXT STYLE=======================

function chooseLayerStyleText() {

    let f = Number(leadPanel.dataset.ref);
    let panel = document.getElementById('pnlBoxText');
    let drop = panel.querySelectorAll('.dropdown');
    drop[2].children[0].innerText = this.innerText;
    
    if(this.innerText == "Outline") {
        panel.querySelector('.tabOutlineText').style.display = "block";
        panel.querySelector('.tabGlowText').style.display = "none";
        panel.querySelector('.tabShadowText').style.display = "none";
        showTextOutline();
        
    }
    else if(this.innerText == "Glow") {
        panel.querySelector('.tabGlowText').style.display = "block";
        panel.querySelector('.tabOutlineText').style.display = "none";
        panel.querySelector('.tabShadowText').style.display = "none";
        showTextGlow(panel.querySelector('.txtGlowColor'));
    }
    else if(this.innerText == "Shadow") {

        panel.querySelector('.tabShadowText').style.display = "block";
        panel.querySelector('.tabOutlineText').style.display = "none";
        panel.querySelector('.tabGlowText').style.display = "none";
        showTextShadow(panel.querySelector('.txtShadowColor'));
    }
    else {

        panel.querySelector('.tabShadowText').style.display = "none";
        panel.querySelector('.tabOutlineText').style.display = "none";
        panel.querySelector('.tabGlowText').style.display = "none";
        panel.querySelector('.tabStyleBox').querySelector('.dropdown').children[0].innerText = "Choose a Style";
        removeTextStyle();

    }  

}
document.querySelectorAll('.optLayerStyleText')
.forEach((opt) => {
    opt.addEventListener('pointerdown', chooseLayerStyleText)
})

function showTextOutline() {

    let textArea;
    let panel = document.getElementById('pnlBoxText');
    let txtOutlineColor = panel.querySelector('.txtOutlineColor');
    let txtOutlineSize = panel.querySelector('.txtOutlineSize');
    let gradientString = txtOutlineColor.dataset.gradient;
    let thumbPicker = txtOutlineColor.nextElementSibling;

    //IF THE COLOR VALUE IS GRADIENT
    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = focusPanel[a].dataset.ref;
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            
            if(type == "text") {

                //REMOVE FIRST THE TEXTSHADOW IF THERE'S ANY
                //BEFORE DUPLICATING
                canvas.firstElementChild.style.textShadow = "none";

                if(canvas.childElementCount == 1) {

                    //CREATE DUPLICATE TEXTAREA
                    textArea = canvas.firstElementChild.cloneNode(true);
                    canvas.prepend(textArea);

                    textArea.style.position = "absolute";
                    textArea.style.paintOrder = "stroke fill";
                    
                }

                let strokeChild = canvas.firstElementChild;

                if(testHexCode(txtOutlineColor) == "Linear" || testHexCode(txtOutlineColor) == "Radial") {

                    strokeChild.style.background = gradientString;
                    strokeChild.style.webkitBackgroundClip = "text";
                    strokeChild.style.webkitTextStroke = `${txtOutlineSize.value}px transparent`;
                    strokeChild.style.webkitTextFillColor = 'transparent';

                    thumbPicker.children[1].style.background = gradientString;
                }
                else {

                    let rgb = hex2RGBStringEncoding(txtOutlineColor.value);
                    let alpha = txtOutlineColor.dataset.alpha;

                    canvas.firstElementChild.style.webkitTextStroke = `${txtOutlineSize.value}px rgba(${rgb}, ${alpha})`
                    //THE COPY ONLY CARRIES THE STROKE, A FILLED COPY SHOWED THROUGH A 0% FILL
                    canvas.firstElementChild.style.color = 'transparent';

                    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
                }
            }
        }
    }
}

function adjustTextOutlineColor() {

    let panel = document.getElementById('pnlBoxText');
    let txtOutlineColor = panel.querySelector('.txtOutlineColor');
    let size = Number(panel.querySelector('.txtOutlineSize').value);

    let gradientString = txtOutlineColor.dataset.gradient;
    let thumbPicker = txtOutlineColor.nextElementSibling;
    
    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            let strokeChild = canvas.firstElementChild;

            if(type == "text") {

                if(testHexCode(txtOutlineColor) == "Linear" || testHexCode(txtOutlineColor) == "Radial") {

                    strokeChild.style.padding = `${size/2}px`;
                    strokeChild.style.margin = `-${size/2}px`;
                    strokeChild.style.background = gradientString;
                    strokeChild.style.webkitBackgroundClip = "text";
                    strokeChild.style.webkitTextStroke = `${size}px transparent`;
                    strokeChild.style.webkitTextFillColor = 'transparent';

                    //change thumbpick color
                    thumbPicker.children[1].style.background = this.dataset.gradient;
                }
                else {

                    let rgb = hex2RGBStringEncoding(txtOutlineColor.value);
                    let alpha = txtOutlineColor.dataset.alpha;

                    strokeChild.style.textShadow = "none";
                    strokeChild.style.color = 'transparent';
                    strokeChild.style.webkitTextStroke = `${size}px rgba(${rgb}, ${alpha})`;

                    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
                }

            }   
        }
    }

}
document.getElementById('pnlBoxText').querySelector('.txtOutlineColor').addEventListener('change', adjustTextOutlineColor);
document.getElementById('pnlBoxText').querySelector('.txtOutlineSize').addEventListener('change', adjustTextOutlineColor);
document.getElementById('pnlBoxText').querySelector('.txtOutlineSize').previousElementSibling.addEventListener('input', adjustTextOutlineColor);

function showTextGlow() {
    
    let panel = document.getElementById('pnlBoxText');
    let txtGlowColor = panel.querySelector('.txtGlowColor');
    let spread = panel.querySelector('.txtGlowSpread').value * 1;
    let thumbPicker = txtGlowColor.nextElementSibling;

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {

                if(canvas.children[1] != null) {
                    canvas.firstElementChild.remove();
                }

                //NO NEED FOR GRADIENT
                //GLOW ONLY SOLID COLOR
                let rgb = hex2RGBStringEncoding(txtGlowColor.value);
                let alpha = txtGlowColor.dataset.alpha;

                //expand as per glow spread
                canvas.firstElementChild.style.textShadow = `0px 0px ${spread}px rgba(${rgb}, ${alpha})`;

                thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
            }
        }
    }

    adjustBorder();
}

function adjustTextGlowColor() {

    let panel = document.getElementById('pnlBoxText');
    let txtGlowColor = panel.querySelector('.txtGlowColor');
    let spread = panel.querySelector('.txtGlowSpread').value * 1;
    let thumbPicker = txtGlowColor.nextElementSibling;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {

                //NO NEED FOR GRADIENT
                //GLOW ONLY SOLID COLOR
                //[!] IMPORTANT USE TESTHEXCODE
                //FOR SOME REASONS COLOR IS INNACCURATE WITHOUT USING TESTHEXCODE
                let rgb = hex2RGBStringEncoding(testHexCode(txtGlowColor));
                let alpha = txtGlowColor.dataset.alpha;

                canvas.firstElementChild.style.textShadow = `0px 0px ${spread}px rgba(${rgb}, ${alpha})`;

                thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
            }
        }
    }
                                            
}
document.getElementById('pnlBoxText').querySelector('.txtGlowColor').addEventListener('change', adjustTextGlowColor);
document.getElementById('pnlBoxText').querySelector('.txtGlowSpread').addEventListener('change', adjustTextGlowColor);
document.getElementById('pnlBoxText').querySelector('.txtGlowSpread').previousElementSibling.addEventListener('input', adjustTextGlowColor);

function showTextShadow() {

    let panel = document.getElementById('pnlBoxText');
    let txtShadowColor = panel.querySelector('.txtShadowColor')
    let txtShadowSize = panel.querySelector('.txtShadowSize').value/2;
    let txtShadowSpread = panel.querySelector('.txtShadowSpread').value / 5;
    let txtShadowRotation = Number(panel.querySelector('.txtShadowRotation').value) + 90;
    let thumbPicker = txtShadowColor.nextElementSibling;

    let coorX = txtShadowSize * Math.cos(txtShadowRotation * (Math.PI/ 180));
    let coorY = txtShadowSize * Math.sin(txtShadowRotation * (Math.PI / 180));

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {

                let rgb = hex2RGBStringEncoding(txtShadowColor.value);
                let alpha = txtShadowColor.dataset.alpha;

                if(canvas.children[1] != null) {
                    canvas.firstElementChild.remove();
                }

                //ONE SHADOW, THREE STACKED TURNED 50% ALPHA INTO 88%
                canvas.firstElementChild.style.textShadow = `${Math.round(coorX)}px ${Math.round(coorY)}px ${txtShadowSpread}px rgba(${rgb}, ${alpha})`;

                thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
            }
        }
    }
                                
}

function adjustTextShadowColor() {

    let panel = document.getElementById('pnlBoxText');
    let txtShadowColor = panel.querySelector('.txtShadowColor')
    let txtShadowSize = panel.querySelector('.txtShadowSize').value/2;
    let txtShadowSpread = panel.querySelector('.txtShadowSpread').value / 5;
    let txtShadowRotation = Number(panel.querySelector('.txtShadowRotation').value) + 90;
    let thumbPicker = txtShadowColor.nextElementSibling;
            
    let coorX = txtShadowSize * Math.cos(txtShadowRotation * (Math.PI/ 180));
    let coorY = txtShadowSize * Math.sin(txtShadowRotation * (Math.PI / 180));
        
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "text") {
                
                let rgb = hex2RGBStringEncoding(testHexCode(txtShadowColor));
                let alpha = txtShadowColor.dataset.alpha;

                canvas.firstElementChild.style.textShadow = `${Math.round(coorX)}px ${Math.round(coorY)}px ${txtShadowSpread}px rgba(${rgb}, ${alpha})`;
                
                thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`
            }
        }
    }
    
}
document.getElementById('pnlBoxText').querySelector('.txtShadowColor').addEventListener('change', adjustTextShadowColor);

document.getElementById('pnlBoxText').querySelector('.txtShadowSize').addEventListener('change', adjustTextShadowColor);
document.getElementById('pnlBoxText').querySelector('.txtShadowSize').previousElementSibling.addEventListener('input', adjustTextShadowColor);

document.getElementById('pnlBoxText').querySelector('.txtShadowSpread').addEventListener('change', adjustTextShadowColor);
document.getElementById('pnlBoxText').querySelector('.txtShadowSpread').previousElementSibling.addEventListener('input', adjustTextShadowColor);

document.getElementById('pnlBoxText').querySelector('.txtShadowRotation').addEventListener('change', adjustTextShadowColor);
document.getElementById('pnlBoxText').querySelector('.txtShadowRotation').previousElementSibling.addEventListener('input', adjustTextShadowColor);


function editCanvasTextLayer() {
    
    //let target;

    //E.TARGET IS FROM CTRL E OR IF THE USER USED RIGHT CLICK THEN TARGET LEADDRAG
    //e.target? target = e.target: target = leadDrag;
    let txtEditorBox = document.querySelector('.txtEditorBox');

    //if(target != cnvPin && target.className == "pinBody") {
        
        let f = Number(leadPanel.dataset.ref);
        let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
        let type = canvas.dataset.type;

        //check if cnvlayers is text
        if(type == "text") {

            isDragging = false;

            clearInterval(tmrDrag);
            tmrDrag = null;
            
            highlight = false;
            txtEditorBox.value = canvas.children[0].innerText;
            swapPanels('textEditor');
            txtEditorBox.click()
        }
    //}
    
}

//ONE OWNER FOR THE FixedSize DECISION. DRAGGING A HANDLE MEANS THE USER IS TAKING CONTROL OF
//THE BOX, SO THE MODE FOLLOWS - BUT ONCE, AT THE START OF THE GESTURE. IT USED TO SIT INSIDE
//adjustCanvas, WHICH IS A PER FRAME REDRAW HELPER THAT undoProperties ALSO CALLS
function setTextFixedSize(f) {

    let panel = document.getElementById('pnlBoxText');

    panel.querySelector('.btnFixedSize').children[0].style.filter = "saturate(0) brightness(2)";
    panel.querySelector('.btnAutoWidth').children[0].style.filter = "none";
    panel.querySelector('.btnAutoHeight').children[0].style.filter = "none";

    currResizeBox = "FixedSize";
    panel.querySelector('.selTextResize').dataset.value = currResizeBox;
}

function inputFormatResizeBox(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

    if(currResizeBox == "AutoWidth" || currResizeBox == null) {

        for(let a = 0; a < canvas.childElementCount; a++) {
            canvas.children[a].style.whiteSpace = "nowrap";
            canvas.children[a].style.wordBreak = "normal";

            canvas.children[a].style.width = 'auto';
            canvas.children[a].style.height = 'auto';
            canvas.children[a].style.display = "inline";
        }
        
        canvas.style.width = 'auto';
        canvas.style.height = 'auto';
    }
    else if(currResizeBox == "AutoHeight") {

        for(let a = 0; a < canvas.childElementCount; a++) {
            canvas.children[a].style.whiteSpace = "normal";
            canvas.children[a].style.wordBreak = "break-all";

            canvas.children[a].style.width = canvas.clientWidth + 'px';
            canvas.children[a].style.height = 'auto';
            canvas.children[a].style.display = "block";
        }

        canvas.style.height = 'auto';
        
    }
    else if(currResizeBox == "FixedSize") {
        
        for(let a = 0; a < canvas.childElementCount; a++) {
            canvas.children[a].style.whiteSpace = "normal";
            canvas.children[a].style.wordBreak = "break-all";
    
            canvas.children[a].style.width = canvas.clientWidth + 'px';
            canvas.children[a].style.height = 'auto';
            canvas.children[a].style.display = "block";
        }
    }

    adjustBorder()
}

/////////////////////////////////////TEXT EDITOR/////////////////////////

function saveTextEditor() {

    saveInnerTextData();
    document.querySelector('.txtEditorBox').blur();
    swapPanels('text');

}
document.getElementById('btnSaveEdit').addEventListener('click', saveTextEditor);

//[!] BLUR NOW COMMITS THE TEXT - BEFORE THIS, CLICKING AWAY DISCARDED THE EDIT.
//[!] saveInnerTextData NOT saveTextEditor: saveTextEditor CALLS blur() ITSELF AND WOULD
//[!] RE-ENTER HERE. THE PANEL SWAP STAYS ON THE EXPLICIT SAVE ONLY. THE RE-ENTRY IS A
//[!] NO-OP BECAUSE saveInnerTextData GUARDS ON oldText != newText
document.querySelector('.txtEditorBox').addEventListener('blur', saveInnerTextData);

//KEEP THE CARET IN .txtEditorBox WHEN PICKING AN EMOJI OR SYMBOL
document.getElementById('pnlBoxEmojiSymbol').addEventListener('mousedown', function(e) {
    if(e.target.closest('input, textarea') == null) e.preventDefault();
});


function saveInnerTextData() {

    let tempHistory = "";
    tempHistory = `Edited*`;

    let txtEditorBox = document.getElementsByClassName('txtEditorBox')[0];

    for(let a = 0; a < focusObj.length; a ++) {

        if(focusObj[a] != null) {

            let f = focusObj[a].dataset.ref;

            let oldText = decodeText(valueFinder(dataLayer[f], 'innerText'));
            let newText = txtEditorBox.value;

            for(let b = 0; b < focusObj[a].childElementCount; b++) {
                focusObj[a].children[b].innerText = txtEditorBox.value;
            }
            

            if(oldText != newText) {

                let name = focusPanel[f].querySelector('.txtHeader').value;
                
                layerSequence = `\ntxtWidthLayer: ${valueFinder(dataLayer[f], 'txtWidthLayer')}`;
                layerSequence += `\ntxtHeightLayer: ${valueFinder(dataLayer[f], 'txtHeightLayer')}`;
                layerSequence += `\ntxtXLayer: ${valueFinder(dataLayer[f], 'txtXLayer')}`;
                layerSequence += `\ntxtYLayer: ${valueFinder(dataLayer[f], 'txtYLayer')}`;
                layerSequence += `\ninnerText: ${valueFinder(dataLayer[f], 'innerText')}`;

                tempHistory += `\npnlBoxText: ${name}`;
                tempHistory += `\nref: ${f}`;
                tempHistory += `\ntxtWidthLayer: ${focusObj[f].clientWidth}`;
                tempHistory += `\ntxtHeightLayer: ${focusObj[f].clientHeight}`;
                tempHistory += `\ntxtXLayer: ${focusObj[f].offsetLeft}`;
                tempHistory += `\ntxtYLayer: ${focusObj[f].offsetTop}`;
                tempHistory += `\ninnerText: ${encodeURIComponent(newText)}`;
                tempHistory += `\n_`;
                tempHistory += layerSequence;
                tempHistory += `\n*`;
        
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtWidthLayer', `${focusObj[f].clientWidth}`);
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtHeightLayer', `${focusObj[f].clientHeight}`);
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', `${focusObj[f].offsetLeft}`);
                dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', `${focusObj[f].offsetTop}`);
                dataLayer[f] = valueSwitcher(dataLayer[f], 'innerText', encodeURIComponent(newText));
                
                
                inputFormatResizeBox(f);
            }

            adjustTextArea(f);
        }
    }

    //ONE ENTRY PER CHANGE, NOT ONE PER LAYER
    if(tempHistory != 'Edited*') makeNewHistory(tempHistory);

    adjustBorder();

    /*
    console.clear();
    for(let a = 0; a < h; a++) {
        console.log(history[a])
    }
    console.log("--------REDO---------")
    for(let a = 0; a < rh; a++) {
        console.log(redoHistory[a])
    }
    */
}

/////////////////////////////////////LOAD ALL EMOJIS////////////////////

function resetAllEmojis() {

    let contEmoji = document.getElementById('contEmoji');
    let clickEmoji = document.getElementsByClassName('clickEmoji');

    let append0 = "";
    let append = "";

    for(let a = 0; a < emojiCategory.length; a++) {
        append0 += 
        `<div class="emojiTitle"><h2>${emojiCategory[a]}</h2></div>`;
        
        for(let b = 0; b < emojis.length; b++) {

            if(emojis[b] != null) {
    
                if(emojis[b].tags.includes(emojiCategory[a].toLowerCase())) {
    
                    append += `<div class="clickEmoji" id="${emojis[b].id}"><h2>${emojis[b].id};</h2></div>`;
                }
            }
        }

        append0 += `\n<div class="wrapEmoji">${append}</div>\n\n`;
        append = "";
    }

    contEmoji.style.display = "block";
    contEmoji.innerHTML = append0;
    append0 = "";
    
    for(let b = 0; b < clickEmoji.length; b++) {
       
        clickEmoji[b].addEventListener('click', function() {
            let txtEditorBox = document.getElementsByClassName('txtEditorBox')[0];

            let start = txtEditorBox.selectionStart;
            let end = txtEditorBox.selectionEnd;

            txtEditorBox.value = txtEditorBox.value.slice(0, start) + this.id + txtEditorBox.value.slice(end);
            txtEditorBox.setSelectionRange(start + this.id.length, start + this.id.length);

        });
    }
}
resetAllEmojis();

function searchAllEmojis() {

    let append = "";
    let contEmoji = document.getElementById('contEmoji');
    let pnlBoxEmojiSymbol = document.getElementById('pnlBoxEmojiSymbol');

    if(this.value.length >=3) {
        for(let a = 0; a < emojis.length; a++) {
            if(emojis[a] != null) {
                if(emojis[a].tags.includes(this.value)) {
                    append += 
                    `<div class="clickEmoji" id="${emojis[a].id}"><h2>${emojis[a].id};</h2></div>`;
                }
            }
        }

        if(append != "") {
            contEmoji.style.display = "block";
            contEmoji.innerHTML = `<div class="wrapEmoji">${append}</div>`;
        }
        else {
            contEmoji.style.display = "flex";
            contEmoji.innerHTML = `<div class="emojiTitle" style="margin: auto; width:auto;"><h2>No emojis found</h2></div>`
        }
    }
    else if(this.value.length > 0 && this.value.length < 3) {
        contEmoji.style.display = "block";
        contEmoji.innerHTML = "";
    }
    else {
        resetAllEmojis();
    }

    if(this.value.trim().length == 0) {
        pnlBoxEmojiSymbol.querySelector('.btnDelSearch').style.visibility = "hidden";
    }
    else {
        pnlBoxEmojiSymbol.querySelector('.btnDelSearch').style.visibility = "visible";
    }

}
document.querySelector('.txtSearchEmojiSymbol').addEventListener('keyup', searchAllEmojis);

function showEmojis() {
    let txtSearchEmojiSymbol = document.getElementsByClassName('txtSearchEmojiSymbol')[0];
    let pnlTopBoxThumb2 = document.getElementsByClassName('pnlTopBoxThumb2')[0];
    let tabSliderBoxText = document.getElementById('tabSliderBoxText');
    let btnSymbolsBox = document.getElementById('btnSymbolsBox');

    pnlTopBoxThumb2.style.translate = "0%";
    tabSliderBoxText.style.translate = "0%";

    txtSearchEmojiSymbol.placeholder = "Search emojis";

    this.children[0].style.color ="var(--sharp)";
    this.removeEventListener('pointerleave', leaveEmojis);

    btnSymbolsBox.children[0].style.color = "var(--muted-blue-text)";
    btnSymbolsBox.addEventListener('pointerover', hoverSymbols);
    btnSymbolsBox.addEventListener('pointerleave', leaveSymbols);
}
document.getElementById('btnEmojisBox').addEventListener('click', showEmojis);

function hoverEmojis() {
    this.children[0].style.color = "var(--sharp)";
}
document.getElementById('btnEmojisBox').addEventListener('pointerover', hoverEmojis);

function leaveEmojis() {
    this.children[0].style.color = "var(--muted-blue-text)";
}
document.getElementById('btnEmojisBox').addEventListener('pointerleave', leaveEmojis);

////////////////////////////////SYMBOL OPTIONS TOP////////////////////

async function resetAllSymbols() {

    let contSymbol = document.getElementById('contSymbol');
    let clickSymbol = document.getElementsByClassName('clickSymbol');

    let append0 = "";
    let append = "";

    for(let a = 0; a < symbolCategory.length; a++) {
        append0 += 
        `<div class="symbolTitle"><h2>${symbolCategory[a]}</h2></div>`;
        
        for(let b = 0; b < symbols.length; b++) {

            if(symbols[b] != null) {
    
                if(symbols[b].tags.includes(symbolCategory[a].toLowerCase())) {
    
                    append += `<div class="clickSymbol" id="${symbols[b].id}"><h2>${symbols[b].id};</h2></div>`;
                }
            }
        }

        append0 += `\n<div class="wrapSymbol">${append}</div>\n\n`;
        append = "";
    }

    contSymbol.style.display = "block";
    contSymbol.innerHTML = append0;
    append0 = "";

    for(let b = 0; b < clickSymbol.length; b++) {
       
        clickSymbol[b].addEventListener('click', function() {
            let txtEditorBox = document.getElementsByClassName('txtEditorBox')[0];

            let start = txtEditorBox.selectionStart;
            let end = txtEditorBox.selectionEnd;

            txtEditorBox.value = txtEditorBox.value.slice(0, start) + this.id + txtEditorBox.value.slice(end);
            txtEditorBox.setSelectionRange(start + this.id.length, start + this.id.length);
        
        });
    }
    
    
}
resetAllSymbols();

function searchAllSymbols() {

    let append = "";
    let contSymbol = document.getElementById('contSymbol');
    let pnlBoxEmojiSymbol = document.getElementById('pnlBoxEmojiSymbol');

    if(this.value.length >=3) {
        for(let a = 0; a < symbols.length; a++) {
            if(symbols[a] != null) {
                if(symbols[a].tags.includes(this.value)) {
                    append += 
                    `<div class="clickSymbol" id="${symbols[a].id}"><h2>${symbols[a].id};</h2></div>`;
                }
            }
        }

        if(append != "") {
            contSymbol.style.display = "block";
            contSymbol.innerHTML = `<div class="wrapSymbol">${append}</div>`;
        }
        else {
            contSymbol.style.display = "flex";
            contSymbol.innerHTML = `<div class="symbolTitle" style="margin: auto; width:auto;"><h2>No symbols found</h2></div>`
        }
    }
    else if(this.value.length > 0 && this.value.length < 3) {
        contSymbol.style.display = "block";
        contSymbol.innerHTML = "";
    }
    else {
        resetAllSymbols();
    }

    if(this.value.trim().length == 0) {
        pnlBoxEmojiSymbol.querySelector('.btnDelSearch').style.visibility = "hidden";
    }
    else {
        pnlBoxEmojiSymbol.querySelector('.btnDelSearch').style.visibility = "visible";
    }

}
document.querySelector('.txtSearchEmojiSymbol').addEventListener('keyup', searchAllSymbols);

function showSymbols() {
    let txtSearchEmojiSymbol = document.getElementsByClassName('txtSearchEmojiSymbol')[0];
    let pnlTopBoxThumb2 = document.getElementsByClassName('pnlTopBoxThumb2')[0];
    let tabSliderBoxText = document.getElementById('tabSliderBoxText');
    let btnEmojisBox = document.getElementById('btnEmojisBox');

    pnlTopBoxThumb2.style.translate = "100%";
    tabSliderBoxText.style.translate = "-100%";

    txtSearchEmojiSymbol.placeholder = "Search symbols";
    
    this.children[0].style.color ="var(--sharp)";
    this.removeEventListener('pointerleave', leaveSymbols);

    btnEmojisBox.children[0].style.color = "var(--muted-blue-text)";
    btnEmojisBox.addEventListener('pointerover', hoverEmojis);
    btnEmojisBox.addEventListener('pointerleave', leaveEmojis);
}
document.getElementById('btnSymbolsBox').addEventListener('click', showSymbols);

function hoverSymbols() {
    this.children[0].style.color = "var(--sharp)";
}
document.getElementById('btnSymbolsBox').addEventListener('pointerover', hoverSymbols);

function leaveSymbols() {
    this.children[0].style.color = "var(--muted-blue-text)";
}
document.getElementById('btnSymbolsBox').addEventListener('pointerleave', leaveSymbols);














//////////////////////////////////////BOTTOM TAB///////////////////////////
function showBasicBoxText(){
    this.closest('#pnlBoxText').children[0].children[0].innerText = "Basic Properties";
    this.closest('#pnlBoxText').querySelector('.tabSliderBox3').style.translate = "0%"; //slide tab
    this.closest('#pnlBoxText').querySelector('.pnlBottomBoxThumb3').style.translate = "0%"; //slide scroll thumb
}
document.querySelector('#pnlBoxText').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.querySelector('#pnlBoxText').querySelector('.btnBasicBox').addEventListener('mouseover', btnBottomHover);

function showFormatBoxText() {
    this.closest('#pnlBoxText').children[0].children[0].innerText = "Text Format";
    this.closest('#pnlBoxText').querySelector('.tabSliderBox3').style.translate = "-100%"; //slide tab to left
    this.closest('#pnlBoxText').querySelector('.pnlBottomBoxThumb3').style.translate = "100%"; //slide thumb to right
}
document.querySelector('#pnlBoxText').querySelector('.btnTextBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxText').querySelector('.btnTextBox').addEventListener('mouseover', btnBottomHover);

function showStyleBoxText() {
    this.closest('#pnlBoxText').children[0].children[0].innerText = "Text Style";
    this.closest('#pnlBoxText').querySelector('.tabSliderBox3').style.translate = "-200%"; //slide tab to left
    this.closest('#pnlBoxText').querySelector('.pnlBottomBoxThumb3').style.translate = "202%"; //slide thumb to right
}
document.querySelector('#pnlBoxText').querySelector('.btnStyleBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxText').querySelector('.btnStyleBox').addEventListener('mouseover', btnBottomHover);


//////////////////////////////////////BOTTOM TAB///////////////////////////
function showBasicBoxText(){
    this.closest('#pnlBoxText').children[0].children[0].innerText = "Basic Properties";
    this.closest('#pnlBoxText').querySelector('.tabSliderBox3').style.translate = "0%"; //slide tab
    this.closest('#pnlBoxText').querySelector('.pnlBottomBoxThumb3').style.translate = "0%"; //slide scroll thumb
}
document.querySelector('#pnlBoxText').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.querySelector('#pnlBoxText').querySelector('.btnBasicBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxText').querySelector('.btnBasicBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxText').querySelector('.btnBasicBox').addEventListener('click', showBasicBoxText);
document.querySelector('#pnlBoxText').querySelector('.btnBasicBox').children[0].style.filter = "saturate(0) brightness(2)";
document.querySelector('#pnlBoxText').querySelector('.btnBasicBox').children[0].style.transition = ".2s";

function showFormatBoxText() {
    this.closest('#pnlBoxText').children[0].children[0].innerText = "Text Format";
    this.closest('#pnlBoxText').querySelector('.tabSliderBox3').style.translate = "-100%"; //slide tab to left
    this.closest('#pnlBoxText').querySelector('.pnlBottomBoxThumb3').style.translate = "100%"; //slide thumb to right
}
document.querySelector('#pnlBoxText').querySelector('.btnTextBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxText').querySelector('.btnTextBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxText').querySelector('.btnTextBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxText').querySelector('.btnTextBox').addEventListener('click', showFormatBoxText);
document.querySelector('#pnlBoxText').querySelector('.btnTextBox').children[0].style.transition = ".2s";

function showStyleBoxText() {
    this.closest('#pnlBoxText').children[0].children[0].innerText = "Text Style";
    this.closest('#pnlBoxText').querySelector('.tabSliderBox3').style.translate = "-200%"; //slide tab to left
    this.closest('#pnlBoxText').querySelector('.pnlBottomBoxThumb3').style.translate = "200%"; //slide thumb to right
}
document.querySelector('#pnlBoxText').querySelector('.btnStyleBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxText').querySelector('.btnStyleBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxText').querySelector('.btnStyleBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxText').querySelector('.btnStyleBox').addEventListener('click', showStyleBoxText);
document.querySelector('#pnlBoxText').querySelector('.btnStyleBox').children[0].style.transition = ".2s";

