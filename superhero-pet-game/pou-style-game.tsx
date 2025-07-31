"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Heart,
  Zap,
  Utensils,
  Gamepad2,
  Bath,
  Bed,
  ShoppingCart,
  Coins,
  Home,
  ChefHat,
  Shirt,
  FlaskConical,
} from "lucide-react"

interface Pet {
  name: string
  type: string
  level: number
  health: number
  hunger: number
  happiness: number
  energy: number
  cleanliness: number
  coins: number
  experience: number
  mood: "happy" | "sad" | "tired" | "hungry" | "dirty" | "sick" | "normal"
  accessories: string[]
  lastFed: number
  lastPlayed: number
  lastSlept: number
  lastCleaned: number
}

interface ShopItem {
  id: string
  name: string
  category: "food" | "potion" | "accessory" | "toy"
  price: number
  effect: {
    health?: number
    hunger?: number
    happiness?: number
    energy?: number
    cleanliness?: number
  }
  emoji: string
}

const shopItems: ShopItem[] = [
  // Comida
  { id: "apple", name: "Apple", category: "food", price: 5, effect: { hunger: 15 }, emoji: "🍎" },
  { id: "burger", name: "Burger", category: "food", price: 10, effect: { hunger: 25 }, emoji: "🍔" },
  { id: "pizza", name: "Pizza", category: "food", price: 15, effect: { hunger: 35, happiness: 5 }, emoji: "🍕" },
  { id: "cake", name: "Cake", category: "food", price: 20, effect: { hunger: 20, happiness: 15 }, emoji: "🎂" },

  // Pociones
  { id: "health-potion", name: "Health Potion", category: "potion", price: 25, effect: { health: 40 }, emoji: "🧪" },
  { id: "energy-drink", name: "Energy Drink", category: "potion", price: 20, effect: { energy: 35 }, emoji: "⚡" },
  { id: "happy-potion", name: "Happy Potion", category: "potion", price: 30, effect: { happiness: 40 }, emoji: "😊" },

  // Accesorios
  { id: "hat", name: "Super Hat", category: "accessory", price: 50, effect: { happiness: 10 }, emoji: "🎩" },
  { id: "cape", name: "Hero Cape", category: "accessory", price: 75, effect: { happiness: 15 }, emoji: "🦸" },
  { id: "glasses", name: "Cool Glasses", category: "accessory", price: 40, effect: { happiness: 8 }, emoji: "🕶️" },

  // Juguetes
  { id: "ball", name: "Super Ball", category: "toy", price: 15, effect: { happiness: 20 }, emoji: "⚽" },
  { id: "robot", name: "Robot Toy", category: "toy", price: 35, effect: { happiness: 30 }, emoji: "🤖" },
]

