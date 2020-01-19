class SceneMain extends Phaser.Scene {
  constructor() {
    super("SceneMain");
  }
  preload() {
    //load background
    this.load.image("background", "images/halloweenBackground.jpg");

    //load sounds
    //this.load.audio("door", "sounds/door.mp3");
    this.load.audio("walk", "sounds/walk.mp3");
    this.load.audio("music", "sounds/music2.mp3");

    //load our images
    this.load.spritesheet("dracula", "images/Drac-2.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("ghost", "images/ghost.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("bat", "images/bat.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("spider", "images/spider.png", {
      frameWidth: 64,
      frameHeight: 64
    });
  }
  create() {
    //display background and set its left top corner in the browser's corner
    this.add.image(0, 0, "background").setOrigin(0, 0);

    //play the sound
    this.music = this.sound.add('music');
    this.music.play();
    this.walkSound = this.sound.add('walk');

    //Listen to keys
    window.cursors = this.input.keyboard.createCursorKeys();

    //set main camera
    var camera = this.cameras.main;
    //set background color with camera
    camera.setBackgroundColor("rgba(240, 125, 255, 1)");

    //define our objects
    this.dracula = this.add.sprite(
      // game.config.width / 2,
      // game.config.height / 2,
      100,
      game.config.height - 140,
      "dracula"
    );
    this.ghost = this.add.sprite(game.config.width, 200, "ghost");
    this.bat = this.add.sprite(game.config.width, 500, "bat");
    this.spider = this.add.sprite(300, 64, "spider");

    var draculaWalk = this.anims.generateFrameNumbers("dracula"); //this generates frames from sprite sheet
    var ghostFly = this.anims.generateFrameNumbers("ghost");
    var batFly = this.anims.generateFrameNumbers("bat");
    var spiderWalk = this.anims.generateFrameNumbers("spider");

    //add this after all the sprites, tweens and backgrounds have been loaded to scale to the screen
    const thisXratio = window.innerWidth/1920;
    const thisYratio = window.innerHeight/1080;
    this.add.displayList.list.forEach(el => {
      el.scaleX = thisXratio;
      el.scaleY = thisYratio;
    })
    // this.dracula.body.setGravity(300);
    console.log(this.dracula)

    this.anims.create({
      key: "walk",
      frames: draculaWalk,
      frameRate: 10, //speed
      repeat: -1 //infinite movement
    });

    this.anims.create({
      key: "fly",
      frames: ghostFly,
      frameRate: 12, //speed
      repeat: -1 //infinite movement
    });
    this.ghost.play("fly");
    //this below creates automatic move - sprites move, change opacity etc. Other movement is in the loop
    this.tweens.add({
      targets: this.ghost,
      duration: 20000,
      x: 100,
      y: 100,
      onComplete: this.ghostFlightEnds
    });

    this.anims.create({
      key: "batFly",
      frames: batFly,
      frameRate: 8, //speed
      repeat: -1 //infinite movement
    });
    this.bat.play("batFly");

    this.anims.create({
      key: "spiderWalk",
      frames: spiderWalk,
      frameRate: 6, //speed
      repeat: -1 //infinite movement
    });
    this.spider.play("spiderWalk");

    //This makes objects interactive:
    this.dracula.setInteractive();
    this.dracula.on("pointerdown", this.draculaClicked, this); //remember 'this' at the end
  }

  //Function that fires when ghost tween is completed
  ghostFlightEnds(tween, targets, custom) {
    //to get to the character that was changed by the tween:
    let ghost = targets[0];
    // console.log(ghost.scene);
    // console.log(ghost);
    ghost.scene.add.text(ghost.x + 50, ghost.y, "Booooo!", {
      fontFamily: "Gloria Hallelujah",
      fontSize: "46px",
      color: "#ff0000"
    });

  }

  //Function that fires when dracula is clicked
  draculaClicked(e) {
    console.log(e);
    this.dracula.alpha == 1
      ? (this.dracula.alpha = 0.5)
      : (this.dracula.alpha = 1);
  }

  update() {

    if(!this.music.isPlaying) {
      this.music.play();
    }
    if (cursors.right.isDown || cursors.left.isDown) {
      if(!this.walkSound.isPlaying) {
        this.walkSound.play();
      } 
      if(cursors.right.isDown) {
          this.dracula.flipX ? this.dracula.flipX = false : null;
          this.dracula.anims.play("walk", true);
          this.dracula.x += 3;
          if (this.dracula.x >= game.config.width) {
          this.dracula.x = 0; }

        } else {
          this.dracula.flipX ? null : this.dracula.flipX = true;
          this.dracula.anims.play("walk", true);
          this.dracula.x -= 3;
          if(this.dracula.x <=0) {
            this.dracula.x = game.config.width;
          }
        }
      
      
    } else {
      this.walkSound.stop();
      this.dracula.anims.stop("walk", true);
    }

    if (cursors.space.isDown) {

    }

    if (cursors.down.isDown) {
      this.spider.y += 6;
      if (this.spider.y >= game.config.height) {
        this.spider.y = 64;
      }
    }

    if (cursors.up.isDown) {
      this.spider.y -= 6;
      if (this.spider.y <= 0) {
        this.spider.y = game.config.height;
      }
    }

    if (cursors.space.isDown) {
      this.ghost.alpha -= 0.01;
      if (this.ghost.alpha <= 0) {
        this.ghost.alpha = 1;
      }
    }

    //Make bat fly chaotically
    this.bat.x -= 2;
    this.bat.y += Math.floor(Math.random() * (2 - -2 + 1)) + -2;
    if (this.bat.x <= 0) {
      this.bat.x = game.config.width;
      this.bat.y = 500;
    }
  }
}
