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

import type { Store } from '../../Data';
import { Position, Piece, PIECE_NAME } from '../../Data/Board/types';
import { highlightMoveableSquare, dehighlightMovableSquare } from './hightLightMovableSquare';
import { highlightPrevMoveSquare, dehighlightPrevMoveSquare } from './highLightPrevMove';
import { genSquareKey, parseSquareKey } from '../utils';
import { movePieceUI } from './movePieceUI';
import { initRankUpMsgBox, hideMessageBox } from '../MessageBox';
import { PIECE_SVG_URL } from '../PieceSVG';

export const genSquareClkListener: (store: Store) => (key: string) => void = (store) => {
  const highlightKeysSet = new Set<string>();
  let selectPiece: Piece | null = null;
  const { boardController } = store;

  const movePiece = ({
    piece, newPos, oldPos, rankUpName
  }: { piece: Piece, newPos: Position, 
    oldPos: Position,
    rankUpName: PIECE_NAME | null,
  }) => {
    boardController.movePiece({
      pieceId: piece.id,
      newPos,
      rankUpName,
    });
    const oldKey = genSquareKey(oldPos);
    const newKey = genSquareKey(newPos);
    movePieceUI(
      oldKey,
      newKey,
      rankUpName? PIECE_SVG_URL[piece.color][rankUpName] : undefined
    )
    dehighlightPrevMoveSquare();
    highlightPrevMoveSquare([oldKey, newKey]);
  }

  /**
   * haven't handle 
   * 0-0 and 0-0-0
   * rank up for pawn
   * pawn eating the piece pass it - may ignore for now
   */
  const clickListener = (key: string) => {
    const playSide = boardController.getColor();
    const pos = parseSquareKey(key);

    if (highlightKeysSet.size > 0){
      dehighlightMovableSquare();
      if (highlightKeysSet.has(key)){
        /// move piece to Key
        if (boardController.rankUpCheck({
          pieceId: selectPiece.id,
          newPos: pos,
        })) {
          // pop up rank up - this is handle by another
          initRankUpMsgBox({
            color: selectPiece.color,
            onRankUp: (pieceName) => {
              movePiece({
                piece: selectPiece,
                newPos: pos,
                oldPos: selectPiece.position,
                rankUpName: pieceName
              });
              hideMessageBox();
              highlightKeysSet.clear();
              selectPiece = null;
            }
          })
        } else {
          movePiece({
            piece: selectPiece,
            newPos: pos,
            oldPos: selectPiece.position,
            rankUpName: null
          });
          highlightKeysSet.clear();
          selectPiece = null;
        }
      }
    }

    const piece = boardController.findPieceFromPos(pos);
    if (piece?.color === playSide){
      const keys = boardController.getMove(piece.id).map((pos) => genSquareKey(pos));
      keys.forEach((key) => highlightKeysSet.add(key));
      highlightMoveableSquare(keys);
      selectPiece = piece;
    }
  }
  return clickListener;
}