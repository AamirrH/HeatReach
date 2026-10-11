export function Header() {
  return (
    <header className="header">
      <a className="brand" href="#main" aria-label="HeatReach home">
        <span className="brand-mark" aria-hidden="true">
          H<span>↗</span>
        </span>
        <span>
          HeatReach<small>COMMUNITY COOLING ACCESS</small>
        </span>
      </a>
      <nav aria-label="Main">
        <a href="#method">
          Method & sources <span aria-hidden="true">↗</span>
        </a>
        <span className="prototype">Planning prototype</span>
      </nav>
    </header>
  );
}
