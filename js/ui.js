import { searchTitles, removeFromHistory, clearHistory, goToDetail, goToList, toggleFavoriteAndRefresh, sortFavorites, getHotNowTitles, getRecommendedTitles} from "./logic.js"
import { state } from "./state.js"


const DOM = {
    results: document.querySelector("#results"),
    status: document.querySelector("#status"),
    filters: document.querySelector("#filters"),
    pagination: document.querySelector("#pagination"),
}

export function renderTitles(titles){
    
    const resultsContainer = DOM.results
    
    resultsContainer.innerHTML = ""

    titles.forEach(title => {

        const poster = title.Poster !== "N/A"
            ? title.Poster
            : "https://placehold.co/300x450"
        
        const card = document.createElement("div")
        card.classList.add("card")

        card.innerHTML = `
            
        <a href="?id=${title.imdbID}" class="poster-link">         
            <img src="${poster}" alt="${title.Title}"
            onerror="this.src='https://placehold.co/300x450'">
        </a>
            

            <div class="card-overlay">
                <h3>${title.Title}</h3>
                <p>${title.Year}</p>
            </div>
        
        `
        card.addEventListener("click", (e) => {
            e.preventDefault()

            // window.history.pushState(null, "", `?id=${title.imdbID}`)
            goToDetail(title.imdbID)
        
    })
    

        resultsContainer.appendChild(card)

    
    })

    
}

export function showLoading() {
    DOM.status.textContent  = "Buscando..."
}

export function showEmpty(){
    DOM.status.textContent = "No se encontraron resultados"
}

export function clearStatus(){
    DOM.status.textContent = ""
}



export function renderDetail(title) {
    const container = DOM.results
    DOM.filters.style.display = "none"
    DOM.status.style.display = "none"   
    

    const rating = title.imdbRating !== "N/A" ? title.imdbRating : "Sin rating"
    const genre = title.Genre !== "N/A" ? title.Genre : "Sin género"

    const ratingValue = parseFloat(title.imdbRating) || 0

    let ratingClass = ""

    if (ratingValue <= 3.9) {
        ratingClass = "rating-red"
    } else if (ratingValue <= 4.9) {
        ratingClass = "rating-orange"
    } else if (ratingValue <= 6.4) {
        ratingClass = "rating-yellow"
    } else if (ratingValue <= 7.4) {
        ratingClass = "rating-green-light"
    } else if (ratingValue <= 8.4) {
        ratingClass = "rating-green"
    } else if (ratingValue <= 8.9) {
        ratingClass = "rating-green-strong"
    }else {
        ratingClass = "rating-purple"
    }

    const isFavorite = state.favorites.some(f => f.imdbID === title.imdbID)

    container.innerHTML = `
    <button id="backBtn"> ← Volver</button>
    <div class="detail-container">
        <div class="detail"> 
            <img src="${title.Poster}" alt="${title.Title}"/>
        <div class="detail-info">
            <h2>${title.Title}</h2>
            <p class="meta">
                <span class="rating ${ratingClass}">⭐ ${rating}</span>
                <span>🎭 ${genre}</span>
                <span>📅 ${title.Year}</span>
            </p>
            
            <p class="plot"><strong>Trama:</strong>${title.Plot}</p>
            <div class="extra">
            <p><strong>Director:</strong>${title.Director}</p>
            <p><strong>Actores:</strong>${title.Actors}</p> 
            <button id="favBtn" class="${isFavorite ? "active" : ""}">
            ${isFavorite ? "★ Quitar de favoritos" : "☆ Agregar a favoritos"}</button>
            </div>
        </div>    

        </div>
    </div>

        
        
    `
    document.querySelector("#backBtn").addEventListener("click", () =>{
        goToList()
        console.log(state)
        
    })

    document.querySelector("#favBtn").addEventListener("click", (e) => {
        const btn = e.currentTarget

        btn.classList.add("pop")

        setTimeout(() => {
            btn.classList.remove("pop")
        },200)

        toggleFavoriteAndRefresh(title)
    })
    
    
}



