const crypto = require('crypto')
const readlineSync = require('readline-sync')

class keyGenerator{
    static generateKey(){
        return crypto.randomBytes(32).toString('hex');
    }
}


class HMACGenerator{
    static generateHMACKey(key, message){
        return crypto.createHmac('sha256', key).update(message).digest('hex')
    }
}


class GameRules{
    constructor(moves){
        this.moves = moves
    }

    determineWinner(playerMove , computerMove) {
        const totalMoves = this.moves.length; 
        const playerIndex = this.moves.indexOf(playerMove);  
        const computerIndex = this.moves.indexOf(computerMove)   
        
        if(playerIndex === computerIndex){
            return 'Draw';
        }

        const winRange = Array.from({length: Math.floor(totalMoves/2)}, (_, i)=> (playerIndex + i + 1) % totalMoves)

        if(winRange.includes(computerIndex)){
            return 'Player Wins'
        } else{
            return 'Computer Wins'
        }
    }
}

class HelpTable{
    constructor(moves){
        this.moves = moves;
    }

    generateTable(){
        const totalMoves = this.moves.length;
        const table = []

        let headerRow = ['Move', ...this.moves]
        table.push(headerRow)

        for(let i = 0; i< totalMoves; i++){
            let row = [this.moves[i]]

            for(let j = 0; j < totalMoves; j++){
                if(i === j){
                    row.push('Draw')
                } else if(this.isWinningMove(i, j, totalMoves)){
                    row.push('Win')
                } else{
                    row.push('Lose')
                }
            }
            table.push(row)
        }
        this.displayTable(table)
    }

    isWinningMove(i, j, totalMoves){
        const winRange = Array.from({ length: Math.floor(totalMoves / 2) }, (_, k) => (i + k + 1) % totalMoves);
    return winRange.includes(j);
    }

    displayTable(table){
        table.forEach(row=>{
            console.log(row.map(cell=> cell.toString().padEnd(10)).join(''))
        })
    }
}


const moves = process.argv.slice(2)

if(moves.length < 3 || moves.length % 2 === 0){
    console.error('You must provide an odd number of non-repeating')
    // console.error("")
    process.exit(1)
}

const key = keyGenerator.generateKey()
const computerMove = moves[Math.floor(Math.random() * moves.length)]
const hmac = HMACGenerator.generateHMACKey(key, computerMove)
const rules = new GameRules(moves)
const helpTable = new HelpTable(moves)

console.log('HMAC', hmac)

while(true){
    console.log('\nMake your move')
    moves.forEach((move, index)=>console.log(`${index + 1} - ${move}`))
    console.log("0 - Exit")
    console.log("? - Help")

    const choice = readlineSync.question('Your Choice: ')
    if(choice === '0'){
        console.log('Exiting...')
        break;
    }

    if(choice === '?'){
        helpTable.generateTable()
        continue;
    }

    const playerMove = moves[parseInt(choice) - 1]
    if(!playerMove){
        console.log('Invalid choice, please try again!')
        continue;
    }

    console.log('Your move', playerMove)
    console.log('Computer move', computerMove)

    const result = rules.determineWinner(playerMove, computerMove)
    console.log(result)
    console.log('Original Key:', key)
    break;
}


