import { loadData, saveData, resetData, updateData } from "./storage.js";
import { render } from "./dom.js";
import { addLine } from "./routes.js";

let data = loadData();

function init() {
  render(data);

  document.getElementById("addNewLine").addEventListener("click", () => {
    addLine(data);
    saveData(data);
    render(data);
  });

  document
    .getElementById("updateRoutes")
    .addEventListener("click", async () => {
      data = await updateData(data);
      saveData(data);
      render(data);
    });

  document.getElementById("reset").addEventListener("click", () => {
    document.getElementById("confirmationDialog").style.display = "flex";
  });

  document.getElementById("confirmYes").addEventListener("click", async () => {
    data = await resetData();
    render(data);
    document.getElementById("confirmationDialog").style.display = "none";
  });

  document.getElementById("confirmNo").addEventListener("click", () => {
    document.getElementById("confirmationDialog").style.display = "none";
  });
}

init();
