import { addRoute, toggleComplete, removeRoute } from "./routes.js";

export function render(data) {
  const container = document.getElementById("lines");
  container.innerHTML = "";

  try {
    if (!Array.isArray(data)) {
      throw new Error("Invalid local data, please reset");
    }

    data.forEach((room, roomIndex) => {
      if (
          typeof room !== "object" ||
          typeof room.room !== "string" ||
          !Array.isArray(room.lines)
      ) {
        throw new Error(`Invalid room format at index ${roomIndex}`);
      }

      const roomDiv = document.createElement("div");
      roomDiv.className = "room";
      roomDiv.innerHTML = `<h2>${room.room}</h2>`;

      room.lines.forEach((line, lineIndex) => {
        if (
            typeof line !== "object" ||
            typeof line.name !== "string" ||
            !Array.isArray(line.routes)
        ) {
          throw new Error(
              `Invalid line format at room ${roomIndex}, line ${lineIndex}`
          );
        }

        const lineId = `room${roomIndex}-line${lineIndex}`;
        const lineDiv = document.createElement("div");
        lineDiv.className = "line";

        lineDiv.innerHTML = `
          <h3>${line.name}</h3>
          <div>
            <input placeholder="Route name" id="routeName-${lineId}" />
            <input placeholder="Grade" id="routeGrade-${lineId}" />
            <button id="addRoute-${lineId}">+</button>
          </div>
          <table class="route-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Difficulty</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              ${line.routes
            .map(
                (route, routeIndex) => `
                <tr class="route">
                  <td id="route-${lineId}-${routeIndex}" class="${
                    route.done ? "completed" : ""
                }">${route.name}</td>
                  <td>${route.grade}</td>
                  <td><button id="remove-${lineId}-${routeIndex}">🗑️</button></td>
                </tr>
              `
            )
            .join("")}
            </tbody>
          </table>
        `;

        roomDiv.appendChild(lineDiv);
      });

      container.appendChild(roomDiv);
    });

    // Attach event listeners after rendering
    data.forEach((room, roomIndex) => {
      room.lines.forEach((line, lineIndex) => {
        const lineId = `room${roomIndex}-line${lineIndex}`;
        const addRouteBtn = document.getElementById(`addRoute-${lineId}`);
        if (addRouteBtn) {
          addRouteBtn.addEventListener("click", () => {
            addRoute(data, roomIndex, lineIndex);
          });
        }

        line.routes.forEach((_, routeIndex) => {
          const routeCell = document.getElementById(
              `route-${lineId}-${routeIndex}`
          );
          const removeBtn = document.getElementById(
              `remove-${lineId}-${routeIndex}`
          );

          if (routeCell) {
            routeCell.addEventListener("click", () => {
              toggleComplete(data, roomIndex, lineIndex, routeIndex);
            });
          }

          if (removeBtn) {
            removeBtn.addEventListener("click", () => {
              removeRoute(data, roomIndex, lineIndex, routeIndex);
            });
          }
        });
      });
    });
  } catch (error) {
    console.error("Failed to render data:", error);
    container.innerHTML = `<div class="error">Invalid local data, please reset</div>`;
  }
}
