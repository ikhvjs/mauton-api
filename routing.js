const routing =(app)=>{
	//For testing purpose
	app.get('/',(req, res)=>res.json('Hello World'));
	//Topbar
	app.use('/topbar',require('./routes/topbar'));
	//Sidebar
	app.use('/sidebar',require('./routes/sidebar'));
	//Bloglist
	app.use('/bloglist',require('./routes/bloglist'));
	//Blog
	app.use('/blog',require('./routes/blog'));
	//Category
	app.use('/category',require('./routes/category'));
	//Tag
	app.use('/tag',require('./routes/tag'));
	//Menu1
	app.use('/menu1',require('./routes/menu1'));
	//Menu2
	app.use('/menu2',require('./routes/menu2'));
}

module.exports = routing;