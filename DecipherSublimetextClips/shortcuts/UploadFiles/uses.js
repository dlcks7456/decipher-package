/** Dynamic Question Functions **/

/** uses accordion row highlight **/
function accordionErrorHighLight(){
  const accoErr = document.querySelector(".acco-err-rows");
  if( accoErr ){
    const dataSet = accoErr.dataset.rows.split(",");
    const sqAccordionRow = document.querySelectorAll(".sq-accordion-row");
    sqAccordionRow.forEach((row)=>{
      if(dataSet.includes(String(row.dataset.row))){
        row.classList.add("hasError");
        row.classList.remove("collapsed");
        const answers = row.querySelectorAll(".sq-accordion-answers div");
        answers.forEach((answer)=>{
          answer.classList.remove("hide");
        })
      }
    });
  }
}

/** uses accordion show first row  **/
function accordionFirstRowShow(){
  if( !document.querySelector(".survey-error") ){
    const accordions = document.querySelectorAll(".sq-accordion-row");
    if( accordions.length>0 ){
      accordions[0].querySelectorAll(".sq-accordion-answers").forEach((acco)=>{
        acco.querySelectorAll('div').forEach((item)=>{
          item.classList.remove('hide');
        })
      })
    }
  }
}

/** uses accordion hide element **/
function accordionHideEelement(rowBase, colBase){
  const accoBase = document.querySelector('.sq-accordion');
  const accoRows = accoBase.querySelectorAll('.sq-accordion-row');

  accoRows.forEach( (row)=>{
    if( rowBase.includes(+row.dataset.row) ){
      const accoCols = row.querySelectorAll('.sq-accordion-cell');

      accoCols.forEach( (col)=>{
        if( colBase.includes(+col.dataset.col) ){
          col.classList.add('hidden');
        }
      });
    }
  });
}

