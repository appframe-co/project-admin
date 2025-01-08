type TProps = {
    width?: number;
    height?: number;
  }
  export default function StyleItalicSVG({width=18, height=18}:TProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
            <path d="M10 6H14M18 6H14M14 6L10 18M10 18H14M10 18H6" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        </svg>
    )
  }