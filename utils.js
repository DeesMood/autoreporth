async function fetchBGPAPI() {
    const nmePrefixes = {
        '103.145.227.0/24': 'Dewaweb SG Servers',
        '103.152.243.0/24': 'Dewaweb SG Servers',
        '103.167.137.0/24': 'Dewacloud'
    };
    const mtenPrefixes = {
        '103.185.52.0/24': 'DewaVPS',
        '103.145.226.0/24': 'DewaVPS',
        '103.152.242.0/24': 'DewaVPS',
        '103.185.53.0/24': 'Dewaweb JKT Servers & Managed Customers',
        '103.167.136.0/24': 'Dewacloud',
        '103.185.44.0/24': 'Dewacloud',
    }
    const edgePrefixes = {
        '103.167.132.0/24': 'Dewacloud',
        '103.185.38.0/24': 'Dewacloud'
    }

    const allPrefixes = { ...nmePrefixes, ...mtenPrefixes, ...edgePrefixes };

    for (const prefix of Object.keys(allPrefixes)) {
        const url = new URL(`https://api.bgpview.io/prefix/${prefix}`);
        console.log(url);
    }

    // try {
    //     const response = await fetch(url, {
    //         method: 'GET'
    //     });

    //     if (!response.ok) {
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     const results = data.data.results;

    //     console.log()

    // } catch (error) {
    //     console.error('Error:', error);
    //     return 'Error occurred';
    // }
}

fetchBGPAPI();