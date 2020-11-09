const db = require('../../database');

module.exports = {
    isUpdateMenu1NameDuplicate: async function(menu1Name,userID,menu1ID){
         return db.select('*')
                .from('tb_menu')
                .where({menu_name:menu1Name,
                        user_id:userID,
                        menu_level:1
                })
                .andWhere('menu_id','<>',menu1ID)
                .then(result => {
                    return (result.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}