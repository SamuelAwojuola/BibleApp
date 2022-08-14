var currentBook, currentBookName, currentChapter;

// FOR STRONGS LEXICON
var requestStrongsURL = 'bibles_JSON/strongs.json';
var strongsJSON = new XMLHttpRequest();
strongsJSON.open('GET', requestStrongsURL);
strongsJSON.responseType = 'json';
strongsJSON.send();

let strongsJSONresponse;
let strngsAll;
strongsJSON.onload = function () {
    strongsJSONresponse = strongsJSON.response;
}

/* BIBLE REFERENCE ABBREVIATIONS */
var requestURLBibleRefAbr = 'bibles_JSON/key_abbreviations_english.json';
var ref_abreviations = new XMLHttpRequest();
ref_abreviations.open('GET', requestURLBibleRefAbr);
ref_abreviations.responseType = 'json';
ref_abreviations.send();

let ref_Abrev;
ref_abreviations.onload = function () {
    ref_Abrev = ref_abreviations.response;
}
//On enter go to reference
reference.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        gotoRef()
        event.preventDefault();
    }
});

function gotoRef() {
    let ref = reference.value;
    // 1      Cor            15                 :                 55
    // ref = ref.replace(/^([\D\W])*/g, '');// remove anything that is not a number or word from begining of string
    ref = ref.trim();
    ref = ref.replace(/(\d+)\s+(\d+)/g, '$1.$2'); // 15 55==>15.55
    ref = ref.replace(/\s{2,}/g, ' '); // 1 Cor 15 : 55
    ref = ref.replace(/(\d+)[.,:;\s*]+(\d+)/g, '$1.$2'); // 1 Cor 15.55
    ref = ref.replace(/(\d)\s*([a-zA-Z]+)/, '$1$2'); //2 Pet3:20 ==> 2Pet3:20
    ref = ref.replace(/([a-zA-Z]+)[.,:;](\d+)/, '$1 $2'); //Gal.3:20 ==> Gal 3:20
    ref = ref.replace(/(\d*[a-zA-Z]+)(\d+)/, '$1 $2'); //Psa15.55 ==> Psa 15.55
    let ref_bkname, ref_chpnVer, ref_chp, ref_ver;

    let refArrbySpace = ref.split(" ");
    if (refArrbySpace.length > 1) { //Check if ref has book name
        //the last elememnt in the array should be a chapter number or chapter and verse numbers joined by a dot
        let refEnd = refArrbySpace[refArrbySpace.length - 1];
        if (refEnd.split('.').length == 1) {
            ref_chp = refEnd;
            ref_ver = '1';
        } //if it is a number, then it is chapter number
        else if (refEnd.split('.').length > 1) { //if it is not, split by dot and check each part
            let refEndArraySplitbyDot = refEnd.split('.');
            if (Number(refEndArraySplitbyDot[0])) {
                ref_chp = refEndArraySplitbyDot[0];
            } else {
                ref_chp = '1'
            }
            if (Number(refEndArraySplitbyDot[1])) {
                ref_ver = refEndArraySplitbyDot[1]
            } else {
                ref_ver = '1';
            }
        }
        refArrbySpace.pop();
        ref_bkname = refArrbySpace.join(' '); //Psa 15.55 ==> Psa
        ref_chpnVer = ref_chp + '.' + ref_ver
        ref = ref_bkname + ' ' + ref_chpnVer;
    } else if (refArrbySpace.length == 1) { //If there is no space
        if ((!Number(refArrbySpace[0]))) { //If it is not a number, then it must be the Book Ref Name
            ref_bkname = ref;
            console.log('yes')
            ref_chpnVer = '1.1';
            ref_chp = '1';
            ref_ver = '1';
            ref = ref_bkname + ' 1.1';
        } else if (Number(refArrbySpace[0])) { //If it is a Number, check that it doesn't have a decimal
            console.log('Jesus')
            if (refArrbySpace[0].split('.').length == 1) { //if it has no decimal, then it is the Chapter Number
                ref_chpnVer = ref + '.1';
                ref_chp = ref;
                ref_ver = '1';
                ref = ref_bkname + ' ' + ref_chpnVer;
            } else { //If it has decimal
                if (Number(refArrbySpace[0].split('.')[0])) { //If the first part is a Number, then it is the chapter num
                    ref_chp = refArrbySpace[0].split('.')[0];
                    ref_ver = refArrbySpace[0].split('.')[1]; //Assuming the secong part is a Number (we'll check next)
                    ref_chpnVer = ref_chp + '.' + ref_ver;
                    if (!Number(refArrbySpace[0].split('.')[1])) { //If the second part is not a number, then default to '1'
                        ref_ver = '1';
                        ref_chpnVer = ref_chp + '.1';
                    }
                } else { //If the first part is not a number, then default to '1.1s'
                    ref_chp = '1';
                    ref_ver = '1';
                    ref_chpnVer = ref_chp + '.1';
                }
            }
            ref_bkname = currentBookName;
            ref = ref_bkname + ' ' + ref_chpnVer;
        }
    }
    let refDisplay = ref.toLowerCase();
    if (!Number(refDisplay.charAt(0))) {
        reference.value = refDisplay.charAt(0).toUpperCase() + refDisplay.slice(1)
    } else if (!Number(refDisplay.charAt(1))) {
        reference.value = refDisplay.charAt(0) + refDisplay.charAt(1).toUpperCase() + refDisplay.slice(2)
    } else {
        reference.value = refDisplay;
        ref = refDisplay;
    }
    /* console.log('ref:' + ref);
    console.log('ref_bkname:' + ref_bkname);
    console.log('ref_chpnVer:' + ref_chpnVer);
    console.log('ref_chp:' + ref_chp);
    console.log('ref_ver:' + ref_ver) */
    // Find id of Book
    ref_Abrev.forEach(ref_ => {
        if (ref_.a.includes(ref_bkname.toUpperCase())) {
            refb = ref_.b - 1;
            if (currentBook != refb) {
                document.querySelector(`[value="book_${refb}"]`).click(); //click on book
                getAllChapters(); //generate text of all chapters in the book
            }
            ref_chp = ref_chp - 1;
            bkXchY = `bk${ref_.b - 1}ch${ref_chp}`;
            let targetVerse = document.getElementById(`_${refb}.${ref_chpnVer}`);
            scrollToVerse(targetVerse)
            return
        }
    });
}

