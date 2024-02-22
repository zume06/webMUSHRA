/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function PairedComparisonChangedPage(_reference, _sampleA, _sampleB, _pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _errorHandler, _language) {
  this.reference = _reference;
  this.sampleA = _sampleA;
  this.sampleB = _sampleB;
  this.pageManager = _pageManager;
  this.pageTemplateRenderer = _pageTemplateRenderer;
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.audioFileLoader = _audioFileLoader;
  this.session = _session;
  this.pageConfig = _pageConfig;
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.mushraAudioControl = null;
  this.div = null;
  this.waveformVisualizer = null;
  this.macic = null;

  this.currentItem = null;

  this.audioFileLoader.addFile(this.reference.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.reference);
  this.audioFileLoader.addFile(this.sampleA.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.sampleA);
  this.audioFileLoader.addFile(this.sampleB.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.sampleB);

  this.choice = null;
  this.choice1 = null;
  this.choice2 = null;
  this.choice3 = null;
  this.choice4 = null;

  // data
  this.ratings = [];
  this.loop = { start: null, end: null };
  this.slider = { start: null, end: null };

  this.time = 0;
  this.startTimeOnPage = null;
  //console.log("this.sampleA:", this.sampleA);
  //console.log("this.sampleB:", this.sampleB);
  //console.log("this.reference:", this.reference);
}


PairedComparisonChangedPage.prototype.getName = function () {
  return this.pageConfig.name;
};

PairedComparisonChangedPage.prototype.init = function () {

  //console.log("this.sampleA:", this.sampleA);
  //console.log("this.sampleB:", this.sampleB);
  //console.log("this.reference:", this.reference);
  this.mushraAudioControl = new MushraAudioControlChanged(this.audioContext, this.bufferSize, this.reference, [this.sampleA], this.sampleB, this.errorHandler, false, false);
  this.mushraAudioControl.addEventListener((function (_event) {
    if (_event.name == 'stopTriggered') {
      $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));

      if ($('#buttonReference').attr("active") == "true") {
        $.mobile.activePage.find('#buttonReference')  //remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        $('#buttonReference').attr("active", "false");
      }

      if ($('#buttonConditions0').attr("active") == "true") {
        $.mobile.activePage.find('#buttonConditions0')  //remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        $('#buttonConditions0').attr("active", "false");
      }

      if ($('#buttonConditions1').attr("active") == "true") {
        $.mobile.activePage.find('#buttonConditions1')  //remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        $('#buttonConditions1').attr("active", "false");
      }



      $.mobile.activePage.find('#buttonStop')    //add color to stop
        .removeClass('ui-btn-a')
        .addClass('ui-btn-b').attr('data-theme', 'b');
      $.mobile.activePage.find('#buttonStop').focus();
      $('#buttonStop').attr("active", "true");

    }
  }).bind(this));

  //this.mushraAudioControl.addEventListener((function (_event) {
  //  if (_event.name == 'ended') {
  //    this.isEnded = true;
  //  }
  //}).bind(this));

};

