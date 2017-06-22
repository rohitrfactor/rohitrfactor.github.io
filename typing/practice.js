var model = {

};
var presenter = {
    logout : function(){
                    logout();
    },
    getCurrentUser : function(){
                     console.log('Current user is : '+getCurrentUser());
                     view.setHeaderEmail(getCurrentUser());
    }

};
var view = {
    init : function(){
            headerUserElem = document.getElementById('user_email');
            logOutButton = document.getElementById('signout');
            logOutButton.addEventListener('click',function(){
                          presenter.logout();
            });
            presenter.getCurrentUser();
    },
    showError : function(error){
            console.log("Error while fetching passages "+error);
    },
    setHeaderEmail : function(currentUser){
          headerUserElem.innerText = currentUser.email;
    }
};

view.init();
