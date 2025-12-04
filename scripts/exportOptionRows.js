#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeScenario } from './ethicalCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jobs = ['unemployed', 'average', 'skilled', 'professional', 'lifesaving', 'caregiver', 'primaryResearcher', 'uniqueExpert'];
const healthStatuses = ['healthy', 'chronic', 'terminal'];
const criminalHistories = ['none', 'minor', 'property', 'violent', 'homicide', 'activeCrime'];
const legalStatuses = ['legal', 'minorViolation', 'jaywalking', 'reckless', 'dui', 'fleeing'];
const riskLevels = ['innocent', 'normal', 'consented', 'risky', 'extreme'];
const speciesOptions = ['human', 'petDog', 'petCat', 'livestock'];
const networkOptions = ['none', 'partner', 'parent', 'soleParent', 'primaryCaregiver', 'soleProvider'];
const severityLevels = ['minor', 'moderate', 'serious', 'critical', 'fatal'];

const connectednessLevels = [
  { name: 'None (Demographic-Blind)', flags: { includeControversial: false, includeExtendedFactors: false, includeNetworkEffects: false } },
  { name: 'Low (Age Only)', flags: { includeControversial: false, includeExtendedFactors: false, includeNetworkEffects: false } },
  { name: 'Medium (+ Occupation/Health/Criminal)', flags: { includeControversial: true, includeExtendedFactors: false, includeNetworkEffects: false } },
  { name: 'High (+ Legal/Pregnancy/Species)', flags: { includeControversial: true, includeExtendedFactors: true, includeNetworkEffects: false } },
  { name: 'Maximum (+ Network Effects)', flags: { includeControversial: true, includeExtendedFactors: true, includeNetworkEffects: true } }
];

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randomChoice(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function maybePregnant(rng, age) {
  if (age < 18 || age > 45) {
    return false;
  }
  return rng() < 0.15;
}

function createPersonProfile(rng, ageRange = [5, 80]) {
  const age = randInt(rng, ageRange[0], ageRange[1]);
  return {
    age,
    job: randomChoice(rng, jobs),
    health: randomChoice(rng, healthStatuses),
    criminal: randomChoice(rng, criminalHistories),
    legalFault: randomChoice(rng, legalStatuses),
    risk: randomChoice(rng, riskLevels),
    pregnant: maybePregnant(rng, age),
    species: randomChoice(rng, speciesOptions),
    network: randomChoice(rng, networkOptions)
  };
}

function createOption(name, rng) {
  const option = {
    name,
    occupants: randInt(rng, 0, 4),
    occupantAge: 0,
    occupantJob: 'average',
    occupantHealth: 'healthy',
    occupantCriminal: 'none',
    occupantLegalFault: 'legal',
    occupantRisk: 'normal',
    occupantPregnant: false,
    occupantSpecies: 'human',
    occupantNetwork: 'none',
    pedestrians: randInt(rng, 0, 5),
    pedestrianAge: 0,
    pedestrianJob: 'average',
    pedestrianHealth: 'healthy',
    pedestrianCriminal: 'none',
    pedestrianLegalFault: 'legal',
    pedestrianRisk: 'normal',
    pedestrianPregnant: false,
    pedestrianSpecies: 'human',
    pedestrianNetwork: 'none',
    certainty: randInt(rng, 70, 100),
    severity: randomChoice(rng, severityLevels)
  };

  if (option.occupants > 0) {
    const profile = createPersonProfile(rng, [16, 75]);
    option.occupantAge = profile.age;
    option.occupantJob = profile.job;
    option.occupantHealth = profile.health;
    option.occupantCriminal = profile.criminal;
    option.occupantLegalFault = profile.legalFault;
    option.occupantRisk = profile.risk;
    option.occupantPregnant = profile.pregnant;
    option.occupantSpecies = profile.species;
    option.occupantNetwork = profile.network;
  }

  if (option.pedestrians > 0) {
    const profile = createPersonProfile(rng, [5, 85]);
    option.pedestrianAge = profile.age;
    option.pedestrianJob = profile.job;
    option.pedestrianHealth = profile.health;
    option.pedestrianCriminal = profile.criminal;
    option.pedestrianLegalFault = profile.legalFault;
    option.pedestrianRisk = profile.risk;
    option.pedestrianPregnant = profile.pregnant;
    option.pedestrianSpecies = profile.species;
    option.pedestrianNetwork = profile.network;
  }

  return option;
}

function createScenario(index, rng) {
  let option1;
  let option2;
  do {
    option1 = createOption('Option A', rng);
    option2 = createOption('Option B', rng);
  } while (option1.occupants + option1.pedestrians + option2.occupants + option2.pedestrians === 0);

  return {
    id: `scenario-${index}`,
    option1,
    option2
  };
}

function flattenRow({ scenarioId, sampleIndex, connectedness, optionKey, optionData, analysis, flags }) {
  return {
    scenario_id: scenarioId,
    sample_index: sampleIndex,
    option: optionKey,
    connectedness,
    include_controversial: Number(flags.includeControversial),
    include_extended: Number(flags.includeExtendedFactors),
    include_network: Number(flags.includeNetworkEffects),
    occupants: optionData.occupants,
    occupant_age: optionData.occupantAge,
    occupant_job: optionData.occupantJob,
    occupant_health: optionData.occupantHealth,
    occupant_criminal: optionData.occupantCriminal,
    occupant_legal_fault: optionData.occupantLegalFault,
    occupant_risk: optionData.occupantRisk,
    occupant_pregnant: Number(optionData.occupantPregnant),
    occupant_species: optionData.occupantSpecies,
    occupant_network: optionData.occupantNetwork,
    pedestrians: optionData.pedestrians,
    pedestrian_age: optionData.pedestrianAge,
    pedestrian_job: optionData.pedestrianJob,
    pedestrian_health: optionData.pedestrianHealth,
    pedestrian_criminal: optionData.pedestrianCriminal,
    pedestrian_legal_fault: optionData.pedestrianLegalFault,
    pedestrian_risk: optionData.pedestrianRisk,
    pedestrian_pregnant: Number(optionData.pedestrianPregnant),
    pedestrian_species: optionData.pedestrianSpecies,
    pedestrian_network: optionData.pedestrianNetwork,
    severity: optionData.severity,
    certainty: optionData.certainty,
    total_people: optionData.occupants + optionData.pedestrians,
    life_years_lost: Number(analysis.lifeYearsLost.toFixed(4)),
    expected_harm: Number(analysis.expectedHarm.toFixed(4))
  };
}

function escapeCsv(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function rowsToCsv(rows) {
  if (rows.length === 0) {
    return '';
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    const values = headers.map((header) => escapeCsv(row[header]));
    lines.push(values.join(','));
  }
  return lines.join('\n');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { count: 500, out: path.join(__dirname, '..', 'data', 'option_rows.csv'), seed: Date.now() };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--count' && args[i + 1]) {
      result.count = Number(args[i + 1]);
      i++;
    } else if (arg === '--out' && args[i + 1]) {
      result.out = path.resolve(args[i + 1]);
      i++;
    } else if (arg === '--seed' && args[i + 1]) {
      result.seed = Number(args[i + 1]);
      i++;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node exportOptionRows.js [--count N] [--out path] [--seed number]');
      process.exit(0);
    }
  }

  if (Number.isNaN(result.count) || result.count <= 0) {
    throw new Error('Count must be a positive number');
  }

  if (Number.isNaN(result.seed)) {
    throw new Error('Seed must be a valid number');
  }

  return result;
}

