import React, { useState, ReactNode } from 'react';
import { Heart, Activity, Users } from 'lucide-react';
import FoodAnalyzer from './components/FoodAnalyzer';
import AiDoctor from './components/AiDoctor';
import DietPlanner from './components/DietPlanner';

type Tab = 'food' | 'doctor' | 'diet';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-6">
          <div className="max-w-md bg-gray-800 rounded-lg p-8 border border-red-500/30">
            <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-4 text-sm">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('food');

  const tabs = [
    { id: 'food' as Tab, label: 'Food Analysis', icon: Activity },
    { id: 'doctor' as Tab, label: 'AI Doctor', icon: Heart },
    { id: 'diet' as Tab, label: 'Diet Planner', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'food':
        return <FoodAnalyzer />;
      case 'doctor':
        return <AiDoctor />;
      case 'diet':
        return <DietPlanner />;
      default:
        return <FoodAnalyzer />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-black via-gray-900 to-green-900/20 border-b border-green-500/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-green-400 to-green-500 bg-clip-text text-transparent">
                  Health Genie
                </h1>
              </div>
              <p className="text-gray-300 hidden md:block font-medium">Your AI-Powered Health Companion</p>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-400 bg-gradient-to-t from-green-500/10 to-transparent'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gradient-to-t hover:from-gray-700/20 hover:to-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-700/50 mt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <p className="text-gray-400">
                © 2025 Health Genie. Powered by AI for better health outcomes.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Always consult with healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;