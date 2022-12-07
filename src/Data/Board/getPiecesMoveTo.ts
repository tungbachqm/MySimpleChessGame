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
import type { IsControlParams } from './getPiecesControl';
import { getKnightsControl, getQRBControl } from './getPiecesControl';


const getPawnsMoveTo: (params: IsControlParams) => Piece[] = ({
  board,
  pos,
  color,
  record,
}) => {
  const { r, c } = pos;
  const pieceAtPos = findPieceFromPos({
    board,
    record,
    r,
    c
  });
  if (pieceAtPos){
    return [];
  }

  const toRet: Piece[] = [];
  if (color === 'W' && r === 3){
    const row2Piece = findPieceFromPos({board, record, r: r-1, c});
    const row1Piece = findPieceFromPos({board, record, r: r-2, c});
    if (! row2Piece && row1Piece?.name === PIECE_NAME.P && row1Piece.color === color && row1Piece.moved === false){
      toRet.push(row1Piece);
    }
  }
  if (color === 'B' && r===4){
    const row5Piece = findPieceFromPos({board, record, r: r+1, c});
    const row6Piece = findPieceFromPos({board, record, r: r+2, c});
    if (! row5Piece && row6Piece?.name === PIECE_NAME.P && row6Piece.color === color && row6Piece.moved === false){
      toRet.push(row6Piece);
    }
  }
  const nextRowPiece = findPieceFromPos({board, record, 
    r: color === 'W'? r-1: r+1,
    c
  });
  if (nextRowPiece?.color === color && nextRowPiece.name === PIECE_NAME.P){
    toRet.push(nextRowPiece);
  }
  return toRet;
}

export const getPiecesMoveTo: (params: IsControlParams) => Piece[] = (params) => {
  return [
    ...getKnightsControl(params),
    ...getPawnsMoveTo(params),
    ...getQRBControl(params),
  ];
}


