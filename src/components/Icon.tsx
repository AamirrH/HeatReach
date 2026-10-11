type IconName = "map" | "building" | "book" | "download" | "print" | "sun";
const paths: Record<IconName, string> = {
  map: "m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16",
  building:
    "M4 21V3h11v18M15 9h5v12M2 21h20M7 7h1m3 0h1M7 11h1m3 0h1M7 15h1m3 0h1M8 21v-3h3v3",
  book: "M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  print: "M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6v-7Zm11-2h1",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
};
export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
