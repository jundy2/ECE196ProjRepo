document.addEventListener("DOMContentLoaded", () => {
    function updateTable(riskLevelText, location) {
        console.log("Updating table for location:", location, "with risk level:", riskLevelText); // Debugging line
        document.querySelectorAll('.data-table tbody tr').forEach((row) => {
            const locationCell = row.querySelector('.location-cell');
            if (locationCell) {
                const cellLocation = locationCell.dataset.location.trim().toLowerCase();
                const dataLocation = location.trim().toLowerCase();
                console.log("Comparing cell location:", cellLocation, "with data location:", dataLocation); // Debugging line
                if (cellLocation === dataLocation) {
                    console.log("Found matching location:", location); // Debugging line
                    row.cells[1].textContent = riskLevelText;
                }
            }
        });
    }

    setInterval(() => {
        fetch('/recent/Geisel_Library')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched data: ", data); // Debugging line
                if (typeof data !== 'object' || !data.location || !data.risk_lvl_text) {
                    throw new Error('Unexpected data format');
                }

                // Update the table with the new risk level text
                updateTable(data.risk_lvl_text, data.location);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, 1000);
});
