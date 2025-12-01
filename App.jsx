import { NavLink, Route, Routes, Link } from 'react-router-dom';
import { Brain, Sliders, Layers, Presentation, FileText } from 'lucide-react';
import HomePage from './pages/Home';
import AnalyzerPage from './pages/Analyzer';
import CalibratorPage from './pages/Calibrator';
import FindingsPage from './pages/Findings';
import PosterPage from './pages/Poster';
import PresentationPage from './pages/Presentation';
import DataViewerPage from './pages/DataViewer';
import NotFoundPage from './pages/NotFound';

const navLinks = [
  { to: '/', label: 'Overview', icon: Brain },
  { to: '/analyzer', label: 'Analyzer', icon: Layers },
  { to: '/calibrator', label: 'Calibrator', icon: Sliders },
  { to: '/findings', label: 'Findings', icon: FileText },
  { to: '/poster', label: 'Poster', icon: Presentation },
  { to: '/presentation', label: 'Slides', icon: Presentation }
];

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-amber-50 to-indigo-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">IST 477</p>
                <h1 className="text-xl font-black text-slate-900">Autonomous Vehicle Ethics Lab</h1>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to + label}
                  to={to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Persists across all pages */}
      <section className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-indigo-100 p-8 text-center mx-4 mt-6 mb-6 max-w-6xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 text-indigo-700 rounded-full p-3">
            <Brain className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Autonomous Vehicle Ethics Lab</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Interact with utilitarian decision models, personalize ethical weights, and review presentation-ready findings from the IST 477
          capstone on German Ethics Commission guidance vs. context-sensitive AV logic.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/analyzer"
            className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700"
          >
            Launch Ethical Analyzer
          </Link>
          <Link
            to="/calibrator"
            className="px-6 py-3 rounded-full bg-white border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50"
          >
            Personalize Your Values
          </Link>
          <Link
            to="/findings"
            className="px-6 py-3 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-semibold hover:bg-amber-200"
          >
            Read Findings
          </Link>
        </div>
      </section>

      <main className="flex-1 px-4">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyzer" element={<AnalyzerPage />} />
            <Route path="/calibrator" element={<CalibratorPage />} />
            <Route path="/findings" element={<FindingsPage />} />
            <Route path="/data" element={<DataViewerPage />} />
            <Route path="/poster" element={<PosterPage />} />
            <Route path="/presentation" element={<PresentationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

