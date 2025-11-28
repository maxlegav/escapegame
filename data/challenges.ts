import { Challenge } from '@/types/challenge';

export const challenges: Record<string, Challenge> = {
  'hec23fr': {
    id: 'hec23fr',
    question: 'Quel est le nom de la capitale de la France ?',
    answer: 'paris',
    hint: 'C\'est la ville des lumières...',
    nextPath: 'eiffel',
    caseSensitive: false,
  },
  'eiffel': {
    id: 'eiffel',
    question: 'Combien de faces a un cube ?',
    answer: '6',
    hint: 'Comptez bien toutes les faces...',
    nextPath: 'matrix',
    caseSensitive: false,
  },
  'matrix': {
    id: 'matrix',
    question: 'Quel est le résultat de 7 × 8 ?',
    answer: '56',
    hint: 'C\'est une simple multiplication...',
    nextPath: 'victory',
    caseSensitive: false,
  },
};
