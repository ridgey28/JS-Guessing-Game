/**
 *
 * JavaScript Guesing Game V1.1
 * Author:  Tracy Ridge
 * URL: https://www.worldoweb.co.uk/
 * Part 1 - Page URL: https://wp.me/poe8j-3uC
 * Part 2 - Page URL: https://wp.me/poe8j-3wO
 */

/**
 * Executes on browser load. Saves computer guess to browser session if not set.
 */
window.onload = () => {
	let genGuess = randomNumber(1, 100),
		arr = ["computer-guess", genGuess],
		//Check to see if a session has been set
		session = getSession(arr);
	displayGuesses();
	//If it hasn't generate a random number and store it
	if (session === null) {
		addToSession(arr);
	}
};
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
};
/**
 * Stores data in sessionStorage. Merges data if already exists
 *
 * @param {array}
 */
let addToSession = (item) => {
	//Check if a session is set
	let session = getSession(item),
		data = [],
		store = item[0],
		saveData = item[1],
		sessionData = [];
	data.push(saveData);
	// If the session return nothing
	if (session === null) {
		//create for the first time
		sessionData = data;
	} else {
		//grab data and merge
		session.push(data);
		sessionData = session;
	}
	sessionStorage.setItem(store, JSON.stringify(sessionData.flat()));
};
/**
 * Get data out of session storage
 *
 * @param {array}
 *
 * @return {object || null}
 */
let getSession = (item) => {
	let store = item[0],
		data =
			sessionStorage.getItem(store) !== null
				? JSON.parse(sessionStorage.getItem(store))
				: null;
	return data;
};
/**
 * Checks the user submitted number against the generated one
 *
 * @param {array}
 *
 */
let checkGuess = (guess) => {
	addToSession(guess);
	// Get user generated number
	let generatedNumber = getSession(["computer-guess", null]),
		message = document.getElementById("message"),
		total_guesses = countGuesses();
	if (parseInt(guess[1]) === generatedNumber[0]) {
		message.innerText =
			"Jackpot, you won. You guessed it within " + total_guesses + " tries";
		clearSession();
	} else if (total_guesses === 5) {
		message.innerText = "You lose, you have reached the maximum guesses.";
		clearSession();
	} else {
		higherOrLower(message, guess[1], generatedNumber[0]);
	}
};
/**
 * Checks to see if your number matches the computer one
 *
 * @param   {string}  num   user guess
 * @param   {int}  num2  computer guess
 *
 * @return  {object}     Insert message into parent container
 */
let higherOrLower = (message, num, num2) => {
	if (parseInt(num) > num2) {
		message.innerText = "You need to go lower";
	} else {
		message.innerText = "You need to go higher";
	}
};
/**
 * Counts the user guesses
 *
 * @return  {int}
 */
let countGuesses = () => {
	let userGuess = getSession(["user-guess", null]),
		guesses = userGuess !== null ? userGuess.length : 0;
	return guesses;
};

/**
 * Starts a new game by clearing a session and reloading the page
 *
 */
let clearSession = () => {
	setTimeout(() => {
		sessionStorage.clear();
		location.reload();
	}, 10000);
};

/**
 * Displays the user guesses in a tag format
 *
 */
let displayGuesses = () => {
	let guess = getSession(["user-guess", null]);
	if (guess !== null) {
		document.getElementById("tags").textContent = "";
		guess.forEach((item) => {
			let span = document.createElement("span"),
				text = document.createTextNode(item);
			span.classList.add("tag");
			span.appendChild(text);
			document.getElementById("tags").appendChild(span);
		});
	}
};
/*
 *  Adds event listener to the submit button
 */
document.getElementById("btn").addEventListener("click", (e) => {
	e.preventDefault();

	let userGuess = document.getElementById("guess"),
		usr_array = ["user-guess", userGuess.value];

	checkGuess(usr_array);
	displayGuesses();
	userGuess.value = "";
});
