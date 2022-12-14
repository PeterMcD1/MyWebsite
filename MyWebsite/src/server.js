/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
const axios = require('axios');
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
module.exports = app;

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);


// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

app.get('/', function(req,res) {
  res.redirect('/main');
});



app.get('/main',function(req,res){
  res.render('pages/main', {
    title:'Main',
    address: '/main'
  });
})

app.post('/main/addsearch', function(req,res){
  console.log(req.body.drinkName);
  var drinkName = req.body.drinkName
  var ing1 = req.body.drinkIngredient1
  var ing2 = req.body.drinkIngredient2
  var ing3 = req.body.drinkIngredient3
  var instruct = req.body.drinkInstructions

  var query = `INSERT INTO drinks(drinkName, drinkIng1, drinkIng2, drinkIng3, drinkInstruct) VALUES('${drinkName}','${ing1}','${ing2}','${ing3}','${instruct}');`
  db.any(query)
  .then(data =>{
    res.redirect('/main');
  })
  .catch(err =>{
    console.log(err);
    alert("error");
  })

})

app.get('/searches', function(req, res) {
  var query = `SELECT * FROM drinks;`;
  db.task('get-everything', task => {
    return task.batch([
      task.any(query)
    ]);
  })
  .then(item=>{
    console.log(item)
    res.render('pages/searches',{
      title:'Searches',
      address:'/searches',
      drinkName: item[0],
      drinkIng1: item[1],
      drinkIng2: item[2],
      drinkIng3: item[3],
      drinkInstruct: item[4],
    })
  })
  .catch(err => {
		console.log('error', err);
		res.render('pages/searches', {
			title: 'Searches',
			address: '/searches',
			drinkName: '',
			drinkIng1: '',
			drinkIng2: '',
			drinkIng3: '',
			drinkInstruct: ''
		})
	});
});

app.get('/website',function(req,res){
  res.render('pages/website', {
    title:'Website',
    address: '/website'
  });
})

app.get('/chess',function(req,res){
  res.render('pages/chess', {
    title:'Chess',
    address: '/chess'
  });
})

app.get('/api',function(req,res){
  res.render('pages/api', {
    title:'API Website',
    address: '/api'
  });
})



const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running ??? PORT ${server.address().port}`);
});
