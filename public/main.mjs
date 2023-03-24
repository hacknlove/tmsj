document.addEventListener('DOMContentLoaded', () => {
    const elements = getElements();
    addEventListeners(elements);
    updatePlayArea(elements);
});

function getElements() {
    return {
        textInput: document.getElementById('textInput'),
        fileInput: document.getElementById('fileInput'),
        playText: document.getElementById('playText'),
        difficulty: document.getElementById('difficulty'),
        difficultyValue: document.getElementById('difficultyValue'),
        clearButton: document.getElementById('clearButton'),
        refreshButton: document.getElementById('refreshButton'),
        nextButton: document.getElementById('nextButton'),
        switchToEditContainer: document.getElementById('switchToEditContainer'),
        switchToPlayContainer: document.getElementById('switchToPlayContainer'),
        editContainer: document.querySelector('.edit-container'),
        playContainer: document.querySelector('.play-container'),
    };
}

function addEventListeners(elements) {
    const { textInput, fileInput, difficulty, clearButton, refreshButton, switchToPlayContainer, switchToEditContainer, playContainer, editContainer } = elements;

    textInput.addEventListener('dragover', handleDragOver);
    textInput.addEventListener('drop', (event) => handleDrop(event, elements));
    textInput.addEventListener('input', () => updatePlayArea(elements));
    textInput.addEventListener('paste', (event) => handlePaste(event, elements));

    fileInput.addEventListener('change', (event) => loadFile(event, elements));

    difficulty.addEventListener('input', () => {
        updateDifficultyValue(elements);
        updatePlayArea(elements);
    });

    clearButton.addEventListener('click', () => clearText(elements));
    refreshButton.addEventListener('click', () => updatePlayArea(elements));
    elements.nextButton.addEventListener('click', () => increaseDifficulty(elements));

    switchToPlayContainer.addEventListener('click', () => {
        playContainer.classList.remove('hidden');
        editContainer.classList.add('hidden');
    });
    switchToEditContainer.addEventListener('click', () => {
        playContainer.classList.add('hidden');
        editContainer.classList.remove('hidden');
    });
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event, elements) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    loadFile(file, elements);
}

function handlePaste(event, elements) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    elements.textInput.value = text;
    updatePlayArea(elements);
}

function loadFile(file, elements) {
    const reader = new FileReader();
    reader.onload = (event) => {
        elements.textInput.value = event.target.result;
        updatePlayArea(elements);
    };
    reader.readAsText(file);
}

function updateDifficultyValue({ difficulty, difficultyValue }) {
    difficultyValue.textContent = `${difficulty.value}%`;
}

let currentParagraph = 0;

function updatePlayArea({ textInput, playText, difficulty }) {
    const paragraphs = textInput.value.split(/\n{2,}/);
    const sanitizedParagraphs = paragraphs.map((paragraph) => sanitize(paragraph));

    const difficultyRate = difficulty.value / 100;
    const newText = sanitizedParagraphs[currentParagraph].replace(/[\p{L}\p{M}_-]+/g, (word) => {
        if (Math.random() < difficultyRate) {
            return `<span class="hidden-word" data-word="${word}">` + '_'.repeat(word.length) + '</span>';
        }
        return word;
    });

    playText.innerHTML = newText;

    // Add click event listeners to the hidden words
    const hiddenWords = playText.getElementsByClassName('hidden-word');
    for (const hiddenWord of hiddenWords) {
        hiddenWord.addEventListener('click', revealWord);
    }
}

function clearText(elements) {
    elements.textInput.value = '';
    elements.playText.innerText = '';
}

function increaseDifficulty(elements) {
    if (elements.difficulty.value === '100') {
        showNextParagraph(elements);
    } else {
        elements.difficulty.value = Math.min(parseInt(elements.difficulty.value) + 10, 100);
        updatePlayArea(elements);
    }
}

function sanitize(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function revealWord(event) {
    const hiddenWordElement = event.target;
    const word = hiddenWordElement.dataset.word;
    hiddenWordElement.innerText = word;
    hiddenWordElement.classList.remove('hidden-word');
    hiddenWordElement.removeEventListener('click', revealWord);
}

function showNextParagraph({ textInput, playText, difficulty }) {
    const paragraphs = textInput.value.split('\n\n');
    currentParagraph = (currentParagraph + 1) % paragraphs.length;
    difficulty.value = 0;
    updatePlayArea({ textInput, playText, difficulty });
}