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
    holdPageSec=0,
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
    //slideshowDiv.style.margin = '0 auto';

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
    slideshowBody.style.gridTemplateColumns = '5% 90% 5%';

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
        arrow.style.transition = 'background-color 0.2s, opacity 0.2s';
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
    let slideComplete = false;

    const pageHandler = (calcNum)=>{
        if( calcNum === null || calcNum === undefined ){
            return
        }
        const lastPageIndex = slides.length - 1;
        pageIndex = calcNum;
        if(force){
            rightBtn.addEventListener('click', () => {
                if(holdPageSec > 0) { // holdPageSec가 0보다 클 때만 작동
                    if((pageIndex !== lastPageIndex) && (!slideComplete)){
                        rightBtn.style.opacity = '0.5';
                        rightBtn.style.pointerEvents = 'none';
                        
                        // holdPageSec 만큼의 시간이 지난 후에 스타일 해제
                        setTimeout(() => {
                            rightBtn.style.opacity = '';
                            rightBtn.style.pointerEvents = '';
                        }, holdPageSec * 1000); // milliseconds로 변환
                    }else{
                        slideComplete = true;
                    }
                }
            });

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

    const btnMouseOver = (curr)=>{
        const arrow = curr.querySelector('.slideshow-arrow');
        if( arrow === null || arrow === undefined ){
            return
        }
        arrow.style.backgroundColor = activeColor;
        arrow.style.color = activeFontColor;
    }

    const btnMouseLeave = (curr)=>{
        const arrow = curr.querySelector('.slideshow-arrow');
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
        btn.addEventListener('mouseover',  ()=>{btnMouseOver(btn);});
        btn.addEventListener('mouseleave', ()=>{btnMouseLeave(btn);});
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

function fnLengthCheck(_label, _num, _placeholder){
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
    if (_obj.tagName === 'TEXTAREA'){
      strAfterText = strBeforeText.replace(/\n/g, '');
      if (strAfterText.charAt(strAfterText.length - 1) === ' '){
        return strAfterText.length - 1;
      }
      else{
        return strAfterText.length;
      }
    }
  }
  
  const fnFilltering = (_obj) => {
    let strMainText = _obj.value;
    let strFillteringWord = 'ㄱ,ㄲ,ㄴ,ㄷ,ㄸ,ㄹ,ㅁ,ㅂ,ㅃ,ㅅ,ㅆ,ㅇ,ㅈ,ㅉ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ,ㅏ,ㅐ,ㅑ,ㅒ,ㅓ,ㅔ,ㅕ,ㅖ,ㅗ,ㅘ,ㅙ,ㅚ,ㅛ,ㅜ,ㅝ,ㅞ,ㅟ,ㅠ,ㅡ,ㅢ,ㅣ,ㄳ,ㄵ,ㄶ,ㄺ,ㄻ,ㄼ,ㄽ,ㄾ,ㄿ,ㅀ,ㅄ,ㆍ,ᆢ';
    for (i = 0; i < strFillteringWord.split(',').length; i++){
      strMainText = strMainText.replaceAll(strFillteringWord.split(',')[i], '');
    }
    while (strMainText.charAt(strMainText.length - 1) === '\n' || strMainText.charAt(strMainText.length - 1) === ' '){
      strMainText = strMainText.slice(0, strMainText.length - 1);
    }
    if (_obj.tagName === 'TEXTAREA'){
      if (!isNaN(strMainText)){
        strMainText = '';
      }
    }
    _obj.value = strMainText;
    if (_obj.tagName === 'TEXTAREA'){
      fnInputCheck();
    }
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

      let numMiddleRed = 153;
      let numMiddleGreen = 112;
      let numMiddleBlue = 181;

      let numHighRed = 45;
      let numHighGreen = 109;
      let numHighBlue = 246;

      if(numCalcLength >= numCheckLength){
        changeAreaGageOutLine.style.borderColor = 'rgb(' + numHighRed + ', ' + numHighGreen + ', ' + numHighBlue + ')';
        changeAreaGageInnerLine.style.backgroundColor = 'rgb(' + numHighRed + ', ' + numHighGreen + ', ' + numHighBlue + ')';
        changeAreaGageInnerLine.style.width = '100%';
        changeAreaGageInnerLine.style.borderRadius = '6px';
        changeAreaWrap.classList.add('checkPass');
        changePassView.style.opacity = '1';
        changeFailView.style.opacity = '0';
      }
      else{
        let numCalcRed = (numLowRed - numHighRed) * ((100 - numConvertPer) / 100) + numHighRed;
        let numCalcGreen = (numLowGreen - numHighGreen) * ((100 - numConvertPer) / 100) + numHighGreen;
        let numCalcBlue = (numLowBlue - numHighBlue) * ((100 - numConvertPer) / 100) + numHighBlue;
        if (numConvertPer <= 50){
          numCalcRed = (numLowRed - numMiddleRed) * ((100 - (numConvertPer * 2)) / 100) + numMiddleRed;
          numCalcGreen = (numLowGreen - numMiddleGreen) * ((100 - (numConvertPer * 2)) / 100) + numMiddleGreen;
          numCalcBlue = (numLowBlue - numMiddleBlue) * ((100 - (numConvertPer * 2)) / 100) + numMiddleBlue;
        }
        else {
          numCalcRed = (numMiddleRed - numHighRed) * ((100 - numConvertPer) / 100 * 2) + numHighRed;
          numCalcGreen = (numMiddleGreen - numHighGreen) * ((100 - numConvertPer) / 100 * 2) + numHighGreen;
          numCalcBlue = (numMiddleBlue - numHighBlue) * ((100 - numConvertPer) / 100 * 2) + numHighBlue;
        }
        changeAreaGageInnerLine.style.width = numConvertPer + '%';
        changeAreaGageInnerLine.style.borderTopRightRadius = Math.round(6 * (numConvertPer / 100)) + 'px';
        changeAreaGageInnerLine.style.borderBottomRightRadius = Math.round(6 * (numConvertPer / 100)) + 'px';
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

  let numTextAreaCount = document.querySelectorAll(`#question_${_label} textarea`).length;
  let numInputTextCount = document.querySelectorAll(`#question_${_label} input[type=text]`).length;

  if (numTextAreaCount > 0){
    for(i = 0; i < numTextAreaCount; i++){
      let objTextArea = document.querySelectorAll(`#question_${_label} textarea`)[i];
      let objAreaWrap = document.createElement('span');
      let objSection = document.createElement('div');
      let objAreaGageOutLineShield = document.createElement('div');
      let objAreaGageOutLine = document.createElement('div');
      let objAreaGageInnerLine = document.createElement('div');
      let objMarkPassArea = document.createElement('span');
      let objMarkFailArea = document.createElement('span');
      let objMarkPassLeftView = document.createElement('div');
      let objMarkPassBottomView = document.createElement('div');
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

      objAreaGageOutLineShield.classList.add('areaGageOutLineShield');
      objAreaGageOutLineShield.style.position = 'relative';
      objAreaGageOutLineShield.style.width = 'calc(100% + 2px)';
      objAreaGageOutLineShield.style.height = 'calc(100% + 2px)';
      objAreaGageOutLineShield.style.borderRadius = '10px';
      objAreaGageOutLineShield.style.left = '-1px';
      objAreaGageOutLineShield.style.top = '-1px';
      objAreaGageOutLineShield.style.overflow = 'hidden';
    
      objAreaGageInnerLine.classList.add('areaGageInnerLine');
      objAreaGageInnerLine.style.position = 'relative';
      objAreaGageInnerLine.style.width = '0%';
      objAreaGageInnerLine.style.height = '100%';
      objAreaGageInnerLine.style.backgroundColor = 'rgb(230, 21, 33)';
      objAreaGageInnerLine.style.borderTopLeftRadius = '6px';
      objAreaGageInnerLine.style.borderBottomLeftRadius = '6px';
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
    
      objMarkPassLeftView.style.position = 'absolute';
      objMarkPassLeftView.style.display = 'block';
      objMarkPassLeftView.style.width = '8px';
      objMarkPassLeftView.style.height = '4px';
      objMarkPassLeftView.style.left = '1px';
      objMarkPassLeftView.style.top = '2px';
      objMarkPassLeftView.style.borderLeftWidth = '2px';
      objMarkPassLeftView.style.borderLeftStyle = 'solid';
      objMarkPassLeftView.style.borderLeftColor = 'rgb(45, 109, 246)';
      objMarkPassLeftView.style.transform = 'rotate(-45deg)';

      objMarkPassBottomView.style.position = 'absolute';
      objMarkPassBottomView.style.display = 'block';
      objMarkPassBottomView.style.width = '8px';
      objMarkPassBottomView.style.height = '4px';
      objMarkPassBottomView.style.left = '1px';
      objMarkPassBottomView.style.top = '2px';
      objMarkPassBottomView.style.borderBottomWidth = '2px';
      objMarkPassBottomView.style.borderBottomStyle = 'solid';
      objMarkPassBottomView.style.borderBottomColor = 'rgb(45, 109, 246)';
      objMarkPassBottomView.style.transform = 'rotate(-45deg)';
    
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
      objAreaGageOutLineShield.append(objAreaGageInnerLine);
      objMarkFailLeftView.append(objMarkFailLeftRect);
      objMarkFailRightView.append(objMarkFailRightRect);
      objMarkPassArea.append(objMarkPassLeftView);
      objMarkPassArea.append(objMarkPassBottomView);
      objMarkFailArea.append(objMarkFailLeftView);
      objMarkFailArea.append(objMarkFailRightView);
      objAreaGageOutLine.append(objAreaGageOutLineShield);
      objSection.append(objAreaGageOutLine);
      objSection.append(objMarkPassArea);
      objSection.append(objMarkFailArea);
      objAreaWrap.append(objSection);
    
      if (!(_placeholder === undefined || _placeholder === 'undefined' || _placeholder === 'None' || _placeholder === 'none' || _placeholder === '0' || _placeholder === '')){
        objTextArea.setAttribute('placeholder', _placeholder)
      }

      jQuery(objTextArea).on("propertychange change keyup paste input focus", fnInputCheck);
    
      objTextArea.addEventListener('blur', () => {
        fnInputCheck();
        fnFilltering(objTextArea);
      });
    }
    fnInputCheck();
    document.getElementById('btn_continue').addEventListener('mouseover', fnInputCheck);
  }
  if (numInputTextCount > 0){
    for (k = 0; k < numInputTextCount; k++){
      if (document.querySelectorAll(`#question_${_label} input[type=text]`)[k].getAttribute('name') !== null && document.querySelectorAll(`#question_${_label} input[type=text]`)[k].getAttribute('name').indexOf('ans') !== -1){
        let objInputText = document.querySelectorAll(`#question_${_label} input[type=text]`)[k];
        if (!(_placeholder === undefined || _placeholder === 'undefined' || _placeholder === 'None' || _placeholder === 'none' || _placeholder === '0' || _placeholder === '')){
          objInputText.setAttribute('placeholder', _placeholder)
        }
        jQuery(objInputText).on("propertychange change keyup paste input focus", () => {
          fnBadText(objInputText);
        });
        objInputText.addEventListener('blur', () => {
          fnFilltering(objInputText);
        });
      }
    }
  }
}

function fnSemiOpenBadText(){
  const fnOpenFilltering = (_obj) => {
    if (_obj.getAttribute('type') === 'text' && !_obj.disabled){
      let strMainText = _obj.value;
      let bolFlag = false;
      let strFillteringWord = 'ㄱ,ㄲ,ㄴ,ㄷ,ㄸ,ㄹ,ㅁ,ㅂ,ㅃ,ㅅ,ㅆ,ㅇ,ㅈ,ㅉ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ,ㅏ,ㅐ,ㅑ,ㅒ,ㅓ,ㅔ,ㅕ,ㅖ,ㅗ,ㅘ,ㅙ,ㅚ,ㅛ,ㅜ,ㅝ,ㅞ,ㅟ,ㅠ,ㅡ,ㅢ,ㅣ,ㄳ,ㄵ,ㄶ,ㄺ,ㄻ,ㄼ,ㄽ,ㄾ,ㄿ,ㅀ,ㅄ,ㆍ,ᆢ';
      for(i = 0; i < strFillteringWord.split(',').length; i++){
        if(strMainText.indexOf(strFillteringWord.split(',')[i]) !== -1){
          bolFlag = true;
          break;
        }
      }
      if(bolFlag){
        let strTempText = strMainText;
        for (i = 0; i < strFillteringWord.split(',').length; i++){
          if(strMainText.indexOf(strFillteringWord.split(',')[i]) !== -1){
            strTempText = strTempText.replaceAll(strFillteringWord.split(',')[i], '');
          }
        }
        if(strTempText.length <= 0){
          for (i = 0; i < strFillteringWord.split(',').length; i++){
            strMainText = strMainText.replaceAll(strFillteringWord.split(',')[i], '');
          }
        }
      }
      while (strMainText.charAt(strMainText.length - 1) === '\n' || strMainText.charAt(strMainText.length - 1) === ' '){
        strMainText = strMainText.slice(0, strMainText.length - 1);
      }
      _obj.value = strMainText;
      fnOpenCheck(_obj);
    }
  }
  const fnOpenCheck = (_obj) => {
    if (_obj.getAttribute('type') === 'text' && !_obj.disabled){
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
      }
  }
  let objAllOpen = document.querySelectorAll('#primary input[type=text]');
  let objAnswers = document.querySelectorAll('.answers')
  for (i = 0; i < objAnswers.length; i++){
    objAnswers[i].addEventListener('animationend', (event) => {
      for (k = 0; k < event.target.querySelectorAll('.custom-rank-sort input[type=text]').length; k++){
        if (event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].className.indexOf('customBadText') === -1){
          event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].classList.add('customBadText');
          event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].addEventListener('propertychange', (e) => {
            fnOpenCheck(e.target);
          })
          event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].addEventListener('change', (e) => {
            fnOpenCheck(e.target);
          })
          event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].addEventListener('keyup', (e) => {
            fnOpenCheck(e.target);
          })
          event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].addEventListener('paste', (e) => {
            fnOpenCheck(e.target);
          })
          event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].addEventListener('input', (e) => {
            fnOpenCheck(e.target);
          })
          event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].addEventListener('focus', (e) => {
            fnOpenCheck(e.target);
          })
          event.target.querySelectorAll('.custom-rank-sort input[type=text]')[k].addEventListener('blur', (e) => {
            fnOpenFilltering(e.target);
          })
        }
      }
    })
  }

  for (i = 0; i < objAllOpen.length; i++){
    if (objAllOpen[i].getAttribute('name') !== null && objAllOpen[i].getAttribute('name').indexOf('oe') !== -1){
      if (objAllOpen[i].className.indexOf('badText') === -1){
        objAllOpen[i].classList.add('badText');
      }
    }
  }
  for (i = 0; i < objAllOpen.length; i++){
    if (objAllOpen[i].getAttribute('name') !== null && objAllOpen[i].getAttribute('class').indexOf('other-open') !== -1){
      if (objAllOpen[i].className.indexOf('badText') === -1){
        objAllOpen[i].classList.add('badText');
      }
    }
  }
  for (index = 0; index < document.getElementsByClassName('badText').length; index++){
    document.getElementsByClassName('badText')[index].addEventListener('propertychange', (e) => {
      fnOpenCheck(e.target);
    })
    document.getElementsByClassName('badText')[index].addEventListener('change', (e) => {
      fnOpenCheck(e.target);
    })
    document.getElementsByClassName('badText')[index].addEventListener('keyup', (e) => {
      fnOpenCheck(e.target);
    })
    document.getElementsByClassName('badText')[index].addEventListener('paste', (e) => {
      fnOpenCheck(e.target);
    })
    document.getElementsByClassName('badText')[index].addEventListener('input', (e) => {
      fnOpenCheck(e.target);
    })
    document.getElementsByClassName('badText')[index].addEventListener('focus', (e) => {
      fnOpenCheck(e.target);
    })
    document.getElementsByClassName('badText')[index].addEventListener('blur', (e) => {
      fnOpenFilltering(e.target);
    })
  }
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
        modelSelect.disabled = true;
      }else{
        modelSelect.disabled = false;
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
          return;
      }
      openInput.disabled = false;

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

        item.disabled = true;

        if( oeCheck ){
          openInput.disabled = true;
        }
      })
    }else{
      items.forEach( (item)=>{
        const openInput = document.querySelector(item.dataset.open);
        const selectedIndex = item.selectedIndex;
        const oeCheck = item.options[selectedIndex].dataset.oe;

        item.disabled = false;

        if( oeCheck ){
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
function groupToggleSetting({qid, toggleClassName=".ch-group-toggle", groupRows=".ch-group-rows", groupTitle=".ch-group-name"}){
    const base = document.querySelector(qid);

    if( base == undefined || base == null ){
        return;
    }

    const groupToggle = base.querySelectorAll(toggleClassName);


    const maxHeightHandler = (groupRowCell, groupName, padding) => {
        const originalMaxHeight = groupRowCell.style.maxHeight;

        let paddingValue = 0;
        if( padding !== undefined && padding !== null ){
            paddingValue = parseInt(padding.replace('px', ''));
        }

        groupRowCell.style.maxHeight = 'none';
        const domMaxHeight = groupRowCell.offsetHeight + paddingValue + 3;
        groupRowCell.style.maxHeight = originalMaxHeight;

        window.requestAnimationFrame(() => {
            if (groupRowCell.style.maxHeight === '0px') {
                groupRowCell.style.maxHeight = `${domMaxHeight}px`;
                groupRowCell.style.padding = padding;
                groupName.classList.add('ch-open');
            } else {
                groupRowCell.style.maxHeight = '0px';
                groupRowCell.style.padding = '0';
                groupName.classList.remove('ch-open');
            }
        });
    };

    const groupSelected = () => {
        const groupToggle = base.querySelectorAll(toggleClassName);
        groupToggle.forEach((group) => {
            const groupRowCell = group.querySelector(groupRows);
            const groupName = group.querySelector(groupTitle);
            const selectedCheck = groupRowCell.querySelectorAll('input:checked');
            if(selectedCheck.length >= 1){
                groupName.classList.add('ch-group-selected');
            } else {
                groupName.classList.remove('ch-group-selected');
            }
        });
    };

    groupSelected();
    base.querySelector('.answers').addEventListener('click', groupSelected);

    const toggleArrow = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>`;

    groupToggle.forEach((group) => {
        const groupRowCell = group.querySelector(groupRows);
        const groupName = group.querySelector(groupTitle);

        const style = window.getComputedStyle(groupRowCell);
        const padding = style.getPropertyValue('padding');

        groupName.style.cursor = 'pointer';

        const arrowDiv = document.createElement('div');
        arrowDiv.classList.add('ch-group-arrow');
        arrowDiv.innerHTML = toggleArrow;

        groupName.appendChild(arrowDiv);

        const clickHandler = () => maxHeightHandler(groupRowCell, groupName, padding);
        clickHandler();

        groupName.addEventListener('click', clickHandler);

        window.addEventListener('resize', () => {
            groupName.removeEventListener('click', clickHandler);
            if (groupName.classList.contains('ch-open')) {
                groupRowCell.style.maxHeight = 'none';
                const domMaxHeight = groupRowCell.offsetHeight;
                groupRowCell.style.maxHeight = `${domMaxHeight}px`;
            }
            groupName.addEventListener('click', clickHandler);
        });
    });
}

// Step By Step Question
function stepQuestion(bundleClassName){
     const setElements = document.querySelectorAll(bundleClassName);

     if( setElements === null || setElements === undefined || setElements.length === 0 ){
          return;
     }

     setElements.forEach((el)=>{
        const sts = el.querySelectorAll('.step-by-step');
        const lastIndex = sts.length - 1;
        const noneInput = el.querySelector('.none-input input[type=checkbox]');

        const noneHandler = ()=>{
          if( noneInput === null || noneInput === undefined ){
               return;
          }
          const noneIf = (select)=>{
               if( noneInput.checked ){
                    select.disabled = true;
               }else{
                    select.disabled = false;
               }
          }
          const noneOpen = (select)=>{
               const openDiv = select.parentElement.nextElementSibling;
               if( openDiv === null || openDiv === undefined ){
                    return;
               }

               if( !openDiv.classList.contains('step-by-step-oe')  ){
                    return;
               }

               const open = openDiv.querySelector('input[type=text]');
               if( open === null || open === undefined ){
                    return;
               }
               if( noneInput.checked ){
                    open.disabled = true;
               }else{
                    if( select.options[select.selectedIndex].dataset.open === '1' ){
                         open.disabled = false;
                    }else{
                         open.disabled = true;
                    }
               }
          }
          const eachHandler = (select)=>{
               noneIf(select);
               noneOpen(select);
          }
          sts.forEach((step, index)=>{
               const beforeIndex = index-1;
               if( index === 0 ){
                    eachHandler(step);
                    return;
               }else{
                    const beforeSelect = sts[beforeIndex];
                    if( beforeSelect.selectedIndex === 0 ){
                         step.disabled = true;
                    }else{
                         eachHandler(step);
                    }
               }
          });
        }

        noneHandler();

        el.addEventListener('change', ()=>{
          noneHandler();
        });

        sts.forEach((step, index)=>{
            const nextIndex = index + 1;

            const openHandler = (focus=true)=>{
                 const openChk = step.options[step.selectedIndex].dataset.open;

                 const openDiv = step.parentElement.nextElementSibling;
                 
                 if( openDiv === null || openDiv === undefined ){
                    return;
                 }

                 if( !openDiv.classList.contains('step-by-step-oe')  ){
                    return;
                 }

                 const open = openDiv.querySelector('input[type=text]');
                 if( open === null || open === undefined ){
                    return;
                 }
                 if( openChk === '1' ){
                    open.disabled = false;
                    if( focus ){
                        open.focus();
                    }
                 }else{
                    open.disabled = true;
                 }

            }
            
            openHandler(false);

            if( index === lastIndex ){
                step.addEventListener('change', ()=>{
                     openHandler();
                });
                return;
            }
            const nextSelectCopy = [...sts[nextIndex].options].map((option) => option.cloneNode(true));
            const nextSelect = sts[nextIndex];

            let stepBase = parseInt(nextSelect.dataset.stepbase);
            let stepKey = nextSelect.dataset.stepkey;

            const optionHandler = ()=>{
                let base = step.options[step.selectedIndex].dataset.base;

                if( (!isNaN(stepBase)) & ( stepKey !== undefined ) ){
                    const baseSelect = el.querySelector(`.step-by-step.step-${stepBase}`);
                    if( (baseSelect !== undefined && baseSelect !== null) && baseSelect.selectedIndex !== 0 ){
                        if( stepKey === "" || stepKey === undefined || stepKey === null){
                            stepKey = "base";
                        }
                        base = baseSelect.options[baseSelect.selectedIndex].dataset[stepKey];
                        //console.log(base);
                    }
                }

                if( base === null || base === undefined ){
                    [...nextSelect.options].slice(1).forEach( (item) => {
                        item.parentNode.removeChild(item);
                    });
                    nextSelect.selectedIndex = 0;
                    nextSelect.disabled = true;
                    return;
                }

                base = base.split(',');

                const showOptions = nextSelectCopy.filter((item)=> base.includes(item.dataset.code));
                 
                [...nextSelect.options].slice(1).forEach( (item) => {
                    const showValues = showOptions.map((opt)=>{return opt.value});
                    const currValue = item.value;
                    item.parentNode.removeChild(item);
                    // if( !showValues.includes(currValue) ){
                    //     item.parentNode.removeChild(item);
                    // }
                });

                const alreadyShowValues = [...nextSelect.options].map((opt)=>{return opt.value});
                [...showOptions].forEach((opt)=>{
                    if( !alreadyShowValues.includes(opt.value) ){
                        nextSelect.appendChild(opt);
                    }
                });

                nextSelect.disabled = false;
            };

            optionHandler();
            openHandler(false);

            step.addEventListener('change', ()=>{
                // reset
                [...sts].slice(index+1).forEach((rst)=>{

                    rst.selectedIndex = 0;
                    rst.disabled = true;
                    // if( step.selectedIndex === 0 ){
                    //     rst.disabled = true;
                    // }
                    const openDiv = rst.parentElement.nextElementSibling;

                    if( openDiv === null || openDiv === undefined ){
                        return;
                    }else{
                        const open = openDiv.querySelector('input[type=text]');
                        open.value = null;
                        open.disabled = true;
                    }
                });
                optionHandler();
                openHandler();
            });
        });
     });
}



function onerowatatime(_label, _row, _col, _answer, _result, _scroll, _next, _multi, _complete, _posfix){
  function fnNextActivate(_bol){
    const objNextBtn = document.getElementById('btn_continue');
    if(_next){
      if (_bol){
        objNextBtn.disabled = false;
      }
      else if (!_bol){
        objNextBtn.disabled = true;
      }
      else{
        console.log('chk_plz');
      }
    }
  }
  function fnOneRowStyle(){
    //console.log(strLabel);
    for(k = 0; k < document.querySelectorAll('style').length; k++){
      if (document.querySelectorAll('style')[k].getAttribute('media') == null){
       document.querySelectorAll('style')[k].innerHTML = document.querySelectorAll('style')[k].innerHTML + '@keyframes fallingFadeIn{0%{opacity : 0; transform : translateY(-10px);}100%{opacity : 1; transform : translateY(0px);}}@keyframes fallingInfinityScroll{0%{transform: translateY(-75%);}100%{transform: translateY(8%);}}#question_' + strLabel + ' .grid-list-mode .row-elements{transition-duration: 0.15s;}#question_' + strLabel + ' .grid-list-mode .clicked{background-color: rgba(45, 109, 246, 0.2);}#question_' + strLabel + ' .grid-list-mode .nextShow{animation : fallingFadeIn 0.5s 1 forwards;}#question_' + strLabel + ' .grid-table-mode .createWarp{height: 36px;}#question_' + strLabel + ' .grid-table-mode .createData{cursor: pointer;border: 1px solid #0c148b;overflow: hidden;}#question_' + strLabel + ' .grid-table-mode .createData:has(.arrowHover){transition-duration : 0.5s;color : white;background-color: #2d6df6;overflow: hidden;}#question_' + strLabel + ' .grid-table-mode .createArrowWrap{max-height: 36px;transform: translateY(-75%);pointer-events: none;}#question_' + strLabel + ' .grid-table-mode .arrowHover{animation : fallingInfinityScroll 0.7s infinite linear;}#question_' + strLabel + ' .grid-table-mode .createArrowWrap .downfallArrow{position: relative;display: block;width: 30px;left: 50%;transform: translateX(-50%);}#question_' + strLabel + ' .grid-list-mode .createWarp{position: relative;display: block;width: 100%;height: 36px;margin-top: 5px;border: 1px solid #ccc;border-radius: 10px;box-shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1);animation : fallingFadeIn 0.5s 1 forwards;overflow: hidden;}#question_' + strLabel + ' .grid-list-mode .createHead{pointer-events: none;}#question_' + strLabel + ' .grid-list-mode .createData{position: relative;display: block;height: 100%;width: 100%;cursor: pointer;overflow: hidden;}#question_' + strLabel + ' .grid-list-mode .createData:has(.arrowHover){transition-duration : 0.5s;color : white;background-color: #2d6df6;}#question_' + strLabel + ' .grid-list-mode .createArrowWrap{max-height: 36px;transform: translateY(-75%);pointer-events: none;}#question_' + strLabel + ' .grid-list-mode .arrowHover{animation : fallingInfinityScroll 0.7s infinite linear;}#question_' + strLabel + ' .grid-list-mode .createArrowWrap .downfallArrow{position: relative;display: block;width: 30px;left: 50%;transform: translateX(-50%);}.survey-buttons .showWrap{pointer-events: none;}.survey-buttons .showWrap .backgroundText{position: relative;display: block;opacity: 0;font-size: 0.9rem;pointer-events: none;}.survey-buttons .showWrap .showText{position: absolute;display: block;width: 100%;left: 50%;top: 50%;transform: translate(-50%, -50%);}.survey-buttons .showWrap .commonCheck{position: absolute;display: block;width: 20px;left: 50%;top: 50%;transform: translate(-50%, -50%);}';
       if(_posfix){
        document.querySelectorAll('style')[k].innerHTML = document.querySelectorAll('style')[k].innerHTML + '#primary:has(#question_' + strLabel + ') .survey-buttons .showWrap{position: absolute;display: inline-block;}';
       }
       else{
        document.querySelectorAll('style')[k].innerHTML = document.querySelectorAll('style')[k].innerHTML + '#primary:has(#question_' + strLabel + ' .answers-table) .survey-buttons .showWrap{position: absolute;display: inline-block;}#primary:has(#question_' + strLabel + ' .answers-list) .survey-buttons .showWrap{position: fixed;display: block;right: 5%;top: 2%;}';
       }
       break;
      }
    }
  }
  function fnShow(_target, _type, _click){
    if(_type === 'radio' || _type === 'all'){
      _target.style.display = ''; 
      _target.classList.add('nextShow');
    }
    else if(_type === 'checkbox'){
      if(_target.className.indexOf('row-col-legends') === -1){
        const objTargetParent = _target.parentNode;
        let numClickTargetIndex;
        for(i = 0; objTargetParent.childNodes.length; i++){
          if(objTargetParent.childNodes[i] === _click){
            numClickTargetIndex = i
            break;
          }
        }
        const objClickTarget = objTargetParent.childNodes[numClickTargetIndex];
        if(objClickTarget.getAttribute('class').indexOf('MA_continue') === -1){
          objClickTarget.classList.add('MA_continue');
          const objCreateWrap = document.createElement('tr');
          const objCreateTableHead = document.createElement('th');
          const objCreateTableData = document.createElement('td');
          const objCreateArrowWrap = document.createElement('div');
          const strDownfallArrow = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" class="downfallArrow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" /></svg><svg xmlns="http://www.w3.org/2000/svg" fill="none" class="downfallArrow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" /></svg>';
          objCreateWrap.className = 'createWarp';
          objCreateTableHead.className = 'createHead';
          objCreateTableData.className = 'createData';
          objCreateArrowWrap.className = 'createArrowWrap';
          objCreateTableData.setAttribute('colspan', numColCound);
          objCreateTableData.addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();
            fnFinder(e.target.parentNode, 'all', e.target.parentNode);
            e.target.parentNode.remove();
          })
          objCreateTableData.addEventListener('mouseover', function(e){
            e.target.childNodes[0].classList.add('arrowHover');
          })
          objCreateTableData.addEventListener('mouseleave', function(e){
            e.target.childNodes[0].classList.remove('arrowHover');
          })
          objCreateArrowWrap.innerHTML = strDownfallArrow;
          objCreateTableData.append(objCreateArrowWrap);
          objCreateWrap.append(objCreateTableHead);
          objCreateWrap.append(objCreateTableData);
          objTargetParent.insertBefore(objCreateWrap, _target);
        }
        if(!_multi){
          fnMultiAllClick(objTargetParent);
        }
      }
    }
  }
  function fnMultiAllClick(_target){
    while(_target.querySelectorAll('.createData').length != 0){
      _target.querySelector('.createData').click();
    }
  }
  function fnCheck(_target){
    let checkFlag = false;
    let strMainType = document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1].querySelector('td input').type;
    while(_target.querySelectorAll('.hasError').length >= 1){
      _target.querySelectorAll('.hasError')[0].classList.remove('hasError');
    }
    for(i = 0; i < _target.querySelectorAll('input[type=' + strMainType + ']').length; i++){
      if(_target.querySelectorAll('.fir-icon')[i].className.indexOf('selected') !== -1 && _target.querySelectorAll('input[type=' + strMainType + ']')[i].checked){
        checkFlag = true;
        break;
      }
    }
    return checkFlag;
  }
  function fnAllCheck(){
    const objList = document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1].childNodes;
    let strMainType = document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1].querySelector('td input').type;
    for(i = 0; i < objList.length; i++){
      for(k = 0; k < objList[i].querySelectorAll('input[type=' + strMainType + ']').length; k++){
        if(objList[i].querySelectorAll('.fir-icon')[k].className.indexOf('selected') !== -1 && objList[i].querySelectorAll('input[type=' + strMainType + ']')[k].checked){
          objList[i].classList.add('clicked');
          break;
        }   
      }
    }
  }
  function fnScroll(_target, _str){
    const strCheck = _str === null ? 'blank' : _str
    if(_scroll){
      if(strCheck === 'end'){
        const objMain = document.getElementById('surveyContainer') === null ? document.querySelector('html') : document.getElementById('surveyContainer');
        objMain.scrollTop = objMain.scrollTop + document.querySelector('#btn_continue').getBoundingClientRect().top;
      }
      else if(strCheck === 'error'){
        const objMain = document.getElementById('surveyContainer') === null ? document.querySelector('html') : document.getElementById('surveyContainer');
        objMain.scrollTop = objMain.scrollTop + document.querySelector('#' + strLabel + '_error').getBoundingClientRect().top;
      }
      else{
        if(_target.className.indexOf('clicked') === -1){
          let strPlatform = document.querySelector('#question_' + strLabel + ' .grid').className.indexOf('grid-table-mode') !== -1 ? 'pc' : document.querySelector('#question_' + strLabel + ' .grid').className.indexOf('grid-list-mode') !== -1 ? 'mobile' : 'undefined'
          const objMain = document.getElementById('surveyContainer') === null ? document.querySelector('html') : document.getElementById('surveyContainer');
          const targetHeight = Number(getComputedStyle(_target).height.split('px')[0]); // 자동 스크롤 될 타겟의 height 값. 즉, 높이
          const targetPosY = _target.getBoundingClientRect().top; // 뷰포트 기준의 Y축 값. 즉, 상대적 Y좌표값
          const mainScrollPosY = objMain.scrollTop; // 스크롤을 할 수 있는 엘레먼트가 가지고 있는 현재 스크롤 Y좌표값. 
          if(strPlatform === 'pc'){
            const numMarginHeight = 100; // mainHeight는 응답자가 보고있는 화면(뷰포트) 기준으로 화면 높이 - 현재 스크롤 값. 즉, 나머지 스크롤 할 수 있는 값을 구함
            const mainHeight = document.getElementById('surveyContainer') === null ? window.innerHeight - numMarginHeight : Number(getComputedStyle(objMain).height.split('px')[0]) - numMarginHeight;
            if(mainHeight < (targetHeight + targetPosY)) objMain.scrollTop = mainScrollPosY + ((targetHeight + targetPosY) - mainHeight);
          }
          else if(strPlatform === 'mobile'){
            const numMarginHeight = 0;
            const mainHeight = document.getElementById('surveyContainer') === null ? window.innerHeight - numMarginHeight : Number(getComputedStyle(objMain).height.split('px')[0]) - numMarginHeight;
            let objMarginTarget = _target.previousSibling;
            let numMarginTop = 0;
            while(objMarginTarget !== null && (objMarginTarget.className.indexOf('row-group') !== -1 || objMarginTarget.className.indexOf('row-col-legends') !== -1)){
              numMarginTop += Number(getComputedStyle(objMarginTarget).height.split('px')[0]) + Number(getComputedStyle(objMarginTarget.querySelector('th')).marginBottom.split('px')[0]);
              objMarginTarget = objMarginTarget.previousSibling;
            }
            objMain.scrollTop = mainScrollPosY + targetPosY - numMarginTop;
          }
        }
      }
    }
  }
  function fnAnswerCount(){
    const numCount = document.querySelectorAll('#question_' + strLabel + ' .grid .clicked').length;
    return numCount;
  }
  function fnResultUpdate(){
    const objMain = document.querySelector('#question_' + strLabel);
    const objTargetWarp = objMain.parentNode.querySelector('.survey-buttons #' + strLabel + '_showWrap');
    const objTargetText = objTargetWarp.querySelector('.showText');
    const numTotal = numRowCound;
    const numCurrent = fnAnswerCount();
    const numCalc = numCurrent / numTotal * 100;
    const strInputType = objMain.querySelector('.answers .grid .row-elements td input').type;
    const strCompleteText = _complete === undefined || _complete === 'default' ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.0" stroke="currentColor" class="commonCheck"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>' : _complete;
    objTargetText.innerText = numCurrent + " / " + numTotal;
    let arrCheckList = new Array();
    if(numCalc >= 100){
      objTargetWarp.classList.add('complete');
      objTargetText.classList.add('textComplete');
      objTargetText.innerHTML = strCompleteText;
      fnMultiAllClick(document.querySelector('#question_' + strLabel + ' .grid'));
      objTargetWarp.querySelector('.backgroundText').innerText = _complete === undefined || _complete === 'default' ? objTargetWarp.parentNode.querySelector('.survey-buttons #btn_continue').value : _complete;
      if(strInputType === 'radio') for(i = 0; i < objMain.querySelectorAll('.answers .grid tbody')[1].childNodes.length; i++){
        objMain.querySelectorAll('.answers .grid tbody')[1].childNodes[i].classList.add('nextShow');
      }
      else if(strInputType === 'checkbox') for(i = 0; i < objMain.querySelectorAll('.answers .grid .row-elements').length; i++){
        objMain.querySelectorAll('.answers .grid .row-elements')[i].classList.add('MA_continue');
      }
      if(objMain.querySelectorAll('.answers .grid tr .hasError').length === 0){
        if(numRowCound !== numCurrentAnswerCount){
          if(strInputType === 'radio') fnScroll(null, 'end');
        }
        else{
          numCurrentAnswerCount = 0;
        }
      }
    }
    else{
      objTargetWarp.classList.remove('complete');
      objTargetText.classList.remove('textComplete');
      objTargetWarp.querySelector('.backgroundText').innerText = objTargetWarp.parentNode.querySelector('.survey-buttons #btn_continue').value;
      if(!_multi) fnMultiAllClick(document.querySelector('#question_' + strLabel + ' .grid'));
    }
    for(i = 0; i < document.getElementsByClassName('showWrap').length; i++){
      if(document.getElementsByClassName('showWrap')[i].className.indexOf('complete') !== -1) arrCheckList[i] = true;
      else arrCheckList[i] = false;
    }
    if(arrCheckList.every(function(_bol){return _bol})) fnNextActivate(true);
    else fnNextActivate(false);
  }
  function fnResultShow(){ 
    const objShowCountArea = document.querySelector('#question_' + strLabel).parentNode.querySelector('.survey-buttons');
    const objShowWrap = document.createElement('div');
    const objBackgroundText = document.createElement('div');
    const objShowText = document.createElement('div');
    if(!_result) objShowWrap.setAttribute('style', 'display:none !important');
    objShowWrap.oncontextmenu = function(){ return false; };
    objShowWrap.onselectstart = function(){ return false; };
    objShowWrap.ondragstart = function(){ return false; };
    objShowWrap.onscroll = function(){ return false; };
    objBackgroundText.innerText = objShowCountArea.querySelector('#btn_continue').value;
    objShowWrap.id = strLabel + '_showWrap';
    objShowWrap.classList.add('showWrap');
    objShowWrap.classList.add('button');
    objShowText.classList.add('showText');
    objBackgroundText.classList.add('backgroundText');
    objShowWrap.append(objBackgroundText);
    objShowWrap.append(objShowText);
    objShowCountArea.append(objShowWrap);
    fnResultUpdate();
  }
  function fnFinder(_target, _type, _click){
    const objTargetParent = _target.parentNode;
    let numClickTargetIndex;
    for(i = 0; i < objTargetParent.childNodes.length; i++){
      if(objTargetParent.childNodes[i] === _click){
        numClickTargetIndex = i + 1;
        if(_type === 'radio' || _type === 'all'){
          for(k = numClickTargetIndex; k < objTargetParent.childNodes.length; k++){
            if(objTargetParent.childNodes[k].className.indexOf('row-group') !== -1 || objTargetParent.childNodes[k].className.indexOf('row-col-legends') !== -1){
              fnShow(objTargetParent.childNodes[k], 'all');
            }
            else if(objTargetParent.childNodes[k].className.indexOf('row-elements') !== -1){
              fnShow(objTargetParent.childNodes[k], _type, _click);
              fnScroll(objTargetParent.childNodes[k]);
              break;
            }
          }
        }
        else if(_type === 'checkbox'){
          fnShow(objTargetParent.childNodes[numClickTargetIndex], _type, _click);
        }
      }
    }
  }
  function fnInit(){
    fnNextActivate(false);
    const objMain = document.getElementById('surveyContainer') === null ? document.querySelector('html').style.scrollBehavior = 'smooth' : document.getElementById('surveyContainer').style.scrollBehavior = 'smooth';
    const arrCheckList = document.querySelectorAll('#question_' + strLabel + ' .grid .clickableCell');
    let strMainType = document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1].querySelector('td input').type;
    for(i = 0; i < arrCheckList.length; i++){
      jQuery(arrCheckList[i].querySelector('input[type=' + strMainType + ']')).on("propertychange change input", (e) => {
        let tempCurrentParent = e.target.parentNode.className.indexOf('clickableCell') !== -1 ? e.target.parentNode.parentNode : e.target.parentNode.parentNode.parentNode.parentNode;
        let tempParentNext = tempCurrentParent.nextSibling;
        if(fnCheck(tempCurrentParent)){
          tempCurrentParent.classList.add('clicked');
        }
        else{
          tempCurrentParent.classList.remove('clicked');
        }
        fnResultUpdate();
        if(e.target.checked && tempParentNext !== null){
          fnFinder(tempParentNext, e.target.type, tempCurrentParent);
        }
      });
      if(arrCheckList[i].parentNode.nextSibling !== null){
        if(arrCheckList[i].querySelector('.fir-icon').className.indexOf('selected') !== -1 && arrCheckList[i].querySelector('input[type=' + strMainType + ']').checked){
          fnShow(arrCheckList[i].parentNode.nextSibling, 'all');
        }
      }
    }
    for(i = 0; i < document.querySelectorAll('#question_' + strLabel + ' .grid tr').length; i++){
      if(document.querySelectorAll('#question_' + strLabel + ' .grid tr')[i].className.indexOf('hasError') !== -1){
        fnScroll(null, 'error');
        break;
      }
    }
    fnOneRowStyle();
    fnAllCheck();
    fnResultShow();
  }
  const strLabel = _label;
  const numRowCound = _row;
  const numColCound = _col;
  let numCurrentAnswerCount = _answer;
  if(numRowCound <= 1 || numColCound <= 1){
    console.log('onerowatatime not activate. row or col is 1 or less.');
  }
  else if(document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length !== 2 || document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1].querySelectorAll('.row-elements').length === 0){
    console.log('onerowatatime not activate. DOM structures are not suitable for function execution.');
  }
  else if(numRowCound === numCurrentAnswerCount){
    const objTarget = document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1];
    let strMainType = document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1].querySelector('td input').type;
    for(k = 0; k < objTarget.childNodes.length; k++){
      if(objTarget.childNodes[k].className.indexOf('row-group') !== -1 || objTarget.childNodes[k].className.indexOf('row-col-legends') !== -1){
        fnShow(objTarget.childNodes[k], 'all');
      }
      else if(objTarget.childNodes[k].className.indexOf('row-elements') !== -1){
        fnShow(objTarget.childNodes[k], 'all');
        break;
      }
    }
    if(objTarget.childNodes[objTarget.childNodes.length - 1].className.indexOf('row-col-legends') !== -1) fnShow(objTarget.childNodes[objTarget.childNodes.length - 1], 'all');
    fnInit();
  }
  else{
    const objTarget = document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1];
    let strMainType = document.querySelectorAll('#question_' + strLabel + ' .grid tbody')[document.querySelectorAll('#question_' + strLabel + ' .grid tbody').length - 1].querySelector('td input').type;
    for(i = 0; i < objTarget.childNodes.length; i++){
      objTarget.childNodes[i].setAttribute('style', 'display:none !important');
    }
    if(numRowCound !== numCurrentAnswerCount){
      for(k = 0; k < objTarget.childNodes.length; k++){
        if(objTarget.childNodes[k].className.indexOf('row-group') !== -1 || objTarget.childNodes[k].className.indexOf('row-col-legends') !== -1){
          fnShow(objTarget.childNodes[k], 'all');
        }
        else if(objTarget.childNodes[k].className.indexOf('row-elements') !== -1){
          fnShow(objTarget.childNodes[k], 'all');
          break;
        }
      }
      if(objTarget.childNodes[objTarget.childNodes.length - 1].className.indexOf('row-col-legends') !== -1) fnShow(objTarget.childNodes[objTarget.childNodes.length - 1], 'all');
      fnInit();
    }
  }
}

function fnEventRemove(_label){
  const objTarget = document.querySelector('#question_' + _label);
  const objClone = objTarget.cloneNode(true);
  objTarget.parentNode.replaceChild(objClone, objTarget);
  objClone.style.pointerEvents = "none";
  objClone.setAttribute('tabindex', '-1');
  objClone.oncontextmenu = function(){ return false; };
  objClone.onselectstart = function(){ return false; };
  objClone.ondragstart = function(){ return false; };
}

// Dial
function hexToRgbA(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createDial(
    selector = ".custom-diar",
    barColor = "#2d6df6",
    barWidth = 50,
    backGroundColor = "lightgray",
    inputWidth = 80,
    inputFontSize = 38,
    rounded = true,
    canvasSize = 200
) {
    const diars = document.querySelectorAll(selector);
    let currentAngle = 0;
    let targetAngle = 0;

    // 숨기기 스타일 추가
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
${selector} {
  position: relative;
  width: ${canvasSize}px;
  height: ${canvasSize}px;
}

@media (max-width: 800px){
    ${selector} {
        margin: 0 auto;
    }
}

${selector} canvas {
  transform: rotate(90deg);
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

${selector} input[type=number] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${inputWidth}px;
  text-align: center;
  border: 1px solid ${backGroundColor};
  border-radius: 10px;
  outline: none;
  color: ${barColor};
  font-size: ${inputFontSize}px;
  transition: border 0.25s, box-shadow 0.25s;
}
${selector} input[type=number]:focus {
  border: 1px solid ${barColor};
  box-shadow: 0 0 10px ${hexToRgbA(barColor, 0.5)};
}


${selector} input[type=number]::-webkit-inner-spin-button, 
${selector} input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}`;
    document.head.appendChild(styleSheet);


    diars.forEach(diar => {
        const canvas = diar.querySelector('canvas');
        const inputElem = diar.querySelector('input');
        const minValue = parseInt(inputElem.getAttribute('min'));
        const maxValue = parseInt(inputElem.getAttribute('max'));

        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const ctx = canvas.getContext('2d');
        let isDragging = false;

        function drawDonut(value) {
            const angleValue = ((value - minValue) / (maxValue - minValue)) * 2 * Math.PI;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 배경 도넛
            ctx.beginPath();
            ctx.arc(canvasSize / 2, canvasSize / 2, (canvasSize / 2) - (barWidth / 2), 0, 2 * Math.PI);
            ctx.lineWidth = barWidth;
            ctx.strokeStyle = backGroundColor;
            ctx.stroke();

            // 색을 채운 도넛
            if (rounded) ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(canvasSize / 2, canvasSize / 2, (canvasSize / 2) - (barWidth / 2), 1.5 * Math.PI, 1.5 * Math.PI + angleValue);
            ctx.lineWidth = barWidth;
            ctx.strokeStyle = barColor;
            ctx.stroke();
            ctx.lineCap = 'butt';
        }

        function updateDial(x, y) {
            const angle = Math.atan2(y - (canvasSize / 2), x - (canvasSize / 2));
            const filledAngle = angle >= 0 ? angle : 2 * Math.PI + angle;
            const value = minValue + Math.round((filledAngle / (2 * Math.PI)) * (maxValue - minValue));
            inputElem.value = value;
            drawDonut(value);
        }

        drawDonut(parseInt(inputElem.value));

        function startDial(x, y, prevent=false){
            isDragging = true;
            updateDial(
                x - canvas.getBoundingClientRect().left, 
                y - canvas.getBoundingClientRect().top
            )

            if( prevent ){
                event.preventDefault();
            }
        }

        function endDial(){
            isDragging = false;
        }

        function moveDial(x, y, prevent=false){
            if (isDragging) {
                updateDial(
                    x - canvas.getBoundingClientRect().left, 
                    y - canvas.getBoundingClientRect().top
                );
            }
            if( prevent ){
                event.preventDefault();
            }
        }

        canvas.addEventListener('mousedown', (event) => { startDial(event.clientX, event.clientY); });
        canvas.addEventListener('touchstart', (event) => { startDial(event.touches[0].clientX, event.touches[0].clientY, true); });

        canvas.addEventListener('mousemove', (event) => { moveDial(event.clientX, event.clientY); });
        canvas.addEventListener('touchmove', (event) => { moveDial(event.touches[0].clientX, event.touches[0].clientY, true); });

        canvas.addEventListener('mouseup', () => { endDial(); });
        canvas.addEventListener('mouseleave', () => { endDial(); });
        canvas.addEventListener('touchend', () => { endDial(); });

        inputElem.addEventListener('input', () => {
            let value = parseInt(inputElem.value);
            
            // 입력 값이 유효 범위를 벗어나면 초기값으로 재설정
            if (value > maxValue) {
                value = '';
                inputElem.value = value;
            } else if (value < minValue || isNaN(value)) {
                value = '';
                inputElem.value = value;
            }

            drawDonut(value);
        });
    });
}


// Custom Button Style JS
const updateLabelStyle = (element, isSelected)=>{
   const label = element.querySelector('.cell-sub-wrapper');
   if (label) {
       label.style.backgroundColor = isSelected ? '#b7ceff' : '';
   }
}

const maxHeightHandler = (applyElement, baseElement, init=true, padding='5px') => {
    const originalMaxHeight = applyElement.style.maxHeight;

    let paddingValue = 0;
    if( padding !== undefined && padding !== null ){
        paddingValue = parseInt(padding.replace('px', ''));
    }

    applyElement.style.maxHeight = 'none';
    const domMaxHeight = applyElement.offsetHeight + paddingValue + 3;
    applyElement.style.maxHeight = originalMaxHeight;

    if( init ){
        window.requestAnimationFrame(() => {
            if (applyElement.style.maxHeight === '0px') {
                applyElement.style.maxHeight = `${domMaxHeight}px`;
                applyElement.style.padding = padding;
                baseElement.classList.add('ch-open');
            } else {
                applyElement.style.maxHeight = '0px';
                applyElement.style.padding = '0';
                baseElement.classList.remove('ch-open');
            }
        });
    }else{
        window.requestAnimationFrame(() => {
            applyElement.style.maxHeight = `${domMaxHeight}px`;
            applyElement.style.padding = padding;
            baseElement.classList.add('ch-open');
        });
    }
};

function handleButtonColor(element) {
    const firIcon = element.querySelector('.fir-icon');
    const isSelected = firIcon && firIcon.classList.contains('selected');
    updateLabelStyle(element, isSelected);
}

const observeElements = () => {
    const elements = document.querySelectorAll('.sp-custom-btn .answers .element');
    elements.forEach(element => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    handleButtonColor(element);
                }
            });
        });

        observer.observe(element, { attributes: true, subtree: true });
        handleButtonColor(element);
    });
}

