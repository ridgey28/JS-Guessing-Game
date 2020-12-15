/**
 * 
 * JavaScript Guesing Game V1.0
 * Author:  Tracy Ridge
 * URL: https://www.worldoweb.co.uk/
 * Page URL: 
 */

 /**
  * Executes on browser load. Saves computer guess to browser session if not set.
  */
window.onload = () => {
    let genGuess = randomNumber(1, 100),
        arr = ['computer-guess', genGuess],

        //Check to see if a session has been set
        session = getSession(arr);
    //If it hasn't generate a random number and store it
    if (session === null) {
        addToSession(arr);
    }
}
/**
 * Generates a random number for generated guess
 *
 * @param   {int}  min
 * @param   {int}  max
 *
 * @return  {int}
 */
let randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
/**
 * Stores data in sessionStorage. Merges data if already exists
 *
 * @param {array}
 */
let addToSession = item => {
    //Check if a session is set
    let session = getSession(item),
        data = [],
        store = item[0],
        saveData = item[1];
    data.push(saveData);
    // If the session return nothing
    if (session === null) {
        //create for the first time
        sessionStorage.setItem(store, JSON.stringify(data.flat()));
    } else { //grab data and merge
        session.push(data);
        sessionStorage.setItem(store, JSON.stringify(session.flat()));
    }
}
/**
 * Get data out of session storage
 *
 * @param {array}
 * 
 * @return {object || null}
 */
let getSession = item => {
    let store = item[0];
    if (sessionStorage.getItem(store) !== null) {
        let data = sessionStorage.getItem(store);
        return JSON.parse(data);
    } else {
        return null;
    }
}
/**
 * Checks the user submitted number against the generated one
 *
 * @param {array}
 * 
 */
let checkGuess = guess => {
    // Get user generated number
    let generatedNumber = getSession(['computer-guess', null]),
        message = document.getElementById('message');

    if (parseInt(guess[1]) === generatedNumber[0]) {
        message.innerText = "Jackpot, you won";
        setTimeout(() => {
            sessionStorage.clear();
            location.reload();
        }, 5000);
    } else {
        if (parseInt(guess[1]) > generatedNumber[0]) {
            message.innerText = "You need to go lower";
        } else {
            message.innerText = "You need to go higher";
        }
        addToSession(guess);
    }
    displayGuesses();
}
/**
 * Displays the amount of user guesses
 */
let displayGuesses = () => {
    let userGuess = getSession(['user-guess', null]);

    if (userGuess !== null) {
        let guess = userGuess;
        document.getElementById("tags").textContent = '';
        guess.forEach(item => {
            let span = document.createElement('span'),
            text = document.createTextNode(item);
            span.classList.add("tag");
            span.appendChild(text);
            document.getElementById("tags").appendChild(span);
        });
    }
}
/*
*  Adds event listener to the submit button
*/
document.getElementById('btn').addEventListener('click', e => {
    e.preventDefault();

    let userGuess = document.getElementById('guess'),
        usr_array = ['user-guess', userGuess.value];
    checkGuess(usr_array);
    userGuess.value = '';
});