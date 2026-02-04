import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { FilterPage } from './pages/FilterPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/filter" element={<FilterPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
