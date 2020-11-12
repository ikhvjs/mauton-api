const { isMenu2ForeignKeyExist} = require('./isMenu2ForeignKeyExist');
const {
    MENU2_FOREIGN_KEY_EXIST,
    INTERNAL_SERVER_ERROR_MENU2_CHECK_FOREIGN_KEY
} = require('../validationConstants');

module.exports = {
    validateDeleteMenu2: async function (menu2ID,userID) {
        
        const isMenu2ForeignKeyExistResult = await isMenu2ForeignKeyExist(menu2ID,userID);
        if (typeof(isMenu2ForeignKeyExistResult) !== "boolean") {
            return({ Status:500, Code: INTERNAL_SERVER_ERROR_MENU2_CHECK_FOREIGN_KEY, errMessage: 'Internal Server Error, please try again' });
        }else{
            if(isMenu2ForeignKeyExistResult) 
                return({ Status:400, Code: MENU2_FOREIGN_KEY_EXIST, errMessage: 'Cannot Delete it, Menu is used by some Child Blog(s)' });
        }

        return ({ Status:200 });
    }
}