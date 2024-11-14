const express = require('express');
const fs = require('fs');
const app = express();

const bodyParser = require('body-parser')
const parse = require("csv-parse").parse;

const cors = require('cors');
app.use(cors());

app.use(express.json());

let carParkData;

//const  parse  = require("csv-parse");
async function readAllCarPark() {
  return new Promise((resolve, reject) => {
    const rData = [];

    fs.createReadStream(".\\data\\HDBCarparkInformation.csv")
        .pipe(parse({ delimiter: ',', from_line: 2}))
        .on('data', function (csvrow) {
          let newRecord = {
            car_park_no           : csvrow[0],
            address               : csvrow[1],
            x_coord               : csvrow[2],
            y_coord               : csvrow[3],
            car_park_type         : csvrow[4],
            type_of_parking_system: csvrow[5],
            short_term_parking    : csvrow[6],
            free_parking          : csvrow[7],
            night_parking         : csvrow[8],
            car_park_decks        : parseInt(csvrow[9]),
            gantry_height         : parseFloat(csvrow[10]),
            car_park_basement     : csvrow[11]
          }
          rData.push(newRecord);
        })
        .on('end', function () {
          resolve(rData)
        })
        .on('error', function (err) {
          reject(err);
        });
  });
}

// This responds with " Nothing" on the homepage
app.get('/', function (req, res) {
   console.log("Host data ready");
   res.send('Your Data Host!');
})

// Endpoint all car parks e.g. http://localhost:8081/readAllCarPark
app.get('/readAllCarPark', function (req, res) {
   console.log("All Car Park Data");
   res.send(carParkData);
})

// Endpoint Query Car Park Type e.g. http://localhost:8081/byType/BASEMENT%20CAR%20PARK
app.get('/byType/:type', (req, res) => {
  let carParkType = req.params.type;
  console.log(carParkType);
  
  const result = carParkData.filter((carparkInfo) => { return carparkInfo.car_park_type == carParkType});

  res.status(200);
  res.type('application/json');
  res.json(result);
});

// Endpoint Query Night Parking e.g. http://localhost:8081/byNightParking/NO
app.get('/byNightParking/:nightParking', (req, res) => {
  let nightParkingOption = req.params.nightParking;
  console.log(nightParkingOption);
  
  const result = carParkData.filter((carparkInfo) => { return carparkInfo.night_parking == nightParkingOption});

  res.status(200);
  res.type('application/json');
  res.json(result);
});

// Endpoint Query Gantry Height > parameter e.g. http://localhost:8081/byGantryHeight/1.8
app.get('/byGantryHeight/:gantry_height', (req, res) => {
  let gantryHeight = parseFloat(req.params.gantry_height);
  console.log(gantryHeight);

  if (! isNaN(gantryHeight)) {
    const result = carParkData.filter((carparkInfo) => { 
      return carparkInfo.gantry_height >= gantryHeight
    });  
    res.status(200);
    res.type('application/json');
    res.json(result);
  } else {
    res.status(400);
    res.send();
  }
});

// Get all information about HDB car parks
readAllCarPark().then((alldata) => {
  carParkData = alldata;
  const server = app.listen(8081, 'localhost', () => {
    const host = server.address().address
    const port = server.address().port
 
    console.log(`Example app listening at http://${host}:${port}`);
 }) 
}).catch((error) => {
  console.log("Error:", error)
})


