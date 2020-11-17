const db = require('../database')
const express = require('express');
const bloglist = express.Router();
const {
	INTERNAL_SERVER_ERROR_BLOGLIST_REQUEST,
	INTERNAL_SERVER_ERROR_BLOGLIST_SEARCH
} = require('../validation/validationConstants');

bloglist.post('/request', (req, res) => {
	const { menu2ID, userID } = req.body;

	// console.table(req.body);

	db.select('tb.blog_id',
		'tb.blog_title',
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
					Code: INTERNAL_SERVER_ERROR_BLOGLIST_REQUEST,
					errMessage: 'Internal Server Error, please click Search button to try again'
				})
		);
});

bloglist.post('/search', (req, res) => {
	const { blogTitle, categoryName, tagName, menuID, userID } = req.body;
	// console.table(req.body)

	db.groupByRaw('1,2,3,4,5')
		.select('tb.blog_id',
			'tb.blog_title',
			'tb.blog_content',
			'tbc.blog_category_name',
			'tb.last_updated_date')
		.from('tb_blog_tag_link as tbtl')
		.join('tb_blog as tb', function () {
			this.on('tbtl.blog_id', '=', 'tb.blog_id')
				.andOn('tb.blog_title', '~*', db.raw('?', [blogTitle]))
				.andOn('tb.user_id', '=', db.raw('?', [userID]))
		})
		.join('tb_tag as tt', function () {
			this.on('tbtl.tag_id', '=', 'tt.tag_id')
				.andOn('tt.tag_name', '~*', db.raw('?', [tagName]))
		})
		.join('tb_blog_category as tbc', function () {
			this.on('tbc.blog_category_id', '=', 'tb.blog_category_id')
				.andOn('tbc.blog_category_name', '~*', db.raw('?', [categoryName]))
		})
		.join('tb_menu as tm', function () {
			this.on('tm.menu_id', '=', 'tb.menu_id')
				.andOn('tm.menu_id', '=', db.raw('?', [menuID]))
		})
		.then(blogs => res.status(200).json(blogs))
		.catch((err) => {
			console.log(err);
			res.status(500).json(
				{
					Code: INTERNAL_SERVER_ERROR_BLOGLIST_SEARCH,
					errMessage: 'Internal Server Error, please click Search button to try again'
				});
		});
});

module.exports = bloglist