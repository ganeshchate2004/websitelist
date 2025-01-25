const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Website Schema and Model
const websiteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
});

const Website = mongoose.model("Website", websiteSchema);

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// API Route for User Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User signed up successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// API Route for User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
 

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// API Route to get user-specific websites
app.get("/user-websites", authenticateToken, async (req, res) => {
  try {
    const websites = await Website.find({ userId: req.user.id });
    res.status(200).json(websites);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});

// API Route to add a new website
app.post("/add-website", authenticateToken, async (req, res) => {
  const { name, link, image } = req.body;

  if (!name || !link || !image) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const newWebsite = new Website({ userId: req.user.id, name, link, image });
    await newWebsite.save();
    res.status(201).json({ message: "Website added successfully!", website: newWebsite });
  } catch (err) {
    res.status(500).json({ error: "Failed to add website" });
  }
});

// API Route to delete a website
app.delete("/delete-website/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const website = await Website.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!website) return res.status(404).json({ error: "Website not found" });

    res.status(200).json({ message: "Website deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete website" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
