/* CREATE REFERENCE NAV-BAR */
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

/* ON PAGE LOAD SELECT THE FIRST BOOK AND CHAPTER */
function openachapteronpageload() {
    bible_books.querySelector('[bookname="Genesis"]').click();
    currentBookName = 'Genesis';
    bible_chapters.querySelector('[chapterindex="0"]').click();
    // document.querySelector('body>div.buttons').querySelector('button.showing').click();
    togglenavbtn.click();
}

var stl = 0;
var currentBookValue = null;
// var strgsInVerseSpan;

//CLICKING ON BOOK-NAME AND CHAPTER-NUMBER
refnav.addEventListener("click", function (e) {
    clickedElm = e.target;
    //To populate book chapter numbers refnav pane
    if (clickedElm.classList.contains('bkname')) {
        getBksChptsNum(clickedElm);
        goto = 0;
        if (bible_books.querySelector('.tmp_hlt')) {
            bible_books.querySelector('.tmp_hlt').classList.remove('tmp_hlt')
            clickedElm.classList.add('tmp_hlt')
            // clickedElm.scrollIntoView(false)
        }
        clickedElm.classList.add('tmp_hlt')
        currentBookValue = clickedElm.getAttribute('value');
    }
    //To Get Text of Selected Chapter
    else if (clickedElm.classList.contains('chptnum')) {
        //For previous and next chapter
        if (clickedElm.previousElementSibling) {
            prevBibleChapter = clickedElm.previousElementSibling;
        }
        if (clickedElm.nextElementSibling) {
            nextBibleChapter = clickedElm.nextElementSibling;
        }
        // clickedElm.scrollIntoView(false)
        clearPageIfChapterNotPresent(clickedElm)
        getTextOfChapter(clickedElm, null, null, true, true);
        indicateBooknChapterInNav(null, clickedElm)
        currentChapterValue = clickedElm.getAttribute('value')
        localStorage.setItem('lastBookandChapter', currentBookValue + ',' + currentChapterValue);
    }
})

function indicateBooknChapterInNav(bk, chpt) {
    //remove class from previous class holder in refnav
    if (bible_books.querySelector('.tmp_hlt')) {
        bible_books.querySelector('.tmp_hlt').classList.remove('tmp_hlt');
    }
    if (bk) {
        if (refbk = bible_books.querySelector('.ref_hlt')) {
            refbk.classList.remove('ref_hlt')
        }
        bk.classList.add('ref_hlt');        
        getBksChptsNum(bk);
        if(!chpt){
            let chapter_to_highlight = bible_chapters.querySelector('.show_chapter');
            chapter_to_highlight.classList.add('ref_hlt');
            chapter_to_highlight.scrollIntoView(false);
        }
    }
    if (chpt) {
        //remove class from previous class holder in refnav
        if (chptnumref = document.querySelector('.chptnum.ref_hlt')) {
            chptnumref.classList.remove('ref_hlt')
        }
        chpt.classList.add('ref_hlt');
        chpt.scrollIntoView(false);
        if (tmpbk = bible_books.querySelector('.tmp_hlt')) {
            tmpbk.classList.remove('tmp_hlt')
            let bookToHighlight = bible_books.querySelector('[bookname="' + chpt.getAttribute('bookname'));
            bookToHighlight.classList.add('ref_hlt');
            bookToHighlight.scrollIntoView(false);
        }
    }
}

//Hide refnav when escape is pressed
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        if (refnav.style.display == 'block') {
            refnav.style.display = 'none'
        }
    }
});

function toggleNav() {
    hideRefNav()
    // realine();
}

// FUNCTION TO SHOW OR HIDE REF_NAV
function hideRefNav(hORs) {
    if (hORs == 'hide') {
        refnav.classList.remove('slidein');
        refnav.classList.add('slideout');
    } else if (hORs == 'show') {
        refnav.classList.remove('slideout');
        refnav.classList.add('slidein');
    } else {
        if (refnav.classList.contains('slideout')) {
            refnav.classList.remove('slideout');
            refnav.classList.add('slidein');
        }
        else {
            refnav.classList.remove('slidein');
            refnav.classList.add('slideout');
        }
    }
}