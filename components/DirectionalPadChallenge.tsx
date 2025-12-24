'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface LockoutData {
  failedAttempts: number;
  lockoutUntil: number | null;
  lockoutCount: number;
}

export default function DirectionalPadChallenge() {
  const [sequence, setSequence] = useState<Direction[]>([]);
  const [error, setError] = useState('');
  const [lockoutData, setLockoutData] = useState<LockoutData>({
    failedAttempts: 0,
    lockoutUntil: null,
    lockoutCount: 0,
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const router = useRouter();

  const correctSequence: Direction[] = ['LEFT', 'LEFT', 'RIGHT'];
  const LOCKOUT_DURATIONS = [3, 10, 30, 60]; // minutes

  useEffect(() => {
    // Charger les données de blocage depuis localStorage
    const stored = localStorage.getItem('directionalChallengeLockout');
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
            localStorage.setItem('directionalChallengeLockout', JSON.stringify(newData));
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
    return LOCKOUT_DURATIONS[LOCKOUT_DURATIONS.length - 1]; // Toujours 60 minutes après
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

  const handleDirectionClick = (direction: Direction) => {
    if (lockoutData.lockoutUntil && lockoutData.lockoutUntil > Date.now()) {
      return; // Bloqué
    }
    setError('');
    setSequence([...sequence, direction]);
  };

  const handleReset = () => {
    setSequence([]);
    setError('');
  };

  const handleValidate = () => {
    if (lockoutData.lockoutUntil && lockoutData.lockoutUntil > Date.now()) {
      setError('Vous êtes temporairement bloqué. Veuillez attendre.');
      return;
    }

    if (sequence.length === 0) {
      setError('Veuillez entrer une combinaison');
      return;
    }

    if (
      sequence.length === correctSequence.length &&
      sequence.every((dir, index) => dir === correctSequence[index])
    ) {
      // Réinitialiser les données de blocage en cas de succès
      localStorage.removeItem('directionalChallengeLockout');
      router.push('/victory');
    } else {
      const newFailedAttempts = lockoutData.failedAttempts + 1;

      // Bloquer l'utilisateur après 1 seule tentative
      const duration = getLockoutDuration(lockoutData.lockoutCount);
      const lockoutUntil = Date.now() + duration * 60 * 1000;
      const newLockoutCount = lockoutData.lockoutCount + 1;

      const newData: LockoutData = {
        failedAttempts: 0,
        lockoutUntil,
        lockoutCount: newLockoutCount,
      };

      setLockoutData(newData);
      localStorage.setItem('directionalChallengeLockout', JSON.stringify(newData));
      setTimeRemaining(duration * 60);
      setError(`Mauvaise réponse ! Vous êtes bloqué pendant ${duration} minute${duration > 1 ? 's' : ''}.`);

      setSequence([]);
    }
  };

  const getDirectionSymbol = (dir: Direction) => {
    switch (dir) {
      case 'UP':
        return '↑';
      case 'DOWN':
        return '↓';
      case 'LEFT':
        return '←';
      case 'RIGHT':
        return '→';
    }
  };

  const isLocked = lockoutData.lockoutUntil && lockoutData.lockoutUntil > Date.now();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="border border-green-500 bg-black p-6">
          <h2 className="text-3xl font-bold text-green-500 mb-6 text-center">
            ÉPREUVE DIRECTIONNELLE
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
                Vous avez effectué trop de tentatives incorrectes.
              </p>
            </div>
          )}

          <div className="bg-gray-900 border border-green-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-green-400 mb-4">UP DOWN LEFT RIGHT FIND THE DIRECTION</h3>

            <div className="space-y-4">
              <div className="bg-black border border-green-600 p-4">
                <p className="text-green-500 font-bold mb-2">Indice 1:</p>
                <p className="text-white">
                  Sunday in june 2025, J&apos;aimerais bien prendre la direction du programme des little stars de l&apos;hotel de Bangkok.
                </p>
              </div>

              <div className="bg-black border border-green-600 p-4">
                <p className="text-green-500 font-bold mb-2">Indice 2:</p>
                <p className="text-white">
                  Je te conseille d&apos;aller voir les discussions wikipedia sur le personnage historique qui a donné son nom à la rue d'où nous avons pris le bus pour faire la Ha Giang loop. (un appel au maitre du jeu est possible pour cette enigme si trop complexe)
                </p>
              </div>

              <div className="bg-black border border-green-600 p-4">
                <p className="text-green-500 font-bold mb-2">Indice 3:</p>
                <p className="text-white">
                  D&apos;après kakaomap c&apos;est par là qu&apos;il faut sortir de la meilleur station de la ligne 1.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-green-700 p-6 mb-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              Séquence actuelle
            </h3>
            <div className="bg-black border border-green-600 p-4 min-h-16 flex items-center justify-center">
              {sequence.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune direction sélectionnée</p>
              ) : (
                <div className="flex gap-3">
                  {sequence.map((dir, index) => (
                    <div
                      key={index}
                      className="bg-green-900 border border-green-500 px-4 py-2 text-green-400 font-mono text-2xl"
                    >
                      {getDirectionSymbol(dir)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-green-700 p-6 mb-6">
            <h3 className="text-xl font-bold text-green-400 mb-4 text-center">
              Pad Directionnel
            </h3>

            <div className="flex flex-col items-center gap-2">
              {/* Haut */}
              <button
                onClick={() => handleDirectionClick('UP')}
                disabled={!!isLocked}
                className={`w-20 h-20 border-2 text-4xl font-bold transition-colors ${
                  isLocked
                    ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-green-900 border-green-500 text-green-400 hover:bg-green-800'
                }`}
              >
                ↑
              </button>

              {/* Gauche, Centre, Droite */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDirectionClick('LEFT')}
                  disabled={!!isLocked}
                  className={`w-20 h-20 border-2 text-4xl font-bold transition-colors ${
                    isLocked
                      ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-green-900 border-green-500 text-green-400 hover:bg-green-800'
                  }`}
                >
                  ←
                </button>
                <div className="w-20 h-20 bg-gray-800 border-2 border-gray-700"></div>
                <button
                  onClick={() => handleDirectionClick('RIGHT')}
                  disabled={!!isLocked}
                  className={`w-20 h-20 border-2 text-4xl font-bold transition-colors ${
                    isLocked
                      ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-green-900 border-green-500 text-green-400 hover:bg-green-800'
                  }`}
                >
                  →
                </button>
              </div>

              {/* Bas */}
              <button
                onClick={() => handleDirectionClick('DOWN')}
                disabled={!!isLocked}
                className={`w-20 h-20 border-2 text-4xl font-bold transition-colors ${
                  isLocked
                    ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-green-900 border-green-500 text-green-400 hover:bg-green-800'
                }`}
              >
                ↓
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-700 p-3 mb-4">
              <p className="text-red-400 text-sm">
                <span className="font-bold">ERREUR:</span> {error}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleReset}
              disabled={!!isLocked}
              className={`flex-1 px-6 py-3 border font-mono font-bold transition-colors ${
                isLocked
                  ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600'
              }`}
            >
              RÉINITIALISER
            </button>
            <button
              onClick={handleValidate}
              disabled={!!isLocked}
              className={`flex-1 px-6 py-3 border font-mono font-bold transition-colors ${
                isLocked
                  ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                  : 'bg-green-900 border-green-500 text-green-400 hover:bg-green-800'
              }`}
            >
              VALIDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
