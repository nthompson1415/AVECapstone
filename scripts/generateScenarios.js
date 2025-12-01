// Scenario Generator - Creates 100 unique ethical scenarios

import { analyzeScenario } from './ethicalCalculator.js';
import fs from 'fs';

// Available values for each attribute
const jobs = ['unemployed', 'average', 'skilled', 'professional', 'lifesaving', 'caregiver', 'primaryResearcher', 'uniqueExpert'];
const healths = ['healthy', 'chronic', 'terminal'];
const criminals = ['none', 'minor', 'property', 'violent', 'homicide', 'activeCrime'];
const legalFaults = ['legal', 'minorViolation', 'jaywalking', 'reckless', 'dui', 'fleeing'];
const risks = ['innocent', 'normal', 'consented', 'risky', 'extreme'];
const species = ['human', 'petDog', 'petCat', 'livestock'];
const networks = ['none', 'partner', 'parent', 'soleParent', 'primaryCaregiver', 'soleProvider'];
const severities = ['minor', 'moderate', 'serious', 'critical', 'fatal'];

// Helper to get random element from array
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random integer in range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to randomly decide boolean
function randomBool() {
  return Math.random() < 0.5;
}

// Create a default person object
function createDefaultPerson(age = null) {
  return {
    age: age !== null ? age : randomInt(5, 80),
    job: 'average',
    health: 'healthy',
    criminal: 'none',
    legalFault: 'legal',
    risk: 'normal',
    pregnant: false,
    species: 'human',
    network: 'none'
  };
}

// Create a scenario option
function createOption(name, occupants, pedestrians, baseAge = null) {
  const option = {
    name,
    occupants: occupants || 0,
    occupantAge: 0,
    occupantJob: 'average',
    occupantHealth: 'healthy',
    occupantCriminal: 'none',
    occupantLegalFault: 'legal',
    occupantRisk: 'normal',
    occupantPregnant: false,
    occupantSpecies: 'human',
    occupantNetwork: 'none',
    pedestrians: pedestrians || 0,
    pedestrianAge: 0,
    pedestrianJob: 'average',
    pedestrianHealth: 'healthy',
    pedestrianCriminal: 'none',
    pedestrianLegalFault: 'legal',
    pedestrianRisk: 'normal',
    pedestrianPregnant: false,
    pedestrianSpecies: 'human',
    pedestrianNetwork: 'none',
    certainty: 100,
    severity: 'fatal'
  };

  if (occupants > 0) {
    const person = createDefaultPerson(baseAge);
    option.occupantAge = person.age;
    option.occupantJob = person.job;
    option.occupantHealth = person.health;
    option.occupantCriminal = person.criminal;
    option.occupantLegalFault = person.legalFault;
    option.occupantRisk = person.risk;
    option.occupantPregnant = person.pregnant;
    option.occupantSpecies = person.species;
    option.occupantNetwork = person.network;
  }

  if (pedestrians > 0) {
    const person = createDefaultPerson(baseAge);
    option.pedestrianAge = person.age;
    option.pedestrianJob = person.job;
    option.pedestrianHealth = person.health;
    option.pedestrianCriminal = person.criminal;
    option.pedestrianLegalFault = person.legalFault;
    option.pedestrianRisk = person.risk;
    option.pedestrianPregnant = person.pregnant;
    option.pedestrianSpecies = person.species;
    option.pedestrianNetwork = person.network;
  }

  return option;
}

