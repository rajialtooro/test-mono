// ? Automate create words and chars
var NUMBER_OF_TRIES = 6;
var NUMBER_OF_CHARS = 6;

var wordsDiv = document.getElementById('words');

for (var i = 0; i < NUMBER_OF_TRIES; i++) {
    var newEmptyWord = document.createElement('div');
    newEmptyWord.className = 'word'

    for (let j = 0; j < NUMBER_OF_CHARS; j++) {
        var newEmptyChar = document.createElement('div')
        newEmptyChar.className = 'char'
        newEmptyWord.appendChild(newEmptyChar)
    }

    wordsDiv.appendChild(newEmptyWord);
}

// ? listen to keyboard
var currentWord = 0;
var currentChar = 0;

document.addEventListener('keydown', async function (event) {
    var wordDiv = wordsDiv.children[currentWord]
    if (event.code == "Backspace") {
        if (currentChar > 0) {
            var charDiv = wordDiv.children[currentChar - 1]
            charDiv.innerHTML = "";
            animateCSS(charDiv, 'wobble')
            currentChar--;
        }
    }
    else if (event.code == "Enter") {
        if (currentChar == NUMBER_OF_CHARS) {
            var result = await guess(getCurrentWord())
            for (var i = 0; i < result.length; i++) {
                if (result[i] == 1) {
                    wordDiv.children[i].style.background = "green"

                } else if (result[i] == 0) {
                    wordDiv.children[i].style.background = "yellow"
                } else {
                    wordDiv.children[i].style.background = "grey"
                }
                await animateCSS(wordDiv.children[i], 'flipInX');
            }
            currentChar = 0;
            currentWord++;
        } else {
            animateCSS(wordDiv, 'headShake')
        }
        // ? here we will send requests to the server

    } else if (currentChar < NUMBER_OF_CHARS) {
        var charDiv = wordDiv.children[currentChar]
        charDiv.innerHTML = event.key;
        animateCSS(charDiv, 'wobble')
        currentChar++;
    } else {
        animateCSS(wordDiv, 'headShake')
    }

})

// ? Extracts the characters from the divs
function getCurrentWord() {
    var word = "";
    var wordDiv = wordsDiv.children[currentWord]
    for (var i = 0; i < wordDiv.children.length; i++) {
        word = word + wordDiv.children[i].innerHTML;
    }
    return word;
}

// ? Sends requests to the backend to the route /guess/:word
async function guess(word) {
    try {
        var request = await fetch('/guess/' + word)
        var result = await request.json()
        return result
    } catch (error) {
        console.log(error)
    }

}



// ! supply this to the loopers, might be hard to understand
function animateCSS(element, animation, prefix = 'animate__') {
    // We create a Promise and return it
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;


        element.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            element.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        element.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
}