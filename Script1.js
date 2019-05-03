// JavaScript source code
var canvas = document.querySelector('canvas');
canvas.width = 0.5*window.innerWidth;
canvas.height = window.innerHeight-6;
var c = canvas.getContext('2d');

var score = 0;
var streak = 0;
var longestStreak = 0;
var backgroundSpeed = 0.2;
var isGameOver = false;

var boatX = canvas.width / 2;
var boatY = canvas.height;
var boatPos = -100;

var curShootAngle = 0;

var activeWordIndex = -5;
var lastTypedLetter = '(';

var shopItems = [];
var boughtItems = [];
var currentBoat = "boat.png";

var boatImg = document.createElement("img");
boatImg.setAttribute("src", currentBoat);

var pauseMenu = document.getElementById("Menu");
var shopMenu = document.getElementById("Shop");
var shopChild = document.getElementById("ShopChild");
var gameOverMenu = document.getElementById("GameOver");
var longestStreakText = document.getElementById("LongestStreakText");

var enemies = ["Squid", "Monster01", "Dragon", "SeaMonster", "Boss02", "Bomb"];
var enemyWaves = [1, 1, 3, 5, 5, 6];

/*function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    theta = 360 - theta;
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}*/

var move = true;

function Letter(x, y, pos, randomLetter) {
    //this.randomLetter = randomLetter;
    this.letter = randomLetter;
    this.x = x;
    this.y = y;
    
    this.draw = function () {
        if (this.letter.length > 0) {
            //console.log(randomLetter);
            c.fillStyle = 'black';
            c.globalAlpha = 0.7;
            c.fillRect(this.x + pos*30, this.y + 120, 20, 25);
            c.stroke();
            c.globalCompositeOperation = "source-over";
        }
        c.globalAlpha = 1;
        c.font = "20px Arial";
        c.fillStyle = "white";
        c.fillText(this.letter, this.x + 3 + pos * 30, this.y + 140);
    }
    this.update = function () {
        this.draw();
    }
}

