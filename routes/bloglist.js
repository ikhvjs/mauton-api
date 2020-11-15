const db = require('../database')
const express = require('express');
const bloglist = express.Router();

bloglist.post('/request', (req, res) => {
	const { menu2ID, userID } = req.body;

	// console.table(req.body);

	db.select('tb.blog_id',
		'tb.blog_title',
		'tb.blog_content',
		'tb.seq',
		'bc.blog_category_name',
		'tb.last_updated_date')
		.from('tb_blog as tb')
		.join('tb_menu as tm', function () {
			this.on('tb.menu_id', '=', 'tm.menu_id')
				.andOn('tm.menu_id', '=', db.raw('?', [menu2ID]))
				.andOn('tb.user_id', '=', db.raw('?', [userID]))
		})
		.join('tb_blog_category as bc', 'bc.blog_category_id', 'tb.blog_category_id')
		.then(blogs => {
			// console.log('blogs',blogs);

			const promises = blogs.map((blog) => {
				// console.log('blog',blog);
				return db.select(
					'tt.tag_id',
					'tt.tag_name')
					.from('tb_tag as tt')
					.join('tb_blog_tag_link as tbtl', function () {
						this.on('tbtl.blog_id', '=', blog.blog_id)
							.andOn('tbtl.tag_id', '=', 'tt.tag_id')
					})
					.then(tags => {
						// console.log('tags',tags);
						Object.assign(blog, { tags: [...tags] })
						return blog;
					})
					;
			});

			return Promise.all(promises);
		})
		.then(blogs => res.status(200).json(blogs))
		.catch(() =>
			res.status(500).json(
				{
					Code: INTERNAL_SERVER_ERROR_MENU2_REQUEST,
					errMessage: 'Internal Server Error, please click Search button to try again'
				})
		);
});

// bloglist.get('/id/:sidebarMenuID', (req, res) => {
// 	const { sidebarMenuID } = req.params;

// 	db.select('tb.blog_id',
// 		'tb.blog_title',
// 		'tb.blog_content',
// 		'tb.seq',
// 		'tb.blog_path',
// 		'bc.blog_category_name',
// 		'tb.blog_desc',
// 		'tb.last_updated_date')
// 		.from('tb_blog as tb')
// 		.join('tb_menu as tm', function () {
// 			this.on('tb.menu_id', '=', 'tm.menu_id')
// 				.andOn('tm.menu_id', '=', db.raw('?', [sidebarMenuID]))
// 		})
// 		.join('tb_blog_category as bc', 'bc.blog_category_id', 'tb.blog_category_id')
// 		.then(blogs => {
// 			// console.log('blogs',blogs);

// 			const promises = blogs.map((blog) => {
// 				// console.log('blog',blog);
// 				return db.select(
// 					'tt.tag_id',
// 					'tt.tag_name')
// 					.from('tb_tag as tt')
// 					.join('tb_blog_tag_link as tbtl', function () {
// 						this.on('tbtl.blog_id', '=', blog.blog_id)
// 							.andOn('tbtl.tag_id', '=', 'tt.tag_id')
// 					})
// 					.then(tags => {
// 						// console.log('tags',tags);
// 						Object.assign(blog, { tags: [...tags] })
// 						return blog;
// 					})
// 					;
// 			});

// 			return Promise.all(promises);
// 		})
// 		.then(data => res.json(data))
// 		.catch(err => res.status(400).json('error getting blog'));
// });

bloglist.post('/search', (req, res) => {
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
		.from('tb_blog_tag_link as tbtl')
		.join('tb_blog as tb', function () {
			this.on('tbtl.blog_id', '=', 'tb.blog_id')
				.andOn('tb.blog_title', '~*', db.raw('?', [blog_title]))
		})
		.join('tb_tag as tt', function () {
			this.on('tbtl.tag_id', '=', 'tt.tag_id')
				.andOn('tt.tag_name', '~*', db.raw('?', [tag_name]))
		})
		.join('tb_blog_category as tbc', function () {
			this.on('tbc.blog_category_id', '=', 'tb.blog_category_id')
				.andOn('tbc.blog_category_name', '~*', db.raw('?', [blog_category_name]))
		})
		.join('tb_menu as tm', function () {
			this.on('tm.menu_id', '=', 'tb.menu_id')
				.andOn('tm.menu_path', '=', db.raw('?', [menu_path]))
		})
		.then(data => res.json(data))
		.catch(err => res.status(400).json(err));
});

// const handleBloglistGet = (req,res,db) =>{
// 	const { sidebarMenuPath } = req.params;

// 	db.select('tb.blog_id',
// 		'tb.blog_title',
// 		'tb.blog_content',
// 		'tb.seq',
// 		'tb.blog_path',
// 		'bc.blog_category_name',
// 		'tb.blog_desc',
// 		'tb.last_updated_date')
// 	.from('tb_blog as tb')
// 	.join('tb_menu as tm', function() {
// 		this.on('tb.menu_id', '=', 'tm.menu_id')
// 	  	.andOn('tm.menu_path', '=',db.raw('?',[sidebarMenuPath]))
// 	})
// 	.join('tb_blog_category as bc', 'bc.blog_category_id', 'tb.blog_category_id')
// 	.then(blogs => {
// 		// console.log('blogs',blogs);

// 		const promises = blogs.map((blog)=>{
// 			// console.log('blog',blog);
// 			return db.select(
// 					'tt.tag_id',
// 					'tt.tag_name')
// 				.from('tb_tag as tt')
// 				.join('tb_blog_tag_link as tbtl', function(){
// 					this.on('tbtl.blog_id','=',blog.blog_id)
// 					.andOn('tbtl.tag_id','=','tt.tag_id')
// 				})
// 				.then(tags => {
// 		            // console.log('tags',tags);
// 		            Object.assign(blog,{tags:[...tags]})
// 		         	return blog;
// 		        })
// 		        ;
// 		});

// 	    return Promise.all(promises);
//     })
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error getting blog'));
// }


// const handleBloglistSearch = (req,res,db) =>{
// 	const { blog_title, blog_category_name, tag_name, menu_path } = req.body;

// 	db.groupByRaw('1,2,3,4,5,6,7,8')
// 	.select('tb.blog_id',
// 		'tb.blog_title',
// 		'tb.blog_content',
// 		'tb.seq',
// 		'tb.blog_path',
// 		'tbc.blog_category_name',
// 		'tb.blog_desc',
// 		'tb.last_updated_date')
// 	.from('tb_blog_tag_link as tbtl')
// 	.join('tb_blog as tb', function() {
// 		this.on('tbtl.blog_id', '=', 'tb.blog_id')
// 	  	.andOn('tb.blog_title', '~*',db.raw('?',[blog_title]))
// 	})
// 	.join('tb_tag as tt', function() {
// 		this.on('tbtl.tag_id', '=', 'tt.tag_id')
// 	  	.andOn('tt.tag_name', '~*',db.raw('?',[tag_name]))
// 	})
// 	.join('tb_blog_category as tbc', function() {
// 		this.on('tbc.blog_category_id', '=', 'tb.blog_category_id')
// 		.andOn('tbc.blog_category_name', '~*',db.raw('?',[blog_category_name]))
// 	})
// 	.join('tb_menu as tm' ,function(){
// 		this.on('tm.menu_id','=','tb.menu_id')
// 		.andOn('tm.menu_path','=',db.raw('?',[menu_path]))
// 	})
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json(err));
// }

// module.exports = {
//   handleBloglistGet,
//   handleBloglistSearch
// }

module.exports = bloglist