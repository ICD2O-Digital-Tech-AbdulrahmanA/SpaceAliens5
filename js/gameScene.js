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
        // Only create if below max
        if (this.currentAlienCount >= 25) {
            return
        }
        
        const alienXLocation = Math.floor(Math.random() * 1920) + 2
        let alienXVelocity = Math.floor(Math.random() * 50) + 2
        alienXVelocity *= Math.round(Math.random()) ? 1 : -1
        const anAlien = this.physics.add.sprite(alienXLocation, -99, 'alien')
        anAlien.body.velocity.y = 200
        anAlien.body.velocity.x = alienXVelocity
        this.alienGroup.add(anAlien)
        this.currentAlienCount++ // Increment counter
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
        this.powerUp2Spawned = false
        this.hasShield = false
        this.hasMissileBuff = false
        this.currentAlienCount = 0  // Add this line
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
        this.load.image('explosion', 'assets/explosion.png') // Add this line
        this.load.image('powerUp', 'assets/powerUp.png')
        this.load.image('powerUp2', 'assets/powerUp2.png')
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
        this.powerUp2Group = this.physics.add.group()
        this.createAlien()
        this.shield = this.add.image(this.ship.x, this.ship.y, 'shield').setScale(0.12)
        this.shield.setVisible(false)
        this.physics.add.overlap(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
            // Create explosion at alien's position
            const explosion = this.add.sprite(alienCollide.x, alienCollide.y, 'explosion')
            
            // Remove explosion after 200ms
            this.time.delayedCall(200, function() {
                explosion.destroy()
            }, [], this)
            
            alienCollide.destroy()
            this.currentAlienCount--
            missileCollide.destroy()
            this.score = this.score + 1
            this.scoreText.setText('Score: ' + this.score.toString())
            this.sound.play('explosion')
            if (this.score === 15 || this.score === 30 || this.score === 45 || this.score === 60 || this.score === 75 || this.score === 90 || this.score === 105 && !this.powerUpSpawned) {
                const powerUp = this.physics.add.sprite(
                    Phaser.Math.Between(100, 1820),
                    Phaser.Math.Between(100, 900),
                    'powerUp'
                )
                this.powerUpGroup.add(powerUp)
                this.powerUpSpawned = true
            }
            if (this.score === 50 && !this.powerUp2Spawned) {
                const powerUp2 = this.physics.add.sprite(
                    Phaser.Math.Between(100, 1820),
                    Phaser.Math.Between(100, 900),
                    'powerUp2'
                ).setScale(0.5) // Makes the powerUp2 half size
                this.powerUp2Group.add(powerUp2)
                this.powerUp2Spawned = true
            }
            this.createAlien()
            this.createAlien()
        }.bind(this))

    
        this.physics.add.collider(this.ship, this.alienGroup, function (shipCollide, alienCollide) {
            if (this.hasShield) {
                // Create explosion at alien's position
                const explosion = this.add.sprite(alienCollide.x, alienCollide.y, 'explosion')
                
                // Remove explosion after 200ms
                this.time.delayedCall(200, function() {
                    explosion.destroy()
                }, [], this)
                
                alienCollide.destroy()
                this.currentAlienCount--
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
        this.physics.add.overlap(this.ship, this.powerUp2Group, this.collectPowerUp2, null, this)
        

        }

        collectPowerUp(ship, powerUp) {
            powerUp.destroy()
            console.log('Power-up collected! Shield activated.')

            this.shield.setVisible(true)
            this.hasShield = true
        }

        collectPowerUp2(ship, powerUp2) {
            powerUp2.destroy()
            console.log('Power-up 2 collected! Permanent missile buff activated!')
            this.hasMissileBuff = true
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
                if (this.hasMissileBuff) {
                    aNewMissile.setScale(4.0) // Makes missiles 4x bigger instead of 2x
                }
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

        this.alienGroup.children.each(function (alien) {
            if (alien.y > 1080) {
                alien.y = 0
            }
        }, this)

    }
}

    export default GameScene
