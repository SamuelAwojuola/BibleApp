/* GET TOPMOST H2*/
main.addEventListener('scroll', getHighestVisibleH2)

function getHighestVisibleH2() {
    let higestElm = document.elementFromPoint(main.getBoundingClientRect().x + (main.getBoundingClientRect().width / 2), main.getBoundingClientRect().y + 5);
    // console.log(higestElm)
    if (higestElm.classList.contains('chptheading')) {
        showCurrentChapterInHeadnSearchBar(higestElm)
    }
    let lowerElm = document.elementFromPoint(main.getBoundingClientRect().x + (main.getBoundingClientRect().width / 2), main.getBoundingClientRect().y + 20);
    //if highest visible h2 is between 20 and 5, then make the preceding h2 the highest
    if (lowerElm.classList.contains('chptheading')) { //get the class of the preceding h2 from the id of the current h2
        if (lowerElm.id.split('.')[1] - 1) {
            higestElm = document.getElementById(lowerElm.id.split('.')[0].toString() + '.' + (lowerElm.id.split('.')[1] - 1))
            showCurrentChapterInHeadnSearchBar(higestElm)
        }
    }
}

function showCurrentChapterInHeadnSearchBar(h) {
    //Change reference in reference search box
    reference.value = h.innerText;
    //Make current chapter page title
    document.querySelector('head>title').innerText = /*'LightCity-' +  */ h.innerText
}