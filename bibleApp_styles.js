//Random Color Generator
function randomColor(brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}
//STYLE SHEET MODIFIER
function findCSSRule(mySheet, selector) {
    let ruleIndex = -1; // Default to 'not found'
    let theRules = mySheet.cssRules ? mySheet.cssRules : mySheet.rules;
    // console.log(theRules.length)
    for (i = 0; i < theRules.length; i++) {
        if (theRules[i].selectorText == selector) {
            ruleIndex = i;
            break;
        }
    }
    return ruleIndex;
}
//Random color Alternative
//+'#' + (0x1220000 + Math.random() * 0xFF00FF).toString(16).substr(1,6);
function highlightAllStrongs(x) {
    var headPart = document.getElementsByTagName('head')[0];
    cs = `span[strnum="` + x + `"]{background-color:` + randomColor(200) + `;outline:1px solid ` + randomColor(200) + `}`
    //CREATE THE INNER-STYLE WITH ID #highlightstrongs IN THE HEAD IF IT DOESN'T EXIST
    if (!document.querySelector('style#highlightstrongs')) {
        newStyleInHead = document.createElement('style');
        newStyleInHead.id = 'highlightstrongs';
        newStyleInHead.innerHTML = cs;
        headPart.append(newStyleInHead);
    }
    //ELSE IF IT ALREADY EXISTS
    else {
        let highlightStrongsSheet = highlightstrongs.sheet;
        let allRules = highlightStrongsSheet.cssRules;
        let ruleSelector = `span[strnum="${x}"]`
        for (let i = 0; i < allRules.length; i++) {
            if (findCSSRule(highlightStrongsSheet, ruleSelector) == -1) {
                document.getElementById('highlightstrongs').sheet.insertRule(cs, allRules.length - 1);
            } else {
                highlightStrongsSheet.deleteRule(findCSSRule(highlightStrongsSheet, ruleSelector));
                if (allRules.length == 0) {
                    highlightstrongs.remove()
                }
            }
            break
        }
    }
}
/* EVENT LISTENERS FOR THE HIGHLIGHING ALL ELEMENTS WITH THE SAME CLASS NAME BY HOVERING OVER ONE OF THEM */
/* This is acomplished by modifying the styles in the head */
main.addEventListener('mouseover', function (e) {
    // main.classList.remove('noselect');
    if (e.target.classList.contains('translated')) {
        let newStyleInHead = document.createElement('style');
        newStyleInHead.id = 'highlightall';
        newStyleInHead.innerHTML = '[data-xlit="' + e.target.getAttribute('data-xlit') + '"]{background-color:rgb(154, 252, 255)}';
        let headPart = document.getElementsByTagName('head')[0];
        headPart.append(newStyleInHead);
    }
})
main.addEventListener('mouseout', function (e) {
    if (e.target.classList.contains('translated')) {
        document.getElementById('highlightall').remove();
    }
})