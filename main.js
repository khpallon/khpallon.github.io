let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
let leftkeyboard = 'qwerasdfzxcv'.split('');
let rightkeyboard = 'tyuighjkbnmopl'.split('');

let keyCombo = [];
let up = 0;
let setTime = 10;
let letters = 10;
let gameTimer;
let timeout;
let timeToTimeout;



document.addEventListener('DOMContentLoaded', (event) => {
    let slider = document.getElementById('slider');
    let letterSlider = document.getElementById('letterSlider')
    let letterValue = document.getElementById('letterValue')
    let value = document.getElementById('radialValue');

    slider.addEventListener('input', () => {
    value.textContent = "Time: " + slider.value;
});
    letterSlider.addEventListener('input', () => {
        letterValue.textContent = "Letters: " + letterSlider.value;
    });
});


function randomizeLetters(charCombo){

    for (let ind = 0; ind < letters; ind++){
        let key = charCombo[Math.floor(Math.random() * charCombo.length)]
        keyCombo.push(key); 
        let character = htmlToElement(`<p id="${ind}" class="letter">${key.toUpperCase()}</p>`)
        document.getElementById("letterContainer").appendChild(character)
    }
    window.addEventListener('keyup', pressed)
    document.getElementById('timer').innerHTML = setTime;
    gameTimer = setInterval(timer, 1000)

    timeout = setTimeout(function(){
        clearInterval(gameTimer)
        document.getElementById('timer').innerHTML = 0;
        failGame();
    }, setTime * 1000)
}

function pressed(event){
    if (event.key === keyCombo[0]){
        keyCombo.splice(0, 1)
        this.document.getElementById(up).style.backgroundColor = "#18a78a";
        up++
        if(keyCombo.length === 0){
            restart();
        }
    } else {
        failGame()
    }
}

function timer(){
    setTime--
    document.getElementById('timer').innerHTML = setTime;
}

function failGame(){
    this.document.getElementById(up).style.backgroundColor = "#cc3838";
    this.document.getElementById("whole").style.filter = "brightness(30%)"
    window.removeEventListener('keyup', pressed)
    clearInterval(gameTimer)
    clearTimeout(timeout)
}

function restart(){
    const letterType = document.getElementById('letterType').value;
    const charCombo = setAlphabet(letterType);
    document.getElementById("letterContainer").innerHTML = "";
    window.removeEventListener('keyup', pressed)
    this.document.getElementById("whole").style.filter = "brightness(100%)"
    up = 0;
    keyCombo = [];
    setTime = document.getElementById('slider').value;
    letters = document.getElementById('letterSlider').value;
    
    clearInterval(gameTimer)
    clearTimeout(timeout)
    randomizeLetters(charCombo);
    
}

function setAlphabet(letterType){
    if (letterType === "left"){
        return leftkeyboard;
    } else if (letterType === "right"){
        return rightkeyboard;
    } else if (letterType === "all"){
        return alphabet;
    }
}


function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); 
    template.innerHTML = html;
    return template.content.firstChild;
}