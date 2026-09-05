import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/Button.jsx';

/**
 * NotFoundPage - 404 Route Handler
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        <Compass className="w-10 h-10 animate-spin [animation-duration:12s]" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          404
        </h1>
        <h2 className="text-lg font-semibold text-slate-200">
          Atmospheric Coordinates Lost
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The requested observation route or weather quadrant does not exist in our meteorological network.
        </p>
      </div>

      <div className="pt-2">
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
