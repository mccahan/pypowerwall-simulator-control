import SimulatorDashboard from "./components/simulator-dashboard"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground dark">
      <h1 className="text-4xl font-bold mb-8">Powerwall Scenario Simulator</h1>
      <SimulatorDashboard />
    </main>
  )
}

