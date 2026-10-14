let dataPattern = [];
let cnvPatterns = []

///////////////////////////////////////////////////////////////////////////////////
function createPnlBoxPattern(id , src) {

    //reset txtSearch value
    menuPatterns.querySelector('.txtSearch').value = "";
    menuPatterns.querySelector('.btnDelSearch').style.visibility = "hidden";

    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;
    let name = autoIncrementHeader(id);
    let configScroll = document.getElementsByClassName('configScroll');

    let newPattern = 
    `<div class="pnlBoxLayer" data-type="pattern" data-pattern=${id} data-ref=${f}>
        <div class="pnlTitleLayer" style="height: 40px;">
            <div class="iconLayer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2187 5.77415C10.6263 5.34812 11.2868 5.34812 11.6943 5.77415C12.1018 6.20017 12.1018 6.89074 11.6943 7.31676L7.52038 11.6804C7.11288 12.1064 6.45234 12.1064 6.04484 11.6804C5.63733 11.2544 5.63733 10.5638 6.04484 10.1378L10.2187 5.77415Z" fill="white"/>
                    <path d="M10.9565 9.81818C11.5328 9.81818 12 10.3066 12 10.9091C12 11.5116 11.5328 12 10.9565 12C10.3802 12 9.91304 11.5116 9.91304 10.9091C9.91304 10.3066 10.3802 9.81818 10.9565 9.81818Z" fill="white"/>
                    <path d="M3.95788 6.86506C4.36538 6.43903 5.02592 6.43903 5.43342 6.86506C5.84093 7.29108 5.84093 7.98164 5.43342 8.40767L2.82473 11.1349C2.41722 11.561 1.75669 11.561 1.34918 11.1349C0.941681 10.7089 0.941681 10.0184 1.34918 9.59233L3.95788 6.86506Z" fill="white"/>
                    <path d="M1.04348 5.45455C1.61978 5.45455 2.08696 5.94296 2.08696 6.54545C2.08696 7.14795 1.61978 7.63636 1.04348 7.63636C0.467181 7.63636 0 7.14795 0 6.54545C0 5.94296 0.467181 5.45455 1.04348 5.45455Z" fill="white"/>
                    <path d="M7.30435 3.81818C7.88064 3.81818 8.34783 4.3066 8.34783 4.90909C8.34783 5.51158 7.88064 6 7.30435 6C6.72805 6 6.26087 5.51158 6.26087 4.90909C6.26087 4.3066 6.72805 3.81818 7.30435 3.81818Z" fill="white"/>
                    <path d="M5.5231 0.319602C5.9306 -0.106424 6.59114 -0.106424 6.99864 0.319602C7.40614 0.745629 7.40614 1.43619 6.99864 1.86222L3.86821 5.13494C3.4607 5.56097 2.80017 5.56097 2.39266 5.13494C1.98516 4.70892 1.98516 4.01836 2.39266 3.59233L5.5231 0.319602Z" fill="white"/>
                    <path d="M10.2187 0.319602C10.6263 -0.106424 11.2868 -0.106424 11.6943 0.319602C12.1018 0.745629 12.1018 1.43619 11.6943 1.86222L10.6508 2.95313C10.2433 3.37915 9.58278 3.37915 9.17527 2.95313C8.76777 2.5271 8.76777 1.83654 9.17527 1.41051L10.2187 0.319602Z" fill="white"/>
                    <path d="M1.56522 0C2.14151 0 2.6087 0.488417 2.6087 1.09091C2.6087 1.6934 2.14151 2.18182 1.56522 2.18182C0.98892 2.18182 0.521739 1.6934 0.521739 1.09091C0.521739 0.488417 0.98892 0 1.56522 0Z" fill="white"/>
                </svg>
            </div>
            <input type="text" class="txtHeader" value="${autoIncrementHeader("Pattern")}" data-readonly="true">
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

    configScroll[5].insertAdjacentHTML('afterbegin', newPattern);

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);

    addPnlBoxPattern(f, name, id, src);
}

function addPnlBoxPattern(f, name, id) { 

    dataPattern[f] = '\n*';
    dataPattern[f] += `\nref: ${f}`;
    dataPattern[f] += `\npnlBoxPattern: ${name}`;
    dataPattern[f] += `\nid: ${id}`;
    dataPattern[f] += `\nshow: visible`;
    dataPattern[f] += `\nlock: unlock`;
    dataPattern[f] += `\nmask: unmask`;
    dataPattern[f] += `\ndropdown 0: Normal`;
    dataPattern[f] += `\ntxtXPattern: 0`;
    dataPattern[f] += `\ntxtYPattern: 0`;
    dataPattern[f] += `\ntxtSizePattern: 60`;
    dataPattern[f] += `\ntxtOpacityPattern: 100`;
    dataPattern[f] += `\ntxtRotationPattern: 0`;
    dataPattern[f] += `\ntxtRandomSpinPattern: 0`;

    dataPattern[f] += `\ndropdown 1: Stroke`;
    dataPattern[f] += `\ntxtStrokeWidthPattern: 1`;
    dataPattern[f] += `\ntxtColorPattern: rgba(148, 158, 255, 1)`;
    dataPattern[f] += `\ntxtScalingPattern: 6`;
    dataPattern[f] += `\ntxtSpacingPattern: 0`;
    dataPattern[f] += `\nchkRandomSeed: false`;

    dataPattern[f] += `\ndropdown 2: Default`;

    createCanvasPattern(f, id);
    createHistory(f, name, 'pattern', id);
}

//create pattern layer
function createCanvasPattern(f, id) {

    //[!] THE LAYER IS ONE SVG NOW. GEOMETRY LIVES ONCE IN A SYMBOL AND EVERY CELL
    //IS A SINGLE USE POINTING AT IT
    cnvPatterns[f] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cnvPatterns[f].classList.add('cnvPatterns');
    cnvPatterns[f].dataset.ref = f;
    cnvPatterns[f].dataset.id = id;
    cnvPatterns[f].dataset.type = "pattern";
    cnvPatterns[f].dataset.lock = "unlock";
    cnvPatterns[f].setAttribute('width', '100%');
    cnvPatterns[f].setAttribute('height', '100%');
    cnvPatterns[f].style.position = "absolute";
    cnvPatterns[f].style.visibility = "visible";

    cnvGrpLayers.appendChild(cnvPatterns[f]);

    //THE COVER FROM THE CLICK (delegation.js dblclick, menuPatterns) LIFTS WHEN THE PATTERN IS ON THE CANVAS. A hideLoading
    //AT THE END OF THIS FUNCTION RAN IN THE SAME TICK AS THE CLICK, BEFORE THE 200ms LOADING_DELAY (2026-09-24) COULD PAINT,
    //SO THE COVER NEVER SHOWED AND A SLOW fetchRowById LEFT A BLANK CANVAS. finally, SO A FAILED FETCH STILL HANDS THE
    //KEYBOARD BACK
    renderPattern(f)
    .then(() => {
        return updatePatternColor(f, '#A9AEFF');
    })
    .finally(() => {
        hideLoading();
    })

    panel2Focus(f2Panel(f))
}

async function renderPattern(f, boxSize, spacing, part, scaling, spin, seed, preset) {

    let canvas = cnvGrpLayers.querySelector(`.cnvPatterns[data-ref="${f}"]`);
    let id = canvas.dataset.id;

    if(boxSize == null) boxSize = Number(valueFinder(dataPattern[f], 'txtSizePattern'));
    if(spacing == null) spacing = Number(valueFinder(dataPattern[f], "txtSpacingPattern"));
    if(part == null) part = valueFinder(dataPattern[f], "dropdown 1");
    if(scaling == null) scaling = Number(valueFinder(dataPattern[f], "txtScalingPattern"));
    if(spin == null) spin = Number(valueFinder(dataPattern[f], "txtRandomSpinPattern"));
    if(seed == null) seed = valueFinder(dataPattern[f], "chkRandomSeed");
    if(preset == null) preset = valueFinder(dataPattern[f], "dropdown 2");

    //[!] THE GEOMETRY ONLY HAS TO BE FETCHED AND BUILT ONCE. EVERY LATER CHANGE OF
    //BOX SIZE OR SPACING REUSES THE SYMBOL AND ONLY LAYS THE CELLS OUT AGAIN
    let defs = canvas.querySelector('defs');

    if(canvas.querySelector(`#patSymbol${f}`) == null) {

        let data = await fetchRowById('patterns', id);

        //[!] THE SOURCE ROOT BECOMES THE SYMBOL. MEET FITS EVERY PATTERN INSIDE ITS CELL
        //ON THE SHORT SIDE AND KEEPS THE RATIO, WHICH COVERS ALL 25 VIEWBOXES
        let holder = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        holder.innerHTML = decodeURIComponent(data[0].source);
        let root = holder.firstElementChild;
        let viewBox = root.getAttribute('viewBox');

        canvas.innerHTML = "";

        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        let symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
        symbol.id = `patSymbol${f}`;
        symbol.setAttribute('viewBox', viewBox);
        symbol.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        symbol.dataset.viewBox = viewBox;

        while(root.firstElementChild) {
            let shape = root.firstElementChild;
            shape.removeAttribute('fill');
            shape.removeAttribute('id');
            symbol.appendChild(shape);
        }

        defs.appendChild(symbol);
        canvas.appendChild(defs);
    }
    else {
        canvas.querySelector('.gridPattern').remove();
    }

    let grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    grid.classList.add('gridPattern');
    grid.dataset.tx = 0;
    grid.dataset.ty = 0;
    canvas.appendChild(grid);

    let step = boxSize * (Number(spacing) + 1);
    let numBoxesX = Math.ceil(canvas.clientWidth / step);
    let numBoxesY = Math.ceil(canvas.clientHeight / step);

    grid.dataset.cols = numBoxesX;

    for(let b = 0; b < numBoxesX * numBoxesY; b++) {

        let use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', `#patSymbol${f}`);
        use.dataset.index = b;
        use.dataset.cell = boxSize;
        use.dataset.x = (b % numBoxesX) * step;
        use.dataset.y = Math.floor(b / numBoxesX) * step;

        sizePatternUse(use, scaling);
        grid.appendChild(use);
    }

    //[!] PASS THE RESOLVED VALUES DOWN. THESE THREE USED TO READ THE SHARED PANEL
    //[!] AND focusPanel, SO IMPORT, AUTOSAVE AND UNDO SILENTLY LOST SEED AND SPIN
    if(Number(spin) > 0) randomSpin(f, spin);
    applyPatternPreset(f, preset, scaling, seed);

    //[!] THE SHAPES GO IN WITHOUT A FILL, SO THE COLOUR HAS TO BE PUT BACK HERE.
    //A BARE SHAPE FALLS BACK TO THE SVG DEFAULT, WHICH IS BLACK
    await updatePatternColor(f);

    resetPatternMinMax(f);
}

