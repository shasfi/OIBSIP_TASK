document.getElementById("convertBtn").addEventListener("click", convertTemp);

function convertTemp() {
    const tempInput = document.getElementById("temperature").value;
    const unit = document.getElementById("unit").value;
    const result = document.getElementById("result");

    // Validation
    if (tempInput === "" || isNaN(tempInput)) {
        result.innerHTML = "⚠️ Please enter a valid number!";
        return;
    }

    const temp = parseFloat(tempInput);
    let converted = "";

    if (unit === "celsius") {
        const f = (temp * 9 / 5) + 32;
        const k = temp + 273.15;
        converted = `${temp}°C = ${f.toFixed(2)}°F | ${k.toFixed(2)}K`;
    }
    else if (unit === "fahrenheit") {
        const c = (temp - 32) * 5 / 9;
        const k = (temp - 32) * 5 / 9 + 273.15;
        converted = `${temp}°F = ${c.toFixed(2)}°C | ${k.toFixed(2)}K`;
    }
    else if (unit === "kelvin") {
        const c = temp - 273.15;
        const f = (temp - 273.15) * 9 / 5 + 32;
        converted = `${temp}K = ${c.toFixed(2)}°C | ${f.toFixed(2)}°F`;
    }

    result.innerHTML = converted;
}