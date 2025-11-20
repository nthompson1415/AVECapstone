# GitHub Pages Site Language Review

This document contains all user-facing text content from the GitHub Pages site, organized by source file and component.

---

## 1. Ethical Decision Analyzer (`ethical-analyzer-complete.jsx`)

### Main Title & Description
- **Title**: Ethical Decision Analyzer
- **Description**: Analyze vehicle accident scenarios through multiple ethical frameworks with calculation transparency and preset scenarios.

### Educational Warning
**Educational Tool:** This is for learning only. Real-world ethics are more complex.

### Preset Scenarios Library

#### Scenario Names & Descriptions
1. **Classic Trolley**
   - Description: 5 people vs 1, all else equal

2. **Young vs Old**
   - Description: 5 elderly vs 1 child

3. **Doctor vs Criminal**
   - Description: Save doctor or violent offender

4. **Legal vs Jaywalker**
   - Description: Legal crosser vs jaywalker

5. **Pregnant Woman**
   - Description: 1 pregnant woman vs 2 people

6. **Pet vs Person**
   - Description: Dog vs human stranger

### Simple Mode
- **Label**: Simple Mode
- **Description**: 1v1, 100% fatal, 100% certainty

### Factor Toggles

#### Standard Controversial Factors
- **Label**: Standard Controversial Factors
- **Description**: Occupation, health, criminal history

#### Extended Factors
- **Label**: Extended Factors
- **Description**: Legal fault, risk, pregnancy, species

#### Network Effects
- **Label**: Network Effects
- **Description**: Dependents and caregiving

### Option Input Fields

#### Common Fields (Option A & Option B)
- **Option Name**: Text input for option name
- **Vehicle Occupants**: Number input
- **Average Age of Occupants**: Number input (when occupants > 0)
- **Pedestrians**: Number input
- **Pedestrian Age**: Number input (when pedestrians > 0)
- **Injury Severity**: Select dropdown
  - Options: None, Minor, Moderate, Serious, Critical, Fatal
- **Certainty**: Range slider (percentage)

#### Occupant Fields (when Standard Controversial Factors enabled)
- **Occupant Occupation**: Select dropdown
  - Options: Unemployed, Average Worker, Skilled Worker, Professional, Lifesaving Role, Caregiver, Primary Researcher, Unique Expert
- **Occupant Health**: Select dropdown
  - Options: Healthy, Chronic Condition, Terminal Illness
- **Occupant Criminal History**: Select dropdown
  - Options: No History, Minor Offenses, Property Crimes, Violent Offenses, Homicide, Active Crime

#### Occupant Fields (when Extended Factors enabled)
- **Occupant Legal Status**: Select dropdown
  - Options: Following Laws, Minor Violation, Jaywalking, Reckless, DUI, Fleeing
- **Occupant Risk Level**: Select dropdown
  - Options: Innocent, Normal, Consented, Risky, Extreme
- **Occupant Pregnancy**: Select dropdown
  - Options: Not Pregnant, Pregnant
- **Occupant Species**: Select dropdown
  - Options: Human, Pet Dog, Pet Cat, Livestock

#### Occupant Fields (when Network Effects enabled)
- **Occupant Network**: Select dropdown
  - Options: None, Partner, Parent, Sole Parent, Caregiver, Sole Provider

#### Pedestrian Fields (same structure as Occupant fields when enabled)
- **Pedestrian Occupation**: Same options as Occupant Occupation
- **Pedestrian Health**: Same options as Occupant Health
- **Pedestrian Criminal History**: Same options as Occupant Criminal History
- **Pedestrian Legal Status**: Same options as Occupant Legal Status
- **Pedestrian Risk**: Same options as Occupant Risk Level
- **Pedestrian Pregnancy**: Same options as Occupant Pregnancy
- **Pedestrian Species**: Same options as Occupant Species
- **Pedestrian Network**: Same options as Occupant Network

### Action Buttons
- **Analyze**: Analyze scenario
- **Reset**: Reset form
- **Resources**: Toggle resources section
- **Export**: Export scenario to JSON
- **Import**: Import scenario from JSON

### Educational Resources Section
- **Title**: Educational Resources
- **Content**:
  - **The Trolley Problem:** Classic thought experiment exploring moral dilemmas.
  - **Evidence-Based Weights:** Uses VSL ($6-14M), QALY frameworks, recidivism data.
  - **Further Reading:** MIT Moral Machine, "Justice" by Sandel, DOT VSL guidelines

### Results Section

