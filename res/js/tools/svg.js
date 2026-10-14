


//======================PATH NUMBERS===================
//sir, 2026-09-26: "svg hexagram is rendering only semi half". THE THREE SCALERS BELOW USED TO
//SPLIT A PATH ON ANY LETTER AND READ ITS NUMBERS WITH split(' '). THE Hexagram SOURCE CARRIES
//-3.33786e-06, SO ITS e BECAME A COMMAND OF ITS OWN: THE L BEFORE IT WAS LEFT WITH ONE NUMBER,
//THE MISSING y WAS NaN, AND SVG STOPS DRAWING AT THE FIRST NaN - EVERYTHING AFTER IT VANISHED.
//split(' ') ALSO BROKE ON VALID SVG THAT DESIGN TOOLS EXPORT ALL THE TIME: 1,2  3-4  .5.5
//
//THE SEGMENT REGEX NOW MATCHES ONLY THE REAL COMMAND LETTERS, AND THIS READS THE NUMBERS BY
//THEIR SHAPE - SIGN, DECIMALS, EXPONENT - WHATEVER SEPARATES THEM. FOR A PATH THE OLD SPLIT
//READ CORRECTLY IT RETURNS THE SAME NUMBERS, SO EVERY SHAPE THAT ALREADY RENDERED IS UNCHANGED
function svgPathNumbers(text) {

    return text.match(/[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];
}

//======================CREATE VECTOR===================

function createSVG(f, source, post) {

    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let txtSizeWidth = document.querySelector('.txtSizeWidth');
    let txtSizeHeight = document.querySelector('.txtSizeHeight');

    //USE AWAIT AND THEN SINCE THERE'S ISSUE IF JUST USING AWAIT
    //ISSUE IS THE DATA NOT BEING USED FIRST EVEN WITH 'AWAIT'
    canvas.innerHTML = source;

    //process the svg and add <g> tag
    let svgChild = "";
    
    for(let a = 0; a < canvas.querySelector('svg').childElementCount; a++) {
        svgChild += canvas.querySelector('svg').children[a].outerHTML;
    }
    
    //add the <g> tag
    canvas.children[0].innerHTML = `<g></g>`;

    //add the svgChild back
    canvas.children[0].children[0].innerHTML = svgChild;

    let aspectRatio;
    let bbox = canvas.querySelector('svg').getBBox();
    let bboxW = Number(bbox.width);
    let bboxH = Number(bbox.height);

    //check the element position
    if(post == 'center') {

        if(Number(txtSizeWidth.value) > Number(txtSizeHeight.value)) {
            if(bboxW > bboxH) {
                aspectRatio = bboxH / bboxW;
                canvas.style.height = `${Math.round(txtSizeHeight.value * 0.25)}px`;
                canvas.style.width =  `${canvas.clientHeight / aspectRatio}px`;
            }
            else if(bboxW < bboxH) {
                aspectRatio = bboxW / bboxH;

                canvas.style.height = `${Math.round(txtSizeHeight.value * 0.25)}px`;
                canvas.style.width =  `${canvas.clientHeight * aspectRatio}px`;
            }
            else if(bboxW == bboxH) {
                aspectRatio = bboxW / bboxH;

                canvas.style.height = `${Math.round(txtSizeHeight.value * 0.25)}px`;
                canvas.style.width =  `${canvas.clientHeight / aspectRatio}px`;
            }
           
        }
        else if(Number(txtSizeWidth.value) < Number(txtSizeHeight.value)) {
            if(bboxW > bboxH) {
                aspectRatio = bboxH / bboxW;
                canvas.style.width = `${Math.round(txtSizeWidth.value * 0.25)}px`;
                canvas.style.height = `${canvas.clientWidth * aspectRatio}px`;
            }
            else if(bboxW < bboxH) {
                aspectRatio = bboxW / bboxH;
                canvas.style.width = `${Math.round(txtSizeWidth.value * 0.25)}px`;
                canvas.style.height = `${canvas.clientWidth / aspectRatio}px`;
            }

            else if(bboxW == bboxH) {
                aspectRatio = bboxH / bboxW;
                canvas.style.width = `${Math.round(txtSizeWidth.value * 0.25)}px`;
                canvas.style.height = `${canvas.clientWidth / aspectRatio}px`;
            }
        }
    
        else if(Number(txtSizeWidth.value) == Number(txtSizeHeight.value)) {
         
            if(bboxW > bboxH) {
                aspectRatio = bboxH / bboxW;
                canvas.style.width = `${Math.round(txtSizeWidth.value * 0.25)}px`;
                canvas.style.height = `${canvas.clientWidth * aspectRatio}px`;
            }
            else if(bboxW < bboxH) {
                aspectRatio = bboxW / bboxH;
                canvas.style.width = `${Math.round(txtSizeWidth.value * 0.25)}px`;
                canvas.style.height = `${canvas.clientWidth / aspectRatio}px`;
            }

            else if(bboxW == bboxH) {
                aspectRatio = bboxH / bboxW;
                canvas.style.width = `${Math.round(txtSizeWidth.value * 0.25)}px`;
                canvas.style.height = `${canvas.clientWidth / aspectRatio}px`;
            }
            
        }
        
    }

    positionCanvas(canvas);

    //register the default Width and Height of this SVG
    svgOldW[f] = Number(canvas.children[0].getAttribute('viewBox').split(' ')[2]);
    svgOldH[f] = Number(canvas.children[0].getAttribute('viewBox').split(' ')[3]);

    //get fill and stroke color
    let fillColor = "#A9AEFF";
    let strokeColor = "#647499";
    let strokeWidth = 20;

    //position both children as absolute
    canvas.children[0].style.position = "absolute";
    canvas.children[0].setAttribute('width', canvas.clientWidth);
    canvas.children[0].setAttribute('height', canvas.clientHeight);
    canvas.children[0].setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`)

    let newW = Number(canvas.children[0].getAttribute('width'));
    let newH = Number(canvas.children[0].getAttribute('height'));

    //MAKE SPECIAL CONDITION FOR ADJUSTMENT DEPENDING ON THE SHAPE'S PATH
    if(canvas.querySelector('svg').id == "decagram") {
        newW = newW + strokeWidth / 2;
    }

    let scaleX = newW / svgOldW[f];
    let scaleY = newH / svgOldH[f];

    let svgType = canvas.querySelector('g').children[0].tagName;

    let match;
    let newPath = "";

    if(svgType == 'path') {

        //get path string
        let path = canvas.querySelector('path').getAttribute('d');
        
        //create regex
        const regex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
    
        while ((match = regex.exec(path)) !== null) {
            
            if(match[1].toUpperCase() != 'Z') {
                
                if(match[1].toUpperCase() == 'M') {

                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2}`;

                }
                else if(match[1].toUpperCase() == 'L') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2}`;
                }
                else if(match[1].toUpperCase() == 'H') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
            
                    newPath += `${match[1]} ${val1}`;
                }
                else if(match[1].toUpperCase() == 'V') {
                    let val2 = Number(svgPathNumbers(match[2])[0]) * scaleY;

                    newPath += `${match[1]} ${val2}`;
                }
                
                else if(match[1].toUpperCase() == 'C') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                    let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                    let val5 = Number(svgPathNumbers(match[2])[4]) * scaleX;
                    let val6 = Number(svgPathNumbers(match[2])[5]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4} ${val5} ${val6}`;

                }
                
                else if(match[1].toUpperCase() == 'S') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                    let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4}`;
                }
                else if(match[1].toUpperCase() == 'Q') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                    let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4}`;
                }
                else if(match[1].toUpperCase() == 'T') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2}`;

                }
                else if(match[1].toUpperCase() == 'A') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val3 = Number(svgPathNumbers(match[2])[0]);
                    let val4 = Number(svgPathNumbers(match[2])[1]);

                    let val5 = Number(svgPathNumbers(match[2])[0]);
                    let val6 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val7 = Number(svgPathNumbers(match[2])[0]) * scaleX;

                    newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4} ${val5} ${val6} ${val7}`;
                }
            }
            else {
                newPath += 'Z';
            }
        }

        //console.log(newPath)
        //append the scaled path
        let appendDefs = `
        <mask id="vectorMask${f}" maskUnits="userSpaceOnUse" x="-${strokeWidth}" y="-${strokeWidth}">
            <rect x="-${strokeWidth}" y="-${strokeWidth}" width="100%" height="100%" fill="white" />
            <g>
                <path d="${newPath}" fill="black" />
            </g>
        </mask>`

        canvas.children[0].insertAdjacentHTML('afterbegin', appendDefs);
        canvas.children[0].children[1].querySelector('path').setAttribute('d', newPath);
        
        let node  = canvas.children[0].children[1];
        let clone = node.cloneNode(true);
        canvas.children[0].appendChild(clone);

        canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke', strokeColor);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke-width', strokeWidth);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('mask', `url(#vectorMask${f})`);
        // THE STROKE LAYER MUST PAINT NO FILL. IT KEPT THE SOURCE MARKUP'S fill="white",
        //AND THE MASK'S BLACK SHAPE IS ANTI-ALIASED, SO ~1px OF THAT WHITE SURVIVED ALONG
        //THE OUTLINE. g[2] IS ANTI-ALIASED AT THE SAME EDGE SO IT COULD NOT COVER IT -
        //INVISIBLE UNTIL A FILL GRADIENT STOP HIT 0 ALPHA. g[2] OWNS THE REAL FILL
        canvas.querySelectorAll('g')[1].children[0].setAttribute('fill', 'none');
        canvas.querySelectorAll('g')[2].children[0].setAttribute('fill', fillColor);

        canvas.querySelector('svg').children[1].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);
        canvas.querySelector('svg').children[2].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);

    }   

    else if(svgType == 'ellipse') {
        let cx = Number(canvas.querySelector('ellipse').getAttribute('cx'));
        let cy = Number(canvas.querySelector('ellipse').getAttribute('cy'));
        let rx = Number(canvas.querySelector('ellipse').getAttribute('rx'));
        let ry = Number(canvas.querySelector('ellipse').getAttribute('ry'));

        let appendDefs = `
        <mask id="vectorMask${f}" maskUnits="userSpaceOnUse" x="-${strokeWidth}" y="-${strokeWidth}">
            <rect x="-${strokeWidth}" y="-${strokeWidth}" width="100%" height="100%" fill="white" />
            <g>
                <ellipse cx="${cx * scaleX}" cy="${cy * scaleY}" rx="${rx * scaleX}" ry="${ry * scaleY}" fill="black" />
            </g>
        </mask>`

        canvas.children[0].insertAdjacentHTML('afterbegin', appendDefs);
        canvas.children[0].children[1].querySelector('ellipse').setAttribute('cx', cx * scaleX);
        canvas.children[0].children[1].querySelector('ellipse').setAttribute('cy', cy * scaleY);
        canvas.children[0].children[1].querySelector('ellipse').setAttribute('rx', rx * scaleX);
        canvas.children[0].children[1].querySelector('ellipse').setAttribute('ry', ry * scaleY);

        let node  = canvas.children[0].children[1];
        let clone = node.cloneNode(true);
        canvas.children[0].appendChild(clone);

        canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke', strokeColor);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke-width', strokeWidth);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('mask', `url(#vectorMask${f})`);
        // THE STROKE LAYER MUST PAINT NO FILL. IT KEPT THE SOURCE MARKUP'S fill="white",
        //AND THE MASK'S BLACK SHAPE IS ANTI-ALIASED, SO ~1px OF THAT WHITE SURVIVED ALONG
        //THE OUTLINE. g[2] IS ANTI-ALIASED AT THE SAME EDGE SO IT COULD NOT COVER IT -
        //INVISIBLE UNTIL A FILL GRADIENT STOP HIT 0 ALPHA. g[2] OWNS THE REAL FILL
        canvas.querySelectorAll('g')[1].children[0].setAttribute('fill', 'none');
        canvas.querySelectorAll('g')[2].children[0].setAttribute('fill', fillColor);

        canvas.querySelector('svg').children[1].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);
        canvas.querySelector('svg').children[2].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);
    }

    else if(svgType == 'rect') {
        
        let rx = 0;
        let ry = 0;
        let rw = canvas.clientWidth;
        let rh = canvas.clientHeight;

        let skewAngle = Number(canvas.querySelector('svg').dataset.skew) || 0;

        skewAngle = skewAngle * 6;
        
        let appendDefs = `
        <mask id="vectorMask${f}" maskUnits="userSpaceOnUse" x="-${strokeWidth}" y="-${strokeWidth}">
            <rect x="-${strokeWidth}" y="-${strokeWidth}" width="100%" height="100%" fill="white" />
            <g>
                <rect x="${rx}" y="${ry}" width="${rw + skewAngle}" height="${rh}" fill="black" />
            </g>
        </mask>`

        canvas.children[0].insertAdjacentHTML('afterbegin', appendDefs);
        canvas.children[0].children[1].querySelector('rect').setAttribute('x', rx);
        canvas.children[0].children[1].querySelector('rect').setAttribute('y', ry);
        canvas.children[0].children[1].querySelector('rect').setAttribute('width', rw + skewAngle);
        canvas.children[0].children[1].querySelector('rect').setAttribute('height', rh);

        let node  = canvas.children[0].children[1];
        let clone = node.cloneNode(true);
        canvas.children[0].appendChild(clone);

        canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke', strokeColor);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke-width', strokeWidth);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('mask', `url(#vectorMask${f})`);
        // THE STROKE LAYER MUST PAINT NO FILL. IT KEPT THE SOURCE MARKUP'S fill="white",
        //AND THE MASK'S BLACK SHAPE IS ANTI-ALIASED, SO ~1px OF THAT WHITE SURVIVED ALONG
        //THE OUTLINE. g[2] IS ANTI-ALIASED AT THE SAME EDGE SO IT COULD NOT COVER IT -
        //INVISIBLE UNTIL A FILL GRADIENT STOP HIT 0 ALPHA. g[2] OWNS THE REAL FILL
        canvas.querySelectorAll('g')[1].children[0].setAttribute('fill', 'none');
        //canvas.querySelectorAll('g')[1].children[0].setAttribute('rx', rh/2);
        canvas.querySelectorAll('g')[2].children[0].setAttribute('fill', fillColor);
        //canvas.querySelectorAll('g')[2].children[0].setAttribute('rx', rh/2);

        //THE SOURCE RECT CARRIES rx 0.01 AND ANY rx ROUNDS THE OUTSIDE STROKE'S CORNERS. SHARP UNTIL A CORNER RADIUS IS SET
        canvas.querySelectorAll('g')[1].children[0].setAttribute('rx', 0);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('ry', 0);
        canvas.querySelectorAll('g')[2].children[0].setAttribute('rx', 0);
        canvas.querySelectorAll('g')[2].children[0].setAttribute('ry', 0);

        canvas.querySelector('svg').children[1].setAttribute('transform', `translate(${strokeWidth - (skewAngle/2)}, ${strokeWidth})`);
        canvas.querySelector('svg').children[2].setAttribute('transform', `translate(${strokeWidth - (skewAngle/2)}, ${strokeWidth})`);
    }
    
    canvas.children[0].setAttribute('width', canvas.clientWidth + strokeWidth*2);
    canvas.children[0].setAttribute('height', canvas.clientHeight + strokeWidth*2);
    canvas.children[0].setAttribute('viewBox', `0 0 ${canvas.clientWidth + strokeWidth*2} ${canvas.clientHeight + strokeWidth*2}`);

    canvas.children[0].style.left = 0 - (canvas.children[0].clientWidth - canvas.clientWidth) / 2 + 'px';
    canvas.children[0].style.top = 0 - (canvas.children[0].clientHeight - canvas.clientHeight) / 2 + 'px';

    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtWidthLayer', `${canvas.clientWidth}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtHeightLayer', `${canvas.clientHeight}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', `${canvas.offsetLeft}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', `${canvas.offsetTop}`);

    bleedFillLayers();
}

