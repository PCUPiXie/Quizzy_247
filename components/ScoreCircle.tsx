"use client";

interface ScoreCircleProps {
  score: number;
  total: number;
}

export function ScoreCircle({ score, total }: ScoreCircleProps) {
  const percentage = (score / total) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-64 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className="stroke-muted fill-none"
          strokeWidth="12"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className="stroke-primary fill-none transition-all duration-1000 ease-out"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Score</span>
        <span className="text-5xl font-bold mt-1">
          {score}<span className="text-2xl text-muted-foreground font-normal">/{total}</span>
        </span>
      </div>
    </div>
  );
}
