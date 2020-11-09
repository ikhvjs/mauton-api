const db = require('../../database');

module.exports = {
    isMenu1ForeignKeyExist: async function(menuID){
         return db.select('*')
                .from('tb_menu')
                .where({parent_menu_id:menuID})
                .then(result => {
                    return (result.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}