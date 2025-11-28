'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GMATChallenge } from '@/types/challenge';

interface GMATChallengeFormProps {
  challenge: GMATChallenge;
}

interface LockoutData {
  lockoutUntil: number | null;
  lockoutCount: number;
}

export default function GMATChallengeForm({ challenge }: GMATChallengeFormProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(challenge.exercises.length).fill(''));
  const [completed, setCompleted] = useState<boolean[]>(new Array(challenge.exercises.length).fill(false));
  const [finalAnswer, setFinalAnswer] = useState('');
  const [finalError, setFinalError] = useState('');
  const [lockoutData, setLockoutData] = useState<LockoutData>({
    lockoutUntil: null,
    lockoutCount: 0,
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const router = useRouter();

  const LOCKOUT_DURATIONS = [3, 10, 30, 60]; // minutes

  useEffect(() => {
    // Charger les données de blocage depuis localStorage
    const stored = localStorage.getItem('gmatChallengeLockout');
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
            localStorage.setItem('gmatChallengeLockout', JSON.stringify(newData));
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

  const separators = ['°', "'", '"', 'N', '°', "'", '"', 'E'];

  const handleExerciseSubmit = (index: number) => {
    const userAnswer = answers[index].trim().toLowerCase();
    const correctAnswer = challenge.exercises[index].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
      const newCompleted = [...completed];
      newCompleted[index] = true;
      setCompleted(newCompleted);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutData.lockoutUntil && lockoutData.lockoutUntil > Date.now()) {
      setFinalError('Vous êtes temporairement bloqué. Veuillez attendre.');
      return;
    }

    const userFinalAnswer = finalAnswer.trim().toLowerCase();
    const correctFinalAnswer = challenge.finalAnswer.toLowerCase();
    const alternativeAnswer = "we've place";

    if (userFinalAnswer === correctFinalAnswer || userFinalAnswer === alternativeAnswer) {
      localStorage.removeItem('gmatChallengeLockout');
      router.push(`/${challenge.nextPath}`);
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
      localStorage.setItem('gmatChallengeLockout', JSON.stringify(newData));
      setTimeRemaining(duration * 60);
      setFinalError(`Mauvaise réponse ! Vous êtes bloqué pendant ${duration} minute${duration > 1 ? 's' : ''}.`);
      setFinalAnswer('');
    }
  };

  const allExercisesCompleted = completed.every(c => c);
  const isLocked = lockoutData.lockoutUntil && lockoutData.lockoutUntil > Date.now();

  return (
    <div className="space-y-6">
      <div className="border border-green-500 bg-black p-6">
        <h2 className="text-2xl font-bold text-green-500 mb-4">
          {challenge.title}
        </h2>
        <p className="text-lg mb-6 text-white">
          {challenge.description}
        </p>

        <div className="bg-yellow-950 border border-yellow-600 p-4 mb-6">
          <p className="text-yellow-400 text-center font-bold">
            ⚠️ ATTENTION : Vous n'avez droit qu'à 1 seul essai pour la question finale !
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
              Vous avez fait une erreur sur la question finale. Veuillez attendre.
            </p>
          </div>
        )}

        <div className="space-y-0">
          {challenge.exercises.map((exercise, index) => (
            <div key={index}>
              <div className="border border-gray-700 bg-gray-900 p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-green-400">
                    Exercice {exercise.number}
                    {completed[index] && (
                      <span className="ml-3 text-green-500">✓</span>
                    )}
                  </h3>
                </div>

                <p className="text-white mb-4">{exercise.question}</p>

                {!completed[index] ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers[index]}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleExerciseSubmit(index);
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-black border border-green-700 text-green-400 focus:outline-none focus:border-green-500 font-mono text-sm"
                      placeholder="Réponse..."
                    />
                    <button
                      onClick={() => handleExerciseSubmit(index)}
                      className="px-4 py-2 bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 transition-colors font-mono text-sm"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-950 border border-green-700 p-3">
                    <p className="text-green-400 text-sm font-bold">
                      Réponse correcte : {exercise.answer}
                    </p>
                  </div>
                )}
              </div>

              {completed[index] && index < challenge.exercises.length && (
                <div className="bg-black border-l-2 border-r-2 border-green-500 py-3 text-center">
                  <span className="text-4xl font-bold text-green-400 font-mono">
                    {separators[index]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 border-2 border-green-500 bg-gray-900 p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4">
            Question Finale
          </h3>
          <p className="text-white text-lg mb-4">
            {challenge.finalQuestion}
          </p>

          {!allExercisesCompleted ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-2">
                Complétez tous les exercices pour débloquer la question finale
              </p>
              <p className="text-green-500 text-sm mt-1">
                {completed.filter(c => c).length} / {challenge.exercises.length} exercices complétés
              </p>
            </div>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
                <input
                  type="text"
                  value={finalAnswer}
                  onChange={(e) => {
                    setFinalAnswer(e.target.value);
                    setFinalError('');
                  }}
                  disabled={!!isLocked}
                  className={`w-full px-4 py-2 bg-black border font-mono ${
                    isLocked
                      ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                      : 'border-green-700 text-green-400 focus:outline-none focus:border-green-500'
                  }`}
                  placeholder="Votre réponse finale..."
                  autoFocus={!isLocked}
                />

                {finalError && (
                  <div className="bg-red-950 border border-red-700 p-3">
                    <p className="text-red-400 text-sm">
                      <span className="font-bold">ERREUR:</span> {finalError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!!isLocked}
                  className={`w-full px-6 py-3 border font-mono font-bold transition-colors ${
                    isLocked
                      ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                      : 'bg-green-900 border-green-500 text-green-400 hover:bg-green-800'
                  }`}
                >
                  VALIDER LA RÉPONSE FINALE
                </button>
              </form>
          )}
        </div>
      </div>
    </div>
  );
}
