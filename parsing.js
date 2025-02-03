const severityMap = {
    "OpenLDAP connection open": "Low",
    "Successful sudo to ROOT executed": "Low",
    "Log file rotated": "Low",
    "Processes running for all users were queried with ps command": "Low",
    "Listened ports status changed": "Low",
    "Login session closed": "Low",
    "Login session opened": "Low",
    "Potentially Bad Traffic": "Low",
    "GPL SNMP public access udp": "Low",
    "Unknown Traffic": "Low",
    "stream5: TCP Small Segment Threshold Exceeded": "Low",
    "stream5: Bad segment, adjusted size <= 0": "Low",
    "GPL ICMP_INFO PING *NIX": "Low",
    "stream5: Limit on number of overlapping TCP packets reached": "Low",
    "http_inspect: CHUNK SIZE MISMATCH DETECTED": "Low",
    "SERVER-IIS Microsoft Windows IIS FastCGI request header buffer overfLow attempt": "Low",
    "ET INFO Dotted Quad Host PDF Request": "Low",
    "Host-based anomaly detection event (rootcheck)": "Low",
    "Service startup type was changed": "Low",
    "ssh: Protocol mismatch": "Low",
    "SSHD authentication success": "Low",
    "Windows Logon Success": "Low",
    "ET SCAN Suspicious inbound to PostgreSQL port 5432": "Low",
    "stream5: TCP Timestamp is outside of PAWS window": "Low",
    "ET INFO Observed DNS Query to .cloud TLD": "Low",
    "SERVER-ORACLE database username buffer overfLow": "Low",
    "GPL SNMP private access udp": "Low",
    "ET SCAN Suspicious inbound to Oracle SQL port 5432": "Low",
    "ET SCAN Suspicious inbound to Oracle SQL port 1521": "Low",
    "Unknown OSSEC Event": "Low",
    "Reset Outside Window": "Low",
    "GPL WEB_SERVER 403 Forbidden": "Low",
    "ET POLICY Windows Update P2P Activity": "Low",
    "sensitive_data: sensitive data global threshold exceeded": "Low",
    "ET SCAN Suspicious inbound to mySQL port 3306": "Low",
    "SERVER-ORACLE alter database attempt": "Low",
    "SERVER-ORACLE grant attempt": "Low",
    "ET POLICY Vulnerable Java Version 1.7.x Detected": "Low",
    "ET DNS Query for .to TLD": "Low",
    "SERVER-ORACLE truncate table attempt": "Low",
    "ET P2P MS WUDO Peer Sync": "Low",

    "Unexpected error while resolving domain": "Medium",
    "User authentication failure": "Medium",
    "APP-DETECT Teamviewer control server ping": "Medium",
    "OS-WINDOWS Microsoft Windows getbulk request attempt": "Medium",
    "OS-WINDOWS Microsoft Windows SMB anonymous session IPC share access attempt": "Medium",
    "INDICATOR-COMPROMISE 403 Forbidden": "Medium",
    "OpenLDAP authentication failed": "Medium",
    "NO CONTENT-LENGTH OR TRANSFER-ENCODING IN HTTP RESPONSE": "Medium",
    "MALWARE-CNC Win.Trojan.NetWiredRC variant keepalive": "Medium",
    "HI_SERVER_PROTOCOL_OTHER": "Medium",
    "INDICATOR-SHELLCODE x86 inc ecx NOOP": "Medium",

    "ET TROJAN DNS Reply Sinkhole Microsoft NO-IP Domain": "High",
    "ET TROJAN Known Hostile Domain ant.trenz.pl Lookup": "High",
    "NETBIOS SMB srvsvc named pipe creation attempt": "High",

    "stream5: TCP Timestamp is missing": "Medium"
};
const abuseipkey = '<secret_key>';
const categoriesMap = {
    "11": "Email Spam",
    "18": "Bruteforce",
    "15": "Hacking",
    "14": "Port Scan",
    "20": "Exploited Host"

};

const cfHeaders = {
    "Source IP Addresses": "# Top IP Addresses:\n",
    "Paths": "\n# Paths:\n",
    "Countries": "\n# Top Countries:\n",
    "Hosts": "\n# Hosts:\n",
    "Source ASNs": "\n# Top ASNs:\n",
    "Firewall rules": "\n# Firewall rules:\n",
    "Rate limiting rules": "\n# Rate limiting rules:\n",
    "Managed rules": "\n# Managed rules:\n",
    "HTTP DDoS rules": "\n# HTTP DDoS rules:\n",
    "HTTP Methods": "\n# HTTP Methods: "
};

const httpMethods = [
    'GET', 'HEAD', 'OPTIONS', 'TRACE',
    'PUT', 'DELETE', 'POST', 'PATCH',
    'CONNECT', 'PROPFIND', 'PROPPATCH',
    'REPORT', 'MKCOL', 'MKCALENDAR',
    'ACL', 'COPY', 'MOVE', 'LOCL', 'UNLOCK'
];

const abuselink = 'https://www.abuseipdb.com/check/';
const crimilink = 'https://www.criminalip.io/asset/report/';
const viruslink = 'https://www.virustotal.com/gui/ip-address/';

