import { useMemo } from 'react';
import { marked } from 'marked';
import findingsMd from '../content/preliminary_findings.md?raw';

const FindingsPage = () => {
  const html = useMemo(() => marked.parse(findingsMd), []);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <p className="uppercase tracking-[0.3em] text-amber-300 text-xs">IST 477 · Capstone</p>
          <h1 className="text-4xl font-black">Autonomous Vehicle Ethics Findings</h1>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Executive summary comparing German Ethics Commission guidance with increasingly context-sensitive utilitarian models.
          </p>
        </header>

        <article
          className="bg-white text-slate-900 rounded-3xl shadow-2xl p-8 prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default FindingsPage;
