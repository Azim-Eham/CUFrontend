import { REACTION_ICONS, REACTION_TYPES } from "@/utils/constants";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface ReactionBarProps {
  reactionCounts: Record<string, number>;
  userReaction?: string | null;
  onReact: (type: string) => void;
}

export default function ReactionBar({ reactionCounts, userReaction, onReact }: ReactionBarProps) {
  return (
    <div className="flex items-center gap-2">
      {REACTION_TYPES.map((type) => {
        const count = reactionCounts[type] || 0;
        const isActive = userReaction === type;
        return (
          <button
            key={type}
            onClick={() => onReact(type)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-primary-100 text-primary-700 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <span>{REACTION_ICONS[type]}</span>
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
