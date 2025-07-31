"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, Smile, Coins, ShoppingCart, Plus, Gamepad2, Droplets, Utensils } from "lucide-react"
import MascotasPanel from "@/components/MascotasPanel";

interface Hero {
  id: string
  name: string
  power: string
  color: string
}

interface Pet {
  id: string
  name: string
  type: string
  heroId: string
  health: number
  happiness: number
  hunger: number
  cleanliness: number
  illness?: string
  accessories: string[]
  lastFed: number
  lastPlayed: number
  lastBathed: number
}

interface Item {
  id: string
  name: string
  type: "food" | "toy" | "accessory" | "medicine"
  price: number
  effect: {
    health?: number
    happiness?: number
    hunger?: number
    cleanliness?: number
  }
  icon: string
}

const defaultHeroes: Hero[] = [
  { id: "1", name: "Thunder Strike", power: "Lightning Control", color: "bg-yellow-500" },
  { id: "2", name: "Fire Phoenix", power: "Fire Manipulation", color: "bg-red-500" },
  { id: "3", name: "Ice Guardian", power: "Ice Powers", color: "bg-blue-500" },
  { id: "4", name: "Nature Spirit", power: "Plant Control", color: "bg-green-500" },
]

const defaultPets: Pet[] = [
  {
    id: "1",
    name: "Sparky",
    type: "Electric Dragon",
    heroId: "1",
    health: 80,
    happiness: 70,
    hunger: 60,
    cleanliness: 90,
    accessories: [],
    lastFed: 0, // Valor fijo
    lastPlayed: 0,
    lastBathed: 0,
  },
  {
    id: "2",
    name: "Blaze",
    type: "Fire Wolf",
    heroId: "2",
    health: 90,
    happiness: 85,
    hunger: 40,
    cleanliness: 70,
    accessories: [],
    lastFed: 0,
    lastPlayed: 0,
    lastBathed: 0,
  },
]

const shopItems: Item[] = [
  { id: "1", name: "Super Food", type: "food", price: 10, effect: { hunger: 30, health: 5 }, icon: "🍖" },
  { id: "2", name: "Energy Drink", type: "food", price: 15, effect: { hunger: 20, happiness: 10 }, icon: "🥤" },
  { id: "3", name: "Laser Toy", type: "toy", price: 25, effect: { happiness: 25 }, icon: "🔴" },
  { id: "4", name: "Flying Ball", type: "toy", price: 20, effect: { happiness: 20 }, icon: "⚽" },
  { id: "5", name: "Hero Cape", type: "accessory", price: 50, effect: { happiness: 15 }, icon: "🦸" },
  { id: "6", name: "Power Collar", type: "accessory", price: 75, effect: { health: 10, happiness: 10 }, icon: "⭐" },
  { id: "7", name: "Health Potion", type: "medicine", price: 30, effect: { health: 40 }, icon: "🧪" },
  { id: "8", name: "Happy Pills", type: "medicine", price: 25, effect: { happiness: 35 }, icon: "💊" },
]

const illnesses = ["Cold", "Tired", "Sad", "Hungry", "Dirty"]

const API_URL = "https://superheroes-rxcu.onrender.com/api";

