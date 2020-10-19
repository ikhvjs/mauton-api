const { isGrantTypeNotPassword } = require('./isGrantTypePassword');
const { isLoginMandatoryFieldNotFilled } = require('./isLoginMandatoryFieldNotFilled');
const { isLoginValidEmail } = require('./isLoginValidEmail');
const { isValidLoginCaptchaToken } = require('./isValidLoginCaptchaToken');

const constants = require('../validationConstants');

const {
    SIGNIN_GRANT_TYPE_MANDATORY,
    SIGNIN_MANDATORY_FIELD,
    SIGNIN_INVALID_EMAIL,
    SIGNIN_INVALID_CAPTCHA_TOKEN,
    INTERNAL_SERVER_ERROR_SIGNIN_ICT,
    NO_ERROR
} = require('../validationConstants');

module.exports = {
    validateLogin: async function (email, password, grant_type,captchaToken) {

        if (isGrantTypeNotPassword(grant_type)) {
            return ({ Code: SIGNIN_GRANT_TYPE_MANDATORY, errMessage: 'Only support password grant type' });
        }
    
        if (isLoginMandatoryFieldNotFilled(email, password)) {
            return ({ Code:  SIGNIN_MANDATORY_FIELD, errMessage: 'Please enter both Email and Password' });
        }

        if (!isLoginValidEmail(email)) {
            return ({ Code:  SIGNIN_INVALID_EMAIL, errMessage: 'Email is invalid' });
        }

        const isValidLoginCaptchaTokenResult = await isValidLoginCaptchaToken(captchaToken);
        if ( typeof(isValidLoginCaptchaTokenResult) !== "boolean"){
            return({ Code:  INTERNAL_SERVER_ERROR_SIGNIN_ICT, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(!isValidLoginCaptchaTokenResult) 
                return({ Code:  SIGNIN_INVALID_CAPTCHA_TOKEN, errMessage: 'Captcha Test Failed, please try again' });
        }

        return ({ Code:  NO_ERROR });
    }
}