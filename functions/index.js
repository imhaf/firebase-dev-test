// Create cloud function to convert the ISBN number to a link and save it in the database
const functions = require('firebase-functions');

exports.convertISBN = functions.firestore.document('books/{bookId}').onCreate((snap, context) => {
    const isbn = snap.data().isbn;

    if (isbn) {
        const url = `https://covers.openlibrary.org/b/isbn/${ isbn }-S.jpg`;
        return snap.ref.set({image_url: url}, {merge: true});
    }
    return 'Not adding image URL!';
});