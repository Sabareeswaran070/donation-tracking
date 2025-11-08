const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/summary', async (req, res) => {
  try {
    const totalAgg = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const donors = await Donation.distinct("donorName");

    res.json({
      total: totalAgg[0] ? totalAgg[0].total : 0,
      donorsCount: donors.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { donorName, amount, email, note } = req.body;
    const donation = new Donation({ donorName, amount, email, note });
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
