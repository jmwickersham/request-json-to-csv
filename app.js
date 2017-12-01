const jsonToCSV = require('json-to-csv');
const request = require('request-promise');
const dotenv = require('dotenv').config();

const apiKey = process.env.API_TOKEN;

let page = 1; // starting page
let baseUrl = '' // enter the API URL you want to call
let apiData = []; // array to hold response body objects

function get(url) {
    request({
        "method": "GET",
        "url": url,
        "headers": {
            'x-api-key': apiKey, // api key headers
            'Content-Type': 'application/json'
        },
        "json": true
    }, function(error, response, body) {
        // if no error and http status is 200 continue on
        if (!error && response.statusCode == 200) {
            //console.log('body: ' + JSON.stringify(body.data));
            let totalPages = body.meta.totalPages * 1; // set total pages to loop through and ensure it's a number

            // if this is the first round, set your array equal to your first response
            if (apiData.length == 0) {
              console.log('api data length: ' + apiData.length);
              apiData = body.data;
            }
            // otherwise add the new object array to the existing one
            else {
              apiData = apiData.concat(body.data);
            }

            page++; // increment to the next page
            console.log('page: ' + page);

            // if you haven't hit the last page, call the function again
            if (page < totalPages) {
                getapiData(baseUrl + 'page=' + page + '&size=100'); // you can also use the "next link" if the api you are calling supports that
            }
            // if you have iterated through all pages, continue to your next function
            else {
                done(); //Call when we are finished
            }
        }
        // if you hit an error or the http status is not 200, throw and error
        else {
            console.log(error);
            throw error;
        }

    });
}

getapiData(baseUrl + 'page=1&size=100'); // call your function!

function done() {
    console.log('We are done');

    // call your csv conversion function by passing your array and the file name of your choice
    jsonToCSV(apiData, "file_name.csv")
    .then(() => {
        // success
    })
    .catch(error => {
        // handle error
    })
}
