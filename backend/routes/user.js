// routes/user.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// health check (no auth)
router.get("/ping", (_req, res) => {
  res.json({ ok: true, at: "/api/user/ping" });
});

// USER-ONLY (admins blocked)
router.get("/user-only", auth, (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Access denied. User-only route." });
  }
  return res.status(200).json({ message: "Welcome user, this is a user-only route." });
});

// Get my profile (no password)
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my vehicle details
router.get("/vehicle", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("vehicleNumber vehicleType");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ vehicleNumber: user.vehicleNumber, vehicleType: user.vehicleType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
