const handleMenu1Get =(req,res,db) =>{
	db.select('menu_name','seq','menu_path','menu_id')
	.from('tb_menu')
	.where({menu_level:1})
	.then(menu=>res.json(menu))
	.catch(err => res.status(400).json('error getting menu1')); 
}


const handleMenu1Post =(req,res,db)=>{
  const {menu_name, menu_path, seq} = req.body;
  // console.log('req.body',req.body);
  db('tb_menu')
  .returning(['menu_id','menu_name','menu_path','seq'])
  .insert({
  	menu_level: 1,
    menu_name: menu_name,
    menu_path: menu_path,
    seq:seq,
    created_date:new Date(),
    created_by:'testingUser1',
    last_updated_date:new Date(),
    last_updated_by:'testingUser1'
  })
  .then(data=>res.json(data))
  .catch(err => res.status(400).json(err));
}

const handleMenu1Delete=(req,res,db)=>{
	const {menu_id} = req.body;
	db('tb_menu')
	.where('menu_id', menu_id)
	.del()
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error delete menu1'));
}

const handleMenu1Search=(req,res,db)=>{
	const{menu_name,menu_path} = req.body;
	db.orderBy('menu_id','desc')
	.select('menu_id','menu_name'
		,'menu_path','seq')
	.from('tb_menu')
	.where('menu_name','~*',menu_name)
	.andWhere('menu_path','~*',menu_path)
	.andWhere('menu_level','=',1)
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error search menu1'));
}

const handleMenu1Update=(req,res,db)=>{
	const{menu_id,menu_name,menu_path,seq} = req.body;
	db('tb_menu')
	.where('menu_id', '=', menu_id)
	.update({
		menu_name: menu_name,
		menu_path: menu_path,
		seq:seq,
		last_updated_date:new Date(),
		last_updated_by:'testingUser1'
	})
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error update menu1'))
}


module.exports = {
  handleMenu1Get,
  handleMenu1Post,
  handleMenu1Delete,
  handleMenu1Search,
  handleMenu1Update
}
