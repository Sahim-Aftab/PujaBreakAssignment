/**
 * Ajmal Super 40 - Student & Parent ERP / LMS Dashboard Script
 * Renders interactive canvas performance curves, tab navigation,
 * and academic progress monitoring.
 */

(function () {
    "use strict";

    function drawPerformanceChart() {
        const canvas = document.getElementById("performanceChart");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Ensure proper DPI resolution
        const width = canvas.parentElement.clientWidth || 600;
        const height = 260;
        canvas.width = width;
        canvas.height = height;

        // Fictional test scores over 8 weekly assessments (Out of 720)
        const tests = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"];
        const scores = [580, 605, 618, 610, 642, 655, 670, 685];
        const maxScore = 720;
        const minScore = 500;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const padLeft = 55;
        const padRight = 30;
        const padTop = 30;
        const padBottom = 40;
        const chartWidth = width - padLeft - padRight;
        const chartHeight = height - padTop - padBottom;

        // Draw horizontal grid lines
        ctx.strokeStyle = "#e2ece7";
        ctx.lineWidth = 1;
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#6b7280";

        const gridSteps = 4;
        for (let i = 0; i <= gridSteps; i++) {
            const scoreVal = Math.round(minScore + (i / gridSteps) * (maxScore - minScore));
            const y = padTop + chartHeight - (i / gridSteps) * chartHeight;

            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(width - padRight, y);
            ctx.stroke();

            ctx.textAlign = "right";
            ctx.fillText(scoreVal, padLeft - 10, y + 4);
        }

        // Calculate points
        const points = scores.map((score, idx) => {
            const x = padLeft + (idx / (scores.length - 1)) * chartWidth;
            const yRatio = (score - minScore) / (maxScore - minScore);
            const y = padTop + chartHeight - yRatio * chartHeight;
            return { x, y, score, label: tests[idx] };
        });

        // Draw gradient area below curve
        const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartHeight);
        gradient.addColorStop(0, "rgba(20, 83, 76, 0.25)");
        gradient.addColorStop(1, "rgba(20, 83, 76, 0.0)");

        ctx.beginPath();
        ctx.moveTo(points[0].x, padTop + chartHeight);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, padTop + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw main trendline
        ctx.beginPath();
        ctx.strokeStyle = "#14534c";
        ctx.lineWidth = 3;
        points.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Draw dots & labels
        points.forEach((p) => {
            // Circle outer
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#e8b84a";
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Score label
            ctx.fillStyle = "#0c2f2a";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(p.score, p.x, p.y - 12);

            // X-axis label
            ctx.fillStyle = "#4b5563";
            ctx.font = "12px sans-serif";
            ctx.fillText(p.label, p.x, height - 12);
        });
    }

    function initTabs() {
        const tabBtns = document.querySelectorAll(".portal-nav-tab");
        const tabPanes = document.querySelectorAll(".portal-tab-pane");

        tabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.tab;

                tabBtns.forEach((b) => b.classList.remove("active"));
                tabPanes.forEach((p) => (p.style.display = "none"));

                btn.classList.add("active");
                const targetPane = document.getElementById(`tab-${target}`);
                if (targetPane) {
                    targetPane.style.display = "block";
                    if (target === "analytics") {
                        setTimeout(drawPerformanceChart, 50);
                    }
                }
            });
        });

        // Quick profile selector (Student / Parent view)
        const profileSelect = document.getElementById("portal-profile-switch");
        if (profileSelect) {
            profileSelect.addEventListener("change", (e) => {
                const role = e.target.value;
                const roleBadge = document.getElementById("portal-role-badge");
                if (roleBadge) {
                    roleBadge.textContent = role === "parent" ? "Parent View (Mr. Mustafa Ahmed)" : "Student View (Rahul Ahmed)";
                }
            });
        }
    }

    function init() {
        initTabs();
        drawPerformanceChart();
        window.addEventListener("resize", drawPerformanceChart);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
