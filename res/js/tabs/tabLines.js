

let elements = [];

elements[0] = {
    id: 'line',
    type: 'line',
    size: 'mini',
    post: 'center',
    fill: 'false',
    tags: 'shapes, straight line, regular line',
    source: `<svg id="line" width="18" height="2" viewBox="0 0 18 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 1L18 1" stroke="white" stroke-width="1"/>
    </svg>`,
}

elements[1] = {
    id: 'line miter',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'false',
    tags: 'line miter, blunt line, square line',
    source: ``,
}

elements[2] = {
    id: 'line round',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'false',
    tags: 'line round, round line',
    source: `<svg id="line" width="18" height="2" viewBox="0 0 18 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 1L18 1" stroke="white" stroke-width="1" stroke-linecap="round"/>
    </svg>`,
    }

elements[3] = {
    id: 'line arrow',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'false',
    tags: 'line arrow',
    source: `<svg id="line arrow" width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 1L1 3.5L3.5 6M1.5 3.5H6" stroke="white"/>
    </svg>`,
}

elements[4] = {
    id: 'line arrow fill',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'true',
    tags: 'line arrow, arrowhead, arrow head, arrow fill',
    source: `<svg id="line arrow fill" width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2.5L5 4V2.5V1L2 2.5Z" fill="white"/>
    <path d="M5 2.5V4L2 2.5L5 1V2.5ZM5 2.5H6" stroke="white"/>
    </svg>`,
}

elements[5] = {
    id: 'line circle',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'false',
    tags: 'line circle, line ellipse',
    source: `<svg id="line circle" width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2.5C5 3.60457 4.10457 4.5 3 4.5C1.89543 4.5 1 3.60457 1 2.5C1 1.39543 1.89543 0.500004 3 0.500004C4.10457 0.500004 5 1.39543 5 2.5ZM5 2.5H6" stroke="white"/>
    </svg>`,
}

elements[6] = {
    id: 'line circle fill',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'true',
    tags: 'line circle, line ellipse, line circle fill, line ellipse fill',
    source: `<svg id="line circle fill" width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2.5C5 3.60457 4.10457 4.5 3 4.5C1.89543 4.5 1 3.60457 1 2.5C1 1.39543 1.89543 0.500004 3 0.500004C4.10457 0.500004 5 1.39543 5 2.5ZM5 2.5H6" stroke="white" fill="white"/>
    </svg>`,
}

elements[7] = {
    id: 'line diamond',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'false',
    tags: 'line diamond',
    source: `<svg id="line diamond" width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3.50001L3 1.50001L1 3.50001L3 5.50001L5 3.50001ZM5 3.50001H6" stroke="white"/>
    </svg>`,
}

elements[8] = {
    id: 'line diamond fill',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'true',
    tags: 'line diamond, line diamond fill',
    source: `<svg id="line diamond fill" width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3.50001L3 1.50001L1 3.50001L3 5.50001L5 3.50001ZM5 3.50001H6" stroke="white" fill="white"/>
    </svg>`,
}

elements[9] = {
    id: 'line square',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'false',
    tags: 'line square',
    source: `<svg id="line square" width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2.5V0.500004H1V4.5H5V2.5ZM5 2.5H6" stroke="white"/>
    </svg>`,
}

elements[10] = {
    id: 'line square fill',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'true',
    tags: 'line square, line square fill',
    source: `<svg id="line square fill" width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2.5V0.500004H1V4.5H5V2.5ZM5 2.5H6" stroke="white" fill="white"/>
    </svg>`,
}

elements[11] = {
    id: 'line triangle',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'false',
    tags: 'line triangle',
    source: `<svg id="line triangle" width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3.5L1 5.23205L1 1.76795L4 3.5ZM4 3.5L6 3.5" stroke="white"/>
    </svg>`,
}

elements[12] = {
    id: 'line triangle fill',
    type: 'head',
    size: 'mini',
    post: 'center',
    fill: 'true',
    tags: 'line triangle, line triangle fill',
    source: `<svg id="line triangle fill" width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3.5L1 5.23205L1 1.76795L4 3.5ZM4 3.5L6 3.5" stroke="white"/>
    </svg>`,
}

//======================CREATE LINE===================

