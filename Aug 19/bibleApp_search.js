/* FUNCTION FOR SEARCH FOR SCRIPTURES BY WORDS AND PHRASES */
let wordsearch = document.getElementById('wordsearch')

function runWordSearch() {
    /* 
    SOME POSSIBLE SEARCH PARAMETERS
    Search excluding Strongs Number
        Search for verses with the exact phrase
    Search may include Strongs Number
        Search for verses with any of the words
        Search for verses that have all the words in any order
    */
    searchPreview.innerHTML = '';
    // let word2find = wordsearch.value;
    let word2find = new RegExp(wordsearch.value, "i");
    let allVersesInPage = main.querySelectorAll('.verse');
    let searchResultArr = [];
    let moreThanOneWord = false;

    if (arrayOfWordsToSearchFor(wordsearch.value).length > 1) {
        moreThanOneWord = true
    }
    console.log(arrayOfWordsToSearchFor(wordsearch.value).wordsArray)

    function searchInPage() {
        allVersesInPage.forEach(v => {
            if (v.innerText.search(word2find) != -1) {
                searchResultArr.push(v.id)
                scrollToVerse(v)
            }
        });
    }

    function appendVerseToSearchResultWindow(verseToAppend, currentBK = null, prevBook = null) {
        if ((prevBook != currentBK) || (prevBook == null)) {
            chapterHeading = document.createElement('h2');
            chapterHeading.classList.add('chptheading');
            chapterHeading.append(currentBK);
            searchPreview.appendChild(chapterHeading)
            prevBook = currentBK;
        }
        let bkid = Number(verseToAppend.bk) - 1;
        let chNumInBk = Number(verseToAppend.ch) - 1;
        let v = Number(verseToAppend.v);
        let jsonVerse = verseToAppend;
        let verseID = '_' + bkid + '.' + chNumInBk + '.' + v;
        searchResultArr.push(verseID)
        parseSingleVerse(bkid, chNumInBk, v, jsonVerse, searchPreview)
    }

    function searchJSON() {
        let prevBook = null;
        let currentBK = null;
        let findAnything = false;
        let stateOfTextToSearch;
        let searchForStrongs = arrayOfWordsToSearchFor(wordsearch.value).hasStrongsNum;
        console.log(searchForStrongs)


        if (searchForStrongs == true) {
            //If there is a strongs num to be searched for, then you cannot search for a phrase. Rather search for to see if verse contains all words
            for (let i = 0; i < bcv.length; i++) {
                let containsAll = true;
                //Strip off {}[] and strongs numbers
                let originalText = bcv[i].txt;
                stateOfTextToSearch = originalText;
                let wordsArray = arrayOfWordsToSearchFor(wordsearch.value).wordsArray;
                for (let j = 0; j < wordsArray.length; j++) {
                    if (!originalText.includes(wordsArray[j])) {
                        containsAll = false;
                        break
                    }
                    //IT WILL ONLY CHECK AT THE END OF THE FOR LOOP WHICH IT WILL NOT GET TO IF ALL WORDS ARE NOT INCLUDED IN THE VERSE.TXT
                    // if (j == wordsArray.length - 1) {
                    if ((prevBook != currentBK) || (prevBook == null)) {
                        prevBook = currentBK;
                    }
                    currentBK = bcv[i].bkn;
                    appendVerseToSearchResultWindow(bcv[i], currentBK, prevBook);
                    findAnything = true;
                    // }
                }
            }
        } else if (searchForStrongs == false) {
            //If there is no strongs num to be searched for, then just search for the phrase
            for (let i = 0; i < bcv.length; i++) {
                let originalText = bcv[i].txt;
                //Strip off {}[] and strongs numbers
                let madePlain = originalText.replace(/(\w)\{H|G\d+}/g, '$1');
                madePlain = madePlain.replace(/[{}]/g, '');
                madePlain = madePlain.replace(/[\[\]]/g, '');
                madePlain = madePlain.replace(/<i>/g, '');
                madePlain = madePlain.replace(/<\/i>/g, '');
                madePlain = madePlain.replace(/<r>/g, '');
                madePlain = madePlain.replace(/<\/r>/g, '');
                madePlain = madePlain.replace(/\s\s+/g, ' ');
                if (madePlain.search(word2find) != -1) {
                    if ((prevBook != currentBK) || (prevBook == null)) {
                        prevBook = currentBK;
                    }
                    currentBK = bcv[i].bkn;
                    appendVerseToSearchResultWindow(bcv[i], currentBK, prevBook);
                    findAnything = true;
                }
            }

        }
        if (findAnything == false) {
            searchPreview.innerHTML = '<code>Sorry, <i><b>' + wordsearch.value + '</b></i> Was Not Found!</code>'
        }
        showElement(searchresultwindow)
    }
    searchJSON()
    // console.log(word2find)
    // console.log(searchResultArr.length)
    // console.log(searchResultArr)
}

function arrayOfWordsToSearchFor(w) {
    let hasStrongs = w.replace(/.*[H|G]\d+.*/ig, 'YesItHasStrongs');
    w = w.replace(/[(\s\s+),.;:]/g, ' ');
    w = w.trim();
    let wArray = w.split(' ');
    return {
        "wordsArray": wArray,
        "hasStrongsNum": hasStrongs == 'YesItHasStrongs',
        "moreThanOneWord": wArray.length > 1
    }
}

function hideElement(el) {
    el.classList.add("displaynone")
}

function showElement(el) {
    el.classList.remove("displaynone")
}

function minimize(el) {
    if (el.style.height != '0px') {
        el.style.height = '0';
        el.classList.add("displaynone")
    } else {
        el.style.height = 'auto';
        el.classList.remove("displaynone")
    }
}
// let position = text.search("Blue");
// let position = text.search("blue");
// let position = text.search(/Blue/);
// let position = text.search(/blue/);
// let position = text.search(/blue/i);


/* GET TOPMOST H2 -- INTERSECTION OBSERVER */
let observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            /* Placeholder replacement */
            console.log(entry.target)
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
        });
    }, {
        root: document.querySelector('#main'), rootMargin: "0px 0px 20px 0px"
    });
main.querySelectorAll('h2').forEach(h2 => {
    observer.observe(h2)
});