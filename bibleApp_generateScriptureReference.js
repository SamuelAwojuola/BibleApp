var versesOT = 23145;
var versesNT = 7957;
var versesTotal = 31102;


var currentBook, currentBookName, currentChapter;

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

// FOR ACTUAL TEXT
// var requestURL = 'bibles_JSON/KJV+_Red.json';
//Berean Interlinear NT Bible
var showBereanBible = false;
// if(bsb_version.checked){
// showBereanBible = true;}
var bcv_berean=null;
if (showBereanBible) {
    var request_BereanBible_URL = 'bibles_JSON/Berean_Interlinear.json';
    var berean_Interlinear_Bible = new XMLHttpRequest();
    berean_Interlinear_Bible.open('GET', request_BereanBible_URL);
    berean_Interlinear_Bible.responseType = 'json';
    berean_Interlinear_Bible.send();

    berean_Interlinear_Bible.onload = function () {
        let booksChaptersAndVerses = berean_Interlinear_Bible.response;
        bcv_berean = booksChaptersAndVerses['verses'];
    }
}

//KJV Bible OT & NT
var request_KJV_URL = 'bibles_JSON/KJV_theWORD.json';
var kjvBible = new XMLHttpRequest();
kjvBible.open('GET', request_KJV_URL);
kjvBible.responseType = 'json';
kjvBible.send();

