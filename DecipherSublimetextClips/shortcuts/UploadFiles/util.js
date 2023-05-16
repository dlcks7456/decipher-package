// range for js
function range(start, end) {
  let array = [];
  for (let i = start; i < end; ++i) {
    array.push(i);
  }
  return array;
}


// grid rank
function gridRankSetting(rankClass, noneRowClass){
  const gridRank = document.querySelectorAll(`.${rankClass}`);
  gridRank.forEach((item)=>{
    const rankOkUnique = item.querySelectorAll(`.${noneRowClass}.clickableCell`);
    const clickCells = item.querySelectorAll('.clickableCell');
    
    clickCells.forEach( (cell) => {
      cell.classList.add(`rank_${cell.headers.split("_")[1]}`);
    });

    if( rankOkUnique.length !== 0 ){
      item.onchange = () => {
        [...rankOkUnique].slice(0,-1).forEach( (unique, index)=>{
          const rankInput = unique.querySelector("input[type=radio]");
          if( rankInput !== null && rankInput !== undefined ){
            if( rankInput.checked ){
              const sliceRankOkUnique = [...rankOkUnique].slice(index+1);
              sliceRankOkUnique.forEach((auto)=>{
                const autoRankInput = auto.querySelector("input[type=radio]");
                const autoRankFir = auto.querySelector(".fir-icon");
                autoRankInput.checked = true;
                autoRankFir.classList.add("selected");

                const rankClass = `.rank_${auto.headers.split("_")[1]}`;
                const disabledRows = document.querySelectorAll(rankClass);
                disabledRows.forEach( (row)=>{
                  if( ![...row.classList].includes(noneRowClass) ){
                    const rowRankInput = row.querySelector("input[type=radio]");
                    const rowRankFir = row.querySelector(".fir-icon");
                    
                    rowRankInput.checked = false;
                    rowRankFir.classList.remove("selected");
                  }
                });
              })
            }
          }
        });
      }
    }
  });
}


// 한글 변환
function viewKorean(num, dan, postText){
  string=num;
  hn = new Array("영","일","이","삼","사","오","육","칠","팔","구");
  hj = new Array("","만","억","조","경","해","시","양","구","간","정","재","극","항하사","아승지","나유타","불가사의","무량대수");
  ul = new Array("영천","영백","영십","영");
  tm = new Array();
  result = "";
  string = string + dan;  // 금액 단위
  if (string.charAt(0)=="-"){ result = "마이너스 "; string = string.substr(1,string.length-1); }
  loop_size = Math.ceil(string.length/4);
           string2 = "";
  for (count=string.length; count >= 0; count--)
      string2 += string.substring(count,count-1);
           string = string2;
  for (A=0;A<loop_size;A++)
  {
    sum = hj[A] + " ";
    tm[A] = string.substr(A*4,4);
    tm2 = "";
    for (count=tm[A].length; count >= 0; count--)
        tm2 += tm[A].substring(count,count-1);
        tm[A] = tm2;
        part_jari = tm[A].length;
        for (D=0;D<10;D++){
          for (B=0;B<10;B++) tm[A] = tm[A].replace(B,hn[B]);
        }
    if (part_jari == 4) tm[A] = tm[A].charAt(0)+"천"+tm[A].charAt(1)+"백"+tm[A].charAt(2)+"십"+tm[A].charAt(3);
    else if (part_jari == 3) tm[A] = tm[A].charAt(0)+"백"+tm[A].charAt(1)+"십"+tm[A].charAt(2);
    else if (part_jari == 2) tm[A] = tm[A].charAt(0)+"십"+tm[A].charAt(1);
    else tm[A] = tm[A].charAt(0);
    for (C=0;C<4;C++)
    {
     if (tm[A].match(ul[C])){ part_jari--; tm[A] = tm[A].replace(ul[C],""); }
    }
    if (part_jari != 0) tm[A] += sum;
  }
  for (loop_size;loop_size>-1;loop_size--) result += tm[loop_size];
    result = result.replace("undefined","");
    if( result === "" || result === null || result === undefined ){
      return "";
    }

    result = result.replace("undefined","") + postText;
    return result;
}

function han(dan, postText){
  const hangleChange = document.querySelectorAll(".hanchange");
  let hangelPostText = "원";
  if( !(postText === null || postText === undefined || postText === "") ){
      hangelPostText = postText;
  }
  hangleChange.forEach((item)=>{
    const itemInput = item.querySelector("input");

    const hanFunction = (num) => {
      let numToHan = viewKorean(num, dan, hangelPostText);
      const hangleSpan = item.querySelector(".hangle-span");
      hangleSpan.innerHTML = numToHan;
    }
    hanFunction( !isNaN(itemInput.value) && itemInput.value);
    itemInput.addEventListener("keyup", (event)=>{
      hanFunction(event.target.value);
    });
  });
}


// set animation
function setAnimation(selector, animate, duration){
  const setClass = document.querySelector(selector);
  setClass.classList.add("animate__animated");
  setClass.classList.add(animate);
  if( duration !== undefined && duration !== null ){
      setClass.style.setProperty('--animate-duration', duration);
  }
}

// radio, checkbox hover animation
function setFirAnimation(){
  window.addEventListener('load', function(){
    for(i = 0; i < document.getElementsByClassName('fir-selected').length; i++){
      document.getElementsByClassName('fir-base')[i].style.transitionDuration = '0.15s';
      document.getElementsByClassName('fir-selected')[i].style.transitionDuration = '0.15s';
    }
  })
}

