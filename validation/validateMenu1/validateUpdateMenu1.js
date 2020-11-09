
const { isMenu1MandatoryFieldNotFilled } = require('./isMenu1MandatoryFieldNotFilled');
const { isUpdateMenu1NameDuplicate } = require('./isUpdateMenu1NameDuplicate');
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
    validateUpdateMenu1: async function (menu1ID,menu1Name, menu1Seq, userID) {
        //frontend supposed to guard this, just in case someone change the js in frontend
        if (isMenu1MandatoryFieldNotFilled(menu1Name,menu1Seq)) {
            return ({ Status:400, Code: MENU1_MANDATORY_FIELD, errMessage: 'Menu Name and Seq is Mandatory' });
        }

        if (!isMenu1NameLengthValid(menu1Name)) {
            return ({ Status:400, Code: MENU1_NAME_INVALID_LENGTH, errMessage: 'Menu1 Name cannot be more than 20 characters' });
        }

        if (!isMenu1SeqValidNumber(menu1Seq)) {
            return ({ Status:400, Code: MENU1_SEQ_INVALID_NUMBER, errMessage: 'Seq must be between 1 to 1000' });
        }

        const isMenu1NameDuplicateResult = await isUpdateMenu1NameDuplicate(menu1Name,userID,menu1ID);
        if (typeof(isMenu1NameDuplicateResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_MENU1_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isMenu1NameDuplicateResult) 
                return({ Status:400, Code: MENU1_DUPLICATE_MENU1_NAME, errMessage: 'Menu Name is duplicate' });
        }

        return ({ Status:200 });
    }
}