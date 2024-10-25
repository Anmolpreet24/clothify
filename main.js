if (window.localStorage.getItem("id") === null) {
  window.localStorage.setItem("id", 1);
}

console.log("hello");

function add(params) {
  var i = window.localStorage.getItem("id");
  var flag = false;
  for (let j = 1; j < i; j++) {
    const data = window.localStorage.getItem(j);
    if (data != undefined) {
      const arr = data.split("$");
      const divId = arr[0];

      //already exists
      if (params == divId) {
        flag = true;
        i = j;
        break;
      }
    }
  }
  if (flag) {
    const myDiv = document.getElementById(params);
    const myBtn = myDiv.querySelector("button");

    myBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    window.localStorage.removeItem(i);
  } else {
    const myDiv = document.getElementById(params);
    const myImg = myDiv.querySelector("img");
    const myBtn = myDiv.querySelector("button");
    const imgPath = myImg.src;

    myBtn.textContent = "Added";

    const textDiv = myDiv.querySelector(".trending-text");
    const pTags = textDiv.querySelectorAll("p");
    let pText = "";
    pTags.forEach((p) => {
      pText += p.textContent + "$";
    });

    var index = window.localStorage.getItem("id");
    const myData = params + "$" + imgPath + "$" + pText;

    console.log(index);
    console.log(myData);

    window.localStorage.setItem(index, myData);

    window.localStorage.setItem("id", parseInt(index) + 1);
  }
}

function checkCartState() {
  const index = window.localStorage.getItem("id");

  for (let i = 1; i < index; i++) {
    const storedData = window.localStorage.getItem(i);
    if (storedData) {
      const dataParts = storedData.split("$");
      const productId = dataParts[0]; // Extract the product ID from stored data

      const myDiv = document.getElementById(productId);
      if (myDiv) {
        const myBtn = myDiv.querySelector("button");
        myBtn.textContent = "Added";
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", checkCartState);

//checkout page functionality
function checkoutLoader() {
  const index = window.localStorage.getItem("id");
  var flag = false;
  var bill = 0;
  for (let i = 1; i < index; i++) {
    const data = window.localStorage.getItem(i);
    if (data != undefined) {
      flag = true;

      var arr = data.split("$");
      var img = document.createElement("img");
      img.src = arr[1];

      var name = document.createElement("p");
      name.innerHTML = arr[3];

      var price = document.createElement("p");
      price.innerHTML = arr[4];

      console.log(img.src + " " + name.innerHTML + " " + price.innerHTML);

      var div = document.createElement("div");
      div.append(img, name, price);
      div.className = "cart-items";

      document.getElementById("components").appendChild(div);

      var p = arr[4].substring(4);
      bill += parseInt(p, 10);
    }
  }
  if (flag == false) {
    var div = document.createElement("div");
    var p = document.createElement("p");
    p.innerHTML = "Cart is Empty";

    var a = document.createElement("a");
    a.textContent = "go back to home";
    a.href = "./";

    div.append(p, a);
    document.getElementById("components").appendChild(div);

    document.getElementById("checkout-form").style.display = "none";
  } else {
    console.log(bill);
    var total = document.createElement("p");
    total.innerHTML = "Your total bill is Rs." + bill;

    document.getElementById("total").appendChild(total);
  }
}

/*  submit button functionality */
// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUu-0uiwUxEP4cjd6fSXzs0XALBoeknl8",
  authDomain: "clothify-95195.firebaseapp.com",
  projectId: "clothify-95195",
  storageBucket: "clothify-95195.appspot.com",
  messagingSenderId: "25714836250",
  appId: "1:25714836250:web:6114d0d400397021cb62a3",
  measurementId: "G-4E8BMQFP1E",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.database();

var firebaseId;

function send() {
  console.log("insideFunction");

  // Fetch the current Firebase ID
  db.ref("id")
    .once("value")
    .then((snapshot) => {
      const firebaseId = snapshot.val();
      console.log("Firebase ID:", firebaseId);

      var address = document.getElementById("address").value;
      var phone = document.getElementById("phone").value;
      console.log("Address:", address);
      console.log("Phone:", phone);

      var index = window.localStorage.getItem("id");
      var j = 1;

      var orderData = {
        address: address,
        status: "pending",
        phone: phone,
      };

      // Collect item data from localStorage
      for (let i = 1; i < index; i++) {
        var data = window.localStorage.getItem(i);
        if (data != undefined) {
          var arr = data.split("$");

          var name = arr[3];
          var price = arr[4];

          console.log("Item Name:", name);
          console.log("Item Price:", price);

          // Add each item to orderData
          orderData[j] = {
            name: name,
            price: price,
          };
          j++;

          window.localStorage.removeItem(i);
        }
      }

      // Set the order data to Firebase under the correct path
      db.ref(`orders/order_${firebaseId}`)
        .set(orderData)
        .then(() => {
          console.log("Order added successfully!");

          // Increment the Firebase ID after the order is added
          db.ref("id")
            .set(firebaseId + 1)
            .then(() => {
              console.log("ID updated successfully to:", firebaseId + 1);
            })
            .catch((error) => {
              console.error("Error updating ID:", error);
            });
        })
        .catch((error) => {
          console.error("Error adding order:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching Firebase ID:", error);
    });
  window.alert("order successfull,thank you for shopping");
  //   window.location.reload();
  document.getElementById("components").innerHTML = "";
  document.getElementById("total").innerHTML = "";

  document.getElementById("checkout-form").style.display = "none";

  var h1 = document.createElement("h1");
  h1.innerHTML = "please visit again";

  var a = document.createElement("a");
  a.textContent = "go back to home";
  a.href = "./";

  document.getElementById("components").append(h1, a);
}
