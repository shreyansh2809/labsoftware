$(document).ready(() => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      if (!user.emailVerified) {
        var markup =
          "<center><H3>Please verify your email first via the link send to your email id and then reload this page.</H3></center>";
        $("body").append(markup);
        $("#container").css("display", "none");
        firebase.auth().currentUser.sendEmailVerification();
      }
      let db = firebase.firestore();

      var userRef = db.collection("Users").doc(user.email + "-details");
      userRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            //nothing to do;
          } else {
            let addDoc = db
              .collection("Users")
              .doc(user.email + "-details")
              .set({
                name: user.displayName,
                email: user.email,
                type: "Admin",
                uid: user.uid
              })
              .then(ref => {
                console.log("Added document with ID: ", ref.id);
              });
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    } else {
      var markup = "<center><H3>Please Login to continue</H3></center>";
      $("body").append(markup);
      $("#container").css("display", "none");
    }
  });
});
