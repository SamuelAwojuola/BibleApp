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

function changeSingleStringToTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

function gotoRef(ref_to_get) {
    let ref_bkname, ref_chpnVer, ref_chp, ref_ver, refDisplay;
    let ref;
    if(ref_to_get){ref=ref_to_get}else{ref=reference.value;}
    ref = ref.trim();
    if(ref==''){return}
    //convert every none-digit and none-word to space
    ref = ref.replace(/[.,:;]/g, ' ');
    //ensure every space is a single space
    ref = ref.replace(/\s+/g, ' ');
    //seperate between number and letter
    ref = ref.replace(/(\d)([a-zA-Z]+)/g, '$1 $2');
    ref = ref.replace(/([a-zA-Z]+)(\d)/g, '$1 $2');
    let refArrbySpace = ref.split(" ");

    // Convert Roman Numerals at start of bookName to numbers
    if (refArrbySpace[0].toLowerCase() == 'i') {
        refArrbySpace.splice(0, 1, '1')
    } else if (refArrbySpace[0].toLowerCase() == 'ii') {
        refArrbySpace.splice(0, 1, '2')
    } else if (refArrbySpace[0].toLowerCase() == 'iii') {
        refArrbySpace.splice(0, 1, '3')
    } else if (refArrbySpace[0].toLowerCase() == 'iv') {
        refArrbySpace.splice(0, 1, '4')
    }

    if (refArrbySpace.length == 4) {//Full reference of a book that has 1 & 2 such as '1 Samuel 10 15' and '2 Samuel 2 5'
        if (Number(refArrbySpace[0]) && isNaN(refArrbySpace[1])) {
            ref_bkname = refArrbySpace[0] + ' ' + changeSingleStringToTitleCase(refArrbySpace[1]);
            ref_chp = refArrbySpace[2];
            ref_ver = refArrbySpace[3];
        }
    } else if (refArrbySpace.length == 3) { //Could be, e.g., '1 Sam 3' or 'Joh 3 3'
        //Just book name without chapter and verse reference. E.g., '2 Corinthians'. Default to chapter 1 verse 1
        if (Number(refArrbySpace[0]) && isNaN(refArrbySpace[1])) {
            ref_bkname = refArrbySpace[0] + ' ' + changeSingleStringToTitleCase(refArrbySpace[1]);
            ref_chp = refArrbySpace[2];
            ref_ver = 1;
        }
        //Just book name and chapter without verse reference. E.g., 'Romans 5'. Default to verse 1
        else if (isNaN(refArrbySpace[0]) && Number(refArrbySpace[1])) {
            ref_bkname = changeSingleStringToTitleCase(refArrbySpace[0]);
            ref_chp = refArrbySpace[1];
            ref_ver = refArrbySpace[2];
        }
    } else if (refArrbySpace.length == 2) { //In this case there are different possibilities
        //Just book name without chapter and verse reference. E.g., '2 Corinthians'. Default to chapter 1 verse 1
        if (Number(refArrbySpace[0]) && isNaN(refArrbySpace[1])) {
            ref_bkname = refArrbySpace[0] + ' ' + changeSingleStringToTitleCase(refArrbySpace[1]);
            ref_chp = 1;
            ref_ver = 1;
        }
        //Just book name and chapter without verse reference. E.g., 'Romans 5'. Default to verse 1
        else if (isNaN(refArrbySpace[0]) && Number(refArrbySpace[1])) {
            ref_bkname = changeSingleStringToTitleCase(refArrbySpace[0]);
            ref_chp = refArrbySpace[1];
            ref_ver = 1;
        }
        //Just chapter and verse reference without book name. E.g., '5:5'. Default to current opened book
        else if (Number(refArrbySpace[0]) && Number(refArrbySpace[1])) {
            ref_bkname = currentBookName;
            ref_chp = refArrbySpace[0];
            ref_ver = refArrbySpace[1];
        }
    } else if (refArrbySpace.length == 1) { //In this case there are only TWO possibilities
        //Just book name without chapter and verse reference. E.g., 'Ruth'. Default to chapter 1 verse 1
        if (isNaN(refArrbySpace[0])) {
            ref_bkname = changeSingleStringToTitleCase(refArrbySpace[0]);
            ref_chp = 1;
            ref_ver = 1;
        }
        //Just the chapter without the book name and verse reference. E.g., '10'. Default to current book and verse 1
        else if (Number(refArrbySpace[0])) {
            ref_bkname = currentBookName;
            ref_chp = refArrbySpace[0];
            ref_ver = 1;
        }
    }
    
    // Find id of Book
    ref_Abrev.forEach(ref_ => {
        if (ref_.a.includes(ref_bkname.toUpperCase())) {
            refb = ref_.b - 1;
            if (currentBook != refb) {
                document.querySelector(`[value="book_${refb}"]`).click(); //click on book
                let chptOption = document.querySelector(`[value="bk${refb}ch${ref_chp-1}"]`);
                getTextOfChapter(chptOption,1,null,true)
                // document.querySelector(`[value="bk${refb}ch${ref_chp-1}"]`).click(); //click on book
                // getAllChapters(); //generate text of all chapters in the book
            }
            bkXchY = `bk${ref_.b - 1}ch${ref_chp}`;
            ref_chpnVer = (ref_chp - 1) + '.' + (ref_ver - 1);
            let targetVerse = document.getElementById(`_${refb}.${ref_chpnVer}`);
            scrollToVerse(targetVerse)
            return
        }
    });
    refDisplay = ref_bkname + ' ' + (ref_chp) + '.' + (ref_ver);
    reference.value = refDisplay;
}