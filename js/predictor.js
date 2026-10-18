/**
 * Ajmal Super 40 - Rank & College Predictor Engine (Client-side)
 * Mirroring the Python analytical rank engine for instant real-time UI feedback.
 */

(function () {
    "use strict";

    function predictNEET(marks, category) {
        marks = Math.max(0, Math.min(720, parseInt(marks, 10) || 0));
        let percentile, airCenter;

        if (marks >= 700) {
            percentile = 99.90 + (marks - 700) * 0.005;
            airCenter = Math.max(1, Math.round(150 - (marks - 700) * 7));
        } else if (marks >= 650) {
            percentile = 99.10 + (marks - 650) * (0.80 / 50);
            airCenter = Math.round(2500 - (marks - 650) * 45);
        } else if (marks >= 600) {
            percentile = 96.50 + (marks - 600) * (2.60 / 50);
            airCenter = Math.round(12000 - (marks - 600) * 190);
        } else if (marks >= 500) {
            percentile = 88.00 + (marks - 500) * (8.50 / 100);
            airCenter = Math.round(55000 - (marks - 500) * 430);
        } else if (marks >= 400) {
            percentile = 74.00 + (marks - 400) * (14.00 / 100);
            airCenter = Math.round(140000 - (marks - 400) * 850);
        } else if (marks >= 200) {
            percentile = 45.00 + (marks - 200) * (29.00 / 200);
            airCenter = Math.round(450000 - (marks - 200) * 1550);
        } else {
            percentile = Math.max(5.0, (marks / 200.0) * 45.0);
            airCenter = Math.round(1200000 - marks * 3500);
        }

        airCenter = Math.max(1, airCenter);
        const variance = Math.max(15, Math.round(airCenter * 0.12));
        const airLow = Math.max(1, airCenter - variance);
        const airHigh = airCenter + variance;

        let colleges = [];
        if (marks >= 680) {
            colleges = [
                { name: "AIIMS New Delhi", tier: "Apex National", chance: "Competitive" },
                { name: "AIIMS Guwahati", tier: "Top Central", chance: "High Chance" },
                { name: "Gauhati Medical College (GMCH)", tier: "Premier State", chance: "Definite" }
            ];
        } else if (marks >= 630) {
            colleges = [
                { name: "AIIMS Guwahati", tier: "Top Central", chance: "Moderate Chance" },
                { name: "Gauhati Medical College (GMCH)", tier: "Premier State", chance: "High Chance" },
                { name: "Assam Medical College (AMC), Dibrugarh", tier: "State GMC", chance: "Definite" },
                { name: "Silchar Medical College (SMCH)", tier: "State GMC", chance: "Definite" }
            ];
        } else if (marks >= 560) {
            colleges = [
                { name: "Silchar Medical College (SMCH)", tier: "State GMC", chance: "Good Chance" },
                { name: "Jorhat Medical College (JMCH)", tier: "State GMC", chance: "High Chance" },
                { name: "Fakhruddin Ali Ahmed Medical College (FAAMC)", tier: "State GMC", chance: "Definite" },
                { name: "Regional Dental College (BDS)", tier: "Dental Govt", chance: "Definite" }
            ];
        } else if (marks >= 450) {
            colleges = [
                { name: "Govt Ayurvedic & Homeopathic Medical College", tier: "AYUSH Govt", chance: "High Chance" },
                { name: "Veterinary Science & Animal Husbandry", tier: "Allied Govt", chance: "Definite" },
                { name: "State Merit Private Medical Seats", tier: "Private Merit", chance: "Available" }
            ];
        } else {
            colleges = [
                { name: "AYUSH / Allied Sciences Entrance", tier: "Allied", chance: "Opportunity" },
                { name: "Ajmal Super 40 Intensive Repeater Batch", tier: "Booster", chance: "Recommended" }
            ];
        }

        return {
            marks,
            airLow,
            airHigh,
            percentile: percentile.toFixed(2),
            colleges
        };
    }

    function predictJEE(score, category) {
        score = Math.max(0, Math.min(300, parseInt(score, 10) || 0));
        let percentile;

        if (score >= 260) {
            percentile = 99.70 + (score - 260) * (0.29 / 40);
        } else if (score >= 210) {
            percentile = 99.00 + (score - 210) * (0.70 / 50);
        } else if (score >= 170) {
            percentile = 98.00 + (score - 170) * (1.00 / 40);
        } else if (score >= 130) {
            percentile = 95.50 + (score - 130) * (2.50 / 40);
        } else if (score >= 90) {
            percentile = 89.00 + (score - 90) * (6.50 / 40);
        } else if (score >= 50) {
            percentile = 72.00 + (score - 50) * (17.00 / 40);
        } else {
            percentile = Math.max(5.0, (score / 50.0) * 70.0);
        }

        percentile = Math.min(99.99, Math.max(1.0, percentile));
        const air = Math.max(1, Math.round(((100.0 - percentile) / 100.0) * 1250000));
        const isAdvancedEligible = percentile >= (category === "General" ? 90.5 : 78.0);

        let colleges = [];
        if (percentile >= 99.3) {
            colleges = [
                { name: "NIT Trichy / Surathkal / Warangal (CSE)", tier: "Top Tier NIT", chance: "High Chance" },
                { name: "NIT Silchar (Computer Science & Engg)", tier: "Premier NIT", chance: "Definite" },
                { name: "IIT Pipeline (Target AIR < 2500)", tier: "Apex IIT", chance: "Advanced Focus" }
            ];
        } else if (percentile >= 97.0) {
            colleges = [
                { name: "NIT Silchar (ECE / Electrical)", tier: "Premier NIT", chance: "High Chance" },
                { name: "IIIT Guwahati (Computer Science)", tier: "Central IIIT", chance: "High Chance" },
                { name: "Assam Engineering College (AEC), Guwahati", tier: "Premier State", chance: "Definite" }
            ];
        } else if (percentile >= 92.0) {
            colleges = [
                { name: "NIT Silchar (Civil / Mechanical)", tier: "Premier NIT", chance: "Moderate Chance" },
                { name: "Assam Engineering College (AEC), Guwahati", tier: "Premier State", chance: "High Chance" },
                { name: "Jorhat Engineering College (JEC)", tier: "State Engineering", chance: "Definite" }
            ];
        } else {
            colleges = [
                { name: "State Govt Engineering & Tech Colleges", tier: "State Govt", chance: "Good Chance" },
                { name: "Tezpur University (School of Engineering)", tier: "Central Univ", chance: "Moderate" }
            ];
        }

        return {
            score,
            air,
            percentile: percentile.toFixed(2),
            isAdvancedEligible,
            colleges
        };
    }

    function init() {
        // NEET Predictor controls
        const neetSlider = document.getElementById("neet-slider");
        const neetScoreInput = document.getElementById("neet-score-input");
        const neetCatSelect = document.getElementById("neet-category");

        function updateNEETUI() {
            if (!neetSlider) return;
            const marks = neetSlider.value;
            if (neetScoreInput) neetScoreInput.value = marks;
            const cat = neetCatSelect ? neetCatSelect.value : "General";

            const result = predictNEET(marks, cat);

            const scoreDisplay = document.getElementById("neet-display-marks");
            if (scoreDisplay) scoreDisplay.textContent = result.marks;

            const airDisplay = document.getElementById("neet-display-air");
            if (airDisplay) airDisplay.textContent = `${result.airLow.toLocaleString()} - ${result.airHigh.toLocaleString()}`;

            const pctDisplay = document.getElementById("neet-display-percentile");
            if (pctDisplay) pctDisplay.textContent = `${result.percentile} %ile`;

            const collegesBox = document.getElementById("neet-colleges-list");
            if (collegesBox) {
                collegesBox.innerHTML = result.colleges
                    .map(
                        (c) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eef5f2;">
                        <div>
                            <strong>${c.name}</strong>
                            <div style="font-size:0.8rem; color:var(--muted);">${c.tier}</div>
                        </div>
                        <span class="college-chance-chip chance-high">${c.chance}</span>
                    </div>
                `
                    )
                    .join("");
            }
        }

        if (neetSlider) {
            neetSlider.addEventListener("input", () => {
                if (neetScoreInput) neetScoreInput.value = neetSlider.value;
                updateNEETUI();
            });
        }
        if (neetScoreInput) {
            neetScoreInput.addEventListener("input", () => {
                if (neetSlider) neetSlider.value = neetScoreInput.value;
                updateNEETUI();
            });
        }
        if (neetCatSelect) {
            neetCatSelect.addEventListener("change", updateNEETUI);
        }

        // JEE Predictor controls
        const jeeSlider = document.getElementById("jee-slider");
        const jeeScoreInput = document.getElementById("jee-score-input");
        const jeeCatSelect = document.getElementById("jee-category");

        function updateJEEUI() {
            if (!jeeSlider) return;
            const score = jeeSlider.value;
            if (jeeScoreInput) jeeScoreInput.value = score;
            const cat = jeeCatSelect ? jeeCatSelect.value : "General";

            const result = predictJEE(score, cat);

            const scoreDisplay = document.getElementById("jee-display-score");
            if (scoreDisplay) scoreDisplay.textContent = result.score;

            const airDisplay = document.getElementById("jee-display-air");
            if (airDisplay) airDisplay.textContent = `~ ${result.air.toLocaleString()}`;

            const pctDisplay = document.getElementById("jee-display-percentile");
            if (pctDisplay) pctDisplay.textContent = `${result.percentile} %ile`;

            const advStatus = document.getElementById("jee-display-adv-status");
            if (advStatus) {
                advStatus.textContent = result.isAdvancedEligible ? "✓ Eligible for JEE Advanced" : "○ Focus on Main / State CEE";
                advStatus.style.color = result.isAdvancedEligible ? "#10b981" : "#d97706";
            }

            const collegesBox = document.getElementById("jee-colleges-list");
            if (collegesBox) {
                collegesBox.innerHTML = result.colleges
                    .map(
                        (c) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eef5f2;">
                        <div>
                            <strong>${c.name}</strong>
                            <div style="font-size:0.8rem; color:var(--muted);">${c.tier}</div>
                        </div>
                        <span class="college-chance-chip chance-high">${c.chance}</span>
                    </div>
                `
                    )
                    .join("");
            }
        }

        if (jeeSlider) {
            jeeSlider.addEventListener("input", () => {
                if (jeeScoreInput) jeeScoreInput.value = jeeSlider.value;
                updateJEEUI();
            });
        }
        if (jeeScoreInput) {
            jeeScoreInput.addEventListener("input", () => {
                if (jeeSlider) jeeSlider.value = jeeScoreInput.value;
                updateJEEUI();
            });
        }
        if (jeeCatSelect) {
            jeeCatSelect.addEventListener("change", updateJEEUI);
        }

        // Run initial calculations
        updateNEETUI();
        updateJEEUI();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
