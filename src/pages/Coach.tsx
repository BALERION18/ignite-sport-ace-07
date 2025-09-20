import CoachDashboard from '@/components/CoachDashboard';

interface CoachProps {
  onNavigate: (page: string) => void;
}

const Coach = ({ onNavigate }: CoachProps) => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <CoachDashboard onSectionChange={onNavigate} />
    </div>
  );
};

export default Coach;