function createLine(f) {
    
    let panel = document.getElementById('pnlBoxLine');
    let txtSizeWidth = document.querySelector('.txtSizeWidth');
    let txtSizeHeight = document.querySelector('.txtSizeHeight');

    //get fill and stroke color
    let strokeColor = panel.querySelector('.txtLineStrokeColor').value;
    let strokeWidth = Number(panel.querySelector('.txtLineStrokeWidth').value);
 
    //create div start line
    let divLineStart = document.createElement('div');
    divLineStart.innerHTML = elements[1].source;
    divLineStart.classList.add('divLineStart');
    cnvLayers[f].appendChild(divLineStart);

    //reposition divLineStart SVG
    divLineStart.style.width = `${strokeWidth*4}px`;
    divLineStart.style.minWidth = `${strokeWidth*4}px`;
    divLineStart.style.left = divLineStart.clientLeft + 2 + 'px';

    let divLineMid = document.createElement('div');
    divLineMid.innerHTML = elements[0].source;
    divLineMid.classList.add('divLineMid');
    cnvLayers[f].appendChild(divLineMid);

    let pathW = Number(divLineMid.children[0].getAttribute('width'));
    let pathH = Number(divLineMid.children[0].getAttribute('height'));
    divLineMid.querySelector('path').setAttribute('d', `M0 ${pathH/2}H${pathW}`)

    let divLineEnd = document.createElement('div');
    divLineEnd.innerHTML = elements[1].source;
    divLineEnd.classList.add('divLineEnd');
    cnvLayers[f].appendChild(divLineEnd);

    //reposition divLineEnd SVG
    divLineEnd.style.width = `${strokeWidth*4}px`;
    divLineEnd.style.minWidth = `${strokeWidth*4}px`;
    divLineEnd.style.left = divLineStart.clientLeft - 2 + 'px';

    let paths = cnvLayers[f].querySelectorAll('path');
    paths.forEach(function(input) {
        input.setAttribute('stroke', '#' + strokeColor);
        input.setAttribute('stroke-width', strokeWidth);
        input.setAttribute('vector-effect', 'non-scaling-stroke');
    })

    cnvLayers[f].style.width = `${Math.round(txtSizeWidth.value * 0.25)}px`;
    cnvLayers[f].style.height =  `${strokeWidth*2}px`;
    cnvLayers[f].style.minHeight =  `${strokeWidth*2}px`;
    //min-width IS organizeLine's, AND IT RUNS A FEW LINES BELOW.

    positionCanvas(cnvLayers[f]);

    organizeLine(f);

    //canvas2Focus(cnvLayers[f])
}

//======================THE LINE'S LENGTH FLOOR - ONE OWNER===================
//⭐ THE RULE, IN SIR'S WORDS (2026-09-05): "the resizing stops when the line mid or line
//middle body is 0 width already. that's it."
//
//SO THE FLOOR IS SIMPLY THE TWO HEADS ADDED UP - THE WIDTH AT WHICH divLineMid HAS
//NOTHING LEFT. NO HEAD-TYPE TEST AT ALL: A MITER HEAD IS display:none SO ITS
//offsetWidth IS ALREADY 0, AND A ROUND HEAD IS REALLY THERE SO IT REALLY COUNTS. THE
//EARLIER VERSION SPECIAL-CASED miter AND round BY NAME, WHICH MEANT THE FLOOR AND THE
//THING IT WAS SUPPOSED TO DESCRIBE COULD DISAGREE.
//
//[!] READ offsetWidth, NOT strokeWidth * 4. THE HEAD DIVS ARE THE TRUTH ABOUT THEIR OWN
//[!] SIZE, AND THIS RUNS AFTER THEY HAVE BEEN WRITTEN. RE-DERIVING THE FORMULA HERE IS
//[!] HOW A SECOND COPY OF IT STARTS DRIFTING FROM THE FIRST.
//
//[!] THE 1px IS NOT A DESIGN CHOICE, IT IS "THE ELEMENT MUST NOT CEASE TO EXIST". TWO
//[!] MITER ENDS SUM TO 0, AND A ZERO-WIDTH LAYER HAS NO ENDS LEFT TO GRAB BACK.
function lineHeadFloor(canvas) {

    let divStart = canvas.querySelector('.divLineStart');
    let divEnd   = canvas.querySelector('.divLineEnd');
    let divMid   = canvas.querySelector('.divLineMid');

    //THE BODY'S OWN min-width COMES FROM lines.css AND IS THE ONLY PLACE THAT NUMBER
    //LIVES. A DEFAULT LINE IS MITER-HEADED - BOTH HEADS display:none, SO THE HEADS
    //CONTRIBUTE 0 AND THIS IS THE WHOLE FLOOR. WITHOUT IT A FRESH LINE HAD NO FLOOR.
    let midMin = divMid == null ? 0 : (parseFloat(getComputedStyle(divMid).minWidth) || 0);

    return divStart.offsetWidth + divEnd.offsetWidth + midMin;
}

