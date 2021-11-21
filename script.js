// button elements
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator")
const clearEntry = document.querySelector("#CE")
const clear = document.querySelector("#C")
const backspace = document.querySelector("#BACK")
const negative = document.querySelector("#NEG");
const decimal = document.querySelector("#De");
const equal = document.querySelector("#En");

// global variables
let displayValue = [""];
let operation = null;
let operatorPressed = false;


// event listeners
document.addEventListener("keydown", e => {
    console.log(e.code);
    if (e.code === "Delete") {
        clearEntry.click();
    }
    else if (e.code === "Escape") {
        clear.click();
    }
    else if (e.code === "Backspace") {
        backspace.click();
    }
    else if (e.code === "F9") {
        negative.click();
    }
    else if (e.code.includes("Numpad")) {
        if (e.code.length === 7) {
            document.querySelector(`#N${e.code.substr(6)}`).click();
        }
        else {
            document.querySelector(`#${e.code.substr(6, 2)}`).click();
        }
    }
    else {
        // normal for other buttons
        return;
    }
    e.preventDefault();
})

numbers.forEach((number) => {
    let id = number.id[1];
    number.addEventListener("click", e => {
        addNumberToDisplay(id);
    });
})

operators.forEach(operator => {
    let id = operator.id;
    operator.addEventListener("click", e => {
        if (operation === null) {
            operatorPressed = true;
            operation = makeOperation(Number(displayValue.join("")), id);
        }
        else {
            // maybe i'll add something for multiple operators pressed
            return;
        }
    })
})

clearEntry.addEventListener("click", clearDisplay);

clear.addEventListener("click", e => {
    operation = null;
    clearDisplay();
});

negative.addEventListener("click", changeSign);

decimal.addEventListener("click", addDecimalToDisplay);

equal.addEventListener("click", equalOperator);


// event listener functions
function makeOperation(a, operator) {
    if (operator === "Ad") {
        return b => a + b;
    }
    else if (operator === "Su") {
        return b => a - b;
    }
    else if (operator === "Mu") {
        return b => a * b;
    }
    else if (operator === "Di") {
        return b => a / b;
    }
    else {
        return;
    }
}

function equalOperator() {
    let displayNumbers = document.querySelectorAll(".numberDisplay");
    displayNumbers = Array.from(displayNumbers);
    let signDisplay = document.querySelector(".signDisplay");

    if (operation === null || operatorPressed) {
        // should only work when there is a second value
        return;
    }
    let secondNumber = Number(displayValue.join(""));
    let result = operation(secondNumber);
    clearDisplay();

    if (isNaN(result)) {
        return;
    }
    else if (!Number.isFinite(result)) {
        displayNumbers[0].textContent = "Don't divide by zero!";
        operatorPressed = true;
    }
    else {
        let resultArray = result.toString().split("")
        if (resultArray.length > displayNumbers.length) {
            // too big
            console.log("too big")
        }
        else {
            if (resultArray[0] === "-") {
                signDisplay.textContent = resultArray.shift();
                displayValue[0] = "-";
            }
            for (let i = 0; i < displayNumbers.length; i++) {
                displayNumbers[i].textContent = resultArray[i];
                displayValue.push(resultArray[i]);
            }
            operation = null;
            operatorPressed = true;
        }
    }
}

function addNumberToDisplay(id) {
    let displayNumbers = document.querySelectorAll(".numberDisplay");
    displayNumbers = Array.from(displayNumbers);

    // after operation clear
    if (operatorPressed){
        clearDisplay();
        operatorPressed = false;
    }

    // fresh display condition
    if (displayNumbers[0].textContent === "0") {
        if (id == 0) {
            return;
        }
        displayNumbers[0].textContent = `${id}`;
        displayValue.push(displayNumbers[0].textContent);
        return console.log(displayValue.join(""));
    }

    for (let i = 1; i < displayNumbers.length; i++) {
        if (displayNumbers[i].textContent !== "") {
            continue;
        }
        else {
            displayNumbers[i].textContent = `${id}`;
            displayValue.push(displayNumbers[i].textContent);
            return console.log(displayValue.join(""));
        }
    }
    return console.log(displayValue.join(""));
}

function clearDisplay() {
    displayValue = [""]
    let signDisplay = document.querySelector(".signDisplay");
    let displayNumbers = document.querySelectorAll(".numberDisplay");
    displayNumbers = Array.from(displayNumbers);
    signDisplay.textContent = "";
    displayNumbers[0].textContent = "0";
    for (let i = 1; i < displayNumbers.length; i++) {
        displayNumbers[i].textContent = "";
    }
}

function changeSign() {
    // changes sign on display
    let signDisplay = document.querySelector(".signDisplay");

    // after operation clear
    if (operatorPressed){
        return;
    }

    if (signDisplay.textContent === "") {
        signDisplay.textContent = "-";
    }
    else {
        signDisplay.textContent = "";
    }
    return displayValue[0] = signDisplay.textContent;
}

function addDecimalToDisplay() {
    let displayNumbers = document.querySelectorAll(".numberDisplay");
    displayNumbers = Array.from(displayNumbers);

    // after operation clear
    if (operatorPressed){
        clearDisplay();
        operatorPressed = false;
    }

    // when numbers are already on display
    for (let i = 0; i < displayNumbers.length; i++) {
        if (displayNumbers[i].textContent !== "") {
            if (displayNumbers[i].textContent.includes(".")) {
                if (displayNumbers[i + 1].textContent === "") {
                    let lastNumber = displayNumbers[i].textContent.split("")[0];
                    displayNumbers[i].textContent = lastNumber;
                    displayValue.pop();
                    displayValue.push(lastNumber);
                    return console.log(displayValue.join("")); 
                }
                // nothing happens if decimal is in middle of value
                return;
            }
            else {
                continue;
            }
        }
        else {
            let lastNumber = displayNumbers[i - 1].textContent + ".";
            displayNumbers[i - 1].textContent = lastNumber;
            displayValue.pop();
            displayValue.push(lastNumber);
            return console.log(displayValue.join("")); 
        }
    }
}