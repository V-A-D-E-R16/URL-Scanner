// script.js
$(document).ready(function() {
    $('#urlForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission

        const url = $('#urlInput').val(); // Get URL from input field

        // Send URL to server for scanning
        $.ajax({
            type: 'POST',
            url: '/submitScan',
            data: { url: url },
            success: function(response) {
                $('#output').html(response); // Update scan results container with response from server
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});