function organizeLine(f, startHead, endHead) {

    let canvas = f2Canvas(f);

    let divLineStart = canvas.querySelector('.divLineStart');
    let divLineMid = canvas.querySelector('.divLineMid');
    let divLineEnd = canvas.querySelector('.divLineEnd');

    //EVERY LINE IS DRAWN FROM ITS OWN STATE, NEVER FROM THE PANEL. THE PANEL ONLY EVER SHOWS
    //THE LEAD, SO WITH SEVERAL LINES SELECTED IT STAMPED THE LEAD'S HEADS, COLOUR AND WIDTH
    //ONTO EVERY ONE OF THEM.
    //
    //HEADS ARE THE SAVED ONES UNLESS THE CALLER PASSES THE ONE BEING PICKED RIGHT NOW -
    //chooseLineHead RUNS BEFORE encodeDropdownMulti HAS WRITTEN IT. A SAVED HEAD THAT MATCHES
    //NO ELEMENT (FILES SAVED BEFORE 2026-09-24 CARRY "" FOR THE LEFT ONE) LEAVES THAT END AS IT IS.
    if(startHead == null) startHead = valueFinder(dataLayer[f], 'dropdownLineStart 0');
    if(endHead == null) endHead = valueFinder(dataLayer[f], 'dropdownLineEnd 0');

    //COLOUR IS WHAT THE BODY IS PAINTED WITH - adjustLineStrokeColor WRITES IT STRAIGHT ONTO THE
    //PATHS, ALPHA INCLUDED. WIDTH IS THE HEAD DIV'S, ALWAYS strokeWidth * 4, AND createLine AND
    //adjustLineStrokeWidth BOTH SET IT BEFORE CALLING THIS.
    let strokeColor = divLineMid.querySelector('path').getAttribute('stroke');
    let strokeWidth = parseFloat(divLineStart.style.width) / 4;


    for(let a = 0; a < elements.length; a++) {

        if(elements[a].id == startHead) {

            divLineStart.innerHTML = elements[a].source;
            //start with starthead
            if(startHead == "line miter") {
                
                divLineStart.style.display = "none";

                let pathW = Number(canvas.clientWidth);
                let pathH = Number(canvas.clientHeight);
                
                divLineMid.querySelector('svg').setAttribute('width', pathW);
                divLineMid.querySelector('svg').setAttribute('height', pathH);
                divLineMid.querySelector('svg').setAttribute('viewBox', `0 0 ${pathW} ${pathH}`);
                divLineMid.querySelector('svg').style.width = pathW + 'px';
                divLineMid.querySelector('svg').style.height = pathH + 'px';
                divLineMid.querySelector('svg').style.position = "absolute";
  
                
                divLineMid.querySelector('path').setAttribute('d', `M${0} ${pathH/2}H${pathW}`);
                divLineMid.querySelector('path').setAttribute('stroke', strokeColor);
                divLineMid.querySelector('path').setAttribute('stroke-width', strokeWidth);
                divLineMid.querySelector('path').setAttribute('vector-effect', 'non-scaling-stroke');

                canvas.style.height =  `${Number(strokeWidth)*5}px`;
                canvas.style.minHeight =  `${Number(strokeWidth)*5}px`;
            }
            else if(startHead == "line round") {
                //redraw path 1px smaller from both ends
                divLineStart.style.display = "flex";
                
                let pathW = Number(divLineStart.children[0].getAttribute('width'));
                let pathH = Number(divLineStart.children[0].getAttribute('height'));
                divLineStart.querySelector('path').setAttribute('d', `M${3} ${pathH/2}H${pathW}`)
                divLineStart.querySelector('path').setAttribute('stroke', strokeColor);
                divLineStart.querySelector('path').setAttribute('stroke-width', strokeWidth);
                divLineStart.querySelector('path').setAttribute('vector-effect', 'non-scaling-stroke');

                //[!] CLAMPED AT 0. THE BODY IS ALLOWED TO RUN OUT, AND WHEN IT DOES THIS GOES
                //[!] NEGATIVE - WHICH MAKES AN INVALID SVG width AND AN INVALID viewBox,
                //[!] AND THE BROWSER DRAWS SOMETHING ARBITRARY AT THE LEFT EDGE.
                pathW = Math.max(0, Number(canvas.clientWidth - divLineEnd.clientWidth - divLineStart.clientWidth));
                pathH = Number(canvas.clientHeight);
                
                divLineMid.querySelector('svg').setAttribute('width', pathW);
                divLineMid.querySelector('svg').setAttribute('height', pathH);
                divLineMid.querySelector('svg').style.width = pathW + 'px'
                divLineMid.querySelector('svg').style.height = pathH + 'px'
                divLineMid.querySelector('svg').setAttribute('viewBox', `0 0 ${pathW} ${pathH}`);
                
                divLineMid.querySelector('path').setAttribute('d', `M${0} ${pathH/2}H${pathW}`);
                divLineMid.querySelector('path').setAttribute('stroke', strokeColor);
                divLineMid.querySelector('path').setAttribute('stroke-width', strokeWidth);
                divLineMid.querySelector('path').setAttribute('vector-effect', 'non-scaling-stroke');

                let svgs = canvas.querySelectorAll('svg');
                svgs.forEach(svg => {
                    svg.style.position = "static";
                })

                canvas.style.height =  `${Number(strokeWidth)*5}px`;
                canvas.style.minHeight =  `${Number(strokeWidth)*5}px`;
            }
            else {

                divLineStart.style.display = "flex";
                canvas.style.height =  `${Number(strokeWidth)*5}px`;
                canvas.style.minHeight =  `${Number(strokeWidth)*5}px`;
                
                //all paths for any custom heads
                let paths = divLineStart.querySelectorAll('path');
                paths.forEach(function(input) {
                    input.setAttribute('stroke', strokeColor);
                    input.setAttribute('stroke-width', strokeWidth);
                    input.setAttribute('vector-effect', 'non-scaling-stroke');
                    
                    if(elements[a].fill == 'true') {
                        input.setAttribute('fill', strokeColor);
                    }
                    else if(elements[a].fill == 'false') {
                        input.setAttribute('fill', 'transparent');
                    }
                })
                
                //[!] CLAMPED AT 0. THE BODY IS ALLOWED TO RUN OUT, AND WHEN IT DOES THIS GOES
                //[!] NEGATIVE - WHICH MAKES AN INVALID SVG width AND AN INVALID viewBox,
                //[!] AND THE BROWSER DRAWS SOMETHING ARBITRARY AT THE LEFT EDGE.
                pathW = Math.max(0, Number(canvas.clientWidth - divLineEnd.clientWidth - divLineStart.clientWidth));
                pathH = Number(canvas.clientHeight);
                
                divLineMid.querySelector('svg').setAttribute('width', pathW);
                divLineMid.querySelector('svg').setAttribute('height', pathH);
                divLineMid.querySelector('svg').style.width = pathW + 'px'
                divLineMid.querySelector('svg').style.height = pathH + 'px'
                divLineMid.querySelector('svg').setAttribute('viewBox', `0 0 ${pathW} ${pathH}`);
                
                divLineMid.querySelector('path').setAttribute('d', `M${0} ${pathH/2}H${pathW}`);
                divLineMid.querySelector('path').setAttribute('stroke', strokeColor);
                divLineMid.querySelector('path').setAttribute('stroke-width', strokeWidth);
                divLineMid.querySelector('path').setAttribute('vector-effect', 'non-scaling-stroke');

                let svgs = canvas.querySelectorAll('svg');
                svgs.forEach(svg => {
                    svg.style.position = "static";
                })
            }
        }
        
        if(elements[a].id == endHead) {

            divLineEnd.innerHTML = elements[a].source;
            //start with endhead
            if(endHead == "line miter") {
                divLineEnd.style.display = "none";

                let pathW = Number(canvas.clientWidth);
                let pathH = Number(canvas.clientHeight);
                
                divLineMid.querySelector('svg').setAttribute('width', pathW);
                divLineMid.querySelector('svg').setAttribute('height', pathH);
                divLineMid.querySelector('svg').setAttribute('viewBox', `0 0 ${pathW} ${pathH}`);
                divLineMid.querySelector('svg').style.width = pathW + 'px';
                divLineMid.querySelector('svg').style.height = pathH + 'px';
                divLineMid.querySelector('svg').style.position = "absolute";
                
                divLineMid.querySelector('path').setAttribute('d', `M${0} ${pathH/2}H${pathW}`);
                divLineMid.querySelector('path').setAttribute('stroke', strokeColor);
                divLineMid.querySelector('path').setAttribute('stroke-width', strokeWidth);
                divLineMid.querySelector('path').setAttribute('vector-effect', 'non-scaling-stroke');

                canvas.style.height =  `${Number(strokeWidth)*5}px`;
                canvas.style.minHeight =  `${Number(strokeWidth)*5}px`;
            }
            else if(endHead == "line round") {
                divLineEnd.style.display = "flex";
            
                let pathW = Number(divLineEnd.children[0].getAttribute('width'));
                let pathH = Number(divLineEnd.children[0].getAttribute('height'));
                divLineEnd.querySelector('path').setAttribute('d', `M${3} ${pathH/2}H${pathW}`)
                divLineEnd.querySelector('path').setAttribute('stroke', strokeColor);
                divLineEnd.querySelector('path').setAttribute('stroke-width', strokeWidth);
                divLineEnd.querySelector('path').setAttribute('vector-effect', 'non-scaling-stroke');

                //[!] CLAMPED AT 0. THE BODY IS ALLOWED TO RUN OUT, AND WHEN IT DOES THIS GOES
                //[!] NEGATIVE - WHICH MAKES AN INVALID SVG width AND AN INVALID viewBox,
                //[!] AND THE BROWSER DRAWS SOMETHING ARBITRARY AT THE LEFT EDGE.
                pathW = Math.max(0, Number(canvas.clientWidth - divLineEnd.clientWidth - divLineStart.clientWidth));
                pathH = Number(canvas.clientHeight);
                
                divLineMid.querySelector('svg').setAttribute('width', pathW);
                divLineMid.querySelector('svg').setAttribute('height', pathH);
                divLineMid.querySelector('svg').style.width = pathW + 'px'
                divLineMid.querySelector('svg').style.height = pathH + 'px'
                divLineMid.querySelector('svg').setAttribute('viewBox', `0 0 ${pathW} ${pathH}`);
                
                divLineMid.querySelector('path').setAttribute('d', `M${0} ${pathH/2}H${pathW}`);
                divLineMid.querySelector('path').setAttribute('stroke', strokeColor);
                divLineMid.querySelector('path').setAttribute('stroke-width', strokeWidth);
                divLineMid.querySelector('path').setAttribute('vector-effect', 'non-scaling-stroke');

                let svgs = canvas.querySelectorAll('svg');
                svgs.forEach(svg => {
                    svg.style.position = "static";
                })

                canvas.style.height =  `${Number(strokeWidth)*5}px`;
                canvas.style.minHeight =  `${Number(strokeWidth)*5}px`;
            }
            else {

                divLineEnd.style.display = "flex";
                canvas.style.height =  `${Number(strokeWidth)*5}px`;
                canvas.style.minHeight =  `${Number(strokeWidth)*5}px`;

                let paths = divLineEnd.querySelectorAll('path');
                paths.forEach(function(input) {
                    input.setAttribute('stroke', strokeColor);
                    input.setAttribute('stroke-width', strokeWidth);
                    input.setAttribute('vector-effect', 'non-scaling-stroke');
                    
                    if(elements[a].fill == 'true') {
                        input.setAttribute('fill', strokeColor);
                    }
                    else if(elements[a].fill == 'false') {
                        input.setAttribute('fill', 'transparent');
                    }
                })

                //[!] CLAMPED AT 0. THE BODY IS ALLOWED TO RUN OUT, AND WHEN IT DOES THIS GOES
                //[!] NEGATIVE - WHICH MAKES AN INVALID SVG width AND AN INVALID viewBox,
                //[!] AND THE BROWSER DRAWS SOMETHING ARBITRARY AT THE LEFT EDGE.
                pathW = Math.max(0, Number(canvas.clientWidth - divLineEnd.clientWidth - divLineStart.clientWidth));
                pathH = Number(canvas.clientHeight);
                
                divLineMid.querySelector('svg').setAttribute('width', pathW);
                divLineMid.querySelector('svg').setAttribute('height', pathH);
                divLineMid.querySelector('svg').style.width = pathW + 'px'
                divLineMid.querySelector('svg').style.height = pathH + 'px'
                divLineMid.querySelector('svg').setAttribute('viewBox', `0 0 ${pathW} ${pathH}`);
                
                divLineMid.querySelector('path').setAttribute('d', `M${0} ${pathH/2}H${pathW}`);
                divLineMid.querySelector('path').setAttribute('stroke', strokeColor);
                divLineMid.querySelector('path').setAttribute('stroke-width', strokeWidth);
                divLineMid.querySelector('path').setAttribute('vector-effect', 'non-scaling-stroke');

                let svgs = canvas.querySelectorAll('svg');
                svgs.forEach(svg => {
                    svg.style.position = "static";
                })

            }

        }
    }

    //THE HEADS HAVE THEIR FINAL SIZE AND display BY NOW, SO THIS IS THE ONE CORRECT
    //MOMENT TO DERIVE THE FLOOR. organizeLine RUNS ON EVERY RENDER, WHICH IS WHY IT IS
    //THE OWNER RATHER THAN THE TWO CALLERS THAT USED TO SET IT.
    canvas.style.minWidth = lineHeadFloor(canvas) + 'px';

    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtWidthLayer', `${canvas.clientWidth}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtHeightLayer', `${canvas.clientHeight}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtXLayer', `${canvas.offsetLeft}`);
    dataLayer[f] = valueSwitcher(dataLayer[f], 'txtYLayer', `${canvas.offsetTop}`);
    
}

function renderLine(f) {
    
    let panel = document.getElementById('pnlBoxLine');
    let startHead = panel.querySelector('.dropdownLineStart').querySelector('svg').id;
    let endHead = panel.querySelector('.dropdownLineEnd').querySelector('svg').id;

    for(let a = 0; a < elements.length; a++) {
        if(elements[a].id == startHead) {
            organizeLine(f)
        }
        if(elements[a].id == endHead) {
            organizeLine(f)
        }
    }   
}

function createPnlBoxLine() {

    let f = maxF; //get the length of pnlBoxPatterns and use it as layer count
    maxF++;
    let name = autoIncrementHeader("Element");
    let configScroll = document.getElementsByClassName('configScroll');

    let getSVG = document.createElement('div');
    getSVG.innerHTML = elements[0].source;
    getSVG = getSVG.firstChild;
    getSVG.style.filter = "none";

    let newLine = 
    `<div class="pnlBoxLayer" data-thumbno="${0}" data-type="line" data-ref="${f}">
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

    configScroll[5].insertAdjacentHTML('afterbegin', newLine);

    //[!] IMPORTANT!! ADD THIS FUNCTION SINCE IT CAN'T BE DELEGATED 
    //DELEGATION CANNOT ADDEVENT AND REMOVEEVENT SINCE IT'S ADDED ON DOCUMENT LEVEL
    //NEVER REMOVE THIS AGAIN
    configScroll[5].querySelector('.btnLockUnlock').addEventListener('click', encodeLockUnlock);
    configScroll[5].querySelector('.btnShowHide').addEventListener('click', encodeShowHide);

    addPnlBoxLine(f, name);
}

