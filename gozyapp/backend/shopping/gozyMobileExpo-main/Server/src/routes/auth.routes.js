const express = require('express');

const {
  requestOtpController,
  verifyOtpController,
  providerSignInController,
  demoAuthController,
  updateProfileController,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/request-otp', requestOtpController);
router.post('/verify-otp', verifyOtpController);
router.post('/provider', providerSignInController);
router.post('/demo', demoAuthController);
router.patch('/profile', updateProfileController);

module.exports = router;
