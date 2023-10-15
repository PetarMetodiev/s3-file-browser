import "css.gg/icons/css/chevron-right.css";
import "css.gg/icons/css/home.css";

import "./Breadcrumbs.css";
import { rootPath } from "@src/utils/consts";

type BreadcrumbsProps = {
  depth: number;
  segments: string[];
  onClick: (newPath: string) => void;
};

export const Breadcrumbs = ({ depth, segments, onClick }: BreadcrumbsProps) => {
  const parentPath = `${depth - 1}#//${segments.slice(0, -1).join("/")}`;
  return (
    <div className="breadcrumbs-container">
      <button onClick={() => onClick(rootPath)} data-breadcrumb-element>
        <i className="gg-home"></i>
      </button>
      {segments.slice(-4).map((s, i, arr) => {
        return (
          <button
            key={`${parentPath}-${s}`}
            onClick={() => {
              const indexFromBack = arr.length - 1 - i;
              const elementPath = `${depth - indexFromBack}#//${segments
                .slice(0, -indexFromBack)
                .join("/")}`;
              onClick(elementPath);
            }}
            disabled={i === arr.length - 1}
            data-breadcrumb-element
          >
            <i className="gg-chevron-right"></i>
            {s}
          </button>
        );
      })}
    </div>
  );
};