function addPnlBoxLine(f, name) {

    dataLayer[f] = '\n*';
    dataLayer[f] += `\nref: ${f}`;
    dataLayer[f] += `\npnlBoxLine: ${name}`;
    dataLayer[f] += `\nthumbno: ${0}`;
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

    dataLayer[f] += `\ntxtLineStrokeColor: rgba(100, 116, 153, 1)`;
    dataLayer[f] += `\ntxtLineStrokeWidth: 10`;
    dataLayer[f] += `\ntxtLineStrokeDash: 0`;
    dataLayer[f] += `\ntxtLineStrokeGap: 0`;
    dataLayer[f] += `\nchkLineStrokeCap: false`;

    dataLayer[f] += `\ntxtGlowColor: rgba(148, 158, 255, 1)`;
    dataLayer[f] += `\ntxtGlowSpread: 100`;

    dataLayer[f] += `\ntxtShadowColor: rgba(0, 0, 0, 1)`;
    dataLayer[f] += `\ntxtShadowSize: 20`;
    dataLayer[f] += `\ntxtShadowSpread: 0`;
    dataLayer[f] += `\ntxtShadowRotation: 0`;

    dataLayer[f] += `\ndropdown 0: Normal`;
    dataLayer[f] += `\ndropdownLineStart 0: line miter`;
    dataLayer[f] += `\ndropdownLineEnd 0: line miter`;
    dataLayer[f] += `\ndropdown 1: Remove`;

    //after all assigned controls then create the actual pattern layer
    createCanvasLine(f, name)
}

