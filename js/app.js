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
    img.addEventListener('load', () => {
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
    });
    img.src = obj.sprite;
  }

  static getNewRow () {
    if (gameState.rows.length === 0) {
      for (let i = 0, j = config.rows.length; i < j; i++) {
        gameState.rows.push(config.rows[i]);
      }
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

  handleInput (ev) {
    if (ev.type === 'keyup') {
      switch (ev.key) {
        case 'ArrowUp':
          this.move('up');
          break;
        case 'ArrowRight':
          this.move('right');
          break;
        case 'ArrowDown':
          this.move('down');
          break;
        case 'ArrowLeft':
          this.move('left');
          break;
        default:
          break;
      }
    }
    else if (ev.type === 'click') {
      const x = getCursorPosition(ev)[0];
      const y = getCursorPosition(ev)[1];
      const top = 383;
      const left = 100;
      if (y > top && y < top + config.tile.height) {
        if (x > left + config.tile.width && x < left + config.tile.width * 2) {
          this.move('up');
        }
      }
      else if (y > top + config.tile.height && y < top + config.tile.height * 2) {
        if (x > left && x < left + config.tile.width) {
          this.move('left');
        }
        else if (x > left + config.tile.width && x < left + config.tile.width * 2) {
          this.move('down');
        }
        else if (x > left + config.tile.width * 2 && x < left + config.tile.width * 3) {
          this.move('right');
        }
      }
    }
    function getCursorPosition (ev) {
      const rect = document.querySelector('canvas:last-of-type').getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      return [x, y];
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

  move (direction) {
    switch (direction) {
      case 'up':
        this.y -= config.tile.height;
        if (this.y < (this.origin[1] - config.tile.height * 4)) {
          this.levelUp();
        }
        break;
      case 'right':
        this.x += config.tile.width;
        if (this.x > (this.origin[0] + config.tile.width * 2)) {
          this.x -= config.tile.width;
        }
        break;
      case 'down':
        this.y += config.tile.height;
        if (this.y > this.origin[1]) {
          this.y -= config.tile.height;
        }
        break;
      case 'left':
        this.x -= config.tile.width;
        if (this.x < (this.origin[0] - config.tile.width * 2)) {
          this.x += config.tile.width;
        }
        break;
      default:
        break;
    }
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
  player.handleInput(ev);
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('canvas:last-of-type').addEventListener('click', (ev) => {
    player.handleInput(ev);
  });
});
