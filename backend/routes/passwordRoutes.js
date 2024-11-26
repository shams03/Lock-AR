const express = require('express');
const { addPassword } = require('../controllers/passwordController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();
const PasswordEntry = require("../models/Password");

router.post("/add", async (req, res) => {
    try {
      console.log(req.body)
      const {site, username, encryptedPassword, iv, salt } = req.body;
      const newEntry = new PasswordEntry({site, username, encryptedPassword, iv, salt });
      await newEntry.save();
      res.status(201).json({ message: "Password saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error saving password" });
    }
  });
  
  // Retrieve password entries for a user
  router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId)
    
      const entries = await PasswordEntry.find({ "username":userId });
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching passwords" });
    }
  });
  
  // Edit a password entry
  router.put("/edit/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { site, username, password } = req.body;
      await PasswordEntry.findByIdAndUpdate(id, { site, username, password });
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating password" });
    }
  });
  
  // Delete a password entry
  router.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await PasswordEntry.findByIdAndDelete(id);
      res.status(200).json({ message: "Password deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting password" });
    }
  });
  

module.exports = router;
