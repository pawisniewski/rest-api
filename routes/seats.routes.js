const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});
  
router.route('/seats/random').get((req, res) => {
  const item = db.seats[Math.floor(Math.random() * db.seats.length)];
  res.json(item);
});
  
router.route('/seats/:id').get((req, res) => {
  res.json(db.seats.find(item => item.id == req.params.id));
});
  
router.route('/seats').post((req, res) => {
  const seat = {
    id: uuidv4(),
    day: req.body.day,
    seat: req.body.seat,
    client: req.body.client,
    email: req.body.email
  };

  if(db.seats.some(booking => (booking.day == req.body.day && booking.seat == req.body.seat))) {
    res.status(409).json({message: 'The seat is already taken!'});
  }
  else {
    db.seats.push(seat);
    req.io.emit('seatsUpdated', db.seats);
    return res.json({
      message: 'OK'
    });
  }
});
  
router.route('/seats/:id').put((req, res) => {
  db.seats.forEach(element => {
      
    if(element.id == req.params.id) {
      element.day = req.body.day;
      element.seat = req.body.seat;
      element.client = req.body.client;
      element.email = req.body.email;
    }
  });
  return res.json({
    message: 'OK'
  });
});
  
router.route('/seats/:id').delete((req, res) => {
  db.seats.forEach(element => {
      
    if(element.id == req.params.id) {
      const index = db.seats.indexOf(element);
      db.seats.splice(index, 1);
    }
  });
  return res.json({
    message: 'OK'
  });
});

module.exports = router;
