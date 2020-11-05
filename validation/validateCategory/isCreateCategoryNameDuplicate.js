const db = require('../../database');

module.exports = {
    isCreateCategoryNameDuplicate: async function(categoryName,userID){
         return db.select('*')
                .from('tb_blog_category')
                .where({blog_category_name:categoryName,
                        user_id:userID
                })
                .then(ctg => {
                    return (ctg.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}