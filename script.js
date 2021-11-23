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
let equalsPressed = false;
let currentOperator = null;
let currentSecondNumber = null;


// event listeners
document.addEventListener("keydown", e => {
    // keyboard shortcuts
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
        currentSecondNumber = null;
        if (operatorPressed) {
            return;
        }
        else {
            operatorPressed = true;
            operation = makeOperation(Number(displayValue.join("")), id);
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

backspace.addEventListener("click", undo);


// event listener functions
function makeOperation(a, operator) {
    if (operator === "Ad") {
        currentOperator = "Ad";
        return b => a + b;
    }
    else if (operator === "Su") {
        currentOperator = "Su";
        return b => a - b;
    }
    else if (operator === "Mu") {
        currentOperator = "Mu";
        return b => a * b;
    }
    else if (operator === "Di") {
        currentOperator = "Di";
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
    let secondNumber = Number(displayValue.join(""));

    if (operation === null) {
        // should only work when there is an operation
        return;
    }
    else if (currentSecondNumber === null) {
        currentSecondNumber = secondNumber;
    }
    else if (equalsPressed) {
        // allows repeat operations
        secondNumber = currentSecondNumber;
    }
    else if (operatorPressed) {
        // shouldn't work if operator pressed with no second number
        return;
    }
    else {
        currentSecondNumber = null;
    }
    
    let result = operation(secondNumber);
    clearDisplay();

    if (isNaN(result)) {
        return;
    }
    else if (!Number.isFinite(result)) {
        displayNumbers[0].textContent = "Don't divide by zero!";
    }
    else {
        let resultArray = result.toString().split("")

        //account for sign and decimal in array
        if (!resultArray.includes("-")) {
            resultArray.unshift("");
        }
        if (!resultArray.includes(".")) {
            resultArray.push("");
        }

        //too big for display condition
        if (resultArray.length > (displayNumbers.length + 2)) {
            if (resultArray.includes(".")) {
                let resultHalved = result.toString().split(".");
                resultHalved[0] = resultHalved[0].split("");
                if (!resultHalved[0].includes("-")) {
                    resultHalved[0].unshift("");
                }
                if (resultHalved[0].length > (displayNumbers.length + 1)) {
                    displayNumbers[0].textContent = "Too big to display!";
                    operatorPressed = true;
                    equalsPressed = true;
                    return displayValue = [""];
                }
                else if (resultHalved[0].length === (displayNumbers.length+1)) {
                    result = Math.round(result);
                }
                else if (resultHalved[0].length < (displayNumbers.length+1)) {
                    let digitsToRound = (displayNumbers.length+1)
                             - resultHalved[0].length;
                    if (digitsToRound >= 8) {
                        // too small for display 
                        displayNumbers[0].textContent = "Too small to display!";
                        operatorPressed = true;
                        equalsPressed = true;
                        return displayValue = [""];
                    }
                    result = Math.round(result*digitsToRound*10)/
                            (digitsToRound*10);
                }
                resultArray = result.toString().split("");

                //code that displays the number properly
                if (resultArray.includes("-")) {
                    signDisplay.textContent = resultArray.shift();
                    displayValue[0] = signDisplay.textContent;
                }
                if (resultArray.includes(".")) {
                    let index = resultArray.indexOf(".");
                    resultArray[index - 1] += "."
                    resultArray.splice(index, 1);
                }
                for (let i = 0; i < displayNumbers.length; i++) {
                    displayNumbers[i].textContent = resultArray[i];
                    displayValue.push(resultArray[i]);
                }
                operation = makeOperation(result, currentOperator);
            }
            else {
                displayNumbers[0].textContent = "Too big to display!";
                operatorPressed = true;
                equalsPressed = true;
                return displayValue = [""];
            }
        }
        else {
            //code that displays the number properly
            signDisplay.textContent = resultArray.shift();
            displayValue[0] = signDisplay.textContent;
            if (resultArray.includes(".")) {
                let index = resultArray.indexOf(".");
                resultArray[index - 1] += "."
                resultArray.splice(index, 1);
            }
            else {
                resultArray.pop();
            }
            for (let i = 0; i < displayNumbers.length; i++) {
                displayNumbers[i].textContent = resultArray[i];
                displayValue.push(resultArray[i]);
            }
            operation = makeOperation(result, currentOperator);
        }
    }
    operatorPressed = true;
    equalsPressed = true;
}

function addNumberToDisplay(id) {
    let displayNumbers = document.querySelectorAll(".numberDisplay");
    displayNumbers = Array.from(displayNumbers);

    // after operation clear
    if (operatorPressed){
        clearDisplay();
        operatorPressed = false;
        equalsPressed = false;
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
        return;
    }
    if (displayValue.length === 1) {
        displayNumbers[0].textContent = "0.";
        return displayValue.push("0.");
    }
    else if (displayValue[1].includes("0.")){
        displayNumbers[0].textContent = "0";
        return displayValue = [""];
    }
    
    // when numbers are already on display
    for (let i = 1; i < displayNumbers.length; i++) {
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

function undo() {
    let displayNumbers = document.querySelectorAll(".numberDisplay");
    displayNumbers = Array.from(displayNumbers);

    if (displayValue.length > 2) {
        for (i = 1; i < displayNumbers.length; i++) {
            if (displayNumbers[i].textContent === "") {
                if (displayNumbers[i-1].textContent.includes(".")) {
                    let lastNumber = displayNumbers[i-1].textContent
                            .split("")[0];
                    displayNumbers[i-1].textContent = lastNumber;
                    displayValue.pop();
                    return displayValue.push(lastNumber);
                }
                else {
                    displayNumbers[i-1].textContent = "";
                    return displayValue.pop();
                }
            }
        }
        displayNumbers[displayNumbers.length-1].textContent = "";
        return displayValue.pop();
    }
    else {
        if (displayNumbers[0].textContent.includes("0.")) {
            let lastNumber = displayNumbers[0].textContent.split("")[0];
            displayNumbers[0].textContent = lastNumber;
            return displayValue.pop();
        }
        else if (displayNumbers[0].textContent.includes(".")) {
            let lastNumber = displayNumbers[0].textContent.split("")[0];
            displayNumbers[0].textContent = lastNumber;
            displayValue.pop();
            return displayValue.push(lastNumber);
        }
        else {
            displayNumbers[0].textContent = "0";
            return displayValue = [""];
        }
    }
}