function createCanvasLine(f, name) {     

    cnvLayers[f] = document.createElement('div');
    cnvLayers[f].classList.add('cnvLayers');
    cnvLayers[f].dataset.rotation = 0;
    cnvLayers[f].dataset.ref = f;
    cnvLayers[f].dataset.thumbno = 0;
    cnvLayers[f].dataset.type = "line";
    cnvLayers[f].style.minWidth = 20 + 'px';
    cnvLayers[f].style.minHeight = 20 + 'px';
    cnvLayers[f].style.overflow = "visible";
    cnvLayers[f].style.display = "flex";
    cnvLayers[f].style.visibility = "visible";
    cnvLayers[f].dataset.lock = "unlock";
    cnvLayers[f].dataset.mask = "unmask";

    // append cnvlayer to cnvmain
    cnvGrpLayers.appendChild(cnvLayers[f]);

    createLine(f);

    //add border
    addBorderLayer(cnvLayers[f], f)
    
    createHistory(f, name, 'line', 0);

    canvas2Focus(cnvLayers[f]);
}

//PAINTS ONE HEAD OPTION INTO ITS PANEL DROPDOWN. SHARED BY THE CLICK, decodeData3 AND UNDO/REDO,
//SO THE PANEL LOOKS THE SAME WHICHEVER OF THEM SET IT. IT TOUCHES NO CANVAS.
function paintLineHead(opt) {

    let getSVG = opt.children[0].outerHTML;

    opt.closest('.pnlDropSide').children[0].children[0].innerHTML = getSVG;
    opt.closest('.pnlDropSide').querySelector('svg').style.width = "60%";
    opt.closest('.pnlDropSide').querySelector('svg').style.height = "auto";

    //if dropdown is for line start
    if(opt.closest('.pnlDropSide').children[0].className == 'dropdownLineStart') {
        
        opt.closest('.pnlDropSide').querySelector('svg').style.transform = "translateX(9px)";
    }
    //if dropdown is for line end
    else {
        opt.closest('.pnlDropSide').querySelector('svg').style.transform = "translateX(9px)";
    }
}

