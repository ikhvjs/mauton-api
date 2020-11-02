const db = require('../../database');

module.exports = {
    isTagForeignKeyExist: async function(tagID){
         return db.select('*')
                .from('tb_blog_tag_link')
                .where({tag_id:tagID})
                .then(tag => {
                    return (tag.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}