#### Framework Tabs
- **Utilitarian**: Utilitarian framework results
- **Deontological**: Deontological framework results
- **Virtue**: Virtue ethics framework results

#### Utilitarian Results
- **Harm Comparison Chart Title**: Harm Comparison
- **Chart Legend**: Lower harm = better. Choose the shorter bar.
- **Metrics Displayed**:
  - People
  - Life Years Lost
  - Certainty
  - Expected Harm
  - Utility Score

#### Calculation Breakdown
- **Toggle Button**: Show Calculation Steps
- **Section Labels**:
  - Occupants: (with count)
  - Pedestrians: (with count)
- **Calculation Steps**: Base Calculation, Species, Pregnancy, Health, Occupation, Criminal, Legal Fault, Voluntary Risk, Network
- **Final Calculation Note**: Multiply by certainty for expected harm.

#### Utilitarian Recommendation
- **Title**: Utilitarian Recommendation
- **Messages**:
  - Both options result in similar expected harm. (neutral)
  - [Option name] minimizes harm. (when option1 or option2 recommended)
- **Confidence**: Displayed as percentage

#### Deontological Analysis
- **Title**: Deontological Analysis
- **Concern Messages**:
  - Involves actively harming pedestrians
  - Fails duty to protect vehicle occupants
- **Reasoning Messages**:
  - Deontological ethics generally prohibits actively harming innocent people.
  - Both options involve similar moral concerns from a deontological perspective.

#### Virtue Ethics
- **Title**: Virtue Ethics
- **Considerations**:
  - Courage: Would a courageous person minimize harm?
  - Justice: Does this treat all with equal dignity?
  - Wisdom: Does this reflect practical wisdom?
  - Compassion: Does this show concern for all?
  - Integrity: Can one live with this choice?
- **Recommendation**: Virtue ethics emphasizes that the right action depends on what a person of good character would do.
- **Reasoning**: A virtuous decision-maker would prioritize human dignity, wisdom, and compassion.

### Error Messages
- **No People Error**: Please add at least one person to one of the options.

### Default Option Names
- **Option A**: Default name for option 1
- **Option B**: Default name for option 2

---

## 2. Personal Ethics Calibrator (`personal-ethics-calibrator.jsx`)

### Main Title & Description
- **Title**: Personal Ethics Calibrator
- **Description**: Define your own moral values by rating how important different factors are to you. Then analyze scenarios using your personalized ethical framework.

### Navigation Tabs
- **Value Survey**: Tab for survey section
- **Analyze Scenarios**: Tab for analysis section

### Survey Section

#### Instructions
- **Text**: Rate each factor from 1-10 based on how important it is in your moral decision-making. 1 = "This should have no influence on the decision" and 10 = "This is critically important to consider."

#### Survey Questions
1. **Age / Remaining Life Years**
   - Description: Should younger people (with more life years ahead) be prioritized?
   - Examples: A 20-year-old has ~58 years left vs. a 70-year-old has ~8 years
   - Scale: Not Important (1) to Very Important (10)

2. **Number of People**
   - Description: Should we always save the greater number, or are there limits to this?
   - Examples: Save 5 people vs. 1 person
   - Scale: Not Important (1) to Very Important (10)

3. **Health Status**
   - Description: Should someone's health condition affect their priority?
   - Examples: Terminal illness vs. chronic condition vs. healthy
   - Scale: Not Important (1) to Very Important (10)

4. **Occupation / Social Contribution**
   - Description: Should someone's job or social role matter?
   - Examples: Doctor, teacher, unemployed, researcher
   - Scale: Not Important (1) to Very Important (10)

5. **Legal Responsibility**
   - Description: Should someone who broke traffic laws have lower priority?
   - Examples: Jaywalking, DUI, fleeing crime scene
   - Scale: Not Important (1) to Very Important (10)

6. **Criminal History**
   - Description: Should past crimes affect someone's value in this scenario?
   - Examples: No history, minor offenses, violent crimes
   - Scale: Not Important (1) to Very Important (10)

7. **Pregnancy**
   - Description: Should pregnancy (representing two lives) be weighted differently?
   - Examples: Pregnant vs. not pregnant
   - Scale: Not Important (1) to Very Important (10)

8. **Dependents / Network Effects**
   - Description: Should we consider who depends on this person?
   - Examples: Sole parent, primary caregiver, sole provider
   - Scale: Not Important (1) to Very Important (10)

9. **Species**
   - Description: Should non-human animals be valued differently?
   - Examples: Human vs. pet dog vs. livestock
   - Scale: Not Important (1) to Very Important (10)

