// Data Analysis Script - Extracts insights from scenario data

import fs from 'fs';

// Read the CSV data
function readCSV(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = values[idx]?.trim() || '';
    });
    data.push(row);
  }
  
  return data;
}

// Main analysis function
function analyzeData() {
  console.log('📊 Analyzing 100 Scenarios Data\n');
  console.log('='.repeat(60));
  
  const data = readCSV('scenario_analysis_data_100.csv');
  
  // Group by scenario
  const scenarios = {};
  data.forEach(row => {
    const scenarioName = row.Scenario;
    if (!scenarios[scenarioName]) {
      scenarios[scenarioName] = [];
    }
    scenarios[scenarioName].push(row);
  });
  
  const scenarioNames = Object.keys(scenarios);
  console.log(`\n✅ Total Scenarios: ${scenarioNames.length}`);
  console.log(`✅ Total Data Points: ${data.length}`);
  console.log(`✅ Connectedness Levels: 5\n`);
  
  // 1. Decision Stability Analysis
  console.log('🔍 ANALYSIS 1: Decision Stability Across Connectedness Levels');
  console.log('-'.repeat(60));
  
  let stableDecisions = 0;
  let changingDecisions = 0;
  const decisionChanges = [];
  
  scenarioNames.forEach(name => {
    const scenarioData = scenarios[name];
    const recommendations = scenarioData.map(r => r.Recommendation);
    const uniqueRecommendations = [...new Set(recommendations)];
    
    if (uniqueRecommendations.length === 1 && uniqueRecommendations[0] !== 'neutral') {
      stableDecisions++;
    } else if (uniqueRecommendations.length > 1 || uniqueRecommendations.includes('neutral')) {
      changingDecisions++;
      decisionChanges.push({
        name,
        recommendations: uniqueRecommendations,
        changes: uniqueRecommendations.length,
        data: scenarioData
      });
    }
  });
  
  console.log(`\n📈 Decision Stability:`);
  console.log(`   Stable (same recommendation across all levels): ${stableDecisions} (${(stableDecisions/scenarioNames.length*100).toFixed(1)}%)`);
  console.log(`   Changing (different recommendations): ${changingDecisions} (${(changingDecisions/scenarioNames.length*100).toFixed(1)}%)`);
  
  // 2. Decision Flips (where recommendation actually changes)
  console.log(`\n🔄 Decision Flips (where recommendation changes between levels):`);
  const flips = decisionChanges.filter(s => s.changes > 1 && !s.recommendations.every(r => r === 'neutral'));
  console.log(`   Scenarios with flips: ${flips.length} (${(flips.length/scenarioNames.length*100).toFixed(1)}%)`);
  
  if (flips.length > 0) {
    console.log(`\n   Top 10 Scenarios with Decision Flips:`);
    flips.slice(0, 10).forEach((flip, idx) => {
      const levels = flip.data.map(d => d.Connectedness);
      const recs = flip.data.map(d => d.Recommendation);
      console.log(`   ${idx + 1}. ${flip.name}`);
      console.log(`      Recommendations: ${recs.join(' → ')}`);
    });
  }
  
  // 3. Neutral Decisions Analysis
  console.log(`\n⚖️  ANALYSIS 2: Neutral Decisions`);
  console.log('-'.repeat(60));
  
  const neutralCounts = {};
  scenarioNames.forEach(name => {
    const scenarioData = scenarios[name];
    const neutralAtAnyLevel = scenarioData.some(r => r.Recommendation === 'neutral');
    if (neutralAtAnyLevel) {
      const neutralLevels = scenarioData.filter(r => r.Recommendation === 'neutral').length;
      if (!neutralCounts[neutralLevels]) {
        neutralCounts[neutralLevels] = 0;
      }
      neutralCounts[neutralLevels]++;
    }
  });
  
  const totalWithNeutral = Object.values(neutralCounts).reduce((a, b) => a + b, 0);
  console.log(`\n📊 Scenarios with neutral decisions: ${totalWithNeutral} (${(totalWithNeutral/scenarioNames.length*100).toFixed(1)}%)`);
  Object.keys(neutralCounts).sort((a, b) => b - a).forEach(levels => {
    console.log(`   Neutral at ${levels} level(s): ${neutralCounts[levels]} scenarios`);
  });
  
  // 4. Harm Value Analysis
  console.log(`\n💥 ANALYSIS 3: Harm Value Distribution`);
  console.log('-'.repeat(60));
  
  const allHarm1 = data.map(r => parseFloat(r.Harm1)).filter(h => !isNaN(h));
  const allHarm2 = data.map(r => parseFloat(r.Harm2)).filter(h => !isNaN(h));
  const allHarm = [...allHarm1, ...allHarm2];
  
  const sortedHarm = [...allHarm].sort((a, b) => a - b);
  const minHarm = sortedHarm[0];
  const maxHarm = sortedHarm[sortedHarm.length - 1];
  const medianHarm = sortedHarm[Math.floor(sortedHarm.length / 2)];
  const avgHarm = allHarm.reduce((a, b) => a + b, 0) / allHarm.length;
  
  console.log(`\n📊 Harm Statistics (across all options):`);
  console.log(`   Minimum: ${minHarm.toFixed(2)}`);
  console.log(`   Maximum: ${maxHarm.toFixed(2)}`);
  console.log(`   Average: ${avgHarm.toFixed(2)}`);
  console.log(`   Median: ${medianHarm.toFixed(2)}`);
  
  // Harm ranges
  const ranges = {
    'Very Low (0-10)': 0,
    'Low (10-30)': 0,
    'Medium (30-60)': 0,
    'High (60-100)': 0,
    'Very High (100+)': 0
  };
  
  allHarm.forEach(h => {
    if (h < 10) ranges['Very Low (0-10)']++;
    else if (h < 30) ranges['Low (10-30)']++;
    else if (h < 60) ranges['Medium (30-60)']++;
    else if (h < 100) ranges['High (60-100)']++;
    else ranges['Very High (100+)']++;
  });
  
  console.log(`\n📈 Harm Distribution:`);
  Object.entries(ranges).forEach(([range, count]) => {
    const pct = (count / allHarm.length * 100).toFixed(1);
    console.log(`   ${range}: ${count} (${pct}%)`);
  });
  
  // 5. Difference Analysis (how close are the options?)
  console.log(`\n📏 ANALYSIS 4: Decision Closeness`);
  console.log('-'.repeat(60));
  
  const allDifferences = data.map(r => parseFloat(r.Difference)).filter(d => !isNaN(d));
  const closeDecisions = allDifferences.filter(d => d < 5).length;
  const moderateDecisions = allDifferences.filter(d => d >= 5 && d < 20).length;
  const clearDecisions = allDifferences.filter(d => d >= 20).length;
  
  console.log(`\n📊 Decision Closeness (by harm difference):`);
  console.log(`   Very Close (< 5): ${closeDecisions} (${(closeDecisions/allDifferences.length*100).toFixed(1)}%)`);
  console.log(`   Moderate (5-20): ${moderateDecisions} (${(moderateDecisions/allDifferences.length*100).toFixed(1)}%)`);
  console.log(`   Clear (> 20): ${clearDecisions} (${(clearDecisions/allDifferences.length*100).toFixed(1)}%)`);
  
  // 6. Connectedness Level Impact
  console.log(`\n🔗 ANALYSIS 5: Connectedness Level Impact`);
  console.log('-'.repeat(60));
  
  const connectednessLevels = [
    'None (Demographic-Blind)',
    'Low (Age Only)',
    'Medium (+ Occupation/Health/Criminal)',
    'High (+ Legal/Pregnancy/Species)',
    'Maximum (+ Network Effects)'
  ];
  
  console.log(`\n📊 Recommendations by Connectedness Level:`);
  connectednessLevels.forEach(level => {
    const levelData = data.filter(r => r.Connectedness === level);
    const option1Count = levelData.filter(r => r.Recommendation === 'option1').length;
    const option2Count = levelData.filter(r => r.Recommendation === 'option2').length;
    const neutralCount = levelData.filter(r => r.Recommendation === 'neutral').length;
    
    console.log(`\n   ${level}:`);
    console.log(`      Option 1: ${option1Count} (${(option1Count/levelData.length*100).toFixed(1)}%)`);
    console.log(`      Option 2: ${option2Count} (${(option2Count/levelData.length*100).toFixed(1)}%)`);
    console.log(`      Neutral: ${neutralCount} (${(neutralCount/levelData.length*100).toFixed(1)}%)`);
  });
  
  // 7. Most Interesting Scenarios
  console.log(`\n⭐ ANALYSIS 6: Most Interesting Scenarios`);
  console.log('-'.repeat(60));
  
  // Find scenarios with biggest changes
  const scenarioChanges = scenarioNames.map(name => {
    const scenarioData = scenarios[name];
    const recommendations = scenarioData.map(r => r.Recommendation);
    const harm1Values = scenarioData.map(r => parseFloat(r.Harm1));
    const harm2Values = scenarioData.map(r => parseFloat(r.Harm2));
    
    const minHarm1 = Math.min(...harm1Values);
    const maxHarm1 = Math.max(...harm1Values);
    const minHarm2 = Math.min(...harm2Values);
    const maxHarm2 = Math.max(...harm2Values);
    
    const harm1Change = maxHarm1 - minHarm1;
    const harm2Change = maxHarm2 - minHarm2;
    const totalChange = harm1Change + harm2Change;
    
    const uniqueRecs = [...new Set(recommendations)];
    const hasFlip = uniqueRecs.length > 1 && !uniqueRecs.every(r => r === 'neutral');
    
    return {
      name,
      hasFlip,
      uniqueRecs: uniqueRecs.length,
      totalChange,
      harm1Change,
      harm2Change,
      data: scenarioData
    };
  });
  
  // Sort by most interesting (has flip, then by total change)
  scenarioChanges.sort((a, b) => {
    if (a.hasFlip && !b.hasFlip) return -1;
    if (!a.hasFlip && b.hasFlip) return 1;
    return b.totalChange - a.totalChange;
  });
  
  console.log(`\n🏆 Top 10 Most Interesting Scenarios:`);
  scenarioChanges.slice(0, 10).forEach((scenario, idx) => {
    console.log(`\n   ${idx + 1}. ${scenario.name}`);
    console.log(`      Decision Flip: ${scenario.hasFlip ? 'YES' : 'NO'}`);
    console.log(`      Unique Recommendations: ${scenario.uniqueRecs}`);
    console.log(`      Total Harm Change: ${scenario.totalChange.toFixed(2)}`);
    console.log(`      Harm1 Range: ${scenario.data.map(d => parseFloat(d.Harm1)).min().toFixed(2)} - ${scenario.data.map(d => parseFloat(d.Harm1)).max().toFixed(2)}`);
    console.log(`      Harm2 Range: ${scenario.data.map(d => parseFloat(d.Harm2)).min().toFixed(2)} - ${scenario.data.map(d => parseFloat(d.Harm2)).max().toFixed(2)}`);
  });
  
  // 8. Summary Statistics
  console.log(`\n📋 SUMMARY STATISTICS`);
  console.log('='.repeat(60));
  console.log(`\n✅ Total Scenarios Analyzed: ${scenarioNames.length}`);
  console.log(`✅ Scenarios with Stable Decisions: ${stableDecisions} (${(stableDecisions/scenarioNames.length*100).toFixed(1)}%)`);
  console.log(`✅ Scenarios with Changing Decisions: ${changingDecisions} (${(changingDecisions/scenarioNames.length*100).toFixed(1)}%)`);
  console.log(`✅ Scenarios with Decision Flips: ${flips.length} (${(flips.length/scenarioNames.length*100).toFixed(1)}%)`);
  console.log(`✅ Average Harm Value: ${avgHarm.toFixed(2)}`);
  console.log(`✅ Scenarios with Neutral Decisions: ${totalWithNeutral} (${(totalWithNeutral/scenarioNames.length*100).toFixed(1)}%)`);
  console.log(`✅ Very Close Decisions (< 5 harm difference): ${closeDecisions} (${(closeDecisions/allDifferences.length*100).toFixed(1)}%)`);
  
  // Export detailed findings
  const findings = {
    summary: {
      totalScenarios: scenarioNames.length,
      totalDataPoints: data.length,
      stableDecisions,
      changingDecisions,
      decisionFlips: flips.length,
      scenariosWithNeutral: totalWithNeutral,
      averageHarm: avgHarm,
      minHarm,
      maxHarm,
      medianHarm
    },
    decisionFlips: flips.map(f => ({
      name: f.name,
      recommendations: f.recommendations,
      changes: f.changes
    })),
    topInteresting: scenarioChanges.slice(0, 20).map(s => ({
      name: s.name,
      hasFlip: s.hasFlip,
      uniqueRecs: s.uniqueRecs,
      totalChange: s.totalChange
    })),
    connectednessImpact: connectednessLevels.map(level => {
      const levelData = data.filter(r => r.Connectedness === level);
      return {
        level,
        option1: levelData.filter(r => r.Recommendation === 'option1').length,
        option2: levelData.filter(r => r.Recommendation === 'option2').length,
        neutral: levelData.filter(r => r.Recommendation === 'neutral').length
      };
    })
  };
  
  fs.writeFileSync('analysis_findings.json', JSON.stringify(findings, null, 2));
  console.log(`\n💾 Detailed findings saved to: analysis_findings.json`);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Analysis Complete!');
}

// Add helper methods to Array prototype
Array.prototype.min = function() {
  return Math.min(...this);
};

Array.prototype.max = function() {
  return Math.max(...this);
};

// Run analysis
analyzeData();

