import { GoogleGenAI } from "@google/genai";
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- DATA --- //

const DECK_NAMES = [
    "The Celestial Path", "The Gilded Serpent", "The Moonlit Garden",
    "The Star-Whisperer's Tarot", "The Obsidian Mirror", "The Whispering Woods",
    "The Sunstone Oracle", "The Midnight Bloom", "The Alchemist's Legacy",
    "The Dreamweaver's Deck", "The Crimson Rosette", "The Azure Key",
    "The Labyrinth of Light", "The Echoing Soul", "The Verdant Heart",
    "The Oracle of Dust", "The Mariner's Compass", "The Philosopher's Stone",
    "The Sovereign's Scepter", "The Bard's Tale", "The Fated Wheel",
    "The Mystic's Veil", "The Serpent's Kiss", "The Griffin's Flight",
    "The Astral Gateway", "The Ember-Forge", "The Chronomancer's Codex",
    "The Silent Sage's Deck", "The Abyssal Pearl", "The Celestial Concordance",
    "The Shadow Self (Jungian)"
];

const TAROT_DECK = [
    { name: "The Fool", img: "ar00.jpg" }, { name: "The Magician", img: "ar01.jpg" },
    { name: "The High Priestess", img: "ar02.jpg" }, { name: "The Empress", img: "ar03.jpg" },
    { name: "The Emperor", img: "ar04.jpg" }, { name: "The Hierophant", img: "ar05.jpg" },
    { name: "The Lovers", img: "ar06.jpg" }, { name: "The Chariot", img: "ar07.jpg" },
    { name: "Strength", img: "ar08.jpg" }, { name: "The Hermit", img: "ar09.jpg" },
    { name: "Wheel of Fortune", img: "ar10.jpg" }, { name: "Justice", img: "ar11.jpg" },
    { name: "The Hanged Man", img: "ar12.jpg" }, { name: "Death", img: "ar13.jpg" },
    { name: "Temperance", img: "ar14.jpg" }, { name: "The Devil", img: "ar15.jpg" },
    { name: "The Tower", img: "ar16.jpg" }, { name: "The Star", img: "ar17.jpg" },
    { name: "The Moon", img: "ar18.jpg" }, { name: "The Sun", img: "ar19.jpg" },
    { name: "Judgement", img: "ar20.jpg" }, { name: "The World", img: "ar21.jpg" },
    { name: "Ace of Wands", img: "wa.jpg" }, { name: "Two of Wands", img: "w2.jpg" },
    { name: "Three of Wands", img: "w3.jpg" }, { name: "Four of Wands", img: "w4.jpg" },
    { name: "Five of Wands", img: "w5.jpg" }, { name: "Six of Wands", img: "w6.jpg" },
    { name: "Seven of Wands", img: "w7.jpg" }, { name: "Eight of Wands", img: "w8.jpg" },
    { name: "Nine of Wands", img: "w9.jpg" }, { name: "Ten of Wands", img: "w10.jpg" },
    { name: "Page of Wands", img: "wp.jpg" }, { name: "Knight of Wands", img: "wkn.jpg" },
    { name: "Queen of Wands", img: "wq.jpg" }, { name: "King of Wands", img: "wk.jpg" },
    { name: "Ace of Cups", img: "ca.jpg" }, { name: "Two of Cups", img: "c2.jpg" },
    { name: "Three of Cups", img: "c3.jpg" }, { name: "Four of Cups", img: "c4.jpg" },
    { name: "Five of Cups", img: "c5.jpg" }, { name: "Six of Cups", img: "c6.jpg" },
    { name: "Seven of Cups", img: "c7.jpg" }, { name: "Eight of Cups", img: "c8.jpg" },
    { name: "Nine of Cups", img: "c9.jpg" }, { name: "Ten of Cups", img: "c10.jpg" },
    { name: "Page of Cups", img: "cp.jpg" }, { name: "Knight of Cups", img: "ckn.jpg" },
    { name: "Queen of Cups", img: "cq.jpg" }, { name: "King of Cups", img: "ck.jpg" },
    { name: "Ace of Swords", img: "sa.jpg" }, { name: "Two of Swords", img: "s2.jpg" },
    { name: "Three of Swords", img: "s3.jpg" }, { name: "Four of Swords", img: "s4.jpg" },
    { name: "Five of Swords", img: "s5.jpg" }, { name: "Six of Swords", img: "s6.jpg" },
    { name: "Seven of Swords", img: "s7.jpg" }, { name: "Eight of Swords", img: "s8.jpg" },
    { name: "Nine of Swords", img: "s9.jpg" }, { name: "Ten of Swords", img: "s10.jpg" },
    { name: "Page of Swords", img: "sp.jpg" }, { name: "Knight of Swords", img: "skn.jpg" },
    { name: "Queen of Swords", img: "sq.jpg" }, { name: "King of Swords", img: "sk.jpg" },
    { name: "Ace of Pentacles", img: "pa.jpg" }, { name: "Two of Pentacles", img: "p2.jpg" },
    { name: "Three of Pentacles", img: "p3.jpg" }, { name: "Four of Pentacles", img: "p4.jpg" },
    { name: "Five of Pentacles", img: "p5.jpg" }, { name: "Six of Pentacles", img: "p6.jpg" },
    { name: "Seven of Pentacles", img: "p7.jpg" }, { name: "Eight of Pentacles", img: "p8.jpg" },
    { name: "Nine of Pentacles", img: "p9.jpg" }, { name: "Ten of Pentacles", img: "p10.jpg" },
    { name: "Page of Pentacles", img: "pp.jpg" }, { name: "Knight of Pentacles", img: "pkn.jpg" },
    { name: "Queen of Pentacles", img: "pq.jpg" }, { name: "King of Pentacles", img: "pk.jpg" },
];