//var letters = [];
function Circle(x,y,dx,dy,radius,text, textColor,alive, type) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.text = text;
    this.type = type;
    this.textColor = textColor;
    this.alive = alive;
    this.startDy = dy;
    this.stop = false;
    var img = document.createElement("img");
    img.setAttribute("src", enemies[type] + ".png");
    this.letters = [];

    this.amountOfLetters = 0;
    this.killedLetters = 0;

    this.draw = function () {
        if (this.alive) {
            c.globalCompositeOperation = "destination-over";
            if (type != 4)
                c.drawImage(img, this.x, this.y, canvas.width * 0.15, canvas.width * 0.15);
            else {
                c.drawImage(img, this.x, this.y, canvas.width * 0.25, canvas.width * 0.25);
                
                if (this.amountOfLetters <= 4) {
                    this.letters.push(new Letter(this.x, this.y, this.amountOfLetters, String.fromCharCode(65 + Math.floor(Math.random() * 26))));
                    this.amountOfLetters++;
                }
                else {
                    for (var i = 0; i < this.letters.length; i++) {
                        this.letters[i].update();
                        this.letters[i].x = this.x;
                        this.letters[i].y = this.y;
                    }
                }
                
            }
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
            //this.dy = dy;
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
                if (type == 5) {
                    this.alive = false;
                    this.text = "";
                    activeWordIndex = -5;
                }
                else {
                    move = false;

                    //c.font = "50px Arial";
                    //c.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
                    //c.font = "40px Arial";
                    //c.fillText("Longest Streak: " + longestStreak, canvas.width / 6, canvas.height / 2 + 50);
                    if (!isGameOver)
                        gameOver();
                }
            }
        }
        if (isGameOver) {
            move = false;
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
var timeBetweenSpawns = 2500;
var handle = setInterval(function () { pushCircle() }, timeBetweenSpawns);
var amountOfMonsters = 5;
var monsterIndex = 0;
var killedMonsters = 0;
var monstersToAdd = 5;
var waveEnded = false;
var waveIndex = 1;
var dy = 0.5;
var words = ["woman", "dance", "park", "adopt", "king", "embox", "book", "law", "shaft", "cross", "view", "rape", "dream", "jail", "boy", "add", "virus", "firm", "cable", "chaos", "speed", "hole", "tract", "shot", "store", "hope", "sleep", "paper", "load", "axis", "hold", "smash", "tile", "nap", "nut", "lack", "look", "orbit", "use", "thick", "high", "gas", "dome", "asset", "lip", "bench", "rough", "few", "relax", "pack", "raise", "try", "owl", "skin", "lean", "bird", "chase", "voter", "deal", "point", "rack", "hero", "bad", "fade", "large", "inch", "long", "draft", "sign", "strap", "smell", "deep", "style", "count", "last", "star", "flu", "tent", "cruel", "start", "nose", "fly", "aisle", "disco", "smoke", "base", "grind", "harsh", "work", "layer", "mouse", "run", "live", "radio", "orgy", "drown", "swipe", "night", "slave", "site"];
var longWords = ["contrary", "fiction", "mutual", "ostracize", "sustain", "hallway", "direction", "script", "constellation", "integration", "dealer", "quality", "refuse", "design", "resource", "twilight", "greeting", "guarantee", "modernize", "coerce", "disturbance", "consider", "pioneer", "violation", "prefer", "joystick", "dragon", "drawing", "compliance", "activity", "environmental", "trivial", "handicap", "communication", "pension", "adoption", "default", "digress", "growth", "confession", "circulation", "feedback", "premature", "uncertainty", "heroin", "peasant", "background", "reason", "clearance", "bulletin", "proclaim", "inappropriate", "responsible", "promote", "calculation", "policy", "institution", "member", "crevice", "cooperate", "symbol", "reduction", "railroad", "friend", "increase", "aquarium", "expand", "particular", "convention", "threshold", "damage", "biscuit", "movement", "requirement", "temple", "retired", "looting", "discuss", "conscience", "courtship", "engine", "reproduce", "terrace", "pasture", "provoke", "midnight", "miracle", "censorship", "outside", "selection", "platform", "horoscope", "consideration", "sticky", "revenge", "research", "explicit", "recession", "linger"];
var circleArray = [];
function pushCircle() {
    if (move) {
        var randomNum = Math.floor(Math.random() * words.length);
        while (randomNum == 1)
            randomNum = Math.floor(Math.random() * words.length);
        var randomWordNumber = parseInt(randomNum);
        var text = words[randomWordNumber].toString();
        var radius = 30;
        
        var dx;
        if (Math.random() - 0.5 < 0)
            dx = -2;
        else
            dx = 2;
        //var dy = (Math.random() - 0.5) * 8;
        /*if (Math.random() - 0.5 < 0)
            dy = -2;
        else
            dy = 2;*/
        var randomType = Math.random();
        while (randomType == 1 || enemyWaves[parseInt(randomType * enemies.length)] > waveIndex)
            randomType = Math.random();
        var randomEnemyIndex = parseInt(randomType * enemies.length);
        if (randomEnemyIndex == 3)
            text = longWords[randomWordNumber].toString();
        else if (randomEnemyIndex == 4) {
            radius = 90;
            text = "";
        }
        else if (randomEnemyIndex == 5) {
            console.log(killedMonsters);
            killedMonsters++;
            if (killedMonsters >= amountOfMonsters) {
                curShootAngle = 0;
                waveEnded = true;
                //circleArray.length = 0;
                waveIndex++;
                backgroundSpeed = 1;
            }
        }
        var x = Math.random() * (canvas.width - 60 - radius * 2) + radius;
        var y = Math.random() * (0.2 * canvas.height - radius * 2) + radius;
        circleArray.push(new Circle(x, y, dx, dy, radius, text, 'white', true, randomEnemyIndex));
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

function Item(id, name, imgPath, price) {
    //this.randomLetter = randomLetter;
    this.id = id;
    this.name = name;
    this.imgPath = imgPath;
    this.price = price;

    /*this.draw = function () {
        if (this.letter.length > 0) {
            //console.log(randomLetter);
            c.fillStyle = 'black';
            c.globalAlpha = 0.7;
            c.fillRect(this.x + pos * 30, this.y + 120, 20, 25);
            c.stroke();
            c.globalCompositeOperation = "source-over";
        }
        c.globalAlpha = 1;
        c.font = "20px Arial";
        c.fillStyle = "white";
        c.fillText(this.letter, this.x + 3 + pos * 30, this.y + 140);
    }
    this.update = function () {
        this.draw();
    }*/
}

function Bullet(x, y, i, last, target) {
    this.x = x;
    this.y = y;
    this.i = i;
    //var curAngle = angle(this.x, this.y, circleArray[this.i].x, circleArray[this.i].y);
    var distance = calcDistance(boatX, boatY, target[this.i].x, target[this.i].y);
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
        if (this.i < target.length) {
            if (target[this.i] != null) {
                c.save();
                c.translate(canvas.width / 2, canvas.height * 0.9);
                c.rotate(curShootAngle);
                c.drawImage(img, -canvas.width * 0.075, canvas.height - 350 - this.y, canvas.width * 0.15, canvas.width * 0.23);
                c.restore();
            }
        }
        //    c.drawImage(img, circleArray[this.i].x - 15, this.y);


        //var boatAngle = angle(canvas.width / 2, canvas.height, circleArray[this.i].x, circleArray[this.i].y);
        var boatAngle = Math.atan((target[this.i].x + canvas.width * 0.075 - boatX) / (target[this.i].y + canvas.width * 0.075 - boatY));
        //console.log(boatAngle);
        curShootAngle = -boatAngle;

        //c.restore();
        //c.translate(this.x, this.y);

    }
    this.update = function () {
        this.draw();
        //x += 1;
        this.y += 10;
        //console.log(circleArray[i].y);
        if (this.i < target.length) {
            if (target[this.i] != null) {

                //console.log(canvas.height - this.y / canvas.height);
                //var pitagoras = Math.sqrt((this.y) * (this.y) + (circleArray[this.i].x) * (circleArray[this.i].x));
                //console.log(pitagoras);
                //if (canvas.height - pitagoras + 450  < circleArray[this.i].y) {

                if (this.y >= distance * 1.5) {
                    //circleArray[i].changeDy(0);
                    c.drawImage(explosionImg, target[this.i].x, target[this.i].y, canvas.width * 0.15, canvas.width * 0.23);
                    bulletsArray.shift();
                    target[i].y -= 3;
                    //circleArray[i].changeDy(circleArray[i].startDy);
                    target[i].stop = false;
                    if (last) {
                        if (target == circleArray) {
                            //circleArray.splice(this.i, 1);
                            target[this.i].text = "";
                            target[this.i].alive = false;
                            //console.log(target[this.i].type);
                            if (target[this.i].type == 5) {
                                clearInterval(handle);
                                gameOver();
                                return;
                            }
                            killedMonsters++;
                            if (killedMonsters >= amountOfMonsters) {
                                curShootAngle = 0;
                                waveEnded = true;
                                //circleArray.length = 0;
                                waveIndex++;
                                backgroundSpeed = 1;
                            }
                            //curShootAngle = 0;
                        }
                    }
                }
            }
        }
    }
}

var bulletsArray = [];

//c.fillRect(100, 100, 100, 100);
var shoot = false;
var a = 0;
var goUp = true;

var body = document.querySelector("body");
function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    /*c.beginPath();
    c.moveTo(canvas.width / 2 - 37, canvas.height + boatPos + 50);
    c.lineTo(canvas.width / 2 - 37, canvas.height);
    c.moveTo(canvas.width / 2 + 31, canvas.height + boatPos + 50);
    c.lineTo(canvas.width / 2 + 31, canvas.height);
    c.stroke();
    c.globalCompositeOperation = "source-over";*/
    c.save();
    c.translate(canvas.width / 2, canvas.height * 0.9);
    c.rotate(curShootAngle);
    
    c.drawImage(boatImg, -canvas.width * 0.075, boatPos, canvas.width * 0.15, canvas.width * 0.23);
    if (waveEnded) {
        curShootAngle = 0;
        if (boatPos > -canvas.height-100 && goUp) {
            boatPos += boatPos/50;
            c.font = "100px Gisha";
            c.fillStyle = 'white';
            c.fillText("Wave " + waveIndex, -150, -canvas.height / 2);
        }
        else {
            goUp = false;
            backgroundSpeed = 3;
            if (boatPos < -100)
                boatPos -= boatPos / 80;
            else {
                backgroundSpeed = 0.2;
                waveEnded = false;
                monstersToAdd++;
                amountOfMonsters += monstersToAdd;
                dy += 0.05;
                timeBetweenSpawns -= 50;
                handle = setInterval(function () { pushCircle() }, timeBetweenSpawns);
                goUp = true;
            }
        }
    }
    c.restore();
    //c.drawImage(boatImg, canvas.width / 2- canvas.width * 0.075, canvas.height-150, canvas.width * 0.15, canvas.width * 0.23);
    c.font = "20px Arial";
    c.fillStyle = 'white';
    c.fillText("Score: " + score, 20, 40);
    c.fillRect(10, canvas.height-10, streak, 10);
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

function pauseGame() {
    move = !move;
    if (move) {
        backgroundSpeed = 0.2;
        menu.style.display = "none";
        menu.style.height = 0 + "px";
        for (var i = 0; i < circleArray.length; i++) {
            circleArray[i].changeDy(circleArray[i].startDy);
        }
    }
    else {
        backgroundSpeed = 0;
        menu.style.display = "block";
        menu.style.height = window.innerHeight + "px";
    }
}
function gameOver() {
    if (!isGameOver) {
        backgroundSpeed = 0;
        gameOverMenu.style.display = "block";
        gameOverMenu.style.height = window.innerHeight + "px";
        longestStreakText.innerHTML = "Longest Streak: " + longestStreak;
        isGameOver = true;
        streak = 0;
    }
    else {
        score = 0;
        monsterIndex = 0;
        isGameOver = false;
        move = true;
        dy = 0.5;
        killedMonsters = 0;
        waveEnded = false;
        waveIndex = 1;
        amountOfMonsters = 5;
        timeBetweenSpawns = 2500;
        handle = setInterval(function () { pushCircle() }, timeBetweenSpawns);
        backgroundSpeed = 0.2;
        gameOverMenu.style.display = "none";
        gameOverMenu.style.height = 0 + "px";
        circleArray.length = 0;
        curShootAngle = 0;
        activeWordIndex = -5;
        lastTypedLetter = '(';
    }
}

shopItems.push(new Item(1, "Boat", "boat.png", 20), new Item(2, "Boat 02", "WoodBoat.png", 30), new Item(3, "Boat 03", "Boat03.png", 40));
function buyItem(id) {
    boughtItems.push(id);
    for (var i = 0; i < shopItems.length; i++) {
        if (i == id) {
            var itemDiv = document.getElementById("item" + id);
            itemDiv.style.background = "green";
            var title = document.getElementById("title" + id);
            title.className = "shoptitle noselect";
            title.onclick = "";
            var useButton = document.createElement("h4");
            useButton.innerHTML = "Use";
            useButton.className = "shoptitle noselect menu_button";
            //(function (i) {
            useButton.onclick = function () {
                currentBoat = shopItems[id].imgPath;
                boatImg.setAttribute("src", shopItems[id].imgPath);
            };
            //})(i);
            itemDiv.appendChild(useButton);
            //alert(shopItems[id].imgPath);
            //boatImg.setAttribute("src", shopItems[id].imgPath);
        }
    }

    //alert("0");
}

var isShopOpen = false;
for (var i = 0; i < shopItems.length; i++) {
    var itemDiv = document.createElement("div");
    itemDiv.style.width = "100px";
    itemDiv.style.height = "200px";
    itemDiv.style.border = "3px groove rgba(255,255,255,0.1)";
    itemDiv.style.margin = "auto";
    itemDiv.style.textAlign = "center";
    itemDiv.style.display = "inline-block";
    itemDiv.style.marginRight = "20px";
    itemDiv.id = "item" + i;
    var title = document.createElement("h2");
    title.style.width = (shopItems[i].name * 10) + "px";
    title.ondragstart = function () { return false; };
    title.className = "shoptitle noselect menu_button";
    title.id = "title" + i;
    (function (i) {
        title.onclick = function () {
            buyItem(i);
        }
    })(i);

    //title.addEventListener('click', function () { alert(i); }, false);
    title.innerHTML = shopItems[i].name;
    var itemImg = document.createElement("img");
    itemImg.ondragstart = function () { return false; };
    itemImg.className = "noselect";
    itemImg.setAttribute("src", shopItems[i].imgPath);
    itemImg.style.width = "50px";
    itemImg.style.height = "80px";
    var price = document.createElement("h4")
    price.style.width = (shopItems[i].name * 10) + "px";
    price.className = "shoptitle noselect";
    price.innerHTML = shopItems[i].price;
    itemDiv.appendChild(title);
    itemDiv.appendChild(itemImg);
    itemDiv.appendChild(price);
    shopChild.appendChild(itemDiv);
}

function openShop() {
    if (!isShopOpen) {
        isShopOpen = true;
        shopMenu.style.display = "block";
        shopMenu.style.height = window.innerHeight + "px";
        shopMenu.ondragstart = function () { return false; };
        menu.style.display = "none";
        menu.style.height = 0 + "px";
        
    }
    else {
        isShopOpen = false;
        shopMenu.style.display = "none";
        shopMenu.style.height = "0px";
        menu.style.display = "block";
        menu.style.height = window.innerHeight + "px";
    }
}

function resizeCanvas() {
    canvas.width = 0.5 * window.innerWidth;
    canvas.height = window.innerHeight - 6;
    boatX = canvas.width / 2;
    boatY = canvas.height;
}

document.oncontextmenu = function () {
    //return false;
}

var menu = document.getElementById("Menu");
document.addEventListener('keydown', function (event) {
    //alert(circleArray[0].text);
    //alert(String.fromCharCode(event.keyCode));
    if (event.keyCode == 27) {
        if (!isGameOver)
            pauseGame();
    }
    
    for (var i = 0; i < circleArray.length; i++) {
        if (circleArray[i].type == 4) {
            if (circleArray[i].letters.length > 0 && move) {
                for (var j = 0; j < circleArray[i].letters.length; j++) {
                    
                    if (circleArray[i].letters[j].letter.length > 0) {
                        if (String.fromCharCode(event.keyCode) == circleArray[i].letters[j].letter.toUpperCase()) {
                            lastTypedLetter = event.keyCode;
                            
                            circleArray[i].letters[j].letter = "";
                            circleArray[i].killedLetters++;
                            //console.log(circleArray[i].killedLetters);
                            if (circleArray[i].killedLetters >= circleArray[i].amountOfLetters) {
                                bulletsArray.push(new Bullet(canvas.width / 2, canvas.height - 100, i, true, circleArray));
                                /*circleArray[i].alive = false;
                                killedMonsters++;
                                if (killedMonsters >= amountOfMonsters) {
                                    curShootAngle = 0;
                                    waveEnded = true;
                                    waveIndex++;
                                    backgroundSpeed = 1;
                                }*/
                            }
                            else {
                                bulletsArray.push(new Bullet(canvas.width / 2, canvas.height - 100, j, true, circleArray[i].letters));
                            }
                            return;
                        }
                    }
                }
            }
        }
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

                        score += streak;
                        if (streak > longestStreak) {
                            longestStreak = streak;
                        }

                        bulletsArray.push(new Bullet(canvas.width / 2, canvas.height - 100, activeWordIndex, true, circleArray));

                        circleArray[activeWordIndex].text = circleArray[activeWordIndex].text.substr(1);
                        activeWordIndex = -5;
                    }
                    else {
                        bulletsArray.push(new Bullet(canvas.width / 2, canvas.height - 100, activeWordIndex, false, circleArray));
                        //circleArray[activeWordIndex].changeDy(0);
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
                else if (event.keyCode == 46) {
                    if (activeWordIndex >= 0) {
                        circleArray[activeWordIndex].textColor = 'white';
                        activeWordIndex = -5;
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