let headerNonogram = [[0,1,0,0,0],[3,1,5,1,1]];
let bodyNonogram = [];
let sideHeaderNonogram = [[0,3],[0,1],[0,3],[1,1],[0,3]];
bodyNonogram = [
    [0,0,1,1,1],
    [0,0,1,0,0],
    [1,1,1,0,0],
    [1,0,1,0,0],
    [1,1,1,0,0],
]
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
    document.body.appendChild(gridLayout)