function scrollToVerse(targetVerse) {
    if (targetVerse) {
        targetVerse.previousElementSibling.scrollIntoView({
            behavior: "smooth"
        }); //scroll to element before it to give some gap
        targetVerse.classList.add('vhlt');
        targetVerse.classList.add('vglow');
        setTimeout(function () {
            targetVerse.classList.remove("vglow");
        }, 3000);
    }
}

// Populate Select Lists with Layouts and Categories from JSON file
var selectBooks = document.querySelector('#bible_books');
var selectChapters = document.querySelector('#bible_chapters');
var selectVerse = document.querySelector('#bible_verses');
var ppp = document.querySelector('#ppp');


//For Reference Pane
var requestURLkjvStrongsSummary = 'bibles_JSON/kjv_strongs_summary01.json';
var kjvBible_refs = new XMLHttpRequest();
kjvBible_refs.open('GET', requestURLkjvStrongsSummary);
kjvBible_refs.responseType = 'json';
kjvBible_refs.send();

var bChandV;
var verses;
kjvBible_refs.onload = function () {
    bChandV = kjvBible_refs.response;
    populateBooks(bChandV);
}

function populateBooks(obj) {
    verses = obj['verses'];
    var prevBook = null;
    var prevChapter = 0;
    var prevVerse = 0;
    var versesLength = verses.length;
    var myOption1;
    var bookChanged = 0;
    var chapterChanged = 0;

    var bookName = null,
        bookNum = null,
        bookStartIndex = null,
        bookEndIndex = null,
        numberOfChapters = null,
        versesPerChapter = [];

    for (let i = 0; i < versesLength; i++) {
        //Books Select
        bibleBook = document.createElement('option');
        bibleBook.setAttribute('bookName', verses[i].bookName);
        var bookStartIndex = verses[i].bookStartIndex;
        bibleBook.setAttribute('bookStartIndex', bookStartIndex);
        var bookEndIndex = verses[i].bookEndIndex;
        bibleBook.setAttribute('bookEndIndex', bookEndIndex);
        bookName = verses[i].bookName;
        bibleBook.value = 'book_' + i;
        bibleBook.setAttribute('bookIndex', [i]);
        bibleBook.classList.add('bkname');
        bibleBook.textContent = verses[i].bookName;

        // bibleBook.setAttribute('onClick', 'getBksChptsNum(this)');

        selectBooks.appendChild(bibleBook);
        var chapterStartIncreamenter = 0;

        //Chapters Select
        var numberOfChapters = verses[i].versesPerChapter;
        for (j = 0; j < numberOfChapters.length; j++) {
            var bookChapters = document.createElement('option');
            bookChapters.classList.add('book_' + i);
            bookChapters.setAttribute('bookName', bookName);
            bookChapters.setAttribute('bookIndex', i);
            bookChapters.setAttribute('chapterIndex', j);

            var chapterStartIndex = bookStartIndex + chapterStartIncreamenter;
            var chapterEndIndex = chapterStartIndex + numberOfChapters[j] - 1;
            chapterStartIncreamenter = chapterStartIncreamenter + numberOfChapters[j];
            bookChapters.setAttribute('chapterStartIndex', chapterStartIndex);
            bookChapters.setAttribute('chapterEndIndex', chapterEndIndex);

            bookChapters.value = 'bk' + i + 'ch' + j;
            bookChapters.textContent = [j + 1];

            // bookChapters.setAttribute('onClick', 'createChaptersVerses(this)');
            bookChapters.classList.add('chptnum');
            selectChapters.appendChild(bookChapters);
        }
    }
}


