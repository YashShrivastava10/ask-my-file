"use client";

import { motion, MotionProps } from "motion/react";
import React, { ElementType, JSX } from "react";

type MotionWrapperProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
};

const MotionWrapper = ({
  children,
  className = "",
  tag: Tag = "div",
  initial = { y: 20, opacity: 0 },
  animate = { y: 0, opacity: 1 },
  transition = { duration: 0.6 },
  ...motionProps
}: MotionWrapperProps) => {
  const MotionTag = motion[Tag as keyof typeof motion] as ElementType;

  return (
    <MotionTag
      initial={initial}
      animate={animate}
      transition={transition}
      className={`${className}`}
      {...motionProps}
    >
      {children}
    </MotionTag>
  );
};

export default MotionWrapper;
