require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const donationsRoute = require('./routes/donations');
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
app.use('/api/donations', donationsRoute);
app.get('/', (req, res) => {
  res.send('Donation backend running 🚀');
});

app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(function(middleware) {
    if(middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if(middleware.name === 'router') {
      middleware.handle.stack.forEach(function(handler) {
        if(handler.route) {
          routes.push({
            path: '/api/donations' + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
