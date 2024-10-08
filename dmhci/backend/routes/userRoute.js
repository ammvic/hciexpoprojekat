const express = require('express');
const { registerUser, verifyEmail, loginUser, upload, uploadProfilePic, updateUser, getUserData, getUserAddress, resetPassword} = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/users/:userId/upload-profile-pic', upload.single('profilePic'), uploadProfilePic);
router.put('/:userId', updateUser);
router.get('/:userId', getUserData);
router.get('/user/:userId/address', getUserAddress);
router.post('/reset-password', resetPassword);

module.exports = router;
