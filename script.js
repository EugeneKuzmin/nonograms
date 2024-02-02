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

const drawNonogram = (scheme) => {

  gridLayout.innerHTML = '';
  gridLayout.removeAttribute('style')

  let bodyNonogram = scheme.body;
  let sideHeaderNonogram = scheme.sideHeader;
  let headerNonogram = scheme.header;

  gridLayout.classList.add('grid');
  gridLayout.setAttribute('style', `grid-template-columns: repeat(${sideHeaderNonogram[0].length + headerNonogram[0].length},1fr);max-width: ${(sideHeaderNonogram[0].length + headerNonogram[0].length)*2}rem;`);
  
  const gridCells = [];
  
  bodyNonogram = bodyNonogram.map((row,i) => [[...sideHeaderNonogram[i]],[...row]])
  const preHeader = Array.from(Array(sideHeaderNonogram[0].length)).fill(0)
  headerNonogram = headerNonogram.map((row) => [[...preHeader],[...row]])
  
  
  headerNonogram.forEach(row =>{
      row[0].forEach(emptyCell=>{
          const cellElement = document.createElement('div')
          cellElement.classList.add('empty-cell')
          gridLayout.appendChild(cellElement)
      });
  
      row[1].forEach(headCell=>{
          const cellElement = document.createElement('div')
          cellElement.textContent = headCell
          cellElement.classList.add('cell')
          gridLayout.appendChild(cellElement)
      });
  
      }
  )
  
  
  bodyNonogram.forEach((row,rowIndx) => {
      row[0].forEach(clueCell=>{
              const cellElement = document.createElement('div')
              cellElement.textContent = clueCell
              cellElement.classList.add('cell')
              gridLayout.appendChild(cellElement)
          });
          row[1].forEach((headCell,colIndex)=>{
              const cellElement = document.createElement('div')
              cellElement.classList.add('clue-cell')
              cellElement.setAttribute('data-position-row',rowIndx)
              cellElement.setAttribute('data-position-col',colIndex)
              cellElement.addEventListener('click',(e)=>
  
              {
                      console.log('row',cellElement.getAttribute('data-position-row'))
                      console.log('cpl',cellElement.getAttribute('data-position-col'))
                      cellElement.classList.toggle('picked-dark')
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
  }
)