PairedComparisonChangedPage.prototype.render = function (_parent) {
  var div = $("<div></div>");
  _parent.append(div);

  var content;
  if (this.pageConfig.content === null) {
    content = "";
  } else {
    content = this.pageConfig.content;
  }

  var p = $("<p>" + content + "</p>");
  div.append(p);

  var table = $("<table id='main' align='center'></table>");
  div.append(table);

  var trLoop = $("<tr id='trWs'></tr>");
  table.append(trLoop);

  var tdLoop1 = $(" \
    <td class='stopButton'> \
      <button data-role='button' data-inline='true' id='buttonStop' class='center' onclick='"+ this.pageManager.getPageVariableName(this) + ".mushraAudioControl.stop();'>" + this.pageManager.getLocalizer().getFragment(this.language, 'stopButton') + "</button> \
    </td> \
  ");
  trLoop.append(tdLoop1);

  var waveform = $("<td></td>");
  trLoop.append(waveform);


  this.waveformVisualizer = new WaveformVisualizer(this.pageManager.getPageVariableName(this) + ".waveformVisualizer", waveform, this.reference, this.pageConfig.showWaveform, this.pageConfig.enableLooping, this.mushraAudioControl);
  this.waveformVisualizer.create();
  this.waveformVisualizer.load();


  var trAB = $("<tr></tr>");
  table.append(trAB);
  var tdAB = $("<td id='td_AB' colspan='2'></td>");
  trAB.append(tdAB);

  var tableAB = $("<table id='table_ab' class='center'></table>");
  tdAB.append(tableAB);

  // names
  var trNames = $("<tr><td>" + this.pageManager.getLocalizer().getFragment(this.language, 'reference') + "</td><td>A</td><td>B</td></tr>");
  tableAB.append(trNames);


  var trPlays = $("<tr></tr>");
  tableAB.append(trPlays);
  var buttonPlayReference = $("<td><button data-theme='a' id='buttonReference' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackReference()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");
  trPlays.append(buttonPlayReference);

  var buttonPlayA = $("<td><button data-theme='a' id='buttonConditions0' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackA()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");
  trPlays.append(buttonPlayA);
  var buttonPlayB = $("<td><button data-theme='a' id='buttonConditions1' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackB()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");
  trPlays.append(buttonPlayB);


  var trQuestion = $("<tr><td  colspan='3'><br/><br/>" + this.pageManager.getLocalizer().getFragment(this.language, 'quest') + "</td></tr>");
  tableAB.append(trQuestion);


  var trResponse = $("<tr></tr>");
  tableAB.append(trResponse);
  var tdResponse = $("<td  colspan='3'></td>");
  trResponse.append(tdResponse);

  var radioChecked1 = false;
  var radioChecked2 = false;
  var radioChecked3 = false;
  var radioChecked4 = false;

  var radioChoice1 = $("<div id='radio-container'>\<span><b>timber（音色）</b></span> <div id='radio-choice1' data-role='controlgroup' data-type='horizontal'>\
    <input type='radio' name='radio-choice1' id='radio-choice-a1-1' value='A+'>\
    <label for='radio-choice-a1-1'>A+</label>\
    <input type='radio' name='radio-choice1' id='radio-choice-a2-1' value='A-'>\
    <label for='radio-choice-a2-1'>A-</label>\
    <input type='radio' name='radio-choice1' id='radio-choice-c-1' value='NA'>\
    <label for='radio-choice-c-1'>N/A</label>\
    <input type='radio' name='radio-choice1' id='radio-choice-b2-1' value='B-'>\
    <label for='radio-choice-b2-1'>B-</label>\
    <input type='radio' name='radio-choice1' id='radio-choice-b1-1' value='B+'>\
    <label for='radio-choice-b1-1'>B+</label>\
    </div>\
  </div>");

  radioChoice1.find("input[type='radio']").bind("change", (function () {
    radioChecked1 = true;
    checkAndUnlockNextButton(radioChecked1, radioChecked2, radioChecked3, radioChecked4, this.isPlayedRef, this.isPlayedA, this.isPlayedB);
  }
  ).bind(this));

  tdResponse.append(radioChoice1);

  var radioChoice2 = $("<div id='radio-container'>\<span><b>rhythm（リズム）</b></span><div id='radio-choice2' data-role='controlgroup' data-type='horizontal'>\
    <input type='radio' name='radio-choice2' id='radio-choice-a1-2' value='A+'>\
    <label for='radio-choice-a1-2'>A+</label>\
    <input type='radio' name='radio-choice2' id='radio-choice-a2-2' value='A-'>\
    <label for='radio-choice-a2-2'>A-</label>\
    <input type='radio' name='radio-choice2' id='radio-choice-c-2' value='NA'>\
    <label for='radio-choice-c-2'>N/A</label>\
    <input type='radio' name='radio-choice2' id='radio-choice-b2-2' value='B-'>\
    <label for='radio-choice-b2-2'>B-</label>\
    <input type='radio' name='radio-choice2' id='radio-choice-b1-2' value='B+'>\
    <label for='radio-choice-b1-2'>B+</label>\
  </div>");

  radioChoice2.find("input[type='radio']").bind("change", (function () {
    radioChecked2 = true;
    checkAndUnlockNextButton(radioChecked1, radioChecked2, radioChecked3, radioChecked4, this.isPlayedRef, this.isPlayedA, this.isPlayedB);
  }
  ).bind(this));

  tdResponse.append(radioChoice2);

  var radioChoice3 = $("<div id='radio-container'>\<span><b>melody（メロディ）</b></span><div id='radio-choice3' data-role='controlgroup' data-type='horizontal'>\
    <input type='radio' name='radio-choice3' id='radio-choice-a1-3' value='A+'>\
    <label for='radio-choice-a1-3'>A+</label>\
    <input type='radio' name='radio-choice3' id='radio-choice-a2-3' value='A-'>\
    <label for='radio-choice-a2-3'>A-</label>\
    <input type='radio' name='radio-choice3' id='radio-choice-c-3' value='NA'>\
    <label for='radio-choice-c-3'>N/A</label>\
    <input type='radio' name='radio-choice3' id='radio-choice-b2-3' value='B-'>\
    <label for='radio-choice-b2-3'>B-</label>\
    <input type='radio' name='radio-choice3' id='radio-choice-b1-3' value='B+'>\
    <label for='radio-choice-b1-3'>B+</label>\
  </div>");

  radioChoice3.find("input[type='radio']").bind("change", (function () {
    radioChecked3 = true;
    checkAndUnlockNextButton(radioChecked1, radioChecked2, radioChecked3, radioChecked4, this.isPlayedRef, this.isPlayedA, this.isPlayedB);
  }
  ).bind(this));

  tdResponse.append(radioChoice3);

  var radioChoice4 = $("<div id='radio-container'>\<span><b>total（総合）</b></span><div id='radio-choice4' data-role='controlgroup' data-type='horizontal'>\
    <input type='radio' name='radio-choice4' id='radio-choice-a1-4' value='A+'>\
    <label for='radio-choice-a1-4'>A+</label>\
    <input type='radio' name='radio-choice4' id='radio-choice-a2-4' value='A-'>\
    <label for='radio-choice-a2-4'>A-</label>\
    <input type='radio' name='radio-choice4' id='radio-choice-c-4' value='NA'>\
    <label for='radio-choice-c-4'>／</label>\
    <input type='radio' name='radio-choice4' id='radio-choice-b2-4' value='B-'>\
    <label for='radio-choice-b2-4'>B-</label>\
    <input type='radio' name='radio-choice4' id='radio-choice-b1-4' value='B+'>\
    <label for='radio-choice-b1-4'>B+</label>\
  </div>");

  radioChoice4.find("input[type='radio']").bind("change", (function () {
    radioChecked4 = true;
    checkAndUnlockNextButton(radioChecked1, radioChecked2, radioChecked3, radioChecked4, this.isPlayedRef, this.isPlayedA, this.isPlayedB);
  }
  ).bind(this));

  tdResponse.append(radioChoice4);

  //console.log($('#radio-choice1 :radio:checked'));
  //console.log($('#radio-choice2 :radio:checked'));
  //console.log($('#radio-choice3 :radio:checked'));
  //console.log($('#radio-choice4 :radio:checked'));

  this.macic = new MushraAudioControlInputController(this.mushraAudioControl, this.pageConfig.enableLooping);
  this.macic.bind();
};

