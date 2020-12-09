const db = require('../database')
const express = require('express');
const category = express.Router();
const { validateCreateCategory } = require('../validation/validateCategory/validateCreateCategory');
const { validateDeleteCategory } = require('../validation/validateCategory/validateDeleteCategory');
const { validateUpdateCategory } = require('../validation/validateCategory/validateUpdateCategory');
const { INTERNAL_SERVER_ERROR_CATEGORY_REQUEST,
	INTERNAL_SERVER_ERROR_CATEGORY_SEARCH,
	INTERNAL_SERVER_ERROR_CATEGORY_CREATE,
	INTERNAL_SERVER_ERROR_CATEGORY_DELETE,
	INTERNAL_SERVER_ERROR_CATEGORY_UPDATE
} = require('../validation/validationConstants');

category.post('/request', (req, res) => {
	const { userID } = req.user;

	db.orderBy('blog_category_id', 'desc')
		.select('blog_category_id', 'blog_category_name', 'blog_category_desc', 'seq')
		.from('tb_blog_category')
		.where('user_id', userID)
		.then(ctgs => res.status(200).json(ctgs))
		.catch((err) => {
			console.log(err);
			res.status(500).json(
				{
					Code: INTERNAL_SERVER_ERROR_CATEGORY_REQUEST,
					errMessage: 'Internal Server Error, please click Search button to try again'
				});
		});
});

category.post('/create', async (req, res) => {
	const { categoryName, categoryDesc, seq } = req.body;
	const { userID } = req.user;
	const validationResult = await validateCreateCategory(categoryName, categoryDesc, seq, userID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}

	db('tb_blog_category')
		.insert({
			blog_category_name: categoryName,
			blog_category_desc: categoryDesc,
			seq: seq,
			user_id: userID,
			created_date: new Date(),
			created_by: userID,
			last_updated_date: new Date(),
			last_updated_by: userID
		})
		.then(result => res.json(`command:${result.command},rowCount:${result.rowCount}`))
		.catch((err) => {
			console.log(err);
			res.status(500).json(
				{
					Code: INTERNAL_SERVER_ERROR_CATEGORY_CREATE,
					errMessage: 'Internal Server Error, please try again'
				});
		});
});

category.delete('/delete', async (req, res) => {
	const { categoryID } = req.body;
	const { userID } = req.user;
	const validationResult = await validateDeleteCategory(categoryID, userID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}

	db('tb_blog_category')
		.where('blog_category_id', categoryID)
		.andWhere('user_id', userID)
		.del()
		.then(data => res.json(data))
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_CATEGORY_DELETE,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});

category.post('/search', (req, res) => {
	const { categoryName, categoryDesc } = req.body;
	const { userID } = req.user;
	db.orderBy('blog_category_id', 'desc')
		.select('blog_category_id', 'blog_category_name'
			, 'blog_category_desc', 'seq')
		.from('tb_blog_category')
		.where('blog_category_name', '~*', categoryName)
		.andWhere('blog_category_desc', '~*', categoryDesc)
		.andWhere('user_id', '=', userID)
		.then(data => res.status(200).json(data))
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_CATEGORY_SEARCH,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});

category.put('/update', async (req, res) => {
	const { categoryID, categoryName, categoryDesc, seq } = req.body;
	const { userID } = req.user;
	const validationResult
		= await validateUpdateCategory(categoryID,
			categoryName,
			categoryDesc,
			seq,
			userID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}

	db('tb_blog_category')
		.where('blog_category_id', '=', categoryID)
		.update({
			blog_category_name: categoryName,
			blog_category_desc: categoryDesc,
			seq: seq,
			last_updated_date: new Date(),
			last_updated_by: userID
		})
		.then(result => {
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_CATEGORY_UPDATE,
				errMessage: 'Internal Server Error, please try again'
			});
		}
		);
});

module.exports = category;