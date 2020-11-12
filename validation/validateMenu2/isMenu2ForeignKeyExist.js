const db = require('../../database');

module.exports = {
    isMenu2ForeignKeyExist: async function(menu2ID,userID){
         return db.select('blog_id')
                .from('tb_blog')
                .where({menu_id:menu2ID,
                        user_id:userID})
                .then(result => {
                    return (result.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}