import AthleteHub from '@/components/AthleteHub';

interface AthleteProps {
  onNavigate: (page: string) => void;
}

const Athlete = ({ onNavigate }: AthleteProps) => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <AthleteHub onSectionChange={onNavigate} />
    </div>
  );
};

export default Athlete;