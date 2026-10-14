
let isScaling = false;
let isResizing = false;
let isRotating = false;
let isDragging = false;
let isSelecting = false;
let isSelecting2 = false;

let aRatio = [];

let leadDrag;
let leadDragX;
let leadDragY;
let leadDragR;
let leadDragW;
let leadDragH;

let clientX;
let clientY;

let layerSequence = "";
let breaklineDrag;

let cnvPinRect = document.getElementById('cnvPin').getBoundingClientRect();


//===============================ADD LAYER BORDER======================

//========================PIN GEOMETRY - ONE OWNER========================
//A PIN IS THE LAYER'S BOX EXPRESSED IN SCREEN PIXELS. SIZE AND FLOOR ARE BOTH WRITTEN
//HERE AND ONLY HERE SO THE TWO CANNOT DRIFT APART.
//
//[!] THE FLOOR IS THE LAYER'S OWN DECLARED min-width/min-height x THE ZOOM. NEVER A
//[!] CONSTANT. THE LAYER'S MINIMUM IS IN LAYOUT PIXELS AND THE PIN IS DRAWN IN SCREEN
//[!] PIXELS, SO A FIXED NUMBER ON THE PIN SIDE AGREES WITH THE LAYER AT EXACTLY ONE
//[!] ZOOM LEVEL. THE OLD CSS 10px AGAINST THE LAYERS' 20px WAS EXACT AT 50% - THE
//[!] DEFAULT - WHICH IS WHY IT LOOKED RIGHT AND WAS NOT. AND LEAVING THE PIN WITH NO
//[!] FLOOR AT ALL IS THE SAME BUG MIRRORED: MOVEABLE THEN DRAGS THE PIN TOWARDS ZERO
//[!] WHILE THE LAYER STOPS AT ITS OWN MINIMUM. SCALE IT, DO NOT DROP IT.
//A LINE'S PIN IS ITS CENTRELINE, NOT ITS BOX - SEE sizePinToCanvas BELOW. ONE PIXEL,
//BECAUSE THE CONTROL BOX MOVEABLE DRAWS AROUND IT IS THE HANDLE PAIR THE USER SEES.
const SPINE_PX = 1;

//sir, 2026-09-27: "make 20px on screen but min in design and in datalayer and in pnlbox input
//values". A LAYER MAY BE 1x1 NOW, AND A PIN THAT SMALL IS A BOX NOBODY CAN GRAB WITH ALL EIGHT
//HANDLES STACKED ON ONE PIXEL. SO THE PIN NEVER DRAWS BELOW PIN_MIN_PX SCREEN PIXELS. THE EXTRA
//IS PADDING SPLIT EVENLY ROUND THE LAYER, SO THE PIN'S CENTRE IS STILL THE LAYER'S CENTRE AND
//THE CENTRE-BASED MATH IN adjustCanvas2Pin, THE ROTATION PIVOT AND THE GROUP BOX STAY EXACT.
//THE LAYER, dataLayer AND THE PANEL FIELDS NEVER SEE THIS NUMBER
const PIN_MIN_PX = 20;

//THE PADDING EACH PIN HAD WHEN ITS RESIZE STARTED. THE LAYER THEN MOVES BY THE SAME SCREEN
//DELTA AS THE PIN, SO A 1px LAYER GROWS FROM 1px INSTEAD OF JUMPING TO THE PIN'S 20
let pinPad = {};

//A LINE'S PIN HEIGHT IS ITS SPINE BY DESIGN, SO ONLY ITS LENGTH IS PADDED
//s IS canvasScale(), THE SCALE THE CANVAS IS REALLY DRAWN AT, x FOR WIDTHS AND y FOR HEIGHTS
function pinPadding(canvas, s) {

    return {
        w: Math.max(0, PIN_MIN_PX - canvas.offsetWidth * s.x),
        h: canvas.dataset.type == "line" ? 0 : Math.max(0, PIN_MIN_PX - canvas.offsetHeight * s.y)
    };
}

function sizePinToCanvas(pin, canvas, s) {

    let cs = getComputedStyle(canvas);

    //parseFloat GIVES NaN FOR 'auto' AND FOR AN EMPTY VALUE - BOTH MEAN NO FLOOR.
    let minW = parseFloat(cs.minWidth)  || 0;
    let minH = parseFloat(cs.minHeight) || 0;

    let pad = pinPadding(canvas, s);

    pin.style.minWidth = (minW * s.x) + 'px';
    pin.style.width    = (canvas.offsetWidth * s.x + pad.w) + 'px';

    //⭐ THE ONE DELIBERATE EXCEPTION TO "THE PIN IS THE LAYER'S BOX". A LINE IS SELECTED
    //BY ITS SPINE: A HAIRLINE RUNNING END TO END WITH A HANDLE AT EACH END, THE WAY EVERY
    //OTHER EDITOR DOES IT. TYING THE PIN TO THE STROKE'S BOX IS WHAT MADE A HORIZONTAL
    //DRAG COLLIDE WITH A VERTICAL FLOOR - THE HEIGHT IS NOW SIMPLY NOT PART OF THE
    //CONVERSATION. THICKNESS BELONGS TO THE STROKE-WIDTH FIELD ALONE.
    //
    //[!] THE PIN IS NO LONGER THE LAYER'S HEIGHT, SO NOTHING MAY WRITE pin HEIGHT BACK
    //[!] INTO A LINE. adjustCanvas2Pin's resize BRANCH IS THE PATH THAT WOULD, AND IT
    //[!] CARRIES ITS OWN line GUARD. IF A LINE EVER GOES FLAT, LOOK THERE FIRST.
    if(canvas.dataset.type == "line") {

        pin.style.minHeight = SPINE_PX + 'px';
        pin.style.height    = SPINE_PX + 'px';

        //THE SPINE SITS ON THE STROKE'S CENTRE, SO THE CALLER HAS TO PUSH IT DOWN BY HALF
        //THE DIFFERENCE. RETURNED RATHER THAN WRITTEN HERE BECAUSE top IS ASSEMBLED FROM
        //THE cnvBox / cnvMain UNIT SPLIT, WHICH IS THE CALLER'S BUSINESS. dx PULLS A PADDED
        //SPINE BACK BY HALF ITS PADDING SO IT STAYS CENTRED ON THE LINE
        return {dx: -pad.w / 2, dy: (canvas.offsetHeight * s.y - SPINE_PX) / 2};
    }

    pin.style.minHeight = (minH * s.y) + 'px';
    pin.style.height    = (canvas.offsetHeight * s.y + pad.h) + 'px';

    //0 AND 0 UNLESS THE LAYER IS SMALLER THAN PIN_MIN_PX ON SCREEN
    return {dx: -pad.w / 2, dy: -pad.h / 2};
}

function adjustBorder() {

    //THE SCALE THE CANVAS IS REALLY DRAWN AT, NOT THE SLIDER - SEE canvasScale
    let s = canvasScale();
    let cnvPin = document.getElementById('cnvPin');
    let cnvMain = document.getElementById('cnvMain');
    let cnvBox = document.getElementById('cnvBox');
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

    //MOVEABLE OWNS THE PIN FOR THE LENGTH OF A GESTURE. THIS FUNCTION IS THE CANVAS TO PIN
    //DIRECTION AND adjustCanvas2Pin IS THE PIN TO CANVAS ONE - RUNNING THIS FROM INSIDE THAT
    //PUTS THREE WRITERS ON ONE FRAME, AND updateMoveableRect BELOW REBUILDS MOVEABLE'S
    //GESTURE ORIGIN SO EVERY LATER FRAME IS MEASURED FROM AN ORIGIN THAT MOVED UNDER IT.
    //THE GESTURE END RECONCILES ONCE INSTEAD
    if(cnvPin.classList.contains('isGesturing')) return;

    for(let f = 0; f < maxF; f++) {
        
        let pin = cnvPin.querySelector(`[data-ref='${f}']`);

        if(pin != null) {

            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
           
            //dy DROPS A LINE'S SPINE ONTO THE STROKE'S CENTRE. dx AND dy ALSO CENTRE A PIN THAT
            //IS PADDED UP TO PIN_MIN_PX - BOTH 0 FOR ANY LAYER BIGGER THAN THAT ON SCREEN
            let off = sizePinToCanvas(pin, canvas, s);

            //offsetLeft AND offsetTop, NOT style.left. A LAYER AT 137.5px PAINTS AT 138 (MEASURED IN CHROMIUM, 2026-10-04)
            pin.style.left = (cnvBox.offsetLeft + (cnvMain.offsetLeft + canvas.offsetLeft) * s.x + off.dx)  + 'px';
            pin.style.top = (cnvBox.offsetTop + (cnvMain.offsetTop + canvas.offsetTop) * s.y + off.dy)  + 'px';
    
            pin.style.transform = 'rotate(' + Number(canvas.dataset.rotation) + 'deg)';
            pin.dataset.rotation = canvas.dataset.rotation;
        }
    }
   
    updateMoveableRect();
    
}

function adjustCanvas(canvas) {

    let f = canvas.dataset.ref;
    
    //ADD SPECIFICS FROM CANVAS TYPE
    if(canvas.dataset.type == "element") {
        renderSVG(f);
    }
    else if(canvas.dataset.type == "line") {
        renderLine(f);
    }
    else if(canvas.dataset.type == "3DMockup") {
        engine[f].resize();

        //[!] A RESIZE REBUILDS THE BACKING STORE AND LEAVES IT EMPTY - WITHOUT THE
        //RENDER LOOP NOTHING WOULD REDRAW IT
        renderScene(f);
    }
    else if(canvas.dataset.type == "text") {

        //THE FixedSize SWITCH USED TO LIVE HERE AND RAN ON EVERY FRAME OF A RESIZE. IT IS A
        //ONCE PER GESTURE DECISION, SO IT MOVED TO resizeStart AND setTextFixedSize OWNS IT.
        //THIS IS A REDRAW HELPER AND undoProperties CALLS IT TOO - SETTING THE MODE HERE MADE
        //AN UNDO OF A WIDTH CHANGE SILENTLY FLIP THE LAYER OUT OF AutoWidth
        inputFormatResizeBox(f);

    }
}

//========================CREATE BOUNDING BOX FOR LAYERS===================
function addBorderLayer(canvas, f) {

    let s = canvasScale();

    aRatio[f] = canvas.clientWidth / canvas.clientHeight;

    //create pinBody
    pinBody[f] = document.createElement('div');
    pinBody[f].dataset.ref = f;
    pinBody[f].dataset.type = canvas.dataset.type;
    pinBody[f].dataset.lock = canvas.dataset.lock;
    pinBody[f].dataset.rotation = canvas.dataset.rotation;

    //[!] APPLY THE ANGLE, NOT JUST RECORD IT
    //THE DATASET ALONE RENDERS NOTHING - A PIN CREATED FOR A LAYER THAT IS ALREADY ROTATED
    //WOULD SIT FLAT UNTIL SOMETHING ELSE HAPPENED TO CALL ADJUSTBORDER
    //TRANSFORM, NOT STYLE.ROTATE - IT HAS TO BE THE PROPERTY MOVEABLE READS ITS MATRIX FROM
    pinBody[f].style.transform = 'rotate(' + Number(pinBody[f].dataset.rotation) + 'deg)';

    pinBody[f].classList.add('pinBody');
    cnvPin.appendChild(pinBody[f]);

    //SIZED THROUGH THE ONE OWNER, EXACTLY LIKE EVERY LATER UPDATE. IT USED TO BE SET
    //INLINE HERE FROM clientWidth WHILE adjustBorder() USED offsetWidth - two formulas
    //FOR ONE NUMBER, WHICH IS HOW THEY DRIFT.
    sizePinToCanvas(pinBody[f], canvas, s);

    adjustBorder();
}

function adjustBasicsFromCanvas(canvas, pin) {

    //THE SAME SCALE adjustBorder PLACED THE PIN WITH, SO X AND Y READ BACK EXACTLY
    let s = canvasScale();
    let type = canvas.dataset.type.replace(canvas.dataset.type.charAt(0), canvas.dataset.type.charAt(0).toUpperCase());
    let newPanel = document.getElementById(`pnlBox${type}`);

    //THE PIN'S OWN BOX WITHOUT ITS PIN_MIN_PX PADDING. THE PADDING IS EVEN ROUND THE CENTRE, SO
    //THE CENTRE IS READ FROM THE RECT AS BEFORE AND THE HALF EXTENTS ARE REBUILT FROM THE PIN'S
    //UNPADDED SIZE AT ITS ANGLE - FOR AN UNPADDED PIN THIS IS EXACTLY THE RECT'S left AND top
    let pinCanvas = cnvGrpLayers.querySelector(`[data-ref="${pin.dataset.ref}"]`) || canvas;
    let pr = pin.getBoundingClientRect();
    let mr = cnvMain.getBoundingClientRect();
    let t = (Number(pin.dataset.rotation) || 0) * Math.PI / 180;
    let pw = pinCanvas.offsetWidth * s.x;
    let ph = pinCanvas.dataset.type == "line" ? SPINE_PX : pinCanvas.offsetHeight * s.y;
    let hw = (pw * Math.abs(Math.cos(t)) + ph * Math.abs(Math.sin(t))) / 2;
    let hh = (pw * Math.abs(Math.sin(t)) + ph * Math.abs(Math.cos(t))) / 2;

    let newLeft = Math.round((pr.left + pr.width / 2 - hw - mr.left) / s.x);
    let newTop = Math.round((pr.top + pr.height / 2 - hh - mr.top) / s.y);

    //[!] READ THE LAYER, NOT THE PIN. clientWidth/clientHeight ARE ROUNDED TO WHOLE
    //[!] SCREEN PIXELS, SO DIVIDING THEM BY z TURNED A 5px LINE INTO 10 AT 10% ZOOM,
    //[!] 4 AT 25% AND 6 AT 50% - THE SAME LAYER REPORTING A DIFFERENT HEIGHT PURELY
    //[!] BECAUSE OF THE VIEW. THE FIELD WRITES canvas.style.width, SO IT MUST READ
    //[!] canvas.offsetWidth: EXACT, ZOOM-INDEPENDENT, AND ROTATION-SAFE (A ROTATED
    //[!] PIN'S BOUNDING RECT IS ITS AABB, WHICH IS WHY THE PIN CANNOT BE USED HERE).
    newPanel.querySelector('.txtWidthLayer').value = Math.round(canvas.offsetWidth);
    newPanel.querySelector('.txtHeightLayer').value = Math.round(canvas.offsetHeight);

    newPanel.querySelector('.txtXLayer').value = newLeft;
    newPanel.querySelector('.txtYLayer').value = newTop;

    newPanel.querySelector('.txtRotationLayer').value = Math.round(pin.dataset.rotation);

    newPanel.querySelector('.txtRotationLayer').previousElementSibling.value = newPanel.querySelector('.txtRotationLayer').value;
    
}

