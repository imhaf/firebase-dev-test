import { html, render } from 'uhtml';
import menu from '../extensions/menu';
import { getApp } from 'firebase/app';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

export default {
  path: '/add-book',
  label: 'Add Book',
  callback(update) {
    const addBook = async (data) => {
      const db = getFirestore(getApp());
      const docRef = await addDoc(collection(db, "books"), data);
      console.log("Document written with ID: ", docRef.id);
    }
    document.addEventListener("DOMContentLoaded", async function() {
      const myForm = document.querySelector("form[name=bookForm]")
      document.querySelector('input').addEventListener("keydown", function(event) {
        if (event.key == "Enter") {
            event.preventDefault();
        }
      });
      myForm.addEventListener('submit', function(e) {
        e.preventDefault()
        const formData = new FormData(e.target);
        const entries = formData.entries();
        const data = Object.fromEntries(entries);
        console.log(data);
        addBook(data);
      })
    });
    render(document.querySelector('.container'), html`
      ${ menu(update) }
      <h1>Add Book</h1>
      <form name="bookForm">
        <div class="formElement full">
          <div class="field">
            <label>Author</label>
            <input type="text" required name="author">
          </div>
        </div>
        <div class="formElement full">
          <div class="field">
            <label>Title</label>
            <input type="text" required name="title">
          </div>
        </div>
        <div class="formElement">
          <div class="field">
            <label>ISBN</label>
            <input type="number" required name="isbn">
          </div>
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    `);
  }
};