document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
});

document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submission triggered');
    const formData = new FormData(this);

    // Check if the satisfaction rating is "Satisfied" or "Very Satisfied"
    const satisfaction = formData.get('satisfaction');
    const care = formData.get('care');

    // Add timestamp to form data
    const date = new Date().toISOString().split('T')[0]; // Extracts the date part
    formData.append('Date', date);

    // Process form data here (e.g., send to server or save locally)
    console.log('Form submitted with data:', Object.fromEntries(formData.entries()));

    // Send data to Power Automate
    fetch('https://prod-27.canadacentral.logic.azure.com:443/workflows/9ec9541a68494bcca8779d08af7f4ac2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2tfzYj1qyy3BsiuuL78RXCqXyCTwyPO1V2qqE0myd5c', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
    }).then(response => {
        if (response.ok) {
            alert('Form submitted successfully!');
            this.reset();

            // If both satisfaction and care are "Satisfied" or "Very Satisfied", open Google review page
            if ((satisfaction === 'Satisfied' || satisfaction === 'Very Satisfied') &&
                (care === 'Satisfied' || care === 'Very Satisfied')) {
                window.open('https://shorturl.at/wUYz3', '_blank');
                alert('Kindly, if you can add a Google review.');
            }
        } else {
            alert('There was an error submitting the form.');
        }
    }).catch(error => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form.');
    });
});
