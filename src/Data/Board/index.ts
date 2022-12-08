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

/**
 * export only board function - getMove (piece)
 */
import { initBoardAndPieces } from './initBoard';
import { Board, MovesRecord, PiecesRecord, PIECE_NAME, PlayerColor, Position } from './types';
import { } from './';
import { getCheckingPieces } from './getCheckingPieces';
import { getMovesPreventCheck } from './getMovesPreventCheck';
import { getMovesNotCheck } from './getMovesNotCheck';
import { findPieceFromPos } from './utils';
import { SIZE } from './constants';

enum CHECK_STATUS {
  NON = 'NON',
  CHECKING = 'checking',
  PAT = 'pat',
  CHECK_MATE = 'check_mate',
}
export class BoardController {
  private board: Board;
  private piecesRecord: PiecesRecord;
  private color: PlayerColor;
  private kingsIdRecord: Record<PlayerColor, number>;
  private piecesIdRecord: Record<PlayerColor, Set<number>>;
  private checkStatus: CHECK_STATUS;
  private movesRecord: MovesRecord;

  constructor(){
    const { board, piecesRecord, idsRecord} = initBoardAndPieces();
    this.board = board;
    this.piecesRecord = piecesRecord;
    this.piecesIdRecord = idsRecord;
    this.checkStatus = CHECK_STATUS.NON;

    const newKingsIdRecord: Record<PlayerColor, number> = {
      'B': -1,
      'W': -1
    };
    Object.values(piecesRecord).forEach((piece) => {
      if (piece.name === PIECE_NAME.K){
        newKingsIdRecord[piece.color] = piece.id
      }
    })
    this.kingsIdRecord = newKingsIdRecord;
    this.changeSide('W');
  }

  public getBoard(){
    return this.board;
  }
  public getPiecesRecord(){
    return this.piecesRecord;
  }
  public findPieceFromPos(pos: Position){
    const { board, piecesRecord} = this;
    return findPieceFromPos({
      board,
      record: piecesRecord,
      r: pos.r,
      c: pos.c
    })
  }

  private getKing(color: PlayerColor){
    const { piecesRecord, kingsIdRecord} = this;
    return piecesRecord[kingsIdRecord[color]];
  }
  
  private changeSide(color: PlayerColor){
    this.color = color;
    const { board, piecesRecord, piecesIdRecord } = this;
    const king = this.getKing(color);
    const checkingPieces = getCheckingPieces({
      board,
      record: piecesRecord,
      king,
    })
    if (checkingPieces.length > 0){
      const newMovesRecord = getMovesPreventCheck({
        board,
        record: piecesRecord,
        checkPieces: checkingPieces,
        king,
      });
      if (Object.keys(newMovesRecord).length === 0){
        this.checkStatus = CHECK_STATUS.CHECK_MATE;
      } else {
        this.checkStatus = CHECK_STATUS.CHECKING;
      }
      this.movesRecord = newMovesRecord;
    } else {
      const newMovesRecord = getMovesNotCheck({
        board,
        record: piecesRecord,
        piecesId: piecesIdRecord[color],
        king,
      });
      if (Object.keys(newMovesRecord).length === 0){
        this.checkStatus = CHECK_STATUS.PAT;
      } else {
        this.checkStatus = CHECK_STATUS.NON;
      }
      this.movesRecord = newMovesRecord;
    }
  }

  public getCheckStatus(){
    return this.checkStatus;
  }

  public getMove(pieceId: number) {
    return this.movesRecord[pieceId] || [];
  }

  public rankUpCheck(params: {
    pieceId: number,
    newPos: Position,
  }) {
    const { pieceId, newPos } = params;
    const { piecesRecord: record} = this;
    const curPiece = record[pieceId];
    if (curPiece.name === PIECE_NAME.P){
      if ((curPiece.color === 'W' && newPos.r === SIZE-1) 
        || (curPiece.color === 'B' && newPos.r === 0)
      ){
        return true;
      }
    }
    return false;
  }

  public movePiece(params: {
    pieceId: number,
    newPos: Position,
    rankUpName: PIECE_NAME | undefined,
  }) {
    const { pieceId, newPos, rankUpName } = params;
    const { board, piecesRecord: record} = this;
    const curPiece = record[pieceId];
    if (curPiece.color !== this.color){
      return;
    }
    const otherColor = this.color === 'W'? 'B':'W';
    const curPieceInNewPos = findPieceFromPos({
      board,
      record,
      r: newPos.r,
      c: newPos.c
    });
    if (curPieceInNewPos){
      this.piecesIdRecord[curPieceInNewPos.color].delete(curPieceInNewPos.id);
    }
    record[pieceId] = {
      ...curPiece,
      position: newPos,
      name: rankUpName || curPiece.name
    };
    this.changeSide(otherColor);
  }
}