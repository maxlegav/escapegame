export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="border border-red-500 bg-black p-8 font-mono">
          <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Erreur</h1>
          <p className="text-lg mb-4">
            La page que vous recherchez n'existe pas.
          </p>
          <div className="bg-red-950 border border-red-700 p-4 mb-4">
            <p className="text-red-400 text-sm">
              <span className="text-red-500 font-bold">ERREUR:</span> Path incomplet
            </p>
            <p className="text-red-400 text-sm mt-2">
              Il manque un <span className="text-white font-bold">/</span> dans votre URL
            </p>
          </div>
          <div className="text-gray-500 text-sm">
            <p className="mb-2">Peut-être devriez-vous essayer:</p>
            <p className="text-green-500">
              <span className="text-gray-600">Indice:</span> Commencez par le bon chemin...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
