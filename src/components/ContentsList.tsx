import React from "react";
import type { Data } from "../types/types";

const ContentsList: React.FC<{ data: Data[] }> = ({ data }) => {
  const targetIndex = Number(data[1].state) + 2;
  const reversedData = [...data].reverse().slice(0, -2);
  console.log("[ContentsList] REVdata: ", targetIndex);
  return (
    <>
      {reversedData.map((d) => (
        <li
          key={d.id}
          className={d.label.includes("Milestone") ? "assessment" : ""}
        >
          <a
            href={
              Number(d.id) < targetIndex ? d.notionUrl : "javascript:void(0)"
            }
            className="reset_a"
            target={Number(d.id) < targetIndex ? "_blank" : ""}
          >
            <div className="content-header">
              <p className="content-name">{d.label}</p>
              <p
                className={`clear-flag ${
                  d.state === "initial" ? "hidden" : ""
                }`}
              >
                {d.state}
              </p>
            </div>
            <p className="quote_en">{d.quoteEn}</p>
            <p className="quote_ja">{d.quoteJa}</p>
          </a>
        </li>
      ))}
    </>
  );
};

export default ContentsList;
