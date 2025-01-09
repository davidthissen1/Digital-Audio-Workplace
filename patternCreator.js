const audioContext = new (window.AudioContext || window.webkitAudioContext)();
export const savedPatterns = [];
export const oneShots = Array(4).fill(null); // Holds sounds for each row

const pattern = Array(4).fill().map(() => Array(16).fill(false)); // 4x16 grid pattern

// Generate grid and "Add File" buttons
const gridContainer = document.getElementById('grid-container');
for (let i = 0; i < 4; i++) {
    const rowContainer = document.createElement('div');
    rowContainer.className = 'grid-row';

    // Add File button
    const addFileButton = document.createElement('button');
    addFileButton.textContent = `Add File`;
    addFileButton.className = 'add-file';
    addFileButton.addEventListener('click', async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    oneShots[i] = await audioContext.decodeAudioData(arrayBuffer);
                    addFileButton.textContent = file.name; // Rename button to file name
                    alert(`Sound "${file.name}" added to Row ${i + 1}`);
                } catch (error) {
                    alert('Failed to load the audio file. Please try again.');
                }
            }
        });
        input.click();
    });

    // Grid for the row
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let j = 0; j < 16; j++) {
        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.row = i;
        step.dataset.col = j;
        step.addEventListener('click', () => {
            pattern[i][j] = !pattern[i][j];
            step.classList.toggle('active');
        });
        grid.appendChild(step);
    }

    // Add components to row container
    rowContainer.appendChild(addFileButton);
    rowContainer.appendChild(grid);
    gridContainer.appendChild(rowContainer);
}

// Play the pattern
document.getElementById('play-pattern').addEventListener('click', () => {
    const tempo = 120; // BPM
    const stepDuration = 60 / tempo / 4; // Step duration in seconds

    pattern.forEach((row, rowIndex) => {
        row.forEach((isActive, colIndex) => {
            if (isActive && oneShots[rowIndex]) {
                const source = audioContext.createBufferSource();
                source.buffer = oneShots[rowIndex];
                source.connect(audioContext.destination);
                source.start(audioContext.currentTime + colIndex * stepDuration);
            }
        });
    });
});

// Save the pattern
document.getElementById('save-pattern').addEventListener('click', () => {
    savedPatterns.push(pattern.map((row) => [...row])); // Deep copy of the pattern
    alert('Pattern saved!');
});