10. **Outcome Certainty**
    - Description: How much should uncertainty reduce the weight of an outcome?
    - Examples: 50% chance of death vs. 100% certain death
    - Scale: Not Important (1) to Very Important (10)

#### Survey Actions
- **Complete Survey & Start Analysis**: Button to complete survey
- **Reset to Defaults**: Button to reset weights
- **Export My Values**: Button to export weights to JSON
- **Import Values**: Button to import weights from JSON

### Analysis Section

#### Instructions
- **Text**: **Your Ethics Profile:** Decisions will be made according to your personal values. You can adjust scenarios below to see what you would choose in different situations.

#### Scenario Input Fields (Option A & Option B)

##### Common Fields
- **Option Name**: Text input
- **Number of People**: Number input
- **Average Age**: Number input (0-100)
- **Severity**: Select dropdown
  - Options: Minor Injury, Serious Injury, Critical Injury, Fatal
- **Certainty**: Range slider (percentage)

##### All Scenarios Include
- **Occupation**: Select dropdown
  - Options: Unemployed, Average Worker, Skilled Worker, Professional, Lifesaving (Doctor, Firefighter), Researcher
- **Health Status**: Select dropdown
  - Options: Healthy, Chronic Condition, Terminal Illness
- **Legal Status**: Select dropdown
  - Options: Following Laws, Minor Violation, Jaywalking, Reckless Behavior, Fleeing Crime
- **Criminal History**: Select dropdown
  - Options: No History, Minor Offenses, Violent Offenses, Currently Committing Crime
- **Pregnancy**: Select dropdown
  - Options: Not Pregnant, Pregnant
- **Dependents**: Select dropdown
  - Options: None, Has Partner, Parent, Sole Parent, Primary Caregiver
- **Species**: Select dropdown
  - Options: Human, Pet, Livestock

#### Analysis Actions
- **Analyze with My Values**: Button to analyze scenario

#### Results Display

##### Results Title
- **Title**: Your Decision

##### Option Results
- **Harm Points Label**: [X] harm points
- **Moral Weight Label**: Moral weight based on your values

##### Recommendation
- **Title**: Your Recommendation
- **Messages**:
  - Both options are roughly equivalent according to your values. This is a true moral dilemma with no clear answer. (neutral)
  - Choose [Option name]. This option causes less harm according to what you value. (when option1 or option2 recommended)

##### Interpretation
- **Text**: **Interpretation:** Lower harm points = better option. The calculation weighs each factor according to the importance ratings you provided in the survey. Different people with different values may reach different conclusions on the same scenario.

### Default Values
- **Default Option Names**: Option A, Option B
- **Default Scenario Values**: 
  - Option A: 1 person, age 35, healthy, average worker, no criminal history, legal, not pregnant, human, no dependents, fatal, 90% certainty
  - Option B: 5 people, age 70, healthy, average worker, no criminal history, legal, not pregnant, human, no dependents, fatal, 90% certainty

### Import/Export Messages
- **Success**: Weights imported successfully!
- **Error**: Error loading weights file.

---

## 3. Capstone Poster (`capstone-poster-corrected.html` / `poster.html`)

### Header Section
- **Title**: Should Autonomous Vehicles Use Context-Sensitive Ethics?
- **Subtitle**: Examining Rigid Rules vs. Adaptive Algorithms Through Utilitarian Analysis
- **Meta Information**: 
  - IST 477 Capstone Project | Fall 2025 | Syracuse University iSchool
  - Innovation, Society & Technology

### Research Questions Section

#### Primary Research Question
- **Label**: 🎯 Primary Research Question
- **Question**: Should autonomous vehicles be programmed with rigid ethical rules that treat all demographics equally (as mandated by the German Ethics Commission), or should they adapt in real-time using context-sensitive factors in unavoidable accident scenarios?

#### Secondary Research Question
- **Label**: 🔍 Secondary Research Question
- **Question**: At what levels of model accuracy and informational connectedness, if any, does context-sensitive AV decision-making become more ethically defensible than rigid demographic-blind foresight rules?

### Methodology Section

#### Research Approach
- **Title**: 📊 Research Approach
- **Items**:
  - Interactive Ethical Decision Analyzer tool
  - Three frameworks: Utilitarian, Deontological, Virtue Ethics
  - Evidence-based weights (VSL, QALY, recidivism data)
  - 6 classic trolley problem scenarios
  - Systematic testing at 5 connectedness levels

