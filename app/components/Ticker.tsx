export default function Ticker() {
  const text = "🍪 OVEN STATUS: FIRED UP \u00A0·\u00A0 2,341 cookies delivered today \u00A0·\u00A0 new batch every time a job posts \u00A0·\u00A0 your linkedin refresh addiction ends here \u00A0·\u00A0 set it, forget it, get hired \u00A0·\u00A0 ";

  return (
    <div className="relative z-[5] overflow-hidden whitespace-nowrap bg-[color:var(--chip)] py-[7px] font-[var(--font-dm-mono)] text-[11px] text-[color:var(--caramel-light)]">
      <span className="motion-ticker inline-block">
        {text}{text}
      </span>
    </div>
  );
}
