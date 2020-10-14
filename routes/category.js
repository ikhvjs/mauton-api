const db = require('../database')
const express = require('express');
const category = express.Router();

category.get('/get', (req,res) => {
	db.orderBy('blog_category_id','desc')
	.select('blog_category_id','blog_category_name','blog_category_desc','seq')
	.from('tb_blog_category')
	.then(categories=>res.json(categories))
	.catch(err => res.status(400).json('error getting category'));
});

category.post('/create', (req,res) => {
	const {blog_category_name, blog_category_desc, seq} = req.body;
  // console.log('req.body',req.body);
  	db('tb_blog_category')
  	.returning(['blog_category_id','blog_category_name','blog_category_desc','seq'])
  	.insert({
	    blog_category_name: blog_category_name,
	    blog_category_desc:blog_category_desc,
	    seq:seq,
	    created_date:new Date(),
	    created_by:'testingUser1',
	    last_updated_date:new Date(),
	    last_updated_by:'testingUser1'
  	})
  	.then(data=>res.json(data))
  	.catch(err => res.status(400).json('error creating category'));
});

category.delete('/delete', (req,res) => {
	const {blog_category_id} = req.body;
	db('tb_blog_category')
	.where('blog_category_id', blog_category_id)
	.del()
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error delete category'));
});

category.post('/search', (req,res) => {
	const{blog_category_name,blog_category_desc} = req.body;
	db.orderBy('blog_category_id','desc')
	.select('blog_category_id','blog_category_name'
		,'blog_category_desc','seq')
	.from('tb_blog_category')
	.where('blog_category_name','~*',blog_category_name)
	.andWhere('blog_category_desc','~*',blog_category_desc)
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error search category'));
});

category.put('/update', (req,res) => {
	const{blog_category_id,blog_category_name,blog_category_desc,seq} = req.body;
	db('tb_blog_category')
	.where('blog_category_id', '=', blog_category_id)
	.update({
		blog_category_name: blog_category_name,
		blog_category_desc: blog_category_desc,
		seq:seq,
		last_updated_date:new Date(),
		last_updated_by:'testingUser1'
	})
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error update category'))
});

module.exports = category;

// const handleCategoryGet =(req,res,db)=>{
// 	db.orderBy('blog_category_id','desc')
// 	.select('blog_category_id','blog_category_name','blog_category_desc','seq')
// 	.from('tb_blog_category')
// 	.then(categories=>res.json(categories))
// 	.catch(err => res.status(400).json('error getting category'));
// }

// const handleCategoryPost =(req,res,db)=>{
//   const {blog_category_name, blog_category_desc, seq} = req.body;
//   // console.log('req.body',req.body);
//   db('tb_blog_category')
//   .returning(['blog_category_id','blog_category_name','blog_category_desc','seq'])
//   .insert({
//     blog_category_name: blog_category_name,
//     blog_category_desc:blog_category_desc,
//     seq:seq,
//     created_date:new Date(),
//     created_by:'testingUser1',
//     last_updated_date:new Date(),
//     last_updated_by:'testingUser1'
//   })
//   .then(data=>res.json(data))
//   .catch(err => res.status(400).json('error creating category'));
// }

// const handleCategoryDelete=(req,res,db)=>{
// 	const {blog_category_id} = req.body;
// 	db('tb_blog_category')
// 	.where('blog_category_id', blog_category_id)
// 	.del()
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error delete category'));
// }

// const handleCategorySearch=(req,res,db)=>{
// 	const{blog_category_name,blog_category_desc} = req.body;
// 	db.orderBy('blog_category_id','desc')
// 	.select('blog_category_id','blog_category_name'
// 		,'blog_category_desc','seq')
// 	.from('tb_blog_category')
// 	.where('blog_category_name','~*',blog_category_name)
// 	.andWhere('blog_category_desc','~*',blog_category_desc)
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error search category'));
// }

// const handleCategoryUpdate=(req,res,db)=>{
// 	const{blog_category_id,blog_category_name,blog_category_desc,seq} = req.body;
// 	db('tb_blog_category')
// 	.where('blog_category_id', '=', blog_category_id)
// 	.update({
// 		blog_category_name: blog_category_name,
// 		blog_category_desc: blog_category_desc,
// 		seq:seq,
// 		last_updated_date:new Date(),
// 		last_updated_by:'testingUser1'
// 	})
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error update category'))
// }


// module.exports = {
//   handleCategoryGet,
//   handleCategoryPost,
//   handleCategoryDelete,
//   handleCategorySearch,
//   handleCategoryUpdate
// }