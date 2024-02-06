let nonogramTemplates = []
let modal;

// levels button


function setNavToggle(flag,navigation,dataNavToggle) {
  navigation.setAttribute("data-visible", flag);
  dataNavToggle.setAttribute('aria-expanded',flag)
  }

const renderLevelButtons = () => {
 
  const levelLayout = document.createElement('div');
  levelLayout.classList.add('menu');
  
  const navigation = document.createElement('nav');
  navigation.classList.add('primary-navigation','gap-4','m-4');
  navigation.setAttribute('data-visible',false)

  let levelButtons = ['Easy','Medium','Hard']
  levelButtons = levelButtons.map(levelName=>{

    const menuItem = document.createElement('div');

    const subMenuItems = document.createElement('div');
    subMenuItems.classList.add('submenu');

    const chevronRight = document.createElement('img');
    chevronRight.classList.add('chevron')
    chevronRight.src = './assets/right-chevron.svg';
    chevronRight.alt = 'open items';
    chevronRight.setAttribute('data-item-extended','false');
    chevronRight.setAttribute('data-name',levelName);
    chevronRight.classList.add('menu-toggle');

    const btn = document.createElement('button');
    btn.classList.add('level-button','root-button');
    
    const btnText = document.createElement('span');
    btnText.textContent = levelName;

    btn.append(chevronRight);
    btn.append(btnText);

    menuItem.appendChild(btn);
    menuItem.appendChild(subMenuItems);
    navigation.appendChild(menuItem);
    return btn;
  })

  const randomButton = document.createElement('button');
  randomButton.classList.add('level-button','root-button');
  randomButton.textContent = 'Random game'
  randomButton.addEventListener('click',()=>{
    const currScheme = getRandomScheme(null);
    initTimer();
    secondDuration = 0;
    drawNonogram(currScheme);
  })


  navigation.append(randomButton)
  levelLayout.append(navigation)
  

  levelButtons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{

      const chevronRight = btn.querySelector('.chevron');

      const chevExtended = chevronRight.getAttribute('data-item-extended');

      if(chevExtended === 'true'){
        const subMenuAll = document.querySelectorAll('.submenu');
        subMenuAll.forEach(subMenu=>{
          subMenu.innerHTML = ''
          subMenu.classList.remove('m-4');
        })
        chevronRight.setAttribute('data-item-extended','false');
      }else{
        document.querySelectorAll('[data-item-extended]').forEach(chevBtn=>chevBtn.setAttribute('data-item-extended','false'))
        chevronRight.setAttribute('data-item-extended','true');
        const currScheme = getRandomScheme(chevronRight.getAttribute('data-name'));
        if(window.innerWidth < 769){
          const subMenuItems = btn.parentNode.querySelector('.submenu');
          renderButtons(currScheme.buttonNames,subMenuItems);
        }else{
          renderButtons(currScheme.buttonNames);
        }
      }

    })
  })

  const menuButtonContainer = document.createElement("div");
  menuButtonContainer.classList.add('flex','menu-button','justify-content-end','mt-6','mr-4');

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
  menuButton.appendChild(hamburgerLines);
  menuButtonContainer.appendChild(menuButton);

  levelLayout.appendChild(menuButtonContainer)

  menuButton.addEventListener('click',() => {
        let fl = menuButton.getAttribute('aria-expanded') === 'true'?false:true;
        setNavToggle(fl,navigation,menuButton)
    })


  return levelLayout

}

//************modal section************//

const createModal = () => {
  modal = document.createElement('dialog');
  const modalContent = document.createElement('div');
  modalContent.setAttribute('data-modal','');
  modalContent.classList.add('p-4');
  const modalFooter = document.createElement('div');
  modalFooter.classList.add('flex');
  modalFooter.classList.add('justify-content-center');
  const modalClose = document.createElement('button');
  modalClose.classList.add('close-button');
  modalClose.innerText = 'Close!'
  modalFooter.appendChild(modalClose);
  modal.appendChild(modalContent);
  modal.appendChild(modalFooter);
  modalClose.addEventListener('click',() => {
    initTimer();
    modal.close();
  })
  return modal;

}


// **********puzzle select buttons*****//



const renderButtons = (buttons,dom=null) => {
  let puzzleNameLayout
  
  puzzleNameLayout = document.querySelector('[data-puzzle-names]');
  puzzleNameLayout.innerHTML = '';
  if(dom){
    puzzleNameLayout = dom
  }


  puzzleNameLayout.classList.add('flex','gap-4','m-4');
  puzzleNameLayout.classList.add('puzzle-names');

  const puzzleButtons = buttons.map((x)=>{
      const btn = document.createElement('button');
      btn.classList.add('level-button','puzzle-button');
      btn.textContent = x;
      puzzleNameLayout.appendChild(btn);
      return btn;
  })
  
  puzzleButtons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      puzzleButtons.forEach(lvlButton=>{
        lvlButton.classList.remove('pushed')
      })
      btn.classList.add('pushed');
      initTimer();
      secondDuration = 0;
      const currScheme = getSchemeByName(e.target.innerText);
      drawNonogram(currScheme)
        
    })
  })

  puzzleNameLayout.setAttribute('data-puzzle-names','')

  return puzzleNameLayout;
}

// ****************timer**********************//

let timer;
let secondDuration;

const initTimer = () => {
  clearInterval(timer);
  const timerLayout = document.querySelector('[data-timer]');
  timerLayout.classList.add('timer')
  timerLayout.innerHTML = '00:00';
}

