// Get all description buttons
var descriptionButtons = document.querySelectorAll('.description-btn');

// Add click event listeners to each button
descriptionButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        // Get the description from the data-description attribute
        var description = this.getAttribute('data-description');

        var existingTextbox = document.querySelector('.description-textbox');
        if (existingTextbox) {
            existingTextbox.remove();
            // Toggle button visibility back
            button.style.visibility = 'visible';
            return; // Exit the function early
        }
        // Create and style the textbox
        var textbox = document.createElement('div');
        textbox.className = 'description-textbox';
        textbox.textContent = description;
       
        // Position the textbox relative to the button
        var buttonRect = button.getBoundingClientRect();
        textbox.style.position = 'absolute';
        textbox.style.top = (buttonRect.bottom + window.scrollY) + 'px';
        textbox.style.left = (buttonRect.left + window.scrollX) + 'px';

        // Append the textbox to the document body
        document.body.appendChild(textbox);

        // Add event listener to remove the textbox when clicked outside
        document.addEventListener('click', function(event) {
            if (!textbox.contains(event.target) && event.target !== button) {
                textbox.remove();
                button.style.visibility = 'visible';
            }
        });
    });
});