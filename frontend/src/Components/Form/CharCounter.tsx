import React from "react";

interface CharCounterProps {
    maxLength: number;
    value: string;
}

export const CharCounter: React.FC<CharCounterProps> = ({ value = "", maxLength }) => {
    const charsLeft = maxLength - value.length;
    const percent = Math.min((value.length / maxLength) * 100, 100);
    let borderColor = "stroke-(--primary-color) text-transparent";
    if (charsLeft <= 20 && charsLeft > 5) {
        borderColor = "stroke-yellow-400 text-yellow-400";
    } else if (charsLeft <= 5) {
        borderColor = "stroke-red-500 text-red-500";
    }

    const showNumber = charsLeft <= 20;
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const progress = (percent / 100) * circumference;

    return (
        <div className="absolute bottom-2 right-2">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg width={32} height={32}>
                    <circle
                        cx={16}
                        cy={16}
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={4}
                        className="stroke-gray-300"
                    />
                    <circle
                        cx={16}
                        cy={16}
                        r={radius}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeWidth={4}
                        className={borderColor}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        style={{ transition: "stroke-dashoffset 0.2s" }}
                        transform="rotate(-90 16 16)"
                    />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center font-bold text-base pointer-events-none select-none ${borderColor.split(" ")[1]}`}>
                    {showNumber ? charsLeft : ""}
                </span>
            </div>
        </div>
    );
};
