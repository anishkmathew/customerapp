const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLint = require('ejs-lint');
const querystring = require('querystring');
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users']);
db.on('error', function (err) {
	console.log('database error', err)
});

db.on('connect', function () {
	console.log('database connected')
});

var ObjectId = mongojs.ObjectId;
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
  var userValues = null;
  var student = {
      fname : '',
      lname : ''
  };
  var errors = null;
  if (req.query.userValue){
    console.log('in uery');
    var student = req.query.userValue;
    var errors = req.query.errors;
  }
  //console.log(req.params.userValue);

    // find everything
    db.users.find(function (err, docs) {
	    // console.log(docs);
       res.render('home',{
           topicHead : 'Student Form',
           title : 'Customer App',
           userValues : docs,
           userValue :student,
           errors :errors

       });
    })

    //console.log('Body : ' + req.body.fname);
    console.log('user accessing Home page');
});

app.get('/student/edit/:id',(req,res)=>{
  //var userValue = null;
  console.log(req.params.id);
//  res.end();

db.users.find(function (err, docs) {
  console.log(docs);
  res.send(docs);
//  var selectedStudent = docs.find((obj)=>{return obj._id === ObjectId(req.params.id);});
//  console.log(selectedStudent);
  //  res.send(selectedStudent);
  /*res.render('home',{
      topicHead : 'Student Form',
      title : 'Customer App',
      userValues : docs,
      userValue : docs.find((obj)=>{return obj._id === ObjectId(req.params.id);})
  });*/
})
//return req.params;
//  return false;
});

app.post('/student/add',
[
  // fnme must not be null
  check('fname').not().isEmpty().withMessage('First name should not be empty.'),
  // password must be at least 5 chars long
  check('lname').isLength({ min: 5 }).withMessage('Last name should not be less than 5 chars.')
],
function(req,res){
  var userValue = null;
  var userValues = null;
  var editid = req.body.editid;
  const errors = validationResult(req);
  var student = {
      fname : req.body.fname,
      lname : req.body.lname
  };
  if (!errors.isEmpty()) {
    db.users.find(function (err, docs) {
      res.render('home',{
          userValue : student,
          userValues : docs,
          topicHead : 'Student Form',
          title : 'Customer App',
          errors : errors.array()
      });
      /*const query = querystring.stringify({
          errors: errors.array(),
          userValue: student
      });
      res.redirect('/?' + query);
*/

    //  res.redirect('/userValue=' + student);
    //  res.redirect('/');
   })

 }else{

   if (editid){
     //edit the records


     // find one named 'mathias', tag him as a contributor and return the modified doc
     db.users.findAndModify({
     	query: {_id: ObjectId(editid) },
     	update: { $set: student },
     	new: true
     }, function (err, doc, lastErrorObject) {
     	// doc.tag === 'maintainer'

     });
     res.redirect('/');

   }else{
   //Inserting to users collection
  db.users.insert(student,function (err, docs) {
    if (err){
       console.log(err);
     }else{
       res.redirect('/');
     }
      });
}
}
});

app.delete('/student/delete/:id',(req,res)=>{
  console.log(req.params.id);
  db.users.remove({_id:ObjectId(req.params.id)}, (err)=>{
    if (err){
       console.log(err);
    }
    res.redirect('/');
  });
  //console.log('test');
});

//app.get('/student/edit/:id',(req,res)=>{
  //var userValue = null;
  //console.log(req.params.id);
  //return false;
  /*var student = {
      fname : req.body.fname,
      lname : req.body.lname
  };*/

  // find a document using a native ObjectId
/*  db.mycollection.findOne({
  	_id: mongojs.ObjectId('523209c4561c640000000001')
  }, function(err, doc) {
  	// doc._id.toString() === '523209c4561c640000000001'
  })
*/

  // find a document using a native ObjectId
/*  db.users.findOne({
    _id:ObjectId(req.params.id)
  }, function (err, doc) {
    // console.log(docs);
     res.render('home',{
         topicHead : 'Student Form',
         title : 'Customer App',
         userValue : doc
     });
  })*/

  // find one named 'mathias', tag him as a contributor and return the modified doc
  /*db.users.findAndModify({
  	query: {_id: ObjectId(req.params.id) },
  	update: { $set: student },
  	new: true
  }, function (err, doc, lastErrorObject) {
  	// doc.tag === 'maintainer'
  });
  res.redirect('/');
  */
//});

app.listen(3000, ()=>{
  console.log('Listening 3000');
});
