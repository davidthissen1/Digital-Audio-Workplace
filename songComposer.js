import { savedPatterns, oneShots } from './patternCreator.js';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const savedPatternsContainer = document.getElementById('patterns-container');
const timeline = document.getElementById('timeline');

// Display saved patterns
function displaySavedPatterns() {
    savedPatternsContainer.innerHTML = ''; // Clear existing patterns
    savedPatterns.forEach((pattern, index) => {
        const patternBlock = document.createElement('div');
        patternBlock.textContent = `Pattern ${index + 1}`;
        patternBlock.className = 'pattern-block';
        patternBlock.draggable = true;
        patternBlock.dataset.patternIndex = index;

        patternBlock.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('pattern-index', index);
        });

        savedPatternsContainer.appendChild(patternBlock);
    });
}

// Initialize timeline with empty slots
function createTimelineSlots() {
    timeline.innerHTML = ''; // Clear existing slots
    for (let i = 0; i < 8; i++) { // Example: 8 slots
        const slot = document.createElement('div');
        slot.className = 'timeline-slot';
        slot.dataset.slotIndex = i;

        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', (e) => {
            const patternIndex = e.dataTransfer.getData('pattern-index');
            slot.textContent = `Pattern ${parseInt(patternIndex) + 1}`;
            slot.dataset.patternIndex = patternIndex; // Save pattern association
        });

        timeline.appendChild(slot);
    }
}

// Play the song
document.getElementById('play-song').addEventListener('click', () => {
    const tempo = 120; // BPM
    const stepDuration = 60 / tempo / 4; // Step duration in seconds
    let currentTime = audioContext.currentTime;

    // Iterate through timeline slots
    document.querySelectorAll('.timeline-slot').forEach((slot) => {
        const patternIndex = slot.dataset.patternIndex;
        if (patternIndex !== undefined) {
            const pattern = savedPatterns[patternIndex];
            pattern.forEach((row, rowIndex) => {
                row.forEach((isActive, colIndex) => {
                    if (isActive && oneShots[rowIndex]) {
                        const source = audioContext.createBufferSource();
                        source.buffer = oneShots[rowIndex];
                        source.connect(audioContext.destination);
                        source.start(currentTime + colIndex * stepDuration);
                    }
                });
            });
            currentTime += pattern[0].length * stepDuration; // Add pattern duration
        }
    });
});

// Export song (placeholder for future implementation)
document.getElementById('export-song').addEventListener('click', () => {
    alert('Export functionality not implemented yet.');
});

// Initialize
createTimelineSlots();
displaySavedPatterns();
