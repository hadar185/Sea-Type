// JavaScript source code
var canvas = document.querySelector('canvas');
canvas.width = 0.53*window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var score = 0;
var streak = 0;
var longestStreak = 0;
var startBackgroundSpeed = 0.2;
var waveRecord = 1;
var backgroundSpeed = 0.2;
var isGameOver = false;
var money = 0;

var waterPlace = 0;
var poisoning = false;
var attacks = 3;

var boatX = canvas.width / 2;
var boatY = canvas.height;
var boatPos = -100;

var curShootAngle = 0;

var activeWordIndex = -5;
var lastTypedLetter = '(';

var shopItems = [];
var boughtItems = [];
boughtItems.push(0);
var currentBoat = "boat.png";
var currentShootSound = "Laser04";
var currentHitSound = "Hit";
var currentEffectName = "Explosion01";
var currentShotImg = "plasma";
var currentAttack = "";
var currentFrame = 0;

var boatImg = document.createElement("img");
boatImg.setAttribute("src", "Boats/"+currentBoat);

var waveImg = document.createElement("img");
waveImg.setAttribute("src", "Attacks/wave.png");

var pauseMenu = document.getElementById("Menu");
var mainMenu = document.getElementById("MainMenu");
var helpMenu = document.getElementById("HelpMenu");
var isHelpOpen = false
var settingsMenu = document.getElementById("Settings");
var volumeSlider = document.getElementById("volume");
var selectedVolume = volumeSlider.value / 10;
var isSettingsOpen = false;
var shopMenu = document.getElementById("Shop");
var shopChild = document.getElementById("ShopChild");
var gameOverMenu = document.getElementById("GameOver");
var longestStreakText = document.getElementById("LongestStreakText");
var addedMoneyText = document.getElementById("AddedMoney");
var moneyText = document.getElementById("Money");


var waveToStartText = document.getElementById("WaveToStartText");

var enemies = ["Squid", "SeaMonster", "Dragon", "Monster02", "Boss02", "SeaBomb", "IceMonster"];
var enemyWaves = [1, 1, 3, 5, 8, 6, 10];

var isPlayingAudio = false;
var audio = document.getElementById("audio");
var explosion = new Audio("Audio/Others/Explosion.mp3");
explosion.volume = selectedVolume

function changeVolume() {
    selectedVolume = volumeSlider.value / 10;
    audio.volume = 0.4 * selectedVolume;
}
audio.volume = 0.4;
function playAudio() {
    audio.play();
    isPlayingAudio = true;
}

backgroundSpeed = 0;
mainMenu.style.display = "block";

var move = false;

