
var getCurrentUser = function(){

      var retrievedObject = localStorage.getItem('currentUserObject');
      console.log('retrievedObject: ', JSON.parse(retrievedObject).email);

      currentUser = JSON.parse(retrievedObject);

      return currentUser;
}
var logout = function(){
    console.log('User : '+firebase.auth().currentUser.email);
    firebase.auth().signOut();
    console.log('Successfully logged out');
}

/*var isRegistered = function(uid) //function to check user is registered or not only after login
{
    var database=firebase.database();
    var users = database.ref('Users').orderByKey().equalTo(uid);
    var match=false;
    users.on('value',function(snapshot){
      snapshot.forEach(function(childSnapshot)   //To fetch all user_id(key values) under users
      {
          console.log(childSnapshot.val().email+ ' is successfully registered');
          match = true;
      });
          console.log('Match : '+match);
          if(!match){
                window.location = 'register.html';
          }
    }
  );
}*/


firebase.auth().onAuthStateChanged(function(user){
        if(user){
            //sessionStorage.email = user.email;
            console.log(user.email+' user logged in');
        //    isRegistered(user.uid);
        }
        else{
            console.log('Redirect user to login page');
            localStorage.removeItem('email');
            window.location = 'index.html';
        }
});
