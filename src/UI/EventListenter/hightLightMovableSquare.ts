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
import "./styles.scss";

const highLightChildClassName = "move_square_highlight";
export const highlightMoveableSquare = (squaresKey: string[]) => {
  squaresKey.forEach((squareKey) => {
    const square = document.getElementById(squareKey);
    if (square){
      const highLightChild = document.createElement("div");
      highLightChild.className = highLightChildClassName;
      square.appendChild(highLightChild);
    }
  })
}
export const dehighlightMovableSquare = () => {
  const squares = document.getElementsByClassName(highLightChildClassName);
  while (squares.length > 0){
    const square = squares.item(0);
    if (square){
      square.remove();
    }
  }
}