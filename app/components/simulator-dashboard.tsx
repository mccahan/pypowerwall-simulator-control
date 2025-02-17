"use client"

import { useState, useEffect } from "react"
import { Sun, Cloud, Moon, Zap, Battery, CloudSunIcon as SolarPanel, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

const getSlug = (name: string) => name.toLowerCase().replace(/ /g, "-")

const scenarios = [
  { name: "Battery Exporting", icon: Battery },
  { name: "Solar Exporting", icon: SolarPanel },
  { name: "Solar-Powered", icon: Sun },
  { name: "Grid-Powered", icon: Zap },
  { name: "Self-Powered", icon: Home },
  { name: "Battery-Powered", icon: Battery },
  { name: "Grid Charging", icon: Zap },
  { name: "Solar Charging", icon: Battery },
]

const outages = [
  { name: "Sunny Day Outage", icon: Sun },
  { name: "Cloudy Day Outage", icon: Cloud },
  { name: "Nighttime Outage", icon: Moon },
]

export default function SimulatorDashboard() {
  const [activeScenario, setActiveScenario] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [batteryPercentage, setBatteryPercentage] = useState(50)

  useEffect(() => {
    const fetchScenarioData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (activeScenario === "") return
        
        const slug = activeScenario.toLowerCase().replace(/ /g, "-")
        const response = await fetch(`https://localhost/test/scenario/${slug}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Scenario data:", data)
        // Here you can update state with the fetched data if needed
      } catch (e) {
        setError(`Failed to fetch scenario data: ${e instanceof Error ? e.message : String(e)}`)
        console.error("Error fetching scenario data:", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchScenarioData()
  }, [activeScenario])

  useEffect(() => {
    const fetchActiveScenario = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("https://localhost/test/scenario")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setActiveScenario(data.active_scenario)
      } catch (e) {
        setError(`Failed to fetch active scenario: ${e instanceof Error ? e.message : String(e)}`)
        console.error("Error fetching active scenario:", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchActiveScenario()
  }, [])

  const handleScenarioClick = (scenarioName: string) => {
    setActiveScenario(getSlug(scenarioName))
  }

  const handleBatteryPercentageChange = async (value: number[]) => {
    const percentage = value[0]
    setBatteryPercentage(percentage)
    try {
      const response = await fetch(`https://localhost/test/battery-percentage/${percentage.toFixed(1)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      console.log("Battery percentage updated successfully")
    } catch (e) {
      console.error("Error updating battery percentage:", e)
      setError(`Failed to update battery percentage: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const handleGridToggle = async () => {
    try {
      const response = await fetch("https://localhost/test/toggle-grid")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      console.log("Grid connection toggled successfully")
    } catch (e) {
      console.error("Error toggling grid connection:", e)
      setError(`Failed to toggle grid connection: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <Card className="w-full max-w-5xl bg-card text-card-foreground">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[350px_auto] gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Scenarios</h2>
            <div className="grid grid-cols-1 gap-4">
              {scenarios.map((scenario) => (
                <Button
                  key={scenario.name}
                  variant={activeScenario === getSlug(scenario.name) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleScenarioClick(scenario.name)}
                  disabled={isLoading}
                >
                  <scenario.icon className="mr-2 h-4 w-4" />
                  {scenario.name}
                </Button>
              ))}
              <h2 className="text-2xl font-semibold mt-4 mb-2">Outages</h2>
              {outages.map((scenario) => (
                <Button
                  key={scenario.name}
                  variant={activeScenario === scenario.name ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleScenarioClick(scenario.name)}
                  disabled={isLoading}
                >
                  <scenario.icon className="mr-2 h-4 w-4" />
                  {scenario.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Power Flow</h2>
            <iframe
              src={process.env.NEXT_PUBLIC_DATAVIZ_URL || "http://localhost:8675"}
              className="min-h-[300px] relative h-64 rounded-lg w-full"
            ></iframe>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Battery Percentage: {batteryPercentage}%</h3>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[batteryPercentage]}
                onValueChange={handleBatteryPercentageChange}
                className="mb-4"
              />
              <Button onClick={handleGridToggle} className="mt-4 w-full">
                Toggle Grid Connection
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