//[!] ONE PLACE THAT TURNS A SCALE OF 1-10 INTO A CENTRED USE, SO EVERY CONTROL THAT
//RESIZES A CELL WRITES IT THE SAME WAY
function sizePatternUse(use, scaling) {

    let cell = Number(use.dataset.cell);
    let fit = cell * Number(scaling) / 10;

    use.setAttribute('width', fit);
    use.setAttribute('height', fit);
    use.setAttribute('x', Number(use.dataset.x) + (cell - fit) / 2);
    use.setAttribute('y', Number(use.dataset.y) + (cell - fit) / 2);
    use.dataset.scale = scaling;
}

function patternSeeder(f, maxSize) {

    let panel = document.getElementById('pnlBoxPattern');
    if(maxSize == null) maxSize = panel.querySelector('.txtScalingPattern').value;
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    let numBoxesX = Number(grid.dataset.cols);
    let mySize;

    for(let b = 0; b < grid.childElementCount; b++) {

        if(b == 0) {

            mySize = maxSize == 2 ? 2 : Math.floor(Math.random() * Number(maxSize)) + 1
        }

        else if(b > 0) {

            if(maxSize >= 3) {

                let sizeCheck = [];

                //check first if top box exist
                if(grid.children[b-numBoxesX] != null) {
                    sizeCheck[0] = Number(grid.children[b-numBoxesX].dataset.scale);
                }

                //check if right box exist
                if(grid.children[b-1] != null && b % numBoxesX != 0) {
                    sizeCheck[1] = Number(grid.children[b-1].dataset.scale);
                }

                while (mySize == sizeCheck[0] && sizeCheck[0] != null && mySize != (sizeCheck[0] - 3) && mySize != (sizeCheck[0] + 3) || mySize == sizeCheck[1] && sizeCheck[1] != null && mySize != (sizeCheck[1] - 3) && mySize != (sizeCheck[1] + 3)) {

                    mySize = Math.floor(Math.random() * Number(maxSize)) + 1

                    if(mySize > 5) {

                        let newMax = mySize;

                        mySize = Math.floor(Math.random() * Number(100)) + 1
                        if(mySize > 98) {
                            mySize = newMax;
                        }
                        else if(mySize > 95 && mySize <= 98) {
                            mySize = newMax - 1;
                        }
                        else if(mySize > 90 && mySize <= 95) {
                            mySize = newMax - 2;
                        }
                        else if(mySize > 80 && mySize <= 90) {
                            mySize = newMax - 3;
                        }
                        else if(mySize <= 80) {
                            mySize = newMax - 4;
                        }
                    }
                }
            }
            else if(maxSize == 2) {

                if(b % 2 == 0) {
                    mySize = 2;
                }
                else {
                    mySize = 1;
                }
            }

            else if(maxSize <= 1) {
                //IF THERE IS 1 VALUE FOR SCALE OR ZERO
                //DEFAULT THE MAXSIZE TO 1 AND NOT ZERO
                //IN ORDER FOR IT TO WORK
                maxSize = 1;
                mySize = maxSize;
            }
        }

        sizePatternUse(grid.children[b], mySize);
    }
}

