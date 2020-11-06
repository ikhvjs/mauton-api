const { isCategoryForeignKeyExist} = require('./isCategoryForeignKeyExist');
const {
    CATEGORY_FOREIGN_KEY_EXIST,
    INTERNAL_SERVER_ERROR_CATEGORY_CHECK_FOREIGN_KEY
} = require('../validationConstants');

module.exports = {
    validateDeleteCategory: async function (categoryID, userID) {
        
        const isCategoryForeignKeyExistResult = await isCategoryForeignKeyExist(categoryID,userID);
        if (typeof(isCategoryForeignKeyExistResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_CATEGORY_CHECK_FOREIGN_KEY, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isCategoryForeignKeyExistResult) 
                return({ Status:400, Code: CATEGORY_FOREIGN_KEY_EXIST, errMessage: 'Cannot Delete it, Category is used by some blog(s)' });
        }

        return ({ Status:200 });
    }
}