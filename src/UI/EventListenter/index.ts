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
import { genSquareKey, parseSquareKey } from '../utils';
import { movePieceUI } from './movePieceUI';

// enum PLAY_STATE {
//   SELECT_PIECE = 'select_piece',
//   SELECT_MOVE = 'select_move',
// }
export const genSquareClkListener: (store: Store) => (key: string) => void = (store) => {
  const highlightKeysSet = new Set<string>();
  let selectPiece: Piece | null = null;
  const { boardController } = store;

  const movePiece = ({
    pieceId, newPos, oldPos, rankUpName
  }: { pieceId: number, newPos: Position, 
    oldPos: Position,
    rankUpName: PIECE_NAME | null
  }) => {
    boardController.movePiece({
      pieceId,
      newPos,
      rankUpName,
    });
    movePieceUI(
      genSquareKey(oldPos),
      genSquareKey(newPos)
    )
    // dehighLightPrevMove
    // highlightPrevMove
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
    console.log('check event listener', pos, playSide);

    if (highlightKeysSet.size > 0){
      dehighlightMovableSquare();
      if (highlightKeysSet.has(key)){
        /// move piece to Key
        let rankUpName: PIECE_NAME | null = null;
        if (boardController.rankUpCheck({
          pieceId: selectPiece.id,
          newPos: pos,
        })) {
          // pop up rank up - this is handle by another
          rankUpName = PIECE_NAME.Q;
          console.log('checl rank up', rankUpName)
        } else {
          movePiece({
            pieceId: selectPiece.id,
            newPos: pos,
            oldPos: selectPiece.position,
            rankUpName,
          });
        }
      }
      highlightKeysSet.clear();
      selectPiece = null;
    }

    const piece = boardController.findPieceFromPos(pos);
    console.log('check found piece', piece);
    if (piece?.color === playSide){
      const keys = boardController.getMove(piece.id).map((pos) => genSquareKey(pos));
      keys.forEach((key) => highlightKeysSet.add(key));
      console.log('before highlight moveable', highlightKeysSet);
      highlightMoveableSquare(keys);
      selectPiece = piece;
    }
  }
  return clickListener;
}