#### Connectedness Spectrum
- **Title**: 🔗 Connectedness Spectrum
- **Levels**:
  - **None:** Demographic-blind (age only)
  - **Medium:** + Occupation, health, criminal history
  - **High:** + Legal fault, pregnancy, species
  - **Maximum:** + Network effects (dependents)
- **Definition**: Connectedness = Amount of demographic/contextual information available to the ethical decision model

### Key Findings Section

#### Finding #1: Decision Sensitivity to Connectedness
- **Title**: 📊 Finding #1: Decision Sensitivity to Connectedness
- **Content**: 50% of scenarios (3/6) produced different recommendations at different connectedness levels, **highlighting that informational connectedness is not ethically neutral**—it fundamentally determines which lives AVs prioritize. This underscores the need for explicit societal deliberation about which factors should inform AV decisions.

#### Finding #2: Pregnancy Weighting Trade-offs
- **Title**: ⚖️ Finding #2: Pregnancy Weighting Trade-offs
- **Content**: 
  - **Low connectedness:** Kill pregnant woman, save 2 people (50 vs 76 harm)
  - **High connectedness:** Save pregnant woman, kill 2 people (90 vs 76 harm with 1.8x multiplier)
  
  The pregnancy scenario reveals a fundamental tension in utilitarian logic: granular weighting (pregnancy = 1.8 lives) produces mathematically consistent but socially controversial outcomes. This illustrates the challenge of translating moral intuitions into algorithmic rules.

#### Finding #3: Legal Responsibility vs. Equal Protection
- **Title**: ⚖️ Finding #3: Legal Responsibility vs. Equal Protection
- **Content**: The jaywalker scenario creates tension between **two valid principles:** (1) Equal protection—all lives have equal worth regardless of minor infractions, versus (2) Responsibility—those who follow rules have stronger moral claims. Legal fault weighting reduces a jaywalker's priority by **37%** (0.9 × 0.7 = 0.63x), forcing society to choose which principle dominates.

#### Finding #4: Occupation-Based Value Hierarchies
- **Title**: 💼 Finding #4: Occupation-Based Value Hierarchies
- **Content**: Occupation and criminal history weighting transforms a neutral 1v1 scenario into a decisive recommendation (save doctor: 64.5 vs 40.42 harm), resolving ethical ambiguity through **utilitarian calculus of secondary effects** (doctor's future life-saving work vs. criminal's recidivism risk). This raises the analytical question: **Should AVs consider individuals' social contributions and past actions when determining whom to save?** The answer requires weighing utilitarian logic (maximize total welfare including future effects) against egalitarian principles (all human lives have equal intrinsic worth regardless of occupation or history).

### Decision Stability Analysis Section

#### Table Headers
- Scenario
- None (Demographic-Blind)
- Medium Connectedness
- High Connectedness
- Maximum Connectedness

#### Scenario Names & Results
1. **Classic Trolley** (5 people vs 1 person)
   - All levels: Save 5 people

2. **Young vs Elderly** (5 elderly vs 1 child)
   - All levels: Save 1 child

3. **Doctor vs Criminal** (1 doctor vs 1 criminal)
   - None: Neutral
   - Medium/High/Maximum: Save Doctor

4. **Legal vs Jaywalker** (both 1 person)
   - None/Medium: Neutral
   - High/Maximum: Save Legal Pedestrian

5. **Pregnant Woman** (1 pregnant vs 2 people)
   - None/Medium: Save 2 People
   - High/Maximum: Save Pregnant Woman

6. **Pet vs Person** (1 dog vs 1 human)
   - All levels: Save Person

#### Table Note
- **Text**: Red cells indicate decision changed at this connectedness level

### Example: Pregnancy Weighting Effect Section

#### Low Connectedness Subsection
- **Title**: 📉 Low Connectedness (No Pregnancy Multiplier)
- **Chart Labels**:
  - 2 People (age 40) - 76.0 harm - WORSE (100%)
  - 1 Pregnant Woman (age 28) - 50.0 harm - BETTER (65.8%)
- **Decision Badge**: ✗ Decision: Kill pregnant woman, save 2 people

#### Divider
- **Text**: CONNECTEDNESS INCREASES ↓

#### High Connectedness Subsection
- **Title**: 📈 High Connectedness (Pregnancy Multiplier 1.8x)
- **Chart Labels**:
  - 2 People (age 40) - 76.0 harm - BETTER (84.4%)
  - 1 Pregnant Woman (age 28, weighted 1.8x) - 90.0 harm - WORSE (100%)
- **Decision Badge**: ✓ Decision: Save pregnant woman, kill 2 people