//================================PRESETS==========================

//[!] EVERY PRESET IS THE SAME LOOP WITH A DIFFERENT RULE PER CELL, SO THEY ALL END
//AT SIZEPATTERNUSE. DEFAULT, FRAME AND MARGIN READ THE STYLING TAB. CASCADES,
//VIGNETTE AND BLOOM OWN THE SIZE THEMSELVES AND IGNORE IT, 10 BEING A FULL BOX
function applyPatternPreset(f, preset, scaling, seed) {

    if(preset == "Frame") patternFrame(f, scaling, seed);
    else if(preset == "Margin") patternMargin(f, scaling, seed);
    else if(preset == "Vignette") patternVignette(f);
    else if(preset == "Bloom") patternBloom(f);
    else if(preset == "Cascade Down") patternCascadeDown(f);
    else if(preset == "Cascade Up") patternCascadeUp(f);
    else if(preset == "Cascade Left") patternCascadeLeft(f);
    else if(preset == "Cascade Right") patternCascadeRight(f);
    else patternDefault(f, scaling, seed);
}

function patternDefault(f, scaling, seed) {

    let panel = document.getElementById('pnlBoxPattern');
    if(scaling == null) scaling = panel.querySelector('.txtScalingPattern').value;
    if(seed == null) seed = panel.querySelector('.chkRandomSeed').dataset.value;
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    if(seed == "true") {
        patternSeeder(f, scaling);
        return;
    }

    for(let b = 0; b < grid.childElementCount; b++) {
        sizePatternUse(grid.children[b], scaling);
    }
}

//[!] FRAME AND MARGIN ARE MASKS, NOT SIZES. THE NORMAL SIZING RUNS FIRST SO THE
//SURVIVING CELLS STILL FOLLOW SCALING AND RANDOM SEED, THEN THE REST GO TO ZERO
function patternFrame(f, scaling, seed) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    patternDefault(f, scaling, seed);

    let numBoxesX = Number(grid.dataset.cols);
    let numBoxesY = grid.childElementCount / numBoxesX;

    for(let b = 0; b < grid.childElementCount; b++) {

        let col = b % numBoxesX;
        let row = Math.floor(b / numBoxesX);
        let ring = Math.min(row, col, numBoxesY - 1 - row, numBoxesX - 1 - col);

        if(ring != 0) sizePatternUse(grid.children[b], 0);
    }
}

function patternMargin(f, scaling, seed) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    patternDefault(f, scaling, seed);

    let numBoxesX = Number(grid.dataset.cols);
    let numBoxesY = grid.childElementCount / numBoxesX;

    for(let b = 0; b < grid.childElementCount; b++) {

        let col = b % numBoxesX;
        let row = Math.floor(b / numBoxesX);
        let ring = Math.min(row, col, numBoxesY - 1 - row, numBoxesX - 1 - col);

        if(ring == 0) sizePatternUse(grid.children[b], 0);
    }
}

