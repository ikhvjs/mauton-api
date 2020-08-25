const handleBloglistGet = (req,res,db) =>{
	const { sidebarMenuPath } = req.params;

	db.select('tb.blog_id','tb.blog_title',
		'tb.blog_content','tb.seq',
		'tb.blog_path','bc.blog_category_name')
	.from('tb_blog as tb')
	.join('tb_menu as tm', function() {
		this.on('tb.menu_id', '=', 'tm.menu_id')
	  	.andOn('tm.menu_path', '=',db.raw('?',[sidebarMenuPath]))
	})
	.join('tb_blog_category as bc', 'bc.blog_category_id', 'tb.blog_category_id')
	.then(bloglist=>res.json(bloglist))
	.catch(err => res.status(400).json('error getting blog'));
}

module.exports = {
  handleBloglistGet
}