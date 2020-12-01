const db = require('../../database');

module.exports = {
    isCreateBlogTitleDuplicate: async function(blogTitle, sidebarMenuID, userID){
         return db.select('*')
                .from('tb_blog')
                .where({blog_title:blogTitle,
                        menu_id:sidebarMenuID,
                        user_id:userID
                })
                .then(blog => {
                    return (blog.length > 0)?true:false
                })
                .catch(err => {
                    console.log(err.message);
                    return err.message;
                });
    }

}