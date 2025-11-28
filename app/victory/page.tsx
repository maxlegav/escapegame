export default function VictoryPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="border border-yellow-500 bg-black p-12 font-mono">
          <h1 className="text-6xl font-bold text-yellow-500 mb-6">
            FÉLICITATIONS !
          </h1>
          <p className="text-2xl text-yellow-400 mb-8">
            Tu as réussi l'énigme du Ticket d'Or !
          </p>
          <div className="text-left bg-yellow-950 border border-yellow-700 p-6 mb-6">
            <p className="text-yellow-400 mb-2">
              <span className="text-yellow-500 font-bold">Progression:</span>
            </p>
            <p className="text-yellow-300">✓ Tous les défis complétés</p>
            <p className="text-yellow-300">✓ Énigme du Ticket d'Or réussie</p>
          </div>

          <div className="bg-purple-950 border-2 border-purple-500 p-8 mb-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">
              ⚠️ ATTENTION ⚠️
            </h2>
            <p className="text-xl text-purple-300 mb-4">
              Mais ne te réjouis pas trop vite !
            </p>
            <p className="text-lg text-purple-200 mb-4">
              Pour obtenir ta récompense, il reste encore 1 DERNIÈRE ÉPREUVE.
            </p>
            <div className="bg-purple-900 border border-purple-600 p-4 mt-4">
              <p className="text-purple-100 text-lg font-bold">
                C'est Lily qui te la donnera et qui évaluera si ta mission est accomplie.
              </p>
            </div>
          </div>

          <div className="text-gray-400 text-sm">
            <p>Bonne chance pour la suite de ton aventure !</p>
          </div>
        </div>
      </div>
    </div>
  );
}
