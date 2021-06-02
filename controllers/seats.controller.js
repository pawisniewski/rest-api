const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const sea = await Seat.findById(req.params.id);
    if(!sea) res.status(404).json({ message: 'Not found' });
    else res.json(sea);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  const { day, seat, client, email } = req.body;
  try {
    const isTaken = await Seat.exists({day: day, seat: seat});
    if (isTaken) {
      res.status(409).json({ message: "The seat is already taken!" });
    }
    else {
      const newSeat = new Seat({ day: day, seat: seat, client: client, email: email });
      const savedSeat = await newSeat.save();
      const seats = await Seat.find();
      req.io.emit('seatsUpdated', seats);
      res.status(201).json(savedSeat);
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.put = async (req, res) => {
  const { day, seat, client, email } = req.body;
  try {
    const sea = await(Seat.findById(req.params.id));
    if(sea) {
      Object.assign(sea, { day, seat, client, email });
      const newSeat = await sea.save();
      res.json(newSeat);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const sea = await(Seat.findById(req.params.id));
    if(sea) {
      await Seat.deleteOne({ _id: req.params.id });
      res.json(sea);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};
