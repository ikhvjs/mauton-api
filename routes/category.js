const db = require('../database')
const express = require('express');
const category = express.Router();
const { validateCreateCategory } = require('../validation/validateCategory/validateCreateCategory'); 
const { validateDeleteCategory } = require('../validation/validateCategory/validateDeleteCategory'); 
const {	INTERNAL_SERVER_ERROR_CATEGORY_REQUEST,
		INTERNAL_SERVER_ERROR_CATEGORY_SEARCH,
		INTERNAL_SERVER_ERROR_CATEGORY_CREATE,
		INTERNAL_SERVER_ERROR_CATEGORY_DELETE
}  = require('../validation/validationConstants');

category.post('/request', (req,res) => {
	const {userID} = req.body;

	db.orderBy('blog_category_id','desc')
	.select('blog_category_id','blog_category_name','blog_category_desc','seq')
	.from('tb_blog_category')
	.where('user_id', userID)
	.then(ctgs=>res.status(200).json(ctgs))
	.catch(() => res.status(500).json(
		{Code:INTERNAL_SERVER_ERROR_CATEGORY_REQUEST,
			errMessage:'Internal Server Error, please click Search button to try again'})
	);
});

category.post('/create', async (req,res) => {
	const {categoryName, categoryDesc, seq, userID} = req.body;

	const validationResult = await validateCreateCategory(categoryName, categoryDesc, seq, userID);

	if (await validationResult.Status !== 200){
		return res.status(validationResult.Status).send({
			Code:validationResult.Code,
			errMessage:validationResult.errMessage
		});
	}

  	db('tb_blog_category')
  	// .returning(['blog_category_id','blog_category_name','blog_category_desc','seq'])
  	.insert({
	    blog_category_name: categoryName,
	    blog_category_desc:categoryDesc,
		seq:seq,
		user_id:userID,
	    created_date:new Date(),
	    created_by:userID,
	    last_updated_date:new Date(),
	    last_updated_by:userID
  	})
  	.then(result=>res.json(`command:${result.command},rowCount:${result.rowCount}`))
  	.catch(() => res.status(500).json(
		{Code:INTERNAL_SERVER_ERROR_CATEGORY_CREATE,
			errMessage:'Internal Server Error, please try again'})
	);
});

category.delete('/delete', async (req,res) => {
	const {categoryID,userID} = req.body;

	const validationResult = await validateDeleteCategory(categoryID,userID);

	if (await validationResult.Status !== 200){
		return res.status(validationResult.Status).send({
			Code:validationResult.Code,
			errMessage:validationResult.errMessage
		});
	}

	db('tb_blog_category')
	.where('blog_category_id', categoryID)
	.andWhere('user_id',userID)
	.del()
	.then(data=>res.json(data))
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_CATEGORY_DELETE,
		errMessage: 'Internal Server Error, please try again' 
	})));
});

category.post('/search', (req,res) => {
	const{categoryName,categoryDesc,userID} = req.body;
	db.orderBy('blog_category_id','desc')
	.select('blog_category_id','blog_category_name'
		,'blog_category_desc','seq')
	.from('tb_blog_category')
	.where('blog_category_name','~*',categoryName)
	.andWhere('blog_category_desc','~*',categoryDesc)
	.andWhere('user_id','=',userID)
	.then(data=>res.status(200).json(data))
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_CATEGORY_SEARCH,
		errMessage: 'Internal Server Error, please try again' 
	})));
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