//=======================ALL BASIC PANEL FUNCTIONS======================

//function to hide and show cnvLayers

function showMaskUnmask() {

    let panel = this.closest('[class*="pnlBox"]')
    let f = panel.dataset.ref;
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);

    if(this.dataset.mask == "unmask") {

        let svgIcon = 
        `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C5.41426 12 4.84864 11.9143 4.31348 11.7578C4.29398 11.7521 4.2743 11.7471 4.25488 11.7412C4.19803 11.724 4.14206 11.7044 4.08594 11.6855C4.05635 11.6756 4.02645 11.6667 3.99707 11.6562C3.95118 11.64 3.90573 11.6228 3.86035 11.6055C3.81523 11.5882 3.77018 11.571 3.72559 11.5527C3.68722 11.537 3.64929 11.5204 3.61133 11.5039C3.56477 11.4837 3.51859 11.4628 3.47266 11.4414C3.43803 11.4253 3.4034 11.4093 3.36914 11.3926C3.31427 11.3658 3.25997 11.338 3.20605 11.3096C3.05192 11.2283 2.90169 11.1408 2.75586 11.0469C2.73171 11.0313 2.7075 11.0159 2.68359 11C2.65101 10.9783 2.61904 10.9559 2.58691 10.9336C2.53833 10.8999 2.48991 10.8661 2.44238 10.8311C2.41675 10.8121 2.39153 10.7927 2.36621 10.7734C2.32637 10.7431 2.2871 10.712 2.24805 10.6807C2.21393 10.6533 2.17998 10.6258 2.14648 10.5977C2.11058 10.5675 2.07522 10.5368 2.04004 10.5059C2.00938 10.4789 1.97834 10.4524 1.94824 10.4248C1.81952 10.3069 1.69614 10.1833 1.57812 10.0547C1.55115 10.0253 1.52542 9.99478 1.49902 9.96484C1.46652 9.92798 1.43395 9.89118 1.40234 9.85352C1.38035 9.8273 1.35847 9.80101 1.33691 9.77441C1.29444 9.72202 1.25263 9.66907 1.21191 9.61523C1.20041 9.60002 1.1891 9.58466 1.17773 9.56934C1.12729 9.50131 1.07786 9.43249 1.03027 9.3623C1.0245 9.35379 1.01843 9.34546 1.0127 9.33691C0.978314 9.28564 0.94591 9.23304 0.913086 9.18066C0.883545 9.13352 0.854427 9.0861 0.826172 9.03809C0.749402 8.90765 0.677296 8.7742 0.610352 8.6377C0.593503 8.60333 0.576754 8.56891 0.560547 8.53418C0.537028 8.48379 0.514336 8.43297 0.492188 8.38184C0.480253 8.35428 0.468563 8.3266 0.457031 8.29883C0.429394 8.23227 0.402238 8.1654 0.376953 8.09766C0.370402 8.0801 0.363813 8.06255 0.357422 8.04492C0.333676 7.97942 0.311546 7.91322 0.290039 7.84668C0.245501 7.70886 0.206511 7.56873 0.171875 7.42676C0.156707 7.36459 0.14212 7.30217 0.128906 7.23926C0.122981 7.21104 0.117832 7.18266 0.112305 7.1543C0.103939 7.11138 0.0943593 7.06863 0.0869141 7.02539L0.0693359 6.91406C0.0664097 6.89492 0.0642683 6.87565 0.0615234 6.85645C0.0533261 6.7991 0.0466026 6.74145 0.0400391 6.68359C0.0356538 6.64494 0.0309908 6.60626 0.0273438 6.56738C0.0220819 6.5113 0.0183554 6.45496 0.0146484 6.39844C0.012049 6.3588 0.00866179 6.31914 0.00683594 6.2793C0.00259355 6.18672 0 6.09362 0 6C0 5.90605 0.00256449 5.81262 0.00683594 5.71973C0.00866817 5.67988 0.0120427 5.64022 0.0146484 5.60059C0.0183639 5.54406 0.0220738 5.48773 0.0273438 5.43164C0.030997 5.39277 0.0356476 5.35409 0.0400391 5.31543C0.0466105 5.25758 0.0533187 5.19992 0.0615234 5.14258C0.0660492 5.11095 0.0701783 5.07932 0.0751953 5.04785C0.0860635 4.97968 0.0991609 4.91211 0.112305 4.84473C0.117837 4.81637 0.122976 4.78798 0.128906 4.75977C0.142126 4.69686 0.156701 4.63443 0.171875 4.57227C0.206532 4.4303 0.245481 4.29015 0.290039 4.15234C0.31155 4.08581 0.333673 4.0196 0.357422 3.9541C0.363815 3.93647 0.3704 3.91892 0.376953 3.90137C0.40224 3.83363 0.429392 3.76675 0.457031 3.7002C0.468566 3.67243 0.480249 3.64474 0.492188 3.61719C0.514336 3.56605 0.537028 3.51523 0.560547 3.46484C0.576758 3.43012 0.593499 3.39569 0.610352 3.36133C0.677294 3.22483 0.749409 3.09137 0.826172 2.96094C0.857096 2.90841 0.888436 2.85618 0.920898 2.80469C0.951057 2.75684 0.981235 2.70903 1.0127 2.66211C1.02572 2.64268 1.03949 2.62376 1.05273 2.60449C1.09335 2.54542 1.13509 2.4872 1.17773 2.42969C1.1891 2.41436 1.20041 2.399 1.21191 2.38379C1.25487 2.32699 1.29885 2.27102 1.34375 2.21582C1.35922 2.19681 1.37493 2.178 1.39062 2.15918C1.43764 2.10281 1.48614 2.04776 1.53516 1.99316C1.54579 1.98132 1.55568 1.96879 1.56641 1.95703C1.7526 1.75292 1.95254 1.56157 2.16504 1.38477C2.18141 1.37115 2.19832 1.35817 2.21484 1.34473C2.34552 1.23833 2.48065 1.13727 2.62012 1.04199C2.63421 1.03237 2.64793 1.0222 2.66211 1.0127C2.71412 0.977807 2.76716 0.944419 2.82031 0.911133C2.85077 0.892059 2.88128 0.873031 2.91211 0.854492C3.0673 0.761144 3.22672 0.674012 3.39062 0.594727C3.39901 0.59067 3.40761 0.587027 3.41602 0.583008C3.4907 0.547314 3.56623 0.513125 3.64258 0.480469C3.65786 0.473934 3.67313 0.467349 3.68848 0.460938C3.75808 0.431851 3.82851 0.404438 3.89941 0.37793C3.92121 0.369784 3.94293 0.361414 3.96484 0.353516C4.03 0.330024 4.09593 0.308386 4.16211 0.287109C4.18522 0.27968 4.20821 0.271804 4.23145 0.264648C4.32013 0.237331 4.40961 0.211739 4.5 0.188477C4.97939 0.0651019 5.4821 0 6 0ZM6.33594 1.01172C7.94245 2.08844 9 3.92082 9 6C9 8.07966 7.94119 9.91094 6.33398 10.9873C8.93963 10.8154 11 8.64916 11 6C11 3.35148 8.9407 1.18454 6.33594 1.01172Z" fill="white"/>
        </svg>`;

        this.innerHTML = svgIcon;
        this.dataset.mask = "mask";
        canvas.dataset.mask = "mask";

        //CHANGE PANEL ICON TO CLICK ARROW DOWN
        this.parentElement.firstElementChild.firstElementChild.style.display = "none";
        this.parentElement.firstElementChild.children[1].style.display = "flex";

        dataLayer[f] = valueSwitcher(dataLayer[f], 'mask', 'mask');
        layerSequence = "mask";

        maskImageBelow(panel)
    }

    else {

        //FOR GROUP START AT INDEX 1 TO SKIP TITLELAYER
        let svgIcon = 
        `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C3.57258 12 1.48282 10.5581 0.538086 8.48438C0.531433 8.4698 0.525094 8.45507 0.518555 8.44043C0.478569 8.35075 0.440924 8.2599 0.405273 8.16797C0.397923 8.14904 0.389975 8.13034 0.382812 8.11133C0.303993 7.90173 0.235942 7.6868 0.180664 7.4668C0.174387 7.44186 0.169049 7.41667 0.163086 7.3916C0.144808 7.31465 0.127586 7.23725 0.112305 7.15918C0.102469 7.10901 0.0945126 7.05842 0.0859375 7.00781C0.076014 6.94916 0.0668016 6.89028 0.0585938 6.83105C0.0512098 6.77786 0.0440634 6.72453 0.0380859 6.6709C0.0300152 6.59837 0.0240163 6.52543 0.0185547 6.45215C0.0160073 6.41802 0.0127153 6.3839 0.0107422 6.34961C0.00409377 6.23391 0 6.11737 0 6C0 5.8823 0.00405669 5.76544 0.0107422 5.64941C0.0127208 5.61513 0.0160018 5.581 0.0185547 5.54688C0.024028 5.47359 0.0300036 5.40065 0.0380859 5.32812C0.0440719 5.27449 0.0512014 5.22116 0.0585938 5.16797C0.066811 5.10875 0.0760048 5.04987 0.0859375 4.99121C0.091179 4.96031 0.0948731 4.92918 0.100586 4.89844L0.12207 4.79102C0.13467 4.72943 0.148616 4.6683 0.163086 4.60742C0.169053 4.58236 0.174383 4.55716 0.180664 4.53223C0.235974 4.31225 0.303964 4.09727 0.382812 3.8877C0.385755 3.87989 0.388627 3.87205 0.391602 3.86426L0.47168 3.66406C0.486682 3.6286 0.502893 3.5937 0.518555 3.55859C0.525096 3.54395 0.531431 3.52923 0.538086 3.51465C1.483 1.44141 3.57289 0 6 0ZM6 1C4.9986 1 4.06624 1.29481 3.28418 1.80176C4.34529 2.88352 5 4.36488 5 6C5 7.63487 4.345 9.11555 3.28418 10.1973C4.06633 10.7044 4.99841 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1Z" fill="white"/>
        </svg>`;
        
        this.innerHTML = svgIcon;
        this.dataset.mask = "unmask";
        canvas.dataset.mask = "unmask";

        //CHANGE PANEL ICON TO CLICK ARROW DOWN
        this.parentElement.firstElementChild.firstElementChild.style.display = "flex";
        this.parentElement.firstElementChild.children[1].style.display = "none";

        dataLayer[f] = valueSwitcher(dataLayer[f], 'mask', 'unmask');
        layerSequence = "unmask";

        unmaskImageBelow(panel)
    }

}

