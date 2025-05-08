export default function Star({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      className={`w-24 h-24 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.5l3.09 6.26 6.91 1.01-5 4.87 1.18 6.88L12 18.77l-6.18 3.25L7 14.64 2 9.77l6.91-1.01L12 2.5z" />
    </svg>
  );
}
