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
function stormwallCheck(upstream){
    // isStormwall = (upstream.asn === 59796) ? true : false;
    // if (upstream.asn === 59796 && )
}

/* Send an API request to bgpview.io
Process the request in a table format used in network page */
async function fetchBGPAPI() {

    // Combine all prefixes to a list and add label
    const allPrefixes = {
        ...addLabelToPrefixes(nmePrefixes, 'NME'),
        ...addLabelToPrefixes(mtenPrefixes, 'MTEN'),
        ...addLabelToPrefixes(edgePrefixes, 'Edge'),
        ...addLabelToPrefixes(contaboPrefixes, 'Contabo')
    };

    // Array to store results in JSON 
    const results = [];

    for (const [prefix, data] of Object.entries(allPrefixes)) {
    }
    
    const url = new URL(`https://api.bgpview.io/prefix/103.167.136.0/24`);
    try {
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const upstreams = data.data.asns[0].prefix_upstreams;

        upstreams.forEach(upstream => {
            results.push({
                // prefix,
                // desc,
                upstream: `${upstream.description} (AS${upstream.asn})`,
                stormwall: stormwallCheck(upstream)
            });
        });

        console.log(upstreams);

    } catch (error) {
        console.error('Error:', error);
        return 'Error occurred';
    }
}

fetchBGPAPI()