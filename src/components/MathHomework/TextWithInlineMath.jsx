import React from "react";
import { convertLatexToMarkup } from "mathlive";

const TextWithInlineMath = ({ text }) => {
  const inlineMathSearchRegex =
    /(\\\(.*?\\\))|(\$.*?\$)|(\\begin\{math\}.*?\\end\{math\})/g;
  const inlineMathRegex =
    /^(\\\(.*?\\\))|(\$.*?\$)|(\\begin\{math\}.*?\\end\{math\})$/;

  return (
    <span>
      {text.split(inlineMathSearchRegex).map((item, key) => {
        if (inlineMathRegex.test(item)) {
          return (
            <span
              className="mx-1"
              key={key}
              dangerouslySetInnerHTML={{
                __html: convertLatexToMarkup(item.replace(/\ /g, "~")),
              }}
            />
          );
        } else {
          return <span key={key}>{item}</span>;
        }
      })}
    </span>
  );
};

export default TextWithInlineMath;
