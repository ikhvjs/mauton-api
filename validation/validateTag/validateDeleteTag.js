const { isTagForeignKeyExist} = require('./isTagForeignKeyExist');
const {
    TAG_FOREIGN_KEY_EXIST,
    INTERNAL_SERVER_ERROR_TAG_CHECK_FOREIGN_KEY
} = require('../validationConstants');

module.exports = {
    validateDeleteTag: async function (tagID, userID) {
        
        const isTagForeignKeyExistResult = await isTagForeignKeyExist(tagID,userID);
        if (typeof(isTagForeignKeyExistResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_TAG_CHECK_FOREIGN_KEY, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isTagForeignKeyExistResult) 
                return({ Status:400, Code: TAG_FOREIGN_KEY_EXIST, errMessage: 'Cannot Delete it, Tag is used by some blog(s)' });
        }

        return ({ Status:200 });
    }
}