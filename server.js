var express = require('express')
var logger = require('morgan')
var bodyParser = require('body-parser')
const session = require('express-session');
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

var admin = require('firebase-admin')

// This account is no longer valid
var serviceAccount = require('./agriculture-db-firebase-adminsdk-h8r3y-279d91e862.json')

var firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://agriculture-db.firebaseio.com"
})

var database = firebaseAdmin.database()

// Create instance of express app
var app = express()

// We want to serve js and html in ejs
// ejs stands for embedded javascript
app.set('view engine', 'ejs')

// We also want to send css, images, and other static files
app.use(express.static('views'))
app.set('views', __dirname + '/views')

// Give the server access to the user input
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(logger('dev'))

app.get('/', function(request, response){

    // var restaurantsRef = database.ref("/restaurants")
    
    // restaurantsRef.once('value', function(snapshot){
    //     var data = snapshot.val()
        
    //     if ( !data ) {
    //         data = {}
    //     }
        
        response.render('home.ejs')        
    // })
})


//*******Whatsapp_API********//


app.use(session({secret: 'anything-you-want-but-keep-secret'}));
//global variable//

var opt = 999                                     
var reg = 999
var registration = 999


app.post('/sms', async (req, res) => {
    const twiml = new MessagingResponse();
    // const smsCount = req.session.counter || 0;
    // let message = 'Hello, thanks for the new message.';
    // if(smsCount > 0) {
    //   message = 'Hello, thanks for message number ' + (smsCount + 1);
    // }
    // req.session.counter = smsCount + 1;
    // const twiml = new MessagingResponse();
    // twiml.message(message);
  
    
    // const message = twiml.message();
    // message.body('The Robots are coming! Head for the hills!');
    // message.media('https://farm8.staticflickr.com/7090/6941316406_80b4d6d50e_z_d.jpg');
  
  
    let counter = req.session.counter || 0
    var message = 'Hello, thanks for the new message.';
    const text = req.body.Body
    const xxx = req.body.From
      
    var ref = firebase.database().ref("user");
    ref.orderByChild("phone").equalTo(xxx)
     console.log(typeof xxx);
  
     var registration = 1;
     if(x.includes(xxx)){
      registration = 0;
      }
     
      // for (let i= 0; i< x.length; i++){
      //     if(xxx != x[i]){
      //         registration = 1;
      //     }
      // }
  
      
      console.log(registration)
  
    function add_product(text) {
      let obj = (text.split('\n'))
      // console.log(typeof obj)
      let obj1 = []
      for(var i=0;i<3;i++){
        obj1.push(obj[i].split(':')[1])
      }
  
      const prod = new product({
        product : obj1[0],
        price : obj1[1],
        quantity : obj1[2],
        phone : req.body.From,
        image : req.body.MediaUrl
      });
      return prod;
    }
  
  
    function add_user(text) {
      let obj = (text.split('\n'))
      // console.log(typeof obj)
      let obj1 = []
      for(var i=0;i<4;i++){
        obj1.push(obj[i].split(':')[1])
      }
  
      const user = {
        name : obj1[0],
        email : obj1[1],
        password : obj1[2],
        phone : req.body.From,
        address : obj1[3],
        image : req.body.MediaUrl
      };
      return user;
    }
  
      if (registration == 1){  
              if (text == 'Hello' || text == 'Hi' || text == 'Hey' || text == 'Heyy') {
              message = 'Hi!! This is the FarmFridge\n Type REGISTER to enter the worldwide portal for Selling your products at the best Price';
          } else if(text == 'REGISTER'){
              reg = counter+1;
              message = 'Pleae fill the form below:\n\nName :\nEmail:(optional)\nPassword:\nAddress:\n\nAnd send athe user image to build the profile(Optional)'
          } else if (reg == counter ){
              // code to add it to the database
              reg = 999
              let user = add_user(text)
  
              try{
                  database.ref('Farmer/').set(user);
                  registration = 0;
                  message = 'User sucessfully registered!!';
              } catch (err) {
              message = 'Failed to Sign up!! Please fill all the details in the form';
              }
          }
      } else if(registration == 0){
  
          if (text == 'Hello' || text == 'Hi' || text == 'Hey' || text == 'Heyy') {
      
              message = 'Hi!! Type\n\n ADD - To add fill the 7/12 form\n LIST - To list your assets\n SHOW:(product id) - To SHOW particular item\n DELETE:(product id) - To Delete the item';
            } else if (text == 'ADD' || text == 'Add') {
              
              opt = counter+1
              message = 'Fill the form:\n\nPRODUCT:\nPRICE:\nQUANTITY:\n\nAnd send an image of the product(Optional)';
            } else if (text == 'LIST' || text == 'List') {
                  
                  try{
                    let cust = product.findAll({'phone' : req.body.From})
                    console.log(cust);
                    message = cust;
                } catch (err) {
                  message = 'Failed to show the list!! Try again later';
                }
                //   product.find({phone : req.body.From})
                //   .exec()
                //   .then(cust => {       
                //     message = cust;
                //   })
                //  .catch (err => {
                //   message = 'Failed to add to the list!! Try again later';
                // })
            } else if (text == 'SHOW') {
              
              message = "shows the value of a particular id";
            } else if (text == 'DELETE') {
              
              message = 'deletes the entry';
            } else if (text == 'Bye' || text == 'Tata') {
              
              message = 'Goodbye';
            } else if ( opt == counter) {
          
              // code to add it to the database
              opt = 999
              let prod = add_product(text)
          
              try{
                  prod.save()
                  // console.log(res.json(saves);
                  message = 'Product added to your list!!\nType LIST to list all your items with their details';
              } catch (err) {
                message = 'Failed to add to the list!! Try again later';
              }
          
            } else {
              
              message = "SORRY!! DID'NT GET YOU!!";
            }
      }
      //  else {
      //     message = "SORRY!! DID'NT GET YOU!!";
      // }
  
    req.session.counter = counter + 1;
    twiml.message(message)
  
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });





app.post('/generate_form',function(req, res){
    user_id = 1;
    var result = {
        "village" : req.body.village,
        "survey_no" : req.body.survey_no,
        "sub_division_of" : req.body.sub_division_of,
        "taluka" : req.body.taluka,
        "cut_land" : req.body.cut_land,
        "name_of_occupant" : req.body.name_of_occpuant,
        "khata_no" : req.body.khata_no,
        "name_of_the_rent" : req.body.name_of_the_rent,
        "B_s_marks" : req.body.B_s_marks,
    } 

    let setDoc = database.ref('seven_one_two/'+ user_id).set(req.body);

    res.render('7-12-doc', {result});
})

var port = process.env.PORT || 8000

app.listen(port, function(){
    console.log('App running on port ' + port)
})


