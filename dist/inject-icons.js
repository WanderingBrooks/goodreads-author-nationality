const flagLookupURL = chrome.runtime.getURL('./flag-lookup.json');

const authorStatus = {};

fetch(flagLookupURL).then((response) => response.json()).then((flagLookup) => {
  const injectIcon = author => nationality => {
    const nationalityToUse = nationality ? nationality : 'Not Found';

    authorStatus[author.href] = {
      ...authorStatus[author.href],
      status: 'done',
      nationality: nationalityToUse
    };

    const flag = document.createElement('span');
    flag.innerText = flagLookup[nationalityToUse] || nationality;
    flag.title = nationalityToUse;
    author.insertAdjacentHTML('beforeend', '&nbsp;');
    author.appendChild(flag);
  }

  setInterval(() => {
    const bookListAuthors = document.querySelectorAll('a.authorName');

    bookListAuthors.forEach((author, index) => {
      if (!authorStatus[author.href]) {
        authorStatus[author.href] = { displayedIndices: [] };
      }

      if (!authorStatus[author.href].displayedIndices.includes(index)) {
        if (authorStatus[author.href].status === 'done') {
          injectIcon(author)(authorStatus[author.href].nationality);
          authorStatus[author.href].displayedIndices.push(index);
        } else if (authorStatus[author.href].status !== 'loading') {
          chrome.runtime.sendMessage({ message: 'author', author: author.href }, injectIcon(author));
          authorStatus[author.href] = { status: 'loading', displayedIndices: [index] };
        }
      }
    });
 }, 500);
});

