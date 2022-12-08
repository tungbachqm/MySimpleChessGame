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

import { SIZE } from './constants';
import { Board, Piece, PIECE_NAME, PlayerColor } from './types';

const bottomRow: PIECE_NAME[] = [
  PIECE_NAME.R, PIECE_NAME.N, PIECE_NAME.B, PIECE_NAME.Q, PIECE_NAME.K, PIECE_NAME.B, PIECE_NAME.N, PIECE_NAME.R
]

export const initBoardAndPieces: () => {
  board: Board
  piecesRecord: Record<number, Piece>;
  idsRecord: Record<PlayerColor, Set<number>>;
} = () => {
  const newBoard: Board = [];
  const piecesRecord: Record<number, Piece> = {};
  const idsRecord: Record<PlayerColor, Set<number>> = {
    'B': new Set(),
    'W': new Set(),
  }
  for (let r = 0; r<SIZE; r+=1){
    const newRow = Array(SIZE).fill(null);
    newBoard.push(newRow);
  }
  let curId = 1;
  for (let r = 0; r<SIZE; r+=1){
    switch(r){
      case 0:
      case 7: {
        for (let c=0; c<SIZE; c+=1){
          const color = r === 0? 'W' : 'B';
          const newPiece: Piece = {
            id: curId,
            color,
            name: bottomRow[c],
            position: {
              r,
              c,
            },
            moved: false
          }
          piecesRecord[curId] = newPiece;
          newBoard[r][c] = curId;
          idsRecord[color].add(curId);
          curId +=1;
        }
        break;
      }
      case 1:
      case 6: {
        for (let c=0; c<8; c+=1){
          const color = r === 1? 'W' : 'B';
          const newPiece: Piece = {
            id: curId,
            color: color,
            name: PIECE_NAME.P,
            position: {
              r,
              c,
            },
            moved: false,
          }
          piecesRecord[curId] = newPiece;
          newBoard[r][c] = curId;
          idsRecord[color].add(curId);
          curId +=1;
        }
        break;
      }
      default: {
        for (let c=0; c<8; c+=1){
          newBoard[r][c] = null;
        }
      }
    }
  }
  return {
    board: newBoard,
    piecesRecord,
    idsRecord,
  }
}