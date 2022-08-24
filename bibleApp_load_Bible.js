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

//gotoRef() function was here

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
        setTimeout(function () {
            targetVerse.classList.remove("vhlt");
        }, 8000);
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

// FOR ACTUAL TEXT
// var requestURL = 'bibles_JSON/KJV+_Red.json';
var requestURL = 'bibles_JSON/KJV_theWORD.json';
var kjvBible = new XMLHttpRequest();
kjvBible.open('GET', requestURL);
kjvBible.responseType = 'json';
kjvBible.send();

let booksChaptersAndVerses;
var bcv;
kjvBible.onload = function () {
    booksChaptersAndVerses = kjvBible.response;
    bcv = booksChaptersAndVerses['verses'];
    if(!localStorage.getItem('lastBookandChapter')){//If there is no page stored in the cache
        openachapteronpageload() //To display Gensis 1 on pageLoad
    }
    cacheFunctions()//GET TRANSLITERATED ARRAY FROM CACHE
}

function populateBooks(obj) {
    verses = obj['verses'];
    var versesLength = verses.length;

    var bookName = null,
        bookStartIndex = null,
        bookEndIndex = null,
        numberOfChapters = null;

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

// GENERATE THE TEXT/VERSES OF THE SELECTED CHAPTER
function getTextOfChapter(xxx, oneChptAtaTime = 1, prependORnot) {
    main.scrollTo()
    chNumInBk = Number(xxx.getAttribute("chapterindex"));
    chStartIdx = Number(xxx.getAttribute("chapterStartIndex"));
    chEndIdx = Number(xxx.getAttribute("chapterendindex")) + 1;
    bookname = xxx.getAttribute("bookname");
    bkid = Number(xxx.getAttribute("bookindex"));
    gotoId = '_' + bkid + '.' + chNumInBk + '.0';

    // IF TEXT IS ALREADY ON PAGE, JUST SCROLL TO IT
    if (document.getElementById(gotoId)) {
        scrollToVerse(document.getElementById(gotoId));
    }
    // TEXT NOT ALREADY ON PAGE, SO FRESHLY GENERATE THE CONTENT
    else {
        if (goto == 0) {
            if (oneChptAtaTime) {
                ppp.replaceChildren(); //will only contain one chapter at a time
            }
            let versesFragment = new DocumentFragment();
            let chpheadingFragment = new DocumentFragment();
            let chapterHeading = null;
            for (a = 1, i = chStartIdx; i < chEndIdx; i++, a++) {
                // Create Chapter Heading
                if (a == 1) {
                    chapterHeading = document.createElement('h2');
                    chapterHeading.classList.add('chptheading');
                    chapterHeading.append(bookname + ' ' + (chNumInBk + 1));
                    chapterHeading.id = '_' + bkid + '.' + (chNumInBk + 1);
                    chpheadingFragment.prepend(chapterHeading)
                }

                parseSingleVerse(bkid, chNumInBk, a, bcv[Number(i)], versesFragment)

            }
            if (!prependORnot) {
                versesFragment.prepend(chpheadingFragment);
                ppp.appendChild(versesFragment);
            } else {
                versesFragment.prepend(chpheadingFragment);
                // chapterHeading.after(versesFragment)
                ppp.prepend(versesFragment);
            }
        }
        // CONTENT ALREADY ON PAGE, JUST SCROLL TO IT
        else {
            scrollToVerse(document.getElementById(gotoId))
        }
    }
}

function parseSingleVerse(bkid, chNumInBk, a, jsonVerse, appendHere) {
    let verseSpan = document.createElement('span');
    let verseNum = document.createElement('code');
    // breakElm = document.createElement('br');//I will make the span element block with the css

    let vText = jsonVerse.txt;
    vText = vText.replace(/({(((H|G)(\d+)))})/g, '<span class="strnum" strnum="$2" testament="$4" strindx="$5"></span>');
    // vText = vText.replace(/\[/g, '<span class="translated">');
    vText = vText.replace(/\[([\w\s.,'";:!?\-\(\)]*)/g, '<span class="translated" data-kjv-trans="$1">$1');
    vText = vText.replace(/\]/g, '</span>');
    vText = vText.replace(/<r>/g, '<span style="color:red">');
    vText = vText.replace(/<\/r>/g, '</span>');
    vText = vText.replace(/<RF>([\w\s.,…'";:!?\-\(\)<\/>&]*)<Rf>/g, '<span class="footnote" title="$1">*</span>');
    verseSpan.innerHTML = vText;
    verseNum.prepend(document.createTextNode((chNumInBk + 1) + ':' + a + ' '));
    verseSpan.prepend(verseNum);
    verseSpan.classList.add('verse');
    verseSpan.id = ('_' + bkid + '.' + (chNumInBk) + '.' + (a - 1));
    createTransliterationAttr(verseSpan)

    return appendHere.appendChild(verseSpan);
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

function getTextOfVerse(xxx) {
    vIdx = xxx.getAttribute("verseIndex")
    ppp.append(bcv[Number(vIdx)].text)
}