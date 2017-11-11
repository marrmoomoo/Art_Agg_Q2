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

app.get('/unsplash', function(req, res, next){
  knex('users').then(function(users){
  console.log(users);
  var unsplash = [];
  var openRequest = users.length;
  const api_key = '3e40a28541b049505d0cc920ac916af15910897d57faa4cbe81356a9b9b4e519';
  for (var i = 0; i < users.length; i++){
    var url = 'https://api.unsplash.com/users/'+users[i].username+'/?client_id='+api_key;
    request(url, function (error, response, body) {
      console.log("THis is the body: "+body);
      var response = JSON.parse(body);
      console.log("THis is the body[0].id: "+body[0].id);
      unsplash = unsplash.concat(response);
      console.log("!!!!!!!!!!!!"+unsplash[0].id);
      openRequest -= 1;
      if (openRequest === 0){

        res.render('unsplash', { unsplash });
      }
    });
  }
  //console.log(unsplash);
  });
});

//post behance username(s) to artagg user profile page below "add behance account" form
app.post('/users/:id', function(req, res, next){
  const id = req.params.id;
  const { behance_username } = req.body;
  //console.log(req.body);
  knex('behance_accounts')
  .insert({ behance_username: behance_username, user_id: id })
  .then(function(){
    res.redirect('/users/' + id)
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
    res.redirect('/users/' + id)
  });
});


app.get('/behance_users/:user_id/:behance_username', function(req, res, next){
  // const user_id = req.params.user_id;
  const behance_username = req.params.behance_username;
  const api_key = 'pI7aN6iZDrUTg0XgxRj2LkwdTwtryv0N';
  var url = 'https://api.behance.net/v2/users/' + behance_username + '/projects?client_id=' + api_key;
  // console.log(url);
  knex('behance_accounts')
  .where('behance_username', behance_username)
  .then(function(behance_user_projects){
    request(url, function (error, response, body) {
      var response = JSON.parse(body);
      behance_user_projects = response.projects;
      console.log(behance_user_projects);
      res.render('behanceuser', { behance_user_projects });
    });
  });
});



app.get('/alluserprojects', function(req, res, next){
  knex('users').then(function(users){
  console.log(users);
  var alluserprojects = [];
  var openRequest = users.length;
  const api_key = 'pI7aN6iZDrUTg0XgxRj2LkwdTwtryv0N';
  for (var i = 0; i < users.length; i++){
    var url = 'https://api.behance.net/v2/users/'+users[i].username+'/projects?client_id='+api_key;
    request(url, function (error, response, body) {
      var response = JSON.parse(body);
      var projects = response.projects;
      //console.log(projects);
      alluserprojects = alluserprojects.concat(projects);
      openRequest -= 1;
      if (openRequest === 0){
        //console.log(alluserprojects);
        res.render('alluserprojects', { alluserprojects });
      }
    });
  }
  //console.log(alluserprojects);
  });
});
