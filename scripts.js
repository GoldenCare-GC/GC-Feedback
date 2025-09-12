document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    document.getElementById('feedbackForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Form submission triggered');

        const recommendation = document.querySelector('input[name="recommendation"]:checked');
        const care = document.querySelector('input[name="care"]:checked');
        const satisfaction = document.querySelector('input[name="satisfaction"]:checked');

        if (!recommendation || !care || !satisfaction) {
            alert('Please answer all questions before submitting.');
            return;
        }

        const recommendationValue = parseInt(recommendation.value);
        const careValue = care.value;
        const satisfactionValue = satisfaction.value;

        console.log('Recommendation:', recommendationValue);
        console.log('Care:', careValue);
        console.log('Satisfaction:', satisfactionValue);

        // Send form data to Power Automate (First Trigger)
        const formData = new FormData(this);
        const date = new Date().toISOString().split('T')[0]; // Extracts the date part
        formData.append('Date', date);

        fetch('https://default3e19444eb3a24c6bbc4b25b849353c.55.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3957383185d14d4ab8db9cd5c38365fc/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xTpGMGZ9R3usiFQm1Pd2DCesvIIwHn6fQEacN8v-Lzo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        }).then(response => {
            if (response.ok) {
                console.log('Form data sent to Power Automate');
            } else {
                console.error('Error sending form data to Power Automate');
            }
        }).catch(error => {
            console.error('Error sending form data to Power Automate:', error);
        });

        // Check conditions for different pop-ups
        if (recommendationValue >= 7 && 
            (careValue === 'Satisfied' || careValue === 'Very Satisfied') &&
            (satisfactionValue === 'Satisfied' || satisfactionValue === 'Very Satisfied')) {
            console.log('Triggering Google review pop-up');
            window.open('https://www.google.com/maps/place//data=!4m3!3m2!1s0x882b328b0bfefb7f:0xd08043c55ff9005e!12e1?source=g.page.m.nr._&laa=nmx-review-solicitation-recommendation-card', '_blank');
            alert('Golden Care Dental Services would love your feedback. Post a review to our profile. https://g.page/r/CV4A-V_FQ4DQEBE/review.');
        } else if (recommendationValue <= 4 && 
                   (careValue === 'Dissatisfied' || careValue === 'Very Dissatisfied') &&
                   (satisfactionValue === 'Dissatisfied' || satisfactionValue === 'Very Dissatisfied')) {
            console.log('Triggering feedback collection inputs');

            // Create a new div for input fields
            const feedbackContainer = document.querySelector('.container');

            // Check if the fields already exist to avoid duplicates
            if (!document.getElementById('contactInfo')) {
                const contactInfoDiv = document.createElement('div');
                contactInfoDiv.id = 'contactInfo';
                contactInfoDiv.style.textAlign = 'left'; // Add this line to left-align the content
                contactInfoDiv.innerHTML = `
                    <p>We are sorry to hear that our service hasn't met your expectations. We would love the opportunity to learn more from this situation to help us do better next time. If you're open to a discussion, please share your phone number and the best time to reach you and our team will contact you to discuss.</p>
                    <label for="phoneNumber" style="display: inline-block; width: 150px;">Phone Number:</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" placeholder="Enter your phone number" required style="width: 250px; height: 30px;">
                    <br><br>
                    <label for="bestTime" style="display: inline-block; width: 150px;">Best Time to Contact:</label>
                    <input type="text" id="bestTime" name="bestTime" placeholder="Enter the best time to reach you" required style="width: 250px; height: 30px;">
                    <br><br>
                    <button id="submitContactInfo" class="button">Submit Contact Info</button>
                `;
                feedbackContainer.appendChild(contactInfoDiv);

                // Add event listener for submitting contact info
                document.getElementById('submitContactInfo').addEventListener('click', function() {
                    const phoneNumber = document.getElementById('phoneNumber').value;
                    const bestTime = document.getElementById('bestTime').value;

                    // Validate inputs
                    if (!phoneNumber || !bestTime) {
                        alert("Please fill out both fields before submitting.");
                        return;
                    }

                    // Create FormData object to send all data including phone number and best time
                    const formData = new FormData();
                    formData.append('recommendation', recommendation.value);
                    formData.append('care', care.value);
                    formData.append('satisfaction', satisfaction.value);
                    formData.append('phoneNumber', phoneNumber);
                    formData.append('bestTime', bestTime);

                    // Send data to Power Automate (Second Trigger)
                    fetch('https://default3e19444eb3a24c6bbc4b25b849353c.55.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3957383185d14d4ab8db9cd5c38365fc/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xTpGMGZ9R3usiFQm1Pd2DCesvIIwHn6fQEacN8v-Lzo', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(Object.fromEntries(formData.entries()))
                    }).then(response => {
                        if (response.ok) {
                            alert(`Thank you! Our team will contact you at ${phoneNumber} during ${bestTime} to discuss your experience.`);
                            contactInfoDiv.remove(); // Remove the contact info fields after submission
                        } else {
                            alert("There was an error submitting your information.");
                        }
                    }).catch(error => {
                        console.error("Error submitting data:", error);
                        alert("There was an error submitting your information.");
                    });
                });
            }
        } else {
            console.log('No conditions matched for pop-ups');
            alert('Thank you for your feedback!');
        }

        this.reset();
    });
});


