export function PublicSafety() {
  return (
    <aside className="panel extension safety-information">
      <h2>Heat safety information</h2>
      <p>
        Seek shade or a cooler place, reduce strenuous outdoor activity during
        the hottest hours, and follow official local heat warnings. Read{" "}
        <a
          href="https://www.who.int/news-room/fact-sheets/detail/climate-change-heat-and-health"
          target="_blank"
          rel="noreferrer"
        >
          WHO heat and health guidance
        </a>{" "}
        for general advice. This app does not assess personal medical risk.
      </p>
      <p>
        For an emergency in India, <a href="tel:112">call 112</a>. This link
        opens your device’s dialer only when you choose it. HeatReach does not
        call automatically or dispatch help.{" "}
        <a href="https://112.gov.in/" target="_blank" rel="noreferrer">
          Official emergency service information
        </a>
        .
      </p>
    </aside>
  );
}
