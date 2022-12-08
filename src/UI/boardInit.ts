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

export function init(){
  const store = new Store();
  const createChessBoard: () => void = () => {
    const board = document.getElementById("chess_board");
    if (! board){
      return;
    }
    const SIZE = 8;
    for (let i = SIZE-1; i>=0; i-=1){
      const newRow = document.createElement("div");
      newRow.className=("row border");
      for (let j = 0; j<SIZE; j+=1){
        const piece = store.boardController.findPieceFromPos({r: i, c: j});
        const newCol = document.createElement("div");
        newCol.className=("col border");
        newCol.innerText=`${piece?.name? piece.name + piece.color : 'N/A'}`;
        newRow.appendChild(newCol);
      }
      board.appendChild(newRow)
    }
  }
  createChessBoard()
}