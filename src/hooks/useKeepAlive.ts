import { useEffect, useRef } from "react";

const BACKEND_URL = "https://cu-backend-three.vercel.app";
const INTERVAL = 4 * 60 * 1000;

export default function useKeepAlive() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/health`, { method: "GET" }).catch(() => {});

    timerRef.current = setInterval(() => {
      fetch(`${BACKEND_URL}/health`, { method: "GET" }).catch(() => {});
    }, INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
}
