var highlightClassArray = [];
var svgLineHolder = createAndAppendSVGcontainer(); //make this conditional
function createAndAppendSVGcontainer() {
    var svgLineHolder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgLineHolder.style.position = "absolute";
    svgLineHolder.style.left = "0";
    svgLineHolder.style.top = "0";
    svgLineHolder.style.zIndex = "-1";
    svgLineHolder.style.width = "1000vw";
    svgLineHolder.style.height = "1000vh";
    svgLineHolder.id = "svgLineHolder";
    document.querySelector('body').append(svgLineHolder)
    return svgLineHolder
}
var mainSection = document.querySelector("main");
var highlightOptionsMenu = document.getElementById("highlightOptionsMenu");
var inputId = document.getElementById("inputId");
var classNodeSelectDrpDwn = document.getElementById('classNameList');
classNodeSelectDrpDwn.addEventListener('change', function handleChange(e) {
    inputId.value = classNodeSelectDrpDwn.options[classNodeSelectDrpDwn.selectedIndex].text;
})
var colorSelectDrpDwn = document.getElementById('highlightColor');
colorSelectDrpDwn.addEventListener('change', function handleChange(e) {
    colorSelectDrpDwn.style.backgroundColor = colorSelectDrpDwn.value;
})

var textChanger = document.getElementById("textchanger")

//Window Eventlistner
var userSelection;
var selectedTextRange;
var selectionsParent;

function commentaryEventlistner() {
    mainSection.addEventListener('mouseover', (e) => {
        /* FOR COMMENTARY SHOWING AND HIDING */
        if (e.target.classList.contains('commented')) {
            console.log(e.target)
        }
    })
}
mainSection.addEventListener('mouseup', (e) => {
    userSelection = window.getSelection();
    selectedTextRange = userSelection.getRangeAt(0);
    mainSection = document.querySelector("main");
})
mainSection.addEventListener('mouseup', (e) => {
    // selectionsParent = selectedTextRange.commonAncestorContainer.parentNode;
    // console.log(selectedTextRange.endContainer);//gets all the text in the selected range
    // console.log(selectedTextRange.startContainer);//gets all the text in the selected range
    // console.log(selectedTextRange.endOffset);//gets all the text in the selected range
    //console.log(selectionsParent); //gets all the text in the selected range
    var clickedElm = e.target;

    //Hide menu on click away fromm it and a highlighted span
    if ((!clickedElm.matches(".highlight,.hlsection")) && (!clickedElm.parentNode.matches(".hlsection"))) {
        highlightOptionsMenu.style.left = '-1000px'; //so that the width can be calculated
        // document.querySelector("#highlightOptionsMenu").style.left = '-1000px'; //so that the width can be calculated
    }
}, false)
mainSection.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    userSelection = window.getSelection();
    selectedTextRange = userSelection.getRangeAt(0);
    selectionsParent = selectedTextRange.commonAncestorContainer.parentNode;
    var rightClickElm = e.target;

    if ((rightClickElm.matches('span.highlight')) || (doesAhaveElmOfClassBasAncestor(selectionsParent, 'highlight'))) {
        if (selectedTextRange.collapsed) {
            disableButton('hlsection.highlightedmodifier', true)
        } else if (!selectedTextRange.collapsed) {
            disableButton('hlsection.highlightedmodifier', false)
        }
        disableButton('hlsection.onlyforgrouped', false)
        disableButton('hlsection.forhighlightspanandnonecollapsedselection', false)
    } else if ((!rightClickElm.matches('span.highlight')) && (!doesAhaveElmOfClassBasAncestor(selectionsParent, 'highlight'))) {
        if (selectedTextRange.collapsed) {
            disableButton('hlsection.notcollapsedselection', true)
            disableButton('hlsection.forhighlightspanandnonecollapsedselection', true)
        } else if (!selectedTextRange.collapsed) {
            disableButton('hlsection.notcollapsedselection', false)
            disableButton('hlsection.forhighlightspanandnonecollapsedselection', false)
        }
        disableButton('hlsection.onlyforgrouped', true)
    }

    // FOR SHOWING AND HIDING THE RIGHTCLICK MENU
    // if ((rightClickElm.tagName.toUpperCase() == 'SPAN') || (doesAhaveElmOfClassBasAncestor(rightClickElm, 'highlight')) || (!selectedTextRange.collapsed)) {
    var menusWidth = highlightOptionsMenu.offsetWidth;
    var menusX = e.x;
    if (window.innerWidth - menusX < menusWidth) {
        menusX = window.innerWidth - menusWidth - 15
        // menusX = selectedTextRange.getClientRects()[0].right - menusWidth + 5
    }
    var menusHeight = highlightOptionsMenu.offsetHeight;
    var menusY = selectedTextRange.getClientRects()[0].bottom + 5;
    if (window.innerHeight - menusY < menusHeight) {
        menusY = selectedTextRange.getClientRects()[0].top - menusHeight - 5
    }
    highlightOptionsMenu.style.left = menusX + window.scrollX + "px";
    highlightOptionsMenu.style.top = menusY + window.scrollY + "px";
    /* } else {
        // highlightOptionsMenu.style.display = 'none';
        highlightOptionsMenu.style.left = '-1000px'; //so that the width can be calculated
    } */

}, false);
window.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {
        highlightOptionsMenu.style.left = '-1000px'; //so that the width can be calculated
    }
});

