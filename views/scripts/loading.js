async function fetchingData() {
    // Show the loading overlay
    document.getElementById('loading-overlay').removeAttribute('hidden');
    document.getElementById('data-container').setAttribute('hidden', true);

    try {
       // Fetch data from the server
       const response = await fetch('/bgpapi'); // Await the response
       if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
       }

       location.reload();
       
    } catch (error) {
       console.error('Error fetching data:', error);
       alert('Failed to load data');
    }
 }

 function hasData() {
    // Show the data container
    document.getElementById('data-container').removeAttribute('hidden');
    document.getElementById('loading-overlay').setAttribute('hidden', true);
 }