const db = require('../database')
const express = require('express');
const blog = express.Router();

const { validateCreateBlog } = require('../validation/validateBlog/validateCreateBlog');
const { INTERNAL_SERVER_ERROR_BLOG_INSERT,
	INTERNAL_SERVER_ERROR_BLOG_REQUEST,
	INTERNAL_SERVER_ERROR_BLOG_DELETE,
	INTERNAL_SERVER_ERROR_BLOG_UPDATE
} = require('../validation/validationConstants');


blog.post('/request', (req, res) => {
	const { userID, blogID } = req.body;

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
// blog.get('/tag/path/:blogPath', (req, res) => {
// 	const { blogPath } = req.params;

// 	db.select('tt.tag_name'
// 		, 'tt.tag_id')
// 		.from('tb_tag as tt')
// 		.join('tb_blog_tag_link as tbtl', function () {
// 			this.on('tbtl.tag_id', '=', 'tt.tag_id')
// 		})
// 		.join('tb_blog as tb', function () {
// 			this.on('tbtl.blog_id', '=', 'tb.blog_id')
// 				.andOn('tb.blog_path', '=', db.raw('?', [blogPath]))
// 		})
// 		.then(data => res.json(data))
// 		.catch(err => res.status(400).json('error getting tag'));
// });
// blog.get('/category/get', (req, res) => {
// 	db.orderBy('blog_category_id', 'desc')
// 		.select('blog_category_id', 'blog_category_name', 'blog_category_desc', 'seq')
// 		.from('tb_blog_category')
// 		.then(data => res.json(data))
// 		.catch(err => res.status(400).json('error get blog category'));
// });
// blog.post('/category/search', (req, res) => {
// 	const { blog_category_name, blog_category_desc } = req.body;
// 	db.orderBy('blog_category_id', 'desc')
// 		.select('blog_category_id', 'blog_category_name'
// 			, 'blog_category_desc', 'seq')
// 		.from('tb_blog_category')
// 		.where('blog_category_name', '~*', blog_category_name)
// 		.andWhere('blog_category_desc', '~*', blog_category_desc)
// 		.then(data => res.json(data))
// 		.catch(err => res.status(400).json('error search blog category'));
// });
// blog.get('/tag/get', (req, res) => {
// 	db.orderBy('tag_id', 'desc')
// 		.select('tag_id', 'tag_name', 'seq')
// 		.from('tb_tag')
// 		.then(data => res.json(data))
// 		.catch(err => res.status(400).json('error get blog tag'));
// });
// blog.post('/tag/search', (req, res) => {
// 	const { tag_name } = req.body;
// 	db.orderBy('tag_id', 'desc')
// 		.select('tag_id', 'tag_name', 'seq')
// 		.from('tb_tag')
// 		.where('tag_name', '~*', tag_name)
// 		.then(data => res.json(data))
// 		.catch(err => res.status(400).json('error search blog category'));
// });
blog.post('/create', async (req, res) => {
	const { blogTitle, blogCategoryID, blogTag, blogSeq, blogContent, userID, sidebarMenuID } = req.body;

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
	const { blogID, blogTitle, blogCategoryID, blogTag, blogSeq, blogContent, userID, sidebarMenuID } = req.body;

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
	const { blogID, userID } = req.body;



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

// const handleBlogGet =(req,res,db)=>{
// 	const { blogPath } = req.params;

// 	db.select('tb.blog_id',
// 		'tb.blog_title',
// 		'tb.blog_content',
// 		'tb.seq',
// 		'bc.blog_category_name',
// 		'bc.blog_category_id',
// 		'tb.blog_path',
// 		'tb.blog_desc',
// 		'tb.last_updated_date')
// 	.from('tb_blog as tb')
// 	.join('tb_blog_category as bc', function() {
// 		this.on('tb.blog_category_id', '=', 'bc.blog_category_id')
// 	.andOn('tb.blog_path', '=',db.raw('?',[blogPath]))
// 	})
// 	.then(blog => {
// 		// console.log('blog',blog[0]);

// 		return db.select(
// 				'tt.tag_id',
// 				'tt.tag_name')
// 			.from('tb_tag as tt')
// 			.join('tb_blog_tag_link as tbtl', function(){
// 				this.on('tbtl.blog_id','=',blog[0].blog_id)
// 				.andOn('tbtl.tag_id','=','tt.tag_id')
// 			})
// 			.then(tags => {
// 	            // console.log('tags',tags);
// 	            Object.assign(blog[0],{tags:[...tags]})
// 	         	return blog;
// 	        })
// 	        ;


//     })
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error getting blog'));
// }



// const handleBlogTagGetByBlogPath = (req,res,db) =>{
// 	const { blogPath } = req.params;

// 	db.select('tt.tag_name'
// 			,'tt.tag_id')
// 	.from('tb_tag as tt')
// 	.join('tb_blog_tag_link as tbtl', function(){
// 		this.on('tbtl.tag_id','=','tt.tag_id')
// 	})
// 	.join('tb_blog as tb', function(){
// 		this.on('tbtl.blog_id','=','tb.blog_id')
// 		.andOn('tb.blog_path','=',db.raw('?',[blogPath]))
// 	})
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error getting tag'));

// }

// const handleBlogCategoryGet = (req,res,db) =>{
// 	db.orderBy('blog_category_id','desc')
// 	.select('blog_category_id','blog_category_name','blog_category_desc','seq')
// 	.from('tb_blog_category')
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error get blog category'));
// }

// const handleBlogCategorySearch=(req,res,db)=>{
// 	const{blog_category_name,blog_category_desc} = req.body;
// 	db.orderBy('blog_category_id','desc')
// 	.select('blog_category_id','blog_category_name'
// 		,'blog_category_desc','seq')
// 	.from('tb_blog_category')
// 	.where('blog_category_name','~*',blog_category_name)
// 	.andWhere('blog_category_desc','~*',blog_category_desc)
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error search blog category'));
// }

// const handleBlogTagGet = (req,res,db) =>{
// 	db.orderBy('tag_id','desc')
// 	.select('tag_id','tag_name','seq')
// 	.from('tb_tag')
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error get blog tag'));
// }

// const handleBlogTagSearch=(req,res,db)=>{
// 	const{tag_name} = req.body;
// 	db.orderBy('tag_id','desc')
// 	.select('tag_id','tag_name','seq')
// 	.from('tb_tag')
// 	.where('tag_name','~*',tag_name)
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error search blog category'));
// }

// const handleBlogPost =(req,res,db)=>{
// 	const newBlog = req.body;
// 	console.log('newBlog',newBlog);

// 	db.transaction(trx => {
//     	trx.select('menu_id')
//     	.from('tb_menu')
//     	.where('menu_path','=',newBlog.menu_path)
//       // .then(menu_id => console.log('menu_id',menu_id[0].menu_id))
//     	.then(menu_id=>{
//       		// console.log('menu_id',menu_id[0].menu_id);
//       	 	return trx('tb_blog')
//       	 		.returning('blog_id')
//       			.insert({
// 	      			menu_id: menu_id[0].menu_id,
// 	      			blog_title: newBlog.blog_title,
// 	      			blog_desc: newBlog.blog_desc,
// 	      			blog_path: newBlog.blog_path,
// 	      			blog_category_id: newBlog.blog_category_id,
// 	      			seq: newBlog.seq,
// 	      			blog_content: newBlog.blog_content,
// 	      			created_date:new Date(),
// 				    created_by:'testingUser1',
// 				    last_updated_date:new Date(),
// 				    last_updated_by:'testingUser1'
// 	      		})
// 	      		.then(data=>{
// 	      			// console.log('blog_id',blog_id[0]);

//       				const promises = newBlog.tags.map((tag,index)=>{
//       					// console.log('tag',tag);
//       					return trx('tb_blog_tag_link')
//       					.returning('blog_tag_link_id')
// 	      				.insert({
// 	      					blog_id: data[0],
// 	      					tag_id: Number(tag.tag_id),
// 	      					created_date:new Date(),
// 						    created_by:'testingUser1',
// 						    last_updated_date:new Date(),
// 						    last_updated_by:'testingUser1'
// 	      				})
// 	      				.then(data => {
// 				            // console.log('tag_link_id',tag_link_id[0]);
// 				         	return data[0];
// 				         })	

//       				})
//       				return Promise.all(promises);
//       			})

//     	})
//     	.then(data=>{
// 			// console.log('data',data);
// 			res.json(data);
// 		})
//     	.then(trx.commit)
//     	.catch(trx.rollback)

//     })
//     .catch(err => res.status(400).json(err))
// }


// const handleBlogUpdate =(req,res,db)=>{
// 	const{ updateBlog } = req.body;
// 	console.log('updateBlog',updateBlog);


// 	db.transaction(trx => {
//     	trx('tb_blog')
//   		.where({ blog_id: updateBlog.blog_id })
//   		.update({ 	blog_title: updateBlog.blog_title,
// 	      			blog_desc: updateBlog.blog_desc,
// 	      			blog_path: updateBlog.blog_path,
// 	      			blog_category_id: updateBlog.blog_category_id,
// 	      			seq: updateBlog.seq,
// 	      			blog_content: updateBlog.blog_content,
// 				    last_updated_date:new Date(),
// 				    last_updated_by:'testingUser1' 
//   		}, ['blog_id'])
//   		.then( data => {
//   			let blog_id = data[0].blog_id;
//   			// console.log('blog_id',blog_id);
//   			return trx('tb_blog_tag_link')
// 		  	.where('blog_id', blog_id)
// 		 	.del()
//   		})
//   		.then(data=>{
//   			// console.log('deleted row', data)
//   			const promises = updateBlog.tags.map((tag)=>{
// 				// console.log('tag',tag);
// 				return trx('tb_blog_tag_link')
// 				.returning('blog_tag_link_id')
// 				.insert({
// 					blog_id: updateBlog.blog_id,
// 					tag_id: tag.tag_id,
// 					created_date:new Date(),
// 				    created_by:'testingUser1',
// 				    last_updated_date:new Date(),
// 				    last_updated_by:'testingUser1'
// 				})
// 				.then(data => {
// 	         		return data[0];
// 	         	})
// 			})

//   			return Promise.all(promises);

//   		})
//   		.then(data=>{
//       				// console.log('data',data);
// 					res.json(data);
// 				})
//   		.then(trx.commit)
//       	.catch(trx.rollback)

//   	})
//   	.catch(err => res.status(400).json(err))

// }

// const handleBlogDelete =(req,res,db)=>{
// 	const{ blog_id } = req.body;
// 	console.log('blog_id',blog_id);


// 	db.transaction(trx => {
//     	trx('tb_blog_tag_link')
//   		.where( 'blog_id', blog_id )
//   		.del()
//   		.then( data => {
//   			return trx('tb_blog')
// 		  	.where('blog_id', blog_id)
// 		 	.del()
//   		})
//   		.then(data=>{
// 				res.json(data);
// 		})
//   		.then(trx.commit)
//       	.catch(trx.rollback)

//   	})
//   	.catch(err => res.status(400).json(err))

// }




// module.exports = {
//   handleBlogGet,
//   handleBlogTagGetByBlogPath,
//   handleBlogCategoryGet,
//   handleBlogCategorySearch,
//   handleBlogTagGet,
//   handleBlogTagSearch,
//   handleBlogPost,
//   handleBlogUpdate,
//   handleBlogDelete
// }