export function renderApp(){
    console.log("renderApp:", state)

    resetUI()

    if( state.view === "detail"){
        renderDetailView()
    } else if(state.view === "favorites") {
        renderFavoritesView()
    } else if(state.view === "home"){
        renderHomeView()
    }
    else {
        renderListView()
    }

}

function resetUI(){
    document.body.classList.remove("detail-view", "favorites-view")

    DOM.filters.style.display = "flex"
    DOM.status.style.display = "flex"
    DOM.status.textContent = ""

    const existingSearch = document.querySelector(".favorites-search")
    if (existingSearch) existingSearch.remove()

    const existingSort = document.querySelector(".custom-select")
    if (existingSort) existingSort.remove()
    
}

function renderDetailView(){
    document.body.classList.add("detail-view")
    renderDetail(state.selectedTitle)
}

function renderFavoritesView() {
    const topBar = document.querySelector(".top-actions")
    

    let actions = document.querySelector(".top-actions")

    if(!actions) {
        actions = document.createElement("div")
        actions.classList.add("top-actions")

        const topBar = document.querySelector(".top-bar")
        const favoritesBtn = document.querySelector("#favoritesBtn")

        topBar.appendChild(actions)
        actions.appendChild(favoritesBtn)
    }
    
        actions.appendChild(renderFavoritesSearch())
        actions.appendChild(renderSort())
    
    
    document.body.classList.add("favorites-view")


    let filteredFavorites = state.favorites

    
    if(state.type !== "all"){
        filteredFavorites = filteredFavorites.filter(f => f.Type === state.type)
    }

    if (state.favoritesQuery) {
    filteredFavorites = filteredFavorites.filter(f =>
        f.Title.toLowerCase().includes(state.favoritesQuery)
    )
}

    filteredFavorites = sortFavorites(filteredFavorites, state.sort)

    if(filteredFavorites.length === 0) {
        DOM.status.textContent = "No tenés favoritos todavía ⭐"
        DOM.results.innerHTML = ""
        return
    }

    renderTitles(filteredFavorites)
    document.querySelector("#status").textContent = "⭐ Tus favoritos"
}

function renderListView() {
    renderTitles(state.titles)
    renderHistory(state.history)
}

function renderSort() {
    const container = document.createElement("div")
    container.classList.add("custom-select")

    const button = document.createElement("button")
    button.classList.add("custom-select-btn")
    button.textContent = getSortLabel(state.sort) +  " ⌄"

    const list = document.createElement("ul")
    list.classList.add("custom-select-list")

    const options = [
        {value: "recent", label: "Recientes"},
        {value:"title", label: "Título"},
        {value:"year", label: "Año"}
    ]

    options.forEach(opt => {
        const li = document.createElement("li")
        li.textContent = opt.label

        if(opt.value === state.sort) {
            li.classList.add("active")
        }

        li.addEventListener("click" , () => {
            state.sort = opt.value
            renderApp()
        })

        list.appendChild(li)
    })

    button.addEventListener("click", (e) => {
        e.stopPropagation()
        container.classList.toggle("open")
    })

    setTimeout(() => {
        document.addEventListener("click", handleOutsideClick)
    },0)

    function handleOutsideClick(e) {
        if(!container.contains(e.target)){
            container.classList.remove("open")
            document.removeEventListener("click", handleOutsideClick)
        }
    }

    container.appendChild(button)
    container.appendChild(list)

    return container
}

function getSortLabel(value) {
    if(value === "recent") return "Recientes"
    if(value === "title") return "Título"
    if(value === "year") return "Año"
}


