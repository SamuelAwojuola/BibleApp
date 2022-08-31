/* GET TOPMOST H2*/
main.addEventListener('scroll', getHighestVisibleH2)

function getHighestVisibleH2() {
    let higestElm = document.elementFromPoint(main.getBoundingClientRect().x + (main.getBoundingClientRect().width / 2), main.getBoundingClientRect().y + 5);
    if (higestElm.classList.contains('chptheading')) {
        showCurrentChapterInHeadnSearchBar(higestElm)
    }
    let lowerElm = document.elementFromPoint(main.getBoundingClientRect().x + (main.getBoundingClientRect().width / 2), main.getBoundingClientRect().y + 20);
    //if highest visible h2 is between 20 and 5, then make the preceding h2 the highest
    if (lowerElm.classList.contains('chptheading')) { //get the class of the preceding h2 from the id of the current h2
        if (lowerElm.id.split('.')[1] - 1) {
            higestElm = document.getElementById(lowerElm.id.split('.')[0].toString() + '.' + (lowerElm.id.split('.')[1] - 1))
            if (higestElm) {
                showCurrentChapterInHeadnSearchBar(higestElm)
            }
        }
    }
}

function showCurrentChapterInHeadnSearchBar(h) {
    //Change reference in reference search box
    reference.value = h.innerText;
    //Make current chapter page title
    document.querySelector('head>title').innerText = /*'LightCity-' +  */ h.innerText
    //To indicate the selected current chapter
    let hID = h.id.split('_')[1];
    let selectedChapter = bible_chapters.querySelector(`[value="bk${hID.split('.')[0].toString()}ch${Number(hID.split('.')[1])}"]`)
    let bkName = bible_books.querySelector(`[bookname="${h.getAttribute('bookname')}"]`);
    indicateBooknChapterInNav(bkName, selectedChapter)
}

/* REMOVE HIGHEST AND LOWEST CHAPTERS VERSES */
function remove_HIGHEST_Chapter() {
    if (main.querySelectorAll('.chptheading').length >= 4) {
        let highestChapterHeading = main.querySelector('.chptheading:first-of-type');
        let highestChapterID = highestChapterHeading.id;
        let highestChapterBookName = highestChapterHeading.getAttribute('bookname');
        let hCidSplit = highestChapterID.split('.');
        let chapterNum = Number(hCidSplit[1]) + 1;
        let elmToRemove = main.querySelector('[bookname="' + highestChapterBookName + '"][chapter="' + chapterNum + '"]')
        highestChapterHeading.remove();
        elmToRemove.remove();
    }
}

function remove_LOWEST_Chapter() {
    if (main.querySelectorAll('.chptheading').length >= 4) {
        let lowestChapterHeading = main.querySelector('.chptheading:last-of-type');
        let lowestChapterID = lowestChapterHeading.id;
        let lowestChapterBookName = lowestChapterHeading.getAttribute('bookname');
        let lCidSplit = lowestChapterID.split('.');
        let chapterNum = Number(lCidSplit[1]) + 1;
        let elmToRemove = main.querySelector('[bookname="' + lowestChapterBookName + '"][chapter="' + chapterNum + '"]')
        //ScrollHeight is affected by removal of chapters
        //So, making adjustments for it
        let old_scrollheight = main.scrollHeight;
        lowestChapterHeading.remove();
        elmToRemove.remove();
        main.scrollTo(0, main.scrollHeight - old_scrollheight)
    }
}

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
            let lastChapter = main.querySelector('.chptverses:last-child');
            // console.log(lastChapter)
            let bkNumb = lastChapter.getAttribute('bookid');
            let chptNumb = lastChapter.getAttribute('chapter')-1;
            // let nextChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)+1}"]`)//Stops generating chapters at end of book
            let nextChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)}"]`).nextElementSibling;

            if (nextChapter) {
                remove_HIGHEST_Chapter()
                getTextOfChapterOnScroll(nextChapter, 0);
            }
            transliteratedWords_Array.forEach(storedStrnum => {
                showTransliteration(storedStrnum)
            });
        }
    } else {
        // upscroll code
        if (main.scrollTop < 10) { //If you have scrolled to the top of the element
            let firstChapter = main.querySelector('.chptverses:first-of-type')
            let bkNumb = firstChapter.getAttribute('bookid');
            let chptNumb = firstChapter.getAttribute('chapter')-1;
            // let prevChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)-1}"]`)//Stops generating chapters when scrolling gets to the beginning of book
            let prevChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)}"]`).previousElementSibling
            if (prevChapter) {
                remove_LOWEST_Chapter()
                getTextOfChapterOnScroll(prevChapter, true, true);
            }
        }
        transliteratedWords_Array.forEach(storedStrnum => {
            showTransliteration(storedStrnum)
        });
    }
    // For Mobile or negative scrolling
    lastScrollTop = mst <= 0 ? 0 : mst;
}

/* Scroll To Target Verse */
function scrollToVerse(targetVerse) {
    if (targetVerse) {
        if (targetVerse.previousElementSibling) {
            targetVerse.previousElementSibling.scrollIntoView({
                // behavior: "smooth"//sometimes does not land on the element properly
            });
        }else{//(must be first verse so) scroll to parents sibling
            targetVerse.parentElement.previousElementSibling.scrollIntoView()
        }
        //scroll to element before it to give some gap
        // targetVerse.classList.add('vhlt');
        // targetVerse.classList.add('vglow');
        // setTimeout(function () {
        //     targetVerse.classList.remove("vglow");
        // }, 1000);
        // setTimeout(function () {
        //     targetVerse.classList.remove("vhlt");
        // }, 5000);
        targetVerse.classList.add('flashit');
        setTimeout(function () {
            targetVerse.classList.remove("flashit");
        }, 5000);
    }
}