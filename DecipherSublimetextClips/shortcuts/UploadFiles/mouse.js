// image-pop
(function(){
  function fnImagePopStyle(){
    for(k = 0; k < document.querySelectorAll('style').length; k++){
      if (document.querySelectorAll('style')[k].getAttribute('media') == null){
       document.querySelectorAll('style')[k].innerHTML = document.querySelectorAll('style')[k].innerHTML + '@keyframes pop_enter{0%{box-shadow : 5px 5px 15px rgba(0, 0, 0, 0);-webkit-transform : perspective(600px) rotate3d(0, 0, 0, 0deg) scale(1.0);-moz-transform : perspective(600px) rotate3d(0, 0, 0, 0deg) scale(1.0);-ms-transform : perspective(600px) rotate3d(0, 0, 0, 0deg) scale(1.0);-o-transform : perspective(600px) rotate3d(0, 0, 0, 0deg) scale(1.0);}100%{box-shadow : 5px 5px 15px rgba(0, 0, 0, 0.4);-webkit-transform : perspective(600px) rotate3d(1, -1, 0, 10deg) scale(1.03);-moz-transform : perspective(600px) rotate3d(1, -1, 0, 10deg) scale(1.03);-ms-transform : perspective(600px) rotate3d(1, -1, 0, 10deg) scale(1.03);-o-transform : perspective(600px) rotate3d(1, -1, 0, 10deg) scale(1.03);}}@keyframes pop_leave{0%{box-shadow : 5px 5px 15px rgba(0, 0, 0, 0.4);-webkit-transform : perspective(600px) rotate3d(1, -1, 0, 10deg) scale(1.03);-moz-transform : perspective(600px) rotate3d(1, -1, 0, 10deg) scale(1.03);-ms-transform : perspective(600px) rotate3d(1, -1, 0, 10deg) scale(1.03);-o-transform : perspective(600px) rotate3d(1, -1, 0, 10deg) scale(1.03);}100%{box-shadow : 5px 5px 15px rgba(0, 0, 0, 0);-webkit-transform : perspective(600px) rotate3d(0, 0, 0, 0deg) scale(1.0);-moz-transform : perspective(600px) rotate3d(0, 0, 0, 0deg) scale(1.0);-ms-transform : perspective(600px) rotate3d(0, 0, 0, 0deg) scale(1.0);-o-transform : perspective(600px) rotate3d(0, 0, 0, 0deg) scale(1.0);}}@keyframes pop_clickOn{0%{opacity : 0;}100%{opacity : 1;}}@keyframes pop_clickOff{0%{opacity : 1;z-index : 100;}100%{opacity : 0;z-index : -1;}}';
       break;
      }
    }
  }
  function fnResize(){
    if (document.getElementById('clickWrap') != null){
      var objClickImage = document.querySelectorAll('#clickWrap img')[0];
      objClickImage.style.width = '';
      objClickImage.style.height = '';
      var numWindowWidth = 'onorientationchange' in window ? screen.availWidth : window.innerWidth;
      var numWindowHeight = 'onorientationchange' in window ? screen.availHeight : window.innerHeight;
      if (numWindowWidth >= numWindowHeight) {
       objClickImage.style.width = '';
       objClickImage.style.height = '100%';
      }
      else {
       objClickImage.style.width = '100%';
       objClickImage.style.height = '';
      }
    }
  }
  function fnOrientation(){
    var objMobileRotate = setTimeout(
      fnResize
    , 100);
  }
  function fnClickCheck(){
    var objClickWrap = document.getElementById('clickWrap');
    var numCurOpacity = Number(getComputedStyle(objClickWrap).opacity);
    if (numCurOpacity == 1) {
      objClickWrap.style.animation = 'pop_clickOff 0.2s 1 forwards linear';
    }
    else if (numCurOpacity == 0) {
      objClickWrap.style.zIndex = 100;
      objClickWrap.style.animation = 'pop_clickOn 0.2s 1 forwards linear';
    }
  }
  window.addEventListener('resize', function(){
    fnResize();
  })
  window.addEventListener('load', function(){
      for (i = 0; i < document.querySelectorAll('.imgpop img').length; i++){
        if (document.getElementById('clickWrap') == null){
          fnImagePopStyle();
          var objClickWrap = document.createElement('div');
          var objClickImage = document.createElement('img');
          objClickWrap.id = 'clickWrap';
          objClickWrap.appendChild(objClickImage);
          document.body.appendChild(objClickWrap);
          objClickWrap.oncontextmenu = function(){ return false; }
          objClickWrap.onselectstart = function(){ return false; }
          objClickWrap.ondragstart = function(){ return false; }
          objClickWrap.onscroll = function(){ return false; }
          objClickWrap.setAttribute('style',
'\
position : fixed; \
display : block; \
width : 100%; \
height : 100%; \
left : 0%; \
top : 0%; \
cursor : pointer; \
background-color : rgba(0, 0, 0, 0.4); \
z-index : -1; \
opacity : 0;\
'
            );
          objClickImage.setAttribute('style',
'\
position : absolute; \
display : block; \
left : 50%; \
top : 50%; \
-webkit-transform : translate(-50%, -50%); \
-moz-transform : translate(-50%, -50%); \
-ms-transform : translate(-50%, -50%); \
-o-transform : translate(-50%, -50%); \
'
          );
          if ('onorientationchange' in window){
            window.addEventListener('orientationchange', function(e){
              fnOrientation(e);
            })
          }
          objClickWrap.addEventListener('click', function(){
            fnClickCheck();
          })
          objClickImage.addEventListener('load', function(){
            fnResize();
            fnClickCheck();
          })
        }
        var objPop = document.querySelectorAll('.imgpop img')[i];
        objPop.setAttribute('style', 
'\
cursor : pointer; \
-webkit-transform-origin : center; \
-moz-transform-origin : center; \
-ms-transform-origin : center; \
-o-transform-origin : center; \
-webkit-transform : perspective(600px) scale(1.0); \
-moz-transform : perspective(600px) scale(1.0); \
-ms-transform : perspective(600px) scale(1.0); \
-o-transform : perspective(600px) scale(1.0); \
'
        );
        // objPop.addEventListener('mouseenter', function(){
        //   this.style.animation = 'pop_enter 0.1s 1 forwards';
        // })
        // objPop.addEventListener('mouseleave', function(){
        //   this.style.animation = 'pop_leave 0.1s 1 forwards';
        // })
        objPop.addEventListener('click', function(){
          if (this.getAttribute('path') == null){
            document.querySelectorAll('#clickWrap img')[0].src = this.getAttribute('src');
          }
          else{
            document.querySelectorAll('#clickWrap img')[0].src = this.getAttribute('path');
          }
        })
      }
  })
})();

