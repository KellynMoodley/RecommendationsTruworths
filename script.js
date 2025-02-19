// DOM Elements
const searchInput = document.querySelector('.cc-search__input');
const overviewBoxes = document.querySelectorAll('.cc-overview__box');
const strategySection = document.querySelector('.cc-section--strategy');
const aiSection = document.querySelector('.cc-section--ai');
const historySection = document.querySelector('.cc-section--history');
const callsSection = document.querySelector('.cc-section--calls');
const followupSection = document.querySelector('.cc-section--followup');

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to fetch account data
async function fetchAccountData(accountNumber) {
    try {
        const response = await fetch('/api/lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account_number: accountNumber })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Unknown error occurred');
        }

        // Handle the processed data
        if (result.data) {
            updateDashboard(result.data);
        }

    } catch (error) {
        console.error('Error fetching account data:', error);
        // Add user-friendly error handling here
        alert('Unable to fetch account data. Please try again later.');
    }
}

// Function to update the dashboard UI
function updateDashboard(data) {
    // Update Call Strategy Section
    if (data[0]) {
        strategySection.innerHTML = `
            <h2 class="cc-section__title">Call Strategy Guide</h2>
            ${data[0].text}
        `;
    }

    // Update AI Recommendations Section
    if (data[1]) {
        aiSection.innerHTML = `
            <h2 class="cc-section__title">AI Recommended Actions</h2>
            ${data[1].text}
        `;
    }

    // Update Account Information in Overview Boxes
    if (data[2]) {
        const accountInfo = data[2].text;
        // Update overview boxes as needed
    }

    // Update Delinquency History Section
    if (data[3]) {
        historySection.innerHTML = `
            <h2 class="cc-section__title">Delinquency History</h2>
            ${data[3].text}
        `;
    }

    // Update Follow-up Actions Section
    if (data[4]) {
        followupSection.innerHTML = `
            <h2 class="cc-section__title">Follow-Up Actions</h2>
            ${data[4].text}
        `;
    }
}


// Add event listener for Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const accountNumber = e.target.value.trim();
        if (accountNumber) {
            fetchAccountData(accountNumber);
        }
    }
});