const setCustomBtn = ()=>{
  const btnClass = document.querySelectorAll('.sp-custom-btn');

  if( btnClass.length == 0 ){
    return;
  }

  const mainStyle = document.createElement('style');
  mainStyle.innerHTML = `
.btn-exclusive {
    max-width: 924px;
}

.sp-custom-btn .answers .element {
  padding: unset;
  border-radius: 7px;
  margin-bottom: 3px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.sp-custom-btn .answers .element .cell-text {
  width: 100%;
  max-width: 924px;
  padding: 5px;
}

.sp-custom-btn .answers .element { 
    transition: background-color 0.5s;
}

.sp-custom-btn .answers .element img { 
    pointer-events: none;
}

.sp-custom-btn .answers .element .cell-sub-wrapper {
  padding-left: 0.25em;
  border-radius: 7px;
  border: 1px solid #959595;
  width: 100%;
  max-width: 924px;
  overflow: hidden;
}


.sp-custom-btn .answers .element .cell-sub-wrapper .cell-sub-column {
  height: 100%;
}

.sp-custom-btn .answers .element label {
  display: block;
  width: 100%;
  height: 100%;
  padding: 5px;
  font-size: 1.2rem;
}

.sp-custom-btn .answers .element input[type="text"] {
  margin-left: 6px;
}

.hasError .ch-group-toggle .ch-group-rows .hasError .cell-text {
    border-bottom: unset !important;
}

.sp-custom-btn .ch-group-toggle .hasError.element .cell-sub-wrapper {
    border: 1px solid #e7046f;
}

.sp-custom-btn.hasError .ch-group-toggle .ch-group-rows {
    background-color: unset !important;
}

.sp-custom-btn .element.hasError:not(.btn-hover) {
    background-color: unset !important;
}

.sp-custom-btn .element.hasError .cell-sub-wrapper{
  border-color: #e7046f!important;
}

.btn-hover {
  background-color: #b7ceff!important;
}

@media (max-width: 768px) {
  .sp-custom-btn .answers .element {
    max-width: 100%;
  }

  .sp-custom-btn .answers .element input[type="text"] {
    width: 90%;
  }

  .sp-custom-btn .answers .element label { 
    font-size: 1.1rem;
  }
}
  `;
  document.head.appendChild(mainStyle);
  
  
  observeElements();


  btnClass.forEach((btn, btnIndex)=>{

    const btnClassList = btn.classList;
    const btnId = btn.id;

    const checkCols = [...btnClassList].filter(cl => cl.includes('btn-cols-'));

    const minColClass = [...btnClassList].filter(cl => cl.includes('min-col-'));
    const minColCount = minColClass.length >= 1 ? minColClass[0].split('-')[2] : 1;

    let colNumber = checkCols.length >= 1 ? checkCols[0].split('-')[2] : 1;
    if( minColCount > 1 && colNumber == 1 ){
        colNumber = minColCount; 
    }
    const newClassName = `custom-btn-cols-${colNumber}`;

    


    const style = document.createElement('style');
    btn.querySelector('.answers').appendChild(style);
    
    // With Custom Toggle Group 
    const groupRow = btn.querySelectorAll('.ch-group-rows');
    style.innerHTML = `
#${btnId} .${newClassName} ${groupRow.length>=1 ? '.ch-group-rows' : ''}{
  display: grid;
  grid-template-columns: repeat(${colNumber}, 1fr);
  width: 100% !important;
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  max-width: 924px;
  align-items: stretch;
  ${groupRow.length>=1 ? 'padding: 5px;' : ''}
}

#${btnId} .${newClassName} .element {
    display: flex;
    align-items: stretch;
}

`;

      if (colNumber >= 3) {
        style.innerHTML += `
@media (max-width: 1000px) {
    #${btnId} .${newClassName} ${groupRow.length>=1 ? '.ch-group-rows' : ''}{
      grid-template-columns: repeat(${minColCount == 1 ? 2 : (colNumber-1 > minColCount ? colNumber-1 : minColCount)}, 1fr);
    }
}`;
    }

    const answers = btn.querySelector('.answers');
    const mainBefore = document.createElement('div');
    const mainAfter = document.createElement('div');
    answers.parentNode.insertBefore(mainBefore, answers);
    answers.parentNode.insertBefore(mainAfter, answers.nextSibling);

    mainBefore.classList.add('answers', 'btn-exclusive', 'answers-before');
    mainAfter.classList.add('answers', 'btn-exclusive', 'answers-after');

    answers.classList.add(newClassName);
    
    const checkMaxWidth = [...btnClassList].filter((cl)=> cl.includes('btn-mw-'));

    if( checkMaxWidth.length == 1 ) {
        const setMaxWidth = checkMaxWidth[0].split('-').slice(-1)[0];
        style.innerHTML += `
#${btnId} .answers {
    max-width: ${setMaxWidth}px;
}
`;
    }

    style.innerHTML += `
@media (max-width: 768px) {
    #${btnId} .${newClassName} ${groupRow.length>=1 ? '.ch-group-rows' : ''}{
        grid-template-columns: repeat(${minColCount}, 1fr);
    }

    #${btnId} .answers {
        max-width: 100%;
    }

    #${btnId} .answers .element {
        max-width: 100% !important;
    }
}`;




    const wrapper = btn.querySelectorAll('.answers .element');
    let maxHeight = Array.from(wrapper).reduce((max, el) => Math.max(max, el.clientHeight), 0);

    if( maxHeight <= 50 ){
        maxHeight = 50;
    }

    style.innerHTML +=  `
#${btnId} .cell-sub-wrapper {
    min-height: ${maxHeight}px;
}
    `;

    const elements = btn.querySelectorAll('.answers .element');

    elements.forEach((element)=>{
        const labelNode = element.querySelector('label');
        const inputNode = element.querySelector('input');
        const openCheck = element.querySelector('input[type=text], input[type=number], select');
        
        const firCheck = element.querySelector('.fir-icon');
        //firCheck.style.pointerEvents = 'none';

        const notClickNodes = ['label', 'input', 'input[type=text]', 'rect', 'polygon', 'circle', '.fir-icon']
        const notClickNodesMap = notClickNodes.map((nd)=> element.querySelector(nd));
        
        if( element.classList.contains('btn-top') ){
            mainBefore.appendChild(element);
        }

        if( element.classList.contains('btn-bot') ){
            mainAfter.appendChild(element);
        }

        element.addEventListener('click', (event) => {
            // if (!notClickNodesMap.includes(event.target)) {
            //     labelNode.click();
            // }

            const cond = ['element', 'cell-input', 'cell-text', 'cell-sub-wrapper'].some(className => event.target.classList.contains(className));
            if( cond ){
                labelNode.click();
            }

            if( openCheck && inputNode.checked ) {
                openCheck.focus();
            }
        });

        ['touchstart', 'mouseover'].forEach((ev)=>{
            element.addEventListener(ev, () => {
                element.classList.add('btn-hover');
            });
        });
        ['touchend', 'mouseout'].forEach((ev)=>{
            element.addEventListener(ev, () => {
                element.classList.remove('btn-hover');
            });
        });
    });

  
    // Loop Custom Btn
    const btnFocusFlag = btn.classList.contains('btn-focus');
    if( btnFocusFlag ){
        style.innerHTML += `
#${btnId}.question.sp-custom-btn {
  max-width: 924px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 10px;
  overflow: hidden;
}

#${btnId}.question.sp-custom-btn .question-text {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  margin-bottom: unset;
}

#${btnId}.question.sp-custom-btn .instruction-text {
  display: none;
}

#${btnId}.answers-before {
  display: none;
}

#${btnId}.question.sp-custom-btn .answers {
  padding: 5px;
}


.question-error-text {
    padding: 5px;
}

* {
  scroll-behavior: smooth;
}
`;
        const questionText = btn.querySelector('.question-text');
        questionText.setAttribute('tabindex', btnIndex);

        // Toggle TBD
        // const baseElement = btn.querySelector('.question-text');
        // const applyElement = btn.querySelectorAll('.answers');

        // const clickHandler = (init=true)=>{
        //     [...applyElement].forEach((el, index)=>{
        //          maxHeightHandler(el, baseElement, init);
        //     });
        // }

        // if( btn.classList.contains('hasError') ){
        //     clickHandler(false);
        // }else{
        //     if( btnIndex === 0 ){
        //         clickHandler(false);
        //     }else{
        //         clickHandler();
        //     }
        // }

        // baseElement.addEventListener('click', ()=>{
        //     clickHandler();
        // });

    } else {
        style.innerHTML += `
.answers-before {
    margin-bottom: 7px;
}

.answers-after {
    margin-top: 7px;
}
`;
    }


    // Focus Setting
    if( btnFocusFlag ){
        if( btn.classList.contains('noCols', 'radio') || btn.classList.contains('noRows', 'radio') ){
            if( btn.classList.contains('checkbox') ){
                return;
            }
            const focusBase = btn.querySelector('.question-text');
            const selectedStatus = (document.querySelectorAll('.fir-icon.selected').length == 0 || document.querySelectorAll('.hasError').length == 0);

            const lastIndex = btnClass.length-1;
            const continueBtn = document.querySelector('.button.continue');
            elements.forEach((el)=>{
                const hasOpen = el.querySelector('input[type=text], input[type=number], select');

                el.addEventListener('click', ()=>{
                    const elRadio = el.querySelector('input[type=radio]');
                    if( hasOpen ){
                        hasOpen.focus();
                    }else{
                        if(el.querySelector('.fir-icon.selected')){
                            if( btnIndex === lastIndex ){
                                continueBtn.focus();
                                if( btn.classList.contains('auto-continue') && selectedStatus ){
                                    continueBtn.click();
                                }
                            }else{
                                let nextFocus = btnIndex+1
                                let continueClickFlag = false;
                                while (true) {
                                    if( nextFocus >= [...btnClass].length ){
                                        continueClickFlag = true;
                                        break
                                    }
                                    let chkFir = [...btnClass][nextFocus].querySelectorAll('.fir-icon.selected');
                                    if( chkFir.length === 0 ){
                                        break;
                                    }
                                    nextFocus++;
                                }

                                if( !continueClickFlag ){
                                    const nextQuestionText = [...btnClass][nextFocus].querySelector('.question-text');
                                    nextQuestionText.focus();                                
                                }else{
                                    continueBtn.focus();
                                    if( btn.classList.contains('auto-continue') && selectedStatus ){
                                        continueBtn.click();
                                    }
                                }

                            }
                        }
                    }
                });
            });
        }
    }

  });
}

