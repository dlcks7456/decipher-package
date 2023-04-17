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
            <div style={{
                width: '40px',
            }}>
                { isSelected && !isNoanswer ? (
                    <ShowRank 
                        rankNum={answers.includes(row.index) ? answers.indexOf(row.index) + 1 : answers.length + 1}/>
                ) :null}
            </div>
            
            <div
                className={`rank-text rank-text-${row.label}`}
                style={{
                        border: errRows.includes(idx) || errCols.length >= 1 ? '2px solid #e7046f' : '1px solid #ccc',
                        background : styleFlag() ? '#00A346' : (!answers.includes(row.index) && answerComplete) || (!isNoanswer && noAnswer) ? '#918d8d' : '#ededed',
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


const GridRankSort = ({json, defaultValue, gridColumnCount, groups=[], noneIndex, ableNone})=>{
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
            console.log(dupCheck);
            if( dupCheck.length <= (ableNone-1)){
                setShowNone(false);
                setRankAnswers([]);
            }
        }

        if( rankAnswers.length == cols.length ){
            setAnswerCompleted(true);
        }else{
            setAnswerCompleted(false);
        }
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
    display : grid;
    grid-template-columns : ${gridColCnt.join(' ')};
    grid-row-gap : 10px;
    grid-column-gap : 10px;
    width : 100%;
    max-width : 900px;
}

@media all and (max-width: 950px){
    .custom-rank-sort {
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
    font-size : 1.2rem;
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
    color: black;
    display: flex;
    align-items: center;
    background: #00A346;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 100%;
    font-size: 1.3rem;
}

.show-rank-cnt div{
    width: 100%;
    text-align: center;
}

.rank-row-btn {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    min-height: 50px;
    max-height : 120px;
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
    max-width : 900px;
}
`}
        </style>
        <div className="custom-rank-sort">
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
            <HiddenInputs uid={`ans${uid}`} qid={label} cols={cols} answers={rankAnswers} noAnswers={noanswers} noAnswerCheck={noAnswer}/>
        </div>
        </>
    )
}

const SettingGridRankSort = ({json, defaultValue, groups=[], colCnt=1, noneIndex=null, ableNone=1})=>{
    const root = document.querySelector('.answers');
    ReactDOM.render(<GridRankSort json={json} defaultValue={defaultValue} gridColumnCount={colCnt} groups={groups} noneIndex={noneIndex} ableNone={ableNone}/>, root);
}