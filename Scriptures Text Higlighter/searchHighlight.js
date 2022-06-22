/* HTML */
//<input id="input-text" type="text" placeholder="Type word to search for..." />

/* CSS */
/* 
        main input[type="text"] {
            color: #FBC300;
            background-color: #333;
            font-family: 'Quicksand', sans-serif;
            display: block;
            margin: 0 auto;
            padding: 5px;
        }              
        .search_highlight {
            background-color: #FBC300;
        }
 */

/* JS FUNCITON */
(() => {
 
    function toRegExp(text) {
      return new RegExp(text, 'g');
    }
   
    function toSpan(text, className) {
      return '<span class="' + className + '">' + text + '</span>';
    }
   
    const input = document.querySelector('#input-text');
    const text = document.querySelector('#text');
    const content = text.textContent;
   
    input.addEventListener('input', e => {
      text.textContent = content;
      let string = e.target.value;
   
      if (string.length > 0) {
        text.innerHTML = text.textContent.replace(toRegExp(string), toSpan(string, 'highlight'));
      }
    });
   
  })();

/* SEARCH HIGHLIGHT */
(() => {

  function toRegExp(text) {
      return new RegExp(text, 'g');
  }

  function toSpan(text, className) {
      return '<span class="' + className + '">' + text + '</span>';
  }

  const input = document.querySelector('#input-text');
  const text = document.querySelector('#text');
  const content = text.textContent;

  input.addEventListener('input', e => {
      text.textContent = content;
      let string = e.target.value;

      if (string.length > 0) {
          text.innerHTML = text.textContent.replace(toRegExp(string), toSpan(string, 'search_highlight'));
      }
  });

})();
