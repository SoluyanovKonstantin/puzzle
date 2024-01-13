import { ReactElement, useRef, useState } from "react";
import "./Editor.css";
import PuzzlePiece, {
  TPuzzlePieceProps,
} from "../../components/PuzzlePiece/PuzzlePiece";

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

function Editor() {
  const sizeRef = useRef(0);
  const generateEasyPuzzleRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const generateMiddlePuzzleRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const generateHardPuzzleRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const [url, setUrl] = useState("");
  const [puzzlePieces, setPuzzlePieces] = useState<ReactElement[]>([]);

  const onLoadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();

    if (event.target.files?.length) {
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onloadend = (e) => {
        const image = new Image();
        if (e.target) {
          image.src = fileReader.result as string;
          setUrl(fileReader.result as string);
          image.onload = () => {
            sizeRef.current = gcd(image.width, image.height);
            if(generateEasyPuzzleRef.current && generateMiddlePuzzleRef.current && generateHardPuzzleRef.current) {
              generateHardPuzzleRef.current.style.display = generateMiddlePuzzleRef.current.style.display = generateEasyPuzzleRef.current.style.display = 'block';
              generateEasyPuzzleRef.current.dataset.columns =''+ (image.width / sizeRef.current);
              generateEasyPuzzleRef.current.dataset.rows =''+ (image.height / sizeRef.current);

              generateMiddlePuzzleRef.current.dataset.columns =''+ (image.width / sizeRef.current / 2);
              generateMiddlePuzzleRef.current.dataset.rows =''+ (image.height / sizeRef.current / 2);

              generateHardPuzzleRef.current.dataset.columns =''+ (image.width / sizeRef.current / 4);
              generateHardPuzzleRef.current.dataset.rows =''+ (image.height / sizeRef.current / 4);
            }
          };
        }
      };
    }
  };

  const generateMatrix = (rows: number, cols: number, size: number) => {
    let matrix: TPuzzlePieceProps[][] = [];

    for (let i = 0; i < rows; i++) {
      matrix[i] = [];

      for (let j = 0; j < cols; j++) {
        const piece: TPuzzlePieceProps = {
          i,
          j,
          size,
          left:
            j !== 0 ? (matrix[i][j - 1].right === "in" ? "out" : "in") : "none",
          right: j !== cols - 1 ? (Math.random() < 0.5 ? "in" : "out") : "none",
          bottom:
            i !== rows - 1 ? (Math.random() < 0.5 ? "in" : "out") : "none",
          top:
            i !== 0
              ? matrix[i - 1][j].bottom === "in"
                ? "out"
                : "in"
              : "none",
        };

        matrix[i][j] = piece;
      }
    }
    return matrix;
  };

  const generatePuzzle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setPuzzlePieces([]);
    const target = event.currentTarget;
    console.log(target.dataset.puzzleType);
    const pieces: ReactElement[] = [];
    if (target.dataset.rows && target.dataset.columns && target.dataset.puzzleType) {

      const matrix = generateMatrix(+target.dataset.rows, +target.dataset.columns, sizeRef.current / +target.dataset.puzzleType);

      matrix.forEach((arr) =>
        arr.forEach((piece) => {
          pieces.push(
            <PuzzlePiece
              key={"" + piece.i + "" + piece.j}
              {...piece}
              image={url}
            />
          );
        })
      );

      setPuzzlePieces(pieces);
    }
  };

  return (
    <>
      <input type="file" onChange={onLoadImage} />
      <img src={url} alt="puzzle" />
      <button ref={generateEasyPuzzleRef} data-puzzle-type='1' onClick={generatePuzzle} style={{display: 'none'}}>generateBigPuzzle</button>
      <button ref={generateMiddlePuzzleRef} data-puzzle-type='2' onClick={generatePuzzle} style={{display: 'none'}}>generateMiddlePuzzle</button>
      <button ref={generateHardPuzzleRef} data-puzzle-type='4' onClick={generatePuzzle} style={{display: 'none'}}>generateLittlePuzzle</button>
      {puzzlePieces}
    </>
  );
}

export default Editor;
