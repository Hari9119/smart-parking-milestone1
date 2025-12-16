const express = require("express");
require("dotenv").config();
 
const app = express();
 
app.use(express.json());
 
// Test Route
app.get("/", (req, res) => {
  res.send("Server running successfully 🚀");
});
 
const PORT = process.env.PORT || 5000;
 
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
