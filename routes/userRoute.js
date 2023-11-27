const router = require('express').Router();
const userControl = require('../controller/userController');

// routes
router.post('/register', userControl.register_post);
router.post('/login', userControl.login_post);
router.post('/reset_password', userControl.reset_pass_post);
router.post('/hash_password', userControl.hash_password);

module.exports = router;