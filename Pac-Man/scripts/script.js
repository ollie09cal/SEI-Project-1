function init() {
    //grid global variables
    const grid = document.querySelector('.play-grid') //selecting the play area for the game
    //grid variables
    const width = 18 //allocating width of 18 cells
    const cellCount = width * width //total number of cells in grid
    const cells = [] //empty array to store the cell divs that we create
    let barrier = []
    let path = []

    resetButton = document.querySelector('#restart')

    //player variables
    const playerStartPosition = 242
    let playerCurrentPosition = 0
    let playerFood = 0
    let stopPlayer = false
    //let lives = 3
    let gameStart = false
    let score = 0
    let frenzy = false

    //live
    let lives = 3
    const liveCellCount = 3
    const liveCells = []
    const liveGrid = document.querySelector('.live')

   //ghost timers
    let redTimer
    let blueTimer
    let pinkTimer
    let orangeTimer

    //ghost movemment vairable
    let stopGhost = false
    

    //sound elements
    const theme = document.querySelector('#theme')
    const playerFoodNoise = document.querySelector('#point')
    const celebrate = document.querySelector('#celebrate')
    const loser = document.querySelector('#loser')
    const lifeL = document.querySelector('#lifeDown')
    //const allAudio = document.querySelectorAll('audio')
    theme.volume = 0.05
    playerFoodNoise.volume = 0.09
    celebrate.volume = 0.1
    loser.volume = 0.1
    lifeL.volume = 0.1


    //creates lives box
    function createLives(){
        for(let i = 0; i<liveCellCount;i++){
            const liveCell = document.createElement('div')
            //liveCell.innerText = i
            liveGrid.appendChild(liveCell)
            liveCells.push(liveCell)
        }
        liveCells.forEach(cell => cell.classList.add('life'))
    }
    createLives()


    //create grid function
    function createGrid(){
        for(let i = 0; i < cellCount; i++){ //for loop to run 324 times (for each cell)
            const cell = document.createElement('div') //creates each div element
            //cell.innerText = i //applies cell number to cell to create visual workspace
            grid.appendChild(cell) //adds div as child element of the .play-grid div
            cells.push(cell)
        }
        cells.forEach((cell, i) =>{
            console.log((i % width)+width)
            if ((i % width === width - 1 && i != 161) || (i % width === 0 && i != 144) || (i % width === i) || ((i % width)+cellCount-width)===i){
                cell.classList.add('barrier') //statement creates the outside border of the grid
            } else if ((i === 26 || i === 27 || (i % width+width*2) === i && i !=37 && i!=43 && i!=46 && i!=52)){
                cell.classList.add('barrier')
            } else if ((i % width+width*3) === i && i!=55 && i!=61 && i!=64 && i!=70){
                cell.classList.add('barrier')//generates barrier line on line 54
            } else if (i>91 && i<106){
                cell.classList.add('barrier') //genreates barrier line for line 90
            } else if (i === 114 || i===119){
                cell.classList.add('barrier') //generates barrier line at 108
            } else if ((i % width+width*7) === i && i!=131 && i!=133 && i!=136 && i!=138 || i===152 || i===153){
                cell.classList.add('barrier') //generates the line at 126 and 144
            } else if ((i % width+width*9)=== i && i != 167 && i != 169 && i != 170 && i != 171 && i != 172 && i != 174) {
                cell.classList.add('barrier') //generates barrier for 162
            } else if ((i % width+width*10)=== i && i != 185 && i != 192){
                cell.classList.add('barrier') //generates barrier for line 180
            } else if (i === 206 || i === 207){
                cell.classList.add('barrier') //generates barrier for 198
            } else if ((i % width+width*12)=== i && i != 217 && i != 221 && i != 223 && i != 226 && i != 228 && i != 232){
                cell.classList.add('barrier') //sets barrier for line 216
            } else if ((i % width+width*13)=== i && i != 235 && i != 239 && i != 241 && i != 242 && i != 243 && i != 244 && i != 246 && i != 250){
                cell.classList.add('barrier') //generates barrier for line 234
            } else if (i>257 && i<264){
                cell.classList.add('barrier') //generates barrier for line 252
            } else if ((i % width+width*15)=== i && i != 271 && i != 286){
                cell.classList.add('barrier') //generates barrier for line 270
            } else if(i=== 20 || i===33 || i===290 || i==303){
                cell.classList.add('frenzyWeb') //adds frenzy web class to certain squares
            }
        })
        barrier = cells.filter(element => element.classList.contains('barrier')) //adds all barrier divs to an array
        console.log(barrier)
        path = cells.filter(element => element.classList.contains('barrier') === false) //adds all path cells to an array
        console.log(path)

        path.forEach(cell=> cell.classList.contains('frenzyWeb') ? cell = cell : cell.classList.add('playerFood'))

        score = 0
        
        playerCurrentPosition = playerStartPosition
        cells[playerCurrentPosition].classList.add('player')


        resetButton.classList.add('dissapear')
        document.querySelector('.game-over').classList.add('dissapear')
        document.getElementById('score-tag').classList.add('dissapear')
    }
    createGrid()

    function resetPositions(){
        //resets players position
        removePlayer(playerCurrentPosition)
        playerCurrentPosition = playerStartPosition
        addPlayer(playerCurrentPosition)

        //reset the ghost positions
    }

    function gameOver(){
        //this function is run when lives < 0
        //this will need to remove the player block completely from game and run a game over screen, also clearing all intervals or loops that are running
        document.getElementById('UI-score').innerHTML = `${score}`
        grid.classList.add('dissapear')
        resetButton.classList.remove('dissapear')
        document.getElementById('open').classList.remove('dissapear')
        document.querySelector('.game-over').classList.remove('dissapear')
        document.getElementById('score-tag').classList.remove('dissapear')
        liveGrid.classList.add('dissapear')
        stopGhost = true
    }


    class ghost {
        constructor(ghostClass, startPosition, currentPosition, timer){
            this.ghostClass = ghostClass
            this.startPosition = startPosition
            this.currentPosition = currentPosition
            this.timer = timer
    
            cells[startPosition].classList.add(ghostClass)
            //random = Math.round(Math.random()*3)
            //randDirection = Math.round(Math.random())
        }
    
        ghostMovement(){
            console.log('IAM RUNNING')
            let random =  Math.round(Math.random()*3)
            let randDirection = Math.round(Math.random())
            clearInterval(this.timer)
            cells[this.currentPosition].classList.remove(this.ghostClass)
            this.currentPosition = this.startPosition
            cells[this.currentPosition].classList.add(this.ghostClass)

            this.timer = setInterval(()=>{
                cells[this.currentPosition].classList.remove(this.ghostClass)
                if (random === 0 && cells[this.currentPosition+1].classList.contains('barrier') === false){
                    if(cells[this.currentPosition-width].classList.contains('barrier') === false){
                        randDirection = Math.round(Math.random())
                        if(randDirection === 0){
                            this.currentPosition -= width
                        } else{
                            this.currentPosition++
                        }
                        
                    }else if (cells[this.currentPosition+width].classList.contains('barrier') === false) {
                        randDirection = Math.round(Math.random())
                        if(randDirection === 0){
                            this.currentPosition += width
                        } else{
                            this.currentPosition++
                        }
                    
                    }else{
                        this.currentPosition++ // changes positon to position plus 1
                    }
                } else if (random === 1 && cells[this.currentPosition-1].classList.contains('barrier') === false) { // if the left arrow is pressed and ghost position minus one doesnt equal div with class barrier
                    if(cells[this.currentPosition+width].classList.contains('barrier') === false){
                        randDirection = Math.round(Math.random())
                        if(randDirection === 0){
                            this.currentPosition += width
                        } else{
                            this.currentPosition--
                        }
                        
                    }else if (cells[this.currentPosition-width].classList.contains('barrier') === false) {
                        randDirection = Math.round(Math.random())
                        if(randDirection === 0){
                            this.currentPosition -= width
                        } else{
                            this.currentPosition--
                        }
                        
                    }else{
                        this.currentPosition-- // changes position to position minus 1
                    }
        
                } else if (random === 2 && cells[this.currentPosition-width].classList.contains('barrier') === false) { // if the up arrow is pressed and ghost position minus width doesnt equal div with class barrier
                    if(cells[this.currentPosition-1].classList.contains('barrier') === false){
                        randDirection = Math.round(Math.random())
                        if(randDirection === 0){
                            this.currentPosition--
                        } else{
                            this.currentPosition-=width
                        }
                        
                    } else if (cells[this.currentPosition+1].classList.contains('barrier') === false){
                        randDirection = Math.round(Math.random())
                        if(randDirection === 0){
                            this.currentPosition++
                        } else{
                            this.currentPosition-=width
                        }
                        
                    } else{
                        this.currentPosition -= width // changes position to position minus width
                    }
        
                } else if (random === 3 && cells[this.currentPosition+width].classList.contains('barrier') === false) { // if the down arrow is pressed and ghost position plus width doesnt equal div with class barrier
                    if(cells[this.currentPosition-1].classList.contains('barrier') === false){
                        randDirection = Math.round(Math.random())
                        if(randDirection === 0){
                            this.currentPosition--
                        } else{
                            this.currentPosition+=width
                        }
                        
                    } else if (cells[this.currentPosition+1].classList.contains('barrier') === false){
                        randDirection = Math.round(Math.random())
                        if(randDirection === 0){
                            this.currentPosition++
                        } else{
                            this.currentPosition+=width
                        }
                        
                    } else{
                        this.currentPosition += width  // changes position to position plus width
                    }
        
                } else{
                    random = Math.round(Math.random()*3)
                }
                cells[this.currentPosition].classList.add(this.ghostClass)

                if(cells[this.currentPosition].classList.contains('player') && frenzy === true){
                    cells[this.currentPosition].classList.remove(this.ghostClass)
                    this.currentPosition = this.startPosition
                    cells[this.currentPosition].classList.add(this.ghostClass)
                    score = score + 100
                    clearInterval(this.timer)
                    setTimeout(()=>{this.ghostMovement()}, 3000)
                }
                if(frenzy === true){
                    cells[this.currentPosition].classList.add('frenzy')
                    setTimeout(()=>cells[this.currentPosition].classList.remove('frenzy'),50)
                }
                if(cells[this.currentPosition].classList.contains('player')){
                    lives --
                    lifeL.play()
                    stopGhost = true
                    stopPlayer = true
                    resetPositions()
                    if(lives<=0){
                        liveCells[0].classList.remove('life')
                        theme.pause()
                        loser.play()
                        document.querySelector('body').classList.add('losing')
                        loser.loop = true
                        gameOver()
                    }else if(lives>0){
                        theme.pause()
                        liveCells[lives].classList.remove('life')
                        document.getElementById('start').innerText = "CONTINUE"
                        document.getElementById('start').classList.remove('dissapear')
                    }
                }

                if (stopGhost === true){
                    cells[this.currentPosition].classList.remove(this.ghostClass)
                    this.currentPosition = this.startPosition
                    cells[this.currentPosition].classList.add(this.ghostClass)
                    clearInterval(this.timer)
                }
                this.ghostPortal()
            },100)
        }
    
        ghostPortal(){
            if (this.currentPosition === 144){
                cells[this.currentPosition].classList.remove(this.ghostClass)
                cells[160].classList.add(this.ghostClass)
                this.currentPosition = 160
            } else if (this.currentPosition === 161){
                cells[this.currentPosition].classList.remove(this.ghostClass)
                cells[145].classList.add(this.ghostClass)
                this.currentPosition = 145
            } else {
                this.currentPosition = this.currentPosition
            }
        }
    }
    const red = new ghost('redGhost', 115, 115, redTimer)
    const blue = new ghost('blueGhost', 116, 116, blueTimer)
    const pink = new ghost('pinkGhost', 117, 117, pinkTimer)
    const orange = new ghost('orangeGhost', 118, 118, orangeTimer)
        

    //player object
    function addPlayer(position){
        cells[position].classList.add('player')

         //section handles teleport blocks
        if (position === 144){
            cells[position].classList.remove('player')
            cells[161].classList.add('player')
            playerCurrentPosition = 161
        } else if (position === 161){
            cells[position].classList.remove('player')
            cells[144].classList.add('player')
            playerCurrentPosition = 144
        }
    }
    function removePlayer(position){
        cells[position].classList.remove('player')
    }

     //ghost movement section
     function ghostMovements(){
        random = Math.round(Math.random()*3)
        
        setTimeout(()=>{red.ghostMovement()}, 1000)
        setTimeout(()=>{blue.ghostMovement()}, 1500)
        setTimeout(()=>{pink.ghostMovement()}, 2000)
        setTimeout(()=>{orange.ghostMovement()}, 2500)
    }

    //this function handles all of the players movement
    function handleKeyDown(event) {
        const key = event.keyCode // store the event.keyCode in a variable to save us repeatedly typing it out
        const left = 37
        const right = 39
        const up = 38
        const down = 40
        console.log('CURRENT POSITION: ', playerCurrentPosition)
        if(stopPlayer === false){
            removePlayer(playerCurrentPosition) // remove the cat from its current position
                //section handles movement and blocks player class from entering divs with the class of barrier
            if (key === right && cells[playerCurrentPosition+1].classList.contains('barrier') === false && gameStart === true) { // if the right arrow is pressed and player position plus one doesnt equal div with class barrier
                playerCurrentPosition++ // changes positon to position plus 1
            } else if (key === left && cells[playerCurrentPosition-1].classList.contains('barrier') === false && gameStart === true) { // if the left arrow is pressed and player position minus one doesnt equal div with class barrier
                playerCurrentPosition-- // changes position to position minus 1
            } else if (key === up && cells[playerCurrentPosition-width].classList.contains('barrier') === false && gameStart === true) { // if the up arrow is pressed and player position minus width doesnt equal div with class barrier
                playerCurrentPosition -= width // changes position to position minus width
            } else if (key === down && cells[playerCurrentPosition+width].classList.contains('barrier') === false && gameStart === true) { // if the down arrow is pressed and player position plus width doesnt equal div with class barrier
                playerCurrentPosition += width  // changes position to position plus width
            } else {
                console.log('INVALID KEY') 
            }
            console.log('NEW POSITION: ', playerCurrentPosition)
            addPlayer(playerCurrentPosition)
        }

        if (playerFood === 138){
            gameOver()
            theme.pause()
            celebrate.play()
            document.querySelector('body').classList.add('winning')
            stopGhost = true
            stopPlayer = true
        }

        if (cells[playerCurrentPosition].classList.contains('playerFood')){
            score ++
            playerFood ++
            console.log(path.length)
            playerFoodNoise.play()
            cells[playerCurrentPosition].classList.remove('playerFood')
            
        } else if (cells[playerCurrentPosition].classList.contains('frenzyWeb')){
            frenzy = true
            playerFood ++
            theme.playbackRate = 1.5
            cells[playerCurrentPosition].classList.remove('frenzyWeb')
            setTimeout(()=>{
                frenzy = false
                theme.playbackRate = 1.0
            }, 5000)
        }
        
    }

    function startGame(){
        //this will run once the game start button has been pressed
        //this button will cover the screen and when pressed will initiate the game by running the load grid function 
        //inside the load grid function I can add the other functions that start the game
        gameStart = true
        stopGhost = false
        stopPlayer = false
        ghostMovements()
        
        theme.play()
        theme.loop = true
        document.getElementById('open').classList.add('dissapear')
        document.getElementById('start').classList.add('dissapear')
        
    }

    function restartGame(){
        location.reload()
    }

    document.getElementById('start').addEventListener('click', startGame)
    document.addEventListener('keydown', handleKeyDown)
    resetButton.addEventListener('click', restartGame)
}
window.addEventListener('DOMContentLoaded', init)