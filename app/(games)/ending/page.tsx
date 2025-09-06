"use client";
import React, { useEffect } from "react";
// @ts-ignore
import GameNo from "../../components/game-id.json";

export default function EndingPage() {
  const GDGDots = () => (
    <div className="flex justify-center gap-3 mb-6">
      <div className="w-5 h-5 rounded-full bg-[#4285F4]" /> {/* Blue */}
      <div className="w-5 h-5 rounded-full bg-[#EA4335]" /> {/* Red */}
      <div className="w-5 h-5 rounded-full bg-[#FBBC05]" /> {/* Yellow */}
      <div className="w-5 h-5 rounded-full bg-[#34A853]" /> {/* Green */}
    </div>
  );

  return (
    <main className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-[#222] via-[#2d2d2d] to-[#3b3b3b] text-white m-0 p-0 z-[9999] minecraft-block overflow-auto px-2 sm:px-0">
      <div
        className="w-full max-w-md sm:max-w-md mx-auto bg-[#232323] border-4 border-[#bfbfbf] shadow-[8px_8px_0_0_#222] p-6 sm:p-10 flex flex-col items-center relative overflow-y-auto minecraft-block"
        style={{ maxHeight: "90vh" }}
      >
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#bfbfbf] border-2 border-[#222] rounded-none minecraft-block" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#bfbfbf] border-2 border-[#222] rounded-none minecraft-block" />
        {/* GDG Dots */}
        <GDGDots />
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-400 drop-shadow mb-2 z-10 font-minecraft">
          Thank You!
        </h1>
        <h2 className="text-lg sm:text-xl font-medium text-green-200 mb-6 z-10 font-minecraft">
          You’ve successfully completed{" "}
          <span className="text-green-300 font-semibold">
            GDG Genesis Round 2
          </span>
        </h2>
        {/* Message */}
        <p className="text-green-200 mb-8 font-minecraft text-center">
          🎉We appreciate your participation and effort.<
          br />
          Stay connected with {"<"}
          <span className="font-semibold text-yellow-300">Google Developer Groups</span>.
        </p>
        <a
          href="https://www.instagram.com/nith_gdgl?igsh=MXNkODU4bGh1eGo1NQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full"
        >
          <button className="w-full py-3 sm:py-4 bg-gradient-to-r from-ypink450 to-ypink670 hover:from-ypink560 hover:to-ypink780 text-y-hitefont-bold text-lg shadow-[4px_4px_0_0_#b222 border-2 border-4[#bfbfbf]rounded-lnonetransition-all duration-200 active:scale-95 font-minecraft minecraft-block">
            Follow Insta to Stay Updated
          </button>
        </a>
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
