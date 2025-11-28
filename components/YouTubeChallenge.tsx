'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function YouTubeChallenge() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const correctCode = 'NORTHG110PM2HRS';
  const youtubeUrl = 'https://www.youtube.com/watch?v=AI1CSySltfA&list=RDAI1CSySltfA&start_radio=1';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userCode = code.trim().toUpperCase();

    if (userCode === correctCode) {
      router.push('/victory');
    } else {
      setError('Code incorrect. Réessayez !');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="border border-green-500 bg-black p-6">
          <h2 className="text-3xl font-bold text-green-500 mb-6 text-center">
            ÉPREUVE YOUTUBE
          </h2>

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
                className="w-full px-4 py-3 bg-black border border-green-700 text-green-400 focus:outline-none focus:border-green-500 font-mono text-lg uppercase"
                placeholder="ENTREZ LE CODE ICI..."
                autoFocus
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
                className="w-full px-6 py-3 bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 transition-colors font-mono font-bold text-lg"
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
