//HIGHLIGHTING CLICKED WORD
main.addEventListener("mousedown", function (e) {
    var hoverElm;
    //IF IT IS A WORD TRANGLATED FROM HEBREW/GREEK
    if (e.target.classList.contains('translated')) {
        hoverElm = e.target;
        stn = hoverElm.getAttribute('strnum');
        highlightAllStrongs(stn)
        console.log(stn)
    }
    //IF IT IS THE STRONGS WORD ITSELF
    else if (e.target.parentElement.classList.contains('translated')) {
        hoverElm = e.target.parentElement;
        stn = hoverElm.getAttribute('strnum');
        highlightAllStrongs(stn)
        console.log(stn)
    }
    //HIDE NAVIGATION SIDE BAR IF OPEN BY CLICKING ANYWHERE ON THE PAGE
    if (navigation.style.display == 'block') {
        navigation.style.display = 'none'
    }
})

var stl = 0;
var currentBookValue;
// var strgsInVerseSpan;

//CLICKING ON BOOK-NAME AND CHAPTER-NUMBER
document.addEventListener("click", function (e) {
    clickedElm = e.target;
    //To populate book chapter numbers navigation pane
    if (clickedElm.classList.contains('bkname')) {
        getBksChptsNum(clickedElm);
        goto = 0;
        if (bible_books.querySelector('.tmp_hlt')) {
            bible_books.querySelector('.tmp_hlt').classList.remove('tmp_hlt')
        }
        clickedElm.classList.add('tmp_hlt')
        currentBookValue=clickedElm.getAttribute('value')
    }
    //To Get Text of Selected Chapter
    else if (clickedElm.classList.contains('chptnum')) {
        // createChaptersVerses(clickedElm)
        getTextOfChapter(clickedElm)
        indicateBooknChapterInNav(null, clickedElm)
        currentChapterValue=clickedElm.getAttribute('value')
        localStorage.setItem('lastBookandChapter', currentBookValue+','+currentChapterValue);
    }
})

function indicateBooknChapterInNav(bk, chpt) {
    //remove class from previous class holder in navigation
    if (chptnumref = document.querySelector('.chptnum.ref_hlt')) {
        chptnumref.classList.remove('ref_hlt')
    }
    if (refbk = bible_books.querySelector('.ref_hlt')) {
        refbk.classList.remove('ref_hlt')
    }
    if (chpt) {
        chpt.classList.add('ref_hlt')
        if (tmpbk = bible_books.querySelector('.tmp_hlt')) {
            tmpbk.classList.remove('tmp_hlt')
        }
        bible_books.querySelector('[bookname="' + chpt.getAttribute('bookname')).classList.add('ref_hlt')
    }
    if (bk) {
        bible_books.querySelector('.tmp_hlt').classList.remove('tmp_hlt');
        bible_chapters.querySelector('.show_chapter').classList.add('ref_htl');
        bk.classList.add('ref_hlt');
    }
}

function getAllChapters() {
    // let startTime = performance.now() //to get how long it takes to run
    //To populate chapter verse numbers navigation pane
    if (clickedElm.getAttribute('bookindex') != currentBook) {
        bible_chapters = document.getElementById('bible_chapters');
        allBookChapters = bible_chapters.querySelectorAll('.show_chapter');
        ppp.innerHTML = '';
        allBookChapters.forEach(elm => {
            getTextOfBook(elm)
        });
        currentBook = clickedElm.getAttribute('bookindex');
        currentBookName = clickedElm.getAttribute('bookname');
        let targetVerse = document.getElementById(`_${currentBook}.0.0`); //scroll to first verse of book
        scrollToVerse(targetVerse);
        showCurrentChapterInHeadnSearchBar(ppp.querySelector('h2').innerText);
        goto = 1;
    }
    // let endTime = performance.now();
    // console.log(`Duration: ${endTime - startTime} milliseconds`)
}
document.addEventListener("dblclick", function (e) {
    // goto=0;
    clickedElm = e.target;
    //To DISPLAY THE TEXT OF ALL CHAPTERS IN A BOOK
    if (clickedElm.classList.contains('bkname')) {
        getAllChapters();
        indicateBooknChapterInNav(clickedElm)
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

//TO LOAD NEW CHAPTER WHEN CHAPTER HAS BEEN SCROLLED TO THE END
function moreChaptersOnScroll() {
    main.addEventListener('scroll', loadNewChapterOnScroll)
}

function showOnlyLoadedChapters() {
    main.removeEventListener('scroll', loadNewChapterOnScroll)
}
moreChaptersOnScroll()

function loadNewChapterOnScroll() {
    let lastScrollTop = 0;
    var mst = main.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (mst > lastScrollTop) {
        // downscroll code
        if (main.scrollHeight - main.scrollTop - main.clientHeight < 100) { //If you have scrolled to the end of the element
            let lastVerseLoadedChapters = main.querySelector('span.verse:last-child').id
            let bkNumb = lastVerseLoadedChapters.replace(/_(\d+)([.]\d+)[.]\d+/, '$1')
            let chptNumb = lastVerseLoadedChapters.replace(/(_\d+[.])(\d+)[.]\d+/, '$2')
            let nextChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)+1}"]`)
            if (nextChapter) {
                getTextOfChapter(nextChapter, 0);
            }
            transliteratedWords_Array.forEach(storedStrnum => {
                showTransliteration(storedStrnum)
            });
        }
    } else {
        // upscroll code
        if (main.scrollTop < 10) { //If you have scrolled to the top of the element
            let firstVerseLoadedChapters = main.querySelector('span.verse:first-of-type')
            let firstVerseLoadedChaptersID = firstVerseLoadedChapters.id
            let bkNumb = firstVerseLoadedChaptersID.replace(/_(\d+)([.]\d+)[.]\d+/, '$1')
            let chptNumb = firstVerseLoadedChaptersID.replace(/(_\d+[.])(\d+)[.]\d+/, '$2')
            let prevChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)-1}"]`)
            if (prevChapter) {
                var old_scrollheight = main.scrollHeight; //store document height before modifications

                getTextOfChapter(prevChapter, 0, true);
                let preprevChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)-2}"]`)
                if (preprevChapter) {
                    getTextOfChapter(preprevChapter, 0, true);
                }
                main.scrollTo({
                    top: main.scrollHeight - old_scrollheight
                })
            }
        }
        transliteratedWords_Array.forEach(storedStrnum => {
            showTransliteration(storedStrnum)
        });
    }
    // For Mobile or negative scrolling
    lastScrollTop = mst <= 0 ? 0 : mst;
}

/* ON PAGE LOAD SELECT THE FIRST BOOK AND CHAPTER */
function openachapteronpageload() {
    bible_books.querySelector('[bookname="Genesis"]').click();
    currentBookName = 'Genesis';
    bible_chapters.querySelector('[chapterindex="0"]').click();
    // document.querySelector('body>div.buttons').querySelector('button.showing').click();
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
    navigation = document.querySelector('#navigation');
    let navWidth=navigation.getBoundingClientRect().width;
    if (navigation.style.display == 'block') {
        navWidth=navWidth-10;
        navigation.style.marginLegt = navWidth+'px';
        navigation.style.display = 'none'
    } else {
        navigation.style.display = 'block'
    }
    realine();
}
ppp.addEventListener("scroll", realine) //for Scripture Text Highligher
function realine() {} //This empty