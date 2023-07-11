const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Day = require("../models/day").model;
const Reservation = require("../models/reservation").model;

// Parameters:
// {
//   "date": String ("Dec 02 2019 06:00"),
//   "table": table id,
// 	"name": String,
// 	"phone": String,
// 	"email": String
// }

router.post("/", async (req, res, next) => {
  const day = await Day.findOne({ date: req.body.date });

  if (!day) {
    res.status(400).send("Day not found");
    return;
  }

  const table =day.tables.find(table => table._id == req.body.table);

  if (!table) {
    res.status(400).send("Table not found");
    return;
  }

  const reservation = new Reservation({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  });

  table.reservation = reservation;
  table.isAvailable = false;

  await day.save();

  res.status(200).send("Added Reservation");
});

module.exports = router;