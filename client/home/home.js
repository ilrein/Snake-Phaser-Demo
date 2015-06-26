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

    }
  }

  game.state.add('Menu', Menu);
  game.state.add('Game', Game);

  game.state.start('Menu');

}