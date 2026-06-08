import { REACTION_ICONS, REACTION_TYPES } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { useState } from "react";

interface ReactionBarProps {
  reactionCounts: Record<string, number>;
  userReaction?: string | null;
  onReact: (type: string) => void;
}

export default function ReactionBar({ reactionCounts, userReaction, onReact }: ReactionBarProps) {
  const [animating, setAnimating] = useState<string | null>(null);

  const handleClick = (type: string) => {
    setAnimating(type);
    onReact(type);
    setTimeout(() => setAnimating(null), 400);
  };

  return (
    <div className="flex items-center gap-2">
      {REACTION_TYPES.map((type) => {
        const count = reactionCounts[type] || 0;
        const isActive = userReaction === type;
        const isAnimating = animating === type;
        return (
          <button
            key={type}
            onClick={() => handleClick(type)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all duration-200",
              isActive
                ? "bg-primary-100 text-primary-700 font-medium shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800",
              isAnimating && "scale-110"
            )}
            style={{
              transform: isAnimating ? "scale(1.15)" : undefined,
              transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s, color 0.2s",
            }}
          >
            <span className={cn("transition-transform", isAnimating && "animate-bounce")}>{REACTION_ICONS[type]}</span>
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
