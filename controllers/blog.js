const handleBlogGet =(req,res,db)=>{
	const { blogPath } = req.params;

	db.select('tb.blog_id',
		'tb.blog_title',
		'tb.blog_content',
		'tb.seq',
		'bc.blog_category_name',
		'tb.blog_path')
	.from('tb_blog as tb')
	.join('tb_blog_category as bc', function() {
		this.on('tb.blog_category_id', '=', 'bc.blog_category_id')
	.andOn('tb.blog_path', '=',db.raw('?',[blogPath]))
	})
	.then(blog=>res.json(blog))
	.catch(err => res.status(400).json('error getting blog'));
}

module.exports = {
  handleBlogGet
}