// Generate unique scenarios
function generateScenarios() {
  const scenarios = [];
  const scenarioHashes = new Set();

  // Classic scenarios to include
  const classicScenarios = [
    {
      name: "Classic Trolley (5 vs 1)",
      option1: createOption("Stay on Track", 0, 5, 40),
      option2: createOption("Switch Track", 0, 1, 40)
    },
    {
      name: "Young vs Elderly",
      option1: createOption("Hit Elderly", 0, 3, 75),
      option2: createOption("Hit Child", 0, 1, 8)
    },
    {
      name: "Doctor vs Criminal",
      option1: createOption("Hit Criminal", 0, 1, 35),
      option2: createOption("Hit Doctor", 0, 1, 35)
    },
    {
      name: "Legal vs Jaywalker",
      option1: createOption("Hit Legal", 0, 1, 40),
      option2: createOption("Hit Jaywalker", 0, 1, 40)
    },
    {
      name: "Pregnant Woman",
      option1: createOption("Hit Two People", 0, 2, 40),
      option2: createOption("Hit Pregnant", 0, 1, 28)
    },
    {
      name: "Pet vs Person",
      option1: createOption("Hit Dog", 0, 1, 0),
      option2: createOption("Hit Person", 0, 1, 40)
    }
  ];

  // Add classic scenarios
  classicScenarios.forEach((scenario, idx) => {
    if (idx === 1) { // Young vs Elderly
      scenario.option1.pedestrianAge = 75;
      scenario.option2.pedestrianAge = 8;
    }
    if (idx === 2) { // Doctor vs Criminal
      scenario.option1.pedestrianCriminal = 'violent';
      scenario.option2.pedestrianJob = 'lifesaving';
    }
    if (idx === 3) { // Legal vs Jaywalker
      scenario.option1.pedestrianRisk = 'innocent';
      scenario.option2.pedestrianLegalFault = 'jaywalking';
      scenario.option2.pedestrianRisk = 'risky';
    }
    if (idx === 4) { // Pregnant Woman
      scenario.option2.pedestrianPregnant = true;
    }
    if (idx === 5) { // Pet vs Person
      scenario.option1.pedestrianSpecies = 'petDog';
    }
    
    scenarios.push(scenario);
    scenarioHashes.add(JSON.stringify(scenario));
  });

  // Generate additional unique scenarios
  let attempts = 0;
  while (scenarios.length < 100 && attempts < 10000) {
    attempts++;
    
    // Vary number of people
    const occupants1 = randomInt(0, 3);
    const pedestrians1 = randomInt(1, 5);
    const occupants2 = randomInt(0, 3);
    const pedestrians2 = randomInt(1, 5);
    
    // Ensure at least one option has people
    if (occupants1 + pedestrians1 === 0 && occupants2 + pedestrians2 === 0) continue;
    
    const option1 = createOption("Option A", occupants1, pedestrians1);
    const option2 = createOption("Option B", occupants2, pedestrians2);
    
    // Randomly vary attributes
    if (randomBool() && pedestrians1 > 0) {
      option1.pedestrianAge = randomInt(5, 80);
      if (randomBool()) option1.pedestrianJob = randomChoice(jobs);
      if (randomBool()) option1.pedestrianHealth = randomChoice(healths);
      if (randomBool()) option1.pedestrianCriminal = randomChoice(criminals);
      if (randomBool()) option1.pedestrianLegalFault = randomChoice(legalFaults);
      if (randomBool()) option1.pedestrianRisk = randomChoice(risks);
      if (randomBool() && option1.pedestrianAge < 50) option1.pedestrianPregnant = randomBool();
      if (randomBool()) option1.pedestrianSpecies = randomChoice(species);
      if (randomBool()) option1.pedestrianNetwork = randomChoice(networks);
    }
    
    if (randomBool() && pedestrians2 > 0) {
      option2.pedestrianAge = randomInt(5, 80);
      if (randomBool()) option2.pedestrianJob = randomChoice(jobs);
      if (randomBool()) option2.pedestrianHealth = randomChoice(healths);
      if (randomBool()) option2.pedestrianCriminal = randomChoice(criminals);
      if (randomBool()) option2.pedestrianLegalFault = randomChoice(legalFaults);
      if (randomBool()) option2.pedestrianRisk = randomChoice(risks);
      if (randomBool() && option2.pedestrianAge < 50) option2.pedestrianPregnant = randomBool();
      if (randomBool()) option2.pedestrianSpecies = randomChoice(species);
      if (randomBool()) option2.pedestrianNetwork = randomChoice(networks);
    }
    
    if (randomBool() && occupants1 > 0) {
      option1.occupantAge = randomInt(18, 70);
      if (randomBool()) option1.occupantJob = randomChoice(jobs);
      if (randomBool()) option1.occupantHealth = randomChoice(healths);
      if (randomBool()) option1.occupantCriminal = randomChoice(criminals);
      if (randomBool()) option1.occupantLegalFault = randomChoice(legalFaults);
      if (randomBool()) option1.occupantRisk = randomChoice(risks);
      if (randomBool() && option1.occupantAge < 50) option1.occupantPregnant = randomBool();
      if (randomBool()) option1.occupantSpecies = randomChoice(species);
      if (randomBool()) option1.occupantNetwork = randomChoice(networks);
    }
    
    if (randomBool() && occupants2 > 0) {
      option2.occupantAge = randomInt(18, 70);
      if (randomBool()) option2.occupantJob = randomChoice(jobs);
      if (randomBool()) option2.occupantHealth = randomChoice(healths);
      if (randomBool()) option2.occupantCriminal = randomChoice(criminals);
      if (randomBool()) option2.occupantLegalFault = randomChoice(legalFaults);
      if (randomBool()) option2.occupantRisk = randomChoice(risks);
      if (randomBool() && option2.occupantAge < 50) option2.occupantPregnant = randomBool();
      if (randomBool()) option2.occupantSpecies = randomChoice(species);
      if (randomBool()) option2.occupantNetwork = randomChoice(networks);
    }
    
    // Vary severity and certainty
    option1.severity = randomChoice(severities);
    option2.severity = randomChoice(severities);
    option1.certainty = randomInt(70, 100);
    option2.certainty = randomInt(70, 100);
    
    const scenario = {
      name: `Scenario ${scenarios.length + 1}`,
      option1,
      option2
    };
    
    const hash = JSON.stringify(scenario);
    if (!scenarioHashes.has(hash)) {
      scenarioHashes.add(hash);
      scenarios.push(scenario);
    }
  }
  
  return scenarios;
}