// text hover bold
function setHoverTextBold(){
  function fnBoldStyle(){
    for(k = 0; k < document.querySelectorAll('style').length; k++){
      if (document.querySelectorAll('style')[k].getAttribute('media') == null){
       document.querySelectorAll('style')[k].innerHTML = document.querySelectorAll('style')[k].innerHTML + '.bold {font-weight : bold;}';
       break;
      }
    }
  }
  window.addEventListener('load', function(){
    fnBoldStyle();
    for (i = 0; i < document.querySelectorAll('#surveyContainer .clickable').length; i++){
      document.querySelectorAll('#surveyContainer .clickable')[i].addEventListener('mouseenter', function(e){
        this.classList.add('bold');
      })
      document.querySelectorAll('#surveyContainer .clickable')[i].addEventListener('mouseleave', function(e){
        this.classList.remove('bold')
      })
    }
  })
}

// Slideshow setting
function slideShowSetting({
    setSlideshowQuery='.slideshow-div',
    mode,
    imagePath,
    imageClassName,
    slides=[],
    force=false,
    forceText,
    forceSwitch='.continue',
}){
    if(setSlideshowQuery === null || setSlideshowQuery === undefined || setSlideshowQuery === ''){
        console.log('Slideshow setSlideshowQuery error');
        return
    }

    if( !['image', 'html'].includes(mode) ){
        console.log('Slideshow mode error');
        return
    }

    if( !Array.isArray(slides) ){
        console.log('The slides argument is not Array.');
        return
    }
    if( slides.length === 0 ){
        console.log('The slides argument is empty');
        return
    }

    if( mode === 'image' && (imagePath === null || imagePath === undefined )){
        console.log('The slideshow mode is image. Please check the image path');
        return
    }

    if( !typeof imageClassName === 'string' ){
        console.log('The imageClassName is not string.');
        return
    }

    if( !typeof force === 'boolean' ){
        console.log('Slideshow force argument must be boolean');
        return
    }
    if(force === true){
        if(forceText === null || forceText === undefined){
            console.log('The force argument is true. Please check the forceText');
            return
        }
        if( forceSwitch === null || forceSwitch === undefined){
            console.log('The force argument is true. Please check the forceSwitch');
            return
        }
        const forceBtnChk = document.querySelector(forceSwitch);
        if( forceBtnChk === null || forceBtnChk === undefined){
            console.log('The force argument is true. However, the forceSwitch not found');
            return
        }
    }

    const activeColor = '#2d6df6';
    const defaultFontColor = '#343333';
    const activeFontColor = '#fff';
    const defaultColor = '#f7f7f7';
    const dotColor = '#b7b4b4';

    const slideshowDiv = document.querySelector(setSlideshowQuery);
    slideshowDiv.innerHTML = null;
    slideshowDiv.style.width = '100%';
    slideshowDiv.style.marginBottom = '20px';
    slideshowDiv.style.maxWidth = '924px';
    slideshowDiv.style.margin = '0 auto';

    const slideshowBody = document.createElement('div');
    const leftBtn = document.createElement('div');
    const slideshow = document.createElement('div');
    const rightBtn = document.createElement('div');

    /* Make slide show */
    slideshowDiv.appendChild(slideshowBody);
    slideshowBody.appendChild(leftBtn);
    slideshowBody.appendChild(slideshow);
    slideshowBody.appendChild(rightBtn);

    slideshowBody.classList.add('animate__animated');
    slideshowBody.classList.add('animate__fadeIn');
    slideshowBody.style.width = '100%';
    slideshowBody.style.display = 'grid';
    slideshowBody.style.gridTemplateColumns = '10% 80% 10%';

    leftBtn.classList.add('slideshow-btn');
    slideshow.classList.add('slideshow-pages');
    rightBtn.classList.add('slideshow-btn');

    const slideshowBtns = document.querySelectorAll('.slideshow-btn');

    const leftArrowSVG = `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'> <path stroke-linecap='round' stroke-linejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' /></svg>`
    const rightArrowSVG = `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'> <path stroke-linecap='round' stroke-linejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' /> </svg>`;

    slideshowBtns.forEach((btn)=>{
        btn.style.textAlign = 'center';

        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.justifyContent = 'center';
        btn.style.alignItems = 'center';

        const arrow = document.createElement('div');
        btn.appendChild(arrow);

        arrow.classList.add('slideshow-arrow');
        arrow.style.width = '100%';
        arrow.style.maxWidth = '40px'
        arrow.style.height = '60px';
        arrow.style.backgroundColor = defaultColor;
        arrow.style.display = 'flex';
        arrow.style.flexDirection = 'column';
        arrow.style.justifyContent = 'center';
        arrow.style.alignItems = 'center';
        arrow.style.borderRadius = '5px';
        arrow.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
        arrow.style.transition = 'background-color 0.2s'
    });

    leftBtn.querySelector('.slideshow-arrow').innerHTML = leftArrowSVG;
    rightBtn.querySelector('.slideshow-arrow').innerHTML = rightArrowSVG;


    const pageNumber = document.createElement('div');
    pageNumber.classList.add('slideshow-page-number');
    pageNumber.style.marginBottom = '10px';
    slideshow.appendChild(pageNumber);
    slideshow.style.width = '100%';
    slideshow.style.fontSize = '0.8rem';
    slideshow.style.marginTop = '10px';

    slides.forEach((slide, index)=>{
        const page = document.createElement('div');
        page.style.width = '100%';
        page.style.display = 'none';
        page.style.textAlign = 'center';
        page.style.fontSize = '1rem';

        const className = `page-${index}`;
        page.classList.add('pages');
        page.classList.add(className);

        if( mode === 'image' ){
            const img = document.createElement('img');
            const imagePage = `${imagePath}/${slide}`;
            img.src = imagePage;
            img.style.width = '100%';

            if( !(imageClassName === null || imageClassName === undefined) ){
                const imgClassNames = imageClassName.split(' ');
                imgClassNames.forEach((cls)=>{
                    img.classList.add(cls);
                });
            }
            page.appendChild(img);
        }

        if( mode === 'html' ){
            const txtDiv = document.createElement('div');
            txtDiv.classList.add('slide-text-page');
            txtDiv.style.width = '100%';
            txtDiv.style.padding = '5px';
            txtDiv.style.wordBreak = 'keep-all'
            txtDiv.style.minHeight = '200px';
            txtDiv.style.display = 'flex';
            txtDiv.style.fontSize = '1.3rem';
            txtDiv.style.justifyContent = 'center';
            txtDiv.style.alignItems = 'center';

            const txt = document.createElement('div');
            txt.classList.add('slide-text');
            txt.innerHTML = slide;
            txt.style.padding = '20px';
            txtDiv.appendChild(txt);
            page.appendChild(txtDiv);
        }

        slideshow.appendChild(page);
    });

    /* Make slide show dot */
    const dotList = document.createElement('div');
    dotList.classList.add('dot-list');
    slideshow.appendChild(dotList);
    dotList.style.width = '100%';
    dotList.style.display = 'flex';
    dotList.style.justifyContent = 'center';
    dotList.style.alignItems = 'center';
    dotList.style.gap = '10px';
    dotList.style.marginTop = '10px';

    slides.forEach((page, index)=>{
        const dot = document.createElement('div');
        const dotClassName = `slide-show-dot-${index}`;
        dot.classList.add('slide-show-dot');
        dot.classList.add(dotClassName);
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.backgroundColor = dotColor;
        dot.style.borderRadius = '100%';
        dot.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
        dot.style.transition = 'background-color 0.2s';
        dot.style.cursor = 'pointer';
        dot.dataset.page = index;
        dotList.appendChild(dot);
    });

    const forceTextDiv = document.createElement('div');
    forceTextDiv.innerHTML = forceText;
    forceTextDiv.style.width = '100%';
    forceTextDiv.style.marginTop = '20px';
    forceTextDiv.style.color = '#e7046f';
    forceTextDiv.style.textAlign = 'center';
    forceTextDiv.style.display = 'none';
    forceTextDiv.style.fontSize = '1.2rem';
    forceTextDiv.classList.add('force-text');
    slideshow.appendChild(forceTextDiv);


    /* Slide show handlers */
    let pageIndex = 0;
    const pageHandler = (calcNum)=>{
        if( calcNum === null || calcNum === undefined ){
            return
        }
        const lastPageIndex = slides.length - 1;
        pageIndex = calcNum;

        if(force){
            if(pageIndex === lastPageIndex){
                leftBtn.style.pointerEvents = '';
                const leftArrow = leftBtn.querySelector('.slideshow-arrow');
                leftArrow.style.display = 'flex';

                dotList.style.pointerEvents = '';
                forceTextDiv.classList.add('animate__animated');
                forceTextDiv.classList.add('animate__flipOutX');
                
                const nextBtn = document.querySelector(forceSwitch);
                nextBtn.disabled = false;
            }
        }

        if( pageIndex < 0 ){
            pageIndex = lastPageIndex;
        }
        else if( pageIndex > lastPageIndex ){
            pageIndex = 0;
        }
        
        /* page control */
        const pages = document.querySelectorAll('.pages');
        pages.forEach((page)=>{
            page.style.display = 'none';
        });
        const showClassName = `.page-${pageIndex}`;
        const showPage = document.querySelector(showClassName);
        showPage.style.display = 'block';

        const showPageNumber = document.querySelector('.slideshow-page-number');
        const pageText = `${pageIndex+1}/${slides.length}`;
        showPageNumber.innerHTML = pageText;

        /* dot control */
        const dots = document.querySelectorAll('.slide-show-dot');
        dots.forEach((dot)=>{ dot.style.backgroundColor = dotColor });
        const activeDot = document.querySelector(`.slide-show-dot-${pageIndex}`);
        activeDot.style.backgroundColor = activeColor;
    }
    pageHandler(pageIndex);

    const dotHandler = (e)=>{
        const pageNumber = e.target.dataset.page;
        if( pageNumber === null || pageNumber === undefined){
            return;
        }
        pageIndex = Number(pageNumber);
        pageHandler(pageIndex);
    }

    const btnMouseOver = (e)=>{
        const arrow = e.target.querySelector('.slideshow-arrow');
        if( arrow === null || arrow === undefined ){
            return
        }
        arrow.style.backgroundColor = activeColor;
        arrow.style.color = activeFontColor;
    }

    const btnMouseLeave = (e)=>{
        const arrow = e.target.querySelector('.slideshow-arrow');
        if( arrow === null || arrow === undefined ){
            return
        }
        arrow.style.backgroundColor = defaultColor;
        arrow.style.color = defaultFontColor;
    }

    /* force control */
    if(force){
        leftBtn.style.pointerEvents = 'none';
        const leftArrow = leftBtn.querySelector('.slideshow-arrow');
        leftArrow.style.display = 'none';

        dotList.style.pointerEvents = 'none';
        forceTextDiv.style.display = 'block';

        const nextBtn = document.querySelector(forceSwitch);
        nextBtn.disabled = true;
    }

    leftBtn.addEventListener('click', ()=>{
        pageHandler(pageIndex - 1);
    });
    rightBtn.addEventListener('click', ()=>{
        pageHandler(pageIndex + 1);
    });

    [leftBtn, rightBtn].forEach((btn)=>{
        btn.style.cursor = 'pointer';
        btn.addEventListener('mouseover', btnMouseOver);
        btn.addEventListener('mouseleave', btnMouseLeave);
    })

    dotList.addEventListener('click', dotHandler);
};


