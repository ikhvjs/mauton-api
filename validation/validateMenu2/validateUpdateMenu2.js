
const { isMenu2MandatoryFieldNotFilled } = require('./isMenu2MandatoryFieldNotFilled');
const { isUpdateMenu2NameDuplicate } = require('./isUpdateMenu2NameDuplicate');
const { isMenu2NameLengthValid } = require('./isMenu2NameLengthValid');
const { isMenu2SeqValidNumber } = require('./isMenu2SeqValidNumber');
const {
    MENU2_MANDATORY_FIELD,
    MENU2_DUPLICATE_MENU2_NAME,
    MENU2_NAME_INVALID_LENGTH,
    MENU2_SEQ_INVALID_NUMBER,
    INTERNAL_SERVER_ERROR_MENU2_CHECK_DUP
} = require('../validationConstants');

module.exports = {
    validateUpdateMenu2: async function (menu2ID, menu2Name,menu2ParentMenuID, menu2Seq, userID) {
        //frontend supposed to guard this, just in case someone change the js in frontend
        if (isMenu2MandatoryFieldNotFilled(menu2Name,menu2Seq,menu2ParentMenuID)) {
            return ({ Status:400, Code: MENU2_MANDATORY_FIELD, errMessage: 'Menu Name, Parent Menu Name and Seq is Mandatory' });
        }

        if (!isMenu2NameLengthValid(menu2Name)) {
            return ({ Status:400, Code: MENU2_NAME_INVALID_LENGTH, errMessage: 'Menu2 Name cannot be more than 20 characters' });
        }

        if (!isMenu2SeqValidNumber(menu2Seq)) {
            return ({ Status:400, Code: MENU2_SEQ_INVALID_NUMBER, errMessage: 'Seq must be between 1 to 1000' });
        }

        const isMenu2NameDuplicateResult = await isUpdateMenu2NameDuplicate(menu2Name,menu2ParentMenuID,userID,menu2ID);
        if (typeof(isMenu2NameDuplicateResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_MENU2_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isMenu2NameDuplicateResult) 
                return({ Status:400, Code: MENU2_DUPLICATE_MENU2_NAME, errMessage: 'Menu Name is duplicate' });
        }

        return ({ Status:200 });
    }
}