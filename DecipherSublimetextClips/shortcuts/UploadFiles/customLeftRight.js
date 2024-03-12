const classHandler = (cond, className, addClass) => {
    const splitClass = className.split(" ");
    if(cond){
        splitClass.push(addClass);
        return splitClass.join(" ");
    }else{
        return className;
    }
}

const ColButton = ({uid, row, col, ansUpdate, mouseOverEvent, mouseOutEvent})=>{
    const {text, index} = col;
    const inputName = `ans${uid}.0.${row.index}`;
    const inputID = `ans${uid}.${index}.${row.index}`;

    return (
        <div className="lr-btn-container">
            <input type="radio" name={inputName} value={index} id={inputID} style={{display: "none"}} checked={col.index == row.answer ? true : false}></input>
            <label className={"lr-col-btn"} htmlFor={inputID} onClick={ansUpdate} onMouseOver={mouseOverEvent} onMouseOut={mouseOutEvent}>
                <p dangerouslySetInnerHTML={{__html: text}}></p>
            </label>
        </div>
    )
}

const SetLeftRight = ({json, left, right, answers})=>{
    const brandColor = "#2d6df6";
    const brandSubColor = "#b7ceff";
    let {uid, cols, rows} = json;
    const colSeparator = Math.floor(cols.length/2);
    const leftCols = cols.slice(0, colSeparator).map((col)=>{return col.index});
    const rightCols = cols.slice(cols.length%2 > 0 ? colSeparator+1 : colSeparator, cols.length).map((col)=>{return col.index});

    /* Default Answers */
    rows.forEach((row, index)=>{
        row['answer'] = answers[index];
    });

    const [elRows, setElRows] = React.useState(rows);
    /* 
        Answer Row Index 
        Default : 0;
    */
    const currAnswer = elRows.filter((row)=>row.answer != 'null');
    const [ansIndex, setAnsIndex] = React.useState(currAnswer.length);
    const [answer, setAnswer] = React.useState(elRows.map((row)=>{
        if(row.answer == 'null'){
            return 'null';
        }else{
            return row.answer;
        }
    }));

    const [autoNext, setAutoNext] = React.useState(true);

    const answerUpdate = (setIndex, ans) => {
        const newAnswer = [...answer];
        newAnswer[setIndex] = ans;
        setAnswer(newAnswer);
    
        const newElRows = elRows.map((row, index) => {
            if(index === setIndex) {
                return { ...row, answer: ans };
            }
            return row;
        });
        setElRows(newElRows);
        const hasError = document.querySelector('.hasError');
        if( autoNext && (hasError === undefined || hasError === null) ){
            setAnsIndex(ansIndex + 1);
        }
    }

    const pageOnClick = (calValue)=>{
        const currIndex = ansIndex;
        setAnsIndex(currIndex+(calValue));
    }
    
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if(containerRef.current) {
            const cards = containerRef.current.querySelectorAll('.lr-card');
            let maxHeight = 0;
            cards.forEach(card => {
                const height = card.offsetHeight;
                if(height > maxHeight) {
                    maxHeight = height;
                }
            });

            if(maxHeight > 0) {
                containerRef.current.style.minHeight = `${maxHeight+40}px`;
            }
        }
    }, [ansIndex]);


    const [ansserComplete, setAnswerComplete] = React.useState(false);
    React.useEffect(()=>{
        const currAnswer = [...answer];
        const filtAnswer = currAnswer.filter((row)=> row == 'null');
        if( filtAnswer.length == 0 ){
            setAnswerComplete(true);
        }else{
            setAnswerComplete(false);
        }

    }, [answer])

    React.useEffect(()=>{
        const continueBtn = document.querySelector('#btn_continue');
        if( continueBtn !== undefined && continueBtn !== null){
            if( ansserComplete ){
                continueBtn.style.opacity = "1";
                continueBtn.style.pointerEvents = "auto";

                const hasError = document.querySelector('.hasError');
                if( hasError === null){
                    continueBtn.focus();
                }
            }else{
                continueBtn.style.opacity = "0.5";
                continueBtn.style.pointerEvents = "none";
            }
        }

    }, [ansserComplete]);


    const [leftFlag, setLeftFlag] = React.useState(false);
    const [rightFlag, setRightFlag] = React.useState(false);

    const hoverEvent = (index, flag)=>{
        const hasError = document.querySelector('.hasError');
        let hoverFlag = flag;
        if( hasError !== null){
            hoverFlag = false;
        }
        if( leftCols.includes(index) ){
            setLeftFlag(hoverFlag);
        }

        if( rightCols.includes(index) ){
            setRightFlag(hoverFlag);
        }
    }

    return (
        <>
            <style jsx="true">{`
#btn_continue {
    transition: opacity 0.5s;
}
.lr-col-legend-box, .lr-row-legend {
    width: 100%;
    display: flex;
    justify-content: space-between;
    transition: transform 0.3s;
}

.lr-row-legend {
    transform: rotateX(90deg);
    pointer-events: none;
}

.lr-row-legend.show {
    transform: rotateX(0);
    pointer-events: auto;
}

.lr-col-legend, .lr-row-card {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 5px;
    padding: 5px;
}

.lr-col-legend {
    transition: background-color 0.3s;
}

.lr-row-card {
    min-height: 100px;
    background-color: #fff;
}

.lr-btn-container {
    display: flex;
    width: 100%;
}

.lr-col-btn-box {
    display: flex;
    align-items: center;
    width: 100%;
}

.lr-col-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 5px;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.5s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.lr-col-btn:hover {
    background-color: ${brandSubColor};
}
 
.lr-row-container {
    min-height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
}

.lr-btn-container input:checked + label {
    background-color: ${brandColor};
    color: #fff;
}


.lr-row-left, .lr-row-right {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
    font-weight: bold;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    text-align: center;
}

.lr-row-inputs {
    display: none;
}

.lr-card-container {
    position: relative;
}

.lr-card {
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.lr-arrow-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lr-arrow-left, .lr-arrow-right {
    width: 40px;
    padding: 7px;
    background-color: ${brandColor};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.5s, opacity 0.5s;
}

.lr-arrow-left:hover {
    transform: translateX(-10px);
}

.lr-arrow-right:hover {
    transform: translateX(10px);
}

@media (max-width: 768px) {
    .lr-arrow-left:hover {
        transform: translateX(0px);
    }

    .lr-arrow-right:hover {
        transform: translateX(0px);
    }
}

.lr-answer-count {
    font-size: 1rem;
}

.lr-answer-count.hide {
    display: none;
    pointer-events: none;
}

.lr-arrow-icon {
    width: 30px;
}

.lr-rating {
    display: none;
    pointer-events: none;
}

.lr-rating.show {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
}

.arrow-container {
    height: 8px;
    width: 90%;
    position: relative;
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: space-between;
    align-items: center;
    background-color: ${brandColor};
}

.arrow-left, .arrow-right {
    position: relative;
    width: 0;
    height: 0;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
}

.arrow-left::after, .arrow-right::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: -10px;
    left: -15px;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 26px solid ${brandColor};
}

.arrow-left {
    transform: translateX(-25px) translateY(0.5px);
}
.arrow-left::after {
    transform: rotateZ(150deg);
}

.arrow-right {
    transform: translateX(25px) translateY(0.5px);
}
.arrow-right::after {
    transform: rotateZ(-150deg);
}

.disabled-arrow {
    opacity: 0.5;
    pointer-events: none;
}

.lr-complete {
    display: flex;
    justify-content: center;
    align-items: center;
}

.lr-complete svg {
    width: 80px;
    color: ${brandColor};
}

.lr-col-left.mouse-over, .lr-col-right.mouse-over {
    background-color: ${brandSubColor};
}

@media (max-width: 768px){
    .lr-col-left.mouse-over, .lr-col-right.mouse-over {
        background-color: unset;
    }
}

/* hasError */
.hasError .lr-row-legend {
    transform: rotateX(0) !important;
    pointer-events: auto !important;
}

.hasError .lr-rating {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
}

.hasError .lr-card {
    position: unset;
    margin-top: 40px;
    border: 1px solid #737373;
    padding: 10px;
    border-radius: 10px;
}

.hasError .lr-arrow-btn {
    display: none;
}

.hasError .lr-complete {
    display: none;
}
            `}</style>
            <div className={"lr-question animate__animated animate__fadeIn"} ref={containerRef}>
                <div className={"lr-container"}>
                    <div className={"lr-arrow-btn"}>
                        <div className={classHandler(ansIndex == 0, "lr-arrow-left", "disabled-arrow")} 
                            onClick={()=>{
                                pageOnClick(-1);
                                setAutoNext(false);
                            }
                            }>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"lr-arrow-icon"}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div className={classHandler(ansIndex == elRows.length, "lr-answer-count", "hide")}>
                            {ansIndex+1}/{elRows.length}
                        </div>
                        <div className={classHandler((ansIndex == (elRows.length)) || (elRows[ansIndex]['answer'] == 'null'), "lr-arrow-right", "disabled-arrow")} 
                            onClick={()=>{
                                pageOnClick(1);
                                setAutoNext(true);
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"lr-arrow-icon"}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>
                    <div className={classHandler(ansIndex == elRows.length, "lr-card-container", "hide")}>
                        {elRows.map((row, rowIndex)=>{
                            return (
                                <div key={rowIndex} className={"lr-card"}>
                                    <div className={classHandler(rowIndex == ansIndex, "lr-row-legend", "show")}>
                                        <div className={"lr-row-card lr-row-left"} dangerouslySetInnerHTML={{__html: row.text}}></div>
                                        <div className={"lr-row-card lr-row-right"} dangerouslySetInnerHTML={{__html: row.rightLegend}}></div>
                                    </div>
                                    <div className={classHandler(rowIndex == ansIndex, "lr-rating", "show")}>
                                        <div className={"arrow-container"}>
                                            <div className={"arrow-left"}></div>
                                            <div className={"arrow-right"}></div>
                                        </div>
                                        <div className={"lr-col-legend-box"}>
                                            <div className={classHandler(leftFlag, "lr-col-legend lr-col-left", "mouse-over")} dangerouslySetInnerHTML={{__html: left}}></div>
                                            <div className={classHandler(rightFlag, "lr-col-legend lr-col-right", "mouse-over")} dangerouslySetInnerHTML={{__html: right}}></div>
                                        </div>
                                        <div className={"lr-col-btn-box show"}>
                                        {cols.map((col, colIndex)=>{
                                            return (
                                                <ColButton
                                                    uid={uid}
                                                    key={colIndex}
                                                    row={row}
                                                    col={col}
                                                    ansUpdate={()=>{answerUpdate(rowIndex, col.index)}}
                                                    mouseOverEvent={()=>{hoverEvent(col.index, true)}}
                                                    mouseOutEvent={()=>{hoverEvent(col.index, false)}}
                                                />
                                            )
                                        })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {ansIndex == elRows.length ? (
                        <div className={"lr-complete animate__animated animate__bounceIn"}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}

const CustomLeftRight = ({
    json, 
    leftText, 
    rightText, 
    answers,
    loadingQuery='.custom-loader'})=>{
    const root = document.querySelector('.answers');
    ReactDOM.render(
        <SetLeftRight
            json={json}
            left={leftText} 
            right={rightText}
            answers={answers}
        />, root
    );
    const loading = document.querySelector(loadingQuery);
    if( loading !== undefined && loading!== null){
        loading.remove();
    }
}
