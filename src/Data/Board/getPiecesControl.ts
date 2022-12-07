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

import { Board, PiecesRecord, PIECE_NAME, PlayerColor, Piece } from './types';
import { findNearestPieces, findPieceFromPos} from './utils';

export type IsControlParams = {
  board: Board,
  pos: {
    r: number,
    c: number,
  },
  color: PlayerColor,
  record: PiecesRecord
}
const getPawnsControl: (params: IsControlParams) => Piece[] = ({
  board,
  pos,
  color,
  record,
}) => {
  const posModArr = color === 'W'? [
    [-1, -1], [1, 1]
  ] : [
    [-1, 1], [1, 1]
  ]
  const { r, c } = pos;
  const toRet: Piece[] = [];
  posModArr.forEach((posMod) => {
    const [rAdd, cAdd] = posMod;
    const piece = findPieceFromPos({
      board,
      record,
      r: r+rAdd,
      c: c+cAdd,
    })
    if (piece?.name === PIECE_NAME.P && piece?.color === color){
      toRet.push(piece);
    }
  })
  return toRet;
}
export const getKnightsControl: (params: IsControlParams) => Piece[] = ({
  board,
  pos: kingPos,
  color,
  record
}) => {
  const numArr = [-2, -1, 1, 2];
  const ret: Piece[] = [];
  const { r, c } = kingPos;
  numArr.forEach((rAdd) => {
    numArr.forEach((cAdd) => {
      if (Math.abs(rAdd) !== Math.abs(cAdd)){
        const newR = r + rAdd;
        const newC = c + cAdd;
        const newPiece = findPieceFromPos({
          board,
          record,
          r: newR,
          c: newR
        });
        if (newPiece?.name === PIECE_NAME.N && newPiece.color === color){
          ret.push(newPiece);
        }
      }
    })
  })
  return ret;
}
export const getQRBControl: (params: IsControlParams) => Piece[] = ({
  board,
  pos,
  color,
  record
}) => {
  const { r, c} = pos;
  const { dias, rowsCols} = findNearestPieces({
    board,
    record,
    r,
    c
  });
  const toRet: Piece[] = [];
  dias.forEach((piece) => {
    if ( (piece.name === PIECE_NAME.Q || piece.name === PIECE_NAME.B) && piece.color === color){
      toRet.push(piece);
    }
  })
  rowsCols.forEach((piece) => {
    if ( (piece.name === PIECE_NAME.Q || piece.name === PIECE_NAME.R) && piece.color === color){
      toRet.push(piece);
    }
  })
  return toRet;
}
const getKingControl: (params: IsControlParams) => Piece[] = ({
  board,
  pos,
  color,
  record
}) => {
  const modArr = [
    [-1, -1], [-1, -0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  let toRet: Piece[] = [];
  modArr.forEach(([addR, addC]) => {
    const newR = pos.r+addR;
    const newC = pos.c+addC;
    const piece = findPieceFromPos({
      board,
      record,
      r: newR,
      c: newC
    });
    if (piece?.name === PIECE_NAME.K && piece.color === color){
      toRet.push(piece);
    }
  })
  return toRet;
}

export const getPiecesControl: (params: IsControlParams) => Piece[] = (params) => {
  return [
    ...getKnightsControl(params),
    ...getPawnsControl(params),
    ...getQRBControl(params),
    ...getKingControl(params)
  ];
}
