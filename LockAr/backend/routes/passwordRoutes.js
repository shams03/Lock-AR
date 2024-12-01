const express = require("express");
const { addPassword } = require("../controllers/passwordController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();
const Password = require("../models/Password");

// router.use(authenticateToken);
router.use(authenticateToken);

router.post("/add", async (req, res) => {
  try {
    // console.log(req.body)
    const { site, username, encryptedPassword, iv, salt, userId } = req.body;
    const newEntry = new Password({
      site,
      username,
      encryptedPassword,
      iv,
      salt,
      userId,
    });
    await newEntry.save();
    res.status(201).json({ message: "Password saved successfully" });
  } catch {
    res.status(500).json({ message: "Error saving password" });
  }
});

// Retrieve password entries for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId)

    const entries = await Password.find({ userId: userId });
    if (entries.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching passwords" });
  }
});

// Edit a password entry
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { site, username, password } = req.body;
    await Password.findByIdAndUpdate(id, { site, username, password });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password" });
  }
});

// Delete a password entry
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Password.findByIdAndDelete(id);
    res.status(200).json({ message: "Password deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting password" });
  }
});

module.exports = router;
