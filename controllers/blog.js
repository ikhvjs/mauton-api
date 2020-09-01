const handleBlogGet =(req,res,db)=>{
	const { blogPath } = req.params;

	db.select('tb.blog_id',
		'tb.blog_title',
		'tb.blog_content',
		'tb.seq',
		'bc.blog_category_name',
		'tb.blog_path',
		'tb.blog_desc',
		'tb.last_updated_date')
	.from('tb_blog as tb')
	.join('tb_blog_category as bc', function() {
		this.on('tb.blog_category_id', '=', 'bc.blog_category_id')
	.andOn('tb.blog_path', '=',db.raw('?',[blogPath]))
	})
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error getting blog'));
}



const handleBlogTagGet = (req,res,db) =>{
	const { blogPath } = req.params;

	db.select('tt.tag_name'
			,'tt.tag_id')
	.from('tb_tag as tt')
	.join('tb_tag_link as ttl', function(){
		this.on('ttl.tag_id','=','tt.tag_id')
	})
	.join('tb_blog as tb', function(){
		this.on('ttl.tag_group_id','=','tb.tag_group_id')
		.andOn('tb.blog_path','=',db.raw('?',[blogPath]))
	})
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error getting tag'));

}

module.exports = {
  handleBlogGet,
  handleBlogTagGet
}