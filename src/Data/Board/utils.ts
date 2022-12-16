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

import type { Board, Piece, PiecesRecord, Position } from './types';
import { SIZE } from './constants'

export const isValidPos: (pos: Position) => boolean = ({r, c}) => {
  return r>=0 && r<=SIZE-1 && c>=0 && c<=SIZE-1;
}

const findPieceFromId: (id: number, record: PiecesRecord) => Piece = (id: number, record) => {
  return record[id];
}
export const findPieceFromPos: (params: {board: Board, record: PiecesRecord, r: number, c: number}) => Piece | null = ({
  board, r, c, record
}) => {
  const id = board[r]?.[c];
  if (typeof id !== 'number'){
    return null;
  }
  return findPieceFromId(id, record);
}

const genDiaForArr: (params: {
  r: number,
  c: number
}) => number[][][] = ({r, c}) => {
  return [
    [
      [r+1, SIZE, 1],
      [c+1, SIZE, 1]
    ],
    [
      [r-1, -1, -1],
      [c-1, -1, -1],
    ],
    [
      [r-1, -1, -1],
      [c+1, SIZE, 1]
    ],
    [
      [r+1, SIZE, 1],
      [c-1, -1, -1]
    ]
  ]
}
const genRowColForArr: (params: {
  r: number,
  c: number
}) => number[][][] = ({r, c}) => {
  return [
    [
      [r+1, SIZE, 1],
      [c, c, 0]
    ],
    [
      [r-1, -1, -1],
      [c, c, 0],
    ],
    [
      [r, r, 0],
      [c+1, SIZE, 1]
    ],
    [
      [r, r, 0],
      [c-1, -1, -1]
    ]
  ]
}

type Ret = {
  rowsCols: Piece[],
  dias: Piece[]
}
export const findNearestPieces: (params: {
  board: Board,
  record: PiecesRecord,
  r: number;
  c: number;
}) => Ret = ({
  board,
  record,
  r,
  c
}) => {
  const rcForArr = genRowColForArr({r, c});
  const diaForArr = genDiaForArr({r, c});
  const toRet: Ret = {
    rowsCols: [],
    dias: []
  }
  rcForArr.forEach((ele) => {
    const [rFor, cFor] = ele;
    const [rStart, rEnd, rStep] = rFor;
    const [cStart, cEnd, cStep] = cFor;
    let newR = rStart;
    let newC = cStart;
    while (newR !== rEnd && newC !== cEnd){
      const piece = findPieceFromPos({
        board,
        record,
        r: newR,
        c: newC,
      })
      if (piece){
        toRet.rowsCols.push(piece);
        break;
      }
      newR += rStep;
      newC += cStep;
    }
  })

  diaForArr.forEach((ele) => {
    const [rFor, cFor] = ele;
    const [rStart, rEnd, rStep] = rFor;
    const [cStart, cEnd, cStep] = cFor;
    let newR = rStart;
    let newC = cStart;
    while (newR !== rEnd && newC !== cEnd){
      const piece = findPieceFromPos({
        board,
        record,
        r: newR,
        c: newC,
      })
      if (piece){
        toRet.dias.push(piece);
        break;
      }
      newR += rStep;
      newC += cStep;
    }
  })

  return toRet;
}