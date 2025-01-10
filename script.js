// Tab Switching Logic


// Show Pattern Creator and hide Song Composer
document.getElementById('pattern-creator-tab').addEventListener('click', () => {
    document.getElementById('pattern-creator').classList.add('active');
    document.getElementById('pattern-creator').classList.remove('hidden');
    document.getElementById('song-composer').classList.add('hidden');
    document.getElementById('song-composer').classList.remove('active');
    document.getElementById('piano-roll').classList.add('hidden');
    document.getElementById('piano-roll').classList.remove('active');
});

// Show Song Composer and hide Pattern Creator
document.getElementById('song-composer-tab').addEventListener('click', () => {
    document.getElementById('song-composer').classList.add('active');
    document.getElementById('song-composer').classList.remove('hidden');
    document.getElementById('pattern-creator').classList.add('hidden');
    document.getElementById('pattern-creator').classList.remove('active');
    document.getElementById('piano-roll').classList.add('hidden');
    document.getElementById('piano-roll').classList.remove('active');
});

document.getElementById('piano-roll-tab').addEventListener('click', () => {
    document.getElementById('piano-roll').classList.add('active');
    document.getElementById('piano-roll').classList.remove('hidden');
    document.getElementById('pattern-creator').classList.add('hidden');
    document.getElementById('pattern-creator').classList.remove('active');
    document.getElementById('song-composer').classList.add('hidden');
    document.getElementById('song-composer').classList.remove('active');
});

// Debugging helper
console.log('script.js loaded successfully');
