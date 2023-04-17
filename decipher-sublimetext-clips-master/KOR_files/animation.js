function fnInitAnimation(_start, _distance, _speed, _delay){
  try{
    if (typeof _start != 'string'){
      _start = 'left';
      console.log('animation_start err')
    }
    if (typeof _distance != 'string'){
      _distance = '50%';
      console.log('animation_distance err')
    }
    if (typeof _speed != 'number'){
      _speed = 0.3;
      console.log('animation_speed err')
    }
    if (typeof _delay != 'number'){
      _delay = 0.05;
      console.log('animation_delay err')
    }
  } catch(e){
    _start = 'left';
    _distance = '50%';
    _speed = 0.3;
    _delay = 0.05;
    console.log('catch err') 
  }
    
  function fnDOMLoadStyle(){
    var translate_start, translate_end, keyframe_start, keyframe_end;
    switch(_start){
      case 'left':
        translate_start = 'translateX(-' + _distance + ');';
        translate_end = 'translateX(0%);';
        keyframe_start = 'opacity : 0; -webkit-transform : ' + translate_start + ' -moz-transform : ' + translate_start + ' -ms-transform : ' + translate_start + ' o-transform : ' + translate_start;
        keyframe_end = 'opacity : 1; -webkit-transform : ' + translate_end + ' -moz-transform : ' + translate_end + ' -ms-transform : ' + translate_end + ' -o-transform : ' + translate_end;
        break;
      case 'right':
        translate_start = 'translateX(' + _distance + ');';
        translate_end = 'translateX(0%);';
        keyframe_start = 'opacity : 0; -webkit-transform : ' + translate_start + ' -moz-transform : ' + translate_start + ' -ms-transform : ' + translate_start + ' o-transform : ' + translate_start;
        keyframe_end = 'opacity : 1; -webkit-transform : ' + translate_end + ' -moz-transform : ' + translate_end + ' -ms-transform : ' + translate_end + ' -o-transform : ' + translate_end;
        break;
      case 'top':
        translate_start = 'translateY(-' + _distance + ');';
        translate_end = 'translateY(0%);';
        keyframe_start = 'opacity : 0; -webkit-transform : ' + translate_start + ' -moz-transform : ' + translate_start + ' -ms-transform : ' + translate_start + ' o-transform : ' + translate_start;
        keyframe_end = 'opacity : 1; -webkit-transform : ' + translate_end + ' -moz-transform : ' + translate_end + ' -ms-transform : ' + translate_end + ' -o-transform : ' + translate_end;
        break;
      case 'bottom':
        translate_start = 'translateY(' + _distance + ');';
        translate_end = 'translateY(0%);';
        keyframe_start = 'opacity : 0; -webkit-transform : ' + translate_start + ' -moz-transform : ' + translate_start + ' -ms-transform : ' + translate_start + ' o-transform : ' + translate_start;
        keyframe_end = 'opacity : 1; -webkit-transform : ' + translate_end + ' -moz-transform : ' + translate_end + ' -ms-transform : ' + translate_end + ' -o-transform : ' + translate_end;
        break;
      case 'simple':
        _distance = '0%';
        _delay = 0;
        _speed = 0.2;
        translate_start = 'translateX(' + _distance + ');';
        translate_end = 'translateX(0%);';
        keyframe_start = 'opacity : 0; -webkit-transform : ' + translate_start + ' -moz-transform : ' + translate_start + ' -ms-transform : ' + translate_start + ' o-transform : ' + translate_start;
        keyframe_end = 'opacity : 1; -webkit-transform : ' + translate_end + ' -moz-transform : ' + translate_end + ' -ms-transform : ' + translate_end + ' -o-transform : ' + translate_end;
        break;
      default:
        _distance = '50%';
        _speed = 0.3;
        _delay = 0.05;
        translate_start = 'translateX(-' + _distance + '%);';
        translate_end = 'translateX(0%);';
        keyframe_start = 'opacity : 0; -webkit-transform : ' + translate_start + ' -moz-transform : ' + translate_start + ' -ms-transform : ' + translate_start + ' o-transform : ' + translate_start;
        keyframe_end = 'opacity : 1; -webkit-transform : ' + translate_end + ' -moz-transform : ' + translate_end + ' -ms-transform : ' + translate_end + ' -o-transform : ' + translate_end;
    }
    for(k = 0; k < document.querySelectorAll('style').length; k++){
      if (document.querySelectorAll('style')[k].getAttribute('media') == null){
       document.querySelectorAll('style')[k].innerHTML = document.querySelectorAll('style')[k].innerHTML + '@keyframes DOMLoad {0%{' + keyframe_start + '}100%{' + keyframe_end + '}}@keyframes DOMLoad_Hidden {0%{opacity : 0;}100%{opacity : 1;}}@keyframes DOMLoad_SurveyError{0%{opacity : 0; -webkit-transform : translateY(-50%); -moz-transform : translateY(-50%); -ms-transform : translateY(-50%); -o-transform : translateY(-50%);}100%{opacity : 1; -webkit-transform : translateY(0%); -moz-transform : translateY(0%); -ms-transform : translateY(0%); -o-transform : translateY(0%);}}@keyframes DOMLoad_SurveyError_Hidden{0%{opacity : 0;}100%{opacity : 1;}}@keyframes DOMLoad_SurveyButton{0%{opacity : 0; -webkit-transform : translateY(25%); -moz-transform : translateY(25%); -ms-transform : translateY(25%); -o-transform : translateY(25%);}100%{opacity : 1; -webkit-transform : translateY(0%); -moz-transform : translateY(0%); -ms-transform : translateY(0%); -o-transform : translateY(0%);}}';
       break;
      }
    }
  }
  var numCount = 0;
  var target = document;
  var arrDecipherClass = [
        "question-text",
        "comment",
        "instruction-text",
        "question-error",
        "answers-table",
        "surveyWarning",
        "survey-info",
  ]
  var observer = new MutationObserver(function(mutatios) {
    // try{
      for (p = 0; p < arrDecipherClass.length; p++){
        for (q = 0; q < document.getElementsByClassName(arrDecipherClass[p]).length; q++){
          if (document.getElementsByClassName(arrDecipherClass[p])[q].getAttribute('class').indexOf('fadeIn') == -1){
            document.getElementsByClassName(arrDecipherClass[p])[q].classList.add('fadeIn');
            document.getElementsByClassName(arrDecipherClass[p])[q].style.opacity = '0';
          }
        }
      }
      for (aa = 0; aa < document.querySelectorAll('.atm1d_tiled .answers-list').length; aa++){
        if (document.querySelectorAll('.atm1d_tiled .answers-list')[aa].getAttribute('class').indexOf('fadeIn') == -1){
          document.querySelectorAll('.atm1d_tiled .answers-list')[aa].classList.add('fadeIn');
          document.querySelectorAll('.atm1d_tiled .answers-list')[aa].style.opacity = '0';
        }
      }
      if (document.querySelector('#primary .survey-error') && document.querySelector('#primary .survey-error').getAttribute('class').indexOf('fadeIn') == -1){
        document.querySelector('#primary .survey-error').classList.add('fadeIn');
        document.querySelector('#primary .survey-error').style.opacity = '0';
      }
      for (h = 0; h < document.getElementsByClassName('survey-buttons').length; h++){
        if (document.getElementsByClassName('survey-buttons')[h].getAttribute('class').indexOf('fadeIn') == -1){
          document.getElementsByClassName('survey-buttons')[h].classList.add('fadeIn');
          document.getElementsByClassName('survey-buttons')[h].style.opacity = '0';
        }
      }
      if (document.getElementsByClassName('sq-ranksort-container')){
        for (e = 0; e < document.getElementsByClassName('sq-ranksort-container').length; e++){
          var objRankSort = document.getElementsByClassName('sq-ranksort-container')[e].parentNode;
          for(f = 0; f < objRankSort.children.length; f++){
            if ((objRankSort.children[f].getAttribute('class').indexOf('sq-ranksort-warning') == -1 || objRankSort.children[f].getAttribute('class').indexOf('sq-ranksort-dropdowns-container') == -1) && objRankSort.children[f].getAttribute('class').indexOf('fadeIn') == -1){
              objRankSort.children[f].classList.add('fadeIn');
              objRankSort.children[f].style.opacity = '0';
            }
          }
        }
      }
      if (document.querySelectorAll('#primary .question')[numCount] != undefined){
        var strLabel = document.querySelectorAll('#primary .question')[numCount].getAttribute('id').split('question_')[1];
        if(document.querySelectorAll('#primary .question')[numCount + 1]){
          numCount++;
        }
        else{
          for (v = numCount - 1; v >= 0; v--){
            var numPrevErrorCheck = 2;
            for (n = 0; n < document.querySelectorAll('#primary .question')[v].children.length; n++){
              if (n <= numPrevErrorCheck && document.querySelectorAll('#primary .question')[v].children[n].tagName != "STYLE" && document.querySelectorAll('#primary .question')[v].children[n].getAttribute('class').indexOf('question-error') != -1){
                numPrevErrorCheck++;
              }
              if (n <= numPrevErrorCheck && document.querySelectorAll('#primary .question')[v].children[n].tagName == "STYLE"){
                numPrevErrorCheck++;
              }
            }
            if (numPrevErrorCheck <= document.querySelectorAll('#primary .question')[v].children.length && document.querySelectorAll('#primary .question')[v].children[numPrevErrorCheck].hasAttribute('class') && document.querySelectorAll('#primary .question')[v].children[numPrevErrorCheck].getAttribute('class') != 'dq-videoplayer-player'){
              var prevScrap = document.querySelectorAll('#primary .question')[v].children[numPrevErrorCheck];
              for (n = 0; n < prevScrap.children.length; n++) {
                if (prevScrap.children[n].getAttribute('class').indexOf('fadeIn') == -1){
                  prevScrap.children[n].classList.add('fadeIn');
                  prevScrap.children[n].style.opacity = '0';
                }
              }
            }
          }
          var numErrorCheck = 2;
          for (m = 0; m < document.querySelectorAll('#primary .question')[numCount].children.length; m++){
            if (m <= numErrorCheck && document.querySelectorAll('#primary .question')[numCount].children[m].tagName != "STYLE" && document.querySelectorAll('#primary .question')[numCount].children[m].getAttribute('class').indexOf('question-error') != -1){
              numErrorCheck++;
            }
            if (m <= numErrorCheck && document.querySelectorAll('#primary .question')[numCount].children[m].tagName == "STYLE"){
              numErrorCheck++;
            }
          }
          if (numErrorCheck <= document.querySelectorAll('#primary .question')[numCount].children.length && document.querySelectorAll('#primary .question')[numCount].children[numErrorCheck].hasAttribute('class') && document.querySelectorAll('#primary .question')[numCount].children[numErrorCheck].getAttribute('class') != 'dq-videoplayer-player'){
            var scrap = document.querySelectorAll('#primary .question')[numCount].children[numErrorCheck];
            for (n = 0; n < scrap.children.length; n++) {
              if (scrap.children[n].getAttribute('class') && scrap.children[n].getAttribute('class').indexOf('fadeIn') == -1){
                scrap.children[n].classList.add('fadeIn');
                scrap.children[n].style.opacity = '0';
              }
            }
          }
        }
      }

      for (ab = 0; ab < document.querySelectorAll('.fadeOff').length; ab++){
        document.querySelectorAll('.fadeOff')[ab].style.opacity = '';
        document.querySelectorAll('.fadeOff')[ab].style.transform = '';
        document.querySelectorAll('.fadeOff')[ab].style.animation = '';
        for (ac = 0; ac < document.querySelectorAll('.fadeOff')[ab].querySelectorAll('.fadeIn').length; ac++){
          document.querySelectorAll('.fadeOff')[ab].querySelectorAll('.fadeIn')[ac].style.opacity = '';
          document.querySelectorAll('.fadeOff')[ab].querySelectorAll('.fadeIn')[ac].style.transform = '';
          document.querySelectorAll('.fadeOff')[ab].querySelectorAll('.fadeIn')[ac].style.animation = '';
        }
      }
    // } catch(e){
    //   console.log("animation check")
    // }
      
  })
  var config = {
    childList: true,
    attributes: true,
    subtree: true
  }
  observer.observe(target, config);
  window.addEventListener("DOMContentLoaded", function(){
    var numSetTime = 0;
    observer.disconnect();
    fnDOMLoadStyle();
    while(document.querySelectorAll('.fadeOff .fadeIn').length != 0){
      document.querySelectorAll('.fadeOff .fadeIn')[0].classList.remove('fadeIn');
    }
    while(document.querySelectorAll('.fadeOff').length != 0){
      document.querySelectorAll('.fadeOff')[0].classList.remove('fadeIn');
      document.querySelectorAll('.fadeOff')[0].classList.remove('fadeOff');
    }
    for (i = 0; i < document.getElementsByClassName('fadeIn').length; i++){
      if (document.querySelectorAll('#primary .devContainer .fadeIn')[i] != null){
        if(document.getElementsByClassName('fadeIn')[i].getAttribute('class').indexOf('survey-error') != -1){
          document.getElementsByClassName('fadeIn')[i].style.animation = 'DOMLoad_SurveyError_Hidden 0.2s 0s 1 forwards';
          document.getElementsByClassName('fadeIn')[i].style.transform = '';
        }
        else{
          document.getElementsByClassName('fadeIn')[i].style.animation = 'DOMLoad_Hidden 0.2s 0s 1 forwards';
        }
      }
      else {
        var objSelector = document.getElementsByClassName('fadeIn')[i];
        if(objSelector.getAttribute('class').indexOf('survey-error') != -1){
          objSelector.style.animation = 'DOMLoad_SurveyError 0.5s ' + numSetTime + 's 1 forwards';
        }
        else if(objSelector.getAttribute('class').indexOf('survey-buttons') != -1){
          objSelector.style.animation = 'DOMLoad_SurveyButton 0.3s ' + numSetTime + 's 1 forwards';
        }
        else{
          objSelector.style.animation = 'DOMLoad ' + _speed + 's ' + numSetTime + 's 1 forwards';
        }
        numSetTime += _delay;
      }
    }
    setTimeout(function(){
      for (j = 0; j < document.getElementsByClassName('fadeIn').length; j++){
        document.getElementsByClassName('fadeIn')[j].style.opacity = '';
        document.getElementsByClassName('fadeIn')[j].style.animation = '';
      }
    }, (numSetTime * 1000) + (_speed * 1000) + 200)
  })
}

