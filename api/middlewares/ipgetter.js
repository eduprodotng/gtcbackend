const requestIp = require('request-ip');

// Middleware to capture the user's IP address
function getClientIp(req, res, next) {
  const clientIp = requestIp.getClientIp(req); // Extract IP from the request
  req.clientIp = clientIp; // Attach IP to request object for later use
  next();
}

module.exports = { getClientIp };
