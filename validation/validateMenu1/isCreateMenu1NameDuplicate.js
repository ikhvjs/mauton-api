const db = require('../../database');

module.exports = {
    isCreateMenu1NameDuplicate: async function(menu1Name,userID){
         return db.select('*')
                .from('tb_menu')
                .where({menu_name:menu1Name,
                        user_id:userID,
                        menu_level:1
                })
                .then(result => {
                    return (result.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}