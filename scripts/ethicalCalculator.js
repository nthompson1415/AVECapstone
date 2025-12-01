// Ethical Calculator Module - Replicates the analyzer logic

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

export function calculateLifeYears(age, severity, job, health, criminal, legalFault, risk, pregnant, species, network, includeControversial, includeExtendedFactors, includeNetworkEffects) {
  // Use reference age consistent with YPLL (Years of Potential Life Lost) methodology
  // Common reference ages: 75 (some YPLL), 85 (many YPLL studies), 90 (WHO DALY standard)
  // Using 85 as reference age ensures people at average life expectancy (78) still have 7 years
  // and provides smooth discounting for older ages while maintaining minimum value
  const referenceAge = 85; // Standard YPLL reference age, aligns with public health methodology
  const averageLifeExpectancy = 78; // US average life expectancy (for documentation)
  
  // Calculate remaining years using reference age methodology
  // This ensures no one is ever at zero harm due to age alone
  // For ages over reference age, apply minimum floor value
  const remainingYears = Math.max(1, referenceAge - age);
  
  const severityMultipliers = {
    none: 0, minor: 0.05, moderate: 0.2, serious: 0.5, critical: 0.8, fatal: 1.0
  };
  
  let lifeYearsLost = remainingYears * severityMultipliers[severity];
  
  if (includeControversial) {
    const healthMult = healthMultipliers[health] || 1.0;
    if (healthMult !== 1.0) {
      lifeYearsLost *= healthMult;
    }
    
    const jobMult = jobMultipliers[job] || 1.0;
    if (jobMult !== 1.0) {
      lifeYearsLost *= jobMult;
    }
    
    const crimMult = criminalMultipliers[criminal] || 1.0;
    if (crimMult !== 1.0) {
      lifeYearsLost *= crimMult;
    }
  }
  
  if (includeExtendedFactors) {
    const speciesMult = speciesMultipliers[species] || 1.0;
    if (speciesMult !== 1.0) {
      lifeYearsLost *= speciesMult;
    }
    
    if (pregnant) {
      lifeYearsLost *= pregnancyMultipliers.pregnant;
    }
    
    const legalMult = legalFaultMultipliers[legalFault] || 1.0;
    if (legalMult !== 1.0) {
      lifeYearsLost *= legalMult;
    }
    
    const riskMult = voluntaryRiskMultipliers[risk] || 1.0;
    if (riskMult !== 1.0) {
      lifeYearsLost *= riskMult;
    }
  }
  
  if (includeNetworkEffects) {
    const netMult = networkMultipliers[network] || 1.0;
    if (netMult !== 1.0) {
      lifeYearsLost *= netMult;
    }
  }
  
  return lifeYearsLost;
}

export function analyzeScenario(scenario, includeControversial, includeExtendedFactors, includeNetworkEffects) {
  const option1Analysis = {
    totalPeople: scenario.option1.occupants + scenario.option1.pedestrians,
    lifeYearsLost: 0,
    certainty: scenario.option1.certainty / 100,
    severityScore: severityScores[scenario.option1.severity]
  };
  
  const option2Analysis = {
    totalPeople: scenario.option2.occupants + scenario.option2.pedestrians,
    lifeYearsLost: 0,
    certainty: scenario.option2.certainty / 100,
    severityScore: severityScores[scenario.option2.severity]
  };

  // Calculate option1 harm
  if (scenario.option1.occupants > 0) {
    const lifeYears = calculateLifeYears(
      scenario.option1.occupantAge, scenario.option1.severity, scenario.option1.occupantJob,
      scenario.option1.occupantHealth, scenario.option1.occupantCriminal, scenario.option1.occupantLegalFault,
      scenario.option1.occupantRisk, scenario.option1.occupantPregnant, scenario.option1.occupantSpecies,
      scenario.option1.occupantNetwork, includeControversial, includeExtendedFactors, includeNetworkEffects
    );
    option1Analysis.lifeYearsLost += scenario.option1.occupants * lifeYears;
  }
  
  if (scenario.option1.pedestrians > 0) {
    const lifeYears = calculateLifeYears(
      scenario.option1.pedestrianAge, scenario.option1.severity, scenario.option1.pedestrianJob,
      scenario.option1.pedestrianHealth, scenario.option1.pedestrianCriminal, scenario.option1.pedestrianLegalFault,
      scenario.option1.pedestrianRisk, scenario.option1.pedestrianPregnant, scenario.option1.pedestrianSpecies,
      scenario.option1.pedestrianNetwork, includeControversial, includeExtendedFactors, includeNetworkEffects
    );
    option1Analysis.lifeYearsLost += scenario.option1.pedestrians * lifeYears;
  }

  // Calculate option2 harm
  if (scenario.option2.occupants > 0) {
    const lifeYears = calculateLifeYears(
      scenario.option2.occupantAge, scenario.option2.severity, scenario.option2.occupantJob,
      scenario.option2.occupantHealth, scenario.option2.occupantCriminal, scenario.option2.occupantLegalFault,
      scenario.option2.occupantRisk, scenario.option2.occupantPregnant, scenario.option2.occupantSpecies,
      scenario.option2.occupantNetwork, includeControversial, includeExtendedFactors, includeNetworkEffects
    );
    option2Analysis.lifeYearsLost += scenario.option2.occupants * lifeYears;
  }
  
  if (scenario.option2.pedestrians > 0) {
    const lifeYears = calculateLifeYears(
      scenario.option2.pedestrianAge, scenario.option2.severity, scenario.option2.pedestrianJob,
      scenario.option2.pedestrianHealth, scenario.option2.pedestrianCriminal, scenario.option2.pedestrianLegalFault,
      scenario.option2.pedestrianRisk, scenario.option2.pedestrianPregnant, scenario.option2.pedestrianSpecies,
      scenario.option2.pedestrianNetwork, includeControversial, includeExtendedFactors, includeNetworkEffects
    );
    option2Analysis.lifeYearsLost += scenario.option2.pedestrians * lifeYears;
  }

  option1Analysis.expectedHarm = option1Analysis.lifeYearsLost * option1Analysis.certainty;
  option2Analysis.expectedHarm = option2Analysis.lifeYearsLost * option2Analysis.certainty;

  let recommendation = '';
  const diff = Math.abs(option1Analysis.expectedHarm - option2Analysis.expectedHarm);
  
  if (diff < 0.1) {
    recommendation = 'neutral';
  } else if (option1Analysis.expectedHarm < option2Analysis.expectedHarm) {
    recommendation = 'option1';
  } else {
    recommendation = 'option2';
  }

  return {
    option1: option1Analysis,
    option2: option2Analysis,
    recommendation,
    difference: diff
  };
}