function maskImageBelow(panel) {

    if(panel == null || panel == undefined) return;
    
    let f, canvas, belowPanel, belowF, belowCanvas, belowW, belowCanvasR,
    belowH, canvasR, canvasW, canvasH, newX, newY, btnMaskUnmask;

    if(panel.dataset.type == 'image') {

        f = panel.dataset.ref;
        canvas = cnvGrpLayers.querySelector(`[data-ref ="${f}"]`);

        belowPanel = panel.nextElementSibling;
        if(belowPanel != null || belowPanel != undefined) {
            belowF = belowPanel.dataset.ref;
        }
        else {
            return;
        }
        
    }
    else if(panel.dataset.type == "element") {

        f = panel.dataset.ref;
        canvas = cnvGrpLayers.querySelector(`[data-ref ="${f}"]`);

        if(canvas.dataset.subtype == "shape") {

            belowPanel = panel;
            belowF = panel.dataset.ref;
            panel = belowPanel.previousElementSibling;

            if(panel != null || panel != undefined) { 
                f = panel.dataset.ref;  
                canvas = cnvGrpLayers.querySelector(`[data-ref ="${f}"]`);
            }
            else {
                return;
            }

        }
    }

    btnMaskUnmask = panel.querySelector('.btnMaskUnmask');

    if(btnMaskUnmask != null) {
        if(btnMaskUnmask.dataset.mask == "mask") {
            
            belowCanvas = cnvGrpLayers.querySelector(`[data-ref="${belowF}"]`);
            belowCanvas.dataset.mask = 'mask';
            belowW = belowCanvas.offsetWidth;
            belowH = belowCanvas.offsetHeight;
            belowCanvasR = Number(belowCanvas.dataset.rotation);
            canvasR = Number(canvas.dataset.rotation);
            canvasW = canvas.offsetWidth;
            canvasH = canvas.offsetHeight;
            //[!] COUNTER-ROTATE THE OFFSET BY THE SHAPE'S OWN ANGLE. offsetLeft/offsetTop
            //ARE LAYOUT VALUES SO THEY IGNORE THE ROTATION CSS PUTS ON THE SHAPE CANVAS -
            //BUT THE CLIPPED IMAGE LIVES INSIDE THAT ROTATED FRAME AND GETS CARRIED
            //AROUND WITH IT, WHILE THE REAL <img> STAYS PUT. TAKING THE CENTRE-TO-CENTRE
            //VECTOR BACK THROUGH -belowCanvasR PINS THE CLONE TO THE SAME SCREEN SPOT.
            //AT ZERO ROTATION THIS REDUCES TO THE PLAIN offsetLeft DIFFERENCE
            let rad = degToRad(-belowCanvasR);

            let vx = (canvas.offsetLeft + canvasW / 2) - (belowCanvas.offsetLeft + belowW / 2);
            let vy = (canvas.offsetTop + canvasH / 2) - (belowCanvas.offsetTop + belowH / 2);

            //THE SHAPE IS ONLY THE CONTAINER: ITS FLIP IS UNDONE TOO, SO THE PICTURE INSIDE NEVER MOVES OR MIRRORS (sir, 2026-10-05)
            let shapeSx = belowCanvas.dataset.flipX == "true" ? -1 : 1;
            let shapeSy = belowCanvas.dataset.flipY == "true" ? -1 : 1;

            newX = belowW / 2 + (vx * Math.cos(rad) - vy * Math.sin(rad)) * shapeSx - canvasW / 2;
            newY = belowH / 2 + (vx * Math.sin(rad) + vy * Math.cos(rad)) * shapeSy - canvasH / 2;

            //HIDE THE
            canvas.querySelector('img').style.visibility = "hidden";

            if(belowPanel.dataset.type == "element" && belowCanvas.dataset.subtype == "shape") {

                let shapeEl = belowCanvas.querySelectorAll('g')[2].children[0];
                let maskImg = belowCanvas.querySelector(`#image_mask_${belowF}`);

                //[!] BUILD ONCE. THIS RUNS ON EVERY GESTURE FRAME FROM ADJUSTCANVAS2PIN
                //AND THE href IS A FULL BASE64 STRING - REWRITING THE MARKUP PER FRAME
                //WOULD RE-SERIALISE THE WHOLE IMAGE. AFTER THE FIRST BUILD ONLY THE
                //FIVE GEOMETRY ATTRIBUTES BELOW CHANGE.
                //[!] SELF HEALS - RENDERSVG WIPES THE <g> ON A SHAPE RESIZE, SO THE NEXT
                //CALL FINDS NO IMAGE AND REBUILDS IT AGAINST THE NEW PATH
                //A CLONE SAVED BEFORE THE FX GROUP (OR ITS STROKE) EXISTED IS REBUILT
                if(maskImg != null && (maskImg.parentElement.hasAttribute('clip-path') || maskImg.previousElementSibling == null)) {
                    maskImg.parentElement.remove();
                    maskImg = null;
                }

                if(maskImg == null) {

                    //[!] CLIPPATH, NOT PATTERN. A PATTERN REPEATS BY DEFINITION, SO AN
                    //IMAGE SMALLER THAN THE SHAPE TILED - AND ROTATING patternTransform
                    //LEFT GAPS THE NEXT TILE FILLED, BECAUSE A TILE THAT COVERS W x H
                    //STOPS COVERING IT ONCE TURNED. A CLIP HAS NO REPEAT AT ANY ANGLE,
                    //AND PAINTS THE IMAGE DIRECTLY INSTEAD OF THROUGH A RASTERISED TILE
                    let defs = `<clipPath id="image_clip_${belowF}" clipPathUnits="userSpaceOnUse">${shapeEl.outerHTML}</clipPath>`;

                    if(belowCanvas.querySelector(`defs`) == null) {

                        belowCanvas.querySelector(`svg`).innerHTML += `<defs>${defs}</defs>`;

                    }
                    else {

                        belowCanvas.querySelector(`#image_clip_${belowF}`)?.remove();
                        belowCanvas.querySelector(`defs`).innerHTML += defs;
                    }

                    //innerHTML += RE-PARSES THE SVG, SO THE OLD shapeEl IS A DEAD NODE NOW
                    shapeEl = belowCanvas.querySelectorAll('g')[2].children[0];

                    //[!] THE CLIP GOES ON A WRAPPER <g>, THE ROTATION ON THE <image>
                    //INSIDE IT. clip-path RESOLVES IN THE ELEMENT'S OWN SPACE AFTER ITS
                    //transform, SO PUTTING BOTH ON THE IMAGE ROTATED THE CLIP WITH IT AND
                    //THE MASK EDGE SWUNG OFF THE SHAPE. SPLIT, THE CLIP STAYS PINNED TO
                    //THE SHAPE WHILE THE IMAGE TURNS INSIDE IT.
                    //[!] preserveAspectRatio NONE MATCHES HOW THE REAL <img> FILLS ITS CSS
                    //BOX. THE DEFAULT FITS THE IMAGE INSIDE INSTEAD, WHICH LEFT EMPTY
                    //STRIPS THE OLD PATTERN THEN REPEATED INTO
                    belowCanvas.querySelectorAll('g')[2].insertAdjacentHTML('beforeend',
                    `<g clip-path="url(#image_clip_${belowF})"><g id="image_fx_${belowF}"><rect id="image_stroke_${belowF}" fill="none" stroke="none"/><image id="image_mask_${belowF}" href="${canvas.querySelector('img').src}" preserveAspectRatio="xMidYMid slice"/></g></g>`);

                    maskImg = belowCanvas.querySelector(`#image_mask_${belowF}`);
                }

                //[!] ROTATES ABOUT THE IMAGE'S OWN CENTRE, NOT THE SHAPE'S - THE IMAGE IS
                //ITS OWN LAYER AND CARRIES ITS OWN ANGLE
                maskImg.setAttribute('x', newX);
                maskImg.setAttribute('y', newY);
                maskImg.setAttribute('width', canvasW);
                maskImg.setAttribute('height', canvasH);
                //SLICE IS SVG'S object-fit: cover, HOW THE REAL img FILLS ITS BOX
                maskImg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
                //THE ORIGINAL IS THE SOURCE: ROTATION AND FLIP GO ON THE FX GROUP, ABOUT THE IMAGE CENTRE
                let cx = newX + canvasW / 2;
                let cy = newY + canvasH / 2;
                let sx = canvas.dataset.flipX == "true" ? -1 : 1;
                let sy = canvas.dataset.flipY == "true" ? -1 : 1;
                let fx = maskImg.parentElement;

                fx.setAttribute('transform', `translate(${cx} ${cy}) scale(${shapeSx} ${shapeSy}) rotate(${canvasR - belowCanvasR}) scale(${sx} ${sy}) translate(${-cx} ${-cy})`);
                fx.style.opacity = canvas.style.opacity;
                //HIDDEN OR INHERIT, NEVER visible - A HIDDEN SHAPE MUST STILL HIDE IT
                fx.style.visibility = canvas.style.visibility == "hidden" ? "hidden" : "";

                //GLOW / SHADOW SIT ON THE img, BLUR / BRIGHTNESS / CONTRAST / SATURATION ON ITS CANVAS - SAME ORDER AS THE ORIGINAL
                let img = canvas.querySelector('img');
                fx.style.filter = [img.style.filter, canvas.style.filter].filter((v) => v != "" && v != "none").join(' ');

                //STROKE: THE img BORDER, OUTSIDE THE BOX, REACHING 1px UNDER THE PICTURE SO ITS EDGE NEVER LEAKS
                let stroke = maskImg.previousElementSibling;
                let width = parseFloat(img.style.borderWidth) || 0;

                if(width > 0 && img.style.borderStyle == "solid") {
                    stroke.setAttribute('x', newX - (width - 1) / 2);
                    stroke.setAttribute('y', newY - (width - 1) / 2);
                    stroke.setAttribute('width', canvasW + width - 1);
                    stroke.setAttribute('height', canvasH + width - 1);
                    stroke.setAttribute('stroke', img.style.borderColor);
                    stroke.setAttribute('stroke-width', width + 1);
                }
                else {
                    stroke.setAttribute('stroke', 'none');
                    stroke.removeAttribute('stroke-width');
                }

                //[!] THE SHAPE ONLY PROVIDES THE OUTLINE NOW - ITS OWN FILL WOULD SHOW
                //THROUGH ANY TRANSPARENT PART OF THE IMAGE
                shapeEl.setAttribute('fill', 'none');
            }
        }
    }
    

    //A MASKED LAYER'S FILL IS THE CLIPPED IMAGE, SO THE BLEED FOLLOWS THE MASK
    bleedFillLayers();
}

function unmaskImageBelow(panel) {

    let btnMaskUnmask = panel.querySelector('.btnMaskUnmask');

    if(btnMaskUnmask.dataset.mask == "unmask") {

        let f = panel.dataset.ref;
        let canvas = cnvGrpLayers.querySelector(`[data-ref ="${f}"]`);

        let belowPanel = panel.nextElementSibling;

        if(belowPanel != null || belowPanel != undefined) {
            let belowF = belowPanel.dataset.ref;
            let belowCanvas = cnvGrpLayers.querySelector(`[data-ref="${belowF}"]`);
            belowCanvas.dataset.mask = 'unmask';

            canvas.querySelector('img').style.removeProperty('visibility');

            if(belowPanel.dataset.type == "element" && belowCanvas.firstElementChild.tagName == "svg") {

                //[!] THE IMAGE'S WRAPPER <g> CARRIES THE CLIP, SO REMOVE THE PARENT -
                //REMOVING ONLY THE <image> WOULD LEAVE AN EMPTY CLIPPED GROUP BEHIND.
                //THE CLIPPATH ITSELF LIVES IN <defs>, WHICH RENDERSVG PRESERVES ACROSS
                //REBUILDS, SO IT HAS TO GO TOO OR IT STAYS IN THE SAVED FILE
                belowCanvas.querySelector(`#image_mask_${belowF}`)?.closest('[clip-path]')?.remove();
                belowCanvas.querySelector(`#image_clip_${belowF}`)?.remove();

                let fillDefault = valueFinder(dataLayer[belowF], 'txtElementFillColor');

                //[!] dataLayer HOLDS THE CSS GRADIENT STRING, BUT AN SVG fill NEEDS THE
                //DEF REFERENCE ADJUSTELEMENTFILLCOLOR BUILT. THE ID IS DETERMINISTIC SO
                //IT REBUILDS HERE - WRITING THE RAW STRING IS INVALID AND PAINTS NOTHING,
                //WHICH IS WHY AN UNMASKED GRADIENT CAME BACK WHITE
                if(fillDefault != null && fillDefault.includes('gradient')) {
                    fillDefault = `url(#element_${fillDefault.includes('linear') ? 'linear' : 'radial'}_fill_${belowF})`;
                }

                belowCanvas.querySelectorAll('g')[2].children[0].setAttribute('fill', fillDefault);
            }
        }
        else {

            canvas.querySelector('img').style.removeProperty('visibility');
        }
    }

    //A MASKED LAYER'S FILL IS THE CLIPPED IMAGE, SO THE BLEED FOLLOWS THE MASK
    bleedFillLayers();
}

function unmaskImageBelowViaDelete(panel) {

    let f = panel.dataset.ref;
    let canvas = cnvGrpLayers.querySelector(`[data-ref ="${f}"]`);

    let belowPanel = panel.nextElementSibling;

    if(belowPanel != null || belowPanel != undefined) {
        let belowF = belowPanel.dataset.ref;
        let belowCanvas = cnvGrpLayers.querySelector(`[data-ref="${belowF}"]`);

        canvas.querySelector('img').style.removeProperty('visibility');

        if(belowPanel.dataset.type == "element" && belowCanvas.firstElementChild.tagName == "svg") {

            belowCanvas.querySelector(`#image_mask_${belowF}`)?.closest('[clip-path]')?.remove();
            belowCanvas.querySelector(`#image_clip_${belowF}`)?.remove();

            let fillDefault = valueFinder(dataLayer[belowF], 'txtElementFillColor');

            if(fillDefault != null && fillDefault.includes('gradient')) {
                fillDefault = `url(#element_${fillDefault.includes('linear') ? 'linear' : 'radial'}_fill_${belowF})`;
            }

            belowCanvas.querySelectorAll('g')[2].children[0].setAttribute('fill', fillDefault);
        }
    }
    else {

        canvas.querySelector('img').style.removeProperty('visibility');
    }

    //A MASKED LAYER'S FILL IS THE CLIPPED IMAGE, SO THE BLEED FOLLOWS THE MASK
    bleedFillLayers();
}

//THE ORIGINAL IS THE SOURCE: A NEW PICTURE ON A MASKED IMAGE (SWAP, EYEDROP, REMOVE BACKGROUND, UNDO) GOES TO ITS CLONE ONCE
document.getElementById('cnvGrpLayers').addEventListener('load', (e) => {

    let canvas = e.target.closest('.cnvLayers');

    if(e.target.tagName != "IMG" || canvas == null || canvas.dataset.type != "image" || canvas.dataset.mask != "mask") return;

    let belowPanel = f2Panel(canvas.dataset.ref)?.nextElementSibling;

    if(belowPanel != null) f2Canvas(belowPanel.dataset.ref)?.querySelector(`#image_mask_${belowPanel.dataset.ref}`)?.setAttribute('href', e.target.src);
}, true);

