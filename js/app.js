// Initialization values for each character
const config = {
  enemy: [
    [0, 60, 100], // x, y, speed
    [0, 144, 100],
    [0, 227, 100]
  ],
  player: [202, 405] // x, y
};

class Character {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  // For image dimensions; likely needs to be edited
  static genDimensions (obj) {
    let img = new Image();
    img.onload = () => {
      obj.height = img.height;
      obj.width = img.width;
      console.log((obj.sprite === 'images/enemy-bug.png' ? 'enemy' : 'player') + ' x:' + obj.x + ' y:' + obj.y + ' height:' + obj.height + ' width:' + obj.width);
    };
    img.src = obj.sprite;
  }

  render () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Enemy extends Character {
  constructor (x, y, speed) {
    super(x, y);
    this.speed = speed || 0;
    this.sprite = 'images/enemy-bug.png';
    Character.genDimensions(this);
  }

  // Might need to be tweaked
  collision (obj) {
    if (this.x < obj.x + obj.width
      && this.x + this.width > obj.x
      && this.y < obj.y + obj.height
      && this.y + this.height > obj.y) {
      console.log('collision detected!');
    }
  }

  update (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.collision(player);
  }
}

class Player extends Character {
  constructor (x, y) {
    super(x, y);
    this.sprite = 'images/char-boy.png';
    Character.genDimensions(this);
  }

  handleInput (key) {
    const allowedKeys = [
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'ArrowLeft'
    ];

    if (allowedKeys.includes(key)) {
      switch (key) {
        case 'ArrowUp':
          console.log('up');
          break;
        case 'ArrowRight':
          console.log('right');
          break;
        case 'ArrowDown':
          console.log('down');
          break;
        case 'ArrowLeft':
          console.log('left');
          break;
        default:
          break;
      }
    }
  }

  update () {}
}

const allEnemies = [];
for (let i = 0; i < 3; i ++) {
  const enemy = new Enemy(config.enemy[i][0], config.enemy[i][1], config.enemy[i][2]);
  allEnemies.push(enemy);
}
const player = new Player(config.player[0], config.player[1]);

document.addEventListener('keyup', (ev) => {
  player.handleInput(ev.key);
});
