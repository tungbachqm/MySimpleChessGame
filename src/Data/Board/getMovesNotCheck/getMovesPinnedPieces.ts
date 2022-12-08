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

import { Board, Piece, PiecesRecord, PIECE_NAME, MovesRecord, Position } from "../types";
import { findNearestPieces, findPieceFromPos, isValidPos } from '../utils';
import { SIZE } from '../constants';

type GetPinnedPiecesParams = {
  board: Board,
  record: PiecesRecord,
  king: Piece,
}
export const getMovesPinnedPieces: (params: GetPinnedPiecesParams) => MovesRecord = ({
  board,
  record,
  king
}) => {
  const toRet: MovesRecord = {};
  const {position: kingPos } = king; 
  const { dias, rowsCols } = findNearestPieces({
    board,
    record,
    r: kingPos.r,
    c: kingPos.c,
  });

  function addPieceToRetIfPinned({
    forArr,
    isDia,
    checkingPiece,
  }: {
    forArr: number[][],
    isDia: boolean,
    checkingPiece: Piece,
  }) {
    const [rForArr, cForArr] = forArr;
    const [rStart, rEnd, rStep] = rForArr;
    const [cStart, cEnd, cStep] = cForArr;

    let newR = rStart;
    let newC = cStart;

    const pinnedMoved: Position[] = [];
    while (isValidPos({r: newR, c: newC}) && (newR !== rEnd || newC !== cEnd)){
      const newPiece = findPieceFromPos({
        board,
        record,
        r: newR,
        c: newC,
      });
      pinnedMoved.push({r: newR, c: newC});
      if (newPiece){
        if (newPiece.color !== king.color){
          if (isDia && (newPiece.name === PIECE_NAME.B || newPiece.name === PIECE_NAME.Q)){
            toRet[checkingPiece.id] = pinnedMoved;
          }
        }
        break;
      }
      newR += rStep,
      newC += cStep
    }
  }

  dias.filter((piece) => piece.color === king.color).forEach((piece) => {
    const { position: pos } = piece;
    const isSameDiffDias = (pos.r - kingPos.r) === (pos.c - kingPos.c);
    let forArr: number[][];
    if (isSameDiffDias){
      if (pos.r < kingPos.r){
        forArr = [
          [pos.r - 1, -1, -1],
          [pos.c - 1, -1, -1],
        ]
      } else {
        forArr = [
          [pos.r + 1, SIZE, 1],
          [pos.c + 1, SIZE, 1]
        ]
      }
    } else {
      if (pos.r < kingPos.r){
        forArr = [
          [pos.r - 1, -1, -1],
          [pos.c + 1, SIZE, 1],
        ]
      } else {
        forArr = [
          [pos.r + 1, SIZE, 1],
          [pos.c -1, -1, -1]
        ]
      }
    }
    addPieceToRetIfPinned({
      forArr,
      isDia: true,
      checkingPiece: piece
    })
  })

  rowsCols.filter((piece) => piece.color === king.color).forEach((piece) => {
    const { position: pos } = piece;
    const isSameRow = pos.r === kingPos.r;
    let forArr: number[][];
    if (isSameRow){
      if (pos.c < kingPos.c){
        forArr = [
          [pos.r, pos.r, 0],
          [pos.c - 1, -1, -1],
        ]
      } else {
        forArr = [
          [pos.r, pos.r, 0],
          [pos.c + 1, SIZE, 1]
        ]
      }
    } else {
      if (pos.r < kingPos.r){
        forArr = [
          [pos.r - 1, -1, -1],
          [pos.c, pos.c, 0],
        ]
      } else {
        forArr = [
          [pos.r + 1, SIZE, 1],
          [pos.c, pos.c, 0]
        ]
      }
    }
    addPieceToRetIfPinned({
      forArr,
      isDia: true,
      checkingPiece: piece
    })
  })
  return toRet;
}
