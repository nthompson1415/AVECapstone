import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, TrendingUp, Users, Brain, ChevronRight, RotateCcw, BookOpen, Download, Upload, Scale, Heart, Shield, Zap, BarChart3, Library, Plus, Minus } from 'lucide-react';

const EthicalChoiceAnalyzer = () => {
  const [includeControversial, setIncludeControversial] = useState(false);
  const [includeExtendedFactors, setIncludeExtendedFactors] = useState(false);
  const [includeNetworkEffects, setIncludeNetworkEffects] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [result, setResult] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [showResearchFindings, setShowResearchFindings] = useState(false);
  const [activeFramework, setActiveFramework] = useState('utilitarian');
  const [contentData, setContentData] = useState(null);

  const [scenario, setScenario] = useState({
    option1: {
      name: 'Option A',
      occupants: 1,
      occupantAge: 35,
      occupantJob: 'average',
      occupantHealth: 'healthy',
      occupantCriminal: 'none',
      occupantLegalFault: 'legal',
      occupantRisk: 'normal',
      occupantPregnant: false,
      occupantSpecies: 'human',
      occupantNetwork: 'none',
      pedestrians: 0,
      pedestrianAge: 0,
      pedestrianJob: 'average',
      pedestrianHealth: 'healthy',
      pedestrianCriminal: 'none',
      pedestrianLegalFault: 'legal',
      pedestrianRisk: 'normal',
      pedestrianPregnant: false,
      pedestrianSpecies: 'human',
      pedestrianNetwork: 'none',
      certainty: 90,
      severity: 'minor'
    },
    option2: {
      name: 'Option B',
      occupants: 0,
      occupantAge: 0,
      occupantJob: 'average',
      occupantHealth: 'healthy',
      occupantCriminal: 'none',
      occupantLegalFault: 'legal',
      occupantRisk: 'normal',
      occupantPregnant: false,
      occupantSpecies: 'human',
      occupantNetwork: 'none',
      pedestrians: 2,
      pedestrianAge: 45,
      pedestrianJob: 'average',
      pedestrianHealth: 'healthy',
      pedestrianCriminal: 'none',
      pedestrianLegalFault: 'legal',
      pedestrianRisk: 'normal',
      pedestrianPregnant: false,
      pedestrianSpecies: 'human',
      pedestrianNetwork: 'none',
      certainty: 95,
      severity: 'serious'
    }
  });

  // Preset scenarios library
  const presetScenarios = {
    classicTrolley: {
      name: "Classic Trolley",
      description: "5 people vs 1, all else equal",
      scenario: {
        option1: {
          name: 'Stay on Track', occupants: 0, pedestrians: 5, pedestrianAge: 40, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        },
        option2: {
          name: 'Switch Track', occupants: 0, pedestrians: 1, pedestrianAge: 40, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        }
      }
    },
    youngVsOld: {
      name: "Young vs Old",
      description: "3 elderly vs 1 child",
      scenario: {
        option1: {
          name: 'Hit Elderly', occupants: 0, pedestrians: 3, pedestrianAge: 75, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        },
        option2: {
          name: 'Hit Child', occupants: 0, pedestrians: 1, pedestrianAge: 8, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        }
      }
    },
    doctorVsCriminal: {
      name: "Doctor vs Criminal",
      description: "Hit doctor or violent offender",
      scenario: {
        option1: {
          name: 'Hit Criminal', occupants: 0, pedestrians: 1, pedestrianAge: 35, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'violent',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        },
        option2: {
          name: 'Hit Doctor', occupants: 0, pedestrians: 1, pedestrianAge: 35, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'lifesaving', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        }
      }
    },
    jaywalker: {
      name: "Legal vs Jaywalker",
      description: "Legal crosser vs jaywalker",
      scenario: {
        option1: {
          name: 'Hit Legal Pedestrian', occupants: 0, pedestrians: 1, pedestrianAge: 40, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'innocent', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        },
        option2: {
          name: 'Hit Jaywalker', occupants: 0, pedestrians: 1, pedestrianAge: 40, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'jaywalking', pedestrianRisk: 'risky', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        }
      }
    },
    pregnantWoman: {
      name: "Pregnant Woman",
      description: "1 pregnant woman vs 2 people",
      scenario: {
        option1: {
          name: 'Hit Two People', occupants: 0, pedestrians: 2, pedestrianAge: 40, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        },
        option2: {
          name: 'Hit Pregnant Woman', occupants: 0, pedestrians: 1, pedestrianAge: 28, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: true,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        }
      }
    },
    petVsPerson: {
      name: "Pet vs Person",
      description: "Dog vs human stranger",
      scenario: {
        option1: {
          name: 'Hit Dog', occupants: 0, pedestrians: 1, pedestrianAge: 0, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'petDog', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        },
        option2: {
          name: 'Hit Person', occupants: 0, pedestrians: 1, pedestrianAge: 40, occupantAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        }
      }
    }
  };

  const loadPreset = (presetKey) => {
    const preset = presetScenarios[presetKey];
    setScenario(preset.scenario);
    setResult(null);
    setSimpleMode(false);
  };

  // Load content data on mount
  useEffect(() => {
    const loadContentData = async () => {
      try {
        const response = await fetch('/content-data.json');
        const data = await response.json();
        setContentData(data);
      } catch (error) {
        console.error('Error loading content-data.json:', error);
      }
    };
    loadContentData();
  }, []);

  useEffect(() => {
    if (simpleMode) {
      setScenario({
        option1: {
          name: 'Option A - Continue',
          occupants: 1, occupantAge: 35, pedestrians: 0, pedestrianAge: 0,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        },
        option2: {
          name: 'Option B - Switch',
          occupants: 0, occupantAge: 0, pedestrians: 1, pedestrianAge: 35,
          occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
          occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
          occupantSpecies: 'human', occupantNetwork: 'none',
          pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
          pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
          pedestrianSpecies: 'human', pedestrianNetwork: 'none',
          certainty: 100, severity: 'fatal'
        }
      });
    }
  }, [simpleMode]);

  // Memoized update handler to prevent re-renders and maintain focus
  const handleOptionUpdate = useCallback((optionKey, updatedOption) => {
    setScenario(prevScenario => ({
      ...prevScenario,
      [optionKey]: updatedOption
    }));
  }, []);

  const severityScores = {
    none: 0, minor: 1, moderate: 2, serious: 3, critical: 4, fatal: 5
  };

  const jobMultipliers = {
    unemployed: 0.9, average: 1.0, skilled: 1.1, professional: 1.2,
    lifesaving: 1.5, caregiver: 1.4, primaryResearcher: 1.6, uniqueExpert: 1.8
  };

  const healthMultipliers = {
    terminal: 0.3, chronic: 0.6, healthy: 1.0
  };

  const criminalMultipliers = {
    none: 1.0, minor: 0.98, property: 0.92, violent: 0.94, homicide: 0.98, activeCrime: 0.4
  };

  const legalFaultMultipliers = {
    legal: 1.0, minorViolation: 0.95, jaywalking: 0.9, reckless: 0.7, dui: 0.6, fleeing: 0.5
  };

  const voluntaryRiskMultipliers = {
    innocent: 1.0, normal: 1.0, consented: 0.9, risky: 0.7, extreme: 0.5
  };

  const pregnancyMultipliers = {
    notPregnant: 1.0, pregnant: 1.8
  };

  const speciesMultipliers = {
    human: 1.0, petDog: 0.05, petCat: 0.05, livestock: 0.02
  };

  const networkMultipliers = {
    none: 1.0, partner: 1.1, parent: 1.3, soleParent: 1.6, primaryCaregiver: 1.5, soleProvider: 1.4
  };

  const calculateLifeYears = (age, severity, job, health, criminal, legalFault, risk, pregnant, species, network, trackSteps = false) => {
    const steps = [];
    const averageLifeExpectancy = 78;
    const remainingYears = Math.max(0, averageLifeExpectancy - age);
    
    const severityMultipliers = {
      none: 0, minor: 0.05, moderate: 0.2, serious: 0.5, critical: 0.8, fatal: 1.0
    };
    
    let lifeYearsLost = remainingYears * severityMultipliers[severity];
    
    if (trackSteps) {
      steps.push({
        step: 'Base Calculation',
        formula: `(${averageLifeExpectancy} - ${age}) × ${severityMultipliers[severity]}`,
        calculation: `${remainingYears} years × ${severityMultipliers[severity]} = ${lifeYearsLost.toFixed(2)}`,
        value: lifeYearsLost
      });
    }
    
    const speciesMult = speciesMultipliers[species] || 1.0;
    if (speciesMult !== 1.0 && trackSteps) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= speciesMult;
      steps.push({
        step: 'Species', formula: `${oldValue.toFixed(2)} × ${speciesMult}`,
        calculation: `${species} (${speciesMult}x)`, value: lifeYearsLost
      });
    } else if (speciesMult !== 1.0) {
      lifeYearsLost *= speciesMult;
    }
    
    if (pregnant) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= pregnancyMultipliers.pregnant;
      if (trackSteps) {
        steps.push({
          step: 'Pregnancy', formula: `${oldValue.toFixed(2)} × ${pregnancyMultipliers.pregnant}`,
          calculation: `Two lives (${pregnancyMultipliers.pregnant}x)`, value: lifeYearsLost
        });
      }
    }
    
    if (includeControversial) {
      const healthMult = healthMultipliers[health] || 1.0;
      if (healthMult !== 1.0) {
        const oldValue = lifeYearsLost;
        lifeYearsLost *= healthMult;
        if (trackSteps) {
          steps.push({
            step: 'Health', formula: `${oldValue.toFixed(2)} × ${healthMult}`,
            calculation: `${health} (${healthMult}x)`, value: lifeYearsLost
          });
        }
      }
      
      const jobMult = jobMultipliers[job] || 1.0;
      if (jobMult !== 1.0) {
        const oldValue = lifeYearsLost;
        lifeYearsLost *= jobMult;
        if (trackSteps) {
          steps.push({
            step: 'Occupation', formula: `${oldValue.toFixed(2)} × ${jobMult}`,
            calculation: `${job} (${jobMult}x)`, value: lifeYearsLost
          });
        }
      }
      
      const crimMult = criminalMultipliers[criminal] || 1.0;
      if (crimMult !== 1.0) {
        const oldValue = lifeYearsLost;
        lifeYearsLost *= crimMult;
        if (trackSteps) {
          steps.push({
            step: 'Criminal', formula: `${oldValue.toFixed(2)} × ${crimMult}`,
            calculation: `${criminal} (${crimMult}x)`, value: lifeYearsLost
          });
        }
      }
    }
    
    if (includeExtendedFactors) {
      const legalMult = legalFaultMultipliers[legalFault] || 1.0;
      if (legalMult !== 1.0) {
        const oldValue = lifeYearsLost;
        lifeYearsLost *= legalMult;
        if (trackSteps) {
          steps.push({
            step: 'Legal Fault', formula: `${oldValue.toFixed(2)} × ${legalMult}`,
            calculation: `${legalFault} (${legalMult}x)`, value: lifeYearsLost
          });
        }
      }
      
      const riskMult = voluntaryRiskMultipliers[risk] || 1.0;
      if (riskMult !== 1.0) {
        const oldValue = lifeYearsLost;
        lifeYearsLost *= riskMult;
        if (trackSteps) {
          steps.push({
            step: 'Voluntary Risk', formula: `${oldValue.toFixed(2)} × ${riskMult}`,
            calculation: `${risk} (${riskMult}x)`, value: lifeYearsLost
          });
        }
      }
    }
    
    if (includeNetworkEffects) {
      const netMult = networkMultipliers[network] || 1.0;
      if (netMult !== 1.0) {
        const oldValue = lifeYearsLost;
        lifeYearsLost *= netMult;
        if (trackSteps) {
          steps.push({
            step: 'Network', formula: `${oldValue.toFixed(2)} × ${netMult}`,
            calculation: `${network} (${netMult}x)`, value: lifeYearsLost
          });
        }
      }
    }
    
    return trackSteps ? { value: lifeYearsLost, steps } : lifeYearsLost;
  };

  const analyzeDeontological = (option1Analysis, option2Analysis) => {
    let analysis = { option1Concerns: [], option2Concerns: [], recommendation: '' };
    const option1ActiveHarm = scenario.option1.pedestrians > 0;
    const option2ActiveHarm = scenario.option2.pedestrians > 0;

    if (option1ActiveHarm) analysis.option1Concerns.push("Involves actively harming pedestrians");
    if (option2ActiveHarm) analysis.option2Concerns.push("Involves actively harming pedestrians");
    if (scenario.option1.occupants > 0 && scenario.option1.severity !== 'none') 
      analysis.option1Concerns.push("Fails duty to protect vehicle occupants");
    if (scenario.option2.occupants > 0 && scenario.option2.severity !== 'none') 
      analysis.option2Concerns.push("Fails duty to protect vehicle occupants");

    if (option1ActiveHarm && !option2ActiveHarm) {
      analysis.recommendation = 'option2';
      analysis.reasoning = "Deontological ethics generally prohibits actively harming innocent people.";
    } else if (option2ActiveHarm && !option1ActiveHarm) {
      analysis.recommendation = 'option1';
      analysis.reasoning = "Deontological ethics generally prohibits actively harming innocent people.";
    } else {
      analysis.recommendation = 'neutral';
      analysis.reasoning = "Both options involve similar moral concerns from a deontological perspective.";
    }
    return analysis;
  };

  const analyzeVirtueEthics = () => {
    return {
      considerations: [
        "Courage: Would a courageous person minimize harm?",
        "Justice: Does this treat all with equal dignity?",
        "Wisdom: Does this reflect practical wisdom?",
        "Compassion: Does this show concern for all?",
        "Integrity: Can one live with this choice?"
      ],
      recommendation: "Virtue ethics emphasizes that the right action depends on what a person of good character would do.",
      reasoning: "A virtuous decision-maker would prioritize human dignity, wisdom, and compassion."
    };
  };

  const analyzeScenario = () => {
    const option1TotalPeople = scenario.option1.occupants + scenario.option1.pedestrians;
    const option2TotalPeople = scenario.option2.occupants + scenario.option2.pedestrians;

    if (option1TotalPeople === 0 && option2TotalPeople === 0) {
      alert("Please add at least one person to one of the options.");
      return;
    }

    const option1Analysis = {
      totalPeople: option1TotalPeople, lifeYearsLost: 0,
      certainty: scenario.option1.certainty / 100,
      severityScore: severityScores[scenario.option1.severity],
      uncertaintyRange: { lower: 0, upper: 0 }
    };
    const option2Analysis = {
      totalPeople: option2TotalPeople, lifeYearsLost: 0,
      certainty: scenario.option2.certainty / 100,
      severityScore: severityScores[scenario.option2.severity],
      uncertaintyRange: { lower: 0, upper: 0 }
    };

    if (scenario.option1.occupants > 0) {
      const lifeYears = calculateLifeYears(
        scenario.option1.occupantAge, scenario.option1.severity, scenario.option1.occupantJob,
        scenario.option1.occupantHealth, scenario.option1.occupantCriminal, scenario.option1.occupantLegalFault,
        scenario.option1.occupantRisk, scenario.option1.occupantPregnant, scenario.option1.occupantSpecies,
        scenario.option1.occupantNetwork, false
      );
      option1Analysis.lifeYearsLost += scenario.option1.occupants * lifeYears;
    }
    if (scenario.option1.pedestrians > 0) {
      const lifeYears = calculateLifeYears(
        scenario.option1.pedestrianAge, scenario.option1.severity, scenario.option1.pedestrianJob,
        scenario.option1.pedestrianHealth, scenario.option1.pedestrianCriminal, scenario.option1.pedestrianLegalFault,
        scenario.option1.pedestrianRisk, scenario.option1.pedestrianPregnant, scenario.option1.pedestrianSpecies,
        scenario.option1.pedestrianNetwork, false
      );
      option1Analysis.lifeYearsLost += scenario.option1.pedestrians * lifeYears;
    }

    if (scenario.option2.occupants > 0) {
      const lifeYears = calculateLifeYears(
        scenario.option2.occupantAge, scenario.option2.severity, scenario.option2.occupantJob,
        scenario.option2.occupantHealth, scenario.option2.occupantCriminal, scenario.option2.occupantLegalFault,
        scenario.option2.occupantRisk, scenario.option2.occupantPregnant, scenario.option2.occupantSpecies,
        scenario.option2.occupantNetwork, false
      );
      option2Analysis.lifeYearsLost += scenario.option2.occupants * lifeYears;
    }
    if (scenario.option2.pedestrians > 0) {
      const lifeYears = calculateLifeYears(
        scenario.option2.pedestrianAge, scenario.option2.severity, scenario.option2.pedestrianJob,
        scenario.option2.pedestrianHealth, scenario.option2.pedestrianCriminal, scenario.option2.pedestrianLegalFault,
        scenario.option2.pedestrianRisk, scenario.option2.pedestrianPregnant, scenario.option2.pedestrianSpecies,
        scenario.option2.pedestrianNetwork, false
      );
      option2Analysis.lifeYearsLost += scenario.option2.pedestrians * lifeYears;
    }

    const uncertainty1 = option1Analysis.lifeYearsLost * (1 - option1Analysis.certainty) * 0.5;
    option1Analysis.uncertaintyRange = {
      lower: Math.max(0, option1Analysis.lifeYearsLost - uncertainty1),
      upper: option1Analysis.lifeYearsLost + uncertainty1
    };

    const uncertainty2 = option2Analysis.lifeYearsLost * (1 - option2Analysis.certainty) * 0.5;
    option2Analysis.uncertaintyRange = {
      lower: Math.max(0, option2Analysis.lifeYearsLost - uncertainty2),
      upper: option2Analysis.lifeYearsLost + uncertainty2
    };

    option1Analysis.expectedHarm = option1Analysis.lifeYearsLost * option1Analysis.certainty;
    option2Analysis.expectedHarm = option2Analysis.lifeYearsLost * option2Analysis.certainty;

    const maxHarm = Math.max(option1Analysis.expectedHarm, option2Analysis.expectedHarm);
    option1Analysis.utilityScore = maxHarm > 0 ? 100 - (option1Analysis.expectedHarm / maxHarm * 100) : 50;
    option2Analysis.utilityScore = maxHarm > 0 ? 100 - (option2Analysis.expectedHarm / maxHarm * 100) : 50;

    let recommendation = '', confidence = 0;
    if (Math.abs(option1Analysis.utilityScore - option2Analysis.utilityScore) < 5) {
      recommendation = 'neutral'; confidence = 50;
    } else if (option1Analysis.utilityScore > option2Analysis.utilityScore) {
      recommendation = 'option1'; confidence = option1Analysis.utilityScore;
    } else {
      recommendation = 'option2'; confidence = option2Analysis.utilityScore;
    }

    setResult({
      option1: option1Analysis, option2: option2Analysis, recommendation, confidence,
      deontological: analyzeDeontological(option1Analysis, option2Analysis),
      virtue: analyzeVirtueEthics()
    });
  };

  const resetForm = () => {
    setScenario({
      option1: {
        name: 'Option A', occupants: 1, occupantAge: 35, pedestrians: 0, pedestrianAge: 0,
        occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
        occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
        occupantSpecies: 'human', occupantNetwork: 'none',
        pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
        pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
        pedestrianSpecies: 'human', pedestrianNetwork: 'none',
        certainty: 90, severity: 'minor'
      },
      option2: {
        name: 'Option B', occupants: 0, occupantAge: 0, pedestrians: 2, pedestrianAge: 45,
        occupantJob: 'average', occupantHealth: 'healthy', occupantCriminal: 'none',
        occupantLegalFault: 'legal', occupantRisk: 'normal', occupantPregnant: false,
        occupantSpecies: 'human', occupantNetwork: 'none',
        pedestrianJob: 'average', pedestrianHealth: 'healthy', pedestrianCriminal: 'none',
        pedestrianLegalFault: 'legal', pedestrianRisk: 'normal', pedestrianPregnant: false,
        pedestrianSpecies: 'human', pedestrianNetwork: 'none',
        certainty: 95, severity: 'serious'
      }
    });
    setResult(null); setActiveFramework('utilitarian'); setSimpleMode(false);
  };

  const exportScenario = () => {
    const data = { scenario, includeControversial, includeExtendedFactors, includeNetworkEffects, result, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethical-scenario-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importScenario = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setScenario(data.scenario);
          setIncludeControversial(data.includeControversial || false);
          setIncludeExtendedFactors(data.includeExtendedFactors || false);
          setIncludeNetworkEffects(data.includeNetworkEffects || false);
          if (data.result) setResult(data.result);
        } catch (error) {
          alert('Error loading scenario file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const NumberInput = ({ label, value, onChange, min = 0, max = 999, disabled = false, step = 1, placeholder = "" }) => {
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef(null);

    // Sync local value when prop value changes (but not when user is typing)
    useEffect(() => {
      if (document.activeElement !== inputRef.current) {
        setLocalValue(value);
      }
    }, [value]);

    const handleIncrement = () => {
      if (!disabled && value < max) {
        const newValue = value + step;
        onChange(newValue);
        setLocalValue(newValue);
      }
    };

    const handleDecrement = () => {
      if (!disabled && value > min) {
        const newValue = Math.max(min, value - step);
        onChange(newValue);
        setLocalValue(newValue);
      }
    };

    const handleChange = (e) => {
      const inputValue = e.target.value;
      // Keep as string while typing to allow empty/partial input
      setLocalValue(inputValue);
      // Don't update parent immediately - let user finish typing
    };

    const handleBlur = (e) => {
      const inputValue = e.target.value;
      if (inputValue === '' || inputValue === '-') {
        // Empty or just minus sign - set to min
        setLocalValue(min);
        onChange(min);
      } else {
        const parsed = parseInt(inputValue, 10);
        if (isNaN(parsed)) {
          // Invalid input - revert to current value
          setLocalValue(value);
        } else {
          const clampedValue = Math.max(min, Math.min(max, parsed));
          setLocalValue(clampedValue);
          onChange(clampedValue);
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur(); // This will trigger handleBlur
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400 active:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <Minus className="w-4 h-4 text-gray-700" />
          </button>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={localValue}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="flex-1 px-3 py-2 text-center border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400 active:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <Plus className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    );
  };

  const OptionInput = memo(({ option, optionKey, simpleMode, onUpdate, includeControversial, includeExtendedFactors, includeNetworkEffects }) => {
    const handleNameChange = useCallback((e) => {
      onUpdate(optionKey, { ...option, name: e.target.value });
    }, [optionKey, option, onUpdate]);

    const handleFieldUpdate = useCallback((field, value) => {
      onUpdate(optionKey, { ...option, [field]: value });
    }, [optionKey, option, onUpdate]);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
        <input type="text" value={option.name}
          onChange={handleNameChange}
          className="text-xl font-bold mb-4 w-full border-b-2 border-blue-300 focus:border-blue-500 outline-none pb-2"
          disabled={simpleMode} />

      <div className="space-y-4">
        <NumberInput
          label="Vehicle Occupants"
          value={option.occupants}
          onChange={(val) => handleFieldUpdate('occupants', val)}
          min={0}
          max={20}
          disabled={simpleMode}
        />

        {option.occupants > 0 && (
          <>
            <NumberInput
              label="Average Age of Occupants"
              value={option.occupantAge}
              onChange={(val) => handleFieldUpdate('occupantAge', val)}
              min={0}
              max={120}
              disabled={simpleMode}
            />

            {includeControversial && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupant Occupation</label>
                  <select value={option.occupantJob}
                    onChange={(e) => handleFieldUpdate('occupantJob', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="unemployed">Unemployed</option>
                    <option value="average">Average Worker</option>
                    <option value="skilled">Skilled Worker</option>
                    <option value="professional">Professional</option>
                    <option value="lifesaving">Lifesaving Role</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="primaryResearcher">Primary Researcher</option>
                    <option value="uniqueExpert">Unique Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupant Health</label>
                  <select value={option.occupantHealth}
                    onChange={(e) => handleFieldUpdate('occupantHealth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="healthy">Healthy</option>
                    <option value="chronic">Chronic Condition</option>
                    <option value="terminal">Terminal Illness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupant Criminal History</label>
                  <select value={option.occupantCriminal}
                    onChange={(e) => handleFieldUpdate('occupantCriminal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="none">No History</option>
                    <option value="minor">Minor Offenses</option>
                    <option value="property">Property Crimes</option>
                    <option value="violent">Violent Offenses</option>
                    <option value="homicide">Homicide</option>
                    <option value="activeCrime">Active Crime</option>
                  </select>
                </div>
              </>
            )}

            {includeExtendedFactors && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupant Legal Status</label>
                  <select value={option.occupantLegalFault}
                    onChange={(e) => handleFieldUpdate('occupantLegalFault', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="legal">Following Laws</option>
                    <option value="minorViolation">Minor Violation</option>
                    <option value="jaywalking">Jaywalking</option>
                    <option value="reckless">Reckless</option>
                    <option value="dui">DUI</option>
                    <option value="fleeing">Fleeing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupant Risk Level</label>
                  <select value={option.occupantRisk}
                    onChange={(e) => handleFieldUpdate('occupantRisk', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="innocent">Innocent</option>
                    <option value="normal">Normal</option>
                    <option value="consented">Consented</option>
                    <option value="risky">Risky</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupant Pregnancy</label>
                  <select value={option.occupantPregnant}
                    onChange={(e) => handleFieldUpdate('occupantPregnant', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="false">Not Pregnant</option>
                    <option value="true">Pregnant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupant Species</label>
                  <select value={option.occupantSpecies}
                    onChange={(e) => handleFieldUpdate('occupantSpecies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="human">Human</option>
                    <option value="petDog">Pet Dog</option>
                    <option value="petCat">Pet Cat</option>
                    <option value="livestock">Livestock</option>
                  </select>
                </div>
              </>
            )}

            {includeNetworkEffects && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupant Network</label>
                <select value={option.occupantNetwork}
                  onChange={(e) => handleFieldUpdate('occupantNetwork', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="none">None</option>
                  <option value="partner">Partner</option>
                  <option value="parent">Parent</option>
                  <option value="soleParent">Sole Parent</option>
                  <option value="primaryCaregiver">Caregiver</option>
                  <option value="soleProvider">Sole Provider</option>
                </select>
              </div>
            )}
          </>
        )}

        <NumberInput
          label="Pedestrians"
          value={option.pedestrians}
          onChange={(val) => handleFieldUpdate('pedestrians', val)}
          min={0}
          max={20}
          disabled={simpleMode}
        />

        {option.pedestrians > 0 && (
          <>
            <NumberInput
              label="Pedestrian Age"
              value={option.pedestrianAge}
              onChange={(val) => handleFieldUpdate('pedestrianAge', val)}
              min={0}
              max={120}
              disabled={simpleMode}
            />

            {includeControversial && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Occupation</label>
                  <select value={option.pedestrianJob}
                    onChange={(e) => handleFieldUpdate('pedestrianJob', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="unemployed">Unemployed</option>
                    <option value="average">Average Worker</option>
                    <option value="skilled">Skilled Worker</option>
                    <option value="professional">Professional</option>
                    <option value="lifesaving">Lifesaving Role</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="primaryResearcher">Primary Researcher</option>
                    <option value="uniqueExpert">Unique Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Health</label>
                  <select value={option.pedestrianHealth}
                    onChange={(e) => handleFieldUpdate('pedestrianHealth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="healthy">Healthy</option>
                    <option value="chronic">Chronic Condition</option>
                    <option value="terminal">Terminal Illness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Criminal History</label>
                  <select value={option.pedestrianCriminal}
                    onChange={(e) => handleFieldUpdate('pedestrianCriminal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="none">No History</option>
                    <option value="minor">Minor Offenses</option>
                    <option value="property">Property Crimes</option>
                    <option value="violent">Violent Offenses</option>
                    <option value="homicide">Homicide</option>
                    <option value="activeCrime">Active Crime</option>
                  </select>
                </div>
              </>
            )}

            {includeExtendedFactors && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Legal Status</label>
                  <select value={option.pedestrianLegalFault}
                    onChange={(e) => handleFieldUpdate('pedestrianLegalFault', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="legal">Following Laws</option>
                    <option value="minorViolation">Minor Violation</option>
                    <option value="jaywalking">Jaywalking</option>
                    <option value="reckless">Reckless</option>
                    <option value="dui">DUI</option>
                    <option value="fleeing">Fleeing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Risk</label>
                  <select value={option.pedestrianRisk}
                    onChange={(e) => handleFieldUpdate('pedestrianRisk', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="innocent">Innocent</option>
                    <option value="normal">Normal</option>
                    <option value="consented">Consented</option>
                    <option value="risky">Risky</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Pregnancy</label>
                  <select value={option.pedestrianPregnant}
                    onChange={(e) => handleFieldUpdate('pedestrianPregnant', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="false">Not Pregnant</option>
                    <option value="true">Pregnant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Species</label>
                  <select value={option.pedestrianSpecies}
                    onChange={(e) => handleFieldUpdate('pedestrianSpecies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="human">Human</option>
                    <option value="petDog">Pet Dog</option>
                    <option value="petCat">Pet Cat</option>
                    <option value="livestock">Livestock</option>
                  </select>
                </div>
              </>
            )}

            {includeNetworkEffects && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Network</label>
                <select value={option.pedestrianNetwork}
                  onChange={(e) => handleFieldUpdate('pedestrianNetwork', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="none">None</option>
                  <option value="partner">Partner</option>
                  <option value="parent">Parent</option>
                  <option value="soleParent">Sole Parent</option>
                  <option value="primaryCaregiver">Caregiver</option>
                  <option value="soleProvider">Sole Provider</option>
                </select>
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Injury Severity</label>
          <select value={option.severity}
            onChange={(e) => handleFieldUpdate('severity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={simpleMode}>
            <option value="none">None</option>
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="serious">Serious</option>
            <option value="critical">Critical</option>
            <option value="fatal">Fatal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certainty: {option.certainty}%</label>
          <input type="range" min="0" max="100" value={option.certainty}
            onChange={(e) => handleFieldUpdate('certainty', parseInt(e.target.value))}
            className="w-full" disabled={simpleMode} />
        </div>
      </div>
    </div>
    );
  });

  return (
    <div>
      {/* Navigation Bar - Removed since App.jsx handles it */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-gray-900">AV Ethics Capstone</span>
            </div>
            <div className="flex gap-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">Analyzer</Link>
              <a href="/AVECapstone/poster.html" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">Poster</a>
              <a href="/AVECapstone/presentation.html" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">Presentation</a>
              <a href="/AVECapstone/final-capstone-presentation.html" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">Final Presentation</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-10 h-10 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">Ethical Decision Analyzer</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Analyze vehicle accident scenarios through multiple ethical frameworks with calculation transparency and preset scenarios.
            </p>
          </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div className="text-sm text-yellow-800">
              <strong>Educational Tool:</strong> This is for learning only. Real-world ethics are more complex.
            </div>
          </div>
        </div>

        {/* Preset Library */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg shadow-md p-6 mb-6 border-2 border-green-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Library className="w-5 h-5 text-green-600" />
            Preset Scenarios
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(presetScenarios).map(([key, preset]) => (
              <button key={key} onClick={() => loadPreset(key)}
                className="px-4 py-3 bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-400 rounded-lg text-sm font-medium transition-all"
                title={preset.description}>
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Mode */}
        <div className="bg-green-50 rounded-lg shadow-md p-4 mb-6 border-2 border-green-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={simpleMode} onChange={(e) => setSimpleMode(e.target.checked)}
              className="w-5 h-5 text-green-600 rounded" />
            <div>
              <span className="font-semibold text-gray-900"><Zap className="w-4 h-4 inline" /> Simple Mode</span>
              <p className="text-xs text-gray-600">1v1, 100% fatal, 100% certainty</p>
            </div>
          </label>
        </div>

        {/* Factor Toggles */}
        <div className="space-y-3 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={includeControversial} onChange={(e) => setIncludeControversial(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded" />
              <div>
                <span className="font-semibold text-gray-900 text-sm">Standard Controversial Factors</span>
                <p className="text-xs text-gray-600">Occupation, health, criminal history</p>
              </div>
            </label>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-2 border-orange-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={includeExtendedFactors} onChange={(e) => setIncludeExtendedFactors(e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded" />
              <div>
                <span className="font-semibold text-gray-900 text-sm">Extended Factors</span>
                <p className="text-xs text-gray-600">Legal fault, risk, pregnancy, species</p>
              </div>
            </label>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={includeNetworkEffects} onChange={(e) => setIncludeNetworkEffects(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded" />
              <div>
                <span className="font-semibold text-gray-900 text-sm">Network Effects</span>
                <p className="text-xs text-gray-600">Dependents and caregiving</p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <OptionInput 
            option={scenario.option1} 
            optionKey="option1" 
            simpleMode={simpleMode}
            onUpdate={handleOptionUpdate}
            includeControversial={includeControversial}
            includeExtendedFactors={includeExtendedFactors}
            includeNetworkEffects={includeNetworkEffects}
          />
          <OptionInput 
            option={scenario.option2} 
            optionKey="option2"
            simpleMode={simpleMode}
            onUpdate={handleOptionUpdate}
            includeControversial={includeControversial}
            includeExtendedFactors={includeExtendedFactors}
            includeNetworkEffects={includeNetworkEffects}
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button onClick={analyzeScenario} className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-lg">
            <TrendingUp className="w-5 h-5" /> Analyze
          </button>
          <button onClick={resetForm} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> Reset
          </button>
          <button onClick={() => setShowResources(!showResources)} className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Resources
          </button>
          <button onClick={() => setShowResearchFindings(!showResearchFindings)} className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 flex items-center gap-2">
            <Library className="w-5 h-5" /> Research Findings
          </button>
          <button onClick={exportScenario} className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 flex items-center gap-2">
            <Download className="w-5 h-5" /> Export
          </button>
          <label className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 flex items-center gap-2 cursor-pointer">
            <Upload className="w-5 h-5" /> Import
            <input type="file" accept=".json" onChange={importScenario} className="hidden" />
          </label>
        </div>

        {showResources && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-4"><BookOpen className="w-6 h-6 inline text-blue-600" /> Educational Resources</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>The Trolley Problem:</strong> Classic thought experiment exploring moral dilemmas.</p>
              <p><strong>Evidence-Based Weights:</strong> Uses VSL ($6-14M), QALY frameworks, recidivism data.</p>
              <p><strong>Further Reading:</strong> MIT Moral Machine, "Justice" by Sandel, DOT VSL guidelines</p>
            </div>
          </div>
        )}

        {showResearchFindings && contentData && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold mb-6"><Library className="w-6 h-6 inline text-indigo-600" /> Research Findings</h2>
            
            {/* Research Questions */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-indigo-700">Research Questions</h3>
              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h4 className="font-semibold mb-2">{contentData.researchQuestions.primary.icon} {contentData.researchQuestions.primary.title}</h4>
                  <p className="text-gray-700">{contentData.researchQuestions.primary.question}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h4 className="font-semibold mb-2">{contentData.researchQuestions.secondary.icon} {contentData.researchQuestions.secondary.title}</h4>
                  <p className="text-gray-700">{contentData.researchQuestions.secondary.question}</p>
                </div>
              </div>
            </div>

            {/* Key Findings */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-indigo-700">Key Findings</h3>
              <div className="space-y-4">
                {contentData.findings.map((finding, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-200">
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                      {finding.icon} {finding.title}
                      {finding.statistic && (
                        <span className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                          {finding.statistic.value} {finding.statistic.label || ''}
                        </span>
                      )}
                    </h4>
                    {finding.lowConnectedness && finding.highConnectedness && (
                      <div className="mb-3 space-y-2 text-sm">
                        <p><strong>Low connectedness:</strong> {finding.lowConnectedness.decision} ({finding.lowConnectedness.harm})</p>
                        <p><strong>High connectedness:</strong> {finding.highConnectedness.decision} ({finding.highConnectedness.harm})</p>
                      </div>
                    )}
                    <p className="text-gray-700">{finding.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario Data Table */}
            {contentData.scenarioData && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-indigo-700">Decision Stability Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border-2 border-indigo-300">
                    <thead>
                      <tr className="bg-indigo-100">
                        {contentData.scenarioData.tableHeaders.map((header, idx) => (
                          <th key={idx} className="border border-indigo-300 px-4 py-2 text-left font-semibold">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {contentData.scenarioData.scenarios.map((scenario, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-indigo-300 px-4 py-2 font-semibold">{scenario.name}</td>
                          <td className={`border border-indigo-300 px-4 py-2 ${scenario.changed && scenario.changedAt.includes('none') ? 'bg-red-100 font-bold text-red-700' : ''}`}>{scenario.none}</td>
                          <td className={`border border-indigo-300 px-4 py-2 ${scenario.changed && scenario.changedAt.includes('medium') ? 'bg-red-100 font-bold text-red-700' : ''}`}>{scenario.medium}</td>
                          <td className={`border border-indigo-300 px-4 py-2 ${scenario.changed && scenario.changedAt.includes('high') ? 'bg-red-100 font-bold text-red-700' : ''}`}>{scenario.high}</td>
                          <td className={`border border-indigo-300 px-4 py-2 ${scenario.changed && scenario.changedAt.includes('maximum') ? 'bg-red-100 font-bold text-red-700' : ''}`}>{scenario.maximum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-gray-600 italic text-center">
                  <span className="bg-red-100 px-3 py-1 rounded border-2 border-red-300 font-semibold">
                    Red cells indicate decision changed at this connectedness level
                  </span>
                </p>
              </div>
            )}

            {/* Conclusions */}
            {contentData.conclusions && (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Conclusions</h3>
                <ul className="space-y-3">
                  {contentData.conclusions.preliminaryInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: insight.text }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold mb-6"><ChevronRight className="w-6 h-6 inline text-indigo-600" /> Results</h2>

            <div className="flex gap-2 mb-6 flex-wrap">
              <button onClick={() => setActiveFramework('utilitarian')}
                className={`px-4 py-2 rounded-lg font-semibold ${activeFramework === 'utilitarian' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                <TrendingUp className="w-4 h-4 inline" /> Utilitarian
              </button>
              <button onClick={() => setActiveFramework('deontological')}
                className={`px-4 py-2 rounded-lg font-semibold ${activeFramework === 'deontological' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                <Scale className="w-4 h-4 inline" /> Deontological
              </button>
              <button onClick={() => setActiveFramework('virtue')}
                className={`px-4 py-2 rounded-lg font-semibold ${activeFramework === 'virtue' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                <Heart className="w-4 h-4 inline" /> Virtue
              </button>
            </div>

            {activeFramework === 'utilitarian' && (
              <>
                {/* Visual Chart */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border-2 border-indigo-200">
                  <h3 className="text-lg font-bold mb-4"><BarChart3 className="w-5 h-5 inline text-indigo-600" /> Harm Comparison</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{scenario.option1.name}</span>
                        <span className="font-bold text-blue-600">{result.option1.expectedHarm.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-end pr-3"
                          style={{width: `${(result.option1.expectedHarm / Math.max(result.option1.expectedHarm, result.option2.expectedHarm, 0.001)) * 100}%`}}>
                          <span className="text-white text-sm font-bold">
                            {((result.option1.expectedHarm / Math.max(result.option1.expectedHarm, result.option2.expectedHarm, 0.001)) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{scenario.option2.name}</span>
                        <span className="font-bold text-purple-600">{result.option2.expectedHarm.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-8 rounded-full flex items-center justify-end pr-3"
                          style={{width: `${(result.option2.expectedHarm / Math.max(result.option1.expectedHarm, result.option2.expectedHarm, 0.001)) * 100}%`}}>
                          <span className="text-white text-sm font-bold">
                            {((result.option2.expectedHarm / Math.max(result.option1.expectedHarm, result.option2.expectedHarm, 0.001)) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">Lower harm = better. Choose the shorter bar.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold mb-4">{scenario.option1.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">People:</span><span className="font-semibold">{result.option1.totalPeople}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Life Years Lost:</span><span className="font-semibold">{result.option1.lifeYearsLost.toFixed(1)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Certainty:</span><span className="font-semibold">{(result.option1.certainty * 100).toFixed(0)}%</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Expected Harm:</span><span className="font-semibold">{result.option1.expectedHarm.toFixed(1)}</span></div>
                      <div className="flex justify-between pt-2 border-t-2 border-blue-300"><span className="font-medium">Utility Score:</span><span className="font-bold text-blue-600">{result.option1.utilityScore.toFixed(1)}</span></div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold mb-4">{scenario.option2.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">People:</span><span className="font-semibold">{result.option2.totalPeople}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Life Years Lost:</span><span className="font-semibold">{result.option2.lifeYearsLost.toFixed(1)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Certainty:</span><span className="font-semibold">{(result.option2.certainty * 100).toFixed(0)}%</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Expected Harm:</span><span className="font-semibold">{result.option2.expectedHarm.toFixed(1)}</span></div>
                      <div className="flex justify-between pt-2 border-t-2 border-purple-300"><span className="font-medium">Utility Score:</span><span className="font-bold text-purple-600">{result.option2.utilityScore.toFixed(1)}</span></div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-6 border-2 ${result.recommendation === 'option1' ? 'bg-blue-100 border-blue-400' : result.recommendation === 'option2' ? 'bg-purple-100 border-purple-400' : 'bg-gray-100 border-gray-400'}`}>
                  <h3 className="text-xl font-bold mb-3"><TrendingUp className="w-6 h-6 inline" /> Utilitarian Recommendation</h3>
                  <p className="text-lg mb-2">
                    {result.recommendation === 'neutral' ? 'Both options result in similar expected harm.' :
                     result.recommendation === 'option1' ? scenario.option1.name :
                     scenario.option2.name}
                  </p>
                  <p className="text-sm"><strong>Confidence:</strong> {result.confidence.toFixed(1)}%</p>
                </div>
              </>
            )}

            {activeFramework === 'deontological' && (
              <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold mb-4"><Scale className="w-6 h-6 inline" /> Deontological Analysis</h3>
                <p className="mb-4">{result.deontological.reasoning}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold mb-2">{scenario.option1.name}:</h4>
                    {result.deontological.option1Concerns.length > 0 ? (
                      <ul className="list-disc ml-5 text-sm">{result.deontological.option1Concerns.map((c, i) => <li key={i}>{c}</li>)}</ul>
                    ) : <p className="text-sm italic">No major concerns</p>}
                  </div>
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold mb-2">{scenario.option2.name}:</h4>
                    {result.deontological.option2Concerns.length > 0 ? (
                      <ul className="list-disc ml-5 text-sm">{result.deontological.option2Concerns.map((c, i) => <li key={i}>{c}</li>)}</ul>
                    ) : <p className="text-sm italic">No major concerns</p>}
                  </div>
                </div>
              </div>
            )}

            {activeFramework === 'virtue' && (
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold mb-4"><Heart className="w-6 h-6 inline" /> Virtue Ethics</h3>
                <p className="mb-4">{result.virtue.recommendation}</p>
                <div className="space-y-2">
                  {result.virtue.considerations.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-600 mt-1" />
                      <p className="text-sm">{c}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EthicalChoiceAnalyzer;