function showHideLayers() {

    let panel = this.closest('[class*="pnlBox"]')

    //VISIBILITY NOT DISPLAY, display:none ZEROED THE BOX SO adjustBorder SHRANK THE PIN TO NOTHING
    //A FOCUSED HIDDEN LAYER KEEPS ITS PIN AS THE BOUNDARY, UNFOCUSED IT HAS NOTHING TO CLICK

    if(this.dataset.show == "visible") {

        let svgIcon = 
        `<svg width="14" height="7" viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.00024 1.00024C1.60964 2.3003 2.48643 3.28345 3.50024 3.9497M13.0002 1.00024C12.3908 2.3003 11.5141 3.28345 10.5002 3.9497M6.00024 4.92096L5.37712 6.00024M6.00024 4.92096C5.12577 4.78141 4.27318 4.45766 3.50024 3.9497M6.00024 4.92096C6.66272 5.02667 7.33776 5.02667 8.00024 4.92096M3.50024 3.9497L2.4497 5.00024M8.00024 4.92096L8.62337 6.00024M8.00024 4.92096C8.87472 4.78141 9.7273 4.45766 10.5002 3.9497M10.5002 3.9497L11.5508 5.00024" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>`;

        this.innerHTML = svgIcon;
        this.dataset.show = "hidden";

        if(panel.dataset.type == "group") {

            //FOR GROUP START AT INDEX 1 TO SKIP TITLELAYER
            for(let a = 1; a < panel.childElementCount; a++) {
                
                let f = panel.children[a].dataset.ref;

                canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                canvas.style.visibility = "hidden";

                panel.children[a].querySelector('.btnShowHide').style.opacity = 0.2
                panel.children[a].querySelector('.btnShowHide').dataset.show = "hidden";
                    
                if(panel.children[a].dataset.type != 'pattern') {

                    let pin = cnvPin.querySelector(`[data-ref="${f}"]`)

                    if(pin != null && focusObj[f] == null) pin.style.visibility = "hidden";
                }
            }
        }
        else  {

            //JUST SHOW/HIDE INDIVIDUAL FOCUSED PANEL
            let f = panel.dataset.ref;
            
            canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            canvas.style.visibility = "hidden";

            if(panel.dataset.type != 'pattern') {

                let pin = cnvPin.querySelector(`[data-ref="${f}"]`)

                if(pin != null && focusObj[f] == null) pin.style.visibility = "hidden";
            }
        }    

        layerSequence = "visible";
    }

    else {

        //FOR GROUP START AT INDEX 1 TO SKIP TITLELAYER
        let svgIcon = 
        `<svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.00014 2.71429C5.57998 2.71429 4.42871 3.86555 4.42871 5.28572C4.42871 6.70588 5.57998 7.85714 7.00014 7.85714C8.4203 7.85714 9.57157 6.70588 9.57157 5.28572C9.57157 3.86555 8.4203 2.71429 7.00014 2.71429Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9119 4.87535C12.4818 1.69741 9.79075 1.19209e-07 7 0C4.20925 -1.78814e-07 1.51815 1.69741 0.0880784 4.87535C-0.0293595 5.13632 -0.0293595 5.43511 0.0880784 5.69608C1.51815 8.87402 4.20925 10.5714 7 10.5714C9.79075 10.5714 12.4818 8.87401 13.9119 5.69608C14.0294 5.4351 14.0294 5.13632 13.9119 4.87535ZM7 8.57143C5.18342 8.57143 3.27797 7.53709 2.11033 5.28572C3.27797 3.03434 5.18342 2 7 2C8.81657 2 10.722 3.03434 11.8897 5.28571C10.722 7.53708 8.81657 8.57143 7 8.57143Z" fill="white"/>
        </svg>`;
        
        this.innerHTML = svgIcon;
        this.dataset.show = "visible";

        if(panel.dataset.type == "group") {
            
            for(let a = 1; a < panel.childElementCount; a++) {
                let f = panel.children[a].dataset.ref;

                canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
                canvas.style.visibility = "visible";

                panel.children[a].querySelector('.btnShowHide').style.opacity = 1;
                panel.children[a].querySelector('.btnShowHide').dataset.show = "visible";
                    
                if(panel.children[a].dataset.type != 'pattern') {

                    let pin = cnvPin.querySelector(`[data-ref="${f}"]`)

                    if(pin != null) pin.style.visibility = "visible";
                }
            }
        }
        else {

            //JUST SHOW/HIDE INDIVIDUAL FOCUSED PANEL
            let f = panel.dataset.ref;
            
            canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            canvas.style.visibility = "visible";

            if(panel.dataset.type != 'pattern') {

                let pin = cnvPin.querySelector(`[data-ref="${f}"]`)

                if(pin != null) pin.style.visibility = "visible";
            }
        }
        
        layerSequence = "hidden";
    }

    //THE BEHAVIOUR OWNS show IN THE LAYER DATA. ON A REAL CLICK THE ENCODER RUNS FIRST AND ON
    //UNDO/REDO IT IS PAUSED, SO THIS IS THE ONE WRITE THAT IS ALWAYS LAST AND ALWAYS HAPPENS
    if(panel.dataset.type != "group") {

        let f = panel.dataset.ref;

        if(panel.dataset.type == "pattern") dataPattern[f] = valueSwitcher(dataPattern[f], 'show', this.dataset.show);
        else dataLayer[f] = valueSwitcher(dataLayer[f], 'show', this.dataset.show);
    }

    //A MASKED IMAGE'S CLONE FOLLOWS ITS ORIGINAL
    if(panel.dataset.type == "group") [...panel.children].forEach((child) => maskImageBelow(child));
    else maskImageBelow(panel);
}

function lockUnlockLayers() {
    
    let panel = this.closest('[class*="pnlBox"]')
    let f = panel.dataset.ref;

    if(this.dataset.lock == "lock") {

        let svgIcon = 
        `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 7C11.5523 7 12 7.44772 12 8V11C12 11.5523 11.5523 12 11 12H1C0.447715 12 8.05325e-09 11.5523 0 11V8C0 7.44772 0.447715 7 1 7H9V5C9 3.34315 7.65685 2 6 2C4.34315 2 3 3.34315 3 5H1C1 2.23858 3.23858 0 6 0C8.76142 0 11 2.23858 11 5V7Z" fill="white"/>
        </svg>`;

        this.innerHTML = svgIcon;
        this.dataset.lock = "unlock";

        //JUST SHOW/HIDE INDIVIDUAL FOCUSED PANEL
        if(panel.dataset.type != 'pattern') {

            let pin = cnvPin.querySelector(`[data-ref="${f}"]`)
            let inputs = pin.querySelectorAll('div');
            
            pin.dataset.lock = "unlock";
            inputs.forEach(function(input) {
                input.style.display = "grid";
            })
        }  

        layerSequence = "lock";
    }

    else {

        let svgIcon = 
        `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11 7C11.5523 7 12 7.44772 12 8V11C12 11.5523 11.5523 12 11 12H1C0.447715 12 8.05325e-09 11.5523 0 11V8C0 7.44772 0.447715 7 1 7V5C1 2.23858 3.23858 0 6 0C8.76142 0 11 2.23858 11 5V7ZM9 7V5C9 3.34315 7.65685 2 6 2C4.34315 2 3 3.34315 3 5V7H9Z" fill="white"/>
        </svg>`;

        this.innerHTML = svgIcon;
        this.dataset.lock = "lock";

        //JUST SHOW/HIDE INDIVIDUAL FOCUSED PANEL
        if(panel.dataset.type != 'pattern') {

            let pin = cnvPin.querySelector(`[data-ref="${f}"]`)
            let inputs = pin.querySelectorAll('div');
            
            pin.dataset.lock = "lock";
            inputs.forEach(function(input) {
                input.style.display = "none";
            })
        }
        
        layerSequence = "unlock";
    }

    //SAME OWNERSHIP AS showHideLayers
    if(panel.dataset.type == "pattern") dataPattern[f] = valueSwitcher(dataPattern[f], 'lock', this.dataset.lock);
    else dataLayer[f] = valueSwitcher(dataLayer[f], 'lock', this.dataset.lock);

    //moveableTargets() ALREADY SKIPS A LOCKED PIN, BUT ONLY WHEN SOMETHING ASKS IT. WITHOUT THIS A
    //LAYER LOCKED WHILE FOCUSED KEPT ITS HANDLES UNTIL THE NEXT FOCUS CHANGE
    moveableUpdateTargets();
}

function expandCollapsePanel() {
    
    let panel = this.closest('[class*="pnlBox"]');

    //COLLAPSE
    if(this.dataset.size == "expand") {
        this.dataset.size = "collapse";
        this.style.rotate = "-90deg";

        //INDEX 1 TO SKIP PNLTITLE
        for(let a = 1; a < panel.childElementCount; a++) {
            panel.children[a].style.display = "none";
        }
    }
    //EXPAND
    else {
        this.dataset.size = "expand";
        this.style.rotate = "0deg";

        //INDEX 1 TO SKIP PNLTITLE
        for(let a = 1; a < panel.childElementCount; a++) {
            panel.children[a].style.display = "block";
        }
    }
}

//============================LAYER BLEND======================
function chooseLayerBlend() {

    let panel = this.closest(`[id*='pnlBox']`);
    panel.querySelector('.dropdown').children[0].innerText = this.innerText;

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            canvas.style.mixBlendMode = this.innerText;
            
        }
    }

    bleedFillLayers();
}
document.querySelectorAll('.optLayerBlend')
.forEach((opt) => {
    opt.addEventListener('pointerdown', chooseLayerBlend);
})

//=============================LAYER WIDTH SIZE=====================
function adjustLayerWidth() {

    let z = rngZoom.value / 100;
    let panel = this.closest(`[id*='pnlBox']`);

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            let pin = cnvPin.querySelector(`[data-ref="${f}"]`);

            if(type != "pattern" && type != "text") {

                //TOP-LEFT STAYS PUT, LIKE FIGMA'S PANEL. X IS NOT TOUCHED SO IT NEVER GOES STALE
                canvas.style.width = this.value + 'px';

                if(type == "element") {
                    renderSVG(f)
                }
                else if(type == "line") {
                    renderLine(f);
                }
            } 

            else if(type != "pattern" &&  type == "text") {

                //TOP-LEFT STAYS PUT, LIKE FIGMA'S PANEL. X IS NOT TOUCHED SO IT NEVER GOES STALE
                canvas.style.width = this.value + 'px';

                canvas.children[0].style.whiteSpace = "normal";

                canvas.children[0].style.width = canvas.clientWidth + 'px';
                canvas.children[0].style.height = 1 + 'px';
                canvas.children[0].style.height = canvas.children[0].scrollHeight + 'px';
                
                if(canvas.children[0].clientHeight * z > canvas.clientHeight * z && currVertiAlignment == "Middle") {
                    let val = canvas.children[0].clientHeight * z - canvas.clientHeight * z;
                    canvas.children[0].style.position = "absolute";
                    canvas.children[0].style.top = 0 - val + 'px';
                }
                else if(canvas.children[0].clientHeight * z > canvas.clientHeight * z && currVertiAlignment == "Bottom") {
                    let val = canvas.children[0].clientHeight * z - canvas.clientHeight * z;
                    canvas.children[0].style.position = "absolute";
                    canvas.children[0].style.top = 0 - val * 2 + 'px';
                }
                else {
                    canvas.children[0].style.position = "static"; // need return to static for margin auto
                }

                
                panel.querySelector('.btnFixedSize').children[0].style.filter = "saturate(0) brightness(2)";
                panel.querySelector('.btnAutoWidth').children[0].style.filter = "none";
                panel.querySelector('.btnAutoHeight').children[0].style.filter = "none";
                
                currResizeBox = "FixedSize";

                panel.querySelector('.selTextResize').dataset.value = currResizeBox;
                
            }

            maskImageBelow(f2Panel(f))
        }
        
    }

    adjustBorder();
}

//=============================LAYER HEIGHT SIZE====================
function adjustLayerHeight() {

    let z = rngZoom.value / 100;
    let panel = this.closest(`[id*='pnlBox']`);

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type != "pattern" && type != "text") {

                //TOP-LEFT STAYS PUT, LIKE FIGMA'S PANEL. Y IS NOT TOUCHED SO IT NEVER GOES STALE
                canvas.style.height = this.value + 'px';

                if(type == "element") {
                    renderSVG(f)
                }
                else if(type == "line") {
                    renderLine(f);
                }
            }

            else if(type != "pattern" && type == "text") {

                //TOP-LEFT STAYS PUT, LIKE FIGMA'S PANEL. Y IS NOT TOUCHED SO IT NEVER GOES STALE
                canvas.style.height = this.value + 'px';
                
                canvas.children[0].style.whiteSpace = "normal";

                canvas.children[0].style.width = canvas.clientWidth + 'px';
                canvas.children[0].style.height = 1 + 'px';
                canvas.children[0].style.height = canvas.children[0].scrollHeight + 'px';
                
                if(canvas.children[0].clientHeight * z > canvas.clientHeight * z && currVertiAlignment == "Middle") {
                    let val = canvas.children[0].clientHeight * z - canvas.clientHeight * z;
                    canvas.children[0].style.position = "absolute";
                    canvas.children[0].style.top = 0 - val + 'px';
                }
                else if(canvas.children[0].clientHeight * z > canvas.clientHeight * z && currVertiAlignment == "Bottom") {
                    let val = canvas.children[0].clientHeight * z - canvas.clientHeight * z;
                    canvas.children[0].style.position = "absolute";
                    canvas.children[0].style.top = 0 - val * 2 + 'px';
                }
                else {
                    canvas.children[0].style.position = "static"; // need return to static for margin auto
                }
        
                panel.querySelector('.btnFixedSize').children[0].style.filter = "saturate(0) brightness(2)";
                panel.querySelector('.btnAutoWidth').children[0].style.filter = "none";
                panel.querySelector('.btnAutoHeight').children[0].style.filter = "none";
                
                currResizeBox = "FixedSize";

                panel.querySelector('.selTextResize').dataset.value = currResizeBox;
            }
            
            maskImageBelow(f2Panel(f))
        }
    }

    adjustBorder();
}

//=============================LAYER X COORDINATES====================
function adjustLayerX() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type != "pattern") {

                canvas.style.left = this.value + 'px';
    
            }

            maskImageBelow(f2Panel(f))
        }
    }

    adjustBorder();
}

//=============================LAYER Y COORDINATES====================
function adjustLayerY() {

    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type != "pattern") {

                canvas.style.top = this.value + 'px';
    
            }

            maskImageBelow(f2Panel(f))
        }
    }

    adjustBorder();
}

