combos = {
    order: [1, 2, 3, 4],
    number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    shape: ["s", "t", "r", "c"],
    innerShape: ["s", "t", "r", "c"],
    shapeText: ["Square", "Triangle", "Rectangle", "Circle"],
    colorText: ["Red", "Blue", "Yellow", "Green", "Black", "Purple"]
}

shapes = {
    circle: [`<circle cx="80" cy="100" r="65" style="fill:blue" />`, 
            `<circle cx="240" cy="100" r="65" style="fill:blue" />`, 
            `<circle cx="400" cy="100" r="65" style="fill:blue" />`, 
            `<circle cx="560" cy="100" r="65" style="fill:blue" />`
        ],
    square: [`<rect width="130" height="130" x="15" y="35" style="fill:blue" />`,
            `<rect width="130" height="130" x="175" y="35" style="fill:blue" />`,
            `<rect width="130" height="130" x="335" y="35" style="fill:blue" />`,
            `<rect width="130" height="130" x="495" y="35" style="fill:blue" />`
        ],
    rectangle: [`<rect width="135" height="100" x="12" y="50" style="fill:blue" />`,
                `<rect width="135" height="100" x="172" y="50" style="fill:blue" />`,
                `<rect width="135" height="100" x="331" y="50" style="fill:blue" />`,
                `<rect width="135" height="100" x="492" y="50" style="fill:blue" />`
    ],
    triangle: [`<polygon points="80,30 150,160 10,160" style="fill:blue" />`,
               `<polygon points="240,30 310,160 170,160" style="fill:blue" />`,
               `<polygon points="400,30 470,160 330,160" style="fill:blue" />`,
               `<polygon points="560,30 630,160 490,160" style="fill:blue" />`
    ]
}

function bankerBackToMainMenu(){
    document.getElementById('mainmenu').style.display = "block"
    document.getElementById('bankerMinigame').style.display = "none"
}

function bankerhider(){
    document.getElementById('mainmenu').style.display = "none"
    document.getElementById('bankerMinigame').style.display = "block"
}

function bankStart(){
    generateCombo()
    displayCombo()
}

function displayCombo(){

}

function generateCombo(){
    for (const [key, _] of Object.entries(combos)) {
        combos[key] = randomOrder(combos[key])
      }

    return
}

function randomOrder(array){ 

    for (var i = 0; i < array.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (array.length - i));
        var temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    return array;
    
}