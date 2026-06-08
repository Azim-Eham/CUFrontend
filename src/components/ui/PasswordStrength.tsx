import { useEffect, useState } from "react";

interface PasswordStrengthProps {
  password?: string;
}

export default function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<{ score: number; label: string; color: string }>({
    score: 0,
    label: "",
    color: "bg-gray-200",
  });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: "", color: "bg-gray-200" });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Weak";
    let color = "bg-red-500";

    if (password.length < 6) {
      label = "Too short";
      color = "bg-red-500";
    } else if (score <= 2) {
      label = "Weak";
      color = "bg-orange-500";
    } else if (score <= 4) {
      label = "Fair";
      color = "bg-yellow-500";
    } else {
      label = "Strong";
      color = "bg-green-500";
    }

    setStrength({ score, label, color });
  }, [password]);

  if (!password) return null;

  const barCount = Math.max(1, strength.score);

  return (
    <div className="mt-2 space-y-1.5 animate-fadeInUp">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Password strength:</span>
        <span className="font-medium text-gray-700">{strength.label}</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-colors duration-300 ${
              index < barCount ? strength.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
