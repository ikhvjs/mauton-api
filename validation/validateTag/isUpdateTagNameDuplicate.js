const db = require('../../database');

module.exports = {
    isUpdateTagNameDuplicate: async function(tagName,userID,tagID){
         return db.select('*')
                .from('tb_tag')
                .where({tag_name:tagName,
                        user_id:userID
                })
                .andWhere('tag_id','<>',tagID)
                .then(tag => {
                    return (tag.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}