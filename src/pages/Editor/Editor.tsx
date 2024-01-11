import { ReactElement, useState } from 'react';
import './Editor.css';
import PuzzlePiece, { TPuzzlePieceProps } from '../../components/PuzzlePiece/PuzzlePiece';

interface Matrix extends HTMLFormControlsCollection   {
  x: HTMLInputElement;
  y: HTMLInputElement
}
 
interface MatrixForm extends HTMLFormElement {
  readonly elements: Matrix;
}


function Editor() {
  const [url, setUrl] = useState('');
  const [puzzlePieces, setPuzzlePieces] = useState<ReactElement[]>([]);

  const onLoadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    if (event.target.files?.length) {
      setUrl(URL.createObjectURL(event.target.files[0]));
    }
  }

  const generateMatrix = (rows: number, cols: number) => {
    let matrix: TPuzzlePieceProps[][] = [];
    let index = 0;
    
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];

      for (let j = 0; j < cols; j++) {
        const piece: TPuzzlePieceProps = {
          index,
          left: j !== 0 ? matrix[i][j - 1].right === 'in' ? 'out' : 'in' : 'none',
          right: j !== cols - 1 ? Math.random() < 0.5 ? 'in' : 'out' : 'none',
          bottom: i !== rows - 1 ? Math.random() < 0.5 ? 'in' : 'out' : 'none',
          top: i !== 0 ? matrix[i - 1][j].bottom === 'in' ? 'out' : 'in': 'none',
        }

        matrix[i][j] = piece;
        index++;
      }
    }
    return matrix;
  }

  const generatePuzzle = (event: React.FormEvent<MatrixForm>) => {
    event.preventDefault();
    const target = event.currentTarget.elements;

    const pieces: ReactElement[] = [];
    const matrix = generateMatrix(+target.x.value, +target.y.value)
    console.log(matrix);

    matrix.forEach((arr) => arr.forEach((piece) => {
      pieces.push(<PuzzlePiece {...piece} />)
    }));

    setPuzzlePieces(pieces);
  }

  return <>
    <input type='file' onChange={onLoadImage} />
    <img src={ url } alt='puzzle' />

    <form onSubmit={generatePuzzle}>
      <input name='x' type="number" /> x <input name='y' type="number" />
      <button type='submit'>submit</button>
    </form>
    {
      puzzlePieces
    }
  </>;
}

export default Editor;