//Connects all span highlight elements on pageload
if (highlightedElements = document.querySelectorAll("span.highlight")) {
    highlightedElements.forEach(cl => {
        var classNames = cl.classList;
        classNames.forEach(clName => {
            if (clName.startsWith('hl_')) { //highlight class starts with 'hl_'
                // var spansClass = cl.classList[1] //highlight span belongs to only one highlight class
                var spansClass = clName
                if (!highlightClassArray.includes(spansClass)) {
                    highlightClassArray.push(spansClass)
                    //Create class dropdown list
                    var classOption = document.createElement("option");
                    classOption.value = spansClass.substring(3);
                    classOption.innerText = spansClass.substring(3);
                    classNodeSelectDrpDwn.append(classOption)
                }
            }
        })
    });
    realine()
}

/* MAIN FUNCTION */
function highlightClass(className) {
    // Get higlight className and backgroundColor
    if (classInputVal = inputId.value) {
        let colorVal = document.getElementById("highlightColor").value;
        console.log(colorVal)
        //Create the span highlight element
        var spanElement = document.createElement("span");
        spanElement.classList.add("highlight");
        spanElement.setAttribute("title", classInputVal);
        var classInputVal_HL = "hl_" + classInputVal;
        spanElement.classList.add(classInputVal_HL);
        spanElement.style.backgroundColor = colorVal;
        spanElement.style.border = "1px solid grey";

        //Add highlight className to the highlightClassArray if not already present
        if (!highlightClassArray.includes(classInputVal_HL)) {
            highlightClassArray.push(classInputVal_HL)
            //Create class dropdown list
            var classOption = document.createElement("option");
            // classOption.setAttribute("value", classInputVal);
            classOption.value = classInputVal;
            classOption.innerText = classInputVal;
            classNodeSelectDrpDwn.append(classOption)
        }
        //Get selected text
        if (!selectedTextRange.collapsed) { //make sure something is selected
            //Wrap selected text in spanElement
            selectedTextRange.surroundContents(spanElement);
            var highlightClass = document.querySelectorAll("span." + classInputVal_HL)
            //(Re-)Append connecting lines
            reAppendLines(highlightClass, classInputVal_HL, colorVal)
        }
    } else {
        alert("Please type or select a class name!")
    }
}

function reAppendLines(highlightClass, classInputVal_HL, colorVal) {
    if (highlightClass.length > 1) {
        //Remove any svg line element with the same class\
        svgHighlightLine = document.querySelectorAll("svg ." + classInputVal_HL)
        svgHighlightLine.forEach(connectLine => {
            connectLine.remove()
        });
        for (i = 0; i < highlightClass.length - 1; i++) {
            x1 = highlightClass[i].getClientRects()[0].x + window.scrollX + 2;
            y1 = highlightClass[i].getClientRects()[0].y + window.scrollY + 2;
            x2 = highlightClass[i + 1].getClientRects()[0].x + window.scrollX + 2;
            y2 = highlightClass[i + 1].getClientRects()[0].y + window.scrollY + 2;
            createConnectingLine(x1, y1, x2, y2, classInputVal_HL, colorVal)
        }
    }
}