#### Key Insight
- **Text**: **Key Insight:** Pregnancy multiplier (1.8x) reverses the decision—from saving more people to protecting the pregnant individual

### Ethical Framework Analysis Section

#### Utilitarian Framework
- **Icon**: ⚖️
- **Title**: Utilitarian
- **Description**: **Minimize total harm** through life-years calculation. Sensitive to connectedness—different factors produce different hierarchies.

#### Deontological Framework
- **Icon**: 📜
- **Title**: Deontological
- **Description**: **Rights and duties** based. Rejects demographic weighting as violating equal moral worth regardless of connectedness level.

#### Virtue Ethics Framework
- **Icon**: ❤️
- **Title**: Virtue Ethics
- **Description**: **Character and wisdom** focused. Emphasizes human dignity and contextual judgment that cannot be fully programmed.

### Implications & Next Steps Section

#### Analytical Questions Raised
- **Title**: 🔬 Analytical Questions Raised
- **Items**:
  - At what connectedness threshold do benefits outweigh discrimination risks?
  - Should pregnancy, legal fault, or occupation ever inform AV decisions?
  - Can utilitarian precision handle moral edge cases?
  - How does model accuracy affect the ethics of deployment?

#### Remaining Research
- **Title**: 📖 Remaining Research
- **Items**:
  - Compare to MIT Moral Machine public opinion data
  - Expert ethicist validation of controversial scenarios
  - Sensitivity analysis on multiplier values
  - Model accuracy threshold analysis
  - Policy framework recommendations

### Preliminary Insights Section
- **Title**: 📌 Preliminary Insights
- **Content Paragraph 1**: Decision stability analysis reveals that **3 of 6 scenarios** change recommendations based on connectedness level, demonstrating that **the choice of which factors to include is a critical policy decision** with direct consequences for whom AVs prioritize in unavoidable accidents.

- **Content Paragraph 2**: Scenarios involving pregnancy, legal responsibility, and occupation show that increased informational connectedness can both **resolve ethical ambiguity** (doctor vs criminal) and **introduce controversial outcomes** (pregnancy weighting reversal). This dual nature suggests the connectedness question cannot be answered through technical optimization alone—it requires explicit societal value judgments.

- **Content Paragraph 3**: **Central Tension:** Utilitarian frameworks require quantifying factors (occupation = 1.5x, criminal = 0.94x, pregnancy = 1.8x), but quantification itself creates hierarchies that may conflict with principles of equal human dignity. The research will examine whether any level of accuracy and connectedness can ethically justify these trade-offs.

### Footer Section
- **Interactive Tools**: React-based Ethical Decision Analyzer | Evidence-based multipliers from government VSL estimates, QALY medical frameworks, and criminal justice recidivism research
- **Timeline**: Literature Review (Nov) | Final Paper (20-40 pages, Dec 12) | Poster Day (Dec 5)

---

## 4. Presentation Slides (`presentation-3-final.html` / `presentation.html`)

### Slide 1: Title Page
- **Title**: Context-Sensitive Ethics in Autonomous Vehicles
- **Subtitle**: Examining the Trade-offs Between Rigid Demographic-Blind Rules and Adaptive Utilitarian Algorithms
- **Course**: IST 477: Capstone in Innovation, Society & Technology
- **Presentation**: Presentation 3: Preliminary Data Analysis
- **Student**: [Your Name]
- **Instructor**: Lee W. McKnight
- **Date**: October 29, 2025

### Slide 2: The Problem: Programming Morality
- **Title**: The Problem: Programming Morality
- **Main Text**: As autonomous vehicles advance, they must be programmed to handle unavoidable accident scenarios. Should these decisions be governed by simple rules or context-sensitive algorithms?

#### Innovation Card
- **Title**: 🔬 Innovation
- **Main Point**: AI/ML systems making life-or-death decisions in real-time
- **Details**: Algorithmic ethics, utilitarian calculus, decision frameworks

#### Society Card
- **Title**: 👥 Society
- **Main Point**: Public trust, moral frameworks, discrimination concerns
- **Details**: Equal protection, human dignity, policy implications

#### Technology Card
- **Title**: ⚙️ Technology
- **Main Point**: Sensor data, contextual information, model accuracy
- **Details**: Informational connectedness, implementation challenges

#### German Ethics Commission Quote
- **Quote**: "Genuine dilemmatic decisions cannot be clearly standardized, nor programmed such that they are ethically unquestionable."
- **Source**: German Ethics Commission (2017)

### Slide 3: Research Questions & Variables

