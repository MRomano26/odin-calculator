let add = (a, b) => a + b;
let subtract = (a, b) => a - b;
let multiply = (a, b) => a * b;
let divide = (a, b) => a / b;

function operate(a, b, operator) {
    if (operator === "+") {
        return add(a, b);
    }
    else if (operator === "-") {
        return subtract(a, b);
    }
    else if (operator === "*") {
        return multiply(a, b);
    }
    else if (operator === "/") {
        return divide(a, b);
    }
    else {
        return;
    }
}


// button elements
const numbers = document.querySelectorAll(".number");
const negative = document.querySelector("#NEG")
const decimal = document.querySelector("#DECI")

let displayValue = [""]


// event listeners added
numbers.forEach((number) => {
    let id = number.id;
    number.addEventListener("click", e => {
        addNumberToDisplay(id);
    })
})

negative.addEventListener("click", e => {
    // changes sign on display
    let signDisplay = document.querySelector(".signDisplay");
    if (signDisplay.textContent === "") {
        signDisplay.textContent = "-";
    }
    else {
        signDisplay.textContent = "";
    }
    return displayValue[0] = signDisplay.textContent;
})

decimal.addEventListener("click", addDecimalToDisplay)


// event listener functions
function addNumberToDisplay(id) {
    let displayNumbers = document.querySelectorAll(".numberDisplay");
    displayNumbers = Array.from(displayNumbers);
    for (let i = 0; i < displayNumbers.length; i++) {
        if (displayNumbers[i].textContent !== "") {
            continue;
        }
        else {
            displayNumbers[i].textContent = `${id}`;
            displayValue.push(displayNumbers[i].textContent)
            return console.log(displayValue.join(""));
        }
    }
    return console.log(displayValue.join(""))
}

function addDecimalToDisplay() {
    let displayNumbers = document.querySelectorAll(".numberDisplay");
    displayNumbers = Array.from(displayNumbers);

    // fresh display condition
    if (displayNumbers[0].textContent === "") {
        return;
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