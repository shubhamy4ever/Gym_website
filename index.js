const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose');
//to fetch all dotenv files within this directory
require('dotenv/config');
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true },{ useUnifiedTopology: true },()=>{
    console.log('connected to db!')
});

app.set('view engine','pug');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(upload.array());

app.use(express.static('images'));

var gymSchema = mongoose.Schema({
name:String,
age:Number,
gender:String,
locality:String
});

var gymApplicant = mongoose.model('gymApplicant',gymSchema);

app.get('/gym',(req,res)=>{
res.render('index');
});

app.post('/gym',(req,res)=>{
var gymObj = req.body;


if(!gymObj.name || !gymObj.age || !gymObj.gender || !gymObj.locality){
res.render('result',{
    message:'Please enter all details!', type:'error'
});
}else{
    var gymdet = new gymApplicant({
        name: gymObj.name,
        age:gymObj.age,
        gender : gymObj.gender,
        locality : gymObj.locality
    });
gymdet.save((err,gymApplicant)=>{
if(err){
    res.render('result',{
        message:'Invalid details',type:'error'
    })
    throw err;
}
else{
    res.render('result',{
        message:'your data saved sucessfully thanks!',type:'sucess'
    })
}
})
}
});
//to view backend --optional
app.get('/viewdatabase',(request,response)=>{
gymApplicant.find((err,res)=>{
    response.json(res);
});
});

app.listen(3000,()=>{
console.log('listening at port 3000');
});