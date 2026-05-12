import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useAppContext } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { EnergyBackground } from './components/layout/EnergyBackground';
import { UserProfile } from './components/dashboard/UserProfile';
import { SolarAssistant } from './components/assistant/SolarAssistant';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { HomePage } from './pages/HomePage';
import { QuickAssessPage } from './pages/QuickAssessPage';
import { DetailedAssessPage } from './pages/DetailedAssessPage';
import { ToastContainer } from './components/ui/Toast';

function AppInner() {
  const { authMode, setAuthMode, profileOpen, setProfileOpen, bumpRefreshKey } = useAppContext();

  return (
    <div className="relative isolate min-h-screen text-heading">
      <EnergyBackground />
      <Navbar onAuth={setAuthMode} onProfile={() => setProfileOpen(true)} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/byrza-otsenka" element={<QuickAssessPage />} />
        <Route path="/detaylna-otsenka" element={<DetailedAssessPage />} />
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      <UserProfile isOpen={profileOpen} onClose={() => setProfileOpen(false)} onNewAppliance={bumpRefreshKey} />
      <SolarAssistant onAuth={setAuthMode} onNewAppliance={bumpRefreshKey} />
      <LoginModal open={authMode === 'login'} onClose={() => setAuthMode(null)} onSwitch={() => setAuthMode('register')} />
      <RegisterModal open={authMode === 'register'} onClose={() => setAuthMode(null)} onSwitch={() => setAuthMode('login')} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppProvider>
              <AppInner />
            </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
