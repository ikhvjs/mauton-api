const env = process.env.NODE_ENV || "dev"

const configs = {
    base: {
        env,
        tokenExpiredTime : 2000, //in seconds
		secret: "secretKey for sessions",
		captchaSecret: "ss",
    },
    dev: {
    	port:3001,
        database:{
		  	client: 'pg',
		  	connection: {
			    host : '127.0.0.1',
			    user : 'postgres',
			    password : '123a123a',
			    database : 'books'
		  	}
		}

    },
    prod: {
    	port:process.env.PORT,
        database:{
		  	client: 'pg',
		  	connection: {
		    	connectionString : process.env.DATABASE_URL,
			    ssl: {
			    	rejectUnauthorized: false
			  	}
  			}
		}
    }
};

const config = Object.assign(configs.base, configs[env]);

module.exports= config;