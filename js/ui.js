import { handleSelectTitle, searchTitles, removeFromHistory, clearHistory} from "./logic.js"
import { state } from "./state.js"



export function renderTitles(titles){
    
    const resultsContainer = document.querySelector( "#results" )
    
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
            handleSelectTitle(title.imdbID)
        
    })
    

         resultsContainer.appendChild(card)

         
    })

    
}

export function showLoading() {
    const status = document.querySelector("#status")
    status.textContent  = "Buscando..."
}

export function showEmpty(){
    const status = document.querySelector("#status")
    status.textContent = "No se encontraron resultados"
}

export function clearStatus(){
    const status = document.querySelector("#status")
    status.textContent = ""
}

export function renderDetail(title) {
    const container = document.querySelector("#results")
    document.querySelector("#filters").style.display = "none"
    document.querySelector("#status").style.display = "none"       
    document.body.classList.add("detail-view")

    const rating = title.imdbRating !== "N/A" ? title.imdbRating : "Sin rating"
    const genre = title.Genre !== "N/A" ? title.Genre : "Sin género"

    container.innerHTML = `
    <button id="backBtn"> ← Volver</button>
    <div class="detail-container">
        <div class="detail"> 
            <img src="${title.Poster}" alt="${title.Title}"/>
        <div class="detail-info">
            <h2>${title.Title}</h2>
            <p class="meta">
                <span>⭐ ${rating}</span>
                <span>🎭 ${genre}</span>
                <span>📅 ${title.Year}</span>
            </p>
            
            <p><strong>Trama:</strong>${title.Plot}</p>
            <p><strong>Director:</strong>${title.Director}</p>
            <p><strong>Actores:</strong>${title.Actors}</p> 
        </div>    

        </div>
    </div>

        
        
    `
    document.querySelector("#backBtn").addEventListener("click", () =>{
        state.view = "list"
        console.log(state)
        document.querySelector("#filters").style.display = "flex"
        document.querySelector("#status").style.display = "flex"
        document.body.classList.remove("detail-view")  
        renderApp()
    })
    
}

export function renderApp(){
    console.log("renderApp:", state)

    if (state.view === "detail"){
        renderDetail(state.selectedTitle)
    }else{
        renderTitles(state.titles)
    }
}   

export function renderHistory(history) {
    const container = document.querySelector("#status")

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
    const container = document.querySelector("#pagination")
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



