const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});
  
router.route('/testimonials/random').get((req, res) => {
  const item = db.testimonials[Math.floor(Math.random() * db.testimonials.length)];
  res.json(item);
});
  
router.route('/testimonials/:id').get((req, res) => {
  res.json(db.testimonials.find(item => item.id == req.params.id));
});
  
router.route('/testimonials').post((req, res) => {
  const obj = {
    id: uuidv4(),
    author: req.body.author,
    text: req.body.text
  }
  db.testimonials.push(obj);
  return res.json({
    message: 'OK'
  });
});
  
router.route('/testimonials/:id').put((req, res) => {
  db.testimonials.forEach(element => {
      
    if(element.id == req.params.id) {
      element.author = req.body.author;
      element.text = req.body.text;
    }
  });
  return res.json({
    message: 'OK'
  });
});
  
router.route('/testimonials/:id').delete((req, res) => {
  db.testimonials.forEach(element => {
      
    if(element.id == req.params.id) {
      const index = db.testimonials.indexOf(element);
      db.testimonials.splice(index, 1);
    }
  });
  return res.json({
    message: 'OK'
  });
});

module.exports = router;
