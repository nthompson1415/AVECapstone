import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center space-y-4">
    <h1 className="text-6xl font-black">404</h1>
    <p className="text-lg text-slate-300 max-w-md">
      That page drifted off the trolley track. Choose a tool instead.
    </p>
    <Link to="/" className="px-6 py-3 rounded-full bg-indigo-500 text-white font-semibold shadow-lg">
      Return Home
    </Link>
  </div>
);

export default NotFoundPage;