function chooseLineHead() {

    let isStart = this.parentElement.className == 'dropOptionLineStart';
    let head = this.children[0].id;

    paintLineHead(this);
    
    //EVERY SELECTED LINE TAKES THE NEW HEAD ON THIS END AND KEEPS ITS OWN ON THE OTHER END.
    //IT USED TO REDRAW THE LEAD ONLY, SO A MULTI-SELECT HEAD CHANGE REACHED ONE LINE.
    //
    //ORDER MATTERS HERE. organizeLine() IS WHAT RECOMPUTES THE LAYER'S min-width FROM THE
    //NEW HEAD SIZES (lineHeadFloor), AND adjustBorder() IS WHAT COPIES THAT MINIMUM ONTO
    //THE PIN AS min-width x THE ZOOM. COPYING BEFORE COMPUTING LEAVES THE PIN ONE HEAD
    //CHANGE BEHIND, PERMANENTLY. MEASURED 2026-09-06 WITH BOTH ARROW HEADS AT STROKE 10:
    //LAYER min-width 84px, PIN min-width 22px - THE FLOOR FROM THE PREVIOUS HEAD PAIR.
    //MOVEABLE READS THE PIN'S min-width WHEN A GESTURE STARTS AND CLAMPS ITSELF TO IT, SO
    //A PIN FLOOR THAT DISAGREES WITH THE LAYER'S IS WHAT MAKES A RESIZE FIGHT ITSELF.
    //COMPUTE THE FLOOR FIRST, THEN COPY IT.
    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null && focusPanel[a].dataset.type == "line") {

            let f = Number(focusPanel[a].dataset.ref);

            if(isStart) organizeLine(f, head, null);
            else organizeLine(f, null, head);
        }
    }
    adjustBorder();
    
}
document.querySelectorAll('.optLineHead')
.forEach((opt) => {
    opt.addEventListener('pointerdown', chooseLineHead);
})

