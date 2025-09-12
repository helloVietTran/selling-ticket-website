import React from 'react';

interface VerticalDashedProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
  dashArray?: string;
  id?: string;
  ariaLabel?: string;
}

const VerticalDashed: React.FC<VerticalDashedProps> = ({
  width = 4,
  height = 415,
  stroke = '#27272A',
  strokeWidth = 4,
  dashArray = '4 10',
  id = 'vertical-dashed',
  ariaLabel,
  className,
  ...svgProps
}) => {
  const vw = typeof width === 'number' ? width : 4;
  const vh = typeof height === 'number' ? height : 415;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id={id}
      className={className}
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      {...svgProps}>
      <path
        d={`M${vw / 2} 2v${vh - 4}`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashArray}
      />
    </svg>
  );
};

export default VerticalDashed;
