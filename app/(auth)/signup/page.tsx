"use client";
import Link from "next/link";
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#222] via-[#2d2d2d] to-[#3b3b3b] minecraft-block px-1 py-0">
      <form
        onSubmit={handleSubmit}
        className="bg-[#232323] border-4 border-[#bfbfbf] shadow-[8px_8px_0_0_#222] p-0 w-full max-w-xs sm:max-w-md flex flex-col gap-0 relative minecraft-block overflow-hidden"
        style={{ maxWidth: "350px", maxHeight: "98vh", overflowY: "auto" }}
      >
        {/* Pixel header */}
        <div className="w-full bg-gradient-to-r from-green-500 via-lime-400 to-yellow-300 border-b-4 border-[#bfbfbf] py-3 flex flex-col items-center justify-center minecraft-block relative z-10">
          <img src="/gdg-logo.png" alt="GDG Logo" className="h-12 mb-1 minecraft-block" />
          <h2 className="text-2xl font-extrabold text-center text-white drop-shadow font-minecraft tracking-tight">Join GDG GENESIS</h2>
        </div>
        {/* Info box */}
        <div className="w-full bg-yellow-100/90 border-b-4 border-yellow-400 text-yellow-900 text-center text-xs font-minecraft py-2 px-2 drop-shadow font-bold">
          Sign up to start your GDG Maze Quest adventure!
        </div>
        <div className="flex flex-col gap-1 px-4 pt-4 pb-2">
          <label htmlFor="rollNumber" className="text-xs font-bold text-yellow-200 font-minecraft">Roll Number</label>
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
        <div className="flex flex-col gap-1 px-4 pb-2">
          <label htmlFor="name" className="text-xs font-bold text-yellow-200 font-minecraft">Name</label>
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
        <div className="flex flex-col gap-1 px-4 pb-2">
          <label htmlFor="email" className="text-xs font-bold text-yellow-200 font-minecraft">Email</label>
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
        <div className="flex flex-col gap-1 px-4 pb-4">
          <label htmlFor="password" className="text-xs font-bold text-yellow-200 font-minecraft">Password</label>
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
        <div className="px-4 pb-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-bold py-2 shadow-[4px_4px_0_0_#222] border-2 border-[#bfbfbf] rounded-none transition-all duration-200 active:scale-95 font-minecraft minecraft-block text-base"
          >
            Sign Up
          </button>
        </div>
        {/* Sign-in link inside form */}
        <div className="w-full flex flex-col items-center mb-2">
          <div className=" rounded-none px-4 py-2 text-xs sm:text-sm text-green-200 font-minecraft  text-center">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="text-yellow-300 underline underline-offset-2 hover:text-yellow-400 font-bold font-minecraft  transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </div>
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
