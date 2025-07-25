import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store, persistor } from "./store/store";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import Trending from "./pages/Trending";
import Sports from "./pages/Sports";
import News from "./pages/News";
import Education from "./pages/Education";
import Entertainment from "./pages/Entertainment";
import Travel from "./pages/Travel";
import Finance from "./pages/Finance";
import Technology from "./pages/Technology";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/news" element={<News />} />
              <Route path="/education" element={<Education />} />
              <Route path="/entertainment" element={<Entertainment />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