function getBksChptsNum(xxx) {
    if (document.querySelector(".show_chapter")) {
        document.querySelectorAll(".show_chapter").forEach(element => {
            element.classList.remove("show_chapter");
        });
    }
    let classOfChapters = document.querySelectorAll('.' + xxx.value);
    classOfChapters.forEach(element => {
        element.classList.add("show_chapter");
    });
}
var goto; //to determine if clicking on chapter number shows only the chapter or scrolls to the chapter
function createChaptersVerses(xxx, yyy) {
    //Clear the chapters navigation pane
    selectVerse.querySelectorAll('*').forEach(element => {
        element.remove();
    });
    // var bookId = Number(numberOfverses = xxx.getAttribute("bookIndex"));
    // var chapterId = Number(numberOfverses = xxx.getAttribute("chapterIndex"));
    // numberOfverses = Number(verses[bookId].versesPerChapter[chapterId]);

    getTextOfChapter(xxx, yyy)
}

function getTextOfBook(xxx) {
    getTextOfChapter(xxx, 0)
}

// GEMERATE THE TEXT/VERSES OF THE SELECTED CHAPTER
function getTextOfChapter(xxx, oneChptAtaTime = 1) {
    chNumInBk = Number(xxx.getAttribute("chapterindex"));
    chStartIdx = Number(xxx.getAttribute("chapterStartIndex"));
    chEndIdx = Number(xxx.getAttribute("chapterendindex")) + 1;
    bookname = xxx.getAttribute("bookname");
    bkid = xxx.getAttribute("bookindex");

    console.log('goto is ' + goto)

    // TEXT NOT ALREADY ON PAGE, SO FRESHLY GENERATE THE CONTENT
    if (goto == 0) {
        if (oneChptAtaTime) {
            ppp.innerHTML = ''; //will only contain one chapter at a time
        }
        for (a = 1, i = chStartIdx; i < chEndIdx; i++, a++) {
            // Create Chapter Heading
            if (a == 1) {
                chapterHeading = document.createElement('h2');
                chapterHeading.classList.add('chptheading');
                chapterHeading.append(bookname + ' ' + (chNumInBk + 1));
                chapterHeading.id = '_' + bkid + '.' + (chNumInBk + 1);
                ppp.append(chapterHeading)
            }

            versesText = document.createElement('span');
            verseSpan = document.createElement('span');
            verseNum = document.createElement('code');
            // breakElm = document.createElement('br');//I will make the span element block with the css

            let vText = bcv[Number(i)].txt;
            vText = vText.replace(/({(\(((H|G)(\d+))\))})+/g, '<sup class="strnum" strnum="$3" testament="$4" strindx="$5">$2</sup>');
            vText = vText.replace(/({(((H|G)(\d+)))})+/g, '<sup class="strnum" strnum="$2" testament="$4" strindx="$5">$2</sup>');
            vText = vText.replace(/\[/g, '<span class="translated">');
            vText = vText.replace(/\]/g, '</span>');
            vText = vText.replace(/<r>/g, '<span style="color:red">');
            vText = vText.replace(/<\/r>/g, '</span>');
            verseSpan.innerHTML = vText;
            verseNum.prepend((chNumInBk + 1) + ':' + a + ' ');
            // verseNum.prepend(breakElm);
            verseSpan.prepend(verseNum);
            verseSpan.classList.add('verse');
            verseSpan.id = ('_' + bkid + '.' + (chNumInBk + 1) + '.' + a);
            createTransliterationAttr(verseSpan)
            ppp.appendChild(verseSpan);
        }
    }
    // CONTENT ALREADY ON PAGE, JUST SCROLL TO IT
    else {
        gotoId = '_' + bkid + '.' + (chNumInBk + 1) + '.1';
        scrollToVerse(document.getElementById(gotoId))
    }
}

