'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GMATChallenge } from '@/types/challenge';

interface GMATChallengeFormProps {
  challenge: GMATChallenge;
}

export default function GMATChallengeForm({ challenge }: GMATChallengeFormProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(challenge.exercises.length).fill(''));
  const [completed, setCompleted] = useState<boolean[]>(new Array(challenge.exercises.length).fill(false));
  const [finalAnswer, setFinalAnswer] = useState('');
  const [finalError, setFinalError] = useState('');
  const router = useRouter();

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

    const userFinalAnswer = finalAnswer.trim().toLowerCase();
    const correctFinalAnswer = challenge.finalAnswer.toLowerCase();
    const alternativeAnswer = "we've place";

    if (userFinalAnswer === correctFinalAnswer || userFinalAnswer === alternativeAnswer) {
      router.push(`/${challenge.nextPath}`);
    } else {
      setFinalError('Mauvaise réponse. Réessayez !');
      setFinalAnswer('');
    }
  };

  const allExercisesCompleted = completed.every(c => c);

  return (
    <div className="space-y-6">
      <div className="border border-green-500 bg-black p-6">
        <h2 className="text-2xl font-bold text-green-500 mb-4">
          {challenge.title}
        </h2>
        <p className="text-lg mb-6 text-white">
          {challenge.description}
        </p>

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
                  className="w-full px-4 py-2 bg-black border border-green-700 text-green-400 focus:outline-none focus:border-green-500 font-mono"
                  placeholder="Votre réponse finale..."
                  autoFocus
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
                  className="w-full px-6 py-3 bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 transition-colors font-mono font-bold"
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
