// JavaScript source code
var canvas = document.querySelector('canvas');
canvas.width = 0.5*window.innerWidth;
canvas.height = window.innerHeight-6;
var c = canvas.getContext('2d');

var score = 0;
var streak = 0;
var longestStreak = 0;
var backgroundSpeed = 0.2;

var boatX = canvas.width / 2;
var boatY = canvas.height;

var curShootAngle = 0;

var boatImg = document.createElement("img");
boatImg.setAttribute("src", "boat.png");

var enemies = ["SeaMonster", "Dragon"];

function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    theta = 360 - theta;
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

var move = true;
function Circle(x,y,dx,dy,radius,text, textColor,alive) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.text = text;
    this.textColor = textColor;
    this.alive = alive;
    this.startDy = dy;
    this.stop = false;

    var randomNum = Math.random();
    while (randomNum == 1)
        randomNum = Math.random();
    var randomEnemyIndex = parseInt(randomNum * enemies.length);

    this.draw = function () {
        if (this.alive) {
            var img = document.createElement("img");
            img.setAttribute("src", enemies[randomEnemyIndex] + ".png");
            c.globalCompositeOperation = "destination-over";
            c.drawImage(img, this.x, this.y, canvas.width * 0.15, canvas.width * 0.15);
        }
        if (this.text.length > 0) {

            c.fillStyle = 'black';
            c.globalAlpha = 0.7;
            c.fillRect(this.x - 0.1*this.text.length*13, this.y - 18, this.text.length * 12, 25);
            c.stroke();
            c.globalCompositeOperation = "source-over";
        }
        c.globalAlpha = 1;
        c.font = "20px Arial";
        c.fillStyle = this.textColor;
        c.fillText(this.text, this.x, this.y);
    }
    this.update = function () {
        if (move) {
            /*if (x + radius > innerWidth - 20 || x - radius < 0)
                dx = -dx;
            if (y + radius > innerHeight || y - radius < 0)
                dy = -dy;*/
            this.dy = dy;
            if (this.x > canvas.width / 2) {
                dx = -0.00015 * (canvas.width-this.x);
            }
            else {
                dx = 0.00015 * (canvas.width - this.x);
            }

        }
        else {
            dx = 0;
            this.dy = 0;
        }
        
        if (this.alive) {
            if (this.y < canvas.height*0.8) {
                this.x += dx;
                this.y += this.dy;
            }
            else {
                move = false;
                streak = 0;
                c.font = "50px Arial";
                c.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
                c.font = "40px Arial";
                c.fillText("Longest Streak: " + longestStreak, canvas.width / 6, canvas.height / 2 + 50);
                backgroundSpeed = 0;
            }
        }
        /*var counter = 0;
        for (var i = 0; i < circleArray.length; i++) {
            if (circleArray[i].alive && circleArray[i] != this && this.alive && !circleArray[i].stop) {
                counter++;
                if (this.y < circleArray[i].y + 25 && this.y > circleArray[i].y - 25 && counter == 1) {
                    if (i != activeWordIndex) {
                        circleArray[i].changeDy(0);
                    }
                }
                else {
                    circleArray[i].changeDy(this.startDy);
                }
            }
        }*/

        this.draw();
    }

    this.changeDy = function (dy) {
        this.dy = dy;
    }

}
var handle = setInterval(function () { pushCircle() }, 2500);
var amountOfMonsters = 50;
var monsterIndex = 0;
var words = ["laugh", "complex", "neat", "domineering", "trust", "chess", "clear", "first", "quiet", "white", "dapper", "satisfy", "scarecrow", "boundless", "enthusiastic", "cemetery", "groovy", "hate", "skin", "man", "warlike", "rice", "kindhearted", "immense", "keen", "party", "incredible", "cheerful", "rotten", "guide", "liquid", "waiting", "lacking", "lavish", "fog", "smiling", "knit", "base", "rampant", "premium", "level", "cross", "disastrous", "kaput", "bored", "anxious", "exchange", "rejoice", "fruit", "divergent", "grey", "bizarre", "gold", "suggest", "gaudy", "glorious", "dare", "curve", "upset", "moaning", "auspicious", "one", "picayune", "spotty", "lonely", "street", "internal", "tremble", "lewd", "living", "lively", "silly", "thread", "wise", "nervous", "thought", "gigantic", "sweet", "handsomely", "concerned", "drink", "swanky", "jail", "rainy", "plough", "hushed", "cure", "doubtful", "screw", "bashful", "cool", "shaky", "stale", "rose", "order", "mysterious", "daily", "space", "mate"];
var circleArray = [];
function pushCircle() {
    if (move) {
        var randomNum = Math.random();
        while (randomNum == 1)
            randomNum = Math.random();
        var randomWordNumber = parseInt(Math.random() * words.length);
        var text = words[randomWordNumber].toString();
        var radius = 30;
        var x = Math.random() * (canvas.width - 60 - radius * 2) + radius;
        var y = Math.random() * (0.2 * canvas.height - radius * 2) + radius;
        var dx;
        var dy = 0.5;
        if (Math.random() - 0.5 < 0)
            dx = -2;
        else
            dx = 2;
        var dy = (Math.random() - 0.5) * 8;
        /*if (Math.random() - 0.5 < 0)
            dy = -2;
        else
            dy = 2;*/
        circleArray.push(new Circle(x, y, dx, 0.5, radius, text, 'white', true));
        monsterIndex++;
    }
    if (monsterIndex >= amountOfMonsters) {
        clearInterval(handle);
    }
}
//for (i = 0; i < amountOfMonsters; i++) {
    
    //setTimeout(function () { pushCircle() }, 2500 * i);
    //setTimeout(function () { backgroundSpeed = 3; curShootAngle = 0; }, 2800 * 50);
    /*else {
        for (var i = 0; i < circleArray.length; i++) {
            if (!circleArray[i].alive) {
                circleArray.splice(i, 1);
            }
        }
    }*/