#### Primary RQ
- **Label**: 🎯 Primary RQ
- **Question**: Should autonomous vehicles be programmed with rigid ethical rules that treat all demographics equally (as mandated by the German Ethics Commission), or should they adapt in real-time using context-sensitive factors in unavoidable accident scenarios?

#### Secondary RQ
- **Label**: 🔍 Secondary RQ
- **Question**: At what levels of model accuracy and informational connectedness, if any, does context-sensitive AV decision-making become more ethically defensible than rigid demographic-blind foresight rules?

#### Variables Box

##### Independent Variables
- Informational connectedness level
- Ethical framework applied
- Demographic factors included

##### Dependent Variables
- Ethical recommendation
- Decision stability
- Harm calculation output

### Slide 4: Research Methods & Approach

#### Methodology
- **Tool Development:** Interactive Ethical Decision Analyzer with utilitarian, deontological, and virtue ethics frameworks
- **Evidence-Based Weights:** Multipliers derived from:
  - Government VSL estimates ($6-14M per statistical life)
  - QALY medical ethics frameworks (quality-adjusted life years)
  - Criminal justice recidivism data (federal statistics)
- **Systematic Testing:** 6 classic trolley problem scenarios across 5 connectedness levels
- **Comparative Analysis:** Framework agreement/disagreement patterns

#### Connectedness Levels Tested
- **None:** Demographic-blind (age/numbers only)
- **Medium:** + Occupation (1.5x doctors), Health (0.3x terminal), Criminal (0.94x violent)
- **High:** + Legal fault (0.9x jaywalking), Pregnancy (1.8x), Species (0.05x pets)
- **Maximum:** + Network effects (1.6x sole parent, 1.5x primary caregiver)

### Slide 5: Preliminary Findings I: Decision Stability

#### Table Headers
- Scenario
- None
- Medium
- High
- Maximum

#### Table Data
1. **Classic Trolley** (5 people vs 1)
   - All levels: Save 5

2. **Young vs Elderly** (5 elderly vs 1 child)
   - All levels: Save Child

3. **Doctor vs Criminal** (1 vs 1, age 35)
   - None: Neutral
   - Medium/High/Maximum: Save Doctor

4. **Legal vs Jaywalker** (1 vs 1, age 40)
   - None/Medium: Neutral
   - High/Maximum: Save Legal

5. **Pregnant Woman** (1 pregnant vs 2 people)
   - None/Medium: Save 2
   - High/Maximum: Save Pregnant

6. **Pet vs Person** (1 dog vs 1 human)
   - All levels: Save Person

#### Summary Statistic
- **Text**: 3 of 6 scenarios (50%) changed recommendations based on connectedness level

### Slide 6: Preliminary Findings II: Harm Calculations

#### Table: Pregnancy Weighting Effect
- **Headers**: Connectedness, Option 1: Hit 2 People, Option 2: Hit Pregnant Woman, Recommendation
- **Low Connectedness**: 76.0 harm, 50.0 harm, Save 2 People (kill pregnant)
- **High Connectedness**: 76.0 harm, 90.0 harm (50 × 1.8), Save Pregnant Woman (kill 2)

#### Key Insight
- **Title**: Key Insight
- **Text**: Pregnancy multiplier (1.8x) reverses the utilitarian recommendation. At low connectedness, standard "save more people" logic dominates. At high connectedness, pregnancy weighting (treating her as 1.8 lives) makes killing her "more harmful" than killing 2 regular people, flipping the decision.

#### Additional Findings
- **Jaywalker:** 37% reduction in priority (0.9 × 0.7 = 0.63x total)
- **Doctor vs Criminal:** Doctor valued 1.6x higher (64.5 vs 40.42 harm)
- **Numbers dominate** in large disparities (5 vs 1 stable across all levels)

### Slide 7: Four Critical Findings

#### Finding 1: Decision Sensitivity to Connectedness
- **Text**: 50% of scenarios produced different recommendations at different connectedness levels, **highlighting that informational connectedness is not ethically neutral**—it fundamentally determines which lives AVs prioritize.

#### Finding 2: Pregnancy Weighting Tension
- **Text**: Pregnancy weighting reveals a fundamental tension in utilitarian logic: granular weighting produces mathematically consistent but socially controversial outcomes, illustrating the challenge of translating moral intuitions into algorithmic rules.

#### Finding 3: Legal Responsibility vs Equal Protection
- **Text**: Creates tension between **two valid principles**: equal protection (all lives equal worth) versus responsibility (rule-followers have stronger claims). 37% jaywalker reduction forces choice of which principle dominates.

