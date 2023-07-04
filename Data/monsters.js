const emberImage = new Image()
emberImage.src = './Image/embySprite.png'

const drobImage = new Image()
drobImage.src = './Image/draggleSprite.png'

const monsters = {
    Ember: {
        position: {
            x: 280,
            y: 325
        },
        img: {
            src: './Image/embySprite.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Ember',
        attacks: [attacks.Tackle,attacks.Fireball]
    },
    Drob: {
        position: {
            x: 800,
            y: 100
        },
        img: {
            src: './Image/draggleSprite.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Drob',
        attacks: [attacks.Tackle,attacks.Fireball]
    }
}