"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ImageObject {
  name: string;
  isCampus: boolean;
}

interface TimeLimits {
  [key: number]: number;
}

const CampusVerificationSystem: React.FC = () => {
  useEffect(() => {
    localStorage.setItem("campus", "true");
  }, []);
  const router = useRouter();
  // State management
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<ImageObject[]>([]);
  const [allCampusImages, setAllCampusImages] = useState<string[]>([]);
  const [allExternalImages, setAllExternalImages] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);
  const [chances, setChances] = useState<number>(3);

  // Constants
  const pointsPerCorrect = 5;
  const timeLimits: TimeLimits = { 1: 180, 2: 360 };

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generic function to load images from JSON
  const loadImages = async (type: "campus" | "external"): Promise<string[]> => {
    try {
      console.log(`Fetching: ${type}_images/list.json`);
      const response = await fetch(`${type}_images/list.json`);
      console.log(`Response status for ${type}:`, response.status);
      if (!response.ok) throw new Error(`${type} list.json not found`);
      const imageNames = await response.json();
      console.log(`${type} images loaded:`, imageNames);
      return imageNames;
    } catch (error) {
      console.error(`Error loading ${type} images:`, error);
      alert(`Failed to load ${type} image lists. Check your folder structure.`);
      return [];
    }
  };

  // Initialize image lists
  useEffect(() => {
    const initializeImageLists = async () => {
      try {
        const [campusList, externalList] = await Promise.all([
          loadImages("campus"),
          loadImages("external"),
        ]);
        setAllCampusImages(campusList);
        setAllExternalImages(externalList);
      } catch (err) {
        console.error("Failed to initialize image lists:", err);
      }
    };

    initializeImageLists();
  }, []);

  // Utility functions
  const getRandomImages = (array: string[], count: number): string[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Timer functions
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // Decrease score in localStorage on timeout
            const prevScore = Number(localStorage.getItem("score")) || 0;
            localStorage.setItem("score", String(prevScore - 1));
            // Redirect to home page on timeout
            router.push("/");
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
  }, [timeRemaining, currentLevel, totalPoints, router]);

  useEffect(() => {
    if (timeRemaining > 0) {
      startTimer();
    }
    return () => stopTimer();
  }, [timeRemaining, startTimer, stopTimer]);

  // Load level function
  const loadLevel = useCallback(() => {
    setSelectedImages([]);
    stopTimer();

    let campusCount: number, externalCount: number;
    if (currentLevel === 1) {
      campusCount = 3;
      externalCount = 6;
    } else {
      campusCount = 6;
      externalCount = 10;
    }

    const campusImages = getRandomImages(allCampusImages, campusCount);
    const externalImages = getRandomImages(allExternalImages, externalCount);
    const images: ImageObject[] = [
      ...campusImages.map((i) => ({ name: i, isCampus: true })),
      ...externalImages.map((i) => ({ name: i, isCampus: false })),
    ];

    setCurrentImages(shuffleArray(images));
    setTimeRemaining(timeLimits[currentLevel]);
  }, [currentLevel, allCampusImages, allExternalImages, stopTimer]);

  // Load level when dependencies change
  useEffect(() => {
    if (allCampusImages.length > 0 && allExternalImages.length > 0) {
      loadLevel();
    }
  }, [currentLevel, allCampusImages, allExternalImages, loadLevel]);

  // Modal functions
  const showModalDialog = (
    title: string,
    message: string,
    callback?: () => void,
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
    setModalCallback(() => callback || null);
  };

  const hideModal = () => {
    setShowModal(false);
    if (modalCallback) {
      modalCallback();
      setModalCallback(null);
    }
  };

  // Selection functions
  const toggleSelection = (index: number) => {
    setSelectedImages((prev) => {
      let newSelection = [...prev];
      if (currentLevel === 1 && !prev.includes(index)) {
        newSelection = [index]; // Only one selection for level 1 (now 3 images)
      } else if (prev.includes(index)) {
        newSelection = prev.filter((i) => i !== index);
      } else {
        newSelection.push(index);
      }
      return newSelection;
    });
  };

  // Validation function
  const validateSelection = () => {
    stopTimer();
    let correctSelections = 0;
    const incorrectSelections: number[] = [];

    selectedImages.forEach((index) => {
      const imageObj = currentImages[index];
      if (imageObj.isCampus) {
        correctSelections++;
      } else {
        incorrectSelections.push(index);
      }
    });

    const required = currentLevel === 1 ? 3 : 6;
    const levelPoints = correctSelections * pointsPerCorrect;
    setTotalPoints((prev) => prev + levelPoints);

    if (correctSelections === required && incorrectSelections.length === 0) {
      if (currentLevel === 1) {
        // Increase score count in localStorage
        const prevScore = Number(localStorage.getItem("score")) || 0;
        localStorage.setItem("score", String(prevScore + 1));
      }
      if (currentLevel < 2) {
        showModalDialog(
          "Success!",
          `Level ${currentLevel} complete. Points: ${levelPoints}`,
          () => {
            setCurrentLevel((prev) => prev + 1);
          },
        );
      } else {
        showModalDialog(
          "Verification Complete!",
          `Final score: ${totalPoints + levelPoints}`,
          resetVerification,
        );
      }
    }
  };

  // Reset function
  const resetVerification = () => {
    setCurrentLevel(1);
    setTotalPoints(0);
    setSelectedImages([]);
    setChances(3);
  };

  // Get grid class based on level
  const getGridClass = () => {
    switch (currentLevel) {
      case 1:
        return "grid-cols-3 gap-2 max-w-[540px]";
      case 2:
        return "grid-cols-4 gap-2 max-w-[600px]";
      default:
        return "grid-cols-3 gap-2 max-w-[540px]";
    }
  };

  // Get instruction text
  const getInstructionText = () => {
    switch (currentLevel) {
      case 1:
        return "LEVEL 1: Select all 3 campus images. CHOOSE WISELY YOU ONLY HAVE 3 ATTEMPTS";
      case 2:
        return "LEVEL 2: Select all 6 campus images. CHOOSE WISELY YOU ONLY HAVE 3 ATTEMPTS";
      default:
        return "Select campus images.";
    }
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isWarning = timeRemaining < timeLimits[currentLevel] * 0.2;

  return (
    <main className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-[#222] via-[#2d2d2d] to-[#3b3b3b] text-white m-0 p-0 z-[9999] minecraft-block overflow-auto px-2 sm:px-0">
      <div
        className="w-full max-w-4xl mx-auto bg-[#232323] border-4 border-[#bfbfbf] shadow-[8px_8px_0_0_#222] p-4 sm:p-8 flex flex-col items-center relative overflow-y-auto minecraft-block"
        style={{ maxHeight: "95vh" }}
      >
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#bfbfbf] border-2 border-[#222] rounded-none minecraft-block" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#bfbfbf] border-2 border-[#222] rounded-none minecraft-block" />
        {/* Header */}
        <div className="text-center text-2xl font-bold text-green-400 mb-5 pb-2 border-b-2 border-green-500 font-minecraft">
          GDG Genesis
        </div>
        {/* Info Bar */}
        <div className="flex justify-between items-center mb-5 p-2 bg-[#181818] rounded flex-col md:flex-row gap-2 md:gap-0 w-full">
          <div
            className={`text-lg font-bold ${isWarning ? "text-red-600 animate-pulse" : "text-yellow-400"} font-minecraft`}
          >
            Time: {formatTime(timeRemaining)}
          </div>
        </div>
        {/* Instructions */}
        <div className="bg-green-900/60 p-4 rounded mb-5 text-sm leading-relaxed border-l-4 border-green-400 font-minecraft w-full">
          {getInstructionText()}
        </div>
        {/* Image Grid */}
        <div className={`grid ${getGridClass()} justify-center mx-auto mb-5`}>
          {currentImages.map((imgObj, index) => {
            const isSelected = selectedImages.includes(index);
            const isCorrect =
              imgObj.isCampus && (isSelected || currentLevel > 1);
            const isIncorrect = !imgObj.isCampus && isSelected;
            return (
              <div
                key={index}
                className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 bg-[#181818] aspect-square flex items-center justify-center hover:scale-105
                  ${isCorrect ? "border-green-500 border-4 shadow-lg shadow-green-500/50" : ""}
                  ${!isCorrect && isSelected ? "border-blue-500 border-4 shadow-lg shadow-blue-500/50" : "border-[#bfbfbf]"}
                  ${isIncorrect ? "border-red-500 border-4 shadow-lg shadow-red-500/50" : ""}
                  hover:border-blue-500`}
                onClick={() => {
                  if (selectedImages.includes(index)) return;
                  toggleSelection(index);
                  if (imgObj.isCampus) {
                    // Check if all required campus images are selected before moving to next level
                    const required = currentLevel === 1 ? 3 : 6;
                    const selectedCampus = [...selectedImages, index].filter(
                      (i) => currentImages[i]?.isCampus,
                    ).length;
                    if (selectedCampus === required) {
                      validateSelection();
                    }
                  } else {
                    // Wrong selection
                    if (chances > 1) {
                      setChances((prev) => prev - 1);
                      setShowModal(true);
                      setModalTitle("Wrong Selection CHOOSE WISELY");
                      setModalMessage(
                        `You have ${chances - 1} chance${chances - 1 === 1 ? "" : "s"} left.`,
                      );
                      setModalCallback(() => null);
                    } else {
                      // Decrease score in localStorage
                      const prevScore =
                        Number(localStorage.getItem("score")) || 0;
                      localStorage.setItem("score", String(prevScore - 1));
                      setShowModal(true);
                      setModalTitle("Out of Chances");
                      setModalMessage(
                        "You have run out of chances. Redirecting to main page...",
                      );
                      setModalCallback(() => () => router.push("/"));
                    }
                  }
                }}
              >
                <img
                  src={
                    imgObj.isCampus
                      ? `campus_images/${imgObj.name}`
                      : `external_images/${imgObj.name}`
                  }
                  alt={`${imgObj.isCampus ? "Campus" : "External"} image`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#232323] p-8 rounded-lg text-center max-w-sm w-11/12 border-4 border-[#bfbfbf] minecraft-block">
              <h3 className="mb-4 text-xl font-semibold text-green-400 font-minecraft">
                {modalTitle}
              </h3>
              <p className="mb-5 leading-relaxed text-green-200 font-minecraft">
                {modalMessage}
              </p>
              <button
                className="px-6 py-3 text-sm font-bold border-none rounded cursor-pointer transition-all duration-300 uppercase bg-green-500 text-white hover:bg-green-600 font-minecraft minecraft-block"
                onClick={hideModal}
              >
                OK
              </button>
            </div>
          </div>
        )}
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
};

export default CampusVerificationSystem;
