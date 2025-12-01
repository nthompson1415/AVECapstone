import { useState, useEffect } from 'react';
import { FileText, Table, Download, BarChart3, TrendingUp } from 'lucide-react';

const DataViewer = () => {
  const [activeTab, setActiveTab] = useState('report'); // 'report' or 'data'
  const [reportContent, setReportContent] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConnectedness, setSelectedConnectedness] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (csvData.length > 0) {
      filterData();
    }
  }, [searchTerm, selectedConnectedness, csvData]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load report
      try {
        const reportResponse = await fetch('/AVECapstone/ANALYSIS_REPORT.md');
        if (reportResponse.ok) {
          const reportText = await reportResponse.text();
          setReportContent(reportText);
        } else {
          // Try alternative path
          const altResponse = await fetch('/ANALYSIS_REPORT.md');
          if (altResponse.ok) {
            const reportText = await altResponse.text();
            setReportContent(reportText);
          }
        }
      } catch (e) {
        console.warn('Could not load report:', e);
      }

      // Load CSV
      try {
        const csvResponse = await fetch('/AVECapstone/scenario_analysis_data_100.csv');
        if (csvResponse.ok) {
          const csvText = await csvResponse.text();
          parseCSV(csvText);
        } else {
          // Try alternative path
          const altResponse = await fetch('/scenario_analysis_data_100.csv');
          if (altResponse.ok) {
            const csvText = await altResponse.text();
            parseCSV(csvText);
          } else {
            throw new Error('CSV file not found');
          }
        }
      } catch (e) {
        console.warn('Could not load CSV:', e);
        setError('Could not load data files. Make sure scenario_analysis_data_100.csv and ANALYSIS_REPORT.md are in the public directory.');
      }
    } catch (err) {
      setError('Error loading data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return;

    const headers = lines[0].split(',').map(h => h.trim());
    setCsvHeaders(headers);

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      data.push(row);
    }
    setCsvData(data);
    setFilteredData(data);
  };

  const filterData = () => {
    let filtered = [...csvData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(row => 
        Object.values(row).some(val => 
          val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by connectedness
    if (selectedConnectedness !== 'all') {
      filtered = filtered.filter(row => 
        row.Connectedness === selectedConnectedness
      );
    }

    setFilteredData(filtered);
  };

  const downloadCSV = () => {
    const headers = csvHeaders.join(',');
    const rows = filteredData.map(row => 
      csvHeaders.map(header => row[header] || '').join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_scenario_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (text) => {
    // Simple markdown rendering
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4 text-indigo-900">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3 text-indigo-800">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-semibold mt-4 mb-2 text-indigo-700">{line.substring(4)}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={idx} className="ml-6 mb-1">{line.substring(2)}</li>;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="font-bold text-lg mb-2">{line.replace(/\*\*/g, '')}</p>;
      } else if (line.trim() === '') {
        return <br key={idx} />;
      } else if (line.startsWith('|')) {
        // Table row - simple rendering
        const cells = line.split('|').filter(c => c.trim());
        return (
          <tr key={idx} className="border-b">
            {cells.map((cell, cellIdx) => (
              <td key={cellIdx} className="px-4 py-2 border-r">{cell.trim()}</td>
            ))}
          </tr>
        );
      } else {
        return <p key={idx} className="mb-2 text-gray-700">{line}</p>;
      }
    });
  };

  const connectednessOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'None (Demographic-Blind)', label: 'None' },
    { value: 'Low (Age Only)', label: 'Low' },
    { value: 'Medium (+ Occupation/Health/Criminal)', label: 'Medium' },
    { value: 'High (+ Legal/Pregnancy/Species)', label: 'High' },
    { value: 'Maximum (+ Network Effects)', label: 'Maximum' }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 rounded-lg shadow-md p-8 text-center border-2 border-red-200">
            <p className="text-red-600 font-semibold">{error}</p>
            <p className="text-red-500 text-sm mt-2">Make sure scenario_analysis_data_100.csv and ANALYSIS_REPORT.md are in the public directory.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Data Analysis Viewer</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'report'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Analysis Report
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'data'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Table className="w-5 h-5 inline mr-2" />
              CSV Data ({filteredData.length} rows)
            </button>
          </div>

          {/* Report Tab */}
          {activeTab === 'report' && (
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                {reportContent ? (
                  <div className="markdown-content">
                    {renderMarkdown(reportContent)}
                  </div>
                ) : (
                  <p className="text-gray-600">Report content not available.</p>
                )}
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div>
              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search scenarios, recommendations..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Connectedness Level
                    </label>
                    <select
                      value={selectedConnectedness}
                      onChange={(e) => setSelectedConnectedness(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {connectednessOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {filteredData.length} of {csvData.length} rows
                  </div>
                  <button
                    onClick={downloadCSV}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Filtered CSV
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50 sticky top-0">
                      <tr>
                        {csvHeaders.map((header, idx) => (
                          <th
                            key={idx}
                            className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider border-r border-indigo-200"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className={`hover:bg-indigo-50 ${
                            row.Recommendation === 'neutral' ? 'bg-yellow-50' : ''
                          }`}
                        >
                          {csvHeaders.map((header, colIdx) => (
                            <td
                              key={colIdx}
                              className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200"
                            >
                              {header === 'Recommendation' ? (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    row[header] === 'option1'
                                      ? 'bg-blue-100 text-blue-800'
                                      : row[header] === 'option2'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {row[header]}
                                </span>
                              ) : (
                                row[header]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredData.length === 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center mt-4">
                  <p className="text-yellow-800">No data matches your filters. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataViewer;

