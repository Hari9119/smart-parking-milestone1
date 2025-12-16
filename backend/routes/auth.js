const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();



// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, vehicleNumber, vehicleType, phone, role } =
      req.body;
      // ✅ 1. Basic validation for required fields
    if (!name || !email || !password || !vehicleNumber || !vehicleType || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ 2. Name validation (only letters and spaces, min 3 chars)
    const nameRegex = /^[A-Za-z ]{3,}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: "Name must be at least 3 characters and contain only letters/spaces" });
    }

    // ✅ 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ 4. Vehicle number validation (e.g., TN10AB1234)
    const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
    if (!vehicleRegex.test(vehicleNumber)) {
      return res.status(400).json({ message: "Invalid vehicle number format (e.g., TN10AB1234)" });
    }

    // ✅ 5. Password validation (min 6 chars, at least one number and letter)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long and include at least one letter and one number",
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      vehicleNumber,
      vehicleType,
      phone,
      role,
    });

    await user.save();

    res.json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
      // ✅ Validate input presence
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // Create JWT token
      const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret123", // secret key
      { expiresIn: "1h" } // token expiry
      );

        const decoded = jwt.decode(token);
    res.json({ message: "Login successful", token,
        user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      iat: new Date(decoded.iat * 1000).toISOString(), // convert to readable date
      exp: new Date(decoded.exp * 1000).toISOString(), // convert to readable date
     });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});
//assignment
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //fetches user but remove password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//was in Homwork Tasks Assigned
router.get("/vehicle", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //fetches user but remove password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      vehicleNumber: user.vehicleNumber,
      vehicleType: user.vehicleType,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;