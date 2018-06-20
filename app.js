const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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

//Set Static Path
//This is where the css files html files etc are stored
app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=> {
  res.send('Hello World');
})

app.listen(3000, ()=>{
  console.log('Listening 3000');
})
