declare module "react-simple-maps" {
  import * as React from "react";

  export interface GeographyProps extends React.SVGAttributes<SVGPathElement> {
    geography: Record<string, unknown>;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  export interface GeographiesRenderProps {
    geographies: Array<Record<string, unknown> & { rsmKey?: string | number }>;
  }

  export interface ComposableMapProps
    extends React.SVGProps<SVGSVGElement> {
    projectionConfig?: Record<string, unknown>;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<{
    geography: string | Record<string, unknown>;
    children: (props: GeographiesRenderProps) => React.ReactNode;
  }>;
  export const Geography: React.FC<GeographyProps>;
}
