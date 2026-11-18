const url = 'https://www.cheapshark.com/api/1.0/games';
async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}