function checkAndUnlockNextButton(radioChecked1, radioChecked2, radioChecked3, radioChecked4, isPlayedRef, isPlayedA, isPlayedB) {
  var allchecked = false;
  if (radioChecked1 && radioChecked2 && radioChecked3 && radioChecked4) {
    allchecked = true;
  }
  //if (allchecked) {
  //  this.pageTemplateRenderer.unlockNextButton();
  //}
  var notallNA = false;
  if ($('#radio-choice1 :radio:checked').val() == 3 && $('#radio-choice2 :radio:checked').val() == 3 && $('#radio-choice3 :radio:checked').val() == 3) {
    notallNA = false;
  } else {
    notallNA = true;
  }
  //if (notallNA == false) {
  //  this.pageTemplateRenderer.lockNextButton();
  //}
  var allplayed = false;
  if (isPlayedRef && isPlayedA && isPlayedB) {
    allplayed = true;
  }
  var nottotalna = false;
  if ($('#radio-choice4 :radio:checked').val() == 3) {
    nottotalna = false;
  } else {
    nottotalna = true;
  }

  if (allchecked && notallNA && allplayed && nottotalna) {
    this.pageTemplateRenderer.unlockNextButton();
  } else {
    this.pageTemplateRenderer.lockNextButton();
  }
  //if (allplayed == false) {
  //  this.pageTemplateRenderer.lockNextButton();
  //}


  //console.log($('#radio-choice1 :radio:checked').val());
  //console.log($('#radio-choice2 :radio:checked').val());
  //console.log($('#radio-choice3 :radio:checked').val());
  //console.log($('#radio-choice4 :radio:checked').val());
  //console.log("isPlayedRef", isPlayedRef)
  //console.log("isPlayedA", isPlayedA)
  //console.log("isPlayedB", isPlayedB)
}