export function renderHistory(history) {
    const container = DOM.status

    container.innerHTML = ""
    
    const clearBtn = document.createElement("button")
    clearBtn.textContent = "Clear history"
    
    clearBtn.addEventListener("click", () => {
        clearHistory()
    })

    container.appendChild(clearBtn)

    history.forEach( query => {
        const btn = document.createElement("button")

        btn.innerHTML = `
        ${query} <span style="margin-left:8px; cursor:pointer;">✖</span>
        `

        btn.addEventListener("click", () => {
            window.history.pushState(null, "", `?q=${encodeURIComponent(query)}`)
            searchTitles(query)
        })

        btn.querySelector("span").addEventListener("click", (e) => {
            e.stopPropagation()
            removeFromHistory(query)
        })

        container.appendChild(btn)
    })
}

export function renderPagination() {
    const container = DOM.pagination
    container.innerHTML = ""    

    const totalPages = Math.ceil(state.totalResults / 10)

    const pagination = document.createElement("div")
    pagination.classList.add("pagination")
    

    if (state.page > 1) {
        const prevBtn = document.createElement("button")
        prevBtn.textContent = "←"

        prevBtn.addEventListener("click", () => {
            searchTitles(state.query, state.page - 1)
        })

        pagination.appendChild(prevBtn)
    }

    for (let i = 1; i <= totalPages && i <= 7; i++){
        const btn = document.createElement("button")
        btn.textContent = i

        if(i === state.page) {
            btn.classList.add("active")
        }
        
        btn.addEventListener("click", () => {
            searchTitles(state.query, i)
        })

        pagination.appendChild(btn)
    }

    if (state.page < totalPages) {
        const nextBtn = document.createElement("button")
        nextBtn.textContent = "→"

        nextBtn.addEventListener("click",() => {
            searchTitles(state.query, state.page + 1)
        })
        pagination.appendChild(nextBtn)
    }

    container.appendChild(pagination)
}

function renderFavoritesSearch() {
     const input = document.createElement("input")

     input.type = "text"
     input.placeholder = "Buscar en favoritos..."
     input.classList.add("favorites-search")

     input.value = state.favoritesQuery || ""

     input.addEventListener("input" , (e) => {
        state.favoritesQuery = e.target.value.toLowerCase()

        const cursorPos = e.target.selectionStart

        renderApp()

        setTimeout(() => {
            const newInput = document.querySelector(".favorites-search")
            if(newInput) {
                newInput.focus()
                newInput.setSelectionRange(cursorPos, cursorPos)
            }
        }, 0)
     })

     return input
}


async function renderHomeView() {
    
    document.body.classList.remove("detail-view" , "favorites-view")

    DOM.filters.style.display = "none"
    DOM.status.style.display = "none"
    DOM.pagination.style.display = "none"

    DOM.results.innerHTML = `<p>Cargando...</p>`

    const hotNow = await getHotNowTitles()
    const recommended = await getRecommendedTitles()

    DOM.results.innerHTML = "" 

    DOM.results.appendChild(createSection("🔥 Mejores calificados", hotNow))
    DOM.results.appendChild(createSection("🎯 Recomendado para vos", recommended))

}

function createSection(title, items) {
    const section = document.createElement("div")
    section.classList.add("home-section")

    const h2 = document.createElement("h2")
    h2.textContent = title

    const row = document.createElement("div")
    row.classList.add("home-row")

    items.forEach(item => {
        const card = createHomeCard(item)
        row.appendChild(card)
    })

    section.appendChild(h2)
    section.appendChild(row)

    return section
}

function createHomeCard(title){
    
    const card = document.createElement("div")
    card.classList.add("card")

    card.innerHTML = `
    <img src="${title.Poster}" alt="${title.Title}"
        onerror="this.src='https://placehold.co/300x450'">
    <div class="card-overlay">
        <h3>${title.Title}</h3>
        <p>${title.Year}</p>
    </div>
    `

    card.addEventListener("click", () => {
        goToDetail(title.imdbID)
    })

    return card
}


