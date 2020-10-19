
const { isMandatoryFieldNotFilled } = require('./isMandatoryFieldNotFilled');
const { isValidEmail } = require('./isValidEmail');
const { isValidUsername } = require('./isValidUsername');
const { isValidPassword} = require('./isValidPassword');
const { isDuplicateEmail } = require('./isDuplicateEmail');
const { isDuplicateUsername } = require('./isDuplicateUsername');
const { isValidCaptchaToken } = require('./isValidCaptchaToken');
const {
    REG_MANDATORY_FIELD,
    REG_INVALID_EMAIL,
    REG_INVALID_USERNAME,
    REG_INVALID_PASSWORD,
    REG_INVALID_CAPTCHA_TOKEN,
    REG_DUPLICATE_EMAIL,
    REG_DUPLICATE_USERNAME,
    INTERNAL_SERVER_ERROR_REG_ICT,
    INTERNAL_SERVER_ERROR_REG_DE,
    INTERNAL_SERVER_ERROR_REG_DU,
    NO_ERROR
} = require('../validationConstants');

module.exports = {
    validateRegister: async function (email, password, username,captchaToken) {

        if (isMandatoryFieldNotFilled(email, password, username)) {
            return ({ Code: REG_MANDATORY_FIELD, errMessage: 'Username, Email, Password are Mandatory' });
        }

        if (!isValidEmail(email)) {
            return ({ Code: REG_INVALID_EMAIL, errMessage: 'Email is invalid' });
        }

        if(!isValidUsername(username)){
            return ({ Code: REG_INVALID_USERNAME, errMessage: 'Username is invalid. Only accept English(Lower Case) and Numbers'});
        }

        if(!isValidPassword(password)){
            return ({ Code: REG_INVALID_PASSWORD, errMessage: 'Password is invalid. At least one number, one lowercase, one uppercase letter, 8 characters' });
        }

        const isValidCaptchaTokenResult = await isValidCaptchaToken(captchaToken);
        if ( typeof(isValidCaptchaTokenResult) !== "boolean"){
            return({ Code: INTERNAL_SERVER_ERROR_REG_ICT, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(!isValidCaptchaTokenResult) 
                return({ Code: REG_INVALID_CAPTCHA_TOKEN, errMessage: 'Captcha Test Failed, please try again' });
        }

        const isDuplicateEmailResult = await isDuplicateEmail(email);
        if ( typeof(isDuplicateEmailResult) !== "boolean"){
            return({ Code: INTERNAL_SERVER_ERROR_REG_DE, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isDuplicateEmailResult) 
                return({ Code: REG_DUPLICATE_EMAIL, errMessage: 'Email is used' });
        }

        const isDuplicateUsernameResult = await isDuplicateUsername(username);
        if ( typeof(isDuplicateUsernameResult) !== "boolean"){
            return({ Code: INTERNAL_SERVER_ERROR_REG_DU, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isDuplicateUsernameResult) 
                return({ Code: REG_DUPLICATE_USERNAME, errMessage: 'Username is used' });
        }

        return ({ Code: NO_ERROR });
    }
}