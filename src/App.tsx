import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import VisitorTracker from './components/VisitorTracker';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PlayZonesPage from './pages/PlayZonesPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import WaiverPage from './pages/WaiverPage';
import AdminPage from './pages/AdminPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FAQPage from './pages/FAQPage';

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
        <ScrollToTop />
        <VisitorTracker 
          enabled={true}
          trackPageViews={true}
          trackEvents={true}
          trackScrollDepth={true}
          sessionTimeout={30}
        />
        {/* <CanadaDayBanner /> */}
        {/* <CanadaDayMobilePopup /> */}
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/play-zones" element={<PlayZonesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/waiver" element={<WaiverPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;