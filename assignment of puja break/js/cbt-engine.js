/**
 * Ajmal Super 40 - Computer Based Test (CBT) Interactive Simulation Engine
 * Handles countdown timer, question palette, section navigation, score calculation,
 * and comprehensive result analytics with full solution breakdowns.
 */

(function () {
    "use strict";

    // Embedded question bank fallback for offline/file-protocol execution
    const FALLBACK_EXAM_DATA = {
        neet: {
            title: "Ajmal Super 40 NEET Full Mock Test 01",
            duration_minutes: 45,
            total_questions: 12,
            max_marks: 48,
            marking_scheme: { correct: 4, incorrect: -1, unattempted: 0 },
            sections: ["Physics", "Chemistry", "Biology"],
            questions: [
                {
                    id: "N-PHY-01",
                    section: "Physics",
                    topic: "Kinematics",
                    question: "A particle starts from rest and moves with a uniform acceleration of 4 m/s² for 5 seconds. What is the displacement covered in the 5th second?",
                    options: ["18 m", "22 m", "16 m", "20 m"],
                    correct: 0,
                    explanation: "Formula: S_n = u + a/2 * (2n - 1). Here u = 0, a = 4, n = 5 => S_5 = 0 + (4/2) * (2*5 - 1) = 2 * 9 = 18 m."
                },
                {
                    id: "N-PHY-02",
                    section: "Physics",
                    topic: "Current Electricity",
                    question: "Two resistors of resistances 6 Ω and 3 Ω are connected in parallel across a 12 V battery of negligible internal resistance. The total current drawn from the battery is:",
                    options: ["2 A", "4 A", "6 A", "18 A"],
                    correct: 2,
                    explanation: "1/R_eq = 1/6 + 1/3 = 3/6 => R_eq = 2 Ω. Current I = V / R_eq = 12 / 2 = 6 A."
                },
                {
                    id: "N-PHY-03",
                    section: "Physics",
                    topic: "Ray Optics",
                    question: "A convex lens of focal length 20 cm is placed in contact with a concave lens of focal length 30 cm. The focal length and nature of the combination is:",
                    options: ["+60 cm, Converging", "-60 cm, Diverging", "+50 cm, Converging", "-50 cm, Diverging"],
                    correct: 0,
                    explanation: "1/F = 1/f1 + 1/f2 = 1/20 - 1/30 = 1/60 => F = +60 cm. Positive focal length indicates a converging system."
                },
                {
                    id: "N-PHY-04",
                    section: "Physics",
                    topic: "Thermodynamics",
                    question: "An ideal gas undergoes an isothermal expansion. Which of the following thermodynamic quantities remains constant during this process?",
                    options: ["Volume", "Pressure", "Internal Energy", "Entropy"],
                    correct: 2,
                    explanation: "For an ideal gas, internal energy depends solely on temperature. Because temperature is constant in an isothermal process (ΔT = 0), ΔU = 0."
                },
                {
                    id: "N-CHM-01",
                    section: "Chemistry",
                    topic: "Chemical Bonding",
                    question: "Which of the following molecules has a square planar geometry according to VSEPR theory?",
                    options: ["SF4", "XeF4", "CH4", "NH4+"],
                    correct: 1,
                    explanation: "XeF4 has 4 bond pairs and 2 lone pairs on Xenon (sp³d² hybridisation). The lone pairs occupy axial positions, yielding square planar geometry."
                },
                {
                    id: "N-CHM-02",
                    section: "Chemistry",
                    topic: "Organic Reactions",
                    question: "When ethyl alcohol is heated with concentrated sulfuric acid (H2SO4) at 443 K (170°C), the major product formed is:",
                    options: ["Diethyl ether", "Ethene", "Ethyl hydrogen sulphate", "Ethanal"],
                    correct: 1,
                    explanation: "At 443 K, high temperature favours β-elimination (dehydration) to form ethene (CH2=CH2)."
                },
                {
                    id: "N-CHM-03",
                    section: "Chemistry",
                    topic: "Electrochemistry",
                    question: "The standard reduction potential for Zn²⁺/Zn is -0.76 V and for Cu²⁺/Cu is +0.34 V. The standard EMF of the Daniell cell is:",
                    options: ["+0.42 V", "-1.10 V", "+1.10 V", "+0.76 V"],
                    correct: 2,
                    explanation: "E°_cell = E°_cathode - E°_anode = +0.34 - (-0.76) = +1.10 V."
                },
                {
                    id: "N-CHM-04",
                    section: "Chemistry",
                    topic: "Equilibrium",
                    question: "For the reaction N2(g) + 3H2(g) ⇌ 2NH3(g) (ΔH < 0), which condition shifts the equilibrium forward towards ammonia synthesis?",
                    options: [
                        "Decreasing pressure and increasing temperature",
                        "Increasing pressure and decreasing temperature",
                        "Adding an inert gas at constant volume",
                        "Removing nitrogen gas"
                    ],
                    correct: 1,
                    explanation: "Fewer moles on the right (4 -> 2) require high pressure; exothermic reaction (ΔH < 0) favours low temperature."
                },
                {
                    id: "N-BIO-01",
                    section: "Biology",
                    topic: "Cell Biology",
                    question: "Which organelle is known as the site of aerobic respiration and synthesis of ATP in eukaryotic cells?",
                    options: ["Ribosome", "Chloroplast", "Mitochondria", "Golgi apparatus"],
                    correct: 2,
                    explanation: "Mitochondria contain the Krebs cycle enzymes and electron transport system that synthesize ATP via oxidative phosphorylation."
                },
                {
                    id: "N-BIO-02",
                    section: "Biology",
                    topic: "Genetics & Evolution",
                    question: "In Mendelian genetics, a cross between two heterozygous tall pea plants (Tt x Tt) produces what phenotypic ratio of Tall to Dwarf plants in the F2 generation?",
                    options: ["1:1", "3:1", "1:2:1", "9:3:3:1"],
                    correct: 1,
                    explanation: "Phenotypic ratio is 3 Tall (1 TT + 2 Tt) : 1 Dwarf (1 tt). The genotypic ratio is 1:2:1."
                },
                {
                    id: "N-BIO-03",
                    section: "Biology",
                    topic: "Plant Physiology",
                    question: "The primary CO2 acceptor molecule in C4 plants during the Hatch-Slack pathway is:",
                    options: ["Ribulose-1,5-bisphosphate (RuBP)", "Phosphoenolpyruvate (PEP)", "Oxaloacetic acid (OAA)", "Phosphoglycerate (PGA)"],
                    correct: 1,
                    explanation: "In C4 plants, PEP (phosphoenolpyruvate, 3C) is the primary acceptor, catalyzed by PEP carboxylase in mesophyll cells."
                },
                {
                    id: "N-BIO-04",
                    section: "Biology",
                    topic: "Human Physiology",
                    question: "Which hormone is secreted by the alpha cells of the Islets of Langerhans in the pancreas to elevate blood glucose levels?",
                    options: ["Insulin", "Glucagon", "Somatostatin", "Cortisol"],
                    correct: 1,
                    explanation: "Glucagon is secreted by alpha cells to stimulate glycogen breakdown in the liver and raise blood glucose."
                }
            ]
        },
        jee: {
            title: "Ajmal Super 40 JEE Main Mock Test 01",
            duration_minutes: 45,
            total_questions: 9,
            max_marks: 36,
            marking_scheme: { correct: 4, incorrect: -1, unattempted: 0 },
            sections: ["Physics", "Chemistry", "Mathematics"],
            questions: [
                {
                    id: "J-PHY-01",
                    section: "Physics",
                    topic: "Rotational Motion",
                    question: "A solid cylinder of mass M and radius R rolls down an inclined plane of inclination θ without slipping. The acceleration of its center of mass is:",
                    options: ["(2/3) g sin θ", "(1/2) g sin θ", "(3/4) g sin θ", "g sin θ"],
                    correct: 0,
                    explanation: "a = (g sin θ) / (1 + I_cm / MR²). For a solid cylinder I_cm = 1/2 MR² => a = (g sin θ) / (1 + 1/2) = (2/3) g sin θ."
                },
                {
                    id: "J-PHY-02",
                    section: "Physics",
                    topic: "Electrostatics",
                    question: "A parallel plate capacitor with air between the plates has capacitance C. If a dielectric slab of dielectric constant K = 4 is inserted filling half the plate separation, the new capacitance is:",
                    options: ["1.6 C", "2.5 C", "3.2 C", "4.0 C"],
                    correct: 0,
                    explanation: "Two capacitors in series of thickness d/2: C1 = 2C, C2 = 2*4*C = 8C. C_eq = (2*8)/(2+8) C = 16/10 C = 1.6 C."
                },
                {
                    id: "J-PHY-03",
                    section: "Physics",
                    topic: "Modern Physics",
                    question: "The de Broglie wavelength of an electron accelerated through an electric potential difference of 100 V is approximately:",
                    options: ["1.227 Å", "0.123 Å", "12.27 Å", "0.012 Å"],
                    correct: 0,
                    explanation: "λ = 12.27 / √V Å = 12.27 / √100 = 12.27 / 10 = 1.227 Å."
                },
                {
                    id: "J-CHM-01",
                    section: "Chemistry",
                    topic: "Coordination Compounds",
                    question: "What is the primary valency and secondary valency of Cobalt in the complex [Co(NH3)5Cl]Cl2?",
                    options: ["Primary = 3, Secondary = 6", "Primary = 2, Secondary = 5", "Primary = 1, Secondary = 6", "Primary = 3, Secondary = 5"],
                    correct: 0,
                    explanation: "Oxidation state (primary valency) = +3; Coordination number (secondary valency) = 5 NH3 + 1 Cl = 6."
                },
                {
                    id: "J-CHM-02",
                    section: "Chemistry",
                    topic: "Chemical Kinetics",
                    question: "A first-order reaction has a rate constant k = 6.93 × 10⁻³ s⁻¹. The half-life (t_1/2) of this reaction is:",
                    options: ["100 seconds", "69.3 seconds", "10 seconds", "1000 seconds"],
                    correct: 0,
                    explanation: "t_1/2 = 0.693 / k = 0.693 / (6.93 × 10⁻³) = 100 s."
                },
                {
                    id: "J-CHM-03",
                    section: "Chemistry",
                    topic: "Organic Chemistry",
                    question: "The major product of the reaction between benzaldehyde and acetophenone in dilute NaOH (Claisen-Schmidt condensation) is:",
                    options: ["Benzalacetophenone (Chalcone)", "Cinnamic acid", "Benzophenone", "Benzyl alcohol"],
                    correct: 0,
                    explanation: "Benzaldehyde (no α-H) and acetophenone undergo crossed aldol condensation to give 1,3-diphenylprop-2-en-1-one (chalcone)."
                },
                {
                    id: "J-MTH-01",
                    section: "Mathematics",
                    topic: "Definite Integrals",
                    question: "The value of the definite integral ∫ from 0 to π/2 of (sin x) / (sin x + cos x) dx is:",
                    options: ["π", "π/2", "π/4", "0"],
                    correct: 2,
                    explanation: "Using property I = ∫[0, π/2] (sin(π/2 - x))/(sin(π/2-x)+cos(π/2-x)) = ∫[0, π/2] (cos x)/(cos x + sin x). 2I = π/2 => I = π/4."
                },
                {
                    id: "J-MTH-02",
                    section: "Mathematics",
                    topic: "Matrices & Determinants",
                    question: "If A is a 3 × 3 matrix such that |A| = 4, then the determinant of the adjoint matrix |adj(A)| is equal to:",
                    options: ["4", "16", "64", "12"],
                    correct: 1,
                    explanation: "|adj(A)| = |A|^(n - 1) = 4^(3 - 1) = 4² = 16."
                },
                {
                    id: "J-MTH-03",
                    section: "Mathematics",
                    topic: "Coordinate Geometry",
                    question: "The locus of the point of intersection of perpendicular tangents to the parabola y² = 4ax is:",
                    options: ["y = 0", "x = -a (Directrix)", "x = a", "x² + y² = a²"],
                    correct: 1,
                    explanation: "The locus of points of intersection of perpendicular tangents to y² = 4ax is its directrix x + a = 0."
                }
            ]
        }
    };

    class CBTEngine {
        constructor() {
            this.examType = "neet";
            this.examData = null;
            this.currentIndex = 0;
            this.userResponses = {}; // { questionIndex: selectedOptionIndex }
            this.reviewFlags = {};   // { questionIndex: boolean }
            this.visitedFlags = {};  // { questionIndex: boolean }
            this.timerSeconds = 45 * 60;
            this.timerInterval = null;
            this.currentSection = null;
            this.isSubmitted = false;

            this.init();
        }

        async init() {
            // Determine exam type from URL params or default
            const urlParams = new URLSearchParams(window.location.search);
            const requestedExam = urlParams.get("exam") || "neet";
            this.examType = requestedExam.toLowerCase() === "jee" ? "jee" : "neet";

            // Attempt to load from API server if running, else use fallback
            try {
                const response = await fetch(`/api/v1/cbt/questions?exam=${this.examType}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.data) {
                        this.examData = data.data;
                    }
                }
            } catch (err) {
                // Ignore network errors on file:/// or non-server execution
            }

            if (!this.examData) {
                this.examData = FALLBACK_EXAM_DATA[this.examType];
            }

            this.timerSeconds = this.examData.duration_minutes * 60;
            this.currentSection = this.examData.sections[0];
            this.visitedFlags[0] = true;

            this.cacheDOM();
            this.bindEvents();
            this.renderSectionTabs();
            this.renderPalette();
            this.renderCurrentQuestion();
            this.startTimer();
        }

        cacheDOM() {
            this.titleEl = document.getElementById("cbt-title");
            this.timerEl = document.getElementById("cbt-timer");
            this.sectionsNavEl = document.getElementById("cbt-sections-nav");
            this.questionAreaEl = document.getElementById("cbt-question-area");
            this.paletteGridEl = document.getElementById("cbt-palette-grid");
            this.scorecardContainer = document.getElementById("cbt-scorecard-container");
            this.examConsoleEl = document.getElementById("cbt-exam-console");
            this.submitBtn = document.getElementById("cbt-submit-btn");
        }

        bindEvents() {
            if (this.submitBtn) {
                this.submitBtn.addEventListener("click", () => {
                    const answeredCount = Object.keys(this.userResponses).length;
                    const totalCount = this.examData.questions.length;
                    const confirmed = window.confirm(
                        `You have attempted ${answeredCount} of ${totalCount} questions.\nDo you want to finalize and submit your test now?`
                    );
                    if (confirmed) {
                        this.submitExam();
                    }
                });
            }
        }

        startTimer() {
            if (this.timerInterval) clearInterval(this.timerInterval);

            this.updateTimerDisplay();
            this.timerInterval = setInterval(() => {
                if (this.timerSeconds > 0) {
                    this.timerSeconds--;
                    this.updateTimerDisplay();
                    if (this.timerSeconds <= 300) {
                        this.timerEl.classList.add("warning");
                    }
                } else {
                    clearInterval(this.timerInterval);
                    alert("Time is up! Your mock test will be evaluated automatically.");
                    this.submitExam();
                }
            }, 1000);
        }

        updateTimerDisplay() {
            if (!this.timerEl) return;
            const minutes = Math.floor(this.timerSeconds / 60);
            const seconds = this.timerSeconds % 60;
            const mStr = String(minutes).padStart(2, "0");
            const sStr = String(seconds).padStart(2, "0");
            this.timerEl.textContent = `${mStr}:${sStr}`;
        }

        renderSectionTabs() {
            if (!this.sectionsNavEl || !this.examData) return;
            this.sectionsNavEl.innerHTML = "";

            this.examData.sections.forEach((sec) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = `cbt-section-tab ${sec === this.currentSection ? "active" : ""}`;
                btn.textContent = sec;
                btn.addEventListener("click", () => {
                    this.currentSection = sec;
                    // Jump to first question of this section
                    const firstIdx = this.examData.questions.findIndex((q) => q.section === sec);
                    if (firstIdx !== -1) {
                        this.goToQuestion(firstIdx);
                    }
                    this.renderSectionTabs();
                });
                this.sectionsNavEl.appendChild(btn);
            });
        }

        renderPalette() {
            if (!this.paletteGridEl || !this.examData) return;
            this.paletteGridEl.innerHTML = "";

            this.examData.questions.forEach((q, idx) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = String(idx + 1);

                let statusClass = "unvisited";
                if (this.reviewFlags[idx]) {
                    statusClass = "review";
                } else if (this.userResponses[idx] !== undefined) {
                    statusClass = "answered";
                } else if (this.visitedFlags[idx]) {
                    statusClass = "unanswered";
                }

                btn.className = `palette-btn ${statusClass} ${idx === this.currentIndex ? "current" : ""}`;
                btn.title = `Q${idx + 1} (${q.section} - ${q.topic})`;

                btn.addEventListener("click", () => {
                    this.goToQuestion(idx);
                });

                this.paletteGridEl.appendChild(btn);
            });
        }

        goToQuestion(idx) {
            if (this.isSubmitted) return;
            this.currentIndex = idx;
            this.visitedFlags[idx] = true;
            this.currentSection = this.examData.questions[idx].section;

            this.renderSectionTabs();
            this.renderPalette();
            this.renderCurrentQuestion();
        }

        renderCurrentQuestion() {
            if (!this.questionAreaEl || !this.examData) return;
            const q = this.examData.questions[this.currentIndex];
            const currentSelected = this.userResponses[this.currentIndex];

            let optionsHtml = "";
            q.options.forEach((opt, optIdx) => {
                const isChecked = currentSelected === optIdx;
                optionsHtml += `
                    <label class="option-item ${isChecked ? "selected" : ""}" data-opt-idx="${optIdx}">
                        <input type="radio" name="cbt_option" value="${optIdx}" ${isChecked ? "checked" : ""}>
                        <span>${opt}</span>
                    </label>
                `;
            });

            this.questionAreaEl.innerHTML = `
                <div>
                    <div class="question-header">
                        <span class="question-num">Question ${this.currentIndex + 1} of ${this.examData.questions.length}</span>
                        <span class="question-topic-badge">${q.section} · ${q.topic}</span>
                    </div>
                    <div class="question-text">${q.question}</div>
                    <div class="options-list" id="options-group">
                        ${optionsHtml}
                    </div>
                </div>
                <div class="cbt-action-row">
                    <div style="display: flex; gap: 8px;">
                        <button type="button" class="cbt-btn cbt-btn-review" id="btn-review">
                            ${this.reviewFlags[this.currentIndex] ? "Remove Review" : "Mark for Review"}
                        </button>
                        <button type="button" class="cbt-btn cbt-btn-clear" id="btn-clear">Clear Response</button>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" class="cbt-btn cbt-btn-clear" id="btn-prev" ${this.currentIndex === 0 ? "disabled" : ""}>
                            ← Previous
                        </button>
                        <button type="button" class="cbt-btn cbt-btn-save" id="btn-save-next">
                            ${this.currentIndex === this.examData.questions.length - 1 ? "Save Response" : "Save & Next →"}
                        </button>
                    </div>
                </div>
            `;

            // Bind option clicks
            const optionLabels = this.questionAreaEl.querySelectorAll(".option-item");
            optionLabels.forEach((label) => {
                label.addEventListener("click", () => {
                    const optIdx = parseInt(label.dataset.optIdx, 10);
                    this.userResponses[this.currentIndex] = optIdx;
                    this.renderCurrentQuestion();
                    this.renderPalette();
                });
            });

            // Action buttons
            document.getElementById("btn-review").addEventListener("click", () => {
                this.reviewFlags[this.currentIndex] = !this.reviewFlags[this.currentIndex];
                this.renderPalette();
                this.renderCurrentQuestion();
            });

            document.getElementById("btn-clear").addEventListener("click", () => {
                delete this.userResponses[this.currentIndex];
                this.renderPalette();
                this.renderCurrentQuestion();
            });

            document.getElementById("btn-prev").addEventListener("click", () => {
                if (this.currentIndex > 0) {
                    this.goToQuestion(this.currentIndex - 1);
                }
            });

            document.getElementById("btn-save-next").addEventListener("click", () => {
                if (this.currentIndex < this.examData.questions.length - 1) {
                    this.goToQuestion(this.currentIndex + 1);
                } else {
                    this.renderPalette();
                }
            });
        }

        submitExam() {
            this.isSubmitted = true;
            if (this.timerInterval) clearInterval(this.timerInterval);

            // Calculate marks
            let correctCount = 0;
            let incorrectCount = 0;
            let unattemptedCount = 0;
            let totalScore = 0;

            const marking = this.examData.marking_scheme;

            this.examData.questions.forEach((q, idx) => {
                const userChoice = this.userResponses[idx];
                if (userChoice === undefined) {
                    unattemptedCount++;
                    totalScore += marking.unattempted;
                } else if (userChoice === q.correct) {
                    correctCount++;
                    totalScore += marking.correct;
                } else {
                    incorrectCount++;
                    totalScore += marking.incorrect;
                }
            });

            const accuracy = correctCount + incorrectCount > 0
                ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
                : 0;

            if (this.examConsoleEl) this.examConsoleEl.style.display = "none";
            if (this.scorecardContainer) {
                this.scorecardContainer.style.display = "block";
                this.renderScorecard({
                    totalScore,
                    correctCount,
                    incorrectCount,
                    unattemptedCount,
                    accuracy,
                    maxScore: this.examData.max_marks
                });
            }
        }

        renderScorecard(stats) {
            let solutionsHtml = "";
            this.examData.questions.forEach((q, idx) => {
                const userAns = this.userResponses[idx];
                const isCorrect = userAns === q.correct;
                const isUnattempted = userAns === undefined;

                let statusClass = isCorrect ? "is-correct" : isUnattempted ? "is-unattempted" : "is-incorrect";
                let statusLabel = isCorrect
                    ? "<span style='color:#10b981;'>✓ Correct (+4)</span>"
                    : isUnattempted
                    ? "<span style='color:#6b7280;'>○ Unattempted (0)</span>"
                    : "<span style='color:#ef4444;'>✕ Incorrect (-1)</span>";

                solutionsHtml += `
                    <div class="solution-accordion-item">
                        <div class="solution-header ${statusClass}" onclick="this.nextElementSibling.classList.toggle('is-hidden')">
                            <span>Q${idx + 1}: ${q.section} (${q.topic})</span>
                            <div>${statusLabel}</div>
                        </div>
                        <div class="solution-body">
                            <p><strong>Question:</strong> ${q.question}</p>
                            <p><strong>Your Answer:</strong> ${userAns !== undefined ? q.options[userAns] : "<em>None selected</em>"}</p>
                            <p><strong>Correct Answer:</strong> <span style="color:#065f46; font-weight:700;">${q.options[q.correct]}</span></p>
                            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; border-radius:8px; margin-top:8px;">
                                <strong>Explanation:</strong> ${q.explanation}
                            </div>
                        </div>
                    </div>
                `;
            });

            this.scorecardContainer.innerHTML = `
                <div class="cbt-scorecard-view">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--line); padding-bottom:18px;">
                        <div>
                            <span class="badge badge-green">MOCK TEST REPORT</span>
                            <h2 style="margin:8px 0 0;">Exam Performance Summary</h2>
                            <p style="color:var(--muted); margin:4px 0 0;">${this.examData.title}</p>
                        </div>
                        <button class="button-link" onclick="window.location.reload();">Retake Test</button>
                    </div>

                    <div class="scorecard-summary-tiles">
                        <div class="score-tile">
                            <div class="score-tile-val" style="color:var(--green);">${stats.totalScore} / ${stats.maxScore}</div>
                            <div class="score-tile-lbl">Total Score</div>
                        </div>
                        <div class="score-tile">
                            <div class="score-tile-val" style="color:#10b981;">${stats.correctCount}</div>
                            <div class="score-tile-lbl">Correct Answers</div>
                        </div>
                        <div class="score-tile">
                            <div class="score-tile-val" style="color:#ef4444;">${stats.incorrectCount}</div>
                            <div class="score-tile-lbl">Incorrect (Negatives)</div>
                        </div>
                        <div class="score-tile">
                            <div class="score-tile-val" style="color:#f59e0b;">${stats.accuracy}%</div>
                            <div class="score-tile-lbl">Accuracy Rate</div>
                        </div>
                    </div>

                    <div style="background:#fefce8; border:1px solid #fde047; padding:18px; border-radius:10px; margin-bottom:28px;">
                        <strong>Performance Mentorship Note:</strong>
                        ${stats.accuracy >= 80 
                            ? "Splendid accuracy! Focus on time management and multi-concept application." 
                            : "Good effort. Review the negative marks carefully below. Revisit topics where mistakes were made."}
                    </div>

                    <h3 style="margin-bottom:16px;">Question-by-Question Solution Breakdown</h3>
                    <div>${solutionsHtml}</div>

                    <div style="margin-top:30px; text-align:center;">
                        <a class="button-link btn-secondary" href="index.html">← Back to CBT Portal</a>
                        <a class="button-link btn-outline" href="../tools/rank-predictor.html" style="margin-left:12px;">Predict Rank Based on Score →</a>
                    </div>
                </div>
            `;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => new CBTEngine());
    } else {
        new CBTEngine();
    }
})();
