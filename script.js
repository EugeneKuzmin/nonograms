let nonogramTemplates = []
let modal;
// levels button

function setNavToggle(flag,navigation,dataNavToggle) {
  navigation.setAttribute("data-visible", flag);
  dataNavToggle.setAttribute('aria-expanded',flag)
  }

const renderLevelButtons = () => {
 
  const levelLayout = document.createElement('div');
  levelLayout.classList.add('flex');
  levelLayout.classList.add('gap-4');
  levelLayout.classList.add('m-4');
  levelLayout.classList.add('menu');
  
  const navigation = document.createElement('nav');
  navigation.classList.add('primary-navigation');
  navigation.setAttribute('data-visible',true)

  let levelButtons = ['Easy','Medium','Hard']
  levelButtons = levelButtons.map(levelName=>{

    const menuItem = document.createElement('div');

    const subMenuItems = document.createElement('div');

    const chevronRight = document.createElement('img');
    chevronRight.classList.add('chevron')
    chevronRight.src = './assets/right-chevron.svg';
    chevronRight.alt = 'open items';
    chevronRight.setAttribute('data-item-extended','false');
    chevronRight.setAttribute('data-name',levelName);
    chevronRight.classList.add('menu-toggle');

    chevronRight.addEventListener('click',()=>{
      const chevExtended = chevronRight.getAttribute('data-item-extended');
      if(chevExtended === 'true'){
        puzzleNameLayout = document.querySelector('[data-puzzle-names]');
        puzzleNameLayout.innerHTML = '';
        chevronRight.setAttribute('data-item-extended','false');
      }else{
        chevronRight.setAttribute('data-item-extended','true');
        const currScheme = getRandomeScheme(chevronRight.getAttribute('data-name'));
          drawNonogram(currScheme)
          renderButtons(currScheme.buttonNames,currScheme.currNonogram,subMenuItems);
      }

    })

    const btn = document.createElement('button');
    btn.classList.add('level-button');
    
    const btnText = document.createElement('span');
    btnText.textContent = levelName;

    btn.append(chevronRight);
    btn.append(btnText);

    if(levelName === 'Easy'){
        btn.classList.add('pushed');
    }


    menuItem.appendChild(btn);
    menuItem.appendChild(subMenuItems);
    navigation.appendChild(menuItem);
    return btn;
  })

  levelLayout.append(navigation)
  

  levelButtons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        levelButtons.forEach(lvlButton=>{
            lvlButton.classList.remove('pushed')
        })
        btn.classList.add('pushed');
        const currScheme = getRandomeScheme(e.target.innerText);
        drawNonogram(currScheme)
        renderButtons(currScheme.buttonNames,currScheme.currNonogram);

        // nonogramTemplates.filter(x=>)
    })
  })

  const menuButtonContainer = document.createElement("div");
  menuButtonContainer.classList.add('flex');
  menuButtonContainer.classList.add('align-items-center');
  menuButtonContainer.classList.add('menu-button');
  
  const menuButton = document.createElement("button");
  menuButton.classList.add('button-burger');
  menuButton.setAttribute('aria-expanded','false');

  const hamburgerLines = document.createElement("div");
  hamburgerLines.classList.add('hamburger-lines');
  const lineTop = document.createElement("span");
  lineTop.classList.add('line','line-top');
  const lineBottom = document.createElement("span");
  lineBottom.classList.add('line','line-bottom');
  hamburgerLines.appendChild(lineTop);
  hamburgerLines.appendChild(lineBottom);
  menuButtonContainer.appendChild(menuButton);
  menuButtonContainer.appendChild(hamburgerLines);

  levelLayout.appendChild(menuButtonContainer)

  menuButton.addEventListener('click',() => {
        let fl = menuButton.getAttribute('aria-expanded') === 'true'?false:true;
        setNavToggle(fl,navigation,menuButton)
    })


  // <div class="flex align-items-center menu-button" >
  //                   <button type="button" data-nav-toggle class="button-burger" aria-expanded="false">
                        
  //                       <div class="hamburger-lines">
  //                           <span class="line line-top"></span>
  //                           <span class="line line-bottom"></span>
  //                         </div>  
  //                   </button>
  //               </div>

  return levelLayout

}

//************modal section************//

const createModal = () => {
  modal = document.createElement('dialog');
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
    const currScheme = getRandomeScheme("Easy");
    drawNonogram(currScheme)
    modal.close();
  })

}


// **********puzzle select buttons*****//



const renderButtons = (buttons,pushedBtn,dom=null) => {
  let puzzleNameLayout
  
  puzzleNameLayout = document.querySelector('[data-puzzle-names]');
  puzzleNameLayout.innerHTML = '';
  if(dom){
    puzzleNameLayout = dom
  }


  puzzleNameLayout.classList.add('flex','gap-4','m-4');
  puzzleNameLayout.classList.add('puzzle-names');

  const puzzleButtons = buttons.map((x,indx)=>{
      const btn = document.createElement('button');
      btn.classList.add('level-button');
      btn.textContent = x;
      if(indx === pushedBtn){
          btn.classList.add('pushed');
      }
      puzzleNameLayout.appendChild(btn);
      return btn;
  })
  
  puzzleButtons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      puzzleButtons.forEach(lvlButton=>{
            lvlButton.classList.remove('pushed')
        })
        btn.classList.add('pushed');
  
        const currScheme = getSchemeByName(e.target.innerText);
        console.log(document.body)
        drawNonogram(currScheme)
        
        // nonogramTemplates.filter(x=>)
    })
  })

  puzzleNameLayout.setAttribute('data-puzzle-names','')

  return puzzleNameLayout;
}

const getRandomNumber = (range) => {
  return Math.floor(Math.random() * range);
}

const getRandomeScheme = (level) => {

  const levelArray = nonogramTemplates.filter(x=> x.level === level);
  const indx = getRandomNumber(levelArray.length);
  const buttonNames = levelArray.map(x=> x.name);
  const headerNonogram = levelArray[indx].topClues;
  const bodyNonogram = levelArray[indx].body;
  const sideHeaderNonogram = levelArray[indx].sideClues;

  return {header:headerNonogram,body:bodyNonogram,sideHeader:sideHeaderNonogram,buttonNames:buttonNames,currNonogram:indx};

}

const getSchemeByName = (name) => {
  const nonogram = nonogramTemplates.find(x=> x.name === name);
  
  const headerNonogram = nonogram.topClues;
  const bodyNonogram = nonogram.body;
  const sideHeaderNonogram = nonogram.sideClues;

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

  let gridLayout = document.querySelector('[data-nonogram-grid]')

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

  return gridLayout;

}

const refreshRenderLayout = () => {

}

fetch('./templates.json')
  .then((response) => response.json())
  .then((json) =>
  {
      nonogramTemplates = json
      const currScheme = getRandomeScheme("Easy");
      createModal()

      const levelLayout = renderLevelButtons()
      
      document.body.appendChild(levelLayout);
      const puzzleNameLayout = document.createElement('div');
      puzzleNameLayout.setAttribute('data-puzzle-names','')
      document.body.appendChild(puzzleNameLayout);
      
      renderButtons(currScheme.buttonNames,currScheme.currNonogram);

      const gridLayout = document.createElement('div');
      gridLayout.setAttribute('data-nonogram-grid','')
      document.body.appendChild(gridLayout);

      drawNonogram(currScheme)

      document.body.appendChild(modal);
  }
)