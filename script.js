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
    btn.addEventListener('click',()=>{
        levelButtons.forEach(lvlButton=>{
            lvlButton.classList.remove('pushed')
        })
        btn.classList.add('pushed');
        console.log(btn);
        // nonogramTemplates.filter(x=>)
    })
})

const getScheme = (level) => {
  headerNonogram = nonogramTemplates.filter(x=> x.level === level).topClues;
  bodyNonogram = nonogramTemplates.filter(x=> x.level === level).body;
  sideHeaderNonogram = nonogramTemplates.filter(x=> x.level === level).sideClues;

}
fetch('./templates.json')
  .then((response) => response.json())
  .then((json) =>
  {
      nonogramTemplates = json
      getScheme("Easy");
      const gridLayout = document.createElement('div');
const gridCells = []

bodyNonogram = bodyNonogram.map((row,i) => [[...sideHeaderNonogram[i]],[...row]])
const preHeader = Array.from(Array(sideHeaderNonogram[0].length)).fill(0)
headerNonogram = headerNonogram.map((row) => [[...preHeader],[...row]])

gridLayout.classList.add('grid');
// gridLayout.addEventListener('click',(e)=>{
//     console.log(e);
// })

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
    document.body.appendChild(levelLayout)
    document.body.appendChild(gridLayout)
  }
)




