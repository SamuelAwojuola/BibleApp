function addCSSrulesFromArray(css_rules_array, styleSheetToAddThemTo) {}

function getAllRulesInStyleSheet(styleSheet) {
    if (styleSheet) {
        let allRules = styleSheet.sheet.cssRules;
        let rulesArray = [];
        for (let i = 0; i < allRules.length; i++) {
            rulesArray.push(allRules[i].cssText)
        };
        // console.log(rulesArray)
        return rulesArray
    }
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
function createNewStyleSheetandRule(styleID, styleRule) {
    let headPart = document.getElementsByTagName('head')[0];
    newStyleInHead = document.createElement('style');
    newStyleInHead.id = styleID;
    newStyleInHead.innerHTML = styleRule;
    headPart.append(newStyleInHead);
}

function addRemoveRuleFromStyleSheet(CS_rule, ruleSelector, targetStyleSheet) {
    let highlightStrongsSheet = targetStyleSheet.sheet;
    let allRules = highlightStrongsSheet.cssRules;
    for (let i = 0; i < allRules.length; i++) {
        if (findCSSRule(highlightStrongsSheet, ruleSelector) == -1) {
            highlightstrongs.sheet.insertRule(CS_rule, allRules.length - 1);
        } else {
            highlightStrongsSheet.deleteRule(findCSSRule(highlightStrongsSheet, ruleSelector));
            if (allRules.length == 0) {
                targetStyleSheet.remove()
            }
        }
        break
    }
}