// window.addEventListener('DOMContentLoaded', setCustomBtn);


// Number Question Focus
const customInputBox = ()=>{
    const inputBoxQuestion = document.querySelectorAll('.sp-custom-input');
    if(inputBoxQuestion.length == 0){
        return;
    }

    const mainStyle = document.createElement('style');
    mainStyle.innerHTML = `
.sp-custom-input .answers div.element .cell-legend-above {
  width: 100%;
}

.sp-custom-input .answers div.element.groupingCols .cell-text {
  border-bottom: 1px solid #ccc;
  transition: background-color 0.5s;
}

.sp-custom-input .answers div.element.groupingCols .cell-text label {
  width: 100%;
  padding: 10px;
  display: block;
}

.sp-custom-input .answers div.element .cell-input {
  padding: 10px 10px 10px 13px;
  display: flex;
  align-items: center;
}

.sp-custom-input .answers div.element.groupingCols .cell-sub-wrapper {
  overflow: hidden;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.sp-custom-input .answers div.element.groupingCols .cell-sub-wrapper:hover .cell-text {
  background-color: #b7ceff;
}
`;
    document.head.appendChild(mainStyle);

    inputBoxQuestion.forEach((numq)=>{
        const elements = numq.querySelectorAll('.element');

        if( elements.length ==0 ){
            return
        }

        // table mode skip
        const tableMode = numq.querySelector('.grid-table-mode');
        if( tableMode ){
            return;
        }

        elements.forEach((el)=>{
            const cellInput = el.querySelector('.cell-input');
            if( !cellInput ){
                return;
            }

            cellInput.style.cursor = 'pointer';

            const inputBox = el.querySelector('input[type="number"], input[type="text"], select');
            cellInput.addEventListener('click', ()=>{
                if( inputBox ){
                    inputBox.focus();
                }
            });
        });
    });
}