function greetTime(){
    // Declare the class to get current time
    const time = new Date();
    // Get only the hour
    let currentHour = time.getHours();
    // Return the greeting based on the time range
    if (currentHour > 4 && currentHour <= 10){
        return "Selamat Pagi,";
    }
    else if (currentHour > 10 && currentHour <= 14){
        return "Selamat Siang,";
    }
    else if (currentHour > 14 && currentHour <= 19){
        return "Selamat Sore,";
    }
    else if ((currentHour > 19 && currentHour <= 24) || currentHour <= 4){
        return "Selamat Malam,";
    }
}

function getDate(){
    // Create Date() class
    const time = new Date();
    
    // Formatting the time
    let options = { day: '2-digit', month: 'long', year: 'numeric' };
    let date = time.toLocaleDateString('in-ID', options)
    return date;
}

function formatLogs(inputText) {
    const lines = inputText.split('\n');
    let formattedOutput = '';

    for (let i = 0; i < lines.length; i++) {
        const currentLine = lines[i].trim();

        if (currentLine) {
            if (currentLine.startsWith('#')) {
                formattedOutput += `\n${currentLine}\n`;
            } else {
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();

                    if (nextLine && /^\d[\d,]*$/.test(nextLine)) {
                        const severity = severityMap[currentLine] || "";
                        formattedOutput += `- ${currentLine} = ${nextLine} event(s) [Severity: ${severity}]\n`;
                        i++;
                    } else {
                        formattedOutput += `- ${currentLine} = [Missing event count] event(s) [Severity: ]\n`;
                    }
                } else {
                    formattedOutput += `- ${currentLine} = [Missing event count] event(s) [Severity: ]\n`;
                }
            }
        }
    }
    return formattedOutput;
}

function ceefFormatLogs(inputText){
    // Predefined
    let date = getDate();
    let predef = `Kami infokan ada serangan yang berlangsung pada ${date} sejak pukul [WAKTU] dan sudah ditangani CloudFlare. Untuk informasi lebih detail sebagai berikut:
\n`;

    // Preparing the inputs for parsing
    const lines = inputText.split('\n');
    let formattedOutput = predef;
    // Parsing
    for (let i = 0; i < lines.length; i++){
        let currentLine = lines[i].trim();
        // If some dummy paste it in
        if (currentLine === "Top events by source"){
            i++;
            continue;
        }
        // If it's a count
        else if (/(^\d*$)|(\d*k$)|(\d*M$)/.test(currentLine)){
            continue;
        }
        // If it's user agent
        else if (currentLine === "User Agents"){
            while(!(lines[i+1].trim() in cfHeaders)){
                i++;
                currentLine = lines[i].trim();
            }
        }
        // If it's referers
        else if (currentLine === "Referers"){
            while(!(lines[i+1].trim() in cfHeaders)){
                i++;
                currentLine = lines[i].trim();
            }
        }
        // If for some reason the input is empty
        else if (currentLine === ""){
            continue;
        }
        // Process good input
        else {
            // If it's a header
            if (currentLine in cfHeaders){
                formattedOutput += cfHeaders[currentLine];
            }
            // For http method section
            else if (httpMethods.includes(currentLine)){
                // Check if there is still antoher item
                if (lines[i+2]){
                    formattedOutput += `${currentLine}, `;
                }
                else {
                    formattedOutput += `${currentLine}`;
                }
            }
            else if (currentLine === "No data"){
                formattedOutput += `- N/A\n`;
            }
            else {
                formattedOutput += `- ${currentLine}\n`;
            }
        }

    }
    return formattedOutput;
}

async function formatIP(inputText) {
    const lines = inputText.split('\n');
    const ipregex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    let formattedOutput = [];
    let availableIp = [];
    let currentip, count = null;

    for (let i = 0; i < lines.length; i++) {
        const ipmatch = lines[i].match(ipregex);

        if(ipmatch) {
            currentip = ipmatch[0];
            availableIp.push(currentip)
        } else if (currentip && lines[i].trim().length > 0) {
            let category = await getCategory(currentip);
            count = lines[i].trim();
            if (category == 'clean') {
                if (count > 10) {
                    category = 'Bruteforce';
                } else if (count <= 10) {
                    category = 'Port Scan';
                }
            }
            formattedOutput.push(`${currentip} - ${count}x ${category}`);
            formattedOutput.push(`${abuselink}${currentip}`);
            formattedOutput.push(`${crimilink}${currentip}`);
            formattedOutput.push(`${viruslink}${currentip}\n`);
            currentip = null;
        }
    }
    return formattedOutput;
}

