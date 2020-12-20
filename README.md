# mauton-api :octocat: [![GitHub](https://img.shields.io/github/license/ikhvjs/mauton-api)](https://github.com/ikhvjs/mauton-api/blob/master/README.md)
mauton-api is backend for [mauton](https://github.com/ikhvjs/mauton)


## Getting Started 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites 📋

You'll need:
* [Git](https://git-scm.com) 
* [Node.js](https://nodejs.org/en/download/) (which comes with [NPM](http://npmjs.com)) installed on your computer.
* [PostgreSQL](https://www.postgresql.org/) (Advanced Open Source Relational Database)
* [DBeaver](https://dbeaver.io/download/) (which is free and open source universal database tool) 

```
node@v10.16.0 or higher
npm@6.9.0 or higher
git@2.17.1 or higher
postgreSQL@12.3 or higher
```

**NOTE**:
When you register your reCAPTCHA Key, remember to set domain for your reCAPTCHA same as your frontend in the google reCAPTCHA website.

## How To Use 🔧

From your DBeaver, Create a DB $YOUR_DB_NAME and run the [sql](https://github.com/ikhvjs/mauton-api-deployment/blob/main/mauton-api-sql.sql)


From your command line, clone mauton-api:

```bash
# Clone this repository
$ git clone https://github.com/ikhvjs/mauton-api.git

# Go into the repository
$ cd mauton-api

# Remove current origin repository
$ git remote remove origin
```

Then change your ```config.js``` file for your DB details.
```js
dev: {
    	port:3001,
        database:{
		  	client: 'pg',
		  	connection: {
			    host : '127.0.0.1',
			    user : 'postgres',
			    password : 'your password',
			    database : '$YOUR_DB_NAME'
		  	}
		}

    },
```

Then you can install the dependencies either using NPM:

Using NPM:
```bash
# Install dependencies
$ npm install

# Start development server
$ npm run start:dev
```

Once your server has started, go to this url `http://localhost:3001/` and you will see the website running on a Development Server. You can change your port in ```config.js```


## Deployment 📦

Once you have done with your setup. You need to put your website online!
I highly recommend to use [Heroku](https://heroku.com) to achieve this on the EASIEST WAY

**[Read MY Deployment Procedures](https://github.com/ikhvjs/mauton-api-deployment)**

## Technologies used 🛠️

- [Expressjs](https://expressjs.com/) - Express, is a back end web application framework for Node.js
- [JWT](https://jwt.io/) - JSON Web Token (JWT) is a compact URL-safe means of representing claims to be transferred between two parties
- [PostgreSQL](https://www.postgresql.org/) (Advanced Open Source Relational Database)

## Authors

- **Jason Tam** - [https://github.com/ikhvjs](https://github.com/ikhvjs)

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments 🎁
* Hat tip to anyone whose code was used
