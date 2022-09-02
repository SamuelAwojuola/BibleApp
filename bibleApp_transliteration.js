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
    let translatedWordsInVerse = x.querySelectorAll('[strnum]');
    translatedWordsInVerse.forEach(strNumElm => {
        wStrnum_array = strNumElm.getAttribute('strnum').split(' ');
        let i = 0;
        wStrnum_array.forEach(wStrnum => {
            i++;
            let divider = '|';
            if ((i > 1) && ((i > 2) && (i != wStrnum_array.length))) {
                divider = '|'
            } else if ((i == 1) || ((i > 2) && (i == wStrnum_array.length))) {
                divider = ''
            }
            for (abc = 0; abc < strongsJSONresponse.length; abc++) {
                if (strongsJSONresponse[abc].number == wStrnum) {
                    strNumElm.classList.add(wStrnum)
                    let str_xlit = strongsJSONresponse[abc].xlit;
                    let str_lemma = strongsJSONresponse[abc].lemma;
                    strNumElm.setAttribute("data-xlit", strNumElm.getAttribute("data-xlit") + divider + str_xlit);
                    strNumElm.setAttribute("data-lemma", strNumElm.getAttribute("data-lemma") + divider + str_lemma);
                    strNumElm.title = strNumElm.title + " - " + str_xlit + " | " + wStrnum + " | " + str_lemma;
                    break
                }
            }
        });
        strNumElm.title = '(' + strNumElm.getAttribute("translation") + ')' + strNumElm.title;
    });
}

function getsStrongsDefinition(x) {
    strongsdefinitionwindow.innerHTML = '';
    let _text = '';
    x.forEach(wStrnum => {
        for (abc = 0; abc < strongsJSONresponse.length; abc++) {
            if (strongsJSONresponse[abc].number == wStrnum) {
                let str_xlit = strongsJSONresponse[abc].xlit;
                let str_lemma = strongsJSONresponse[abc].lemma;
                let str_definition = strongsJSONresponse[abc].description;
                _text = _text + `<div class="strngsdefinition"><hr><h2>${wStrnum}</h2><hr>
                <h4><i>Lemma</i>: </h4><h1>${str_lemma}</h1>
                <h4><i>Transliteration</i>: </h4><h3>${str_xlit}</h3>
                <h3><hr>Definition:</h3><hr> ${str_definition}<hr></div>
                `
                strongsdefinitionwindow.innerHTML = _text;
                break
            }
        }
    });
}

//TO SHOW TRANSLITERATION OF WORDS
var transliteratedWords_Array = [];

function showTransliteration(stn) {
    let allSimilarWords = pagemaster.querySelectorAll('.' + stn);
    allSimilarWords.forEach(elm => {
        elm.innerHTML='';
        let xlitFragment = new DocumentFragment();
        let elm_strnum = elm.getAttribute("strnum").split(' ');
        let elm_dxlit = elm.getAttribute("data-xlit").split('|');
        let elm_lemma = elm.getAttribute("data-lemma").split('|');
        // let elm_transliteration = elm.getAttribute("transliteration").split('|');
        let engTranslation = elm.getAttribute("translation");
        let j=0;
        elm_strnum.forEach(eStn => {
            let transSpan = document.createElement('SPAN');
            transSpan.classList.add(eStn);
            transSpan.classList.add('strnum')
            transSpan.setAttribute('strnum', eStn);
            transSpan.setAttribute('data-xlit', elm_dxlit[j]);
            transSpan.title = (engTranslation + '|'+eStn+ '|'+elm_lemma[j]);
            if(elm.getAttribute("transliteration")){transSpan.innerText = ' ' + elm.getAttribute("transliteration").split(' ')[j];
            }else{transSpan.innerText = ' ' + elm_dxlit[j];}
            xlitFragment.append(transSpan);
            j++
        });
        elm.append(xlitFragment);
        elm.classList.add('eng2grk');
    })
}

function hideTransliteration(stn) {
    let allSimilarWords = pagemaster.querySelectorAll('.' + stn);
    allSimilarWords.forEach(elm => {
        elm.classList.remove('eng2grk');
        elm.innerHTML='';
        elm.innerHTML=elm.getAttribute("translation");
    })
}