const CARD_IMAGE_BASE_URL = 'https://www.sacred-texts.com/tarot/pkt/img/';
type TarotCard = typeof TAROT_DECK[0];

type Spread = {
    name: string;
    cardCount: number;
    positions: string[];
    layout?: 'linear' | 'celtic-cross';
};

const SPREADS: Spread[] = [
    {
        name: "Three Card Spread",
        cardCount: 3,
        positions: ["Past", "Present", "Future"],
        layout: 'linear',
    },
    {
        name: "Celtic Cross Spread",
        cardCount: 10,
        positions: [
            "1. The Heart of the Matter", "2. The Obstacle", "3. The Root Cause (Unconscious)",
            "4. The Recent Past (Conscious)", "5. The Potential Outcome", "6. The Near Future",
            "7. Your Attitude", "8. External Influences", "9. Hopes and Fears", "10. The Final Outcome",
        ],
        layout: 'celtic-cross',
    },
    {
        name: "Relationship Spread",
        cardCount: 7,
        positions: [
            "You", "Your Partner", "The Foundation", "The Strengths",
            "The Weaknesses", "Your Needs", "The Potential Future",
        ],
        layout: 'linear',
    },
    {
        name: "New Moon Spread",
        cardCount: 5,
        positions: [
            "What to Release", "What to Embrace", "Your Focus",
            "Message from Intuition", "Overall Theme",
        ],
        layout: 'linear',
    },
    {
        name: "Full Moon Spread",
        cardCount: 5,
        positions: [
            "What is Coming to Light", "What to Let Go Of", "How to Find Closure",
            "What to be Grateful For", "Your Next Steps",
        ],
        layout: 'linear',
    },
    {
        name: "Decision Spread (Should I?)",
        cardCount: 4,
        positions: [
            "Pros of Taking Action", "Cons of Taking Action",
            "Pros of Not Taking Action", "Cons of Not Taking Action",
        ],
        layout: 'linear',
    },
];

// --- STATE --- //

