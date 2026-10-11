import { planningDisclaimer } from "../data/provenance";
export function Footer() {
  return (
    <footer>
      <strong>
        HeatReach<span>Place relief where it matters.</span>
      </strong>
      <p>{planningDisclaimer}</p>
      <small>
        HeatReach / planning & public information ·{" "}
        <a href="/THIRD_PARTY_NOTICES.txt">Dependency notices</a>
      </small>
    </footer>
  );
}
