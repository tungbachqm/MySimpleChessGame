// Copyright 2022 tung
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Store } from "../Data";
import "./styles.scss";
import { PIECE_SVG_URL } from './PieceSVG';
import { genSquareKey } from './utils';
import { genSquareClkListener } from './EventListenter';

export function init(){
  const store = new Store();
  const squreClkEventListener = genSquareClkListener(store);
  const createChessBoard: () => void = () => {
    const board = document.getElementById("chess_board");
    if (! board){
      return;
    }
    const SIZE = 8;
    for (let i = SIZE-1; i>=0; i-=1){
      const newRow = document.createElement("div");
      newRow.className=("row chess_board_row border d-flex");
      for (let j = 0; j<SIZE; j+=1){
        const piece = store.boardController.findPieceFromPos({r: i, c: j});
        const newCol = document.createElement("div");
        const bgClassName = (i+j)%2 === 0? 'black_item' : 'white_item';
        newCol.className=(`col position-relative border ${bgClassName} d-flex flex-grow-1 flex-shrink-1 chess_board_col`);
        const key = genSquareKey({
          r: i,
          c: j
        });
        newCol.id = key;
        newCol.addEventListener('click', () => {
          squreClkEventListener(key);
        })
        newRow.appendChild(newCol);
        const newSvg = piece?.name? document.createElement('img') : null;
        if (newSvg){
          newSvg.className = "piece_image"
          newSvg.src = PIECE_SVG_URL[piece.color][piece.name];
          newCol.appendChild(newSvg);
        }
      }
      board.appendChild(newRow)
    }
  }
  createChessBoard()
}