function floatHandler(query, validNumber){
    const floats = document.querySelectorAll('.float-base');
    [...floats].forEach((float)=>{
        float.addEventListener('keyup', (event)=>{
            const currValue = event.target.value;
            if( currValue !== null && currValue !== undefined && currValue !== ''){
                if( currValue.indexOf('.') > 0 ){
                    const splitValue = currValue.split('.')
                    const floatValue = splitValue[1];
                    if( floatValue.length>validNumber ) {
                        event.preventDefault();
                        const diffValue = floatValue.substring(0, validNumber);
                        float.value = parseFloat(`${splitValue[0]}.${diffValue}`);
                    }
                }
            }
        });
    });
}

function fnLengthCheck(_label, _num){
  const fnNextActivate = (_bol) => {
    const objNextBtn = document.getElementById('btn_continue');
    if (_bol){
      objNextBtn.disabled = false;
    }
    else{
      objNextBtn.disabled = true;
    }
  }
  
  const fnBadText = (_obj) => {
    let strBeforeText = _obj.value;
    let strAfterText;
    strBeforeText = strBeforeText.replace(/\n\n\n\n\n\n\n\n\n\n|\n\n\n\n\n\n\n\n\n|\n\n\n\n\n\n\n\n|\n\n\n\n\n\n\n|\n\n\n\n\n\n|\n\n\n\n\n|\n\n\n\n|\n\n\n|\n\n/g, '\n');
    strBeforeText = strBeforeText.replace(/\.\.\.\.\.\.\.\.\.\.|\.\.\.\.\.\.\.\.\.|\.\.\.\.\.\.\.\.|\.\.\.\.\.\.\.|\.\.\.\.\.\.|\.\.\.\.\.|\.\.\.\.|\.\.\.|\.\./g, '\.');
    strBeforeText = strBeforeText.replace(/\~\~\~\~\~\~\~\~\~\~|\~\~\~\~\~\~\~\~\~|\~\~\~\~\~\~\~\~|\~\~\~\~\~\~\~|\~\~\~\~\~\~|\~\~\~\~\~|\~\~\~\~|\~\~\~|\~\~/g, '\~');
    strBeforeText = strBeforeText.replace(/\?\?\?\?\?\?\?\?\?\?|\?\?\?\?\?\?\?\?\?|\?\?\?\?\?\?\?\?|\?\?\?\?\?\?\?|\?\?\?\?\?\?|\?\?\?\?\?|\?\?\?\?|\?\?\?|\?\?/g, '\?');
    strBeforeText = strBeforeText.replace(/\(\(\(\(\(\(\(\(\(\(|\(\(\(\(\(\(\(\(\(|\(\(\(\(\(\(\(\(|\(\(\(\(\(\(\(|\(\(\(\(\(\(|\(\(\(\(\(|\(\(\(\(|\(\(\(|\(\(/g, '\(');
    strBeforeText = strBeforeText.replace(/\)\)\)\)\)\)\)\)\)\)|\)\)\)\)\)\)\)\)\)|\)\)\)\)\)\)\)\)|\)\)\)\)\)\)\)|\)\)\)\)\)\)|\)\)\)\)\)|\)\)\)\)|\)\)\)|\)\)/g, '\)');
    strBeforeText = strBeforeText.replace(/\/\/\/\/\/\/\/\/\/\/|\/\/\/\/\/\/\/\/\/|\/\/\/\/\/\/\/\/|\/\/\/\/\/\/\/|\/\/\/\/\/\/|\/\/\/\/\/|\/\/\/\/|\/\/\/|\/\//g, '\/');
    strBeforeText = strBeforeText.replace(/\+\+\+\+\+\+\+\+\+\+|\+\+\+\+\+\+\+\+\+|\+\+\+\+\+\+\+\+|\+\+\+\+\+\+\+|\+\+\+\+\+\+|\+\+\+\+\+|\+\+\+\+|\+\+\+|\+\+/g, '\+');
    strBeforeText = strBeforeText.replace(/ㆍㆍㆍㆍㆍㆍㆍㆍㆍㆍ|ㆍㆍㆍㆍㆍㆍㆍㆍㆍ|ㆍㆍㆍㆍㆍㆍㆍㆍ|ㆍㆍㆍㆍㆍㆍㆍ|ㆍㆍㆍㆍㆍㆍ|ㆍㆍㆍㆍㆍ|ㆍㆍㆍㆍ|ㆍㆍㆍ|ㆍㆍ/g, 'ㆍ');
    strBeforeText = strBeforeText.replace(/ᆢᆢᆢᆢᆢᆢᆢᆢᆢᆢ|ᆢᆢᆢᆢᆢᆢᆢᆢᆢ|ᆢᆢᆢᆢᆢᆢᆢᆢ|ᆢᆢᆢᆢᆢᆢᆢ|ᆢᆢᆢᆢᆢᆢ|ᆢᆢᆢᆢᆢ|ᆢᆢᆢᆢ|ᆢᆢᆢ|ᆢᆢ/g, 'ᆢ');
    strBeforeText = strBeforeText.replace(/          |         |        |       |      |     |    |   |  /g, ' ');
    strBeforeText = strBeforeText.replace(/!!!!!!!!!!|!!!!!!!!!|!!!!!!!!|!!!!!!!|!!!!!!|!!!!!|!!!!|!!!|!!/g, '!');
    strBeforeText = strBeforeText.replace(/,,,,,,,,,,|,,,,,,,,,|,,,,,,,,|,,,,,,,|,,,,,,|,,,,,|,,,,|,,,|,,/g, ',');
    strBeforeText = strBeforeText.replace(/::::::::::|:::::::::|::::::::|:::::::|::::::|:::::|::::|:::|::/g, ':');
    strBeforeText = strBeforeText.replace(/''''''''''|'''''''''|''''''''|'''''''|''''''|'''''|''''|'''|''/g, "'");
    strBeforeText = strBeforeText.replace(/""""""""""|"""""""""|""""""""|"""""""|""""""|"""""|""""|"""|""/g, '"');
    strBeforeText = strBeforeText.replace(/{{{{{{{{{{|{{{{{{{{{|{{{{{{{{|{{{{{{{|{{{{{{|{{{{{|{{{{|{{{|{{/g, '{');
    strBeforeText = strBeforeText.replace(/}}}}}}}}}}|}}}}}}}}}|}}}}}}}}|}}}}}}}|}}}}}}|}}}}}|}}}}|}}}|}}/g, '}');
    strBeforeText = strBeforeText.replace(/<<<<<<<<<<|<<<<<<<<<|<<<<<<<<|<<<<<<<|<<<<<<|<<<<<|<<<<|<<<|<</g, '<');
    strBeforeText = strBeforeText.replace(/>>>>>>>>>>|>>>>>>>>>|>>>>>>>>|>>>>>>>|>>>>>>|>>>>>|>>>>|>>>|>>/g, '>');
    strBeforeText = strBeforeText.replace(/----------|---------|--------|-------|------|-----|----|---|--/g, '-');
    strBeforeText = strBeforeText.replace(/__________|_________|________|_______|______|_____|____|___|__/g, '_');
    strBeforeText = strBeforeText.replace(/==========|=========|========|=======|======|=====|====|===|==/g, '=');
    strBeforeText = strBeforeText.replace(/ㆍᆢ/g, 'ㆍ');
    strBeforeText = strBeforeText.replace(/ᆢㆍ/g, 'ᆢ');
    strBeforeText = strBeforeText.replace(/\n /g, '\n');
    strBeforeText = strBeforeText.replace(/`|@|#|\$|%|\^|&|\*|\\|\||;|♡|♥|§|×|÷|♤|♠|☆|♧|♣|$|€|£|¥|°|○|●|□|■|◇|※|《|》|¤|¡|¿|＃|＆|＊|＠|★|◎|◆|△|▲|▽|▼|→|←|↑|↓|↔|〓|◁|◀|▷|▶|⊙|◈|▣|◐|◑|▒|▤|▥|▨|▧|▦|▩|♨|☏|☎|☜|☞|¶|†|‡|↕|↗|↙|↖|↘|♭|♩|♪|♬|㉿|㈜|№|㏇|™|㏂|㏘|℡|®|ª|º|㉾/g, '');
    if(strBeforeText.charAt(0) === ' '){
      strBeforeText = strBeforeText.slice(1);
    }
    if(strBeforeText.charAt(0) === '\n'){
      strBeforeText = strBeforeText.slice(1);
    }
    _obj.value = strBeforeText;
    strAfterText = strBeforeText.replace(/\n/g, '');
    if (strAfterText.charAt(strAfterText.length - 1) === ' '){
      return strAfterText.length - 1;
    }
    else{
      return strAfterText.length;
    }
  }
  
  const fnFilltering = (_obj) => {
    let strMainText = _obj.value;
    let strFillteringWord = 'ㄱ,ㄲ,ㄴ,ㄷ,ㄸ,ㄹ,ㅁ,ㅂ,ㅃ,ㅅ,ㅆ,ㅇ,ㅈ,ㅉ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ,ㅏ,ㅐ,ㅑ,ㅒ,ㅓ,ㅔ,ㅕ,ㅖ,ㅗ,ㅘ,ㅙ,ㅚ,ㅛ,ㅜ,ㅝ,ㅞ,ㅟ,ㅠ,ㅡ,ㅢ,ㅣ,ㄳ,ㄵ,ㄶ,ㄺ,ㄻ,ㄼ,ㄽ,ㄾ,ㄿ,ㅀ,ㅄ';
    for (i = 0; i < strFillteringWord.split(',').length; i++){
      strMainText = strMainText.replaceAll(strFillteringWord.split(',')[i], '');
    }
    while (strMainText.charAt(strMainText.length - 1) === '\n' || strMainText.charAt(strMainText.length - 1) === ' '){
      strMainText = strMainText.slice(0, strMainText.length - 1);
    }
    if (!isNaN(strMainText)){
      strMainText = '';
    }
    _obj.value = strMainText;
    fnInputCheck();
  }
  
  const fnInputCheck = () => {
    for (i = 0; i < document.querySelectorAll(`#question_${_label} .areaCheck`).length; i++){
      let numCheckLength = Number(`${_num}`);
      let changeTextArea = document.querySelectorAll(`#question_${_label} .areaCheck textarea`)[i];
      let changeAreaWrap = changeTextArea.parentNode;
      let changeAreaGageOutLine = changeAreaWrap.querySelector('.areaGageOutLine');
      let changePassView = changeAreaWrap.querySelector('.areaPassView');
      let changeFailView = changeAreaWrap.querySelector('.areaFailView');
      let changeAreaGageInnerLine = changeAreaWrap.querySelector('.areaGageInnerLine');
      let numCalcLength = fnBadText(changeTextArea);

      if (changeTextArea.getAttribute('disabled') !== null){
        numCheckLength = 0;
      }
      let numConvertPer = Math.floor(numCalcLength / numCheckLength * 100);

      let numLowRed = 230;
      let numLowGreen = 21;
      let numLowBlue = 33;

      let numHighRed = 45;
      let numHighGreen = 109;
      let numHighBlue = 246;

      if(numCalcLength >= numCheckLength){
        changeAreaGageOutLine.style.borderColor = 'rgb(' + numHighRed + ', ' + numHighGreen + ', ' + numHighBlue + ')';
        changeAreaGageInnerLine.style.backgroundColor = 'rgb(' + numHighRed + ', ' + numHighGreen + ', ' + numHighBlue + ')';
        changeAreaGageInnerLine.style.width = '100%';
        changeAreaGageInnerLine.style.borderRadius = '4px';
        changeAreaWrap.classList.add('checkPass');
        changePassView.style.opacity = '1';
        changeFailView.style.opacity = '0';
      }
      else{
        let numCalcRed = (numLowRed - numHighRed) * ((100 - numConvertPer) / 100) + numHighRed;
        let numCalcGreen = (numLowGreen - numHighGreen) * ((100 - numConvertPer) / 100) + numHighGreen;
        let numCalcBlue = (numLowBlue - numHighBlue) * ((100 - numConvertPer) / 100) + numHighBlue;
        if (numConvertPer <= 50){
          numLowGreen = 21;
          numHighGreen = 255;
          numCalcGreen = (numLowGreen - numHighGreen) * ((100 - (numConvertPer * 2)) / 100) + numHighGreen;
        }
        else {
          numLowGreen = 255;
          numHighGreen = 109;
          numCalcGreen = (numLowGreen - numHighGreen) * ((100 - numConvertPer) / 100 * 2) + numHighGreen;
        }
        changeAreaGageInnerLine.style.width = numConvertPer + '%';
        changeAreaGageInnerLine.style.borderTopRightRadius = Math.round(4 * (numConvertPer / 100)) + 'px';
        changeAreaGageInnerLine.style.borderBottomRightRadius = Math.round(4 * (numConvertPer / 100)) + 'px';
        changePassView.style.opacity = '0';
        changeFailView.style.opacity = '1';
        changeAreaWrap.classList.remove('checkPass');
        changeAreaGageOutLine.style.borderColor = 'rgb(' + numCalcRed + ', ' + numCalcGreen + ', ' + numCalcBlue + ')';
        changeAreaGageInnerLine.style.backgroundColor = 'rgb(' + numCalcRed + ', ' + numCalcGreen + ', ' + numCalcBlue + ')';  
      }
    }
    fnPassCheck();
  }
  
  const fnPassCheck = () => {
    let numPassCount = 0;
    for (i = 0; i < document.querySelectorAll('#primary .areaCheck').length; i++){
      if (document.querySelectorAll('#primary .areaCheck')[i].getAttribute('class').indexOf('checkPass') !== -1){
        numPassCount++;
      }
    }
    numPassCount === document.querySelectorAll('#primary .areaCheck').length ? fnNextActivate(true) : fnNextActivate(false);
  }

  for(i = 0; i < document.querySelectorAll(`#question_${_label} textarea`).length; i++){
    let objTextArea = document.querySelectorAll(`#question_${_label} textarea`)[i];
    let objAreaWrap = document.createElement('span');
    let objSection = document.createElement('div');
    let objAreaGageOutLine = document.createElement('div');
    let objAreaGageInnerLine = document.createElement('div');
    let objMarkPassArea = document.createElement('span');
    let objMarkFailArea = document.createElement('span');
    let objMarkPassView = document.createElement('div');
    let objMarkFailLeftView = document.createElement('div');
    let objMarkFailRightView = document.createElement('div');
    let objMarkFailLeftRect = document.createElement('div');
    let objMarkFailRightRect = document.createElement('div');

    objAreaWrap.classList.add('areaCheck');
    objAreaWrap.style.display = 'inline-block';
    
    objAreaGageOutLine.classList.add('areaGageOutLine');
    objAreaGageOutLine.style.width = 'calc(100% - 20px)';
    objAreaGageOutLine.style.height = '14px';
    
    objAreaGageOutLine.style.border = 'solid 2px rgb(230, 21, 33)';
    objAreaGageOutLine.style.borderRadius = '10px';
    objAreaGageOutLine.style.transitionDuration = '0.15s';
  
    objAreaGageInnerLine.classList.add('areaGageInnerLine');
    objAreaGageInnerLine.style.width = '0%';
    objAreaGageInnerLine.style.height = '100%';
    objAreaGageInnerLine.style.backgroundColor = 'rgb(230, 21, 33)';
    objAreaGageInnerLine.style.borderTopLeftRadius = '4px';
    objAreaGageInnerLine.style.borderBottomLeftRadius = '4px';
    objAreaGageInnerLine.style.borderTopRightRadius = '0px';
    objAreaGageInnerLine.style.borderBottomRightRadius = '0px';
    objAreaGageInnerLine.style.transitionDuration = '0.15s';
  
    objMarkPassArea.classList.add('areaPassView')
    objMarkPassArea.style.position = 'absolute';
    objMarkPassArea.style.display = 'block';
    objMarkPassArea.style.right = '0px';
    objMarkPassArea.style.top = '0px';
    objMarkPassArea.style.width = '14px';
    objMarkPassArea.style.height = '14px';
    objMarkPassArea.style.transform = 'translateZ(0px)';
    objMarkPassArea.style.border = 'solid 2px rgb(45, 109, 246)';
    objMarkPassArea.style.borderRadius = '100%';
    objMarkPassArea.style.opacity = '0';
    objMarkPassArea.style.overflow = 'hidden';
    objMarkPassArea.style.transitionDuration = '0.2s';
  
    objMarkPassView.style.position = 'absolute';
    objMarkPassView.style.display = 'block';
    objMarkPassView.style.width = '8px';
    objMarkPassView.style.height = '4px';
    objMarkPassView.style.left = '1px';
    objMarkPassView.style.top = '2px';
    objMarkPassView.style.borderLeftWidth = '2px';
    objMarkPassView.style.borderBottomWidth = '2px';
    objMarkPassView.style.borderLeftStyle = 'solid';
    objMarkPassView.style.borderBottomStyle = 'solid';
    objMarkPassView.style.borderLeftColor = 'rgb(45, 109, 246)';
    objMarkPassView.style.borderBottomColor = 'rgb(45, 109, 246)';
    objMarkPassView.style.transform = 'rotate(-45deg)';
  
    objMarkFailArea.classList.add('areaFailView')
    objMarkFailArea.style.position = 'absolute';
    objMarkFailArea.style.display = 'block';
    objMarkFailArea.style.right = '0px';
    objMarkFailArea.style.top = '0px';
    objMarkFailArea.style.width = '14px';
    objMarkFailArea.style.height = '14px';
    objMarkFailArea.style.transform = 'translateZ(0px)';
    objMarkFailArea.style.border = 'solid 2px rgb(230, 21, 33)';
    objMarkFailArea.style.borderRadius = '100%';
    objMarkFailArea.style.opacity = '1';
    objMarkFailArea.style.overflow = 'hidden';
    objMarkFailArea.style.transitionDuration = '0.2s';
  
    objMarkFailLeftView.style.position = 'absolute';
    objMarkFailLeftView.style.display = 'block';
    objMarkFailLeftView.style.width = '100%';
    objMarkFailLeftView.style.height = '100%';
    objMarkFailLeftView.style.transform = 'rotate(-45deg)';

    objMarkFailLeftRect.style.position = 'absolute';
    objMarkFailLeftRect.style.display = 'block';
    objMarkFailLeftRect.style.width = '2px';
    objMarkFailLeftRect.style.height = 'calc(100% - 2px)';
    objMarkFailLeftRect.style.left = '50%';
    objMarkFailLeftRect.style.top = '50%';
    objMarkFailLeftRect.style.transform = 'translate(-50%, -50%)';
    objMarkFailLeftRect.style.backgroundColor = 'rgb(230, 21, 33)';
  
    objMarkFailRightView.style.position = 'absolute';
    objMarkFailRightView.style.display = 'block';
    objMarkFailRightView.style.width = '100%';
    objMarkFailRightView.style.height = '100%';
    objMarkFailRightView.style.transform = 'rotate(45deg)';

    objMarkFailRightRect.style.position = 'absolute';
    objMarkFailRightRect.style.display = 'block';
    objMarkFailRightRect.style.width = '2px';
    objMarkFailRightRect.style.height = 'calc(100% - 2px)';
    objMarkFailRightRect.style.left = '50%';
    objMarkFailRightRect.style.top = '50%';
    objMarkFailRightRect.style.transform = 'translate(-50%, -50%)';
    objMarkFailRightRect.style.backgroundColor = 'rgb(230, 21, 33)';
  
    objSection.classList.add('wrapSection');
    objSection.style.position = 'relative';
    objSection.style.marginTop = '5px';
    _num > 0 ? objSection.style.display = 'block' : objSection.style.display = 'none';
  
    objTextArea.after(objAreaWrap);
    objAreaWrap.append(document.querySelectorAll(`#question_${_label} textarea`)[i]);
    objAreaGageOutLine.append(objAreaGageInnerLine);
    objMarkFailLeftView.append(objMarkFailLeftRect);
    objMarkFailRightView.append(objMarkFailRightRect);
    objMarkPassArea.append(objMarkPassView);
    objMarkFailArea.append(objMarkFailLeftView);
    objMarkFailArea.append(objMarkFailRightView);
    objSection.append(objAreaGageOutLine);
    objSection.append(objMarkPassArea);
    objSection.append(objMarkFailArea);
    objAreaWrap.append(objSection);
  
    jQuery(objTextArea).on("propertychange change keyup paste input focus", fnInputCheck);
  
    objTextArea.addEventListener('blur', () => {
      fnInputCheck();
      fnFilltering(objTextArea);
    });
  }
  fnInputCheck();
  document.getElementById('btn_continue').addEventListener('mouseover', fnInputCheck);
}



// BM Question JS
function bmQuestionHanler(questionClassName){
  const setQuestion = document.querySelector(questionClassName);
  if( setQuestion === undefined || setQuestion === null ) return;
  
  const brands = document.querySelectorAll(".brand select");
  const models = document.querySelectorAll(".model select");
  const modelOptions = [...models].map((item)=>{
    return [...item.options].map((option) => option.cloneNode(true));
  });
  
  const nones = document.querySelectorAll(".none-input");

  const hideModel = (brandSelect, brandIndex, modelSelect, backUpModel) => {

      const brand = brandIndex !== null ? brandSelect.options[brandIndex] : null;
      const brandCode = brand !== null ? brand.dataset.brand : null;
      
      modelSelect.selectedIndex = 0;
      
      [...modelSelect.options].slice(1).forEach( (model, index) => {
          model.parentNode.removeChild(model);
      });

      [...backUpModel].slice(1).forEach((model)=>{
        if( model.dataset.brand == brandCode ){
          modelSelect.appendChild(model);
        }
      });
      if( brandSelect.selectedIndex === 0 ){
        modelSelect.classList.add('select-disabled');
      }else{
        modelSelect.classList.remove('select-disabled');
      }
  };

  const openHandler = (event, currSelect) => {
      const selectedOption = currSelect.options[currSelect.selectedIndex];
      const openClassName = currSelect.dataset.open;
      const openInput = document.querySelector(openClassName);
      if( !openInput ) return;

      const openFlag = selectedOption.dataset.oe;
      if( !openFlag ){
          openInput.disabled = true;
          openInput.classList.add("input-disabled");
          return;
      }
      openInput.disabled = false;
      openInput.classList.remove("input-disabled");
      if( event.type === "change" ){
        openInput.focus();
      }
  };

  const noneHandler = (noneChk, index)=>{
    const brand = brands[index];
    const model = models[index];
    const items = [brand, model];

    if( noneChk.checked ){
      items.forEach( (item)=>{
        const openInput = document.querySelector(item.dataset.open);
        const selectedIndex = item.selectedIndex;
        const oeCheck = item.options[selectedIndex].dataset.oe;

        item.classList.add("input-disabled");
        item.disabled = true;

        if( oeCheck ){
          openInput.classList.add("input-disabled");
          openInput.disabled = true;
        }
      })
    }else{
      items.forEach( (item)=>{
        const openInput = document.querySelector(item.dataset.open);
        const selectedIndex = item.selectedIndex;
        const oeCheck = item.options[selectedIndex].dataset.oe;

        item.classList.remove("input-disabled");
        item.disabled = false;

        if( oeCheck ){
          openInput.classList.remove("input-disabled");
          openInput.disabled = false;
        }
      })
    }
  }

  brands.forEach( (item, index) => {
      const modelSelect = models[index];
      const backUpModel = modelOptions[index];
      item.addEventListener("change", (event) => {
          const brandSelected = item.selectedIndex;
          if( modelSelect.selectedIndex ){
            const openClassName = modelSelect.dataset.open;
            const openInput = document.querySelector(openClassName);
            if( openInput ){
              openInput.disabled = true;
              openInput.classList.add("input-disabled");
            }
          }
          modelSelect.selectedIndex = 0;
          openHandler(event, item);
          hideModel(item, item.selectedIndex, modelSelect, backUpModel);
      });
      modelSelect.addEventListener("change", (event)=>{
        openHandler(event, modelSelect)
      });
      hideModel(item, item.selectedIndex, modelSelect, backUpModel);
      openHandler(event, item);
      openHandler(event, modelSelect);
  });

  nones.forEach( (none, index)=>{
    const noneChk = none.querySelector("input[type=checkbox]");
    none.addEventListener("click", ()=>{
        noneHandler(noneChk, index);
    });
    noneHandler(noneChk, index);
  });
}


// Group Toggle setting
function groupToggleSetting(){
    const groupToggle = document.querySelectorAll('.ch-group-toggle');

    groupToggle.forEach((group)=>{
        const groupRowCell = group.querySelector('.ch-group-rows');
        const groupName = group.querySelector('.ch-group-name');
        const domMaxHeight = groupRowCell.offsetHeight;

        const maxHeightHandler = ()=>{
          if( groupRowCell.style.maxHeight == '0px' ){
            groupRowCell.style.maxHeight = `${domMaxHeight}px`;
            groupName.classList.add('ch-group-selected');
          }else{
            groupRowCell.style.maxHeight = '0px';
            groupName.classList.remove('ch-group-selected');
          }
        }
        maxHeightHandler();
        groupName.addEventListener('click', maxHeightHandler);
    });

    const groupSelected = ()=>{
      const groupToggle = document.querySelectorAll('.ch-group-toggle');
      groupToggle.forEach((group)=>{
        const groupRowCell = group.querySelector('.ch-group-rows');
        const groupName = group.querySelector('.ch-group-name');
        const selectedCheck = groupRowCell.querySelectorAll('input:checked');
        if( selectedCheck.length >=1 ){
          groupName.classList.add('ch-group-selected');
        }else{
          groupName.classList.remove('ch-group-selected');
        }
      });
    }
    groupSelected();
    document.querySelector('.answers').addEventListener('click', groupSelected);
}
