const handleBloglistGet = (req,res,db) =>{
	const { sidebarMenuPath } = req.params;

	db.select('tb.blog_id',
		'tb.blog_title',
		'tb.blog_content',
		'tb.seq',
		'tb.blog_path',
		'bc.blog_category_name',
		'tb.blog_desc',
		'tb.last_updated_date')
	.from('tb_blog as tb')
	.join('tb_menu as tm', function() {
		this.on('tb.menu_id', '=', 'tm.menu_id')
	  	.andOn('tm.menu_path', '=',db.raw('?',[sidebarMenuPath]))
	})
	.join('tb_blog_category as bc', 'bc.blog_category_id', 'tb.blog_category_id')
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error getting blog'));
}


//Debug for SQL
// var toStringQuery = db.select.toString()
//   console.log('toStringQuery',toStringQuery);

const handleBloglistSearch = (req,res,db) =>{
	const { blog_title, blog_category_name, tag_name, menu_path } = req.body;
	
	db.groupByRaw('1,2,3,4,5,6,7,8')
	.select('tb.blog_id',
		'tb.blog_title',
		'tb.blog_content',
		'tb.seq',
		'tb.blog_path',
		'tbc.blog_category_name',
		'tb.blog_desc',
		'tb.last_updated_date')
	.from('tb_tag_link as ttl')
	.join('tb_blog as tb', function() {
		this.on('ttl.tag_group_id', '=', 'tb.tag_group_id')
	  	.andOn('tb.blog_title', '~*',db.raw('?',[blog_title]))
	})
	.join('tb_tag as tt', function() {
		this.on('ttl.tag_id', '=', 'tt.tag_id')
	  	.andOn('tt.tag_name', '~*',db.raw('?',[tag_name]))
	})
	.join('tb_blog_category as tbc', function() {
		this.on('tbc.blog_category_id', '=', 'tb.blog_category_id')
		.andOn('tbc.blog_category_name', '~*',db.raw('?',[blog_category_name]))
	})
	.join('tb_menu as tm' ,function(){
		this.on('tm.menu_id','=','tb.menu_id')
		.andOn('tm.menu_path','=',db.raw('?',[menu_path]))
	})
	.then(data=>res.json(data))
	.catch(err => res.status(400).json(err));
}

module.exports = {
  handleBloglistGet,
  handleBloglistSearch
}