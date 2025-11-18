const PosterPage = () => {
  const posterSrc = `${import.meta.env.BASE_URL}poster.html`;
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200">
        <iframe src={posterSrc} title="Capstone Poster" className="w-full h-[90vh] rounded-3xl" />
      </div>
    </div>
  );
};

export default PosterPage;
