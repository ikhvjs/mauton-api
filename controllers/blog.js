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



// const handleBlogTagGet = (req,res,db) =>{
// 	const { blogPath } = req.params;

// 	db.select('tt.tag_name'
// 			,'tt.tag_id')
// 	.from('tb_tag as tt')
// 	.join('tb_tag_link as ttl', function(){
// 		this.on('ttl.tag_id','=','tt.tag_id')
// 	})
// 	.join('tb_blog as tb', function(){
// 		this.on('ttl.tag_group_id','=','tb.tag_group_id')
// 		.andOn('tb.blog_path','=',db.raw('?',[blogPath]))
// 	})
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error getting tag'));

// }

const handleBlogCategoryGet = (req,res,db) =>{
	db.orderBy('blog_category_id','desc')
	.select('blog_category_id','blog_category_name','blog_category_desc','seq')
	.from('tb_blog_category')
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error get blog category'));
}

const handleBlogCategorySearch=(req,res,db)=>{
	const{blog_category_name,blog_category_desc} = req.body;
	db.orderBy('blog_category_id','desc')
	.select('blog_category_id','blog_category_name'
		,'blog_category_desc','seq')
	.from('tb_blog_category')
	.where('blog_category_name','~*',blog_category_name)
	.andWhere('blog_category_desc','~*',blog_category_desc)
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error search blog category'));
}

const handleBlogTagGet = (req,res,db) =>{
	db.orderBy('tag_id','desc')
	.select('tag_id','tag_name','seq')
	.from('tb_tag')
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error get blog tag'));
}

const handleBlogTagSearch=(req,res,db)=>{
	const{tag_name} = req.body;
	db.orderBy('tag_id','desc')
	.select('tag_id','tag_name','seq')
	.from('tb_tag')
	.where('tag_name','~*',tag_name)
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error search blog category'));
}


module.exports = {
  handleBlogGet,
  // handleBlogTagGet,
  handleBlogCategoryGet,
  handleBlogCategorySearch,
  handleBlogTagGet,
  handleBlogTagSearch
}