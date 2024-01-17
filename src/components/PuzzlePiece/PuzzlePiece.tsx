import { FC, useEffect, useRef } from 'react';
import style from './PuzzlePiece.module.css';

export type TPuzzlePieceSide = 'in' | 'out' | 'none';

export type TPuzzlePieceProps = {
  i: number,
  j: number,
  size: number,
  left: TPuzzlePieceSide,
  right: TPuzzlePieceSide,
  top: TPuzzlePieceSide,
  bottom: TPuzzlePieceSide,
  onPutPuzzle: () => void,
  image?: string,
  positionOnTheDesk?: {
    left: number | null,
    top: number | null
  }
}

const PuzzlePiece: FC<TPuzzlePieceProps> = ({ i, j, size, left, right, top, bottom, image, positionOnTheDesk, onPutPuzzle }) => {
  const htmlElementWithCirclesRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const htmlPuzzleBlockElementRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const maskImage: string[] = [];
  const urlToAssets = '/masks/';
  const circleRadius = size / 5;
  const randomCoordinates = useRef({
    top: `${Math.round(Math.random() * (79)) + 10}%`,
    left: `${Math.round(Math.random() * (79)) + 10}%`,
  })
  const sides: Record<string, TPuzzlePieceSide> = { left, right, top, bottom }
  Object.keys(sides).forEach( key => {
    if (sides[key] === 'in') {
      maskImage.push( `url(${urlToAssets}${sides[key]}-${key}.svg)`);
    }
  } );

  useEffect(() => {
    if (positionOnTheDesk?.top) {
      htmlElementWithCirclesRef.current!.style.left = ''+positionOnTheDesk.left;
      htmlElementWithCirclesRef.current!.style.top = ''+positionOnTheDesk.top;

      htmlPuzzleBlockElementRef.current!.style.left = ''+positionOnTheDesk.left;
      htmlPuzzleBlockElementRef.current!.style.top = ''+positionOnTheDesk.top;
    }
  }, [positionOnTheDesk])

  const onMouseMove = (event: React.MouseEvent) => {

    const element = event.currentTarget as HTMLElement;
    element.ondragstart = () => {
      return false;
    };
    event.preventDefault();
    element.style.position = 'absolute';
    element.style.zIndex = '10001';
    htmlElementWithCirclesRef.current!.style.zIndex = '10001'
  
    const moveAt = (pageX: number, pageY: number) => {
      const x = pageX - element.offsetWidth / 2 + 'px';
      const y = pageY - element.offsetHeight / 2 + 'px';
      if (htmlElementWithCirclesRef.current) { htmlElementWithCirclesRef.current.style.top = y };
      if (htmlElementWithCirclesRef.current) { htmlElementWithCirclesRef.current.style.left = x };
      element.style.left = x;
      element.style.top = y;
    }

    moveAt(event.pageX, event.pageY);
  
    const onMouseMove = (event: MouseEvent) => {
      moveAt(event.pageX, event.pageY);
    }
  
    document.addEventListener('mousemove', onMouseMove);
  
    document.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
      element.style.zIndex = '10000';
      htmlElementWithCirclesRef.current!.style.zIndex = '10000'

      onPutPuzzle();
    };
  
  };

  return (
    <>
      <div ref={htmlPuzzleBlockElementRef} onMouseDown={onMouseMove} className={style.block} style={ { 
        maskImage: maskImage.join(', '), 
        WebkitMaskImage: maskImage.join(', '), 
        backgroundImage: `url(${image})`,
        backgroundPositionX: - size * j, 
        backgroundPositionY: - size * i,
        width: size,
        height: size,
        top: positionOnTheDesk?.top ?? randomCoordinates.current.top,
        left: positionOnTheDesk?.left ?? randomCoordinates.current.left,
        position: 'absolute',
        zIndex: 10000,
      } } />
      <div ref={htmlElementWithCirclesRef} className={style.block__wrapCircle} style={{ 
        width: size, 
        height: size, 
        top: positionOnTheDesk?.top ?? randomCoordinates.current.top, 
        left: positionOnTheDesk?.left ?? randomCoordinates.current.left }}>
        {left === 'out' && 
        <div className={[style.block__circle, style.block__circle_left].join(' ')} style={{ 
          width: size / 2.5, 
          height: size / 2.5, 
          backgroundImage: `url(${image})`,
          backgroundPositionX: -(size * j - circleRadius), 
          backgroundPositionY: -(size * i + size / 2 - circleRadius),
          }} />}
        {right === 'out' &&
          <div className={[style.block__circle, style.block__circle_right].join(' ')} style={{ 
          width: size / 2.5, 
          height: size / 2.5, 
          backgroundImage: `url(${image})`,
          backgroundPositionX: -(size * j + size - circleRadius), 
          backgroundPositionY: -(size * i  + size / 2 - circleRadius),
          }} />
          
        }
        {top === 'out' &&
          <div className={[style.block__circle, style.block__circle_top].join(' ')} style={{ 
          width: size / 2.5, 
          height: size / 2.5, 
          backgroundImage: `url(${image})`,
          backgroundPositionX: -(size * j + size / 2 - circleRadius), 
          backgroundPositionY: -(size * i - circleRadius),
          }} />
        }
        {bottom === 'out' &&
          <div className={[style.block__circle, style.block__circle_bottom].join(' ')} style={{ 
          width: size / 2.5, 
          height: size / 2.5, 
          backgroundImage: `url(${image})`,
          backgroundPositionX: -(size * j + size / 2 - circleRadius), 
          backgroundPositionY: -(size * i + size - circleRadius),
          }} />
        }
        
      </div>
    </>
 );
}

export default PuzzlePiece;