//[!] THE STEP IS ONE FULL BOX SPLIT BY THE ROW COUNT, SO 10 ROWS READ
//100% 90% 80% AND SO ON. THE RAMP LANDS ON ZERO ONE ROW PAST THE GRID
function patternCascadeDown(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    let numBoxesX = Number(grid.dataset.cols);
    let numBoxesY = grid.childElementCount / numBoxesX;

    for(let b = 0; b < grid.childElementCount; b++) {

        let row = Math.floor(b / numBoxesX);

        sizePatternUse(grid.children[b], 10 * (numBoxesY - row) / numBoxesY);
    }
}

function patternCascadeUp(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    let numBoxesX = Number(grid.dataset.cols);
    let numBoxesY = grid.childElementCount / numBoxesX;

    for(let b = 0; b < grid.childElementCount; b++) {

        let row = Math.floor(b / numBoxesX);

        sizePatternUse(grid.children[b], 10 * (row + 1) / numBoxesY);
    }
}

function patternCascadeLeft(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    let numBoxesX = Number(grid.dataset.cols);

    for(let b = 0; b < grid.childElementCount; b++) {

        let col = b % numBoxesX;

        sizePatternUse(grid.children[b], 10 * (col + 1) / numBoxesX);
    }
}

function patternCascadeRight(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    let numBoxesX = Number(grid.dataset.cols);

    for(let b = 0; b < grid.childElementCount; b++) {

        let col = b % numBoxesX;

        sizePatternUse(grid.children[b], 10 * (numBoxesX - col) / numBoxesX);
    }
}

//[!] RADIAL FALLOFF MEASURED IN CELLS FROM THE GRID CENTRE. THE CORNERS SIT AT
//THE FAR END OF THE RAMP, SO THEY ARE THE ONES THAT REACH A FULL BOX
function patternVignette(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    let numBoxesX = Number(grid.dataset.cols);
    let numBoxesY = grid.childElementCount / numBoxesX;
    let maxDist = Math.hypot((numBoxesX - 1) / 2, (numBoxesY - 1) / 2) || 1;

    for(let b = 0; b < grid.childElementCount; b++) {

        let col = b % numBoxesX;
        let row = Math.floor(b / numBoxesX);
        let dist = Math.hypot(col - (numBoxesX - 1) / 2, row - (numBoxesY - 1) / 2);

        sizePatternUse(grid.children[b], 10 * dist / maxDist);
    }
}

function patternBloom(f) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    let numBoxesX = Number(grid.dataset.cols);
    let numBoxesY = grid.childElementCount / numBoxesX;
    let maxDist = Math.hypot((numBoxesX - 1) / 2, (numBoxesY - 1) / 2) || 1;

    for(let b = 0; b < grid.childElementCount; b++) {

        let col = b % numBoxesX;
        let row = Math.floor(b / numBoxesX);
        let dist = Math.hypot(col - (numBoxesX - 1) / 2, row - (numBoxesY - 1) / 2);

        sizePatternUse(grid.children[b], 10 * (1 - dist / maxDist));
    }
}

// SCALING AND RANDOM SEED ONLY REACH THE CELLS ON DEFAULT, FRAME AND MARGIN.
//applyPatternPreset HANDS THE OTHER SIX PRESETS ONLY f, SO THE TOGGLE IS DEAD THERE
//AND HAS TO LOOK IT. APPEARANCE ONLY - chkRandomSeed KEEPS ITS VALUE AND ITS HANDLER,
//SO UNDO AND REDO STILL RESTORE THROUGH IT WHILE IT IS COVERED
function coverPatternPreset(preset) {

    let entry = document.getElementById('pnlBoxPattern').querySelector('.chkRandomSeed').closest('.pnlEntry');

    if(preset == "Default" || preset == "Frame" || preset == "Margin") enableContainer(entry);
    else disableContainer(entry);
}

function choosePatternPreset() {

    let opt = this.innerText;

    coverPatternPreset(opt);

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let type = focusPanel[a].dataset.type;
            let f = Number(focusPanel[a].dataset.ref);

            if(type == "pattern") {

                applyPatternPreset(f, opt);
            }
        }
    }
}
document.querySelectorAll('.optPatternPreset')
.forEach((opt) => {
    opt.addEventListener('pointerdown', choosePatternPreset);
})

//================================PANEL CONTROLS==========================

