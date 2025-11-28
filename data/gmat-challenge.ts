import { GMATChallenge } from '@/types/challenge';

export const gmatChallenge: GMATChallenge = {
  id: 'hec23fr',
  title: 'ESCAPE GAME',
  description: 'Pour ton plus grand plaisir résoud ces petits exercices type GMAT pour ne pas t\'être entraîné pour rien.',
  exercises: [
    {
      number: 1,
      question: 'La somme de cinq entiers consécutifs vaut 185. Quel est l\'entier du milieu ?',
      solution: 'Somme de 5 entiers consécutifs = 5 × (entier du milieu). Donc l\'entier du milieu = 185 ÷ 5 = 37.',
      answer: '37',
    },
    {
      number: 2,
      question: 'Si 7x = 245, quelle est la valeur de x ?',
      solution: 'x = 245 ÷ 7 = 35.',
      answer: '35',
    },
    {
      number: 3,
      question: 'Un véhicule parcourt 159,5 km en 5 heures. Quelle est sa vitesse moyenne (km/h) ? (Donne la valeur décimale.)',
      solution: 'Vitesse = distance ÷ temps = 159,5 ÷ 5 = 31,9.',
      answer: '31.9',
    },
    {
      number: 4,
      question: 'Quel est le symbole chimique de l\'azote ?',
      solution: 'N est le symbole chimique de l\'azote (Nitrogen en anglais).',
      answer: 'N',
    },
    {
      number: 5,
      question: 'Calcule 2^7 - 1.',
      solution: '2^7 = 128. 128 - 1 = 127.',
      answer: '127',
    },
    {
      number: 6,
      question: 'Divise 100 par 97. Quel est le reste ? (Écris la réponse sur deux chiffres, par ex. 09 si le reste est 9.)',
      solution: '100 ÷ 97 = 1 reste 3. Formaté sur deux chiffres → 03.',
      answer: '03',
    },
    {
      number: 7,
      question: 'Quelle est la moitié de 55 ?',
      solution: '55 ÷ 2 = 27,5.',
      answer: '27.5',
    },
    {
      number: 8,
      question: 'Quelle est la lettre qui est au bout de la lunette ?',
      solution: 'E vient après D dans l\'alphabet.',
      answer: 'E',
    },
  ],
  finalQuestion: 'Basé sur ces résultats, quel est le nom de notre batiment ?',
  finalAnswer: 'weve place',
  nextPath: 'youtube-challenge',
};
