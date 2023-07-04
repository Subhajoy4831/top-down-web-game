class Sprite{
    constructor({
        position,
        img,
        frames = {max: 1, hold: 10}, 
        sprites, 
        animate = false, 
        rotation = 0,
    }){
        this.position = position
        this.img = new Image()
        this.frames = {...frames,val: 0, elapsed: 0}
        this.sprites = sprites
        
        this.img.onload = () => {
            this.width = this.img.width/this.frames.max
            this.height = this.img.height
        }
        this.img.src = img.src
        this.animate = animate
        this.opacity = 1
        this.rotation = rotation
    }
    draw(){
        con.save()
        con.translate(this.position.x + this.width/2,this.position.y+this.height/2)
        con.rotate(this.rotation)
        con.translate(-this.position.x - this.width/2,-this.position.y - this.height/2)

        con.globalAlpha = this.opacity
        con.drawImage(
            this.img,
            this.frames.val * this.width,
            0,
            this.img.width/this.frames.max,
            this.img.height, 
            this.position.x,
            this.position.y,
            this.img.width/this.frames.max,
            this.img.height
        )
        con.restore()
        if(!this.animate) return

        if(this.frames.max>1)
            this.frames.elapsed++

        if(this.frames.elapsed % this.frames.hold == 0)    
            if(this.frames.val<this.frames.max -1)
                this.frames.val++
            else 
                this.frames.val = 0
    }
    
}

class Monster extends Sprite{
    constructor({
        position,
        img,
        frames = {max: 1, hold: 10}, 
        sprites, 
        animate = false, 
        rotation = 0,
        isEnemy = false,
        name,
        attacks
    }){
        super({
            position,
            img,
            frames, 
            sprites, 
            animate, 
            rotation
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }
    
    faint(){
        document.querySelector('#dialogueBox').innerHTML = this.name + ' has fainted! '
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this,{
            opacity : 0
        })
        audio.battle.stop()
        audio.victory.play()
    }
    
    attack({attack,recipient,renderedSprites}){
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + attack.name

        let healthbar = '#enemyHealthbar'
        if(this.isEnemy) healthbar = '#playerHealthbar'

        let rotation = 1
        if(this.isEnemy) rotation=-2.2
        
        if((recipient.health-attack.damage)<0)
            recipient.health = 0
        else
            recipient.health -= attack.damage
        
        switch(attack.name){
            case 'Fireball':
                audio.initFireball.play()
                const fireballImage = new Image()
                fireballImage.src = './Image/fireball.png'
                const fireball = new Sprite({
                    position:{
                        x: this.position.x,
                        y: this.position.y
                    },
                    img: fireballImage,
                    frames:{
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })
                renderedSprites.splice(1,0,fireball)

                gsap.to(fireball.position,{
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        audio.fireballHit.play()
                        gsap.to(healthbar,{
                            width: recipient.health + '%'
                        })
                    
                        gsap.to(recipient.position,{
                            x: recipient.position.x+20,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        })
                        gsap.to(recipient,{
                        opacity: 0,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08
                        })
                        renderedSprites.splice(1,1)
                    }
                })
            break;
            
            case 'Tackle':
                const tl = gsap.timeline()

                let movementDistance = 20
                if(this.isEnemy) movementDistance = -20 
        
                tl.to(this.position,{
                x: this.position.x - movementDistance
                }).to(this.position,{
                x: this.position.x + movementDistance*2,
                duration: 0.1,
                onComplete: () => {
                
                    //enemy gets hit
                    audio.tackleHit.play()
                    gsap.to(healthbar,{
                        width: recipient.health + '%'
                    })
                
                    gsap.to(recipient.position,{
                        x: recipient.position.x+20,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08,
                    })
                    gsap.to(recipient,{
                    opacity: 0,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08
                    })
                }
            }).to(this.position,{
                x: this.position.x
            })
            break;

            
        }
    }
}

class Boundary{
    static width = 48
    static height = 48
    constructor({position}){
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw(){
        con.fillStyle = 'rgba(255,0,0,0)'
        con.fillRect(this.position.x,this.position.y, this.width, this.height)
    }
}