function realine() {
    if (highlightClassArray.length > 0) {
        highlightClassArray.forEach(spanClass => {
            var highlightClass = document.querySelectorAll("span." + spanClass)
            var colorVal = highlightClass[0].style.backgroundColor;
            var svgHighlightLine = document.querySelectorAll("svg ." + spanClass)
            svgHighlightLine.forEach(connectLine => {
                connectLine.remove()
            });
            if (highlightClass.length > 1) {
                for (i = 0; i < highlightClass.length - 1; i++) {
                    x1 = highlightClass[i].getClientRects()[0].x + window.scrollX + 2;
                    y1 = highlightClass[i].getClientRects()[0].y + window.scrollY + 2;
                    x2 = highlightClass[i + 1].getClientRects()[0].x + window.scrollX + 2;
                    y2 = highlightClass[i + 1].getClientRects()[0].y + window.scrollY + 2;
                    createConnectingLine(x1, y1, x2, y2, spanClass, colorVal)
                }
            }
        });
    }
}


function createConnectingLine(x1, y1, x2, y2, highlight_class, colorVal) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute("stroke", colorVal)
    newLine.setAttribute("stroke-width", "1.5")
    newLine.setAttribute("opacity", "1")
    newLine.classList.add(highlight_class);
    svgLineHolder.append(newLine);

}

window.addEventListener('resize', realine);

/* MODIFY */
//CHANGE COLOR OF CLASS
function changeNodeColor(changeAll) {
    let colorVal = document.getElementById("highlightColor").value; //Get selected text
    if (selectionsParent.classList.contains("highlight")) {
        if (changeAll == 0) {
            selectionsParent.style.backgroundColor = colorVal;
        } else {
            var classNames = selectionsParent.classList;
            classNames.forEach(classInputVal_HL => {
                if (classInputVal_HL.startsWith('hl_')) {
                    allInClass = document.querySelectorAll("span." + classInputVal_HL)
                    allInClass.forEach(elm => {
                        elm.style.backgroundColor = colorVal;
                    });
                    reAppendLines(allInClass, classInputVal_HL, colorVal)
                }
            })
        }
    }
}


//REPLACE SELECTED TEXT
function changeSelectedText() {
    var tempElm = document.createElement("span");
    tempElm.classList.add("destroy");
    selectedTextRange.surroundContents(tempElm)
    var newText = textChanger.value;
    tempElm.replaceWith(newText)
}
/* function modifiedSurroundContents(tag) {
    let range = new Range()
    range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
    range.setEnd(userSelection.focusNode, userSelection.focusOffset);
    let newNode = document.createElement(tag);
    let content = range.cloneContents();
    newNode.append(content);
    range.insertNode(newNode);
    // console.log(newNode.querySelectorAll("*"))
} */

function modifiedSurroundContents(tag) { //not good. strips the nodes of their previous parents
    let range = new Range()
    range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
    range.setEnd(userSelection.focusNode, userSelection.focusOffset);
    let content = range.extractContents();

    function modifyAllDescendantTextNodes(nodesCollection) {
        for (let i = nodesCollection.childNodes.length; i > 0; i--) {
            var currentContent = nodesCollection.childNodes[i - 1];
            let newNode = document.createElement(tag);
            newNode.classList.add("temporary");
            // console.log(currentContent.nodeType === Node.ELEMENT_NODE)
            // if (currentContent.nodeType === Node.TEXT_NODE) {
            newNode.append(currentContent);
            range.insertNode(newNode);
            // }
        }
    }
    modifyAllDescendantTextNodes(content)

    // Look for <strong> elements with child
    // var allTemporary = document.querySelectorAll(".temporary")

    correctNestingForStrongnEm()

    function correctNestingForStrongnEm() {
        if (document.querySelector(".temporary")) {
            var allTemporary = document.querySelectorAll(".temporary")
            allTemporary.forEach(temp => {
                if (childContent = temp.querySelector("*:not(em)")) {
                    console.log(temp)

                    range = new Range()
                    range.selectNodeContents(childContent); //<SPAN> the content of <strong>.temp
                    let content_01 = range.extractContents(); //extract <span>
                    console.log(content_01); //<span> content
                    let newNode = document.createElement(tag);
                    newNode.classList.add("temporary");
                    newNode.append(content_01);
                    range.insertNode(newNode);

                    range = new Range()
                    range.selectNodeContents(temp);
                    let content_02 = range.extractContents();
                    temp.remove()
                    range.insertNode(content_02)

                } else {
                    temp.classList.remove("temporary")
                }
            });
        }
    }
    correctNestingForStrongnEm()
}

