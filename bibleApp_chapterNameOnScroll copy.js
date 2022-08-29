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
        let hCidSplit = highestChapterID.split('.');
        let partialIdToSearchFor = hCidSplit[0] + '.' + hCidSplit[1];
        var elmToRemove = main.querySelectorAll('[id^="' + partialIdToSearchFor + '"]')
        
        for (i = elmToRemove.length - 1; i >= 0; i--) {
            elmToRemove[i].remove()
            if (i == 0) {
                highestChapterHeading.remove()
                console.log('removed: ' + highestChapterHeading.innerText)
            }
        }
    }
}

function remove_LOWEST_Chapter() {
    if (main.querySelectorAll('.chptheading').length >= 4) {
        let lowestChapterHeading = main.querySelector('.chptheading:last-of-type');
        let lowestChapterID = lowestChapterHeading.id;
        let lCidSplit = lowestChapterID.split('.');
        let partialIdToSearchFor = lCidSplit[0] + '.' + lCidSplit[1];
        // var elmToRemove = main.querySelectorAll('[id^="' + partialIdToSearchFor + '"]')
        var elmToRemove = main.querySelectorAll('[id^="' + partialIdToSearchFor + '"]')
        
        //ScrollHeight is affected by removal of chapters
        //So, making adjustments for it
        let old_scrollheight = main.scrollHeight;
        for (i = elmToRemove.length - 1; i >= 0; i--) {
            elmToRemove[i].remove()
            if (i == 0) {
                lowestChapterHeading.remove()
                console.log('removed: ' + lowestChapterHeading.innerText)
            }
        }
        main.scrollTo(0,main.scrollHeight - old_scrollheight)
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
            let lastVerseLoadedChapters = main.querySelector('span.verse:last-child').id
            let bkNumb = lastVerseLoadedChapters.replace(/_(\d+)([.]\d+)[.]\d+/, '$1')
            let chptNumb = lastVerseLoadedChapters.replace(/(_\d+[.])(\d+)[.]\d+/, '$2')
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
            let firstVerseLoadedChapters = main.querySelector('span.verse:first-of-type')
            let firstVerseLoadedChaptersID = firstVerseLoadedChapters.id
            let bkNumb = firstVerseLoadedChaptersID.replace(/_(\d+)([.]\d+)[.]\d+/, '$1')
            let chptNumb = firstVerseLoadedChaptersID.replace(/(_\d+[.])(\d+)[.]\d+/, '$2')
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
        targetVerse.previousElementSibling.scrollIntoView({
            // behavior: "smooth"//sometimes does not land on the element properly
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