//=========================ONE transform PER LAYER===================
//sir, 2026-09-27: "rotating an element then flip X or Y is inaccurrate to the angle". ROTATION
//AND FLIP ARE ONE CSS transform, AND FLIP X, FLIP Y, THE ROTATION FIELD AND THE MOVEABLE ROTATE
//EACH WROTE THE WHOLE STRING - A FLIP THREW THE ANGLE AWAY, A ROTATE THREW THE FLIP AWAY, AND
//FLIP Y THREW FLIP X AWAY. THEY ALL COMPOSE HERE NOW FROM dataset.rotation, dataset.flipX AND
//dataset.flipY. rotate FIRST, THEN scale: THE LAYER MIRRORS IN ITS OWN FRAME AND KEEPS ITS
//ANGLE, SO THE PIN - WHICH ONLY EVER CARRIES THE ROTATION - STILL SITS EXACTLY ON IT
function applyLayerTransform(canvas) {

    if(canvas == null) return;

    //A LAYER SAVED BEFORE THIS CARRIES ITS FLIP ONLY INSIDE THE transform STRING
    if(canvas.dataset.flipX == null || canvas.dataset.flipY == null) {

        let m = /scale\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/.exec(canvas.style.transform);

        if(canvas.dataset.flipX == null) canvas.dataset.flipX = (m != null && Number(m[1]) < 0) ? "true" : "false";
        if(canvas.dataset.flipY == null) canvas.dataset.flipY = (m != null && Number(m[2]) < 0) ? "true" : "false";
    }

    let r = Number(canvas.dataset.rotation) || 0;
    let sx = canvas.dataset.flipX == "true" ? -1 : 1;
    let sy = canvas.dataset.flipY == "true" ? -1 : 1;

    canvas.style.transform = `rotate(${r}deg) scale(${sx}, ${sy})`;
}

//=============================FLIP X COORDINATES====================
function adjustFlipX() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type != "pattern") {
                
                if(this.dataset.value == "true") {

                    canvas.dataset.flipX = "true";
                    applyLayerTransform(canvas);
                }

                else if(this.dataset.value == "false") { 

                    canvas.dataset.flipX = "false";
                    applyLayerTransform(canvas);

                    this.removeEventListener('mouseover', chkBoxHover);
                }
            }

            maskImageBelow(f2Panel(f))
        }
    }
}

//=============================FLIP Y COORDINATES====================
function adjustFlipY() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type != "pattern") {

                if(this.dataset.value == "true") {

                    canvas.dataset.flipY = "true";
                    applyLayerTransform(canvas);
                }
            
                else if(this.dataset.value == "false") { 
            
                    canvas.dataset.flipY = "false";
                    applyLayerTransform(canvas);
            
                    this.removeEventListener('mouseover', chkBoxHover);
            
                }

            }

            maskImageBelow(f2Panel(f))
        }
    }

}

//==============================IMAGE OPACITY========================
function chooseLayerOpacity() {
    
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type != "pattern") {
                canvas.style.opacity = this.value + '%';
            }

            maskImageBelow(f2Panel(f))
        }
    }


    //BELOW 100% THE BLEED WOULD DRAW A DARK LINE, SO IT GOES OFF
    bleedFillLayers();
}

//==============================IMAGE ROTATION========================
function chooseLayerRotation() {

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type != "pattern") {

                canvas.dataset.rotation = this.value;
                applyLayerTransform(canvas);
            }

            maskImageBelow(f2Panel(f))
        }
    }

    adjustBorder();

}

//=============================DRAG AND DROP PNLBOX LAYERS=========================

let tmrDrag;
function countdownPanelLayer() {

    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');

    if(counter < 75) {
        counter+=25;
    }
    else {

        isDragging = true; //set boolean to true

        clearInterval(tmrDrag);
        tmrDrag = null;
        counter = 0;

        //record initial sequence
        layerSequence = "Stacked: ";

        for(let a = 0; a < pnlBoxLayer.length; a++) {
            layerSequence += `${Number(pnlBoxLayer[a].dataset.ref)} `;
        }
    }
}   

function pointerDownLayer(e) {

    if(e.button == 0) {

        if(!checkInputFocus()) {

            if((this != e.target) && (e.target.closest('.pnlTitleLayer'))) {
                
                e.preventDefault();
                clientY = e.clientY;
                tmrDrag = setInterval(countdownPanelLayer, 100);
  
            }
        }
    }

}
document.querySelectorAll('.configScroll')[5].addEventListener('pointerdown', pointerDownLayer);

//ITS OWN FLAG. ONE isRAF WAS SHARED BY THIS, THE MARQUEE, THE ZOOM AND updateMoveableRect, SO
//ANY ONE OF THEM HOLDING IT DROPPED ANOTHER ONE'S FRAME
let isLayerDragRAF = false;

function pointerMoveLayer(e) {
    
    if(isDragging && clientY != e.clientY) {
        
        if(isLayerDragRAF) return;

        isLayerDragRAF = true;

        requestAnimationFrame(() => {

            isLayerDragRAF = false;
            
            e.preventDefault();

            let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');

            for(let a = 0; a < pnlBoxLayer.length; a++) {
            
                if(e.clientY < pnlBoxLayer[a].getBoundingClientRect().top + (pnlBoxLayer[a].clientHeight/2)) {
                    
                    patRank = a;

                    breaklineDrag?.remove();
                    breaklineDrag = null;
                    breaklineDrag = document.createElement('div')
                    breaklineDrag.setAttribute('id', 'breaklineDrag');
                    breaklineDrag.id = "breaklineDrag";

                    breaklineDrag.style.display = "block";
                    breaklineDrag.style.background = snapLineColor;

                    this.insertBefore(breaklineDrag, pnlBoxLayer[patRank]);
            
                    break;
                }
                
                else if(e.clientY > pnlBoxLayer[pnlBoxLayer.length-1].getBoundingClientRect().top + (pnlBoxLayer[pnlBoxLayer.length-1].clientHeight /2)) {

                    breaklineDrag?.remove();
                    breaklineDrag = null;
                    breaklineDrag = document.createElement('div')
                    breaklineDrag.setAttribute('id', 'breaklineDrag');
                    breaklineDrag.id = "breaklineDrag";

                    breaklineDrag.style.display = "block";
                    breaklineDrag.style.background = snapLineColor;
                    this.appendChild(breaklineDrag);

                    break;
                }
            }
        });
    }

}
document.querySelectorAll('.configScroll')[5].addEventListener('pointermove', pointerMoveLayer);
document.querySelectorAll('.configScroll')[5].addEventListener('contextmenu', function(e){
    e.preventDefault();
})

function pointerUpLayer(e) {

    e.preventDefault();

    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');

    if(isDragging) {

        isDragging = false;

        ///////////MOVE THE FOCUS PANEL////////
        for(let a = focusPanel.length-1; a >= 0; a--) {

            if(focusPanel[a] != null) {

                if(breaklineDrag != null) {
                    breaklineDrag.style.background = snapLineColor;
                    this.insertBefore(focusPanel[a], breaklineDrag);
                }
            }
        }

        //DELETE / REMOVE BREAKLINEDRAG
        breaklineDrag?.remove();
        breaklineDrag = null;
        //NULLIFY PATRANK
        patRank = null;

        //RECORD NEW SEQUENCE FOR HISTORY
        layerSequence += "*";

        for(let a = 0; a < pnlBoxLayer.length; a++) {
            layerSequence += `${Number(pnlBoxLayer[a].dataset.ref)} `;
        }

        let tempHistory = layerSequence;
        makeNewHistory(tempHistory)
        layerSequence = "";

        rearrangeCanvasLayers();

        //////////REEVALUATE IMAGE MASKING POSITION///////////
        rearrangeMaskingLayers();

    }

    counter = 0;
    clientY = null;
    clearInterval(tmrDrag);
    
}
document.querySelectorAll('.configScroll')[5].addEventListener('pointerup', pointerUpLayer);


//================REARRANGE CANVAS DEPENDING ON THE LAYER ARRANGEMENT=======
function rearrangeCanvasLayers() {
    
    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');

    for(let a = 1; a < pnlBoxLayer.length; a++) {
        
        let f = pnlBoxLayer[a].dataset.ref;
        //THE EYE CARRIES show, NOT THE PANEL
        let show = pnlBoxLayer[a].querySelector('.btnShowHide').dataset.show;

        let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
        canvas.style.visibility = show;
        
        cnvGrpLayers.prepend(canvas);

        if(pnlBoxLayer[a].dataset.type != "pattern") {
        
            let pin = cnvPin.querySelector(`[data-ref="${f}"]`);
            cnvPin.prepend(pin);
        }
    }

}

//================REARRANGE PANEL MASKING

function rearrangeMaskingLayers() {

    let configScroll = document.getElementsByClassName('configScroll');

    pauseEncoding()

    for(let a = configScroll[5].childElementCount - 1; a >= 0; a--) {

        let panel = configScroll[5].children[a];
        let f = panel.dataset.ref;
        let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

        if(panel.dataset.type == "element" && panel.dataset.subtype == "shape") {
            let defaultFill = valueFinder(dataLayer[f], 'txtElementFillColor');

            //THE THIRD COPY OF THE FILL RESTORE, AND THE ONE THAT MISSED THE FIX THE OTHER TWO
            //GOT (unmaskImageBelow, unmaskImageBelowViaDelete). A GRADIENT IS STORED AS ITS CSS
            //STRING, AND AN SVG fill ONLY TAKES url(#id) - WRITING THE STRING PAINTS NOTHING.
            //THIS RUNS AFTER EVERY LAYER REORDER, SO EVERY REORDER WIPED EVERY GRADIENT SHAPE
            if(defaultFill != null && defaultFill.includes('gradient')) {
                defaultFill = `url(#element_${defaultFill.includes('linear') ? 'linear' : 'radial'}_fill_${f})`;
            }

            canvas.querySelectorAll('g')[2].children[0].setAttribute('fill', defaultFill);
        }
        
        if(panel.dataset.type == "image") {

            let mask = panel.querySelector('.btnMaskUnmask').dataset.mask;

            if(panel.nextElementSibling != null) {
                if(mask == "mask" && panel.nextElementSibling.dataset.subtype == "shape") {
                    maskImageBelow(panel)
                }
                else if(mask == "mask" && panel.nextElementSibling.dataset.subtype != "shape") {
                    panel.querySelector('.btnMaskUnmask').click();
                }
            }
            else {
                if(mask == "mask") {
                    panel.querySelector('.btnMaskUnmask').click();
                }
            }
        }
    }

    resumeEncoding();

    bleedFillLayers();
}

//=================CLONE CANVAS TYPE===================
async function cloneCanvas() {

    let configScroll = document.getElementsByClassName('configScroll')[5];
    let cnvGrpLayers = document.getElementById('cnvGrpLayers');
    let cnvPin = document.getElementById('cnvPin');

    let arrNewFocus = [];
    //RUN THRU ALL THE PANELS FROM CONFIGSCROLL[5]
    //START FROM THE LAST CHILD WHICH IS AT THE BOTTOM ORDER
    for(let a = configScroll.childElementCount-1; a >= 0; a--) {
        //THEN CHECK IF EACH CHILDREN IS FOCUSED
        //IF SO, CLONE AND ADD ABOVE
        if(checkPanelFocusBool(configScroll.children[a])) {

            let f = configScroll.children[a].dataset.ref;

            //CLONING PANEL
            let clonePanel = configScroll.children[a].cloneNode(true);
            clonePanel.dataset.ref = maxF;

            //INSERTING CLONED PANEL
            configScroll.insertBefore(clonePanel, configScroll.children[a]);

            //cloneNode COPIES NO LISTENERS, A CLONE'S LOCK / HIDE WAS NEVER RECORDED
            clonePanel.querySelector('.btnLockUnlock')?.addEventListener('click', encodeLockUnlock);
            clonePanel.querySelector('.btnShowHide')?.addEventListener('click', encodeShowHide);

            let isPattern = clonePanel.dataset.type == "pattern";

            //[!] START CLONING THE CANVAS
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
            let cloneCanvas = canvas.cloneNode(true);
            cloneCanvas.dataset.ref = maxF;

            //RIGHT ABOVE THE ORIGINAL, THE SAME SLOT THE PANEL TAKES
            canvas.after(cloneCanvas);

            //THE COPY MUST DRAW ITS OWN SYMBOL, NOT THE ORIGINAL'S
            if(isPattern) {
                cloneCanvas.querySelector(`#patSymbol${f}`)?.setAttribute('id', `patSymbol${maxF}`);
                cloneCanvas.querySelectorAll('use').forEach((use) => use.setAttribute('href', `#patSymbol${maxF}`));
                cnvPatterns[maxF] = cloneCanvas;
            }

            if(clonePanel.dataset.type.includes('3D')) {

                data3D[maxF] = data3D[f];

                let id = cloneCanvas.dataset.id;
                cloneCanvas.innerHTML = "";

                let canvas = document.createElement('canvas');
                cloneCanvas.appendChild(canvas);
                canvas.width = "100%";
                canvas.height = "100%";
                canvas.classList.add('canvas3D');
               
                recreate3DMockup(maxF, id)
 
            }
            
            //A PATTERN HAS NO PIN AND KEEPS ITS DATA IN dataPattern
            let tempHistory;

            if(isPattern) {

                dataPattern[maxF] = valueSwitcher(dataPattern[f], 'ref', maxF);
                tempHistory = dataPattern[maxF].replace('*', 'Created*');
            }
            else {

                //[!] START CLONING THE PINBODY
                let pin = cnvPin.querySelector(`[data-ref="${f}"]`);
                let clonePin = pin.cloneNode(true);
                clonePin.dataset.ref = maxF;

                pin.after(clonePin);

                //[!]CLONE DATALAYERS 
                dataLayer[maxF] = dataLayer[f];

                //[!] REPLACE THE REF VALUE IN DATALAYER 
                dataLayer[maxF] = valueSwitcher(dataLayer[maxF], 'ref', maxF);

                tempHistory = dataLayer[maxF].replace('*', 'Created*');
            }

            //[!] CREATE A HISTORY FOR DUPLICATED CANVAS
            makeNewHistory(tempHistory);

            arrNewFocus.push(maxF);
            maxF++;
        }
    }

    resetAllFocus();

    //START CLONING FOCUS
    for(let a = 0; a < arrNewFocus.length; a++) {
        let f = arrNewFocus[a];
        let panel = configScroll.querySelector(`[data-ref="${f}"]`);

        panel2Focus(panel)
    }
}

//=================MOVE LAYER VIA RIGHT CLICK===================

