
const { isTagMandatoryFieldNotFilled } = require('./isTagMandatoryFieldNotFilled');
const { isCreateTagNameDuplicate } = require('./isCreateTagNameDuplicate');
const { isTagNameLengthValid } = require('./isTagNameLengthValid');
const { isTagSeqValidNumber } = require('./isTagSeqValidNumber');
const {
    TAG_MANDATORY_FIELD,
    TAG_DUPLICATE_TAG_NAME,
    TAG_NAME_INVALID_LENGTH,
    TAG_SEQ_INVALID_NUMBER,
    INTERNAL_SERVER_ERROR_TAG_CHECK_DUP
} = require('../validationConstants');

module.exports = {
    validateCreateTag: async function (tagName, tagSeq, userID) {
        //frontend also check
        if (isTagMandatoryFieldNotFilled(tagName,tagSeq)) {
            return ({ Status:400, Code: TAG_MANDATORY_FIELD, errMessage: 'Tag Name and Seq is Mandatory' });
        }
        //frontend also check
        if (isTagNameLengthValid(tagName)) {
            return ({ Status:400, Code: TAG_NAME_INVALID_LENGTH, errMessage: 'Tag Name cannot be more than 20 characters' });
        }
        //frontend also check
        if (isTagSeqValidNumber(tagSeq)) {
            return ({ Status:400, Code: TAG_SEQ_INVALID_NUMBER, errMessage: 'Seq must be between 0 to 1000' });
        }

        const isTagNameDuplicateResult = await isCreateTagNameDuplicate(tagName,userID);
        if (typeof(isTagNameDuplicateResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_TAG_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isTagNameDuplicateResult) 
                return({ Status:400, Code: TAG_DUPLICATE_TAG_NAME, errMessage: 'Tag Name is duplicate' });
        }

        return ({ Status:200 });
    }
}