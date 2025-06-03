/* global phaser */
// Created by: abdul
// Created on: May 2025
// This is the Menu scene for the game

/**
 * This class is the splash scene for the game
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuScene' })

        this.menuSceneBackgroundImage = null
        this.startButton = null
    }
  
  
    init (data) {
    this.cameras.main.setBackgroundColor("AEA04B");
    }
  
    preload() {
        console.log('Menu Scene');
        this.load.image('menuSceneBackground', './assets/aliens_screen_image2.jpg');
        this.load.image('startButton', './assets/start.png')
    }
  
    create(data) {
      this.menuSceneBackgroundImage = this.add.sprite(0, 0, 'menuSceneBackground')
      this.menuSceneBackgroundImage.x = 1920 / 2
      this.menuSceneBackgroundImage.y = 1080 / 2
        
      this.startButton = this.add.sprite(1920 / 2, (1080 / 2) + 100, 'startButton')
        this.startButton.setInteractive({ useHandCursor: true })
        this.startButton.on('pointerdown', () => this.clickButton())
    }
  
    update(time, delta) {
    }
    clickButton() {
        this.scene.start('gameScene')
    }
}

    export default MenuScene
    