async function updatePatternColor(f, color, strokeOrFill) {

    let defs = null;
    let strokeWidth = valueFinder(dataPattern[f], "txtStrokeWidthPattern");
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let symbol = canvas.querySelector(`#patSymbol${f}`);

    if(symbol == null) return;

    //IF THERE'S NO COLOR PARAMETER
    //FUNCTION CALL NOT FROM TXTCOLORPATTERN
    if(strokeOrFill == null) {
        strokeOrFill = valueFinder(dataPattern[f], 'dropdown 1');
    }

    if(color == null || color == undefined) {
        color = valueFinder(dataPattern[f], 'txtColorPattern');
    }

    if(color.includes('linear')) {
        defs = gradientString2Defs(f, 'pattern', "Linear", strokeOrFill, color);
        //UPDATE COLOR VALUE AS URL REFERENCE TO THE DEFS GRADIENT
        color = `url(#pattern_linear_${strokeOrFill.toLowerCase()}_${f})`;
    }
    else if(color.includes('radial')) {
        defs = gradientString2Defs(f, 'pattern', "Radial", strokeOrFill, color);
        //UPDATE COLOR VALUE AS URL REFERENCE TO THE DEFS GRADIENT
        color = `url(#pattern_radial_${strokeOrFill.toLowerCase()}_${f})`;
    }

    let holder = canvas.querySelector('.defsPattern');

    if(holder == null) {
        holder = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        holder.classList.add('defsPattern');
        canvas.querySelector('defs').appendChild(holder);
    }

    holder.innerHTML = defs == null ? "" : defs;

    //[!] GEOMETRY EXISTS ONCE SO THE WHOLE LAYER RECOLOURS IN A HANDFUL OF WRITES
    //INSTEAD OF ONE SWEEP PER TILE
    let box = symbol.dataset.viewBox.split(' ');

    symbol.querySelectorAll('path, ellipse, rect, circle').forEach((part)=> {

        if(strokeOrFill == "Stroke") {

            part.setAttribute('fill', 'transparent');
            part.setAttribute('stroke', `${color}`);
            part.setAttribute('stroke-width', `${strokeWidth}px`);
            part.setAttribute('stroke-opacity', '1');
            part.setAttribute('transform', `translate(${strokeWidth/2}, ${strokeWidth/2})`);
        }
        else if(strokeOrFill == "Fill") {

            part.setAttribute('fill', `${color}`);
            part.setAttribute('stroke', 'transparent');
            part.setAttribute('stroke-width', `0px`);
            part.setAttribute('stroke-opacity', '1');
            part.removeAttribute('transform');
        }
    })

    //[!] ALWAYS OFF THE STORED VIEWBOX SO REPEATED CALLS CANNOT COMPOUND THE STROKE ROOM
    if(strokeOrFill == "Stroke") {
        symbol.setAttribute('viewBox', `${box[0]} ${box[1]} ${Number(box[2]) + Number(strokeWidth)} ${Number(box[3]) + Number(strokeWidth)}`);
    }
    else {
        symbol.setAttribute('viewBox', symbol.dataset.viewBox);
    }
}

function choosePatternColor() {

    let alpha, rgb, color;
    let thumbPicker = this.nextElementSibling;

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "pattern") {

                if(testHexCode(this) == "Linear" || testHexCode(this) == "Radial") {
                    //change thumbpick color
                    color = this.dataset.gradient;

                    updatePatternColor(f, color);
                }

                else {
                    
                    this.dataset.gradient = "";
                    
                    if(this.dataset.alpha == null || this.dataset.alpha == undefined || this.dataset.alpha == "") {
                        alpha = "1"
                    }
                    else {
                        alpha = this.dataset.alpha;
                    }

                    rgb = hex2RGBStringEncoding(testHexCode(this));
                    color = `rgba(${rgb}, ${alpha})`;

                    updatePatternColor(f, color);

                }
            }
        }
    }
    
    thumbPicker.children[1].style.background = color;

}
document.querySelector('#pnlBoxPattern').querySelector('.txtColorPattern').addEventListener('change', choosePatternColor);

function adjustOpacity() {

    let o = Number(this.value)/100;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "pattern") {
                
                canvas.style.opacity = o;
            }
        }
    }
}
document.querySelector('#pnlBoxPattern').querySelector('.txtOpacityPattern').addEventListener('change', adjustOpacity);
document.querySelector('#pnlBoxPattern').querySelector('.txtOpacityPattern').previousElementSibling.addEventListener('input', adjustOpacity);

//THE WHOLE PATTERN LAYER TURNS, SAME AS chooseLayerRotation DOES FOR EVERY OTHER TYPE.
//THIS IS NOT randomSpin, WHICH JITTERS EACH USE INSIDE THE SVG
function adjustPatternRotation() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "pattern") {

                canvas.style.transform = `rotate(${this.value}deg)`;
                canvas.dataset.rotation = this.value;
            }
        }
    }
}
document.querySelector('#pnlBoxPattern').querySelector('.txtRotationPattern').addEventListener('change', adjustPatternRotation);
document.querySelector('#pnlBoxPattern').querySelector('.txtRotationPattern').previousElementSibling.addEventListener('input', adjustPatternRotation);

function adjustX() {

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let type = focusPanel[a].dataset.type;

            if(type == "pattern") {

                //[!] PANNING IS ONE TRANSFORM ON THE GRID NOW, NO REBUILD AND NO REFETCH
                let f = Number(focusPanel[a].dataset.ref);
                let boxSize = Number(valueFinder(dataPattern[f], 'txtSizePattern'));
                let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                let grid = canvas.querySelector('.gridPattern');

                if(grid == null) continue;

                grid.dataset.tx = boxSize * Number(this.value);
                grid.setAttribute('transform', `translate(${grid.dataset.tx}, ${grid.dataset.ty})`);
            }
        }
    }

}
document.querySelector('#pnlBoxPattern').querySelector('.txtXPattern').addEventListener('change', adjustX);
document.querySelector('#pnlBoxPattern').querySelector('.txtXPattern').previousElementSibling.addEventListener('input', adjustX);

function adjustY() {

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let type = focusPanel[a].dataset.type;

            if(type == "pattern") {

                let f = Number(focusPanel[a].dataset.ref);
                let boxSize = Number(valueFinder(dataPattern[f], 'txtSizePattern'));
                let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                let grid = canvas.querySelector('.gridPattern');

                if(grid == null) continue;

                grid.dataset.ty = boxSize * Number(this.value);
                grid.setAttribute('transform', `translate(${grid.dataset.tx}, ${grid.dataset.ty})`);
            }
        }
    }

}
document.querySelector('#pnlBoxPattern').querySelector('.txtYPattern').addEventListener('change', adjustY);
document.querySelector('#pnlBoxPattern').querySelector('.txtYPattern').previousElementSibling.addEventListener('input', adjustY);

