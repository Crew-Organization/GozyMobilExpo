const { z } = require('zod');

const { state, updateSessionProfile } = require('../utils/store');

const phoneRegex = /^\+?[1-9]\d{9,14}$/;

const otpRequestSchema = z.object({
  identifier: z.string().min(1),
  channel: z.enum(['email', 'phone']),
});

const otpVerifySchema = z.object({
  identifier: z.string().min(1),
  channel: z.enum(['email', 'phone']),
  code: z.string().min(4),
});

const providerSignInSchema = z.object({
  provider: z.enum(['google', 'microsoft', 'apple']),
  mode: z.enum(['signin', 'signup']).default('signin'),
});

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  budget: z.string().min(1).optional(),
  phone: z.string().optional(),
  interests: z.array(z.string()).optional(),
  preferredCategories: z.array(z.string()).optional(),
});

function applyIdentifier(identifier, channel) {
  if (channel === 'email') {
    state.session.user.email = identifier;
    return;
  }

  state.session.user.phone = identifier;
}

function ensureDemoIdentity() {
  if (!state.session.user.name) {
    state.session.user.name = 'Gozy Demo';
  }

  if (!state.session.user.email) {
    state.session.user.email = 'demo@gozy.app';
  }

  if (!state.session.user.phone) {
    state.session.user.phone = '+91 9876543210';
  }
}

function requestOtpController(req, res) {
  const payload = otpRequestSchema.parse(req.body);
  if (payload.channel === 'email') {
    z.string().email().parse(payload.identifier);
  } else {
    z.string().regex(phoneRegex, 'Invalid phone number').parse(payload.identifier);
  }

  applyIdentifier(payload.identifier, payload.channel);
  res.json({
    success: true,
    otpHint:
      payload.channel === 'email'
        ? `We sent a 6-digit code to ${payload.identifier}. Check inbox and spam. Use 202626 in local mode.`
        : `We sent a 6-digit code to ${payload.identifier}. Check SMS or WhatsApp. Use 202626 in local mode.`,
  });
}

function verifyOtpController(req, res) {
  const payload = otpVerifySchema.parse(req.body);
  if (payload.channel === 'email') {
    z.string().email().parse(payload.identifier);
  } else {
    z.string().regex(phoneRegex, 'Invalid phone number').parse(payload.identifier);
  }

  applyIdentifier(payload.identifier, payload.channel);
  ensureDemoIdentity();
  res.json(state.session);
}

function providerSignInController(req, res) {
  const payload = providerSignInSchema.parse(req.body);
  state.session.user.email = `${payload.provider}@gozy.app`;
  state.session.user.phone = payload.provider === 'apple' ? state.session.user.phone : '+91 9876543210';
  ensureDemoIdentity();

  res.json({
    ...state.session,
    authProvider: payload.provider,
    authMode: payload.mode,
  });
}

function demoAuthController(_req, res) {
  ensureDemoIdentity();
  res.json({
    ...state.session,
    authProvider: 'demo',
    authMode: 'signin',
  });
}

function updateProfileController(req, res) {
  const payload = profileSchema.parse(req.body);
  const user = updateSessionProfile(payload);
  res.json(user);
}

module.exports = {
  requestOtpController,
  verifyOtpController,
  providerSignInController,
  demoAuthController,
  updateProfileController,
};