// image-zoom
function fnImageZoom(_click){
  function fnCustomClick(_target, _posX, _posY){
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: _posX,
      clientY: _posY,
    })
    var clickPos = document.elementFromPoint(_posX, _posY);
    clickPos.dispatchEvent(evt);
  }
  function fnPullZoomClass(_obj){
    var strResult = null;
    for (idx = 0; idx < document.getElementsByClassName('zoom').length; idx++){
      if (document.querySelectorAll('.zoom img')[idx] == _obj){
        strResult = document.querySelectorAll('.zoom')[idx].getAttribute('class');
        break;
      }
    }
    return strResult;
  }
  function fnZoom(_target, _wrap, _image, _event, _touchPlatform){
    var strClassName = fnPullZoomClass(_target);
    var strViewPos = strClassName.indexOf('pos_') != -1 ? strClassName.split('pos_')[1].split(' ')[0] : 'default';
    var numMagnification = 3.0;
    var numSpace = 20;
    var numTouchWidth = Number(getComputedStyle(_target).width.split('px')[0]);
    var numTouchHeight = Number(getComputedStyle(_target).height.split('px')[0]);
    if (_touchPlatform){
      var numWrapCustomWidth = strClassName.indexOf('mWidth_') != -1 && !isNaN(strClassName.split('mWidth_')[1].split(' ')[0]) ? Number(strClassName.split('mWidth_')[1].split(' ')[0]) : numTouchWidth;
      var numWrapCustomHeight = strClassName.indexOf('mHeight_') != -1 && !isNaN(strClassName.split('mHeight_')[1].split(' ')[0]) ? Number(strClassName.split('mHeight_')[1].split(' ')[0]) : numTouchHeight;
    }
    else{
      var numWrapCustomWidth = strClassName.indexOf('pWidth_') != -1 && !isNaN(strClassName.split('pWidth_')[1].split(' ')[0]) ? Number(strClassName.split('pWidth_')[1].split(' ')[0]) : numTouchWidth;
      var numWrapCustomHeight = strClassName.indexOf('pHeight_') != -1 && !isNaN(strClassName.split('pHeight_')[1].split(' ')[0]) ? Number(strClassName.split('pHeight_')[1].split(' ')[0]) : numTouchHeight;
    }
    if (strClassName.indexOf('redDot') != -1){
      document.getElementById('redDot').style.display = 'block';
    }
    if (strClassName.indexOf('sight_') != -1){
      numMagnification = Number(strClassName.split('sight_')[1].split(' ')[0]);
    }
    switch(strViewPos){
      case 'left' :
        _wrap.style.transformOrigin = 'center right';
        _wrap.style.left = _target.getBoundingClientRect().left - numSpace - numWrapCustomWidth - (Number(getComputedStyle(document.getElementById('zoomWrap')).borderWidth.split('px')[0]) * 2) + 'px';
        _wrap.style.top = _target.getBoundingClientRect().top - Number(getComputedStyle(document.getElementById('zoomWrap')).borderWidth.split('px')[0]) + ((numTouchHeight / 2) - (numWrapCustomHeight / 2)) + 'px';
        break;
      case 'right' :
        _wrap.style.transformOrigin = 'center left';
        _wrap.style.left = _target.getBoundingClientRect().left + numSpace + numTouchWidth + 'px';
        _wrap.style.top = _target.getBoundingClientRect().top - Number(getComputedStyle(document.getElementById('zoomWrap')).borderWidth.split('px')[0]) + ((numTouchHeight / 2) - (numWrapCustomHeight / 2)) + 'px';
        break;
      case 'top' :
        _wrap.style.transformOrigin = 'center bottom';
        _wrap.style.left = _target.getBoundingClientRect().left - Number(getComputedStyle(document.getElementById('zoomWrap')).borderWidth.split('px')[0]) + ((numTouchWidth / 2) - (numWrapCustomWidth / 2)) + 'px';
        _wrap.style.top = _target.getBoundingClientRect().top - numSpace - numWrapCustomHeight - (Number(getComputedStyle(document.getElementById('zoomWrap')).borderWidth.split('px')[0]) * 2) + 'px';
        break;
      case 'bottom' :
        _wrap.style.transformOrigin = 'center top';
        _wrap.style.left = _target.getBoundingClientRect().left - Number(getComputedStyle(document.getElementById('zoomWrap')).borderWidth.split('px')[0]) + ((numTouchWidth / 2) - (numWrapCustomWidth / 2)) + 'px';
        _wrap.style.top = _target.getBoundingClientRect().top + numSpace + numTouchHeight + 'px';
        break;
      case 'cursor' :
        _wrap.style.transformOrigin = 'top left';
        _wrap.style.left = _event.clientX + 15 + 'px';
        _wrap.style.top = _event.clientY + 15 + 'px';
        break;
      case 'fix' :
        _wrap.style.transformOrigin = 'top left';
        _wrap.style.left = 'onorientationchange' in window ? screen.availWidth - numWrapCustomWidth - 40 + 'px' : window.innerWidth - numWrapCustomWidth - 40 + 'px';
        _wrap.style.top = 'onorientationchange' in window ? screen.availHeight - numWrapCustomHeight - 40 + 'px' : window.innerHeight - numWrapCustomHeight - 40 + 'px';
        break;
      case 'default' :
        _wrap.style.transformOrigin = 'center left';
        _wrap.style.left = _target.getBoundingClientRect().left + numSpace + numTouchWidth + 'px';
        _wrap.style.top = _target.getBoundingClientRect().top - Number(getComputedStyle(document.getElementById('zoomWrap')).borderWidth.split('px')[0]) + ((numTouchHeight / 2) - (numWrapCustomHeight / 2)) + 'px';
        break;                    
    }
      //화면 터치일 경우 위치 강제 고정
      if (_touchPlatform){
        _wrap.style.transformOrigin = 'center bottom';
        _wrap.style.left = _event.touches[0].clientX - (numWrapCustomWidth / 2) + 'px';
        _wrap.style.top = _event.touches[0].clientY - (numWrapCustomHeight + 40) +  'px';
      }
      _wrap.style.width = numWrapCustomWidth + 'px';
      _wrap.style.height = numWrapCustomHeight + 'px';
      _image.style.width = numTouchWidth * numMagnification + 'px';
      _image.style.height = numTouchHeight * numMagnification + 'px';
  
      _image.style.left = _touchPlatform ? ((_target.getBoundingClientRect().left - _event.touches[0].clientX) / numTouchWidth * -1) * (numTouchWidth * numMagnification) * -1 + (numWrapCustomWidth / 2) + 'px' : (_event.offsetX / numTouchWidth)  * (numTouchWidth * numMagnification) * -1 + (numWrapCustomWidth / 2) + 'px';
      _image.style.top = _touchPlatform ? ((_target.getBoundingClientRect().top - _event.touches[0].clientY) / numTouchHeight * -1) * (numTouchHeight * numMagnification) * -1 + (numWrapCustomHeight / 2) + 'px' : (_event.offsetY / numTouchHeight)  * (numTouchHeight * numMagnification) * -1 + (numWrapCustomHeight / 2) + 'px';
  }
  function fnImageZoomStyle(){
    for(k = 0; k < document.querySelectorAll('style').length; k++){
      if (document.querySelectorAll('style')[k].getAttribute('media') == null){
       document.querySelectorAll('style')[k].innerHTML = document.querySelectorAll('style')[k].innerHTML + '@keyframes zoom_enter{0%{opacity : 0; box-shadow : 5px 5px 10px rgba(0, 0, 0, 0.0); -webkit-transform : scale(1.5); -moz-transform : scale(1.5); -ms-transform : scale(1.5); -o-transform : scale(1.5);}100%{opacity : 1; box-shadow : 5px 5px 10px rgba(0, 0, 0, 0.4); -webkit-transform : scale(1.0); -moz-transform : scale(1.0); -ms-transform : scale(1.0); -o-transform : scale(1.0);}}';
       break;
      }
    }
  }
  var strMobilePlatform = 'ontouchstart' in document.documentElement ? true : false;
  if (document.getElementsByClassName('zoom').length != 0) {
    var strLabel = document.querySelectorAll('#primary .question')[0].getAttribute('id').split('_')[1];
    if (document.getElementById('zoomWrap') == null){
      fnImageZoomStyle();
      var objZoomWrap = document.createElement('div');
      var objZoomImage = document.createElement('img');
      var objRedDot = document.createElement('div');
      objZoomWrap.id = 'zoomWrap';
      objZoomWrap.appendChild(objZoomImage);
      objRedDot.id = 'redDot';
      objZoomWrap.appendChild(objRedDot);
      document.body.appendChild(objZoomWrap);
      objZoomWrap.oncontextmenu = function(){ return false; };
      objZoomWrap.onselectstart = function(){ return false; };
      objZoomWrap.ondragstart = function(){ return false; };
      objZoomWrap.onscroll = function(){ return false; };
      objZoomImage.setAttribute('style',
'\
position : absolute; \
display : block; \
width : 0px; \
height : 0px; \
left : 0px; \
top : 0px; \
'
        );
      objRedDot.setAttribute('style',
'\
position : absolute; \
display : none; \
width : 4px; \
height : 4px; \
left : 50%; \
top : 50%; \
background-color : red; \
border-radius : 100%; \
-webkit-transform : translate(-50%, -50%); \
-moz-transform : translate(-50%, -50%); \
-ms-transform : translate(-50%, -50%); \
-o-transform : translate(-50%, -50%); \
z-index : 50;\
'
        );
      objZoomWrap.setAttribute('style',
'\
position : fixed; \
display : none; \
width : 0px; \
height : 0px; \
left : 0px; \
top : 0px; \
border : solid 2px black; \
border-radius : 25px; \
box-sizing : content-box; \
background-color : white; \
overflow : hidden; \
z-index : 20;\
'
      );

      window.addEventListener('mousemove', function(e){
        if (e.target.tagName != 'IMG'){
          objZoomWrap.style.display = 'none';
          objRedDot.style.display = 'none';
          objZoomWrap.style.animation = '';
          objZoomImage.removeAttribute('src');
        }
      })
      objZoomWrap.addEventListener('click', function(){
        objZoomWrap.style.display = 'none';
        objRedDot.style.display = 'none';
        objZoomWrap.style.animation = '';
      })
      objZoomImage.addEventListener('load', function(){
        objZoomWrap.style.display = 'block';
        objZoomWrap.style.animation = 'zoom_enter 0.2s 1 forwards';
      })
    }
    var bolClickActivate = _click == undefined || _click == null || _click == false ? false : true
    for (i = 0; i < document.querySelectorAll('.zoom img').length; i++){
      var objTouchImg = document.querySelectorAll('.zoom img')[i];
      var objTouchParent = objTouchImg.parentNode;
      while(objTouchParent.tagName !== 'HTML'){
        if(objTouchParent.hasAttribute('title')) objTouchParent.removeAttribute('title');
        objTouchParent = objTouchParent.parentNode;
      }
      objTouchImg.oncontextmenu = function(){ return false; };
      objTouchImg.onselectstart = function(){ return false; };
      objTouchImg.ondragstart = function(){ return false; };
      objTouchImg.setAttribute('oncontextmenu', 'return false');
      objTouchImg.style.webkittouchCallout = "none"
      objTouchImg.style.userSelect = 'none';

      objTouchImg.addEventListener('mouseenter', function(event){
        var strSourceExtension = this.getAttribute('src') != null ? this.getAttribute('src').split('.')[this.getAttribute('src').split('.').length - 1] : "None";
        var strPath = '';
        if(strSourceExtension == 'None'){
          strPath = 'The path could not be resolved';
        }
        else if(strSourceExtension == 'gif'){
          strPath = window.location.protocol + '//' + window.location.host + this.style.backgroundImage.split('url(')[1].substr(1, this.style.backgroundImage.split('url(')[1].length - 3)
        }
        else{
          strPath = this.getAttribute('src');
        }
        objZoomImage.setAttribute('src', strPath);
        fnZoom(this, objZoomWrap, objZoomImage, event, false);
      });
      objTouchImg.addEventListener('mousemove', function(event){
        fnZoom(this, objZoomWrap, objZoomImage, event, false);
      });
      objTouchImg.addEventListener('mouseleave', function(){
        objZoomWrap.style.display = 'none';
        objRedDot.style.display = 'none';
        objZoomWrap.style.animation = '';
      });
      // 터치가 가능한 플랫폼일 경우 터치이벤트 추가
      if (strMobilePlatform){
        objTouchImg.addEventListener('touchstart', function(event){
          var strSourceExtension = this.getAttribute('src') != null ? this.getAttribute('src').split('.')[this.getAttribute('src').split('.').length - 1] : "None";
          var strPath = '';
          if(strSourceExtension == 'None'){
            strPath = 'The path could not be resolved';
          }
          else if(strSourceExtension == 'gif'){
            strPath = window.location.protocol + '//' + window.location.host + this.style.backgroundImage.split('url(')[1].substr(1, this.style.backgroundImage.split('url(')[1].length - 3)
          }
          else{
            strPath = this.getAttribute('src');
          }
          objZoomImage.setAttribute('src', strPath);
          fnZoom(this, objZoomWrap, objZoomImage, event, true);
        });
        objTouchImg.addEventListener('touchmove', function(event){
          event.preventDefault();
          fnZoom(this, objZoomWrap, objZoomImage, event, true);
        });
        objTouchImg.addEventListener('touchend', function(event){
          event.preventDefault();
          objZoomWrap.style.display = 'none';
          objRedDot.style.display = 'none';
          objZoomWrap.style.animation = '';
          if(bolClickActivate){
            fnCustomClick(this, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
          }
        });
        objTouchImg.addEventListener('touchcancle', function(event){
          event.preventDefault();
          objZoomWrap.style.display = 'none';
          objRedDot.style.display = 'none';
          objZoomWrap.style.animation = '';
        });
      }
      objTouchImg.addEventListener('click', function(){
        if(bolClickActivate){
          objZoomWrap.style.display = 'none';
          objRedDot.style.display = 'none';
          objZoomWrap.style.animation = '';
        }
      });
    }
  }
}

