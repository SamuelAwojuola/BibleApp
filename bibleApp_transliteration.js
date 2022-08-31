// FOR STRONGS LEXICON
var requestStrongsURL = 'bibles_JSON/strongs.json';
var strongsJSON = new XMLHttpRequest();
strongsJSON.open('GET', requestStrongsURL);
strongsJSON.responseType = 'json';
strongsJSON.send();

let strongsJSONresponse, strngsAll;
strongsJSON.onload = function () {
    strongsJSONresponse = strongsJSON.response;
}

// Create and Append Transliteration Data Attribute
function createTransliterationAttr(x) {
    let strnumInVerse = x.querySelectorAll('.strnum');
    strnumInVerse.forEach(strNumElm => {
        wStrnum = strNumElm.getAttribute('strnum')
        for (abc = 0; abc < strongsJSONresponse.length; abc++) {
            if (strongsJSONresponse[abc].number == wStrnum) {
                let str_xlit = strongsJSONresponse[abc].xlit;
                let str_lemma = strongsJSONresponse[abc].lemma;
                strNumElm.setAttribute("data-xlit", str_xlit);
                strNumElm.setAttribute("data-lemma", str_lemma);
                if (strNumElm.parentElement.hasAttribute("strnum")) { //For words translated from more than one strongs word
                    strNumElm.parentElement.setAttribute("strnum", strNumElm.parentElement.getAttribute("strnum") + ' ' + wStrnum);
                    strNumElm.parentElement.setAttribute("data-xlit", strNumElm.parentElement.getAttribute("data-xlit") + ' ' + str_xlit);
                    strNumElm.parentElement.title = strNumElm.parentElement.title + " - " + str_xlit + " | " + wStrnum + " | " + str_lemma;
                } else {
                    strNumElm.parentElement.setAttribute("strnum", wStrnum);
                    strNumElm.parentElement.setAttribute("data-xlit", str_xlit);
                    strNumElm.parentElement.title = str_xlit + " | " + wStrnum + " | " + str_lemma;
                }
                strNumElm.parentElement.classList.add(wStrnum)
                strNumElm.title = '(' + strNumElm.parentElement.getAttribute("data-kjv-trans") + ')' + " - " + str_xlit + " | " + wStrnum + " | " + str_lemma;
                break
            }
        }
    });
}

//TO SHOW TRANSLITERATION OF WORDS
var transliteratedWords_Array = [];

function showTransliteration(stn) {
    // let allSimilarWords = main.querySelectorAll('.strnum[strnum="' + stn + '"]');
    let allSimilarWords = pagemaster.querySelectorAll('.strnum[strnum="' + stn + '"]');
    let i = 0;
    allSimilarWords.forEach(elm => {
        elmP = elm.parentElement;
        if (!elmP.classList.contains('eng2grk')) {
            elmP.childNodes[0].remove()
            elmP.classList.add('eng2grk');
        }
        // if(i>0){elm.innerText = elm.getAttribute("data-xlit");}
        elm.innerText = ' ' + elm.getAttribute("data-xlit");
        elm.classList.add("xlit");
        //To SHOW ALL STRONGS WORDS UNDER A WORD (FOR WORDS TRANSLATED FROM >1 WORDS)
        let sibling = elmP.firstElementChild;
        while (sibling) {
            sibling.innerText = ' ' + sibling.getAttribute("data-xlit");
            sibling.classList.add("xlit");
            sibling = sibling.nextElementSibling;
        }
        i = i + 1;
    })
}

function hideTransliteration(stn, prevParent) {
    // let allSimilarWords = main.querySelectorAll('.strnum[strnum="' + stn + '"]');
    let allSimilarWords = pagemaster.querySelectorAll('.strnum[strnum="' + stn + '"]');
    allSimilarWords.forEach(elm => {
        elmP = elm.parentElement;
        if (!prevParent.includes(elmP)) {
            elmP.classList.remove('eng2grk');
            elmP.prepend(elmP.getAttribute("data-kjv-trans"));
            prevParent.push(elmP)
        }
        //If the word was translated from more than one word, then the others will remain transliterated
        elm.innerText = '';
        elm.classList.remove("xlit");
        //To HIDE ALL transliterated words instead
        let sibling = elmP.firstElementChild;
        let modifiedSiblingArray = []
        while (sibling) {
            sibling.innerText = '';
            sibling.classList.remove("xlit");
            let siblingStrnum = sibling.getAttribute("strnum");
            if (sibling != elm) {
                modifiedSiblingArray.push(siblingStrnum)
            };
            sibling = sibling.nextElementSibling;
        }
        //If this is the only instance of transliteration of this strongsnum, remove it from the transliteratedArray
        transliteratedWords_Array.forEach(sibStrnum => {
            // if (!main.querySelectorAll('.xlit.strnum[strnum="' + sibStrnum + '"]')) {
            if (!pagemaster.querySelectorAll('.xlit.strnum[strnum="' + sibStrnum + '"]')) {
                transliteratedWords_Array.splice(transliteratedWords_Array.indexOf(siblingStrnum, 1));
            }
        });
    })
}

function highlightAllStrongs(x) {
    cs = `span[strnum="` + x + `"]{background-color:` + randomColor(200) + `;outline:1px solid ` + randomColor(200) + `}`
    //CREATE THE INNER-STYLE WITH ID #highlightstrongs IN THE HEAD IF IT DOESN'T EXIST
    if (!document.querySelector('style#highlightstrongs')) {
        createNewStyleSheetandRule('highlightstrongs', cs)
    }
    //ELSE IF IT ALREADY EXISTS
    else {
        let ruleSelector = `span[strnum="${x}"]`
        addRemoveRuleFromStyleSheet(cs, ruleSelector, highlightstrongs)
    }
}
var clickeElmArray = [];
let timerstn;