function boldCommand() {
    if ((!selectedTextRange.collapsed) && (selectionsParent.tagName.toUpperCase() != "STRONG") && (selectionsParent.parentNode.tagName.toUpperCase() != "STRONG")) {
        modifiedSurroundContents('strong')
    }
}

function italicCommand() {
    if ((!selectedTextRange.collapsed) && (selectionsParent.tagName.toUpperCase() != "EM") && (selectionsParent.parentNode.tagName.toUpperCase() != "EM")) {
        modifiedSurroundContents('em')
    }
}
//FIND AND HIGHLIGHT ALL INSTANCES OF SELECTED TEXT
function findAllSelectAndFormat(format) {
    // var oldString = userSelection.toString();
    var oldString = userSelection;
    var oldStringRegex = new RegExp(oldString, "g");
    var newString;
    if ((format == "strong") && (selectionsParent.tagName.toUpperCase() != "STRONG") || (selectionsParent.parentNode.tagName.toUpperCase() != "STRONG")) {
        newString = `<strong>` + oldString + `</strong>`;
        // rep(oldStringRegex, newString);
        // oldStringRegex.replaceWith(newString);
    } else if ((format == "em") && (selectionsParent.tagName.toUpperCase() != "EM") || (selectionsParent.parentNode.tagName.toUpperCase() != "EM")) {
        newString = `<em>` + oldString + `</em>`;
        // rep(oldStringRegex, newString);
        // oldStringRegex.replaceWith(newString);
    }
    //somehow, this makes the highlightOptionsMenu no longer live, and so I reasign the variable below
    highlightOptionsMenu = document.getElementById("highlightOptionsMenu")
}

/* UN-HIGLIGHT */
function unHighlight() {
    if ((selectionsParent.classList.contains("highlight")) || (selectionsParent = doesAhaveElmOfClassBasAncestor(selectionsParent, 'highlight'))) {
        var allContents = selectionsParent.childNodes;
        var sp = selectionsParent;
        for (let i = allContents.length; i > 0; i--) {
            selectionsParent.after(allContents[i - 1]);
            console.log(i - 1)
        }
        selectionsParent.remove()
        var colorVal = selectionsParent.style.backgroundColor;

        var classNames = selectionsParent.classList;
        classNames.forEach(classInputVal_HL => {
            if (classInputVal_HL.startsWith('hl_')) {
                allInClass = document.querySelectorAll("span." + classInputVal_HL)
                reAppendLines(allInClass, classInputVal_HL, colorVal)
                if (allInClass.length == 1) {
                    document.querySelector("line." + classInputVal_HL).remove()
                } //remove connecting last line
            }
        })
    }
}
/* COMMENTARY APPENDER */
commentaryEventlistner()
function appendComment() {
    let commentNode = document.createElement('code');
    commentNode.innerHTML = commentarybox.value;
    // commentNode.style.display = 'block';
    commentNode.classList.add('commentary');
    commentNode.style.backgroundColor = '#00FA9A';

    let commentedSpan = document.createElement('span');
    commentedSpan.classList.add('commented');
    commentedSpan.style.borderBottom = '1px solid black';
    let content = selectedTextRange.extractContents();
    selectedTextRange.insertNode(commentNode); //first replace the selected range with the commentNode then
    commentedSpan.append(content)
    // selectedTextRange.insertNode(content);//insert the previous content before the commentNode
    selectedTextRange.insertNode(commentedSpan);
}


