const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const expressValidator = require('express-validator')
const { check, validationResult } = require('express-validator/check');
var app = express();

//Custom Middleware
/*var logger = (req,res,nxt)=>{
  console.log('Logging...');
  nxt();
}

app.use(logger);
*/

//Body parse Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Global vars
app.use((req,res,next)=>{
  res.locals.userValue = null;
  res.locals.errors = null;
  next();
});

//app.use(expressValidator());

//Set Static Path
//This is where the css files html files etc are stored
app.use(express.static(path.join(__dirname,'public')));

// The views are stored in this folder
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))


//Student form
app.get('/',function(req,res){
    res.render('home',{
        topicHead : 'Student Form',
        title : 'Customer App'
    });
    //console.log('Body : ' + req.body.fname);
    console.log('user accessing Home page');
});
app.post('/student/add',
[
  // fnme must not be null
  check('fname').not().isEmpty().withMessage('First name should not be empty.'),
  // password must be at least 5 chars long
  check('lname').isLength({ min: 5 }).withMessage('Last name should not be less than 5 chars.')
],
function(req,res){
  const errors = validationResult(req);
  var student = {
      fname : req.body.fname,
      lname : req.body.lname
  };
  if (!errors.isEmpty()) {
    res.render('home',{
       userValue : student,
       topicHead : 'Student Form',
       title : 'Customer App',
       errors : errors.array()
   });
 }else{
   res.render('home',{
       userValue : student,
       topicHead : 'Student Form',
       title : 'Customer App'
   });
 }
});
app.listen(3000, ()=>{
  console.log('Listening 3000');
})
