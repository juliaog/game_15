var myArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
var positions = [];
var movable = [];//массив блоков,которые можно передвигать
var course = document.getElementById('result');
var count = 0;
var emptyPos;
var myTimer;
var winBlock = document.getElementById('win-block');
var newGame = document.querySelector('.new-game');
var timeSec = document.getElementById("seconds");
var timeMin = document.getElementById("minutes");
var minWin= document.getElementById('minutes-win');
var secWin= document.getElementById('seconds-win');
var courseWin = document.getElementById('result-win');

initialize();

function shuffle(arr) {
    var j, temp;
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * arr.length);
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function initialize() {
    shuffle(myArr);
    console.log(myArr);

    var block = document.getElementById('block');
    var b, number;

    for (var position = 1; position <= 16; position++) {

        number = myArr[position - 1];
        b = document.createElement('div');
        b.className = 'sell';

        if (number === null) {
            b.className += ' empty-sell';
            emptyPos = position;
        } else {
            b.innerText = number;
            positions[number] = position;
            b.addEventListener('click', elementClick);
        }
        block.appendChild(b);
    }
    console.log(positions);
}

function updateMovable() {
    var column = emptyPos % 4;
    var row = Math.ceil(emptyPos / 4);
    movable = [];

    if (column !== 1) {
        movable.push(emptyPos - 1);
    }
    if (column !== 0) {
        movable.push(emptyPos + 1);
    }
    if (row !== 1) {
        movable.push(emptyPos - 4);
    }
    if (row !== 4) {
        movable.push(emptyPos + 4);
    }
    console.log(movable);
}

function getCurrentTranslate(element, axis) {
    var translateString = element.style.transform;
    if (translateString === '') {
        return 0;
    }

    var value = translateString
        .replace(/[^0-9,-.]/g, '')
        .split(',')
    ;

    if (axis === 'X') {
        value = value[0];
    } else {
        value = value[1];
    }

    return parseInt(value, 10);
}

function elementClick() {
    var positionKnow = positions[this.innerText];
    updateMovable();
    if (movable.indexOf(positionKnow) === -1) {
        console.log('Перемещение невозможно!');
        var el = this;
        el.classList.add("animate");
        setTimeout(function () {
            el.classList.remove("animate");
        }, 500);
    } else {
        var axis, add;

        if (emptyPos - positionKnow === 1) {
            console.log('Право');
            axis = 'X';
            add = true;
        } else if (emptyPos - positionKnow === -1) {
            console.log('Лево');
            axis = 'X';
            add = false;
        } else if (emptyPos - positionKnow === 4) {
            console.log('Вниз');
            axis = 'Y';
            add = true;
        } else if (emptyPos - positionKnow === -4) {
            console.log('Вверх');
            axis = 'Y';
            add = false;
        }

        var currentTranslateX = getCurrentTranslate(this, 'X');
        var currentTranslateY = getCurrentTranslate(this, 'Y');

        var modification = this.clientWidth * 1.1;
        if (add !== true) {
            modification *= -1;
        }

        console.log(currentTranslateX, currentTranslateY);
        console.log(modification, axis);

        if (axis === 'X') {
            currentTranslateX += modification;
        } else {
            currentTranslateY += modification;
        }

        this.style.transform = 'translate' + '(' + currentTranslateX + 'px,' + currentTranslateY + 'px)';
        this.style.transition = '1s';
        positions[this.innerText] = emptyPos;
        emptyPos = positionKnow;
        count++;
        course.innerText = count.toString();


        if (count === 1) {
            var sec = 0;
            function pad(val) {
                return val > 9 ? val : "0" + val;
            }
                myTimer = setInterval(function () {
                    timeSec.innerHTML = pad(++sec % 60);
                    timeMin.innerHTML = pad(Math.floor(sec / 60));
                }, 1000);
            }

        if (checkWin()) {
            clearInterval(myTimer);
            winBlock.style.display = 'inline-block';
            courseWin.innerText = count.toString();
            minWin.innerText = timeMin.innerHTML;
            secWin.innerText = timeSec.innerHTML;
            newGame.style.display = 'inline-block';
            newGame.addEventListener('click', clear);
        }

        console.log(this.style.transform);
        console.log(course.innerText);
    }

}

function checkWin() {
    for (var i = 1; i <= 15; i++) {
        if (positions[i] !== i) {//вернет позицию цифры 1, блок,который пишет кол-во ходов,и время, остановить таймер
            return false;
        }
    }

    return true;
}
function clear(){
    newGame.style.display = 'none';
    winBlock.style.display = 'none';
    shuffle(myArr);
    count = 0;
    course.innerText = count.toString();
    timeSec.innerText = '00';
    timeMin.innerText = '00';
}
