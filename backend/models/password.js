var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();

// Add properties to make password more secure
passwordSchema
  .is().min(8) // Minimum length 8
  .is().max(20) // Maximum length 
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .digits(2) // Must have at least 2 digits
  .has().not() .spaces() // Should not have spaces

module.exports = passwordSchema;