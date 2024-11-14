// Name : Shin Thant Aung
// Class: DIT/FT/1B/11
// Admin No: 2329776


import fetchAllData from './AllCarParkdata.js';
import { filterCarParksByCarParkNumber } from './filter.js';

const templateCarparkNumber = document.createElement("template");
templateCarparkNumber.innerHTML = `
<style>
 .carparknumber {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
 }

 .carparknumber .container {
    margin-top: 20px;
 }

 .carparknumber .input {
    margin-top: 20px;
 }

 .carparknumber .form-control {
    width: 300px; /* Adjust the width as needed */
    padding: 10px; /* Adjust padding as needed */
 }

 .carparknumber .btn-submit {
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: black; /* Button background color */
    border: none;
    border-radius: 5px;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease; /* Transition effect */
}

.carparknumber .btn-submit:hover {
    background-color: #333; /* Change background color on hover */
}

 .carparknumber .card {
    border: 3px solid #ced4da;
    border-radius: 5px;
    border-color: black;
    padding: 20px; /* Increased padding for better appearance */
    margin-top: 20px; /* Increased margin for separation */
    margin-left: 10px;
    background-color: #f8f9fa;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Box shadow for subtle effect */
    width: 1000px;
    font-size: 30px;
    transition: transform 0.3s ease; /* Transition effect */
}

 .carparknumber .card:hover {
    transform: translateY(-5px); /* Move card up slightly on hover */
 }

 .carparknumber .card-container {
    max-height: 200px;
    overflow-y: auto;
}
</style>

<div class="carparknumber">
    <div class="container">
        <h2>Car Park Number</h2>
    </div>
    <div class="input">
        <input type="text" class="form-control" id="carparknumber-input" required />
    </div>
    <div>
        <button type="button" class="btn-submit btn-block">Submit</button>
    </div>
    <div id="filtered-results"></div>
</div>
`;

class CarparkNumber extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateCarparkNumber.content.cloneNode(true));

        this.shadowRoot.querySelector('.btn-submit').addEventListener('click', this.handleFilter.bind(this));
    }

    async handleFilter() {
        const carParkNumberInput = this.shadowRoot.getElementById('carparknumber-input').value.trim(); // Trim whitespace
        if (carParkNumberInput === '') {
            // Clear results if input is empty
            this.shadowRoot.getElementById('filtered-results').innerHTML = '';
            return;
        }
        
        const allData = await fetchAllData(); // returns the array of all car park data
        const filteredDataString = filterCarParksByCarParkNumber(allData, carParkNumberInput);
    
        // Split filteredDataString by newline characters and filter out empty lines
        const filteredData = filteredDataString.split('\n').filter(entry => entry.trim() !== '').map(entry => {
            const [carParkNumber, address] = entry.split(',');
            return { carParkNumber, address };
        });
    
        // Display filtered results
        const filteredResultsContainer = this.shadowRoot.getElementById('filtered-results');
        filteredResultsContainer.innerHTML = ''; // Clear previous results
    
        if (filteredData.length > 0) {
            filteredData.forEach(carpark => {
                const card = document.createElement('div');
                card.classList.add('card');
    
                const carparkNumberElement = document.createElement('p');
                carparkNumberElement.textContent = `Car Park Number: ${carpark.carParkNumber}`;
                card.appendChild(carparkNumberElement);
    
                const addressElement = document.createElement('p');
                addressElement.textContent = `Address: ${carpark.address}`;
                card.appendChild(addressElement);
    
                filteredResultsContainer.appendChild(card);
            });
        } else {
            // If filteredData is empty, display an alert
            alert("No results found.");
        }
    }
    
}


customElements.define("car-park-number", CarparkNumber);