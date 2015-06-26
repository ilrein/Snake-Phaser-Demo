Template.home.onRendered(function(){
  Meteor.setTimeout(function(){
    startGame();
  }, 0);
});

function startGame() {

  // initialize the game

  var game;
  game = new Phaser.Game(600, 450, Phaser.AUTO, '#game');

  // define the opening menu

  var Menu = {

    // preload the menu

    preload: function() {
      game.load.image('menu', '/images/menu.png');
    },

    // add the menu to the screen as a button

    create: function() {
      this.add.button(0, 0, 'menu', this.startGame, this);
    },

    // start the game (callback function)

    startGame: function() {
      this.state.start('Game');
    }
  }

  var snake, apple, squareSize, score, speed,
      updateDelay, direction, newDirection,
      addNew, cursors, scoreTextValue, speedTextValue,
      textStyleKey, textStyleValue;

  var Game = {
    preload: function() {
      game.load.image('snake', '/images/snake.png');
      game.load.image('apple', '/images/apple.png');
    },
    create: function() {
      snake = [];
      apple = {};
      squareSize = 15;
      score = 0;
      speed = 0;
      updateDelay = 0;
      direction = 'right';
      newDirection = null;
      addNew = false;

      // keyboard input
      cursors = game.input.keyboard.createCursorKeys();

      game.stage.backgroundColor = '#061f27';

      // create the snake
      for (var i = 0; i < 4; i++) {
        snake[i] = game.add.sprite(300 + i * squareSize - (15 * 4), 225, 'snake');
      };

      // make an apple
      this.generateApple();

      // add some text to the top of the game
      textStyleKey = { font: 'bold 14px sans-serif', fill: "#46c0f9", align: "center" };
      textStyleValue = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

      // current score
      game.add.text(30, 20, "SCORE", textStyleKey);
      scoreTextValue = game.add.text(90, 18, score.toString(), textStyleValue);

      // current speed
      game.add.text(500, 20, "SPEED", textStyleKey);
      speedTextValue = game.add.text(558, 18, speed.toString(), textStyleValue);
    },

    update: function() {
      // handle arrow keys
      if (cursors.right.isDown && direction != 'left') {
        newDirection = 'right';
      } else if (cursors.left.isDown && direction != "right") {
        newDirection = 'left';
      } else if (cursors.up.isDown && direction != "down") {
        newDirection = "up"
      } else if (cursors.down.isDown && direction != "up") {
        newDirection = "down"
      };

      // calculate game speed based on the score
      speed = Math.min(10, Math.floor(score/5));
      speedTextValue.text = speed.toString();

      // compensate for 60fps
      updateDelay++;

      if (updateDelay % (10 - speed) == 0) {
        var firstCell = snake[snake.length - 1],
            lastCell = snake.shift();
            oldLastCellx = lastCell.x,
            oldLastCelly = lastCell.y;
        if (newDirection) {
          direction = newDirection;
          newDirection = null;
        }

        // movement code

        if (direction == 'right') {
          lastCell.x = firstCell.x + 15;
          lastCell.y = firstCell.y;
        }
        else if (direction == 'left') {
          lastCell.x = firstCell.x - 15;
          lastCell.y = firstCell.y;
        }
        else if (direction == 'up') {
          lastCell.x = firstCell.x;
          lastCell.y = firstCell.y - 15;
        }
        else if (direction == 'down') {
          lastCell.x = firstCell.x;
          lastCell.y = firstCell.y + 15;
        }

        // Place the last cell in the front of the stack.
        // Mark it the first cell.
        snake.push(lastCell);
        firstCell = lastCell;

        // eat an apple
        if (addNew) {
          snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
          addNew = false;
        }

        // check for apple collision
        this.appleCollision();
        this.selfCollision(firstCell);
        this.wallCollision(firstCell);
      }
    },

    generateApple: function() {
      // choose a random spot on the grid
      var randomX = Math.floor(Math.random() * 40 ) * squareSize,
      randomY = Math.floor(Math.random() * 30 ) * squareSize;

      // Add a new apple.
      apple = game.add.sprite(randomX, randomY, 'apple');
    },

    appleCollision: function() {
      for (var i = 0; i < snake.length; i++) {
        if (snake[i].x == apple.x && snake[i].y == apple.y) {
          addNew = true;
          apple.destroy();
          this.generateApple();
          score++;
          scoreTextValue.text = score.toString();
        }
      };
    },

    selfCollision: function(head) {
      for (var i = 0; i < snake.length - 1; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y){
          game.state.start('Game_Over');
      }
    };
  },

    wallCollision: function(head) {
      if (head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0) {
        game.state.start('Game_Over');
      }
    }
  };

  var Game_Over = {
    preload: function() {
      game.load.image('gameover', '/images/gameover.png');
    },
    create: function() {
      this.add.button(0, 0, 'gameover', this.startGame, this);
      // some text for start over
      game.add.text(235, 350, "LAST SCORE", { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center"});
      game.add.text(350, 348, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });
    },
    startGame: function() {
      this.state.start('Game')
    }
  };

  game.state.add('Menu', Menu);
  game.state.add('Game', Game);
  game.state.add('Game_Over', Game_Over);

  game.state.start('Menu');

}