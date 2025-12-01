import React, { useState } from 'react';
import { Brain, Sliders, Play, RotateCcw, Download, Upload, TrendingUp, Users } from 'lucide-react';

const PersonalEthicsCalibrator = () => {
  const [step, setStep] = useState('survey'); // 'survey' or 'analysis'
  const [surveyComplete, setSurveyComplete] = useState(false);
  
  // User's personal weights (1-10 scale, will be normalized)
  const [weights, setWeights] = useState({
    age: 5,
    health: 5,
    occupation: 5,
    criminal: 5,
    legalFault: 5,
    pregnancy: 5,
    network: 5,
    species: 5,
    numberOfPeople: 8,
    certainty: 7
  });

  // Scenario inputs
  const [scenario, setScenario] = useState({
    option1: {
      name: 'Option A',
      people: 1,
      age: 35,
      occupation: 'average',
      health: 'healthy',
      criminal: 'none',
      legalFault: 'legal',
      pregnant: false,
      species: 'human',
      network: 'none',
      certainty: 90,
      severity: 'fatal'
    },
    option2: {
      name: 'Option B',
      people: 5,
      age: 70,
      occupation: 'average',
      health: 'healthy',
      criminal: 'none',
      legalFault: 'legal',
      pregnant: false,
      species: 'human',
      network: 'none',
      certainty: 90,
      severity: 'fatal'
    }
  });

  const [result, setResult] = useState(null);

  // Mapping values to multipliers based on user's importance rating
  const calculateMultiplier = (factor, value, importance) => {
    if (importance <= 2) return 1.0; // Factor doesn't matter much to user
    
    const impactScale = importance / 10; // 0.1 to 1.0
    
    switch(factor) {
      case 'age':
        // Younger = more years remaining
        const remainingYears = Math.max(0, 78 - value);
        return 1 + (remainingYears / 78 - 0.5) * impactScale;
      
      case 'occupation':
        const occValues = {
          unemployed: 0.9,
          average: 1.0,
          skilled: 1.1,
          professional: 1.2,
          lifesaving: 1.4,
          researcher: 1.3
        };
        const baseOcc = occValues[value] || 1.0;
        return 1 + (baseOcc - 1) * impactScale;
      
      case 'health':
        const healthValues = {
          terminal: 0.5,
          chronic: 0.75,
          healthy: 1.0
        };
        const baseHealth = healthValues[value] || 1.0;
        return 1 + (baseHealth - 1) * impactScale;
      
      case 'criminal':
        const crimValues = {
          none: 1.0,
          minor: 0.95,
          violent: 0.85,
          active: 0.6
        };
        const baseCrim = crimValues[value] || 1.0;
        return 1 + (baseCrim - 1) * impactScale;
      
      case 'legalFault':
        const faultValues = {
          legal: 1.0,
          minor: 0.95,
          jaywalking: 0.9,
          reckless: 0.8,
          fleeing: 0.7
        };
        const baseFault = faultValues[value] || 1.0;
        return 1 + (baseFault - 1) * impactScale;
      
      case 'pregnancy':
        return value ? 1 + (0.8 * impactScale) : 1.0;
      
      case 'species':
        const speciesValues = {
          human: 1.0,
          pet: 0.2,
          livestock: 0.1
        };
        const baseSpecies = speciesValues[value] || 1.0;
        return 1 + (baseSpecies - 1) * impactScale;
      
      case 'network':
        const networkValues = {
          none: 1.0,
          partner: 1.1,
          parent: 1.2,
          soleParent: 1.4,
          caregiver: 1.3
        };
        const baseNetwork = networkValues[value] || 1.0;
        return 1 + (baseNetwork - 1) * impactScale;
      
      default:
        return 1.0;
    }
  };

  const calculateValue = (option) => {
    const age = option.age;
    const remainingYears = Math.max(0, 78 - age);
    
    // Severity multiplier (always applied)
    const severityMult = option.severity === 'fatal' ? 1.0 : 
                         option.severity === 'critical' ? 0.8 :
                         option.severity === 'serious' ? 0.5 : 0.2;
    
    let baseValue = remainingYears * severityMult;
    
    // Apply user's custom weights
    baseValue *= calculateMultiplier('age', age, weights.age);
    baseValue *= calculateMultiplier('occupation', option.occupation, weights.occupation);
    baseValue *= calculateMultiplier('health', option.health, weights.health);
    baseValue *= calculateMultiplier('criminal', option.criminal, weights.criminal);
    baseValue *= calculateMultiplier('legalFault', option.legalFault, weights.legalFault);
    baseValue *= calculateMultiplier('pregnancy', option.pregnant, weights.pregnancy);
    baseValue *= calculateMultiplier('species', option.species, weights.species);
    baseValue *= calculateMultiplier('network', option.network, weights.network);
    
    // Number of people factor
    const peopleWeight = 1 + ((weights.numberOfPeople - 5) / 10);
    baseValue *= Math.pow(option.people, peopleWeight);
    
    // Certainty factor
    const certaintyWeight = weights.certainty / 10;
    const certaintyFactor = 1 - ((100 - option.certainty) / 100) * certaintyWeight;
    baseValue *= certaintyFactor;
    
    return baseValue;
  };

  const analyzeScenario = () => {
    const value1 = calculateValue(scenario.option1);
    const value2 = calculateValue(scenario.option2);
    
    const total = value1 + value2;
    const score1 = total > 0 ? (value1 / total) * 100 : 50;
    const score2 = total > 0 ? (value2 / total) * 100 : 50;
    
    let recommendation = 'neutral';
    if (Math.abs(score1 - score2) < 5) {
      recommendation = 'neutral';
    } else if (value1 < value2) {
      recommendation = 'option1'; // Less harm in option 1
    } else {
      recommendation = 'option2';
    }
    
    setResult({
      value1,
      value2,
      score1,
      score2,
      recommendation
    });
  };

  const resetWeights = () => {
    setWeights({
      age: 5,
      health: 5,
      occupation: 5,
      criminal: 5,
      legalFault: 5,
      pregnancy: 5,
      network: 5,
      species: 5,
      numberOfPeople: 8,
      certainty: 7
    });
    setSurveyComplete(false);
  };

  const exportWeights = () => {
    const data = {
      weights,
      timestamp: new Date().toISOString(),
      type: 'personal-ethics-weights'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-ethics-weights-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importWeights = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.weights) {
            setWeights(data.weights);
            setSurveyComplete(true);
            alert('Weights imported successfully!');
          }
        } catch (error) {
          alert('Error loading weights file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const SurveyQuestion = ({ title, description, value, onChange, examples }) => (
    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      {examples && (
        <div className="text-xs text-gray-500 mb-3 italic">
          Examples: {examples}
        </div>
      )}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 w-32">Not Important</span>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-medium text-gray-700 w-32 text-right">Very Important</span>
      </div>
      <div className="text-center mt-2">
        <span className="text-2xl font-bold text-indigo-600">{value}/10</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sliders className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Personal Ethics Calibrator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Define your own moral values by rating how important different factors are to you. 
            Then analyze scenarios using your personalized ethical framework.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setStep('survey')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              step === 'survey'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Sliders className="w-4 h-4 inline mr-2" />
            Value Survey
          </button>
          <button
            onClick={() => {
              if (!surveyComplete) {
                alert('Please complete the survey first!');
                return;
              }
              setStep('analysis');
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              step === 'analysis'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Analyze Scenarios
          </button>
        </div>

        {step === 'survey' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong> Rate each factor from 1-10 based on how important it is in your moral decision-making.
                1 = "This should have no influence on the decision" and 10 = "This is critically important to consider."
              </p>
            </div>

            <SurveyQuestion
              title="Age / Remaining Life Years"
              description="Should younger people (with more life years ahead) be prioritized?"
              value={weights.age}
              onChange={(v) => setWeights({...weights, age: v})}
              examples="A 20-year-old has ~58 years left vs. a 70-year-old has ~8 years"
            />

            <SurveyQuestion
              title="Number of People"
              description="Should we always save the greater number, or are there limits to this?"
              value={weights.numberOfPeople}
              onChange={(v) => setWeights({...weights, numberOfPeople: v})}
              examples="Save 5 people vs. 1 person"
            />

            <SurveyQuestion
              title="Health Status"
              description="Should someone's health condition affect their priority?"
              value={weights.health}
              onChange={(v) => setWeights({...weights, health: v})}
              examples="Terminal illness vs. chronic condition vs. healthy"
            />

            <SurveyQuestion
              title="Occupation / Social Contribution"
              description="Should someone's job or social role matter?"
              value={weights.occupation}
              onChange={(v) => setWeights({...weights, occupation: v})}
              examples="Doctor, teacher, unemployed, researcher"
            />

            <SurveyQuestion
              title="Legal Responsibility"
              description="Should someone who broke traffic laws have lower priority?"
              value={weights.legalFault}
              onChange={(v) => setWeights({...weights, legalFault: v})}
              examples="Jaywalking, DUI, fleeing crime scene"
            />

            <SurveyQuestion
              title="Criminal History"
              description="Should past crimes affect someone's value in this scenario?"
              value={weights.criminal}
              onChange={(v) => setWeights({...weights, criminal: v})}
              examples="No history, minor offenses, violent crimes"
            />

            <SurveyQuestion
              title="Pregnancy"
              description="Should pregnancy (representing two lives) be weighted differently?"
              value={weights.pregnancy}
              onChange={(v) => setWeights({...weights, pregnancy: v})}
              examples="Pregnant vs. not pregnant"
            />

            <SurveyQuestion
              title="Dependents / Network Effects"
              description="Should we consider who depends on this person?"
              value={weights.network}
              onChange={(v) => setWeights({...weights, network: v})}
              examples="Sole parent, primary caregiver, sole provider"
            />

            <SurveyQuestion
              title="Species"
              description="Should non-human animals be valued differently?"
              value={weights.species}
              onChange={(v) => setWeights({...weights, species: v})}
              examples="Human vs. pet dog vs. livestock"
            />

            <SurveyQuestion
              title="Outcome Certainty"
              description="How much should uncertainty reduce the weight of an outcome?"
              value={weights.certainty}
              onChange={(v) => setWeights({...weights, certainty: v})}
              examples="50% chance of death vs. 100% certain death"
            />

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setSurveyComplete(true)}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Complete Survey & Start Analysis
              </button>
              <button
                onClick={resetWeights}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset to Defaults
              </button>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={exportWeights}
                className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export My Values
              </button>
              <label className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Values
                <input
                  type="file"
                  accept=".json"
                  onChange={importWeights}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {step === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Your Ethics Profile:</strong> Decisions will be made according to your personal values. 
                You can adjust scenarios below to see what you would choose in different situations.
              </p>
            </div>

            {/* Scenario Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Option 1 */}
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
                <input
                  type="text"
                  value={scenario.option1.name}
                  onChange={(e) => setScenario({
                    ...scenario,
                    option1: {...scenario.option1, name: e.target.value}
                  })}
                  className="text-xl font-bold mb-4 w-full border-b-2 border-blue-300 focus:border-blue-500 outline-none pb-2"
                />

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
                    <input
                      type="number"
                      min="0"
                      value={scenario.option1.people}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, people: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Age</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scenario.option1.age}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, age: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <select
                      value={scenario.option1.occupation}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, occupation: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="unemployed">Unemployed</option>
                      <option value="average">Average Worker</option>
                      <option value="skilled">Skilled Worker</option>
                      <option value="professional">Professional</option>
                      <option value="lifesaving">Lifesaving (Doctor, Firefighter)</option>
                      <option value="researcher">Researcher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
                    <select
                      value={scenario.option1.health}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, health: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="healthy">Healthy</option>
                      <option value="chronic">Chronic Condition</option>
                      <option value="terminal">Terminal Illness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal Status</label>
                    <select
                      value={scenario.option1.legalFault}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, legalFault: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="legal">Following Laws</option>
                      <option value="minor">Minor Violation</option>
                      <option value="jaywalking">Jaywalking</option>
                      <option value="reckless">Reckless Behavior</option>
                      <option value="fleeing">Fleeing Crime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Criminal History</label>
                    <select
                      value={scenario.option1.criminal}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, criminal: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="none">No History</option>
                      <option value="minor">Minor Offenses</option>
                      <option value="violent">Violent Offenses</option>
                      <option value="active">Currently Committing Crime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy</label>
                    <select
                      value={scenario.option1.pregnant}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, pregnant: e.target.value === 'true'}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="false">Not Pregnant</option>
                      <option value="true">Pregnant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dependents</label>
                    <select
                      value={scenario.option1.network}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, network: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="none">None</option>
                      <option value="partner">Has Partner</option>
                      <option value="parent">Parent</option>
                      <option value="soleParent">Sole Parent</option>
                      <option value="caregiver">Primary Caregiver</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                    <select
                      value={scenario.option1.species}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, species: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="human">Human</option>
                      <option value="pet">Pet</option>
                      <option value="livestock">Livestock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      value={scenario.option1.severity}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, severity: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="minor">Minor Injury</option>
                      <option value="serious">Serious Injury</option>
                      <option value="critical">Critical Injury</option>
                      <option value="fatal">Fatal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certainty: {scenario.option1.certainty}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scenario.option1.certainty}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option1: {...scenario.option1, certainty: parseInt(e.target.value)}
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200">
                <input
                  type="text"
                  value={scenario.option2.name}
                  onChange={(e) => setScenario({
                    ...scenario,
                    option2: {...scenario.option2, name: e.target.value}
                  })}
                  className="text-xl font-bold mb-4 w-full border-b-2 border-purple-300 focus:border-purple-500 outline-none pb-2"
                />

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
                    <input
                      type="number"
                      min="0"
                      value={scenario.option2.people}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, people: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Age</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scenario.option2.age}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, age: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <select
                      value={scenario.option2.occupation}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, occupation: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="unemployed">Unemployed</option>
                      <option value="average">Average Worker</option>
                      <option value="skilled">Skilled Worker</option>
                      <option value="professional">Professional</option>
                      <option value="lifesaving">Lifesaving (Doctor, Firefighter)</option>
                      <option value="researcher">Researcher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
                    <select
                      value={scenario.option2.health}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, health: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="healthy">Healthy</option>
                      <option value="chronic">Chronic Condition</option>
                      <option value="terminal">Terminal Illness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal Status</label>
                    <select
                      value={scenario.option2.legalFault}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, legalFault: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="legal">Following Laws</option>
                      <option value="minor">Minor Violation</option>
                      <option value="jaywalking">Jaywalking</option>
                      <option value="reckless">Reckless Behavior</option>
                      <option value="fleeing">Fleeing Crime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Criminal History</label>
                    <select
                      value={scenario.option2.criminal}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, criminal: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="none">No History</option>
                      <option value="minor">Minor Offenses</option>
                      <option value="violent">Violent Offenses</option>
                      <option value="active">Currently Committing Crime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy</label>
                    <select
                      value={scenario.option2.pregnant}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, pregnant: e.target.value === 'true'}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="false">Not Pregnant</option>
                      <option value="true">Pregnant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dependents</label>
                    <select
                      value={scenario.option2.network}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, network: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="none">None</option>
                      <option value="partner">Has Partner</option>
                      <option value="parent">Parent</option>
                      <option value="soleParent">Sole Parent</option>
                      <option value="caregiver">Primary Caregiver</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                    <select
                      value={scenario.option2.species}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, species: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="human">Human</option>
                      <option value="pet">Pet</option>
                      <option value="livestock">Livestock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      value={scenario.option2.severity}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, severity: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="minor">Minor Injury</option>
                      <option value="serious">Serious Injury</option>
                      <option value="critical">Critical Injury</option>
                      <option value="fatal">Fatal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certainty: {scenario.option2.certainty}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scenario.option2.certainty}
                      onChange={(e) => setScenario({
                        ...scenario,
                        option2: {...scenario.option2, certainty: parseInt(e.target.value)}
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={analyzeScenario}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <TrendingUp className="w-5 h-5" />
                Analyze with My Values
              </button>
            </div>

            {result && (
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-200 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Decision
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold mb-2">{scenario.option1.name}</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {result.value1.toFixed(1)} harm points
                    </div>
                    <div className="text-sm text-gray-600">
                      Moral weight based on your values
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold mb-2">{scenario.option2.name}</h3>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {result.value2.toFixed(1)} harm points
                    </div>
                    <div className="text-sm text-gray-600">
                      Moral weight based on your values
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-6 border-2 ${
                  result.recommendation === 'option1' 
                    ? 'bg-blue-100 border-blue-400' 
                    : result.recommendation === 'option2'
                    ? 'bg-purple-100 border-purple-400'
                    : 'bg-gray-100 border-gray-400'
                }`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Your Recommendation
                  </h3>
                  <p className="text-lg">
                    {result.recommendation === 'neutral' 
                      ? 'Both options are roughly equivalent according to your values. This is a true moral dilemma with no clear answer.'
                      : result.recommendation === 'option1'
                      ? `Choose ${scenario.option1.name}. This option causes less harm according to what you value.`
                      : `Choose ${scenario.option2.name}. This option causes less harm according to what you value.`
                    }
                  </p>
                </div>

                <div className="mt-6 bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  <strong>Interpretation:</strong> Lower harm points = better option. The calculation weighs each factor 
                  according to the importance ratings you provided in the survey. Different people with different values 
                  may reach different conclusions on the same scenario.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalEthicsCalibrator;
