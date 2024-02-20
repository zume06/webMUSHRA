/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function GetSetNum(_pageManager, _session, _dataSender, _pageConfig, _language, _testID) {
  this.pageManager = _pageManager;
  this.session = _session;
  this.dataSender = _dataSender;
  this.pageConfig = _pageConfig;
  this.language = _language;
  this.testID = _testID;

  this.likert = null;
  this.interval = null;

  this.errorDiv = $("<div style='color:red; font-weight:bold;'></div>");



  if (this.pageConfig.questionnaire === undefined) {
    this.pageConfig.questionnaire = new Array();
  }




}

GetSetNum.prototype.getName = function () {
  return this.pageConfig.name;
};


GetSetNum.prototype.sendResults = function () {
  var err = this.dataSender.send(this.session);
  if (err == true) {
    this.errorDiv.text("An error occured while sending your data to the server! Please contact the experimenter.");
  }
  clearInterval(this.interval);
};

GetSetNum.prototype.render = function (_parent) {
  _parent.append(this.pageConfig.content);

  var boxDisplay = $('<div><p><b>クラウドワークスIDを入力してください</b></p></div>');
  var box = $('<input type="text" name="box" id="inputBox">');
  //$('<p>クラウドワークスIDを入力してください</p>').insertBefore(box);

  //var box = $('<input> クラウドワークスIDを入力してください</input>');
  //var boxDisplay = $('<div type="text" id="inputBox"></div>');

  var submit = $('<button> 確定</button>');
  var submitDisplay = $('<div id="submitBox"></div>');

  var button = $('<button>実験URL発行</button>');
  var countDisplay = $('<div id="count"></div>');
  countDisplay.css("font-size", "18px");

  var self = this;

  $.get('./configs/2024sp/setnums/' + self.testID + '/setnums.csv', function (data2) {
    const setnumArray = data2.split('\n');
    self.setnumArray = setnumArray;
    $.get('./results/' + self.testID + '/counts.csv', function (data1) {
      const lines = data1.split('\n');
      const dataPrev = lines[lines.length - 2];
      console.log(dataPrev);
      const dataPrevArray = dataPrev.split(",");
      const countPrev = dataPrevArray[0];
      console.log(countPrev);
      self.countPrev = countPrev;

      var count = self.countPrev;
      console.log("this.countPrev", self.countPrev);
      if (count == "count" || count == "None") {
        count = -1;
      }
      console.log("count ", count);
      var userID;
      var setnum;

      button.prop('disabled', true);

      submit.click(function () {
        userID = $("#inputBox").val();
        console.log("val", $("#inputBox").val())
        if (userID == '') {
          button.prop('disabled', true);
        } else {
          button.prop('disabled', false);
        }
      });

      button.click(function () {
        count++;
        setnum = self.setnumArray[count];
        var url = "http://52.62.30.42:8000//?config=2024sp/configfiles/" + self.testID + "/config_set" + setnum + ".yaml";
        var link = $('<a href="' + url + '">' + url + '</a>');
        countDisplay.text("実験URL: ");
        countDisplay.append(link);
        self.count = count;
        userID = $("#inputBox").val();
        self.userID = userID;
        self.save();
        self.store();
        self.sendResults();
        button.prop('disabled', true);
        //console.log(self.count)
      });
    }).fail(function () {
      var count = -1;
      console.log(count);
      var userID;
      var setnum;

      button.prop('disabled', true);

      submit.click(function () {
        userID = $("#inputBox").val();
        console.log("val", $("#inputBox").val())
        if (userID == '') {
          button.prop('disabled', true);
        } else {
          button.prop('disabled', false);
        }
      });

      button.click(function () {
        count++;
        setnum = self.setnumArray[count];
        countDisplay.text("実験URL: http://localhost:8000/?config=2024sp/configfiles/" + this.testID + "/config_set" + setnum + ".yaml");
        self.count = count;
        userID = $("#inputBox").val();
        self.userID = userID;
        self.save();
        self.store();
        self.sendResults();
        button.prop('disabled', true);
        //console.log(self.count)
      });
    });
  });

  _parent.append(boxDisplay);
  _parent.append(box);
  _parent.append(submit);
  _parent.append(submitDisplay);
  _parent.append(button);
  _parent.append(countDisplay);
}

/**
* Saves the page
* @memberof GetSetNum
*/
GetSetNum.prototype.save = function () {
  this.current1 = this.count;
  this.current2 = this.userID;
};

GetSetNum.prototype.store = function () {
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
    trial = new Trial();
    trial.type = this.pageConfig.type;
    trial.id = this.pageConfig.id;
    this.session.trials[this.session.trials.length] = trial;
  }

  trial.count = this.count;
  trial.userID = this.userID;


  console.log("Trial responses:", trial.count, trial.userID);
  //console.log("Trial type:", trial.type);

};