var bcv_kjv;
kjvBible.onload = function () {
    let booksChaptersAndVerses = kjvBible.response;
    bcv_kjv = booksChaptersAndVerses['verses'];
    if (!localStorage.getItem('lastBookandChapter')) { //If there is no page stored in the cache
        openachapteronpageload() //To display Gensis 1 on pageLoad
    } else {
        cacheFunctions() //GET TRANSLITERATED ARRAY FROM CACHE
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
    //remove class from previous class holder in refnav
    if (refbk = bible_books.querySelector('.temp_hlt')) {
        refbk.classList.remove('temp_hlt')
    }
    xxx.classList.add('temp_hlt')
}
var goto; //to determine if clicking on chapter number shows only the chapter or scrolls to the chapter
function createChaptersVerses(xxx, yyy) {
    //Clear the chapters refnav pane
    selectVerse.querySelectorAll('*').forEach(element => {
        element.remove();
    });
    getTextOfChapter(xxx, yyy)
}

function getTextOfBook(xxx) {
    getTextOfChapter(xxx, 0)
}

//ON CLICK OF CHAPTER, CLEAR PAGE IF NOT ALREADY PRESENT
function clearPageIfChapterNotPresent(xxx) {
    chNumInBk = Number(xxx.getAttribute("chapterindex"));
    chStartIdx = Number(xxx.getAttribute("chapterStartIndex"));
    chEndIdx = Number(xxx.getAttribute("chapterendindex")) + 1;
    bookName = xxx.getAttribute("bookname");

    currentBookName = bookName;
    bkid = Number(xxx.getAttribute("bookindex"));
    gotoId = '_' + bkid + '.' + chNumInBk + '.0';

    // IF TEXT IS NOT ALREADY ON PAGE, JUST SCROLL TO IT
    if (!document.getElementById(gotoId)) {
        ppp.replaceChildren();
    }
}

// GENERATE THE TEXT/VERSES OF THE SELECTED CHAPTER
function getTextOfChapterOnScroll(xxx, prependORnot, adjustScrolling) {
    var old_scrollheight = main.scrollHeight; //store document height before modifications
    let wholeChapterFragment = new DocumentFragment();
    wholeChapterFragment.prepend(generateChapter(xxx));
    prependORappendChapters(prependORnot, wholeChapterFragment);
    // getBksChptsNum(clickCurrentBook(xxx).book);
    if (adjustScrolling) {
        main.scrollTo(0, main.scrollHeight - old_scrollheight)
    }
}

function getTextOfChapter(xxx, oneChptAtaTime = 1, prependORnot, freshClick = false) {
    chNumInBk = Number(xxx.getAttribute("chapterindex"));
    bkid = Number(xxx.getAttribute("bookindex"));
    bookName = xxx.getAttribute("bookname");
    currentBookName = bookName;
    setItemInLocalStorage('lastBookandChapter', 'book_'+bkid + ',' + xxx.getAttribute("value") + ',' + bookName);

    // clickCurrentBook(xxx);
    let gotoId = '_' + bkid + '.' + chNumInBk + '.0';
    if (document.getElementById(gotoId)) { // IF TEXT IS ALREADY ON PAGE, JUST SCROLL TO IT
        scrollToVerse(document.getElementById(gotoId));
    } else { // TEXT NOT ALREADY ON PAGE, SO FRESHLY GENERATE THE CONTENT
        if (oneChptAtaTime) {
            ppp.replaceChildren();
        } //will only contain one chapter at a time
        let wholeChapterFragment = new DocumentFragment();
        if (freshClick) {
            getPrevNextChapter(xxx, wholeChapterFragment);
            prependORappendChapters(prependORnot, wholeChapterFragment);
        } else {
            wholeChapterFragment.prepend(generateChapter(xxx));
            prependORappendChapters(prependORnot, wholeChapterFragment);
        }
        scrollToVerse(document.getElementById(gotoId));
    }
}

function clickCurrentBook(xxx) {
    bookName = xxx.getAttribute("bookname");
    currentBookName = bookName;
    let bk_option = bible_books.querySelector('[bookname="' + bookName + '"]');
    return {
        indicateBknChpt: indicateBooknChapterInNav(bk_option, xxx),
        clickBook: bk_option.click(),
        clickChpt: xxx.click(),
        book: bk_option
    }
}

function prependORappendChapters(prependORnot, what_to_append) {
    if (!prependORnot) {
        ppp.appendChild(what_to_append);
    } else {
        ppp.prepend(what_to_append);
    }
}

function getPrevNextChapter(prvORnxtChpt, appendHere) {
    //Is prevChapter on page
    if (prvORnxtChpt.previousElementSibling) {
        // console.log('previousElementSibling')

        let prevChapter = prvORnxtChpt.previousElementSibling;
        let prev_chNumInBk = Number(prevChapter.getAttribute("chapterindex"));
        let prev_bkid = Number(prevChapter.getAttribute("bookindex"));
        let prev_gotoId = '_' + prev_bkid + '.' + prev_chNumInBk + '.0';
        if (!document.getElementById(prev_gotoId)) {
            appendHere.append(generateChapter(prevChapter));
        }
    }
    appendHere.append(generateChapter(prvORnxtChpt));
    //Is nextChapter on page
    if (prvORnxtChpt.nextElementSibling) {
        let nextChapter = prvORnxtChpt.nextElementSibling;
        let nxt_chNumInBk = Number(nextChapter.getAttribute("chapterindex"));
        let nxt_bkid = Number(nextChapter.getAttribute("bookindex"));
        let nxt_gotoId = '_' + nxt_bkid + '.' + nxt_chNumInBk + '.0';
        if (!document.getElementById(nxt_gotoId)) {
            appendHere.append(generateChapter(nextChapter));
        }
    }
}

function generateChapter(xyz) {
    let wholeChapterFragment = new DocumentFragment();
    let chpHeadingFragment = new DocumentFragment();
    let chapterHeading = null;
    let chpVersesFragment = new DocumentFragment();
    let chapterVersesSpan = document.createElement('SPAN');
    let xyz_bookName = xyz.getAttribute("bookname");
    let xyz_chStartIdx = Number(xyz.getAttribute("chapterStartIndex"));
    let xyz_chEndIdx = Number(xyz.getAttribute("chapterendindex")) + 1;
    let xyz_chNumInBk = Number(xyz.getAttribute("chapterindex"));
    let xyz_bkid = Number(xyz.getAttribute("bookindex"));
    for (a = 1, i = xyz_chStartIdx; i < xyz_chEndIdx; i++, a++) {
        // Create Chapter Heading
        if (a == 1) {
            chapterHeading = document.createElement('h2');
            chapterHeading.classList.add('chptheading');
            chapterHeading.setAttribute('bookName', xyz_bookName);
            chapterHeading.append(xyz_bookName + ' ' + (xyz_chNumInBk + 1));
            chapterHeading.id = '_' + xyz_bkid + '.' + (xyz_chNumInBk);
            chpHeadingFragment.prepend(chapterHeading)
        }
        parseSingleVerse(xyz_bkid, xyz_chNumInBk, a, Number(i), chpVersesFragment)
    }
    chapterVersesSpan.classList.add('chptverses');
    chapterVersesSpan.setAttribute('bookName', xyz_bookName);
    chapterVersesSpan.setAttribute('bookId', xyz_bkid);
    chapterVersesSpan.setAttribute('chapter', xyz_chNumInBk + 1);
    chapterVersesSpan.append(chpVersesFragment);
    wholeChapterFragment.append(chapterVersesSpan);
    wholeChapterFragment.prepend(chpHeadingFragment);
    return wholeChapterFragment;
    // chpVersesFragment.prepend(chpHeadingFragment);
    // return chpVersesFragment;
}

function parseSingleVerse(bkid, chNumInBk, a, jsonVerseIndex, appendHere) {
    let jsonVerseIdex = Number(jsonVerseIndex);
    let kjv_jsonVerse = bcv_kjv[jsonVerseIdex];
    let verseMultipleSpan = document.createElement('span');
    verseMultipleSpan.classList.add('vmultiple')
    let verseSpan = document.createElement('span');
    let verseNum = document.createElement('code');
    let bereanIndex = jsonVerseIdex - versesOT;

    /* KJV */
    let vText = kjv_jsonVerse.txt;
    vText = vText.replace(/({(((H|G)(\d+)))})/g, '<span class="strnum" strnum="$2" testament="$4" strindx="$5"></span>');
    // vText = vText.replace(/\[/g, '<span class="translated">');
    vText = vText.replace(/\[([\w\s.,'";:!?\-\(\)]*)/g, '<span class="translated" data-kjv-trans="$1">$1');
    vText = vText.replace(/\]/g, '</span>');
    vText = vText.replace(/<r>/g, '<span style="color:red">');
    vText = vText.replace(/<\/r>/g, '</span>');
    vText = vText.replace(/<RF>([\w\s.,…'";:!?\-\(\)<\/>&]*)<Rf>/g, '<span class="footnote" title="$1" aria-hidden="true">*</span>');
    verseSpan.innerHTML = vText;
    verseNum.prepend(document.createTextNode((chNumInBk + 1) + ':' + a + ' '));
    verseNum.setAttribute('ref', kjv_jsonVerse.bkn + ' ' + (chNumInBk + 1) + ':' + a);
    verseNum.setAttribute('aria-hidden','true');
    verseSpan.prepend(verseNum);
    verseSpan.classList.add('verse');
    verseSpan.id = ('_' + bkid + '.' + (chNumInBk) + '.' + (a - 1));
    createTransliterationAttr(verseSpan)
    if (!showBereanBible || bereanIndex < 0) {
        appendHere.appendChild(verseSpan);
    } else {
        verseMultipleSpan.appendChild(verseSpan);
    }

    /* BEREAN */
    if (showBereanBible && bereanIndex >= 0) {
        let berean_jsonVerse = bcv_berean[bereanIndex];
        let verse_BSB_Span = document.createElement('span');
        let verse_BSB_Num = document.createElement('code');

        /* KJV */
        let vText = berean_jsonVerse.txt;
        // console.log(vText)
        vText = vText.replace(/\[((?:(?!\{).)*)\{((?:(?!\{).)*)\{((?:(?!\{).)*)\{(([G|H]\d+)*)\{((?:(?!\}).)*)\}\]/g, '<span class="translated" data-bsb="$1">$1 <span class="strnum" testament="G" strindx="$12" ms="$2" transliteration="$3" strnum="$4" morph="$5" lema="$6"></span></span>');

        vText = vText.replace(/<TS>((?:(?!\<Ts).)*)<Ts>/g, '<span class="section_headings"></span>');
        vText = vText.replace(/_\(/g, '[');
        vText = vText.replace(/\)_/g, ']');
        vText = vText.replace(/<r>/g, '<span style="color:red">');
        vText = vText.replace(/<\/r>/g, '</span>');
        vText = vText.replace(/<RF>([\w\s.,…'";:!?\-\(\)<\/>&]*)<Rf>/g, '<span class="footnote" title="$1" aria-hidden="true">*</span>');
        verse_BSB_Span.innerHTML = vText;
        verse_BSB_Num.classList.add('BSB')
        verse_BSB_Num.prepend(document.createTextNode((chNumInBk + 1) + ':' + a + ' '));
        verse_BSB_Num.setAttribute('ref', berean_jsonVerse.bkn + ' ' + (chNumInBk + 1) + ':' + a);
        verse_BSB_Span.prepend(verse_BSB_Num);
        verse_BSB_Span.setAttribute('aria-hidden','true');
        verse_BSB_Span.classList.add('verse');
        verse_BSB_Span.id = ('_' + bkid + '.' + (chNumInBk) + '.' + (a - 1));
        // createTransliterationAttr(verse_BSB_Span)
        verseMultipleSpan.appendChild(verse_BSB_Span);
        appendHere.appendChild(verseMultipleSpan);
    }
    return appendHere
}


// function getTextOfVerse(xxx) {
//     vIdx = xxx.getAttribute("verseIndex")
//     ppp.append(bcv_kjv[Number(vIdx)].text)
// }