const express = require("express");
const https = require("https");
const fetch = require('node-fetch');
const ejs = require("ejs");
const app = express();
var _ = require('lodash');
app.set('view engine', 'ejs');

app.use(express.static("public"));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

let states = [];
let state_district_wise =[];
let confirmed = 0;
let recovered = 0;
let active = 0 ;
death = 0;
app.get('/',function(req,res)
{
 
  states = [];
  // https://documenter.getpostman.com/view/10724784/SzYXXKmA?version=latest
  fetch('https://api.covid19india.org/data.json')
    .then(res => res.json())
    .then(d => {

    
       confirmed = d.statewise[0].confirmed;
       recovered = d.statewise[0].recovered; 
       active = d.statewise[0].active;
       death = d.statewise[0].deaths;
       deltaconfirmed = d.statewise[0].deltaconfirmed;
       deltarecovered = d.statewise[0].deltarecovered;
       deltadeath = d.statewise[0].deltadeaths;
       state = d.statewise;
    
      
     
      for(let i = 1 ; i<state.length;i++)
      {
      let state  = {
          state_name : d.statewise[i].state,  
          confirmed : d.statewise[i].confirmed,
          active:d.statewise[i].active,
          recovered : d.statewise[i].recovered,
          death : d.statewise[i].deaths,
          deltaconfirmed :d.statewise[i].deltaconfirmed,
          deltarecovered:d.statewise[i].deltarecovered,
          deltadeath: d.statewise[i].deltadeaths,          

      };
      
        states.push(state);
      }
    
      res.render('index',
      {
      total : confirmed,
      active : active,
      recover : recovered,
      death : death,
      deltaconfirmed : deltaconfirmed,
      deltarecovered : deltarecovered,
      deltadeath : deltadeath,
      states :  states
     
    });
})
        
    
})

capitalize = function(input)
{
  let word = input.split(' ');
  capitalize = [];
  word.forEach(elem => {
    capitalize.push(elem[0].toUpperCase() + elem.slice(1,elem.length));
  });
  return capitalize.join(' ');
}


app.post('/',function(req,res)
{
  state_district_wise =[];
  let searchData = capitalize(req.body.search_state);
  console.log(searchData);
  
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json())
  .then(d => {
   try{
    statedata = d[searchData].districtData;
   
  
   
    for (const districtName in  statedata)
    {
      district = districtName;
      districtConfirm = statedata[districtName].active;
      districtActive = statedata[districtName].confirmed;
      districtRecover = statedata[districtName].recovered;
      districtdeath = statedata[districtName].deceased;
      deltaconfirmed = statedata[districtName].delta.confirmed
      

       let state = {
        state_name : district,  
        confirmed : districtConfirm,
        active: districtActive,
        recovered : districtRecover,
        death : districtConfirm,
        deltaconfirmed :0,
        deltarecovered:0,
        deltadeath: 0, 
    };
    state_district_wise.push(state);
     
      
    }
   
    res.render('district',
      {
      total : confirmed,
      active : active,
      recover : recovered,
      death : death,
      deltaconfirmed : deltaconfirmed,
      deltarecovered : deltarecovered,
      deltadeath : deltadeath,
      states :  state_district_wise,
      state : searchData
     
    });
  }
  catch(e)
  {
     res.redirect('/');
     console.log("not valid data");
  }
  })
 
  
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Listening");
})


