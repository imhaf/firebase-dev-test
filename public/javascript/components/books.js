import { html, render } from 'uhtml';
import menu from '../extensions/menu';
import { getApp } from 'firebase/app';
import { getFirestore, collection, query, getDocsFromServer, updateDoc, doc, getDoc } from 'firebase/firestore';

export default {
  path: '/books',
  label: 'Books',
  callback: async(update) => {

    const database = getFirestore(getApp());
    const updateBook = async () => {
      const docRef = doc(database, "books/OH8glJGrD6a6aFVqZj01");
      const docSnap = await getDoc(docRef);
      if (!docSnap.data().isbn) {
        await updateDoc(docRef, {
          isbn: "0140092501"
        });
      }
    }
    await updateBook();
    const books = await getDocsFromServer(query(collection(database, 'books')));
    let content = html`<p>There are no books available</p>`;

    function thumbnail(item) {
      const { isbn, image_url } = item.data();
      if (isbn) {
        const url = image_url || `https://covers.openlibrary.org/b/isbn/${ item.data().isbn }-S.jpg`;
        return html`<img src="${ url }" />`;
      }
      return '';
    }

    if (!books.empty) {
      content = html`<ul class="booksContainer">
        ${ books.docs.map(item => html.for(item)`
          <li>
            ${ thumbnail(item) }
            <h1>${ item.data().title }</h1>
            <p>${ item.data().author }</p>
          </li>
        `) }
      </ul>`;
    }

    render(document.querySelector('.container'), html`
      ${ menu(update) }
      <h1>Books</h1>
      ${ content }
    `);
  }
};