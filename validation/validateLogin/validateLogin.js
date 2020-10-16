const { isGrantTypeNotPassword } = require('./isGrantTypePassword');
const { isLoginMandatoryFieldNotFilled } = require('./isLoginMandatoryFieldNotFilled');
const { isLoginValidEmail } = require('./isLoginValidEmail');
const constants = require('../validationConstants');

module.exports = {
    validateLogin: async function (email, password, grant_type) {

        if (isGrantTypeNotPassword(grant_type)) {
            return ({ Code: constants.SIGNIN_GRANT_TYPE_MANDATORY, errMessage: 'Only support password grant type' });
        }
    
        if (isLoginMandatoryFieldNotFilled(email, password)) {
            return ({ Code: constants.SIGNIN_MANDATORY_FIELD, errMessage: 'Please enter both Email and Password' });
        }

        if (!isLoginValidEmail(email)) {
            return ({ Code: constants.REG_INVALID_EMAIL, errMessage: 'Email is invalid' });
        }

        return ({ Code: constants.NO_ERROR });
    }
}