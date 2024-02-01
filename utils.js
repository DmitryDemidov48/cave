// Функция для определения победителя на основе здоровья игроков и таймера.
function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId); // Очистка таймера

    // Отображение текста о победителе
    document.querySelector("#displayText").style.display = "flex";

    // Определение победителя на основе здоровья игроков
    if (player.health === enemy.health) {
        document.querySelector("#displayText").innerHTML = 'Tie'; // Ничья
    } else if (player.health > enemy.health) {
        document.querySelector("#displayText").innerHTML = 'Player 1 Wins'; // Победа игрока 1
    } else if (player.health < enemy.health) {
        document.querySelector("#displayText").innerHTML = 'Player 2 Wins'; // Победа игрока 2
    }
}

// Функция для уменьшения таймера на 1 каждую секунду.
let timer = 60; // Изначальное значение таймера
let timerId; // Идентификатор таймера

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000); // Запуск функции снова через 1 секунду
        timer--; // Уменьшение значения таймера
        document.querySelector("#timer").innerHTML = timer; // Отображение текущего значения таймера
    }

    // Если таймер достигает 0, вызываем функцию determineWinner
    if (timer === 0) {
        determineWinner({player, enemy, timerId});
    }
}
