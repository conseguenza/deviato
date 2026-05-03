// version.js
const version = {
    number: "1.0.0",
    date: "2026-05-03",   // update manually
    get full() {
        return `${this.number} (${this.date})`;
    }
};

console.log("Loader version:", version.full);
// Output: Loader version: 1.0.0 (2026-05-03)
