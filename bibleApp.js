//GENERATE ALL CHAPTERS IN A BOOK ON DOUBLE-CLICKING IT
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
function getAllChapters() {
    // let startTime = performance.now() //to get how long it takes to run
    //To populate chapter verse numbers refnav pane
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
// ppp.addEventListener("scroll", realine) //for Scripture Text Highligher
function realine() {} //This empty