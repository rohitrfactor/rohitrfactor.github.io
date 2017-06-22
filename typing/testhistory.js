var model = {
      getAllHistory : function(currentUser){
        console.log("currentUser uid :"+currentUser.uid);

                  var uid = currentUser.uid;

                  var historyQuery = firebase.database().ref('Scores/'+uid);
                  historyQuery.on('value',function(snapshot){
                    i=0;
                   snapshot.forEach(function(childSnapshot)
                   {
                    i++;
                     console.log(i);
                       console.log('test code in history '+childSnapshot.key);
                       console.log('Test history accuracy :'+childSnapshot.val().accuracy);
                       var testCode = childSnapshot.key;
                       presenter.appendHistory(testCode,childSnapshot.val(),i);
                   })
                 },function(error){
                      console.log("error while fetching history "+error);
                      presenter.fetchHistoryError(error);
                 });
            }
};
var presenter = {

    fetchHistory : function(currentUser){
                    console.log("History requested");
                    console.log("current user :"+currentUser.email);
                    view.showLoading();
                    model.getAllHistory(currentUser);
    },
    fetchHistoryError : function(error){
                    view.showError(error);
    },
    appendHistory : function(testCode,history,i){
                    console.log("Test code of History is being appended : "+testCode);
                    view.showHistory();
                    view.appendHistory(testCode,history,i);
    },
  /*  passageClicked : function(passageString,passageStringId){
                    sessionStorage.currentPassage = passageString;
                    sessionStorage.currentPassageId = passageStringId
                    window.location = "typing.html";
    }, */
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
            historyElement = document.getElementById('history');
            showHistoryElem = document.getElementById('showHistory');
            loaderElem = document.getElementById('loader');
            headerUserElem = document.getElementById('user_email');
            logOutButton = document.getElementById('signout');
            logOutButton.addEventListener('click',function(){
                          presenter.logout();
            });
            presenter.getCurrentUser();
    },
    appendHistory : function(testCode,history,i){
                    var defaultOffset = '50%';
                    console.log('History : '+history.accuracy);
                    var div = document.createElement('div');
                    div.className = 'timeline__item timeline__item--'+i;
                    var accuracy = history.accuracy;
                    var error = history.error;
                    var depressions = history.depressions;
                    var speed = history.speed;
                    var wordsPerMinute = history.wordsPerMinute;
                    var time = history.time;
        //            var passageStringId = history.Code;
        //            div.onclick = view.createClickHandler(passageString,passageStringId);
                    div.innerHTML='<div class="timeline__item__station"></div><div class="timeline__item__content"><h2 class="timeline__item__content__date">'+time+'</h2><p class="timeline__item__content__description">'+'Test Code '+testCode+'<br>Accuracy '+accuracy+'<br>Error '+error+'<br>Depressions '+depressions+'<br>Speed '+speed+'<br>Words per minute '+wordsPerMinute+'</p></div>';
                    historyElement.appendChild(div);
                    customWayPoint('.timeline__item--'+i, 'timeline__item-bg', defaultOffset);

    },
    showLoading : function(){
                  loaderElem.style.display = "block";
                //  historyElement.style.display = 'none';
                  showHistoryElem.style.display = 'none';

    },
    showHistory : function(){
                  loaderElem.style.display = "none";
              //    historyElement.style.display = 'block';
                  showHistoryElem.style.display = 'block';
    },
    showError : function(error){
            console.log("Error while fetching history "+error);
    },
  /*  createClickHandler : function(passageString,passageStringId)
    {
      return function()
      {
        console.log('Passage clicked'+passageString);
        presenter.passageClicked(passageString,passageStringId);
        //redirect to typing page
        //document.getElementById('a').innerHTML = arg;
        //showTest();
      } ;
    },*/
    setHeaderEmail : function(currentUser){
          headerUserElem.innerText = currentUser.email;
          presenter.fetchHistory(currentUser);
    }
};

view.init();