function contextMoveLayer(position) {
    let pnlBoxLayer = document.getElementsByClassName('pnlBoxLayer');
    let configScroll = document.getElementsByClassName('configScroll');

    //RECORD OLD SEQUENCE
    let tempHistory = "Stacked: ";

    for(let a = 0; a < pnlBoxLayer.length; a++) {
        tempHistory += `${Number(pnlBoxLayer[a].dataset.ref)} `;
    }

    if(position == 'top') {
        if(leadPanel != configScroll[5].firstChild) {
            configScroll[5].insertBefore(leadPanel, configScroll[5].firstChild);

            //APPEND THE NEW LAYER SEQUENCE
            tempHistory += "*";

            for(let a = 0; a < pnlBoxLayer.length; a++) {
                tempHistory += `${Number(pnlBoxLayer[a].dataset.ref)} `;
            }

            //ADD TO HISTORY
            makeNewHistory(tempHistory)
        }
    }
    else if(position == 'up') {
        if(leadPanel != configScroll[5].firstChild) {
            configScroll[5].insertBefore(leadPanel, leadPanel.previousElementSibling);

            //APPEND THE NEW LAYER SEQUENCE
            tempHistory += "*";

            for(let a = 0; a < pnlBoxLayer.length; a++) {
                tempHistory += `${Number(pnlBoxLayer[a].dataset.ref)} `;
            }

            makeNewHistory(tempHistory)

        }
    }
    else if(position == 'down') {
        if(leadPanel != configScroll[5].lastChild) {
            configScroll[5].insertBefore(leadPanel, leadPanel.nextElementSibling.nextElementSibling);

            //APPEND THE NEW LAYER SEQUENCE
            tempHistory += "*";

            for(let a = 0; a < pnlBoxLayer.length; a++) {
                tempHistory += `${Number(pnlBoxLayer[a].dataset.ref)} `;
            }

            makeNewHistory(tempHistory)
        }
    }
    else if(position == 'bottom') {
        if(leadPanel != configScroll[5].lastChild) {

            configScroll[5].appendChild(leadPanel);

            //APPEND THE NEW LAYER SEQUENCE
            tempHistory += "*";

            for(let a = 0; a < pnlBoxLayer.length; a++) {
                tempHistory += `${Number(pnlBoxLayer[a].dataset.ref)} `;
            }

            makeNewHistory(tempHistory)
        }
        
    }

    //RESET LAYER SEQUENCE
    layerSequence = "";

    //REARRANGE CANVAS 
    rearrangeCanvasLayers();

}

///////////////////////START SELECTING CANVAS USING MOUSE///////////////////

function selectingCanvasDown(e) {

    let scrollL = canvasBorder.scrollLeft;
    let scrollT = canvasBorder.scrollTop;

    if(e.button == 0) {
        
        if(e.target.id == "cnvPin") {

            isScaling = false;
            isRotating = false;
            isResizing  = false;
            isDragging = false;

            isSelecting = true;

            cnvPin.style.cursor = `default !important`;
            
            let inputs = cnvPin.querySelectorAll('div');
    
            inputs.forEach(function(input) {

                input.style.cursor = `default`;
    
            })
    
            //350 IS TOTAL WIDTH OF TOOLBOX AND TOOLMENU COMBINED
            //102 IS TOTAL HEIGHT OF HEADERUI AND SUBMENU COMBINED 70PX + 2EM;
            resX = e.clientX - 350 + scrollL;
            resY = e.clientY - 102 + scrollT;

        }
        else {
            isSelecting = false;
        }
    }
}
document.addEventListener('pointerdown', selectingCanvasDown);

///////////////////////MOVE SELECTING CANVAS USING MOUSE////////////////////
//ITS OWN FLAG - SEE isLayerDragRAF
let isMarqueeRAF = false;

function selectingCanvasMove(e) {

    if(isSelecting) {

        isSelecting2 = true;

        if(isMarqueeRAF) return;

        isMarqueeRAF = true;

        requestAnimationFrame(() =>{

            isMarqueeRAF = false;

            let scrollL = canvasBorder.scrollLeft;
            let scrollT = canvasBorder.scrollTop;

            let selectPin = document.getElementById('selectPin');

            selectPin.style.borderColor = selectLineColor;

            //350 IS TOTAL WIDTH OF TOOLBOX AND TOOLMENU COMBINED
            //102 IS TOTAL HEIGHT OF HEADERUI AND SUBMENU COMBINED 70PX + 2EM;
            let newX = e.clientX - 350 + scrollL;
            let newY = e.clientY -102 + scrollT;

            //CHECK FIRST IF SELECTING IS GOING TO THE RIGHT DIRECTION
            if( newX > resX) {
                selectPin.style.left = resX + 'px';
                selectPin.style.width = Math.abs(newX - resX) + 'px';
            }
            else if(newX < resX) { 
                selectPin.style.width = Math.abs(newX - resX) + 'px';
                selectPin.style.left = resX - selectPin.clientWidth + 'px';
            }

            //CHECK FIRST IF SELECTING IS GOING TO THE LOWER DIRECTION
            if(newY > resY) {
                selectPin.style.top = resY + 'px';
                selectPin.style.height = Math.abs(newY - resY) + 'px';
            }
            else if(newY < resY) {
                selectPin.style.height = Math.abs(newY - resY) + 'px';
                selectPin.style.top = resY - selectPin.clientHeight + 'px';
            }

            if(selectPin.clientWidth > 2 && selectPin.clientHeight > 2) {
                selectPin.style.visibility = "visible";
            }

            cnvPin.style.cursor = `default !important`;
            
            let inputs = cnvPin.querySelectorAll('div');

            inputs.forEach(function(input) {

                input.style.cursor = `default`;

            })

            checkSelectedPin(); 

        })
    }
    else {

        let selectPin = document.getElementById('selectPin');
        
        selectPin.style.width = `0px`;
        selectPin.style.height = `0px`;
        selectPin.style.visibility = `hidden`;

        isSelecting = false;

    }
}
document.addEventListener('pointermove', selectingCanvasMove);

let oldPins = [];

function checkSelectedPin() {
    
    let selectPin = document.getElementById('selectPin');

    let configScroll = document.getElementsByClassName('configScroll');

    for(let f = 0; f < maxF; f++) {

        let pin = f2PinBody(f);

        if(pin != null && pin.dataset.lock == "unlock") {

            let panel = configScroll[5].querySelector(`[data-ref="${f}"]`);

            if(panel.querySelector('.btnShowHide').dataset.show == "visible") {

                if(pin.getBoundingClientRect().left < selectPin.getBoundingClientRect().right && pin.getBoundingClientRect().right > selectPin.getBoundingClientRect().left && pin.getBoundingClientRect().top < selectPin.getBoundingClientRect().bottom && pin.getBoundingClientRect().bottom > selectPin.getBoundingClientRect().top) {
                    
                    let canvas = f2Canvas(f);

                    if(!checkCanvasFocusBool(canvas)) {

                        canvas2Focus(canvas);  
                        
                        if(checkObjFocusCount() > 1) {
                            oldPins.push(f)
                        }
                        else {
                            oldPins = [];
                        }
                    }
                    
                }

                else {
                    
                    canvasUnfocus(f)
                    resetLeadDrag();

                    if(checkObjFocusCount() == 1) {
                        
                        oldPins = [];
                    }   
                }
            }
        }
    }

    if(checkObjFocusCount() > 1) {
        //WE DEDUCT 2 SINCE WE STARTED COUNTING MORE THAN 1 SELECTED
        //WE NEED TO GET TO ZERO FOR THE ARRAY VALUE
        let objFocus = checkObjFocusCount() - 2;
        let newF = oldPins[objFocus];
        let newPin = f2PinBody(newF);
        chooseLeadDrag(newPin);

    }
    
}

/////////////////////////////////PANELBOX HOVER AND OUT EFFECTS/////////////////////////////////

function hoverPanelBoxLayer(panel) {

    if(!checkPanelFocusBool(panel)) {

        if(!isDragging) {

            
            panel.style.background = "var(--sharp-track)";
            
        }
    }
}

function outPanelBoxLayer(panel) {

    if(!checkPanelFocusBool(panel)) {
   
        if(panel.dataset.type != "group") {
            panel.style.background = "transparent";
        }
        else {
            panel.firstElementChild.style.background = "transparent";
        }
    }
    
}

function positionCanvas(canvas) {

    let cnvMain = document.getElementById('cnvMain');

    let widthHalf = (canvas.clientWidth/2);
    let heightHalf = (canvas.clientHeight/2);

    canvas.style.left =  Math.abs(cnvMain.offsetLeft) + (cnvMain.offsetWidth/2) - widthHalf + 'px';
    canvas.style.top =  Math.abs(cnvMain.offsetTop) + (cnvMain.offsetHeight/2) - heightHalf + 'px';
 
}

cnvPin.addEventListener('dblclick', function(e) {
    if(e.target != cnvPin && e.target.className == "pinBody") {
        counter = 0;
        clearInterval(tmrDrag);
        tmrDrag = null;
    }
});

/////////////////////////////////////LAYER EFFECTS AND STYLES///////////////////////////////
function chooseLayerStyle() {

    let panel = this.closest(`[id*='pnlBox']`);

    if(this.innerText == "Outline") {
        if(panel.querySelector('.tabOutlineLayer') != null) panel.querySelector('.tabOutlineLayer').style.display = "block";
        if(panel.querySelector('.tabGlowLayer') != null) panel.querySelector('.tabGlowLayer').style.display = "none";
        if(panel.querySelector('.tabShadowLayer') != null) panel.querySelector('.tabShadowLayer').style.display = "none";
        showStyleOutline.call(this);

    }
    else if(this.innerText == "Glow") {

        if(panel.querySelector('.tabGlowLayer') != null) panel.querySelector('.tabGlowLayer').style.display = "block";
        if(panel.querySelector('.tabOutlineLayer') != null) panel.querySelector('.tabOutlineLayer').style.display = "none";
        if(panel.querySelector('.tabShadowLayer') != null) panel.querySelector('.tabShadowLayer').style.display = "none";
        showStyleGlow.call(this);

    }
    else if(this.innerText == "Shadow") {

        if(panel.querySelector('.tabShadowLayer') != null) panel.querySelector('.tabShadowLayer').style.display = "block";
        if(panel.querySelector('.tabOutlineLayer') != null) panel.querySelector('.tabOutlineLayer').style.display = "none";
        if(panel.querySelector('.tabGlowLayer') != null) panel.querySelector('.tabGlowLayer').style.display = "none";
        showStyleShadow.call(this);

    }
    else {

        if(panel.querySelector('.tabShadowLayer') != null) panel.querySelector('.tabShadowLayer').style.display = "none";
        if(panel.querySelector('.tabOutlineLayer') != null) panel.querySelector('.tabOutlineLayer').style.display = "none";
        if(panel.querySelector('.tabGlowLayer') != null) panel.querySelector('.tabGlowLayer').style.display = "none";
        this.closest('.pnlDrop').querySelector('h2').innerText = "Choose a Style";
        removeStyle();
    }
}
document.querySelectorAll('.optLayerStyleImage')
.forEach((opt) => {
    opt.addEventListener('pointerdown', chooseLayerStyle);
})
document.querySelectorAll('.optLayerStyleElement')
.forEach((opt) => {
    opt.addEventListener('pointerdown', chooseLayerStyle);
})

function removeStyle() {
    
    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {
                //children[1] is the shadow and glow
                if(canvas.children[0] != null) {
                    canvas.children[0].style.filter = "none";
                }

                //children[0] is the borderwidth
                canvas.children[0].style.borderWidth = "0px";

                canvas.children[0].style.left = 0 + 'px';
                canvas.children[0].style.top = 0 + 'px';
            }
            else if(type == "element") {
     
                if(canvas.children[0] != null) {
                    canvas.children[0].style.filter = "none";
                }

                //children[0] is the borderwidth
                canvas.children[0].style.borderWidth = "0px";

            }
            else if(type == "line") {
     
                if(canvas.children[0] != null) canvas.children[0].style.filter = "none";
                if(canvas.children[1] != null) canvas.children[1].style.filter = "none";
                if(canvas.children[2] != null) canvas.children[2].style.filter = "none";
                
                canvas.children[0].style.borderWidth = "0px";
                canvas.children[1].style.borderWidth = "0px";
                canvas.children[2].style.borderWidth = "0px";

            }
        }
    }

    //THE MASKED CLONE CARRIES THE SAME EFFECT
    focusPanel.forEach((panel) => maskImageBelow(panel));

    //THE IMAGE STROKE'S SEAM BAND FOLLOWS THE STROKE - SEE bleedFillLayers
    bleedFillLayers();
}

function showStyleOutline() {

    let panel = this.closest(`[id*='pnlBox']`);
    let txtOutlineSize = panel.querySelector('.txtOutlineSize').value * 2;
    let txtOutlineColor = panel.querySelector('.txtOutlineColor');
    let thumbPicker = txtOutlineColor.nextElementSibling;

    let rgb = hex2RGBStringEncoding(txtOutlineColor.value);
    let alpha = txtOutlineColor.dataset.alpha;
    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {

                let rgb = hex2RGBStringEncoding(txtOutlineColor.value);
                let alpha = txtOutlineColor.dataset.alpha;

                //remove other styles first
                canvas.children[0].style.filter = "none";

                canvas.children[0].style.left = 0 -  txtOutlineSize + 'px';
                canvas.children[0].style.top =  0 - txtOutlineSize + 'px';

                canvas.children[0].style.borderWidth = `${txtOutlineSize}px`;
                canvas.children[0].style.borderStyle = `solid`;
                canvas.children[0].style.borderColor = `rgba(${rgb}, ${alpha})`;

            }
            else if(type == "element") {

                let rgb = hex2RGBStringEncoding(txtOutlineColor.value);
                let alpha = txtOutlineColor.dataset.alpha;

                //remove other styles first
                canvas.querySelector('svg').style.filter = "none";

                //canvas.querySelector('svg').style.left = 0 -  txtOutlineSize + 'px';
                //canvas.querySelector('svg').style.top =  0 - txtOutlineSize + 'px';

                canvas.querySelector('svg').style.borderWidth = `${txtOutlineSize}px`;
                canvas.querySelector('svg').style.borderStyle = `solid`;
                canvas.querySelector('svg').style.borderColor = `rgba(${rgb}, ${alpha})`;
            }
        }
    }


    //THE MASKED CLONE CARRIES THE SAME EFFECT
    focusPanel.forEach((panel) => maskImageBelow(panel));

    //THE IMAGE STROKE'S SEAM BAND FOLLOWS THE STROKE - SEE bleedFillLayers
    bleedFillLayers();
}

