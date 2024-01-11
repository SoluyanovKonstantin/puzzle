import { FC } from 'react';
import style from './PuzzlePiece.module.css';

export type TPuzzlePieceSide = 'in' | 'out' | 'none';

export type TPuzzlePieceProps = {
  index: number,
  left: TPuzzlePieceSide,
  right: TPuzzlePieceSide,
  top: TPuzzlePieceSide,
  bottom: TPuzzlePieceSide,
}

const PuzzlePiece: FC<TPuzzlePieceProps> = ({ index, left, right, top, bottom }) => {
  let maskImage: string[] = [];
  let urlToAssets = '/masks/';
  const sides: Record<string, TPuzzlePieceSide> = { left, right, top, bottom }
  Object.keys(sides).forEach( key => {
    if (sides[key] !== 'none') {
      maskImage.push( `url(${urlToAssets}${sides[key]}-${key}.svg)`);
    }
  } );
  return (
    <div className={style.block} style={ { maskImage: maskImage.join(', '), WebkitMaskImage: maskImage.join(', ')} } />
 );
}

export default PuzzlePiece;