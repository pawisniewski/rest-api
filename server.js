const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');

const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  return res.status(404).json({
    message: 'Not found...'
  });
});

// connects our backend code with the database
let dbURI;
switch (process.env.NODE_ENV) {
  case 'test':
    dbURI = 'mongodb://localhost:27017/NewWaveDBTest';
    break;
  case 'production':
    dbURI = `mongodb+srv://pawel_wisniewski:${process.env.DB_PASSWORD}@cluster1.3rvv0.mongodb.net/NewWaveDB?retryWrites=true&w=majority`;
    break;
  default:
    dbURI = 'mongodb://localhost:27017/NewWaveDB';
};

mongoose.connect(dbURI, { useNewUrlParser: true }, { useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});

db.on('error', err => console.log('Error ' + err));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', socket => {
  console.log('New client: ', socket.id);
});

module.exports = server;
