'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Challenge } from '@/types/challenge';

interface ChallengeFormProps {
  challenge: Challenge;
}

export default function ChallengeForm({ challenge }: ChallengeFormProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userAnswer = challenge.caseSensitive
      ? answer.trim()
      : answer.trim().toLowerCase();

    const correctAnswer = challenge.caseSensitive
      ? challenge.answer
      : challenge.answer.toLowerCase();

    if (userAnswer === correctAnswer) {
      router.push(`/${challenge.nextPath}`);
    } else {
      setError('Mauvaise réponse. Réessayez !');
      setAnswer('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-green-500 bg-black p-6">
        <h2 className="text-2xl font-bold text-green-500 mb-4">
          Défi #{challenge.id}
        </h2>
        <p className="text-lg mb-6 text-white">
          {challenge.question}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 bg-black border border-green-700 text-green-400 focus:outline-none focus:border-green-500 font-mono"
              placeholder="Votre réponse..."
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-950 border border-red-700 p-3">
              <p className="text-red-400 text-sm">
                <span className="font-bold">ERREUR:</span> {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 transition-colors font-mono"
          >
            VALIDER
          </button>
        </form>

        {challenge.hint && (
          <div className="mt-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-yellow-500 hover:text-yellow-400 text-sm underline"
            >
              {showHint ? 'Masquer l\'indice' : 'Besoin d\'un indice ?'}
            </button>
            {showHint && (
              <p className="mt-2 text-yellow-400 text-sm italic">
                {challenge.hint}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
