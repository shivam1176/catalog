const fs = require('fs');
const path = require('path');

// Function to read and parse JSON data
function readJSON(filePath) {
    try {
        const data = fs.readFileSync(path.join(__dirname, filePath));
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON file:", error.message);
        return null;
    }
}

// Function to convert a string number from a specified base to decimal
function convertBase(value, base) {
    return parseInt(value, base);
}

// Function to calculate the Lagrange Interpolation for constant term (c)
function lagrangeInterpolation(points) {
    let constantTerm = 0;

    points.forEach((pointI, i) => {
        let yi = pointI.y;
        let li = 1;

        points.forEach((pointJ, j) => {
            if (i !== j) {
                li *= pointJ.x / (pointJ.x - pointI.x);
            }
        });

        constantTerm += yi * li;
    });

    return Math.round(constantTerm); // Round to nearest integer for precision
}

// Main function to solve the polynomial
function solvePolynomial(filePath) {
    const data = readJSON(filePath);
    if (!data) return;

    const n = data.keys.n;
    const k = data.keys.k;

    const points = [];
    for (let i = 1; i <= n; i++) {
        const key = i.toString();
        if (data[key]) {
            const x = parseInt(key);
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const y = convertBase(value, base);
            points.push({ x, y });
        } else {
            console.log(`Warning: Root ${key} is missing in JSON data.`);
        }
    }

    if (points.length < k) {
        console.error(`Error: Not enough points (only ${points.length}) to solve for polynomial of degree ${k - 1}`);
        return;
    }

    const constantTerm = lagrangeInterpolation(points);
    console.log("Calculated constant term (c):", constantTerm);
}

// Run the function with two test cases
console.log("Test Case 1:");
solvePolynomial('testcase1.json');

console.log("Test Case 2:");
solvePolynomial('testcase2.json');
