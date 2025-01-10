document.body.addEventListener('click', async () => {
    await Tone.start();
    console.log('Tone.js started');
});

const pianoRollGrid = document.getElementById('piano-roll-grid');
const playPianoRollButton = document.getElementById('play-piano-roll');

// Define notes and grid dimensions
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']; // Octave (can extend further)
const steps = 64; // Number of time steps
const pianoRoll = Array(notes.length).fill().map(() => Array(steps).fill(false)); // Grid state

let isMouseDown = false; // Track whether the mouse button is pressed

// Create a piano sampler using Tone.js
window.sampler = new Tone.Sampler({
    urls: {
        C4: "C4.mp3",
        D4: "D4.mp3",
        E4: "E4.mp3",
        F4: "F4.mp3",
        G4: "G4.mp3",
        A4: "A4.mp3",
        B4: "B4.mp3",
    },
    baseUrl: "./assets/samples/",    onload: () => console.log("Sampler loaded successfully"),
    onerror: (error) => console.error("Sampler failed to load", error),
}).toDestination();


// Generate Piano Roll Grid
function generatePianoRoll() {
    pianoRollGrid.innerHTML = ''; // Clear existing grid

    // Add note labels and grid cells
    notes.forEach((note, rowIndex) => {
        // Add piano key
        const pianoKey = document.createElement('div');
        pianoKey.className = 'piano-key';
        pianoKey.textContent = note;
        pianoRollGrid.appendChild(pianoKey);

        // Add grid cells for each step
        for (let colIndex = 0; colIndex < steps; colIndex++) {
            const cell = document.createElement('div');
            cell.className = 'note';
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;

            // Toggle note activation
            cell.addEventListener('mousedown', () => {
                isMouseDown = true;
                pianoRoll[rowIndex][colIndex] = !pianoRoll[rowIndex][colIndex];
                cell.classList.toggle('active');
            });

            cell.addEventListener('mousemove', () => {
                if (isMouseDown) {
                    pianoRoll[rowIndex][colIndex] = true;
                    cell.classList.add('active');
                }
            });

            cell.addEventListener('mouseup', () => {
                isMouseDown = false;
            });

            pianoRollGrid.appendChild(cell);
        }
    });
}

// Play Piano Roll
function playPianoRoll() {
    const tempo = 120; // BPM
    const stepDuration = 60 / tempo / steps; // Step duration based on increased steps

    // Clear previous schedules
    Tone.Transport.cancel();

    // Schedule notes
    pianoRoll.forEach((row, rowIndex) => {
        row.forEach((isActive, colIndex) => {
            if (isActive) {
                Tone.Transport.schedule((time) => {
                    sampler.triggerAttackRelease(notes[rowIndex], 5, time);
                }, colIndex * stepDuration);
            }
        });
    });

    // Start the transport
    Tone.Transport.bpm.value = tempo; // Set the BPM
    Tone.Transport.start();
}


// Stop dragging on mouse up (anywhere on the page)
document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Initialize Piano Roll
generatePianoRoll();

// Handle play button click
playPianoRollButton.addEventListener('click', playPianoRoll);
