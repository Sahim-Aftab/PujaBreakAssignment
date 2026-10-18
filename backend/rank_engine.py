"""
Ajmal Super 40 - Rank & College Prediction Engine
==================================================
Python analytical module implementing mathematical percentile modeling,
rank estimation curves, and indicative college allotment brackets
for competitive examinations (NEET-UG and JEE Main/Advanced).

Fictional Demonstration Engine for Educational Platform.
"""

from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional
import math


@dataclass
class NEETPrediction:
    marks: int
    max_marks: int
    category: str
    estimated_air_low: int
    estimated_air_high: int
    estimated_percentile: float
    qualifying_status: str
    probable_colleges: List[Dict[str, str]]
    preparation_feedback: str


@dataclass
class JEEPrediction:
    score: int
    max_score: int
    category: str
    estimated_percentile: float
    estimated_air_main: int
    advanced_eligible: bool
    probable_colleges: List[Dict[str, str]]
    preparation_feedback: str


class RankPredictionEngine:
    """Analytical prediction calculations based on historical score-percentile distributions."""

    # Fictional reference cutoffs for NEET (General category)
    NEET_MAX_MARKS = 720
    JEE_MAX_SCORE = 300

    @classmethod
    def predict_neet(cls, marks: int, category: str = "General", state: str = "Assam") -> NEETPrediction:
        """
        Calculate estimated NEET All India Rank range, percentile, and college tiers.
        """
        clamped_marks = max(0, min(cls.NEET_MAX_MARKS, marks))
        cat = category.strip().title()

        # Sigmoidal percentile curve approximation
        # 720 -> 99.999%, 650 -> 99.3%, 600 -> 97.5%, 500 -> 90%, 300 -> 65%
        if clamped_marks >= 700:
            percentile = 99.90 + (clamped_marks - 700) * 0.005
            air_center = int(max(1, 150 - (clamped_marks - 700) * 7))
        elif clamped_marks >= 650:
            percentile = 99.10 + (clamped_marks - 650) * (0.80 / 50)
            air_center = int(2500 - (clamped_marks - 650) * 45)
        elif clamped_marks >= 600:
            percentile = 96.50 + (clamped_marks - 600) * (2.60 / 50)
            air_center = int(12000 - (clamped_marks - 600) * 190)
        elif clamped_marks >= 500:
            percentile = 88.00 + (clamped_marks - 500) * (8.50 / 100)
            air_center = int(55000 - (clamped_marks - 500) * 430)
        elif clamped_marks >= 400:
            percentile = 74.00 + (clamped_marks - 400) * (14.00 / 100)
            air_center = int(140000 - (clamped_marks - 400) * 850)
        elif clamped_marks >= 200:
            percentile = 45.00 + (clamped_marks - 200) * (29.00 / 200)
            air_center = int(450000 - (clamped_marks - 200) * 1550)
        else:
            percentile = max(5.0, (clamped_marks / 200.0) * 45.0)
            air_center = int(1200000 - clamped_marks * 3500)

        air_center = max(1, air_center)
        variance = max(15, int(air_center * 0.12))
        air_low = max(1, air_center - variance)
        air_high = air_center + variance

        # Determine qualifying status and college allotment indicators
        qualifying_cutoff = 138 if cat in ["General", "Ews"] else 108
        is_qualified = clamped_marks >= qualifying_cutoff

        colleges: List[Dict[str, str]] = []
        if clamped_marks >= 680:
            colleges = [
                {"name": "AIIMS New Delhi", "tier": "Apex National", "chance": "Competitive"},
                {"name": "AIIMS Guwahati", "tier": "Top Central", "chance": "High Chance"},
                {"name": "Maulana Azad Medical College (MAMC), Delhi", "tier": "Top Central", "chance": "High Chance"},
                {"name": "Gauhati Medical College (GMCH), Guwahati", "tier": "Premier State", "chance": "Definite"}
            ]
            feedback = "Exceptional score! You are in contention for premier central medical institutions and state apex colleges."
        elif clamped_marks >= 630:
            colleges = [
                {"name": "AIIMS Guwahati", "tier": "Top Central", "chance": "Moderate"},
                {"name": "Gauhati Medical College (GMCH), Guwahati", "tier": "Premier State", "chance": "Very High Chance"},
                {"name": "Assam Medical College (AMC), Dibrugarh", "tier": "Historic State GMC", "chance": "Definite"},
                {"name": "Silchar Medical College (SMCH), Silchar", "tier": "State GMC", "chance": "Definite"}
            ]
            feedback = "Strong competitive score. High probability of Government Medical College (MBBS) through State and All-India Quotas."
        elif clamped_marks >= 560:
            colleges = [
                {"name": "Silchar Medical College (SMCH), Silchar", "tier": "State GMC", "chance": "Good Chance"},
                {"name": "Jorhat Medical College (JMCH), Jorhat", "tier": "State GMC", "chance": "High Chance"},
                {"name": "Fakhruddin Ali Ahmed Medical College (FAAMC), Barpeta", "tier": "State GMC", "chance": "High Chance"},
                {"name": "BDS / Dental Govt Colleges (Regional Dental College)", "tier": "Dental Apex", "chance": "Definite"}
            ]
            feedback = "Solid performance. Competitive for State Quota GMC MBBS seats and top government dental colleges."
        elif is_qualified:
            colleges = [
                {"name": "Govt Ayurvedic & Homeopathic Colleges", "tier": "AYUSH Govt", "chance": "Good Chance"},
                {"name": "Private Medical Colleges (State Quota / Merit)", "tier": "Private Merit", "chance": "Available"},
                {"name": "Veterinary Science & Animal Husbandry", "tier": "Allied Govt", "chance": "Very High"}
            ]
            feedback = "Qualified candidate. Consider AYUSH/Veterinary government institutions or intensive 1-year Super 40 repeater booster."
        else:
            colleges = []
            feedback = "Currently below the indicative qualifying percentile. We recommend enrolling in foundational revision modules."

        return NEETPrediction(
            marks=clamped_marks,
            max_marks=cls.NEET_MAX_MARKS,
            category=cat,
            estimated_air_low=air_low,
            estimated_air_high=air_high,
            estimated_percentile=round(percentile, 2),
            qualifying_status="Qualified for NEET Counseling" if is_qualified else "Did Not Meet Cut-off",
            probable_colleges=colleges,
            preparation_feedback=feedback
        )

    @classmethod
    def predict_jee(cls, score: int, category: str = "General", state: str = "Assam") -> JEEPrediction:
        """
        Calculate estimated JEE Main percentile, rank, and NIT/IIT qualification status.
        """
        clamped_score = max(0, min(cls.JEE_MAX_SCORE, score))
        cat = category.strip().title()

        # Score to percentile curve
        # 280+ -> 99.9%, 240+ -> 99.5%, 200+ -> 99.0%, 160+ -> 98.0%, 120+ -> 95.0%, 80+ -> 88.0%
        if clamped_score >= 260:
            percentile = 99.70 + (clamped_score - 260) * (0.29 / 40)
        elif clamped_score >= 210:
            percentile = 99.00 + (clamped_score - 210) * (0.70 / 50)
        elif clamped_score >= 170:
            percentile = 98.00 + (clamped_score - 170) * (1.00 / 40)
        elif clamped_score >= 130:
            percentile = 95.50 + (clamped_score - 130) * (2.50 / 40)
        elif clamped_score >= 90:
            percentile = 89.00 + (clamped_score - 90) * (6.50 / 40)
        elif clamped_score >= 50:
            percentile = 72.00 + (clamped_score - 50) * (17.00 / 40)
        else:
            percentile = max(5.0, (clamped_score / 50.0) * 70.0)

        percentile = round(min(99.99, max(1.0, percentile)), 2)

        # Formula: Estimated AIR = (100 - Percentile) * (Total_Candidates / 100)
        # Assuming ~1,200,000 unique candidates
        total_candidates = 1250000
        air = int(max(1, ((100.0 - percentile) / 100.0) * total_candidates))

        advanced_eligible = percentile >= (90.0 if cat in ["General", "Ews"] else 75.0)

        colleges: List[Dict[str, str]] = []
        if percentile >= 99.3:
            colleges = [
                {"name": "NIT Trichy / Surathkal / Warangal (CSE/ECE)", "tier": "Top Tier NIT", "chance": "High Chance"},
                {"name": "NIT Silchar (Computer Science & Engineering)", "tier": "Premier NIT", "chance": "Definite"},
                {"name": "IIIT Hyderabad / IIIT Allahabad (IT/CS)", "tier": "Apex IIIT", "chance": "Competitive"},
                {"name": "Eligible for JEE Advanced (IIT Seat Aspirant)", "tier": "IIT Pipeline", "chance": "Target AIR < 2000"}
            ]
            feedback = "Elite percentile! Direct eligibility for Top 5 NITs in flagship computer science/electronics disciplines and JEE Advanced."
        elif percentile >= 97.5:
            colleges = [
                {"name": "NIT Silchar (ECE / Electrical / Mechanical)", "tier": "Premier NIT", "chance": "High Chance"},
                {"name": "IIIT Guwahati (Computer Science & Engineering)", "tier": "Central IIIT", "chance": "High Chance"},
                {"name": "NIT Calicut / Rourkela (Core Engineering)", "tier": "Top Tier NIT", "chance": "Good Chance"},
                {"name": "Assam Engineering College (AEC), Guwahati", "tier": "Premier State", "chance": "Definite"}
            ]
            feedback = "Outstanding score! High assurance of prime engineering branches in top NITs and IIITs with JEE Advanced qualification."
        elif percentile >= 93.0:
            colleges = [
                {"name": "NIT Silchar (Civil / Mechanical / Chemical)", "tier": "Premier NIT", "chance": "Moderate Chance"},
                {"name": "Assam Engineering College (AEC), Guwahati (CSE)", "tier": "Premier State", "chance": "High Chance"},
                {"name": "Jorhat Engineering College (JEC), Jorhat", "tier": "State Engineering", "chance": "Definite"},
                {"name": "Tezpur University (School of Engineering)", "tier": "Central University", "chance": "High Chance"}
            ]
            feedback = "Solid candidate! Eligible for State Quota NIT seats and top state government engineering colleges."
        elif advanced_eligible:
            colleges = [
                {"name": "State Government Engineering Colleges (AEC, JEC)", "tier": "State Govt", "chance": "Good Chance"},
                {"name": "Central University Tech Institutes (Tezpur, Assam Univ)", "tier": "Central Univ", "chance": "High Chance"}
            ]
            feedback = "Qualified for JEE Advanced examination. Focus your preparation on advanced conceptual problem sets."
        else:
            colleges = []
            feedback = "Below JEE Advanced cutoff threshold. We suggest focusing on State CEE exams or joining our specialized Dropper Batch."

        return JEEPrediction(
            score=clamped_score,
            max_score=cls.JEE_MAX_SCORE,
            category=cat,
            estimated_percentile=percentile,
            estimated_air_main=air,
            advanced_eligible=advanced_eligible,
            probable_colleges=colleges,
            preparation_feedback=feedback
        )


if __name__ == "__main__":
    # Self-test verification
    neet_res = RankPredictionEngine.predict_neet(660, "General")
    print(f"[TEST NEET 660] Percentile: {neet_res.estimated_percentile}%, AIR Range: {neet_res.estimated_air_low} - {neet_res.estimated_air_high}")
    assert neet_res.estimated_percentile >= 99.0

    jee_res = RankPredictionEngine.predict_jee(240, "General")
    print(f"[TEST JEE 240] Percentile: {jee_res.estimated_percentile}%, Est AIR: {jee_res.estimated_air_main}")
    assert jee_res.advanced_eligible is True
    print("All engine self-tests passed successfully.")
