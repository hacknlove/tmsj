function start() {
  localStorage.script = edit.state.script;
  const parragrahs = edit.state.script.split(/\n{2,}/);
  for (let i = 0; i < parragrahs.length; i++) {
    localStorage.setItem(`paragraph_${i}`, sanitize(parragrahs[i]));
  }
  localStorage.setItem("paragraph_count", parragrahs.length - 1);
  window.location.href = "/play?paragraph=0&level=0";
}

function sanitize(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    edit.state.script = textInput.value = event.target.result;
  };
  reader.readAsText(file);
}

function MAIN() {
  textInput.addEventListener("input", () => {
    edit.state.script = textInput.value;
  });

  fileInput.addEventListener("change", (event) => {
    loadFile(event.target.files[0]);
  });
  loadButton.addEventListener("click", () => {
    fileInput.click();
  });
  textInput.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  textInput.addEventListener("drop", (event) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files[0]);
  });

  startButton.addEventListener("click", start);

  edit.addEventListener("island-ready", () => {
    if (localStorage.script) {
      edit.state.script = textInput.value = localStorage.script;
    }
  });
}
document.addEventListener("DOMContentLoaded", MAIN);