PairedComparisonChangedPage.prototype.setLoopStart = function () {
  var slider = document.getElementById('slider');
  var startSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  var endSliderSamples = parseFloat(slider.noUiSlider.get()[1]);

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
}


PairedComparisonChangedPage.prototype.setLoopEnd = function () {
  var slider = document.getElementById('slider');
  var startSliderSamples = parseFloat(slider.noUiSlider.get()[0]);

  var endSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
}


PairedComparisonChangedPage.prototype.pause = function () {
  this.mushraAudioControl.pause();
};

PairedComparisonChangedPage.prototype.cleanButtons = function () {
  if ($('#buttonStop').attr("active") == "true") {
    $.mobile.activePage.find('#buttonStop')  //remove color from Stop
      .removeClass('ui-btn-b')
      .addClass('ui-btn-a').attr('data-theme', 'a');
    $('#buttonStop').attr("active", "false");
  }

  if ($('#buttonReference').attr("active") == "true") {
    $.mobile.activePage.find('#buttonReference')	//remove color from Reference
      .removeClass('ui-btn-b')
      .addClass('ui-btn-a').attr('data-theme', 'a');
    $('#buttonReference').attr("active", "false");
  }

  if ($('#buttonConditions0').attr("active") == "true") {
    $.mobile.activePage.find('#buttonConditions0')	//remove color from Reference
      .removeClass('ui-btn-b')
      .addClass('ui-btn-a').attr('data-theme', 'a');
    $('#buttonConditions0').attr("active", "false");
  }

  if ($('#buttonConditions1').attr("active") == "true") {
    $.mobile.activePage.find('#buttonConditions1')	//remove color from Reference
      .removeClass('ui-btn-b')
      .addClass('ui-btn-a').attr('data-theme', 'a');
    $('#buttonConditions1').attr("active", "false");
  }
};


PairedComparisonChangedPage.prototype.btnCallbackReference = function () {
  this.currentItem = "ref";
  var label = $("#buttonReference").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.isPlayedRef = this.mushraAudioControl.playReference();
    $("#buttonReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));

    this.cleanButtons();
    $.mobile.activePage.find('#buttonReference')		//add color to reference
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $('#buttonReference').focus();
    $('#buttonReference').attr("active", "true");

  }
};

