const flagLookupURL = browser.runtime.getURL('./flag-lookup.json');

const authorStatus = {};

fetch(flagLookupURL).then((response) => response.json()).then((flagLookup) => {
  const injectIcon = author => nationality => {
    const nationalityToUse = nationality || 'Not Found';

    authorStatus[author.href] = {
      ...authorStatus[author.href],
      status: 'done',
      nationality: nationalityToUse
    };

    const flag = document.createElement('span');
    flag.innerText = ` ${flagLookup[nationalityToUse] || nationality}`;
    flag.title = nationalityToUse;
    flag.style.cursor = 'help';
    flag.style['font-size'] = flagLookup[nationalityToUse] ? '1.25em' : 'inherit';
    author.parentNode.insertBefore(flag, author.nextSibling);
  }

  const updatedStatusAndInject = callback => (author, index) => {
    if (!authorStatus[author.href]) {
      authorStatus[author.href] = { displayedIndices: [] };
    }

    if (!authorStatus[author.href].displayedIndices.includes(index)) {
      if (authorStatus[author.href].status === 'done') {
        injectIcon(author)(authorStatus[author.href].nationality);
        authorStatus[author.href].displayedIndices.push(index);
      } else if (authorStatus[author.href].status !== 'loading') {
        browser.runtime.sendMessage({ message: 'author', author: author.href }, callback(author));
        authorStatus[author.href] = { status: 'loading', displayedIndices: [index] };
      }
    }
  };

  setInterval(() => {
    const bookListAuthors = document.querySelectorAll('a.authorName');
    const myBooksAuthors = document.querySelectorAll('.field.author .value a');

    bookListAuthors.forEach(updatedStatusAndInject(injectIcon));
    myBooksAuthors.forEach(updatedStatusAndInject(injectIcon));
 }, 500);
});

