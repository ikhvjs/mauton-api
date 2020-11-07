
const { isCategoryMandatoryFieldNotFilled } = require('./isCategoryMandatoryFieldNotFilled');
const { isUpdateCategoryNameDuplicate } = require('./isUpdateCategoryNameDuplicate');
const { isCategoryNameLengthValid } = require('./isCategoryNameLengthValid');
const { isCategoryDescLengthValid } = require('./isCategoryDescLengthValid');
const { isCategorySeqValidNumber } = require('./isCategorySeqValidNumber');
const {
    CATEGORY_MANDATORY_FIELD,
    CATEGORY_DUPLICATE_CATEGORY_NAME,
    CATEGORY_NAME_INVALID_LENGTH,
    CATEGORY_SEQ_INVALID_NUMBER,
    INTERNAL_SERVER_ERROR_CATEGORY_CHECK_DUP
} = require('../validationConstants');

module.exports = {
    validateUpdateCategory: async function (categoryID,categoryName,categoryDesc,categorySeq, userID) {
        //frontend supposed to guard this, just in case someone change the js in frontend
        if (isCategoryMandatoryFieldNotFilled(categoryName,categorySeq)) {
            return ({ Status:400, Code: CATEGORY_MANDATORY_FIELD, errMessage: 'Category Name and Seq is Mandatory' });
        }

        if (!isCategoryNameLengthValid(categoryName)) {
            return ({ Status:400, Code: CATEGORY_NAME_INVALID_LENGTH, errMessage: 'Category Name cannot be more than 20 characters' });
        }

        if (!isCategoryDescLengthValid(categoryDesc)) {
            return ({ Status:400, Code: CATEGORY_DESC_INVALID_LENGTH, errMessage: 'Category Desc cannot be more than 20 characters' });
        }

        if (!isCategorySeqValidNumber(categorySeq)) {
            return ({ Status:400, Code: CATEGORY_SEQ_INVALID_NUMBER, errMessage: 'Seq must be between 0 to 1000' });
        }

        const isCategoryNameDuplicateResult = await isUpdateCategoryNameDuplicate(categoryName,userID,categoryID);
        if (typeof(isCategoryNameDuplicateResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_CATEGORY_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isCategoryNameDuplicateResult) 
                return({ Status:400, Code: CATEGORY_DUPLICATE_CATEGORY_NAME, errMessage: 'Category Name is duplicate' });
        }

        return ({ Status:200 });
    }
}