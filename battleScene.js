const battleBackgroundImage = new Image()
battleBackgroundImage.src = './Image/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    img: battleBackgroundImage
})


let drob
let ember
let renderedSprites
let queue

let battleAnimationId

function initBattle(){
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthbar').style.width = '100%'
    document.querySelector('#playerHealthbar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()
 
    drob = new Monster(monsters.Drob)
    ember = new Monster(monsters.Ember)
    renderedSprites = [drob,ember]
    queue = []

    ember.attacks.forEach(attack => {
        const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
    })
    
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click',(e) => {
            
            //player attack
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            ember.attack({
                attack: selectedAttack,
                recipient: drob,
                renderedSprites
            })
            
            //enemy faints
            if(drob.health<=0){
                queue.push(() => {
                    drob.faint()
                })
                queue.push(() => {
                    gsap.to('#overlappingDiv',{
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            
                            gsap.to('#overlappingDiv',{
                                opacity: 0
                            })
                            battle.initiated = false
                            audio.victory.stop()
                            audio.Map.play()
                        }
                    })
                })
            }
            
            //enemy attack
            const randomAttack = drob.attacks[Math.floor(Math.random()*drob.attacks.length)]
            queue.push(()=>{
                drob.attack({
                    attack: randomAttack,
                    recipient: ember,
                    renderedSprites
                })

                //player faints
                if(ember.health<=0){
                    queue.push(() => {
                        ember.faint()
                    })
                    queue.push(() => {
                        gsap.to('#overlappingDiv',{
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#userInterface').style.display = 'none'
                                
                                gsap.to('#overlappingDiv',{
                                    opacity: 0
                                })

                                battle.initiated = false
                                audio.victory.stop()
                                audio.Map.play()
                            }
                        })
                    })
                }
            })
        })
        button.addEventListener('mouseenter',(e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.Type
            document.querySelector('#attackType').style.color = selectedAttack.color
    
        })
    });
}

function animateBattle(){
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach(sprite => {
        sprite.draw()
    })
}

animate()
//initBattle()
//animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e)=>{
    if(queue.length>0){
        queue[0]()
        queue.shift()
    }
    else
        e.currentTarget.style.display = 'none'
})