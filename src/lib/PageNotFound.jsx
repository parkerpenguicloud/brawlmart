import { useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#111133]">
      <div className="max-w-md w-full p-8 bg-[#12122a] rounded-2xl border border-white/10 shadow-2xl text-center">
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-purple-400 mb-6">Page Not Found</h2>
        <p className="text-slate-300 mb-8">
          Sorry, we couldn't find the page <span className="text-purple-300 font-medium">/{pageName}</span>.
        </p>
        <p className="text-slate-400 mb-8">
          It may have been moved, deleted, or never existed.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all"
        >
          <Home className="w-5 h-5" />
          Go Home
        </a>
      </div>
    </div>
  );
}
