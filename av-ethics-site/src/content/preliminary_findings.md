# PRELIMINARY RESEARCH FINDINGS
## IST 477 Capstone: Autonomous Vehicle Ethics

### Research Questions
**Primary RQ:** Should autonomous vehicles be programmed with rigid ethical rules that treat all demographics equally (as mandated by the German Ethics Commission), or should they adapt in real-time using context-sensitive factors in unavoidable accident scenarios?

**Secondary RQ:** At what levels of model accuracy and informational connectedness, if any, does context-sensitive AV decision-making become more ethically defensible than rigid demographic-blind foresight rules?

---

## SYSTEMATIC SCENARIO ANALYSIS

### Connectedness Levels Tested:
1. **None (Demographic-Blind)** - Age and severity only, no demographic weighting
2. **Low (Age Only)** - Same as None for these scenarios (age already factored in base calculation)
3. **Medium** - Adds occupation, health status, criminal history
4. **High** - Adds legal responsibility, voluntary risk, pregnancy, species
5. **Maximum** - Adds network effects (dependents, caregivers)

---

## KEY FINDING #1: Decision Instability

**50% of scenarios (3/6) changed recommendations based on connectedness level**

| Scenario | None | Low | Medium | High | Maximum |
|----------|------|-----|--------|------|---------|
| Classic Trolley (5 vs 1) | Save 1 | Save 1 | Save 1 | Save 1 | Save 1 |
| Young vs Elderly (5 old vs 1 child) | Save 5 elderly | Save 5 | Save 5 | Save 5 | Save 5 |
| **Doctor vs Criminal** | **NEUTRAL** | **NEUTRAL** | **Save Doctor** | **Save Doctor** | **Save Doctor** |
| **Legal vs Jaywalker** | **NEUTRAL** | **NEUTRAL** | **NEUTRAL** | **Hit Jaywalker** | **Hit Jaywalker** |
| **Pregnant Woman (1 pregnant vs 2 people)** | **Save Pregnant** | **Save Pregnant** | **Save Pregnant** | **Hit Pregnant** | **Hit Pregnant** |
| Pet vs Person | Save Pet | Save Pet | Save Pet | Save Pet | Save Pet |

**Analysis:** Increased connectedness resolved some neutral cases but created NEW ethical problems (pregnant woman flip).

---

## KEY FINDING #2: The Pregnant Woman Paradox

**MOST SIGNIFICANT FINDING**

- **Low Connectedness:** Save the pregnant woman (1 person vs 2 people) ✓ Expected
- **High Connectedness:** Kill the pregnant woman, save the 2 people ✗ Controversial!

**Calculation:**
- 2 people, age 40: 2 × 38 years = 76 harm
- 1 pregnant woman, age 28: 1 × 50 years × 1.8 (pregnancy) = 90 harm
- 90 > 76, so hitting pregnant woman causes MORE harm
- Therefore: Hit the 2 people instead

**Ethical Problem:** 
The model values the pregnant woman as 1.8 people, which makes her "worth more" than either individual, but LESS than two people combined. This creates the perverse outcome where adding pregnancy information causes the system to KILL her.

**Implication for RQ:** More connectedness led to a MORE ethically problematic decision. This suggests there may be NO threshold where high connectedness is superior to demographic-blind rules.

---

## KEY FINDING #3: Legal Responsibility Creates "Death Sentences"

**Legal vs Jaywalker scenario:**
- Both are 40 years old, single person, all else equal
- **Without extended factors:** Neutral (can't decide)
- **With extended factors:** Hit the jaywalker

**Calculation:**
- Legal pedestrian: 38 years × 1.0 (legal) × 1.0 (innocent) = 38 harm
- Jaywalker: 38 years × 0.9 (jaywalking) × 0.7 (risky behavior) = 23.94 harm

**Ethical Problem:**
The system effectively "punishes" the jaywalker with death for a minor traffic violation. The 37% reduction in their life's value (23.94 vs 38) means jaywalking makes you expendable.

**Implication:** Legal fault factors create algorithmic capital punishment for minor infractions.

---

## KEY FINDING #4: Doctor vs Criminal - Occupation Dominates

**Scenario:** One violent criminal vs one doctor, both age 35
- **Low connectedness:** Neutral (can't decide)
- **Medium+ connectedness:** Save the doctor

**Calculation:**
- Criminal: 43 × 0.94 (violent) = 40.42 harm  
- Doctor: 43 × 1.5 (lifesaving) = 64.50 harm
- Choose option with less harm → Hit criminal, save doctor

**Ethical Problem:**
Creates a social hierarchy where doctors are worth 1.6x more than criminals. While many might intuitively agree with saving the doctor, this codifies that violent offenders' lives are worth 6% less.

**Implication:** Occupation-based weighting creates class-based discrimination in life-or-death decisions.

---

## KEY FINDING #5: Number of People Usually Dominates

**Classic Trolley and Young vs Elderly remained stable across ALL connectedness levels**

- Classic: 5 people (190 harm) vs 1 person (38 harm) = Always save 5
- Young vs Elderly: 5 elderly (15 harm total) vs 1 child (70 harm) = Always save 5

**Even though:**
- Child has 70 years remaining vs elderly with 3 years
- Individual child is "worth more" (70 > 3)
- Quantity still dominates: 5 × 3 = 15 < 70

**Implication:** In scenarios with large numerical differences, connectedness has minimal impact. Suggests demographic factors only matter in "close calls."

---

## IMPLICATIONS FOR RESEARCH QUESTIONS

### Primary RQ Answer (Preliminary):
**Evidence suggests rigid demographic-blind rules are MORE ethically defensible than context-sensitive adaptation**

Reasons:
1. Increased connectedness created new ethical problems (Pregnant Woman Paradox)
2. Extended factors enable algorithmic punishment (jaywalker death sentence)
3. Controversial factors codify discrimination (doctor > criminal hierarchy)
4. Stable scenarios show numbers matter most regardless of connectedness

### Secondary RQ Answer (Preliminary):
**No clear threshold exists where connectedness becomes ethically superior**

Evidence:
- 50% of scenarios flipped with increased connectedness
- Flips introduced NEW controversial outcomes, not clearer ethical answers
- The "accuracy" needed would have to be impossibly high to justify discrimination risks

**Tentative Conclusion:** The German Ethics Commission's demographic-blind approach appears more ethically defensible than utilitarian context-sensitive algorithms, regardless of accuracy or connectedness levels.

---

## NEXT STEPS FOR DATA COLLECTION

1. **Framework Comparison:** Run same scenarios through deontological and virtue ethics frameworks
2. **Sensitivity Analysis:** Test different multiplier values (what if doctor was 2.0x instead of 1.5x?)
3. **Public Opinion:** Compare to MIT Moral Machine data
4. **Edge Cases:** Test scenarios with high uncertainty (50% certainty vs 100%)
5. **Accuracy Simulation:** Model what happens if the tool is only 80% accurate in its recommendations

---

## DATA FILES GENERATED
- scenario_analysis_data.csv (raw data table)
- research_findings.json (structured findings)