function startTimer(){
  const timerLayout = document.querySelector('[data-timer]')
  secondDuration = 1;
  timer = setInterval(()=>{
    timerLayout.innerHTML = '00:'+secondDuration;
    timerLayout.innerHTML = `0${Math.floor(secondDuration / 60)}`.slice(-2) + ":" + `0${Math.floor(secondDuration % 60)}`.slice(-2);
    secondDuration += 1;
  }, 1000)
}

function stopTimer(){
  clearInterval(timer);
}

// ****************nonogram**********************//

const getRandomNumber = (range) => {
  return Math.floor(Math.random() * range);
}

const getRandomScheme = (level) => {
  let indx = 0;
  let levelArray = []
  let buttonNames = []

  if(level){
    levelArray = nonogramTemplates.filter(x=> x.level === level);
    indx = getRandomNumber(levelArray.length);
    buttonNames = levelArray.map(x=> x.name);
  }else{
    levelArray = nonogramTemplates.slice();
    indx = getRandomNumber(nonogramTemplates.length);
  }
  
  const headerNonogram = levelArray[indx].topClues;
  const bodyNonogram = levelArray[indx].body;
  const sideHeaderNonogram = levelArray[indx].sideClues;
  return {header:headerNonogram,body:bodyNonogram,sideHeader:sideHeaderNonogram,buttonNames:buttonNames};

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
          cellElement.classList.add('max-height-2')
          
          cellElement = drawHeaderBorderRight(colIndx,sideLenght,cellElement,false);
          cellElement = drawHeaderBorderBottom(rowIndx,headerLength,cellElement,false);
          gridLayout.appendChild(cellElement)
      });
  
      row[1].forEach((headCell,colIndx)=>{
          let cellElement = document.createElement('div')
          cellElement.textContent = headCell === 0?'':headCell;
          cellElement.classList.add('min-height-2')
          cellElement.classList.add('header-cell-placement');

          cellElement = drawBorderRight(colIndx,bodyLength,cellElement);
          cellElement = drawHeaderBorderBottom(rowIndx,headerLength,cellElement,false);

          gridLayout.appendChild(cellElement)
      });
  
      }
  )
  
  sideNBodyNonogram.forEach((row,rowIndx) => {
      row[0].forEach((clueCell,colIndx)=>{
          let cellElement = document.createElement('div');
          cellElement.textContent = clueCell === 0?'':clueCell;
          cellElement.classList.add('side-cell-placement');

          cellElement = drawHeaderBorderRight(colIndx,sideLenght,cellElement,false);
          cellElement = drawBorderBottom(rowIndx,bodyLength,cellElement);

          gridLayout.appendChild(cellElement)
      });
      row[1].forEach((headCell,colIndx)=>{
          let cellElement = document.createElement('div')
          cellElement.classList.add('min-height-2')
          cellElement.classList.add('grid-cell')

          cellElement = drawBorderRight(colIndx,bodyLength,cellElement);
          cellElement = drawBorderBottom(rowIndx,bodyLength,cellElement);

          cellElement.setAttribute('data-position-row',rowIndx);
          cellElement.setAttribute('data-position-col',colIndx);

          cellElement.addEventListener('click',(e)=>
          {
            const fImg = cellElement.querySelector('.cross-pic')
            if(fImg){
              cellElement.innerHTML = ''
            }
            cellElement.classList.toggle('picked-dark')
            const cellRowValue = cellElement.getAttribute("data-position-row");
            const cellColValue = cellElement.getAttribute("data-position-col");
            gameZone[cellRowValue][cellColValue] = gameZone[cellRowValue][cellColValue]?0:1;
            const hitSound = new Audio("./assets/tap.mp3");
            hitSound.volume = .33;
            hitSound.play();

            

            if(!secondDuration){
              startTimer();
            }

            if(arraysEqual(gameZone,bodyNonogram)){
              stopTimer();

              modal.querySelector('[data-modal]').innerText = `Great! You have solved the nonogram in ${secondDuration-1} seconds!`
              secondDuration = 0;
              
              modal.showModal();
            }
            
          })

          cellElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(!secondDuration){
              startTimer();
            }
            cellElement.classList.remove('picked-dark')
            const fImg = cellElement.querySelector('.cross-pic')
            if(fImg){
              cellElement.innerHTML = ''

            }else{
              const crossCrs = document.createElement('img');
              crossCrs.classList.add('cross-pic');
              crossCrs.src = './assets/cross.svg'
              crossCrs.alt = 'crossed out'
              cellElement.append(crossCrs)
              
              cellElement.classList.toggle('crossed-cell');

            }
        }, false);
          gridCells.push(cellElement)
          gridLayout.appendChild(cellElement)

      })
      }
  );

  return gridLayout;

}

fetch('./templates.json')
  .then((response) => response.json())
  .then((json) =>
  {
      nonogramTemplates = json
      const currScheme = getRandomScheme("Easy");
      createModal();

      // *****level buttons*****//
      
      const levelLayout = renderLevelButtons()
      document.body.appendChild(levelLayout);
      
      // *****nonogram's name buttons*****//

      const puzzleNameLayout = document.createElement('div');
      puzzleNameLayout.setAttribute('data-puzzle-names','')
      document.body.appendChild(puzzleNameLayout);

      // *****timer*****//

      const timerLayout = document.createElement('div');
      timerLayout.setAttribute('data-timer','');
      document.body.appendChild(timerLayout);
      initTimer();

      // *****nonogram*****//

      const gridContainer = document.createElement('div');
      gridContainer.classList.add('flex','justify-content-center');
      const gridLayout = document.createElement('div');
      gridLayout.setAttribute('data-nonogram-grid','');

      gridContainer.append(gridLayout);
      document.body.appendChild(gridContainer);

      drawNonogram(currScheme)

      document.body.appendChild(modal);
  }
)

