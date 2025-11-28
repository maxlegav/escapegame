export default function VictoryPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="border border-green-500 bg-black p-12 font-mono animate-pulse">
          <h1 className="text-6xl font-bold text-green-500 mb-6">
            VICTOIRE !
          </h1>
          <p className="text-2xl text-green-400 mb-8">
            Félicitations, vous avez terminé l'escape game !
          </p>
          <div className="text-left bg-green-950 border border-green-700 p-6">
            <p className="text-green-400 mb-2">
              <span className="text-green-500 font-bold">Statistiques:</span>
            </p>
            <p className="text-green-300">✓ Tous les défis complétés</p>
            <p className="text-green-300">✓ Escape réussi</p>
            <p className="text-green-300">✓ Vous êtes un champion</p>
          </div>
          <div className="mt-8">
            <a
              href="/"
              className="inline-block px-8 py-4 bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 transition-colors"
            >
              RECOMMENCER
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
