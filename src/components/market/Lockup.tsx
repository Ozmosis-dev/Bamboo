/** The working logo: white caps in a thin vermilion keyline box
 * (from the final printed menus). Scales with font-size on the wrapper. */
export function Lockup({ className = "" }: { className?: string }) {
  return (
    <span className={`m-lockup ${className}`}>
      <span className="m-lockup-name text-[1em]">Bamboo</span>
      <span className="m-lockup-sub">On Market</span>
    </span>
  );
}
