import "./Footer.css"; // Optional: Add a CSS file for footer-specific styles

function Footer() {
  return (
    <footer className="footer">
      <p>
        For bug reports or feature requests see our{" "}
        <a
          href="https://discord.gg/byVdbGEk"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Discord
        </a>{" "}
        community!
      </p>
    </footer>
  );
}

export default Footer;
