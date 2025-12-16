const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config();

const cors = require("cors");
app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use("/api/admin", require("./routes/admin"));


const companyRoutes = require("./routes/company");
app.use("/api/company", companyRoutes);



const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const slotRoutes = require("./routes/slotroutes");
app.use("/api/slots", slotRoutes);

const mongoose = require("mongoose");

app.get("/", (req, res) => {
  res.send("server connected");
});

// ✅ Route 1: Get Project Description
app.get("/api/project/description", (req, res) => {
  res.status(200).json({
    name: "Smart Parking System",
    purpose: "To manage vehicle parking efficiently with user and admin roles.",
    features: [
      "JWT-based authentication (login/register)",
      "Role-based access control (admin/user)",
      "Company management routes",
      "Slot creation & viewing",
      "User profile and vehicle tracking"
    ],
    techStack: {
      backend: "Node.js (Express)",
      database: "MongoDB (Mongoose)",
      auth: "JWT Tokens",
    },
    developer: "Haritha",
    version: "1.0.0",
  });
});

// ✅ Route 2: Get Project Status
app.get("/api/project/status", (req, res) => {
  res.status(200).json({
    status: "Active",
    summary: "Backend running successfully with MongoDB and all routes tested.",
    completedTasks: [
      "User authentication (register/login)",
      "JWT middleware validation",
      "Admin routes working",
      "Slot seeding complete",
      "Company CRUD routes"
    ],
    upcomingTasks: [
      "Frontend integration",
      "Testing slot management via admin",
    ],
    lastUpdated: new Date().toISOString(),
  });
});


const users = [
  { email: "test@gmail.com", password: "1234", role: "user" },
  { email: "admin@gmail.com", password: "admin", role: "admin" },
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.json({ message: "Invalid credentials" });
  }
  res.json({ message: "Login successful", role: user.role });
});

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://haritha:hari123@cluster0.imgtuko.mongodb.net/parking?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" DB Error:", err));
  const userRoutes = require("./routes/user");     // <-- add this near your other requires
app.use("/api/user", userRoutes);                // <-- mount once at /api/user
app.get("/api/user/ping", (_req, res) => {
  res.json({ ok: true, from: "server.js" });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
