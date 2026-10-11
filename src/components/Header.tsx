import { Icon } from "./Icon";
export function Header({
  onMethod,
  view,
  onView,
}: {
  onMethod: () => void;
  view: "planner" | "public";
  onView: (view: "planner" | "public") => void;
}) {
  return (
    <header className="header">
      <a
        className="brand"
        href="#main"
        aria-label="HeatReach home"
        onClick={() => onView("planner")}
      >
        <span className="brand-mark" aria-hidden="true">
          <Icon name="sun" />
        </span>
        <span>
          HeatReach<small>COMMUNITY RESILIENCE PLANNER</small>
        </span>
      </a>
      <nav className="mode-switch" aria-label="Choose audience">
        <button
          aria-label="Community planner"
          aria-pressed={view === "planner"}
          onClick={() => onView("planner")}
        >
          <Icon name="map" />
          <span className="desktop-label">Community planner</span>
          <span className="mobile-label">Planner</span>
        </button>
        <button
          aria-label="Public facilities"
          aria-pressed={view === "public"}
          onClick={() => onView("public")}
        >
          <Icon name="building" />
          <span className="desktop-label">Public facilities</span>
          <span className="mobile-label">Facilities</span>
        </button>
        <a href="#method" aria-label="Method & sources" onClick={onMethod}>
          <Icon name="book" />
          <span className="desktop-label">Method & sources</span>
          <span className="mobile-label" aria-hidden="true">
            Method
          </span>
        </a>
      </nav>
      <span className="prototype">Planning prototype</span>
    </header>
  );
}
