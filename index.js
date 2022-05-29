require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose=require('mongoose');
const res = require('express/lib/response');
const req = require('express/lib/request');
const dns=require("dns")
const Url=require("./UrlModel");
const { url } = require('inspector');


//db

mongoose.connect(process.env.DB_URI,{useNewUrlParser:true})



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended:false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.post('/api/shorturl',(req,res)=>{
  console.log(req.body.url)

  const originalUrl=req.body.url
  

  try{
  const urlObject= new URL(originalUrl)
  dns.lookup(urlObject.hostname,async(err,address,family)=>{
    if (err)return res.send({error:"invalid url"})
    else{
      const url =await new Url({original_url:req.body.url})
      url.save().then(e=>console.log("url saved"))
      res.send(
        {
          original_url:url.original_url,
          short_url:url.short_url
        })
      

    }
  })
 }
  catch(err){
    console.log(err.message)
    return res.send({error:"invalid url"})
  }

})

app.get('/api/shorturl/:id',async(req,res)=>{
  
    const url= await Url.findOne({short_url:req.params.id})
    if(url===undefined)res.sendStatus(404)
    console.log(url)
    res.redirect(url.original_url)



})