function setCookie(name,value) {
    document.cookie = name + "=" + value + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(name) {
    var value = getCookie(name);
    if (value != "") {
        return value;
    } else {
        return 0;
    }
}
if (parseInt(checkCookie("beststreak") == null)) {
    setCookie("beststreak", 0);
    setCookie("money", 0);
    setCookie("bestwave", 1);
    setCookie("boughtitems", boughtItems.join('|'));
}
else {
    longestStreak = parseInt(checkCookie("beststreak"));
    money = parseInt(checkCookie("money"));
    waveRecord = parseInt(checkCookie("bestwave"));
    if (getCookie("boughtitems").split('|')[0])
        boughtItems = getCookie("boughtitems").split('|');
}

if (waveRecord <= 0)
    waveRecord = 1;

function Letter(x, y, pos, randomLetter, radius) {
    this.letter = randomLetter;
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    this.draw = function () {
        if (this.letter.length > 0) {
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

function AllDead() {
    var dead = true;
    for (var i = 0; i < circleArray.length; i++) {
        if (circleArray[i].alive == true) {
            dead = false;
        }
    }
    return dead;
}

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
    img.setAttribute("src", "Monsters/"+enemies[type] + ".png");
    this.letters = [];

    this.amountOfLetters = 0;
    this.killedLetters = 0;

    this.draw = function () {
        if (this.alive) {
            if (type == 4) {
                c.drawImage(img, this.x, this.y, canvas.width * 0.25, canvas.width * 0.25);

                if (this.amountOfLetters <= 4) {
                    this.letters.push(new Letter(this.x, this.y, this.amountOfLetters, String.fromCharCode(65 + Math.floor(Math.random() * 26)), radius));
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
            else if (type == 6) {
                c.drawImage(img, this.x, this.y, canvas.width * 0.25, canvas.width * 0.25);
            }
            else if (type == 5) {
                c.drawImage(img, this.x, this.y, canvas.width * 0.18, canvas.width * 0.18);
            }
            else if (type == 3) {
                c.drawImage(img, this.x, this.y, canvas.width * 0.20, canvas.width * 0.20);
            }
            else
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
        if ((((this.text.length == 0 || this.text[0] == null) && type != 4) || (this.killedLetters >= 5 && type == 4)) && this.alive) {
            this.alive = false;
            activeWordIndex = -5;
        }
        if (move) {
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
            if (this.y < canvas.height*1) {
                this.x += dx;
                this.y += this.dy;
                if (this.y > canvas.height - waterPlace && poisoning && type != 5) {
                    if (currentAttack == "poison") {
                        this.alive = false;
                        this.text = "";
                        activeWordIndex = -5;
                        killedMonsters++;
                        if ((killedMonsters >= amountOfMonsters || AllDead()) && monsterIndex >= amountOfMonsters) {
                            curShootAngle = 0;
                            killedMonsters = amountOfMonsters;
                            waveEnded = true;
                            activeWordIndex = -5;
                            circleArray.length = 0;
                            waveIndex++;
                            backgroundSpeed = startBackgroundSpeed * 4;
                        }
                    }
                    else if (currentAttack == "waves") {
                        this.y -= 3;
                    }
                }
            }
            else {
                if (type == 5) {
                    this.alive = false;
                    this.text = "";
                    activeWordIndex = -5;
                }
                else {
                    move = false;
                    if (!isGameOver)
                        gameOver();
                }
            }
        }
        if (isGameOver) {
            move = false;
        }

        this.draw();
    }

    this.changeDy = function (dy) {
        this.dy = dy;
    }

}
var timeBetweenSpawns = 2500;
var handle;
var amountOfMonsters = 5;
var monsterIndex = 0;
var killedMonsters = 0;
var spawnedBombs = 0;
var monstersToAdd = 5;
var waveEnded = false;
var waveIndex = 1;
var dy = 0.5;
var words = ["woman", "dance", "park", "adopt", "king", "embox", "book", "law", "shaft", "cross", "view", "rape", "dream", "jail", "boy", "add", "virus", "firm", "cable", "chaos", "speed", "hole", "tract", "shot", "store", "hope", "sleep", "paper", "load", "axis", "hold", "smash", "tile", "nap", "nut", "lack", "look", "orbit", "use", "thick", "high", "gas", "dome", "asset", "lip", "bench", "rough", "few", "relax", "pack", "raise", "try", "owl", "skin", "lean", "bird", "chase", "voter", "deal", "point", "rack", "hero", "bad", "fade", "large", "inch", "long", "draft", "sign", "strap", "smell", "deep", "style", "count", "last", "star", "flu", "tent", "cruel", "start", "nose", "fly", "aisle", "disco", "smoke", "base", "grind", "harsh", "work", "layer", "mouse", "run", "live", "radio", "orgy", "drown", "swipe", "night", "slave", "site"];
var longWords = ["contrary", "fiction", "mutual", "ostracize", "sustain", "hallway", "direction", "script", "constellation", "integration", "dealer", "quality", "refuse", "design", "resource", "twilight", "greeting", "guarantee", "modernize", "coerce", "disturbance", "consider", "pioneer", "violation", "prefer", "joystick", "dragon", "drawing", "compliance", "activity", "environmental", "trivial", "handicap", "communication", "pension", "adoption", "default", "digress", "growth", "confession", "circulation", "feedback", "premature", "uncertainty", "heroin", "peasant", "background", "reason", "clearance", "bulletin", "proclaim", "inappropriate", "responsible", "promote", "calculation", "policy", "institution", "member", "crevice", "cooperate", "symbol", "reduction", "railroad", "friend", "increase", "aquarium", "expand", "particular", "convention", "threshold", "damage", "biscuit", "movement", "requirement", "temple", "retired", "looting", "discuss", "conscience", "courtship", "engine", "reproduce", "terrace", "pasture", "provoke", "midnight", "miracle", "censorship", "outside", "selection", "platform", "horoscope", "consideration", "sticky", "revenge", "research", "explicit", "recession", "linger"];
var veryLongWords = ["undiscovered", "misinterpret", "deforestation", "reprehensible", "conciliatory", "sociopolitical", "quantitative", "multicolored", "disappointing", "consciousness", "inappropriate", "unchallenged", "experimenter", "compensatory", "slaughterhouse", "reassessment", "operationalize", "determination", "multilateral", "confessional", "misunderstanding", "enthusiastic", "geographical", "redefinition", "transgression", "deterioration", "recrimination", "exhilarating", "participation", "biotechnology", "standardization", "antithetical", "conglomerate", "unpredictability", "industrialization", "conceptualization", "degenerative", "recognizable", "inflationary", "victimization", "inaccessible", "compensation", "northeastern", "unaccustomed", "unproductive", "objectionable", "intersection", "inefficiency", "confectioner", "inconceivable", "administrative", "extinguisher", "undocumented", "osteoporosis", "instrumental", "disintegrate", "contemplation", "unacceptable", "postsecondary", "interruption", "mediterranean", "catastrophic", "implantation", "denomination", "reminiscence", "unintentional", "chiropractor", "sociological", "disenchanted", "condensation", "psychiatrist", "industrialized", "productivity", "statistician", "nutritionist", "rapprochement", "contraception", "unprecedented", "multiplicity", "fertilization", "irreplaceable", "accompaniment", "affectionate", "collaboration", "mythological", "introduction", "contemplation", "questionable", "pathological", "unmistakable", "discriminant", "informational", "heterosexual", "noncompliance", "disintegrate", "journalistic", "straightforward", "epidemiological", "conservative", "schizophrenia"];
var circleArray = [];
function pushCircle() {
    if (move) {
        var randomNum = Math.floor(Math.random() * words.length);
        while (randomNum == 1) {
            randomNum = Math.floor(Math.random() * words.length);
        }
        var randomWordNumber = parseInt(randomNum);
        var text = words[randomWordNumber].toString();
        var radius = 30;

        var dx;
        if (Math.random() - 0.5 < 0)
            dx = -2;
        else
            dx = 2;
        var randomType = Math.random();
        while (randomType == 1 || enemyWaves[parseInt(randomType * enemies.length)] > waveIndex || (parseInt(randomType * enemies.length) == 5 && spawnedBombs >= waveIndex/2)) {
            randomType = Math.random();
        }
        var randomEnemyIndex = parseInt(randomType * enemies.length);
        if (randomEnemyIndex == 3)
            text = longWords[randomWordNumber].toString();
        if (randomEnemyIndex == 6)
            text = veryLongWords[randomWordNumber].toString();
        else if (randomEnemyIndex == 4) {
            radius = 80;
            text = "";
        }
        else if (randomEnemyIndex == 5) {
            spawnedBombs++;
            killedMonsters++;
            if (killedMonsters >= amountOfMonsters && monsterIndex >= amountOfMonsters) {
                curShootAngle = 0;
                waveEnded = true;
                activeWordIndex = -5;
                circleArray.length = 0;
                //circleArray.length = 0;
                waveIndex++;
                backgroundSpeed = startBackgroundSpeed * 4;
            }
        }
        var x = Math.random() * (canvas.width - 60 - radius * 2) + radius;
        circleArray.push(new Circle(x, 0, dx, dy, radius, text, 'white', true, randomEnemyIndex));
        monsterIndex++;
    }
    if (monsterIndex >= amountOfMonsters) {
        clearInterval(handle);
        if ((killedMonsters >= amountOfMonsters || AllDead()) && !waveEnded) {
            curShootAngle = 0;
            killedMonsters = amountOfMonsters;
            waveEnded = true;
            activeWordIndex = -5;
            circleArray.length = 0;
            waveIndex++;
            backgroundSpeed = startBackgroundSpeed * 4;
        }
    }
}

function calcDistance(aX, aY, bX, bY) {
    var a = bY - aY;
    var b = bX - aX;
    var pitagoras = Math.sqrt(a * a + b * b);
    return pitagoras;
}

function Item(id, name, imgPath, price, shootSound, hitSound, effectName, shotImg, attack) {
    this.id = id;
    this.name = name;
    this.imgPath = imgPath;
    this.price = price;
    this.shootSound = shootSound;
    this.hitSound = hitSound;
    this.effectName = effectName;
    this.shotImg = shotImg;
    this.attack = attack;
}

function Bullet(x, y, i, last, target) {
    this.x = x;
    this.y = y;
    this.i = i;
    var distance = calcDistance(boatX, boatY, target[this.i].x + target[this.i].radius / 4, target[this.i].y + target[this.i].radius / 4);
    var explosionImg = document.createElement("img");
    explosionImg.setAttribute("src", currentEffectName + "/" + currentFrame + ".png");
    this.draw = function () {
        
        c.save();
        var img = document.createElement("img");
        img.setAttribute("src", "Shots/"+currentShotImg + ".png");
        if (this.i < target.length) {
            if (target[this.i] != null) {
                c.save();
                c.translate(canvas.width / 2, canvas.height * 0.9);
                c.rotate(curShootAngle);
                c.drawImage(img, -canvas.width * 0.075, canvas.height - 350 - this.y, canvas.width * 0.15, canvas.width * 0.23);
                c.restore();
            }
        }
        
        var boatAngle = Math.atan((target[this.i].x + target[this.i].radius / 4 + canvas.width * 0.075 - boatX) / (target[this.i].y + target[this.i].radius / 4 + canvas.width * 0.075 - boatY));
        curShootAngle = -boatAngle;

    }
    this.update = function () {
        this.draw();
        this.y += 20;
        if (this.i < target.length) {
            if (target[this.i] != null) {
                
                if (this.y >= distance * 1.5) {
                    c.drawImage(explosionImg, target[this.i].x + target[this.i].radius / 4, target[this.i].y + target[this.i].radius / 4, canvas.width * 0.15, canvas.width * 0.23);
                    currentFrame++;
                    if (currentFrame > 5)
                        currentFrame = 0;
                    bulletsArray.shift();
                    target[i].y -= 3;
                    target[i].stop = false;

                    var hit = new Audio("Audio/Hit/"+currentHitSound + ".mp3");
                    hit.volume = 0.5 * selectedVolume;
                    hit.play();
                    if (last) {
                        if (target == circleArray) {
                            target[this.i].text = "";
                            target[this.i].alive = false;
                            if (target[this.i].type == 5) {
                                clearInterval(handle);
                                explosion.play();
                                gameOver();
                                return;
                            }
                            if (target[this.i].type != 4) {
                                activeWordIndex = -5;
                            }
                            killedMonsters++;
                            if ((killedMonsters >= amountOfMonsters || AllDead()) && monsterIndex >= amountOfMonsters) {
                                curShootAngle = 0;
                                killedMonsters = amountOfMonsters;
                                waveEnded = true;
                                activeWordIndex = -5;
                                circleArray.length = 0;
                                waveIndex++;
                                backgroundSpeed = startBackgroundSpeed * 4;
                            }
                        }
                    }
                    
                }
            }
        }
    }
}

var bulletsArray = [];

var shoot = false;
var a = 0;
var goUp = true;
var poisonUp = true;
var dySave = dy;

var body = document.querySelector("body");
function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
    for (var i = 0; i < bulletsArray.length; i++) {
        bulletsArray[i].update();
    }
    if ((killedMonsters >= amountOfMonsters || AllDead()) && monsterIndex >= amountOfMonsters && bulletsArray.length == 0 && !waveEnded) {
        curShootAngle = 0;
        killedMonsters = amountOfMonsters;
        waveEnded = true;
        activeWordIndex = -5;
        circleArray.length = 0;
        waveIndex++;
        backgroundSpeed = startBackgroundSpeed * 4;
        console.log("hello");
    }
    if (poisoning) {
        if (currentAttack == "poison") {
            c.globalAlpha = 0.5;
            c.fillStyle = "#558f1c";
            c.fillRect(0, canvas.height - waterPlace, canvas.width, canvas.height / 1.5);
            c.globalAlpha = 1.0;

            if (1.5 * canvas.height - waterPlace > canvas.height && poisonUp) {
                if (backgroundSpeed < 4)
                    waterPlace += 7 - backgroundSpeed;
                else
                    waterPlace += 7 - 4;
            }
            else {
                poisonUp = false;
                if (waterPlace > 0) {
                    waterPlace -= backgroundSpeed * 2;
                }
                else {
                    poisoning = false;
                    waterPlace = 0;
                    poisonUp = true;
                    attacks--;
                }
            }
        }
        else if (currentAttack == "waves") {
            c.drawImage(waveImg, 0, canvas.height - waterPlace, canvas.width, 100);

            if (waterPlace/1.13 < canvas.height && poisonUp) {
                if (backgroundSpeed < 4)
                    waterPlace += 7 - backgroundSpeed;
                else
                    waterPlace += 7 - 4;
            }
            else {
                poisoning = false;
                waterPlace = 0;
                poisonUp = true;
                attacks--;
            }
        }
    }
    
    c.save();
    c.translate(canvas.width / 2, canvas.height * 0.9);
    c.rotate(curShootAngle);
    
    if (waveEnded) {
        curShootAngle = 0;
        if (boatPos > -canvas.height-200 && goUp) {
            boatPos += boatPos/50;
            c.font = "100px Gisha";
            c.fillStyle = 'white';
            c.fillText("Wave " + waveIndex, -150, -canvas.height / 2);
            for (var i = 0; i < circleArray.length; i++) {
                circleArray[i].dy = 6 * startBackgroundSpeed;
            }
        }
        else {
            for (var i = 0; i < circleArray.length; i++) {
                circleArray[i].dy = 18 * startBackgroundSpeed;
            }
            goUp = false;
            backgroundSpeed = startBackgroundSpeed * 9;
            if (boatPos < -100)
                boatPos -= boatPos / 80;
            else {
                for (var i = 0; i < circleArray.length; i++) {
                    circleArray[i].changeDy(circleArray[i].startDy);
                }
                waveEnded = false;
                killedMonsters = amountOfMonsters;
                monstersToAdd++;
                amountOfMonsters += monstersToAdd;
                spawnedBombs = 0;
                if (waveIndex - 1 > waveRecord) {
                    waveRecord = waveIndex - 1;
                }
                dy = dySave+0.05;
                startBackgroundSpeed += 0.05;
                backgroundSpeed = startBackgroundSpeed;
                timeBetweenSpawns -= 50;

                if (waveIndex <= 50) {
                    handle = setInterval(function () { pushCircle() }, timeBetweenSpawns);
                    dySave = dy;
                }
                goUp = true;
            }
        }
    }

    if (boatImg.getAttribute("src") == "Boats/Boat04.png")
        c.drawImage(boatImg, -canvas.width * 0.1, boatPos - canvas.width * 0.05, canvas.width * 0.2, canvas.width * 0.3);
    else
        c.drawImage(boatImg, -canvas.width * 0.075, boatPos, canvas.width * 0.15, canvas.width * 0.23);
    c.restore();
    c.font = "20px Arial";
    c.fillStyle = 'white';
    c.fillText("Score: " + score, 20, 40);
    if (streak * 2 < canvas.width-10)
        c.fillRect(10, canvas.height - 15, streak * 2, 15);
    else
        c.fillRect(10, canvas.height - 15, canvas.width-10, 15);
    c.font = "15px Gisha";
    c.fillStyle = 'black';
    c.fillText(streak, 15, canvas.height-2.5);
    c.font = "20px Arial";
    c.fillStyle = 'white';
    c.fillText(killedMonsters + " / " + amountOfMonsters, canvas.width / 2 -20, 40);
    c.fillText("Wave " + waveIndex, canvas.width - 100, 40);
    if (currentAttack == "")
        c.fillText("No special attack", canvas.width - 200, canvas.height - 20);
    else {
        c.fillText(attacks + " attacks", canvas.width - 100, canvas.height - 20);
        c.fillText("Press ENTER", canvas.width - 150, canvas.height - 50);
    }
    body.style.backgroundPositionY = a + 'px';
    
    a += backgroundSpeed;
    
}
window.requestAnimationFrame(animate);

function pauseGame() {
    move = !move;
    if (move) {
        backgroundSpeed = startBackgroundSpeed;
        menu.style.display = "none";
        for (var i = 0; i < circleArray.length; i++) {
            circleArray[i].changeDy(circleArray[i].startDy);
        }
    }
    else {
        backgroundSpeed = 0;
        menu.style.display = "block";
    }
}
function gameOver() {
    if (!isGameOver) {
        backgroundSpeed = 0;
        startBackgroundSpeed = 0.2;
        gameOverMenu.style.display = "block";
        longestStreakText.innerHTML = "Longest Streak: " + longestStreak;
        var moneyToAdd = Math.floor(score / 10);
        addedMoneyText.innerHTML = "+" + moneyToAdd + " ";
        isGameOver = true;
        streak = 0;
        money += moneyToAdd;
        setCookie("beststreak", longestStreak);
        setCookie("money", money);
        setCookie("bestwave", waveRecord);
    }
    else {
        clearInterval(handle);
        score = 0;
        monsterIndex = 0;
        isGameOver = false;
        move = true;
        dy = 0.5;
        killedMonsters = 0;
        monstersToAdd = 5;
        waveEnded = false;
        waveIndex = 1;
        spawnedBombs = 0;
        attacks = 3;
        amountOfMonsters = 5;
        timeBetweenSpawns = 2500;
        handle = setInterval(function () { pushCircle() }, timeBetweenSpawns);
        backgroundSpeed = startBackgroundSpeed;
        gameOverMenu.style.display = "none";
        circleArray.length = 0;
        curShootAngle = 0;
        activeWordIndex = -5;
        lastTypedLetter = '(';
    }
}

shopItems.push(new Item(1, "Boat", "boat.png", "", "Laser04", "Hit", "Explosion01", "plasma", ""), new Item(2, "Boat 02", "WoodBoat02.png", 50, "Laser01", "Hit02", "Explosion02", "plasma02", "waves"), new Item(3, "Boat 03", "Boat04.png", 100, "Laser02", "Hit03", "Explosion04", "plasma03", "poison"));
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
            money -= shopItems[i].price;
            useButton.onclick = function () {
                currentBoat = shopItems[id].imgPath;
                boatImg.setAttribute("src", "Boats/"+shopItems[id].imgPath);
                currentShootSound = shopItems[id].shootSound;
                currentHitSound = shopItems[id].hitSound;
                currentEffectName = shopItems[id].effectName;
                currentShotImg = shopItems[id].shotImg;
                currentAttack = shopItems[id].attack;
            };
            itemDiv.appendChild(useButton);
            setCookie('money', money);
            setCookie('boughtitems', boughtItems.join('|'));
            openShop();
            openShop();
        }
    }
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
    
    title.innerHTML = shopItems[i].name;
    var itemImg = document.createElement("img");
    itemImg.ondragstart = function () { return false; };
    itemImg.className = "noselect";
    itemImg.setAttribute("src", "Boats/"+shopItems[i].imgPath);
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
        shopMenu.ondragstart = function () { return false; };
        menu.style.display = "none";
        mainMenu.style.display = "none";
        moneyText.innerHTML = money + " ";
        for (var i = 0; i < shopItems.length; i++) {
            var bought = false;
            for (var j = 0; j < boughtItems.length; j++) {
                if (i == boughtItems[j]) {
                    bought = true;
                }
            }
            if (shopItems[i].price > money) {
                var itemDiv = document.getElementById("item" + i);
                itemDiv.style.background = "red";
                var title = document.getElementById("title" + i);
                title.className = "shoptitle noselect";
                if (bought) {
                    itemDiv.style.background = "green";
                    title.className = "shoptitle noselect";
                    title.onclick = "";
                    if (itemDiv.lastChild.innerHTML != "Use") {
                        var useButton = document.createElement("h4");
                        useButton.innerHTML = "Use";
                        useButton.className = "shoptitle noselect menu_button";
                        (function (i) {
                            useButton.onclick = function () {
                                currentBoat = shopItems[i].imgPath;
                                boatImg.setAttribute("src", "Boats/"+shopItems[i].imgPath);
                                currentShootSound = shopItems[i].shootSound;
                                currentHitSound = shopItems[i].hitSound;
                                currentEffectName = shopItems[i].effectName;
                                currentShotImg = shopItems[i].shotImg;
                                currentAttack = shopItems[i].attack;
                            }
                        }) (i);
                        itemDiv.appendChild(useButton);
                    }
                }
                title.onclick = "";
            }
            else {
                var itemDiv = document.getElementById("item" + i);
                itemDiv.style.background = "";
                var title = document.getElementById("title" + i);
                title.className = "shoptitle noselect menu_button";
                if (bought) {
                    itemDiv.style.background = "green";
                    title.className = "shoptitle noselect";
                    title.onclick = "";
                    if (itemDiv.lastChild.innerHTML != "Use") {
                        var useButton = document.createElement("h4");
                        useButton.innerHTML = "Use";
                        useButton.className = "shoptitle noselect menu_button";
                        (function (i) {
                        useButton.onclick = function () {
                            currentBoat = shopItems[i].imgPath;
                            boatImg.setAttribute("src", "Boats/"+shopItems[i].imgPath);
                            currentShootSound = shopItems[i].shootSound;
                            currentHitSound = shopItems[i].hitSound;
                            currentEffectName = shopItems[i].effectName;
                            currentShotImg = shopItems[i].shotImg;
                            currentAttack = shopItems[i].attack;
                            }
                        })(i);
                        itemDiv.appendChild(useButton);
                    }
                }
                else {
                    (function (i) {
                        title.onclick = function () {
                            buyItem(i);
                        }
                    })(i);
                }
            }
        }
    }
    else {
        isShopOpen = false;
        shopMenu.style.display = "none";
        menu.style.display = "none";
        mainMenu.style.display = "block";
    }
}

function openSettings() {
    if (!isSettingsOpen) {
        settingsMenu.style.display = "block";
        settingsMenu.ondragstart = function () { return false; };
        menu.style.display = "none";
        mainMenu.style.display = "none";
        isSettingsOpen = true;
    }
    else {
        settingsMenu.style.display = "none";
        menu.style.display = "none";
        mainMenu.style.display = "block";
        isSettingsOpen = false;
    }
}

function resizeCanvas() {
    canvas.width = 0.53 * window.innerWidth;
    canvas.height = window.innerHeight;
    boatX = canvas.width / 2;
    boatY = canvas.height;
}

function play() {
    var waveNumber = 1;
    if (waveToStartText.value != "")
        waveNumber = parseInt(waveToStartText.value);
    if (waveNumber > waveRecord)
        waveNumber = waveRecord;
    else if (waveNumber <= 0)
        waveNumber = 1;
    move = true;
    attacks = 3;
    waterPlace = 0;
    startBackgroundSpeed = 0.2 + 0.05 * (waveNumber - 1);
    backgroundSpeed = startBackgroundSpeed;
    monstersToAdd = 5 + (waveNumber - 1);
    amountOfMonsters = 0;
    for (var i = 0; i < waveNumber; i++) {
        amountOfMonsters += 5+i;
    }
    killedMonsters = amountOfMonsters - 5 - waveNumber + 1;
    monsterIndex = killedMonsters;
    waveIndex = waveNumber;
    timeBetweenSpawns = 2500 - 50 * (waveNumber - 1);
    mainMenu.style.display = "none";
    circleArray.length = 0;
    spawnedBombs = 0;
    isGameOver = false;
    dy = 0.5 + 0.05 * (waveNumber - 1);;
    boatPos = -100;
    handle = setInterval(function () { pushCircle() }, timeBetweenSpawns);
    if (!isPlayingAudio) {
        playAudio();
    }
}
function toMenu() {
    move = false;
    backgroundSpeed = 0;
    menu.style.display = "none";
    mainMenu.style.display = "block";
    var moneyToAdd = Math.floor(score / 10);
    isGameOver = false;
    streak = 0;
    score = 0;
    money += moneyToAdd;
    clearInterval(handle);
    score = 0;
    monsterIndex = 0;
    killedMonsters = 0;
    monstersToAdd = 5;
    waveEnded = false;
    waveIndex = 1;
    amountOfMonsters = 5;
    timeBetweenSpawns = 2500;
    setCookie("beststreak", longestStreak);
    setCookie("money", money);
    setCookie("bestwave", waveRecord);
}

function help() {
    if (mainMenu.style.display == "none") {
        isHelpOpen = false;
        mainMenu.style.display = "block";
        helpMenu.style.display = "none";
    }
    else {
        isHelpOpen = true;
        mainMenu.style.display = "none";
        helpMenu.style.display = "block";
    }
}

var menu = document.getElementById("Menu");
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 27) {
        if (!isGameOver) {
            if (isShopOpen) {
                openShop();
            }
            else if (mainMenu.style.display == "none" && !isShopOpen && !isSettingsOpen && !isHelpOpen) {
                pauseGame();
            }
            else if (isSettingsOpen) {
                openSettings();
            }
            else if (isHelpOpen) {
                help();
            }
        }
    }
    if (event.keyCode == 13 && !isGameOver && mainMenu.style.display == "none" && !isShopOpen && !isSettingsOpen && move && attacks > 0) {
        poisoning = true;
    }
    
    for (var i = 0; i < circleArray.length; i++) {
        if (circleArray[i].type == 4) {
            if (circleArray[i].letters.length > 0 && move && circleArray[i].alive == true) {
                for (var j = 0; j < circleArray[i].letters.length; j++) {
                    if (circleArray[i].letters[j].letter.length > 0) {
                        if (String.fromCharCode(event.keyCode) == circleArray[i].letters[j].letter.toUpperCase()) {
                            lastTypedLetter = event.keyCode;
                            circleArray[i].letters[j].letter = "";
                            circleArray[i].killedLetters++;
                            var laser = new Audio("Audio/Shots/"+currentShootSound + ".mp3");
                            laser.volume = selectedVolume;
                            laser.play();
                            score += 1;
                            if (circleArray[i].killedLetters >= circleArray[i].amountOfLetters) {
                                bulletsArray.push(new Bullet(canvas.width / 2, canvas.height - 100, i, true, circleArray));
                            }
                            else {
                                bulletsArray.push(new Bullet(canvas.width / 2, canvas.height - 100, j, false, circleArray[i].letters));
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
            if (circleArray[activeWordIndex].alive != false && circleArray[activeWordIndex].text.length > 0) {
                if (String.fromCharCode(event.keyCode) == circleArray[activeWordIndex].text[0].toUpperCase()) {

                    streak++;
                    shoot = true;
                    var laser = new Audio("Audio/Shots/"+currentShootSound + ".mp3");
                    laser.volume = selectedVolume;
                    laser.play();
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
                else if (event.keyCode == 32) {
                    if (activeWordIndex >= 0) {
                        circleArray[activeWordIndex].textColor = 'white';
                        activeWordIndex = -5;
                    }
                }
                else {
                    streak = 0;
                }
            }
        }
    }
});