require('dotenv').config();
const mongoose = require('mongoose');
const Donation = require('./models/Donation');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/donationdb';

const dummy = [
  { donorName: "Sabari", amount: 100, email: "sabari@mail.com" },
  { donorName: "Priya", amount: 200, email: "priya@mail.com" },
  { donorName: "Sasi", amount: 150, email: "sasi@mail.com" },
  { donorName: "Mahi", amount: 250, email: "mahi@mail.com" }
];
async function seed() {
  try {
    await mongoose.connect(uri);
    await Donation.deleteMany({});
    await Donation.insertMany(dummy);
    console.log("✅ Dummy data inserted successfully");
  } catch (err) {
    console.error("❌ Error inserting dummy data:", err);
  } finally {
    mongoose.disconnect();
  }
}
seed();
