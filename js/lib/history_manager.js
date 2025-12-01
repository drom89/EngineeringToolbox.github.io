export class HistoryManager {
  constructor(storageKey, containerId) {
    this.storageKey = storageKey;
    this.container = document.getElementById(containerId);
    this.history = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    this.render();
  }

  addEntry(text) {
    const timestamp = new Date().toLocaleTimeString();
    this.history.unshift({ time: timestamp, text: text });
    if (this.history.length > 10) {
      this.history.pop();
    }
    this.save();
    this.render();
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.history));
  }

  clear() {
    this.history = [];
    this.save();
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = '<h3>Poslední výsledky</h3>';

    if (this.history.length === 0) {
      this.container.innerHTML += '<p>Žádná historie.</p>';
      return;
    }

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';

    this.history.forEach(entry => {
      const li = document.createElement('li');
      li.style.borderBottom = '1px solid #eee';
      li.style.padding = '0.5rem 0';
      li.style.fontSize = '0.9rem';
      li.innerHTML = `<strong>${entry.time}</strong><br>${entry.text}`;
      list.appendChild(li);
    });

    this.container.appendChild(list);

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Vymazat historii';
    clearBtn.style.marginTop = '0.5rem';
    clearBtn.style.padding = '0.3rem';
    clearBtn.style.fontSize = '0.8rem';
    clearBtn.onclick = () => this.clear();
    this.container.appendChild(clearBtn);
  }
}
