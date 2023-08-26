function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector("#displayText").style.display = "flex"
    if (player.health === enemy.health) {
        document.querySelector("#displayText").innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector("#displayText").innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        document.querySelector("#displayText").innerHTML = 'Player 2 Wins'
    }
}
//timer
let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId =  setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({player, enemy,timerId})
    }
}

