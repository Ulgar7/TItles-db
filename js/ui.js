import { handleSelectTitle } from "./logic.js"
import { state } from "./state.js"

export function renderTitles(titles){
    
    const resultsContainer = document.querySelector( "#results" )
    
    resultsContainer.innerHTML = ""

    titles.forEach(title => {

        const poster = title.Poster !== "N/A"
            ? title.Poster
            : "https://placehold.co/300x450"
        
         const card = document.createElement("div")

         card.innerHTML = `
         <img src="${poster}" alt="${title.Title}"
         onerror="this.src='https://placehold.co/300x450'">
         <h3>${title.Title}</h3>
         <p>${title.Year}</p>
         `
          card.addEventListener("click", () => {
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

     container.innerHTML = `
     <div>
        <button id="backBtn"> ← Volver</button>

        <h2>${title.Title}</h2>
        <img src="${title.Poster}" alt="${title.Title}"/>
        <p><strong>Año:</strong>${title.Year}</p>
        <p><strong>Director:</strong>${title.Director}</p>
        <p><strong>Actores:</strong>${title.Actors}</p> 
        <p><strong>Trama:</strong>${title.Plot}</p>
     </div>
     `
     document.querySelector("#backBtn").addEventListener("click", () =>{
        renderTitles(state.titles)
     })
     
}


