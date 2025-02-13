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
                window.open('https://www.google.com/maps/place//data=!4m3!3m2!1s0x882b328b0bfefb7f:0xd08043c55ff9005e!12e1?source=g.page.m.nr._&laa=nmx-review-solicitation-recommendation-card', '_blank');
                alert('Golden Care Dental Services would love your feedback. Post a review to our profile. https://g.page/r/CV4A-V_FQ4DQEBE/review.');
            }
        } else {
            alert('There was an error submitting the form.');
        }
    }).catch(error => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form.');
    });
});
