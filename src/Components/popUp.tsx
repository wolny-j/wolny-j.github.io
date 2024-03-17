// Popup.js
import React from "react";
import "../CSS/popUp.css";

function Popup() {
  return (
    <div className="popup">
      {/* Content of the popup */}
      An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, <br></br>
      typically using all the original letters exactly once.<br /><br />
      Backspace - remove last letter <br />
      Delete - delete whole word
    </div>
  );
}

export default Popup;
