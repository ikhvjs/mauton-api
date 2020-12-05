const db = require('../database')
const express = require('express');
const blog = express.Router();

const { validateCreateBlog } = require('../validation/validateBlog/validateCreateBlog');
const { validateUpdateBlog } = require('../validation/validateBlog/validateUpdateBlog');
const { INTERNAL_SERVER_ERROR_BLOG_INSERT,
	INTERNAL_SERVER_ERROR_BLOG_REQUEST,
	INTERNAL_SERVER_ERROR_BLOG_DELETE,
	INTERNAL_SERVER_ERROR_BLOG_UPDATE
} = require('../validation/validationConstants');


blog.post('/request', (req, res) => {
	const { blogID } = req.body;
	const { userID } = req.user;

	db.select('tb.blog_id',
		'tb.blog_title',
		'tb.blog_content',
		'tb.seq',
		'bc.blog_category_name',
		'bc.blog_category_id',
		'tb.last_updated_date')
		.from('tb_blog as tb')
		.join('tb_blog_category as bc', function () {
			this.on('tb.blog_category_id', '=', 'bc.blog_category_id')
				.andOn('tb.blog_id', '=', db.raw('?', [blogID]))
				.andOn('tb.user_id', '=', db.raw('?', [userID]))
		})
		.then(blog => {
			// console.log('blog',blog[0]);

			return db.select(
				'tt.tag_id',
				'tt.tag_name')
				.from('tb_tag as tt')
				.join('tb_blog_tag_link as tbtl', function () {
					this.on('tbtl.blog_id', '=', blog[0].blog_id)
						.andOn('tbtl.tag_id', '=', 'tt.tag_id')
				})
				.then(tags => {
					// console.log('tags',tags);
					Object.assign(blog[0], { tags: [...tags] })
					return blog;
				})
				;

		})
		.then(blog => res.status(200).json(blog[0]))
		.catch(() => res.status(500).json(
			{
				Code: INTERNAL_SERVER_ERROR_BLOG_REQUEST,
				errMessage: 'Internal Server Error, please try again'
			})
		);
});
blog.post('/create', async (req, res) => {
	const { blogTitle, blogCategoryID, blogTag, blogSeq, blogContent,  sidebarMenuID } = req.body;
	const { userID } = req.user;
	const validationResult = await validateCreateBlog(blogTitle,
		blogCategoryID,
		blogTag,
		blogSeq,
		userID,
		sidebarMenuID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}

	db.transaction(trx => {
		trx('tb_blog')
			.returning('blog_id')
			.insert({
				menu_id: sidebarMenuID,
				blog_title: blogTitle,
				blog_category_id: blogCategoryID,
				seq: blogSeq,
				blog_content: blogContent,
				user_id: userID,
				created_date: new Date(),
				created_by: userID,
				last_updated_date: new Date(),
				last_updated_by: userID
			})
			.then(data => {
				// console.log('blog_id',blog_id[0]);

				const promises = blogTag.map((tag) => {
					// console.log('tag',tag);
					return trx('tb_blog_tag_link')
						.returning('blog_tag_link_id')
						.insert({
							blog_id: data[0],
							tag_id: Number(tag.value),
							created_date: new Date(),
							created_by: userID,
							last_updated_date: new Date(),
							last_updated_by: userID
						})
						.then(data => {
							// console.log('tag_link_id',tag_link_id[0]);
							return data[0];
						})

				})
				return Promise.all(promises);
			})
			.then(() => {
				// console.log({ result });
				res.status(200).json(`created blog successfully`);
			})
			.then(trx.commit)
			.catch(trx.rollback)

	})
		.catch((err) => {
			console.log(err);
			(res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_BLOG_INSERT,
				errMessage: 'Internal Server Error, please try again'
			}));
		}
		);
});
blog.put('/update', async (req, res) => {
	const { blogID, blogTitle, blogCategoryID, blogTag, blogSeq, blogContent, sidebarMenuID } = req.body;
	const { userID } = req.user;
	const validationResult = await validateUpdateBlog(
													blogID,
													blogTitle,
													blogCategoryID,
													blogTag,
													blogSeq,
													userID,
													sidebarMenuID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}
	db.transaction(trx => {
		trx('tb_blog')
			.where({ blog_id: blogID })
			.update({
				blog_title: blogTitle,
				blog_category_id: blogCategoryID,
				seq: blogSeq,
				blog_content: blogContent,
				user_id: userID,
				last_updated_date: new Date(),
				last_updated_by: userID
			}, ['blog_id'])
			.then(() => {
				return trx('tb_blog_tag_link')
					.where('blog_id', blogID)
					.del()
			})
			.then(() => {
				const promises = blogTag.map((tag) => {
					// console.log('tag',tag);
					return trx('tb_blog_tag_link')
						.returning('blog_tag_link_id')
						.insert({
							blog_id: blogID,
							tag_id: tag.tag_id,
							created_date: new Date(),
							created_by: userID,
							last_updated_date: new Date(),
							last_updated_by: userID
						})
						.then(data => {
							return data[0];
						})
				})

				return Promise.all(promises);

			})
			.then(() => {
				// console.log('data',data);
				res.status(200).json(`updated blog successfully`);
			})
			.then(trx.commit)
			.catch(trx.rollback)

	})
		.catch((err) => {
			console.log(err);
			(res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_BLOG_UPDATE,
				errMessage: 'Internal Server Error, please try again'
			}));
		}
		);
});
blog.delete('/delete', (req, res) => {
	const { blogID } = req.body;
	const { userID } = req.user;

	db.transaction(trx => {
		trx('tb_blog_tag_link')
			.where('blog_id', blogID)
			.del()
			.then(() => {
				return trx('tb_blog')
					.where({
						'blog_id': blogID,
						'user_id': userID
					})
					.del()
			})
			.then(data => {
				res.status(200).json(data);
			})
			.then(trx.commit)
			.catch(trx.rollback)

	})
		.catch(() => (res.status(500).send({
			Code: INTERNAL_SERVER_ERROR_BLOG_DELETE,
			errMessage: 'Internal Server Error, please try again'
		})));
});


module.exports = blog;