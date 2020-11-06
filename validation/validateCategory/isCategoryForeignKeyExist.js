const db = require('../../database');

module.exports = {
    isCategoryForeignKeyExist: async function(categoryID,userID){
        
         return db('tb_blog')
                .where({ blog_category_id:categoryID,
                        user_id:userID})
                .select('*')
                .then(ctg => {
                    return (ctg.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}