const board = document.querySelector('.board')
const randomBtn = document.querySelector('#random-btn')
const startBtn = document.querySelector('#start-btn')
const stopBtn = document.querySelector('#stop-btn')
const stepBtn = document.querySelector('#step-btn')
const clearBtn = document.querySelector('#clear-btn')
const intervalTimeInput = document.querySelector('#time')
const boardSize = 30

let interval
let isRun = false

const boardArray = []

for (let i = 0; i < boardSize; i++) {
  boardArray[i] = []
  for (let j = 0; j < boardSize; j++) {
    boardArray[i][j] = [0, 0]
  }
}


board.style.maxWidth = `${boardSize * 25 + 2}px`

function createBoard() {
  for (let x = 0; x < boardArray.length; x++) {
    for(let y = 0; y < boardArray[x].length; y++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.setAttribute('data-x', x)
      cell.setAttribute('data-y', y)
      cell.setAttribute('data-state', boardArray[x][y][0])
      board.append(cell)
    }
  }
}

createBoard()

function paintCells() {
  const cells = board.querySelectorAll('.cell')
  for (const cell of cells) {
    if (boardArray[+cell.dataset.x][+cell.dataset.y][0] === 0) cell.style.backgroundColor = '#fff'
    else if (boardArray[+cell.dataset.x][+cell.dataset.y][0] === 1) cell.style.backgroundColor = '#000'
  }
}

function numbersOfLivingNeighbors(x, y) {
  const neighbors = [
    boardArray[(x - 1 + boardSize) % boardSize][(y - 1 + boardSize) % boardSize][0],
    boardArray[(x - 1 + boardSize) % boardSize][y][0],
    boardArray[(x - 1 + boardSize) % boardSize][(y + 1) % boardSize][0],
    boardArray[x][(y - 1 + boardSize) % boardSize][0],
    boardArray[x][(y + 1) % boardSize][0],
    boardArray[(x + 1) % boardSize][(y - 1 + boardSize) % boardSize][0],
    boardArray[(x + 1) % boardSize][y][0],
    boardArray[(x + 1) % boardSize][(y + 1) % boardSize][0]
  ]
  return neighbors.reduce((a, e) => a + e)
}

function randomizeBoard() {
  for (let i = 0; i < boardArray.length; i++) {
    for (let j = 0; j < boardArray[i].length; j++) {
      boardArray[i][j][0] = Math.round(Math.random() - 0.25)
    }
  }
}

function resetBoard() {
  for (let i = 0; i < boardArray.length; i++) {
    for (let j = 0; j < boardArray[i].length; j++) {
      boardArray[i][j][0] = 0
      boardArray[i][j][1] = 0
    }
  }
}

function step() {
  const cells = board.querySelectorAll('.cell')
  cells.forEach(cell => {
    let x = +cell.dataset.x
    let y = +cell.dataset.y
    if (boardArray[x][y][0] === 0 && numbersOfLivingNeighbors(x, y) === 3) {
      boardArray[x][y][1] = 1
    }
    if (boardArray[x][y][0] === 1 && (numbersOfLivingNeighbors(x, y) < 2 || numbersOfLivingNeighbors(x, y) > 3)) {
      boardArray[x][y][1] = 0
    }
  })
  for (let x = 0; x < boardArray.length; x++) {
    for(let y = 0; y < boardArray[x].length; y++) {
      boardArray[x][y][0] = boardArray[x][y][1]
    }
  }
  paintCells()
}

board.addEventListener('click', e => {
  if(e.target.classList.contains('cell')) {
    e.target.dataset.state = e.target.dataset.state === '0' ? '1' : '0'
    boardArray[+e.target.dataset.x][+e.target.dataset.y][0] = boardArray[+e.target.dataset.x][+e.target.dataset.y][1] = +e.target.dataset.state
    paintCells()
  }
})

randomBtn.addEventListener('click', () => {
  randomizeBoard()
  paintCells()
})

startBtn.addEventListener('click', () => {
  if (!isRun) {
    interval = setInterval(step, +intervalTimeInput.value)
    isRun = true
    board.style.backgroundColor = 'rgba(162, 252, 162, 0.1)'
    intervalTimeInput.setAttribute('disabled', 'disabled')
  }
})

stopBtn.addEventListener('click', () => {
  clearInterval(interval)
  isRun = false
  board.style.backgroundColor = 'rgba(247, 166, 166, 0.1)'
  intervalTimeInput.removeAttribute('disabled', 'disabled')
})

stepBtn.addEventListener('click', step)

clearBtn.addEventListener('click', () => {
  resetBoard()
  paintCells()
  board.style.backgroundColor = '#fff'
})