export default function SuperheroPetGame() {
  const [heroes, setHeroes] = useState<Hero[]>(defaultHeroes)
  const [pets, setPets] = useState<Pet[]>(defaultPets)
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [coins, setCoins] = useState(100)
  const [inventory, setInventory] = useState<{ [key: string]: number }>({})
  const [newHeroName, setNewHeroName] = useState("")
  const [newHeroPower, setNewHeroPower] = useState("")
  const [newPetName, setNewPetName] = useState("")
  const [newPetType, setNewPetType] = useState("")
  const [token, setToken] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Marcar que estamos en el cliente para evitar errores de hidratación
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simulación del paso del tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setPets((prevPets) =>
        prevPets.map((pet) => {
          const now = Date.now()
          const newPet = { ...pet }

          // Decrementar stats con el tiempo
          if (now - pet.lastFed > 3600000) {
            // 1 hora
            newPet.hunger = Math.max(0, pet.hunger - 1)
            newPet.health = Math.max(0, pet.health - 0.5)
          }

          if (now - pet.lastPlayed > 1800000) {
            // 30 minutos
            newPet.happiness = Math.max(0, pet.happiness - 1)
          }

          if (now - pet.lastBathed > 7200000) {
            // 2 horas
            newPet.cleanliness = Math.max(0, pet.cleanliness - 1)
          }

          // Posibilidad de enfermarse
          if (Math.random() < 0.001 && !newPet.illness) {
            if (newPet.health < 30 || newPet.happiness < 20 || newPet.cleanliness < 30) {
              newPet.illness = illnesses[Math.floor(Math.random() * illnesses.length)]
            }
          }

          return newPet
        }),
      )
    }, 5000) // Actualizar cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  // Leer token de localStorage al cargar el componente (solo en cliente)
  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [isClient]);

  // Guardar token en localStorage cuando cambie
  useEffect(() => {
    if (isClient && token) {
      localStorage.setItem('token', token);
    } else if (isClient && !token) {
      localStorage.removeItem('token');
    }
  }, [token, isClient]);

  const createHero = () => {
    if (newHeroName && newHeroPower) {
      const newHero: Hero = {
        id: Date.now().toString(),
        name: newHeroName,
        power: newHeroPower,
        color: `bg-${["purple", "pink", "indigo", "teal", "orange"][Math.floor(Math.random() * 5)]}-500`,
      }
      setHeroes([...heroes, newHero])
      setNewHeroName("")
      setNewHeroPower("")
    }
  }

  const createPet = () => {
    if (newPetName && newPetType && selectedHero) {
      const newPet: Pet = {
        id: Date.now().toString(),
        name: newPetName,
        type: newPetType,
        heroId: selectedHero.id,
        health: 100,
        happiness: 100,
        hunger: 100,
        cleanliness: 100,
        accessories: [],
        lastFed: Date.now(),
        lastPlayed: Date.now(),
        lastBathed: Date.now(),
      }
      setPets([...pets, newPet])
      setNewPetName("")
      setNewPetType("")
    }
  }

  const feedPet = () => {
    if (selectedPet) {
      setPets(
        pets.map((pet) =>
          pet.id === selectedPet.id
            ? {
                ...pet,
                hunger: Math.min(100, pet.hunger + 20),
                health: Math.min(100, pet.health + 5),
                lastFed: Date.now(),
              }
            : pet,
        ),
      )
      setCoins(coins + 5)
      setSelectedPet((prev) =>
        prev ? { ...prev, hunger: Math.min(100, prev.hunger + 20), health: Math.min(100, prev.health + 5) } : null,
      )
    }
  }

  const playWithPet = () => {
    if (selectedPet) {
      setPets(
        pets.map((pet) =>
          pet.id === selectedPet.id
            ? { ...pet, happiness: Math.min(100, pet.happiness + 25), lastPlayed: Date.now() }
            : pet,
        ),
      )
      setCoins(coins + 8)
      setSelectedPet((prev) => (prev ? { ...prev, happiness: Math.min(100, prev.happiness + 25) } : null))
    }
  }

  const bathePet = () => {
    if (selectedPet) {
      setPets(
        pets.map((pet) =>
          pet.id === selectedPet.id
            ? {
                ...pet,
                cleanliness: Math.min(100, pet.cleanliness + 30),
                happiness: Math.min(100, pet.happiness + 10),
                lastBathed: Date.now(),
              }
            : pet,
        ),
      )
      setCoins(coins + 6)
      setSelectedPet((prev) =>
        prev
          ? {
              ...prev,
              cleanliness: Math.min(100, prev.cleanliness + 30),
              happiness: Math.min(100, prev.happiness + 10),
            }
          : null,
      )
    }
  }

  const buyItem = (item: Item) => {
    if (coins >= item.price) {
      setCoins(coins - item.price)
      setInventory((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))
    }
  }

  const useItem = (item: Item) => {
    if (selectedPet && inventory[item.id] > 0) {
      setPets(
        pets.map((pet) => {
          if (pet.id === selectedPet.id) {
            const updatedPet = { ...pet }
            if (item.effect.health) updatedPet.health = Math.min(100, pet.health + item.effect.health)
            if (item.effect.happiness) updatedPet.happiness = Math.min(100, pet.happiness + item.effect.happiness)
            if (item.effect.hunger) updatedPet.hunger = Math.min(100, pet.hunger + item.effect.hunger)
            if (item.effect.cleanliness)
              updatedPet.cleanliness = Math.min(100, pet.cleanliness + item.effect.cleanliness)

            if (item.type === "medicine") {
              updatedPet.illness = undefined
            }

            if (item.type === "accessory" && !pet.accessories.includes(item.id)) {
              updatedPet.accessories = [...pet.accessories, item.id]
            }

            return updatedPet
          }
          return pet
        }),
      )

      setInventory((prev) => ({ ...prev, [item.id]: prev[item.id] - 1 }))
    }
  }

  const getHealthColor = (value: number) => {
    if (value > 70) return "bg-green-500"
    if (value > 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getHappinessColor = (value: number) => {
    if (value > 70) return "bg-blue-500"
    if (value > 40) return "bg-orange-500"
    return "bg-gray-500"
  }

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setLoginError("");
      } else {
        setLoginError(data.mensaje || "Credenciales inválidas");
      }
    } catch (err) {
      setLoginError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Registro handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    try {
      const res = await fetch(`${API_URL}/usuarios/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: registerName, email: registerEmail, password: registerPassword })
      });
      const data = await res.json();
      if (res.ok) {
        // Registro exitoso, iniciar sesión automáticamente
        setLoginEmail(registerEmail);
        setLoginPassword(registerPassword);
        setShowRegister(false);
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterError("");
        // Llamar a handleLogin manualmente
        await handleLogin(new Event("submit") as any);
      } else {
        setRegisterError(data.mensaje || "Error al registrar usuario");
      }
    } catch (err) {
      setRegisterError("Error de conexión");
    } finally {
      setRegisterLoading(false);
    }
  };

  // Mostrar loading mientras se carga el token
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar formulario de login si no hay token
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{showRegister ? "Registrarse" : "Iniciar sesión"}</CardTitle>
          </CardHeader>
          <CardContent>
            {showRegister ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Nombre"
                  value={registerName}
                  onChange={e => setRegisterName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  required
                />
                {registerError && <div className="text-red-500 text-sm">{registerError}</div>}
                <Button type="submit" className="w-full" disabled={registerLoading}>
                  {registerLoading ? "Registrando..." : "Registrarse"}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => setShowRegister(false)}>
                  Volver a iniciar sesión
                </Button>
              </form>
            ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => setShowRegister(true)}>
                  Registrarse
                </Button>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si el usuario está autenticado, mostrar el panel de mascotas
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setToken(null); localStorage.removeItem('token'); window.location.reload(); }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Cerrar sesión
        </button>
      </div>
      <MascotasPanel token={token} />
    </div>
  );
}
