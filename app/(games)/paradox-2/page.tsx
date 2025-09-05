"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Riddle1Page() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const [count, setCount] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("paradox2_attempts");
      return stored ? parseInt(stored) : 3;
    }
    return 3;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score: number = parseInt(localStorage.getItem("score") || "0");
    let attempts = count;
    const answer = input.trim().toLowerCase().replace(/\s+/g, "");
    if (["mahatmagandhi"].includes(answer)) {
      localStorage.setItem("score", JSON.stringify(score + 1));
      localStorage.removeItem("paradox2_attempts");
      router.push("/");
    } else {
      alert("Incorrect Answer. Please Try Again.");
      attempts = count - 1;
      setCount(attempts);
      localStorage.setItem("paradox2_attempts", attempts.toString());
      if (attempts === 0) {
        localStorage.setItem("score", JSON.stringify(score - 1));
        localStorage.removeItem("paradox2_attempts");
        router.push("/");
      }
    }
    console.log(localStorage);
  };

  return (
    <main className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-[#222] via-[#2d2d2d] to-[#3b3b3b] text-white m-0 p-0 z-[9999] minecraft-block overflow-auto px-2 sm:px-0">
      <div
        className="w-full max-w-md sm:max-w-md mx-auto bg-[#232323] border-4 border-[#bfbfbf] shadow-[8px_8px_0_0_#222] p-4 sm:p-8 flex flex-col items-center relative overflow-y-auto minecraft-block"
        style={{ maxHeight: "90vh" }}
      >
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#bfbfbf] border-2 border-[#222] rounded-none minecraft-block" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#bfbfbf] border-2 border-[#222] rounded-none minecraft-block" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-green-400 drop-shadow mb-2 z-10 font-minecraft">
          GDG Genesis
        </h2>
        <div className="mb-4 w-full flex flex-col items-center">
          <img
            src="/paradox2.png"
            alt="Riddle"
            className="max-w-full h-auto rounded-lg border-2 border-[#bfbfbf] shadow-md mb-2"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center z-10"
        >
          <label
            htmlFor="riddle-input"
            className="text-center mb-3 text-yellow-200 font-minecraft"
          >
            You have <span className="font-bold text-yellow-400">{count}</span>{" "}
            attempts to answer so answer wisely{" "}
            <span className="block text-xs text-yellow-400">
              (Ensure there are no spaces)
            </span>
          </label>
          <input
            id="riddle-input"
            type="text"
            value={input}
            placeholder="Enter your answer here"
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border-2 border-[#bfbfbf] bg-[#181818] text-green-200 text-base sm:text-lg mb-4 font-minecraft focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 transition-all minecraft-block"
            autoComplete="off"
          />
          <button
            type="submit"
            className="w-full py-2 sm:py-3 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-bold text-base sm:text-lg shadow-[4px_4px_0_0_#222] border-2 border-[#bfbfbf] rounded-none transition-all duration-200 active:scale-95 font-minecraft minecraft-block"
          >
            Submit
          </button>
        </form>
      </div>
      <style jsx global>{`
        .minecraft-block {
          font-family: "Press Start 2P", "VT323", "Minecraftia", monospace;
          letter-spacing: 0.5px;
        }
        .font-minecraft {
          font-family: "Press Start 2P", "VT323", "Minecraftia", monospace;
        }
      `}</style>
    </main>
  );
}
