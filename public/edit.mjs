function load() {
    document.getElementById("fileInput").click();
}

function start() {
    console.log('START')
}

function loadFile(file, elements) {
    const reader = new FileReader();
    reader.onload = (event) => {
        elements.textInput.value = event.target.result;
        updateScript()  ;
    };
    reader.readAsText(file);
}

function updateScript(event) {
    const island = document.getElementById("edit").state;
    const textInput = document.getElementById("textInput");
    island.script = textInput.value;
}

function MAIN () {
    document.getElementById("textInput").addEventListener("input", updateScript);
    document.getElementById("fileInput").addEventListener("change", loadFile);

    document.getElementById("start").addEventListener("click", start);
    document.getElementById("load").addEventListener("click", load);
}
document.addEventListener('DOMContentLoaded', MAIN);