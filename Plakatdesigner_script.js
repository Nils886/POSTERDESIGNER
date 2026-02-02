console.log("JavaScript ist verbunden!");

function ratioChange() {
    const ratioEl = document.getElementById("Plakatgröße");
    const poster = document.getElementById("Plakat");
    if (!ratioEl || !poster) return;
    const ratio = ratioEl.value;
    poster.style.aspectRatio = ratio;
    const header = document.getElementById("Überschrift");
    if (!header) return;
    if (ratio === "9 / 16") header.style.left = "110vh";
    else if (ratio === "3 / 2") header.style.left = "200vh";
    else if (ratio === "3 / 4") header.style.left = "128vh";
    else if (ratio === "1 / 1") header.style.left = "152vh";
    else if (ratio === "2 / 3") header.style.left = "120vh";
}

    const poster = document.getElementById("Plakat");

    // Background color control
    const HF = document.getElementById("HintergrundFarbwahl");
    const GB = document.getElementById("GB");
    const GF1 = document.getElementById("Gradientfarbe1");
    const GF2 = document.getElementById("Gradientfarbe2");

    let currentBgColor = HF && HF.value ? HF.value : "#9DC4F0";

    function updateBackground() {
        if (!poster) return;
        let bgColor = HF && HF.value ? HF.value : "";
        if (GB && GB.checked) {
            const color1 = GF1 && GF1.value ? GF1.value : '#ffffff';
            const color2 = GF2 && GF2.value ? GF2.value : '#ffffff';
            poster.style.background = `linear-gradient(${color1}, ${color2})`;
            bgColor = color1; // Panels orientieren sich an erster Gradientfarbe
        } else {
            poster.style.background = bgColor;
        }
        currentBgColor = bgColor;

        // IDs der Hauptboxen
        ["Einstellungen", "ControlActions", "DynamicPanels", "Überschrift"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.backgroundColor = bgColor;
        });

        // Alle dynamischen Panels (Text, Bild, Logo)
        document.querySelectorAll('.dynamicPanel').forEach(panel => {
            panel.style.backgroundColor = bgColor;
        });
    }

    if (HF) HF.addEventListener('input', updateBackground);
    if (GB) GB.addEventListener('change', updateBackground);
    if (GF1) GF1.addEventListener('input', () => { if (GB && GB.checked) updateBackground(); });
    if (GF2) GF2.addEventListener('input', () => { if (GB && GB.checked) updateBackground(); });
    updateBackground();

    // helper to build repeated lines
    function buildLinesFor(containerId, text, count) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const line = document.createElement('div');
            line.className = 'line';
            line.textContent = text;
            container.appendChild(line);
        }
    }

    function exportPoster() {
        const posterEl = document.getElementById('Plakat');
        if (!posterEl || typeof html2canvas === 'undefined') {
            alert('Poster oder html2canvas nicht gefunden.');
            return;
        }
        html2canvas(posterEl, {useCORS: true, backgroundColor: null, scale: 2}).then(canvas => {
            const link = document.createElement('a');
            link.download = 'plakat.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error(err);
            alert('Export fehlgeschlagen: ' + (err && err.message ? err.message : err));
        });
    }

    let currentZ = 10;
    function bringToFront(id) {
        const el = document.getElementById(id);
        if (!el) return;
        currentZ++;
        el.style.zIndex = currentZ;
    }

    // --- Dynamic panel factory for Text / Image / Logo ---
    let nextBlockId = 1;
    const dynamicState = {};

    function makeNumberSelect(name, idPrefix, max = 30) {
        let html = `<select data-name="${name}" class="numSelect">`;
        for (let i = 1; i <= max; i++) html += `<option value="${i}">${i}</option>`;
        html += `</select>`;
        return html;
    }


    function createTextPanel() {
        const id = `text-${nextBlockId++}`;
        const box = document.createElement('div');
        box.className = 'textBox';
        box.id = id;
        box.style.position = 'absolute';
        box.style.left = '50%';
        box.style.top = '50%';
        box.style.transform = 'translateX(-50%)';
        poster.appendChild(box);

        const panels = document.getElementById('DynamicPanels');
        const panel = document.createElement('div');
        panel.className = 'dynamicPanel';
        panel.dataset.for = id;
        panel.style.border = '1px solid #333';
        panel.style.margin = '6px';
        panel.style.padding = '6px';
        panel.style.height = '108vh';
        panel.innerHTML = `
        <div style="margin-bottom: 6px;position: relative; z-index: 5;">
            <strong style=" font-family: 'obwf'; position: absolute; left: 2px; top:1vh; font-size: 33vh; z-index: -1;">TEXTBOX</strong>
            <div style="position: relative; top:18vh;">
            <div>Color: <input type="color" data-name="color" value="#000000"></div>
            <div>Text: <input type="text" data-name="text" placeholder="Text"></div>
            <div><button data-action="applyText">Apply</button> <button data-action="front">Front</button> <button data-action="remove">Remove</button></div>
            <div>Font: <select data-name="font"><option value="Arial, Helvetica, sans-serif">Arial</option><option value="Times New Roman, Times, serif">Times</option><option value="Georgia, serif">Georgia</option><option value="Courier New, Courier, monospace">Courier</option></select></div>
            <div>Lines: <input type="number" min="1" max="50" value="1" data-name="lines"></div>
            <div>Repetitions: <input type="number" min="1" max="50" value="1" data-name="reps"></div>
            <div>Font Size: <input type="range" min="1" max="150" value="6" data-name="size"></div>
            <div>Line Spacing: <input type="range" min="0" max="500" value="0" data-name="lineHeight"></div>
            <div>Rotation: <input type="range" min="-180" max="180" value="0" data-name="rotate"></div>
            <div>Left %: <input type="range" min="0" max="100" value="50" data-name="left"></div>
            <div>Top vh: <input type="range" min="-10" max="100" value="50" data-name="top"></div>
            <div>Slant: <input type="range" min="-100" max="100" value="0" data-name="skew"></div>
            <div>Weight: <input type="range" min="100" max="900" value="400" data-name="weight"></div>
            <div>Letter spacing px: <input type="range" min="0" max="150" value="0" data-name="letter"></div>
            </div>
        </div>
        `;
        panels.appendChild(panel);
        panel.style.backgroundColor = currentBgColor;
        // Scroll zu neuem Panel
        setTimeout(() => { panel.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 0);

        dynamicState[id] = {box, panel};

        panel.querySelector('[data-action="applyText"]').addEventListener('click', () => {
                const txt = panel.querySelector('[data-name="text"]').value || '';
                const lines = Number(panel.querySelector('[data-name="lines"]').value) || 1;
                const reps = Number(panel.querySelector('[data-name="reps"]').value) || 1;
                const repeated = txt ? Array(reps).fill(txt).join(' ') : '';
                buildLinesFor(id, repeated, lines);
            });
        panel.querySelector('[data-action="front"]').addEventListener('click', () => bringToFront(id));
        panel.querySelector('[data-action="remove"]').addEventListener('click', () => { panel.remove(); box.remove(); delete dynamicState[id]; });

        const applyStyles = () => {
            const color = panel.querySelector('[data-name="color"]').value;
            const size = panel.querySelector('[data-name="size"]').value;
            const lineHeight = panel.querySelector('[data-name="lineHeight"]').value;
            const rotate = panel.querySelector('[data-name="rotate"]').value;
            const left = panel.querySelector('[data-name="left"]').value;
            const top = panel.querySelector('[data-name="top"]').value;
            const skew = panel.querySelector('[data-name="skew"]').value;
            const weight = panel.querySelector('[data-name="weight"]').value;
            const letter = panel.querySelector('[data-name="letter"]').value;
            const font = panel.querySelector('[data-name="font"]').value;

            box.style.color = color;
            box.style.lineHeight = (1 + Number(lineHeight) / 100) + 'em';
            box.style.fontSize = size + 'vh';
            box.style.left = left + '%';
            box.style.top = top + 'vh';
            box.style.transform = `translateX(-50%) skew(${skew}deg) rotate(${rotate}deg)`;
            box.style.fontWeight = weight;
            box.style.letterSpacing = letter + 'px';
            box.style.fontFamily = font;
        };

        panel.querySelectorAll('input[type="range"], input[type="color"], input[type="number"], input[type="text"], select[data-name="font"]').forEach(el => el.addEventListener('input', applyStyles));
        applyStyles();
        return id;
    }


    function createImagePanel() {
        const id = `image-${nextBlockId++}`;
        const container = document.createElement('div');
        container.id = id + '-container';
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%,-50%)';
        container.style.pointerEvents = 'none';
        poster.appendChild(container);

        const panels = document.getElementById('DynamicPanels');
        const panel = document.createElement('div');
        panel.className = 'dynamicPanel';
        panel.dataset.for = id;
        panel.style.border = '1px solid #333';
        panel.style.margin = '6px';
        panel.style.padding = '6px';
        panel.style.height = '53vh';
        panel.innerHTML = `
        <div style="margin-bottom: 6px;position: relative; z-index: 5;">
            <strong style=" font-family: 'obwf'; position: absolute; left: 3px; top:1vh; font-size: 41vh; z-index: -1;">IMAGE</strong>
            <div style="position: relative; top:25vh;">
            <div>Upload: <input type="file" accept="image/*" data-name="upload"></div>
            <div>Size: <input type="range" min="1" max="200" value="50" data-name="size"></div>
            <div>Left %: <input type="range" min="-20" max="120" value="50" data-name="left"></div>
            <div>Top %: <input type="range" min="-20" max="120" value="50" data-name="top"></div>
            <div><button data-action="remove">Remove</button> <button data-action="front">Front</button></div>
            </div>
        </div>
        `;
        panels.appendChild(panel);
        panel.style.backgroundColor = currentBgColor;
        // Scroll zu neuem Panel
        setTimeout(() => { panel.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 0);

        dynamicState[id] = {container, panel};

        const uploadInput = panel.querySelector('[data-name="upload"]');
        let imgEl = null;
        uploadInput.addEventListener('change', () => {
            const f = uploadInput.files && uploadInput.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = e => {
                container.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.display = 'block';
                container.appendChild(img);
                imgEl = img;
                updateImageFromPanel();
            };
            r.readAsDataURL(f);
        });

        const updateImageFromPanel = () => {
            if (!imgEl) return;
            const size = Number(panel.querySelector('[data-name="size"]').value) / 100;
            imgEl.style.position = 'absolute';
            imgEl.style.left = '50%';
            imgEl.style.top = '50%';
            imgEl.style.transform = `translate(-50%,-50%) scale(${size})`;
            container.style.left = panel.querySelector('[data-name="left"]').value + '%';
            container.style.top = panel.querySelector('[data-name="top"]').value + '%';
        };

        panel.querySelector('[data-name="size"]').addEventListener('input', updateImageFromPanel);
        panel.querySelector('[data-name="left"]').addEventListener('input', updateImageFromPanel);
        panel.querySelector('[data-name="top"]').addEventListener('input', updateImageFromPanel);

        panel.querySelector('[data-action="remove"]').addEventListener('click', () => { panel.remove(); container.remove(); delete dynamicState[id]; });
        panel.querySelector('[data-action="front"]').addEventListener('click', () => bringToFront(container.id));
        return id;
    }


    function createLogoPanel() {
        const id = `logo-${nextBlockId++}`;
        const container = document.createElement('div');
        container.id = id + '-container';
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%,-50%)';
        container.style.pointerEvents = 'none';
        poster.appendChild(container);

        const panels = document.getElementById('DynamicPanels');
        const panel = document.createElement('div');
        panel.className = 'dynamicPanel';
        panel.dataset.for = id;
        panel.style.border = '1px solid #333';
        panel.style.margin = '6px';
        panel.style.padding = '6px';
        panel.style.height = '57vh';
        panel.innerHTML = `
        <div style="margin-bottom: 6px;position: relative; z-index: 5;">
            <strong style=" font-family: 'obwf'; position: absolute; left: 3px; top:1vh; font-size: 36vh; z-index: -1;">LOGOBOX</strong>
            <div style="position: relative; top:18vh;">
            <div>Upload SVG: <input type="file" accept=".svg" data-name="upload"></div>
            <div>Color: <input type="color" data-name="color" value="#000000"></div>
            <div>Size: <input type="range" min="1" max="200" value="30" data-name="size"></div>
            <div>Rotation: <input type="range" min="-180" max="180" value="0" data-name="rotate"></div>
            <div>Left %: <input type="range" min="-20" max="120" value="50" data-name="left"></div>
            <div>Top %: <input type="range" min="-20" max="120" value="50" data-name="top"></div>
            <div><button data-action="remove">Remove</button> <button data-action="front">Front</button></div>
            </div>
        </div>
        `;
        panels.appendChild(panel);
        panel.style.backgroundColor = currentBgColor;
        // Scroll zu neuem Panel
        setTimeout(() => { panel.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 0);

        dynamicState[id] = {container, panel};

        const uploadInput = panel.querySelector('[data-name="upload"]');
        let svgEl = null;
        uploadInput.addEventListener('change', () => {
            const f = uploadInput.files && uploadInput.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = e => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(e.target.result, 'image/svg+xml');
                const svg = doc.documentElement;
                if (!svg || svg.nodeName !== 'svg') return alert('Keine gültige SVG-Datei.');
                svg.removeAttribute('id');
                svg.querySelectorAll('[fill]').forEach(el => el.setAttribute('fill','currentColor'));
                svg.style.display = 'block';
                svg.style.width = 'auto';
                svg.style.height = 'auto';
                container.innerHTML = '';
                container.appendChild(svg);
                svgEl = svg;
                updateLogoFromPanel();
            };
            r.readAsText(f);
        });

        const updateLogoFromPanel = () => {
            if (!svgEl) return;
            const size = Number(panel.querySelector('[data-name="size"]').value) / 100;
            const rot = Number(panel.querySelector('[data-name="rotate"]').value) || 0;
            const color = panel.querySelector('[data-name="color"]').value;
            svgEl.style.position = 'absolute';
            svgEl.style.left = '50%';
            svgEl.style.top = '50%';
            svgEl.style.transformOrigin = '50% 50%';
            svgEl.style.transform = `translate(-50%,-50%) scale(${size}) rotate(${rot}deg)`;
            container.style.left = panel.querySelector('[data-name="left"]').value + '%';
            container.style.top = panel.querySelector('[data-name="top"]').value + '%';
            container.style.color = color;
        };

        panel.querySelector('[data-name="size"]').addEventListener('input', updateLogoFromPanel);
        panel.querySelector('[data-name="rotate"]').addEventListener('input', updateLogoFromPanel);
        panel.querySelector('[data-name="left"]').addEventListener('input', updateLogoFromPanel);
        panel.querySelector('[data-name="top"]').addEventListener('input', updateLogoFromPanel);
        panel.querySelector('[data-name="color"]').addEventListener('input', updateLogoFromPanel);

        panel.querySelector('[data-action="remove"]').addEventListener('click', () => { panel.remove(); container.remove(); delete dynamicState[id]; });
        panel.querySelector('[data-action="front"]').addEventListener('click', () => bringToFront(container.id));
        return id;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const addText = document.getElementById('AddTextBtn');
        const addImage = document.getElementById('AddImageBtn');
        const addLogo = document.getElementById('AddLogoBtn');
        if (addText) addText.addEventListener('click', () => createTextPanel());
        if (addImage) addImage.addEventListener('click', () => createImagePanel());
        if (addLogo) addLogo.addEventListener('click', () => createLogoPanel());
    });