let appState: 'setup' | 'drawing' | 'reading' | 'done' = 'setup';
let selectedDeck: string = DECK_NAMES[0];
let selectedSpreadName: string = SPREADS[0].name;
let shuffledDeck: TarotCard[] = [];
let drawnCards: TarotCard[] = [];
let reading = '';
let isLoading = false;
let isJournalOpen = false;
let journalContent = '';
const JOURNAL_KEY = 'celestialTarotJournal';
const root = document.getElementById('root')!;

// --- LOGIC --- //

function getSelectedSpread(): Spread {
    return SPREADS.find(s => s.name === selectedSpreadName) || SPREADS[0];
}

function loadJournal() {
    journalContent = localStorage.getItem(JOURNAL_KEY) || '';
}

function saveJournal(content: string) {
    journalContent = content;
    localStorage.setItem(JOURNAL_KEY, content);
}

function saveReadingToJournal() {
    const spread = getSelectedSpread();
    const timestamp = new Date().toLocaleString();
    const readingTitle = `--- Reading from ${timestamp} (Deck: ${selectedDeck}, Spread: ${spread.name}) ---`;
    const cardsDrawn = `Cards: ${drawnCards.map(c => c.name).join(', ')}`;
    const newEntry = `${readingTitle}\n${cardsDrawn}\n\n${reading}\n\n`;

    const updatedJournal = journalContent ? `${journalContent}\n\n${newEntry}` : newEntry;
    saveJournal(updatedJournal);
    
    const saveBtn = document.getElementById('save-to-journal-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Saved!';
        (saveBtn as HTMLButtonElement).disabled = true;
        setTimeout(() => {
            saveBtn.textContent = 'Save to Journal';
            (saveBtn as HTMLButtonElement).disabled = false;
        }, 2000);
    }
}

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