window.addEventListener('DOMContentLoaded', customInputBox);


const checkElement = (el) => {
    return (el !== undefined && el !== null)
}

const autoClickContinue = (flag)=>{
    if(!flag){ return }

    const questions = document.querySelectorAll('.question');
    const questionRadio = document.querySelectorAll('.question.radio.noCols, .question.radio.noRows');
    
    if( questions === undefined || questions === null ){
        return
    }

    if( (questions.length > 1) ){ 
        return 
    }

    const continueBtn = document.querySelector('#btn_continue');

    [...questionRadio].forEach((radio)=>{
        // atmtable
        if( radio.classList.contains('sq-atmtable') ){
            const atmtableBtn = radio.querySelectorAll('.sq-atmtable-btn');
            [...atmtableBtn].forEach((btn)=>{
                btn.addEventListener('click', ()=>{
                    const btnInput = btn.querySelector('input[type=radio]');
                    btnInput.checked = true;
                    btn.classList.add('.sq-atmtable-btn-selected');
                    continueBtn.click();
                });
            })
        }else{
            const elements = radio.querySelectorAll('.element');
            if( elements.length == 0 ){
                return;
            }

            elements.forEach((element)=>{
                element.addEventListener('click', ()=>{
                    const inputRadio = element.querySelector('input[type=radio]:checked');
                    const inputText = element.querySelector('input[type=text]');

                    if( !checkElement(inputText) ){
                        if( checkElement(inputRadio) ){
                            continueBtn.click();
                        }
                    }
                });
            });
        }
    });
}