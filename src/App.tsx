import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuantumEducation from "./pages/QuantumEducation";
import QuantumTools from "./pages/QuantumTools";
import QuantumOTP from "./pages/quantum-tools/QuantumOTP";
import QuantumPassword from "./pages/quantum-tools/QuantumPassword";
import QuantumUniqueID from "./pages/quantum-tools/QuantumUniqueID";
import QuantumPicker from "./pages/quantum-tools/QuantumPicker";
import QuantumToken from "./pages/quantum-tools/QuantumToken";
import QuantumAPI from "./pages/quantum-tools/QuantumAPI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quantum-education" element={<QuantumEducation />} />
          <Route path="/quantum-tools" element={<QuantumTools />} />
          <Route path="/quantum-tools/otp" element={<QuantumOTP />} />
          <Route path="/quantum-tools/password" element={<QuantumPassword />} />
          <Route path="/quantum-tools/unique-id" element={<QuantumUniqueID />} />
          <Route path="/quantum-tools/picker" element={<QuantumPicker />} />
          <Route path="/quantum-tools/token" element={<QuantumToken />} />
          <Route path="/quantum-tools/api" element={<QuantumAPI />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