function adjustStyleOutlineColor() {

    let panel = this.closest(`[id*='pnlBox']`);
    let txtOutlineColor = panel.querySelector('.txtOutlineColor');

    let rgb = hex2RGBStringEncoding(testHexCode(txtOutlineColor));
    let alpha = txtOutlineColor.dataset.alpha;

    let thumbPicker = txtOutlineColor.nextElementSibling;
    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {

                canvas.children[0].style.borderColor = `rgba(${rgb}, ${alpha})`;

            }
            else if(type == "element") {

                canvas.children[0].style.borderColor = `rgba(${rgb}, ${alpha})`;

            }
        }
    }


    //THE MASKED CLONE CARRIES THE SAME EFFECT
    focusPanel.forEach((panel) => maskImageBelow(panel));

    //THE IMAGE STROKE'S SEAM BAND FOLLOWS THE STROKE - SEE bleedFillLayers
    bleedFillLayers();
}

function adjustStyleOutlineSize() {

    let panel = this.closest(`[id*='pnlBox']`);
    let txtOutlineSize = panel.querySelector('.txtOutlineSize').value * 2;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {

                canvas.children[0].style.borderWidth = `${txtOutlineSize}px`;
    
                canvas.children[0].style.left = 0 -  txtOutlineSize + 'px';
                canvas.children[0].style.top =  0 - txtOutlineSize + 'px';
            }
            else if(type == "element") {

                canvas.children[0].style.borderWidth = `${txtOutlineSize}px`;
    
                canvas.children[0].style.left = 0 -  txtOutlineSize + 'px';
                canvas.children[0].style.top =  0 - txtOutlineSize + 'px';
            }
        }
    }


    //THE MASKED CLONE CARRIES THE SAME EFFECT
    focusPanel.forEach((panel) => maskImageBelow(panel));

    //THE IMAGE STROKE'S SEAM BAND FOLLOWS THE STROKE - SEE bleedFillLayers
    bleedFillLayers();
}

//===================================GLOW==================================

function showStyleGlow() {

    let panel = this.closest(`[id*='pnlBox']`);
    let txtGlowSpread = panel.querySelector('.txtGlowSpread').value;
    let txtGlowColor = panel.querySelector('.txtGlowColor');
    
    let rgb = hex2RGBStringEncoding(txtGlowColor.value);
    let alpha = txtGlowColor.dataset.alpha;

    let thumbPicker = txtGlowColor.nextElementSibling;
    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;

    let append = "";
    
    for(let b = 0; b < 360; b+=60) {

        if(b == 60 || b == 120) {
            
            let coorX = .01 * Math.cos(b * (Math.PI/ 180));
            let coorY = .01 * Math.sin(b * (Math.PI / 180));
            append += `drop-shadow(${Math.round(coorX)}px ${Math.round(coorY)}px ${txtGlowSpread / 5}px rgba(${rgb}, ${(txtGlowSpread/300)})) `;
            append += `drop-shadow(${Math.round(coorX)}px ${Math.round(coorY)}px ${txtGlowSpread / 5}px rgba(${rgb}, ${(txtGlowSpread/300)})) `;
        
        }
        else {

            let coorX = .01 * Math.cos(b * (Math.PI/ 180));
            let coorY = .01 * Math.sin(b * (Math.PI / 180));
            append += `drop-shadow(${Math.round(coorX)}px ${Math.round(coorY)}px ${txtGlowSpread / 5}px rgba(${rgb}, ${(txtGlowSpread/300)})) `;
        }
    }

    
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {

                ///////////////REMOVE FIRST OTHER EFFECTS//////////////
                //children[1] is the shadow and glow
                canvas.children[0].style.filter = "none";

                //children[0] is the borderwidth
                canvas.children[0].style.borderWidth = "0px";

                canvas.children[0].style.left = 0 + 'px';
                canvas.children[0].style.top = 0 + 'px';

                ////////////////NOW IMPLEMENT //////////////
                canvas.children[0].style.filter = append;
                canvas.dataset.borderOn = "false";
                
            }
            else if(type == "element") {

                canvas.children[0].style.filter = "none";

                //children[0] is the borderwidth
                canvas.children[0].style.borderWidth = "0px";

                ////////////////NOW IMPLEMENT //////////////
                canvas.children[0].style.filter = append;
                canvas.dataset.borderOn = "false";
            }

            else if(type == "line") {

                //THREE PARTS SINCE THERE'S LEFT/MID/RIGHT HEADS
                canvas.children[0].style.filter = "none";
                canvas.children[1].style.filter = "none";
                canvas.children[2].style.filter = "none";

                //children[0] is the borderwidth
                canvas.children[0].style.borderWidth = "0px";
                canvas.children[1].style.borderWidth = "0px";
                canvas.children[2].style.borderWidth = "0px";

                ////////////////NOW IMPLEMENT //////////////
                canvas.children[0].style.filter = append;
                canvas.children[1].style.filter = append;
                canvas.children[2].style.filter = append;

                canvas.dataset.borderOn = "false";
            }
        }
    }

    adjustBorder()


    //THE MASKED CLONE CARRIES THE SAME EFFECT
    focusPanel.forEach((panel) => maskImageBelow(panel));

    //THE IMAGE STROKE'S SEAM BAND FOLLOWS THE STROKE - SEE bleedFillLayers
    bleedFillLayers();
}

function adjustStyleGlowColor() {

    let panel = this.closest(`[id*='pnlBox']`)
    let txtGlowSpread = panel.querySelector('.txtGlowSpread').value;
    let txtGlowColor = panel.querySelector('.txtGlowColor');

    let rgb = hex2RGBStringEncoding(testHexCode(txtGlowColor));
    let alpha = txtGlowColor.dataset.alpha;

    let thumbPicker = txtGlowColor.nextElementSibling;
    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;

    let append = "";
    
    for(let b = 0; b < 360; b+=60) {

        if(b == 60 || b == 120) {
            
            let coorX = .01 * Math.cos(b * (Math.PI/ 180));
            let coorY = .01 * Math.sin(b * (Math.PI / 180));
            append += `drop-shadow(${Math.round(coorX)}px ${Math.round(coorY)}px ${txtGlowSpread/5}px rgba(${rgb}, ${(txtGlowSpread/300)})) `;
            append += `drop-shadow(${Math.round(coorX)}px ${Math.round(coorY)}px ${txtGlowSpread/5}px rgba(${rgb}, ${(txtGlowSpread/300)})) `;
        
        }
        else {

            let coorX = .01 * Math.cos(b * (Math.PI/ 180));
            let coorY = .01 * Math.sin(b * (Math.PI / 180));
            append += `drop-shadow(${Math.round(coorX)}px ${Math.round(coorY)}px ${txtGlowSpread/5}px rgba(${rgb}, ${(txtGlowSpread/300)})) `;
        }
    }
    
    for(let a = 0; a < focusPanel.length; a++) {

        if(focusPanel[a] != null) {

            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image" || type == "element") {
                canvas.children[0].style.filter = append;
            }
            else if(type == "line") {
               
                //THREE PARTS SINCE THERE'S LEFT/MID/RIGHT HEADS
                canvas.children[0].style.filter = append;
                canvas.children[1].style.filter = append;
                canvas.children[2].style.filter = append;
            }
        }
    }

    //THE MASKED CLONE CARRIES THE SAME EFFECT
    focusPanel.forEach((panel) => maskImageBelow(panel));
}

//===================================SHADOW==================================

function showStyleShadow() {

    let panel = this.closest(`[id*='pnlBox']`)
    let txtShadowColor = panel.querySelector('.txtShadowColor');
    let txtShadowSize = panel.querySelector('.txtShadowSize').value/2;
    let txtShadowSpread = panel.querySelector('.txtShadowSpread').value / 5;
    let txtShadowRotation = Number(panel.querySelector('.txtShadowRotation').value) + 90;
    
    let rgb = hex2RGBStringEncoding(txtShadowColor.value);
    let alpha = txtShadowColor.dataset.alpha;

    let thumbPicker = txtShadowColor.nextElementSibling;
    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;

    let append = "";
            
    let coorX = txtShadowSize * Math.cos(txtShadowRotation * (Math.PI/ 180));
    let coorY = txtShadowSize * Math.sin(txtShadowRotation * (Math.PI / 180));
    append += `drop-shadow(${Math.round(coorX)}px ${Math.round(coorY)}px ${txtShadowSpread}px rgba(${rgb}, ${alpha})) `;

    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {

                //children[1] is the shadow and glow
                canvas.children[0].style.filter = "none";

                //children[0] is the borderwidth
                canvas.children[0].style.borderWidth = "0px";

                canvas.children[0].style.left = 0 + 'px';
                canvas.children[0].style.top = 0 + 'px';

                //////////////////NOW ADD THE SHADOW//////////////

                canvas.dataset.borderOn = "false";

                canvas.children[0].style.filter = append;  
            }
            else if(type == "element") {

                //children[1] is the shadow and glow
                canvas.children[0].style.filter = "none";

                //children[0] is the borderwidth
                canvas.children[0].style.borderWidth = "0px";

                canvas.dataset.borderOn = "false";

                canvas.children[0].style.filter = append;  
            }
            else if(type == "line") {
                //THREE PARTS SINCE THERE'S LEFT/MID/RIGHT HEADS
                canvas.children[0].style.filter = "none";
                canvas.children[1].style.filter = "none";
                canvas.children[2].style.filter = "none";

                canvas.children[0].style.borderWidth = "0px";
                canvas.children[1].style.borderWidth = "0px";
                canvas.children[2].style.borderWidth = "0px";

                canvas.dataset.borderOn = "false";

                canvas.children[0].style.filter = append;
                canvas.children[1].style.filter = append;
                canvas.children[2].style.filter = append;
            }
        }
    }


    //THE MASKED CLONE CARRIES THE SAME EFFECT
    focusPanel.forEach((panel) => maskImageBelow(panel));

    //THE IMAGE STROKE'S SEAM BAND FOLLOWS THE STROKE - SEE bleedFillLayers
    bleedFillLayers();
}

