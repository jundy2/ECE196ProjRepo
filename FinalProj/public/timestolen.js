document.addEventListener("DOMContentLoaded", () => {
    var riskDiv = document.getElementById("risk_id");

    var timestamps = [];
    var thefts = [];

    function updatePlot() {
        // console.log("Updating plot with data:", timestamps, thefts);

        const trace = {
            x: timestamps,
            y: thefts,
            mode: 'lines+markers',
            type: 'bar',
            name: 'Number of Thefts',
            marker: { color: 'blue', size: 8 },
        };

        const layout = {
            xaxis: { title: 'Time' },
            yaxis: {
                title: {
                    text: 'Thefts',
                    standoff: 20
                },
            },
            margin: {
                l: 80,  // left margin
                r: 50,  // right margin
                t: 20,  // top margin
                b: 80   // bottom margin
            }
        };

        Plotly.newPlot('timeStolenPlot', [trace], layout);
    }

    function convertToMilitaryTime(timeStr) {
        const [time, modifier] = timeStr.split(/(AM|PM)/);
        let [hours, minutes] = time.split(':');

        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        }
        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }

        hours = String(hours).padStart(2, '0');

        return `${hours}:${minutes}`;
    }

    function sortDateByTime(data) {
        return Object.keys(data).filter(time => time !== 'null').sort((a, b) => {
            const militaryTimeA = convertToMilitaryTime(a);
            const militaryTimeB = convertToMilitaryTime(b);
            return militaryTimeA.localeCompare(militaryTimeB);
        });
    }

    function initializeTimeMap() {
        const times = [];
        for (let h=1; h<=12; h++) {
            const hour = h.toString().padStart(2, '0');
            times.push(`${hour}:00AM`);
            times.push(`${hour}:00PM`);
        }
        const timeMap = {};
        times.forEach(time => {
            timeMap[time] = 0;
        });
        return timeMap;
    }

    setInterval(() => {
        fetch('/police_data_time')
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
                
                let timeMap = initializeTimeMap();

                // Update the time map with fetched data
                for (let time in data) {
                    if (time !== 'null' && timeMap.hasOwnProperty(time)) {
                        timeMap[time] = data[time];
                    }
                }

                // sort timestamps by military time
                timestamps = sortDateByTime(timeMap);

                // build the thefts array based on sorted timestamps
                thefts = timestamps.map(time => timeMap[time]);

                // console.log("Processed data:", timestamps, thefts); // Debug: log processed data

                // Update the plot with the new data
                updatePlot();
            })
            .catch(error => console.error('Error fetching data:', error));
    }, 1000);
});
