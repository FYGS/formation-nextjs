import { NextResponse } from "next/server";

// Données fictives de factures
const invoices = [
  {
    id: "INV001",
    customer: "Stark Industries",
    amount: 1500.75,
    status: "Payée",
    date: "2023-01-15",
  },
  {
    id: "INV002",
    customer: "Wayne Enterprises",
    amount: 200.0,
    status: "En attente",
    date: "2023-02-01",
  },
  {
    id: "INV003",
    customer: "Oscorp",
    amount: 3250.5,
    status: "En retard",
    date: "2023-01-20",
  },
  {
    id: "INV004",
    customer: "Queen Consolidated",
    amount: 750.0,
    status: "Payée",
    date: "2023-03-05",
  },
  {
    id: "INV005",
    customer: "LexCorp",
    amount: 5000.0,
    status: "En attente",
    date: "2023-03-10",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  // Simuler un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(invoices);
}