function adjustPatternScale() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "pattern") {

                //[!] THE ACTIVE PRESET DECIDES WHETHER SCALING MEANS ANYTHING. CASCADES,
                //VIGNETTE AND BLOOM SIZE THEMSELVES AND COME OUT UNCHANGED
                applyPatternPreset(f, valueFinder(dataPattern[f], 'dropdown 2'));
            }
        }
    }

}
document.querySelector('#pnlBoxPattern').querySelector('.txtScalingPattern').addEventListener('change', adjustPatternScale);
document.querySelector('#pnlBoxPattern').querySelector('.txtScalingPattern').previousElementSibling.addEventListener('input', adjustPatternScale);

function adjustSpacing() {

    let part = document.getElementById('pnlBoxPattern').querySelectorAll('.dropdown')[1].firstElementChild.innerText;

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let type = focusPanel[a].dataset.type;
            let f = Number(focusPanel[a].dataset.ref);

            if(type == "pattern") {

                let boxSize = Number(valueFinder(dataPattern[f], 'txtSizePattern'));

                renderPattern(f, boxSize, Number(this.value), part)
                .then(() => {
                    updatePatternColor(f);
                })
            }
        }
    }

}
document.querySelector('#pnlBoxPattern').querySelector('.txtSpacingPattern').addEventListener('change', adjustSpacing);
document.querySelector('#pnlBoxPattern').querySelector('.txtSpacingPattern').previousElementSibling.addEventListener('input', adjustSpacing);

function randomSpin(f, spin) {

    let panel = document.getElementById('pnlBoxPattern');
    let getSpin = panel.querySelector('.txtRandomSpinPattern');

    if(spin == null) spin = getSpin.value;

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let grid = canvas.querySelector('.gridPattern');

    if(grid == null) return;

    for(let b = 0; b < grid.childElementCount; b++) {

        let use = grid.children[b];

        if(Number(spin) > 0) {

            function getRand(min, max) {
                return Math.floor(Math.random() * (max - min + 1) ) + min;
            }

            let min = Number(spin) * -1; //get negative value of
            let max = Number(spin);

            let rand = getRand(min, max);
            let cell = Number(use.dataset.cell);

            //[!] SPIN AROUND THE CELL CENTRE, NOT THE USE CENTRE, SO CHANGING
            //SCALE LATER CANNOT LEAVE THE PIVOT BEHIND
            let cx = Number(use.dataset.x) + cell / 2;
            let cy = Number(use.dataset.y) + cell / 2;

            use.setAttribute('transform', `rotate(${rand} ${cx} ${cy})`);
        }
        else {
            use.removeAttribute('transform');
        }
    }

}

//[!] PANEL HANDLER, SAME SHAPE AS adjustPatternScale - NO ARGUMENTS, WALKS focusPanel,
//[!] AND LETS randomSpin READ THE INPUT ITSELF THROUGH ITS spin == null FALLBACK.
//[!] randomSpin ALWAYS GETS AN EXPLICIT f NOW, WHICH IS WHY IT NO LONGER CARRIES A
//[!] refs ARRAY - THE RENDER PATH AT applyPatternPreset PASSES ITS OWN f AND spin
//[!] BECAUSE THERE IS NO FOCUS DURING IMPORT, UNDO OR AUTOSAVE RESTORE.
function adjustRandomSpin() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "pattern") randomSpin(f);
        }
    }
}
document.querySelector('#pnlBoxPattern').querySelector('.txtRandomSpinPattern').addEventListener('change', adjustRandomSpin);
document.querySelector('#pnlBoxPattern').querySelector('.txtRandomSpinPattern').previousElementSibling.addEventListener('input', adjustRandomSpin);

function randomSeed() {

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;

            if(type == "pattern") {

                //[!] THE SEED ONLY REACHES THE CELLS ON DEFAULT, FRAME AND MARGIN.
                //THE OTHER PRESETS REBUILD THE SAME SIZES AND IGNORE IT
                applyPatternPreset(f, valueFinder(dataPattern[f], 'dropdown 2'));

                if(this.dataset.value == "false") {
                    this.removeEventListener('mouseover', chkBoxHover);
                }
            }
        }
    }
}
document.querySelector('#pnlBoxPattern').querySelector('.chkRandomSeed').addEventListener('click', randomSeed);

function adjustBoxSize() {

    let part = document.getElementById('pnlBoxPattern').querySelectorAll('.dropdown')[1].firstElementChild.innerText;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {

            let type = focusPanel[a].dataset.type;

            if(type == "pattern") {

                let f = Number(focusPanel[a].dataset.ref);
                let spacing = Number(valueFinder(dataPattern[f], 'txtSpacingPattern'));

                renderPattern(f, Number(this.value), spacing, part)
                .then(() => {
                    updatePatternColor(f);
                })
            }
        }
    }

}
document.querySelector('#pnlBoxPattern').querySelector('.txtSizePattern').addEventListener('change', adjustBoxSize);
document.querySelector('#pnlBoxPattern').querySelector('.txtSizePattern').previousElementSibling.addEventListener('input', adjustBoxSize);

function choosePatternPart() {

    let opt = this.innerText;
    let txtColorPattern = document.querySelector('.txtColorPattern');
    let pnlEntry = document.querySelector('.txtStrokeWidthPattern').closest('.pnlEntry');

    if(opt == 'Stroke') {
        pnlEntry.style.display = 'flex';
    }
    else if(opt == 'Fill') {
        pnlEntry.style.display = 'none';
    }

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {
            let type = focusPanel[a].dataset.type;
            let f = Number(focusPanel[a].dataset.ref);

            if(type == "pattern") {
                
                if(testHexCode(txtColorPattern) == "Linear" || testHexCode(txtColorPattern) == "Radial") {
                    //change thumbpick color
                    let color = txtColorPattern.dataset.gradient;
                    updatePatternColor(f, color, opt);
                }

                else {
                    
                    txtColorPattern.dataset.gradient = "";
                    
                    let alpha = txtColorPattern.dataset.alpha;

                    if(alpha == null || alpha == undefined || alpha == "") {
                        alpha = "1"
                    }
                    
                    let rgb = hex2RGBStringEncoding(testHexCode(txtColorPattern));
                    let color = `rgba(${rgb}, ${alpha})`;
                    
                    updatePatternColor(f, color, opt);
                }

            }
        }
    }
}
document.querySelectorAll('.optPatternPart')
.forEach((opt) => {
    opt.addEventListener('pointerdown', choosePatternPart);
})

