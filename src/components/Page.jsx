// Page wrapper: gives every route the same padding (clear of the top bar)
// and the soft coloured gradient behind the header that Spotify uses.
export default function Page({ tint = "from-[#1f5c3b]/70", children }) {
  return (
    <div className="relative px-4 pb-10 pt-20 md:px-6">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b ${tint} to-transparent`}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