export default function PouStyleGame() {
  const [currentRoom, setCurrentRoom] = useState<"home" | "kitchen" | "bathroom" | "lab" | "wardrobe">("home")
  const [pet, setPet] = useState<Pet>({
    name: "Thunder Pou",
    type: "Electric Hero Pet",
    level: 1,
    health: 80,
    hunger: 60,
    happiness: 70,
    energy: 85,
    cleanliness: 90,
    coins: 100,
    experience: 0,
    mood: "normal",
    accessories: [],
    lastFed: Date.now() - 1800000,
    lastPlayed: Date.now() - 900000,
    lastSlept: Date.now() - 3600000,
    lastCleaned: Date.now() - 2700000,
  })

  const [inventory, setInventory] = useState<{ [key: string]: number }>({
    apple: 2,
    burger: 1,
  })

  const [selectedCategory, setSelectedCategory] = useState<"food" | "potion" | "accessory" | "toy">("food")

  const feedPet = (item: ShopItem) => {
    if (inventory[item.id] > 0) {
      setPet((prev) => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + (item.effect.hunger || 0)),
        health: Math.min(100, prev.health + (item.effect.health || 0)),
        happiness: Math.min(100, prev.happiness + (item.effect.happiness || 0)),
        lastFed: Date.now(),
        experience: prev.experience + 5,
        coins: prev.coins + 3,
      }))

      setInventory((prev) => ({
        ...prev,
        [item.id]: prev[item.id] - 1,
      }))
    }
  }

  const playWithPet = () => {
    setPet((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      energy: Math.max(0, prev.energy - 10),
      lastPlayed: Date.now(),
      experience: prev.experience + 8,
      coins: prev.coins + 5,
    }))
  }

  const cleanPet = () => {
    setPet((prev) => ({
      ...prev,
      cleanliness: Math.min(100, prev.cleanliness + 40),
      happiness: Math.min(100, prev.happiness + 10),
      lastCleaned: Date.now(),
      experience: prev.experience + 6,
      coins: prev.coins + 4,
    }))
  }

  const petSleep = () => {
    setPet((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 50),
      health: Math.min(100, prev.health + 10),
      lastSlept: Date.now(),
      experience: prev.experience + 10,
      coins: prev.coins + 6,
    }))
  }

  const buyItem = (item: ShopItem) => {
    if (pet.coins >= item.price) {
      setPet((prev) => ({ ...prev, coins: prev.coins - item.price }))
      setInventory((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1,
      }))
    }
  }

  const usePotion = (item: ShopItem) => {
    if (inventory[item.id] > 0) {
      setPet((prev) => ({
        ...prev,
        health: Math.min(100, prev.health + (item.effect.health || 0)),
        happiness: Math.min(100, prev.happiness + (item.effect.happiness || 0)),
        energy: Math.min(100, prev.energy + (item.effect.energy || 0)),
        experience: prev.experience + 5,
      }))

      setInventory((prev) => ({
        ...prev,
        [item.id]: prev[item.id] - 1,
      }))
    }
  }

  const wearAccessory = (item: ShopItem) => {
    if (inventory[item.id] > 0 && !pet.accessories.includes(item.id)) {
      setPet((prev) => ({
        ...prev,
        accessories: [...prev.accessories, item.id],
        happiness: Math.min(100, prev.happiness + (item.effect.happiness || 0)),
      }))

      setInventory((prev) => ({
        ...prev,
        [item.id]: prev[item.id] - 1,
      }))
    }
  }

  const playWithToy = (item: ShopItem) => {
    if (inventory[item.id] > 0) {
      setPet((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + (item.effect.happiness || 0)),
        experience: prev.experience + 8,
        coins: prev.coins + 5,
      }))
    }
  }

  const renderRoom = () => {
    switch (currentRoom) {
      case "home":
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {/* Mascota Principal */}
            <div className="relative">
              <div
                className={`w-48 h-48 bg-gradient-to-br ${getPetColor()} rounded-full flex items-center justify-center text-8xl shadow-2xl animate-bounce cursor-pointer hover:scale-105 transition-transform`}
                onClick={playWithPet}
              >
                {getPetEmoji()}
              </div>

              {/* Accesorios */}
              {pet.accessories.length > 0 && (
                <div className="absolute -top-4 -right-4 flex flex-wrap gap-1">
                  {pet.accessories.map((accessoryId) => {
                    const accessory = shopItems.find((item) => item.id === accessoryId)
                    return accessory ? (
                      <span key={accessoryId} className="text-2xl">
                        {accessory.emoji}
                      </span>
                    ) : null
                  })}
                </div>
              )}

              {/* Estado de ánimo */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="capitalize">
                  {pet.mood}
                </Badge>
              </div>
            </div>

            {/* Información de la mascota */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">{pet.name}</h2>
              <p className="text-white/80">{pet.type}</p>
              <p className="text-yellow-300 font-bold">Level {pet.level}</p>
            </div>

            {/* Botones de acción rápida */}
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={playWithPet} className="bg-green-500 hover:bg-green-600" size="lg">
                <Gamepad2 className="mr-2" />
                Play (+5 coins)
              </Button>
              <Button onClick={petSleep} className="bg-purple-500 hover:bg-purple-600" size="lg">
                <Bed className="mr-2" />
                Sleep (+6 coins)
              </Button>
            </div>
          </div>
        )

      case "kitchen":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">🍽️ Kitchen</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {shopItems
                .filter((item) => item.category === "food")
                .map((item) => (
                  <Card key={item.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <p className="text-white/80 text-sm">Own: {inventory[item.id] || 0}</p>
                      <Button
                        onClick={() => feedPet(item)}
                        disabled={!inventory[item.id]}
                        className="w-full mt-2"
                        size="sm"
                      >
                        Feed Pet
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )

      case "bathroom":
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <h2 className="text-2xl font-bold text-white">🛁 Bathroom</h2>
            <div
              className={`w-32 h-32 bg-gradient-to-br ${getPetColor()} rounded-full flex items-center justify-center text-6xl shadow-xl`}
            >
              {getPetEmoji()}
            </div>
            <Button onClick={cleanPet} className="bg-cyan-500 hover:bg-cyan-600" size="lg">
              <Bath className="mr-2" />
              Clean Pet (+4 coins)
            </Button>
          </div>
        )

      case "lab":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">🧪 Laboratory</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {shopItems
                .filter((item) => item.category === "potion")
                .map((item) => (
                  <Card key={item.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <p className="text-white/80 text-sm">Own: {inventory[item.id] || 0}</p>
                      <Button
                        onClick={() => usePotion(item)}
                        disabled={!inventory[item.id]}
                        className="w-full mt-2"
                        size="sm"
                      >
                        Use Potion
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )

      case "wardrobe":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">👕 Wardrobe</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Accessories</h3>
                <div className="space-y-3">
                  {shopItems
                    .filter((item) => item.category === "accessory")
                    .map((item) => (
                      <Card key={item.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <h4 className="font-bold text-white text-sm">{item.name}</h4>
                              <p className="text-white/80 text-xs">Own: {inventory[item.id] || 0}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => wearAccessory(item)}
                            disabled={!inventory[item.id] || pet.accessories.includes(item.id)}
                            size="sm"
                          >
                            Wear
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Toys</h3>
                <div className="space-y-3">
                  {shopItems
                    .filter((item) => item.category === "toy")
                    .map((item) => (
                      <Card key={item.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <h4 className="font-bold text-white text-sm">{item.name}</h4>
                              <p className="text-white/80 text-xs">Own: {inventory[item.id] || 0}</p>
                            </div>
                          </div>
                          <Button onClick={() => playWithToy(item)} disabled={!inventory[item.id]} size="sm">
                            Play
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getPetEmoji = () => {
    switch (pet.mood) {
      case "happy":
        return "😄"
      case "sad":
        return "😢"
      case "tired":
        return "😴"
      case "hungry":
        return "😋"
      case "dirty":
        return "🤢"
      case "sick":
        return "🤒"
      default:
        return "😊"
    }
  }

  const getPetColor = () => {
    switch (pet.mood) {
      case "happy":
        return "from-yellow-400 to-orange-400"
      case "sad":
        return "from-blue-400 to-blue-600"
      case "tired":
        return "from-purple-400 to-purple-600"
      case "hungry":
        return "from-red-400 to-red-600"
      case "dirty":
        return "from-brown-400 to-brown-600"
      case "sick":
        return "from-green-400 to-green-600"
      default:
        return "from-blue-500 to-purple-500"
    }
  }

  // Simulación del paso del tiempo y cambio de humor
  useEffect(() => {
    const interval = setInterval(() => {
      setPet((prevPet) => {
        const now = Date.now()
        const newPet = { ...prevPet }

        // Decrementar stats con el tiempo
        if (now - prevPet.lastFed > 1800000) {
          // 30 min
          newPet.hunger = Math.max(0, prevPet.hunger - 2)
        }

        if (now - prevPet.lastPlayed > 1200000) {
          // 20 min
          newPet.happiness = Math.max(0, prevPet.happiness - 1)
        }

        if (now - prevPet.lastSlept > 3600000) {
          // 1 hora
          newPet.energy = Math.max(0, prevPet.energy - 1)
        }

        if (now - prevPet.lastCleaned > 2700000) {
          // 45 min
          newPet.cleanliness = Math.max(0, prevPet.cleanliness - 1)
        }

        // Determinar humor basado en stats
        if (newPet.health < 30) {
          newPet.mood = "sick"
        } else if (newPet.hunger < 20) {
          newPet.mood = "hungry"
        } else if (newPet.energy < 20) {
          newPet.mood = "tired"
        } else if (newPet.cleanliness < 30) {
          newPet.mood = "dirty"
        } else if (newPet.happiness < 30) {
          newPet.mood = "sad"
        } else if (newPet.happiness > 80 && newPet.health > 80) {
          newPet.mood = "happy"
        } else {
          newPet.mood = "normal"
        }

        // Perder salud si otros stats están muy bajos
        if (newPet.hunger < 10 || newPet.energy < 10 || newPet.cleanliness < 10) {
          newPet.health = Math.max(0, newPet.health - 0.5)
        }

        return newPet
      })
    }, 3000) // Cada 3 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
      {/* Header con stats */}
      <div className="bg-black/20 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          {/* Coins y Level */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 bg-yellow-500/20 rounded-full px-3 py-1">
              <Coins className="text-yellow-400 w-5 h-5" />
              <span className="text-white font-bold">{pet.coins}</span>
            </div>
            <div className="text-white font-bold">
              Level {pet.level} • XP: {pet.experience}
            </div>
          </div>

          {/* Barras de estado */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-white text-sm">Health</span>
              </div>
              <Progress value={pet.health} className="h-2" />
              <span className="text-white text-xs">{Math.round(pet.health)}%</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Hunger</span>
              </div>
              <Progress value={pet.hunger} className="h-2" />
              <span className="text-white text-xs">{Math.round(pet.hunger)}%</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">Happy</span>
              </div>
              <Progress value={pet.happiness} className="h-2" />
              <span className="text-white text-xs">{Math.round(pet.happiness)}%</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm">Energy</span>
              </div>
              <Progress value={pet.energy} className="h-2" />
              <span className="text-white text-xs">{Math.round(pet.energy)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto h-96">{renderRoom()}</div>
      </div>

      {/* Navegación inferior */}
      <div className="bg-black/30 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-2">
            <Button
              variant={currentRoom === "home" ? "default" : "outline"}
              onClick={() => setCurrentRoom("home")}
              className="flex-1 max-w-24"
            >
              <Home className="w-4 h-4" />
            </Button>
            <Button
              variant={currentRoom === "kitchen" ? "default" : "outline"}
              onClick={() => setCurrentRoom("kitchen")}
              className="flex-1 max-w-24"
            >
              <ChefHat className="w-4 h-4" />
            </Button>
            <Button
              variant={currentRoom === "bathroom" ? "default" : "outline"}
              onClick={() => setCurrentRoom("bathroom")}
              className="flex-1 max-w-24"
            >
              <Bath className="w-4 h-4" />
            </Button>
            <Button
              variant={currentRoom === "lab" ? "default" : "outline"}
              onClick={() => setCurrentRoom("lab")}
              className="flex-1 max-w-24"
            >
              <FlaskConical className="w-4 h-4" />
            </Button>
            <Button
              variant={currentRoom === "wardrobe" ? "default" : "outline"}
              onClick={() => setCurrentRoom("wardrobe")}
              className="flex-1 max-w-24"
            >
              <Shirt className="w-4 h-4" />
            </Button>

            {/* Botón de tienda */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 max-w-24 bg-transparent">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>🛒 Shop</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Categorías */}
                  <div className="flex gap-2 flex-wrap">
                    {(["food", "potion", "accessory", "toy"] as const).map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        size="sm"
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* Items de la tienda */}
                  <div className="grid grid-cols-2 gap-4">
                    {shopItems
                      .filter((item) => item.category === selectedCategory)
                      .map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4 text-center">
                            <div className="text-4xl mb-2">{item.emoji}</div>
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{item.price} coins</p>
                            <div className="text-xs text-muted-foreground mb-3">
                              {Object.entries(item.effect).map(([key, value]) => (
                                <div key={key}>
                                  +{value} {key}
                                </div>
                              ))}
                            </div>
                            <Button
                              onClick={() => buyItem(item)}
                              disabled={pet.coins < item.price}
                              size="sm"
                              className="w-full"
                            >
                              Buy
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
