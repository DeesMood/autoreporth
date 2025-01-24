const { resolve } = require("path");

/* All Dewaweb's IP Blocks */
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
const contaboPrefixes = {
    '154.12.240.0/21': 'sea01.dewaweb.com',
    '85.239.232.0/21': 'sea02.dewaweb.com'
}

// Function to add labels to each prefix based on which source object they come from
function addLabelToPrefixes(prefixes, label) {
    const labeledPrefixes = {};
    for (const [prefix, desc] of Object.entries(prefixes)) {
        labeledPrefixes[prefix] = {
            description: desc,
            label: label
        };
    }
    return labeledPrefixes;
}

/* Stormwall Checking
Finding out whether or not prefix is on stormwall */
function stormwallCheck(upstreams){

    // Check whether or not there is a stormwall upstream
    let isStormwall = false;
    upstreams.forEach(upstream => {
        if(upstream.asn === 59796) {
            isStormwall = true;
        }
    });

    // Logic for stormwall status
    if(isStormwall && (upstreams.length === 1)){
        return 'Full Stormwall';
    } else if (isStormwall && (upstreams.length > 1)) {
        return 'Partial Stormwall';
    } else {
        return 'No Stormwall';
    }
}

async function fetchData(prefix, url){

    let retries = 3; // Number of retry attempts
    let delay = 1000; // Initial delay in milliseconds

    while(retries > 0) {

        try {
            const response = await fetch(url, {
                method: 'GET'
            });
    
            if (response.ok) {
                return await response.json();
            } else if (response.status === 429){
                const retryAfter = response.headers.get('Retry-after');
                const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
                console.warn(`Rate limited. Retrying in ${waitTime}s...`);

                // Wait before retrying
                await new Promise((resolve) => setTimeout(resolve, waitTime));
                // Exponential backoff
                delay *= 2; 
                retries--;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching ${prefix}: ${error.message}`);
            retries--;
        }
    }

    console.error(`Failed to fetch data for prefix: ${prefix} after retries.`);
    // Return null if all retries fail
    return null;
}

/* Setup a delay */
async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/* Send an API request to bgpview.io
Process the request in a table format used in network page */
async function fetchBGPAPI(){

    // Combine all prefixes to a list and add label
    const allPrefixes = {
        ...addLabelToPrefixes(nmePrefixes, 'NME'),
        ...addLabelToPrefixes(mtenPrefixes, 'MTEN'),
        ...addLabelToPrefixes(edgePrefixes, 'Edge'),
        ...addLabelToPrefixes(contaboPrefixes, 'Contabo')
    };

    // Array to store results in JSON 
    const results = [];
    
    for (const [prefix, attr] of Object.entries(allPrefixes)) {
        const url = new URL(`https://api.bgpview.io/prefix/${prefix}`);
        const desc = attr.description;
        const label = attr.label;

        const data = await fetchData(prefix, url);
        const upstreams = data.data.asns[0].prefix_upstreams;
        const stormwall = stormwallCheck(upstreams);

        upstreams.forEach(upstream => {
            // Find an existing entry with the same prefix, desc, and stormwall
            const existingEntry = results.find(result => 
                result.prefix === prefix &&
                result.desc === desc &&
                result.stormwall === stormwall &&
                result.label === label
            );

            if (existingEntry) {
                existingEntry.upstream += `\n${upstream.description} (AS${upstream.asn})`;
            } else {
                results.push({
                    prefix,
                    desc,
                    upstream: `${upstream.description} (AS${upstream.asn})`,
                    stormwall,
                    label
                });
            }
        });

        // Wait 0.25 second
        await delay(250);
    }

    return results
}

(async () => {
    const res = await fetchBGPAPI();
    console.log(res);
})();
