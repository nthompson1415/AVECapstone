import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Library, TrendingUp, Users, AlertCircle, BarChart3, FileText, Table } from 'lucide-react';

const FindingsPage = () => {
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    fetch('/AVECapstone/content-data.json')
      .then(res => res.json())
      .then(data => setContentData(data))
      .catch(err => console.error('Failed to load content data:', err));
  }, []);

  if (!contentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Loading findings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-3 mb-6">
            <Library className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Research Findings</h1>
          </div>

          {contentData.researchQuestions && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Research Questions</h2>
              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h3 className="font-semibold mb-2">{contentData.researchQuestions.primary.icon} {contentData.researchQuestions.primary.title}</h3>
                  <p className="text-gray-700">{contentData.researchQuestions.primary.question}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h3 className="font-semibold mb-2">{contentData.researchQuestions.secondary.icon} {contentData.researchQuestions.secondary.title}</h3>
                  <p className="text-gray-700">{contentData.researchQuestions.secondary.question}</p>
                </div>
              </div>
            </section>
          )}

          {contentData.findings && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Key Findings</h2>
              <div className="space-y-4">
                {contentData.findings.map((finding, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-200">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      {finding.icon} {finding.title}
                      {finding.statistic && (
                        <span className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                          {finding.statistic.value} {finding.statistic.label || ''}
                        </span>
                      )}
                    </h3>
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
            </section>
          )}

          {/* Data Analysis Section */}
          <section className="mt-8">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border-2 border-green-300 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Extended Data Analysis</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Explore the complete analysis of 100 unique ethical scenarios across 5 connectedness levels. 
                View the detailed report and interact with the full dataset.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Link
                  to="/data"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                >
                  <BarChart3 className="w-5 h-5" />
                  View Data Analysis
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>100 scenarios × 5 levels = 500 data points</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Additional Data Section - Outside main card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-300">
            <h2 className="text-2xl font-bold mb-4 text-indigo-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Complete Dataset Analysis
            </h2>
            <p className="text-gray-700 mb-4">
              Access the full analysis of 100 unique ethical scenarios with interactive data exploration, 
              detailed reports, and downloadable datasets.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/data"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                <Table className="w-5 h-5" />
                View Full Dataset
              </Link>
              <Link
                to="/data"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-300 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                <FileText className="w-5 h-5" />
                Read Analysis Report
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-sm text-gray-600">
                <strong>Dataset includes:</strong> 100 unique scenarios analyzed across 5 connectedness levels 
                (None, Low, Medium, High, Maximum) resulting in 500 total data points with harm calculations, 
                recommendations, and decision stability analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindingsPage;

