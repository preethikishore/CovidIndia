const express = require("express");
const https = require("https");
const fetch = require("node-fetch");
const ejs = require("ejs");
const app = express();
var _ = require("lodash");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let access_token;
//pan variables
let panNumber = 1234567;
let fullName = "Sample";
let category = "";
let message = "None";
//bank Variables
let bankStatus = false;
let accHolderName = "Sample";
let bankMessage = "None";
let amount = 0;
let referenceID = 1234;
var request = require("request");
//aadhar variables
let uidStatus = "none";
let aadharNum = 1234567;

const urlpan = "https://sandbox.aadhaarkyc.io/api/v1/pan/pan";
const urluid =
  "https://sandbox.aadhaarkyc.io/api/v1/aadhaar-validation/aadhaar-validation";
var surepass_post = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYyNTc0NTMwNiwianRpIjoiNGE4ZmYxN2EtYzEwMy00Y2VjLWI1OGItOGZkMDUxNzQyZjdlIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnNydmluZm90ZWNoQGFhZGhhYXJhcGkuaW8iLCJuYmYiOjE2MjU3NDUzMDYsImV4cCI6MTYyODMzNzMwNiwidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbInJlYWQiXX19.DYdv0yltgiZ3hOvMZ1rxDMT62LWwH4TBgdvLyP3CUus",
    Accept: "application/json",
  },
};
var sandbox_auth = {
  method: "POST",
  hostname: "api.sandbox.co.in",
  path: "/authenticate",
  headers: {
    "x-api-key": "key_live_kcZBc6aAIISGjZY6jgbXuNvkkkzywfnZ",
    "x-api-secret": "secret_live_4AzvZkZI3yvlKZfgF09eI90eR6bTpKrk",
    "x-api-version": "3.4.0",
  },
  maxRedirects: 20,
};

var urlbank = "https://api.sandbox.co.in";
var sandbox_get = {
  method: "GET",
  hostname: "api.sandbox.co.in",
  headers: {
    Authorization:
      "eyJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJBUEkiLCJyZWZyZXNoX3Rva2VuIjoiZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKaGRXUWlPaUpCVUVraUxDSnpkV0lpT2lKMmFXcHBkR2hBYzNKMmFXNW1iM1JsWTJndWFXNGlMQ0poY0dsZmEyVjVJam9pYTJWNVgyeHBkbVZmYTJOYVFtTTJZVUZKU1ZOSGFscFpObXBuWWxoMVRuWnJhMnQ2ZVhkbWJsb2lMQ0pwYzNNaU9pSmhjR2t1YzJGdVpHSnZlQzVqYnk1cGJpSXNJbVY0Y0NJNk1UWTFOek13TlRnME1Dd2lhVzUwWlc1MElqb2lVa1ZHVWtWVFNGOVVUMHRGVGlJc0ltbGhkQ0k2TVRZeU5UYzJPVGcwTUgwLlR1R2F3VDdNMTF1LW4xODJORF83ZGxua2c1WUxONnNsTFppRUs5TVNvdHVIX0d1SmRMZnZTMTZsQnpaUWM2UzhtZUVlUVQydUk1Ynhibl9vb3BGbVVBIiwic3ViIjoidmlqaXRoQHNydmluZm90ZWNoLmluIiwiYXBpX2tleSI6ImtleV9saXZlX2tjWkJjNmFBSUlTR2paWTZqZ2JYdU52a2trenl3Zm5aIiwiaXNzIjoiYXBpLnNhbmRib3guY28uaW4iLCJleHAiOjE2MjU4NTYyNDAsImludGVudCI6IkFDQ0VTU19UT0tFTiIsImlhdCI6MTYyNTc2OTg0MH0.2YMNIvlxLHRHj70SqbRM_xuJpLx_ccuDGcP6fWxbIuzKH8A8UUP26RYalTpOASl8-yW9RJ1hVRz1qazwl1cm-A",
    "x-api-key": "key_live_kcZBc6aAIISGjZY6jgbXuNvkkkzywfnZ",
    "x-api-version": "3.4.0",
  },
  maxRedirects: 20,
};

capitalize = function (input) {
  let word = input.split(" ");
  capitalize = [];
  word.forEach((elem) => {
    capitalize.push(elem[0].toUpperCase() + elem.slice(1, elem.length));
  });
  return capitalize.join(" ");
};

app.get("/", function (req, res) {
  res.render("pan", {
    panNum: panNumber,
    personName: fullName,
    message: message,
  });
});

app.get("/pan", function (req, res) {
  res.render("pan", {
    panNum: panNumber,
    personName: fullName,
    message: message,
  });
});

app.post("/pan", function (req, res) {
  let pannumber = req.body.pan;
  pannumber = pannumber.trim().toUpperCase();
  console.log(pannumber);
  surepass_post["body"] = JSON.stringify({
    id_number: pannumber,
  });
  fetch(urlpan, surepass_post)
    .then((res) => res.json())
    .then((d) => {
      try {
        panNumber = d.data.pan_number;
        fullName = d.data.full_name;
        category = d.data.category;
        message = d.message_code;
        res.render("pan", {
          panNum: panNumber,
          personName: fullName,
          message: message,
        });
      } catch (e) {
        res.redirect("/");
        console.log("not valid data");
        alert("Please Enter Valid PAN");
      }
    });
});

app.get("/aadhar", function (req, res) {
  res.render("aadhar", {
    aadharNum: aadharNum,
    uidStatus: uidStatus,
  });
});

app.post("/aadhar", function (req, res) {
  uidnum = req.body.aadhar;
  surepass_post["body"] = JSON.stringify({
    id_number: uidnum,
  });
  fetch(urluid, surepass_post)
    .then((res) => res.json())
    .then((d) => {
      try {
        console.log(d);
        aadharNum = d.data.aadhaar_number;
        uidStatus = d.message_code;

        res.render("aadhar", {
          aadharNum: aadharNum,
          uidStatus: uidStatus,
        });
      } catch (e) {
        res.redirect("/");
        console.log("not valid data");
      }
    });
});

// app.get("/bank", function (req, res) {
//   fetch(urlbank + "/authenticate", sandbox_auth)
//     .then((res) => res.json())
//     .then((d) => {
//       try {
//         access_token = d.access_token;
//         console.log(d.access_token);
//       } catch (e) {
//         res.redirect("/");
//         console.log("not valid data");
//       }
//     });
//   res.render("bank");
//   var account = req.query.account;
//   var name = req.query.name.split(" ").join("%20");
//   var ifsc = req.query.ifsc;
//   var mobile = req.query.mobile;
//   var path = `/bank/${ifsc}/accounts/${account}/verify?name=${name}&mobile=${mobile}`;
//   urlbank = urlbank + path;
//   sandbox_get["path"] = path;
//   sandbox_get["headers"]["Authorization"] = access_token;
//   console.log(sandbox_get);
//   console.log(urlbank);

//   fetch(urlbank, sandbox_get)
//     .then((res) => res.json())
//     .then((d) => {
//       try {
//         console.log(d);

//         // res.render('district',
//         //   {

//         // });
//       } catch (e) {
//         res.redirect("/");
//         console.log("not valid data");
//       }
//     });
// });

// app.post("/bank", function (req, res) {});

app.get("/bank", function (req, res) {});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server Listening");
});