//}

function calcDistance(aX, aY, bX, bY) {
    var a = bY - aY;
    var b = bX - aX;
    var pitagoras = Math.sqrt(a * a + b * b);
    return pitagoras;
}


function Bullet(x, y, i, last) {
    this.x = x;
    this.y = y;
    this.i = i;
    //var curAngle = angle(this.x, this.y, circleArray[this.i].x, circleArray[this.i].y);
    var distance = calcDistance(boatX, boatY, circleArray[this.i].x, circleArray[this.i].y);
    var explosionImg = document.createElement("img");
    explosionImg.setAttribute("src", "large_explosion.gif");
    //console.log(curAngle);
    this.draw = function () {
        
        c.save();
        var img = document.createElement("img");
        img.setAttribute("src", "plasma.png");
        //img.css('transform', 'rotate(' + 100 + 'deg)');
        //img.setAttribute("style", "transform: rotate(110deg)");
        //img.style.transform = "rotate(30deg)";
        //c.translate(circleArray[this.i].x, this.y);
        //c.translate(innerWidth / 2, innerHeight -100);
        //c.translate(canvas.width/2, canvas.height*2);
        //c.setTransform(0, 0, 0, 0, innerWidth / 2, innerHeight-50)
        //c.rotate(curAngle);
        if (circleArray[this.i] != null) {
            c.save();
            c.translate(canvas.width / 2, canvas.height * 0.9);
            c.rotate(curShootAngle);
            c.drawImage(img, -canvas.width * 0.075, canvas.height-350-this.y, canvas.width * 0.15, canvas.width * 0.23);
            c.restore();
        }
        //    c.drawImage(img, circleArray[this.i].x - 15, this.y);


        //var boatAngle = angle(canvas.width / 2, canvas.height, circleArray[this.i].x, circleArray[this.i].y);
        var boatAngle = Math.atan((circleArray[this.i].x+60 - boatX) / (circleArray[this.i].y - boatY)) * 180 / Math.PI *1.1;
        //console.log(boatAngle);
        curShootAngle = -boatAngle * Math.PI / 180;

        //c.restore();
        //c.translate(this.x, this.y);

    }
    this.update = function () {
        this.draw();
        //x += 1;
        this.y += 10;
        //console.log(circleArray[i].y);
        if (circleArray[this.i] != null) {
            
            //console.log(canvas.height - this.y / canvas.height);
            //var pitagoras = Math.sqrt((this.y) * (this.y) + (circleArray[this.i].x) * (circleArray[this.i].x));
            //console.log(pitagoras);
            //if (canvas.height - pitagoras + 450  < circleArray[this.i].y) {
            
            if (this.y >= distance * 1.5) {
                c.drawImage(explosionImg, circleArray[this.i].x, circleArray[this.i].y, canvas.width * 0.15, canvas.width * 0.23);
                bulletsArray.shift();
                circleArray[i].changeDy(circleArray[i].startDy);
                circleArray[i].stop = false;
                if (last) {
                    //circleArray.splice(this.i, 1);
                    circleArray[this.i].text = "";
                    circleArray[this.i].alive = false;
                    //curShootAngle = 0;
                }
            }
        }
    }
}

