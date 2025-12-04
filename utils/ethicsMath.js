const severityScores = {
  none: 0,
  minor: 1,
  moderate: 2,
  serious: 3,
  critical: 4,
  fatal: 5
};

const jobMultipliers = {
  unemployed: 0.9,
  average: 1.0,
  skilled: 1.1,
  professional: 1.2,
  lifesaving: 1.5,
  caregiver: 1.4,
  primaryResearcher: 1.6,
  uniqueExpert: 1.8
};

const healthMultipliers = {
  terminal: 0.3,
  chronic: 0.6,
  healthy: 1.0
};

const criminalMultipliers = {
  none: 1.0,
  minor: 0.98,
  property: 0.92,
  violent: 0.94,
  homicide: 0.98,
  activeCrime: 0.4
};

const legalFaultMultipliers = {
  legal: 1.0,
  minorViolation: 0.95,
  jaywalking: 0.9,
  reckless: 0.7,
  dui: 0.6,
  fleeing: 0.5
};

const voluntaryRiskMultipliers = {
  innocent: 1.0,
  normal: 1.0,
  consented: 0.9,
  risky: 0.7,
  extreme: 0.5
};

const pregnancyMultipliers = {
  notPregnant: 1.0,
  pregnant: 1.8
};

const speciesMultipliers = {
  human: 1.0,
  petDog: 0.05,
  petCat: 0.05,
  livestock: 0.02
};

const networkMultipliers = {
  none: 1.0,
  partner: 1.1,
  parent: 1.3,
  soleParent: 1.6,
  primaryCaregiver: 1.5,
  soleProvider: 1.4
};

export function calculateLifeYears(
  person,
  options = {},
  trackSteps = false
) {
  const {
    age = 0,
    severity = 'minor',
    job = 'average',
    health = 'healthy',
    criminal = 'none',
    legalFault = 'legal',
    risk = 'normal',
    pregnant = false,
    species = 'human',
    network = 'none'
  } = person;

  const {
    includeControversial = false,
    includeExtendedFactors = false,
    includeNetworkEffects = false
  } = options;

  const steps = [];
  const referenceAge = 85;

  let remainingYears = Math.max(1, referenceAge - age);
  const severityMultipliers = {
    none: 0,
    minor: 0.05,
    moderate: 0.2,
    serious: 0.5,
    critical: 0.8,
    fatal: 1.0
  };

  let lifeYearsLost = remainingYears * (severityMultipliers[severity] || 0);

  if (trackSteps) {
    const ageFormula = age >= referenceAge ? '1 (minimum floor)' : `${referenceAge} - ${age}`;
    steps.push({
      step: 'Base Calculation',
      formula: `max(1, ${ageFormula}) × ${severityMultipliers[severity] || 0}`,
      calculation: `${remainingYears.toFixed(2)} years × ${severityMultipliers[severity] || 0} = ${lifeYearsLost.toFixed(2)}`,
      value: lifeYearsLost
    });
  }

  if (includeControversial) {
    const healthMult = healthMultipliers[health] || 1.0;
    if (healthMult !== 1.0) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= healthMult;
      if (trackSteps) {
        steps.push({
          step: 'Health',
          formula: `${oldValue.toFixed(2)} × ${healthMult}`,
          calculation: `${health} (${healthMult}x)`,
          value: lifeYearsLost
        });
      }
    }

    const jobMult = jobMultipliers[job] || 1.0;
    if (jobMult !== 1.0) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= jobMult;
      if (trackSteps) {
        steps.push({
          step: 'Occupation',
          formula: `${oldValue.toFixed(2)} × ${jobMult}`,
          calculation: `${job} (${jobMult}x)`,
          value: lifeYearsLost
        });
      }
    }

    const crimMult = criminalMultipliers[criminal] || 1.0;
    if (crimMult !== 1.0) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= crimMult;
      if (trackSteps) {
        steps.push({
          step: 'Criminal',
          formula: `${oldValue.toFixed(2)} × ${crimMult}`,
          calculation: `${criminal} (${crimMult}x)`,
          value: lifeYearsLost
        });
      }
    }
  }

  if (includeExtendedFactors) {
    const speciesMult = speciesMultipliers[species] || 1.0;
    if (speciesMult !== 1.0) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= speciesMult;
      if (trackSteps) {
        steps.push({
          step: 'Species',
          formula: `${oldValue.toFixed(2)} × ${speciesMult}`,
          calculation: `${species} (${speciesMult}x)`,
          value: lifeYearsLost
        });
      }
    }

    if (pregnant) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= pregnancyMultipliers.pregnant;
      if (trackSteps) {
        steps.push({
          step: 'Pregnancy',
          formula: `${oldValue.toFixed(2)} × ${pregnancyMultipliers.pregnant}`,
          calculation: `Two lives (${pregnancyMultipliers.pregnant}x)`,
          value: lifeYearsLost
        });
      }
    }

    const legalMult = legalFaultMultipliers[legalFault] || 1.0;
    if (legalMult !== 1.0) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= legalMult;
      if (trackSteps) {
        steps.push({
          step: 'Legal Fault',
          formula: `${oldValue.toFixed(2)} × ${legalMult}`,
          calculation: `${legalFault} (${legalMult}x)`,
          value: lifeYearsLost
        });
      }
    }

    const riskMult = voluntaryRiskMultipliers[risk] || 1.0;
    if (riskMult !== 1.0) {
      const oldValue = lifeYearsLost;
      lifeYearsLost *= riskMult;
      if (trackSteps) {
        steps.push({
          step: 'Voluntary Risk',
          formula: `${oldValue.toFixed(2)} × ${riskMult}`,
          calculation: `${risk} (${riskMult}x)`,
          value: lifeYearsLost
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
          step: 'Network',
          formula: `${oldValue.toFixed(2)} × ${netMult}`,
          calculation: `${network} (${netMult}x)`,
          value: lifeYearsLost
        });
      }
    }
  }

  return trackSteps ? { value: lifeYearsLost, steps } : lifeYearsLost;
}

export { severityScores };
