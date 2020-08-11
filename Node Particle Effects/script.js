const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//CONFIG
let particleSpeed = 2; //Base Multiplier
let hideParticles = false;
let particleMagnetizationSpeed = 5; //40+ Auto Snapping
let maximumParticleSize = 3;
let minimimParticleSize = 2;
let nodeWidth = 1;
let particleColor = '#232323';
let particleMultiplier = 13000; //The lesser the value, the more particles. CAUTION CAN CAUSE LAG if lower than 5000 
//Detault 15000, higher values are safer



//How short does the node lines be?
///The smaller the longer
let nodeConnectionLength = 2;
let nodeColor = 'rgba(23,23,23,';

//Enable Mouse Reaction?
let enableMouseInteraction = true;
//React on Mouse Move (True) or on Mouse Click (False)
let reactOnMouseMove = true;

//Repel the particles (True) or Attract (False)
let mouseRepel = false;

//How far will the particle be affected?
///The lower the stronger the effect
let mouseReactionDistance = 120;

//Stop the particles from moving
let isStill = false;
let stopOnMouseEnter = false;

let particlesArray;

//Mouse-related variables
let mouse = {
    x: null,
    y: null,
    radius:(canvas.height/-mouseReactionDistance) * (canvas.width/-mouseReactionDistance)
}

if(reactOnMouseMove){
window.addEventListener('mousemove',
 function(event){
     mouse.x = event.x;
     mouse.y = event.y;
     if(stopOnMouseEnter)
     isStill = true;
 }
);
}else{
window.addEventListener('click',
 function(event){
     mouse.x = event.x;
     mouse.y = event.y;
 }
);
}

//Create Particle object
class Particle {
    constructor(x,y,directionX,directionY,size,color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.magnetized = true;
    }
    //Method to draw indivitual particles
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size, 0, Math.PI *2,false);
        if(hideParticles){
            ctx.fillStyle = backgroundColor;
        }
        ctx.fill();
        //ctx.fillStyle = backgroundColor;
        //ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    //Check particle position, check mouse position, move the particle, draw the particle
    update(){
        //Check if patticle is still within canvas.
        if(this.x > canvas.width || this.x <0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y <0){
            this.directionY = -this.directionY;
        }
        //Check Collision Detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let distance = Math.sqrt(dx*dx + dy*dy);
        if(enableMouseInteraction){
                if(mouseRepel){
                    if(distance < mouse.radius + this.size){
                        if(mouse.x < this.x && this.x <canvas.width - this.size * 10){
                            this.x += particleMagnetizationSpeed;
                        }
                         if(mouse.x > this.x && this.x > this.size * 10){
                            this.x -= particleMagnetizationSpeed;
                        }
                         if(mouse.y < this.y && this.y <canvas.height - this.size *10){
                            this.y += particleMagnetizationSpeed;
                        }
                         if(mouse.y > this.y && this.y > this.size * 10){
                            this.y -= particleMagnetizationSpeed;
                        }
                    }
                }else{
                    if(distance < mouse.radius + this.size){
                        if(mouse.x < this.x && this.x <canvas.width - this.size * 10){
                            this.x -= particleMagnetizationSpeed;
                        }
                         if(mouse.x > this.x && this.x > this.size * 10){
                            this.x += particleMagnetizationSpeed;
                        }
                         if(mouse.y < this.y && this.y <canvas.height - this.size *10){
                            this.y -= particleMagnetizationSpeed;
                        }
                         if(mouse.y > this.y && this.y > this.size * 10){
                            this.y += particleMagnetizationSpeed;
                        }
                    }
                }
        }
        //Move Particle
        if(!isStill){
        this.x += this.directionX;
        this.y += this.directionY;
        }
        //Draw the particle
        this.draw();
    }
}
function init(){
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / particleMultiplier;//9000 will automatically adapt to canvas size
    for(let i=0; i <numberOfParticles; i++){
        let size = (Math.random() * maximumParticleSize) + minimimParticleSize;
        let x = (Math.random()* ((innerWidth - size *2) - (size * 2)) + size * 2);
        let y = (Math.random()* ((innerHeight - size *2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * particleSpeed) - 2.5;
        let directionY = (Math.random() * particleSpeed) - 2.5;
        let color = particleColor//'#8C5523';
        particlesArray.push(new Particle(x,y,directionX,directionY,size, color));
    }
}

//Animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);

    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }
    connect();
}
window.addEventListener('resize', function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.height/mouseReactionDistance) * (canvas.height/mouseReactionDistance);
    init();
}
);
function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particlesArray.length; a++){
        for (let b = a; b < particlesArray.length;b++){
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if(distance < (canvas.width/nodeConnectionLength) * (canvas.height/nodeConnectionLength)){
                opacityValue = 1 - (distance/10000);
                ctx.strokeStyle = nodeColor +opacityValue+')';//'rgba(140,85,31,1)';
                ctx.lineWidth = nodeWidth;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x,particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x,particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('mouseout',
function(){
    mouse.x = undefined;
    mouse.y = undefined;
    if(stopOnMouseEnter)
    isStill = false;
});

init();
animate();