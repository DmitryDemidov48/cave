const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height =576;

c.fillRect(0,0,canvas.width ,canvas.height);

const gravity = 0.7

const background = new Sprite ({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "../img/6.png"


})


const Bat = new Sprite ({
    position: {
        x: 300,
        y: 100
    },
    imageSrc: "../img/Bat1.png",
    scale: 3,
    framesMax: 4
})

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
    imageSrc: "../img/Musketeer/Idle.png",
    framesMax: 5,
    scale: 2,
    offset: {
        x: 50,
        y: 95
    },
    sprites: {
        idle: {
            imageSrc: "../img/Musketeer/Idle.png",
            framesMax: 5,
        },
        run: {
            imageSrc: "../img/Musketeer/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "../img/Musketeer/Dead.png",
            framesMax: 7,
        },
        fall:{
            imageSrc: "../img/Musketeer/Hurt.png",
            framesMax: 2,
        },
        attack1:{
            imageSrc: "../img/Musketeer/Attack_4.png",
            framesMax: 5,
        },
        takeHit: {
            imageSrc: "../img/Musketeer/Hurt.png",
            framesMax: 2,
        },
        death: {
            imageSrc: "../img/Musketeer/Dead.png",
            framesMax: 4,
        }
    },
    attackBox:{
        offset: {
            x: 150,
            y: 50
        },
        width: 50,
        height: 50
    }
})


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
    imageSrc: "../img/1/Idle.png",
    framesMax: 4,
    scale: 2,
    offset: {
        x: 50,
        y: 30
    },
    sprites: {
        idle: {
            imageSrc: "../img/1/Idle.png",
            framesMax: 4,
        },
        run: {
            imageSrc: "../img/1/Walk.png",
            framesMax: 6,
        },
        jump: {
            imageSrc:  "../img/1/Death.png",
            framesMax: 6,
        },
        fall:{
            imageSrc: "../img/1/Hurt.png",
            framesMax: 4,
        },
        attack1:{
            imageSrc: "../img/1/Attack4.png",
            framesMax: 6,
        },
        takeHit: {
            imageSrc: "../img/1/Hurt.png",
            framesMax: 4,
        },
        death: {
            imageSrc: "../img/1/Death.png",
            framesMax: 6,
        }
    },
    attackBox:{
        offset: {
            x: -150,
            y: 50
        },
        width: 50,
        height: 50
    }
})

console.log(player)

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
}

function rectangularCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}


decreaseTimer()


function animate () {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    Bat.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0


// player movement


    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
       player.switchSprite('run')


    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
      player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
//jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    if (player.health <= 0) {
        player.switchSprite('death')
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    if (enemy.health <= 0) {
        enemy.switchSprite('death')
    }
    // detect for collision & enemy get hit
    if (
      rectangularCollision({
          rectangle1: player,
          rectangle2: enemy
      }) &&
        player.isAttaking && player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttaking = false

      /* document.querySelector("#enemyHealth").style.width = enemy.health + '%'*/
        gsap.to("#enemyHealth", {
            width:  enemy.health + '%'
        })
    }
// if player misses
    if (player.isAttaking && player.framesCurrent === 4) {
        player.isAttaking = false
    }
    //this is where our player  gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttaking && enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttaking = false
      /*  document.querySelector("#playerHealth").style.width = player.health + '%'*/
        gsap.to("#playerHealth", {
            width:  player.health + '%'
        })
    }
    // if player misses
    if (enemy.isAttaking && enemy.framesCurrent === 2) {
        enemy.isAttaking = false
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}
animate()

////

window.addEventListener('keydown', (event) => {
   if (!player.dead){
    switch (event.key) {
        case 'd' :
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a' :
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w' :
            player.velocity.y = -20
            break
        case 'r' :
            player.attack()
            break
    }
       if (!enemy.dead){
           switch (event.key) {
               case 'ArrowRight' :
                   keys.ArrowRight.pressed = true
                   enemy.lastKey = 'ArrowRight'
                   break
               case 'ArrowLeft' :
                   keys.ArrowLeft.pressed = true
                   enemy.lastKey = 'ArrowLeft'
                   break
               case 'ArrowUp' :
                   enemy.velocity.y = -20
                   break
               case 'ArrowDown' :
                   enemy.isAttaking = true
                   enemy.attack()
                   break
           }
    }
    }
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :
            keys.a.pressed = false
            break
    }

    switch (event.key) {
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break
    }

    //enemy keys


    console.log(event.key)

})