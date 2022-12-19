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
 * ui for the box
 * what about event listener -> may add by board controller
 */
import { PIECE_NAME } from '../../Data/Board/types';
import type { PlayerColor } from '../../Data/Board/types';
import { PIECE_SVG_URL } from '../PieceSVG';

export function initRankUpMsgBox(params: {
  color: PlayerColor,
  onRankUp: (rankUpName: PIECE_NAME) => void;
}){
  const {color, onRankUp} = params;
  const msgBox = document.getElementById("message_box");
  if (! msgBox){
    return;
  }
  const boxContent = document.createElement('div');
  boxContent.className = "row rankup_content";

  const SVG_OBJ = PIECE_SVG_URL[color];
  const toShowPieces = [PIECE_NAME.Q, PIECE_NAME.R, PIECE_NAME.N, PIECE_NAME.B];

  toShowPieces.forEach((pieceName) => {
    const newSvg = document.createElement('img');
    newSvg.className = "rankup_piece border col";
    newSvg.src = SVG_OBJ[pieceName];
    newSvg.addEventListener('click', () => {
      onRankUp(pieceName);
    })
    boxContent.appendChild(newSvg);
  })

  msgBox.appendChild(boxContent);
  msgBox.className = msgBox.className.split('d-none').join("");
}
