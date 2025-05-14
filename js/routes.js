import { render } from "./dom.js";
import { saveData } from "./storage.js";

export function addLine(data) {
  if (!data[0].lines) data[0].lines = [];
  data[0].lines.push({ routes: [] });
}

export function addRoute(data, roomIndex, lineIndex) {
  const lineId = `room${roomIndex}-line${lineIndex}`;
  const nameEl = document.getElementById(`routeName-${lineId}`);
  const gradeEl = document.getElementById(`routeGrade-${lineId}`);

  const name = nameEl.value.trim();
  const grade = gradeEl.value.trim();

  if (!name || !grade) return;

  data[roomIndex].lines[lineIndex].routes.push({ name, grade, done: false });

  nameEl.value = "";
  gradeEl.value = "";

  saveData(data);
  render(data);
}

export function toggleComplete(data, roomIndex, lineIndex, routeIndex) {
  const route = data[roomIndex].lines[lineIndex].routes[routeIndex];
  route.done = !route.done;

  saveData(data);
  render(data);
}

export function removeRoute(data, roomIndex, lineIndex, routeIndex) {
  data[roomIndex].lines[lineIndex].routes.splice(routeIndex, 1);

  saveData(data);
  render(data);
}