var bulletsArray = [];

//c.fillRect(100, 100, 100, 100);
var shoot = false;
var a = 0;

var body = document.querySelector("body");
function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.translate(canvas.width / 2, canvas.height * 0.9);
    c.rotate(curShootAngle);
    c.drawImage(boatImg, -canvas.width * 0.075, -100, canvas.width * 0.15, canvas.width * 0.23);
    c.restore();
    //c.drawImage(boatImg, canvas.width / 2- canvas.width * 0.075, canvas.height-150, canvas.width * 0.15, canvas.width * 0.23);
    c.fillStyle = 'white';
    c.fillText("Score: " + score, 20, 40);
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
    for (var i = 0; i < bulletsArray.length; i++) {
        bulletsArray[i].update();
    }
    body.style.backgroundPositionY = a + 'px';
    a += backgroundSpeed;
    
}
window.requestAnimationFrame(animate);

var activeWordIndex = -5;
var lastTypedLetter = '(';

document.addEventListener('keydown', function (event) {
    //alert(circleArray[0].text);
    //alert(String.fromCharCode(event.keyCode));
    if (event.keyCode == 27) {
        move = !move;
        if (move)
            backgroundSpeed = 0.2;
        else
            backgroundSpeed = 0;
    }
    if (circleArray.length > 0 && move) {
        if (activeWordIndex < 0) {
            for (var i = 0; i < circleArray.length; i++) {
                if (circleArray[i].text.length > 0) {
                    if (String.fromCharCode(event.keyCode) == circleArray[i].text[0].toUpperCase()) {
                        activeWordIndex = i;
                        circleArray[activeWordIndex].textColor = 'orange';
                        lastTypedLetter = event.keyCode;
                        break;
                    }
                }
            }
        }
        if (activeWordIndex >= 0) {
            if (circleArray[activeWordIndex] != null) {
                if (String.fromCharCode(event.keyCode) == circleArray[activeWordIndex].text[0].toUpperCase()) {

                    streak++;
                    shoot = true;
                    if (circleArray[activeWordIndex].text.length <= 1) {

                        score += 10;
                        if (streak > longestStreak) {
                            longestStreak = streak;
                        }

                        bulletsArray.push(new Bullet(canvas.width / 2, canvas.height - 100, activeWordIndex, true));

                        circleArray[activeWordIndex].text = circleArray[activeWordIndex].text.substr(1);
                        activeWordIndex = -5;
                    }
                    else {
                        bulletsArray.push(new Bullet(canvas.width / 2, canvas.height - 100, activeWordIndex, false));
                        circleArray[activeWordIndex].changeDy(0);
                        circleArray[activeWordIndex].stop = true;
                        circleArray[activeWordIndex].text = circleArray[activeWordIndex].text.substr(1);
                    }

                }
                else if (event.keyCode == 38) {
                    for (var i = activeWordIndex + 1; i < circleArray.length; i++) {
                        if (circleArray[i].alive) {
                            if (String.fromCharCode(lastTypedLetter) == circleArray[i].text[0].toUpperCase()) {
                                circleArray[activeWordIndex].textColor = 'white';
                                activeWordIndex = i;
                                circleArray[activeWordIndex].textColor = 'orange';
                                break;
                            }
                        }
                    }
                }
                else if (event.keyCode == 40) {
                    if (activeWordIndex >= 1) {
                        for (var i = activeWordIndex - 1; i >= 0; i--) {
                            if (circleArray[i].alive) {
                                if (String.fromCharCode(lastTypedLetter) == circleArray[i].text[0].toUpperCase()) {
                                    circleArray[activeWordIndex].textColor = 'white';
                                    activeWordIndex = i;
                                    circleArray[activeWordIndex].textColor = 'orange';
                                    break;
                                }
                            }
                        }
                    }
                }
                else {
                    streak = 0;
                    //console.log(streak);
                }
            }
        }
    }
});