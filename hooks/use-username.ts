import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const ANIMALS = [
  "Wolf", "Hawk", "Bear", "Shark", "Viper", "Fox", "Eagle", "Raven",
  "Tiger", "Lion", "Dragon", "Phoenix", "Cobra", "Falcon",
  "Specter", "Wraith", "Spirit", "Hunter", "Walker", "Stranger"
];
const STORAGE_KEY = "chat_username";

const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `anonymous-${word}-${nanoid(5)}`;
};

export const useUsername = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setUsername(stored);
        setIsLoading(false);
        return;
      }

      const generated = generateUsername();
      localStorage.setItem(STORAGE_KEY, generated);
      setUsername(generated);
      setIsLoading(false);
    };

    main();
  }, []);

  return { username, isLoading };
};
