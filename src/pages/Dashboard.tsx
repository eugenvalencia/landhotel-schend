import { Link, useNavigate } from "react-router-dom";
import { Hotel, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "@/components/ProtectedRoute";
import OverviewTab from "@/components/dashboard/OverviewTab";
import CalendarTab from "@/components/dashboard/CalendarTab";
import BookingsTab from "@/components/dashboard/BookingsTab";
import GuestsTab from "@/components/dashboard/GuestsTab";
import RevenueTab from "@/components/dashboard/RevenueTab";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/40">
        <header className="bg-primary text-primary-foreground sticky top-0 z-30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              <span className="font-semibold">Landhotel Schend · Dashboard</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <LogOut className="h-4 w-4" /> Abmelden
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="overview" className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 mb-4">
              <TabsList className="inline-flex w-auto">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="calendar">Kalender</TabsTrigger>
                <TabsTrigger value="bookings">Buchungen</TabsTrigger>
                <TabsTrigger value="guests">Gäste</TabsTrigger>
                <TabsTrigger value="revenue">Einnahmen</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview"><OverviewTab /></TabsContent>
            <TabsContent value="calendar"><CalendarTab /></TabsContent>
            <TabsContent value="bookings"><BookingsTab /></TabsContent>
            <TabsContent value="guests"><GuestsTab /></TabsContent>
            <TabsContent value="revenue"><RevenueTab /></TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
