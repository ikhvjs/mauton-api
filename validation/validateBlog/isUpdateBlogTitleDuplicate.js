const db = require('../../database');

module.exports = {
    isUpdateBlogTitleDuplicate: async function(blogID, blogTitle,sidebarMenuID,userID){
         return db.select('*')
                .from('tb_blog')
                .where({blog_title:blogTitle,
                        menu_id:sidebarMenuID,
                        user_id:userID
                })
                .andWhere('blog_id','<>',blogID)
                .then(blog => {
                    return (blog.length > 0)?true:false
                })
                .catch(err => {
                    console.log(err);
                    return err.message;
                });
    }

}