/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function PairedComparisonChangedPageManager() {

}

PairedComparisonChangedPageManager.prototype.createPages = function (_pageManager, _pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _session, _errorHandler, _language) {
  this.sampleAs = [];
  for (var key in _pageConfig.sampleA) {
    this.sampleAs[this.sampleAs.length] = new Stimulus(key, _pageConfig.sampleA[key]);
  }
  this.sampleBs = [];
  for (var key in _pageConfig.sampleB) {
    this.sampleBs[this.sampleBs.length] = new Stimulus(key, _pageConfig.sampleB[key]);
  }

  this.references = [];
  for (var key in _pageConfig.reference) {
    this.references[this.references.length] = new Stimulus(key, _pageConfig.reference[key]);
  }
  //this.reference = new Stimulus("reference", _pageConfig.reference);
  //shuffle(this.conditions);

  const indexs = [];
  for (let j = 0; j < this.sampleAs.length; j++) {
    indexs.push(j);
  }
  const shuffledindexs = shuffleArray(indexs);
  console.log("shuffledindexs:", shuffledindexs);
  for (var i = 0; i < this.sampleAs.length; ++i) {
    console.log("i:", i);
    console.log("index:", shuffledindexs[i]);
    var page = new PairedComparisonChangedPage(this.references[shuffledindexs[i]], this.sampleAs[shuffledindexs[i]], this.sampleBs[shuffledindexs[i]], _pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _errorHandler, _language);
    _pageManager.addPage(page);
  }
};
