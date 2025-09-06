"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Dice6,
  Bomb,
} from "lucide-react";

import GameModal from "@/components/game-modal";
import games from "@/lib/games.json";
import { useRouter } from "next/navigation";
// Types for the maze system
type CellType = "wall" | "path" | "game" | "player";
type Position = { x: number; y: number };

interface MazeCell {
  type: CellType;
  isGameNode: boolean;
  isDiscovered: boolean;
  hasPlayer: boolean;
  gameId?: string | number;
}

interface GameState {
  playerPosition: Position;
  maze: MazeCell[][];
  discoveredGames: number;
  totalGames: number;
  showGameModal: boolean;
  currentGameNode: { x: number; y: number; gameId?: string } | null;
}

const GRID_SIZE = 15; // 15x15 grid for good mobile experience

const GAME_DISCOVERIES = [
  {
    icon: Gamepad2,
    title: "Secret Challenge Discovered!",
    description:
      "You've found a hidden arcade game! Test your skills and see if you can beat the high score.",
    color: "text-purple-400",
  },
  {
    icon: Dice6,
    title: "Mystery Game Found!",
    description:
      "A dice-based puzzle awaits! Roll your way to victory in this game of chance and strategy.",
    color: "text-blue-400",
  },
  {
    icon: Bomb,
    title: "Explosive Game Located!",
    description:
      "BOOM! You've triggered an explosive mini-game! Can you defuse the situation and claim victory?",
    color: "text-red-400",
  },
];

const MINECRAFT_WALL_COLORS = [
  "bg-stone-600", // Stone
  "bg-stone-700", // Cobblestone
  "bg-gray-600", // Andesite
  "bg-stone-500", // Stone variant
];

const MazeCell = memo(
  ({ cell, x, y }: { cell: MazeCell; x: number; y: number }) => {
    const cellClasses = useMemo(() => {
      let classes =
        "aspect-square transition-all duration-300 relative overflow-hidden ";

      if (cell.type === "wall") {
        const colorIndex = (x + y) % MINECRAFT_WALL_COLORS.length;
        const blockColor = MINECRAFT_WALL_COLORS[colorIndex];
        classes += `${blockColor} minecraft-block border border-black/30 shadow-inner `;
      } else {
        classes += "bg-green-600 minecraft-block border border-green-700 ";
      }

      if (cell.hasPlayer) {
        classes =
          "aspect-square bg-blue-500 minecraft-block border border-blue-700 shadow-lg relative overflow-hidden transition-all duration-300 ";
      } else if (cell.isGameNode) {
        if (cell.isDiscovered) {
          classes =
            "aspect-square bg-gradient-to-br from-cyan-300 to-cyan-500 minecraft-block border border-cyan-600 shadow-xl relative overflow-hidden transition-all duration-300 ";
        } else {
          classes += "hover:bg-green-500 cursor-pointer ";
        }
      }

      return classes;
    }, [cell.type, cell.hasPlayer, cell.isGameNode, cell.isDiscovered, x, y]);

    return (
      <div className={cellClasses}>
        {cell.type === "wall" && (
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-px">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/10 border-r border-b border-black/20"
                />
              ))}
            </div>
          </div>
        )}

        {cell.type === "path" && !cell.hasPlayer && !cell.isGameNode && (
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full">
              <div className="absolute top-0 left-0 w-1 h-1 bg-green-400 rounded-full" />
              <div className="absolute top-1 right-1 w-1 h-1 bg-green-300 rounded-full" />
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-green-400 rounded-full" />
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-green-300 rounded-full" />
            </div>
          </div>
        )}

        {cell.hasPlayer && (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="w-6 h-6 bg-orange-300 border border-orange-400 relative">
              <div className="w-1 h-1 bg-black absolute top-1 left-1" />
              <div className="w-1 h-1 bg-black absolute top-1 right-1" />
              <div className="w-2 h-1 bg-pink-400 absolute bottom-1 left-1/2 transform -translate-x-1/2" />
            </div>
          </div>
        )}

        {/* Highlight all game node cells at the start, not just after discovery */}
        {cell.isGameNode && !cell.hasPlayer && (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-1 bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 border-2 border-yellow-600 animate-pulse opacity-80" />
            {cell.isDiscovered ? (
              <>
                <div className="absolute inset-1 bg-gradient-to-br from-red-400 via-orange-500 to-yellow-400 border border-red-600 animate-pulse">
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Explosion particles */}
                    <div
                      className="absolute top-0 left-0 w-1 h-1 bg-yellow-300 rounded-full animate-ping"
                      style={{ animationDelay: "0s" }}
                    />
                    <div
                      className="absolute top-1 right-0 w-1 h-1 bg-orange-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="absolute bottom-0 left-1 w-1 h-1 bg-red-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div
                      className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.6s" }}
                    />
                    <div
                      className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping transform -translate-x-1/2 -translate-y-1/2"
                      style={{ animationDelay: "0.8s" }}
                    />
                  </div>
                </div>
                <Bomb
                  className="w-4 h-4 text-red-800 animate-bounce relative z-10"
                  style={{ animationDuration: "1s" }}
                />
              </>
            ) : (
              <div className="w-1.5 h-1.5 bg-yellow-600 border border-yellow-700 opacity-60 animate-pulse z-10" />
            )}
          </div>
        )}
      </div>
    );
  },
);

