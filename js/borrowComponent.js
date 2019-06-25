$(document).ready(() => {
  let name;
  let qty;
  let email;
  let admin;

  firebase.auth().onAuthStateChanged(
    function(user) {
      if (user) {
        admin = user.email;
      } else {
        // User is signed out.
      }
    },
    function(error) {
      console.log(error);
    }
  );

  $("#borrowButton").click(function() {
    name = $("#component").val();
    email = $("#email").val();
    qty = $("#qty").val();

    let db = firebase.firestore();
    let addDoc = db
      .collection("Borrow")
      .add({
        componentName: name,
        borrowerEmail: email,
        quantity: qty,
        adminEmail: admin
      })
      .then(ref => {
        console.log("Added document with ID: ", ref.id);
      });
  });
});
