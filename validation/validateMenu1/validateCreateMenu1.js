
const { isMenu1MandatoryFieldNotFilled } = require('./isMenu1MandatoryFieldNotFilled');
const { isCreateMenu1NameDuplicate } = require('./isCreateMenu1NameDuplicate');
const { isMenu1NameLengthValid } = require('./isMenu1NameLengthValid');
const { isMenu1SeqValidNumber } = require('./isMenu1SeqValidNumber');
const {
    MENU1_MANDATORY_FIELD,
    MENU1_DUPLICATE_MENU1_NAME,
    MENU1_NAME_INVALID_LENGTH,
    MENU1_SEQ_INVALID_NUMBER,
    INTERNAL_SERVER_ERROR_MENU1_CHECK_DUP
} = require('../validationConstants');

module.exports = {
    validateCreateMenu1: async function (menu1Name, menu1Seq, userID) {
        //frontend also check
        if (isMenu1MandatoryFieldNotFilled(menu1Name,menu1Seq)) {
            return ({ Status:400, Code: MENU1_MANDATORY_FIELD, errMessage: 'Menu Name and Seq is Mandatory' });
        }
        //frontend also check
        if (!isMenu1NameLengthValid(menu1Name)) {
            return ({ Status:400, Code: MENU1_NAME_INVALID_LENGTH, errMessage: 'Menu Name cannot be more than 20 characters' });
        }
        //frontend also check
        if (!isMenu1SeqValidNumber(menu1Seq)) {
            return ({ Status:400, Code: MENU1_SEQ_INVALID_NUMBER, errMessage: 'Seq must be between 1 to 1000' });
        }

        const isMenu1NameDuplicateResult = await isCreateMenu1NameDuplicate(menu1Name,userID);
        if (typeof(isMenu1NameDuplicateResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_MENU1_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isMenu1NameDuplicateResult) 
                return({ Status:400, Code: MENU1_DUPLICATE_MENU1_NAME, errMessage: 'Menu Name is duplicate' });
        }

        return ({ Status:200 });
    }
}