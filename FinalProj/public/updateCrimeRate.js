document.addEventListener("DOMContentLoaded", () => {
    function calculateAndUpdateCrimeRate(data) {
        let total = 0;
        let count = 0;

        // Calculate the total and count, excluding the 'null' key
        for (let key in data) {
            if (key !== "null") {
                total += data[key];
                count += 1;
            }
        }

        const average = total / count;
        console.log("Average value:", average); // Debugging line
        const geiselLibraryValue = data["Geisel Library"];

        // Define a range for "somewhat close"
        const range = 0.1 * average; // 10% of the average value
        let crimeRate;

        if (geiselLibraryValue > average + range) {
            crimeRate = "HIGH";
        } else if (geiselLibraryValue < average - range) {
            crimeRate = "LOW";
        } else {
            crimeRate = "MEDIUM";
        }

        document.querySelectorAll('.data-table tbody tr').forEach((row) => {
            const locationCell = row.querySelector('.location-cell');
            if (locationCell && locationCell.dataset.location === "Geisel Library") {
                const crimeRateCell = row.cells[3]; // Assuming 'Projected Crime Rate of Area' is the fourth cell
                crimeRateCell.textContent = crimeRate;
            }
        });
    }

    setInterval(() => {
        fetch('/police_data_location') // Replace with your actual endpoint
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched data: ", data); // Debugging line
                if (typeof data !== 'object') {
                    throw new Error('Expected an object of data');
                }

                // Calculate and update the crime rate
                calculateAndUpdateCrimeRate(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, 1000);
});