async function fetchReading() {
    const spread = getSelectedSpread();
    if (drawnCards.length !== spread.cardCount) return;
    isLoading = true;
    reading = '';
    render();

    let prompt: string;
    const jungianDeckName = "The Shadow Self (Jungian)";
    
    const cardList = drawnCards.map((card, index) => {
        return `*   **${spread.positions[index]}:** ${card.name}`;
    }).join('\n');

    if (selectedDeck === jungianDeckName) {
        prompt = `You are a Jungian psychoanalyst interpreting a tarot spread. Your tone is insightful, analytical, and focused on personal individuation. You are helping the querent understand their shadow self, archetypes at play, and the path toward integrating their unconscious. Do not use mystical language. Refer to the cards as symbolic representations of psychological states. Provide a reading for the '${spread.name}'. Structure your response using markdown.

Here are the cards drawn:
${cardList}

First, provide a detailed psychoanalytical interpretation for each card in its position, connecting it to Jungian concepts. Then, provide a 'Summary & Path Forward' section that synthesizes the meaning of all the cards together and offers concrete steps for self-reflection and shadow integration.`;
    } else {
        prompt = `You are a mystical and insightful tarot reader named 'Celestia'. You are reading for a querent who is seeking guidance. Provide a tarot reading for the '${spread.name}'. Be gentle, wise, and provide actionable advice. Do not start with a greeting, just begin the reading. Structure your response using markdown.

Here are the cards drawn:
${cardList}

First, provide a detailed interpretation for each card in its position. Then, provide a 'Summary & Guidance' section that synthesizes the meaning of all the cards together and offers advice to the querent.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        reading = response.text;
        appState = 'done';
    } catch (error) {
        console.error("Error fetching tarot reading:", error);
        reading = "Apologies, the celestial energies are currently clouded. Please try again later.";
        appState = 'done';
    } finally {
        isLoading = false;
        render();
    }
}

// --- EVENT HANDLERS --- //

function toggleJournal() {
    isJournalOpen = !isJournalOpen;
    if (isJournalOpen) {
        loadJournal();
    }
    render();
}

function handleJournalChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    saveJournal(target.value);
}

function handleStartReading() {
    const deckSelector = document.getElementById('deck-selector') as HTMLSelectElement;
    const spreadSelector = document.getElementById('spread-selector') as HTMLSelectElement;
    if (deckSelector) {
        selectedDeck = deckSelector.value;
    }
    if (spreadSelector) {
        selectedSpreadName = spreadSelector.value;
    }
    appState = 'drawing';
    shuffledDeck = shuffleArray(TAROT_DECK);
    drawnCards = [];
    render();
}

function handleDrawCard(card: TarotCard) {
    const spread = getSelectedSpread();
    if (appState !== 'drawing' || drawnCards.length >= spread.cardCount) return;
    
    const cardIndex = shuffledDeck.findIndex(c => c.name === card.name);
    if (cardIndex > -1) {
        drawnCards.push(card);
        shuffledDeck.splice(cardIndex, 1);
        render();

        if (drawnCards.length === spread.cardCount) {
            appState = 'reading';
            setTimeout(() => {
                const cardsToFlip = root.querySelectorAll('.card');
                cardsToFlip.forEach(c => c.classList.add('flipped'));
                fetchReading();
            }, 500);
        }
    }
}

function handleReset() {
    appState = 'setup';
    selectedDeck = DECK_NAMES[0];
    selectedSpreadName = SPREADS[0].name;
    shuffledDeck = [];
    drawnCards = [];
    reading = '';
    render();
}

// --- RENDERING --- //

function createCardElement(card: TarotCard, isFlipped: boolean, onClick?: () => void) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${isFlipped ? 'flipped' : ''}`;
    cardEl.setAttribute('aria-label', `Tarot card: ${card.name}`);

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';
    const img = document.createElement('img');
    img.src = `${CARD_IMAGE_BASE_URL}${card.img}`;
    img.alt = card.name;
    cardFront.appendChild(img);

    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';

    cardInner.append(cardBack, cardFront);
    cardEl.appendChild(cardInner);

    if (onClick) {
        cardEl.addEventListener('click', onClick);
        cardEl.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && onClick());
        cardEl.setAttribute('role', 'button');
        cardEl.setAttribute('tabindex', '0');
    }

    return cardEl;
}