function getNewVector(Ax, Ay, Bx, By, r) {

    let ABx = Bx - Ax;
    let ABy = By - Ay;
    let magnitudeAB = Math.sqrt((ABx ** 2) + (ABy ** 2));
    let normalizeX = ABx / magnitudeAB;
    let normalizeY = ABy / magnitudeAB;

    let newAx, newBx, newAy, newBy, cpAx, cpAy, cpBx, cpBy;

    newAx = Ax + (r * normalizeX);
    newBx = Bx - (r * normalizeX);

    newAy = Ay + (r * normalizeY);
    newBy = By - (r * normalizeY);

    cpAx = Ax + (r / 2 * normalizeX);
    cpAy = Ay + (r / 2 * normalizeY);

    cpBx = Bx - (r / 2 * normalizeX);
    cpBy = By - (r / 2 * normalizeY);

    return [newAx, newAy, newBx, newBy, cpAx, cpAy, cpBx, cpBy];

}

function resizeDefaultPath(f) {
    
    let appendDefs = "";
    let newPath = "";
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

    //GET OLD STROKE AND FILL
    let fillColor = canvas.querySelector('svg').children[2].firstElementChild.getAttribute('fill');
    let strokeColor = canvas.querySelector('svg').children[1].firstElementChild.getAttribute('stroke');
    let strokeWidth = canvas.querySelector('svg').children[1].firstElementChild.getAttribute('stroke-width');

    //GET DEFS IF THERE'S ANY
    let defs = canvas.querySelector('defs') ? canvas.querySelector('defs').outerHTML : '';

    //RESET CANVAS
    canvas.innerHTML = decodeURIComponent(canvas.dataset.source);

    //GET THE DEFAULT WIDTH AND HEIGHT
    svgOldW[f] = Number(canvas.children[0].getAttribute('viewBox').split(' ')[2]);
    svgOldH[f] = Number(canvas.children[0].getAttribute('viewBox').split(' ')[3]);

    //SET NEW WIDTH AND HEIGHT
    canvas.querySelector('svg').setAttribute('width', canvas.clientWidth);
    canvas.querySelector('svg').setAttribute('height', canvas.clientHeight);
    canvas.querySelector('svg').setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`)

    //GET SCALE FROM OLD AND NEW DIMENSIONS
    let newW = Number(canvas.clientWidth);
    let newH = Number(canvas.clientHeight);
    let scaleX = newW / svgOldW[f];
    let scaleY = newH / svgOldH[f];

    //GET THE SVG ELEMENT
    let svgChild = canvas.firstElementChild.firstElementChild.outerHTML;
    
    //REPLACE SVG FIRST ELEMENT AS G
    canvas.firstElementChild.innerHTML = `<g>${svgChild}</g>`;

    let svgType = canvas.querySelector('g').firstElementChild.tagName;

    if(svgType == 'path') {

        //get path string
        let path = canvas.querySelector('path').getAttribute('d');
    
        //create regex
        const regex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
        
        let match;
        
        while ((match = regex.exec(path)) !== null) {
            
            if(match[1].toUpperCase() != 'Z') {
            
                if(match[1].toUpperCase() == 'M') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2}`;
                }
                else if(match[1].toUpperCase() == 'L') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2}`;
                }
                else if(match[1].toUpperCase() == 'H') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
            
                    newPath += `${match[1]} ${val1}`;

                }
                else if(match[1].toUpperCase() == 'V') {
                    let val2 = Number(svgPathNumbers(match[2])[0]) * scaleY;

                    newPath += `${match[1]} ${val2}`;
                }
                else if(match[1].toUpperCase() == 'C') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                    let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                    let val5 = Number(svgPathNumbers(match[2])[4]) * scaleX;
                    let val6 = Number(svgPathNumbers(match[2])[5]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4} ${val5} ${val6}`;

                }
                else if(match[1].toUpperCase() == 'S') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                    let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4}`;
                }
                else if(match[1].toUpperCase() == 'Q') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                    let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4}`;
                }
                else if(match[1].toUpperCase() == 'T') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    newPath += `${match[1]} ${val1} ${val2}`;

                }
                else if(match[1].toUpperCase() == 'A') {
                    let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                    let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val3 = Number(svgPathNumbers(match[2])[0]);
                    let val4 = Number(svgPathNumbers(match[2])[1]);

                    let val5 = Number(svgPathNumbers(match[2])[0]);
                    let val6 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                    let val7 = Number(svgPathNumbers(match[2])[0]) * scaleX;

                    newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4} ${val5} ${val6} ${val7}`;
                }

            }
            else {
                newPath += 'Z';
            }

        }

        appendDefs = `
        <mask id="vectorMask${f}" maskUnits="userSpaceOnUse" x="-${strokeWidth}" y="-${strokeWidth}">
            <rect x="-${strokeWidth}" y="-${strokeWidth}" width="100%" height="100%" fill="white" />
            <g style="mix-blend-mode:normal" opacity="1">
                <path d="${newPath}" fill="black" />
            </g>
        </mask>`
        canvas.children[0].insertAdjacentHTML('afterbegin', appendDefs);
        canvas.children[0].children[1].querySelector('path').setAttribute('d', newPath);
        
        let node  = canvas.children[0].children[1];
        let clone = node.cloneNode(true);
        canvas.children[0].appendChild(clone);

        //ADD DEFS IF THERE'S ANY
        canvas.querySelector('svg').innerHTML += defs;

        canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke', strokeColor);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke-width', strokeWidth);
        canvas.querySelectorAll('g')[1].children[0].setAttribute('mask', `url(#vectorMask${f})`);
        // THE STROKE LAYER MUST PAINT NO FILL. IT KEPT THE SOURCE MARKUP'S fill="white",
        //AND THE MASK'S BLACK SHAPE IS ANTI-ALIASED, SO ~1px OF THAT WHITE SURVIVED ALONG
        //THE OUTLINE. g[2] IS ANTI-ALIASED AT THE SAME EDGE SO IT COULD NOT COVER IT -
        //INVISIBLE UNTIL A FILL GRADIENT STOP HIT 0 ALPHA. g[2] OWNS THE REAL FILL
        canvas.querySelectorAll('g')[1].children[0].setAttribute('fill', 'none');
        canvas.querySelectorAll('g')[2].children[0].setAttribute('fill', fillColor);

        canvas.querySelector('svg').children[1].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);
        canvas.querySelector('svg').children[2].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);
    }
    
    canvas.children[0].setAttribute('width', canvas.clientWidth + strokeWidth*2);
    canvas.children[0].setAttribute('height', canvas.clientHeight + strokeWidth*2);
    canvas.children[0].setAttribute('viewBox', `0 0 ${canvas.clientWidth + strokeWidth*2} ${canvas.clientHeight + strokeWidth*2}`);

    canvas.children[0].style.left = 0 - (canvas.children[0].clientWidth - canvas.clientWidth) / 2 + 'px';
    canvas.children[0].style.top = 0 - (canvas.children[0].clientHeight - canvas.clientHeight) / 2 + 'px';
    
    return newPath;

}


