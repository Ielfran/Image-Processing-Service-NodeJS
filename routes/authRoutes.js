    
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

    
/*
IGNORE_WHEN_COPYING_START
Use code with caution. JavaScript
IGNORE_WHEN_COPYING_END
controllers/authController.js
Generated javascript
*/
 