function adjustPatternStrokeWidth() {

    let strokeWidth = Number(this.value);
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

     for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = focusPanel[a].dataset.ref;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            let symbol = canvas.querySelector(`#patSymbol${f}`);

            if(symbol == null) continue;

            let box = symbol.dataset.viewBox.split(' ');

            symbol.querySelectorAll('path, ellipse, rect, circle').forEach((part)=> {

                part.setAttribute('stroke-width', `${strokeWidth}px`);
                part.setAttribute('transform', `translate(${strokeWidth/2}, ${strokeWidth/2})`);
            })

            symbol.setAttribute('viewBox', `${box[0]} ${box[1]} ${Number(box[2]) + strokeWidth} ${Number(box[3]) + strokeWidth}`);
        }
     }
}
document.querySelector('#pnlBoxPattern').querySelector('.txtStrokeWidthPattern').addEventListener('keyup', adjustPatternStrokeWidth);
document.querySelector('#pnlBoxPattern').querySelector('.txtStrokeWidthPattern').previousElementSibling.addEventListener('input', adjustPatternStrokeWidth);

function resetPatternMinMax() {

    //let boxSize = valueFinder(dataPattern[f], 'txtSizePattern');
    //let spacing = valueFinder(dataPattern[f], 'txtSpacingPattern');
    let boxSize = Number(document.querySelector('.txtSizePattern').value);
    let spacing = Number(document.querySelector('.txtSpacingPattern').value);

    let txtSizeWidth = Number(valueFinder(dataCanvas, 'txtSizeWidth'));
    let txtSizeHeight = Number(valueFinder(dataCanvas, 'txtSizeHeight'));

    //adjust patterns depending on the size of the canvas
    let maxHori = Math.ceil(txtSizeWidth / (boxSize * Number(spacing + 1)));
    let maxVerti = Math.ceil(txtSizeHeight / (boxSize * Number(spacing + 1)));
    let pnlBoxPattern = document.getElementById('pnlBoxPattern');

    pnlBoxPattern.querySelector('.txtXPattern').max = maxHori;
    pnlBoxPattern.querySelector('.txtXPattern').min = maxHori * -1;
    pnlBoxPattern.querySelector('.txtXPattern').previousElementSibling.max = maxHori;
    pnlBoxPattern.querySelector('.txtXPattern').previousElementSibling.min = maxHori * -1;

    pnlBoxPattern.querySelector('.txtYPattern').max = maxVerti;
    pnlBoxPattern.querySelector('.txtYPattern').min = maxVerti * -1;
    pnlBoxPattern.querySelector('.txtYPattern').previousElementSibling.max = maxHori;
    pnlBoxPattern.querySelector('.txtYPattern').previousElementSibling.min = maxHori * -1;
}

































//==================================RECREATE FOR UNDO=================================

