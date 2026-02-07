interface MapMarkerProps {
  size?: number;
  isCluster?: boolean;
  pointCount?: number;
}

export default function MapMarker({
  size = 36,
  isCluster = false,
  pointCount,
}: MapMarkerProps) {
  if (isCluster) {
    const clusterSize = Math.max(40, Math.min(60, 30 + (pointCount ?? 0) * 5));
    return (
      <div
        className="flex items-center justify-center rounded-full bg-terracotta-500 font-body text-sm font-bold text-cream-50 shadow-lg ring-4 ring-terracotta-200"
        style={{ width: clusterSize, height: clusterSize }}
      >
        {pointCount}
      </div>
    );
  }

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 36 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      {/* Pin shape */}
      <path
        d="M18 0C8.06 0 0 8.06 0 18c0 12.6 18 29 18 29s18-16.4 18-29C36 8.06 27.94 0 18 0z"
        fill="#5a3520"
      />
      {/* Coffee cup icon */}
      <circle cx="18" cy="17" r="10" fill="#fdf8f0" />
      <path
        d="M13 14h8v1a4 4 0 0 1-8 0v-1z M21 14.5h1.5a2 2 0 0 1 0 4H21"
        stroke="#5a3520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 21h8"
        stroke="#5a3520"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Steam */}
      <path
        d="M15.5 11c0-1 1-1.5 0.5-2.5 M18 11c0-1 1-1.5 0.5-2.5"
        stroke="#d44d21"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
