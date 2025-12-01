import { useState, useEffect } from 'react';
import { Library, TrendingUp, Users, AlertCircle } from 'lucide-react';

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
      <div className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Loading findings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
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
        </div>
      </div>
    </div>
  );
};

export default FindingsPage;

