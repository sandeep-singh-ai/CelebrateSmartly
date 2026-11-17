
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import TagSearchPage from "./pages/TagSearchPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import SavedVendors from "./pages/SavedVendors";
import PremiumVendors from "./pages/PremiumVendors";
import GuestLists from "./pages/GuestLists";
import GuestListDetail from "./pages/GuestListDetail";
import RSVPEvents from "./pages/RSVPEvents";
import QRTest from "./pages/QRTest";
import QRScanner from "./pages/QRScanner";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import YourLocalVendor from "./pages/YourLocalVendor";
import EventWebsiteBuilder from "./pages/EventWebsiteBuilder";
import PublicEventPage from "./pages/PublicEventPage";
import { RSVPResponsePage } from "./components/rsvp/RSVPResponsePage";
import RSVPResponse from "./pages/RSVPResponse";
import VendorRecentSearches from "./pages/VendorRecentSearches";
import { useSitemap } from "./hooks/useSitemap";
import InvitationVerification from "./pages/InvitationVerification";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ConfigurationTest from "./pages/ConfigurationTest";
import VendorSearchConfig from "./pages/VendorSearchConfig";
import Wedding from "./pages/Wedding";
import FreeWeddingSpeech from "./pages/wedding/FreeWeddingSpeech";
import GenerateFreePersonalizedVows from "./pages/wedding/GenerateFreePersonalizedVows";
import BrowseEvents from "./pages/BrowseEvents";

const queryClient = new QueryClient();

function App() {
  // Initialize sitemap on app load
  useSitemap({ autoUpdate: true });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/create" element={<CreateEvent />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/tag/:tagName" element={<TagSearchPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/help" element={<Help />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/vendors/recent-searches" element={<VendorRecentSearches />} />
                <Route path="/vendor-search" element={<Vendors />} />
                <Route path="/vendors/:slug" element={<VendorDetail />} />
                <Route path="/saved-vendors" element={<SavedVendors />} />
                <Route path="/premium-vendors" element={<PremiumVendors />} />
                <Route path="/guest-lists" element={<GuestLists />} />
                <Route path="/guest-lists/:id" element={<GuestListDetail />} />
                <Route path="/rsvp-events" element={<RSVPEvents />} />
                <Route path="/rsvp/:token" element={<RSVPResponsePage />} />
                <Route path="/rsvp-response/:token" element={<RSVPResponse />} />
                <Route path="/qr-scanner" element={<QRScanner />} />
                <Route path="/qr-test" element={<QRTest />} />
                <Route path="/config-test" element={<ConfigurationTest />} />
                <Route path="/vendor-search-config" element={<VendorSearchConfig />} />
                <Route path="/browse-events" element={<BrowseEvents />} />
                <Route path="/wedding" element={<Wedding />} />
                <Route path="/wedding/free-wedding-speech" element={<FreeWeddingSpeech />} />
                <Route path="/wedding/generate-free-personalized-vows" element={<GenerateFreePersonalizedVows />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/your-local-vendor" element={<YourLocalVendor />} />
                <Route path="/website-builder" element={<EventWebsiteBuilder />} />
                <Route path="/event-website-builder" element={<EventWebsiteBuilder />} />
                <Route path="/celebration/:eventName" element={<PublicEventPage />} />
                <Route path="/verify/:token" element={<InvitationVerification />} />
                <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
