// Cosmic Zoo - Finding Belly
// Main Game Logic - Version 2 with improved art and voices

// ============== CHARACTER VOICE SYSTEM ==============
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

// Initialize audio on first user interaction (iOS requires resume)
function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    // iOS Safari requires resuming the audio context after user gesture
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Character voice settings - each character has unique voice
const characterVoices = {
    'Owner': { baseFreq: 220, type: 'sine', speed: 80 },      // Medium pitch, smooth
    'Belly': { baseFreq: 350, type: 'square', speed: 60 },    // High pitch, cute
    'Zoink': { baseFreq: 280, type: 'triangle', speed: 70 },  // Medium-high, friendly
    'Zip': { baseFreq: 150, type: 'sawtooth', speed: 50 },    // Low pitch, menacing
    'Roxer': { baseFreq: 120, type: 'sawtooth', speed: 40 },  // Very low, thunderous king
    'Hang': { baseFreq: 180, type: 'square', speed: 90 },     // Low-medium, creepy
    '???': { baseFreq: 100, type: 'sawtooth', speed: 100 }    // Very low, mysterious
};

// Play voice sound for character
function playVoiceSound(character, text) {
    if (!audioCtx) return;
    
    const voice = characterVoices[character] || characterVoices['Owner'];
    const syllables = Math.ceil(text.length / 3);
    
    for (let i = 0; i < Math.min(syllables, 10); i++) {
        setTimeout(() => {
            playBeep(voice.baseFreq + Math.random() * 50, voice.type, 0.08);
        }, i * voice.speed);
    }
}

// Play a single beep
function playBeep(frequency, type, duration) {
    if (!audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
}

// ============== BACKGROUND MUSIC SYSTEM ==============
let currentMusic = null;
let musicInterval = null;
let currentSong = null;

// Stop any playing music
function stopMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
    currentSong = null;
}

// Happy home screen music - bouncy and jolly
function playHomeMusic() {
    if (!audioCtx || currentSong === 'home') return;
    stopMusic();
    currentSong = 'home';
    
    // Happy melody notes (C major scale patterns)
    const melody = [
        { note: 523, dur: 0.15 },  // C5
        { note: 587, dur: 0.15 },  // D5
        { note: 659, dur: 0.15 },  // E5
        { note: 523, dur: 0.15 },  // C5
        { note: 698, dur: 0.2 },   // F5
        { note: 659, dur: 0.15 },  // E5
        { note: 587, dur: 0.15 },  // D5
        { note: 523, dur: 0.3 },   // C5
        { note: 784, dur: 0.2 },   // G5
        { note: 698, dur: 0.15 },  // F5
        { note: 659, dur: 0.15 },  // E5
        { note: 587, dur: 0.2 },   // D5
        { note: 523, dur: 0.15 },  // C5
        { note: 587, dur: 0.15 },  // D5
        { note: 523, dur: 0.4 },   // C5
        { note: 0, dur: 0.3 },     // Rest
    ];
    
    let noteIndex = 0;
    let noteTime = 0;
    
    musicInterval = setInterval(() => {
        if (!audioCtx || currentSong !== 'home') return;
        
        const note = melody[noteIndex];
        if (note.note > 0) {
            playMusicNote(note.note, 'triangle', note.dur, 0.08);
            // Add harmony
            playMusicNote(note.note * 0.5, 'sine', note.dur, 0.04);
        }
        
        noteIndex = (noteIndex + 1) % melody.length;
    }, 250);
}

// Scary boss battle music - dark and intense
function playBossMusic() {
    if (!audioCtx || currentSong === 'boss') return;
    stopMusic();
    currentSong = 'boss';
    
    // Dark, ominous melody (minor scale, low notes)
    const melody = [
        { note: 147, dur: 0.3 },   // D3
        { note: 156, dur: 0.2 },   // Eb3
        { note: 147, dur: 0.2 },   // D3
        { note: 131, dur: 0.4 },   // C3
        { note: 147, dur: 0.2 },   // D3
        { note: 175, dur: 0.3 },   // F3
        { note: 165, dur: 0.2 },   // E3
        { note: 147, dur: 0.4 },   // D3
        { note: 131, dur: 0.3 },   // C3
        { note: 117, dur: 0.3 },   // Bb2
        { note: 131, dur: 0.2 },   // C3
        { note: 147, dur: 0.5 },   // D3
    ];
    
    let noteIndex = 0;
    let beatCount = 0;
    
    musicInterval = setInterval(() => {
        if (!audioCtx || currentSong !== 'boss') return;
        
        // Drum-like bass hit on every beat
        if (beatCount % 2 === 0) {
            playMusicNote(55, 'sawtooth', 0.1, 0.12);  // Deep bass
        }
        
        // Melody
        const note = melody[noteIndex];
        playMusicNote(note.note, 'sawtooth', note.dur, 0.07);
        // Creepy high overtone
        playMusicNote(note.note * 3, 'sine', 0.1, 0.02);
        
        noteIndex = (noteIndex + 1) % melody.length;
        beatCount++;
    }, 300);
}

// Play a music note
function playMusicNote(frequency, type, duration, volume) {
    if (!audioCtx || frequency <= 0) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
}

// Game State
const GameState = {
    currentScreen: 'title',
    playerGender: null,
    currentLevel: 1,
    health: 100,
    maxHealth: 100,
    pets: [],
    currentPet: null,
    cutsceneIndex: 0,
    bossHealth: 100,
    bossMaxHealth: 100,
    isReplay: false,
    level1Completed: false,
    level2Completed: false,
    level3Completed: false,
    hasKey: false,          // For Level 2 key mechanic
    zipFreed: false         // For Level 2 Zip rescue
};

// Load saved progress from browser storage
function loadProgress() {
    const saved = localStorage.getItem('cosmicZooSave');
    if (saved) {
        const data = JSON.parse(saved);
        GameState.playerGender = data.playerGender || null;
        GameState.pets = data.pets || [];
        GameState.level1Completed = data.level1Completed || false;
        GameState.level2Completed = data.level2Completed || false;
        GameState.level3Completed = data.level3Completed || false;
        GameState.zipFreed = data.zipFreed || false;
    }
}

// Save progress to browser storage
function saveProgress() {
    const data = {
        playerGender: GameState.playerGender,
        pets: GameState.pets,
        level1Completed: GameState.level1Completed,
        level2Completed: GameState.level2Completed,
        level3Completed: GameState.level3Completed,
        zipFreed: GameState.zipFreed
    };
    localStorage.setItem('cosmicZooSave', JSON.stringify(data));
}

// Load progress when game starts
loadProgress();

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    GameState.currentScreen = screenId;
}

// Cutscene Data for Level 1 - Exactly from sketches
const cutscenes = {
    opening: [
        { speaker: 'Belly', text: 'Nod nod', characters: ['owner', 'belly'], bg: 'peaceful' },
        { speaker: 'Owner', text: 'Hah yeah', characters: ['owner', 'belly'], bg: 'peaceful' },
        { speaker: 'Belly', text: 'No! No!', characters: ['belly-grabbed'], bg: 'dark' },
        { speaker: 'Owner', text: 'Belly!', characters: ['owner-reaching'], bg: 'dark' },
        { speaker: 'Owner', text: 'How could this be', characters: ['owner-sad'], bg: 'sad' }
    ],
    zipAppears: [
        { speaker: 'Zip', text: 'Well well well', characters: ['owner', 'zip'], bg: 'encounter' },
        { speaker: 'Owner', text: 'Whats that', characters: ['owner', 'zip'], bg: 'encounter' },
        { speaker: 'Zip', text: 'Bye', characters: ['owner-fallen', 'zip-leaving'], bg: 'encounter' },
        { speaker: 'Owner', text: 'Ugh', characters: ['owner-fallen'], bg: 'sad' }
    ],
    meetZoink: [
        { speaker: 'Owner', text: 'Whats that', characters: ['owner', 'zoink'], bg: 'encounter' },
        { speaker: 'Owner', text: 'Take some food', characters: ['owner-giving', 'zoink'], bg: 'kind' },
        { speaker: 'Owner', text: 'Wanna be friends', characters: ['owner', 'zoink-happy'], bg: 'happy' },
        { speaker: 'Zoink', text: 'Nod nod', characters: ['owner', 'zoink-happy'], bg: 'happy' },
        { speaker: 'Zoink', text: 'Cammon', characters: ['owner', 'zoink-pointing'], bg: 'determined' }
    ],
    beforeBoss: [
        { speaker: 'Zip', text: 'How did you get here', characters: ['owner', 'zoink', 'zip-angry'], bg: 'boss' },
        { speaker: 'Zip', text: 'How dare you', characters: ['owner', 'zoink', 'zip-battle'], bg: 'boss' }
    ],
    afterBoss: [
        { speaker: 'Owner', text: 'Yes! We did it!', characters: ['owner-happy', 'zoink-happy'], bg: 'victory' }
    ],
    
    // Level 2: The Storm cutscenes
    level2Opening: [
        { speaker: 'Zoink', text: 'Lets keep going this way', characters: ['owner', 'zoink'], bg: 'cloudy' },
        { speaker: 'Owner', text: 'Good idea!', characters: ['owner', 'zoink'], bg: 'cloudy' },
        { speaker: 'Owner', text: 'Rain dang it', characters: ['owner', 'zoink'], bg: 'storm' }
    ],
    roxerAppears: [
        { speaker: 'Roxer', text: 'Its me the Roxer!', characters: ['roxer'], bg: 'storm' },
        { speaker: 'Roxer', text: 'You failed me stupid Zip!', characters: ['roxer', 'zip-hurt'], bg: 'storm' },
        { speaker: 'Owner', text: 'Leave us alone!', characters: ['owner', 'zoink', 'roxer'], bg: 'storm' },
        { speaker: 'Roxer', text: 'I did not forget you', characters: ['roxer'], bg: 'storm' },
        { speaker: 'Roxer', text: 'You will pay for defeating Zip!', characters: ['roxer', 'zip-caged'], bg: 'storm' }
    ],
    level2Complete: [
        { speaker: 'Zip', text: 'You saved me!', characters: ['owner', 'zoink', 'zip'], bg: 'cloudy' },
        { speaker: 'Owner', text: 'Are you okay?', characters: ['owner', 'zoink', 'zip'], bg: 'cloudy' },
        { speaker: 'Zip', text: 'I was wrong about you', characters: ['zip'], bg: 'cloudy' },
        { speaker: 'Zoink', text: 'Lets get out of here!', characters: ['owner', 'zoink', 'zip'], bg: 'cloudy' }
    ],
    
    // Level 3: The Descent cutscenes
    level3Opening: [
        { speaker: 'Owner', text: 'We have to find Belly faster, thats why we saved Zip since he works for the person who kidnapped Belly.', characters: ['owner', 'zoink', 'zip'], bg: 'peaceful' },
        { speaker: 'Zip', text: 'I have very scarce info on this but I know where he is being held.', characters: ['owner', 'zoink', 'zip'], bg: 'peaceful' },
        { speaker: 'Zoink', text: 'The dungeon?', characters: ['owner', 'zoink', 'zip'], bg: 'peaceful' },
        { speaker: 'Zip', text: 'That is my guess too. If hes not there we will still be able to find him. Okay bye now!', characters: ['owner', 'zoink', 'zip-leaving'], bg: 'peaceful' },
        { speaker: 'Owner', text: 'Well at least we know where Belly is being held.', characters: ['owner', 'zoink'], bg: 'determined' }
    ],
    level3End: [
        { speaker: 'Zip', text: 'Huh? How the heck did you get here?', characters: ['owner', 'zoink', 'zip'], bg: 'peaceful' },
        { speaker: 'Owner', text: 'You did not give any information on where the dungeon is!', characters: ['owner', 'zoink', 'zip'], bg: 'peaceful' },
        { speaker: 'Zip', text: 'Just go down down down and maybe even underground. Now really, bye!', characters: ['owner', 'zoink', 'zip-leaving'], bg: 'peaceful' }
    ]
};

let currentCutscene = null;
let currentDialogueIndex = 0;
let typewriterInterval = null;  // Store the interval so we can clear it

// Cutscene System
function startCutscene(cutsceneName) {
    // Stop music during cutscenes (voices will play instead)
    stopMusic();
    
    currentCutscene = cutscenes[cutsceneName];
    currentDialogueIndex = 0;
    showScreen('cutscene-screen');
    showDialogue();
}

function showDialogue() {
    if (currentDialogueIndex >= currentCutscene.length) {
        endCutscene();
        return;
    }

    // IMPORTANT: Clear any existing typewriter effect first!
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
    }

    const dialogue = currentCutscene[currentDialogueIndex];
    const speakerEl = document.querySelector('.speaker-name');
    const textEl = document.querySelector('.dialogue-text');
    const bgEl = document.querySelector('.cutscene-bg');
    const charsEl = document.querySelector('.cutscene-characters');

    speakerEl.textContent = dialogue.speaker;
    
    // Clear text completely before starting new dialogue
    textEl.textContent = '';
    
    // Play character voice sound
    playVoiceSound(dialogue.speaker, dialogue.text);
    
    // Typewriter effect with stored interval
    let charIndex = 0;
    typewriterInterval = setInterval(() => {
        if (charIndex < dialogue.text.length) {
            textEl.textContent = dialogue.text.substring(0, charIndex + 1);
            charIndex++;
        } else {
            clearInterval(typewriterInterval);
            typewriterInterval = null;
        }
    }, 30);

    // Update background based on mood
    updateCutsceneBg(dialogue.bg);
    
    // Update characters with improved art
    updateCutsceneCharacters(dialogue.characters);
}

function updateCutsceneBg(mood) {
    const bgEl = document.querySelector('.cutscene-bg');
    // Reset any existing decorations
    bgEl.innerHTML = '';
    
    switch(mood) {
        case 'peaceful':
            // Sunny day with grass
            bgEl.style.background = `
                radial-gradient(circle at 85% 20%, #FFE87C 0%, transparent 15%),
                linear-gradient(180deg, #4A90D9 0%, #87CEEB 30%, #b8e4f9 55%, #7CCD7C 55%, #228B22 100%)
            `;
            addCloudsDecoration(bgEl, 3);
            break;
        case 'dark':
            // Ominous dark scene
            bgEl.style.background = `
                radial-gradient(ellipse at 50% 20%, #3d3d6b 0%, transparent 40%),
                linear-gradient(180deg, #1a1a2e 0%, #2c2c54 40%, #1a1a2e 100%)
            `;
            addStarsDecoration(bgEl);
            break;
        case 'sad':
            // Gloomy rainy feel
            bgEl.style.background = `
                linear-gradient(180deg, #4a5568 0%, #718096 40%, #a0aec0 70%, #718096 100%)
            `;
            addRainDecoration(bgEl);
            break;
        case 'determined':
            // Dramatic sunset
            bgEl.style.background = `
                radial-gradient(circle at 50% 80%, #f6ad55 0%, transparent 50%),
                linear-gradient(180deg, #553c9a 0%, #e53e3e 40%, #f6ad55 80%, #ed8936 100%)
            `;
            break;
        case 'encounter':
            // Meeting scene - outdoor path
            bgEl.style.background = `
                radial-gradient(circle at 80% 25%, rgba(255,255,255,0.8) 0%, transparent 20%),
                linear-gradient(180deg, #87CEEB 0%, #B4D7E8 40%, #d4e4ed 60%, #c9b896 60%, #a89060 100%)
            `;
            addCloudsDecoration(bgEl, 2);
            break;
        case 'kind':
        case 'happy':
            // Warm happy glow
            bgEl.style.background = `
                radial-gradient(circle at 50% 30%, #fff9c4 0%, transparent 40%),
                linear-gradient(180deg, #81d4fa 0%, #b3e5fc 30%, #fff59d 60%, #ffe082 100%)
            `;
            addSparklesDecoration(bgEl);
            break;
        case 'boss':
            // Dark menacing arena
            bgEl.style.background = `
                radial-gradient(circle at 50% 50%, #4a4a4a 0%, transparent 50%),
                repeating-linear-gradient(90deg, #1a1a1a 0px, #2d2d2d 2px, #1a1a1a 4px),
                linear-gradient(180deg, #1a1a1a 0%, #2d3436 50%, #1a1a1a 100%)
            `;
            break;
        case 'victory':
            // Celebration!
            bgEl.style.background = `
                radial-gradient(circle at 30% 20%, #ff79b0 0%, transparent 30%),
                radial-gradient(circle at 70% 30%, #9f7aea 0%, transparent 30%),
                linear-gradient(180deg, #667eea 0%, #a78bfa 40%, #f687b3 80%, #fbb6ce 100%)
            `;
            addSparklesDecoration(bgEl);
            addConfettiDecoration(bgEl);
            break;
        case 'storm':
            // Dark stormy sky with lightning
            bgEl.style.background = `
                radial-gradient(circle at 50% 30%, rgba(100, 100, 120, 0.8) 0%, transparent 50%),
                linear-gradient(180deg, #1F2937 0%, #374151 30%, #4B5563 50%, #1F2937 100%)
            `;
            addRainDecoration(bgEl);
            addLightningDecoration(bgEl);
            break;
        case 'cloudy':
            // Grey cloudy sky (post-storm, lighter)
            bgEl.style.background = `
                linear-gradient(180deg, #6B7280 0%, #9CA3AF 40%, #D1D5DB 70%, #9CA3AF 100%)
            `;
            addCloudsDecoration(bgEl, 4);
            break;
        default:
            bgEl.style.background = 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)';
    }
}

// Helper functions for background decorations
function addCloudsDecoration(container, count) {
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.style.cssText = `
            position: absolute;
            width: ${80 + i * 30}px;
            height: ${30 + i * 10}px;
            background: rgba(255,255,255,0.7);
            border-radius: 50px;
            top: ${10 + i * 15}%;
            left: ${10 + i * 30}%;
            box-shadow: 
                ${20 + i * 5}px ${5}px 0 rgba(255,255,255,0.7),
                ${-15 - i * 3}px ${8}px 0 rgba(255,255,255,0.6);
            animation: floatCloud ${8 + i * 2}s ease-in-out infinite;
        `;
        container.appendChild(cloud);
    }
}

function addStarsDecoration(container) {
    for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 60}%;
            left: ${Math.random() * 100}%;
            opacity: ${0.4 + Math.random() * 0.6};
            animation: twinkle ${1 + Math.random() * 2}s ease-in-out infinite;
        `;
        container.appendChild(star);
    }
}

function addRainDecoration(container) {
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement('div');
        drop.style.cssText = `
            position: absolute;
            width: 2px;
            height: 15px;
            background: rgba(255,255,255,0.3);
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: rain ${0.5 + Math.random() * 0.5}s linear infinite;
        `;
        container.appendChild(drop);
    }
}

function addLightningDecoration(container) {
    const lightning = document.createElement('div');
    lightning.innerHTML = '⚡';
    lightning.style.cssText = `
        position: absolute;
        font-size: 60px;
        top: 10%;
        left: 70%;
        animation: flash 2s ease-in-out infinite;
        opacity: 0;
        color: #FBBF24;
        text-shadow: 0 0 20px #FBBF24;
    `;
    container.appendChild(lightning);
    
    const lightning2 = document.createElement('div');
    lightning2.innerHTML = '⚡';
    lightning2.style.cssText = `
        position: absolute;
        font-size: 40px;
        top: 15%;
        left: 20%;
        animation: flash 3s ease-in-out infinite 1s;
        opacity: 0;
        color: #FBBF24;
        text-shadow: 0 0 15px #FBBF24;
    `;
    container.appendChild(lightning2);
}

function addSparklesDecoration(container) {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: absolute;
            font-size: ${15 + Math.random() * 15}px;
            top: ${Math.random() * 80}%;
            left: ${Math.random() * 90}%;
            animation: sparkle ${1 + Math.random()}s ease-in-out infinite;
            opacity: 0.8;
        `;
        container.appendChild(sparkle);
    }
}

