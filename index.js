const form = document.getElementById('search-bar');
const input = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const loading = document.getElementById('loading');
const results = document.getElementById('results');

const createPlaceholder = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 80 120");
    svg.classList.add("placeholder");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width",  "100%")
    rect.setAttribute("height",  "100%")

    svg.appendChild(rect);
    return svg;
}

const searchBooks = async () => {
    const query = input.value.trim();
    if (query === '') return;

    results.innerHTML = '';
    const api = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    loading.textContent = 'Loading...';
    
    const response = await fetch(api);
    const data = await response.json();
    
    loading.textContent = '';
    
    const titles = new Set();
    for (const book of data.docs) {

        const title = book.title;
        if (titles.has(title)) continue;
        titles.add(title);

        const author = book.author_name
            ? book.author_name.join(", ")
            : "Unknown author";

        const year = book.first_publish_year
            ? book.first_publish_year
            : "Unknown year";

        const li = document.createElement("li");
        li.classList.add("book");
        
        if (book.cover_i) {
            const cover = document.createElement("img");
            cover.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`;
            cover.alt = `Cover for ${title} by ${author} (${year})`;
            cover.classList.add("cover");
            li.appendChild(cover);
        } else {
            li.appendChild(createPlaceholder());
        }

        const info = document.createElement("span");
        info.innerHTML = `
            <i>${title}</i>
            <br><strong>${author}</strong>
            <br>${year}
        `;

        li.appendChild(info);
        results.appendChild(li);
    }
}

form.addEventListener('submit', (event)=> {
    event.preventDefault()
    searchBooks();
    input.value = '';
});