// Main execution
function main() {
  console.log('Generating 100 unique scenarios...');
  const scenarios = generateScenarios();
  console.log(`Generated ${scenarios.length} unique scenarios`);
  
  console.log('Analyzing scenarios at different connectedness levels...');
  
  const connectednessLevels = [
    { name: 'None (Demographic-Blind)', controversial: false, extended: false, network: false },
    { name: 'Low (Age Only)', controversial: false, extended: false, network: false },
    { name: 'Medium (+ Occupation/Health/Criminal)', controversial: true, extended: false, network: false },
    { name: 'High (+ Legal/Pregnancy/Species)', controversial: true, extended: true, network: false },
    { name: 'Maximum (+ Network Effects)', controversial: true, extended: true, network: true }
  ];
  
  const results = [];
  
  scenarios.forEach((scenario, idx) => {
    console.log(`Processing scenario ${idx + 1}/${scenarios.length}: ${scenario.name}`);
    
    connectednessLevels.forEach(level => {
      const analysis = analyzeScenario(
        scenario,
        level.controversial,
        level.extended,
        level.network
      );
      
      results.push({
        scenario: scenario.name,
        connectedness: level.name,
        harm1: analysis.option1.expectedHarm.toFixed(2),
        harm2: analysis.option2.expectedHarm.toFixed(2),
        recommendation: analysis.recommendation,
        difference: analysis.difference.toFixed(2)
      });
    });
  });
  
  // Write to CSV
  const csvHeader = 'Scenario,Connectedness,Harm1,Harm2,Recommendation,Difference\n';
  const csvRows = results.map(r => 
    `${r.scenario},${r.connectedness},${r.harm1},${r.harm2},${r.recommendation},${r.difference}`
  ).join('\n');
  
  const csvContent = csvHeader + csvRows;
  
  fs.writeFileSync('scenario_analysis_data_100.csv', csvContent);
  console.log(`\nResults written to scenario_analysis_data_100.csv`);
  console.log(`Total rows: ${results.length} (${scenarios.length} scenarios × ${connectednessLevels.length} levels)`);
  
  // Also save scenarios as JSON for reference
  fs.writeFileSync('scenarios_100.json', JSON.stringify(scenarios, null, 2));
  console.log(`Scenarios saved to scenarios_100.json`);
}

main();

