var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Day= require("../models/Day").model;

//parameters for route:
// {
//   date:  String("Dec 29 2023 05:00") 
// }


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("request attempted");
  console.log(req.body);

  const dateTime=new Date(req.body.date);
  Day.find({date: dateTime}, (err,docs) =>{
    if(!err){
      if(docs.lenght>0){
        // record already exists
        console.log("record exists. sent docs");
        res.status(200).send(docs[0]);
      }else{
        //searched date does not exist and we need to create it
        const allTables = require("../data/allTables");
        const day= new Day({
          date: dateTime,
          tables: allTables
        })
        day.save(err =>{
          if (err){
            res.status(400).send("error saving new date");
          }else{
            // saved date and need to reurn all tables
            console.log("creatednew datetime. here are defaults");
            Day.find({date: dateTime}), (err,docs) =>{
              err ? res.sendStatus(400) : res.status(200).send(docs[0]);
            }
          }
        })
      }
    }else{
      res.status(400).send("could not find date");
    }
  })
});

module.exports = router;
