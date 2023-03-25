document.addEventListener("DOMContentLoaded", MAIN);

function MAIN() {
  play.addEventListener("island-ready", updatePlayArea);
  play.addEventListener("island-ready", () => {
    const params = new URLSearchParams(window.location.search);
    play.state.paragraph = parseInt(params.get("paragraph")) || 0;
    play.state.level = parseInt(params.get("level")) || 0;
  });

  nextButton.addEventListener("click", () => {
    if (play.state.paragraph == localStorage.paragraph_count) {
      play.state.paragraph = 0;
      play.state.level = Math.min(play.state.level + 1, 10);
      return;
    }
    play.state.paragraph = play.state.paragraph + 1;
  });
  backButton.addEventListener("click", () => {
    if (play.state.paragraph == 0) {
      play.state.paragraph = localStorage.paragraph_count;
      play.state.level = Math.max(play.state.level - 1, 0);
      return;
    }
    play.state.paragraph = play.state.paragraph - 1;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowRight" || event.key == " " || event.key == "Enter") {
      nextButton.click();
    }
    if (
      event.key == "ArrowLeft" ||
      event.key == "Backspace" ||
      event.key == "Delete" ||
      event.key == "Escape"
    ) {
      backButton.click();
    }
  });

  playground.addEventListener("click", (event) => {
    if (event.target.classList.contains("hidden-word")) {
      event.target.classList.toggle("revealed");
    }
  });
  play.addEventListener("state", () => {
    history.pushState(
      {},
      "",
      `?level=${play.state.level}&paragraph=${play.state.paragraph}`
    );
    updatePlayArea();
  });

  refreshButton.addEventListener("click", updatePlayArea);
}

function updatePlayArea() {
  const paragraph = play.state.paragraph;

  const text = localStorage.getItem(`paragraph_${paragraph}`);

  const words = text.split(/\s+/).map(() => true);
  let wordsToRemove = Math.floor(words.length * (play.state.level / 10));

  while (wordsToRemove) {
    const remove = Math.floor(Math.random() * words.length);
    if (!words[remove]) {
      continue;
    }

    wordsToRemove--;
    words[remove] = false;
  }

  let i = 0;

  playground.innerHTML = text.replace(/[^\s]+/g, (word) => {
    if (!words[i++]) {
      return `<span class="hidden-word">${word}</span>`;
    }
    return word;
  });

  let pre = "";
  for (let i = 0; i < paragraph; i++) {
    pre += localStorage.getItem(`paragraph_${i}`) + "\n\n";
  }
  playgroundPre.innerHTML = pre;

  playground.scrollIntoView({ behavior: "smooth", block: "start" });
}
