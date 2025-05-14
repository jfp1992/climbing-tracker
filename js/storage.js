export function loadData() {
  const saved = localStorage.getItem("routeData");
  return saved ? JSON.parse(saved) : [];
}

export function saveData(data) {
  localStorage.setItem("routeData", JSON.stringify(data));
}

export async function resetData() {
  localStorage.removeItem("routeData");
  try {
    const res = await fetch("./data/routes.json");
    const seedData = await res.json();
    saveData(seedData);
    return seedData;
  } catch {
    const fallback = [
      { routes: [{ name: "Default Route 1", grade: "5.10a", done: false }] },
      { routes: [{ name: "Default Route 2", grade: "5.12b", done: false }] },
    ];
    saveData(fallback);
    return fallback;
  }
}

export async function updateData(currentData) {
  try {
    const res = await fetch("./data/routes.json");
    const newData = await res.json();

    newData.forEach((room, i) => {
      // Loop through each room
      room.lines.forEach((newLine, j) => {
        // Loop through each line in the room
        // Ensure that 'routes' exists, is an array, and is not empty
        if (
          !newLine.routes ||
          !Array.isArray(newLine.routes) ||
          newLine.routes.length === 0
        ) {
          console.warn(
            `Skipping line ${j} in room ${i} due to missing or invalid 'routes' property.`,
          );
          newLine.routes = []; // Initialize as an empty array if invalid
        }

        if (currentData[i]) {
          // If the room exists in currentData, update its routes
          if (currentData[i].lines[j]) {
            newLine.routes.forEach((newRoute, k) => {
              const existing = currentData[i].lines[j].routes[k];
              if (
                !existing || // If there's no route at the given index in currentData
                existing.name !== newRoute.name || // If the route name differs
                existing.grade !== newRoute.grade // If the route grade differs
              ) {
                currentData[i].lines[j].routes[k] = {
                  ...newRoute,
                  done: false,
                };
              } else {
                currentData[i].lines[j].routes[k] = { ...existing };
              }
            });
          } else {
            // If the line does not exist, add the line with its routes
            currentData[i].lines[j] = {
              ...newLine,
              routes: newLine.routes.map((route) => ({
                ...route,
                done: false,
              })),
            };
          }
        } else {
          // If the room does not exist in currentData, add the whole room with lines and routes
          currentData[i] = {
            room: room.room, // Assuming 'room' is a property
            lines: room.lines.map((line) => ({
              ...line,
              routes: line.routes.map((route) => ({ ...route, done: false })),
            })),
          };
        }
      });
    });

    return currentData;
  } catch (err) {
    console.error("Update failed:", err);
    return currentData;
  }
}
