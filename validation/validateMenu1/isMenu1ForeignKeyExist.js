const db = require('../../database');

module.exports = {
    isMenu1ForeignKeyExist: async function(menu1ID){
         return db.select('*')
                .from('tb_menu')
                .where({parent_menu_id:menu1ID})
                .then(result => {
                    return (result.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}