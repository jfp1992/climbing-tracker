import { addRoute, toggleComplete, removeRoute } from "./routes.js";

export function render(data) {
  const container = document.getElementById("lines");
  container.innerHTML = "";

  // Loop through each room and its lines
  data.forEach((room, roomIndex) => {
    const roomDiv = document.createElement("div");
    roomDiv.className = "room";
    roomDiv.innerHTML = `<h2>${room.room}</h2>`;

    // Loop through each line in the room
    room.lines.forEach((line, lineIndex) => {
      const lineId = `room${roomIndex}-line${lineIndex}`;
      const lineDiv = document.createElement("div");
      lineDiv.className = "line";

      // Build the HTML for each line (inputs for name and grade, and route table)
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
                <td id="route-${lineId}-${routeIndex}" class="${route.done ? "completed" : ""}">${route.name}</td>
                <td>${route.grade}</td>
                <td><button id="remove-${lineId}-${routeIndex}">🗑️</button></td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `;

      roomDiv.appendChild(lineDiv);
    });

    container.appendChild(roomDiv);
  });

  // Attach event listeners for each room and line
  data.forEach((room, roomIndex) => {
    room.lines.forEach((line, lineIndex) => {
      const lineId = `room${roomIndex}-line${lineIndex}`;

      // Add route button - for adding a new route to the line
      const addRouteBtn = document.getElementById(`addRoute-${lineId}`);
      if (addRouteBtn) {
        addRouteBtn.addEventListener("click", () => {
          // Get the values from the inputs
          addRoute(data, roomIndex, lineIndex);
        });
      }

      // Attach event listeners to each route for toggling completion and removal
      line.routes.forEach((_, routeIndex) => {
        const routeCell = document.getElementById(
          `route-${lineId}-${routeIndex}`,
        );
        const removeBtn = document.getElementById(
          `remove-${lineId}-${routeIndex}`,
        );

        // Toggle completion of the route when clicking on the route cell
        if (routeCell) {
          routeCell.addEventListener("click", () => {
            toggleComplete(data, roomIndex, lineIndex, routeIndex);
          });
        }

        // Remove route when clicking on the trash button
        if (removeBtn) {
          removeBtn.addEventListener("click", () => {
            removeRoute(data, roomIndex, lineIndex, routeIndex);
          });
        }
      });
    });
  });
}
