const http = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ error: 'Invalid JSON', raw: data });
                }
            });
        }).on('error', reject);
    });
}

async function verify() {
    console.log("--- STARTING SYSTEM VERIFICATION ---");

    try {
        console.log("Checking API: http://localhost:5000/api/zones/live");
        const zonesRes = await get('http://localhost:5000/api/zones/live');

        if (!zonesRes.success) {
            console.error("FAIL: API returned success: false. Response:", JSON.stringify(zonesRes, null, 2));
            return;
        }

        const zones = zonesRes.data;
        console.log(`Received ${zones.length} zones.`);

        // CHECK 1: ZONE COUNT (Expected 10)
        if (zones.length === 10) {
            console.log("PASS: Correct Zone Count (10)");
        } else {
            console.error(`FAIL: Expected 10 zones, found ${zones.length}. (Restart might have failed)`);
        }

        // CHECK 2: ZONE DATA STRUCTURE
        const z01 = zones.find(z => z.zoneId === 'Z01');
        if (z01) {
            console.log("PASS: Found Zone Z01");
            console.log(`Z01 Stats: People=${z01.currentPeople}, Risk=${z01.riskLevel}, Reason="${z01.reason}"`);

            if (z01.reason) {
                console.log("PASS: Reason field exists.");
            } else {
                console.error("FAIL: Reason field missing.");
            }
        } else {
            console.error("FAIL: Zone Z01 not found.");
        }

    } catch (err) {
        console.error("FAIL: Could not connect to backend. Is it running?", err.message);
    }
    console.log("--- VERIFICATION COMPLETE ---");
}

verify();
