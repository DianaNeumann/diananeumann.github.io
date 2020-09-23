let cnv = document.getElementById('cnv');
let ctx = cnv.getContext('2d');

let mx = 0;
let my = 0;

let dimension = [document.documentElement.clientWidth,document.documentElement.clientHeight];
let c = document.getElementById('canvas');
let w = dimension[0];
let h = dimension[1];
cnv.width = w;
cnv.height = h;

ctx.lineWidth = 2;
ctx.lineCap = 'round';

let circles = [ 
    {
     x: w * 0.5,
     y: h * 0.5,
     s: h * 0.075
    }
];

let boxes = [
    {
     x: w * 0.5,
     y: h * 0.3,
     s: h * 0.05
    }
];

document.addEventListener('mousemove', onMouseUpdate, false);
let interval = setInterval(update,17);



function sdBox(px, py, s){
    let dx = Math.abs(px) - s;
    let dy = Math.abs(py) - s;
    let l = Math.sqrt(Math.max(dx,0) * Math.max(dx,0) + Math.max(dy,0) * Math.max(dy, 0));  // mix <=> max
    
    return l + Math.min(Math.max(dx,dy),0);
}

function dist(px, py){
    let dist1 = Math.sqrt((px - circles[0].x) * (px - circles[0].x) + (py - circles[0].y) * (py - circles[0].y)) - circles[0].s;

    let dist2 = sdBox(px - boxes[0].x, py - boxes[0].y, boxes[0].s);
                          
    return Math.min(dist1, dist2);
}


function update(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#000';

    for(let i = 0; i < circles.length; i++){
        ctx.beginPath();
        ctx.arc(circles[i].x, circles[i].y, circles[i].s, 0, 2 * Math.PI);
        ctx.fill();
    }

    for(let j = 0; j < boxes.length; j++){
        ctx.beginPath();
        ctx.rect(boxes[j].x - boxes[j].s, 
                 boxes[j].y - boxes[j].s, 
                 boxes[j].s * 2,
                 boxes[j].s * 2);
        ctx.fill();
    }

    let sx = w * 0.2;
	let sy = h / 2;
	let px = sx;
	let py = sy;
	let angle = Math.atan2(my - sy, mx - sx);
	let dx = Math.cos(angle);
	let dy = Math.sin(angle);
    let dO = 0;
    
    for(let i = 0; i < 30; i++){
		ctx.strokeStyle = "#F70";
		let d = dist(px, py);
		dO += d;
		if(dO > w) break;
		ctx.fillStyle = "rgba(255, 200, 0, 0.05)";
		ctx.beginPath();
		ctx.arc(px, py, d, 0, 2 * Math.PI);
		ctx.fill();
		ctx.strokeStyle = "#FB0";
		ctx.beginPath();
		ctx.arc(px, py, d, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "#F30";
		ctx.beginPath();
		ctx.arc(px, py, 4, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(px + dx * 5, py + dy * 5);
		px += dx * d;
		py += dy * d;
		ctx.lineTo(px, py);
		ctx.stroke();
		if(d < 1) break;
    }
}

function onMouseUpdate(e){
    mx = e.pageX;
    my = e.pageY;
}