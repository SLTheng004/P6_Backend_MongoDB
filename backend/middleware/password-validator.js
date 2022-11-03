const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
        message:
          'Your password must contain eight or more characters with a mix of lowercase and uppercase letters, and contain at least two digits!'
      });
  } else {
    next();
  }
};
