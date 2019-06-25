$(document).ready(() => {
  $("#addButton").click(() => {
    let name = $("#name").val();
    let qty = $("#qty").val();
    let desc = $("#desc").val();
    let note = $("#note").val();

    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          let db = firebase.firestore();
          let addDoc = db
            .collection("Components")
            .add({
              Name: name,
              Quantity: qty,
              Description: desc,
              Note: note,
              Administrator: user.email
            })
            .then(ref => {
              console.log("Added document with ID: ", ref.id);
            });
        } else {
          // User is signed out.
        }
      },
      function(error) {
        console.log(error);
      }
    );
  });
});
