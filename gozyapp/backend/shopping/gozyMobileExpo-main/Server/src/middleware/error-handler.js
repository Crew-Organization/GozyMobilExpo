const { ZodError } = require('zod');

function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      issues: error.flatten(),
    });
  }

  console.error(error);
  return res.status(500).json({
    message: error.message || 'Unexpected server error',
  });
}

module.exports = { errorHandler };
