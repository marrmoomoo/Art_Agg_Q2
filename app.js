const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
app.set('view engine', 'ejs');
const request = require('request');

app.use(express.static('public'));

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile.js')[environment];
const knex = require('knex')(knexConfig);

const bcrypt = require('bcrypt-as-promised');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//user sign up
app.get('/sign_up', function(req, res, next){
  res.render('signup');
});

//post to users table in artagg_ricky_jen database in psql
app.post('/users', function(req, res, next){
  const { username, password, fname, lname, city, state, bio } = req.body;
  bcrypt.hash(password, 8)
  .then(function(hashed_password){
    return knex('users')
    .insert({
      username,
      hashed_password,
      fname,
      lname,
      city,
      state,
      bio
    });
  })
  .then(function(){
    res.redirect('/users');
  });
});

//individual user profile to add behance account(s) and unsplash account(s) and showing behance account(s) and unsplash account(s) that were added
app.get('/users/:id', function(req,res,next){
  const id = req.params.id;
  knex('users')
  .where('id', id)
  .first()
  .then(function(user){
    // console.log("user: "+ user.id);
    knex('behance_accounts')
    .where('user_id', id)
    .then(function(behance_accounts){
      // console.log("behance_accounts: " + behance_accounts);
      knex('unsplash_accounts')
      .where('user_id', id)
      .then(function(unsplash_accounts){
        // console.log("unsplash_accounts: " + unsplash_accounts);
        res.render('user', { user, behance_accounts, unsplash_accounts });
      });
    });
  });
});

//get all users that have been created in artagg
app.get('/users', function(req, res, next){
  knex('users')
  .then(function(users){
    // console.log(users);
    res.render('users', { users });
  });
});


//where all artagg users are posted and links to each user's artagg profile
app.post('/users', function(req, res, next){
  const { username } = req.body
  knex('users')
  .insert({
    username: username
  })
  .then(function(){
    res.redirect('/')
  })
})



//get all of behance user's projects with api
app.get('/behance_users/:user_id/:behance_username', function(req, res, next){
  // const user_id = req.params.user_id;
  const behance_username = req.params.behance_username;
  const api_key = 'pI7aN6iZDrUTg0XgxRj2LkwdTwtryv0N';
  var url = 'https://api.behance.net/v2/users/' + behance_username + '/projects?client_id=' + api_key;
  knex('behance_accounts')
  .where('behance_username', behance_username)
  .then(function(behance_user_projects){
    request(url, function (error, response, body) {
      var response1 = JSON.parse(body);
      behance_user_projects = response1.projects;
      //console.log("this is the response: " + response);
      // console.log(behance_user_projects);
      res.render('behanceuser', { behance_user_projects });
    });
  });
});


//post behance username(s) to artagg user profile page below "add behance account" form
app.post('/users/:id/behance', function(req, res, next){
  const id = req.params.id;
  const { behance_username } = req.body;
  //console.log(req.body);
  knex('behance_accounts')
  .insert({ behance_username: behance_username, user_id: id })
  .then(function(){
    res.redirect('/users/' + id);
  });
});



//get all of unsplash user's projects with api
app.get('/unsplash_users/:user_id/:unsplash_username', function(req, res, next){
  const unsplash_username = req.params.unsplash_username;
  const api_key = '3e40a28541b049505d0cc920ac916af15910897d57faa4cbe81356a9b9b4e519';
  var url = 'https://api.unsplash.com/users/' + unsplash_username + '/photos?client_id=' + api_key;
  knex('unsplash_accounts')
  .where('unsplash_username', unsplash_username)
  .then(function(unsplash_user_collection){
    request(url, function (error, response, body){
      var response = JSON.parse(body);
      unsplash_user_collection = response;
      // console.log("this is the unsplash response:" + response);
      res.render('unsplashuser',
      { unsplash_user_collection });
    });
  });
});


//post unsplash username(s) to artagg user profile page below "add unsplash account" form
app.post('/users/:id/unsplash', function(req, res, next){
  const id = req.params.id;
  const { unsplash_username } = req.body;
  //console.log(req.body);
  knex('unsplash_accounts')
  .insert({ unsplash_username: unsplash_username, user_id: id })
  .then(function(){
    res.redirect('/users/' + id);
  });
});



app.listen(8000, function(){
  console.log('Listening to u discreetly @ 8000');
});
