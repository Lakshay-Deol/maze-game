import { Gamepad2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

interface GameModalProps {
  show: boolean
  randomGameDiscovery: {
    icon: React.ElementType
    title: string
    description: string
    color: string
  }
  onClose: () => void
  gameId?: string | number
}

const GameModal: React.FC<GameModalProps> = ({ show, randomGameDiscovery, onClose, gameId }) => {
  if (!show) return null
  console.log(gameId);
  const IconComponent = randomGameDiscovery.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-800 shadow-2xl w-full max-w-sm sm:max-w-md mx-4 relative overflow-hidden minecraft-block rounded-lg">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)`,
            }}
          />
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 relative z-10">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg border-4 border-cyan-700 shadow-2xl relative minecraft-block transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-2 bg-gradient-to-br from-cyan-200 to-cyan-400 border border-cyan-500">
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-px">
                    <div className="bg-cyan-100 border-r border-b border-cyan-300" />
                    <div className="bg-cyan-200 border-b border-cyan-300" />
                    <div className="bg-cyan-200 border-r border-cyan-300" />
                    <div className="bg-cyan-300" />
                  </div>
                </div>
                <IconComponent className="w-8 h-8 sm:w-12 sm:h-12 text-white relative z-10 drop-shadow-lg" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-900 text-balance leading-tight px-2">
              {randomGameDiscovery.title}
            </h2>

            <p className="text-amber-800 font-sans text-pretty leading-relaxed text-sm sm:text-base md:text-lg px-2">
              {randomGameDiscovery.description}
            </p>
            {gameId && (
              <div className="mt-2 text-xs text-stone-500 font-mono">Game ID: <span className="font-bold">{gameId}</span></div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col space-y-2 sm:space-y-3 pt-3 sm:pt-4">
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 sm:py-4 text-base sm:text-lg shadow-xl border-4 border-green-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 minecraft-block font-sans relative overflow-hidden"
              onClick={onClose}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-1000" />
              <div className="relative z-10 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Play Game
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full border-4 border-stone-600 text-stone-700 hover:bg-stone-100 bg-amber-50 py-2.5 sm:py-3 text-sm sm:text-base font-sans font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:border-stone-700 minecraft-block"
              onClick={onClose}
            >
              <div className="relative z-10 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                Continue Mining
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameModal
