
const { isTagMandatoryFieldNotFilled } = require('./isTagMandatoryFieldNotFilled');
const { isTagNameDuplicate } = require('./isTagNameDuplicate');
const {
    TAG_MANDATORY_FIELD,
    TAG_DUPLICATE_TAG_NAME,
    INTERNAL_SERVER_ERROR_TAG_CHECK_DUP
} = require('../validationConstants');

module.exports = {
    validateCreateTag: async function (tagName, tagSeq, userID) {
        //frontend supposed to guard this, just in case someone change the js in frontend
        if (isTagMandatoryFieldNotFilled(tagName,tagSeq)) {
            return ({ Status:400, Code: TAG_MANDATORY_FIELD, errMessage: 'Tag Name and Seq is Mandatory' });
        }

        const isTagNameDuplicateResult = await isTagNameDuplicate(tagName,userID);
        if (typeof(isTagNameDuplicateResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_TAG_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isTagNameDuplicateResult) 
                return({ Status:400, Code: TAG_DUPLICATE_TAG_NAME, errMessage: 'Tag Name is duplicate' });
        }

        return ({ Status:200 });
    }
}