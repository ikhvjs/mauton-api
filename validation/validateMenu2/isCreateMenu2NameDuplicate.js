const db = require('../../database');

module.exports = {
    isCreateMenu2NameDuplicate: async function(menu1Name,userID,menu2ParentMenuID){
         return db.select('*')
                .from('tb_menu')
                .where({menu_name:menu1Name,
                        user_id:userID,
                        parent_menu_id:menu2ParentMenuID,
                        menu_level:2
                })
                .then(result => {
                    return (result.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}