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

function formatText(text) {
    return text
        .split('\n\n') // First, split by double newlines (paragraphs)
        .map(paragraph => 
            `<p>${paragraph.replace(/\n/g, '<br><br>')}</p>` // Replace single newlines with <br> within each paragraph
        )
        .join('');
}

//function formatText(text) {
    
//    return text.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
//}

// Function to update the dashboard UI
function updateDashboard(data) {
    // Update Call Strategy Section
    if (data[0]) {
        strategySection.innerHTML = `
            <h2 class="cc-section__title">Call Strategy Guide</h2>
            <div class="cc-section__content">
                ${formatText(data[0].text)}
            </div>
        `;
    }

    // Update AI Recommendations Section
    if (data[1]) {
        aiSection.innerHTML = `
            <h2 class="cc-section__title">AI Recommended Actions</h2>
            <div class="cc-section__content">
                ${formatText(data[1].text)}
            </div>
        `;
    }

    // Update Account Information in Overview Boxes
    //if (data[2]) {
    //    const accountInfo = data[2].text;
        // Update overview boxes as needed
        // Handle overview boxes as before
     //   overviewBoxes.forEach(box => {
     //       switch(box.dataset.type) {
     //           case 'account':
     //               box.textContent = accountInfo.Account_no;
     //               break;
     //           case 'due':
     //               box.textContent = accountInfo.Total_amount_due;
      //              break;
       //         case 'payment':
       //             box.textContent = accountInfo.Date_Last_Payment;
       //             break;
                // Add more cases as needed
        //    }
       // });
    //}

    // Extract the account data object (data[2] from your JSON)
    const accountData = data[2];
    
    // Update overview section
    const overviewSection = document.querySelector('.cc-overview');
    overviewSection.innerHTML = `
        <div class="cc-overview__box">
            Last Payment Date: ${accountData.Date_Last_Payment}<br>
            Number Broken Promises: ${accountData.Number_Broken_PTP}<br>
            FPD Indicator: ${accountData.FPD_Indicator}<br>
            Collection Segment: ${accountData.Collections_Segment_Detail}
        </div>
        <div class="cc-overview__box">
            Amount Due: R${accountData.Total_amount_due.toFixed(2)}<br>
            Installment: R${accountData.instalment.toFixed(2)}<br>
            Account Number: ${accountData.Account_no}
        </div>
        <div class="cc-overview__box">
            Salary Date: ${accountData.Salary_DayofMonth}<br>
            Payment Due Date: ${accountData.Payment_Due_Date}<br>
            Preferred Payment Method: ${accountData.Pref_Payment_Method_Desc}<br>
            Debit Order Present: ${accountData.debit_order_present}
        </div>
    `;

    // Update Delinquency History Section
    if (data[3]) {
        historySection.innerHTML = `
            <h2 class="cc-section__title">Delinquency History</h2>
            <div class="cc-section__content">
                ${formatText(data[3].text)}
            </div>
        `;
    }

    // Update Follow-up Actions Section
    if (data[4]) {
        followupSection.innerHTML = `
            <h2 class="cc-section__title">Follow-Up Actions</h2>
            <div class="cc-section__content">
                ${formatText(data[4].text)}
            </div>
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