function removeRecentStrongsFromArray(stn) {
    timerstn = setTimeout(() => {
        const index = clickeElmArray.indexOf(stn);
        if (index > -1) {
            clickeElmArray.splice(index, 1)
        }
        highlightAllStrongs(stn)
        // console.log(clickeElmArray)
    }, 300);
}

function strongsHighlighting(e) {
    let hoverElm;
    //IF IT IS A WORD TRANSLATED FROM HEBREW/GREEK
    if (e.target.classList.contains('translated')) {
        hoverElm = e.target;
        let stn = hoverElm.getAttribute('strnum');
        // console.log(clickeElmArray.includes(stn))
        if (!clickeElmArray.includes(stn)) {
            // console.log('not clicked recently');
            clickeElmArray.push(stn)
            // console.log(clickeElmArray)
            removeRecentStrongsFromArray(stn);
            // highlightAllStrongs(stn)
        } /* else { //If doubleclicked (stn will still be in the array)
            clickeElmArray.shift(stn);
            clearTimeout(timerstn)
        } */
    }
    //IF IT IS THE STRONGS WORD ITSELF
    else if (e.target.parentElement.classList.contains('translated')) {
        hoverElm = e.target.parentElement;
        stn = hoverElm.getAttribute('strnum');
        if (!clickeElmArray.includes(stn)) {
            clickeElmArray.push(stn)
            removeRecentStrongsFromArray(stn);
        } else { //If doubleclicked (stn will still be in the array)
            clickeElmArray.shift(stn);
            clearTimeout(timerstn)
        }
    }
    if (highlightstrongs) {
        setItemInLocalStorage('strongsHighlightStyleSheet', getAllRulesInStyleSheet(highlightstrongs));
    }
}
//ON PAGE LOAD, GET TRANSLITERATED ARRAY FROM CACHE
//window.onload = () => cacheFunctions();
//Moved to after loading of first chapter


/* TRANSLITERAIOTN */
/* 
Α	α	a
Β	β	b
Γ	γ	g
Δ	δ	d
Ε	ε	e
Ζ	ζ	z
Η	η	h ē
Θ	θ	th
Ι	ι	i
Κ	κ	k
Λ	λ	l
Μ	μ	m
Ν	ν	n
Ξ	ξ	x
Ο	ο	o
Π	π	p
Ρ	ρ	r
Σ	σ,ς	s
Τ	τ	t
Υ	υ	u (hu when it is the first letter)
Φ	φ	ph
Χ	χ	ch
Ψ	ψ	ps
Ω	ω	ō
 */

pagemaster.addEventListener("dblclick", function (e) {
    hoverElm = e.target;
    if (hoverElm.nodeName == 'SPAN' && hoverElm.classList.contains('translated') && !hoverElm.classList.contains('eng2grk')) {
        let allstn = hoverElm.querySelectorAll('.strnum'); //Some words are translated from more than one word
        allstn.forEach(s => {
            stn = s.getAttribute('strnum');
            if (transliteratedWords_Array.indexOf(stn) == -1) {
                /* ADD THE WORD TO THE transliteratedWords_Array */
                transliteratedWords_Array.push(stn);
            }
            showTransliteration(stn)
        })
    } else if (hoverElm.classList.contains('strnum')) {
        let allstn = hoverElm.parentElement.querySelectorAll('.strnum');
        let prevParent = [];
        allstn.forEach(s => {
            stn = s.getAttribute('strnum');
            if (transliteratedWords_Array.indexOf(stn) != -1) {
                /* REMOVE THE WORD FROM THE transliteratedWords_Array */
                transliteratedWords_Array.splice(transliteratedWords_Array.indexOf(stn), 1);
            }
            hideTransliteration(stn, prevParent)
        })
    }
    // console.log(transliteratedWords_Array)
    setItemInLocalStorage('transliteratedWords', transliteratedWords_Array);
})

//HIGHLIGHTING CLICKED WORD
main.addEventListener("click", strongsHighlighting)
// main.addEventListener("click", debounce(strongsHighlighting))
searchPreviewFixed.addEventListener("click", strongsHighlighting)
main.addEventListener("click", hideBibleNav)

function hideBibleNav() {
    hideRefNav('hide', bible_nav)
} //HIDE refnav SIDE BAR IF OPEN BY CLICKING ANYWHERE ON THE PAGE

/* EVENT LISTENERS FOR THE HIGHLIGHING ALL ELEMENTS WITH THE SAME CLASS NAME BY HOVERING OVER ONE OF THEM */
/* This is acomplished by modifying the styles in the head */
main.addEventListener('mouseover', function (e) {
    // main.classList.remove('noselect');
    if (e.target.classList.contains('translated')) {
        let newStyleInHead = document.createElement('style');
        newStyleInHead.id = 'highlightall';
        newStyleInHead.innerHTML = '[data-xlit="' + e.target.getAttribute('data-xlit') + '"]{background-color:bisque;border:1px solid brown; border-radius:2px}';
        let headPart = document.getElementsByTagName('head')[0];
        headPart.append(newStyleInHead);
    }
})
main.addEventListener('mouseout', function (e) {
    if (e.target.classList.contains('translated')) {
        document.getElementById('highlightall').remove();
    }
})