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

import { PIECE_NAME } from '../Data/Board/types';
import type { PlayerColor} from '../Data/Board/types';
export const PIECE_SVG_URL: Record<PlayerColor, Record<PIECE_NAME, string>> = {
  B: {
    [PIECE_NAME.K]: require("asset/b_king_svg_NoShadow.svg"),
    [PIECE_NAME.Q]: require("asset/b_queen_svg_NoShadow.svg"),
    [PIECE_NAME.R]: require("asset/b_rook_svg_NoShadow.svg"),
    [PIECE_NAME.N]: require("asset/b_knight_svg_NoShadow.svg"),
    [PIECE_NAME.B]: require("asset/b_bishop_svg_NoShadow.svg"),
    [PIECE_NAME.P]: require("asset/b_pawn_svg_NoShadow.svg"),
  },
  W: {
    [PIECE_NAME.K]: require("asset/w_king_svg_NoShadow.svg"),
    [PIECE_NAME.Q]: require("asset/w_queen_svg_NoShadow.svg"),
    [PIECE_NAME.R]: require("asset/w_rook_svg_NoShadow.svg"),
    [PIECE_NAME.N]: require("asset/w_knight_svg_NoShadow.svg"),
    [PIECE_NAME.B]: require("asset/w_bishop_svg_NoShadow.svg"),
    [PIECE_NAME.P]: require("asset/w_pawn_svg_NoShadow.svg")
  }
}