function adjustStyleShadowColor() {

    let panel = this.closest(`[id*='pnlBox']`)
    let txtShadowColor = panel.querySelector('.txtShadowColor');
    let txtShadowSize = panel.querySelector('.txtShadowSize').value/2;
    let txtShadowSpread = panel.querySelector('.txtShadowSpread').value / 5;
    let txtShadowRotation = Number(panel.querySelector('.txtShadowRotation').value) + 90;
    
    let rgb = hex2RGBStringEncoding(testHexCode(txtShadowColor));
    let alpha = txtShadowColor.dataset.alpha;

    let thumbPicker = txtShadowColor.nextElementSibling;
    thumbPicker.children[1].style.background = `rgba(${rgb}, ${alpha})`;

    let append = "";

    let coorX = txtShadowSize * Math.cos(txtShadowRotation * (Math.PI/ 180));
    let coorY = txtShadowSize * Math.sin(txtShadowRotation * (Math.PI / 180));
    append += `drop-shadow(${Math.round(coorX)}px ${Math.round(coorY)}px ${txtShadowSpread}px rgba(${rgb}, ${alpha})) `;
    
    for(let a = 0; a < focusPanel.length; a++) {
        if(focusPanel[a] != null) {
            let f = Number(focusPanel[a].dataset.ref);
            let type = focusPanel[a].dataset.type;
            let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`)

            if(type == "image") {
                
                canvas.children[0].style.filter = append;

            }
            else if(type == "element") {

                canvas.children[0].style.filter = append;

            }
            else if(type == "line") {

                canvas.children[0].style.filter = append;
                canvas.children[1].style.filter = append;
                canvas.children[2].style.filter = append;

            }
        }
    }

    //THE MASKED CLONE CARRIES THE SAME EFFECT
    focusPanel.forEach((panel) => maskImageBelow(panel));
}


/////////////////////////////////////DRAG/////////////////////////////////

document.addEventListener('mousedown', (e) => {
    if(e.target.closest('#cnvPin')) {
        if(e.button == 0) {
            moveable.dragStart(e);
            
        }
        
    }
})

function moveableAttachDrag() {
    moveable
    .on('dragStart', ({}) => {
        isDragging = true;
        cnvPinRect = document.getElementById('cnvPin').getBoundingClientRect();

        setGestureCursor('drag', null, 0);
    })
    .on('drag', ({ target, transform, left, top, clientX, clientY }) => {

        if(clientX > cnvPinRect.left && clientX < cnvPinRect.right && clientY > cnvPinRect.top && clientY < cnvPinRect.bottom) {
            
            target.style.transform = transform;
            
            adjustCanvas2Pin(target, 'drag');
        }
        
    })
    .on('dragEnd', ({ target, isDrag }) => {
        if (isDrag) encodeBasicsFromCanvas('drag');
        isDragging = false;
        isResizing = false;
        isRotating = false;
        clearGestureCursor();

        //ONE RECONCILE PER GESTURE, SAME AS resizeEnd. THE DRAG MOVED THE PIN WITH A translate; THIS FOLDS IT INTO left / top
        //AND MOVEABLE RE-READS IT. WITHOUT IT A TEXT LAYER'S RE-SELECT (decodeData3 > adjustTextArea > adjustBorder) DID THE
        //FOLD BEHIND MOVEABLE'S BACK AND THE NEXT DRAG JUMPED BY THE LAST ONE'S DISTANCE (MEASURED 2026-10-04: +70, +130)
        adjustBorder();
    })
    .on('dragGroupStart', ({}) => {
        cnvPinRect = document.getElementById('cnvPin').getBoundingClientRect();
        isDragging = true;

        setGestureCursor('drag', null, 0);
    })
    .on('dragGroup', ({ events, clientX, clientY }) => {

            if(clientX > cnvPinRect.left && clientX < cnvPinRect.right && clientY > cnvPinRect.top && clientY < cnvPinRect.bottom) {
                events.forEach(({ target, transform, left, top }) => {
                    target.style.transform = transform;
                    adjustCanvas2Pin(target, 'drag')
                });
            }

    })
    .on('dragGroupEnd', ({ target, isDrag }) => {
        if (isDrag) encodeBasicsFromCanvas('drag');

        isDragging = false;
        isResizing = false;
        isRotating = false;

        clearGestureCursor();

        //SAME RECONCILE AS dragEnd
        adjustBorder();
    })

    /////////////////////////////////////RESIZE//////////////////////////////

    .on('resizeStart', ({target, inputEvent}) => {
        isResizing = true;
        cnvPinRect = document.getElementById('cnvPin').getBoundingClientRect();

        setGestureCursor('resize', inputEvent.target.dataset.direction, moveableBoxAngle());

        cnvPin.classList.add('isGesturing');
        cnvPin.dataset.handle = inputEvent.target.dataset.direction;

        //ONCE, HERE - NOT PER FRAME FROM INSIDE adjustCanvas
        if(target.dataset.type == "text") setTextFixedSize(Number(target.dataset.ref));

        //THE PIN'S PIN_MIN_PX PADDING AT THE START OF THE GESTURE - SEE pinPad
        pinPad = {};
        pinPad[target.dataset.ref] = pinPadding(cnvGrpLayers.querySelector(`[data-ref="${target.dataset.ref}"]`), canvasScale());
    })
    .on('resize', ({ target, drag, width, height, clientX, clientY, inputEvent }) => {

            if(clientX > cnvPinRect.left && clientX < cnvPinRect.right && clientY > cnvPinRect.top && clientY < cnvPinRect.bottom) {

                inputEvent.shiftKey ? moveable.keepRatio = true: moveable.keepRatio = false;


                let ls = canvasScale();
                let lcv = cnvGrpLayers.querySelector(`[data-ref="${target.dataset.ref}"]`);
                let lcs = getComputedStyle(lcv);

                let floorW = (parseFloat(lcs.minWidth)  || 0) * ls.x;
                let floorH = (parseFloat(lcs.minHeight) || 0) * ls.y;

                //width AND height ARE THE PIN'S. THE LAYER IS THE PIN LESS THE PADDING IT STARTED
                //WITH, AND THE FLOORS ARE THE LAYER'S, SO THE TEST IS ON THE LAYER
                let pad = pinPad[target.dataset.ref] || {w: 0, h: 0};
                let layerW = width - pad.w;
                let layerH = height - pad.h;

                if(target.dataset.type == "line") {

                    let mid = lcv.querySelector('.divLineMid');

                    if(mid != null) {


                        let midMin = parseFloat(getComputedStyle(mid).minWidth) || 0;

                        if(mid.offsetWidth <= midMin && width < target.offsetWidth) return;
                    }

                    if(layerW < floorW) return;
                }
                else {

                    if(layerW < floorW || layerH < floorH) return;
                }

                target.style.width = width  + 'px';

                if(target.dataset.type != "line") target.style.height = height + 'px';

                target.style.transform = drag.transform;
                adjustCanvas2Pin(target, 'resize', layerW, layerH)
            }

    })
    .on('resizeEnd', ({ target, isDrag }) => {
        if (isDrag) encodeBasicsFromCanvas('resize');

        let z = rngZoom.value / 100;
        isDragging = false;
        isResizing = false;
        isRotating = false;
        clearGestureCursor();

        //[!] BELOW THE CRAMPED THRESHOLD ONLY THE LAST HANDLE USED STAYS ON - THAT IS
        //WHAT THE USER GRABS TO SIZE BACK UP FROM THE FLOOR, WHICH IS WHY data-handle
        //IS DELIBERATELY LEFT SET.
        //
        //[!] THIS USED TO RE-DERIVE THE CRAMPED STATE HERE WITH ITS OWN RULE -
        //[!] `offsetWidth <= 80*z || offsetHeight <= 80*z` - A THIRD COPY WITH A THIRD
        //[!] THRESHOLD. A LINE'S SPINE IS 1px TALL, SO THAT || WAS ALWAYS TRUE AND EVERY
        //[!] HANDLE GOT HIDDEN THE MOMENT A DRAG ENDED, LEAVING ONLY THE ONE NAMED BY
        //[!] data-handle. ONE OWNER DECIDES THIS NOW: moveableUpdateCramped().
        cnvPin.classList.remove('isGesturing');

        //ONE RECONCILE PER GESTURE, NOT SIXTY. THE CLASS COMES OFF FIRST OR THIS BAILS ON
        //ITSELF, AND IT RUNS BEFORE moveableUpdateCramped SO THE CRAMPED TEST READS SETTLED
        //GEOMETRY
        adjustBorder();

        moveableUpdateCramped();
    })
    .on('resizeGroupStart', ({inputEvent}) => {
        cnvPinRect = document.getElementById('cnvPin').getBoundingClientRect();
        isResizing = true;

        //[!] A GROUP BOX IS AXIS ALIGNED, SO ITS HANDLES SIT AT ZERO
        setGestureCursor('resize', inputEvent.target.dataset.direction, moveableBoxAngle());

        cnvPin.classList.add('isGesturing');
        cnvPin.dataset.handle = inputEvent.target.dataset.direction;

        //moveableTargets() IS READ RATHER THAN THE EVENT PAYLOAD - IT COMES FROM focusObj AND
        //ALREADY DROPS LOCKED LAYERS
        moveableTargets().forEach((pin) => {
            if(pin.dataset.type == "text") setTextFixedSize(Number(pin.dataset.ref));
        });

        //THE PIN_MIN_PX PADDING OF EVERY PIN IN THE GROUP - SEE pinPad
        pinPad = {};
        moveableTargets().forEach((pin) => {
            pinPad[pin.dataset.ref] = pinPadding(cnvGrpLayers.querySelector(`[data-ref="${pin.dataset.ref}"]`), canvasScale());
        });
    })
    .on('resizeGroup', ({ events, clientX, clientY, target, inputEvent }) => {
        //if(isRAF) return;

        //isRAF = true;

        //requestAnimationFrame(() => {

            //isRAF = false;

            if(clientX > cnvPinRect.left && clientX < cnvPinRect.right && clientY > cnvPinRect.top && clientY < cnvPinRect.bottom) {

                inputEvent.shiftKey ? moveable.keepRatio = true: moveable.keepRatio = false;

                events.forEach(({ target, drag, width, height }) => {

                    //THE LAYER IS THE PIN LESS ITS STARTING PADDING - SEE THE SINGLE resize
                    let pad = pinPad[target.dataset.ref] || {w: 0, h: 0};

                    target.style.width  = width  + 'px';
                    target.style.height = height + 'px';
                    target.style.transform = drag.transform;
                    adjustCanvas2Pin(target, 'resize', width - pad.w, height - pad.h)
                });
            }
        //});
    })
    .on('resizeGroupEnd', ({ target, isDrag }) => {
        if (isDrag) encodeBasicsFromCanvas('resize');

        let z = rngZoom.value / 100;
        isDragging = false;
        isResizing = false;
        isRotating = false;
        clearGestureCursor();

        //[!] BELOW THE CRAMPED THRESHOLD ONLY THE LAST HANDLE USED STAYS ON - THAT IS
        //WHAT THE USER GRABS TO SIZE BACK UP FROM THE FLOOR, WHICH IS WHY data-handle
        //IS DELIBERATELY LEFT SET.
        //
        //[!] THIS USED TO RE-DERIVE THE CRAMPED STATE HERE WITH ITS OWN RULE -
        //[!] `offsetWidth <= 80*z || offsetHeight <= 80*z` - A THIRD COPY WITH A THIRD
        //[!] THRESHOLD. A LINE'S SPINE IS 1px TALL, SO THAT || WAS ALWAYS TRUE AND EVERY
        //[!] HANDLE GOT HIDDEN THE MOMENT A DRAG ENDED, LEAVING ONLY THE ONE NAMED BY
        //[!] data-handle. ONE OWNER DECIDES THIS NOW: moveableUpdateCramped().
        cnvPin.classList.remove('isGesturing');

        //ONE RECONCILE PER GESTURE, NOT SIXTY. THE CLASS COMES OFF FIRST OR THIS BAILS ON
        //ITSELF, AND IT RUNS BEFORE moveableUpdateCramped SO THE CRAMPED TEST READS SETTLED
        //GEOMETRY
        adjustBorder();

        moveableUpdateCramped();
    })

    ///////////////////////////////////////ROTATE//////////////////////////////
    .on('rotateStart', ({target, inputEvent}) => {
        isRotating = true;
        cnvPinRect = document.getElementById('cnvPin').getBoundingClientRect();

        //[!] PLAIN 'grab' FOR THE WHOLE ROTATION - ONE CURSOR, SET ONCE. THE CUSTOM
        //ARC COMES BACK ON RELEASE VIA repaintHandleCursors()
        setGestureCursor('grab', null, 0);

        cnvPin.classList.add('isGesturing');
        cnvPin.dataset.handle = inputEvent.target.dataset.direction;
    })
    .on('rotate', ({ target, drag, rotation, inputEvent }) => {

        //if(isRAF) return;

        //isRAF = true;

        //requestAnimationFrame(() => {

            //isRAF = false;

            inputEvent.shiftKey? moveable.throttleRotate = 15: moveable.throttleRotate = 0;

            let rotated = ((Math.round(rotation) % 360) + 360) % 360;

            target.style.transform = drag.transform.replace(/rotate\(-?[\d.]+deg\)/, `rotate(${rotated}deg)`);
            target.dataset.rotation = rotated;

            adjustCanvas2Pin(target, 'rotate', rotated);
        //});
    })
    .on('rotateEnd', ({ target, isDrag }) => {
        if (isDrag) encodeBasicsFromCanvas('rotate');

        
        isDragging = false;
        isResizing = false;
        isRotating = false;

        clearGestureCursor();

        repaintHandleCursors(moveableBoxAngle());

        cnvPin.classList.remove('isGesturing');
        adjustBorder();
    })

    .on('rotateGroupStart', ({inputEvent}) => {
        isRotating = true;
        cnvPinRect = document.getElementById('cnvPin').getBoundingClientRect();

        setGestureCursor('grab', null, 0);

        cnvPin.classList.add('isGesturing');
        cnvPin.dataset.handle = inputEvent.target.dataset.direction;
    })
    .on('rotateGroup', ({ events, rotation, inputEvent }) => {

        //if(isRAF) return;

        //isRAF = true;

        //requestAnimationFrame(() => {

            //isRAF = false;
            inputEvent.shiftKey? moveable.throttleRotate = 15: moveable.throttleRotate = 0;

            events.forEach(({ target, drag, rotation }) => {

                let rotated = ((Math.round(rotation) % 360) + 360) % 360;

                target.style.transform = drag.transform.replace(/rotate\(-?[\d.]+deg\)/, `rotate(${rotated}deg)`);
                target.dataset.rotation = rotated;

                adjustCanvas2Pin(target, 'rotate', rotated)
            });
        //})
    })
    .on('rotateGroupEnd', ({ target, isDrag }) => {
        if (isDrag) encodeBasicsFromCanvas('rotate');
        isDragging = false;
        isResizing = false;
        isRotating = false;

        clearGestureCursor();

        repaintHandleCursors(moveableBoxAngle());

        cnvPin.classList.remove('isGesturing');
        adjustBorder();
    })
}
moveableAttachDrag();

function adjustCanvas2Pin(pin, event, width, height) {

    //THE SAME SCALE adjustBorder PLACES THE PIN WITH. THE SLIDER'S z MADE A DRAG OR RESIZE AT 33% WRITE A SLIGHTLY OFF SIZE AND PLACE
    let s = canvasScale();
    let f = pin.dataset.ref;
    let canvas = cnvGrpLayers.querySelector(`[data-ref="${f}"]`);
    
    if(event == "drag") {
       
        let pr = pin.getBoundingClientRect();
        let gr = cnvGrpLayers.getBoundingClientRect();

        let cx = (pr.left + pr.width  / 2 - gr.left) / s.x;
        let cy = (pr.top  + pr.height / 2 - gr.top ) / s.y;

        canvas.style.left = (cx - canvas.offsetWidth  / 2) + 'px';
        canvas.style.top  = (cy - canvas.offsetHeight / 2) + 'px';
    }
    else if(event == "rotate") {
        
        let rotation = width;
        let pr = pin.getBoundingClientRect();
        let gr = cnvGrpLayers.getBoundingClientRect();

        let cx = (pr.left + pr.width  / 2 - gr.left) / s.x;
        let cy = (pr.top  + pr.height / 2 - gr.top ) / s.y;

        canvas.style.left = (cx - canvas.offsetWidth  / 2) + 'px';
        canvas.style.top  = (cy - canvas.offsetHeight / 2) + 'px';

        //THE ANGLE IS THE SAME NUMBER THE PIN CARRIES. applyLayerTransform KEEPS THE FLIP ON TOP
        canvas.dataset.rotation = rotation;
        applyLayerTransform(canvas);
    }

    else if(event == "resize") {
        
        let pr = pin.getBoundingClientRect();
        let gr = cnvGrpLayers.getBoundingClientRect();
        let cx = (pr.left + pr.width  / 2 - gr.left) / s.x;
        let cy = (pr.top  + pr.height / 2 - gr.top ) / s.y;
    
        canvas.style.width = width / s.x + 'px';

        if(canvas.dataset.type != "line") canvas.style.height = height / s.y + 'px';

        adjustCanvas(canvas);

        canvas.style.left = (cx - canvas.offsetWidth  / 2) + 'px';
        canvas.style.top  = (cy - canvas.offsetHeight / 2) + 'px';
    }

    let leadF = leadDrag.dataset.ref;
    let leadCanvas = cnvGrpLayers.querySelector(`[data-ref="${leadF}"]`);

    adjustBasicsFromCanvas(leadCanvas, pin)
    maskImageBelow(f2Panel(f))
}