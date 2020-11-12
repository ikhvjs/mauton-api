const db = require('../../database');

module.exports = {
    isUpdateMenu2NameDuplicate: async function(menu2Name,menu2ParentMenuID,userID,menu2ID){
         return db.select('menu_id')
                .from('tb_menu')
                .where({menu_name:menu2Name,
                        parent_menu_id:menu2ParentMenuID,
                        user_id:userID,
                        menu_level:2
                })
                .andWhere('menu_id','<>',menu2ID)
                .then(result => {
                    return (result.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}