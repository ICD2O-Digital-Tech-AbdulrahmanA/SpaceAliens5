/* global phaser */
// Created by: abdul
// Created on: May 2025
// This is the Menu scene for the game

/**
 * this class represents the menu scene where players can start the game
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuScene' })

        // initialize background and button variables
        this.menuSceneBackgroundImage = null
        this.startButton = null
    }
  
    init (data) {
        // set the initial background color for the menu
        this.cameras.main.setBackgroundColor("AEA04B");
    }
  
    preload() {
        // log scene entry and load required menu assets
        console.log('Menu Scene');
        this.load.image('menuSceneBackground', './assets/aliens_screen_image2.jpg');
        this.load.image('startButton', './assets/start.png')
    }
  
    create(data) {
        // add and position the background image at screen center
        this.menuSceneBackgroundImage = this.add.sprite(0, 0, 'menuSceneBackground')
        this.menuSceneBackgroundImage.x = 1920 / 2
        this.menuSceneBackgroundImage.y = 1080 / 2
        
        // create and setup interactive start button
        this.startButton = this.add.sprite(1920 / 2, (1080 / 2) + 100, 'startButton')
        this.startButton.setInteractive({ useHandCursor: true })
        this.startButton.on('pointerdown', () => this.clickButton())
    }
  
    update(time, delta) {
        // update loop - currently empty but available for future features
    }

    clickButton() {
        // transition to the game scene when start button is clicked
        this.scene.start('gameScene')
    }
}

export default MenuScene
