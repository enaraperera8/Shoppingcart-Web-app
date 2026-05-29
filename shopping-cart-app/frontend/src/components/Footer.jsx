import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>FreshMart</strong>
          <p>A considered market for fresh staples and small celebrations.</p>
        </div>
        <small>&copy; {new Date().getFullYear()} FreshMart</small>
      </div>
    </footer>
  );
}
