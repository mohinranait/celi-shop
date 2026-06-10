// declarations.d.ts or react-rating-stars-component.d.ts
declare module 'react-rating-stars-component' {
    import * as React from 'react';
  
    export interface ReactStarsProps {
      count?: number;
      value?: number;
      edit?: boolean;
      size?: number;
      isHalf?: boolean;
      onChange?: (newValue: number) => void;
      emptyIcon?: React.ReactNode;
      filledIcon?: React.ReactNode;
      activeColor?: string;
      color?: string;
      a11y?: boolean;
    }
  
    const ReactStars: React.FC<ReactStarsProps>;
  
    export default ReactStars;
  }
  