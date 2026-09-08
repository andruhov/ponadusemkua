export function SocialIcon({ id }: { id: string }) {
  const common = "size-4";
  switch (id) {
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M21.5 3.4 18.9 20c-.2 1-1.3 1.4-2.1.8l-5.3-4.1-2.6 2.5c-.3.3-.8.1-.9-.3l-.7-5.3L2.2 11c-1-.3-.9-1.7.2-1.9l18.2-5.9c1-.3 1.9.6 1.9 1.2z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M14.7 10.3 22 2h-2.2l-6.4 7.2L8.3 2H2l7.7 11L2 22h2.2l6.9-7.8L15.7 22H22l-7.3-11.7z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      );
  }
}
