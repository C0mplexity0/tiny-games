import * as React from "react";

const TinyGamesSymbol = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 512 512"
    {...props}
  >
    <g
      style={{
        fill: "none",
        fillOpacity: 1,
        stroke: "currentColor",
        strokeWidth: 22,
        strokeDasharray: "none",
        strokeOpacity: 1,
      }}
    >
      <path
        d="m123.224 298.443 132.625 61.845 132.928-61.985-132.626-61.845Z"
        style={{
          fill: "none",
          fillOpacity: 1,
          fillRule: "evenodd",
          stroke: "currentColor",
          strokeWidth: 30.6326,
          strokeLinejoin: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
        transform="translate(0 -11.217)"
      />
      <path
        d="M123.224 298.443v69.609m265.553-69.75v69.61m-265.553.14 132.625 61.844m0 0 132.928-61.985"
        style={{
          fill: "none",
          fillOpacity: 1,
          stroke: "currentColor",
          strokeWidth: 30.633,
          strokeLinecap: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
        transform="translate(0 -11.217)"
      />
    </g>
    <g transform="translate(0 -11.217)">
      <path
        d="m256.082 296.109-.165-104.054"
        style={{
          fill: "none",
          fillOpacity: 1,
          stroke: "currentColor",
          strokeWidth: 26.9857,
          strokeLinecap: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
      />
      <ellipse
        cx={256}
        cy={146.012}
        rx={42.248}
        ry={43.29}
        style={{
          fill: "none",
          fillOpacity: 1,
          stroke: "currentColor",
          strokeWidth: 27,
          strokeLinecap: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
      />
    </g>
  </svg>
);

export { TinyGamesSymbol };
