class UiComponent {
    updateContent(selector, html) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
        }
    }

    addClass(selector, className) {
        document.querySelector(selector)?.classList.add(className);
    }

    removeClass(selector, className) {
        document.querySelector(selector)?.classList.remove(className);
    }

    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        Object.keys(options).forEach(key => {
            if (key === 'class') {
                element.className = options[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = options[key];
            } else {
                element[key] = options[key];
            }
        });
        return element;
    }

    appendChild(selector, child) {
        const parent = document.querySelector(selector);
        if (parent) {
            parent.appendChild(child);
        }
    }

    toggleProcessing(row=null) {
        document.querySelectorAll('.row').forEach(row => row.classList.remove('processing'));
        if(row){
            row.classList.add('processing');
        }
    }

    showLoader() {
        const target = document.querySelector('body');
        target.classList.add('active');
        const button = document.querySelector('button[type="submit"]');
        button.disabled = true;

    }

    hideLoader() {
        const target = document.querySelector('body');
        target.classList.remove('active');
        const button = document.querySelector('button[type="submit"]');
        button.disabled = false;
    }

    removeChild(parent, child) {
        parent.removeChild(child);
    }

    setFiles(inputSelector, files) {
        const input = document.querySelector(inputSelector);
        if (input) {
            input.files = files;
        }
    }

    updateContent(selector, html) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
        }
    }

    renderContentSection(info, results) {
        const html = this.composeHtmlForContent(info, results);
        this.updateContent(info.target, `<h2>${info.title}</h2>${html}`);
    }

    composeHtmlForContent(info, results) {
        if (info.elmType === 'checkbox') {
            return results.map(result => {
                const value = typeof result === 'object' ? JSON.stringify(result) : result;
                return `<label for="input_${result}_${info.key}"><input class="checkbox_${info.key}" type="checkbox" id="input_${result}_${info.key}" value='${value}'>${result.display || result}</label>`;
            }).join('');
        } else if (info.elmType === 'ul') {
            return `<div class="row align-top">${results.map(result => this.composeWordMapElement(result)).join('')}</div>`;
        }
        return '';
    }

    showAlert(msg) {
        alert(msg);
    }

    composeWordMapElement(result) {
        let html = '';

        if (typeof result === 'object') {
            for (let key in result) {
                if (Array.isArray(result[key])) {
                    html += `<h6>${key}</h6>`;
                    html += `<ul>${result[key].map(item => `<li>${item}</li>`).join('')}</ul>`;
                } else if (key === 'imageName') {
                    html += `<img class="thumb" src="/uploads/images/${result[key]}" alt="uploads/images/${result[key]}">`;
                } else if (key !== '_id' && key !== 'timestamp') {
                    html += `<h2>${key}: <span>${result[key]}</span></h2>`;
                }
            }
        }

        return `<div class="wordmap-container">${html}</div>`;
    }
}