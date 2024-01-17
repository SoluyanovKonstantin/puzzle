import { FC, ReactElement, useEffect } from "react";
import style from "./Desk.module.css";
const Desk: FC<{
  width: number;
  height: number;
  puzzlesCountByXCoord: number;
  puzzlesCountByYCoord: number;
  onChangedBlock: (el: HTMLElement) => void;
}> = ({ width, height, puzzlesCountByXCoord, puzzlesCountByYCoord, onChangedBlock }) => {
  const blocks: ReactElement[] = [];
  let currentBlockOnTheDesk: HTMLElement | null = null;

  useEffect(() => {
    document.addEventListener('mousemove', checkMousePosition);

    return () => {
      document.removeEventListener('mousemove', checkMousePosition);
    }
  })

  for (let i = 0; i < puzzlesCountByXCoord * puzzlesCountByYCoord; i++) {
    blocks.push(<div key={i} id={''+i} className={style.cell} style={{width: width / puzzlesCountByXCoord, height: height / puzzlesCountByYCoord}}></div>);
  }

  const checkMousePosition = (event: MouseEvent) => {
    const overlapped = document.elementsFromPoint(event.pageX, event.pageY);
  
    const cells = overlapped.filter((el) => el.classList.contains(style.cell));
    const ids = cells.map((el) => el.id);
  
    for (const index in blocks) {
      const id: string = blocks[index].props.id;
      const elem = document.getElementById(id);

      if (ids.includes(id) && (ids[0] && (!currentBlockOnTheDesk || ids[0] !== currentBlockOnTheDesk?.id))) {
        elem!.style.boxShadow = "0 0 10px #000";
        currentBlockOnTheDesk = elem;
        onChangedBlock(currentBlockOnTheDesk!);
      } else if (!ids.includes(id)) {
        elem!.style.boxShadow = "none";
      }
    }
  }


  return (
    <div className={style.desk} style={{ width, height }}>
      {blocks}
    </div>
  );
};

export default Desk;
