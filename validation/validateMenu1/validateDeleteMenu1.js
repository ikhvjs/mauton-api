const { isMenu1ForeignKeyExist} = require('./isMenu1ForeignKeyExist');
const {
    MENU1_FOREIGN_KEY_EXIST,
    INTERNAL_SERVER_ERROR_MENU1_CHECK_FOREIGN_KEY
} = require('../validationConstants');

module.exports = {
    validateDeleteMenu1: async function (tagID) {
        
        const isMenu1ForeignKeyExistResult = await isMenu1ForeignKeyExist(tagID);
        if (typeof(isMenu1ForeignKeyExistResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_MENU1_CHECK_FOREIGN_KEY, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isMenu1ForeignKeyExistResult) 
                return({ Status:400, Code: MENU1_FOREIGN_KEY_EXIST, errMessage: 'Cannot Delete it, Menu is used by some Child Menu(s)' });
        }

        return ({ Status:200 });
    }
}