function addConfettiDecoration(container) {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'];
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${5 + Math.random() * 8}px;
            height: ${5 + Math.random() * 8}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${2 + Math.random() * 2}s linear infinite;
        `;
        container.appendChild(confetti);
    }
}

function updateCutsceneCharacters(characters) {
    const container = document.querySelector('.cutscene-characters');
    container.innerHTML = '';

    characters.forEach((char, index) => {
        const charEl = document.createElement('div');
        charEl.className = 'cutscene-character';
        // Position is handled by flexbox in CSS
        
        switch(char) {
            case 'owner':
            case 'owner-reaching':
            case 'owner-sad':
            case 'owner-determined':
            case 'owner-fallen':
            case 'owner-giving':
            case 'owner-hopeful':
            case 'owner-angry':
            case 'owner-happy':
                createOwnerSprite(charEl, char);
                break;
            case 'belly':
            case 'belly-grabbed':
                createBellySprite(charEl, char);
                break;
            case 'zoink':
            case 'zoink-happy':
            case 'zoink-pointing':
            case 'zoink-excited':
                createZoinkSprite(charEl, char);
                break;
            case 'zip':
            case 'zip-leaving':
            case 'zip-angry':
            case 'zip-battle':
            case 'zip-defeated':
            case 'zip-hurt':
            case 'zip-caged':
                createZipSprite(charEl, char);
                break;
            case 'roxer':
                createRoxerSprite(charEl, char);
                break;
            case 'shadow':
                charEl.style.width = '100px';
                charEl.style.height = '150px';
                charEl.style.background = 'rgba(0,0,0,0.8)';
                charEl.style.borderRadius = '50% 50% 20% 20%';
                charEl.style.filter = 'blur(2px)';
                break;
        }
        
        container.appendChild(charEl);
    });
}

function createOwnerSprite(el, state) {
    const hairColor = GameState.playerGender === 'female' ? '#F5DEB3' : '#8B4513';
    const shirtColor = GameState.playerGender === 'female' ? '#FFB6C1' : '#4CAF50';
    
    el.style.width = '80px';
    el.style.height = '160px';
    el.style.position = 'relative';
    el.innerHTML = '';
    
    // Create SVG for better sketch-like art
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '160');
    svg.setAttribute('viewBox', '0 0 80 160');
    
    // Head (circle)
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    head.setAttribute('cx', '40');
    head.setAttribute('cy', '25');
    head.setAttribute('r', '22');
    head.setAttribute('fill', '#FFE4C4');
    head.setAttribute('stroke', '#333');
    head.setAttribute('stroke-width', '2');
    svg.appendChild(head);
    
    // Hair
    const hair = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hair.setAttribute('d', 'M 18 25 Q 20 5 40 8 Q 60 5 62 25 Q 55 15 40 12 Q 25 15 18 25');
    hair.setAttribute('fill', hairColor);
    hair.setAttribute('stroke', '#333');
    hair.setAttribute('stroke-width', '1');
    svg.appendChild(hair);
    
    // Eyes - change based on state
    let leftEye, rightEye;
    if (state.includes('sad') || state.includes('fallen')) {
        leftEye = 'M 30 22 Q 33 26 36 22';
        rightEye = 'M 44 22 Q 47 26 50 22';
    } else {
        leftEye = 'M 33 23 A 2 2 0 1 1 33 24';
        rightEye = 'M 47 23 A 2 2 0 1 1 47 24';
    }
    const eyes = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    eyes.setAttribute('d', leftEye + ' ' + rightEye);
    eyes.setAttribute('fill', '#333');
    eyes.setAttribute('stroke', '#333');
    eyes.setAttribute('stroke-width', '2');
    svg.appendChild(eyes);
    
    // Mouth
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (state.includes('sad') || state.includes('fallen')) {
        mouth.setAttribute('d', 'M 35 35 Q 40 32 45 35');
    } else if (state.includes('happy')) {
        mouth.setAttribute('d', 'M 32 32 Q 40 40 48 32');
    } else {
        mouth.setAttribute('d', 'M 35 34 L 45 34');
    }
    mouth.setAttribute('fill', 'none');
    mouth.setAttribute('stroke', '#333');
    mouth.setAttribute('stroke-width', '2');
    svg.appendChild(mouth);
    
    // Body (shirt)
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', '25');
    body.setAttribute('y', '48');
    body.setAttribute('width', '30');
    body.setAttribute('height', '50');
    body.setAttribute('rx', '5');
    body.setAttribute('fill', shirtColor);
    body.setAttribute('stroke', '#333');
    body.setAttribute('stroke-width', '2');
    svg.appendChild(body);
    
    // Arms
    const arms = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (state.includes('reaching')) {
        arms.setAttribute('d', 'M 25 55 L 5 35 M 55 55 L 75 35');
    } else if (state.includes('giving')) {
        arms.setAttribute('d', 'M 25 55 L 10 70 M 55 55 L 70 50');
    } else {
        arms.setAttribute('d', 'M 25 55 L 10 80 M 55 55 L 70 80');
    }
    arms.setAttribute('stroke', '#FFE4C4');
    arms.setAttribute('stroke-width', '8');
    arms.setAttribute('stroke-linecap', 'round');
    svg.appendChild(arms);
    
    // Legs
    const legs = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    legs.setAttribute('d', 'M 35 98 L 30 150 M 45 98 L 50 150');
    legs.setAttribute('stroke', '#4a4a4a');
    legs.setAttribute('stroke-width', '10');
    legs.setAttribute('stroke-linecap', 'round');
    svg.appendChild(legs);
    
    el.appendChild(svg);
    
    if (state.includes('reaching')) {
        el.style.transform = 'rotate(-10deg)';
    }
    if (state.includes('fallen')) {
        el.style.transform = 'rotate(30deg) translateY(50px)';
    }
}

function createBellySprite(el, state) {
    el.style.width = '140px';
    el.style.height = '140px';
    el.style.position = 'relative';
    el.innerHTML = '';
    
    // Create SVG for Belly - dino-frog like the sketch
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '140');
    svg.setAttribute('height', '140');
    svg.setAttribute('viewBox', '0 0 140 140');
    
    // Main body (round like frog)
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    body.setAttribute('cx', '70');
    body.setAttribute('cy', '85');
    body.setAttribute('rx', '45');
    body.setAttribute('ry', '40');
    body.setAttribute('fill', '#4CAF50');
    body.setAttribute('stroke', '#2d5a2e');
    body.setAttribute('stroke-width', '3');
    svg.appendChild(body);
    
    // Head (frog-like, wider)
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    head.setAttribute('cx', '70');
    head.setAttribute('cy', '45');
    head.setAttribute('rx', '40');
    head.setAttribute('ry', '30');
    head.setAttribute('fill', '#4CAF50');
    head.setAttribute('stroke', '#2d5a2e');
    head.setAttribute('stroke-width', '3');
    svg.appendChild(head);
    
    // Eye bumps (frog eyes on top)
    const leftEyeBump = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftEyeBump.setAttribute('cx', '50');
    leftEyeBump.setAttribute('cy', '25');
    leftEyeBump.setAttribute('r', '15');
    leftEyeBump.setAttribute('fill', '#4CAF50');
    leftEyeBump.setAttribute('stroke', '#2d5a2e');
    leftEyeBump.setAttribute('stroke-width', '2');
    svg.appendChild(leftEyeBump);
    
    const rightEyeBump = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightEyeBump.setAttribute('cx', '90');
    rightEyeBump.setAttribute('cy', '25');
    rightEyeBump.setAttribute('r', '15');
    rightEyeBump.setAttribute('fill', '#4CAF50');
    rightEyeBump.setAttribute('stroke', '#2d5a2e');
    rightEyeBump.setAttribute('stroke-width', '2');
    svg.appendChild(rightEyeBump);
    
    // Big eyes (white with black pupil)
    const leftEyeWhite = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftEyeWhite.setAttribute('cx', '50');
    leftEyeWhite.setAttribute('cy', '25');
    leftEyeWhite.setAttribute('r', '10');
    leftEyeWhite.setAttribute('fill', 'white');
    svg.appendChild(leftEyeWhite);
    
    const leftPupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftPupil.setAttribute('cx', '52');
    leftPupil.setAttribute('cy', '25');
    leftPupil.setAttribute('r', '5');
    leftPupil.setAttribute('fill', '#1a1a1a');
    svg.appendChild(leftPupil);
    
    const rightEyeWhite = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightEyeWhite.setAttribute('cx', '90');
    rightEyeWhite.setAttribute('cy', '25');
    rightEyeWhite.setAttribute('r', '10');
    rightEyeWhite.setAttribute('fill', 'white');
    svg.appendChild(rightEyeWhite);
    
    const rightPupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightPupil.setAttribute('cx', '92');
    rightPupil.setAttribute('cy', '25');
    rightPupil.setAttribute('r', '5');
    rightPupil.setAttribute('fill', '#1a1a1a');
    svg.appendChild(rightPupil);
    
    // Wide frog mouth
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mouth.setAttribute('d', 'M 45 55 Q 70 65 95 55');
    mouth.setAttribute('fill', 'none');
    mouth.setAttribute('stroke', '#2d5a2e');
    mouth.setAttribute('stroke-width', '3');
    svg.appendChild(mouth);
    
    // Front legs (like frog)
    const leftLeg = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    leftLeg.setAttribute('cx', '35');
    leftLeg.setAttribute('cy', '115');
    leftLeg.setAttribute('rx', '12');
    leftLeg.setAttribute('ry', '8');
    leftLeg.setAttribute('fill', '#4CAF50');
    leftLeg.setAttribute('stroke', '#2d5a2e');
    leftLeg.setAttribute('stroke-width', '2');
    svg.appendChild(leftLeg);
    
    const rightLeg = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    rightLeg.setAttribute('cx', '105');
    rightLeg.setAttribute('cy', '115');
    rightLeg.setAttribute('rx', '12');
    rightLeg.setAttribute('ry', '8');
    rightLeg.setAttribute('fill', '#4CAF50');
    rightLeg.setAttribute('stroke', '#2d5a2e');
    rightLeg.setAttribute('stroke-width', '2');
    svg.appendChild(rightLeg);
    
    // Small dino spikes on back
    const spikes = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spikes.setAttribute('d', 'M 55 50 L 60 40 L 65 50 M 65 48 L 70 38 L 75 48 M 75 50 L 80 40 L 85 50');
    spikes.setAttribute('fill', '#3d8b40');
    spikes.setAttribute('stroke', '#2d5a2e');
    spikes.setAttribute('stroke-width', '1');
    svg.appendChild(spikes);
    
    el.appendChild(svg);
    
    if (state === 'belly-grabbed') {
        el.style.animation = 'shake 0.5s ease-in-out infinite';
        el.style.filter = 'brightness(0.7)';
    }
}

function createZoinkSprite(el, state) {
    el.style.width = '120px';
    el.style.height = '140px';
    el.style.position = 'relative';
    el.innerHTML = '';
    
    // Create SVG for Zoink - deer-pig with jagged antlers like the sketch
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '140');
    svg.setAttribute('viewBox', '0 0 120 140');
    
    // Jagged/spiky antlers (like in sketch) - LEFT
    const leftAntler = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    leftAntler.setAttribute('d', 'M 35 55 L 25 35 L 30 40 L 20 20 L 28 30 L 15 10 L 25 25 L 35 45');
    leftAntler.setAttribute('fill', '#8B4513');
    leftAntler.setAttribute('stroke', '#5D3A1A');
    leftAntler.setAttribute('stroke-width', '2');
    svg.appendChild(leftAntler);
    
    // Jagged/spiky antlers - RIGHT
    const rightAntler = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rightAntler.setAttribute('d', 'M 85 55 L 95 35 L 90 40 L 100 20 L 92 30 L 105 10 L 95 25 L 85 45');
    rightAntler.setAttribute('fill', '#8B4513');
    rightAntler.setAttribute('stroke', '#5D3A1A');
    rightAntler.setAttribute('stroke-width', '2');
    svg.appendChild(rightAntler);
    
    // Main body (round yellow)
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    body.setAttribute('cx', '60');
    body.setAttribute('cy', '85');
    body.setAttribute('r', '45');
    body.setAttribute('fill', '#FFD700');
    body.setAttribute('stroke', '#DAA520');
    body.setAttribute('stroke-width', '3');
    svg.appendChild(body);
    
    // Big eyes (like sketch)
    const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftEye.setAttribute('cx', '45');
    leftEye.setAttribute('cy', '75');
    leftEye.setAttribute('r', '10');
    leftEye.setAttribute('fill', 'white');
    leftEye.setAttribute('stroke', '#333');
    leftEye.setAttribute('stroke-width', '2');
    svg.appendChild(leftEye);
    
    const leftPupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftPupil.setAttribute('cx', '47');
    leftPupil.setAttribute('cy', '75');
    leftPupil.setAttribute('r', '5');
    leftPupil.setAttribute('fill', '#1a1a1a');
    svg.appendChild(leftPupil);
    
    const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightEye.setAttribute('cx', '75');
    rightEye.setAttribute('cy', '75');
    rightEye.setAttribute('r', '10');
    rightEye.setAttribute('fill', 'white');
    rightEye.setAttribute('stroke', '#333');
    rightEye.setAttribute('stroke-width', '2');
    svg.appendChild(rightEye);
    
    const rightPupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightPupil.setAttribute('cx', '77');
    rightPupil.setAttribute('cy', '75');
    rightPupil.setAttribute('r', '5');
    rightPupil.setAttribute('fill', '#1a1a1a');
    svg.appendChild(rightPupil);
    
    // Pig snout (pink oval with nostrils)
    const snout = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    snout.setAttribute('cx', '60');
    snout.setAttribute('cy', '100');
    snout.setAttribute('rx', '18');
    snout.setAttribute('ry', '12');
    snout.setAttribute('fill', '#FFB6C1');
    snout.setAttribute('stroke', '#E8A0A0');
    snout.setAttribute('stroke-width', '2');
    svg.appendChild(snout);
    
    // Nostrils (two vertical lines like pig)
    const leftNostril = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    leftNostril.setAttribute('cx', '53');
    leftNostril.setAttribute('cy', '100');
    leftNostril.setAttribute('rx', '3');
    leftNostril.setAttribute('ry', '5');
    leftNostril.setAttribute('fill', '#1a1a1a');
    svg.appendChild(leftNostril);
    
    const rightNostril = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    rightNostril.setAttribute('cx', '67');
    rightNostril.setAttribute('cy', '100');
    rightNostril.setAttribute('rx', '3');
    rightNostril.setAttribute('ry', '5');
    rightNostril.setAttribute('fill', '#1a1a1a');
    svg.appendChild(rightNostril);
    
    el.appendChild(svg);
    
    if (state.includes('happy') || state.includes('excited')) {
        el.style.animation = 'bounce 0.5s ease-in-out infinite';
        // Add hearts above
        const hearts = document.createElement('div');
        hearts.style.position = 'absolute';
        hearts.style.top = '-10px';
        hearts.style.left = '50%';
        hearts.style.transform = 'translateX(-50%)';
        hearts.style.fontSize = '20px';
        hearts.style.color = '#FF6B6B';
        hearts.textContent = '♥ ♥ ♥';
        el.appendChild(hearts);
    }
}

function createZipSprite(el, state) {
    el.style.width = '110px';
    el.style.height = '110px';
    el.style.position = 'relative';
    el.innerHTML = '';
    
    // Create SVG for Zip - scruffy black ball with white eyes and teeth like sketch
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '110');
    svg.setAttribute('height', '110');
    svg.setAttribute('viewBox', '0 0 110 110');
    
    // Scruffy/messy fur spikes around the body (like scribbles in sketch)
    const scruffySpikes = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    scruffySpikes.setAttribute('d', `
        M 55 5 L 50 15 L 45 5 L 40 18 L 30 8 L 35 22 L 20 15 L 28 28
        M 10 35 L 22 38 L 8 45 L 20 50 L 5 55 L 18 58 L 8 65 L 22 68
        M 20 85 L 30 78 L 25 92 L 38 82 L 35 98 L 48 88 L 50 102 L 55 90
        M 55 102 L 60 90 L 65 100 L 72 88 L 78 95 L 82 82 L 92 90 L 88 78
        M 100 65 L 88 68 L 102 60 L 90 55 L 105 50 L 92 45 L 100 38 L 88 35
        M 90 20 L 80 28 L 88 15 L 75 22 L 80 8 L 68 18 L 65 5 L 60 15
    `);
    scruffySpikes.setAttribute('fill', '#1a1a1a');
    scruffySpikes.setAttribute('stroke', '#1a1a1a');
    scruffySpikes.setAttribute('stroke-width', '4');
    svg.appendChild(scruffySpikes);
    
    // Main body (black circle)
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    body.setAttribute('cx', '55');
    body.setAttribute('cy', '55');
    body.setAttribute('r', '38');
    body.setAttribute('fill', '#1a1a1a');
    svg.appendChild(body);
    
    // White eyes (big, round)
    const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftEye.setAttribute('cx', '40');
    leftEye.setAttribute('cy', '45');
    leftEye.setAttribute('r', '12');
    leftEye.setAttribute('fill', 'white');
    svg.appendChild(leftEye);
    
    const leftPupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftPupil.setAttribute('cx', '42');
    leftPupil.setAttribute('cy', '45');
    leftPupil.setAttribute('r', '5');
    leftPupil.setAttribute('fill', '#1a1a1a');
    svg.appendChild(leftPupil);
    
    const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightEye.setAttribute('cx', '70');
    rightEye.setAttribute('cy', '45');
    rightEye.setAttribute('r', '12');
    rightEye.setAttribute('fill', 'white');
    svg.appendChild(rightEye);
    
    const rightPupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightPupil.setAttribute('cx', '72');
    rightPupil.setAttribute('cy', '45');
    rightPupil.setAttribute('r', '5');
    rightPupil.setAttribute('fill', '#1a1a1a');
    svg.appendChild(rightPupil);
    
    // Angry mouth with sharp teeth (like sketch)
    const mouthBg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mouthBg.setAttribute('d', 'M 35 70 Q 55 85 75 70');
    mouthBg.setAttribute('fill', '#8B0000');
    mouthBg.setAttribute('stroke', '#8B0000');
    mouthBg.setAttribute('stroke-width', '3');
    svg.appendChild(mouthBg);
    
    // Sharp teeth (triangles)
    const teeth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    teeth.setAttribute('d', 'M 38 70 L 42 78 L 46 70 L 50 78 L 54 70 L 58 78 L 62 70 L 66 78 L 70 70');
    teeth.setAttribute('fill', 'white');
    teeth.setAttribute('stroke', 'white');
    teeth.setAttribute('stroke-width', '1');
    svg.appendChild(teeth);
    
    el.appendChild(svg);
    
    if (state.includes('angry') || state.includes('battle')) {
        el.style.animation = 'shake 0.3s ease-in-out infinite';
    }
    if (state.includes('defeated')) {
        el.style.filter = 'grayscale(50%)';
        el.style.transform = 'rotate(15deg)';
    }
    if (state.includes('leaving')) {
        el.style.animation = 'slideRight 0.5s ease-in-out forwards';
    }
    if (state.includes('hurt')) {
        // Being zapped - yellow glow effect
        el.style.filter = 'brightness(1.5) drop-shadow(0 0 10px yellow)';
        el.style.animation = 'shake 0.1s ease-in-out infinite';
    }
    if (state.includes('caged')) {
        // Add cage bars overlay
        el.style.position = 'relative';
        const cage = document.createElement('div');
        cage.style.position = 'absolute';
        cage.style.top = '-10px';
        cage.style.left = '-10px';
        cage.style.width = '130px';
        cage.style.height = '130px';
        cage.style.border = '4px solid #6B7280';
        cage.style.borderRadius = '5px';
        cage.innerHTML = '<div style="position:absolute;left:30px;top:0;bottom:0;width:3px;background:#6B7280"></div>' +
                         '<div style="position:absolute;left:60px;top:0;bottom:0;width:3px;background:#6B7280"></div>' +
                         '<div style="position:absolute;left:90px;top:0;bottom:0;width:3px;background:#6B7280"></div>' +
                         '<div style="position:absolute;top:50%;left:0;right:0;height:3px;background:#6B7280"></div>';
        el.appendChild(cage);
    }
}

// Create Roxer sprite for cutscenes - light blue body, pink hat with yellow stars
function createRoxerSprite(el, state) {
    el.style.width = '120px';
    el.style.height = '140px';
    el.style.position = 'relative';
    el.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '140');
    svg.setAttribute('viewBox', '0 0 120 140');
    
    // Pink hat with pointed top
    const hat = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hat.setAttribute('d', 'M 30 45 L 60 5 L 90 45 Q 60 35 30 45');
    hat.setAttribute('fill', '#F472B6');
    hat.setAttribute('stroke', '#DB2777');
    hat.setAttribute('stroke-width', '2');
    svg.appendChild(hat);
    
    // Yellow stars on hat
    const star1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    star1.setAttribute('x', '45');
    star1.setAttribute('y', '35');
    star1.setAttribute('font-size', '18');
    star1.setAttribute('fill', '#FBBF24');
    star1.textContent = '★';
    svg.appendChild(star1);
    
    const star2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    star2.setAttribute('x', '65');
    star2.setAttribute('y', '25');
    star2.setAttribute('font-size', '18');
    star2.setAttribute('fill', '#FBBF24');
    star2.textContent = '★';
    svg.appendChild(star2);
    
    // Main body (light blue circle)
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    body.setAttribute('cx', '60');
    body.setAttribute('cy', '85');
    body.setAttribute('r', '40');
    body.setAttribute('fill', '#7DD3FC');
    body.setAttribute('stroke', '#0EA5E9');
    body.setAttribute('stroke-width', '3');
    svg.appendChild(body);
    
    // Yellow menacing eyes (diamond shaped)
    const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    leftEye.setAttribute('d', 'M 40 70 L 48 65 L 56 70 L 48 75 Z');
    leftEye.setAttribute('fill', '#FBBF24');
    svg.appendChild(leftEye);
    
    const leftPupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftPupil.setAttribute('cx', '48');
    leftPupil.setAttribute('cy', '70');
    leftPupil.setAttribute('r', '3');
    leftPupil.setAttribute('fill', '#1a1a1a');
    svg.appendChild(leftPupil);
    
    const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rightEye.setAttribute('d', 'M 64 70 L 72 65 L 80 70 L 72 75 Z');
    rightEye.setAttribute('fill', '#FBBF24');
    svg.appendChild(rightEye);
    
    const rightPupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightPupil.setAttribute('cx', '72');
    rightPupil.setAttribute('cy', '70');
    rightPupil.setAttribute('r', '3');
    rightPupil.setAttribute('fill', '#1a1a1a');
    svg.appendChild(rightPupil);
    
    // Angry eyebrows
    const leftBrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    leftBrow.setAttribute('x1', '35');
    leftBrow.setAttribute('y1', '62');
    leftBrow.setAttribute('x2', '55');
    leftBrow.setAttribute('y2', '58');
    leftBrow.setAttribute('stroke', '#1a1a1a');
    leftBrow.setAttribute('stroke-width', '3');
    svg.appendChild(leftBrow);
    
    const rightBrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rightBrow.setAttribute('x1', '65');
    rightBrow.setAttribute('y1', '58');
    rightBrow.setAttribute('x2', '85');
    rightBrow.setAttribute('y2', '62');
    rightBrow.setAttribute('stroke', '#1a1a1a');
    rightBrow.setAttribute('stroke-width', '3');
    svg.appendChild(rightBrow);
    
    // Sharp fanged grin
    const mouthBg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mouthBg.setAttribute('d', 'M 40 95 Q 60 115 80 95');
    mouthBg.setAttribute('fill', '#8B0000');
    svg.appendChild(mouthBg);
    
    // Sharp teeth
    const teeth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    teeth.setAttribute('d', 'M 42 95 L 48 105 L 54 95 L 60 108 L 66 95 L 72 105 L 78 95');
    teeth.setAttribute('fill', 'white');
    teeth.setAttribute('stroke', 'white');
    svg.appendChild(teeth);
    
    // Lightning wand (on the right side)
    const wand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    wand.setAttribute('x1', '95');
    wand.setAttribute('y1', '50');
    wand.setAttribute('x2', '110');
    wand.setAttribute('y2', '100');
    wand.setAttribute('stroke', '#8B4513');
    wand.setAttribute('stroke-width', '6');
    svg.appendChild(wand);
    
    // Lightning bolt at wand tip
    const lightning = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lightning.setAttribute('d', 'M 105 45 L 98 55 L 108 55 L 95 70 L 102 58 L 92 58 L 105 45');
    lightning.setAttribute('fill', '#FBBF24');
    lightning.setAttribute('stroke', '#F59E0B');
    lightning.setAttribute('stroke-width', '1');
    svg.appendChild(lightning);
    
    el.appendChild(svg);
    
    // Menacing floating animation
    el.style.animation = 'bounce 1s ease-in-out infinite';
}

function endCutscene() {
    // Determine what happens after cutscene
    // Level 1 cutscenes
    if (currentCutscene === cutscenes.opening) {
        startCutscene('zipAppears');
    } else if (currentCutscene === cutscenes.zipAppears) {
        startCutscene('meetZoink');
    } else if (currentCutscene === cutscenes.meetZoink) {
        // Start platformer gameplay
        startPlatformer();
    } else if (currentCutscene === cutscenes.beforeBoss) {
        startBossBattle();
    } else if (currentCutscene === cutscenes.afterBoss) {
        showUnlockScreen();
    }
    // Level 2 cutscenes
    else if (currentCutscene === cutscenes.level2Opening) {
        startCutscene('roxerAppears');
    } else if (currentCutscene === cutscenes.roxerAppears) {
        // Start Level 2 platformer
        startLevel2Platformer();
    } else if (currentCutscene === cutscenes.level2Complete) {
        // Level 2 complete - go to victory
        showLevel2Victory();
    }
    // Level 3 cutscenes
    else if (currentCutscene === cutscenes.level3Opening) {
        // Start Level 3 platformer
        startLevel3Platformer();
    } else if (currentCutscene === cutscenes.level3End) {
        // Level 3 complete - go to victory
        showLevel3Victory();
    }
}

// Add click event for cutscene progression
document.getElementById('cutscene-screen').addEventListener('click', () => {
    currentDialogueIndex++;
    showDialogue();
});

// ============== PLATFORMER GAME ==============

let platformerCanvas, platformerCtx;
let gameLoop;
let platforms = [];
let player = {
    x: 100,
    y: 300,
    width: 50,
    height: 70,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    facingRight: true
};
let zoinkCompanion = {
    x: 60,
    y: 300,
    width: 40,
    height: 40
};
let camera = { x: 0, y: 0 };
let keys = {};
let swingPoints = [];
let isSwinging = false;
let swingAngle = 0;
let currentSwingPoint = null;
let levelComplete = false;

// Delta time for consistent speed across devices
let lastFrameTime = 0;
const TARGET_FPS = 30; // Target iPad-like frame rate
const FRAME_TIME = 1000 / TARGET_FPS;

function startPlatformer() {
    showScreen('game-screen');
    platformerCanvas = document.getElementById('game-canvas');
    platformerCtx = platformerCanvas.getContext('2d');
    
    // Set canvas size
    platformerCanvas.width = window.innerWidth;
    platformerCanvas.height = window.innerHeight;
    
    // Reset player
    player.x = 100;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    
    // Create level
    createLevel1();
    
    // Start game loop
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(updatePlatformer);
}

function createLevel1() {
    platforms = [];
    swingPoints = [];
    
    const canvasHeight = platformerCanvas.height;
    
    // Starting platform
    platforms.push({ x: 0, y: canvasHeight - 100, width: 300, height: 30, type: 'cloud' });
    
    // Platforms going right with some moving ones
    platforms.push({ x: 350, y: canvasHeight - 150, width: 150, height: 25, type: 'cloud' });
    platforms.push({ x: 550, y: canvasHeight - 220, width: 120, height: 25, type: 'cloud', moving: true, moveRange: 50, moveSpeed: 2 });
    platforms.push({ x: 750, y: canvasHeight - 280, width: 100, height: 25, type: 'cloud' });
    
    // Swing point section
    swingPoints.push({ x: 950, y: canvasHeight - 400 });
    platforms.push({ x: 1100, y: canvasHeight - 300, width: 120, height: 25, type: 'cloud' });
    
    // More platforms
    platforms.push({ x: 1300, y: canvasHeight - 350, width: 100, height: 25, type: 'cloud', moving: true, moveRange: 80, moveSpeed: 1.5 });
    platforms.push({ x: 1500, y: canvasHeight - 280, width: 150, height: 25, type: 'cloud' });
    
    // Second swing section
    swingPoints.push({ x: 1700, y: canvasHeight - 380 });
    swingPoints.push({ x: 1900, y: canvasHeight - 350 });
    
    platforms.push({ x: 2050, y: canvasHeight - 250, width: 150, height: 25, type: 'cloud' });
    platforms.push({ x: 2250, y: canvasHeight - 200, width: 120, height: 25, type: 'cloud', moving: true, moveRange: 60, moveSpeed: 2.5 });
    
    // Final stretch
    platforms.push({ x: 2450, y: canvasHeight - 150, width: 200, height: 25, type: 'cloud' });
    platforms.push({ x: 2700, y: canvasHeight - 180, width: 150, height: 25, type: 'cloud' });
    
    // End platform (boss area)
    platforms.push({ x: 2900, y: canvasHeight - 100, width: 400, height: 30, type: 'boss-platform', isEnd: true });
}

function updatePlatformer(currentTime) {
    if (GameState.currentScreen !== 'game-screen') return;
    
    // Calculate delta time for consistent speed across devices
    if (!lastFrameTime) lastFrameTime = currentTime;
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    // Speed multiplier based on frame time (slower on fast devices)
    const speedMultiplier = Math.min(deltaTime / FRAME_TIME, 2);
    
    // Clear canvas
    platformerCtx.clearRect(0, 0, platformerCanvas.width, platformerCanvas.height);
    
    // Draw sky background
    drawSkyBackground();
    
    // Update moving platforms
    platforms.forEach(p => {
        if (p.moving) {
            if (!p.originalX) p.originalX = p.x;
            if (!p.direction) p.direction = 1;
            p.x += p.moveSpeed * p.direction;
            if (p.x > p.originalX + p.moveRange || p.x < p.originalX - p.moveRange) {
                p.direction *= -1;
            }
        }
    });
    
    // Player physics
    if (!isSwinging) {
        // Gravity (constant for consistent jump feel)
        player.velocityY += 0.6;
        
        // Movement speed (base speed, adjusted by delta time)
        const moveSpeed = 4 * speedMultiplier;
        
        // Movement
        if (keys['ArrowLeft'] || keys['KeyA']) {
            player.velocityX = -moveSpeed;
            player.facingRight = false;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            player.velocityX = moveSpeed;
            player.facingRight = true;
        } else {
            player.velocityX *= 0.8;
        }
        
        // Jump (balanced with movement speed)
        if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.onGround) {
            player.velocityY = -13;
            player.onGround = false;
        }
        
        // Apply velocity
        player.x += player.velocityX;
        player.y += player.velocityY;
        
        // Prevent going off left side of level
        if (player.x < 0) player.x = 0;
        
        // Platform collision - using world coordinates for player
        player.onGround = false;
        let onMovingPlatform = null;
        
        platforms.forEach(p => {
            // Compare in world coordinates (player.x is now world position)
            if (player.x + player.width - 10 > p.x && 
                player.x + 10 < p.x + p.width &&
                player.y + player.height >= p.y - 5 &&
                player.y + player.height <= p.y + p.height + 15 &&
                player.velocityY >= 0) {
                
                player.y = p.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
                
                // Remember if on moving platform
                if (p.moving) {
                    onMovingPlatform = p;
                }
                
                // Check if reached end
                if (p.isEnd && !levelComplete) {
                    levelComplete = true;
                    setTimeout(() => {
                        if (GameState.isReplay) {
                            // Skip cutscene on replay, go directly to boss
                            startBossBattle();
                        } else {
                            startCutscene('beforeBoss');
                        }
                    }, 500);
                }
            }
        });
        
        // Apply moving platform movement AFTER collision check
        if (onMovingPlatform) {
            // Move player with platform smoothly
            player.x += onMovingPlatform.moveSpeed * onMovingPlatform.direction;
        }
        
        // Fall death - show death screen
        if (player.y > platformerCanvas.height + 100) {
            GameState.health -= 25;
            updateHealthUI();
            
            if (GameState.health <= 0) {
                showDeathScreen('platformer');
                return;
            } else {
                // Respawn at last checkpoint
                player.x = 100;
                player.y = 300;
                camera.x = 0;
            }
        }
        
        // Check for zero health
        if (GameState.health <= 0) {
            showDeathScreen('platformer');
            return;
        }
    } else {
        // Swinging physics - player.x is in world coordinates
        swingAngle += 0.05;
        const swingRadius = 150;
        player.x = currentSwingPoint.x + Math.sin(swingAngle) * swingRadius - player.width / 2;
        player.y = currentSwingPoint.y + Math.cos(swingAngle) * swingRadius - player.height / 2;
        
        // Release swing
        if (keys['Space'] || keys['ArrowUp'] || keys['KeyW']) {
            isSwinging = false;
            player.velocityX = Math.cos(swingAngle) * 15;
            player.velocityY = -Math.abs(Math.sin(swingAngle)) * 15;
            keys['Space'] = false;
            keys['ArrowUp'] = false;
            keys['KeyW'] = false;
        }
    }
    
    // Camera follow
    const targetCameraX = player.x - platformerCanvas.width / 3;
    camera.x += (targetCameraX - camera.x) * 0.1;
    if (camera.x < 0) camera.x = 0;
    
    // Draw platforms
    platforms.forEach(p => {
        drawCloud(p.x - camera.x, p.y, p.width, p.height, p.type === 'boss-platform');
    });
    
    // Draw swing points
    swingPoints.forEach(sp => {
        drawSwingPoint(sp.x - camera.x, sp.y);
        
        // Check if player can grab - use world coordinates for distance
        if (!isSwinging && keys['Digit3']) {
            const dist = Math.hypot(player.x + player.width/2 - sp.x, player.y - sp.y);
            if (dist < 200) {
                isSwinging = true;
                currentSwingPoint = sp;
                swingAngle = Math.atan2(player.x + player.width/2 - sp.x, player.y - sp.y);
                keys['Digit3'] = false;
            }
        }
    });
    
    // Draw swing rope - convert to screen coordinates
    if (isSwinging && currentSwingPoint) {
        platformerCtx.strokeStyle = '#8B4513';
        platformerCtx.lineWidth = 4;
        platformerCtx.beginPath();
        platformerCtx.moveTo(currentSwingPoint.x - camera.x, currentSwingPoint.y);
        platformerCtx.lineTo(player.x - camera.x + player.width/2, player.y + player.height/2);
        platformerCtx.stroke();
    }
    
    // Draw Zoink companion - convert to screen coordinates
    const playerScreenX = player.x - camera.x;
    zoinkCompanion.x = playerScreenX - 40;
    zoinkCompanion.y = player.y + 20;
    drawZoink(zoinkCompanion.x, zoinkCompanion.y, 40);
    
    // Draw player - convert to screen coordinates
    drawPlayer(playerScreenX, player.y);
    
    // Draw UI hints
    drawUIHints();
    
    gameLoop = requestAnimationFrame(updatePlatformer);
}

function drawSkyBackground() {
    // Beautiful sky gradient like a dreamy sky
    const gradient = platformerCtx.createLinearGradient(0, 0, 0, platformerCanvas.height);
    gradient.addColorStop(0, '#4A90D9');      // Deeper blue at top
    gradient.addColorStop(0.3, '#87CEEB');    // Sky blue
    gradient.addColorStop(0.6, '#B8E4F9');    // Light blue
    gradient.addColorStop(0.85, '#FFE4B5');   // Warm sunset hint at horizon
    gradient.addColorStop(1, '#FFF8DC');      // Cream at bottom
    platformerCtx.fillStyle = gradient;
    platformerCtx.fillRect(0, 0, platformerCanvas.width, platformerCanvas.height);
    
    // Distant mountains/landscape silhouette
    platformerCtx.fillStyle = 'rgba(100, 149, 237, 0.3)';
    platformerCtx.beginPath();
    platformerCtx.moveTo(0, platformerCanvas.height);
    for (let x = 0; x < platformerCanvas.width + 100; x += 80) {
        const peakHeight = 150 + Math.sin(x * 0.01 + camera.x * 0.0005) * 80;
        platformerCtx.lineTo(x - camera.x * 0.1, platformerCanvas.height - peakHeight);
    }
    platformerCtx.lineTo(platformerCanvas.width, platformerCanvas.height);
    platformerCtx.fill();
    
    // Background clouds - fluffy and dreamy
    for (let i = 0; i < 8; i++) {
        const x = ((i * 350) - camera.x * 0.2) % (platformerCanvas.width + 300) - 150;
        const y = 60 + (i % 3) * 80;
        const alpha = 0.4 + (i % 3) * 0.1;
        drawBackgroundCloud(x, y, 80 + (i % 4) * 30, alpha);
    }
    
    // Floating particles/sparkles
    platformerCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 15; i++) {
        const sparkleX = ((i * 137 + Date.now() * 0.02) % platformerCanvas.width);
        const sparkleY = (i * 89 + Math.sin(Date.now() * 0.001 + i) * 20) % (platformerCanvas.height * 0.7);
        platformerCtx.beginPath();
        platformerCtx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        platformerCtx.fill();
    }
}

function drawBackgroundCloud(x, y, size, alpha) {
    platformerCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    platformerCtx.beginPath();
    // Sketch-like irregular cloud shape
    platformerCtx.arc(x, y, size * 0.35, 0, Math.PI * 2);
    platformerCtx.arc(x + size * 0.25, y - size * 0.15, size * 0.3, 0, Math.PI * 2);
    platformerCtx.arc(x + size * 0.5, y - size * 0.05, size * 0.35, 0, Math.PI * 2);
    platformerCtx.arc(x + size * 0.75, y, size * 0.3, 0, Math.PI * 2);
    platformerCtx.arc(x + size * 0.35, y + size * 0.1, size * 0.25, 0, Math.PI * 2);
    platformerCtx.fill();
}

function drawCloudShape(x, y, size) {
    platformerCtx.beginPath();
    platformerCtx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    platformerCtx.arc(x + size * 0.3, y - size * 0.1, size * 0.35, 0, Math.PI * 2);
    platformerCtx.arc(x + size * 0.6, y, size * 0.4, 0, Math.PI * 2);
    platformerCtx.arc(x + size * 0.3, y + size * 0.1, size * 0.3, 0, Math.PI * 2);
    platformerCtx.fill();
}

function drawCloud(x, y, width, height, isBoss) {
    const cloudColor = isBoss ? '#FFD700' : 'white';
    
    platformerCtx.shadowColor = 'rgba(0,0,0,0.2)';
    platformerCtx.shadowBlur = 10;
    platformerCtx.shadowOffsetY = 5;
    
    platformerCtx.fillStyle = cloudColor;
    
    // Main cloud platform - simple ellipse
    platformerCtx.beginPath();
    platformerCtx.ellipse(x + width/2, y + height/2, width/2, height, 0, 0, Math.PI * 2);
    platformerCtx.fill();
    
    // Fluffy top bumps - fixed positions
    for (let i = 0; i < width; i += 30) {
        platformerCtx.beginPath();
        platformerCtx.arc(x + 15 + i, y, 20, 0, Math.PI * 2);
        platformerCtx.fill();
    }
    
    platformerCtx.shadowColor = 'transparent';
    
    if (isBoss) {
        // Draw "BOSS" indicator
        platformerCtx.fillStyle = '#DC143C';
        platformerCtx.font = 'bold 20px Fredoka One';
        platformerCtx.fillText('→ BOSS', x + width/2 - 40, y - 30);
    }
}

function drawSwingPoint(x, y) {
    platformerCtx.save();
    
    // Animated glow ring
    const glowPulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.5;
    platformerCtx.fillStyle = `rgba(255, 215, 0, ${glowPulse * 0.3})`;
    platformerCtx.beginPath();
    platformerCtx.arc(x, y, 35 + glowPulse * 5, 0, Math.PI * 2);
    platformerCtx.fill();
    
    platformerCtx.fillStyle = `rgba(255, 215, 0, ${glowPulse * 0.5})`;
    platformerCtx.beginPath();
    platformerCtx.arc(x, y, 25, 0, Math.PI * 2);
    platformerCtx.fill();
    
    // Jagged antler hook (like Zoink's antlers)
    platformerCtx.fillStyle = '#8B4513';
    platformerCtx.strokeStyle = '#5D3A1A';
    platformerCtx.lineWidth = 2;
    
    // Left jagged antler
    platformerCtx.beginPath();
    platformerCtx.moveTo(x - 5, y);
    platformerCtx.lineTo(x - 18, y - 25);
    platformerCtx.lineTo(x - 12, y - 20);
    platformerCtx.lineTo(x - 22, y - 45);
    platformerCtx.lineTo(x - 10, y - 30);
    platformerCtx.lineTo(x - 5, y - 10);
    platformerCtx.closePath();
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Right jagged antler
    platformerCtx.beginPath();
    platformerCtx.moveTo(x + 5, y);
    platformerCtx.lineTo(x + 18, y - 25);
    platformerCtx.lineTo(x + 12, y - 20);
    platformerCtx.lineTo(x + 22, y - 45);
    platformerCtx.lineTo(x + 10, y - 30);
    platformerCtx.lineTo(x + 5, y - 10);
    platformerCtx.closePath();
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Center connection
    platformerCtx.fillStyle = '#8B4513';
    platformerCtx.beginPath();
    platformerCtx.arc(x, y - 5, 8, 0, Math.PI * 2);
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Label with background
    platformerCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    platformerCtx.roundRect(x - 55, y + 35, 110, 25, 10);
    platformerCtx.fill();
    
    platformerCtx.fillStyle = '#FFD700';
    platformerCtx.font = 'bold 13px Nunito';
    platformerCtx.textAlign = 'center';
    platformerCtx.fillText('Press 3 to Swing!', x, y + 52);
    platformerCtx.textAlign = 'left';
    
    platformerCtx.restore();
}

function drawZoink(x, y, size) {
    platformerCtx.save();
    platformerCtx.lineWidth = 2;
    platformerCtx.strokeStyle = '#DAA520';
    
    // Jagged/Spiky antlers (like sketch) - LEFT
    platformerCtx.fillStyle = '#8B4513';
    platformerCtx.beginPath();
    platformerCtx.moveTo(x + size * 0.3, y + size * 0.15);
    platformerCtx.lineTo(x + size * 0.2, y - size * 0.1);
    platformerCtx.lineTo(x + size * 0.25, y);
    platformerCtx.lineTo(x + size * 0.12, y - size * 0.25);
    platformerCtx.lineTo(x + size * 0.22, y - size * 0.05);
    platformerCtx.lineTo(x + size * 0.05, y - size * 0.35);
    platformerCtx.lineTo(x + size * 0.18, y - size * 0.1);
    platformerCtx.lineTo(x + size * 0.32, y + size * 0.1);
    platformerCtx.closePath();
    platformerCtx.fill();
    platformerCtx.strokeStyle = '#5D3A1A';
    platformerCtx.stroke();
    
    // Jagged/Spiky antlers - RIGHT
    platformerCtx.beginPath();
    platformerCtx.moveTo(x + size * 0.7, y + size * 0.15);
    platformerCtx.lineTo(x + size * 0.8, y - size * 0.1);
    platformerCtx.lineTo(x + size * 0.75, y);
    platformerCtx.lineTo(x + size * 0.88, y - size * 0.25);
    platformerCtx.lineTo(x + size * 0.78, y - size * 0.05);
    platformerCtx.lineTo(x + size * 0.95, y - size * 0.35);
    platformerCtx.lineTo(x + size * 0.82, y - size * 0.1);
    platformerCtx.lineTo(x + size * 0.68, y + size * 0.1);
    platformerCtx.closePath();
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Body (golden yellow circle)
    platformerCtx.fillStyle = '#FFD700';
    platformerCtx.strokeStyle = '#DAA520';
    platformerCtx.beginPath();
    platformerCtx.arc(x + size/2, y + size/2, size/2 - 2, 0, Math.PI * 2);
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Big eyes (white with black pupil like sketch)
    platformerCtx.fillStyle = 'white';
    platformerCtx.strokeStyle = '#333';
    platformerCtx.beginPath();
    platformerCtx.arc(x + size * 0.35, y + size * 0.38, size * 0.12, 0, Math.PI * 2);
    platformerCtx.fill();
    platformerCtx.stroke();
    
    platformerCtx.beginPath();
    platformerCtx.arc(x + size * 0.65, y + size * 0.38, size * 0.12, 0, Math.PI * 2);
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Pupils
    platformerCtx.fillStyle = '#1a1a1a';
    platformerCtx.beginPath();
    platformerCtx.arc(x + size * 0.37, y + size * 0.38, size * 0.05, 0, Math.PI * 2);
    platformerCtx.arc(x + size * 0.67, y + size * 0.38, size * 0.05, 0, Math.PI * 2);
    platformerCtx.fill();
    
    // Pink pig snout (oval)
    platformerCtx.fillStyle = '#FFB6C1';
    platformerCtx.strokeStyle = '#E8A0A0';
    platformerCtx.beginPath();
    platformerCtx.ellipse(x + size/2, y + size * 0.65, size * 0.18, size * 0.1, 0, 0, Math.PI * 2);
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Nostrils (vertical ovals like pig)
    platformerCtx.fillStyle = '#1a1a1a';
    platformerCtx.beginPath();
    platformerCtx.ellipse(x + size * 0.44, y + size * 0.65, size * 0.03, size * 0.05, 0, 0, Math.PI * 2);
    platformerCtx.fill();
    platformerCtx.beginPath();
    platformerCtx.ellipse(x + size * 0.56, y + size * 0.65, size * 0.03, size * 0.05, 0, 0, Math.PI * 2);
    platformerCtx.fill();
    
    platformerCtx.restore();
}

// Zoink for boss battle (uses bossCtx)
function drawZoinkBoss(x, y, size) {
    bossCtx.save();
    bossCtx.lineWidth = 2;
    bossCtx.strokeStyle = '#DAA520';
    
    // Jagged/Spiky antlers - LEFT
    bossCtx.fillStyle = '#8B4513';
    bossCtx.beginPath();
    bossCtx.moveTo(x + size * 0.3, y + size * 0.15);
    bossCtx.lineTo(x + size * 0.2, y - size * 0.1);
    bossCtx.lineTo(x + size * 0.25, y);
    bossCtx.lineTo(x + size * 0.12, y - size * 0.25);
    bossCtx.lineTo(x + size * 0.22, y - size * 0.05);
    bossCtx.lineTo(x + size * 0.05, y - size * 0.35);
    bossCtx.lineTo(x + size * 0.18, y - size * 0.1);
    bossCtx.lineTo(x + size * 0.32, y + size * 0.1);
    bossCtx.closePath();
    bossCtx.fill();
    bossCtx.strokeStyle = '#5D3A1A';
    bossCtx.stroke();
    
    // Jagged/Spiky antlers - RIGHT
    bossCtx.beginPath();
    bossCtx.moveTo(x + size * 0.7, y + size * 0.15);
    bossCtx.lineTo(x + size * 0.8, y - size * 0.1);
    bossCtx.lineTo(x + size * 0.75, y);
    bossCtx.lineTo(x + size * 0.88, y - size * 0.25);
    bossCtx.lineTo(x + size * 0.78, y - size * 0.05);
    bossCtx.lineTo(x + size * 0.95, y - size * 0.35);
    bossCtx.lineTo(x + size * 0.82, y - size * 0.1);
    bossCtx.lineTo(x + size * 0.68, y + size * 0.1);
    bossCtx.closePath();
    bossCtx.fill();
    bossCtx.stroke();
    
    // Body (golden yellow circle)
    bossCtx.fillStyle = '#FFD700';
    bossCtx.strokeStyle = '#DAA520';
    bossCtx.beginPath();
    bossCtx.arc(x + size/2, y + size/2, size/2 - 2, 0, Math.PI * 2);
    bossCtx.fill();
    bossCtx.stroke();
    
    // Big eyes
    bossCtx.fillStyle = 'white';
    bossCtx.strokeStyle = '#333';
    bossCtx.beginPath();
    bossCtx.arc(x + size * 0.35, y + size * 0.38, size * 0.12, 0, Math.PI * 2);
    bossCtx.fill();
    bossCtx.stroke();
    
    bossCtx.beginPath();
    bossCtx.arc(x + size * 0.65, y + size * 0.38, size * 0.12, 0, Math.PI * 2);
    bossCtx.fill();
    bossCtx.stroke();
    
    // Pupils
    bossCtx.fillStyle = '#1a1a1a';
    bossCtx.beginPath();
    bossCtx.arc(x + size * 0.37, y + size * 0.38, size * 0.05, 0, Math.PI * 2);
    bossCtx.arc(x + size * 0.67, y + size * 0.38, size * 0.05, 0, Math.PI * 2);
    bossCtx.fill();
    
    // Pink pig snout
    bossCtx.fillStyle = '#FFB6C1';
    bossCtx.strokeStyle = '#E8A0A0';
    bossCtx.beginPath();
    bossCtx.ellipse(x + size/2, y + size * 0.65, size * 0.18, size * 0.1, 0, 0, Math.PI * 2);
    bossCtx.fill();
    bossCtx.stroke();
    
    // Nostrils
    bossCtx.fillStyle = '#1a1a1a';
    bossCtx.beginPath();
    bossCtx.ellipse(x + size * 0.44, y + size * 0.65, size * 0.03, size * 0.05, 0, 0, Math.PI * 2);
    bossCtx.fill();
    bossCtx.beginPath();
    bossCtx.ellipse(x + size * 0.56, y + size * 0.65, size * 0.03, size * 0.05, 0, 0, Math.PI * 2);
    bossCtx.fill();
    
    bossCtx.restore();
}

function drawPlayer(x, y) {
    const hairColor = GameState.playerGender === 'female' ? '#F5DEB3' : '#8B4513';
    const shirtColor = GameState.playerGender === 'female' ? '#FFB6C1' : '#4CAF50';
    const outlineColor = '#333';
    
    platformerCtx.save();
    platformerCtx.lineWidth = 2;
    platformerCtx.strokeStyle = outlineColor;
    platformerCtx.lineCap = 'round';
    platformerCtx.lineJoin = 'round';
    
    // Head (circle like sketch)
    platformerCtx.fillStyle = '#FFE4C4';
    platformerCtx.beginPath();
    platformerCtx.arc(x + 25, y + 18, 16, 0, Math.PI * 2);
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Hair (scruffy like sketch)
    platformerCtx.fillStyle = hairColor;
    platformerCtx.beginPath();
    if (GameState.playerGender === 'female') {
        // Long flowing hair
        platformerCtx.moveTo(x + 9, y + 18);
        platformerCtx.quadraticCurveTo(x + 5, y + 5, x + 25, y + 2);
        platformerCtx.quadraticCurveTo(x + 45, y + 5, x + 41, y + 18);
        platformerCtx.quadraticCurveTo(x + 45, y + 35, x + 38, y + 40);
        platformerCtx.quadraticCurveTo(x + 25, y + 18, x + 12, y + 40);
        platformerCtx.quadraticCurveTo(x + 5, y + 35, x + 9, y + 18);
    } else {
        // Short messy hair
        platformerCtx.moveTo(x + 10, y + 18);
        platformerCtx.quadraticCurveTo(x + 8, y + 8, x + 18, y + 5);
        platformerCtx.lineTo(x + 22, y + 8);
        platformerCtx.lineTo(x + 25, y + 3);
        platformerCtx.lineTo(x + 28, y + 8);
        platformerCtx.lineTo(x + 32, y + 5);
        platformerCtx.quadraticCurveTo(x + 42, y + 8, x + 40, y + 18);
    }
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Eyes (simple dots like sketch)
    platformerCtx.fillStyle = '#1a1a1a';
    const eyeOffsetX = player.facingRight ? 2 : -2;
    platformerCtx.beginPath();
    platformerCtx.arc(x + 19 + eyeOffsetX, y + 16, 2.5, 0, Math.PI * 2);
    platformerCtx.arc(x + 31 + eyeOffsetX, y + 16, 2.5, 0, Math.PI * 2);
    platformerCtx.fill();
    
    // Simple smile
    platformerCtx.beginPath();
    platformerCtx.arc(x + 25, y + 22, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    platformerCtx.stroke();
    
    // Body (shirt - simple rectangle like sketch)
    platformerCtx.fillStyle = shirtColor;
    platformerCtx.beginPath();
    platformerCtx.roundRect(x + 12, y + 32, 26, 35, 4);
    platformerCtx.fill();
    platformerCtx.stroke();
    
    // Arms (simple lines like sketch)
    platformerCtx.strokeStyle = '#FFE4C4';
    platformerCtx.lineWidth = 6;
    // Left arm
    platformerCtx.beginPath();
    platformerCtx.moveTo(x + 12, y + 38);
    if (player.facingRight) {
        platformerCtx.lineTo(x + 2, y + 55);
    } else {
        platformerCtx.lineTo(x + 5, y + 50);
    }
    platformerCtx.stroke();
    // Right arm
    platformerCtx.beginPath();
    platformerCtx.moveTo(x + 38, y + 38);
    if (player.facingRight) {
        platformerCtx.lineTo(x + 45, y + 50);
    } else {
        platformerCtx.lineTo(x + 48, y + 55);
    }
    platformerCtx.stroke();
    
    // Legs (simple lines like sketch)
    platformerCtx.strokeStyle = '#4a4a4a';
    platformerCtx.lineWidth = 8;
    // Left leg
    platformerCtx.beginPath();
    platformerCtx.moveTo(x + 18, y + 67);
    platformerCtx.lineTo(x + 15, y + 80);
    platformerCtx.stroke();
    // Right leg  
    platformerCtx.beginPath();
    platformerCtx.moveTo(x + 32, y + 67);
    platformerCtx.lineTo(x + 35, y + 80);
    platformerCtx.stroke();
    
    // Outline the limbs
    platformerCtx.strokeStyle = outlineColor;
    platformerCtx.lineWidth = 1;
    
    platformerCtx.restore();
}

function drawUIHints() {
    // Only show keyboard hints on desktop (not touch devices)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice && window.innerWidth > 1024) {
        platformerCtx.fillStyle = 'rgba(0,0,0,0.7)';
        platformerCtx.fillRect(10, platformerCanvas.height - 80, 250, 70);
        platformerCtx.fillStyle = 'white';
        platformerCtx.font = '14px Nunito';
        platformerCtx.fillText('← → or A/D: Move', 20, platformerCanvas.height - 55);
        platformerCtx.fillText('↑ or W or Space: Jump', 20, platformerCanvas.height - 35);
        platformerCtx.fillText('3: Use Antler Swing (near hooks)', 20, platformerCanvas.height - 15);
    }
}

function updateHealthUI() {
    const healthFill = document.querySelector('#game-ui .health-fill');
    const healthText = document.querySelector('#game-ui .health-text');
    if (healthFill && healthText) {
        healthFill.style.width = `${(GameState.health / GameState.maxHealth) * 150}px`;
        healthText.textContent = GameState.health;
    }
}

// ============== BOSS BATTLE ==============

let bossCanvas, bossCtx;
let bossLoop;
let boss = {
    x: 600,
    y: 400,
    width: 100,
    height: 100,
    health: 100,
    maxHealth: 100,
    state: 'idle', // idle, punching, flying, landing
    targetX: 0,
    targetY: 0,
    flyTimer: 0,
    attackCooldown: 0,
    lastPlayerPositions: []
};
let battlePlayer = {
    x: 200,
    y: 400,
    width: 50,
    height: 70,
    velocityX: 0,
    velocityY: 0,
    onGround: true,
    health: 100,
    attackCooldown: 0
};
let dangerZone = null;
let bossVoiceLine = '';
let voiceLineTimer = 0;

function startBossBattle() {
    showScreen('boss-screen');
    bossCanvas = document.getElementById('boss-canvas');
    bossCtx = bossCanvas.getContext('2d');
    
    bossCanvas.width = window.innerWidth;
    bossCanvas.height = window.innerHeight;
    
    // Start scary boss music!
    playBossMusic();
    
    // Reset
    boss.health = 100;
    boss.state = 'idle';
    boss.attackCooldown = 60;
    battlePlayer.health = 100;
    battlePlayer.x = 200;
    battlePlayer.y = bossCanvas.height - 200;
    bossVoiceLine = 'How dare you';
    voiceLineTimer = 120;
    
    if (bossLoop) cancelAnimationFrame(bossLoop);
    bossLoop = requestAnimationFrame(updateBossBattle);
}

function updateBossBattle() {
    if (GameState.currentScreen !== 'boss-screen') return;
    
    // Clear
    bossCtx.clearRect(0, 0, bossCanvas.width, bossCanvas.height);
    
    // Draw background (includes ground)
    drawBossBackground();
    
    const groundY = bossCanvas.height - 100;
    
    // Update player
    updateBattlePlayer(groundY);
    
    // Store player position history (for delayed attack)
    boss.lastPlayerPositions.push({ x: battlePlayer.x, y: battlePlayer.y, time: Date.now() });
    if (boss.lastPlayerPositions.length > 180) { // 3 seconds at 60fps
        boss.lastPlayerPositions.shift();
    }
    
    // Update boss
    updateBoss(groundY);
    
    // Draw danger zone
    if (dangerZone) {
        bossCtx.fillStyle = 'rgba(220, 20, 60, 0.4)';
        bossCtx.beginPath();
        bossCtx.arc(dangerZone.x, dangerZone.y, 80, 0, Math.PI * 2);
        bossCtx.fill();
        
        bossCtx.strokeStyle = '#DC143C';
        bossCtx.lineWidth = 3;
        bossCtx.beginPath();
        bossCtx.arc(dangerZone.x, dangerZone.y, 80, 0, Math.PI * 2);
        bossCtx.stroke();
    }
    
    // Draw boss
    drawBoss();
    
    // Draw player
    drawBattlePlayer();
    
    // Draw Zoink companion
    drawZoinkBoss(battlePlayer.x - 50, battlePlayer.y + 20, 35);
    
    // Draw attack effects (Zoink pounce, swing, gun)
    drawAttackEffects();
    
    // Draw voice line
    if (voiceLineTimer > 0) {
        bossCtx.fillStyle = 'white';
        bossCtx.font = 'bold 24px Fredoka One';
        bossCtx.fillText(bossVoiceLine, boss.x - 50, boss.y - 70);
        voiceLineTimer--;
    }
    
    // Update UI
    updateBossUI();
    
    // Check win/lose
    if (boss.health <= 0) {
        setTimeout(() => {
            if (GameState.isReplay && GameState.level1Completed) {
                // Skip cutscene on replay, go directly to victory
                showScreen('victory-screen');
            } else {
                GameState.level1Completed = true;
                startCutscene('afterBoss');
            }
        }, 1000);
        return;
    }
    
    if (battlePlayer.health <= 0) {
        // Show death screen instead of auto-reset
        showDeathScreen('boss');
        return;
    }
    
    bossLoop = requestAnimationFrame(updateBossBattle);
}

function drawBossBackground() {
    // Dramatic dark sky gradient
    const gradient = bossCtx.createLinearGradient(0, 0, 0, bossCanvas.height);
    gradient.addColorStop(0, '#0a0a15');
    gradient.addColorStop(0.3, '#1a1a2e');
    gradient.addColorStop(0.6, '#2d2d44');
    gradient.addColorStop(0.85, '#3d3436');
    gradient.addColorStop(1, '#1a1a1a');
    bossCtx.fillStyle = gradient;
    bossCtx.fillRect(0, 0, bossCanvas.width, bossCanvas.height);
    
    // Red/orange dramatic glow at center
    const centerGlow = bossCtx.createRadialGradient(
        bossCanvas.width / 2, bossCanvas.height * 0.6,
        0,
        bossCanvas.width / 2, bossCanvas.height * 0.6,
        300
    );
    centerGlow.addColorStop(0, 'rgba(220, 60, 60, 0.15)');
    centerGlow.addColorStop(0.5, 'rgba(180, 40, 40, 0.08)');
    centerGlow.addColorStop(1, 'transparent');
    bossCtx.fillStyle = centerGlow;
    bossCtx.fillRect(0, 0, bossCanvas.width, bossCanvas.height);
    
    // Animated stars
    bossCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 20; i++) {
        const twinkle = Math.sin(Date.now() * 0.003 + i * 0.5) * 0.4 + 0.6;
        bossCtx.globalAlpha = twinkle;
        bossCtx.beginPath();
        bossCtx.arc(
            (i * 97) % bossCanvas.width,
            (i * 47) % (bossCanvas.height * 0.5),
            1 + (i % 2),
            0, Math.PI * 2
        );
        bossCtx.fill();
    }
    bossCtx.globalAlpha = 1;
    
    // Dark dramatic clouds
    bossCtx.fillStyle = 'rgba(40, 40, 50, 0.6)';
    for (let i = 0; i < 4; i++) {
        const cloudX = ((i * 280 + Date.now() * 0.01) % (bossCanvas.width + 200)) - 100;
        drawBossCloudShape(cloudX, 80 + i * 40, 180 - i * 20);
    }
    
    // Ground with texture
    const groundY = bossCanvas.height - 100;
    const groundGradient = bossCtx.createLinearGradient(0, groundY, 0, bossCanvas.height);
    groundGradient.addColorStop(0, '#3d3436');
    groundGradient.addColorStop(0.3, '#2d2d2d');
    groundGradient.addColorStop(1, '#1a1a1a');
    bossCtx.fillStyle = groundGradient;
    bossCtx.fillRect(0, groundY, bossCanvas.width, 100);
    
    // Ground edge highlight
    bossCtx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
    bossCtx.lineWidth = 2;
    bossCtx.beginPath();
    bossCtx.moveTo(0, groundY);
    bossCtx.lineTo(bossCanvas.width, groundY);
    bossCtx.stroke();
}

function drawBossCloudShape(x, y, size) {
    bossCtx.beginPath();
    bossCtx.arc(x, y, size * 0.35, 0, Math.PI * 2);
    bossCtx.arc(x + size * 0.25, y - size * 0.1, size * 0.3, 0, Math.PI * 2);
    bossCtx.arc(x + size * 0.5, y, size * 0.35, 0, Math.PI * 2);
    bossCtx.arc(x + size * 0.75, y + size * 0.05, size * 0.3, 0, Math.PI * 2);
    bossCtx.fill();
}

// Boss battle delta time tracking
let bossLastFrameTime = 0;

function updateBattlePlayer(groundY) {
    // Calculate delta time for consistent speed
    const currentTime = performance.now();
    if (!bossLastFrameTime) bossLastFrameTime = currentTime;
    const deltaTime = currentTime - bossLastFrameTime;
    bossLastFrameTime = currentTime;
    const speedMultiplier = Math.min(deltaTime / FRAME_TIME, 2);
    
    // Movement speed (reduced and adjusted for delta time)
    const moveSpeed = 3.5 * speedMultiplier;
    
    // Movement
    if (keys['ArrowLeft'] || keys['KeyA']) {
        battlePlayer.velocityX = -moveSpeed;
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        battlePlayer.velocityX = moveSpeed;
    } else {
        battlePlayer.velocityX *= 0.8;
    }
    
    // Jump (balanced with movement speed)
    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && battlePlayer.onGround) {
        battlePlayer.velocityY = -13;
        battlePlayer.onGround = false;
    }
    
    // Gravity (constant for consistent jump feel)
    if (!battlePlayer.onGround) {
        battlePlayer.velocityY += 0.6;
    }
    
    // Apply velocity
    battlePlayer.x += battlePlayer.velocityX;
    battlePlayer.y += battlePlayer.velocityY;
    
    // Ground collision
    if (battlePlayer.y + battlePlayer.height > groundY) {
        battlePlayer.y = groundY - battlePlayer.height;
        battlePlayer.velocityY = 0;
        battlePlayer.onGround = true;
    }
    
    // Bounds
    if (battlePlayer.x < 0) battlePlayer.x = 0;
    if (battlePlayer.x + battlePlayer.width > bossCanvas.width) {
        battlePlayer.x = bossCanvas.width - battlePlayer.width;
    }
    
    // Attack cooldown
    if (battlePlayer.attackCooldown > 0) battlePlayer.attackCooldown--;
    
    // Attacks
    if (keys['Digit1'] && battlePlayer.attackCooldown === 0) {
        // Pounce attack - 15 damage
        performPounceAttack();
        battlePlayer.attackCooldown = 30;
        keys['Digit1'] = false;
    }
    if (keys['Digit2'] && battlePlayer.attackCooldown === 0) {
        // Gun attack - 5 damage
        performGunAttack();
        battlePlayer.attackCooldown = 45;
        keys['Digit2'] = false;
    }
    if (keys['Digit3'] && battlePlayer.attackCooldown === 0) {
        // Swing attack - 30 damage
        performSwingAttack();
        battlePlayer.attackCooldown = 60;
        keys['Digit3'] = false;
    }
}

// Attack effect variables
let attackEffect = null;
let attackEffectTimer = 0;

function performPounceAttack() {
    // Pounce does 15 damage
    boss.health -= 15;
    
    // Show Zoink pouncing on Zip
    attackEffect = 'pounce';
    attackEffectTimer = 30;
}

function performGunAttack() {
    // Gun does 5 damage
    boss.health -= 5;
    
    // Show projectile effect
    attackEffect = 'gun';
    attackEffectTimer = 20;
}

function performSwingAttack() {
    // Swing does 30 damage
    boss.health -= 30;
    
    // Show Zoink antler wrapping around Zip
    attackEffect = 'swing';
    attackEffectTimer = 40;
}

function drawAttackEffects() {
    if (attackEffectTimer <= 0) {
        attackEffect = null;
        return;
    }
    
    attackEffectTimer--;
    
    if (attackEffect === 'pounce') {
        // Draw Zoink pouncing on Zip
        const pounceX = boss.x + boss.width / 2 - 25;
        const pounceY = boss.y - 20 + (30 - attackEffectTimer);
        
        // Zoink body
        bossCtx.fillStyle = '#FFD700';
        bossCtx.beginPath();
        bossCtx.arc(pounceX, pounceY, 25, 0, Math.PI * 2);
        bossCtx.fill();
        
        // Pink snout
        bossCtx.fillStyle = '#FFB6C1';
        bossCtx.beginPath();
        bossCtx.ellipse(pounceX, pounceY + 8, 10, 6, 0, 0, Math.PI * 2);
        bossCtx.fill();
        
        // Impact lines
        bossCtx.strokeStyle = '#FF6B6B';
        bossCtx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            bossCtx.beginPath();
            bossCtx.moveTo(pounceX + Math.cos(angle) * 30, pounceY + Math.sin(angle) * 30);
            bossCtx.lineTo(pounceX + Math.cos(angle) * 45, pounceY + Math.sin(angle) * 45);
            bossCtx.stroke();
        }
    }
    
    if (attackEffect === 'gun') {
        // Draw projectile line
        bossCtx.strokeStyle = '#FFD700';
        bossCtx.lineWidth = 4;
        bossCtx.beginPath();
        bossCtx.moveTo(battlePlayer.x + battlePlayer.width, battlePlayer.y + battlePlayer.height / 2);
        bossCtx.lineTo(boss.x, boss.y + boss.height / 2);
        bossCtx.stroke();
        
        // Draw impact spark
        bossCtx.fillStyle = '#FFD700';
        bossCtx.beginPath();
        bossCtx.arc(boss.x, boss.y + boss.height / 2, 15, 0, Math.PI * 2);
        bossCtx.fill();
    }
    
    if (attackEffect === 'swing') {
        // Draw Zoink with stretched antler wrapping around Zip
        const zoinkX = battlePlayer.x + 60;
        const zoinkY = battlePlayer.y + 20;
        
        // Zoink body
        bossCtx.fillStyle = '#FFD700';
        bossCtx.beginPath();
        bossCtx.arc(zoinkX, zoinkY, 25, 0, Math.PI * 2);
        bossCtx.fill();
        
        // Pink snout
        bossCtx.fillStyle = '#FFB6C1';
        bossCtx.beginPath();
        bossCtx.ellipse(zoinkX, zoinkY + 8, 10, 6, 0, 0, Math.PI * 2);
        bossCtx.fill();
        
        // Stretched antler going to Zip
        bossCtx.strokeStyle = '#8B4513';
        bossCtx.lineWidth = 6;
        bossCtx.beginPath();
        bossCtx.moveTo(zoinkX + 15, zoinkY - 15);
        
        // Curve to Zip
        const zipCenterX = boss.x + boss.width / 2;
        const zipCenterY = boss.y + boss.height / 2;
        bossCtx.quadraticCurveTo(
            (zoinkX + zipCenterX) / 2, 
            zoinkY - 100,
            zipCenterX, 
            zipCenterY
        );
        bossCtx.stroke();
        
        // Wrap around Zip (circle)
        bossCtx.beginPath();
        bossCtx.arc(zipCenterX, zipCenterY, boss.width / 2 + 10, 0, Math.PI * 1.5);
        bossCtx.stroke();
    }
}

function updateBoss(groundY) {
    // Stop all boss actions if player is dead
    if (battlePlayer.health <= 0) {
        boss.state = 'idle';
        dangerZone = null;
        return;
    }
    
    boss.attackCooldown--;
    
    if (boss.attackCooldown <= 0) {
        // Choose attack
        if (Math.random() < 0.5) {
            // Delayed ground punch - hits where player was 3 seconds ago
            boss.state = 'punching';
            const targetPos = boss.lastPlayerPositions[0] || { x: battlePlayer.x, y: groundY };
            boss.targetX = targetPos.x;
            boss.targetY = groundY - 50;
            boss.attackCooldown = 120;
            bossVoiceLine = '';
            voiceLineTimer = 60;
        } else {
            // Flying pounce attack
            boss.state = 'flying';
            boss.flyTimer = 60;
            boss.targetX = battlePlayer.x;
            boss.targetY = groundY - boss.height;
            dangerZone = { x: battlePlayer.x + battlePlayer.width/2, y: groundY - 40 };
            boss.attackCooldown = 180;
            bossVoiceLine = '';
            voiceLineTimer = 90;
        }
    }
    
    // Boss state machine
    switch (boss.state) {
        case 'punching':
            // Move towards target position from 3 seconds ago
            boss.x += (boss.targetX - boss.x) * 0.1;
            if (Math.abs(boss.x - boss.targetX) < 50) {
                // Check if player is hit - 30 damage (only if player alive)
                if (Math.abs(battlePlayer.x - boss.targetX) < 80 && battlePlayer.health > 0) {
                    battlePlayer.health -= 30;
                }
                boss.state = 'idle';
            }
            break;
            
        case 'flying':
            // Fly up
            boss.y -= 10;
            boss.flyTimer--;
            if (boss.flyTimer <= 0) {
                boss.state = 'landing';
            }
            break;
            
        case 'landing':
            // Slam down at danger zone
            boss.x = dangerZone.x - boss.width / 2;
            boss.y += 25;
            if (boss.y >= groundY - boss.height) {
                boss.y = groundY - boss.height;
                // Check if player is in danger zone - 30 damage (only if player alive)
                const dist = Math.hypot(battlePlayer.x + battlePlayer.width/2 - dangerZone.x, 
                                       battlePlayer.y + battlePlayer.height/2 - dangerZone.y);
                if (dist < 100 && battlePlayer.health > 0) {
                    battlePlayer.health -= 30;
                }
                dangerZone = null;
                boss.state = 'idle';
            }
            break;
            
        default:
            // Idle - slowly follow player
            if (boss.x < battlePlayer.x - 100) boss.x += 2;
            if (boss.x > battlePlayer.x + 100) boss.x -= 2;
            boss.y = groundY - boss.height;
    }
}

function drawBoss() {
    // Zip - black scruffy ball with white eyes like sketch
    const cx = boss.x + boss.width/2;
    const cy = boss.y + boss.height/2;
    const radius = boss.width/2;
    
    bossCtx.save();
    
    // Draw messy scruffy spikes around body (like sketch scribbles)
    bossCtx.fillStyle = '#1a1a1a';
    bossCtx.strokeStyle = '#1a1a1a';
    bossCtx.lineWidth = 4;
    
    // Irregular jagged spikes all around
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const baseX = cx + Math.cos(angle) * (radius - 5);
        const baseY = cy + Math.sin(angle) * (radius - 5);
        const spikeLen = 15 + Math.sin(i * 1.3) * 10;
        const tipX = cx + Math.cos(angle) * (radius + spikeLen);
        const tipY = cy + Math.sin(angle) * (radius + spikeLen);
        
        bossCtx.beginPath();
        bossCtx.moveTo(baseX, baseY);
        bossCtx.lineTo(tipX, tipY);
        bossCtx.stroke();
        
        // Add some blob shapes for scruffiness
        bossCtx.beginPath();
        bossCtx.arc(tipX, tipY, 8, 0, Math.PI * 2);
        bossCtx.fill();
    }
    
    // Main body circle
    bossCtx.beginPath();
    bossCtx.arc(cx, cy, radius, 0, Math.PI * 2);
    bossCtx.fill();
    
    // Big white eyes
    bossCtx.fillStyle = 'white';
    bossCtx.strokeStyle = '#333';
    bossCtx.lineWidth = 2;
    bossCtx.beginPath();
    bossCtx.arc(boss.x + boss.width * 0.32, boss.y + boss.height * 0.38, 18, 0, Math.PI * 2);
    bossCtx.fill();
    bossCtx.stroke();
    
    bossCtx.beginPath();
    bossCtx.arc(boss.x + boss.width * 0.68, boss.y + boss.height * 0.38, 18, 0, Math.PI * 2);
    bossCtx.fill();
    bossCtx.stroke();
    
    // Pupils (looking at player)
    bossCtx.fillStyle = '#1a1a1a';
    const lookDir = battlePlayer.x < boss.x ? -3 : 3;
    bossCtx.beginPath();
    bossCtx.arc(boss.x + boss.width * 0.32 + lookDir, boss.y + boss.height * 0.38, 7, 0, Math.PI * 2);
    bossCtx.arc(boss.x + boss.width * 0.68 + lookDir, boss.y + boss.height * 0.38, 7, 0, Math.PI * 2);
    bossCtx.fill();
    
    // Angry/evil mouth with sharp teeth (like sketch)
    bossCtx.fillStyle = '#8B0000';
    bossCtx.beginPath();
    bossCtx.moveTo(boss.x + boss.width * 0.3, boss.y + boss.height * 0.65);
    bossCtx.quadraticCurveTo(cx, boss.y + boss.height * 0.9, boss.x + boss.width * 0.7, boss.y + boss.height * 0.65);
    bossCtx.fill();
    
    // Sharp pointy teeth
    bossCtx.fillStyle = 'white';
    for (let i = 0; i < 6; i++) {
        const toothX = boss.x + boss.width * 0.32 + i * (boss.width * 0.36 / 5);
        bossCtx.beginPath();
        bossCtx.moveTo(toothX, boss.y + boss.height * 0.65);
        bossCtx.lineTo(toothX + 5, boss.y + boss.height * 0.78);
        bossCtx.lineTo(toothX + 10, boss.y + boss.height * 0.65);
        bossCtx.fill();
    }
    
    // Angry eyebrows
    bossCtx.strokeStyle = '#1a1a1a';
    bossCtx.lineWidth = 4;
    bossCtx.beginPath();
    bossCtx.moveTo(boss.x + boss.width * 0.2, boss.y + boss.height * 0.25);
    bossCtx.lineTo(boss.x + boss.width * 0.4, boss.y + boss.height * 0.3);
    bossCtx.stroke();
    
    bossCtx.beginPath();
    bossCtx.moveTo(boss.x + boss.width * 0.8, boss.y + boss.height * 0.25);
    bossCtx.lineTo(boss.x + boss.width * 0.6, boss.y + boss.height * 0.3);
    bossCtx.stroke();
    
    bossCtx.restore();
}

function drawBattlePlayer() {
    const hairColor = GameState.playerGender === 'female' ? '#F5DEB3' : '#8B4513';
    const shirtColor = GameState.playerGender === 'female' ? '#FFB6C1' : '#4CAF50';
    const x = battlePlayer.x;
    const y = battlePlayer.y;
    const outlineColor = '#333';
    
    bossCtx.save();
    bossCtx.lineWidth = 2;
    bossCtx.strokeStyle = outlineColor;
    bossCtx.lineCap = 'round';
    bossCtx.lineJoin = 'round';
    
    // Head (circle)
    bossCtx.fillStyle = '#FFE4C4';
    bossCtx.beginPath();
    bossCtx.arc(x + 25, y + 18, 16, 0, Math.PI * 2);
    bossCtx.fill();
    bossCtx.stroke();
    
    // Hair
    bossCtx.fillStyle = hairColor;
    bossCtx.beginPath();
    if (GameState.playerGender === 'female') {
        bossCtx.moveTo(x + 9, y + 18);
        bossCtx.quadraticCurveTo(x + 5, y + 5, x + 25, y + 2);
        bossCtx.quadraticCurveTo(x + 45, y + 5, x + 41, y + 18);
        bossCtx.quadraticCurveTo(x + 45, y + 35, x + 38, y + 40);
        bossCtx.quadraticCurveTo(x + 25, y + 18, x + 12, y + 40);
        bossCtx.quadraticCurveTo(x + 5, y + 35, x + 9, y + 18);
    } else {
        bossCtx.moveTo(x + 10, y + 18);
        bossCtx.quadraticCurveTo(x + 8, y + 8, x + 18, y + 5);
        bossCtx.lineTo(x + 22, y + 8);
        bossCtx.lineTo(x + 25, y + 3);
        bossCtx.lineTo(x + 28, y + 8);
        bossCtx.lineTo(x + 32, y + 5);
        bossCtx.quadraticCurveTo(x + 42, y + 8, x + 40, y + 18);
    }
    bossCtx.fill();
    bossCtx.stroke();
    
    // Eyes
    bossCtx.fillStyle = '#1a1a1a';
    bossCtx.beginPath();
    bossCtx.arc(x + 19, y + 16, 2.5, 0, Math.PI * 2);
    bossCtx.arc(x + 31, y + 16, 2.5, 0, Math.PI * 2);
    bossCtx.fill();
    
    // Mouth
    bossCtx.beginPath();
    bossCtx.arc(x + 25, y + 22, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    bossCtx.stroke();
    
    // Body (shirt)
    bossCtx.fillStyle = shirtColor;
    bossCtx.beginPath();
    bossCtx.roundRect(x + 12, y + 32, 26, 35, 4);
    bossCtx.fill();
    bossCtx.stroke();
    
    // Arms
    bossCtx.strokeStyle = '#FFE4C4';
    bossCtx.lineWidth = 6;
    bossCtx.beginPath();
    bossCtx.moveTo(x + 12, y + 38);
    bossCtx.lineTo(x + 2, y + 55);
    bossCtx.stroke();
    bossCtx.beginPath();
    bossCtx.moveTo(x + 38, y + 38);
    bossCtx.lineTo(x + 48, y + 55);
    bossCtx.stroke();
    
    // Legs
    bossCtx.strokeStyle = '#4a4a4a';
    bossCtx.lineWidth = 8;
    bossCtx.beginPath();
    bossCtx.moveTo(x + 18, y + 67);
    bossCtx.lineTo(x + 15, y + 80);
    bossCtx.stroke();
    bossCtx.beginPath();
    bossCtx.moveTo(x + 32, y + 67);
    bossCtx.lineTo(x + 35, y + 80);
    bossCtx.stroke();
    
    bossCtx.restore();
}

function updateBossUI() {
    // Boss health
    const bossHealthFill = document.querySelector('.boss-health-fill');
    if (bossHealthFill) {
        bossHealthFill.style.width = `${(boss.health / boss.maxHealth) * 100}%`;
    }
    
    // Player health
    const playerHealthFill = document.querySelector('.player-health-bar .health-fill');
    const playerHealthText = document.querySelector('.player-health-bar .health-text');
    if (playerHealthFill && playerHealthText) {
        playerHealthFill.style.width = `${(battlePlayer.health / 100) * 150}px`;
        playerHealthText.textContent = Math.max(0, battlePlayer.health);
    }
}

// ============== DEATH SCREEN ==============

let deathSource = 'platformer'; // Track where player died

function showDeathScreen(source) {
    deathSource = source;
    
    // Stop game loops
    if (gameLoop) cancelAnimationFrame(gameLoop);
    if (bossLoop) cancelAnimationFrame(bossLoop);
    if (level2Loop) cancelAnimationFrame(level2Loop);
    
    // Stop music
    stopMusic();
    
    // Update death message for Level 2 Hang
    const deathTitle = document.querySelector('.death-title');
    const deathMessage = document.querySelector('.death-message');
    
    if (source === 'level2' && playerMovedDuringRed) {
        deathTitle.textContent = 'CAUGHT!';
        deathMessage.textContent = "Don't let the Hang spot you!";
    } else {
        deathTitle.textContent = 'YOU FELL!';
        deathMessage.textContent = "Don't give up! Belly needs you!";
    }
    
    showScreen('death-screen');
}

function revivePlayer() {
    // Reset health
    GameState.health = 100;
    updateHealthUI();
    
    if (deathSource === 'platformer') {
        // Reset player position
        player.x = 100;
        player.y = 300;
        player.velocityX = 0;
        player.velocityY = 0;
        camera.x = 0;
        levelComplete = false;
        
        // Restart platformer
        startPlatformer();
    } else if (deathSource === 'boss') {
        // Reset boss battle
        battlePlayer.health = 100;
        battlePlayer.x = 200;
        boss.health = 100;
        boss.lastPlayerPositions = [];
        
        // Restart boss battle
        startBossBattle();
    } else if (deathSource === 'level2') {
        // Reset Level 2
        level2Player.x = 120;
        level2Player.y = 100;
        level2Player.velocityX = 0;
        level2Player.velocityY = 0;
        playerMovedDuringRed = false;
        hangState = 'green';
        hangTimer = 0;
        
        // Restart Level 2 platformer
        startLevel2Platformer();
    }
}

// ============== UNLOCK SCREEN ==============

function showUnlockScreen() {
    // Stop boss music, play happy music for unlocking pet!
    stopMusic();
    playHomeMusic();
    
    // Check if Zoink already unlocked - skip unlock screen if so
    const alreadyHasZoink = GameState.pets.some(pet => pet.name === 'Zoink');
    
    if (alreadyHasZoink) {
        // Already have Zoink, skip to victory screen
        GameState.level1Completed = true;
        saveProgress();
        showScreen('victory-screen');
        return;
    }
    
    // Show unlock screen for new pet
    showScreen('unlock-screen');
    
    // Add Zoink to pets
    GameState.pets.push({
        name: 'Zoink',
        rarity: 'Common',
        ability: 'Antler Swing'
    });
    
    // Mark level 1 as completed and save progress
    GameState.level1Completed = true;
    saveProgress();
}

document.getElementById('continue-btn').addEventListener('click', () => {
    showScreen('victory-screen');
});

document.getElementById('next-level-btn').addEventListener('click', () => {
    // Go back to level select with music
    playHomeMusic();
    updateLevelSelect();
    showScreen('level-select');
});

// Back to home from victory
document.getElementById('back-to-levels-btn').addEventListener('click', () => {
    updateLevelSelect();
    showScreen('level-select');
});

// Death screen buttons
document.getElementById('revive-btn').addEventListener('click', () => {
    revivePlayer();
});

document.getElementById('quit-btn').addEventListener('click', () => {
    // Reset everything and go to title with music
    GameState.health = 100;
    GameState.currentLevel = 1;
    levelComplete = false;
    stopMusic();
    playHomeMusic();
    showScreen('title-screen');
});

// ============== EVENT LISTENERS ==============

// Start button - check if character already selected
document.getElementById('start-btn').addEventListener('click', () => {
    // Initialize audio on first user interaction
    initAudio();
    
    // Start playing happy home music
    setTimeout(() => playHomeMusic(), 100);
    
    if (GameState.playerGender) {
        // Character already chosen, go directly to level select
        updateLevelSelect();
        showScreen('level-select');
    } else {
        // First time, choose character
        showScreen('character-select');
    }
});

// Character selection - now goes to level select
document.querySelectorAll('.character-option').forEach(option => {
    option.addEventListener('click', () => {
        GameState.playerGender = option.dataset.gender;
        saveProgress();  // Save character choice
        updateLevelSelect();
        showScreen('level-select');
    });
});

// Track which level was selected
let selectedLevel = 1;

// Update level select screen based on progress
function updateLevelSelect() {
    const level2Node = document.querySelector('.level-node[data-level="2"]');
    const level3Node = document.querySelector('.level-node[data-level="3"]');
    
    if (GameState.level1Completed) {
        // Unlock Level 2
        level2Node.classList.remove('locked');
        level2Node.querySelector('.level-number').textContent = '2';
        level2Node.querySelector('.level-name').textContent = 'The Storm';
    } else {
        level2Node.classList.add('locked');
        level2Node.querySelector('.level-number').textContent = '🔒';
        level2Node.querySelector('.level-name').textContent = '???';
    }
    
    if (GameState.level2Completed) {
        // Unlock Level 3
        level3Node.classList.remove('locked');
        level3Node.querySelector('.level-number').textContent = '3';
        level3Node.querySelector('.level-name').textContent = 'The Descent';
    } else {
        level3Node.classList.add('locked');
        level3Node.querySelector('.level-number').textContent = '🔒';
        level3Node.querySelector('.level-name').textContent = '???';
    }
}

// Level select - clicking on a level (use event delegation for dynamic updates)
document.querySelector('.levels-container').addEventListener('click', (e) => {
    const node = e.target.closest('.level-node');
    if (!node || node.classList.contains('locked')) return;
    
    const level = node.dataset.level;
    selectedLevel = parseInt(level);
    
    // Update modal title based on level
    const modalTitle = document.querySelector('#mode-select-modal h3');
    if (level === '1') {
        modalTitle.textContent = 'Level 1: Sky Gardens';
    } else if (level === '2') {
        modalTitle.textContent = 'Level 2: The Storm';
    } else if (level === '3') {
        modalTitle.textContent = 'Level 3: The Descent';
    }
    
    document.getElementById('mode-select-modal').classList.remove('hidden');
});

// Story Mode button
document.getElementById('story-mode-btn').addEventListener('click', () => {
    document.getElementById('mode-select-modal').classList.add('hidden');
    GameState.isReplay = false;
    GameState.health = 100;
    
    if (selectedLevel === 1) {
        startCutscene('opening');
    } else if (selectedLevel === 2) {
        startLevel2(true);
    } else if (selectedLevel === 3) {
        startLevel3(true);
    }
});

// Free Play button
document.getElementById('freeplay-mode-btn').addEventListener('click', () => {
    document.getElementById('mode-select-modal').classList.add('hidden');
    GameState.isReplay = true;
    GameState.health = 100;
    levelComplete = false;
    updateHealthUI();
    
    if (selectedLevel === 1) {
        startPlatformer();
    } else if (selectedLevel === 2) {
        startLevel2(false);
    } else if (selectedLevel === 3) {
        startLevel3(false);
    }
});

// Close modal button
document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('mode-select-modal').classList.add('hidden');
});

// Back to home (title) from level select
document.getElementById('back-to-home').addEventListener('click', () => {
    showScreen('title-screen');
});

// Pets collection button
document.getElementById('pets-btn').addEventListener('click', () => {
    updatePetsCollection();
    document.getElementById('pets-modal').classList.remove('hidden');
});

// Close pets modal
document.getElementById('close-pets-btn').addEventListener('click', () => {
    document.getElementById('pets-modal').classList.add('hidden');
});

// Update pets collection display
function updatePetsCollection() {
    const container = document.getElementById('pets-collection');
    const countEl = document.getElementById('pets-count-num');
    
    container.innerHTML = '';
    
    if (GameState.pets.length === 0) {
        container.innerHTML = '<p class="no-pets-message">No pets unlocked yet. Complete levels to unlock pets!</p>';
        countEl.textContent = '0';
        return;
    }
    
    GameState.pets.forEach(pet => {
        const card = document.createElement('div');
        card.className = 'pet-card';
        
        const iconClass = pet.name.toLowerCase();
        
        card.innerHTML = `
            <div class="pet-card-icon ${iconClass}"></div>
            <p class="pet-card-name">${pet.name}</p>
            <p class="pet-card-rarity ${pet.rarity.toLowerCase()}">${pet.rarity}</p>
            <p class="pet-card-ability">✨ ${pet.ability}</p>
        `;
        
        container.appendChild(card);
    });
    
    countEl.textContent = GameState.pets.length;
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// ============== TOUCH CONTROLS ==============

// Helper function to handle touch buttons
function setupTouchButton(button) {
    const keyCode = button.dataset.key;
    
    // Touch start - simulate key press
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys[keyCode] = true;
        button.classList.add('active');
    }, { passive: false });
    
    // Touch end - simulate key release
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys[keyCode] = false;
        button.classList.remove('active');
    }, { passive: false });
    
    // Touch cancel
    button.addEventListener('touchcancel', (e) => {
        keys[keyCode] = false;
        button.classList.remove('active');
    });
    
    // Also support mouse for testing on desktop
    button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        keys[keyCode] = true;
        button.classList.add('active');
    });
    
    button.addEventListener('mouseup', (e) => {
        keys[keyCode] = false;
        button.classList.remove('active');
    });
    
    button.addEventListener('mouseleave', (e) => {
        keys[keyCode] = false;
        button.classList.remove('active');
    });
}

// Setup all touch buttons when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Setup touch controls for platformer
    document.querySelectorAll('#touch-controls .touch-btn').forEach(setupTouchButton);
    
    // Setup touch controls for boss battle
    document.querySelectorAll('#boss-touch-controls .touch-btn').forEach(setupTouchButton);
    
    // Setup touch abilities in boss battle
    document.querySelectorAll('.touch-ability').forEach(ability => {
        const keyCode = ability.dataset.key;
        
        ability.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys[keyCode] = true;
            ability.classList.add('active');
            // Auto-release after short delay for attacks
            setTimeout(() => {
                keys[keyCode] = false;
                ability.classList.remove('active');
            }, 100);
        }, { passive: false });
        
        ability.addEventListener('click', (e) => {
            keys[keyCode] = true;
            ability.classList.add('active');
            setTimeout(() => {
                keys[keyCode] = false;
                ability.classList.remove('active');
            }, 100);
        });
    });
});

// Prevent default touch behaviors on game screens
document.querySelectorAll('#game-screen, #boss-screen').forEach(screen => {
    screen.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
});

// Window resize
window.addEventListener('resize', () => {
    if (platformerCanvas) {
        platformerCanvas.width = window.innerWidth;
        platformerCanvas.height = window.innerHeight;
    }
    if (bossCanvas) {
        bossCanvas.width = window.innerWidth;
        bossCanvas.height = window.innerHeight;
    }
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes slideRight {
        to { transform: translateX(200px); opacity: 0; }
    }
    @keyframes flash {
        0%, 90%, 100% { opacity: 0; }
        92%, 98% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ============== LEVEL 2: THE STORM ==============

// Storm music - dark and ominous
function playStormMusic() {
    if (!audioCtx || currentSong === 'storm') return;
    stopMusic();
    currentSong = 'storm';
    
    const melody = [
        { note: 147, dur: 0.3 },   // D3
        { note: 165, dur: 0.2 },   // E3
        { note: 147, dur: 0.3 },   // D3
        { note: 131, dur: 0.4 },   // C3
        { note: 147, dur: 0.2 },   // D3
        { note: 0, dur: 0.3 },     // Rest
        { note: 175, dur: 0.3 },   // F3
        { note: 165, dur: 0.2 },   // E3
        { note: 147, dur: 0.4 },   // D3
        { note: 131, dur: 0.3 },   // C3
        { note: 0, dur: 0.2 },     // Rest
    ];
    
    let noteIndex = 0;
    
    musicInterval = setInterval(() => {
        if (!audioCtx || currentSong !== 'storm') return;
        
        const note = melody[noteIndex];
        if (note.note > 0) {
            playMusicNote(note.note, 'sawtooth', note.dur, 0.06);
            // Thunder rumble
            if (Math.random() < 0.2) {
                playMusicNote(50 + Math.random() * 30, 'sawtooth', 0.5, 0.03);
            }
        }
        noteIndex = (noteIndex + 1) % melody.length;
    }, 400);
}

// Level 2 variables
let level2Canvas, level2Ctx;
let level2Loop;
let level2Platforms = [];
let level2Player = {
    x: 100,
    y: 100,
    width: 50,
    height: 70,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    facingRight: true
};
let level2ZoinkCompanion = { x: 60, y: 100, width: 40, height: 40 };
let level2Keys = {};
let keyCollected = false;
let zipCageX = 80;
let zipCageY = 150;
let keyX = 0;
let keyY = 0;
let hangState = 'green'; // 'green' or 'red'
let hangTimer = 0;
let hangX = 0;
let hangY = 0;
let playerMovedDuringRed = false;
let lastPlayerX = 0;
let lightningClouds = [];
let lightningTimers = [];

// Start Level 2 platformer
function startLevel2Platformer() {
    showScreen('game-screen');
    level2Canvas = document.getElementById('game-canvas');
    level2Ctx = level2Canvas.getContext('2d');
    
    // IMPORTANT: Set platformerCtx to level2Ctx so shared drawing functions work
    platformerCanvas = level2Canvas;
    platformerCtx = level2Ctx;
    
    // Set canvas size
    level2Canvas.width = window.innerWidth;
    level2Canvas.height = window.innerHeight;
    
    // Reset player position for Level 2 - spawn directly ON the first platform
    level2Player.x = 120;
    level2Player.y = 110;  // 180 (platform y) - 70 (player height) = 110
    level2Player.velocityX = 0;
    level2Player.velocityY = 0;
    level2Player.onGround = true;  // Start on ground
    
    // Also set the regular player for drawing functions
    player.x = level2Player.x;
    player.y = level2Player.y;
    player.facingRight = true;
    
    // Reset state
    keyCollected = false;
    GameState.hasKey = false;
    playerMovedDuringRed = false;
    hangState = 'green';
    hangTimer = 0;
    
    // Play storm music
    stopMusic();
    playStormMusic();
    
    // Build level 2 layout (vertical level - fixed camera)
    buildLevel2();
    
    // Start game loop
    if (level2Loop) cancelAnimationFrame(level2Loop);
    lastFrameTime = 0;  // Reset frame time tracking
    level2Loop = requestAnimationFrame(updateLevel2Platformer);
}

function buildLevel2() {
    level2Platforms = [];
    lightningClouds = [];
    lightningTimers = [];
    
    const canvasW = level2Canvas.width;
    const canvasH = level2Canvas.height;
    
    // Starting platform - player spawns here
    level2Platforms.push({ x: 80, y: 180, width: 180, height: 30, type: 'cloud' });
    
    // 3 clouds going down and right
    level2Platforms.push({ x: 280, y: 240, width: 150, height: 30, type: 'cloud' });
    level2Platforms.push({ x: 450, y: 300, width: 140, height: 30, type: 'cloud' });
    level2Platforms.push({ x: 600, y: 360, width: 130, height: 30, type: 'cloud' });
    
    // Rock platforms (middle section)
    level2Platforms.push({ x: 720, y: 360, width: 100, height: 30, type: 'rock' });
    level2Platforms.push({ x: 840, y: 360, width: 100, height: 30, type: 'rock' });
    
    // Lightning cloud hazard
    lightningClouds.push({ x: 770, y: 280, width: 100, height: 40 });
    lightningTimers.push(0);
    
    // Stone stairs going DOWN
    level2Platforms.push({ x: 900, y: 420, width: 90, height: 30, type: 'stone' });
    level2Platforms.push({ x: 820, y: 480, width: 90, height: 30, type: 'stone' });
    level2Platforms.push({ x: 740, y: 540, width: 90, height: 30, type: 'stone' });
    level2Platforms.push({ x: 660, y: 600, width: 90, height: 30, type: 'stone' });
    
    // Bottom section - where the key is
    level2Platforms.push({ x: 480, y: 660, width: 250, height: 35, type: 'stone' });
    
    // Key position
    keyX = 550;
    keyY = 620;
    
    // Hang position (guards the key)
    hangX = 650;
    hangY = 610;
    
    // Zip cage position (left side, visible from start)
    zipCageX = 50;
    zipCageY = 250;
    
    // Platforms for returning to cage
    level2Platforms.push({ x: 30, y: 350, width: 120, height: 30, type: 'rock' });
    level2Platforms.push({ x: 150, y: 300, width: 100, height: 30, type: 'rock' });
    level2Platforms.push({ x: 30, y: 250, width: 100, height: 30, type: 'rock' });
}

function updateLevel2Platformer(currentTime) {
    if (GameState.currentScreen !== 'game-screen') return;
    
    // Delta time for consistent speed
    if (!lastFrameTime) lastFrameTime = currentTime;
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    const speedMultiplier = Math.min(deltaTime / FRAME_TIME, 2);
    
    // Clear canvas
    level2Ctx.clearRect(0, 0, level2Canvas.width, level2Canvas.height);
    
    // Draw storm background
    drawStormBackground();
    
    // Update Hang red/green state
    hangTimer++;
    if (hangTimer >= 150) { // Switch every 2.5 seconds at 60fps
        hangTimer = 0;
        if (hangState === 'green') {
            hangState = 'red';
            lastPlayerX = level2Player.x;
        } else {
            hangState = 'green';
            playerMovedDuringRed = false;
        }
    }
    
    // Check if player moved during red light
    if (hangState === 'red' && Math.abs(level2Player.x - lastPlayerX) > 5) {
        playerMovedDuringRed = true;
    }
    
    // Death if caught moving during red
    if (hangState === 'red' && playerMovedDuringRed && isNearHang()) {
        showDeathScreen('level2');
        return;
    }
    
    // Player physics
    level2Player.velocityY += 0.6;
    
    const moveSpeed = 4 * speedMultiplier;
    
    if (keys['ArrowLeft'] || keys['KeyA']) {
        level2Player.velocityX = -moveSpeed;
        level2Player.facingRight = false;
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        level2Player.velocityX = moveSpeed;
        level2Player.facingRight = true;
    } else {
        level2Player.velocityX *= 0.8;
    }
    
    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && level2Player.onGround) {
        level2Player.velocityY = -13;
        level2Player.onGround = false;
    }
    
    level2Player.x += level2Player.velocityX;
    level2Player.y += level2Player.velocityY;
    
    // Bounds
    if (level2Player.x < 0) level2Player.x = 0;
    if (level2Player.x > level2Canvas.width - level2Player.width) {
        level2Player.x = level2Canvas.width - level2Player.width;
    }
    
    // Platform collision - improved detection
    level2Player.onGround = false;
    level2Platforms.forEach(p => {
        // Check horizontal overlap (player center must be over platform)
        const playerCenterX = level2Player.x + level2Player.width / 2;
        const horizontalOverlap = playerCenterX > p.x && playerCenterX < p.x + p.width;
        
        // Check if landing on top of platform
        const playerBottom = level2Player.y + level2Player.height;
        const prevBottom = playerBottom - level2Player.velocityY;
        
        // Landing detection: player is falling and will pass through platform top
        const fallingOnto = level2Player.velocityY >= 0 && 
                           prevBottom <= p.y + 5 && 
                           playerBottom >= p.y - 5;
        
        // Already standing on platform
        const standingOn = playerBottom >= p.y - 2 && playerBottom <= p.y + 10;
        
        if (horizontalOverlap && (fallingOnto || standingOn)) {
            level2Player.y = p.y - level2Player.height;
            level2Player.velocityY = 0;
            level2Player.onGround = true;
        }
    });
    
    // Fall death
    if (level2Player.y > level2Canvas.height + 50) {
        GameState.health -= 25;
        if (GameState.health <= 0) {
            showDeathScreen('level2');
            return;
        }
        // Respawn on first platform
        level2Player.x = 120;
        level2Player.y = 110;  // On the platform
        level2Player.velocityX = 0;
        level2Player.velocityY = 0;
        level2Player.onGround = true;
    }
    
    // Lightning hazard check
    lightningClouds.forEach((cloud, i) => {
        lightningTimers[i]++;
        if (lightningTimers[i] >= 300) { // Every 5 seconds
            lightningTimers[i] = 0;
        }
        // Lightning strike zone
        if (lightningTimers[i] >= 280 && lightningTimers[i] <= 300) {
            if (level2Player.x + level2Player.width > cloud.x &&
                level2Player.x < cloud.x + cloud.width &&
                level2Player.y > cloud.y) {
                GameState.health -= 20;
                if (GameState.health <= 0) {
                    showDeathScreen('level2');
                    return;
                }
            }
        }
    });
    
    // Key collection
    if (!keyCollected && 
        level2Player.x + level2Player.width > keyX &&
        level2Player.x < keyX + 30 &&
        level2Player.y + level2Player.height > keyY &&
        level2Player.y < keyY + 30) {
        keyCollected = true;
        GameState.hasKey = true;
    }
    
    // Free Zip from cage
    if (keyCollected &&
        level2Player.x < zipCageX + 80 &&
        level2Player.x + level2Player.width > zipCageX &&
        level2Player.y + level2Player.height > zipCageY &&
        level2Player.y < zipCageY + 80) {
        // Level complete!
        GameState.zipFreed = true;
        GameState.level2Completed = true;
        saveProgress();
        stopMusic();
        if (GameState.isReplay) {
            showLevel2Victory();
        } else {
            startCutscene('level2Complete');
        }
        return;
    }
    
    // Draw platforms
    level2Platforms.forEach(p => {
        if (p.type === 'cloud') {
            drawStormCloud(p.x, p.y, p.width, p.height);
        } else if (p.type === 'rock') {
            drawRockPlatform(p.x, p.y, p.width, p.height);
        } else if (p.type === 'stone') {
            drawStonePlatform(p.x, p.y, p.width, p.height);
        }
    });
    
    // Draw lightning clouds
    lightningClouds.forEach((cloud, i) => {
        drawLightningCloud(cloud.x, cloud.y, cloud.width, cloud.height, lightningTimers[i]);
    });
    
    // Draw Zip cage
    drawZipCage(zipCageX, zipCageY, !keyCollected);
    
    // Draw key (if not collected)
    if (!keyCollected) {
        drawKey(keyX, keyY);
    }
    
    // Draw Hang
    drawHang(hangX, hangY, hangState);
    
    // Sync player object for drawing functions
    player.x = level2Player.x;
    player.y = level2Player.y;
    player.facingRight = level2Player.facingRight;
    
    // Draw Zoink companion
    level2ZoinkCompanion.x = level2Player.x - 40;
    level2ZoinkCompanion.y = level2Player.y + 20;
    drawZoink(level2ZoinkCompanion.x, level2ZoinkCompanion.y, 40);
    
    // Draw player
    drawLevel2Player(level2Player.x, level2Player.y);
    
    // Draw UI
    drawLevel2UI();
    
    level2Loop = requestAnimationFrame(updateLevel2Platformer);
}

function isNearHang() {
    const dist = Math.hypot(level2Player.x - hangX, level2Player.y - hangY);
    return dist < 200;
}

function drawStormBackground() {
    // Dark stormy sky gradient
    const gradient = level2Ctx.createLinearGradient(0, 0, 0, level2Canvas.height);
    gradient.addColorStop(0, '#2C3E50');
    gradient.addColorStop(0.5, '#4A5568');
    gradient.addColorStop(1, '#1A202C');
    level2Ctx.fillStyle = gradient;
    level2Ctx.fillRect(0, 0, level2Canvas.width, level2Canvas.height);
    
    // Rain drops
    level2Ctx.strokeStyle = 'rgba(200, 220, 255, 0.4)';
    level2Ctx.lineWidth = 1;
    for (let i = 0; i < 100; i++) {
        const x = (i * 37 + Date.now() * 0.1) % level2Canvas.width;
        const y = (i * 53 + Date.now() * 0.3) % level2Canvas.height;
        level2Ctx.beginPath();
        level2Ctx.moveTo(x, y);
        level2Ctx.lineTo(x - 2, y + 15);
        level2Ctx.stroke();
    }
    
    // Dark clouds in background
    level2Ctx.fillStyle = 'rgba(50, 50, 70, 0.5)';
    for (let i = 0; i < 5; i++) {
        const x = (i * 250) % level2Canvas.width;
        const y = 30 + (i % 3) * 40;
        drawBackgroundCloud(x, y, 120, 0.5);
    }
}

function drawStormCloud(x, y, width, height) {
    // Dark storm cloud platform
    level2Ctx.fillStyle = '#5A6C7D';
    level2Ctx.beginPath();
    const bumps = Math.floor(width / 30);
    for (let i = 0; i <= bumps; i++) {
        const bx = x + (i * width / bumps);
        const by = y - 8 + Math.sin(i * 0.8) * 5;
        const radius = 18 + (i % 3) * 5;
        level2Ctx.arc(bx, by, radius, 0, Math.PI * 2);
    }
    level2Ctx.fill();
    
    // Darker outline
    level2Ctx.strokeStyle = '#3D4852';
    level2Ctx.lineWidth = 2;
    level2Ctx.stroke();
}

function drawRockPlatform(x, y, width, height) {
    // Grey rock platform
    level2Ctx.fillStyle = '#6B7280';
    level2Ctx.fillRect(x, y, width, height);
    
    // Rock texture
    level2Ctx.fillStyle = '#4B5563';
    for (let i = 0; i < width; i += 20) {
        level2Ctx.fillRect(x + i + 5, y + 5, 10, 10);
    }
    
    level2Ctx.strokeStyle = '#374151';
    level2Ctx.lineWidth = 2;
    level2Ctx.strokeRect(x, y, width, height);
}

function drawStonePlatform(x, y, width, height) {
    // Stone stair platform
    level2Ctx.fillStyle = '#9CA3AF';
    level2Ctx.fillRect(x, y, width, height);
    
    level2Ctx.strokeStyle = '#6B7280';
    level2Ctx.lineWidth = 2;
    level2Ctx.strokeRect(x, y, width, height);
    
    // Stone lines
    level2Ctx.strokeStyle = '#D1D5DB';
    level2Ctx.beginPath();
    level2Ctx.moveTo(x + width/3, y);
    level2Ctx.lineTo(x + width/3, y + height);
    level2Ctx.moveTo(x + 2*width/3, y);
    level2Ctx.lineTo(x + 2*width/3, y + height);
    level2Ctx.stroke();
}

function drawLightningCloud(x, y, width, height, timer) {
    // Grey lightning cloud
    level2Ctx.fillStyle = '#374151';
    level2Ctx.beginPath();
    level2Ctx.arc(x + width/4, y, 25, 0, Math.PI * 2);
    level2Ctx.arc(x + width/2, y - 10, 30, 0, Math.PI * 2);
    level2Ctx.arc(x + 3*width/4, y, 25, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Lightning warning (flashing before strike)
    if (timer >= 250) {
        level2Ctx.fillStyle = `rgba(255, 255, 0, ${(timer - 250) / 50})`;
        level2Ctx.beginPath();
        level2Ctx.arc(x + width/2, y + 10, 15, 0, Math.PI * 2);
        level2Ctx.fill();
    }
    
    // Lightning strike
    if (timer >= 280 && timer <= 300) {
        level2Ctx.strokeStyle = '#FBBF24';
        level2Ctx.lineWidth = 4;
        level2Ctx.beginPath();
        level2Ctx.moveTo(x + width/2, y + 20);
        level2Ctx.lineTo(x + width/2 - 10, y + 100);
        level2Ctx.lineTo(x + width/2 + 5, y + 100);
        level2Ctx.lineTo(x + width/2 - 15, y + 200);
        level2Ctx.stroke();
        
        // Glow
        level2Ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
        level2Ctx.lineWidth = 10;
        level2Ctx.stroke();
    }
}

function drawZipCage(x, y, locked) {
    // Cage bars
    level2Ctx.strokeStyle = '#6B7280';
    level2Ctx.lineWidth = 4;
    
    // Cage frame
    level2Ctx.strokeRect(x, y, 80, 80);
    
    // Vertical bars
    for (let i = 1; i < 4; i++) {
        level2Ctx.beginPath();
        level2Ctx.moveTo(x + i * 20, y);
        level2Ctx.lineTo(x + i * 20, y + 80);
        level2Ctx.stroke();
    }
    
    // Horizontal bars
    level2Ctx.beginPath();
    level2Ctx.moveTo(x, y + 40);
    level2Ctx.lineTo(x + 80, y + 40);
    level2Ctx.stroke();
    
    // Draw Zip inside cage
    drawZip(x + 25, y + 25, 30, true); // sad Zip
    
    // Lock indicator
    if (locked) {
        level2Ctx.fillStyle = '#B45309';
        level2Ctx.fillRect(x + 35, y + 75, 20, 15);
        level2Ctx.fillStyle = '#F59E0B';
        level2Ctx.beginPath();
        level2Ctx.arc(x + 45, y + 75, 8, Math.PI, 0);
        level2Ctx.stroke();
    }
}

function drawKey(x, y) {
    // Golden key
    level2Ctx.fillStyle = '#F59E0B';
    
    // Key head (circle)
    level2Ctx.beginPath();
    level2Ctx.arc(x + 10, y + 10, 10, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Key hole
    level2Ctx.fillStyle = '#B45309';
    level2Ctx.beginPath();
    level2Ctx.arc(x + 10, y + 10, 4, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Key shaft
    level2Ctx.fillStyle = '#F59E0B';
    level2Ctx.fillRect(x + 8, y + 18, 4, 15);
    
    // Key teeth
    level2Ctx.fillRect(x + 12, y + 25, 6, 3);
    level2Ctx.fillRect(x + 12, y + 30, 4, 3);
    
    // Sparkle effect
    level2Ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    level2Ctx.beginPath();
    level2Ctx.arc(x + 5, y + 5, 2, 0, Math.PI * 2);
    level2Ctx.fill();
}

function drawHang(x, y, state) {
    // Hang - red creature, droopy face
    // Body color based on state
    level2Ctx.fillStyle = state === 'green' ? '#10B981' : '#DC2626';
    
    // Body (round, droopy)
    level2Ctx.beginPath();
    level2Ctx.ellipse(x + 25, y + 30, 25, 30, 0, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Droopy face features
    level2Ctx.fillStyle = 'white';
    // Eyes (half-closed, droopy)
    level2Ctx.beginPath();
    level2Ctx.ellipse(x + 15, y + 20, 6, 4, 0, 0, Math.PI * 2);
    level2Ctx.ellipse(x + 35, y + 20, 6, 4, 0, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Pupils
    level2Ctx.fillStyle = 'black';
    level2Ctx.beginPath();
    level2Ctx.arc(x + 15, y + 21, 3, 0, Math.PI * 2);
    level2Ctx.arc(x + 35, y + 21, 3, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Droopy mouth
    level2Ctx.strokeStyle = 'black';
    level2Ctx.lineWidth = 2;
    level2Ctx.beginPath();
    level2Ctx.arc(x + 25, y + 40, 10, 0.2, Math.PI - 0.2);
    level2Ctx.stroke();
    
    // State indicator above head
    level2Ctx.font = 'bold 20px Arial';
    level2Ctx.fillStyle = state === 'green' ? '#10B981' : '#DC2626';
    level2Ctx.fillText(state === 'green' ? 'GO' : 'STOP', x + 5, y - 10);
}

function drawZip(x, y, size, sad = false) {
    // Zip - black scruffy ball
    level2Ctx.fillStyle = '#1F2937';
    level2Ctx.beginPath();
    level2Ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Messy fur spikes
    level2Ctx.strokeStyle = '#374151';
    level2Ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const sx = x + size/2 + Math.cos(angle) * (size/2);
        const sy = y + size/2 + Math.sin(angle) * (size/2);
        const ex = x + size/2 + Math.cos(angle) * (size/2 + 8);
        const ey = y + size/2 + Math.sin(angle) * (size/2 + 8);
        level2Ctx.beginPath();
        level2Ctx.moveTo(sx, sy);
        level2Ctx.lineTo(ex, ey);
        level2Ctx.stroke();
    }
    
    // Eyes
    level2Ctx.fillStyle = 'white';
    level2Ctx.beginPath();
    level2Ctx.arc(x + size/3, y + size/3, 5, 0, Math.PI * 2);
    level2Ctx.arc(x + 2*size/3, y + size/3, 5, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Pupils
    level2Ctx.fillStyle = 'black';
    level2Ctx.beginPath();
    level2Ctx.arc(x + size/3, y + size/3, 2, 0, Math.PI * 2);
    level2Ctx.arc(x + 2*size/3, y + size/3, 2, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Mouth (sad or angry)
    if (sad) {
        level2Ctx.strokeStyle = 'white';
        level2Ctx.lineWidth = 2;
        level2Ctx.beginPath();
        level2Ctx.arc(x + size/2, y + size/2 + 10, 5, Math.PI, 0);
        level2Ctx.stroke();
    }
}

function drawRoxer(x, y, size) {
    // Roxer - light blue body, pink hat with yellow stars, yellow eyes
    
    // Body (round)
    level2Ctx.fillStyle = '#7DD3FC'; // Light blue
    level2Ctx.beginPath();
    level2Ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    level2Ctx.fill();
    
    // Pink hat
    level2Ctx.fillStyle = '#F472B6';
    level2Ctx.beginPath();
    level2Ctx.moveTo(x + size/4, y + size/4);
    level2Ctx.lineTo(x + size/2, y - size/4);
    level2Ctx.lineTo(x + 3*size/4, y + size/4);
    level2Ctx.closePath();
    level2Ctx.fill();
    
    // Yellow stars on hat
    level2Ctx.fillStyle = '#FBBF24';
    level2Ctx.font = '12px Arial';
    level2Ctx.fillText('★', x + size/3, y + size/6);
    level2Ctx.fillText('★', x + size/2, y - size/8);
    
    // Yellow eyes (menacing)
    level2Ctx.fillStyle = '#FBBF24';
    level2Ctx.beginPath();
    level2Ctx.moveTo(x + size/4, y + size/3);
    level2Ctx.lineTo(x + size/3 + 5, y + size/3 - 5);
    level2Ctx.lineTo(x + size/3 + 10, y + size/3);
    level2Ctx.lineTo(x + size/3 + 5, y + size/3 + 5);
    level2Ctx.closePath();
    level2Ctx.fill();
    
    level2Ctx.beginPath();
    level2Ctx.moveTo(x + 2*size/3 - 10, y + size/3);
    level2Ctx.lineTo(x + 2*size/3 - 5, y + size/3 - 5);
    level2Ctx.lineTo(x + 2*size/3, y + size/3);
    level2Ctx.lineTo(x + 2*size/3 - 5, y + size/3 + 5);
    level2Ctx.closePath();
    level2Ctx.fill();
    
    // Sharp teeth grin
    level2Ctx.fillStyle = 'white';
    level2Ctx.beginPath();
    level2Ctx.moveTo(x + size/3, y + 2*size/3);
    level2Ctx.lineTo(x + size/3 + 5, y + 2*size/3 + 8);
    level2Ctx.lineTo(x + size/2 - 5, y + 2*size/3);
    level2Ctx.lineTo(x + size/2, y + 2*size/3 + 8);
    level2Ctx.lineTo(x + size/2 + 5, y + 2*size/3);
    level2Ctx.lineTo(x + 2*size/3 - 5, y + 2*size/3 + 8);
    level2Ctx.lineTo(x + 2*size/3, y + 2*size/3);
    level2Ctx.closePath();
    level2Ctx.fill();
}

function drawLevel2Player(x, y) {
    // Same as regular player drawing
    drawPlayer(x, y);
}

function drawLevel2UI() {
    // Health bar
    level2Ctx.fillStyle = 'rgba(0,0,0,0.7)';
    level2Ctx.fillRect(20, 20, 220, 40);
    level2Ctx.fillStyle = '#4ADE80';
    level2Ctx.fillRect(70, 28, (GameState.health / GameState.maxHealth) * 140, 24);
    level2Ctx.strokeStyle = 'white';
    level2Ctx.strokeRect(70, 28, 140, 24);
    level2Ctx.fillStyle = 'white';
    level2Ctx.font = 'bold 16px Nunito';
    level2Ctx.fillText('HP', 30, 46);
    level2Ctx.fillText(GameState.health, 180, 46);
    
    // Key indicator
    if (keyCollected) {
        level2Ctx.fillStyle = '#F59E0B';
        level2Ctx.font = 'bold 20px Nunito';
        level2Ctx.fillText('🔑 KEY', 20, 80);
    }
    
    // Hang warning
    if (hangState === 'red' && isNearHang()) {
        level2Ctx.fillStyle = 'rgba(220, 38, 38, 0.8)';
        level2Ctx.fillRect(level2Canvas.width/2 - 100, 100, 200, 40);
        level2Ctx.fillStyle = 'white';
        level2Ctx.font = 'bold 18px Nunito';
        level2Ctx.fillText('STOP! DONT MOVE!', level2Canvas.width/2 - 80, 128);
    }
}

function showLevel2Victory() {
    stopMusic();
    playHomeMusic();
    GameState.level2Completed = true;
    saveProgress();
    
    // Show victory screen (reuse victory screen with different text)
    document.querySelector('#victory-screen h1').textContent = 'LEVEL 2 COMPLETE!';
    document.querySelector('#victory-screen p').textContent = 'You freed Zip from the cage!';
    document.querySelector('#victory-screen p:nth-of-type(2)').textContent = 'The storm is clearing...';
    showScreen('victory-screen');
}

// Start Level 2 function (called from level select)
function startLevel2(withStory = true) {
    GameState.currentLevel = 2;
    GameState.health = 100;
    GameState.hasKey = false;
    GameState.isReplay = !withStory;
    
    if (withStory) {
        startCutscene('level2Opening');
    } else {
        startLevel2Platformer();
    }
}

// ============== LEVEL 3: THE DESCENT ==============

// Level 3 variables
let level3Canvas, level3Ctx;
let level3Loop;
let level3Platforms = [];
let level3Walls = [];  // Cloud maze walls
let level3Player = {
    x: 100,
    y: 100,
    width: 40,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    facingRight: true
};
let level3ZoinkCompanion = { x: 60, y: 100, width: 35, height: 35 };
let level3Spikes = [];
let zipGoalX = 0;
let zipGoalY = 0;
let level3Complete = false;

// Start Level 3 function (called from level select)
function startLevel3(withStory = true) {
    GameState.currentLevel = 3;
    GameState.health = 100;
    GameState.isReplay = !withStory;
    level3Complete = false;
    
    if (withStory) {
        startCutscene('level3Opening');
    } else {
        startLevel3Platformer();
    }
}

// Start Level 3 platformer
function startLevel3Platformer() {
    showScreen('game-screen');
    level3Canvas = document.getElementById('game-canvas');
    level3Ctx = level3Canvas.getContext('2d');
    
    // Set shared canvas references for drawing functions
    platformerCanvas = level3Canvas;
    platformerCtx = level3Ctx;
    
    // Set canvas size
    level3Canvas.width = window.innerWidth;
    level3Canvas.height = window.innerHeight;
    
    // Reset player position - top left of maze
    level3Player.x = 50;
    level3Player.y = 130;
    level3Player.velocityX = 0;
    level3Player.velocityY = 0;
    level3Player.onGround = false;
    level3Complete = false;
    
    // Sync player object for drawing
    player.x = level3Player.x;
    player.y = level3Player.y;
    player.facingRight = true;
    
    // Build level 3 layout
    buildLevel3();
    
    // Start game loop
    if (level3Loop) cancelAnimationFrame(level3Loop);
    lastFrameTime = 0;
    level3Loop = requestAnimationFrame(updateLevel3Platformer);
}

function buildLevel3() {
    level3Platforms = [];  // Used as floor tiles
    level3Spikes = [];
    level3Walls = [];      // Cloud walls for maze (jumpable!)
    
    const canvasW = level3Canvas.width;
    const canvasH = level3Canvas.height;
    
    // Wall height - short enough to jump over!
    const wallH = 55;
    const wallThickness = 25;
    
    // Create floor (the whole maze floor)
    level3Platforms.push({ x: 0, y: canvasH - 50, width: canvasW, height: 50, type: 'floor' });
    
    // ===== MAZE WALLS (jumpable cloud walls) =====
    // Row 1 (near top)
    level3Walls.push({ x: 150, y: 180, width: 120, height: wallH });
    level3Walls.push({ x: 350, y: 150, width: wallThickness, height: wallH + 30 });
    level3Walls.push({ x: 500, y: 180, width: 150, height: wallH });
    level3Walls.push({ x: 750, y: 160, width: 100, height: wallH });
    
    // Row 2
    level3Walls.push({ x: 80, y: 280, width: 100, height: wallH });
    level3Walls.push({ x: 250, y: 260, width: wallThickness, height: wallH + 20 });
    level3Walls.push({ x: 400, y: 290, width: 130, height: wallH });
    level3Walls.push({ x: 600, y: 270, width: wallThickness, height: wallH });
    level3Walls.push({ x: 700, y: 300, width: 120, height: wallH });
    level3Walls.push({ x: 880, y: 260, width: 80, height: wallH });
    
    // Row 3 (middle)
    level3Walls.push({ x: 50, y: 380, width: 80, height: wallH });
    level3Walls.push({ x: 180, y: 400, width: 100, height: wallH });
    level3Walls.push({ x: 350, y: 380, width: wallThickness, height: wallH + 20 });
    level3Walls.push({ x: 450, y: 410, width: 150, height: wallH });
    level3Walls.push({ x: 680, y: 390, width: 100, height: wallH });
    level3Walls.push({ x: 850, y: 380, width: wallThickness, height: wallH });
    
    // Row 4
    level3Walls.push({ x: 100, y: 500, width: 130, height: wallH });
    level3Walls.push({ x: 300, y: 520, width: wallThickness, height: wallH });
    level3Walls.push({ x: 400, y: 490, width: 80, height: wallH });
    level3Walls.push({ x: 550, y: 520, width: 120, height: wallH });
    level3Walls.push({ x: 750, y: 500, width: wallThickness, height: wallH + 20 });
    level3Walls.push({ x: 850, y: 510, width: 100, height: wallH });
    
    // Row 5 (near bottom)
    level3Walls.push({ x: 50, y: 600, width: 100, height: wallH });
    level3Walls.push({ x: 200, y: 620, width: wallThickness, height: wallH });
    level3Walls.push({ x: 320, y: 600, width: 150, height: wallH });
    level3Walls.push({ x: 550, y: 630, width: 100, height: wallH });
    level3Walls.push({ x: 720, y: 610, width: wallThickness, height: wallH });
    level3Walls.push({ x: 820, y: 620, width: 80, height: wallH });
    
    // ===== SPIKES (only a few) =====
    level3Spikes.push({ x: 480, y: canvasH - 50, width: 50, active: false, timer: 0, interval: 120 });
    level3Spikes.push({ x: 780, y: canvasH - 50, width: 50, active: false, timer: 60, interval: 100 });
    
    // Zip goal position (bottom right)
    zipGoalX = canvasW - 80;
    zipGoalY = canvasH - 120;
}

function updateLevel3Platformer(currentTime) {
    if (GameState.currentScreen !== 'game-screen') return;
    
    // Delta time for consistent speed
    if (!lastFrameTime) lastFrameTime = currentTime;
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    const speedMultiplier = Math.min(deltaTime / FRAME_TIME, 2);
    
    // Clear canvas
    level3Ctx.clearRect(0, 0, level3Canvas.width, level3Canvas.height);
    
    // Draw sunny sky background (like Level 1)
    drawLevel3Background();
    
    // Update spike timers
    level3Spikes.forEach(spike => {
        spike.timer++;
        if (spike.timer >= spike.interval) {
            spike.timer = 0;
            spike.active = !spike.active;
        }
    });
    
    // Player physics - can jump over walls!
    level3Player.velocityY += 0.6;
    
    const moveSpeed = 4 * speedMultiplier;
    
    if (keys['ArrowLeft'] || keys['KeyA']) {
        level3Player.velocityX = -moveSpeed;
        level3Player.facingRight = false;
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        level3Player.velocityX = moveSpeed;
        level3Player.facingRight = true;
    } else {
        level3Player.velocityX *= 0.7;
    }
    
    // Strong jump to clear walls
    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && level3Player.onGround) {
        level3Player.velocityY = -14;
        level3Player.onGround = false;
    }
    
    // Store old position for collision resolution
    const oldX = level3Player.x;
    const oldY = level3Player.y;
    
    // Reset onGround before all collision checks
    level3Player.onGround = false;
    
    // Apply horizontal velocity
    level3Player.x += level3Player.velocityX;
    
    // Check wall collisions (horizontal)
    level3Walls.forEach(wall => {
        if (checkCollision(level3Player, wall)) {
            // Push player out of wall horizontally
            if (level3Player.velocityX > 0) {
                level3Player.x = wall.x - level3Player.width;
            } else if (level3Player.velocityX < 0) {
                level3Player.x = wall.x + wall.width;
            }
            level3Player.velocityX = 0;
        }
    });
    
    // Apply vertical velocity
    level3Player.y += level3Player.velocityY;
    
    // Check wall collisions (vertical) - can land on top of walls!
    level3Walls.forEach(wall => {
        if (checkCollision(level3Player, wall)) {
            // Landing on top of wall
            if (level3Player.velocityY > 0 && oldY + level3Player.height <= wall.y + 10) {
                level3Player.y = wall.y - level3Player.height;
                level3Player.velocityY = 0;
                level3Player.onGround = true;
            } 
            // Hitting bottom of wall (jumping into it from below)
            else if (level3Player.velocityY < 0 && oldY >= wall.y + wall.height - 10) {
                level3Player.y = wall.y + wall.height;
                level3Player.velocityY = 0;
            }
            // Side collision while in air - push out
            else if (!level3Player.onGround) {
                if (oldX + level3Player.width <= wall.x + 5) {
                    level3Player.x = wall.x - level3Player.width;
                } else if (oldX >= wall.x + wall.width - 5) {
                    level3Player.x = wall.x + wall.width;
                }
            }
        }
    });
    
    // Bounds
    if (level3Player.x < 20) level3Player.x = 20;
    if (level3Player.x > level3Canvas.width - level3Player.width - 20) {
        level3Player.x = level3Canvas.width - level3Player.width - 20;
    }
    
    // Floor collision
    level3Platforms.forEach(p => {
        const playerBottom = level3Player.y + level3Player.height;
        
        if (level3Player.x + level3Player.width > p.x && 
            level3Player.x < p.x + p.width &&
            playerBottom >= p.y && playerBottom <= p.y + 20) {
            level3Player.y = p.y - level3Player.height;
            level3Player.velocityY = 0;
            level3Player.onGround = true;
        }
    });
    
    // Spike collision
    level3Spikes.forEach(spike => {
        if (spike.active) {
            const playerCenterX = level3Player.x + level3Player.width / 2;
            const playerBottom = level3Player.y + level3Player.height;
            
            if (playerCenterX > spike.x && playerCenterX < spike.x + spike.width &&
                playerBottom >= spike.y - 25 && playerBottom <= spike.y + 10) {
                GameState.health -= 35;
                level3Player.velocityY = -6;
                level3Player.velocityX = level3Player.facingRight ? -4 : 4;
                
                if (GameState.health <= 0) {
                    showDeathScreen('level3');
                    return;
                }
            }
        }
    });
    
    // Check if reached Zip (goal)
    if (!level3Complete) {
        const distToZip = Math.hypot(level3Player.x - zipGoalX, level3Player.y - zipGoalY);
        if (distToZip < 60) {
            level3Complete = true;
            GameState.level3Completed = true;
            saveProgress();
            
            setTimeout(() => {
                if (GameState.isReplay) {
                    showLevel3Victory();
                } else {
                    startCutscene('level3End');
                }
            }, 500);
            return;
        }
    }
    
    // Draw floor
    drawMazeFloor();
    
    // Draw maze walls (cloud walls)
    level3Walls.forEach(wall => {
        drawCloudWall(wall.x, wall.y, wall.width, wall.height);
    });
    
    // Draw spikes
    level3Spikes.forEach(spike => {
        drawSpike(spike.x, spike.y, spike.width, spike.active, spike.timer, spike.interval);
    });
    
    // Draw Zip at goal (if not reached yet)
    if (!level3Complete) {
        drawZipGoal(zipGoalX, zipGoalY);
    }
    
    // Sync player object for drawing
    player.x = level3Player.x;
    player.y = level3Player.y;
    player.facingRight = level3Player.facingRight;
    
    // Draw Zoink companion
    level3ZoinkCompanion.x = level3Player.x - 35;
    level3ZoinkCompanion.y = level3Player.y + 15;
    drawZoink(level3ZoinkCompanion.x, level3ZoinkCompanion.y, 35);
    
    // Draw player
    drawPlayer(level3Player.x, level3Player.y);
    
    // Draw UI
    drawLevel3UI();
    
    level3Loop = requestAnimationFrame(updateLevel3Platformer);
}

// Collision detection helper
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Draw maze floor
function drawMazeFloor() {
    const floorY = level3Canvas.height - 60;
    
    // Floor gradient
    const gradient = level3Ctx.createLinearGradient(0, floorY, 0, level3Canvas.height);
    gradient.addColorStop(0, '#E8F4F8');
    gradient.addColorStop(1, '#B8D4E3');
    level3Ctx.fillStyle = gradient;
    level3Ctx.fillRect(0, floorY, level3Canvas.width, 60);
    
    // Floor top edge (fluffy cloud edge)
    level3Ctx.fillStyle = '#FFFFFF';
    for (let x = 0; x < level3Canvas.width; x += 40) {
        level3Ctx.beginPath();
        level3Ctx.arc(x + 20, floorY, 25, Math.PI, 0);
        level3Ctx.fill();
    }
}

// Draw cloud wall for maze
function drawCloudWall(x, y, width, height) {
    level3Ctx.fillStyle = '#FFFFFF';
    level3Ctx.shadowColor = 'rgba(0,0,0,0.15)';
    level3Ctx.shadowBlur = 8;
    level3Ctx.shadowOffsetX = 3;
    level3Ctx.shadowOffsetY = 3;
    
    // Main wall body
    level3Ctx.fillRect(x, y, width, height);
    
    // Add fluffy bumps on edges
    const isVertical = height > width;
    
    if (isVertical) {
        // Bumps on left and right sides
        for (let py = y; py < y + height; py += 30) {
            level3Ctx.beginPath();
            level3Ctx.arc(x, py + 15, 12, 0, Math.PI * 2);
            level3Ctx.arc(x + width, py + 15, 12, 0, Math.PI * 2);
            level3Ctx.fill();
        }
    } else {
        // Bumps on top and bottom
        for (let px = x; px < x + width; px += 30) {
            level3Ctx.beginPath();
            level3Ctx.arc(px + 15, y, 12, 0, Math.PI * 2);
            level3Ctx.arc(px + 15, y + height, 12, 0, Math.PI * 2);
            level3Ctx.fill();
        }
    }
    
    level3Ctx.shadowColor = 'transparent';
}

function drawLevel3Background() {
    // Sunny sky gradient (like Level 1)
    const gradient = level3Ctx.createLinearGradient(0, 0, 0, level3Canvas.height);
    gradient.addColorStop(0, '#4A90D9');
    gradient.addColorStop(0.3, '#87CEEB');
    gradient.addColorStop(0.6, '#B8E4F9');
    gradient.addColorStop(0.85, '#FFE4B5');
    gradient.addColorStop(1, '#FFF8DC');
    level3Ctx.fillStyle = gradient;
    level3Ctx.fillRect(0, 0, level3Canvas.width, level3Canvas.height);
    
    // Background clouds
    level3Ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 6; i++) {
        const x = (i * 300 + Date.now() * 0.01) % (level3Canvas.width + 200) - 100;
        const y = 50 + (i % 3) * 60;
        drawBackgroundCloud(x, y, 100, 0.4);
    }
    
    // Floating sparkles
    level3Ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 12; i++) {
        const sparkleX = ((i * 137 + Date.now() * 0.02) % level3Canvas.width);
        const sparkleY = (i * 89 + Math.sin(Date.now() * 0.001 + i) * 20) % (level3Canvas.height * 0.7);
        level3Ctx.beginPath();
        level3Ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        level3Ctx.fill();
    }
}

function drawSpike(x, y, width, active, timer, interval) {
    // Draw warning zone (always visible)
    level3Ctx.fillStyle = 'rgba(220, 60, 60, 0.3)';
    level3Ctx.fillRect(x, y - 5, width, 10);
    
    // Draw crack/hole markers
    level3Ctx.strokeStyle = '#8B4513';
    level3Ctx.lineWidth = 2;
    level3Ctx.beginPath();
    level3Ctx.moveTo(x + 5, y);
    level3Ctx.lineTo(x + 10, y - 3);
    level3Ctx.lineTo(x + 15, y);
    level3Ctx.moveTo(x + width - 15, y);
    level3Ctx.lineTo(x + width - 10, y - 3);
    level3Ctx.lineTo(x + width - 5, y);
    level3Ctx.stroke();
    
    // Warning flash before spike emerges (last 20% of timer before activation)
    const warningThreshold = interval * 0.8;
    if (!active && timer >= warningThreshold) {
        const flashIntensity = (timer - warningThreshold) / (interval - warningThreshold);
        level3Ctx.fillStyle = `rgba(255, 100, 100, ${flashIntensity * 0.5})`;
        level3Ctx.fillRect(x - 5, y - 10, width + 10, 15);
    }
    
    // Draw spikes when active
    if (active) {
        level3Ctx.fillStyle = '#6B7280';
        level3Ctx.strokeStyle = '#374151';
        level3Ctx.lineWidth = 2;
        
        const spikeCount = Math.floor(width / 12);
        for (let i = 0; i < spikeCount; i++) {
            const spikeX = x + 6 + i * 12;
            level3Ctx.beginPath();
            level3Ctx.moveTo(spikeX, y);
            level3Ctx.lineTo(spikeX + 6, y - 25);
            level3Ctx.lineTo(spikeX + 12, y);
            level3Ctx.closePath();
            level3Ctx.fill();
            level3Ctx.stroke();
        }
        
        // Danger glow
        level3Ctx.fillStyle = 'rgba(220, 60, 60, 0.4)';
        level3Ctx.fillRect(x - 3, y - 30, width + 6, 35);
    }
}

function drawZipGoal(x, y) {
    // Draw Zip waiting at goal
    level3Ctx.fillStyle = '#1a1a1a';
    level3Ctx.beginPath();
    level3Ctx.arc(x + 30, y + 30, 30, 0, Math.PI * 2);
    level3Ctx.fill();
    
    // Scruffy spikes
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        level3Ctx.beginPath();
        level3Ctx.moveTo(x + 30 + Math.cos(angle) * 25, y + 30 + Math.sin(angle) * 25);
        level3Ctx.lineTo(x + 30 + Math.cos(angle) * 38, y + 30 + Math.sin(angle) * 38);
        level3Ctx.strokeStyle = '#1a1a1a';
        level3Ctx.lineWidth = 4;
        level3Ctx.stroke();
    }
    
    // Eyes
    level3Ctx.fillStyle = 'white';
    level3Ctx.beginPath();
    level3Ctx.arc(x + 20, y + 22, 8, 0, Math.PI * 2);
    level3Ctx.arc(x + 40, y + 22, 8, 0, Math.PI * 2);
    level3Ctx.fill();
    
    // Pupils
    level3Ctx.fillStyle = '#1a1a1a';
    level3Ctx.beginPath();
    level3Ctx.arc(x + 22, y + 22, 3, 0, Math.PI * 2);
    level3Ctx.arc(x + 42, y + 22, 3, 0, Math.PI * 2);
    level3Ctx.fill();
    
    // Mouth (neutral/waiting)
    level3Ctx.strokeStyle = 'white';
    level3Ctx.lineWidth = 2;
    level3Ctx.beginPath();
    level3Ctx.moveTo(x + 20, y + 40);
    level3Ctx.lineTo(x + 40, y + 40);
    level3Ctx.stroke();
    
    // "?" above head
    level3Ctx.fillStyle = '#FFD700';
    level3Ctx.font = 'bold 24px Fredoka One';
    level3Ctx.fillText('?', x + 22, y - 10);
}

function drawLevel3UI() {
    // Health bar
    level3Ctx.fillStyle = 'rgba(0,0,0,0.7)';
    level3Ctx.fillRect(20, 20, 220, 40);
    level3Ctx.fillStyle = '#4ADE80';
    level3Ctx.fillRect(70, 28, (GameState.health / GameState.maxHealth) * 140, 24);
    level3Ctx.strokeStyle = 'white';
    level3Ctx.strokeRect(70, 28, 140, 24);
    level3Ctx.fillStyle = 'white';
    level3Ctx.font = 'bold 16px Nunito';
    level3Ctx.fillText('HP', 30, 46);
    level3Ctx.fillText(GameState.health, 180, 46);
    
    // Spike warning legend
    level3Ctx.fillStyle = 'rgba(0,0,0,0.7)';
    level3Ctx.fillRect(20, 70, 200, 30);
    level3Ctx.fillStyle = 'rgba(220, 60, 60, 0.5)';
    level3Ctx.fillRect(30, 78, 20, 14);
    level3Ctx.fillStyle = 'white';
    level3Ctx.font = '12px Nunito';
    level3Ctx.fillText('= Spike danger zone!', 55, 90);
}

function showLevel3Victory() {
    stopMusic();
    playHomeMusic();
    GameState.level3Completed = true;
    saveProgress();
    
    // Update victory screen text
    document.querySelector('#victory-screen h1').textContent = 'CHAPTER 1 COMPLETE!';
    document.querySelector('#victory-screen p').textContent = 'You made it through the clouds!';
    const secondP = document.querySelector('#victory-screen p:nth-of-type(2)');
    if (secondP) secondP.textContent = 'The mountains await...';
    showScreen('victory-screen');
}

// Update death screen to handle Level 3
const originalShowDeathScreen = showDeathScreen;
showDeathScreen = function(source) {
    if (source === 'level3') {
        deathSource = 'level3';
        
        if (level3Loop) cancelAnimationFrame(level3Loop);
        stopMusic();
        
        const deathTitle = document.querySelector('.death-title');
        const deathMessage = document.querySelector('.death-message');
        deathTitle.textContent = 'YOU FELL!';
        deathMessage.textContent = "Don't give up! Belly needs you!";
        
        showScreen('death-screen');
    } else {
        originalShowDeathScreen(source);
    }
};

// Update revive to handle Level 3
const originalRevivePlayer = revivePlayer;
revivePlayer = function() {
    if (deathSource === 'level3') {
        GameState.health = 100;
        level3Complete = false;
        startLevel3Platformer();
    } else {
        originalRevivePlayer();
    }
};

console.log('Cosmic Zoo - Finding Belly loaded! 🎮');

