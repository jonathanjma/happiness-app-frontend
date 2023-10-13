// Simple loading spinner
export default function Spinner({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className={className}>
      <div
        className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
}
