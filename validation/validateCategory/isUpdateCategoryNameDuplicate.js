const db = require('../../database');

module.exports = {
    isUpdateCategoryNameDuplicate: async function(categoryName,userID,categoryID){
         return db.select('*')
                .from('tb_blog_category')
                .where({blog_category_name:categoryName,
                        user_id:userID
                })
                .andWhere('blog_category_id','<>',categoryID)
                .then(ctg => {
                    return (ctg.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}