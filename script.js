"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = 'https://www.cheapshark.com/api/1.0/games';
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}
//# sourceMappingURL=script.js.map