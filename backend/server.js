require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const donationsRoute = require('./routes/donations');
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
app.use('/api/donations', donationsRoute);
app.get('/', (req, res) => {
  res.send('Donation backend running 🚀');
});
app.listen(port, () => console.log(`Server running on port ${port}`));
