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
    let allSimilarWords = main.querySelectorAll('.strnum[strnum="' + stn + '"]');
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
    let allSimilarWords = main.querySelectorAll('.strnum[strnum="' + stn + '"]');
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
            if (!main.querySelectorAll('.xlit.strnum[strnum="' + sibStrnum + '"]')) {
                transliteratedWords_Array.splice(transliteratedWords_Array.indexOf(siblingStrnum, 1));
            }
        });
    })
}

//ON PAGE LOAD, GET TRANSLITERATED ARRAY FROM CACHE
//window.onload = () => cacheFunctions();
//Moved to after loading of first chapter
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
}

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

main.addEventListener("dblclick", function (e) {
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
    console.log(transliteratedWords_Array)
    localStorage.setItem('transliteratedWords', transliteratedWords_Array);
})

//HIGHLIGHTING CLICKED WORD
main.addEventListener("mousedown", function (e) {
    var hoverElm;
    //IF IT IS A WORD TRANSLATED FROM HEBREW/GREEK
    if (e.target.classList.contains('translated')) {
        hoverElm = e.target;
        stn = hoverElm.getAttribute('strnum');
        highlightAllStrongs(stn)
    }
    //IF IT IS THE STRONGS WORD ITSELF
    else if (e.target.parentElement.classList.contains('translated')) {
        hoverElm = e.target.parentElement;
        stn = hoverElm.getAttribute('strnum');
        highlightAllStrongs(stn)
    }
    //HIDE refnav SIDE BAR IF OPEN BY CLICKING ANYWHERE ON THE PAGE
    hideRefNav('hide')
})