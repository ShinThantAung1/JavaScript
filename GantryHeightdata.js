// Name : Shin Thant Aung
// Class: DIT/FT/1B/11
// Admin No: 2329776


export default async function fetchGantryHeightData() {
    try {
        const response = await fetch('http://localhost:8081/readAllCarPark');
        const data = await response.json();
        return data;
    } catch (error) {
        // Handle errors here
        console.error(error);
        return null;
    }
}