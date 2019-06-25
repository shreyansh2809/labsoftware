$(document).ready(() => {
  let db = firebase.firestore();
  let snap;
  firebase.auth().onAuthStateChanged(
    function(user) {
      if (user) {
        var email = user.email;
        getComponents(email);
        console.log(snap);
        console.log(email);
      } else {
        // User is signed out.
      }
    },
    function(error) {
      console.log(error);
    }
  );

  // Find and remove selected table rows
  function getComponents(email) {
    console.log("aaa", email);
    // let db = firebase.database();
    // let componentsRef = db.ref("component");
    let componentsRef = db.collection("Components");
    let query = componentsRef
      .where("adminEmail", "==", email)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        } else {
          snapshot.forEach(doc => {
            var markup =
              "<tr><td><input type='checkbox' name='record'></td><td class='name'>" +
              doc.data().name +
              "</td><td>" +
              doc.data().quantity +
              "</td><td>" +
              doc.data().desc +
              "</td><td>" +
              doc.data().use +
              "</td></tr>";
            $("table tbody").append(markup);
            // console.log(doc.id, "=>", doc.data());
          });
          console.log("aaa", snapshot);
          snap = snapshot;
        }
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
    // componentsRef.on("value", function(snapshot) {
    //   snapshot.forEach(function(childSnapshot) {
    //     var childData = childSnapshot.val();
    //     console.log("data", childData);
    //     console.log("data", childData);
    //   });
    // });
  }

  $(".delete-row").click(function() {
    $("table tbody")
      .find('input[name="record"]')
      .each(function() {
        if ($(this).is(":checked")) {
          var td = $(this).parents("td");
          var cell = td.siblings(".name");
          var name = cell.html();
          $(this)
            .parents("tr")
            .remove();
          console.log(cell);
          console.log(name);
          snap.forEach(doc => {
            if (doc.data().name == name) {
              let deleteDoc = db
                .collection("Components")
                .doc(doc.id)
                .delete();
              console.log("doc removed");
            }
          });
        }
      });
  });
});
