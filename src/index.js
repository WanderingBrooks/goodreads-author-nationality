import { parse } from 'node-html-parser';
import axios from 'axios';

const extractAuthorNationality = html => {
  const parsed = parse(html);
  const previousSibling = parsed.querySelector('div.dataTitle');
  const index = previousSibling.parentNode.childNodes.findIndex(el => el === previousSibling);
  const fullAddress = previousSibling.parentNode.childNodes[index + 1];
  const formattedAddress = fullAddress.rawText.replace(/\s+/g, ' ').trim().replace('in ', '');
  return formattedAddress.split(', ').pop();
}

const fetchAuthorNationality = async (authorURL) => {
  let data;
  try {
    ({ data } = await axios(authorURL));
    return extractAuthorNationality(data)
  } catch (e) {
    return '';
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.message) {
    case 'author':
      fetchAuthorNationality(request.author).then(sendResponse);
      break;
    default:
      throw new Error('message type not supported');
  }

  return true; 
});