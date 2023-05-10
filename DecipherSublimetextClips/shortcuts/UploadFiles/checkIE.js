// browser checking
function blockIE(){
  var agent = navigator.userAgent.toLowerCase();
  var surveyBody = document.querySelector(".survey-body");
  var decipherForm = document.querySelector("#primary");
  var blockIe = document.querySelector(".block-ie");
  if( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
    surveyBody.removeChild(decipherForm);
    surveyBody.appendChild(blockIe);

    blockIe.classList.remove("hidden");
    blockIe.style.fontSize = "1.5rem";
    blockIe.style.fontWeight = "bold";
    blockIe.style.textAlign = "center";
    blockIe.style.marginTop = "30px";
  }else{
    blockIe.remove();
  }
}