//UNDO AND REDO SET ONE LAYER'S HEAD THROUGH HERE INSTEAD OF DISPATCHING A CLICK. panel2Focus
//KEEPS THE EARLIER BLOCKS OF THE SAME ENTRY FOCUSED, SO A CLICK WOULD RUN chooseLineHead ON ALL
//OF THEM AND STAMP THIS LAYER'S OLD HEAD ONTO LINES THAT HAD A DIFFERENT ONE.
function setLineHead(f, key, head) {

    let isStart = key.includes('Start');
    let panel = document.getElementById('pnlBoxLine');
    let opts = panel.querySelectorAll(isStart ? '.dropOptionLineStart .optLineHead' : '.dropOptionLineEnd .optLineHead');
    let opt = [...opts].find(o => o.children[0].id == head);

    if(opt == null) return;

    paintLineHead(opt);

    if(isStart) organizeLine(f, head, null);
    else organizeLine(f, null, head);
}

//ADD STROKE EVENTS----------------------------------------
function adjustLineStrokeColor() {

    let thumbPicker = this.nextElementSibling;
    
    let alpha = this.dataset.alpha;
    let rgb = hex2RGBStringEncoding(testHexCode(this));

    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
    
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            
            if(type == "line") {
                //canvas.querySelectorAll('g')[1].children[0].setAttribute('stroke', `rgba(${rgb}, ${alpha})`);  
                let paths = canvas.querySelectorAll('path');
                for(let b = 0; b < paths.length; b++) {
                    paths[b].setAttribute('stroke', `rgba(${rgb}, ${alpha})`);
                    paths[b].setAttribute('fill', `rgba(${rgb}, ${alpha})`);
                }
            
            }
        }
    }
    
}
document.getElementById('pnlBoxLine').querySelector('.txtLineStrokeColor').addEventListener('change', adjustLineStrokeColor);

function adjustLineStrokeWidth() {
 
    let panel = document.getElementById('pnlBoxLine');
    let me = panel.querySelector('.txtLineStrokeWidth');
    let startHead = panel.querySelector('.dropdownLineStart').querySelector('svg').id;
    let endHead = panel.querySelector('.dropdownLineEnd').querySelector('svg').id;

    panel.querySelector('.txtLineStrokeWidth').value = me.value;
    
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "line") {

                let divStart = canvas.querySelector('.divLineStart');
                let divEnd = canvas.querySelector('.divLineEnd');

                let canvasL = canvas.offsetLeft;
                let canvasT = canvas.offsetTop;
                let canvasW = canvas.clientWidth;
                let canvasH = canvas.clientHeight;

                let baseW = canvasW - (divStart.clientWidth + divEnd.clientWidth);

                //THE BODY LENGTH IS PRESERVED AND THE TWO NEW HEADS ARE ADDED BACK ON
                //TOP, SO A LINE ALREADY SQUEEZED TO ITS FLOOR GROWS EXACTLY AS MUCH AS
                //ITS HEADS DO. VERIFIED 2026-09-05 - THIS PART WAS ALREADY CORRECT.
                //min-width IS NOT SET HERE ANY MORE: THE HEAD DIVS ARE STILL THE OLD
                //SIZE AT THIS POINT, SO ANY FLOOR DERIVED NOW WOULD BE A FRAME STALE.
                //organizeLine() BELOW OWNS IT AND RUNS AFTER THE HEADS ARE RESIZED.
                if(startHead != "line miter" || endHead != "line miter") {
                    canvas.style.width = baseW + me.value * 8 + 'px';
                }

                divStart.style.width = me.value * 4 + 'px';
                divStart.style.minWidth = me.value * 4 + 'px';

                divEnd.style.width = me.value * 4 + 'px';
                divEnd.style.minWidth = me.value * 4 + 'px';

                organizeLine(f);

                if(!isResizing && !isScaling && !isSelecting && !isDragging && !isRotating) {
    
                    canvas.style.left = (canvasL + (canvasW - canvas.clientWidth) / 2) + 'px';
                    canvas.style.top = (canvasT + (canvasH - canvas.clientHeight) / 2) + 'px';
                }
            }
        }
    }

    adjustBorder()
            
}
document.getElementById('pnlBoxLine').querySelector('.txtLineStrokeWidth').addEventListener('change', adjustLineStrokeWidth);
document.getElementById('pnlBoxLine').querySelector('.txtLineStrokeWidth').previousElementSibling.addEventListener('input', adjustLineStrokeWidth);

function adjustLineStrokeDash() {

    let panel = document.getElementById('pnlBoxLine');

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "line") {
                canvas.querySelector('.divLineMid').querySelector('path').setAttribute('stroke-dasharray', `${panel.querySelector('.txtLineStrokeDash').value} ${panel.querySelector('.txtLineStrokeGap').value}`);
    
                if(this.className == "txtLineStrokeDash") {
                    panel.querySelector('.txtLineStrokeDash').value = this.value;
                }
                else if(this.className == "txtLineStrokeGap") {
                    panel.querySelector('.txtLineStrokeGap').value = this.value;
                }
                
                
            }
        }
    }

    adjustBorder();
}
document.getElementById('pnlBoxLine').querySelector('.txtLineStrokeDash').addEventListener('change', adjustLineStrokeDash);
document.getElementById('pnlBoxLine').querySelector('.txtLineStrokeDash').previousElementSibling.addEventListener('input', adjustLineStrokeDash);

