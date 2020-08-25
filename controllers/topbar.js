const handleTopbarGet = (req,res,db) => {
	db.select('menu_name','seq','menu_path','menu_id')
	.from('tb_menu')
	.where({menu_level:1})
	.then(menu=>res.json(menu))
	.catch(err => res.status(400).json('error getting menu')); 
}

module.exports = {
  handleTopbarGet
}