// Create and Append Transliteration Data Attribute
function createTransliterationAttr(x) {
    let strnumInVerse = x.querySelectorAll('.strnum');
    strnumInVerse.forEach(strNumElm => {
        wStrnum = strNumElm.getAttribute('strnum')
        for (abc = 0; abc < strongsJSONresponse.length; abc++) {
            if (strongsJSONresponse[abc].number == wStrnum) {
                let str_trans = strongsJSONresponse[abc].xlit;
                let str_lemma = strongsJSONresponse[abc].lemma;
                strNumElm.setAttribute("data-trans", str_trans);
                strNumElm.setAttribute("data-lemma", str_lemma);
                strNumElm.parentElement.setAttribute("strnum", wStrnum);
                strNumElm.parentElement.setAttribute("data-trans", str_trans);
                strNumElm.parentElement.title = str_trans + " | " + wStrnum + " | " + str_lemma;
                break
            }
        }
    });
}

function getTextOfVerse(xxx) {
    vIdx = xxx.getAttribute("verseIndex")
    ppp.append(bcv[Number(vIdx)].text)
}

// FOR ACTUAL TEXT
// var requestURL = 'bibles_JSON/kjv_strongs.json';
var requestURL = 'bibles_JSON/KJV+_red.json';
var kjvBible = new XMLHttpRequest();
kjvBible.open('GET', requestURL);
kjvBible.responseType = 'json';
kjvBible.send();

let booksChaptersAndVerses;
var bcv;
kjvBible.onload = function () {
    booksChaptersAndVerses = kjvBible.response;
    bcv = booksChaptersAndVerses['verses'];
    openachapteronpageload() //To display Gensis 1 on pageLoad
}