const fnGridTopFix = () => {
  if (document.querySelectorAll('#primary .answers').length == 1 && document.querySelector('.unused')){
    const fnScrollSet = () => {
      let objTarget = document.getElementById('TableWrap');
      let objTable = document.querySelector('#primary .answers');
      let numDynamicPos = objTable.getBoundingClientRect();
      let numStaticPosLeft = objTable.offsetLeft;
      objTarget.querySelector('.unused').style.width = getComputedStyle(objTable.querySelector('.unused')).width;
      if (objTable.className.indexOf('answers-table') !== -1){
        objTarget.style.left = numDynamicPos.left + 'px';
        objTarget.style.width = getComputedStyle(objTable).width;
        objTarget.querySelector('.answers').className = objTable.className;
        objTarget.querySelector('.answers table').className = objTable.querySelector('table').className;
        for(let [index, value] of document.querySelectorAll('#TableWrap .answers th').entries()){
          value.style.width = getComputedStyle(document.querySelectorAll('#primary .answers tbody')[0].querySelectorAll('th')[index]).width;
          value.style.minWidth = getComputedStyle(document.querySelectorAll('#primary .answers tbody')[0].querySelectorAll('th')[index]).width;
        }
        if (objTable.parentNode.querySelector('.survey-info')){
          objTarget.style.display = 'none';
          objTarget.style.top = numDynamicPos.top + 'px';
        }
        else if (objTable.parentNode.querySelector('.surveyWarning')){
          objTarget.style.display = 'none';
          objTarget.style.top = numDynamicPos.top + 'px';
        }
        else if (numDynamicPos.top < 0){
          objTarget.style.display = 'block';
          objTarget.style.top = '0px';
        }
        else {
          objTarget.style.display = 'none';
          objTarget.style.top = numDynamicPos.top + 'px';
        }
      }
      else if (objTable.className.indexOf('answers-list') !== -1){
        objTarget.style.display = 'none';
        objTarget.style.top = '0px';
      }
      else {
        objTarget.style.display = 'none';
        objTarget.style.top = '0px';
      }
    }
    let objTableWrap = document.createElement('div');
    objTableWrap.id = 'TableWrap';
    objTableWrap.style.position = 'fixed';
    objTableWrap.style.display = 'none';
    objTableWrap.style.zIndex = '100';
    document.body.appendChild(objTableWrap);
    let objCopyTarget = document.querySelector('#primary .answers');
    let objTableCopy = objCopyTarget.cloneNode(true);
    objTableWrap.appendChild(objTableCopy);
    for(let [index, value] of objTableWrap.querySelectorAll('.fadeIn').entries()){
      value.classList.remove('fadeIn');
      value.style.opacity = '';
      value.style.animation = '';
    }
    let objAnimationTimer;
    objCopyTarget.addEventListener('animationstart', (event) => {
      if (objAnimationTimer === undefined){
        objAnimationTimer = setInterval(() => {
          objTableWrap.style.left = objCopyTarget.getBoundingClientRect().left + 'px';
          objTableWrap.style.opacity = getComputedStyle(objCopyTarget).opacity;
        }, 10);
      }
    })
    objCopyTarget.addEventListener('animationend', (event) => {
      objTableWrap.style.left = objCopyTarget.getBoundingClientRect().left + 'px';
      objTableWrap.style.opacity = getComputedStyle(objCopyTarget).opacity;
      clearInterval(objAnimationTimer);
    })
    for (let [index, value] of document.querySelectorAll('#TableWrap .answers tbody').entries()){
      if (index === 0){
        value.style.border = 'solid 1px transparent';
      }
      else {
        value.remove();
      }
    }
    fnScrollSet();
    if (!document.getElementById('surveyContainer')){
      window.addEventListener('scroll', fnScrollSet);
    }
    else {
      document.getElementById('surveyContainer').addEventListener('scroll', fnScrollSet);
    }
    window.addEventListener('resize', fnScrollSet);
    window.addEventListener('touchstart', fnScrollSet);
    window.addEventListener('touchmove', fnScrollSet);
    window.addEventListener('touchend', fnScrollSet);
    window.addEventListener('orientationchange', () => {
      setTimeout(fnScrollSet, 200)
    });
    const objMainTarget = document.querySelector('#primary .answers');
    let observer = new MutationObserver(function(mutatios){
      if (document.querySelectorAll('#primary .answers').length == 1 && document.querySelector('.unused')){
        fnScrollSet();
      }
    })
    let config = {
      childList: true,
      attributes: true,
      subtree: true
    }
    observer.observe(objMainTarget, config);
  }
}