function curveSVG(f) {

    let i = 0;
    let newPath = [];
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let svgShape = canvas.querySelector('svg').id;
    let svgType = canvas.querySelector('g').children[0].tagName;
    let panel = document.getElementById('pnlBoxElement')
    let cornerRadius = panel.querySelector('.txtElementCornerRadius').value;

    if(svgType == 'path') {

        let exclude = ["oval", "half oval", "semicircle", "quadrant"];

        //EVERY id IN res_elements IS TITLE CASE - Semicircle, Quadrant - AND includes IS CASE
        //SENSITIVE, SO THIS LIST MATCHED NOTHING AND BOTH FELL INTO THE CORNER ROUNDING BELOW,
        //WHICH ONLY KNOWS STRAIGHT EDGES. Semicircle LOST ITS C->L AND L->C SEGMENTS AND CAME
        //BACK AS ONE SLIVER OF A CURVE - THE DROP. Quadrant THREW ON AN UNSET lastCP, AND THE
        //THROW SKIPPED adjustCanvas2Pin's RE-CENTRING, SO THE LAYER RESIZED PINNED TO ITS OLD
        //TOP-LEFT. ONLY THE COMPARISON IS LOWERCASED: svgShape ITSELF FEEDS THE includes('star')
        //TESTS BELOW, AND LOWERCASING IT WOULD SWITCH Star AND Star Cross ONTO A BRANCH THEY HAVE
        //NEVER TAKEN
        if(!exclude.includes(svgShape.toLowerCase())) {

            let lastCP;
            let lastCoor;

            //get reformatted path string
            let splitPath = resizeDefaultPath(f).split(/(?=\s*[MmLlHhVvCcSsQqTtAaZz])/);
            
            //REFORMAT SPLITPATH
            for(let a = 0; a < splitPath.length; a++) {
                //CONVERT ANY HORIZONTAL TO LINE ATTRIBUTE
                if(splitPath[a].charAt(0) == 'H') {
                    let currX = splitPath[a].split(' ')[1];
                    let prevY = splitPath[a-1].split(' ')[2];
                    splitPath[a] = 'L ' + currX + ' ' + prevY;
                    
                }
                //CONVERT ANY VERTICAL TO LINE ATTRIBUTE
                else if(splitPath[a].charAt(0) == 'V') {
                    let currY = splitPath[a].split(' ')[1];
                    let prevX = splitPath[a-1].split(' ')[1];
                    splitPath[a] = 'L ' + prevX + ' ' + currY;
                }
            }

            for(let a = 0; a < splitPath.length; a++) {

                if(splitPath[a+1] != null) {

                    let Ax = Number(splitPath[a].split(' ')[1]);
                    let Ay = Number(splitPath[a].split(' ')[2]);

                    //if splitpath is not null or go back from the start
                    let Bx = Number(splitPath[a+1].split(' ')[1]);
                    let By = Number(splitPath[a+1].split(' ')[2]);

                    let newAx = getNewVector(Ax, Ay, Bx, By, cornerRadius)[0];
                    let newAy = getNewVector(Ax, Ay, Bx, By, cornerRadius)[1];
                    let newBx = getNewVector(Ax, Ay, Bx, By, cornerRadius)[2];
                    let newBy = getNewVector(Ax, Ay, Bx, By, cornerRadius)[3];
                    let newCPAx = getNewVector(Ax, Ay, Bx, By, cornerRadius)[4];
                    let newCPAy = getNewVector(Ax, Ay, Bx, By, cornerRadius)[5];
                    let newCPBx = getNewVector(Ax, Ay, Bx, By, cornerRadius)[6];
                    let newCPBy = getNewVector(Ax, Ay, Bx, By, cornerRadius)[7];
                    
                    ////CHECK IF MOVE TO LINE
                    if(splitPath[a].charAt(0).toUpperCase() == 'M' && splitPath[a+1].charAt(0).toUpperCase() == 'L') {
                        
                        if(!svgShape.includes('star')) {
                            //prepare last control point
                            lastCP = [newCPAx, newCPAy];
                            //copy first coordinates to last
                            lastCoor = [newAx, newAy, 'Z'];

                            newPath[i]  = ['M', newAx, newAy];
                            i++;
                            newPath[i] = ['L', newBx, newBy];
                            i++;
                            newPath[i] = ['C', newCPBx, newCPBy];
                            i++;
                        }
                        else {

                            //prepare last control point
                            lastCP = [newCPAx, newCPAy];
                            //copy first coordinates to last
                            lastCoor = [newAx, newAy, 'Z'];

                            newPath[i]  = ['M', newAx, newAy];
                            i++;
                            newPath[i] = ['L', Bx, By];
                            i++;  
                        }
                    }

                    //CHECK IF MOVE TO CURVE
                    else if(splitPath[a].charAt(0).toUpperCase() == 'M' && splitPath[a+1].charAt(0).toUpperCase() == 'C') {
                        
                        lastCoor = [splitPath[a].split(' ')[1], splitPath[a].split(' ')[2], 'Z'];

                        newPath[i] = [];
                        for(let b = 0; b < splitPath[a].split(' ').length; b++) {
                            newPath[i].push(splitPath[a].split(' ')[b]);
                        }

                        i++;

                    }

                    //CHECK IF LINE TO LINE
                    else if(splitPath[a].charAt(0).toUpperCase() == 'L' && splitPath[a+1].charAt(0).toUpperCase() == 'L') {
                        
                        if(!svgShape.includes('star')) {
                            
                            newPath[i] = [newCPAx, newCPAy, newAx, newAy];
                            i++;
                            newPath[i] = ['L', newBx, newBy];
                            i++;
                            newPath[i] = ['C', newCPBx, newCPBy];
                            i++;
                        }
                        else {

                            if(a % 2 != 0) {
                        
                                newPath[i] = ['L', newBx, newBy];
                                i++;
                                newPath[i] = ['C', newCPBx, newCPBy];
                                i++;
                            }
                            else {
                                newPath[i] = [newCPAx, newCPAy, newAx, newAy];
                                i++;
                                newPath[i] = ['L', Bx, By];
                                i++;
                    
                            }
                        
                        } 
                    }

                    //CHECK IF CURVE TO CURVE
                    else if(splitPath[a].charAt(0).toUpperCase() == 'C' && splitPath[a+1].charAt(0).toUpperCase() == 'C') {
                        
                        newPath[i] = [];
                        for(let b = 0; b < splitPath[a].split(' ').length; b++) {
                            newPath[i].push(splitPath[a].split(' ')[b]);
                        }
                        i++;
                    }
                   
                }
                else {
                
                    //check then if initial line is straight
                    if(splitPath[a].charAt(0).toUpperCase() == 'Z' && splitPath[0].charAt(0).toUpperCase() == 'M') {
                        
                        if(splitPath[a-1].split(' ')[0] == 'L') {
                            newPath[i] = lastCP;
                            i++;
                            newPath[i] = lastCoor;
                            
                        }
                        else if(splitPath[a-1].split(' ')[0] == 'C') {
                            newPath[i] = [];
                            for(let b = 0; b < splitPath[a-1].split(' ').length; b++) {
                                newPath[i].push(splitPath[a-1].split(' ')[b]);
                            }
                            i++;
                            newPath[i] = ['Z'];
                        }
                    
                    }
                }
                
            }

            //now connect the loose ends
            let finalPath = "";
            for(let a = 0; a < newPath.length; a++) {
                
                //console.log(newPath)
                if(newPath[a].length > 0) {
                    for(let b = 0; b < newPath[a].length; b++) {
                        finalPath += newPath[a][b];
                        finalPath += ' ';
                    }
                }
            
            }

            canvas.querySelectorAll('path')[0].setAttribute('d', finalPath);
            canvas.querySelectorAll('path')[1].setAttribute('d', finalPath);
            canvas.querySelectorAll('path')[2].setAttribute('d', finalPath);
        }
    }

    else if(svgType == 'rect') {

        //SVG CAPS rx AND ry EACH ON ITS OWN AXIS, SO A RADIUS PAST HALF THE SHORT SIDE MADE THE ENDS HALF ELLIPSES
        //ONE RADIUS FOR BOTH AXES, CAPPED AT HALF THE SHORT SIDE, KEEPS EVERY CORNER A CIRCLE. AT THE CAP IT IS A PILL
        let rect = canvas.querySelectorAll('rect')[1];
        let radius = Math.min(Number(cornerRadius) || 0, rect.width.baseVal.value / 2, rect.height.baseVal.value / 2);

        canvas.querySelectorAll('rect')[1].setAttribute('rx', radius);
        canvas.querySelectorAll('rect')[1].setAttribute('ry', radius);
        canvas.querySelectorAll('rect')[2].setAttribute('rx', radius);
        canvas.querySelectorAll('rect')[2].setAttribute('ry', radius);
        canvas.querySelectorAll('rect')[3].setAttribute('rx', radius);
        canvas.querySelectorAll('rect')[3].setAttribute('ry', radius);
    }

    initPanel++;
    if(initPanel == panelCountMax) {
        useVectorPanel();
    }
}