function showStrongs(x) {
    var headPart = document.getElementsByTagName('head')[0];
    hideStrongs = `.strnum {
            display: none;
        }`
    if (x.classList.contains('showing')) {
        newStyleInHead = document.createElement('style');
        newStyleInHead.id = 'hidestrongs';
        newStyleInHead.innerHTML = hideStrongs;
        headPart.append(newStyleInHead);
        x.classList.add('hidingstrongs');
        x.classList.remove('showing');
    } else {
        x.classList.add('showing');
        x.classList.remove('hidingstrongs');
        hidestrongs.remove();
    }
}
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
//Random color Alternative
//+'#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1,6);
function highlightAllStrongs(x) {
    var headPart = document.getElementsByTagName('head')[0];
    cs = `span[strnum="` + x + `"]{background-color:` + randomColor(200) + `;}`
    if (!document.querySelector('style#highlightstrongs')) {
        newStyleInHead = document.createElement('style');
        newStyleInHead.id = 'highlightstrongs';
        newStyleInHead.innerHTML = cs;
        headPart.append(newStyleInHead);
    } else if (!highlightstrongs.toString().includes(`span[strnum="` + x + `"]{background-color:`)) {
        // console.log(x)
        // console.log(cs)
        highlightstrongs = document.getElementById('highlightstrongs').sheet.insertRule(cs, 0)
        highlightstrongs.innerHTML = highlightstrongs.innerText;
        // console.log('hi')
    }
}
main.addEventListener("mousedown", function (e) {
    var hoverElm;
    if (e.target.classList.contains('translated')) {
        hoverElm = e.target;
        stn = hoverElm.getAttribute('strnum');
        console.log(stn)
        highlightAllStrongs(stn)
    } else if (e.target.parentElement.classList.contains('translated')) {
        hoverElm = e.target.parentElement;
        stn = hoverElm.getAttribute('strnum');
        highlightAllStrongs(stn)
    }
})

var stl = 0;
// var strgsInVerseSpan;

function appendTransliteration(strNumElm) {
    if (!strNumElm.classList.contains("translit")) {
        strNumElm.innerText = strNumElm.getAttribute("data-trans");
        strNumElm.classList.add("translit")
    } else {
        strNumElm.innerText = strNumElm.getAttribute("strnum");
        strNumElm.classList.remove("translit")
    }
}

function showTransliteration() {
    for (q = 0; q < ppp.querySelectorAll('.strnum').length; q++) {
        let elm = ppp.querySelectorAll('.strnum')[q];
        appendTransliteration(elm)
    }
}

document.addEventListener("click", function (e) {
    clickedElm = e.target;
    //TO CHANGE A STRONG'S NUMBER TO ITS TRANSLITERATION
    if (clickedElm.classList.contains('strnum')) {
        appendTransliteration(clickedElm)
    }
    //To populate book chapter numbers navigation pane
    else if (clickedElm.classList.contains('bkname')) {
        getBksChptsNum(clickedElm);
        goto = 0;
    }
    //To Get Text of Selected Chapter
    else if (clickedElm.classList.contains('chptnum')) {
        // createChaptersVerses(clickedElm)
        getTextOfChapter(clickedElm)

    }
})

function getAllChapters() {
    //To populate chapter verse numbers navigation pane
    bible_chapters = document.getElementById('bible_chapters');
    allBookChapters = bible_chapters.querySelectorAll('.show_chapter');
    ppp.innerHTML = '';
    allBookChapters.forEach(elm => {
        getTextOfBook(elm)
    });
    currentBook = clickedElm.getAttribute('bookindex');
    currentBookName = clickedElm.getAttribute('bookname');
    let targetVerse = document.getElementById(`_${currentBook}.1.1`); //scroll to first verse of book
    scrollToVerse(targetVerse)
    goto = 1;
}
document.addEventListener("dblclick", function (e) {
    // goto=0;
    clickedElm = e.target;
    //To DISPLAY THE TEXT OF ALL CHAPTERS IN A BOOK
    if (clickedElm.classList.contains('bkname')) {
        getAllChapters()
    }
    //Highlight and Unhighlight verse
    if (clickedElm.classList.contains('verse')) {
        if (!clickedElm.classList.contains('vhlt')) {
            clickedElm.classList.add('vhlt')
        } else {
            clickedElm.classList.remove('vhlt')
        }
    }
})