function highlightAllStrongs(x) {
    cs = `span[strnum="` + x + `"]{background-color:` + randomColor(200) + `;outline:1px solid ` + randomColor(200) + `;border-radius:2px;}`
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
        if (highlightstrongs) {
            setItemInLocalStorage('strongsHighlightStyleSheet', getAllRulesInStyleSheet(highlightstrongs));
        }
    }, 300);
}

function strongsHighlighting(e) {
    let clickedElm;
    if (strnum = e.target.getAttribute('strnum')) {
        strnum = strnum.split(' ');
        getsStrongsDefinition(strnum);
    }
    //IF IT IS A WORD TRANSLATED FROM HEBREW/GREEK
    if (e.target.classList.contains('translated')) {
        clickedElm = e.target;
        let stn = clickedElm.getAttribute('strnum');
        if (!clickeElmArray.includes(stn)) {
            clickeElmArray.push(stn)
            removeRecentStrongsFromArray(stn);
        }
    }
    //IF IT IS THE STRONGS WORD ITSELF
    else if (e.target.parentElement.classList.contains('translated')) {
        clickedElm = e.target.parentElement;
        let stn = clickedElm.getAttribute('strnum');
        if (!clickeElmArray.includes(stn)) {
            clickeElmArray.push(stn)
            removeRecentStrongsFromArray(stn);
        } else { //If doubleclicked (stn will still be in the array)
            clickeElmArray.shift(stn);
            clearTimeout(timerstn)
        }
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
        let allstn = hoverElm.getAttribute('strnum').split(' '); //Some words are translated from more than one word
        allstn.forEach(stn => {
            if (transliteratedWords_Array.indexOf(stn) == -1) {
                /* ADD THE WORD TO THE transliteratedWords_Array */
                transliteratedWords_Array.push(stn);
            }
            showTransliteration(stn)
        })
    } else if (hoverElm.classList.contains('strnum')) {
        let allstn = hoverElm.parentElement.getAttribute('strnum').split(' ');
        allstn.forEach(stn => {
            if (transliteratedWords_Array.indexOf(stn) != -1) {
                /* REMOVE THE WORD FROM THE transliteratedWords_Array */
                transliteratedWords_Array.splice(transliteratedWords_Array.indexOf(stn), 1);
            }
            hideTransliteration(stn)
        })
    }
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
    // if (e.target.classList.contains('translated')) {
    if (strAtt = e.target.getAttribute('strnum')) {
        let newStyleInHead = document.createElement('style');
        strAtt=strAtt.split(' ');
        transStyleSelector = '';
        let i = 0;
        let commer='';
        strAtt.forEach(stn => {
            i++;
            if(i>1){commer=','}
            transStyleSelector=transStyleSelector+commer+'.'+stn;
        });
        newStyleInHead.id = 'highlightall';
        // background-color: rgb(240,218,201);rgb(247,243,204);rgb(235,200,230);rgb(200,255,150);rgba(255, 192, 203, 0.5);rgba(222, 184, 135, 0.5);rgba(255, 192, 100, 0.5)
        newStyleInHead.innerHTML = transStyleSelector+'{background-color:rgba(255, 200, 0, 0.2);border-radius:2px;color:black!important;-webkit-box-shadow: 0.5px 0.5px 1px rgba(100,100,100, 0.8),inset 0 0 1px black;-moz-box-shadow:0.5px 0.5px 1px rgba(100,100,100, 0.8),inset 0 0 1px black;box-shadow:0.5px 0.5px 1px rgba(100,100,100, 0.8),inset 0 0 1px black;}';
        // newStyleInHead.innerHTML = transStyleSelector+'{background-color:rgba(255, 20   0, 0, 0.2);font-weight:bold;border-radius:2px;color:black!important;-webkit-box-shadow: 2px 2px 1px rgba(100,100,100, 0.8),inset 0 0 1px black;-moz-box-shadow:2px 2px 1px rgba(100,100,100, 0.8),inset 0 0 1px black;box-shadow:2px 2px 1px rgba(100,100,100, 0.8),inset 0 0 1px black;}';
        let headPart = document.getElementsByTagName('head')[0];
        headPart.append(newStyleInHead);
    }
})
main.addEventListener('mouseout', function (e) {
    if (e.target.hasAttribute('strnum')) {
        // if (e.target.classList.contains('translated')) {
        document.getElementById('highlightall').remove();
    }
})