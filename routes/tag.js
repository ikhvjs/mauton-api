const db = require('../database')
const express = require('express');
const tag = express.Router();
const { validateCreateTag } = require('../validation/validateTag/validateCreateTag'); 
const { validateDeleteTag } = require('../validation/validateTag/validateDeleteTag'); 
const { validateUpdateTag } = require('../validation/validateTag/validateUpdateTag'); 
const {  	INTERNAL_SERVER_ERROR_TAG_INSERT,
			INTERNAL_SERVER_ERROR_TAG_REQUEST,
			INTERNAL_SERVER_ERROR_TAG_SEARCH,
			INTERNAL_SERVER_ERROR_TAG_DELETE,
			INTERNAL_SERVER_ERROR_TAG_UPDATE
}  = require('../validation/validationConstants');

tag.post('/request', (req,res) => {
	const {userID} = req.body;
	db.orderBy('tag_id','desc')
	.select('tag_id','tag_name','seq')
	.from('tb_tag')
	.where('user_id', userID)
	.then(tags=>res.json(tags))
	.catch(() => res.status(500).json(
		{Code:INTERNAL_SERVER_ERROR_TAG_REQUEST,
			errMessage:'Internal Server Error, please click Search button to try again'})
	);
});

tag.post('/create', async (req,res) => {
	const {tagName,seq,userID} = req.body;

	const validationResult = await validateCreateTag(tagName,seq,userID);

	if (await validationResult.Status !== 200){
		return res.status(validationResult.Status).send({
			Code:validationResult.Code,
			errMessage:validationResult.errMessage
		});
	}

	db('tb_tag')
  	.insert({
    	tag_name: tagName,
	    seq:seq,
	    created_date:new Date(),
	    created_by:userID,
	    last_updated_date:new Date(),
		last_updated_by:userID,
		user_id:userID
  	})
  	.then(result=>{
		  res.status(200).json(`command:${result.command},rowCount:${result.rowCount}`);
	})
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_TAG_INSERT,
		errMessage: 'Internal Server Error, please try again' 
	})));
	// .catch(err => {
	// 	console.log('tag create err',err);
	// 	res.status(400).json('error creating tag');
	// });
});

tag.delete('/delete', async (req,res) => {
	const {tagID, userID} = req.body;

	const validationResult = await validateDeleteTag(tagID);

	if (await validationResult.Status !== 200){
		return res.status(validationResult.Status).send({
			Code:validationResult.Code,
			errMessage:validationResult.errMessage
		});
	}

	db('tb_tag')
	.where('tag_id', tagID)
	.andWhere('user_id',userID)
	.del()
	.then(data=>res.json(data))
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_TAG_DELETE,
		errMessage: 'Internal Server Error, please try again' 
	})));
});
tag.post('/search', (req,res) => {
	const{tagName, userID} = req.body;
	db.orderBy('tag_id','desc')
	.select('tag_id','tag_name','seq')
	.from('tb_tag')
	.where('tag_name','~*',tagName)
	.andWhere('user_id','=',userID)
	.then(tags=>res.status(200).json(tags))
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_TAG_SEARCH,
		errMessage: 'Internal Server Error, please try again' 
	})));
	// .catch(err => res.status(400).json('error search tag'));
});
tag.put('/update', async (req,res) => {
	const {tagID,tagName,seq,userID} = req.body;

	const validationResult = await validateUpdateTag(tagID,tagName,seq,userID);

	if (await validationResult.Status !== 200){
		return res.status(validationResult.Status).send({
			Code:validationResult.Code,
			errMessage:validationResult.errMessage
		});
	}
	db('tb_tag')
	.where('tag_id', '=', tagID)
	.andWhere('user_id','=',userID)
	.update({
		tag_name: tagName,
		seq:seq,
		last_updated_date:new Date(),
		last_updated_by:userID
	})
	.then(result=>{
		res.status(200).json(result);
	})
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_TAG_UPDATE,
		errMessage: 'Internal Server Error, please try again' 
	})));
	// .then(data=>res.json(data))
	// .catch(err => res.status(400).json('error update tag'))
});

module.exports = tag