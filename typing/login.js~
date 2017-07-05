var model = {
      login : function(email,password)
               {
                  if (!firebase.auth().currentUser)
                  {
                                  model.loginWithoutCheck(email,password);
                   }else{
                                  console.log('Already logged in : '+firebase.auth().currentUser);
                                  model.logout();
                                  model.loginWithoutCheck(email,password);
                   }
              },
      loginWithoutCheck : function(email,password){
                    firebase.auth().signInWithEmailAndPassword(email, password)
                         .then(function(firebaseUser)
                          {
                                console.log('Login successful'+firebaseUser.email);
                                presenter.loginSuccess(firebaseUser);
                          })
                         .catch(function(error) // Handle Errors here.
                         {
                                 console.log('login error'+error.message);
                                 presenter.loginError(error.message);
                         });
      },
      logout : function()
              {
                  console.log('User : '+firebase.auth().currentUser.email);
                  firebase.auth().signOut();
                  console.log('Successfully logged out');
              },
      socialLogin : function(provider)
      {
                firebase.auth().signInWithPopup(provider).then(function(result) {
		if (result.credential) {
				var firebaseUser = result.user;
				console.log('Login successful'+firebaseUser.email);
				presenter.loginSuccess(firebaseUser);
			}
			else
			{
				var prevUser = auth.currentUser;
				
				     auth.signInWithCredential(credential).then(function(user) {
					       console.log("Sign In Success", user);
					       var currentUser = user;
					       // Merge prevUser and currentUser data stored in Firebase.
					       // Note: How you handle this is specific to your application

					       // After data is migrated delete the duplicate user
					       return user.delete().then(function() {
						 // Link the OAuth Credential to original account
						 return prevUser.link(credential);
					       }).then(function() {
						 // Sign in with the newly linked credential
						 return auth.signInWithCredential(credential);
					       });
					     })
				
			}
                  })
                  .catch(function(error) {
                        console.log('login error'+error.message);
   								      presenter.loginError(error.message);
                  });
      }

};

var presenter = {
    login : function(email,password){
                          if(email=="")
                          {
                              view.showError("Enter valid Email Id");
                              return;
                          }
                          else if(password=="")
                          {
                              view.showError("Enter valid Password");
                              return;
                          }
                          else
                          {

                              view.showProgress();
                              model.login(email,password);
                          }
                  },
    loginError    : function(error){
                          view.showError(error);
                  },
    loginSuccess  : function(firebaseUser){
                          localStorage.setItem('currentUserObject', JSON.stringify(firebaseUser));
                          window.location = "passages.html";
                  },
    socialLogin    : function(provider){
                          console.log("sending login request");
                          model.socialLogin(provider);
              	 }


};

var view = {
  init : function(){

           loginElements = document.getElementById('loginDiv');
           errorElements = document.getElementById('loginError');
           progressElement = document.getElementById('loading');
           emailBox = document.getElementById('email');
           passwordBox = document.getElementById('password');
           loginButton = document.getElementById('loginButton');
           loginForm = document.getElementById('loginForm');

	   googleSignInButton = document.getElementById('googleSignInButton');

           facebookSignInButton = document.getElementById('facebookSignInButton');


	   googleSignInButton.onclick = function(){
		   		var provider = new firebase.auth.GoogleAuthProvider();
				console.log("google sign in processing");
				presenter.socialLogin(provider);
			}



         facebookSignInButton.onclick = function(){
		               var provider = new firebase.auth.FacebookAuthProvider();
			       console.log("facebook sign in processing");
			       presenter.socialLogin(provider);
        		}


         loginForm.onsubmit = function(e){
                      e.preventDefault();
                      console.log(emailBox.value);
                      presenter.login(emailBox.value,passwordBox.value);
                      return false;
         	   };

  },
  showError  : function(error){
          loginElements.style.display = "block";
          progressElement.style.display = "none";
          errorElements.style.display = "block";
          errorElements.innerHTML = error;
  },
  showProgress : function(){
          console.log("Loading ...");
          loginElements.style.display = "none";
          progressElement.style.display = "block";
          errorElements.style.display = "none";
  }
};
firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log(user+' user logged in');
            window.location = "passages.html";
        }
        else{
            console.log('Sign in with your user email and password');
        }
});
view.init();
