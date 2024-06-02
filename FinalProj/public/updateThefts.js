document.addEventListener("DOMContentLoaded", () => {
    function updateTable(data) {
        document.querySelectorAll('.data-table tbody tr').forEach((row) => {
            const locationCell = row.querySelector('.location-cell');
            if (locationCell && locationCell.dataset.location === "Geisel Library") {
                const theftsCell = row.cells[2]; // Assuming 'Thefts Over Past 3 Months' is the third cell
                theftsCell.textContent = data["Geisel Library"];
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

                // Update the table with the new data
                updateTable(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, 1000);
});
