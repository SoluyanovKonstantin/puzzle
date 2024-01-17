import { ReactElement, useRef, useState } from "react";
import "./Editor.css";
import PuzzlePiece, {
  TPuzzlePieceProps,
} from "../../components/PuzzlePiece/PuzzlePiece";
import Desk from "../../components/desk/Desk";

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
  const deskSizes = useRef({
    width: 0,
    height: 0,
    puzzlesCountByXCoord: 0,
    puzzlesCountByYCoord: 0
  });
  const currentBlockCoordinates = {
    top: 0,
    left: 0
  };
  const [url, setUrl] = useState("");
  const [puzzlePieces, setPuzzlePieces] = useState<Omit<TPuzzlePieceProps, "onPutPuzzle">[]>([]);

  const onLoadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();

    if (event.target.files?.length) {
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onloadend = (e) => {
        const image = new Image();
        if (e.target) {
          image.src = fileReader.result as string;
          image.onload = () => {
            sizeRef.current = gcd(image.width, image.height);

            if (sizeRef.current < 4) {
              console.error('error');
              return;
            }
            setUrl(fileReader.result as string);
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
    let matrix: Omit<TPuzzlePieceProps, 'onPutPuzzle'>[][] = [];

    for (let i = 0; i < rows; i++) {
      matrix[i] = [];

      for (let j = 0; j < cols; j++) {
        const piece: Omit<TPuzzlePieceProps, 'onPutPuzzle'> = {
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
          positionOnTheDesk: {
            top: null,
            left: null
          }
        };

        matrix[i][j] = piece;
      }
    }
    return matrix;
  };

  const generatePuzzle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setPuzzlePieces([]);
    const target = event.currentTarget;
    const pieces: Omit<TPuzzlePieceProps, "onPutPuzzle">[] = [];
    if (target.dataset.rows && target.dataset.columns && target.dataset.puzzleType) {

      const matrix = generateMatrix(+target.dataset.rows, +target.dataset.columns, sizeRef.current / +target.dataset.puzzleType);

      deskSizes.current = {
        width: sizeRef.current * +target.dataset.columns,
        height: sizeRef.current * +target.dataset.rows,
        puzzlesCountByXCoord: +target.dataset.columns,
        puzzlesCountByYCoord: +target.dataset.rows
      }

      matrix.forEach((arr) =>
        arr.forEach((piece) => {
          pieces.push(
            piece
          );
        })
      );

      setPuzzlePieces(pieces);
    }
  };

  return (
    <>
      <input type="file" onChange={onLoadImage} />
      <img width='200' src={url} alt="puzzle" />
      <button ref={generateEasyPuzzleRef} data-puzzle-type='1' onClick={generatePuzzle} style={{display: 'none'}}>Сгенерировать легкий паззл</button>
      <button ref={generateMiddlePuzzleRef} data-puzzle-type='2' onClick={generatePuzzle} style={{display: 'none'}}>Сгенерировать средний паззл</button>
      <button ref={generateHardPuzzleRef} data-puzzle-type='4' onClick={generatePuzzle} style={{display: 'none'}}>Сгенерировать сложный паззл</button>
      {puzzlePieces.map(piece => <PuzzlePiece
              key={"" + piece.i + "" + piece.j}
              {...piece}
              onPutPuzzle ={() => {
                const newPuzzlePieces: Omit<TPuzzlePieceProps, "onPutPuzzle">[] = structuredClone(puzzlePieces);
                const newPuzzlePiece = newPuzzlePieces.find(p => p.i === piece.i && p.j === piece.j);
                newPuzzlePiece!.positionOnTheDesk = structuredClone(currentBlockCoordinates);
                setPuzzlePieces(newPuzzlePieces);
              }}
              image={url}
            />)}
      {puzzlePieces.length && <Desk {...deskSizes.current} onChangedBlock={(el: HTMLElement) => {
        currentBlockCoordinates.top = +el.offsetTop;
        currentBlockCoordinates.left = el.offsetLeft;
      }} />}
    </>
  );
}

export default Editor;
