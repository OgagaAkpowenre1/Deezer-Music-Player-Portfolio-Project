export default function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  className = "",
}) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`sp-range ${className}`}
      style={{ "--pct": `${Math.min(100, Math.max(0, pct))}%` }}
    />
  );
}
