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

import type { Piece, Board, PlayerColor, Position } from '../types';
import { findPieceFromPos, isValidPos } from '../utils';
import { getPiecesControl } from '../getPiecesControl';
import { PIECE_NAME } from '../types';
import { SIZE } from '../constants';

const genBishopForArr: (params: {
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
const genRockForArr: (params: {
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
const genQueenForArr: (params: {
  r: number,
  c: number
}) => number[][][] = ({r, c}) => {
  return [
    ...genBishopForArr({r, c}),
    ...genRockForArr({r, c})
  ]
}

const getMovesFromForArr: (params: {
  color: PlayerColor,
  forArr: number[][][],
  board: Board,
  record: Record<number, Piece>
}) => Position[] = ({
  color,
  forArr,
  board,
  record,
}) => {
  const ret: Position[] = [];
  forArr.forEach((ele) => {
    const [rFor, cFor] = ele;
    const [rStart, rEnd, rStep] = rFor;
    const [cStart, cEnd, cStep] = cFor;
    let newR = rStart;
    let newC = cStart;
    while (isValidPos({r: newR, c: newC}) && (newR !== rEnd || newC !== cEnd)){
      const newPiece = findPieceFromPos({
        board,
        record,
        r: newR,
        c: newC
      })
      if (newPiece){
        if (newPiece.color !== color){
          ret.push({
            r: newR, c: newC
          })
        }
        break;
      } else {
        ret.push({
          r: newR, c: newC
        })
      }
      newR += rStep;
      newC += cStep;
    }
  })
  return ret;
}

export const getKingMoves: (params: {
  king: Piece
  board: Board,
  record: Record<number, Piece>;
}) => Position[] = ({
  board,
  record,
  king,
}) => {
  const toRet: Position[] = [];
  const {color: kingSideColor, position: kingPos }= king;
  const otherSideColor = kingSideColor === 'W'? 'B' : 'W';
  const modArr = [
    [-1, -1], [-1, -0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  modArr.forEach(([addR, addC]) => {
    const newR = kingPos.r+addR;
    const newC = kingPos.c+addC;
    if (isValidPos({r: newR, c: newC})){
      const piece = findPieceFromPos({
        board,
        record,
        r: newR,
        c: newC
      });
      if (! piece || piece.color !== kingSideColor){
        const otherSideControlPieces = getPiecesControl({
          board,
          record,
          pos: {
            r: newR,
            c: newC
          },
          color: otherSideColor
        })
        if (otherSideControlPieces.length === 0){
          toRet.push({r: newR, c: newC})
        }
      }
    }
  });
  return toRet;
}


export const getAllMoves: (params: {
  piece: Piece
  board: Board,
  record: Record<number, Piece>;
}) => Position[] = (params) => {
  const { color, name} = params.piece;
  const { piece, record, board} = params;
  const { r, c} = piece.position;
  switch (name){
    case PIECE_NAME.K: {
      return getKingMoves({
        board,
        record,
        king: piece,
      })
      // special case - need check if possible move is controlled
    }
    case PIECE_NAME.R: {
      const forArr = genRockForArr({r, c});
      return getMovesFromForArr({
        color,
        forArr,
        board,
        record
      })
    }
    case PIECE_NAME.B: {
      const forArr = genBishopForArr({r, c});
      return getMovesFromForArr({
        color,
        forArr,
        board,
        record,
      })
    }
    case PIECE_NAME.Q: {
      const forArr = genQueenForArr({r, c});
      return getMovesFromForArr({
        color,
        forArr,
        board,
        record
      })
    }
    case PIECE_NAME.N: {
      const numArr = [-2, -1, 1, 2];
      const ret: Position[] = [];
      numArr.forEach((rAdd) => {
        numArr.forEach((cAdd) => {
          if (Math.abs(rAdd) !== Math.abs(cAdd)){
            const newR = r + rAdd;
            const newC = c + cAdd;
            const newPiece = findPieceFromPos({
              board,
              record,
              r: newR,
              c: newC
            })
            if (newPiece){
              if (newPiece.color !== color){
                ret.push({r: newR, c: newC});
              }
            } else if (isValidPos({r: newR, c: newC})) {
              ret.push({r: newR, c: newC});
            }
          }
        })
      })
      return ret;
    }
    case PIECE_NAME.P: {
      const isMoved = color === 'W'?
        r !== 1 : r !== 6;
      const dirMul = color === 'W'? 1: -1;
      const eatPos = [[r + 1*dirMul, c-1], [r+1*dirMul, c+1]]
      const movePos = [[r + 1 * dirMul, c]];
      if (!isMoved){
        movePos.push([r + 2*dirMul, c])
      }
      const ret: Position[] = [];
      eatPos.forEach((pos) => {
        const newPiece = findPieceFromPos({
          board,
          record,
          r: pos[0],
          c: pos[1]
        })
        if (newPiece){
          if (newPiece.color !== color){
            ret.push({
              r: pos[0],
              c: pos[1]
            })
          }
        }
      })
      movePos.forEach((pos) => {
        const newPiece = findPieceFromPos({
          board,
          record,
          r: pos[0],
          c: pos[1]
        });
        if (! newPiece){
          ret.push({
            r: pos[0],
            c: pos[1]
          })
        }
      })
      return ret;
    }
  }

}