document.getElementById('pnlBoxLine').querySelector('.txtLineStrokeGap').addEventListener('change', adjustLineStrokeDash);
document.getElementById('pnlBoxLine').querySelector('.txtLineStrokeGap').previousElementSibling.addEventListener('input', adjustLineStrokeDash);

function adjustLineStrokeCap() {

    let panel = document.getElementById('pnlBoxLine');

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "line") {

                if(this.dataset.value == "true") {

                    canvas.querySelector('.divLineMid').querySelector('path').setAttribute('stroke-linecap', "round");
                    canvas.querySelector('.divLineMid').querySelector('path').setAttribute('stroke-dasharray', `${panel.querySelector('.txtLineStrokeDash').value} ${panel.querySelector('.txtLineStrokeGap').value}`);
                
                }
            
                else if(this.dataset.value == "false") { 
            
                    canvas.querySelector('.divLineMid').querySelector('path').setAttribute('stroke-linecap', "butt");
                    canvas.querySelector('.divLineMid').querySelector('path').setAttribute('stroke-dasharray', `${panel.querySelector('.txtLineStrokeDash').value} ${panel.querySelector('.txtLineStrokeGap').value}`);
                
                }  

            }
        }
    }
  
}
document.getElementById('pnlBoxLine').querySelector('.chkLineStrokeCap').addEventListener('click', adjustLineStrokeCap);

//===================================GLOW==================================

document.getElementById('pnlBoxLine').querySelector('.txtGlowColor').addEventListener('change', adjustStyleGlowColor);
document.getElementById('pnlBoxLine').querySelector('.txtGlowSpread').addEventListener('change', adjustStyleGlowColor);
document.getElementById('pnlBoxLine').querySelector('.txtGlowSpread').previousElementSibling.addEventListener('input', adjustStyleGlowColor);

//===================================SHADOW==================================

document.getElementById('pnlBoxLine').querySelector('.txtShadowColor').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxLine').querySelector('.txtShadowSize').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxLine').querySelector('.txtShadowSize').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

document.getElementById('pnlBoxLine').querySelector('.txtShadowSpread').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxLine').querySelector('.txtShadowSpread').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

document.getElementById('pnlBoxLine').querySelector('.txtShadowRotation').addEventListener('change', adjustStyleShadowColor);
document.getElementById('pnlBoxLine').querySelector('.txtShadowRotation').previousElementSibling.addEventListener('input', adjustStyleShadowColor);

//===================================LAYER STYLE==============================

//assign dropOptionVerti selection for blend mode
for(let b = 0; b < document.getElementById('pnlBoxLine').querySelectorAll('.optLayerStyleElement').length; b++) {
    
    if(b == 2) {
        document.getElementById('pnlBoxLine').querySelectorAll('.optLayerStyleElement')[b].style.color = "salmon";
        document.getElementById('pnlBoxLine').querySelectorAll('.optLayerStyleElement')[b].addEventListener('mouseover', hoverLayerStyle)
        document.getElementById('pnlBoxLine').querySelectorAll('.optLayerStyleElement')[b].addEventListener('mouseout', outLayerStyle)
    }
}

//================================BOTTOM BUTTONS=============================

document.querySelector('#pnlBoxLine').querySelector('.btnBasicBox').addEventListener('click', btnBottomClick); //default the btnBasic to white
document.querySelector('#pnlBoxLine').querySelector('.btnBasicBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxLine').querySelector('.btnBasicBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxLine').querySelector('.btnBasicBox').addEventListener('click', showBasicBoxElement);
document.querySelector('#pnlBoxLine').querySelector('.btnBasicBox').children[0].style.filter = "saturate(0) brightness(2)";
document.querySelector('#pnlBoxLine').querySelector('.btnBasicBox').children[0].style.transition = ".2s";

document.querySelector('#pnlBoxLine').querySelector('.btnColorBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxLine').querySelector('.btnColorBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxLine').querySelector('.btnColorBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxLine').querySelector('.btnColorBox').addEventListener('click', showColorBoxElement);
document.querySelector('#pnlBoxLine').querySelector('.btnColorBox').children[0].style.transition = ".2s";

document.querySelector('#pnlBoxLine').querySelector('.btnStyleBox').addEventListener('click', btnBottomClick); //default the btnColor to white
document.querySelector('#pnlBoxLine').querySelector('.btnStyleBox').addEventListener('mouseover', btnBottomHover);
document.querySelector('#pnlBoxLine').querySelector('.btnStyleBox').addEventListener('mouseleave', btnBottomLeave);
document.querySelector('#pnlBoxLine').querySelector('.btnStyleBox').addEventListener('click', showStyleBoxElement);
document.querySelector('#pnlBoxLine').querySelector('.btnStyleBox').children[0].style.transition = ".2s";


