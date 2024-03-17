// Header.js
import { useState } from "react";
import Popup from "./popUp";
import "../CSS/header.css";

function Header() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <p className="H1">Anagramia</p>
      <p
        className="helpIcon"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        ?
      </p>
      <p
        className="H2"
      >
        Find all anagrams of the word given
      </p>

      {isHovered && <Popup />}
    </div>
  );
}

export default Header;