function recreatePnlBoxPattern(f, name, id) {
    //reset txtSearch value
    menuPatterns.querySelector('.txtSearch').value = "";

    let configScroll = document.getElementsByClassName('configScroll');

    let newPattern = 
    `<div class="pnlBoxLayer" data-type="pattern" data-pattern="${id}" data-ref="${f}">
        <div class="pnlTitleLayer" style="height: 40px;">
            <div class="iconLayer">
                <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2187 5.77415C10.6263 5.34812 11.2868 5.34812 11.6943 5.77415C12.1018 6.20017 12.1018 6.89074 11.6943 7.31676L7.52038 11.6804C7.11288 12.1064 6.45234 12.1064 6.04484 11.6804C5.63733 11.2544 5.63733 10.5638 6.04484 10.1378L10.2187 5.77415Z" fill="white"/>
                    <path d="M10.9565 9.81818C11.5328 9.81818 12 10.3066 12 10.9091C12 11.5116 11.5328 12 10.9565 12C10.3802 12 9.91304 11.5116 9.91304 10.9091C9.91304 10.3066 10.3802 9.81818 10.9565 9.81818Z" fill="white"/>
                    <path d="M3.95788 6.86506C4.36538 6.43903 5.02592 6.43903 5.43342 6.86506C5.84093 7.29108 5.84093 7.98164 5.43342 8.40767L2.82473 11.1349C2.41722 11.561 1.75669 11.561 1.34918 11.1349C0.941681 10.7089 0.941681 10.0184 1.34918 9.59233L3.95788 6.86506Z" fill="white"/>
                    <path d="M1.04348 5.45455C1.61978 5.45455 2.08696 5.94296 2.08696 6.54545C2.08696 7.14795 1.61978 7.63636 1.04348 7.63636C0.467181 7.63636 0 7.14795 0 6.54545C0 5.94296 0.467181 5.45455 1.04348 5.45455Z" fill="white"/>
                    <path d="M7.30435 3.81818C7.88064 3.81818 8.34783 4.3066 8.34783 4.90909C8.34783 5.51158 7.88064 6 7.30435 6C6.72805 6 6.26087 5.51158 6.26087 4.90909C6.26087 4.3066 6.72805 3.81818 7.30435 3.81818Z" fill="white"/>
                    <path d="M5.5231 0.319602C5.9306 -0.106424 6.59114 -0.106424 6.99864 0.319602C7.40614 0.745629 7.40614 1.43619 6.99864 1.86222L3.86821 5.13494C3.4607 5.56097 2.80017 5.56097 2.39266 5.13494C1.98516 4.70892 1.98516 4.01836 2.39266 3.59233L5.5231 0.319602Z" fill="white"/>
                    <path d="M10.2187 0.319602C10.6263 -0.106424 11.2868 -0.106424 11.6943 0.319602C12.1018 0.745629 12.1018 1.43619 11.6943 1.86222L10.6508 2.95313C10.2433 3.37915 9.58278 3.37915 9.17527 2.95313C8.76777 2.5271 8.76777 1.83654 9.17527 1.41051L10.2187 0.319602Z" fill="white"/>
                    <path d="M1.56522 0C2.14151 0 2.6087 0.488417 2.6087 1.09091C2.6087 1.6934 2.14151 2.18182 1.56522 2.18182C0.98892 2.18182 0.521739 1.6934 0.521739 1.09091C0.521739 0.488417 0.98892 0 1.56522 0Z" fill="white"/>
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

    configScroll[5].insertAdjacentHTML('afterbegin', newPattern);

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);
    
    panel2Focus(configScroll[5].querySelector(`[data-ref="${f}"]`))

    recreateCanvasPattern(f, id);
}

async function recreateCanvasPattern(f, id) {

    cnvPatterns[f] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cnvPatterns[f].classList.add('cnvPatterns');
    cnvPatterns[f].dataset.ref = f;
    cnvPatterns[f].dataset.id = id;
    cnvPatterns[f].dataset.type = "pattern";
    cnvPatterns[f].dataset.lock = "unlock";
    cnvPatterns[f].setAttribute('width', '100%');
    cnvPatterns[f].setAttribute('height', '100%');
    cnvPatterns[f].style.position = "absolute";
    cnvPatterns[f].style.visibility = "visible";

    //A FRESH ELEMENT CARRIES NO TRANSFORM, SO THE ROTATION IS READ BACK FROM HISTORY
    //THE SAME WAY rerenderPattern READS EVERY OTHER VALUE
    let rotation = valueFinder(history[h], 'txtRotationPattern');

    if(rotation != null) {
        cnvPatterns[f].style.transform = `rotate(${rotation}deg)`;
        cnvPatterns[f].dataset.rotation = rotation;
    }

    cnvGrpLayers.appendChild(cnvPatterns[f]);

    rerenderPattern(f, id)
    .then(() => {
        updatePatternColor(f);
    })
}

async function rerenderPattern(f, id) {

    //[!] UNDO AND FILE OPEN READ FROM HISTORY, EVERYTHING ELSE READS FROM DATAPATTERN.
    //ONLY THE SOURCE OF THE VALUES DIFFERS SO THE BUILD ITSELF IS SHARED
    await renderPattern(f,
        Number(valueFinder(history[h], 'txtSizePattern')),
        Number(valueFinder(history[h], 'txtSpacingPattern')),
        valueFinder(history[h], 'dropdown 1'),
        Number(valueFinder(history[h], 'txtScalingPattern')),
        Number(valueFinder(history[h], 'txtRandomSpinPattern')),
        valueFinder(history[h], 'chkRandomSeed'),
        valueFinder(history[h], 'dropdown 2'));
}


function showBasicBoxPattern(){
    this.closest('#pnlBoxPattern').children[0].children[0].innerText = "Pattern Properties";
    this.closest('#pnlBoxPattern').querySelector('.tabSliderBox3').style.translate = "0%"; //slide tab
    this.closest('#pnlBoxPattern').querySelector('.pnlBottomBoxThumb3').style.translate = "0%"; //slide scroll thumb
}
document.querySelector('#pnlBoxPattern').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.querySelector('#pnlBoxPattern').querySelector('.btnBasicBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxPattern').querySelector('.btnBasicBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxPattern').querySelector('.btnBasicBox').addEventListener('click', showBasicBoxPattern);
document.querySelector('#pnlBoxPattern').querySelector('.btnBasicBox').click();

function showStyleBoxPattern() {
    this.closest('#pnlBoxPattern').children[0].children[0].innerText = "Pattern Style";
    this.closest('#pnlBoxPattern').querySelector('.tabSliderBox3').style.translate = "-100%"; //slide tab to left
    this.closest('#pnlBoxPattern').querySelector('.pnlBottomBoxThumb3').style.translate = "100%"; //slide thumb to right
}
document.querySelector('#pnlBoxPattern').querySelector('.btnStyleBox').addEventListener('click', btnBottomClick);
document.querySelector('#pnlBoxPattern').querySelector('.btnStyleBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxPattern').querySelector('.btnStyleBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxPattern').querySelector('.btnStyleBox').addEventListener('click', showStyleBoxPattern);


function showPresetBoxPattern() {
    this.closest('#pnlBoxPattern').children[0].children[0].innerText = "Pattern Presets";
    this.closest('#pnlBoxPattern').querySelector('.tabSliderBox3').style.translate = "-200%"; //slide tab to left
    this.closest('#pnlBoxPattern').querySelector('.pnlBottomBoxThumb3').style.translate = "202%"; //slide thumb to right
}
document.querySelector('#pnlBoxPattern').querySelector('.btnPresetBox').addEventListener('click', btnBottomClick);
document.querySelector('#pnlBoxPattern').querySelector('.btnPresetBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxPattern').querySelector('.btnPresetBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxPattern').querySelector('.btnPresetBox').addEventListener('click', showPresetBoxPattern);




























