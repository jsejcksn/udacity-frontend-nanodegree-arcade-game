// Initialization values
const config = {
  canvas: {
    height: 606,
    width: 505
  },
  enemies: {
    speed: {
      min: 100,
      max: 300
    }
  },
  player: {
    origin: [251.5, 511]
  },
  rows: [176.5, 259.5, 342.5],
  tile: {
    height: 83,
    width: 101
  }
};

const gameState = {
  rows: [176.5, 259.5, 342.5]
};

class Character {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static genDimensions (obj, isEnemy) {
    let img = new Image();
    img.onload = () => {
      obj.height = img.height;
      obj.width = img.width;
      // console.log((obj.sprite === 'images/enemy-bug.png' ? 'enemy' : 'player') + ' x:' + obj.x + ' y:' + obj.y + ' height:' + obj.height + ' width:' + obj.width);
      if (isEnemy) {
        obj.origin = [obj.x - obj.width];
      }
      else {
        obj.origin = [obj.x - obj.width / 2];
      }
      obj.origin.push(obj.y - obj.height / 2);
      obj.x = obj.origin[0];
      obj.y = obj.origin[1];
    };
    img.src = obj.sprite;
  }

  static getNewRow () {
    if (gameState.rows.length === 0) {
      gameState.rows = config.rows;
    }
    const length = gameState.rows.length;
    return gameState.rows.splice(
      this.getRandomInt(length - 1),
      1
    )[0];
  }

  static getRandomInt (max, min) {
    return Math.floor(Math.random() * (max - (min || 0) + 1)) + (min || 0);
  }

  render () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Enemy extends Character {
  constructor (x, y, speed, sprite) {
    super(x, y);
    this.speed = speed || 0;
    this.sprite = sprite || 'images/enemy-bug.png';
    Character.genDimensions(this, true);
  }

  // Might need to be tweaked
  checkCollision (obj) {
    if (this.x < obj.x + obj.width
      && this.x + this.width > obj.x
      && this.y < obj.y + obj.height
      && this.y + this.height > obj.y) {
      obj.resetPosition();
    }
  }

  move (dt) {
    this.x += this.speed * dt;
    if (this.x > config.canvas.width + this.speed * dt) {
      this.x = this.origin[0];
    }
  }

  update (dt) {
    this.move(dt);
    this.checkCollision(player);
  }
}

class Player extends Character {
  constructor (x, y, sprite) {
    super(x, y);
    this.sprite = sprite || 'images/char-boy.png';
    Character.genDimensions(this);
  }

  handleInput (key) {
    switch (key) {
      case 'ArrowUp':
        this.y -= config.tile.height;
        if (this.y < (this.origin[1] - config.tile.height * 4)) {
          this.levelUp();
        }
        break;
      case 'ArrowRight':
        this.x += config.tile.width;
        if (this.x > (this.origin[0] + config.tile.width * 2)) {
          this.x -= config.tile.width;
        }
        break;
      case 'ArrowDown':
        this.y += config.tile.height;
        if (this.y > this.origin[1]) {
          this.y -= config.tile.height;
        }
        break;
      case 'ArrowLeft':
        this.x -= config.tile.width;
        if (this.x < (this.origin[0] - config.tile.width * 2)) {
          this.x += config.tile.width;
        }
        break;
      default:
        break;
    }
  }

  levelUp () {
    let level = document.querySelector('.level > span:last-of-type');
    level.textContent = parseInt(level.textContent, 10) + 1;
    allEnemies.forEach((enemy) => {
      enemy.speed *= 1.1;
    });
    allEnemies.push(new Enemy(
      0,
      Character.getNewRow(),
      Character.getRandomInt(config.enemies.speed.max, config.enemies.speed.min)
    ));
    this.resetPosition();
  }

  resetPosition () {
    this.x = this.origin[0];
    this.y = this.origin[1];
  }

  update () {}
}

const allEnemies = [];
for (let i = 0; i < 3; i ++) {
  allEnemies.push(new Enemy(
    0,
    config.rows[i],
    Character.getRandomInt(config.enemies.speed.max, config.enemies.speed.min)
  ));
}
const player = new Player(config.player.origin[0], config.player.origin[1]);

document.addEventListener('keyup', (ev) => {
  player.handleInput(ev.key);
});
