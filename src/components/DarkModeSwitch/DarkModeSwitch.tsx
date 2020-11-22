/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-props-no-spreading */

import { useTheme } from "next-themes";
import { useMemo } from "react";
import { useSpring, animated } from "react-spring";

export const defaultProperties = {
  dark: {
    circle: {
      r: 9,
    },
    lines: {
      opacity: 0,
    },
    mask: {
      cx: "50%",
      cy: "23%",
    },
    svg: {
      transform: "rotate(40deg)",
    },
  },
  light: {
    circle: {
      r: 5,
    },
    lines: {
      opacity: 1,
    },
    mask: {
      cx: "100%",
      cy: 0,
    },
    svg: {
      transform: "rotate(90deg)",
    },
  },
  springConfig: { friction: 35, mass: 4, tension: 250 },
};

export type SVGProps = React.HTMLAttributes<HTMLOrSVGElement>;

export interface Props extends SVGProps {
  animationProperties?: typeof defaultProperties;
  moonColor?: string;
  sunColor?: string;
}

export default function DarkModeSwitch({
  animationProperties = defaultProperties,
  moonColor = "white",
  sunColor = "black",
  ...rest
}: Props): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme();

  const properties = useMemo(() => {
    if (animationProperties !== defaultProperties) {
      return Object.assign(defaultProperties, animationProperties);
    }
    return animationProperties;
  }, [animationProperties]);

  const { circle, svg, lines, mask } = properties[
    resolvedTheme === "dark" ? "light" : "dark"
  ];

  const svgContainerProps = useSpring({
    ...svg,
    config: animationProperties.springConfig,
  });
  const centerCircleProps = useSpring({
    ...circle,
    config: animationProperties.springConfig,
  });
  const maskedCircleProps = useSpring({
    ...mask,
    config: animationProperties.springConfig,
  });
  const linesProps = useSpring({
    ...lines,
    config: animationProperties.springConfig,
  });

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <animated.svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={30}
      viewBox="0 0 24 24"
      className="cursor-pointer"
      color={resolvedTheme === "dark" ? moonColor : sunColor}
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      // @ts-ignore
      style={{
        ...svgContainerProps,
      }}
      onClick={toggle}
      {...rest}
    >
      <mask id="myMask2">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <animated.circle
          // @ts-ignore
          style={maskedCircleProps}
          r="9"
          fill="black"
        />
      </mask>
      <animated.circle
        cx="12"
        cy="12"
        fill={resolvedTheme === "dark" ? moonColor : sunColor}
        // @ts-ignore
        style={centerCircleProps}
        mask="url(#myMask2)"
      />
      <animated.g
        stroke="currentColor"
        // @ts-ignore
        style={linesProps}
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </animated.g>
    </animated.svg>
  );
}