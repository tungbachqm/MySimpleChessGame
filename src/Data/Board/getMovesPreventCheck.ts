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

import { Board, Piece, PiecesRecord, PIECE_NAME, PlayerColor, Position, MovesRecord } from "./types";
import { getPiecesControl } from './getPiecesControl';
import { getPiecesMoveTo } from './getPiecesMoveTo';
import { findPieceFromPos } from "./utils";

type GetMovesPreventCheckParams = {
  board: Board,
  record: PiecesRecord,
  checkPieces: Piece[],
  king: Piece,
}

const getMovesPreventCheckByEat: (params: GetMovesPreventCheckParams) => MovesRecord = ({
  board,
  record,
  checkPieces
}) => {
  const toRet: MovesRecord = {};
  checkPieces.forEach((piece) => {
    const pos = piece.position;
    const eatablePieces = getPiecesControl({
      board,
      record,
      pos,
      color: piece.color === 'W'? 'B' : 'W'
    });
    eatablePieces.forEach((piece) => {
      toRet[piece.id] = [pos];
    })
  })
  return toRet;
}


const getMovesPreventCheckByCover: (params: GetMovesPreventCheckParams) => MovesRecord = ({
  board,
  record,
  king,
  checkPieces
}) => {
  const toRet: MovesRecord = {};
  function findPiecesMoveToAPosition ({
    r, c, color,
  }: {
    r: number,
    c: number,
    color: PlayerColor
  }) {
    const movablePieces = getPiecesMoveTo({
      board,
      record,
      color,
      pos: {
        r,
        c,
      }
    })
    movablePieces.forEach((piece) => {
      if (toRet[piece.id]){
        toRet[piece.id].push({r, c});
      } else {
        toRet[piece.id] = [{r, c}];
      }
    })
  }

  enum RELATIVE_CHECKED_POS {
    ROW = 'row',
    COL = 'col',
    DIFF_DIA = 'diffDia',
    SUM_DIA = 'sumDia'
  }
  const genForArr: (params: {
    relativePos: RELATIVE_CHECKED_POS,
    kingPos: Position,
    piecePos: Position,
  }) => number[][] = ({
    relativePos,
    kingPos,
    piecePos: pos,
  }) => {
    switch(relativePos){
      case RELATIVE_CHECKED_POS.ROW: {
        return [
          [pos.r, pos.r, 0],
          [Math.min(pos.c, kingPos.c), Math.max(pos.c, kingPos.c), 1],
        ]
      }
      case RELATIVE_CHECKED_POS.COL: {
        return [
          [Math.min(pos.r, kingPos.r), Math.max(pos.r, kingPos.r), 1],
          [pos.c, pos.c, 0]
        ]
      }
      case RELATIVE_CHECKED_POS.DIFF_DIA: {
        return [
          [Math.min(pos.r, kingPos.r), Math.max(pos.r, kingPos.r), 1],
          [Math.min(pos.c, kingPos.c), Math.max(pos.c, kingPos.c), 1]
        ]
      }
      case RELATIVE_CHECKED_POS.SUM_DIA: {
        return [
          [Math.max(pos.r, kingPos.r), Math.min(pos.r, kingPos.r), -1],
          [Math.min(pos.c, kingPos.c), Math.max(pos.c, kingPos.c), 1]
        ]
      }
    }
  }

  const { position: kingPos} = king;
  checkPieces.forEach((piece) => {
    const { position: pos, color } = piece;
    let rForArr: number[] | null = null;
    let cForArr: number[] | null = null;
    switch (piece.name){
      case (PIECE_NAME.B): {
        const isSameDiffDia = (pos.r - pos.c) === (kingPos.r - kingPos.c);
        [rForArr, cForArr] = genForArr({
          relativePos: isSameDiffDia? RELATIVE_CHECKED_POS.DIFF_DIA: RELATIVE_CHECKED_POS.SUM_DIA,
          kingPos,
          piecePos: pos
        })
      }
      case (PIECE_NAME.R): {
        const isSameRow = pos.r === kingPos.r;
        [rForArr, cForArr] = genForArr({
          relativePos: isSameRow? RELATIVE_CHECKED_POS.ROW: RELATIVE_CHECKED_POS.COL,
          kingPos,
          piecePos: pos
        })
      }
      case (PIECE_NAME.Q): {
        const isSameRow = pos.r === kingPos.r;
        const isSameCol = pos.c === kingPos.c;
        const isSameDiffDia = (pos.r - pos.c) === (kingPos.r - kingPos.c);
        let relativePos = RELATIVE_CHECKED_POS.SUM_DIA;
        if (isSameRow){
          relativePos = RELATIVE_CHECKED_POS.ROW
        } else if (isSameCol){
          relativePos = RELATIVE_CHECKED_POS.COL
        } else if (isSameDiffDia){
          relativePos = RELATIVE_CHECKED_POS.DIFF_DIA
        }
        [rForArr, cForArr] = genForArr({
          relativePos,
          kingPos,
          piecePos: pos
        })
      }
    }
    if (Array.isArray(rForArr) && Array.isArray(cForArr)){
      const [startR, endR, stepR] = rForArr;
      const [startC, endC, stepC] = cForArr;
      let newR = startR + stepR;
      let newC = startC + stepC;
      while (newR !== endR || newC !== endC){
        findPiecesMoveToAPosition({
          r: newR,
          c: newC,
          color: color === 'W'? 'B': 'W',
        });
        newR += stepR;
        newC += stepC;
      }
    }
  })
  return toRet;
}

const getMovesPreventCheckByKingMove: (params: GetMovesPreventCheckParams) => MovesRecord = ({
  board,
  record,
  king,
  checkPieces,
}) => {
  const toRet: MovesRecord = {};
  if (checkPieces.length <1){
    return toRet;
  }
  const otherSideColor = checkPieces[0].color;
  const {color: kingSideColor, position: kingPos }= king;
  const modArr = [
    [-1, -1], [-1, -0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  modArr.forEach(([addR, addC]) => {
    const newR = kingPos.r+addR;
    const newC = kingPos.c+addC;
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
        if (toRet[king.id]){
          toRet[king.id].push({r: newR, c: newC});
        } else {
          toRet[king.id] = [{r: newR, c: newC}];
        }
      }
    }
  })
  return toRet;
}

export const getMovesPreventCheck: (params: GetMovesPreventCheckParams) => MovesRecord = (params) => {
  const eatRecord = getMovesPreventCheckByEat(params);
  const coverRecord = getMovesPreventCheckByCover(params);
  const kingMoveRecord = getMovesPreventCheckByKingMove(params);
  const toRet = {...eatRecord};

  function mergeRecord(toMergeRecord: MovesRecord) {
    Object.keys(toMergeRecord).forEach((pieceId) => {
      if (! toRet[pieceId]){
        toRet[pieceId] = [...toMergeRecord[pieceId]]
      } else {
        toRet[pieceId].push(...toMergeRecord[pieceId]);
      }
    })
  }
  mergeRecord(coverRecord);
  mergeRecord(kingMoveRecord);

  const kingId = params.king.id;
  /**
   * because prevent by eat and prevent by king move may have same move
   */
  if (toRet[kingId]){
    const kingMoveSet = new Set();
    const newMoveArr: Position[] = [];
    toRet[kingId].forEach((move) => {
      const setKey = `r${move.r}c${move.c}`;
      if (! kingMoveSet.has(setKey)){
        kingMoveSet.add(setKey);
        newMoveArr.push(move);
      }
    })
    toRet[kingId] = newMoveArr;
  }
  return toRet;
}