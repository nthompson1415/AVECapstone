import { InferenceSession, Tensor } from 'onnxruntime-web';
import { calculateLifeYears } from '../utils/ethicsMath';

let encoderPromise;
let sessionPromise;

const MODEL_PATH = '/models/option_scorer.onnx';
const ENCODER_PATH = '/models/encoder.json';

const CONNECTEDNESS_LABELS = {
  none: 'None (Demographic-Blind)',
  low: 'Low (Age Only)',
  medium: 'Medium (+ Occupation/Health/Criminal)',
  high: 'High (+ Legal/Pregnancy/Species)',
  max: 'Maximum (+ Network Effects)'
};

const DEFAULT_CONNECTEDNESS = 'Custom';

async function loadEncoder() {
  if (!encoderPromise) {
    encoderPromise = fetch(ENCODER_PATH).then((res) => {
      if (!res.ok) throw new Error('Failed to load encoder metadata');
      return res.json();
    });
  }
  return encoderPromise;
}

async function loadSession() {
  if (!sessionPromise) {
    sessionPromise = InferenceSession.create(MODEL_PATH, {
      executionProviders: ['wasm']
    });
  }
  return sessionPromise;
}

function deriveConnectednessLabel(flags) {
  if (!flags.includeControversial && !flags.includeExtendedFactors && !flags.includeNetworkEffects) {
    return CONNECTEDNESS_LABELS.none;
  }
  if (flags.includeControversial && !flags.includeExtendedFactors && !flags.includeNetworkEffects) {
    return CONNECTEDNESS_LABELS.medium;
  }
  if (flags.includeControversial && flags.includeExtendedFactors && !flags.includeNetworkEffects) {
    return CONNECTEDNESS_LABELS.high;
  }
  if (flags.includeControversial && flags.includeExtendedFactors && flags.includeNetworkEffects) {
    return CONNECTEDNESS_LABELS.max;
  }
  return DEFAULT_CONNECTEDNESS;
}

function boolToNumber(value) {
  return value ? 1 : 0;
}

function getNumericValue(option, flags, feature) {
  switch (feature) {
    case 'include_controversial':
      return flags.includeControversial ? 1 : 0;
    case 'include_extended':
      return flags.includeExtendedFactors ? 1 : 0;
    case 'include_network':
      return flags.includeNetworkEffects ? 1 : 0;
    case 'occupants':
      return option.occupants ?? 0;
    case 'occupant_age':
      return option.occupantAge ?? 0;
    case 'occupant_pregnant':
      return boolToNumber(option.occupantPregnant);
    case 'pedestrians':
      return option.pedestrians ?? 0;
    case 'pedestrian_age':
      return option.pedestrianAge ?? 0;
    case 'pedestrian_pregnant':
      return boolToNumber(option.pedestrianPregnant);
    case 'certainty':
      return option.certainty ?? 0;
    case 'total_people':
      return (option.occupants ?? 0) + (option.pedestrians ?? 0);
    case 'life_years_lost':
      return computeLifeYearsLost(option, flags);
    default:
      return 0;
  }
}

function getCategoricalValue(option, flags, optionKey, feature) {
  const mapping = {
    option: optionKey,
    connectedness: deriveConnectednessLabel(flags),
    occupant_job: option.occupantJob,
    occupant_health: option.occupantHealth,
    occupant_criminal: option.occupantCriminal,
    occupant_legal_fault: option.occupantLegalFault,
    occupant_risk: option.occupantRisk,
    occupant_species: option.occupantSpecies,
    occupant_network: option.occupantNetwork,
    pedestrian_job: option.pedestrianJob,
    pedestrian_health: option.pedestrianHealth,
    pedestrian_criminal: option.pedestrianCriminal,
    pedestrian_legal_fault: option.pedestrianLegalFault,
    pedestrian_risk: option.pedestrianRisk,
    pedestrian_species: option.pedestrianSpecies,
    pedestrian_network: option.pedestrianNetwork,
    severity: option.severity
  };

  return mapping[feature] ?? null;
}

function normalizeValue(value, mean, scale) {
  if (scale === 0) {
    return value - mean;
  }
  return (value - mean) / scale;
}

function computeLifeYearsLost(option, flags) {
  let total = 0;
  const config = {
    includeControversial: flags.includeControversial,
    includeExtendedFactors: flags.includeExtendedFactors,
    includeNetworkEffects: flags.includeNetworkEffects
  };

  if (option.occupants > 0) {
    const lifeYears = calculateLifeYears(
      {
        age: option.occupantAge,
        severity: option.severity,
        job: option.occupantJob,
        health: option.occupantHealth,
        criminal: option.occupantCriminal,
        legalFault: option.occupantLegalFault,
        risk: option.occupantRisk,
        pregnant: option.occupantPregnant,
        species: option.occupantSpecies,
        network: option.occupantNetwork
      },
      config
    );
    total += option.occupants * lifeYears;
  }

  if (option.pedestrians > 0) {
    const lifeYears = calculateLifeYears(
      {
        age: option.pedestrianAge,
        severity: option.severity,
        job: option.pedestrianJob,
        health: option.pedestrianHealth,
        criminal: option.pedestrianCriminal,
        legalFault: option.pedestrianLegalFault,
        risk: option.pedestrianRisk,
        pregnant: option.pedestrianPregnant,
        species: option.pedestrianSpecies,
        network: option.pedestrianNetwork
      },
      config
    );
    total += option.pedestrians * lifeYears;
  }

  return total;
}

function buildFeatureVector(option, flags, optionKey, encoder) {
  const vector = [];
  const numeric = encoder.numeric || {};
  const categorical = encoder.categorical || [];

  numeric.features.forEach((feature, idx) => {
    const rawValue = getNumericValue(option, flags, feature);
    const mean = numeric.mean[idx] ?? 0;
    const scale = numeric.scale[idx] ?? 1;
    vector.push(normalizeValue(rawValue, mean, scale));
  });

  categorical.forEach(({ feature, categories }) => {
    const value = getCategoricalValue(option, flags, optionKey, feature);
    categories.forEach((category) => {
      vector.push(value === category ? 1 : 0);
    });
  });

  return new Float32Array(vector);
}

export async function scoreOption(option, flags, optionKey) {
  const [encoder, session] = await Promise.all([loadEncoder(), loadSession()]);
  const features = buildFeatureVector(option, flags, optionKey, encoder);
  const tensor = new Tensor('float32', features, [1, features.length]);
  const output = await session.run({ features: tensor });
  const prediction = output.expected_harm;
  if (!prediction) {
    throw new Error('Model output missing expected_harm tensor');
  }
  return prediction.data[0];
}
