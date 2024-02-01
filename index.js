
// Получаем ссылку на элемент canvas и его 2D контекст
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Устанавливаем размеры canvas
canvas.width = 1024;
canvas.height = 576;

// Заливаем canvas черным цветом
c.fillRect(0, 0, canvas.width, canvas.height);

// Гравитация
const gravity = 0.7;

// Создаем спрайт для фона
const cave = `img/6.png`
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: cave
});

// Создаем спрайт для летучей мыши
const Bat = new Sprite({
    position: {
        x: 300,
        y: 100
    },
    imageSrc: `img/Bat1.png`,
    scale: 3,
    framesMax: 4
});

// Создаем игрока (бойца)
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: `img/Musketeer/Idle.png`,
    framesMax: 5,
    scale: 2,
    offset: {
        x: 50,
        y: 95
    },
    // Спрайты для различных действий игрока
    sprites: {
        idle: {
            imageSrc: `img/Musketeer/Idle.png`,
            framesMax: 5,
        },
        run: {
            imageSrc: `img/Musketeer/Run.png`,
            framesMax: 8,
        },
        jump: {
            imageSrc: `img/Musketeer/Dead.png`,
            framesMax: 7,
        },
        fall: {
            imageSrc: `img/Musketeer/Hurt.png`,
            framesMax: 2,
        },
        attack1: {
            imageSrc: `img/Musketeer/Attack_4.png`,
            framesMax: 5,
        },
        takeHit: {
            imageSrc: `img/Musketeer/Hurt.png`,
            framesMax: 2,
        },
        death: {
            imageSrc: `img/Musketeer/Dead.png`,
            framesMax: 4,
        }
    },
    // Зона атаки игрока
    attackBox: {
        offset: {
            x: 150,
            y: 50
        },
        width: 50,
        height: 50
    }
});

// Создаем врага
const enemy = new Fighter({
    position: {
        x: 800,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue',
    imageSrc: `img/1/Idle.png`,
    framesMax: 4,
    scale: 2,
    offset: {
        x: 50,
        y: 30
    },
    // Спрайты для различных действий врага
    sprites: {
        idle: {
            imageSrc: `img/1/Idle.png`,
            framesMax: 4,
        },
        run: {
            imageSrc: `img/1/Walk.png`,
            framesMax: 6,
        },
        jump: {
            imageSrc: `img/1/Death.png`,
            framesMax: 6,
        },
        fall: {
            imageSrc: `img/1/Hurt.png`,
            framesMax: 4,
        },
        attack1: {
            imageSrc: `img/1/Attack4.png`,
            framesMax: 6,
        },
        takeHit: {
            imageSrc: `img/1/Hurt.png`,
            framesMax: 4,
        },
        death: {
            imageSrc: `img/1/Death.png`,
            framesMax: 6,
        }
    },
    // Зона атаки врага
    attackBox: {
        offset: {
            x: -150,
            y: 50
        },
        width: 50,
        height: 50
    }
});

// Отслеживание нажатия клавиш
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};

// Функция для обнаружения прямоугольной коллизии
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

// Функция анимации
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    Bat.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Движение игрока
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    // Прыжок игрока
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // Если у игрока кончается здоровье, он умирает
    if (player.health <= 0) {
        player.switchSprite('death');
    }

    // Движение врага
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    // Прыжок врага
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Если у врага кончается здоровье, он умирает
    if (enemy.health <= 0) {
        enemy.switchSprite('death');
    }

    // Обнаружение столкновения и удар по врагу
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttaking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttaking = false;
        gsap.to("#enemyHealth", {
            width: enemy.health + '%'
        });
    }

    // Если игрок промахнулся
    if (player.isAttaking && player.framesCurrent === 4) {
        player.isAttaking = false;
    }

    // Игрок получает удар
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttaking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttaking = false;
        gsap.to("#playerHealth", {
            width: player.health + '%'
        });
    }

    // Если враг промахнулся
    if (enemy.isAttaking && enemy.framesCurrent === 2) {
        enemy.isAttaking = false;
    }

    // Проверка на конец игры
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}
animate();

// Обработка событий нажатия клавиш
window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.velocity.y = -20;
                break;
            case 'r':
                player.attack();
                break;
        }
        if (!enemy.dead) {
            switch (event.key) {
                case 'ArrowRight':
                    keys.ArrowRight.pressed = true;
                    enemy.lastKey = 'ArrowRight';
                    break;
                case 'ArrowLeft':
                    keys.ArrowLeft.pressed = true;
                    enemy.lastKey = 'ArrowLeft';
                    break;
                case 'ArrowUp':
                    enemy.velocity.y = -20;
                    break;
                case 'ArrowDown':
                    enemy.isAttaking = true;
                    enemy.attack();
                    break;
            }
        }
    }
});

// Обработка событий отпускания клавиш
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});
