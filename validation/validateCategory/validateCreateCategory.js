
const { isCategoryMandatoryFieldNotFilled } = require('./isCategoryMandatoryFieldNotFilled');
const { isCreateCategoryNameDuplicate } = require('./isCreateCategoryNameDuplicate');
const {
    CATEGORY_MANDATORY_FIELD,
    CATEGORY_DUPLICATE_CATEGORY_NAME,
    INTERNAL_SERVER_ERROR_CATEGORY_CHECK_DUP
} = require('../validationConstants');

module.exports = {
    validateCreateCategory: async function (categoryName, categoryDesc, seq, userID) {
        //frontend supposed to guard this, just in case someone hack the js in frontend
        if (isCategoryMandatoryFieldNotFilled(categoryName, seq)) {
            return ({ Status:400, Code: CATEGORY_MANDATORY_FIELD, errMessage: 'Category Name and Seq is Mandatory' });
        }

        const isCreateCategoryNameDuplicateResult = await isCreateCategoryNameDuplicate(categoryName,userID);
        if (typeof(isCreateCategoryNameDuplicateResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_CATEGORY_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isCreateCategoryNameDuplicateResult) 
                return({ Status:400, Code: CATEGORY_DUPLICATE_CATEGORY_NAME, errMessage: 'Category Name is duplicate' });
        }

        return ({ Status:200 });
    }
}