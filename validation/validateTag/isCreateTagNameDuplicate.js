const db = require('../../database');

module.exports = {
    isCreateTagNameDuplicate: async function(tagName,userID){
         return db.select('*')
                .from('tb_tag')
                .where({tag_name:tagName,
                        user_id:userID
                })
                .then(tag => {
                    return (tag.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}