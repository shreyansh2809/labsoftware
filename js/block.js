$(document).ready(() => {
  $("#block").click(() => {
    let name = $("#name").val();
    let email = $("#email").val();

    let db = firebase.firestore();
    let userRef = db.collection("Users").doc(email + "-details");

    userRef
      .get()
      .then(function(doc) {
        if (!doc.exists) {
          var markup = "<h3>The email id entered does not exist</h3><br>";
          $("#info").html(markup);
          console.log("No matching documents.");
          return;
        } else {
          if (name == doc.data().name) {
            if (doc.data().disabled == true) {
              var markup = "<h3>The User is already blocked</h3><br>";
              $("#info").html(markup);
            } else {
              userRef.update({
                disabled: true
              });
              var markup = "<h3>The User is blocked</h3><br>";
              $("#info").html(markup);
            }
          } else {
            var markup =
              "<h3>The name entered does not match the information</h3><br>";
            $("#info").html(markup);
          }
        }
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  });

  $("#unBlock").click(() => {
    let name = $("#name").val();
    let email = $("#email").val();

    let db = firebase.firestore();
    let userRef = db.collection("Users").doc(email + "-details");

    userRef
      .get()
      .then(function(doc) {
        if (!doc.exists) {
          var markup = "<h3>The email id entered does not exist</h3><br>";
          $("#info").html(markup);
          console.log("No matching documents.");
          return;
        } else {
          if (name == doc.data().name) {
            if (doc.data().disabled == true) {
              userRef.update({
                disabled: false
              });
              var markup = "<h3>The User is Unblocked now</h3><br>";
              $("#info").html(markup);
            } else {
              var markup = "<h3>The User is not blocked</h3><br>";
              $("#info").html(markup);
            }
          } else {
            var markup =
              "<h3>The name entered does not match the information</h3><br>";
            $("#info").html(markup);
          }
        }
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  });
});
