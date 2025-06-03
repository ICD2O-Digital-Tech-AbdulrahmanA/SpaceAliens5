/* global phaser */
// Created by: abdul
// Created on: May 2025
// This is the Game scene for the game

/**
 * This class is the splash scene for the game
 */
class GameScene extends Phaser.Scene {
    
    // create an alien
    createAlien() {
        const alienXLocation = Math.floor(Math.random() * 1920) + 2
        let alienXVelocity = Math.floor(Math.random() * 50) + 2
        alienXVelocity *= Math.round(Math.random()) ? 1 : -1
        const anAlien = this.physics.add.sprite(alienXLocation, -99, 'alien')
        anAlien.body.velocity.y = 200
        anAlien.body.velocity.x = alienXVelocity
        this.alienGroup.add(anAlien)
    }

    constructor() {
        super({ key: 'gameScene' });

        this.background = null
        this.ship = null
        this.fireMissile = false
        this.isGameOver = false
        this.score = 0
        this.scoreText = null
        this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
        
        this.gameOverText = null
        this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }

        this.powerUpSpawned = false
        this.hasShield = false
    }
  
  
    init(data) {
        this.cameras.main.setBackgroundColor("AEA04B");
    }
  
    preload() {
        console.log('Game Scene');

        this.load.image('starBackground', 'assets/starBackground.png')
        this.load.image('ship', 'assets/spaceShip.png')
        this.load.image('missile', 'assets/missile.png')
        this.load.image('alien', 'assets/alien.png')
        this.load.image('powerUp', 'assets/powerUp.png')
        this.load.image('shield', 'assets/shield.png')

        // sound
        this.load.audio('laser', 'assets/laser1.wav')
        this.load.audio('explosion', 'assets/barrelExploding.wav')
        this.load.audio('bomb', 'assets/bomb.wav')
    }

    create(data) {
        this.fireMissile = false
        this.isGameOver = false
        this.score = 0
        this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
        this.background.setOrigin(0, 0)
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
        this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
        this.missileGroup = this.physics.add.group()
        this.alienGroup = this.add.group()
        this.powerUpGroup = this.physics.add.group()
        this.createAlien()
        this.shield = this.add.image(this.ship.x, this.ship.y, 'shield').setScale(0.12)
        this.shield.setVisible(false)
        this.physics.add.overlap(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
            alienCollide.destroy()
            missileCollide.destroy()
            this.score = this.score + 1
            this.scoreText.setText('Score: ' + this.score.toString())
            this.sound.play('explosion')
            if (this.score === 15 || this.score === 30 || this.score === 45 || this.score === 60 && !this.powerUpSpawned) {
                const powerUp = this.physics.add.sprite(
                    Phaser.Math.Between(100, 1820),
                    Phaser.Math.Between(100, 900),
                    'powerUp'
                )
                this.powerUpGroup.add(powerUp)
                this.powerUpSpawned = true
            }
            this.createAlien()
            this.createAlien()
        }.bind(this))

        
    
        this.physics.add.collider(this.ship, this.alienGroup, function (shipCollide, alienCollide) {
            if (this.hasShield) {
                alienCollide.destroy()
                this.shield.setVisible(false)
                this.hasShield = false
                return
            }
            this.sound.play('bomb')
            this.physics.pause()
            alienCollide.destroy()
            shipCollide.destroy()
            this.isGameOver = true
            this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
            this.gameOverText.setInteractive({ useHandCursor: true })
            this.gameOverText.on('pointerdown', () => this.scene.start('gameScene'))
        }.bind(this))

            this.physics.add.overlap(this.ship, this.powerUpGroup, this.collectPowerUp, null, this)
        }

        collectPowerUp(ship, powerUp) {
            powerUp.destroy()
            console.log('Power-up collected! Shield activated.')

            this.shield.setVisible(true)
            this.hasShield = true
        }


    

    update(time, delta) {
        if (this.isGameOver) {
            return
        }

        const keyLeftObj = this.input.keyboard.addKey('LEFT')
        const keyRightObj = this.input.keyboard.addKey('RIGHT')
        const keyUpObj = this.input.keyboard.addKey('UP')
        const keyDownObj = this.input.keyboard.addKey('DOWN')
        const keySpaceObj = this.input.keyboard.addKey('SPACE')


        if (keyUpObj.isDown === true) {
            this.ship.y -= 15
            if (this.ship.y < 0) {
                this.ship.y = 1080
            }
        }



        if (keyDownObj.isDown === true) {
            this.ship.y += 15
            if (this.ship.y > 1080) {
                this.ship.y = 0
            }
        }


        if (keyLeftObj.isDown === true) {
            this.ship.x -= 15
            if (this.ship.x < 0) {
                this.ship.x = 1920
            }
        }
            
        if (keyRightObj.isDown === true) {
            this.ship.x += 15
            if (this.ship.x > 1920) {
                this.ship.x = 0
            }
        }

        if (keySpaceObj.isDown === true && !this.isGameOver) {
            if (this.fireMissile === false) {
                this.fireMissile = true
                const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
                this.missileGroup.add(aNewMissile)
                this.sound.play('laser')
            }
        }

        if (keySpaceObj.isUp === true) {
            this.fireMissile = false
        }

        this.missileGroup.children.each(function (item) {
            item.y = item.y - 15
            if (item.y < 0) {
                item.destroy()
            }
        })

        if (this.shield.visible) {
            this.shield.x = this.ship.x
            this.shield.y = this.ship.y
        }

        this.alienGroup.getChildren().forEach(function (alien) {
            if (alien.y > 1080) {
                this.alien.y = 0
            }
        })
    }
}

    export default GameScene
