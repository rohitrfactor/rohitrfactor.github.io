var model = {
  wordLength : function(string){
              var stringLength = 0;
              var stringArray = string.trim().split(" ");
                for(var i=0;i<stringArray.length;i++){
                  if(stringArray[i] !=""){
                    stringLength++;
                  }
                }
              return stringLength;
            },
  calculateResult : function(typing,original,depressions,speed) {
                    var diff = JsDiff["diffWords"](original, typing);

                    var submittedWords = typing.split(" ");
                  	var wordCount = submittedWords.length;
                    console.log("Total words : "+wordCount);

                    var timetaken = totalTime-clock.getTime().time;

                    console.log("time taken "+timetaken+" seconds");

                    console.log("words per minute : "+((wordCount/timetaken)*60).toFixed(2));

                    wordsPerMinute = ((wordCount/timetaken)*60).toFixed(2);

                    console.log("Total Components : "+diff.length);
                    var errorCount = 0;
                    var insCount = 0;
                    var normalCount = 0;
                    var fragment = document.createDocumentFragment();
                    for (var i=0; i < diff.length; i++) {
                              if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
                                    var swap = diff[i];
                                    diff[i] = diff[i + 1];
                                    diff[i + 1] = swap;
                              }
                              var node;
                              if (diff[i].removed) {
                                    node = document.createElement('del');
                                    node.appendChild(document.createTextNode(diff[i].value));
                                    console.log("Missing words "+diff[i].value+" Length "+model.wordLength(diff[i].value));
                                    errorCount += model.wordLength(diff[i].value);

                              } else if (diff[i].added) {
                                    node = document.createElement('ins');
                                    node.appendChild(document.createTextNode(diff[i].value));
                                    insCount += model.wordLength(diff[i].value) ;

                              } else {
                                    node = document.createTextNode(diff[i].value);
                                    normalCount += model.wordLength(diff[i].value);

                              }
                              fragment.appendChild(node);
                    }
                    console.log("Missing Words Count : "+errorCount);
                    console.log("Extra words count : "+insCount);
                    console.log("Correct Components : "+normalCount);
                    presenter.updateResult(errorCount,insCount,normalCount,fragment,depressions,speed,wordsPerMinute);
            },


   saveResult : function(accuracy,error,depressions,speed,wordsPerMinute){
                  console.log(accuracy);
                  var user = firebase.auth().currentUser;
                  var id = user.uid;
				          var passageId = sessionStorage.currentPassageId;
                  var today = new Date();
                  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
                  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                  var dateTime = date+' '+time;
                  var postKey = firebase.database().ref().child('Scores'+id+passageId).push().key;
                  var updates = {};
                  var postData =
                  {
                      accuracy:accuracy ,
                      error:error ,
                      depressions:depressions ,
                      speed:speed,
                      wordsPerMinute:wordsPerMinute,
                      time: dateTime
                  };
                updates['/Scores/' + id+'/'+passageId] = postData;
                firebase.database().ref().update(updates).then(function()
                {
                      console.log('Result succeffully updated on server');
                      presenter.saveResultSuccess();
                });
              }

};
var presenter = {
    calculateResult : function(typing,original,depressions,speed){
                      view.showResult();
                      model.calculateResult(typing,original,depressions,speed);
    },
    updateResult : function(errorCount,insCount,normalCount,fragment,depressions,speed,wordsPerMinute){
                   var accuracy = ((normalCount)/(errorCount+insCount+normalCount))*100;
                   var error = ((errorCount+insCount)/(errorCount+insCount+normalCount))*100;

                   console.log("Error Percentage : "+((errorCount+insCount)/(errorCount+insCount+normalCount))*100);
                   console.log("Accuracy : "+((normalCount)/(errorCount+insCount+normalCount))*100);
                   view.updateResult(accuracy,error,fragment,depressions,speed);
				           model.saveResult(accuracy.toFixed(2),error.toFixed(2),depressions,speed,wordsPerMinute);
    },
    logout : function(){
                    logout();
    },
    getCurrentUser : function(){
                     console.log('Current user is : '+getCurrentUser());
                     view.setHeaderEmail(getCurrentUser());
    },
    saveResultSuccess : function(){
                    console.log("Data saved sueecssfully");
    }
};
var view = {
    init : function(){
      $('#b').bind("cut copy paste",function(e) {
           e.preventDefault();
       });
      var accuracyGaugeConfig = liquidFillGaugeDefaultSettings();
          accuracyGaugeConfig.circleColor = "#2E7D32";
          accuracyGaugeConfig.textColor = "#1B5E20";
          accuracyGaugeConfig.waveTextColor = "#69F0AE";
          accuracyGaugeConfig.waveColor = "#2E7D32";
          accuracyGaugeConfig.waveAnimateTime = 2000;
          accuracyGaugeConfig.waveCount = 1;
          accuracyGaugeConfig.waveHeight = 0.15;
          accuracyGauge = loadLiquidFillGauge("accuracy", 0, accuracyGaugeConfig);

      var errorGaugeConfig = liquidFillGaugeDefaultSettings();
          errorGaugeConfig.circleColor = "#BF360C";
          errorGaugeConfig.textColor = "#BF360C";
          errorGaugeConfig.waveTextColor = "#FF6E40";
          errorGaugeConfig.waveColor = "#BF360C";
          errorGaugeConfig.waveAnimateTime = 2000;
          errorGaugeConfig.waveCount = 1;
          errorGaugeConfig.waveHeight = 0.15;
          errorGauge = loadLiquidFillGauge("error", 0, errorGaugeConfig);

      var depressionsGaugeConfig = liquidFillGaugeDefaultSettings();
          depressionsGaugeConfig.circleColor = "##0277BD";
          depressionsGaugeConfig.textColor = "#0277BD";
          depressionsGaugeConfig.waveTextColor = "#40C4FF";
          depressionsGaugeConfig.waveColor = "#0277BD";
          depressionsGaugeConfig.waveAnimateTime = 2000;
          depressionsGaugeConfig.waveCount = 1;
          depressionsGaugeConfig.waveHeight = 0.15;
          depressionsGaugeConfig.displayPercent = false;
          depressionsGauge = loadLiquidFillGauge("depressions", 0, depressionsGaugeConfig);

      var speedGaugeConfig = liquidFillGaugeDefaultSettings();
          speedGaugeConfig.circleColor = "#00695C";
          speedGaugeConfig.textColor = "#00695C";
          speedGaugeConfig.waveTextColor = "#64FFDA";
          speedGaugeConfig.waveColor = "#00695C";
          speedGaugeConfig.waveAnimateTime = 2000;
          speedGaugeConfig.waveCount = 1;
          speedGaugeConfig.waveHeight = 0.15;
          speedGaugeConfig.displayPercent = false;
          speedGauge = loadLiquidFillGauge("speed", 0, speedGaugeConfig);


      headerUserElem = document.getElementById('user_email');
      logOutButton = document.getElementById('signout');
      logOutButton.addEventListener('click',function(){
                        presenter.logout();
      });
      presenter.getCurrentUser();

      isTestStarted = false;
      var original = document.getElementById('original');
      original.innerHTML = '';
      original.innerHTML = sessionStorage.currentPassage;
      var typing = document.getElementById('typing');
      typing.innerHTML = '';
      var result = document.getElementById('result');
      typing.innerHTML = '';

      practiceElem = document.getElementById('practice');
      outputElem = document.getElementById('output');
      practiceElem.style.display="block";
      outputElem.style.display="none";
      totalTime = 900;

      typing.addEventListener("keydown", view.startTest);
      $(document).ready(function() {
        clock = $('.clock').FlipClock(totalTime, {
              clockFace: 'MinuteCounter',
              countdown: true,
              autoStart: false,
              callbacks: {
                start: function() {
                      document.getElementById("submitTest").disabled = false;
                },
                stop: function(){

                  document.getElementById("submitTest").disabled = true;
                  console.log("Elapsed Time "+(totalTime-clock.getTime().time)+" seconds");
                  console.log("Depressions : "+typing.textContent.length);
                  depressionsGauge.update();
                  var depressions = typing.textContent.length;
                  var speed = Math.ceil((typing.textContent.length/(totalTime-clock.getTime().time))*totalTime);
                  presenter.calculateResult(typing.textContent,original.textContent,depressions,speed);
                }
              }
          });
      });

    },
    updateResult : function(accuracy,error,fragment,depressions,speed){
                  console.log('Depressions : '+depressions);
                  console.log('Speed : '+speed);
                  accuracyGauge.update(accuracy);
                  errorGauge.update(error);
                  depressionsGauge.update(depressions);
                  speedGauge.update(speed);
                  result.textContent = '';
                  result.appendChild(fragment);
    },
    startTest : function(){
              if(!isTestStarted){
                  clock.start();
                  isTestStarted = true;
              }
    },
    endTest : function(){
              if(isTestStarted){
                  clock.stop();
                  isTestStarted = false;
              }
    },
    resetTest : function(){
              clock.setTime(totalTime);
    },
    showResult : function(){
                practiceElem.style.display="none";
                outputElem.style.display="block";
    },
    setHeaderEmail : function(currentUser){
          headerUserElem.innerText = currentUser.email;
    }
};
view.init();
