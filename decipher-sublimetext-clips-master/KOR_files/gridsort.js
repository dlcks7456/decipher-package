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
                className={`rank-number rank-${rankNum} animate__animated animate__bounceIn show-rank-cnt`}>
                    <div>{rankNum}</div>
            </div>
    )
}

const RankBtn = ({row, idx, answers, setAnswers, answerComplete, setAnswerComple, isNoanswer=false, noAnswer=false, noAnswerFnc=null, errors})=>{
    const [isHover, setIsHover] = React.useState(false);
    const [isSelected, setIsSelected] = React.useState(answers.includes(row.index) ? true : false);
    const styleFlag = ()=>{
        if( isHover ||  isSelected){
            return true
        }else{
            return false
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
                    oeRef.current.style.border = '2px solid #aa213f';
                }
            }
        }
    }, [setrrRowLegends])

    return (
        <>
        <div 
            className={`rank-row-btn rank-row-${row.label} animate__animated animate__fadeIn`}>
            <div style={{
                width: '40px'
            }}>
                { isSelected && !isNoanswer ? (
                    <ShowRank 
                        rankNum={answers.includes(row.index) ? answers.indexOf(row.index) + 1 : answers.length + 1}/>
                ) :null}
            </div>
            
            <div
                className={`rank-text rank-text-${row.label}`}
                style={{
                        border: errRows.includes(idx) || errCols.length >= 1 ? '2px solid #aa213f' : '1px solid #ccc',
                        background : styleFlag() ? '#0a52ed' : (!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? '#918d8d' : '#f7f7f7',
                        color : styleFlag() ? '#fff' : '#242424',
                        pointerEvents : (!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? 'none' : '',
                        marginTop : isNoanswer ? '15px' : '0',
                    }}
                onMouseOver={()=>{
                    setIsHover(true);
                }}
                onMouseOut={()=>{
                    setIsHover(false);
                }}
                onClick={(e)=>{
                    if( !isNoanswer ){
                        const openInput = e.target.querySelector('input[type=text]');
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
                <div style={{pointerEvents: 'none'}} dangerouslySetInnerHTML={{__html: row.text}}></div>
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


const GridRankSort = ({json, defaultValue, gridColumnCount, groups=[], noneIndex, ableNone, showAnswers})=>{
    const {label, uid, cols, rows, noanswers, errors} = json;
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

        if( rankAnswers.length == cols.length ){
            setAnswerCompleted(true);
        }else{
            setAnswerCompleted(false);
        }

        setAnswerList(rankAnswers);
    }, [rankAnswers]);

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


    return (
        <>
        <style jsx="true">{`
.custom-rank-sort {
    width : 100%;
    max-width : 900px;
}

.custom-rank-rows{
    display : grid;
    grid-template-columns : ${gridColCnt.join(' ')};
    grid-row-gap : 10px;
}

@media all and (max-width: 950px){
    .custom-rank-rows {
        grid-template-columns: ${gridColCnt.length >= 3 ? "50% 50%" : "100%"};
    }
}

@media all and (max-width: 500px){
    .custom-rank-sort {
        grid-template-columns: 100%;
    }
}

.rank-group-title {
    padding-left : 3.5rem;
    margin-bottom : 10px;
    font-size : 1.4rem;
    font-weight: bold;
}

.rank-group-div {
    display : flex;
    flex-direction : column;
    gap : 10px;
    height : 100%;
}

.show-rank-cnt {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    background: #0a52ed;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 100%;
    font-size: 1.3rem;
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
    min-height: 50px;
}

.rank-text {
    width: 100%;
    height: 100%;
    max-width: 920px;
    margin : 2px 0 2px 0;
    text-align: center;
    padding: 15px;
    font-size: 1.3rem;
    cursor: pointer;
    transition: background 0.3s, color 0.3s, width 5s;
    border-radius: 10px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    display : flex;
    align-items : center;
    justify-content : center;
    flex-direction : column;
}

.rank-noanswers{
    margin-top : 20px;
    width : 100%;
}

.show-answers {
    position : fixed;
    top : 0;
    left : 0;
    background-color : #fbfbfb;
    font-size : 1rem;
    min-height : 115px;
    padding : 5px;
    display: flex;
    flex-direction : column;
    gap : 8px;
    overflow : hidden;
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

.answers-text .answer-x{
    width : 30px;
    height : 30px;
    transition : color 0.4s;
}

.answers-text:hover{
    color : #aa213f;
}

.answers-text .answer-rank-text{
    font-weight: bold;
    pointer-events: none;
    transition : color 0.4s;
}

.answers-text .answer-row-text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width : 80%;
    pointer-events: none;
    transition : color 0.4s;
}
`}
        </style>
            {showAnswers && answerList.length > 0 ? (
                <div className="show-answers">
                    {answerList.map((answer, index)=>{
                        const filtRowsAnswer = rows.filter(row=> row.index === answer);
                        const getOnlyText = document.createElement('div');
                        getOnlyText.innerHTML = filtRowsAnswer[0].text;
                        const onlyText = getOnlyText.innerText;
                        return (
                        <div className="answers-text" key={index}
                            onClick={()=>{
                                const removeAnswr = rankAnswers.filter((item)=> item !== answer);
                                setRankAnswers(removeAnswr);
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="answer-x">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="answer-rank-text">{cols[index].text}</div>
                            <div className="answer-row-text">{onlyText}</div>
                        </div>
                        )
                    })}
                </div>
            ) : null}
            <div className="custom-rank-sort">
                <div className="custom-rank-rows">
                {setGroupRows.length > 0 ? (
                    setGroupRows.map((group, groupIndex)=>{
                    return (
                            <div key={groupIndex}
                                className="animate__animated animate__fadeIn rank-group">
                                <div className="rank-group-title">{group[2]}</div>
                                <div className="rank-group-div">
                                {rows.filter((row)=> group[0].includes(row.index) && row.index !== noneIndex).map((row, index)=>{
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
                                            errors={errors}/>
                                        )
                                })}
                                </div>
                            </div>
                    )  
                    })
                ) : (
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
                                errors={errors}/>
                            )
                    })
                )}
                </div>
                <div className="rank-noanswers">
                    { showNone ? (
                        rows.filter((row)=> row.index === noneIndex).map((row, index)=>{
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
                                    errors={errors}/>
                                )
                        })
                    ) : null }
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
                                errors={errors}/>
                            )
                    })}
                </div>
            </div>
            <HiddenInputs uid={`ans${uid}`} qid={label} cols={cols} answers={rankAnswers} noAnswers={noanswers} noAnswerCheck={noAnswer}/>
        </>
    )
}

const SettingGridRankSort = ({json, defaultValue, groups=[], colCnt=1, noneIndex=null, ableNone=1, showAnswers=true})=>{
    const root = document.querySelector('.answers');
    ReactDOM.render(
        <GridRankSort json={json} defaultValue={defaultValue} gridColumnCount={colCnt} groups={groups} noneIndex={noneIndex} ableNone={ableNone} showAnswers={showAnswers}/>, root
    );
}