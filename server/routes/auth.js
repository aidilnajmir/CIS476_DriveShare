// routes to handle request related to registration, authentication, and password recovery
const express = require('express');
const router = express.Router();
const { 
    register, 
    auth, 
    verifySession, 
    logout,
    getSecurityQuestions,
    verifySecurityQuestions,
    updatePassword
} = require('../controllers/authController');

router.post('/register', register);
router.post('/auth', auth);
router.post('/verify-session', verifySession);
router.post('/logout', logout);
router.post('/questions', getSecurityQuestions);
router.post('/verify-answers', verifySecurityQuestions);
router.post('/update-password', updatePassword);

module.exports = router;