PairedComparisonChangedPage.prototype.btnCallbackA = function () {
  this.currentItem = "A";
  var label = $("#buttonConditions0").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions0").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.isPlayedA = this.mushraAudioControl.playCondition(0);
    $("#buttonConditions0").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));

    this.cleanButtons();
    $.mobile.activePage.find('#buttonConditions0')		//add color to reference
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $('#buttonConditions0').focus();
    $('#buttonConditions0').attr("active", "true");
  }
};

PairedComparisonChangedPage.prototype.btnCallbackB = function () {
  this.currentItem = "B";
  var label = $("#buttonConditions1").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions1").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.isPlayedB = this.mushraAudioControl.playCondition(1);
    $("#buttonConditions1").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));

    this.cleanButtons();
    $.mobile.activePage.find('#buttonConditions1')		//add color to reference
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $('#buttonConditions1').focus();
    $('#buttonConditions1').attr("active", "true");

  }
};



PairedComparisonChangedPage.prototype.load = function () {
  this.startTimeOnPage = new Date();

  if (this.choice1 === null) {
    this.pageTemplateRenderer.lockNextButton();
  }
  // audio
  this.mushraAudioControl.initAudio();
  //choice 

  if (this.choice1 === 'a') {
    $('#radio-choice-a').prop('checked', true).checkboxradio('refresh');
    $('#radio-choice-b').prop('checked', false).checkboxradio('refresh');
    $('#radio-choice-n').prop('checked', false).checkboxradio('refresh');
  } else if (this.choice1 === 'b') {
    $('#radio-choice-b').prop('checked', true).checkboxradio('refresh');
    $('#radio-choice-a').prop('checked', false).checkboxradio('refresh');
    $('#radio-choice-n').prop('checked', false).checkboxradio('refresh');
  } else if (this.choice1 === 'n') {
    $('#radio-choice-b').prop('checked', false).checkboxradio('refresh');
    $('#radio-choice-a').prop('checked', false).checkboxradio('refresh');
    $('#radio-choice-n').prop('checked', true).checkboxradio('refresh');
  }
  // loop
  if (this.loop.start !== null && this.loop.end !== null) {
    this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() / this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
    this.mushraAudioControl.setPosition(0);
  }

};

PairedComparisonChangedPage.prototype.save = function () {
  this.macic.unbind();
  this.time += (new Date() - this.startTimeOnPage);
  this.mushraAudioControl.removeEventListener(this.waveformVisualizer.numberEventListener);
  // audio
  this.mushraAudioControl.freeAudio();
  // choice
  var radio1 = $('#radio-choice1 :radio:checked');
  var radio2 = $('#radio-choice2 :radio:checked');
  var radio3 = $('#radio-choice3 :radio:checked');
  var radio4 = $('#radio-choice4 :radio:checked');
  this.choice1 = (radio1.length > 0) ? radio1[0].value : null;
  this.choice2 = (radio2.length > 0) ? radio2[0].value : null;
  this.choice3 = (radio3.length > 0) ? radio3[0].value : null;
  this.choice4 = (radio4.length > 0) ? radio4[0].value : null;
  //loop
  this.loop.start = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopStart);
  this.loop.end = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopEnd);
};


PairedComparisonChangedPage.prototype.store = function () {
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
    trial = new Trial();
    trial.type = this.pageConfig.type;
    trial.id = this.pageConfig.id;
    this.session.trials[this.session.trials.length] = trial;
  }
  var choice = new PairedComparisonChoice();
  choice.answerTimbre = this.choice1
  choice.answerRhythm = this.choice2
  choice.answerMelody = this.choice3
  choice.answerTotal = this.choice4

  choice.Reference = this.reference["filepath"]
  choice.SampleA = this.sampleA["filepath"]
  choice.SampleB = this.sampleB["filepath"]


  choice.time = this.time;
  trial.responses[trial.responses.length] = choice;

  //console.log("Trial responses:", trial.responses);

};