function renderSVG(f) {

    let appendDefs = "";
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    let subtype = canvas.dataset.subtype;

    if(subtype == "shape") {

        //GET OLD STROKE AND FILL
        /*
        let fillColor = canvas.querySelector('svg').children[2].firstElementChild.getAttribute('fill');
        let strokeColor = canvas.querySelector('svg').children[1].firstElementChild.getAttribute('stroke');
        let strokeWidth = canvas.querySelector('svg').children[1].firstElementChild.getAttribute('stroke-width');
        let strokeDash = canvas.querySelector('svg').children[1].firstElementChild.getAttribute('stroke-dasharray').split(' ')[0];
        let strokeGap = canvas.querySelector('svg').children[1].firstElementChild.getAttribute('stroke-dasharray').split(' ')[1];
        */

        let fillColor = valueFinder(dataLayer[f], 'txtElementFillColor');
        let strokeColor = valueFinder(dataLayer[f], 'txtElementStrokeColor');

        //A GRADIENT IS STORED AS ITS CSS STRING AND SVG ONLY ACCEPTS url(#id)
        if(fillColor.includes('gradient')) fillColor = `url(#element_${fillColor.split('-')[0]}_fill_${f})`;
        if(strokeColor.includes('gradient')) strokeColor = `url(#element_${strokeColor.split('-')[0]}_stroke_${f})`;
        let strokeWidth = valueFinder(dataLayer[f], 'txtElementStrokeWidth');
        let strokeDash = valueFinder(dataLayer[f], 'txtElementStrokeDash');
        let strokeGap = valueFinder(dataLayer[f], 'txtElementStrokeGap');

        //GET DEFS IF THERE'S ANY
        let defs = canvas.querySelector('defs') ? canvas.querySelector('defs').outerHTML : '';

        //RESET CANVAS
        canvas.innerHTML = decodeURIComponent(canvas.dataset.source);

        //GET THE DEFAULT WIDTH AND HEIGHT
        svgOldW[f] = Number(canvas.children[0].getAttribute('viewBox').split(' ')[2]);
        svgOldH[f] = Number(canvas.children[0].getAttribute('viewBox').split(' ')[3]);

        //SET NEW WIDTH AND HEIGHT
        canvas.querySelector('svg').setAttribute('width', canvas.clientWidth);
        canvas.querySelector('svg').setAttribute('height', canvas.clientHeight);
        canvas.querySelector('svg').setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`)

        //GET SCALE FROM OLD AND NEW DIMENSIONS
        let newW = Number(canvas.clientWidth);
        let newH = Number(canvas.clientHeight);
        let scaleX = newW / svgOldW[f];
        let scaleY = newH / svgOldH[f];

        //GET THE SVG ELEMENT
        let svgChild = canvas.firstElementChild.firstElementChild.outerHTML;
        
        //REPLACE SVG FIRST ELEMENT AS G
        canvas.firstElementChild.innerHTML = `<g>${svgChild}</g>`;

        let svgType = canvas.querySelector('g').firstElementChild.tagName;

        if(svgType == 'path') {

            //get path string
            let path = canvas.querySelector('path').getAttribute('d');
            
            //create regex
            const regex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
            
            let match;
            let newPath = "";

            while ((match = regex.exec(path)) !== null) {
                
                if(match[1].toUpperCase() != 'Z') {
                
                    if(match[1].toUpperCase() == 'M') {
                        let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                        let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                        newPath += `${match[1]} ${val1} ${val2}`;
                    }
                    else if(match[1].toUpperCase() == 'L') {
                        let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                        let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                        newPath += `${match[1]} ${val1} ${val2}`;
                    }
                    else if(match[1].toUpperCase() == 'H') {
                        let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                
                        newPath += `${match[1]} ${val1}`;

                    }
                    else if(match[1].toUpperCase() == 'V') {
                        let val2 = Number(svgPathNumbers(match[2])[0]) * scaleY;

                        newPath += `${match[1]} ${val2}`;
                    }
                    
                    else if(match[1].toUpperCase() == 'C') {
                        let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                        let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                        let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                        let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                        let val5 = Number(svgPathNumbers(match[2])[4]) * scaleX;
                        let val6 = Number(svgPathNumbers(match[2])[5]) * scaleY;

                        newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4} ${val5} ${val6}`;

                    }
                    
                    else if(match[1].toUpperCase() == 'S') {
                        let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                        let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                        let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                        let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                        newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4}`;
                    }
                    else if(match[1].toUpperCase() == 'Q') {
                        let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                        let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                        let val3 = Number(svgPathNumbers(match[2])[2]) * scaleX;
                        let val4 = Number(svgPathNumbers(match[2])[3]) * scaleY;

                        newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4}`;
                    }
                    else if(match[1].toUpperCase() == 'T') {
                        let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                        let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                        newPath += `${match[1]} ${val1} ${val2}`;

                    }
                    else if(match[1].toUpperCase() == 'A') {
                        let val1 = Number(svgPathNumbers(match[2])[0]) * scaleX;
                        let val2 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                        let val3 = Number(svgPathNumbers(match[2])[0]);
                        let val4 = Number(svgPathNumbers(match[2])[1]);

                        let val5 = Number(svgPathNumbers(match[2])[0]);
                        let val6 = Number(svgPathNumbers(match[2])[1]) * scaleY;

                        let val7 = Number(svgPathNumbers(match[2])[0]) * scaleX;

                        newPath += `${match[1]} ${val1} ${val2} ${val3} ${val4} ${val5} ${val6} ${val7}`;
                    }

                }
                else {
                    newPath += 'Z';
                }

            }

            appendDefs = `
            <mask id="vectorMask${f}" maskUnits="userSpaceOnUse" x="-${strokeWidth}" y="-${strokeWidth}">
                <rect x="-${strokeWidth}" y="-${strokeWidth}" width="100%" height="100%" fill="white" />
                <g style="mix-blend-mode:normal" opacity="1">
                    <path d="${newPath}" fill="black" />
                </g>
            </mask>`

            canvas.querySelector('svg').insertAdjacentHTML('afterbegin', appendDefs);
            //NOW APPEND THE NEW PATH AS THE FIRST ELEMENT OF THE FIRST <G> FOR STROKE
            canvas.querySelector('svg').children[1].querySelector('path').setAttribute('d', newPath);
            //NOW JUST DUPLICATE AND ADD AS THE 2ND <G> FOR FILL
            let node  = canvas.children[0].children[1];
            let clone = node.cloneNode(true);
            canvas.querySelector('svg').appendChild(clone)

            //ADD DEFS IF THERE'S ANY
            canvas.querySelector('svg').innerHTML += defs;

            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('stroke', strokeColor);
            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('stroke-width', strokeWidth);
            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('stroke-dasharray', `${strokeDash} ${strokeGap}`);

            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('mask', `url(#vectorMask${f})`);
            // THE STROKE LAYER MUST PAINT NO FILL. IT KEPT THE SOURCE MARKUP'S fill="white",
            //AND THE MASK'S BLACK SHAPE IS ANTI-ALIASED, SO ~1px OF THAT WHITE SURVIVED ALONG
            //THE OUTLINE. g[2] IS ANTI-ALIASED AT THE SAME EDGE SO IT COULD NOT COVER IT -
            //INVISIBLE UNTIL A FILL GRADIENT STOP HIT 0 ALPHA. g[2] OWNS THE REAL FILL
            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('fill', 'none');
            canvas.querySelectorAll('g')[2].firstElementChild.setAttribute('fill', fillColor);
            
            canvas.querySelectorAll('g')[1].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);
            canvas.querySelectorAll('g')[2].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);
        }

        else if(svgType == 'ellipse') {
            let cx = Number(canvas.querySelector('ellipse').getAttribute('cx'));
            let cy = Number(canvas.querySelector('ellipse').getAttribute('cy'));
            let rx = Number(canvas.querySelector('ellipse').getAttribute('rx'));
            let ry = Number(canvas.querySelector('ellipse').getAttribute('ry'));

            appendDefs = `
            <mask id="vectorMask${f}" maskUnits="userSpaceOnUse" x="-${strokeWidth}" y="-${strokeWidth}">
                <rect x="-${strokeWidth}" y="-${strokeWidth}" width="100%" height="100%" fill="white" />
                <g>
                    <ellipse cx="${cx * scaleX}" cy="${cy * scaleY}" rx="${rx * scaleX}" ry="${ry * scaleY}" fill="black" />
                </g>
            </mask>`

            canvas.children[0].insertAdjacentHTML('afterbegin', appendDefs);

            //NOW APPEND THE NEW PATH AS THE FIRST ELEMENT OF THE FIRST <G> FOR STROKE
            canvas.querySelector('svg').children[1].querySelector('ellipse').setAttribute('cx', cx * scaleX);
            canvas.querySelector('svg').children[1].querySelector('ellipse').setAttribute('cy', cy * scaleY);
            canvas.querySelector('svg').children[1].querySelector('ellipse').setAttribute('rx', rx * scaleX);
            canvas.querySelector('svg').children[1].querySelector('ellipse').setAttribute('ry', ry * scaleY);

            let node  = canvas.querySelector('svg').children[1];
            let clone = node.cloneNode(true);
            canvas.querySelector('svg').appendChild(clone);

            //ADD DEFS IF THERE'S ANY
            canvas.querySelector('svg').innerHTML += defs;

            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('stroke', strokeColor);
            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('stroke-width', strokeWidth);
            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('stroke-dasharray', `${strokeDash} ${strokeGap}`);

            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('mask', `url(#vectorMask${f})`);
            // THE STROKE LAYER MUST PAINT NO FILL. IT KEPT THE SOURCE MARKUP'S fill="white",
            //AND THE MASK'S BLACK SHAPE IS ANTI-ALIASED, SO ~1px OF THAT WHITE SURVIVED ALONG
            //THE OUTLINE. g[2] IS ANTI-ALIASED AT THE SAME EDGE SO IT COULD NOT COVER IT -
            //INVISIBLE UNTIL A FILL GRADIENT STOP HIT 0 ALPHA. g[2] OWNS THE REAL FILL
            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('fill', 'none');
            canvas.querySelectorAll('g')[2].firstElementChild.setAttribute('fill', fillColor);

            canvas.querySelectorAll('g')[1].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);
            canvas.querySelectorAll('g')[2].setAttribute('transform',  `translate(${strokeWidth}, ${strokeWidth})`);

        }

        else if(svgType == 'rect') {
            
            let rx = 0;
            let ry = 0;
            let rw = canvas.clientWidth;
            let rh = canvas.clientHeight;

            let skewAngle = Number(canvas.querySelector('svg').dataset.skew) || 0;

            skewAngle = skewAngle * 6;

            let appendDefs = `
            <mask id="vectorMask${f}" maskUnits="userSpaceOnUse" x="-${strokeWidth}" y="-${strokeWidth}">
                <rect x="-${strokeWidth}" y="-${strokeWidth}" width="100%" height="100%" fill="white" />
                <g>
                    <rect x="${rx}" y="${ry}" width="${rw + skewAngle}" height="${rh}" fill="black" />
                </g>
            </mask>`

            canvas.children[0].insertAdjacentHTML('afterbegin', appendDefs);
            canvas.children[0].children[1].querySelector('rect').setAttribute('x', rx);
            canvas.children[0].children[1].querySelector('rect').setAttribute('y', ry);
            canvas.children[0].children[1].querySelector('rect').setAttribute('width', rw + skewAngle);
            canvas.children[0].children[1].querySelector('rect').setAttribute('height', rh);

            let node  = canvas.children[0].children[1];
            let clone = node.cloneNode(true);
            canvas.children[0].appendChild(clone);

            //ADD DEFS IF THERE'S ANY
            canvas.querySelector('svg').innerHTML += defs;

            canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke', strokeColor);
            canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke-width', strokeWidth);
            canvas.querySelectorAll('g')[1].firstElementChild.setAttribute('stroke-dasharray', `${strokeDash} ${strokeGap}`);

            canvas.querySelectorAll('g')[1].children[0].setAttribute('mask', `url(#vectorMask${f})`);
            // THE STROKE LAYER MUST PAINT NO FILL. IT KEPT THE SOURCE MARKUP'S fill="white",
            //AND THE MASK'S BLACK SHAPE IS ANTI-ALIASED, SO ~1px OF THAT WHITE SURVIVED ALONG
            //THE OUTLINE. g[2] IS ANTI-ALIASED AT THE SAME EDGE SO IT COULD NOT COVER IT -
            //INVISIBLE UNTIL A FILL GRADIENT STOP HIT 0 ALPHA. g[2] OWNS THE REAL FILL
            canvas.querySelectorAll('g')[1].children[0].setAttribute('fill', 'none');
            canvas.querySelectorAll('g')[2].children[0].setAttribute('fill', fillColor);

            canvas.querySelector('svg').children[1].setAttribute('transform', `translate(${strokeWidth - (skewAngle/2)}, ${strokeWidth})`);
            canvas.querySelector('svg').children[2].setAttribute('transform', `translate(${strokeWidth - (skewAngle/2)}, ${strokeWidth})`);
        }
        
        canvas.firstElementChild.setAttribute('width', canvas.clientWidth + strokeWidth*2);
        canvas.firstElementChild.setAttribute('height', canvas.clientHeight + strokeWidth*2);
        canvas.firstElementChild.setAttribute('viewBox', `0 0 ${canvas.clientWidth + strokeWidth*2} ${canvas.clientHeight + strokeWidth*2}`);

        canvas.firstElementChild.style.left = 0 - (canvas.firstElementChild.clientWidth - canvas.clientWidth) / 2 + 'px';
        canvas.firstElementChild.style.top = 0 - (canvas.firstElementChild.clientHeight - canvas.clientHeight) / 2 + 'px';

        curveSVG(f);
    }

    //canvas.innerHTML WAS RESET FROM THE SOURCE ABOVE, SO THE BLEED IS GONE AND GOES BACK ON HERE
    bleedFillLayers();
}

