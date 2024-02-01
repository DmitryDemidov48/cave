// Класс Sprite представляет собой базовый объект для отображения спрайтов.
class Sprite {
    constructor({
                    position,
                    imageSrc,
                    scale = 1,
                    framesMax = 1,
                    offset = {x: 0, y: 0},
                }) {
        this.position = position; // Позиция спрайта
        this.width = 50; // Ширина спрайта
        this.height = 150; // Высота спрайта
        this.image = new Image(); // Изображение спрайта
        this.image.src = imageSrc; // Источник изображения
        this.scale = scale; // Масштаб спрайта
        this.framesMax = framesMax; // Максимальное количество кадров спрайта
        this.framesCurrent = 0; // Текущий кадр спрайта
        this.framesElapsed = 0; // Прошедшее время с момента последнего изменения кадра
        this.framesHold = 5; // Количество кадров, на которые задерживается каждый кадр
        this.offset = offset; // Смещение спрайта относительно его позиции
    }

    // Метод отображения спрайта на canvas
    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    // Метод анимации кадров спрайта
    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    // Метод обновления спрайта
    update() {
        this.draw();
        this.animateFrames();
    }
}

// Класс Fighter наследует функциональность класса Sprite и представляет собой объект бойца.
class Fighter extends Sprite {
    constructor({
                    position,
                    velocity,
                    color = 'red',
                    imageSrc,
                    scale = 1,
                    framesMax = 1,
                    offset = {x: 0, y: 0},
                    sprites,
                    attackBox = {offset: {}, width: undefined, height: undefined}
                }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });

        this.velocity = velocity; // Скорость бойца
        this.width = 50; // Ширина бойца
        this.height = 150; // Высота бойца
        this.lastKey; // Последняя нажатая клавиша
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }; // Зона атаки бойца
        this.color = color; // Цвет бойца
        this.isAttaking; // Флаг атаки бойца
        this.health = 100; // Здоровье бойца
        this.framesCurrent = 0; // Текущий кадр анимации бойца
        this.framesElapsed = 0; // Прошедшее время с момента последнего изменения кадра анимации
        this.framesHold = 5; // Количество кадров, на которые задерживается каждый кадр анимации
        this.sprites = sprites; // Спрайты для различных действий бойца
        this.dead = false; // Флаг, указывающий на то, мертв ли боец

        // Загрузка изображений спрайтов бойца
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    // Метод обновления состояния бойца
    update() {
        this.draw();
        if (!this.dead) this.animateFrames();
        // Обновление зоны атаки
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // Обновление позиции бойца
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Проверка на столкновение с землей и обработка гравитации
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {
            this.velocity.y = 0;
            this.position.y = 340;
        } else this.velocity.y += gravity;
    }

    // Метод для выполнения атаки бойца
    attack() {
        this.switchSprite('attack1');
        this.isAttaking = true;
    }

    // Метод для обработки получения удара бойцом
    takeHit() {
        this.health -= 20;

        // Если здоровье бойца меньше или равно нулю, он умирает
        if (this.health <= 0) {
            this.switchSprite('death');
        } else this.switchSprite('takeHit');
    }

    // Метод для изменения спрайта бойца
    switchSprite(sprite) {
        // Если боец мертв, нет смысла менять спрайт
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true;
            return;
        }
        // Переопределение всех других анимаций анимацией атаки
        if (this.image === this.sprites.attack1.image
            && this.framesCurrent < this.sprites.attack1.framesMax - 1)
            return;

        // Переопределение, когда боец получает удар
        if (this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1)
            return;

        // Выбор спрайта в зависимости от переданного значения
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }

    }
}
