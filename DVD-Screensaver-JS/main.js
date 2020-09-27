const logo = document.querySelector('#logo');

colors = ['#ff0000', '#ff4000', '#ff8000', '#ffbf00', 
        '#ffff00', '#bfff00', '#80ff00', '#40ff00', 
        '#00ff00', '#00ff40', '#00ff80', '#00ffbf', 
        '#00ffff', '#00bfff', '#0080ff', '#0040ff', 
        '#0000ff', '#4000ff', '#8000ff', '#bf00ff', 
        '#ff00ff', '#ff00bf', '#ff0080', '#ff0040', 
        '#ff0000'];

let animation_speed = 2;

const state = {

    position:{
        x: (window.innerWidth / 2) - logo.clientWidth  /   random_position(),
        y: (window.innerHeight / 2) - logo.clientHeight / random_position()
    },

    speed:{
        x: 1,
        y: 1
    }
}

function draw(){
    logo.style.left = state.position.x + 'px';
    logo.style.top = state.position.y + 'px';
}

function update(){
    state.position.x += (state.speed.x * animation_speed);
    state.position.y += (state.speed.y * animation_speed);
}

function random_position(min=10, max=20) {
    return (Math.floor(Math.random() * (max - min)) + min) / 10;
  }

function collision_detection(){
    if(state.position.x + logo.clientWidth >= window.innerWidth || state.position.x < 0){
        state.speed.x = -state.speed.x;
        changeColor()
    }
    if(state.position.y + logo.clientHeight >= window.innerHeight || state.position.y < 0){
        state.speed.y = -state.speed.y;
        changeColor()
    }
}

function changeColor(){
    color = colors[Math.floor(Math.random() * colors.length)];
    logo.style.fill =  color;
}

function game_loop(){
    draw();
    update();
    collision_detection();
    requestAnimationFrame(game_loop);
}

game_loop();