MazeCell.displayName = "MazeCell";

export default function MazeGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mazeGameState");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch { }
      }
    }
    return {
      playerPosition: { x: 1, y: 1 },
      maze: [],
      discoveredGames: 0,
      totalGames: 0,
      showGameModal: false,
      currentGameNode: null,
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("maze-token");
      if (!token) {
        router.push("/signin");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isGameCompleted = localStorage.getItem("isGameCompleted");
      if (isGameCompleted === "1") {
        router.push("/");
      }
    }
  }, []);

  const initialMaze = useMemo((): MazeCell[][] => {
    // Try to load maze game node positions from localStorage
    const savedGameNodes =
      typeof window !== "undefined"
        ? localStorage.getItem("mazeGameNodes")
        : null;
    let maze: MazeCell[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => ({
            type: "wall" as CellType,
            isGameNode: false,
            isDiscovered: false,
            hasPlayer: false,
          })),
      );

    // Create paths using a simple maze generation
    for (let i = 1; i < GRID_SIZE - 1; i += 2) {
      for (let j = 1; j < GRID_SIZE - 1; j += 2) {
        maze[i][j].type = "path";
      }
    }
    for (let i = 1; i < GRID_SIZE - 1; i += 2) {
      for (let j = 2; j < GRID_SIZE - 1; j += 2) {
        if (Math.random() > 0.3) {
          maze[i][j].type = "path";
        }
      }
    }
    for (let i = 2; i < GRID_SIZE - 1; i += 2) {
      for (let j = 1; j < GRID_SIZE - 1; j += 2) {
        if (Math.random() > 0.3) {
          maze[i][j].type = "path";
        }
      }
    }

    if (savedGameNodes) {
      // Restore game node positions
      try {
        const gameNodes: { x: number; y: number; gameId?: string | number }[] =
          JSON.parse(savedGameNodes);
        for (const pos of gameNodes) {
          if (
            maze[pos.y] &&
            maze[pos.y][pos.x] &&
            maze[pos.y][pos.x].type === "path"
          ) {
            maze[pos.y][pos.x].isGameNode = true;
            if (pos.gameId) maze[pos.y][pos.x].gameId = pos.gameId;
          }
        }
      } catch (e) {
        // If parsing fails, fallback to random placement below
      }
    } else {
      // Place game nodes randomly on path cells
      const pathCells: Position[] = [];
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (maze[i][j].type === "path" && !(i === 1 && j === 1)) {
            pathCells.push({ x: j, y: i });
          }
        }
      }
      // Use the games.json list for gameIds
      const gameNodeCount = Math.min(games.length, pathCells.length);
      const shuffled = pathCells.sort(() => Math.random() - 0.5);
      const gameNodes: { x: number; y: number; gameId: string | number }[] = [];
      for (let i = 0; i < gameNodeCount; i++) {
        const pos = shuffled[i];
        maze[pos.y][pos.x].isGameNode = true;
        const gameId = games[i].gameId;
        maze[pos.y][pos.x].gameId = gameId;
        gameNodes.push({ ...pos, gameId });
      }
      // Save game node positions to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("mazeGameNodes", JSON.stringify(gameNodes));
      }
    }

    // Set player starting position
    maze[1][1].hasPlayer = true;
    maze[1][1].type = "path";

    return maze;
  }, []); // Only run once

  // On first load, if no maze in state, initialize it
  useEffect(() => {
    if (!gameState.maze || gameState.maze.length === 0) {
      const totalGames = initialMaze
        .flat()
        .filter((cell) => cell.isGameNode).length;
      setGameState({
        playerPosition: { x: 1, y: 1 },
        maze: initialMaze,
        discoveredGames: 0,
        totalGames,
        showGameModal: false,
        currentGameNode: null,
      });
    }
    // eslint-disable-next-line
  }, [initialMaze]);

  // Persist game state to localStorage on every change
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      gameState &&
      gameState.maze &&
      gameState.maze.length > 0
    ) {
      localStorage.setItem("mazeGameState", JSON.stringify(gameState));
    }
  }, [gameState]);

  const movePlayer = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      setGameState((prevState) => {
        const { playerPosition, maze } = prevState;
        let newX = playerPosition.x;
        let newY = playerPosition.y;

        switch (direction) {
          case "up":
            newY = Math.max(0, playerPosition.y - 1);
            break;
          case "down":
            newY = Math.min(GRID_SIZE - 1, playerPosition.y + 1);
            break;
          case "left":
            newX = Math.max(0, playerPosition.x - 1);
            break;
          case "right":
            newX = Math.min(GRID_SIZE - 1, playerPosition.x + 1);
            break;
        }

        // Check if the new position is valid (not a wall)
        if (
          maze[newY] &&
          maze[newY][newX] &&
          maze[newY][newX].type !== "wall"
        ) {
          const newMaze = maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (
                rowIndex === playerPosition.y &&
                colIndex === playerPosition.x
              ) {
                return { ...cell, hasPlayer: false };
              }
              if (rowIndex === newY && colIndex === newX) {
                return { ...cell, hasPlayer: true };
              }
              return cell;
            }),
          );

          let discoveredGames = prevState.discoveredGames;
          let showGameModal = false;
          let currentGameNode = null;

          if (
            newMaze[newY][newX].isGameNode &&
            !newMaze[newY][newX].isDiscovered
          ) {
            newMaze[newY][newX].isDiscovered = true;
            discoveredGames++;
            showGameModal = true;
            currentGameNode = {
              x: newX,
              y: newY,
              gameId:
                newMaze[newY][newX].gameId !== undefined
                  ? String(newMaze[newY][newX].gameId)
                  : undefined,
            };
          }

          return {
            ...prevState,
            playerPosition: { x: newX, y: newY },
            maze: newMaze,
            discoveredGames,
            showGameModal,
            currentGameNode,
          };
        }

        return prevState;
      });
    },
    [],
  );

  const movePlayerSafe = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (gameState.showGameModal) {
        return;
      }
      movePlayer(direction);
    },
    [movePlayer, gameState.showGameModal],
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.showGameModal) {
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          movePlayer("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          movePlayer("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          movePlayer("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          movePlayer("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [movePlayer, gameState.showGameModal]); // Added gameState.showGameModal to dependencies

  const closeGameModal = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      showGameModal: false,
      currentGameNode: null,
    }));
  }, []);

  const randomGameDiscovery = useMemo(() => {
    return GAME_DISCOVERIES[
      Math.floor(Math.random() * GAME_DISCOVERIES.length)
    ];
  }, [gameState.currentGameNode]);

  const handleGameSubmit = async () => {
    const token = localStorage.getItem("maze-token");
    const userScore = localStorage.getItem("score") || "0";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scores/submit-score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token bhejna header me
          },
          body: JSON.stringify({ score: userScore }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        router.push("/ending");
        console.log("Score submitted successfully:", data);
        localStorage.setItem("isGameCompleted", "1");
      }
    } catch (err) {
      console.log("error submitting the game", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center space-y-8 p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 left-10 w-8 h-8 bg-stone-600 minecraft-block opacity-30 animate-bounce border border-stone-700"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-20 right-20 w-6 h-6 bg-green-600 minecraft-block opacity-25 animate-bounce border border-green-700"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
        <div
          className="absolute bottom-20 left-20 w-10 h-10 bg-amber-700 minecraft-block opacity-20 animate-bounce border border-amber-800"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-10 right-10 w-7 h-7 bg-stone-500 minecraft-block opacity-35 animate-bounce border border-stone-600"
          style={{ animationDelay: "3s", animationDuration: "4.5s" }}
        />
      </div>

      {/* Primary floating blocks layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 left-10 w-8 h-8 bg-stone-600 minecraft-block opacity-30 animate-bounce border border-stone-700 shadow-lg"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-20 right-20 w-6 h-6 bg-green-600 minecraft-block opacity-25 animate-bounce border border-green-700 shadow-md"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
        <div
          className="absolute bottom-20 left-20 w-10 h-10 bg-amber-700 minecraft-block opacity-20 animate-bounce border border-amber-800 shadow-xl"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-10 right-10 w-7 h-7 bg-stone-500 minecraft-block opacity-35 animate-bounce border border-stone-600 shadow-lg"
          style={{ animationDelay: "3s", animationDuration: "4.5s" }}
        />
      </div>

      {/* Secondary particle layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div
          className="absolute top-16 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
          style={{ animationDelay: "0.5s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"
          style={{ animationDelay: "1.8s", animationDuration: "2.5s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"
          style={{ animationDelay: "3.2s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping"
          style={{ animationDelay: "2.1s", animationDuration: "3.5s" }}
        />
      </div>

      {/* Ambient light effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-blue-300/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-indigo-400/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-sky-300/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "4s" }}
        />
      </div>

      {/* Floating cloud-like elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div
          className="absolute top-12 left-0 w-32 h-8 bg-white/30 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "0s", animationDuration: "7s" }}
        />
        <div
          className="absolute top-32 right-0 w-24 h-6 bg-white/25 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "3s", animationDuration: "9s" }}
        />
        <div
          className="absolute bottom-24 left-1/4 w-28 h-7 bg-white/20 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "5s", animationDuration: "8s" }}
        />
      </div>

      <div className="text-center space-y-4 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl py-5 font-serif font-bold text-white drop-shadow-2xl text-balance">
          Maze of mysteries
        </h1>
        {/* <p className="text-sm text-blue-100 font-sans text-pretty max-w-2xl px-4">
          Navigate through the blocky world and discover hidden treasures!
        </p> */}
      </div>

      {/* <div className="bg-stone-800/90 backdrop-blur-sm rounded-lg p-6 border-2 border-stone-600 shadow-2xl relative z-10">
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-stone-600 minecraft-block opacity-20 animate-bounce border border-stone-700" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-stone-600 minecraft-block opacity-20 animate-bounce border border-stone-700" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-stone-600 minecraft-block opacity-20 animate-bounce border border-stone-700" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-stone-600 minecraft-block opacity-20 animate-bounce border border-stone-700" />

        <p className="text-white text-center font-sans text-lg font-semibold">
          Treasures Found: <span className="font-bold text-cyan-400 text-xl">{gameState.discoveredGames}</span> /{" "}
          <span className="text-green-400 text-xl">{gameState.totalGames}</span>
        </p>
      </div> */}
      <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-200 via-amber-100 to-green-200 border-4 border-yellow-600 shadow-xl rounded-lg px-6 py-3 minecraft-block relative z-10">
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-cyan-700 rounded minecraft-block flex items-center justify-center shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="mx-auto"
            >
              <rect
                x="2"
                y="2"
                width="16"
                height="16"
                rx="3"
                fill="#22d3ee"
                stroke="#0e7490"
                strokeWidth="2"
              />
              <rect
                x="6"
                y="6"
                width="8"
                height="8"
                rx="2"
                fill="#a7f3d0"
                stroke="#059669"
                strokeWidth="1"
              />
            </svg>
          </span>
          <span className="font-bold text-cyan-700 text-xl drop-shadow">
            {gameState.discoveredGames}
          </span>
        </div>
        <span className="font-bold text-lg text-stone-700">/</span>
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 bg-gradient-to-br from-green-400 to-green-600 border-2 border-green-700 rounded minecraft-block flex items-center justify-center shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="mx-auto"
            >
              <rect
                x="2"
                y="2"
                width="16"
                height="16"
                rx="3"
                fill="#22c55e"
                stroke="#166534"
                strokeWidth="2"
              />
              <rect
                x="6"
                y="6"
                width="8"
                height="8"
                rx="2"
                fill="#bbf7d0"
                stroke="#22c55e"
                strokeWidth="1"
              />
            </svg>
          </span>
          <span className="font-bold text-green-700 text-xl drop-shadow">
            {gameState.totalGames}
          </span>
        </div>
        <Button
          onClick={() => {
            if (typeof window !== "undefined") {
              // Remove everything from localStorage except 'token'
              const token = localStorage.getItem("maze-token");
              localStorage.clear();
              if (token !== null) {
                localStorage.setItem("maze-token", token);
              }
              window.location.reload();
            }
          }}
          variant="destructive"
          size="sm"
          className="ml-4 bg-red-600 border-2 border-red-800 text-white font-bold text-base px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-95 active:scale-90 minecraft-block"
        >
          Reset Game
        </Button>
      </div>

      <div
        className="grid gap-px relative z-10 w-full"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          maxWidth: "min(98vw, 95vh, 900px)",
          aspectRatio: "1",
        }}
      >
        {gameState.maze.map((row, y) =>
          row.map((cell, x) => (
            <MazeCell key={`${x}-${y}`} cell={cell} x={x} y={y} />
          )),
        )}
      </div>

      <div className="flex items-center justify-center space-x-4 relative z-10">
        <Button
          onClick={() => movePlayerSafe("left")}
          variant="outline"
          size="lg"
          className="bg-stone-600 border-2 border-stone-800 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-95 active:scale-90 minecraft-block"
          disabled={gameState.showGameModal}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          onClick={() => movePlayerSafe("up")}
          variant="outline"
          size="lg"
          className="bg-stone-600 border-2 border-stone-800 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-95 active:scale-90 minecraft-block"
          disabled={gameState.showGameModal}
        >
          <ChevronUp className="w-8 h-8" />
        </Button>

        <Button
          onClick={() => movePlayerSafe("down")}
          variant="outline"
          size="lg"
          className="bg-stone-600 border-2 border-stone-800 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-95 active:scale-90 minecraft-block"
          disabled={gameState.showGameModal}
        >
          <ChevronDown className="w-8 h-8" />
        </Button>

        <Button
          onClick={() => movePlayerSafe("right")}
          variant="outline"
          size="lg"
          className="bg-stone-600 border-2 border-stone-800 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-95 active:scale-90 minecraft-block"
          disabled={gameState.showGameModal}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>

        {/* <Button
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('mazeGameState');
              localStorage.removeItem('mazeGameNodes');
              window.location.reload();
            }
          }}
          variant="destructive"
          size="lg"
          className="ml-4 bg-red-600 border-2 border-red-800 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-95 active:scale-90 minecraft-block"
        >
          Reset Game
        </Button> */}
      </div>

      {/* Submit button when all treasures are found */}
      {/* {gameState.discoveredGames === gameState.totalGames &&
        gameState.totalGames > 0 && ( */}
      <div className="flex justify-center mt-8">
        <Button
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-4 px-10 text-2xl shadow-2xl border-4 border-green-800 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-green-400/40 active:scale-95 minecraft-block"
          onClick={handleGameSubmit}
        >
          Submit
        </Button>
      </div>
      {/* )} */}

      <div className="text-center text-white/90 font-sans max-w-md relative z-10 bg-stone-800/20 backdrop-blur-sm rounded-lg p-6 border-2 border-stone-600/30">
        {/* Maze-style two-color gradient background */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none -z-10">
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-700 opacity-85" />
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.22 }}
          >
            <defs>
              <pattern
                id="mazeLines"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="24" height="24" fill="none" />
                <path
                  d="M0 0h24v24H0V0zm6 0v18h12V6H6zm12 12h6v6H18v-6zm-12 6h6v6H6v-6z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  opacity="0.13"
                />
              </pattern>
            </defs>
            <rect width="300" height="100" fill="url(#mazeLines)" />
          </svg>
        </div>
        <p className="leading-relaxed text-lg drop-shadow-lg">
          Use the stone buttons or keyboard arrow keys to move.
        </p>
        <p className="leading-relaxed text-lg drop-shadow-lg">
          Find all the hidden diamond blocks in the world!
        </p>
      </div>

      {/* Modal separated into its own component */}
      <GameModal
        show={gameState.showGameModal}
        randomGameDiscovery={randomGameDiscovery}
        onClose={closeGameModal}
        gameId={gameState.currentGameNode?.gameId as string}
      />
    </div>
  );
}
