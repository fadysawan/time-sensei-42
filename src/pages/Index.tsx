import { TradeTimeTracker } from '../components/TradeTimeTracker';
import { useUserConfiguration } from '../contexts/UserConfigurationContext';
// import { TradeTimeTrackerRefactored } from '../components/TradeTimeTrackerRefactored';

const Index = () => {
  const { config } = useUserConfiguration();
  
  return <TradeTimeTracker />;
  // return <TradeTimeTrackerRefactored />;
};

export default Index;
