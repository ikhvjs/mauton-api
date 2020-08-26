const handleMenu2Get =(req,res,db) =>{

	db.orderBy('tm1.menu_id','desc')
	.select('tm1.menu_id','tm1.menu_name','tm1.seq',
		'tm1.menu_path','tm2.menu_name as parent_menu_name')
	.from('tb_menu as tm1')
	.join('tb_menu as tm2', function() {
		this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
		.andOn('tm1.menu_level', '=',2)
	})
	.then(menu=>res.json(menu))
	.catch(err => res.status(400).json('err in getting menu2')); 
}


const handleMenu2Post =(req,res,db)=>{
  const {menu_name, menu_path, seq, parent_menu_id} = req.body;
  db('tb_menu')
  .insert({
  	menu_level: 2,
    menu_name: menu_name,
    menu_path: menu_path,
    seq:seq,
    parent_menu_id:parent_menu_id,
    created_date:new Date(),
    created_by:'testingUser1',
    last_updated_date:new Date(),
    last_updated_by:'testingUser1'
  })
  .then(data=>res.json(data))
  .catch(err => res.status(400).json(err));
}

const handleMenu2Delete=(req,res,db)=>{
	const {menu_id} = req.body;
	db('tb_menu')
	.where('menu_id', menu_id)
	.del()
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error delete menu2'));
}

const handleMenu2Search=(req,res,db)=>{
	const{menu_name,menu_path} = req.body;
	db.orderBy('menu_id','desc')
	.select('menu_id','menu_name'
		,'menu_path','seq')
	.from('tb_menu')
	.where('menu_name','~*',menu_name)
	.andWhere('menu_path','~*',menu_path)
	.andWhere('menu_level','=',2)
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error search menu2'));
}

const handleMenu2Update=(req,res,db)=>{
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
	.catch(err => res.status(400).json('error update menu2'))
}


module.exports = {
  handleMenu2Get,
  handleMenu2Post,
  handleMenu2Delete,
  handleMenu2Search,
  handleMenu2Update
}
