// backend/routes/admin.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/admin");
const User = require("../models/User");

// prove the router loaded
console.log("[admin routes] loaded");

// small logger to prove requests reach this router
router.use((req, _res, next) => {
  console.log("[admin] HIT", req.method, req.originalUrl);
  next();
});

// ✅ Admin dashboard
router.get("/dashboard", auth, isAdmin, (_req, res) => {
  res.status(200).json({ message: "Welcome Admin! You have full access." });
});

// ✅ Admin list users — supports /get-users AND /all-users
const listUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "All registered users",
      total: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

router.get("/get-users", auth, isAdmin, listUsers);
router.get("/all-users", auth, isAdmin, listUsers);



// // ✅ ADD SLOT (Admin Only) — simple in-memory example
// if (!global.slots) global.slots = [];

// router.post("/add-slot", auth, isAdmin, (req, res) => {
//   let { code, level = "G1", allowedVehicleType = "car", ratePerHour = 50 } = req.body || {};

//   // 1️⃣ Validate input
//   if (!code || !String(code).trim()) {
//     return res.status(400).json({ message: "Slot code is required" });
//   }

//   const codeUp = String(code).trim().toUpperCase();
//   allowedVehicleType = String(allowedVehicleType || "").toLowerCase();

//   if (!["car", "bike"].includes(allowedVehicleType)) {
//     return res.status(400).json({ message: "allowedVehicleType must be 'car' or 'bike'" });
//   }

//   ratePerHour = Number(ratePerHour);
//   if (!Number.isFinite(ratePerHour) || ratePerHour <= 0) {
//     return res.status(400).json({ message: "ratePerHour must be a positive number" });
//   }

//   // 2️⃣ Prevent duplicate slot codes
//   if (global.slots.find((s) => s.code === codeUp)) {
//     return res.status(400).json({ message: "Slot code already exists" });
//   }

//   // 3️⃣ Create the slot
//   const slot = {
//     id: global.slots.length + 1,
//     code: codeUp,
//     level,
//     allowedVehicleType,
//     ratePerHour,
//     status: "available",
//     createdAt: new Date().toISOString(),
//   };

//   global.slots.push(slot);
//   console.log("[admin] Slot created:", slot);

//   // 4️⃣ Send success response
//   return res.status(201).json({ message: "Slot created successfully", data: slot });
// });

// // ✅ View all slots (Admin Only)
// router.get("/all-slots", auth, isAdmin, (_req, res) => {
//   res.json({ total: global.slots.length, data: global.slots });
// });


module.exports = router;
