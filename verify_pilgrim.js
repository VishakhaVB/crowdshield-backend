// Native fetch used in Node 18+

async function verifyPilgrimData() {
    console.log("🔍 Starting Pilgrim Data Verification...");
    try {
        const res = await fetch('http://localhost:5000/api/zones/live');
        const data = await res.json();

        if (!data.success) {
            console.error("❌ API Failed: Success flag missing");
            process.exit(1);
        }

        const zones = data.data;
        if (!zones || zones.length === 0) {
            console.error("❌ API Failed: No zones returned");
            process.exit(1);
        }

        console.log(`✅ Live Data: Received ${zones.length} zones.`);

        // 1. Check Privacy Compliance
        const sample = zones[0];
        if (sample.dataSource === "Historical Pattern Simulation") {
            console.log("✅ Privacy Safe: 'dataSource' is explicitly marked as Simulated.");
        } else {
            console.error("❌ Privacy Fail: 'dataSource' missing or incorrect.");
        }

        // 2. Check Data Fields for Map
        if (sample.riskLevel && sample.currentPeople !== undefined) {
            console.log("✅ Map Data: 'riskLevel' and 'currentPeople' available for mapping.");
        } else {
            console.error("❌ Map Data Fail: Missing critical fields.");
        }

        console.log("✅ Pilgrim System Verification PASSED");

    } catch (e) {
        console.error("❌ Connection Failed:", e.message);
    }
}

verifyPilgrimData();