/* RegEX REPLACE WORD */
function rep(oldString, newString) {
    document.body.innerHTML =
        mainSection.innerHTML
        .replace(oldString, newString);
}
// rep(/Jesus/g, "<strong>Hi</strong>") //will replace all "Jesus" with "<strong>Hi</strong>"


/* HELPER FUNCTIONS */

function doesAhaveElmOfClassBasAncestor(a, ancestorsClass, limit = 'BODY') {
    while (a.parentNode.tagName.toUpperCase() != limit) {
        if (a.parentNode.classList.contains(ancestorsClass)) {
            return a.parentNode
        }
        a = a.parentNode;
    }
    return false
}

function hideORshowClass(hideOrShow, cls) {
    if (hideOrShow.toUpperCase() == 'HIDE') {
        var class2hide = document.querySelectorAll('.' + cls);
        class2hide.forEach(el => {
            el.style.display = 'none'
        });
    } else if (hideOrShow.toUpperCase() == 'SHOW') {
        var class2show = document.querySelectorAll('.' + cls);
        class2show.forEach(el => {
            el.style.display = ''
        });
    }
}

function disableButton(cls, disableValue) {
    var class2toggleAttribute = document.querySelectorAll('.' + cls);
    class2toggleAttribute.forEach(el => {
        el.disabled = disableValue;
        if (disableValue) {
            el.style.pointerEvents = 'none';
            el.style.color = 'grey';
            el.style.fontStyle = 'italic';
        } else if (!disableValue) {
            el.style.pointerEvents = '';
            el.style.color = '';
            el.style.fontStyle = '';
        }
    });
}

function hideORshowID(hideOrShow, id) {
    if (hideOrShow.toUpperCase() == 'HIDE') {
        var id2hide = document.querySelectorAll('#' + id);
        id2hide.forEach(el => {
            el.style.display = 'none'
        });
    } else if (hideOrShow.toUpperCase() == 'SHOW') {
        var id2show = document.querySelectorAll('#' + id);
        id2show.forEach(el => {
            el.style.display = ''
        });
    } else {
        id = hideOrShow
        var id2toggle = document.querySelector('#' + id);
        console.log(id2toggle.style.display)
        if (id2toggle.style.display == "none") {
            id2toggle.style.display = "block";
        } else {
            id2toggle.style.display = "none";
        }
    }
}

/* SAVE FILE WITH FILESAVER */
function savefile(x) {
    var what2save = document.querySelector(x).outerHTML
    // any kind of extension (.txt,.cpp,.cs,.bat)
    console.log(what2save)
    var filename = document.querySelector("head>title").innerText + ".html";

    var blob = new Blob([what2save], {
        type: "text/plain;charset=utf-8"
    });

    saveAs(blob, filename);
}
/* CONTENT-EDITABLE */
var btnhlscontentedit = document.getElementById('btnhlscontenteditable')
var btnfootcontentedit = document.getElementById('btnfootcontenteditable')

function makeContentEditable(yesORno) {
    if (mainSection.contentEditable == 'false') {
        mainSection.contentEditable = "true";
        btnhlscontentedit.innerText = "Stop Edit"
        btnfootcontentedit.innerText = "Stop Edit"
        btnhlscontentedit.value = "Make page uneditable"
        btnfootcontentedit.value = "Make page uneditable"
    } else {
        mainSection.contentEditable = "false"
        btnhlscontentedit.innerText = "Edit Page"
        btnfootcontentedit.innerText = "Edit Page"
        btnhlscontentedit.value = "Make page editable"
        btnfootcontentedit.value = "Make page editable"
    }
}

/* document.onselectionchange = function() {
    let selection = document.getSelection();
    cloned.innerHTML = astext.innerHTML = "";
    // Clone DOM nodes from ranges (we support multiselect here)
    for (let i = 0; i < selection.rangeCount; i++) {
      cloned.append(selection.getRangeAt(i).cloneContents());
    }
    // Get as text
    astext.innerHTML += selection;
}
document.onselectionchange = function() {
    let selection = document.getSelection();
    // Clone DOM nodes from ranges (we support multiselect here)
    for (let i = 0; i < selection.rangeCount; i++) {
      console.log(selection.getRangeAt(i).cloneContents());
    }
    // Get as text
    console.log('astext' + selection)
} */