import HeroSection from '@/components/HeroSection';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home = ({ onNavigate }: HomeProps) => {
  return (
    <div className="min-h-screen">
      <HeroSection onSectionChange={onNavigate} />
    </div>
  );
};

export default Home;