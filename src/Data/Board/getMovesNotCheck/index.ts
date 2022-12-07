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

import { Board, MovesRecord, Piece, PiecesRecord } from "../types";
import { getAllMoves } from "./getAllMoves";
import { getMovesPinnedPieces } from "./getMovesPinnedPieces";

type Params = {
  piecesId: Set<number>;
  board: Board;
  record: PiecesRecord;
  king: Piece;
}
export const getMovesNotCheck: (params: Params) => MovesRecord = ({
  piecesId,
  board,
  record,
  king,
}) => {
  const pinnedMoveRecord = getMovesPinnedPieces({
    board,
    record,
    king,
  })
  const toRet: MovesRecord = {};
  piecesId.forEach((pieceId) => {
    let positions = getAllMoves({
      piece: record[pieceId],
      board,
      record,
    });
    if (pinnedMoveRecord[pieceId]){
      const pinnedMoves = pinnedMoveRecord[pieceId];
      const pinnedMovesSet = new Set<string>();
      function genKey(r: number, c:number) {
        return `r${r}c${c}`;
      }
      pinnedMoves.forEach((pos) => {
        pinnedMovesSet.add(genKey(pos.r, pos.c));
      });
      positions = positions.filter((pos) => {
        const key = genKey(pos.r, pos.c);
        return pinnedMovesSet.has(key);
      })
    }
    toRet[pieceId] = positions;
  })
  return toRet;
}