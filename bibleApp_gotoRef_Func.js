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

function gotoRef() {
    let ref = reference.value;
    ref = ref.trim();
    ref = ref.replace(/(\d+)\s+(\d+)/g, '$1.$2'); // 15 55==>15.55
    ref = ref.replace(/\s{2,}/g, ' '); // 1 Cor 15 : 55
    ref = ref.replace(/(\d+)[.,:;\s*]+(\d+)/g, '$1.$2'); // 1 Cor 15.55
    ref = ref.replace(/(\d)\s*([a-zA-Z]+)/, '$1$2'); //2 Pet3:20 ==> 2Pet3:20
    ref = ref.replace(/([a-zA-Z]+)[.,:;](\d+)/, '$1 $2'); //Gal.3:20 ==> Gal 3:20
    ref = ref.replace(/(\d*[a-zA-Z]+)(\d+)/, '$1 $2'); //Psa15.55 ==> Psa 15.55
    let ref_bkname, ref_chpnVer, ref_chp, ref_ver, refDisplay;

    let refArrbySpace = ref.split(" ");
    if (refArrbySpace.length > 1) { //Check if ref has book name
        //the last elememnt in the array should be a chapter number or chapter and verse numbers joined by a dot
        let refEnd = refArrbySpace[refArrbySpace.length - 1];
        if (refEnd.split('.').length == 1) {
            ref_chp = refEnd;
            ref_ver = 1;
        } //if it is a number, then it is chapter number
        else if (refEnd.split('.').length > 1) { //if it is not, split by dot and check each part
            let refEndArraySplitbyDot = refEnd.split('.');
            if (Number(refEndArraySplitbyDot[0])) {
                ref_chp = refEndArraySplitbyDot[0];
            } else {
                ref_chp = 1;
            }
            if (Number(refEndArraySplitbyDot[1])) {
                ref_ver = refEndArraySplitbyDot[1]
            } else {
                ref_ver = 1;
            }
        }
        refArrbySpace.pop();
        ref_bkname = refArrbySpace.join(' '); //Psa 15.55 ==> Psa
        ref_chpnVer = ref_chp + '.' + ref_ver
        ref = ref_bkname + ' ' + ref_chpnVer;
    } else if (refArrbySpace.length == 1) { //If there is no space
        if ((!Number(refArrbySpace[0]))) { //If it is not a number, then it must be the Book Ref Name
            ref_bkname = ref;
            ref_chpnVer = '1.1';
            ref_chp = 1;
            ref_ver = 1;
            ref = ref_bkname + ' 1.1';
        } else if (Number(refArrbySpace[0])) { //If it is a Number, check that it doesn't have a decimal
            console.log('Jesus')
            if (refArrbySpace[0].split('.').length == 1) { //if it has no decimal, then it is the Chapter Number
                ref_chpnVer = ref + '.1';
                ref_chp = ref;
                ref_ver = 1;
                ref = ref_bkname + ' ' + ref_chpnVer;
            } else { //If it has decimal
                if (Number(refArrbySpace[0].split('.')[0])) { //If the first part is a Number, then it is the chapter num
                    ref_chp = refArrbySpace[0].split('.')[0];
                    ref_ver = refArrbySpace[0].split('.')[1]; //Assuming the secong part is a Number (we'll check next)
                    ref_chpnVer = ref_chp + '.' + ref_ver;
                    if (!Number(refArrbySpace[0].split('.')[1])) { //If the second part is not a number, then default to '1'
                        ref_ver = 1;
                        ref_chpnVer = ref_chp + '.1';
                    }
                } else { //If the first part is not a number, then default to '1.1s'
                    ref_chp = 1;
                    ref_ver = 1;
                    ref_chpnVer = ref_chp + '.1';
                }
            }
            ref_bkname = currentBookName;
        }
    }
    ref = ref_bkname + ' ' + (ref_chp - 1) + '.' + (ref_ver - 1);
    refDisplay = ref_bkname + ' ' + (ref_chp) + '.' + (ref_ver);
    ref_chpnVer = (ref_chp - 1) + '.' + (ref_ver - 1);
    refDisplay = refDisplay.toLowerCase();
    if (!Number(refDisplay.charAt(0))) {
        reference.value = refDisplay.charAt(0).toUpperCase() + refDisplay.slice(1)
    } else if (!Number(refDisplay.charAt(1))) {
        reference.value = refDisplay.charAt(0) + refDisplay.charAt(1).toUpperCase() + refDisplay.slice(2)
    } else {
        reference.value = refDisplay;
        ref = refDisplay;
    }
    /*
    console.log('ref:' + ref);
    console.log('ref_bkname:' + ref_bkname);
    console.log(ref_bkname.charAt(0).toUpperCase() + ref_bkname.slice(1));
    console.log('ref_chpnVer:' + ref_chpnVer);
    console.log('ref_chp:' + ref_chp);
    console.log('ref_ver:' + ref_ver)
    */
    // Find id of Book
    ref_Abrev.forEach(ref_ => {
        if (ref_.a.includes(ref_bkname.toUpperCase())) {
            refb = ref_.b - 1;
            if (currentBook != refb) {
                document.querySelector(`[value="book_${refb}"]`).click(); //click on book
                getAllChapters(); //generate text of all chapters in the book
            }
            // ref_chp = ref_chp - 1;
            bkXchY = `bk${ref_.b - 1}ch${ref_chp}`;
            let targetVerse = document.getElementById(`_${refb}.${ref_chpnVer}`);
            scrollToVerse(targetVerse)
            return
        }
    });
}