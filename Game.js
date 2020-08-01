// SELECT CVS

const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// VARIABLES AND CONSTANS

var frames = 0;
const DEGREE = Math.PI/180;

// GAME STATE

const state = {
    current : 0,
    GetReady : 0,
    game : 1,
    over : 2
}

// START BUTTON

const StartButton = {
    x : 120,
    y : 263,
    w : 83,
    h : 29
}

// LOADING image IMAGE

const image = new Image();
image.src = "image/1.png";

// LOADING SOUNDS
const Score_Sound = new Audio();
Score_Sound.src = "audios/sfx_point.wav";

const flap = new Audio();
flap.src = "audios/sfx_flap.wav";

const hit = new Audio();
hit.src = "audios/sfx_hit.wav";

const swooshing = new Audio();
swooshing.src = "audios/sfx_swooshing.wav";

const die = new Audio();
die.src = "audios/sfx_die.wav";




// CONTROLLING GAME

cvs.addEventListener("click", function(evt){

switch(state.current){

case state.GetReady:
state.current = state.game;

swooshing.play();

break;

case state.game:
if(bird.y - bird.radius <= 0) return;

bird.flap();
flap.play();

break;

case state.over:
var rect = cvs.getBoundingClientRect();
var clickX = evt.clientX - rect.left;
var clickY = evt.clientY - rect.top;
            
// CHECKING IF START BUTTON IS CLICKED

if(clickX >= StartButton.x && clickX <= StartButton.x + StartButton.w && clickY >= StartButton.y && clickY <= StartButton.y + StartButton.h){

pipes.reset();

bird.speedReset();
score.reset();
state.current = state.GetReady;
            }

            break;
    }
});



// FOREGROUND

const fg = {
    SourceImageX: 276,
    SourceImageY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,
    
    dx : 2,
    
    draw : function(){
        ctx.drawImage(image, this.SourceImageX, this.SourceImageY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(image, this.SourceImageX, this.SourceImageY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    
    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

// BACKGROUND

const bg = {
    
    SourceImageX : 0,
    SourceImageY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,
    
    draw : function(){
        ctx.drawImage(image, this.SourceImageX, this.SourceImageY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(image, this.SourceImageX, this.SourceImageY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
    
}



// GET READY MESSAGE ON THE SCREEN

const GetReady = {
    SourceImageX : 0,
    SourceImageY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : 80,
    
    draw: function(){
        if(state.current == state.GetReady){
            ctx.drawImage(image, this.SourceImageX, this.SourceImageY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

// GAME OVER MESSAGE ON THE SCREEN

const gameOver = {
    SourceImageX : 175,
    SourceImageY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,
    
    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(image, this.SourceImageX, this.SourceImageY, this.w, this.h, this.x, this.y, this.w, this.h);   
        }
    }
    
}

// BIRD
const bird = {

    animation : [
        {SourceImageX: 276, SourceImageY : 112},
        {SourceImageX: 276, SourceImageY : 139},
        {SourceImageX: 276, SourceImageY : 164},
        {SourceImageX: 276, SourceImageY : 139}
    ],


    x : 50,
    y : 150,
    w : 34,
    h : 26,
    
    radius : 12,
    
    frame : 0,
    
    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,
    
    draw : function(){
        var bird = this.animation[this.frame];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(image, bird.SourceImageX, bird.SourceImageY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);
        
        ctx.restore();
    },
    
    flap : function(){
        this.speed = - this.jump;
    },
    
    update: function(){
        // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLap SLOWLY
        this.period = state.current == state.GetReady ? 10 : 5;

        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;

        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;
        
        if(state.current == state.GetReady){

            // RESETTING THE POSITION OF THE BIRD AFTER GAME OVER
            this.y = 150; 
            this.rotation = 0 * DEGREE;


        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    die.play();
                }
            }
            
            // IF THE SPEED IS MORE THAN THE SPEED OF JUMP, IT MEANS THE BIRD IS FALLING DOWN
            
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }
        
    },

    speedReset : function(){
        this.speed = 0;
    }
}

// PIPES 

const pipes = {
    position : [],
    
    top : {
        SourceImageX : 553,
        SourceImageY : 0
    },
    bottom:{
        SourceImageX : 502,
        SourceImageY : 0
    },
    
    w : 53,
    h : 400,
    gap : 85,
    MaxYPosition : -150,
    dx : 2,
    
    draw : function(){
        for(var i  = 0; i < this.position.length; i++){
            var p = this.position[i];
            
            var TopYPosition = p.y;
            var BottonYposition = p.y + this.h + this.gap;
            
            // top pipe
            ctx.drawImage(image, this.top.SourceImageX, this.top.SourceImageY, this.w, this.h, p.x, TopYPosition, this.w, this.h);  
            
            // bottom pipe
            ctx.drawImage(image, this.bottom.SourceImageX, this.bottom.SourceImageY, this.w, this.h, p.x, BottonYposition, this.w, this.h);  
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x : cvs.width,
                y : this.MaxYPosition * ( Math.random() + 1)
            });
        }
        for(var i = 0; i < this.position.length; i++){
            var p = this.position[i];
            
            var BottomPipeYposition = p.y + this.h + this.gap;
            
            // DETECTION OF COLLISION

            // TOP PIPE
            
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                hit.play();
            }


            // BOTTOM PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > BottomPipeYposition && bird.y - bird.radius < BottomPipeYposition + this.h){
                state.current = state.over;
                hit.play();
            }
            
            // MOVE THE PIPES TO THE LEFT

            p.x -= this.dx;
            
            // IF PIPES GOES BEYOND, IT SHOULD DE DEvarED FROM THE ARRAY

            if(p.x + this.w <= 0){

                this.position.shift();
                score.value += 1;
                Score_Sound.play();

                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}

// SCORE

const score= {

    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){

        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
            
        }else if(state.current == state.over){

            // SCORE VALUE

            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);

            // BEST SCORE

            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}



// DRAW

function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    bg.draw();
    fg.draw();

    pipes.draw();
    bird.draw();

    GetReady.draw();
    gameOver.draw();
    score.draw();
}

// UPDATE

function update(){

    bird.update();
    fg.update();

    pipes.update();
}

// LOOP

function loop(){

    update();

    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();

