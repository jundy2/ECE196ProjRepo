document.addEventListener("DOMContentLoaded", () => {
    var riskDiv = document.getElementById("risk_id");

    var timestamps = [];
    var riskLevels = [];

    function mapRiskLevelTextToValue(riskLevelText) {
        switch (riskLevelText) {
            case 'VERY LOW':
                return 0.25;  // Middle of the range 0 to 0.5
            case 'LOW':
                return 1;  // Middle of the range 0.5 to 1.5
            case 'MEDIUM':
                return 2;  // Middle of the range 1.5 to 2.5
            case 'HIGH':
                return 3;  // Middle of the range 2.5 to 3.5
            case 'VERY HIGH':
                return 4;  // Middle of the range 3.5 to 4.5
            default:
                return 0;  // default to 0 for any unknown values
        }
    }

    function updatePlot() {
        console.log("Updating plot with data:", timestamps, riskLevels);

        const trace = {
            x: timestamps,
            y: riskLevels,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Risk Level',
            marker: { color: 'red', size: 8 },
            line: { color: 'blue', width: 2 }
        };

        const layout = {
            title: {
                text: 'Geisel Library: Risk Level Over Time', 
                x: 0.55
            },
            xaxis: { title: 'Time' },
            yaxis: {
                title: {
                    text: 'Risk Level',
                    standoff: 20
                },
                tickvals: [0.25, 1, 2, 3, 4],
                ticktext: ['VERY LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'],
                range: [0, 4.5]
            },
            margin: {
                l: 150,  // left margin
                r: 20,  // right margin
                t: 50,  // top margin
                b: 100   // bottom margin
            }
        };

        Plotly.newPlot('myPlot', [trace], layout);
    }

    function filterDataForLast24Hours(data) {
        const now = new Date();
        const oneDayAgo = now.getTime() - (24 * 60 * 60 * 1000);

        return data.filter(point => {
            const riskTimestamp = point.risk_lvl_timestamp * 1000;
            return riskTimestamp >= oneDayAgo;
        });
    }

    setInterval(() => {
        fetch('/all/Geisel_Library')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('Expected an array of data');
                }
                
                const filteredData = filterDataForLast24Hours(data);

                // Clear the existing arrays to avoid duplication
                timestamps = [];
                riskLevels = [];

                // Iterate over each data point
                filteredData.forEach((point, index) => {
                    let riskTimestamp = new Date(point.risk_lvl_timestamp * 1000);  // Convert from seconds to milliseconds
                    let mappedRiskLevel = mapRiskLevelTextToValue(point.risk_lvl_text);

                    timestamps.push(riskTimestamp);
                    riskLevels.push(mappedRiskLevel);

                    // Display the most recent data point
                    if (index === data.length - 1) {
                        const theDate = new Date();
                        var theHours = theDate.getHours() % 12;
                        var theAMPM = 'AM';
                        if (theHours == 0) theHours = 12;
                        if ((theDate.getHours() / 12) >= 1) theAMPM = 'PM';
                    }
                });

                // Update the plot with the new data
                updatePlot();
            })
            .catch(error => console.error('Error fetching data:', error));
    }, 1000);

    let hoverTimeout;

document.querySelectorAll('.location-cell').forEach(function(element) {
    element.addEventListener('mouseenter', function(event) {
        if (element.textContent.trim() === "Geisel Library") {
            clearTimeout(hoverTimeout);
            var plotContainer = document.getElementById('plotContainer');

            // Position the plot container relative to the mouse
            plotContainer.style.left = `${event.pageX + 10}px`; // Offset by 10px to the right
            plotContainer.style.top = `${event.pageY - 100}px`; // Offset by 10px below

            // Ensure the plot container is visible
            plotContainer.style.display = 'block';
            Plotly.purge('myPlot'); // Clear any previous plots
            createPlot();
        }
    });

    element.addEventListener('mouseleave', function() {
        if (element.textContent.trim() === "Geisel Library") {
            hoverTimeout = setTimeout(function() {
                var plotContainer = document.getElementById('plotContainer');
                plotContainer.style.display = 'none'; // Hide the plot container
                Plotly.purge('myPlot');
            }, 500); // Delay to avoid flickering
        }
    });

    document.getElementById('plotContainer').addEventListener('mouseenter', function() {
        clearTimeout(hoverTimeout);
    });

    document.getElementById('plotContainer').addEventListener('mouseleave', function() {
        hoverTimeout = setTimeout(function() {
            var plotContainer = document.getElementById('plotContainer');
            plotContainer.style.display = 'none'; // Hide the plot container
            Plotly.purge('myPlot');
        }, 500); // Delay to avoid flickering
    });
});

});
