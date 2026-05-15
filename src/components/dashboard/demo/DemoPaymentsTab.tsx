import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, Euro } from "lucide-react";
import DemoBanner from "../DemoBanner";

const MOCK_PAYMENTS = [
  { id: "pi_3LM2k8Hf", date: "14.05.2026", guest: "Familie Berger", amount: 285.00, status: "succeeded", method: "Visa •••• 4242" },
  { id: "pi_3LM2k7Gd", date: "14.05.2026", guest: "Petra Wittmann", amount: 95.00,  status: "succeeded", method: "Mastercard •••• 1145" },
  { id: "pi_3LM2k5Bn", date: "13.05.2026", guest: "Holger Krause", amount: 420.00, status: "succeeded", method: "PayPal" },
  { id: "pi_3LM2k4Vp", date: "13.05.2026", guest: "Lisa Sommerfeld", amount: 190.00, status: "pending",   method: "SEPA-Lastschrift" },
  { id: "pi_3LM2k3Tq", date: "12.05.2026", guest: "Marcus & Carla Reuter", amount: 525.00, status: "succeeded", method: "Apple Pay" },
  { id: "pi_3LM2k2Lx", date: "12.05.2026", guest: "Sebastian Roth", amount: 65.00, status: "refunded", method: "Visa •••• 8821" },
];

export default function DemoPaymentsTab() {
  return (
    <div>
      <DemoBanner description="Online-Zahlungen ueber Stripe — Karte/PayPal/Apple Pay/SEPA. Wird im Booking-Flow direkt eingebunden, Auszahlung 2-Werktage-Rhythmus." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-secondary" /> Online-Zahlungen
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Alle Stripe-Transaktionen der letzten 30 Tage — automatisch
            den Buchungen zugeordnet.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Heute</p><Euro className="h-4 w-4 text-secondary" /></div>
          <p className="text-2xl font-bold">380,00 €</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Monat</p><TrendingUp className="h-4 w-4 text-secondary" /></div>
          <p className="text-2xl font-bold">12.480 €</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Erfolgsquote</p><span className="text-xs text-success">●</span></div>
          <p className="text-2xl font-bold">98,2%</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Naechste Auszahlung</p></div>
          <p className="text-2xl font-bold">Mo</p>
        </CardContent></Card>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Transaktionen</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b text-xs text-muted-foreground text-left">
                  <th className="font-medium py-2 px-2">Datum</th>
                  <th className="font-medium py-2 px-2">Gast</th>
                  <th className="font-medium py-2 px-2">Methode</th>
                  <th className="font-medium py-2 px-2">Status</th>
                  <th className="font-medium py-2 px-2 text-right">Betrag</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYMENTS.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">{p.date}</td>
                    <td className="py-2.5 px-2 font-medium">{p.guest}</td>
                    <td className="py-2.5 px-2 text-muted-foreground text-xs">{p.method}</td>
                    <td className="py-2.5 px-2">
                      <Badge
                        variant={p.status === "succeeded" ? "default" : p.status === "pending" ? "outline" : "secondary"}
                        className="text-[10px]"
                      >
                        {p.status === "succeeded" ? "erfolgreich" : p.status === "pending" ? "ausstehend" : "erstattet"}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-medium">{p.amount.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
