import { FC, useRef, useState } from 'react';
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
  image?: string
}

const PuzzlePiece: FC<TPuzzlePieceProps> = ({ i, j, size, left, right, top, bottom, image }) => {
  const htmlElementWithCirclesRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const maskImage: string[] = [];
  const urlToAssets = '/masks/';
  const circleRadius = size / 5;
  const sides: Record<string, TPuzzlePieceSide> = { left, right, top, bottom }
  Object.keys(sides).forEach( key => {
    if (sides[key] === 'in') {
      maskImage.push( `url(${urlToAssets}${sides[key]}-${key}.svg)`);
    }
  } );

  const omMouseMove = (event: React.MouseEvent) => { // (1) отследить нажатие

    const ball = event.currentTarget as HTMLElement;
    ball.ondragstart = () => {
      return false;
    };
    event.preventDefault();
    // (2) подготовить к перемещению:
    // разместить поверх остального содержимого и в абсолютных координатах
    ball.style.position = 'absolute';
    ball.style.zIndex = '1000';
    // переместим в body, чтобы мяч был точно не внутри position:relative
    // и установим абсолютно спозиционированный мяч под курсор
  
    moveAt(event.pageX, event.pageY);
  
    // передвинуть мяч под координаты курсора
    // и сдвинуть на половину ширины/высоты для центрирования
    function moveAt(pageX: number, pageY: number) {
      const x = pageX - ball.offsetWidth / 2 + 'px';
      const y = pageY - ball.offsetHeight / 2 + 'px';
      if (htmlElementWithCirclesRef.current) { htmlElementWithCirclesRef.current.style.top = y };
      if (htmlElementWithCirclesRef.current) { htmlElementWithCirclesRef.current.style.left = x };
      ball.style.left = x;
      ball.style.top = y;
    }
  
    function onMouseMove(event: MouseEvent) {
      moveAt(event.pageX, event.pageY);
    }
  
    // (3) перемещать по экрану
    document.addEventListener('mousemove', onMouseMove);
  
    // (4) положить мяч, удалить более ненужные обработчики событий
    ball.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      ball.onmouseup = null;
    };
  
  };

  return (
    <>
      <div onMouseDown={omMouseMove} className={style.block} style={ { 
        maskImage: maskImage.join(', '), 
        WebkitMaskImage: maskImage.join(', '), 
        backgroundImage: `url(${image})`,
        backgroundPositionX: - size * j, 
        backgroundPositionY: - size * i,
        width: size,
        height: size,
        position: 'absolute',
        zIndex: 100000,
      } } />
      <div ref={htmlElementWithCirclesRef} style={{ width: size, height: size, position: 'absolute' }}>
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