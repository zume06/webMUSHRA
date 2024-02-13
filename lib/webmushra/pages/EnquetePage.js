/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

/**
* @class ConsentPage
* @property {string} title the page title
* @property {string} the page content
*/
function EnquetePage(_pageManager, _pageTemplateRenderer, _pageConfig, _session) {
  this.pageManager = _pageManager;
  this.title = _pageConfig.name;
  this.content = _pageConfig.content;
  this.language = _pageConfig.language;
  this.mustConsent = _pageConfig.mustConsent;
  this.pageTemplateRenderer = _pageTemplateRenderer;
  this.session = _session;
}

/**
* Loads the page
* @memberof EnquetePage
*/
EnquetePage.prototype.load = function () {
  if (this.mustConsent == true) {
    this.pageTemplateRenderer.lockNextButton();
  }
}

/**
* Returns the page title.
* @memberof EnquetePage
* @returns {string}
*/
EnquetePage.prototype.getName = function () {
  return this.title;
};

/**
* Renders the page
* @memberof EnquetePage
*/
EnquetePage.prototype.render = function (_parent) {
  _parent.append(this.content);

  var radioChoice = $("<div id='radio-choice' data-role='controlgroup' data-type='vertical'>\
    <input type='radio' name='radio-choice' id='radio-choice-yes' value='yes'>\
    <label for='radio-choice-yes'>Yes.</label>\
    <input type='radio' name='radio-choice' id='radio-choice-no' value='no'>\
    <label for='radio-choice-no'>No.</label>\
  </div>");
  this.choice = radioChoice.value;
  radioChoice.find("input[type='radio']").bind("change", (function () {
    if ($('#radio-choice-yes')[0].checked || $('#radio-choice-no')[0].checked) {
      this.pageTemplateRenderer.unlockNextButton();
    }
  }).bind(this));
  _parent.append(radioChoice);
  return;
};

/**
* Saves the page
* @memberof EnquetePage
*/
EnquetePage.prototype.save = function () {
};

EnquetePage.prototype.store = function () {
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
    trial = new Trial();
    trial.type = this.pageConfig.type;
    trial.id = this.pageConfig.id;
    this.session.trials[this.session.trials.length] = trial;
  }

  trial.responses[trial.responses.length] = choice;

  console.log("Trial responses:", trial.responses);

};