/**
 * Ajmal Super 40 - Marksheet & Result Verification Engine
 * Generates verified digital scorecards with print layouts.
 */

(function () {
    "use strict";

    const STUDENT_DATA = [
        {
            roll_no: "AS40-2025-NEET-001",
            application_no: "250410089201",
            name: "Rahul Ahmed",
            father_name: "Mustafa Ahmed",
            gender: "Male",
            category: "General",
            exam: "NEET-UG",
            year: 2025,
            batch: "Super 40 Medical Repeater Batch",
            center_code: "AS-GHY-04 (Guwahati Central)",
            scores: {
                physics: { marks: 170, max: 180, percentile: 99.42 },
                chemistry: { marks: 165, max: 180, percentile: 99.18 },
                biology: { marks: 350, max: 360, percentile: 99.88 }
            },
            total_marks: 685,
            max_marks: 720,
            percentile: 99.78,
            air_rank: 342,
            category_rank: 210,
            state_rank: 4,
            status: "Qualified - Merit Allotment",
            allotted_institution: "Gauhati Medical College & Hospital (GMCH), Guwahati",
            course: "MBBS (Bachelor of Medicine & Surgery)",
            hash: "VERIFIED-AS40-9821-E8"
        },
        {
            roll_no: "AS40-2025-NEET-002",
            application_no: "250410089202",
            name: "Tanvi Begum",
            father_name: "Rafiqul Islam",
            gender: "Female",
            category: "OBC-NCL",
            exam: "NEET-UG",
            year: 2025,
            batch: "Super 40 Medical Class 12 Batch",
            center_code: "AS-NAG-01 (Nagaon)",
            scores: {
                physics: { marks: 160, max: 180, percentile: 98.92 },
                chemistry: { marks: 162, max: 180, percentile: 99.04 },
                biology: { marks: 344, max: 360, percentile: 99.64 }
            },
            total_marks: 666,
            max_marks: 720,
            percentile: 99.46,
            air_rank: 820,
            category_rank: 195,
            state_rank: 12,
            status: "Qualified - Merit Allotment",
            allotted_institution: "Assam Medical College (AMC), Dibrugarh",
            course: "MBBS",
            hash: "VERIFIED-AS40-4491-B2"
        },
        {
            roll_no: "AS40-2025-NEET-003",
            application_no: "250410089203",
            name: "Ananya Sharma",
            father_name: "Dipak Sharma",
            gender: "Female",
            category: "EWS",
            exam: "NEET-UG",
            year: 2025,
            batch: "Super 40 Medical Class 12 Batch",
            center_code: "AS-GHY-02 (Guwahati South)",
            scores: {
                physics: { marks: 168, max: 180, percentile: 99.35 },
                chemistry: { marks: 172, max: 180, percentile: 99.71 },
                biology: { marks: 355, max: 360, percentile: 99.94 }
            },
            total_marks: 695,
            max_marks: 720,
            percentile: 99.91,
            air_rank: 145,
            category_rank: 18,
            state_rank: 2,
            status: "Qualified - Top Tier Allotment",
            allotted_institution: "All India Institute of Medical Sciences (AIIMS), Guwahati",
            course: "MBBS",
            hash: "VERIFIED-AS40-7712-A1"
        },
        {
            roll_no: "AS40-2025-JEE-001",
            application_no: "250310045101",
            name: "Priyanka Sarma",
            father_name: "Hemanta Sarma",
            gender: "Female",
            category: "General",
            exam: "JEE-Advanced",
            year: 2025,
            batch: "Super 40 Engineering Class 12 Batch",
            center_code: "AS-GHY-01 (Guwahati North)",
            scores: {
                physics: { marks: 88, max: 120, percentile: 99.62 },
                chemistry: { marks: 79, max: 120, percentile: 98.95 },
                mathematics: { marks: 94, max: 120, percentile: 99.88 }
            },
            total_marks: 261,
            max_marks: 360,
            percentile: 99.72,
            air_rank: 640,
            category_rank: 480,
            state_rank: 1,
            status: "Qualified - IIT Allocation",
            allotted_institution: "Indian Institute of Technology (IIT), Kharagpur",
            course: "B.Tech Computer Science & Engineering",
            hash: "VERIFIED-AS40-6623-C3"
        },
        {
            roll_no: "AS40-2025-JEE-002",
            application_no: "250310045102",
            name: "Arif Hussain",
            father_name: "Kabir Hussain",
            gender: "Male",
            category: "OBC-NCL",
            exam: "JEE-Main",
            year: 2025,
            batch: "Super 40 Engineering Class 12 Batch",
            center_code: "AS-HOJ-01 (Hojai)",
            scores: {
                physics: { marks: 92, max: 100, percentile: 99.48 },
                chemistry: { marks: 84, max: 100, percentile: 98.81 },
                mathematics: { marks: 91, max: 100, percentile: 99.35 }
            },
            total_marks: 267,
            max_marks: 300,
            percentile: 99.41,
            air_rank: 1820,
            category_rank: 390,
            state_rank: 5,
            status: "Qualified - NIT Home State Top Allotment",
            allotted_institution: "National Institute of Technology (NIT), Silchar",
            course: "B.Tech Electronics & Communication Engineering",
            hash: "VERIFIED-AS40-1129-D4"
        }
    ];

    function init() {
        const inputEl = document.getElementById("verification-input");
        const formEl = document.getElementById("verification-form");
        const resultContainer = document.getElementById("verification-result-container");
        const pills = document.querySelectorAll(".roll-pill");

        pills.forEach((pill) => {
            pill.addEventListener("click", () => {
                const roll = pill.dataset.roll;
                if (inputEl) inputEl.value = roll;
                verifyRoll(roll);
            });
        });

        if (formEl) {
            formEl.addEventListener("submit", (e) => {
                e.preventDefault();
                const roll = inputEl.value.trim();
                verifyRoll(roll);
            });
        }

        // Auto check if URL contains ?roll=
        const urlParams = new URLSearchParams(window.location.search);
        const queryRoll = urlParams.get("roll");
        if (queryRoll) {
            if (inputEl) inputEl.value = queryRoll;
            verifyRoll(queryRoll);
        }
    }

    function verifyRoll(query) {
        const resultContainer = document.getElementById("verification-result-container");
        if (!resultContainer) return;

        const cleanQuery = query.trim().toUpperCase();
        const student = STUDENT_DATA.find(
            (s) => s.roll_no.toUpperCase() === cleanQuery || s.name.toUpperCase().includes(cleanQuery)
        );

        if (!student) {
            resultContainer.innerHTML = `
                <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:24px; text-align:center; color:#991b1b; margin-top:20px;">
                    <h3>No Result Record Found</h3>
                    <p>No verified scorecard found matching "${query}". Please check the Roll Number or click one of the sample quick pills above.</p>
                </div>
            `;
            return;
        }

        // Render marks breakdown
        let subjectRows = "";
        for (const [sub, data] of Object.entries(student.scores)) {
            const subTitle = sub.charAt(0).toUpperCase() + sub.slice(1);
            subjectRows += `
                <tr>
                    <td><strong>${subTitle}</strong></td>
                    <td>${data.max}</td>
                    <td><strong>${data.marks}</strong></td>
                    <td>${data.percentile ? data.percentile + " %ile" : "N/A"}</td>
                </tr>
            `;
        }

        resultContainer.innerHTML = `
            <div class="marksheet-card" id="printable-marksheet">
                <div class="marksheet-watermark" aria-hidden="true">
                    <img src="../../images.jpg" alt="">
                </div>

                <div class="marksheet-header">
                    <div class="marksheet-brand">
                        <img src="../../images.jpg" alt="Ajmal Super 40 Crest">
                        <div class="marksheet-title">
                            <h2>AJMAL SUPER 40 ACADEMIC BOARD</h2>
                            <p>Official Verification &amp; Performance Marksheet · ${student.year}</p>
                        </div>
                    </div>
                    <div class="verified-seal-badge">
                        <span class="seal-icon">✓ Authenticated Record</span>
                        <div class="verification-meta">Hash: ${student.hash}</div>
                    </div>
                </div>

                <div class="candidate-profile-grid">
                    <div class="profile-field">
                        <strong>Student Name</strong>
                        <span>${student.name}</span>
                    </div>
                    <div class="profile-field">
                        <strong>Father's Name</strong>
                        <span>${student.father_name}</span>
                    </div>
                    <div class="profile-field">
                        <strong>Roll Number</strong>
                        <span>${student.roll_no}</span>
                    </div>
                    <div class="profile-field">
                        <strong>Application No.</strong>
                        <span>${student.application_no}</span>
                    </div>
                    <div class="profile-field">
                        <strong>Target Exam</strong>
                        <span>${student.exam} (${student.year})</span>
                    </div>
                    <div class="profile-field">
                        <strong>Category &amp; Gender</strong>
                        <span>${student.category} · ${student.gender}</span>
                    </div>
                    <div class="profile-field">
                        <strong>Institute Batch</strong>
                        <span>${student.batch}</span>
                    </div>
                    <div class="profile-field">
                        <strong>Examination Center</strong>
                        <span>${student.center_code}</span>
                    </div>
                    <div class="profile-field">
                        <strong>All India Rank (AIR)</strong>
                        <span style="color:#d97706; font-size:1.2rem;">AIR ${student.air_rank}</span>
                    </div>
                </div>

                <h3 style="margin-bottom:12px;">Subject-wise Marks &amp; Scorecard Details</h3>
                <table class="marks-breakdown-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Maximum Marks</th>
                            <th>Marks Obtained</th>
                            <th>Subject Percentile</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subjectRows}
                        <tr class="marks-total-row">
                            <td>TOTAL EVALUATION</td>
                            <td>${student.max_marks}</td>
                            <td>${student.total_marks}</td>
                            <td>${student.percentile} %ile</td>
                        </tr>
                    </tbody>
                </table>

                <div class="allotment-banner">
                    <div class="allotment-details">
                        <h4>Allotted College / Placement</h4>
                        <p>${student.allotted_institution} — <strong>${student.course}</strong></p>
                    </div>
                    <div style="text-align:right;">
                        <span class="rank-badge" style="background:#fff; color:var(--green-dark);">State Rank: #${student.state_rank}</span>
                    </div>
                </div>

                <aside class="demo-disclaimer" style="margin-top:24px;">
                    <strong>Fictional Demonstration Marksheet:</strong> All data displayed on this credential is for layout and testing demonstration. This document does not constitute an official legal credential.
                </aside>

                <div class="marksheet-actions">
                    <button class="button-link btn-secondary" onclick="window.print();">🖨 Print / Download Official PDF</button>
                    <a class="button-link btn-outline" href="rank-list.html">View Merit Roll List →</a>
                </div>
            </div>
        `;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
