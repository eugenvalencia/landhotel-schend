import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieBanner from "./components/CookieBanner";

const Index = lazy(() => import("./pages/Index"));
const Booking = lazy(() => import("./pages/Booking"));
const RoomDetail = lazy(() => import("./pages/RoomDetail"));
const PaketDetail = lazy(() => import("./pages/PaketDetail"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Seite wird geladen …
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/pakete/:slug" element={<PaketDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-confirmation" element={<Confirmation />} />
            <Route path="/confirmation/:bookingNumber" element={<Confirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
