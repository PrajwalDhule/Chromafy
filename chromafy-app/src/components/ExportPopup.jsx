import React from "react";

const ExportPopup = () => {
  return (
    <div className="export-popup">
      <ul className="languages-container container">
        <li>CSS</li>
        <li>SCSS</li>
        <li>Tailwind CSS</li>
      </ul>
      <div className="color-settings">
        <div className="color-types-container container">
          <div className="color-type">HEX</div>
          <div className="color-type">RGB</div>
          <div className="color-type">HSL</div>
        </div>
        <div className="color-filters-container container">
          <div className="">Themes</div>
          <div className="">Shades</div>
        </div>
      </div>
      <div className="code-container">
        <pre>--text: hsl(166, 68%, 6%);</pre>
        <pre>--background: hsl(171, 68%, 96%);</pre>
        <pre>--primary: hsl(168, 67%, 55%);</pre>
        <pre>--secondary: hsl(341, 67%, 71%);</pre>
        <pre> --accent: hsl(38, 67%, 60%);</pre>
      </div>
    </div>
  );
};

export default ExportPopup;
