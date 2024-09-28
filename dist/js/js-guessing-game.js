"use strict";
/**
 *
 * JavaScript Guessing Game V2.0.0
 * Author:  Tracy Ridge
 * URL: https://www.worldoweb.co.uk/
 * Part 1 - Page URL: https://wp.me/poe8j-3uC
 * Part 2 - Page URL: https://wp.me/poe8j-3wO
 * Part 3 - Page URL: https://wp.me/poe8j-4dn
 */
const max = 100;
const min = 1;
const currentLevel = localStorage.getItem("level");
const level_arr = ["10", "5", "2"];
/**
 * Manages the state of the levels
 */
let diff = currentLevel !== null && currentLevel !== void 0 ? currentLevel : "5";
const level = {
    _difficulty: diff,
};
Object.defineProperty(level, "difficulty", {
    get: function () {
        return this._difficulty;
    },
    set: function (value) {
        this._difficulty = value;
    },
});
/**
 * Shorthand Get Element By ID
 */
const getID = (id) => {
    return document.getElementById(id);
};
/**
 * Executes on browser load. Saves computer guess to browser session if not set.
 */
window.onload = () => {
    const guessInput = getID("guess");
    if (guessInput !== null) {
        guessInput.focus();
    }
    setLevelActive();
    generateComputerGuess();
};
/**
 * Manages the switching of the difficulty buttons, it's state and saves to local storage
 */
const setLevelActive = () => {
    let btnLevel = document.querySelectorAll(".btn-level");
    if (currentLevel !== null) {
        let levelIndex = level_arr.findIndex((value) => value === currentLevel);
        btnLevel[levelIndex].classList.add("is-active");
    }
    else {
        btnLevel[1].classList.add("is-active");
        localStorage.setItem("level", level._difficulty);
    }
    btnLevel.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const totalGuesses = countGuesses();
            btnLevel === null || btnLevel === void 0 ? void 0 : btnLevel.forEach((btn) => btn.classList.remove("is-active"));
            e.target.classList.add("is-active");
            let value = e.target.textContent;
            switch (value) {
                case "Easy":
                    level._difficulty = "10";
                    break;
                case "Medium":
                    level._difficulty = "5";
                    break;
                case "Hard":
                    level._difficulty = "2";
                    break;
            }
            localStorage.setItem("level", level._difficulty);
            if (totalGuesses > level._difficulty) {
                notify("You have already had more guesses than the difficulty chosen. Choose another level or your game will end!");
            }
        });
    });
};
/**
 * Generates the computer guess
 */
const generateComputerGuess = () => {
    let genGuess = Math.floor(Math.random() * (max - min) + min), arr = ["computer-guess", genGuess], session = getSession(arr);
    if (session === null) {
        addToSession(arr);
    }
};
/**
 * Stores data in sessionStorage. Merges data if already exists
 */
const addToSession = (item) => {
    //Check if a session is set
    let session = getSession(item), data = [], store = item[0], saveData = item[1], sessionData = [];
    data.push(saveData);
    // If the session return nothing
    if (session === null) {
        //create for the first time
        sessionData = data;
    }
    else {
        //grab data and merge
        session.push(data);
        sessionData = session;
    }
    sessionStorage.setItem(store, JSON.stringify(sessionData.flat()));
};
/**
 * Get data out of session storage
 */
const getSession = (item) => {
    var _a;
    let store = (_a = item[0]) !== null && _a !== void 0 ? _a : "";
    const storedItem = sessionStorage.getItem(store);
    return storedItem !== null ? JSON.parse(storedItem) : null;
};
/**
 * Checks the user submitted number against the generated one
 */
const checkGuess = (guess) => {
    addToSession(guess);
    // Get user generated number
    let generatedNumber = getSession(["computer-guess", null]), message = getID("message"), total_guesses = countGuesses();
    if (total_guesses < parseInt(level._difficulty)) {
        if (parseInt(guess[1]) !== generatedNumber[0]) {
            higherOrLower(message, guess[1], generatedNumber[0]);
            return;
        }
        else if (message !== null) {
            message.innerText =
                "Jackpot, you won. You guessed it within " + total_guesses + " tries";
        }
    }
    else {
        notify("You lose, you have reached the maximum guesses.");
    }
    clearSession();
};
/**
 * Checks to see if your number matches the computer one
 */
const higherOrLower = (message, num, num2) => {
    if (message !== null) {
        if (parseInt(num) > num2) {
            message.innerText = "You need to go lower 👇";
        }
        else {
            message.innerText = "You need to go higher ☝️";
        }
    }
};
/**
 * Counts the user guesses
 */
const countGuesses = () => {
    let userGuess = getSession(["user-guess", null]), guesses = userGuess !== null ? userGuess.length : 0;
    return guesses;
};
/**
 * Starts a new game by clearing a session and reloading the page
 */
const clearSession = () => {
    setTimeout(() => {
        sessionStorage.clear();
        location.reload();
    }, 5000);
};
/**
 * Displays the user guesses in a tag format
 */
const displayGuesses = () => {
    let guess = getSession(["user-guess", null]);
    let tagsElement = getID("tags");
    if (guess !== null && tagsElement !== null) {
        tagsElement.textContent = "";
        guess.forEach((item) => {
            let span = document.createElement("span"), text = document.createTextNode(item);
            span.classList.add("tag");
            span.appendChild(text);
            tagsElement.appendChild(span);
        });
    }
};
/**
 * Create notifications
 */
const notify = (msg) => {
    let notification = document.createElement("div");
    let deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", removeNotification);
    deleteButton.className = "delete";
    notification.className = "notification";
    notification.textContent = msg;
    notification.prepend(deleteButton);
    const heroHead = document.querySelector(".notify");
    if (heroHead !== null) {
        heroHead.appendChild(notification);
    }
};
/**
 * Removes notifications
 */
const removeNotification = () => {
    let notification = document.querySelectorAll(".notification");
    notification.forEach((item) => {
        item.remove();
    });
};
/*
 * Adds event listener to the submit button
 */
const btnElement = getID("btn");
if (btnElement !== null) {
    btnElement.addEventListener("click", (e) => {
        e.preventDefault();
        let userGuess = getID("guess"), usrArr = [], data = getSession(["user-guess", null]);
        if (parseInt(userGuess.value) < min || parseInt(userGuess.value) > max) {
            notify(`Please enter a number between ${min} and ${max}`);
            return;
        }
        if (userGuess !== null && userGuess.value === "") {
            notify("Please enter a number");
            return;
        }
        if (data === null || data === void 0 ? void 0 : data.includes(userGuess.value)) {
            notify("Number already picked");
            return;
        }
        usrArr = ["user-guess", userGuess.value];
        checkGuess(usrArr);
        displayGuesses();
        userGuess.value = "";
    });
}
