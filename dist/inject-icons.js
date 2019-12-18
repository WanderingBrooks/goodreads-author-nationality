const flagLookupURL = chrome.runtime.getURL('./flag-lookup.json');

const alreadySearched = {};

fetch(flagLookupURL).then((response) => response.json()).then((flagLookup) => {
  const injectIcon = author => nationality => {
    const nationalityToUse = nationality ? nationality : 'Not Found';
    const flag = document.createElement('span');
    flag.innerText = flagLookup[nationalityToUse] || nationality;
    flag.title = nationalityToUse;
    author.insertAdjacentHTML('beforeend', '&nbsp;');
    author.appendChild(flag);
  }

  setInterval(() => {
    const bookListAuthors = document.querySelectorAll('a.authorName');

    bookListAuthors.forEach(author => {
      if (!alreadySearched[author.href]) {
        chrome.runtime.sendMessage({ message: 'author', author: author.href }, injectIcon(author));
        alreadySearched[author.href] = true; 
      }
    });
 }, 500);
});

