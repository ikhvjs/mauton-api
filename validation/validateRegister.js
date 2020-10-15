
const { isValidEmail } = require('./isValidEmail');
const { isValidUsername } = require('./isValidUsername');
const { isValidPassword} = require('./isValidPassword');
const { isDuplicateEmail } = require('./isDuplicateEmail');
const { isDuplicateUsername } = require('./isDuplicateUsername');
const constants = require('./validationConstants');

module.exports = {
    validateRegister: async function (email, password, username) {
        if (!email || !password || !username) {
            return ({ Code: constants.REG_MANDATORY_FIELD, errMessage: 'Username, Email, Password are Mandatory' });
        }

        if (!isValidEmail(email)) {
            return ({ Code: constants.REG_INVALID_EMAIL, errMessage: 'Email is invalid' });
        }

        if(!isValidUsername(username)){
            return ({ Code: constants.REG_INVALID_USERNAME, errMessage: 'Username is invalid. Only accept English(Lower Case) and Numbers'});
        }

        if(!isValidPassword(password)){
            return ({ Code: constants.REG_INVALID_PASSWORD, errMessage: 'Password is invalid. At least one number, one lowercase, one uppercase letter, 8 characters' });
        }

        const isDuplicateEmailResult = await isDuplicateEmail(email);
        if ( typeof(isDuplicateEmailResult) !== "boolean"){
            return({ Code: constants.INTERNAL_SERVER_ERROR, errMessage: 'Internal Server Error' });
        }else{
            if(isDuplicateEmailResult) 
                return({ Code: constants.REG_DUPLICATE_EMAIL, errMessage: 'Email is used' });
        }

        const isDuplicateUsernameResult = await isDuplicateUsername(username);
        if ( typeof(isDuplicateUsernameResult) !== "boolean"){
            return({ Code: constants.INTERNAL_SERVER_ERROR, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isDuplicateUsernameResult) 
                return({ Code: constants.REG_DUPLICATE_USERNAME, errMessage: 'Username is used' });
        }

        return ({ Code: constants.NO_ERROR, errMessage: null });
    }
}