// 3D
(function(){
  function fn3DStyle(){
    for(k = 0; k < document.querySelectorAll('style').length; k++){
      if (document.querySelectorAll('style')[k].getAttribute('media') == null){
       document.querySelectorAll('style')[k].innerHTML = document.querySelectorAll('style')[k].innerHTML + '@keyframes threeD_enter{0%{-webkit-transform : scale(1.0);-moz-transform : scale(1.0);-ms-transform : scale(1.0);-o-transform : scale(1.0);}100%{-webkit-transform : scale(1.3);-moz-transform : scale(1.3);-ms-transform : scale(1.3);-o-transform : scale(1.3);}}@keyframes threeD_leave{0%{-webkit-transform : scale(1.3);-moz-transform : scale(1.3);-ms-transform : scale(1.3);-o-transform : scale(1.3);}100%{-webkit-transform : scale(1.0);-moz-transform : scale(1.0);-ms-transform : scale(1.0);-o-transform : scale(1.0);}}@keyframes threeD_clickOn{0%{opacity : 0;}100%{opacity : 1;}}@keyframes threeD_clickOff{0%{opacity : 1;z-index : 100;}100%{opacity : 0;z-index : -1;}}';
       break;
      }
    }
  }
  function fnResize(){
    if (document.getElementById('threeDClickWrap') != null){
      var objClickImage = document.querySelectorAll('#threeDClickWrap img')[0];
      objClickImage.style.width = '';
      objClickImage.style.height = '';
      var numWindowWidth = 'onorientationchange' in window ? screen.availWidth : window.innerWidth;
      var numWindowHeight = 'onorientationchange' in window ? screen.availHeight : window.innerHeight;
      if (numWindowWidth >= numWindowHeight) {
       objClickImage.style.width = '';
       objClickImage.style.height = '100%';
      }
      else {
       objClickImage.style.width = '100%';
       objClickImage.style.height = '';
      }
    }
  }
  function fnOrientation(){
    var objMobileRotate = setTimeout(
      fnResize
    , 100);
  }
  function fnEnterCheck(_this){
    for (m = 0; m < document.querySelectorAll('.hoverWrap .hoverTouch').length; m++){
      if (document.querySelectorAll('.hoverWrap .hoverTouch')[m] != _this && document.querySelectorAll('.hoverWrap')[m].style.animationName == 'threeD_enter'){
        document.querySelectorAll('.hoverWrap')[m].style.animation = 'threeD_leave 0.2s 1 forwards';
      }
    }
  }
  function fnClickCheck(){
    var objThreeDClickWrap = document.getElementById('threeDClickWrap');
    var numCurOpacity = Number(getComputedStyle(objThreeDClickWrap).opacity);
    if (numCurOpacity == 1) {
      objThreeDClickWrap.style.animation = 'threeD_clickOff 0.2s 1 forwards linear';
    }
    else if (numCurOpacity == 0) {
      objThreeDClickWrap.style.zIndex = 100;
      objThreeDClickWrap.style.animation = 'threeD_clickOn 0.2s 1 forwards linear';
    }
  }
  window.addEventListener('resize', function(){
    fnResize();
  })
  window.addEventListener('load', function(){
    if (document.getElementsByClassName('threeD').length != 0){
      if (document.getElementById('threeDClickWrap') == null){
        fn3DStyle();
        if ('onorientationchange' in window){
          window.addEventListener('orientationchange', function(e){
            fnOrientation(e);
          })
        }
        var obj3DClickWrap = document.createElement('div');
        var obj3DClickImage = document.createElement('img');
        obj3DClickWrap.id = 'threeDClickWrap';
        obj3DClickWrap.oncontextmenu = function(){ return false; };
        obj3DClickWrap.onselectstart = function(){ return false; };
        obj3DClickWrap.ondragstart = function(){ return false; };
        obj3DClickWrap.onscroll = function(){ return false; };
        obj3DClickImage.setAttribute('style',
'\
position : absolute; \
display : block; \
left : 50%; \
top : 50%; \
-webkit-transform : translate(-50%, -50%); \
-moz-transform : translate(-50%, -50%); \
-ms-transform : translate(-50%, -50%); \
-o-transform : translate(-50%, -50%); \
'
        );
        obj3DClickWrap.setAttribute('style',
'\
position : fixed; \
display : block; \
width : 100%; \
height : 100%; \
left : 0%; \
top : 0%; \
cursor : pointer; \
background-color : rgba(0, 0, 0, 0.4); \
z-index : -1; \
opacity : 0;\
'
        );
        obj3DClickWrap.appendChild(obj3DClickImage);
        document.body.appendChild(obj3DClickWrap);
        obj3DClickImage.addEventListener('load', function(){
          fnResize();
          fnClickCheck();
        })
        obj3DClickWrap.addEventListener('click', function(){
          fnClickCheck();
        })
      }
      for (i = 0; i < document.getElementsByClassName('threeD').length; i++){
        var objHoverWrap = document.createElement('div');
        var objHoverTouch = document.createElement('div');
        var objHoverSpot = document.createElement('div');
        var objHoverImage = document.querySelectorAll('.threeD img')[i];
        objHoverWrap.oncontextmenu = function(){ return false; }
        objHoverWrap.onselectstart = function(){ return false; }
        objHoverWrap.ondragstart = function(){ return false; }
        objHoverWrap.onscroll = function(){ return false; }
        objHoverWrap.className = 'hoverWrap';
        objHoverTouch.className = 'hoverTouch';
        objHoverSpot.className = 'hoverSpot';
        objHoverWrap.setAttribute('style',
'\
position : relative; \
display : block; \
width : 100%; \
height : 100%; \
transform-origin : center;\
'
        );
        objHoverTouch.setAttribute('style',
'\
position : absolute; \
display : block; \
width : ' + getComputedStyle(objHoverImage).width + '; \
height : ' + getComputedStyle(objHoverImage).height + '; \
left : 50%; \
top : 50%; \
-webkit-transform : translate(-50%, -50%); \
-moz-transform : translate(-50%, -50%); \
-ms-transform : translate(-50%, -50%); \
-o-transform : translate(-50%, -50%); \
z-index : 0; \
cursor : pointer; \
'
        );
        objHoverSpot.setAttribute('style',
'\
position : relative; \
display : block; \
z-index : 10; \
'
        );
        objHoverImage.setAttribute('style',
'\
-webkit-transform-origin : center; \
-moz-transform-origin : center; \
-ms-transform-origin : center; \
-o-transform-origin : center; \
'
        );
        objHoverWrap.appendChild(objHoverTouch);
        objHoverWrap.appendChild(objHoverSpot);
        objHoverImage.parentNode.appendChild(objHoverWrap);
        objHoverSpot.appendChild(objHoverImage);

        objHoverImage.addEventListener('mouseenter', function(e){
          var objCurrentWrap = this.parentNode.parentNode;
          var objCurrentSpot = objCurrentWrap.getElementsByClassName('hoverSpot')[0];
          var objCurrentTouch = objCurrentWrap.getElementsByClassName('hoverTouch')[0];
          objCurrentWrap.style.animation = 'threeD_enter 0.2s 1 forwards';
          objCurrentWrap.style.zIndex = 100;
          objCurrentTouch.style.zIndex = 10;
          objCurrentSpot.style.zIndex = 0;
          fnEnterCheck(objCurrentTouch)
        })
        objHoverTouch.addEventListener('mousemove', function(e){
          e.preventDefault();
          var numMouseHorizon = ((this.clientWidth / 2 - e.offsetX) * -1) / (this.clientWidth / 2);
          var numMouseVertical = ((this.clientHeight / 2 - e.offsetY)) / (this.clientHeight / 2);
          var numHorizonPer = Math.abs(numMouseHorizon * 45);
          var numVerticalPer = Math.abs(numMouseVertical * 45);
          var numResultPer = numHorizonPer >= numVerticalPer ? numHorizonPer : numVerticalPer;
          var numBrightness = 1 + (numMouseVertical * 0.4);
          this.parentNode.querySelectorAll('.hoverSpot img')[0].style.filter = 'brightness(' + numBrightness + ')';
          this.parentNode.querySelectorAll('.hoverSpot img')[0].style.transform = 'perspective(600px) rotate3D(' + numMouseVertical + ', ' + numMouseHorizon + ', 0, ' + numResultPer + 'deg)';
          fnEnterCheck(this)
        })
        objHoverTouch.addEventListener('click', function(){
          document.querySelectorAll('#threeDClickWrap img')[0].src = this.parentNode.querySelectorAll('.hoverSpot img')[0].getAttribute('src');
        })
        objHoverTouch.addEventListener('mouseleave', function(e){
          var objCurrentWrap = this.parentNode;
          var objCurrentSpot = objCurrentWrap.getElementsByClassName('hoverSpot')[0];
          var objCurrentTouch = this;
          objCurrentWrap.style.animation = 'threeD_leave 0.2s 1 forwards';
          objCurrentWrap.style.zIndex = 0;
          objCurrentTouch.style.zIndex = 0;
          objCurrentSpot.style.zIndex = 10;
          objCurrentSpot.getElementsByTagName('img')[0].style.filter = '';
          objCurrentSpot.getElementsByTagName('img')[0].style.transform = '';
        })
      }
    }
  })
})();