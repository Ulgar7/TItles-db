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