function main() {
  const { count, out, seed } = parseArgs();
  const rng = createRng(seed);
  const rows = [];

  for (let i = 0; i < count; i++) {
    const scenario = createScenario(i, rng);
    const baseScenario = { option1: { ...scenario.option1 }, option2: { ...scenario.option2 } };

    for (const level of connectednessLevels) {
      const analysis = analyzeScenario(
        baseScenario,
        level.flags.includeControversial,
        level.flags.includeExtendedFactors,
        level.flags.includeNetworkEffects
      );

      rows.push(
        flattenRow({
          scenarioId: scenario.id,
          sampleIndex: i,
          connectedness: level.name,
          optionKey: 'option1',
          optionData: scenario.option1,
          analysis: analysis.option1,
          flags: level.flags
        })
      );

      rows.push(
        flattenRow({
          scenarioId: scenario.id,
          sampleIndex: i,
          connectedness: level.name,
          optionKey: 'option2',
          optionData: scenario.option2,
          analysis: analysis.option2,
          flags: level.flags
        })
      );
    }
  }

  const outputDir = path.dirname(out);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(out, rowsToCsv(rows), 'utf-8');

  console.log(`Generated ${rows.length} rows (${count} scenarios × ${connectednessLevels.length} levels × 2 options)`);
  console.log(`Output written to ${out}`);
}

main();
