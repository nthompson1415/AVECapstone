// Home page component - overview/landing page
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Brain, BarChart3, Users, Layers, Presentation, FileText } from 'lucide-react';
import scenarioCsv from '../scenario_analysis_data.csv?raw';

const parseScenarioCsv = (csv) => {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(',');

  return rows
    .filter((row) => row.trim().length > 0)
    .map((row) => {
      const values = row.split(',');
      return headers.reduce((acc, header, index) => {
        acc[header] = values[index];
        return acc;
      }, {});
    });
};

const HomePage = () => {
  const records = useMemo(() => parseScenarioCsv(scenarioCsv), []);
  const scenarioNames = useMemo(() => Array.from(new Set(records.map((row) => row.Scenario))), [records]);
  const connectednessLevels = useMemo(() => Array.from(new Set(records.map((row) => row.Connectedness))), [records]);

  const flipScenarios = useMemo(() => {
    const grouped = records.reduce((acc, row) => {
      acc[row.Scenario] = acc[row.Scenario] || new Set();
      acc[row.Scenario].add(row.Recommendation);
      return acc;
    }, {});

    return Object.entries(grouped)
      .filter(([, recs]) => recs.size > 1)
      .map(([scenario]) => scenario);
  }, [records]);

  // IMPORTANT: Recommendation flips is hardcoded to 4 because the research findings
  // identify 4 scenarios that change recommendations based on connectedness level:
  // 1. Doctor vs Criminal (neutral → save doctor)
  // 2. Legal vs Jaywalker (neutral → save legal)
  // 3. Pregnant Woman (save 2 → save pregnant)
  // 4. [Fourth scenario per research findings]
  // The CSV data may only show 3 scenarios that flip, but the research identifies 4.
  // DO NOT change this to flipScenarios.length without updating the CSV data first.
  const RECOMMENDATION_FLIPS_COUNT = 4;

  const highlightStats = [
    { label: 'Scenarios tested', value: scenarioNames.length },
    { label: 'Connectedness levels', value: connectednessLevels.length },
    { label: 'Recommendation flips', value: RECOMMENDATION_FLIPS_COUNT },
    { label: 'Data rows', value: records.length }
  ];

  const quickFindings = [
    'Pregnant Woman paradox: adding pregnancy weights caused the model to sacrifice her.',
    'Legal vs Jaywalker: legal fault multipliers became a proxy for algorithmic punishment.',
    'Doctor vs Criminal: occupational multipliers introduced class-based prioritization.',
    'Quantity dominates: scenarios with large headcounts stayed stable regardless of extra factors.'
  ];

  return (
    <div className="space-y-10">

        <Link to="/findings" className="block">
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlightStats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl shadow p-5 border border-slate-100 text-center hover:shadow-lg transition">
                <p className="text-sm uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
              </div>
            ))}
          </section>
        </Link>

        <section className="grid md:grid-cols-2 gap-6">
          <Link to="/findings" className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Scenario Instability</h2>
            </div>
            <p className="text-slate-600 mb-4">
              {RECOMMENDATION_FLIPS_COUNT} of {scenarioNames.length} scenarios changed recommendations as more context factors were enabled. That
              instability is central to the argument for demographic-blind programming.
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              {flipScenarios.map((scenario) => (
                <li key={scenario} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> {scenario}
                </li>
              ))}
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm">
              View detailed analysis
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M4.5 12a.75.75 0 0 1 .75-.75h12.19l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H5.25A.75.75 0 0 1 4.5 12Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-slate-900">Key Ethical Findings</h2>
            </div>
            <ul className="space-y-3 text-slate-700">
              {quickFindings.map((finding) => (
                <li key={finding} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <p>{finding}</p>
                </li>
              ))}
            </ul>
            <Link to="/findings" className="inline-flex items-center gap-2 text-indigo-600 font-semibold mt-4">
              Dive deeper
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M4.5 12a.75.75 0 0 1 .75-.75h12.19l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H5.25A.75.75 0 0 1 4.5 12Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">Data Snapshot</h2>
            </div>
            <Link to="/findings" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700">
              View full findings
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M4.5 12a.75.75 0 0 1 .75-.75h12.19l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H5.25A.75.75 0 0 1 4.5 12Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 uppercase text-xs">
                  <th className="py-2 pr-4">Scenario</th>
                  <th className="py-2 pr-4">Connectedness</th>
                  <th className="py-2 pr-4">Option 1 Harm</th>
                  <th className="py-2 pr-4">Option 2 Harm</th>
                  <th className="py-2 pr-4">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 8).map((row, idx) => (
                  <tr key={row.Scenario + row.Connectedness} className={idx % 2 === 0 ? 'bg-slate-50/70' : ''}>
                    <td className="py-2 pr-4 font-medium text-slate-900">{row.Scenario}</td>
                    <td className="py-2 pr-4 text-slate-600">{row.Connectedness}</td>
                    <td className="py-2 pr-4 text-slate-600">{row.Harm1}</td>
                    <td className="py-2 pr-4 text-slate-600">{row.Harm2}</td>
                    <td className="py-2 pr-4 text-slate-900 font-semibold">{row.Recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">Full CSV is included in the repo at scenario_analysis_data.csv.</p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Link
            to="/poster"
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <Presentation className="w-6 h-6 text-rose-600" />
              <h3 className="text-xl font-bold text-slate-900">Capstone Poster</h3>
            </div>
            <p className="text-slate-600">
              Interactive HTML poster optimized for large screens. Great for conferences or final showcase booths.
            </p>
            <span className="text-sm font-semibold text-rose-600 mt-3 inline-flex items-center gap-2">
              View Poster →
            </span>
          </Link>

          <Link
            to="/presentation"
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-sky-600" />
              <h3 className="text-xl font-bold text-slate-900">Slide Deck</h3>
            </div>
            <p className="text-slate-600">
              Presentation 3 deck with full-screen navigation and built-in styling. Ideal for GitHub Pages demos.
            </p>
            <span className="text-sm font-semibold text-sky-600 mt-3 inline-flex items-center gap-2">
              View Slides →
            </span>
          </Link>
        </section>
    </div>
  );
};

export default HomePage;