function render() {
    root.innerHTML = '';

    const journalToggleButton = document.createElement('button');
    journalToggleButton.className = 'journal-toggle-btn';
    journalToggleButton.setAttribute('aria-label', 'Open Journal');
    journalToggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    journalToggleButton.onclick = toggleJournal;
    root.appendChild(journalToggleButton);

    const header = document.createElement('h1');
    header.textContent = 'Celestial Tarot';
    root.appendChild(header);

    if (appState === 'setup') {
        const container = document.createElement('div');
        container.className = 'screen-container';
        container.innerHTML = `<p>Welcome, seeker. The cards hold wisdom and guidance. Select your vessel, focus your intent, and begin your journey into the self.</p>`;
        
        const setupControls = document.createElement('div');
        setupControls.className = 'setup-controls';

        setupControls.innerHTML = `
            <label for="deck-selector">Choose a Deck:</label>
            <select id="deck-selector" aria-label="Select a Tarot Deck">
                ${DECK_NAMES.map(name => `<option value="${name}" ${name === selectedDeck ? 'selected' : ''}>${name}</option>`).join('')}
            </select>
            <label for="spread-selector">Choose a Spread:</label>
            <select id="spread-selector" aria-label="Select a Tarot Spread">
                ${SPREADS.map(s => `<option value="${s.name}" ${s.name === selectedSpreadName ? 'selected' : ''}>${s.name} (${s.cardCount} cards)</option>`).join('')}
            </select>
        `;

        const startButton = document.createElement('button');
        startButton.textContent = 'Begin Your Journey';
        startButton.onclick = handleStartReading;
        container.append(setupControls, startButton);
        root.appendChild(container);
    }

    if (appState === 'drawing') {
        const spread = getSelectedSpread();
        const container = document.createElement('div');
        container.className = 'screen-container';
        
        const prompt = document.createElement('p');
        prompt.textContent = `Focus on your question. Draw ${spread.cardCount} ${spread.cardCount === 1 ? 'card' : 'cards'} for your ${spread.name}.`;
        
        const drawPileContainer = document.createElement('div');
        drawPileContainer.className = 'spread-container';
        
        const cardsToDraw = shuffledDeck.slice(0, 22);
        cardsToDraw.forEach((card) => {
            const cardEl = createCardElement(card, false, () => handleDrawCard(card));
            drawPileContainer.appendChild(cardEl);
        });
        
        container.append(prompt, drawPileContainer);
        root.appendChild(container);
    }
    
    if (appState === 'drawing' || appState === 'reading' || appState === 'done') {
        const spread = getSelectedSpread();
        const drawnContainer = document.createElement('div');
        drawnContainer.className = 'spread-container';
        if (spread.layout === 'celtic-cross') {
             drawnContainer.classList.add('celtic-cross-layout');
        }

        const positions = spread.positions;
        
        for (let i = 0; i < spread.cardCount; i++) {
            const slot = document.createElement('div');
            slot.className = 'card-slot';
             if(spread.layout === 'celtic-cross'){
                slot.classList.add(`celtic-pos-${i + 1}`);
            }

            const positionLabel = document.createElement('span');
            positionLabel.textContent = positions[i];
            
            if(drawnCards[i]) {
                const cardEl = createCardElement(drawnCards[i], appState === 'reading' || appState === 'done');
                slot.append(positionLabel, cardEl);
            } else {
                 const placeholder = document.createElement('div');
                 placeholder.className = 'card-placeholder';
                 slot.append(positionLabel, placeholder);
            }
            drawnContainer.appendChild(slot);
        }
        root.appendChild(drawnContainer);
    }
    
    if (appState === 'reading' || appState === 'done') {
        const readingContainer = document.createElement('div');
        readingContainer.className = 'reading-container';
        if (isLoading) {
            const loader = document.createElement('div');
            loader.className = 'loader';
            readingContainer.style.display = 'flex';
            readingContainer.style.justifyContent = 'center';
            readingContainer.appendChild(loader);
        } else {
            readingContainer.innerHTML = md.render(reading);
        }
        root.appendChild(readingContainer);
    }

    if (appState === 'done') {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'actions-container';

        const saveButton = document.createElement('button');
        saveButton.id = 'save-to-journal-btn';
        saveButton.textContent = 'Save to Journal';
        saveButton.onclick = saveReadingToJournal;

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Start New Reading';
        resetButton.onclick = handleReset;

        actionsContainer.append(saveButton, resetButton);
        root.appendChild(actionsContainer);
    }

    if (isJournalOpen) {
        const overlay = document.createElement('div');
        overlay.className = 'journal-overlay';
        overlay.onclick = (e) => {
            if (e.target === overlay) toggleJournal();
        };

        const modal = document.createElement('div');
        modal.className = 'journal-modal';
        
        modal.innerHTML = `
            <div class="journal-header">
                <h2>Secret Wisdom Journal</h2>
                <button class="close-journal-btn" aria-label="Close Journal">&times;</button>
            </div>
            <textarea id="journal-textarea" placeholder="Record your thoughts, reflections, and secret wisdom here..."></textarea>
        `;
        
        const textArea = modal.querySelector('#journal-textarea') as HTMLTextAreaElement;
        textArea.value = journalContent;
        textArea.addEventListener('input', handleJournalChange);
        textArea.addEventListener('blur', () => saveJournal(textArea.value));


        modal.querySelector('.close-journal-btn')!.addEventListener('click', toggleJournal);
        
        overlay.appendChild(modal);
        root.appendChild(overlay);
        textArea.focus();
    }
}


// --- INITIALIZATION --- //

loadJournal();
render();
