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
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M14 3c.4 3.2 2.4 5 5.2 5.2v3.1c-1.8 0-3.4-.5-4.8-1.4v6.6A6.5 6.5 0 1 1 11 10.1v3.2a3.3 3.3 0 1 0 2.4 3.2V3z" />
        </svg>
      );
    case "mastodon":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M12 2c3.5 0 6.6.4 8 1.2 1.5.9 2 2.2 2 4.7 0 0 .1 3.7-.6 6.3-.5 1.8-2.3 3.4-4.6 3.7-1.3.2-2.4.3-3.5.2V16c1.3.3 2.5.4 3.7 0 1.2-.4 2.2-1.3 2.4-2.2-3.3 1.6-6.6 1.7-9.8 0 .2.9 1.2 1.8 2.4 2.2 1.2.4 2.4.3 3.7 0v2.1c-1.1.1-2.2 0-3.5-.2-2.3-.3-4.1-1.9-4.6-3.7C4.3 11.6 4.4 7.9 4.4 7.9c0-2.5.5-3.8 2-4.7C7.8 2.4 10.5 2 12 2zm-3.3 5.4c-.8 0-1.4.7-1.4 1.8v4.1h1.7V9.3c0-.5.2-.8.6-.8s.6.3.6.8v4h1.7V9.2c0-1.1-.6-1.8-1.4-1.8-.6 0-1.1.3-1.3.8h-.1c-.2-.5-.7-.8-1.4-.8zm5.2 0c-.8 0-1.4.7-1.4 1.8v4.1h1.7V9.3c0-.5.2-.8.6-.8s.6.3.6.8v4h1.7V9.2c0-1.1-.6-1.8-1.4-1.8-.6 0-1.1.3-1.3.8h-.1c-.3-.5-.7-.8-1.4-.8z" />
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
