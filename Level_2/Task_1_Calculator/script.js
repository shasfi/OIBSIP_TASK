let display = document.getElementById("display");
let buttons = document.querySelectorAll(".btn");
let clear = document.getElementById("clear");
let equal = document.getElementById("equal");

let currentInput = "";

// Button clicks
buttons.forEach(button => {
    button.addEventListener("click", () => {
        let value = button.getAttribute("data-value");
        if (value) {
            currentInput += value;
            display.innerText = currentInput;
        }
    });
});

// Equal Button
equal.addEventListener("click", () => {
    calculate();
});

// Clear Button
clear.addEventListener("click", () => {
    currentInput = "";
    display.innerText = "";
});

// Keyboard Support
document.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || ["+", "-", "*", "/", "."].includes(e.key)) {
        currentInput += e.key;
        display.innerText = currentInput;
    }
    else if (e.key === "Enter") {
        calculate();
    }
    else if (e.key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
        display.innerText = currentInput;
    }
    else if (e.key.toLowerCase() === "c") {
        currentInput = "";
        display.innerText = "";
    }
});

// Function to calculate
function calculate() {
    try {
        let result = eval(currentInput);
        display.innerText = result;
        currentInput = result.toString();
    } catch {
        display.innerText = "Error";
        currentInput = "";
    }
}