#### Finding 4: Occupation-Based Hierarchies
- **Text**: Should AVs consider individuals' social contributions and past actions? Utilitarian logic says yes (maximize total welfare), but egalitarian principles say no (equal intrinsic worth).

### Slide 8: Implications for AV Policy

#### Central Research Tension
- **Text**: Utilitarian frameworks require **quantifying factors** (occupation = 1.5x, criminal = 0.94x, pregnancy = 1.8x), but quantification creates hierarchies that may conflict with principles of equal human dignity.

#### Key Questions Raised
- At what connectedness threshold do benefits outweigh discrimination risks?
- Can model accuracy ever be high enough to justify demographic-sensitive decisions?
- Should pregnancy, legal fault, or occupation inform AV algorithms?
- Is decision instability (50% flip rate) acceptable in life-or-death systems?

#### Preliminary Direction
- **Text**: **Preliminary Direction:** Research will examine whether *any* level of accuracy and connectedness can ethically justify these trade-offs, or whether the German Ethics Commission's demographic-blind approach is inherently more defensible.

### Slide 9: Appendix I: Capstone Paper Outline

#### Chapter 1: Introduction
- Background: AV ethics and the trolley problem
- German Ethics Commission guidelines (2017)
- Research questions and significance
- Paper structure overview

#### Chapter 2: Literature Review
- Ethical frameworks: Utilitarian, deontological, virtue ethics
- AV ethics research (MIT Moral Machine, industry guidelines)
- Value of Statistical Life (VSL) and QALY frameworks
- Algorithmic fairness and discrimination literature
- Legal and policy frameworks for AV decision-making

#### Chapter 3: Methodology
- Tool design: Ethical Decision Analyzer architecture
- Evidence-based weight selection process
- Connectedness spectrum operationalization
- Scenario selection and testing protocol

### Slide 10: Appendix I: Table of Contents (cont.)

#### Chapter 4: Data Analysis
- Systematic scenario testing results
- Decision stability analysis across connectedness levels
- Framework comparison (utilitarian vs deontological vs virtue)
- Sensitivity analysis on multiplier values
- Identification of decision flip patterns

#### Chapter 5: Discussion
- Interpretation of pregnancy paradox findings
- Legal responsibility and algorithmic accountability
- Occupation-based hierarchies: justifiable or discriminatory?
- Model accuracy requirements and practical limitations
- Comparison to public moral intuitions (MIT Moral Machine)

#### Chapter 6: Conclusions & Policy Recommendations
- Answering the primary and secondary research questions
- Policy framework for AV ethical decision-making
- Recommendations for regulators and manufacturers
- Limitations of this research
- Future research directions

### Slide 11: Appendix II: References (Page 1 of 3)
- Awad, E., Dsouza, S., Kim, R., Schulz, J., Henrich, J., Shariff, A., Bonnefon, J. F., & Rahwan, I. (2018). The Moral Machine experiment. *Nature, 563*(7729), 59-64. https://doi.org/10.1038/s41586-018-0637-6
- Bonnefon, J. F., Shariff, A., & Rahwan, I. (2016). The social dilemma of autonomous vehicles. *Science, 352*(6293), 1573-1576. https://doi.org/10.1126/science.aaf2654
- Ethics Commission Automated and Connected Driving. (2017). *Report*. Federal Ministry of Transport and Digital Infrastructure, Germany. https://www.bmvi.de/SharedDocs/EN/publications/report-ethics-commission.pdf
- Foot, P. (1967). The problem of abortion and the doctrine of double effect. *Oxford Review, 5*, 5-15.
- Goodall, N. J. (2016). Away from trolley problems and toward risk management. *Applied Artificial Intelligence, 30*(8), 810-821. https://doi.org/10.1080/08839514.2016.1229922
- Lin, P. (2016). Why ethics matters for autonomous cars. In M. Maurer et al. (Eds.), *Autonomous Driving* (pp. 69-85). Springer. https://doi.org/10.1007/978-3-662-48847-8_4
- Millar, J. (2016). An ethics evaluation tool for automating ethical decision-making in robots and self-driving cars. *Applied Artificial Intelligence, 30*(8), 787-809.
- Nyholm, S., & Smids, J. (2016). The ethics of accident-algorithms for self-driving cars: an applied trolley problem? *Ethical Theory and Moral Practice, 19*(5), 1275-1289.