//TO Identify all words translated from the same original word
main.addEventListener("dblclick", function (e) {
    hoverElm = e.target;
    if (hoverElm.nodeName == 'SPAN' && hoverElm.classList.contains('translated') && !hoverElm.classList.contains('eng2grk')) {
        let stn = hoverElm.querySelector('sup').getAttribute('strnum');
        allSimilarWords = main.querySelectorAll('sup[strnum="' + stn + '"]');
        allSimilarWords.forEach(elm => {
            elmP = elm.parentElement;
            translationValue = elmP.childNodes[0].textContent;
            elmP.setAttribute('trans', translationValue)
            elmP.setAttribute('title', translationValue + " | " + stn)
            elmP.childNodes[0].textContent = "";
            elmP.prepend(elm.getAttribute("data-trans"));
            elmP.classList.add('eng2grk');
        });
    } else if (hoverElm.nodeName == 'SPAN' && hoverElm.classList.contains('eng2grk')) {
        let stn = hoverElm.querySelector('sup').getAttribute('strnum');
        allSimilarWords = main.querySelectorAll('sup[strnum="' + stn + '"]');
        allSimilarWords.forEach(elm => {
            elmP = elm.parentElement;
            let translationValue = elmP.getAttribute('trans')
            elmP.setAttribute('title', translationValue + " | " + stn)
            elmP.childNodes[0].textContent = "";
            elmP.prepend(elmP.getAttribute("trans"));
            elmP.removeAttribute("trans")
            elmP.classList.remove('eng2grk')
        });
    }
})

/* ON PAGE LOAD SELECT THE FIRST BOOK AND CHAPTER */
function openachapteronpageload() {
    bible_books.querySelector('[bookname="Genesis"]').click();
    currentBookName = 'Genesis';
    bible_chapters.querySelector('[chapterindex="0"]').click();
    document.querySelector('body>div.buttons').querySelector('button.showing').click();
    togglenavbtn.click();
}
//Hide navigation when escape is pressed
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        if (navigation.style.display == 'block') {
            navigation.style.display = 'none'
        }
    }
});

function toggleNav() {
    // console.log(navigation.style)
    navigation = document.querySelector('#navigation')
    if (navigation.style.display == 'block') {
        navigation.style.display = 'none'
    } else {
        navigation.style.display = 'block'
    }
    realine();
}
ppp.addEventListener("scroll", realine) //for Scripture Text Highligher
function realine() {} //This empty
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

let wordsearch = document.getElementById('wordsearch')

function runWordSearch() {
    let word2find = new RegExp(wordsearch.value, "i");
    let allVersesInPage = main.querySelectorAll('.verse');
    let searchResultArr = [];
    allVersesInPage.forEach(v => {
        if (v.innerText.search(word2find) != -1) {
            searchResultArr.push(v.id)
            scrollToVerse(v)
        }
    });
    console.log(word2find)
    console.log(searchResultArr)
}
// let position = text.search("Blue");
// let position = text.search("blue");
// let position = text.search(/Blue/);
// let position = text.search(/blue/);
// let position = text.search(/blue/i);

main.addEventListener('mouseover', function(e){
    if(e.target.classList.contains('translated')){
        let newStyleInHead = document.createElement('style');
        newStyleInHead.id = 'highlightall';
        newStyleInHead.innerHTML = '[data-trans="' + e.target.getAttribute('data-trans')+'"]{background-color:rgb(154, 252, 255)}';
        let headPart = document.getElementsByTagName('head')[0];
        headPart.append(newStyleInHead);
    }
})
main.addEventListener('mouseout', function(e){
    if(e.target.classList.contains('translated')){
        document.getElementById('highlightall').remove();
    }
})