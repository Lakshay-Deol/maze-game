"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isGameCompleted = localStorage.getItem("isGameCompleted");
      if (isGameCompleted === "1") {
        router.push("/ending");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://maze-backend-tazh.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      console.log(data);
      localStorage.setItem("maze-token", data.token);
      router.push("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#222] via-[#2d2d2d] to-[#3b3b3b] minecraft-block px-1">
      <form
        onSubmit={handleSubmit}
        className="bg-[#232323] border-4 border-[#bfbfbf] shadow-[8px_8px_0_0_#222] p-3 sm:p-5 w-full max-w-xs sm:max-w-md flex flex-col gap-3 relative minecraft-block"
        style={{ maxWidth: "340px", maxHeight: "98vh", overflowY: "auto" }}
      >
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#bfbfbf] border-2 border-[#222] rounded-none minecraft-block" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#bfbfbf] border-2 border-[#222] rounded-none minecraft-block" />
        <div className="flex justify-center mb-3">
          <img
            src="/gdg-logo.png"
            alt="GDG Logo"
            className="h-14 minecraft-block"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-center text-green-400 mb-2 drop-shadow font-minecraft">
          Join GDG GENESIS
        </h2>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="rollNumber"
            className="text-xs font-bold text-yellow-200 font-minecraft"
          >
            Roll Number
          </label>
          <input
            type="text"
            name="rollNumber"
            id="rollNumber"
            placeholder="Enter your roll number"
            value={formData.rollNumber}
            onChange={handleChange}
            required
            className="border-2 border-[#bfbfbf] bg-[#181818] text-green-200 text-sm mb-1 font-minecraft px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 transition-all minecraft-block"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="text-xs font-bold text-yellow-200 font-minecraft"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border-2 border-[#bfbfbf] bg-[#181818] text-green-200 text-sm mb-1 font-minecraft px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 transition-all minecraft-block"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs font-bold text-yellow-200 font-minecraft"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border-2 border-[#bfbfbf] bg-[#181818] text-green-200 text-sm mb-1 font-minecraft px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 transition-all minecraft-block"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-xs font-bold text-yellow-200 font-minecraft"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border-2 border-[#bfbfbf] bg-[#181818] text-green-200 text-sm mb-1 font-minecraft px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 transition-all minecraft-block"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-bold py-2 shadow-[4px_4px_0_0_#222] border-2 border-[#bfbfbf] rounded-none transition-all duration-200 active:scale-95 font-minecraft minecraft-block text-base"
        >
          Sign Up
        </button>
      </form>
      <style jsx global>{`
        .minecraft-block {
          font-family: "Press Start 2P", "VT323", "Minecraftia", monospace;
          letter-spacing: 0.5px;
        }
        .font-minecraft {
          font-family: "Press Start 2P", "VT323", "Minecraftia", monospace;
        }
      `}</style>
    </div>
  );
};

export default Signup;
