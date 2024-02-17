/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function GetSetNum(_pageManager, _session, _dataSender, _pageConfig, _language) {
  this.pageManager = _pageManager;
  this.session = _session;
  this.dataSender = _dataSender;
  this.pageConfig = _pageConfig;
  this.language = _language;

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

  var button = $('<button>発行</button>');
  var countDisplay = $('<div id="count"></div>');

  var count = 0;

  // ボタンをクリックしたときにcountをインクリメントして更新する
  var self = this;
  button.click(function () {
    countDisplay.text(count);
    count++;
    self.save();
    self.store();
    self.sendResults();
  });

  _parent.append(button);
  _parent.append(countDisplay);
  this.count = count
}

/**
* Saves the page
* @memberof GetSetNum
*/
GetSetNum.prototype.save = function () {
  this.count = this.count
};

GetSetNum.prototype.store = function () {
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
    trial = new Trial();
    trial.type = this.pageConfig.type;
    trial.id = this.pageConfig.id;
    this.session.trials[this.session.trials.length] = trial;
  }

  trial.responses[trial.responses.length] = this.count;

  console.log("Trial responses:", trial.responses);
  console.log("Trial type:", trial.type);

};