// Name : Shin Thant Aung
// Class: DIT/FT/1B/11
// Admin No: 2329776

import fetchGantryHeightData from './GantryHeightdata.js';
import { filterGantryHeight } from './filter.js';

const templateGantryHeight = document.createElement("template");
templateGantryHeight.innerHTML = `
<style>
 .carparkgantryheight {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
 }

 .carparkgantryheight .container {
    margin-top: 20px;
 }

 .carparkgantryheight .input {
    margin-top: 20px;
 }

 .carparkgantryheight .form-control {
    width: 300px; /* Adjust the width as needed */
    padding: 10px; /* Adjust padding as needed */
 }

 .carparkgantryheight .btn-submit {
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

.carparkgantryheight .btn-submit:hover {
    background-color: #333; /* Change background color on hover */
}

 .carparkgantryheight .card {
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

 .carparkgantryheight .card:hover {
    transform: translateY(-5px); /* Move card up slightly on hover */
 }

 .carparkgantryheight .card-container {
    max-height: 200px;
    overflow-y: auto;
}
</style>

<div class="carparkgantryheight">
    <div class="container">
        <h2>Car Park Gantry Height</h2>
    </div>
    <div class="input">
        <input type="text" class="form-control" id="carparkgantryheight-input" required />
    </div>
    <div>
        <button type="button" class="btn-submit btn-block">Submit</button>
    </div>
    <div id="filtered-results"></div>
</div>
`;

class CarparkGantryHeight extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(templateGantryHeight.content.cloneNode(true));

        this.shadowRoot.querySelector('.btn-submit').addEventListener('click', this.handleFilter.bind(this));
        
        // Add event listener to input for numeric validation
        this.shadowRoot.getElementById('carparkgantryheight-input').addEventListener('input', this.validateNumericInput.bind(this));
    }

    validateNumericInput(event) {
        const input = event.target.value;
        // Replace any characters that are not digits or periods with an empty string, except for the first period
        event.target.value = input.replace(/[^0-9.]+/g, '').replace(/^(\d*\.\d*).*$/g, '$1');
    }

    async handleFilter() {
        const gantryHeightInput = this.shadowRoot.getElementById('carparkgantryheight-input').value.trim(); // Trim whitespace
        if (gantryHeightInput === '') {
            // Clear results if input is empty
            this.shadowRoot.getElementById('filtered-results').innerHTML = '';
            return;
        }
        
        const allData = await fetchGantryHeightData(); //returns the array of all gantry height data
        const filteredDataString = filterGantryHeight(allData, gantryHeightInput);
    
        // Split filteredDataString by newline characters and filter out empty lines
        const filteredData = filteredDataString.split('\n').filter(entry => entry.trim() !== '').map(entry => {
            const [carParkNumber, gantryHeight, address] = entry.split(',');
            return { carParkNumber, gantryHeight, address };
        });
        console.log(filteredData);
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
    
                const gantryHeightElement = document.createElement('p');
                gantryHeightElement.textContent = `Gantry Height: ${carpark.gantryHeight}`;
                card.appendChild(gantryHeightElement);

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

customElements.define("car-park-gantry-height", CarparkGantryHeight);
