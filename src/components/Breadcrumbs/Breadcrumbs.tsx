import "css.gg/icons/css/chevron-right.css";

import "./Breadcrumbs.css";

type BreadcrumbsProps = {
  depth: number;
  segments: string[];
  onClick: (newPath: string) => void;
};

export const Breadcrumbs = ({ depth, segments, onClick }: BreadcrumbsProps) => {
  const parentPath = `${depth - 1}#//${segments.slice(0, -1).join("/")}`;
  return (
    <div className="breadcrumbs-container">
      ...
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
