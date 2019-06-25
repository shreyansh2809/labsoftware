// A2Z F16
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F16

// Get input from user
var nameInput;
var diagramInput;
var descInput;
var useInput;
var quantityInput;
let email;

// Keep list of DOM elements for clearing later when reloading
var listItems = [];
var database;

function setup() {
  var firebaseConfig = {
    apiKey: "AIzaSyBtnXBu37DTtoawUdu478QaPcSLnl-f9r4",
    authDomain: "labsoftware-6339e.firebaseapp.com",
    databaseURL: "https://labsoftware-6339e.firebaseio.com",
    projectId: "labsoftware-6339e",
    storageBucket: "labsoftware-6339e.appspot.com",
    messagingSenderId: "988796475362",
    appId: "1:988796475362:web:52185b52cb776d02"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();

  // Input fields
  nameInput = select("#name");
  diagramInput = select("#diagram");
  descInput = select("#desc");
  useInput = select("#use");
  quantityInput = select("#quantity");

  // Submit button
  var submit = select("#submit");
  submit.mousePressed(sendToFirebase);

  firebase.auth().onAuthStateChanged(
    function(user) {
      if (user) {
        email = user.email;
        console.log("email:", email);
      } else {
        // User is signed out.
      }
    },
    function(error) {
      console.log(error);
    }
  );
}

// The data comes back as an object
/*function gotData(data) {
  var components = data.val();

  // Grab all the keys to iterate over the object
  var keys = Object.keys(components);

  // clear previous HTML list
  clearList();

  // Make an HTML list
  var list = createElement("ol");
  list.parent("data");

  // Loop through array
  for (i in keys) {
    var key = keys[i];
    var component = components[key];
    var li = createElement(
      "li",
      component.name +
        "     :     " +
        component.diagram +
        "     :     " +
        component.desc +
        "     :     " +
        component.use +
        "     :     " +
        component.quantity +
        ", key: " +
        key
    );
    li.parent(list);
    listItems.push(li);
    updateQRCode(key);
  }
}
*/
// Clear everything
function clearList() {
  for (var i = 0; i < listItems.length; i++) {
    listItems[i].remove();
  }
}

// This is a function for sending data
function sendToFirebase() {
  // var components = database.ref("component");
  // console.log("email:", email);

  // // Make an object with data in it
  // var data = {
  // name: nameInput.value(),
  // diagram: diagramInput.value(),
  // desc: descInput.value(),
  // use: useInput.value(),
  // quantity: quantityInput.value(),
  // adminEmail: email
  // };

  // var component = components.push(data, finished);
  // console.log("Firebase generated key: " + component.key);
  const ref = firebase.storage().ref();
  const file = $("#diagram").get(0).files[0];
  const name = +new Date() + "-" + file.name;
  var uploadTask = ref.child(name).put(file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on(
    "state_changed",
    function(snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function(error) {
      // Handle unsuccessful uploads
    },
    function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log("File available at", downloadURL);
        alert("uploading Complete.");
        let db = firebase.firestore();
        let addDoc = db
          .collection("Components")
          .add({
            name: nameInput.value(),
            diagram: downloadURL,
            desc: descInput.value(),
            use: useInput.value(),
            quantity: quantityInput.value(),
            adminEmail: email
          })
          .then(ref => {
            $("#qr").css("display", "block");
            updateQRCode(ref.id);
            console.log("Added document with ID: ", ref.id);
          });
      });
    }
  );

  // let db = firebase.firestore();
  // let addDoc = db
  //   .collection("Components")
  //   .add({
  //     name: nameInput.value(),
  //     diagram: diagramInput.value(),
  //     desc: descInput.value(),
  //     use: useInput.value(),
  //     quantity: quantityInput.value(),
  //     adminEmail: email
  //   })
  //   .then(ref => {
  //     console.log("Added document with ID: ", ref.id);
  //   });

  // Reload the data for the page
  // function finished(err) {
  //   if (err) {
  //     console.log("ooops, something went wrong.");
  //     console.log(err);
  //   } else {
  //     console.log("Data saved successfully");
  //   }
  // }
}
function updateQRCode(text) {
  var element = document.getElementById("qrcode");

  var bodyElement = document.body;
  if (element.lastChild)
    element.replaceChild(showQRCode(text), element.lastChild);
  else element.appendChild(showQRCode(text));
}
