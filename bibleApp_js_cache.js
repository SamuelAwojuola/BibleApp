//Settings under refnav.
cache_strongs.addEventListener('change', function () {
    if (this.checked) {
        localStorage.removeItem('transliteratedWords')
    }
});
cache_higlights.addEventListener('change', function () {
    if (this.checked) {
        localStorage.removeItem('strongsHighlightStyleSheet')
    }
});

function cacheFunctions() {
    if (localStorage.getItem('lastBookandChapter')) {
        lastOpenedBook = localStorage.getItem('lastBookandChapter').split(',')[0];
        document.querySelector('.bkname[value="' + lastOpenedBook + '"]').click()
        lastOpenedChapter = localStorage.getItem('lastBookandChapter').split(',')[1];
        getTextOfChapter(bible_chapters.querySelector('.chptnum[value="' + lastOpenedChapter + '"]'));
    }
    if (localStorage.getItem('transliteratedWords')) {
        transliteratedWords_Array = localStorage.getItem('transliteratedWords').split(',');
        transliteratedWords_Array.forEach(storedStrnum => {
            showTransliteration(storedStrnum)
        });
    }
    if (localStorage.getItem('strongsHighlightStyleSheet')) {
        let hlstrngCSS = localStorage.getItem('strongsHighlightStyleSheet');
        let headPart = document.getElementsByTagName('head')[0];
        newStyleInHead = document.createElement('style');
        newStyleInHead.id = 'highlightstrongs';
        newStyleInHead.innerHTML = hlstrngCSS = hlstrngCSS.split(',').join('');
        headPart.append(newStyleInHead);
        hlstrngCSS = hlstrngCSS.split(',').join('');
    }
    if (localStorage.getItem('showVersesInSearch')) {
        let showVerseCheck = localStorage.getItem('showVersesInSearch');
        if(showVerseCheck=='yes'){showreturnedverses.check=true}
        else if(showVerseCheck=='no'){showreturnedverses.checked=false}
    }
}

function setItemInLocalStorage(name, nValue) {
    if (name == 'transliteratedWords' && !cache_strongs.checked) {//check if in the settings saving to cache for the transliteration words is selected
        localStorage.setItem(name, nValue);
    } else if (name == 'strongsHighlightStyleSheet' && !cache_higlights.checked) {
        localStorage.setItem(name, nValue);
    } else {
        localStorage.setItem(name, nValue);
    }
}

function removeFromLocalStorage() {}

/*********************** HELPER FUNCTIONS ***********************/
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

function hideElement(el) {
    el.classList.add("displaynone")
}

function showElement(el) {
    el.classList.remove("displaynone")
}

function isAsubArrayofB(a, b) {
    let aL = a.length;
    let bL = b.length;
    //b cannot contain a if a is longer
    if (bL >= aL) {
        //start comparison where at the last possible starting point of a in b.
        // E.g., if aL is 3 and bL is 5, then the last possible starting point of a in b is 2
        let lastPossibleStartIndex = bL - aL;
        let lind = lastPossibleStartIndex;
        while (lind >= 0) {
            let i = 0,
                j = lind;
            while (a[i] == b[j]) {
                if (i == aL - 1) {
                    return true
                }
                i++;
                j++;
            }
            lind--; //move backwards in b array from last possible index to the start of b
        }
        return false
    }
    return false
}

function areAllitemsOfAinB(a, b) {
    if(a.every(elem => b.indexOf(elem) > -1)){return true}
    else {return false}
}