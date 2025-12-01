import { NavLink, Route, Routes } from 'react-router-dom';
import { Brain, Sliders, Layers, Presentation, FileText } from 'lucide-react';
import HomePage from './pages/Home';
import AnalyzerPage from './pages/Analyzer';
import CalibratorPage from './pages/Calibrator';
import FindingsPage from './pages/Findings';
import PosterPage from './pages/Poster';
import PresentationPage from './pages/Presentation';
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
    <div className="min-h-screen flex flex-col">
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

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyzer" element={<AnalyzerPage />} />
          <Route path="/calibrator" element={<CalibratorPage />} />
          <Route path="/findings" element={<FindingsPage />} />
          <Route path="/poster" element={<PosterPage />} />
          <Route path="/presentation" element={<PresentationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

