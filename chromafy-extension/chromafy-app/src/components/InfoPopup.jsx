import React from "react";
import chromafyLogo from "../assets/chromafy-logo.svg";
import ClassNameExampleSVG from "./ClassNameExampleSVG";
import CssVariableExampleSVG from "./CssVariableExampleSVG";

const InfoPopup = () => {
  return (
    <div id="info-popup" className="info-popup">
      <div className="info-tab">
        <div className="logo">
          <img src={chromafyLogo} alt="Chromafy Logo" />
          Chromafy
        </div>
        <p>
          For a comprehensive guide on Chromafy,{" "}
          <a href="https://chromafy.vercel.app/docs/setup" target="_blank">
            refer docs
          </a>
        </p>
      </div>
      <div className="info-content">
        <section id="docs-section-1">
          <p>
            Generate and Apply Vibrant Color Palettes straight to your Website,
            with just a Few tweaks! Chromafy offers two powerful methods for
            applying color palettes to your website: <br />
            <u>Class Names</u> and <u>CSS variables.</u>
          </p>
          <h3>Using Class Names</h3>

          <p>
            These structured class names allow Chromafy to apply the palette
            colors to approriate elements using CSS properties.
          </p>

          <ClassNameExampleSVG />
        </section>
        <section id="docs-section-2">
          <h3>Using CSS variables</h3>

          <p>
            These structured CSS variables allow you to use your palette colors
            as Chromafy's CSS variables, giving rise to more flexibility.
          </p>
          <CssVariableExampleSVG />
        </section>
        <section>
          <h3>Applying Your Color Palette</h3>
          <p>
            <code>
              <i>text</i>
            </code>{" "}
            colors are used for majority of your website's textual content.
          </p>
          <p>
            <code>
              <i>background</i>
            </code>{" "}
            colors are used for your website's main background, and other texts
            where more contrast is needed instead of the usual text color.{" "}
            <br />
            eg: a cta button with classes <code>
              bg-chroma-primary
            </code> and <code>fg-chroma-background</code>
          </p>
          <p>
            <code>
              <i>primary</i>
            </code>{" "}
            colors are mainly used as background color for your website's
            important components, like main CTAs, buttons, cards, sections. They
            are generally more prominent to attract user attention.
          </p>
          <p>
            <code>
              <i>secondary</i>
            </code>{" "}
            colors are used as supporting colors. They can be used as background
            colors for your website's lesser important components, like less
            important buttons, cards, sections. Variations with Shades/Opacities
            of this color often works well. It is helpful in balancing the UI
            without overwhelming other colors. <br />
            eg: a card with class <code>bg-chroma-secondary-20</code>
          </p>
          <p>
            <code>
              <i>accent</i>
            </code>{" "}
            colors are used on other elements like svgs, images, hyperlinks,
            etc. It is an additional color that can be a part of a brand's
            identity.{" "}
          </p>
          .
        </section>
        <footer>
          <p>
            <span>&#x2605;</span> By{" "}
            <a href="https://linktr.ee/prajwaldhule" target="_blank">
              Prajwal Dhule
            </a>
          </p>
          <p>
            Copyright &copy; 2024 All Rights Reserved under{" "}
            <a
              href="https://github.com/PrajwalDhule/Chromafy/blob/master/License.md"
              target="_blank"
            >
              CC BY-NC-ND
            </a>{" "}
            license
          </p>
        </footer>
      </div>
    </div>
  );
};

export default InfoPopup;
