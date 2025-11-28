'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LockoutData {
  lockoutUntil: number | null;
  lockoutCount: number;
}

export default function YouTubeChallenge() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [lockoutData, setLockoutData] = useState<LockoutData>({
    lockoutUntil: null,
    lockoutCount: 0,
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const router = useRouter();

  const correctCode = 'NORTHG110PM2HRS';
  const youtubeUrl = 'https://www.youtube.com/watch?v=AI1CSySltfA&list=RDAI1CSySltfA&start_radio=1';
  const LOCKOUT_DURATIONS = [3, 10, 30, 60]; // minutes

  useEffect(() => {
    // Charger les données de blocage depuis localStorage
    const stored = localStorage.getItem('youtubeChallengeLockout');
    if (stored) {
      const data: LockoutData = JSON.parse(stored);
      setLockoutData(data);

      if (data.lockoutUntil && data.lockoutUntil > Date.now()) {
        const remaining = Math.ceil((data.lockoutUntil - Date.now()) / 1000);
        setTimeRemaining(remaining);
      }
    }
  }, []);

  useEffect(() => {
    // Timer pour le compte à rebours
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Débloquer
            const newData = { ...lockoutData, lockoutUntil: null };
            setLockoutData(newData);
            localStorage.setItem('youtubeChallengeLockout', JSON.stringify(newData));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, lockoutData]);

  const getLockoutDuration = (lockoutCount: number): number => {
    if (lockoutCount < LOCKOUT_DURATIONS.length) {
      return LOCKOUT_DURATIONS[lockoutCount];
    }
    return LOCKOUT_DURATIONS[LOCKOUT_DURATIONS.length - 1];
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutData.lockoutUntil && lockoutData.lockoutUntil > Date.now()) {
      setError('Vous êtes temporairement bloqué. Veuillez attendre.');
      return;
    }

    const userCode = code.trim().toUpperCase();

    if (userCode === correctCode) {
      localStorage.removeItem('youtubeChallengeLockout');
      router.push('/directional-challenge');
    } else {
      // Bloquer l'utilisateur après 1 seule tentative
      const duration = getLockoutDuration(lockoutData.lockoutCount);
      const lockoutUntil = Date.now() + duration * 60 * 1000;
      const newLockoutCount = lockoutData.lockoutCount + 1;

      const newData: LockoutData = {
        lockoutUntil,
        lockoutCount: newLockoutCount,
      };

      setLockoutData(newData);
      localStorage.setItem('youtubeChallengeLockout', JSON.stringify(newData));
      setTimeRemaining(duration * 60);
      setError(`Mauvaise réponse ! Vous êtes bloqué pendant ${duration} minute${duration > 1 ? 's' : ''}.`);
      setCode('');
    }
  };

  const isLocked = lockoutData.lockoutUntil && lockoutData.lockoutUntil > Date.now();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="border border-green-500 bg-black p-6">
          <h2 className="text-3xl font-bold text-green-500 mb-6 text-center">
            ÉPREUVE YOUTUBE
          </h2>

          <div className="bg-yellow-950 border border-yellow-600 p-4 mb-6">
            <p className="text-yellow-400 text-center font-bold">
              ⚠️ ATTENTION : Vous n'avez droit qu'à 1 seul essai par énigme !
            </p>
            <p className="text-yellow-300 text-center text-sm mt-2">
              En cas d'erreur, les temps de blocage augmentent progressivement : 3min → 10min → 30min → 60min
            </p>
          </div>

          {isLocked && (
            <div className="bg-red-950 border-2 border-red-500 p-6 mb-6 animate-pulse">
              <h3 className="text-2xl font-bold text-red-400 mb-2 text-center">
                ⚠️ ACCÈS BLOQUÉ ⚠️
              </h3>
              <p className="text-red-300 text-center text-lg">
                Temps restant : <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </p>
              <p className="text-red-400 text-center text-sm mt-2">
                Vous avez fait une erreur. Veuillez attendre.
              </p>
            </div>
          )}

          <div className="bg-gray-900 border border-green-700 p-6 mb-6">
            <p className="text-green-400 text-lg mb-4 text-center font-bold">
              Il avait ete imperatif de prendre des notes pour le 5E1-23:58
            </p>

            <div className="text-center">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-red-600 border border-red-700 text-white hover:bg-red-700 transition-colors font-mono font-bold text-lg"
              >
                ▶ 
              </a>
            </div>
          </div>

          <div className="bg-gray-900 border border-green-700 p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              Entrez le code
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                disabled={!!isLocked}
                className={`w-full px-4 py-3 bg-black border font-mono text-lg uppercase ${
                  isLocked
                    ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                    : 'border-green-700 text-green-400 focus:outline-none focus:border-green-500'
                }`}
                placeholder="ENTREZ LE CODE ICI..."
                autoFocus={!isLocked}
              />

              {error && (
                <div className="bg-red-950 border border-red-700 p-3">
                  <p className="text-red-400 text-sm">
                    <span className="font-bold">ERREUR:</span> {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!!isLocked}
                className={`w-full px-6 py-3 border font-mono font-bold text-lg transition-colors ${
                  isLocked
                    ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                    : 'bg-green-900 border-green-500 text-green-400 hover:bg-green-800'
                }`}
              >
                VALIDER LE CODE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
