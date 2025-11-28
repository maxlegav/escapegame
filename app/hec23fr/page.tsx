import { gmatChallenge } from '@/data/gmat-challenge';
import GMATChallengeForm from '@/components/GMATChallengeForm';

export default function Hec23frPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <GMATChallengeForm challenge={gmatChallenge} />
      </div>
    </div>
  );
}
