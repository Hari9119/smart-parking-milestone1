// seed/slotSeeder.js
const mongoose = require("mongoose");
const Slot = require("../models/slotModel"); // ensure the filename matches

const uri = "mongodb+srv://haritha:hari123@cluster0.imgtuko.mongodb.net/parking?retryWrites=true&w=majority&appName=Cluster0";

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("DB Connected");

    // 🔥 wipe all existing slots to avoid E11000 on unique slotNumber
    await Slot.deleteMany({});
    console.log("Cleared existing slots");

    const slots = [
      { slotNumber: "A1", isAvailable: true,  location: { x: 10, y: 20 } },
      { slotNumber: "A2", isAvailable: false, location: { x: 20, y: 20 } },
      { slotNumber: "A3", isAvailable: true,  location: { x: 30, y: 20 } },
      { slotNumber: "A4", isAvailable: true,  location: { x: 40, y: 20 } }
    ];

    await Slot.insertMany(slots);
    console.log("🎉 Slots Inserted Successfully!");
  } catch (err) {
    console.error("Seeder error:", err);
  } finally {
    await mongoose.disconnect();
  }
})();