async function getCategoryAPI(ipAddr) {
    const ip = String(ipAddr);
    const maxAgeInDays = 365;
    const numPage = 1;
    const perPage = 25;
    let mostFrequentCategory = null;
    let maxCount = 0;
    const categoryCount = {};

    const url = new URL('https://api.abuseipdb.com/api/v2/reports');
    url.search = new URLSearchParams({
        ipAddress: ip,
        maxAgeInDays: maxAgeInDays,
        page: numPage,
        perPage: perPage
    });

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Key': abuseipkey,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const results = data.data.results;

        if (results.length === 0) {
            return 'clean';
        } else {
            results.forEach(report => {
                report.categories.forEach(category => {
                    categoryCount[category] = (categoryCount[category] || 0) + 1;
                });
            });
        }

        for (const category in categoryCount) {
            if (categoryCount[category] > maxCount) {
                maxCount = categoryCount[category];
                mostFrequentCategory = category;
            }
        }

        return mostFrequentCategory ? categoriesMap[mostFrequentCategory] : 'clean';
    } catch (error) {
        console.error('Error:', error);
        return 'Error occurred';
    }
}

async function getCategory(ipAddr) {
    const attack = await getCategoryAPI(String(ipAddr));
    return attack;
}

function getTimeStormwall(lines){
    // Filter the Hours 
    let time = lines.substr(lines.indexOf(":") - 2, 2);
    time = (+time + 4);
    if(time >= 24){
        time -= 24;
    }
    // Check whether or not someone uses the old / new dashboard
    const date = new Date();
    const hour = date.getHours();
    if (Math.abs(time - hour) > 1){
        time += 3;
    }
    time = time.toString().padStart(2,"0");
    // Get the minutes
    time += lines.substr(lines.indexOf(":"), 3);
    return time;
}

function stormwallLogs(inputText){
    // Getting today's date
    let date = getDate();

    // Preparing the inputs for parsing
    const lines = inputText.split('\n');
    
    // Getting the time of attack
    let i = 0;
    let time = getTimeStormwall(lines[i]);
    i++;

    // Predefined
    let predef = `Kami infokan sedang ada active attack pada stormwall tanggal ${date} jam ${time}, packet tersebut sudah di clean oleh StormWall. Untuk informasi lebih detail sebagai berikut:\n`;
    let formattedOutput = predef;

    // Parsing
    let rules;
    for (i; i < lines.length; i++){
        let currentLine = lines[i].trim();
        // If it's not empty
        if(currentLine !== ""){
            // Handle managed rules
            if (currentLine === "# Managed Rules:"){
                rules = `\n${currentLine}\n`;
                while(!(/(^PPS*)|(^BPS*)/.test(currentLine))){
                    i++;
                    currentLine = lines[i].trim();
                }
                rules += `- ${currentLine}\n`;
            }
            // Check if it's a header
            else if(currentLine.includes("#")){
                formattedOutput += `\n${currentLine}\n`;
            }
            // Check if it's an IP or if it's an ASN
            else if (/(^\d*\.\d*\.\d*\.\d*)|(^AS\d*)/.test(currentLine)){
                formattedOutput += `- ${currentLine}\n`;
            }
        }
    }
    formattedOutput += rules;

    return formattedOutput;
}

function networkLogs(selection, networkData) {
    // Say "selamat pagi, etc."
    let salam = greetTime();

    // Get date
    let date = getDate();

    // Create object for predefined & reassign selection to be used for routing
    let attr = {
        datacenter: null,
        stormwall: null,
        partial: null,
        no: null
    };
    if (selection === "NME") {
        attr = {
            datacenter: "NME Equinix SG, Singapore",
            stormwall: "",
            partial: "",
            no: ""
        };
        selection = "mrtg.newmediaexpress.com";
    } else if (selection === "MTEN") {
        attr = {
            datacenter: "NEX DC M-TEN, Jakarta",
            stormwall: "",
            partial: "",
            no: ""
        };
        selection = "prtg.cloudata.co.id";
    } else if (selection === "Edge") {
        attr = {
            datacenter: "Edge2 DC, Kuningan, Jakarta",
            stormwall: "",
            partial: "",
            no: ""
        };
        selection = "prtg-netmon.indo.net.id";
    }

    // Get the routing data and sort it
    networkData.forEach(row => {
        // console.log(row);
        if (row.monitoring === selection) {
            if (row.stormwall === "Full Stormwall") {
                attr.stormwall += `${row.prefix} => ${row.desc}\n`;
            } else if (row.stormwall === "Partial Stormwall") {
                attr.partial += `${row.prefix} => ${row.desc}\n`; 
            } else if (row.stormwall === "No Stormwall"){
                attr.no += `${row.prefix} => ${row.desc}\n`; 
            }
        }
    })

    // Parse routing
    let route = "";
    if (attr.stormwall !== "") {
        route += `(Full Stormwall)\n${attr.stormwall}\n`;
    } 
    if (attr.partial !== "") {
        route += `(Partial Stormwall)\n${attr.partial}\n`;
    } 
    if (attr.no !== "") {
        route += `(No Stormwall)\n${attr.no}\n`;
    }

    let predef = `${salam} network ${attr.datacenter} mengalami lonjakan traffic [inbound|outbound|total] yang tinggi pada ${date} pukul [WAKTU].\n\nMAX: +- [load]\n\nRouting:\n${route}Impact: [no_downtime|server_down] detected on StatusCake.\n\nTerima Kasih.`;

    return predef;
}

module.exports = { formatLogs, formatIP, formatLogs, ceefFormatLogs, greetTime, stormwallLogs, networkLogs };
