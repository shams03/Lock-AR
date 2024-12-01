const Password = require('../models/password');
exports.addPassword = async (req, res) => {
    const { site, username, encryptedPassword, userId } = req.body; 
  
    const newPassword = new Password({ site, username, encryptedPassword, userId });
    await newPassword.save();
  
    res.status(201).json({ message: 'Password saved successfully' });
  };
  


