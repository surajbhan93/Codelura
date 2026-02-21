import zxcvbn from "zxcvbn";

export default function PasswordStrength({ password }: { password: string }) {
  const result = zxcvbn(password);
  const strength = result.score; // 0-4

  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  const labels = ["Very Weak", "Weak", "Okay", "Good", "Strong"];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i <= strength ? colors[strength] : "bg-gray-300 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
      {password && (
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          Strength: {labels[strength]}
        </p>
      )}
    </div>
  );
}
