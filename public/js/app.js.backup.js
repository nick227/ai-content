document.addEventListener('DOMContentLoaded', init);

async function init() {
    document.querySelector('button[type="submit"]').addEventListener('click', handleSubmit);
    document.querySelector('#search_input').addEventListener('input', handleWordMapSearch);
    await loadApiData();
    setupCsvUpload();
}

function setupCsvUpload() {
    const div = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file');

    fileInput.addEventListener('change', (e) => {
        processCsv(e.target.files[0], appendCsvLine);
    });

    div.addEventListener('dragover', (e) => {
        e.preventDefault();
        div.classList.add('hover');
    });

    div.addEventListener('dragleave', () => div.classList.remove('hover'));

    div.addEventListener('drop', (e) => {
        e.preventDefault();
        div.classList.remove('hover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            processCsv(e.dataTransfer.files[0], appendCsvLine);
        }
    });

    div.addEventListener('click', () => fileInput.click());
}

function processCsv(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const lines = event.target.result.split(/\r\n|\n/);
        lines.forEach(line => {
            const parts = line.split(',').map(part => part.trim());
            if (parts.length === 2) {
                callback(parts[0], parts[1]);
            } else {
                alert('Invalid line format: ' + line);
            }
        });
    };
    reader.onerror = () => alert('Unable to read the file: ' + file.name);
    reader.readAsText(file);
}


function appendCsvLine(subject, word) {
    const target = document.querySelector('.csv-rows');
    const row = document.createElement('div');
    const removeLink = document.createElement('a');
    removeLink.href = 'javascript:void(0)';
    removeLink.textContent = 'Remove';
    removeLink.addEventListener('click', function () {
        target.removeChild(row);
    });

    row.className = 'row';
    row.innerHTML = `<input type="text" value="${subject}" placeholder="subject"><input type="text" value="${word}" placeholder="word">`;
    row.appendChild(removeLink);
    target.appendChild(row);
}


function handleWordMapSearch(e) {
    const search = e.target.value.toLowerCase();
    const wordmapContainers = document.querySelectorAll('.wordmap-container');

    wordmapContainers.forEach(container => {
        const h2SpanText = container.querySelector('h2 > span') ? container.querySelector('h2 > span').textContent.toLowerCase() : '';
        const listItems = Array.from(container.querySelectorAll('ul li')).map(li => li.textContent.toLowerCase());

        if (h2SpanText.includes(search)) {
            container.style.display = 'block';
            container.style.order = 0; // Prioritize these results
        } else if (listItems.some(item => item.includes(search))) {
            container.style.display = 'block';
            container.style.order = 1; // Lower priority for these results
        } else {
            container.style.display = 'none';
        }
    });
}

async function loadApiData() {
    const apiInfo = [
        { path: '/api/chat/keys', title: 'Create Lists', elmType: 'checkbox', key: 'lists', target: '#chatgpt-options' },
        { path: '/api/dalle/keys', title: 'Dalle Prompts', elmType: 'checkbox', key: 'images', target: '#dalle-options' },
        { path: '/api/wordmaps', title: 'Word Maps', elmType: 'ul', key: 'wordmaps', target: '#lists' }
    ];

    clearContent(apiInfo);

    try {
        const results = await Promise.all(apiInfo.map(info => fetch(info.path).then(res => res.json())));
        console.log('results', results)
        results.forEach((data, i) => createContentSection(apiInfo[i], data));
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

function clearContent(apiInfo) {
    apiInfo.forEach(info => {
        const target = document.querySelector(info.target);
        if (target) {
            target.innerHTML = '';
        }
    });
}

function createContentSection(info, results) {
    const section = document.createElement('div');
    section.innerHTML = `<h2>${info.title}</h2>${generateContentHtml(info, results)}`;
    document.querySelector(info.target).appendChild(section);
}

function generateContentHtml(info, results) {
    if (info.elmType === 'checkbox') {
        return results.map(result => {
            const value = typeof result === 'object' ? JSON.stringify(result) : result;
            return `<label for="input_${result}_${info.key}"><input class="checkbox_${info.key}" type="checkbox" id="input_${result}_${info.key}" value='${value}'>${result.display || result}</label>`;
        }).join('');
    } else if (info.elmType === 'ul') {
        // Now using generateWordMapElement for better clarity
        return `<div class="row align-top">${results.map(generateWordMapElement).join('')}</div>`;
    }
    return '';
}

function generateWordMapElement(result) {
    let html = '';

    if (typeof result === 'object') {
        for (let key in result) {
            if (Array.isArray(result[key])) {
                html += `<h6>${key}</h6>`;
                html += `<ul>${result[key].map(item => `<li>${item}</li>`).join('')}</ul>`;
            } else if (key === 'imageName') {
                html += `<img class="thumb" src="/uploads/images/${result[key]}" alt="uploads/images/${result[key]}">`;
            } else if (key !== '_id' && key !== 'timestamp') {
                html += `<h2>${key}: ${result[key]}</h2>`;
            }
        }
    }

    return `<div class="wordmap-container">${html}</div>`;
}

async function handleSubmit(e) {
    e.preventDefault();

    const limit = document.querySelector('#limit').value;

    const csvRows = Array.from(document.querySelectorAll('.csv-rows .row'));
    for (const row of csvRows) {
        const inputs = row.querySelectorAll('input');
        const subject = inputs[0].value;
        const word = inputs[1].value;
        toggleProcessing(row);
        await makeAiRequest(subject, word);
    }
    const subject = document.querySelector('#subject_input').value;
    const word = document.querySelector('#word_input').value;
    if (subject || word) {
        await makeAiRequest(subject, word, limit);
    }
}

function toggleProcessing(row) {
    document.querySelectorAll('.row').forEach(row => row.classList.remove('processing'));
    row.classList.add('processing');
}

async function makeAiRequest(subject, word, limit = 5) {

    const imageCheckboxes = [...document.querySelectorAll('.checkbox_images:checked')];
    const listCheckboxes = [...document.querySelectorAll('.checkbox_lists:checked')];
    const imageCommands = imageCheckboxes.map(elm => ({ type: 'dalle', method: elm.value }));
    const listCommands = listCheckboxes.map(elm => elm.value);
    const commands = [...imageCommands, ...listCommands];

    if ((subject || word) && commands.length > 0) {
        try {
            const response = await fetch('/api/generate/wordmaps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, word, commands, limit })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await loadApiData();
        } catch (error) {
            console.error('Failed to generate wordmaps:', error);
        }
    } else {
        alert('Must choose at least one command and provide a subject or word.');
    }


}
