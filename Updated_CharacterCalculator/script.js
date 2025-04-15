function createCharacterSheets() {
    const container = document.getElementById('characterSheets');
    container.innerHTML = '';
    const count = parseInt(document.getElementById('numCharacters').value);
    for (let i = 0; i < count; i++) {
        const sheet = document.createElement('div');
        sheet.className = 'character-sheet';
        sheet.innerHTML = `
            <h3>Character ${i + 1}</h3>
            <label>Name:</label><input type="text"><br>
            <label>Background:</label><input type="text"><br>
            <label>Species:</label><input type="text"><br>
            <label>Class:</label><input type="text"><br>
            <h4>Attributes</h4>
            ${['Strength', 'Dexterity', 'Fortitude', 'Intelligence', 'Wisdom', 'Awareness', 'Covalence', 'Charisma', 'Spirit'].map(attr => `
                <label>${attr}:</label><input type="number" class="attr" data-name="${attr}" value="1"><br>
            `).join('')}
            <label>Gear Weight:</label><input type="number" class="gearWeight" value="0"><br>
            <button onclick="calculateStats(this)">Calculate AP/HP</button>
            <div>AP: <span class="ap">-</span></div>
            <input type="number" class="apInput"><button onclick="adjustValue(this, 'ap', 'add')">+</button><button onclick="adjustValue(this, 'ap', 'subtract')">-</button><button onclick="fillMax(this, 'ap')">Fill</button>
            <div>HP: <span class="hp">-</span></div>
            <input type="number" class="hpInput"><button onclick="adjustValue(this, 'hp', 'add')">+</button><button onclick="adjustValue(this, 'hp', 'subtract')">-</button><button onclick="fillMax(this, 'hp')">Fill</button>
        `;
        container.appendChild(sheet);
    }
}

function calculateStats(button) {
    const sheet = button.closest('.character-sheet');
    const attrs = [...sheet.querySelectorAll('.attr')].reduce((acc, el) => {
        acc[el.dataset.name] = parseInt(el.value);
        return acc;
    }, {});
    const gearWeight = parseFloat(sheet.querySelector('.gearWeight').value);
    const ap = 15 + attrs['Dexterity'] - Math.max(gearWeight - attrs['Strength'], 0);
    const hp = 20 * attrs['Fortitude'] + (attrs['Fortitude'] + attrs['Awareness'] + attrs['Spirit']);
    sheet.querySelector('.ap').innerText = ap;
    sheet.querySelector('.hp').innerText = hp;
    sheet.dataset.maxAp = ap;
    sheet.dataset.maxHp = hp;
}

function adjustValue(button, type, mode) {
    const sheet = button.closest('.character-sheet');
    const input = sheet.querySelector(`.${type}Input`);
    const span = sheet.querySelector(`.${type}`);
    let val = parseInt(span.innerText);
    const change = parseInt(input.value) || 0;
    if (mode === 'add') val += change;
    else val -= change;
    span.innerText = val;
}

function fillMax(button, type) {
    const sheet = button.closest('.character-sheet');
    const max = sheet.dataset[`max${type.charAt(0).toUpperCase() + type.slice(1)}`];
    sheet.querySelector(`.${type}`).innerText = max;
}

function newGame() {
    document.getElementById('characterSheets').innerHTML = '';
}

function newRound() {
    document.querySelectorAll('.character-sheet').forEach(sheet => {
        fillMax({closest: () => sheet}, 'ap');
    });
}
