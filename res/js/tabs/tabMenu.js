
//=============TOOLBOX CONTROLS===============

let tool = document.getElementsByClassName('tool');
const toolmenu = document.getElementById('toolmenu');

function hoverTool() {

    if(this.id == "toolWondr") {
        document.getElementById(this.id).children[0].style.filter = "saturate(2) brightness(1.1)";
    }
    else {
        document.getElementById(this.id).children[0].style.filter = "saturate(1) brightness(1.5)";
    }
    
}

function leaveTool() {

    document.getElementById(this.id).children[0].style.filter = "none";
}

function clickTool() {
    showToolMenu(this.id)
}

function addControlTool() {
    for(let a=0; a < tool.length; a++) {
        tool[a].addEventListener('click', clickTool)
        tool[a].addEventListener('pointerover', hoverTool)
        tool[a].addEventListener('pointerleave', leaveTool)
    }
}
addControlTool()

//===============TOOLMENU CONTROLS==============

function hideToolMenu() {

    //read controls to tool
    addControlTool()

    //reset the tools color to default
    for(let a=0; a< tool.length; a++) {
        tool[a].style.backgroundColor = "transparent";
        tool[a].children[0].style.filter = "none";
    }

      //hide toolmenu
    toolmenu.style.visibility = "none";
    toolmenu.style.transform = `translateX(-${toolmenu.offsetWidth}px)`;
    toolmenu.style.boxShadow = "none";
    toolbox.style.boxShadow = "none";

}

function escToolMenu(e) {
    
    if(e.key == 'Escape') {

        if(checkInputFocus()) {
            document.activeElement.blur();
            highlight = false;
            return;
        }

        e.preventDefault();

        // ONE Escape UNDOES ONE THING, INNERMOST FIRST. THIS USED TO RUN ALL FOUR
        //TEARDOWNS ON A SINGLE KEYPRESS, SO CANCELLING AN EYEDROPPER ALSO CLOSED EVERY
        //MENU AND THE LEFT PANEL. EACH RUNG RETURNS

        //1. A SWAP MODE. FIRST AND RETURNING, SO ESCAPE CANCELS THE MODE WITHOUT ALSO
        //RUNNING hideToolMenu IN THE SAME KEYPRESS
        if(swapMode) {
            cancelSwap();
            return;
        }

        //2. THE EYEDROPPER
        if(isColorPicking) {
            hideColorManagerPanel();
            return;
        }

        //3. THE COLOR PANELS. NOT ONE OF SIR'S FOUR STEPS - IT ONLY PRESERVES THE
        //escColorPickerPanel LISTENER THAT WAS REMOVED FROM colorPicker.js, WHICH USED TO
        //CLOSE THESE ON ANY Escape. DELETE THIS RUNG IF Escape SHOULD LEAVE THEM OPEN
        if(colorPickerPanel.dataset.show == "true" || colorManagerPanel.dataset.show == "true") {
            hideColorManagerPanel();
            return;
        }

        //4. EITHER CONTEXT MENU. ALL THREE DEFAULT TO opacity 0 IN workarea.css AND THE
        //CODE TOGGLES INLINE opacity TO 1 TO SHOW THEM, WHICH context.js ALREADY READS
        if(document.getElementById('rcCanvas').style.opacity == '1'
        || document.getElementById('rcCanvas2').style.opacity == '1'
        || document.getElementById('rcPanel').style.opacity == '1') {

            hideAllContextMenu();
            return;
        }

        //5. ANY OPEN DROPDOWN OR SEARCH LIST. getComputedStyle, NOT style.display - THE
        //LISTS ARE HIDDEN BY THE STYLESHEET, SO INLINE display IS EMPTY BEFORE ANYTHING IS
        //CLICKED AND AN INLINE TEST WOULD REPORT EVERY LIST AS OPEN ON A FRESH PAGE
        let isDropVisible = false;

        document.querySelectorAll(`[class*='dropOption']`).forEach((opt) => {
            if(getComputedStyle(opt).display != "none") isDropVisible = true;
        })

        if(isDropVisible) {
            hideAllOptions();
            return;
        }

        //6. NOTHING ELSE WAS OPEN, SO THE LEFT MENU GOES
        hideToolMenu();
    }
}
document.addEventListener('keydown', escToolMenu)

function showToolMenu(id) {

    addControlTool();

    for(let a=0; a< tool.length; a++) {
        tool[a].style.backgroundColor = "transparent";
        tool[a].children[0].style.filter = "none";
    }
    

    document.getElementById(id).style.backgroundColor = "var(--accent)";
    document.getElementById(id).children[0].style.filter = "saturate(0) brightness(2)";
    
    document.getElementById(id).removeEventListener('pointerover', hoverTool);
    document.getElementById(id).removeEventListener('pointerleave', leaveTool);

    toolmenu.style.visibility = "visible";
    toolmenu.style.transform = `translateX(${0}px)`;
    toolmenu.style.boxShadow = "1px 5px 5px 5px rgba(0,0,0,.2)";
    
    appendMenu(id) //will append actual menu elements based on ID
}

function appendMenu(id) {
    id = id.substring(4);

    let menu = document.querySelectorAll('.menu');

    for(let a = 0; a < menu.length; a++) {
        menu[a].style.display = "none";
    }
    
    document.getElementById('menu' + id).style.display = "block";
}
