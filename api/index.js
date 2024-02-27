const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const app = express();

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://tunderotimi:2TCiyAMGs4Mc4xH3@cluster0.aqv1uee.mongodb.net/nfp?retryWrites=true&w=majority'
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
// Allow requests from all origins with the cors middleware
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define mongoose schema and model
const detailsSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  phone: String,
  timestamp: Date,
});
const Details = mongoose.model('Details', detailsSchema);

// Handle signup POST request
app.post('/sign_up', async function (req, res) {
  const { fname, lname, email, phone } = req.body;
  const timestamp = new Date();

  try {
    const newDetails = new Details({ fname, lname, email, phone, timestamp });
    await newDetails.save();
    console.log('Record inserted successfully');
    return res.status(200).json({ message: 'Record inserted successfully' });
  } catch (error) {
    console.error('Error inserting record:', error);
    return res.status(500).json({ message: 'Error inserting record' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
