type TProps = {
    width?: number;
    height?: number;
  }
  export default function CloseSVG({width=18, height=18}:TProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
            <path d="M19 5L5 19M5.00001 5L19 19" stroke="#21201f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  }