//==================JOINT BLEED==================
//EVERY LAYER ANTI ALIASES ITS OWN EDGE, SO WHERE TWO TOUCH MID PIXEL THE BACKGROUND LEAKS THROUGH AS A HAIRLINE
//ONE SCREEN PIXEL OF THE FILL'S OWN PAINT AROUND THE FILL LAYER MAKES TOUCHING LAYERS OVERLAP INSTEAD
//OFF IS stroke="none", NEVER A WIDTH OF 0. SKIA DRAWS A ZERO WIDTH STROKE AS A ONE PIXEL HAIRLINE
function bleedFillLayers(off) {

    let z = rngZoom.value / 100;

    //AT A WHOLE DEVICE SCALE THE JOINTS ARE ALREADY CRISP AND A BLEED WOULD ONLY SOFTEN EVERY EDGE
    let crisp = Number.isInteger(z * window.devicePixelRatio);

    cnvGrpLayers.querySelectorAll('.cnvLayers').forEach((canvas) => {

        let f = canvas.dataset.ref;
        let svg = canvas.querySelector('svg');

        //AN IMAGE'S STROKE IS A CSS BORDER ON THE img. THE PHOTO AND THE BORDER ANTI ALIAS THEIR SHARED EDGE ON THEIR OWN, SO MID PIXEL
        //THE CANVAS SHOWS THROUGH AS A HAIRLINE (MEASURED 2026-10-04: rgb(126, 63, 191) BETWEEN RED AND BLUE). AN outline OF THE BORDER
        //COLOUR, TWO SCREEN PIXELS WIDE, STRADDLES THE SEAM: ONE INTO THE BORDER, ONE OVER THE PHOTO'S OUTERMOST PIXEL. ONE PIXEL ONLY
        //INSIDE MADE A NEW SEAM BETWEEN THE BORDER AND THE BAND (MEASURED: STILL rgb(191, 31, 95)). AN outline PAINTS OVER THE CONTENT
        //AND NEVER TOUCHES LAYOUT: NO left, width OR transform CHANGES, SO THE PHOTO CANNOT MOVE AGAINST ITS PIN (sir, 2026-10-04)
        if(canvas.dataset.type == "image") {

            let img = canvas.children[0];

            if(img == null) return;

            let width = parseFloat(img.style.borderWidth) || 0;
            let color = img.style.borderColor;
            let rgba = color.match(/rgba\(([^)]*)\)/);

            //A TRANSLUCENT STROKE WOULD DRAW THE BAND AS A DARKER LINE OVER THE PHOTO
            let solid = width > 0 && img.style.borderStyle == "solid" && color != "" && (rgba == null || Number(rgba[1].split(',')[3]) >= 1);

            if(!off && !crisp && solid && canvas.dataset.mask != "mask") {

                img.style.outline = `${2 / z}px solid ${color}`;
                img.style.outlineOffset = `${0 - width - 1 / z}px`;
            }
            else {

                //NOTHING OF THE BAND IS LEFT BEHIND, SO A SAVED FILE OR AN EXPORT CARRIES NO ZOOM SIZED OUTLINE
                img.style.removeProperty('outline');
                img.style.removeProperty('outline-offset');
            }

            //MASKED: THE CLONE'S STROKE REACHES ONE SCREEN PX UNDER ITS PICTURE LIVE, ONE DESIGN PX FOR EXPORT AND SAVE
            let belowF = f2Panel(f)?.nextElementSibling?.dataset.ref;
            let maskImg = canvas.dataset.mask == "mask" && belowF != null ? f2Canvas(belowF)?.querySelector(`#image_mask_${belowF}`) : null;
            let stroke = maskImg?.previousElementSibling;

            if(stroke != null && stroke.hasAttribute('stroke-width')) {

                let d = off || crisp ? 1 : Math.max(1, 1 / z);

                stroke.setAttribute('x', Number(maskImg.getAttribute('x')) - (width - d) / 2);
                stroke.setAttribute('y', Number(maskImg.getAttribute('y')) - (width - d) / 2);
                stroke.setAttribute('width', Number(maskImg.getAttribute('width')) + width - d);
                stroke.setAttribute('height', Number(maskImg.getAttribute('height')) + width - d);
                stroke.setAttribute('stroke-width', width + d);
            }

            return;
        }

        if(canvas.dataset.type != "element" || svg == null || svg.querySelector(`#vectorMask${f}`) == null) return;

        let shape = canvas.querySelectorAll('g')[2]?.children[0];

        if(shape == null) return;

        //THE BLEED SITS OUTSIDE THE SHAPE, SO THE SVG MUST NOT CLIP IT AT ITS OWN BOX
        svg.style.overflow = "visible";

        let fill = shape.getAttribute('fill') || "none";
        let opaque;

        if(fill.startsWith('url(')) {

            //A GRADIENT WITH NO TRANSPARENT STOP. A MASKED IMAGE OR ANY OTHER PAINT STAYS OFF
            let paint = canvas.querySelector(`[id="${fill.slice(5, -1).replace('#', '')}"]`);

            opaque = paint != null && paint.tagName.toLowerCase().includes('gradient')
            && [...paint.querySelectorAll('stop')].every((stop) => Number(stop.getAttribute('stop-opacity') ?? 1) >= 1);
        }
        else {

            let rgba = fill.match(/rgba\(([^)]*)\)/);

            opaque = fill != "none" && fill != "transparent" && (rgba == null || Number(rgba[1].split(',')[3]) >= 1);
        }

        let style = getComputedStyle(canvas);

        //A TRANSLUCENT FILL OR LAYER DOUBLES ITS ALPHA WHERE THE BLEED OVERLAPS AND DRAWS A DARK LINE INSTEAD
        let on = !off && !crisp && opaque && canvas.dataset.mask != "mask" && Number(style.opacity) >= 1 && style.mixBlendMode == "normal";

        if(on) {

            shape.setAttribute('stroke', fill);
            shape.setAttribute('stroke-width', 1 / z);
            shape.setAttribute('stroke-linejoin', 'round');
            shape.setAttribute('stroke-dasharray', 'none');
        }
        else {

            //NOTHING OF THE BLEED IS LEFT BEHIND, SO A SAVED FILE CARRIES NO ZOOM SIZED WIDTH
            shape.setAttribute('stroke', 'none');
            shape.removeAttribute('stroke-width');
            shape.removeAttribute('stroke-linejoin');
            shape.removeAttribute('stroke-dasharray');
        }
    });
}
