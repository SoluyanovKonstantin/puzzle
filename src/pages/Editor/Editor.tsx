import { ReactElement, useState } from 'react';
import './Editor.css';
import PuzzlePiece from '../../components/PuzzlePiece/PuzzlePiece';

interface Matrix extends HTMLFormControlsCollection   {
  firstNumber: HTMLInputElement;
  secondNumber: HTMLInputElement
}
 
interface MatrixForm extends HTMLFormElement {
  readonly elements: Matrix;
}

function Editor() {
  const [url, setUrl] = useState('');
  const [puzzlePieces, setPuzzlePieces] = useState<ReactElement[]>([]);

  const onLoadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUrl(URL.createObjectURL(event.target.files[0]));
    }
  }

  const generatePuzzle = (event: React.FormEvent<MatrixForm>) => {
    event.preventDefault();
    const target = event.currentTarget.elements;

    const pieces: ReactElement[] = [];
    for (let i = 0; i < +target.firstNumber.value * +target.secondNumber.value; i++) {
      pieces.push(<PuzzlePiece />);
    }

    setPuzzlePieces(pieces);
  }

  return <>
    <input type='file' onChange={onLoadImage} />
    <img src={ url } alt='puzzle' />

    <form onSubmit={generatePuzzle}>
      <input name='firstNumber' type="number" /> x <input name='secondNumber' type="number" />
      <button type='submit'>submit</button>
    </form>
    {
      puzzlePieces
    }

    <PuzzlePiece></PuzzlePiece>
  </>;
}

export default Editor;