const setMinHeightForRankText = ()=>{
    const rankTextElements = document.querySelectorAll('.rank-text');
    let maxHeight = 0;
    
    if( [...rankTextElements].length > 0 ){
        rankTextElements.forEach(element => {
            element.style.minHeight = '0';
        });

        rankTextElements.forEach(element => {
            if (element.offsetHeight > maxHeight) {
                maxHeight = element.offsetHeight;
            }
        });

        rankTextElements.forEach(element => {
            element.style.minHeight = maxHeight + 'px';
        });            
    }
}

const smoothScrollToBottom = (selector)=>{
  const element = document.querySelector(selector);
  if (!element) return;

  const start = element.scrollTop;
  const end = element.scrollHeight - element.clientHeight;

  const change = end - start;
  const duration = 300;
  let startTime = null;

  const animateScroll = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    element.scrollTop = start + change * progress;

    if (elapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}


const autoScroll = (continueFlag)=>{
    smoothScrollToBottom("#surveyContainer");
    smoothScrollToBottom("html");
    const continueBtn = document.querySelector('#btn_continue');
    continueBtn.focus({preventScroll: true});
    if( continueFlag ){
        continueBtn.click();
    }
}

const HiddenInputs = ({qid, uid, cols, answers, noAnswers, noAnswerCheck})=>{
    // Hidden Input
    return (
        <>
            {cols.map((col)=>{
                return (
                    <div key={col.index} className={`rank-col rank-col-${col.label}`}>
                        <input 
                            type='hidden' 
                            name={`${uid}.${col.index}.0`} 
                            value={answers[col.index] !== undefined? answers[col.index].toString() : ''}
                            disabled={noAnswerCheck}
                        />
                    </div>
                )
            })}
            {noAnswers.map((noanswer, index)=>{
                return (
                    <div key={index} className={`rank-noanswer rank-noanswer-${noanswer.label}`}>
                        <input 
                            type='hidden' 
                            name={`_v2_na_${qid}.${noanswer.label}`} 
                            value={1}
                            disabled={!noAnswerCheck}
                        />
                    </div>
                )
            })}
        </>
    );
}

const ShowRank = ({rankNum})=>{
    return (
            <div 
                className={`rank-number answer-rank-${rankNum} animate__animated animate__bounceIn show-rank-cnt`}>
                    {rankNum}
            </div>
    )
}

const RankBtn = ({row, idx, answers, setAnswers, answerComplete, setAnswerComple, isNone=false, showNone=null, isNoanswer=false, noAnswer=false, noAnswerFnc=null, errors, setFocusNext, qaShow})=>{
    const [isHover, setIsHover] = React.useState(false);
    const [isSelected, setIsSelected] = React.useState(answers.includes(row.index) ? true : false);
    const styleFlag = ()=>{
        if( !isNoanswer ){
            if( isHover || answers.includes(row.index) ){
                return true
            }else{
                return false
            }
        }else{
            if( isHover || isSelected ){
                return true
            }else{
                return false
            }
        }
    }
    const oeRef = React.useRef();

    React.useEffect(()=>{
        if( answers.length === 0 ){
            if( noAnswer ){
                setIsSelected(false);
                setAnswerComple(true);
                if( oeRef.current !== undefined ){
                    const oe = oeRef.current;
                    oe.value = null;
                }

            }
        }
        if( !answers.includes(row.index) ){
            if( !isNoanswer ){
                setIsSelected(false);
            }
        }
    }, [answers]);

    const [errRows, setErrRows] = React.useState(errors.map((err)=>{
        const [errText, errProp, errIndex] = err;
        if( errProp === 'row' ){
            return errIndex;
        }
    }).filter(element=>element));

    const [errCols, setErrCols] = React.useState(errors.map((err)=>{
        const [errText, errProp, errIndex] = err;
        if( errProp === 'col' ){
            return errIndex;
        }
    }).filter(element=>element));

    const [errRowLegends, setrrRowLegends] = React.useState(errors.map((err)=>{
        const [errText, errProp, errIndex] = err;
        if( errProp === 'row-legend' ){
            return errIndex;
        }
    }).filter(element=>element));

    React.useEffect(()=>{
        if( errRowLegends !== undefined ){
            if( errRowLegends.includes(idx) ){
                if( row.open === 1 ){
                    oeRef.current.focus();
                    oeRef.current.style.pointerEvents = '';
                    oeRef.current.style.border = '2px solid #e7046f';
                }
            }
        }
    }, [setrrRowLegends])

    
    return (
        <>
        <div 
            className={`rank-row-btn rank-row-${row.label} animate__animated animate__fadeIn`}>
            <div className="show-rank-div">
                { answers.includes(row.index) && !isNoanswer ? (
                    <ShowRank 
                        rankNum={answers.includes(row.index) ? answers.indexOf(row.index) + 1 : answers.length + 1}/>
                ) :null}
            </div>
            {/* cursor : isNone ? (showNone ? (!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? 'no-drop' : 'pointer' : 'no-drop') : (!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? 'no-drop' : 'pointer', */}
            <div
                className={`rank-text rank-text-${row.label} ${answers.includes(row.index) ? `answer-rank-${answers.indexOf(row.index) + 1}` : ''}`}
                style={{
                        border: (errRows.includes(row.label) || errCols.length >= 1) ? '2px solid #e7046f' : '1px solid #ccc',
                        background : isNone ? (showNone ? (styleFlag() ? '#2d6df6' : (!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? '#918d8d' : '#f7f7f7') : '#918d8d')  : (styleFlag() ? '#2d6df6' : (!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? '#918d8d' : '#f7f7f7'),
                        color : isNone ? (showNone ? (styleFlag() ? '#fff' : '#242424') : '#242424')  : (styleFlag() ? '#fff' : '#242424'),
                        pointerEvents : isNone ? (showNone ? ((!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? 'none' : '') : 'none')  : ((!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? 'none' : ''),
                        marginTop : isNoanswer ? '15px' : '0',
                    }}
                onMouseOver={()=>{
                    setIsHover(true);
                }}
                onMouseOut={()=>{
                    setIsHover(false);
                }}
                onTouchStart={()=>{
                    setIsHover(true);
                }}
                onTouchEnd={()=>{
                    setIsHover(false);
                }}
                onClick={(e)=>{
                    if( !isNoanswer ){
                        setFocusNext(true);
                        const openInput = e.target.querySelector('input[type=text]');
                        if( openInput ){
                            setFocusNext(false);
                        }
                        if( answers.includes(row.index) ){
                            if( e.target.type !== 'text' ){
                                setAnswers( answers.filter((item)=>item !== row.index) );
                                setIsSelected(false);
                                if( openInput ){
                                    openInput.value = null;
                                    openInput.style.pointerEvents = 'none';
                                }
                            }
                        }else{
                            setAnswers([...answers, row.index]);
                            setIsSelected(true);
                            if( openInput ){
                                openInput.focus();
                                openInput.style.pointerEvents = '';
                            }
                        }
                    }else{
                        if( !isSelected ){
                            setIsSelected(true);
                            noAnswerFnc(true);
                        }else{
                            setIsSelected(false);
                            noAnswerFnc(false);
                        }
                    }
                }}>
                <div className={"rank-row-text"} style={{pointerEvents: 'none'}} dangerouslySetInnerHTML={{__html: qaShow ? `<div class="rank-qaCode"><div class="qaCode-label">[${row.label}]</div><div>${row.text}</div></div>` : row.text}}></div>
                {row.open === 1 ? (
                    <div style={{
                        marginTop : '5px',
                        width : '100%'
                    }}>
                        <input 
                            type='text' 
                            name={row.openName}
                            ref={oeRef}
                            defaultValue={row.openValue}
                            style={{
                                width: '100%',
                                maxWidth: '200px',
                                pointerEvents: 'none',
                            }}/>
                    </div>
                ) : null}
            </div>
        </div>
        </>
    )
}


const GridRankSort = ({json, defaultValue, gridColumnCount, showGroups, groups=[], noneIndex, ableNone, ableSort, showAnswers, toggle, showCnt, autoContinue=false})=>{
    const {label, uid, cols, rows, noanswers, errors} = json;
    const [newError, setNewError] = React.useState(
        errors.map((err)=>{
            const [errText, errProp, errIndex] = err;
            if(errProp==='row'){
                return [errText, errProp, rows[errIndex].label]
            }else{
                return [errText, errProp, errIndex];
            }
        })
    );

    let orderGroups = [];
    let setGroupRows = [];
    rows.forEach((row)=>{
            const rowGroup = groups.filter((group)=> group[0] == row.index);
            if( rowGroup.length > 0 ){
                const currentGroup = rowGroup[0];
                const [rowIndex, groupLabel, groupText] = currentGroup;
                orderGroups.push(currentGroup);
            }
        }
    )
    orderGroups.forEach((item)=>{
        const filtGroup = setGroupRows.filter((group)=> group[1] == item[1]);
        if( filtGroup.length > 0 ){
            setGroupRows.forEach((set, index)=>{
                if(set[1] == item[1]){
                    setGroupRows[index][0].push(item[0]);
                }
            })
        }else{
            const groupRows = [item[0]];
            const setGroup = [groupRows, item[1], item[2]];
            setGroupRows.push(setGroup);
        }
    });
    
    // Default Value is only string
    const [rankAnswers, setRankAnswers] = React.useState(defaultValue);
    const [answerCompleted, setAnswerCompleted] = React.useState(false);
    const [noAnswer, setNoAnswer] = React.useState(false);
    const [answerList, setAnswerList] = React.useState([]);
    // None handler
    const [showNone, setShowNone] = React.useState(false);

    const [isPreventScroll, setIsPreventScroll] = React.useState(false);
    const showAnswerRef = React.useRef();

    // Auto Remain Attribute click
    const [clickFlag, setClickFlag] = React.useState(defaultValue.length == cols.length ? false : true);

    React.useEffect(()=>{
        if( !isPreventScroll ){
            if( showAnswerRef.current !== null && showAnswerRef.current !== undefined ) {
                showAnswerRef.current.scrollTop = showAnswerRef.current.scrollHeight;
            }
        }
    }, [answerList, isPreventScroll]);

    React.useEffect(()=>{
        if( rankAnswers.length >= (ableNone-1) ){
            setShowNone(true);
        }else{
            setShowNone(false);
        }

        if( rankAnswers.includes(noneIndex) ){
            let prevAnswer = rankAnswers;
            while (prevAnswer.length < cols.length){
                prevAnswer.push(noneIndex);
            }
            setRankAnswers(prevAnswer);
            setAnswerCompleted(true);
        }else{
            setAnswerCompleted(false);
        }

        if( rankAnswers.includes(noneIndex) ){
            const dupCheck = [...new Set(rankAnswers)];
            
            if( dupCheck.length <= (ableNone-1)){
                setShowNone(false);
                setRankAnswers([]);
            }else{
                let noneStart = ableNone-1;
                for(i=0; i<cols.length; i++){
                    if( rankAnswers[i] !== noneIndex ){
                        continue
                    }
                    if( rankAnswers[i] === noneIndex ){
                        noneStart = i;
                        break
                    }
                }
                let prevAnswer = rankAnswers;
                for(var i=noneStart; i<cols.length; i++){
                    prevAnswer[i] = noneIndex;
                }
                setRankAnswers(prevAnswer);
                setAnswerCompleted(true);
            }
        }

        if( rankAnswers.length > 0 ){
            rankAnswers.forEach((ans, index)=>{
                if( index < ableNone-1){
                    if( ans == noneIndex ){
                        setShowNone(false);
                        setRankAnswers([]);
                        return
                    }
                }
            });
        }

        if( rankAnswers.length == cols.length ){
            setAnswerCompleted(true);
        }else{
            setAnswerCompleted(false);
        }

        setAnswerList(rankAnswers);

        const remainAnswerCount = cols.length - rankAnswers.length;
        if( clickFlag && newError.length == 0 ){
            if( (remainAnswerCount == 1) && (cols.length == rows.length) ){
                const remainRow = rows.filter((row)=> !rankAnswers.includes(row.index));
                const remainLabel = remainRow[0].label;
                const remainClass = document.querySelector(`.rank-text-${remainLabel}`);
                remainClass.click();
                setClickFlag(false);
            }
        }

    }, [rankAnswers]);


    const [focusNext, setFocusNext] = React.useState(true);

    React.useEffect(()=>{
        if( answerCompleted && focusNext ){
            autoScroll(autoContinue);
            setFocusNext(false);
        }
    }, [answerCompleted])


    const noAnswerSelect = (flag)=>{
        if(flag){
            setNoAnswer(flag);
            setRankAnswers([]);
            setAnswerCompleted(true);
        }else{
            setNoAnswer(flag);
            setAnswerCompleted(false);
        }
    }

    // Grid columns count
    const colPercent = 100/gridColumnCount;
    const [gridColCnt, setGridColCnt] = React.useState(new Array(gridColumnCount).fill(`${colPercent}%`));
    
    const [timeOutId, setTimeOutId] = React.useState(null);
    const moveAnswer = (index, direction)=>{
        if( timeOutId !== null ){
            clearTimeout(timeOutId);
        }
        const curruntAnswer = [...rankAnswers];
        let changeIndex = index;
        if(direction === 'up') {
            if(index === 0) {
                return;
            }
            const temp = curruntAnswer[index];
            changeIndex = index - 1;
            curruntAnswer[index] = curruntAnswer[changeIndex];
            curruntAnswer[changeIndex] = temp;
        } else if(direction === 'down') {
            if(index === curruntAnswer.length - 1) {
                return;
            }
            const temp = curruntAnswer[index];
            changeIndex = index + 1;
            curruntAnswer[index] = curruntAnswer[changeIndex];
            curruntAnswer[changeIndex] = temp;
        }
        
        setRankAnswers(curruntAnswer);
        const answersText = document.querySelectorAll('.show-answers .answer-row-text');
        const rankText = document.querySelectorAll('.show-answers .answer-rank-text');
        
        [answersText, rankText].forEach((item)=>{
            item[index].classList.add('changed-rank');
            item[changeIndex].classList.add('changed-rank');
        });

        setTimeOutId(setTimeout(()=>{
            const changedRanks = document.querySelectorAll('.changed-rank');
            changedRanks.forEach((item)=>{
                item.classList.remove('changed-rank');
            });
        }, 1000));
    }
    
    const [qaShow, setQaShow] = React.useState(false);

    React.useEffect(()=>{
        setMinHeightForRankText();
        window.addEventListener('resize', setMinHeightForRankText);

        // QA Code On
        const qaCodes = document.querySelectorAll('.qaCode');
        const controlBar = document.querySelector('.controlbarContainer');

        if( controlBar && qaCodes.length > 0 ){
            setQaShow(true);
        }

        if( !toggle ){
            return;
        }
        const openClassName = 'group-open';
        const maxHeightHandler = (groupRowCell, groupName) => {
            const originalMaxHeight = groupRowCell.style.maxHeight;
            groupRowCell.style.maxHeight = 'none';
            const domMaxHeight = groupRowCell.offsetHeight;
            groupRowCell.style.maxHeight = originalMaxHeight;
    
            window.requestAnimationFrame(() => {
                if (groupRowCell.style.maxHeight === '0px') {
                    groupRowCell.style.maxHeight = `${domMaxHeight}px`;
                    groupName.classList.add(openClassName);
                } else {
                    groupRowCell.style.maxHeight = '0px';
                    groupName.classList.remove(openClassName);
                }
            });
        };
        const groupToggle = document.querySelectorAll('.rank-group');

        groupToggle.forEach((group) => {
            const groupRowCell = group.querySelector('.custom-rank-rows');
            const groupName = group.querySelector('.rank-group-title');
    
            const clickHandler = () => maxHeightHandler(groupRowCell, group);
            clickHandler();
    
            groupName.addEventListener('click', clickHandler);
    
            window.addEventListener('resize', () => {
                groupName.removeEventListener('click', clickHandler);
                if(group.classList.contains(openClassName)) {
                    groupRowCell.style.maxHeight = 'none';
                    const domMaxHeight = groupRowCell.offsetHeight;
                    groupRowCell.style.maxHeight = `${domMaxHeight}px`;
                }
                groupName.addEventListener('click', clickHandler);
            });
        });

    }, []);

    return (
        <>
        <style jsx="true">{`
.rank-qaCode {
    display: flex;
    gap: 5px;
    align-items: center;
}

.rank-qaCode .qaCode-label {
    font-weight: bold;
}

.surveyContainer {
    scroll-behavior: smooth;
}
.custom-rank-sort {
    width : 100%;
    max-width : ${gridColCnt.length >= 2 ? "924px" : "500px"};
}

.custom-rank-rows {
    display : grid;
    grid-template-columns : ${gridColCnt.join(' ')};
    grid-row-gap : 10px;
}

.show-rank-div{
    width: 40px;
    display: flex;
    justify-content: center;
}

.show-rank-cnt {
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2d6df6;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 100%;
    font-size: 1.1rem;
    color: #fff;
    margin-left: 3px;
}

.show-rank-cnt div{
    width: 100%;
    text-align: center;
}

.rank-row-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 40px;
}

.rank-text {
    width: 100%;
    height: 100%;
    max-width: 920px;
    margin : 2px 0 2px 0;
    padding: 7px;
    font-size: 1.2rem;
    transition: background 0.3s, color 0.3s, width 5s;
    border-radius: 10px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    display : flex;
    justify-content : center;
    flex-direction : column;
    cursor: pointer;
}

.rank-text-center .rank-text {
    align-items: center;
    text-align: center;
}

.rank-noanswers {
    width : 100%;
    max-width: ${gridColCnt[0]};
    margin: 20px auto;
    text-align: center;
}

@media all and (max-width: 900px){
    .custom-rank-rows {
        grid-template-columns: ${gridColCnt.length >= 3 ? "50% 50%" : "100%"};
    }

    .rank-noanswers {
        max-width: ${gridColCnt.length >= 3 ? "50%" : "100%"};
    }
}

.rank-noanswers .rank-number{
    display: none !important;
}

.show-answers {
    position : fixed;
    top : 0;
    left : 0;
    background-color : #fbfbfb;
    font-size : 1rem;
    min-height : 115px;
    max-height: 115px;
    overflow-y: scroll;
    padding : 5px;
    display: flex;
    flex-direction : column;
    gap : 8px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    z-index : 999;
    transform : translateY(-100px);
    opacity : 0;
    animation : showAnswersAnimation 1s forwards;
    width : 100%;
    margin-bottom : 20px;
}

@keyframes showAnswersAnimation {
    0% {
        transform : translateY(-100px);
        opacity : 0;
    }
    100% {
        transform : translateY(0px);
        opacity : 1;
    }
}

.show-answers .answers-text{
    display : flex;
    gap: 8px;
    animation : answersTextFadeIn 1s forwards;
    align-items: center;
    cursor: pointer;
}

@keyframes answersTextFadeIn {
    0% {
        opacity : 0;
    }
    100% {
        opacity : 1;
    }
}

.rk-answer-icon {
    width : 20px;
    height : 20px;
    transition : color 0.4s;
}

.rk-answer-x {
    width : 25px;
    height : 25px;
    transition : color 0.4s;
}

.answers-text:hover{
    color : #e7046f;
}

.answers-text .answer-rank-text{
    font-weight: bold;
    pointer-events: none;
    transition : color 0.4s;
    min-width: 45px;
}

.answers-text .answer-row-text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width : 80%;
    pointer-events: none;
    transition : color 0.4s;
}

.show-ans-rk-row {
    display: grid;
    grid-template-columns: ${ableSort ? '70px 80%' : '100%'};
    gap: 10px;
}

.rk-hd-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    animation : answersTextFadeIn 1s forwards;
    transition : color 0.01s;
}

.rk-hd-btn:hover {
    color : #2d6df6;
}

.ans-hd-grid {
    display: grid;
    grid-template-columns: 35px 35px;
}

.ans-hd-block {
    display: block;
}

.rk-up {
    transition : transform 0.5s;
}

.rk-down {
    transition : transform 0.5s;
}

@keyframes upAnimation {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-8px);
    }
    100% {
        transform: translateY(0px);
    }
}

@keyframes downAnimation {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(8px);
    }
    100% {
        transform: translateY(0px);
    }
}

.rk-up:hover {
    animation: upAnimation 1s infinite;
}

.rk-down:hover {
    animation: downAnimation 1s infinite;
}

.changed-rank {
    color: #2d6df6;
}

.show-cnt {
    position: fixed;
    bottom: 7%;
    left: 10%;
    padding: 10px;
    border-radius: 10px;
    background-color: #2d6df6;
    color: #fff;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    font-size: 1.2rem;
    font-weight: bold;
}

@media all and (max-width: 768px){
    .custom-rank-rows {
        grid-template-columns: 100%;
    }

    .rank-noanswers {
        max-width: 100%;
    }
}

@media all and (max-width: 900px){
    .show-cnt {
        left: 2px;
    }
}
`}
        </style>
        {/* Group css */}
        {showGroups ? (
            <style jsx="true">{`
.rank-group {
    margin-bottom : 20px;
    border: ${newError.length>=1 ? '2px solid rgb(231, 4, 111)' : '1px solid #ccc'};
    box-shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1);
    border-radius: 10px;
    margin-bottom: 10px;
    overflow: hidden;
}

.rank-group-title {
    padding-left : 3.5rem;
    font-size : 1.4rem;
    font-weight: bold;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 1.3rem !important;
    transition: background-color .5s;
    font-weight: 700;
    background-color: #f1f1f1;
    color: #000;
    margin-bottom: 0px !important;
}

.rank-group:hover .rank-group-title {
    background-color: #2d6df6;
    color: #fff;
}

.rank-group-div {
    display : flex;
    flex-direction : column;
    gap : 10px;
    height : 100%;
}

.custom-rank-rows {
    ${toggle ? null : 'padding: 10px;'}
}

@media all and (max-width: 900px) {
    .rank-noanswers .show-rank-div {
        display: none;
    }
}
            `}</style>
        ) : null}
        {/* Toggle feature */}
        {toggle ? (
            <style jsx="true">{`
.rank-group-title {
    position: relative;
}

.rank-group-title .group-title-text {
    cursor: pointer;
}

.custom-rank-rows {
    margin-right: 10px;
    transition: max-height 0.5s;
}

.group-title-arrow {
    position: absolute;
    width: 20px;
    top: 30%;
    right: 10px;
}

.group-title-arrow svg {
    transition: transform 0.5s;
}

.group-open .group-title-arrow svg {
    transform: rotate(90deg);
}

.group-open .custom-rank-rows {
    margin-top: 10px;
    margin-bottom: 10px;
}

.rank-group .rank-row-btn {
    transform: scaleY(0);
    transition: transform 0.5s;
}

.group-open.rank-group .rank-row-btn {
    transform: scaleY(1);
}
            `}</style>
        ) : null}
            {showAnswers && answerList.length > 0 ? (
                <div className="show-answers" ref={showAnswerRef} onClick={()=>{
                    setIsPreventScroll(true);
                }}>
                    {answerList.map((answer, index)=>{
                        const filtRowsAnswer = rows.filter(row=> row.index === answer);
                        const getOnlyText = document.createElement('div');
                        let rpText = filtRowsAnswer[0].text.replace('<br />', ' ');
                        rpText = rpText.replace('<br/>', ' ');
                        getOnlyText.innerHTML = rpText;
                        const onlyText = getOnlyText.innerText;
                        return (
                        <div className={`show-ans-rk-row answer-rank-${index+1}`}>
                            {ableSort ? (
                                <div className={[0, answerList.length - 1].includes(index) ? "ans-hd-block" : "ans-hd-grid"}>
                                    { index !== 0 ? (
                                        <div className="rk-hd-btn rk-up" onClick={()=>{moveAnswer(index, 'up')}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="rk-answer-icon">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                                            </svg>
                                        </div>
                                    ) : null }
                                    { index !== answerList.length - 1 ? (
                                        <div className="rk-hd-btn rk-down" onClick={()=>{moveAnswer(index, 'down')}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="rk-answer-icon">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    ) : null }
                                </div>
                            ) : null}
                            <div className="answers-text" key={index}
                                onClick={()=>{
                                    const removeAnswr = rankAnswers.filter((item)=> item !== answer);
                                    setRankAnswers(removeAnswr);
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="rk-answer-x">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="answer-rank-text">{cols[index].text}</div>
                                <div className="answer-row-text">{onlyText}</div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            ) : null}
            <div className="custom-rank-sort"  onClick={()=>{
                    setIsPreventScroll(false);
                }}>
                {setGroupRows.length > 0 && showGroups ? (
                    setGroupRows.map((group, groupIndex)=>{
                        return (
                                <div key={groupIndex}
                                    className={`animate__animated animate__fadeIn rank-group group-${group[1]}`}>
                                    <div className="rank-group-title">
                                        <div className="group-title-text" dangerouslySetInnerHTML={{__html: group[2]}}></div>
                                        {toggle ? (
                                            <div className="group-title-arrow">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="custom-rank-rows">
                                    {rows.filter((row)=> group[0].includes(row.index) && row.index !== noneIndex).map((row, idx)=>{
                                        return (
                                            <RankBtn 
                                                key={row.index} 
                                                idx={idx}
                                                row={row} 
                                                answers={rankAnswers} 
                                                setAnswers={setRankAnswers} 
                                                answerComplete={answerCompleted}
                                                noAnswer={noAnswer}
                                                setAnswerComple={setAnswerCompleted}
                                                errors={newError}
                                                setFocusNext={setFocusNext}
                                                qaShow={qaShow}
                                                />
                                            )
                                    })}
                                    </div>
                                </div>
                        )})
                ) : (
                    <div className="custom-rank-rows">
                    {
                    rows.filter((row)=> row.index !== noneIndex).map((row, index)=>{
                        return (
                            <RankBtn 
                                key={row.index} 
                                idx={index}
                                row={row} 
                                answers={rankAnswers} 
                                setAnswers={setRankAnswers} 
                                answerComplete={answerCompleted}
                                noAnswer={noAnswer}
                                setAnswerComple={setAnswerCompleted}
                                errors={newError}
                                setFocusNext={setFocusNext}
                                qaShow={qaShow}
                                />
                            )
                    })}
                    </div>
                )}
                <div className="rank-noanswers">
                    {rows.filter((row)=> row.index === noneIndex).map((row, index)=>{
                        return (
                            <RankBtn 
                                key={row.index} 
                                idx={index}
                                row={row} 
                                answers={rankAnswers} 
                                setAnswers={setRankAnswers} 
                                answerComplete={answerCompleted}
                                noAnswer={noAnswer}
                                isNone={true}
                                showNone={showNone}
                                setAnswerComple={setAnswerCompleted}
                                errors={newError}
                                setFocusNext={setFocusNext}
                                qaShow={qaShow}
                                />
                            )
                    })}
                    {noanswers.map((noanswer, index)=>{
                        return (
                            <RankBtn 
                                key={index} 
                                idx={index}
                                row={noanswer}
                                groups={setGroupRows}
                                answers={rankAnswers} 
                                setAnswers={setRankAnswers} 
                                answerComplete={answerCompleted}
                                setAnswerComple={setAnswerCompleted}
                                noAnswerFnc={noAnswerSelect}
                                isNoanswer={true}
                                errors={newError}
                                setFocusNext={setFocusNext}
                                qaShow={qaShow}/>
                            )
                    })}
                </div>
            </div>
            {showCnt ? (
                <div className={answerCompleted || noAnswer ? "show-cnt animate__animated animate__bounceOutLeft" : "show-cnt animate__animated animate__bounceIn"}>
                    {rankAnswers.length}/{cols.length}
                </div>
            ) : null}
            <HiddenInputs uid={`ans${uid}`} qid={label} cols={cols} answers={rankAnswers} noAnswers={noanswers} noAnswerCheck={noAnswer}/>
        </>
    )
}

const LoadingComp = () =>{
    return (
        <>
            <style jsx>{
`
@keyframes loadingSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`
            }</style>
            <div style={{
                margin: '0 auto',
                width: '30px',
                height: '30px',
                border: '5px solid #2d6df6',
                borderTop: '5px solid white',
                borderRadius: '50%',
                animation: 'loadingSpin 2s linear infinite'
            }}></div>
        </>
    )
}

const SettingGridRankSort = ({setRoot, json, defaultValue, showGroups=false, groups=[], colCnt=1, noneIndex=null, ableNone=1, showAnswers=true, ableSort=true, loadingQuery='.custom-loader', toggle=false, showCnt=true, autoContinue=false})=>{
    const root = document.querySelector(setRoot);
    let toggleFlag = toggle;
    if( !showGroups ){
        toggleFlag = false;
    }
    const defaultAnswerLength = defaultValue.length;
    let focusFlag = autoContinue;
    if( defaultAnswerLength > 0 ){
        focusFlag = false;
    }
    ReactDOM.render(
        <GridRankSort
            json={json}
            defaultValue={defaultValue}
            gridColumnCount={colCnt}
            showGroups={showGroups}
            groups={groups}
            noneIndex={noneIndex}
            ableNone={ableNone}
            ableSort={ableSort}
            showAnswers={showAnswers}
            toggle={toggleFlag}
            showCnt={showCnt}
            autoContinue={focusFlag}
        />, root
    );
    document.querySelector(loadingQuery).remove();
}