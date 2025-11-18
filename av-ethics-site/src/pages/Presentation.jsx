const PresentationPage = () => {
  const presentationSrc = `${import.meta.env.BASE_URL}presentation.html`;
  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <iframe src={presentationSrc} title="Capstone Presentation" className="w-full h-[90vh]" />
      </div>
    </div>
  );
};

export default PresentationPage;
