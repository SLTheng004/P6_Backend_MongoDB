const passwordSchema = require('../models/password');

//create schema to ensure error is thrown if user does not meet password requirements
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
        message:
          'Your password must contain eight or more characters with a mix of lowercase and uppercase letters, and contain at least two digits!'
      });
  } else {
    // if password is met, next
    next();
  }
};
