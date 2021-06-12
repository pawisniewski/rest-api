const sanitize = require('mongo-sanitize');
const Concert = require('../models/concert.model');
const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find();
    const seats = await Seat.find();
    const newConcerts = concerts.map(concert => {
      const takenSeats = seats.filter(seat => seat.day === concert.day);
      const freeSeats = 50. - takenSeats.length;
      return { ...concert.toObject(), tickets: freeSeats };
    });
    res.json(newConcerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if(!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  const performer = sanitize(req.body.performer);
  const genre = sanitize(req.body.genre);
  const price = sanitize(req.body.price);
  const day = sanitize(req.body.day);
  const image = sanitize(req.body.image);
  try {
    const newConcert = new Concert({ performer, genre, price, day, image });
    await newConcert.save();
    res.json({ message: 'OK' });
  } 
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.put = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  try {
    const con = await(Concert.findById(req.params.id));
    if(con) {
      Object.assign(con, { performer, genre, price, day, image });
      const newCon = await con.save();
      res.json(newCon);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const con = await(Concert.findById(req.params.id));
    if(con) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json(con);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};
