let nonogramTemplates = []
// levels button
const levelLayout = document.createElement('div');
levelLayout.classList.add('flex');
levelLayout.classList.add('gap-4');
levelLayout.classList.add('m-4');

let levelButtons = ['Easy','Medium','Hard']
levelButtons = levelButtons.map(x=>{
    const btn = document.createElement('button');
    btn.classList.add('level-button');
    btn.textContent = x;
    if(x === 'Easy'){
        btn.classList.add('pushed');
    }
    levelLayout.appendChild(btn);
    return btn;
})

//************modal section************//

const modal = document.createElement('dialog');
const modalContent = document.createElement('div');
modalContent.classList.add('p-4');
const modalFooter = document.createElement('div');
modalFooter.classList.add('flex');
modalFooter.classList.add('justify-content-center');
const modalClose = document.createElement('button');
modalClose.classList.add('close-button');
modalClose.innerText = 'Play again!'
modalFooter.appendChild(modalClose);
modal.appendChild(modalContent);
modal.appendChild(modalFooter);
modalClose.addEventListener('click',() => {
  const currScheme = getScheme("Easy");
  drawNonogram(currScheme)
  modal.close();
})


levelButtons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        levelButtons.forEach(lvlButton=>{
            lvlButton.classList.remove('pushed')
        })
        btn.classList.add('pushed');

        const currScheme = getScheme(e.target.innerText);
        drawNonogram(currScheme)
        
        // nonogramTemplates.filter(x=>)
    })
})

const gridLayout = document.createElement('div');

const getScheme = (level) => {
  const headerNonogram = nonogramTemplates.find(x=> x.level === level).topClues;
  const bodyNonogram = nonogramTemplates.find(x=> x.level === level).body;
  const sideHeaderNonogram = nonogramTemplates.find(x=> x.level === level).sideClues;

  return {header:headerNonogram,body:bodyNonogram,sideHeader:sideHeaderNonogram};
}

const drawBorderBottom = (rowIndx,bodyLength,cellElement) => {
  if((rowIndx + 1) !== bodyLength){
    if((rowIndx + 1) % 5 ===0){
      cellElement.classList.add('border-bottom-2');
    }else{
      cellElement.classList.add('border-bottom-1');
    }
  }
  return cellElement
}

const drawBorderRight = (colIndx,bodyLength,cellElement) => {
  if( (colIndx + 1) !== bodyLength ){
    if((colIndx + 1) % 5 === 0){
      cellElement.classList.add('border-right-2');
    }else{
      cellElement.classList.add('border-right-1');
    }
  }
  return cellElement
}

const drawHeaderBorderBottom = (rowIndx,headerLength,cellElement,isEmpty) => {
  if((rowIndx + 1) === headerLength){
    cellElement.classList.add('border-bottom-2');
  }
  if(isEmpty){
    cellElement.classList.add('border-bottom-1');
  }
  return cellElement
}

const drawHeaderBorderRight = (colIndx,sideLenght,cellElement,isEmpty) => {

  if((colIndx + 1) === sideLenght){
    cellElement.classList.add('border-right-2');
  }

  if(isEmpty){
    cellElement.classList.add('border-right-1');
  }
  return cellElement
}

const arraysEqual = (array1, array2) => JSON.stringify(array1) === JSON.stringify(array2);

const drawNonogram = (scheme) => {

  gridLayout.innerHTML = '';
  gridLayout.removeAttribute('style')

  let bodyNonogram = scheme.body;
  let sideHeaderNonogram = scheme.sideHeader;
  let headerNonogram = scheme.header;

  const bodyLength = bodyNonogram[0].length;
  const sideLenght = sideHeaderNonogram[0].length;
  const headerLength = headerNonogram.length;

  gridLayout.classList.add('grid');
  gridLayout.classList.add('shadow-dark');
  gridLayout.classList.add('border-nonogram-tbl');
  gridLayout.classList.add('clr-yellow');

  gridLayout.setAttribute('style', `grid-template-columns: repeat(${sideLenght + bodyLength},1fr);max-width: ${(sideLenght + bodyLength)*2}rem;`);
  
  const gridCells = [];
  
  const sideNBodyNonogram = bodyNonogram.map((row,i) => [[...sideHeaderNonogram[i]],[...row]])
  const preHeader = Array.from(Array(sideHeaderNonogram[0].length)).fill(0)
  headerNonogram = headerNonogram.map((row) => [[...preHeader],[...row]])

  const gameZone = Array.from(Array(bodyLength)).map(x=>Array.from(Array(bodyLength)).fill(0))
  
  headerNonogram.forEach((row,rowIndx) =>{
      row[0].forEach((emptyCell,colIndx)=>{
          let cellElement = document.createElement('div')
          cellElement = drawHeaderBorderRight(colIndx,sideLenght,cellElement,false);
          cellElement = drawHeaderBorderBottom(rowIndx,headerLength,cellElement,false);
          gridLayout.appendChild(cellElement)
      });
  
      row[1].forEach((headCell,colIndx)=>{
          let cellElement = document.createElement('div')
          cellElement.textContent = headCell
          cellElement.classList.add('min-height-2')

          cellElement = drawBorderRight(colIndx,bodyLength,cellElement);
          cellElement = drawHeaderBorderBottom(rowIndx,headerLength,cellElement,true);

          gridLayout.appendChild(cellElement)
      });
  
      }
  )
  
  sideNBodyNonogram.forEach((row,rowIndx) => {
      row[0].forEach((clueCell,colIndx)=>{
          let cellElement = document.createElement('div');
          cellElement.textContent = clueCell;

          cellElement = drawHeaderBorderRight(colIndx,sideLenght,cellElement,true);
          cellElement = drawBorderBottom(rowIndx,bodyLength,cellElement);

          gridLayout.appendChild(cellElement)
      });
      row[1].forEach((headCell,colIndx)=>{
          let cellElement = document.createElement('div')
          cellElement.classList.add('min-height-2')

          cellElement = drawBorderRight(colIndx,bodyLength,cellElement);
          cellElement = drawBorderBottom(rowIndx,bodyLength,cellElement);

          cellElement.setAttribute('data-position-row',rowIndx);
          cellElement.setAttribute('data-position-col',colIndx);

          cellElement.addEventListener('click',(e)=>
          {
            cellElement.classList.toggle('picked-dark')
            const cellRowValue = cellElement.getAttribute("data-position-row");
            const cellColValue = cellElement.getAttribute("data-position-col");
            gameZone[cellRowValue][cellColValue] = gameZone[cellRowValue][cellColValue]?0:1;

            if(arraysEqual(gameZone,bodyNonogram)){
              modalContent.innerText = `Congrats!!! You win!`
              modal.showModal();
            }
          })
          gridCells.push(cellElement)
          gridLayout.appendChild(cellElement)
      })
      }
  );

}

fetch('./templates.json')
  .then((response) => response.json())
  .then((json) =>
  {
      nonogramTemplates = json
      const currScheme = getScheme("Easy");
      drawNonogram(currScheme)

    document.body.appendChild(levelLayout)
    document.body.appendChild(gridLayout)
    document.body.appendChild(modal)
  }
)