### Slide 12: Appendix II: References (Page 2 of 3)
- Rawls, J. (1971). *A Theory of Justice*. Harvard University Press.
- Thomson, J. J. (1985). The trolley problem. *Yale Law Journal, 94*(6), 1395-1415.
- U.S. Department of Health and Human Services. (2025). *HHS Standard Values for Regulatory Analysis, 2025*. Office of the Assistant Secretary for Planning and Evaluation. https://aspe.hhs.gov/reports/standard-ria-values-2025
- U.S. Department of Transportation. (2024). *Departmental Guidance on Valuation of a Statistical Life in Economic Analysis*. https://www.transportation.gov/office-policy/transportation-policy/revised-departmental-guidance-on-valuation-of-a-statistical-life
- U.S. Sentencing Commission. (2022). *Recidivism of Federal Violent Offenders Released in 2010*. https://www.ussc.gov/research/research-reports/recidivism-federal-violent-offenders-released-2010
- Viscusi, W. K. (2018). Best estimate selection bias in the value of a statistical life. *Journal of Benefit-Cost Analysis, 9*(2), 205-246.
- Weinstein, M. C., Torrance, G., & McGuire, A. (2009). QALYs: The basics. *Value in Health, 12*(Suppl 1), S5-S9.

### Slide 13: Appendix II: References (Page 3 of 3)
- Wolkenstein, A. (2018). What has the trolley dilemma ever done for us (and what will it do in the future)? On some recent debates about the ethics of self-driving cars. *Ethics and Information Technology, 20*(3), 163-173.
- Social Security Administration. (2025). *Actuarial Life Table: Period Life Table, 2022*. Office of the Chief Actuary. https://www.ssa.gov/oact/STATS/table4c6.html
- Himmelreich, J. (2018). Never mind the trolley: The ethics of autonomous vehicles in mundane situations. *Ethical Theory and Moral Practice, 21*(3), 669-684.
- Santoni de Sio, F. (2017). Killing by autonomous vehicles and the legal doctrine of necessity. *Ethical Theory and Moral Practice, 20*(2), 411-429.
- Keeling, G. (2020). Why trolley problems matter for the ethics of automated vehicles. *Science and Engineering Ethics, 26*(1), 293-307.
- Leben, D. (2017). A Rawlsian algorithm for autonomous vehicles. *Ethics and Information Technology, 19*(2), 107-115.
- Gogoll, J., & Müller, J. F. (2017). Autonomous cars: In favor of a mandatory ethics setting. *Science and Engineering Ethics, 23*(3), 681-700.
- Holstein, T., Dodig-Crnkovic, G., & Pelliccione, P. (2018). Ethical and social aspects of self-driving cars. *arXiv preprint* arXiv:1802.04103.
- **Note**: Additional sources on algorithmic fairness, machine ethics, and utilitarian philosophy to be added in final paper.

### Slide 14: Timeline & Next Steps

#### Remaining Work (Nov-Dec)
- **Literature Review Completion:** Expand to 20-25 academic sources
- **Additional Data Analysis:**
  - Comparison with MIT Moral Machine results
  - Sensitivity analysis on multiplier values
  - Model accuracy threshold testing
- **Framework Comparison:** Detailed deontological and virtue ethics analysis
- **Policy Framework Development:** Recommendations for regulators

#### Key Milestones
- **Nov 17-19:** Share rough draft in class (ungraded feedback)
- **Dec 1-3:** Final capstone paper presentation
- **Dec 5:** iSchool Poster Day (11am-1pm)
- **Dec 12:** Final paper submission (20-40 pages)

#### Research Goal
- **Text**: Research goal: Provide evidence-based guidance on the ethics of context-sensitive AV algorithms

### Navigation Controls
- **Previous Button**: ← Previous
- **Next Button**: Next →
- **Slide Counter**: [Current] / [Total] (e.g., "1 / 9")

---

## 5. Error Pages & Static Files

### 404.html
- **Note**: This file contains only a React shell with no custom text content. It redirects to the main React application.

### index.html
- **Title**: av-ethics-site
- **Note**: This file contains only a React shell with no additional user-facing text content. All content is rendered by the React application.

---

## Summary Statistics

- **Total Components**: 2 major React applications (Ethical Decision Analyzer, Personal Ethics Calibrator)
- **Static Pages**: 2 (Poster, Presentation)
- **Total Preset Scenarios**: 6
- **Total Survey Questions**: 10
- **Total Form Fields**: ~40+ (across both applications)
- **Total Presentation Slides**: 14
- **Total References**: 18+ academic sources

---

*Document compiled: All user-facing text from GitHub Pages site*
*Last updated: Review document created for comprehensive language review*

