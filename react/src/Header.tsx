import { useState } from "react";
import { links } from "./util/links";
import { ShortyStore } from "./store";
import { Link } from "wouter";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = ShortyStore.useState((s) => s.isLoggedIn);

  return (
    <div className="header header-fixed unselectable header-animated">
      <div className="header-brand">
        <div className="nav-item no-hover">
          <Link href="/">
            <h6 className="title">Shorty</h6>
          </Link>
        </div>
        <div
          className={"nav-item nav-btn" + (isMenuOpen ? " active" : "")}
          id="header-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div
        className={"header-nav" + (isMenuOpen ? " active" : "")}
        id="header-menu"
      >
        <div className="nav-left">
          <div className="nav-item">
            {!isLoggedIn && <a href={links.login}>Log in with Github</a>}
            {isLoggedIn && <a href={links.logout}>Log out</a>}
          </div>
        </div>
      </div>
    </div>
  );
}
