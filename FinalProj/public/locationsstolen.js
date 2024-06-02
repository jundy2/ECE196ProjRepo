document.addEventListener("DOMContentLoaded", () => {
    var riskDiv = document.getElementById("risk_id");

    var locations = [];
    var thefts = [];
    var hoverText = [];

    function updatePlot() {
        // console.log("Updating plot with data:", locations, thefts);

        const trace = {
            x: locations,
            y: thefts,
            mode: 'lines+markers',
            type: 'bar',
            name: 'Thefts by Location',
            marker: { color: 'blue', size: 8 },
            text: hoverText,
            hoverinfo: 'text'
        };

        const layout = {
            xaxis: { 
                title: {
                    text: 'Location',
                    standoff: 20
                }
            },
            yaxis: {
                title: {
                    text: 'Thefts',
                    standoff: 7
                },
            },
            margin: {
                l: 50,  // left margin
                r: 50,  // right margin
                t: 20,  // top margin
                b: 140   // bottom margin
            }
        };

        Plotly.newPlot('locationsStolenPlot', [trace], layout);
    }

    function abbreviateLocation(location) {
        const maxChars = 10; // Maximum number of characters to keep in the abbreviation
        if (location.length > maxChars) {
            return location.slice(0, maxChars) + '...';
        }
        return location;
    }

    setInterval(() => {
        fetch('/police_data_location')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // console.log("Fetched data: ", data);
                if (typeof data !== 'object') {
                    throw new Error('Expected an object of data');
                }

                // Clear the existing arrays to avoid duplication
                locations = [];
                thefts = [];
                hoverText = [];
            

                for(let location in data) {
                    if (location !== 'null') {
                        locations.push(abbreviateLocation(location));
                        thefts.push(data[location]);
                        hoverText.push(location);
                    }
                }

                // console.log("Processed data:", locations, thefts); // Debug: log processed data

                // Update the plot with the new data
                updatePlot();
            })
            .catch(error => console.error('Error fetching data:', error));
    }, 1000);
});
