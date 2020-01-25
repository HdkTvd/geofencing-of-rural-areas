var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var XLSX = require("xlsx");
const fetch = require('node-fetch');
const utf8 = require('utf8');
var admin = require("firebase-admin");

// This account is no longer valid
var serviceAccount = require("./agriculture-db-firebase-adminsdk-h8r3y-279d91e862.json");

var firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://agriculture-db.firebaseio.com"
});

var database = firebaseAdmin.database();

// Create instance of express app
var app = express();

// We want to serve js and html in ejs
// ejs stands for embedded javascript
app.set("view engine", "ejs");

// We also want to send css, images, and other static files
app.use(express.static("views"));
app.set("views", __dirname + "/views");

// Give the server access to the user input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));

app.get("/getExcelData", (req, res) => {
  var workbook = XLSX.readFile(__dirname + "/views/excel/crop_data.xlsx");
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  // console.log(xlData[0]);
  var rainfall_list = [];
  var crop_list = [];
  var humid_list = [];
  var irri_list = [];
  var min_temp_list = [];
  var max_temp_list = [];
  xlData.forEach(row => {
    rainfall_list.push(row.Rainfall);
    crop_list.push(row.Crops);
    humid_list.push(row.Humidity);
    irri_list.push(row.Irrigation);
    min_temp_list.push(row.Min);
    max_temp_list.push(row.Max);
  });
  my_json = {
    rainfall: rainfall_list,
    crops: crop_list,
    humidity: humid_list,
    irri: irri_list,
    min: min_temp_list,
    max: max_temp_list
  };
  res.json(my_json);
});

app.get("/", function(request, response) {
  // var restaurantsRef = database.ref("/restaurants")

  // restaurantsRef.once('value', function(snapshot){
  //     var data = snapshot.val()

  //     if ( !data ) {
  //         data = {}
  //     }

  response.render("home.ejs");
  // })
});

app.post("/generate_form", function(req, res) {
  user_id = 1;
  var result = {
    village: req.body.village,
    survey_no: req.body.survey_no,
    sub_division_of: req.body.sub_division_of,
    taluka: req.body.taluka,
    cut_land: req.body.cut_land,
    name_of_occupant: req.body.name_of_occpuant,
    khata_no: req.body.khata_no,
    name_of_the_rent: req.body.name_of_the_rent,
    B_s_marks: req.body.B_s_marks
  };

  let setDoc = database.ref("seven_one_two/" + user_id).set(req.body);

  res.render("7-12-doc", { result });
});

app.get("/profile/:userId", (req, res) => {
  var userId = req.params.userId;
});

app.get("/", function(request, response) {
  // var restaurantsRef = database.ref("/restaurants")

  // restaurantsRef.once('value', function(snapshot){
  //     var data = snapshot.val()

  //     if ( !data ) {
  //         data = {}
  //     }

  response.render("home.ejs");
  // })
});

app.get("/profile/:userId", (req, res) => {
  var userId = req.params.userId;

  var user = firebaseAdmin.getAllUsersData(userId);

  res.render("profile.ejs", { user: user });
});

app.use(logger("dev"));

app.get("/", function(request, response) {
  // var restaurantsRef = database.ref("/restaurants")

  // restaurantsRef.once('value', function(snapshot){
  //     var data = snapshot.val()

  //     if ( !data ) {
  //         data = {}
  //     }

  response.render("home.ejs");
  // })
});

app.post("/generate_form", function(req, res) {
  user_id = 1;
  var result = {
    village: req.body.village,
    survey_no: req.body.survey_no,
    sub_division_of: req.body.sub_division_of,
    taluka: req.body.taluka,
    cut_land: req.body.cut_land,
    name_of_occupant: req.body.name_of_occpuant,
    khata_no: req.body.khata_no,
    name_of_the_rent: req.body.name_of_the_rent,
    B_s_marks: req.body.B_s_marks
  };

  let setDoc = database.ref("pending/" + user_id).set(req.body);

  res.render("7-12-doc", { result });
});

app.get("/getmap", function(req, res) {
  res.render("index");
});

app.post("/getmap", function(req, res) {
  arr = req.body.carol;

  console.log(arr);
  res.json({ status: "Done" });
});

app.post("/saveCoordinate", function(req, res) {
  var whatsapp = "+919594246827";
  var setDoc = database
    .ref("pending/" + whatsapp)
    .set({ coordinates: req.body.coordinate, area: req.body.area });
  console.log(req.body);
});

app.post("/farm_result", function(req, res) {
  let whatsapp = req.body.submit;
  console.log(whatsapp);
  database.ref("pending/" + whatsapp).once("value", function(result) {
    var farm_details = result.val();
    console.log(farm_details);
    res.render("farm_result", mydata = farm_details);
  });
});

app.get("/getLocation", (req,res) => {
  var str = "Bhayandar"
  var fetching_str = encodeURI(str)
  console.log(fetching_str)
  var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+fetching_str+".json?access_token=pk.eyJ1IjoidHh0ciIsImEiOiJjazRmZTNldm4wbmZpM21uYW43Z292NmozIn0.9GHxkIq6wJ3I5LQBMMVedQ"
  fetch(url).then( res => {
    console.log(res)
  })
  res.json({"Stauts": "Done"})
})

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("App running on port " + port);
});
