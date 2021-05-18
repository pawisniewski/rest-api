const express = require('express');
const cors = require('cors');

const testimonialRoutes = require('./routes/testimonials.routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', testimonialRoutes);

app.use((req, res) => {
  return res.status(404).json({
    message: 'Not found...'
  });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
