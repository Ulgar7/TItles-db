import { goToFavorites, handleSelectTitle, searchTitles, showFavorites } from "./logic.js"
import { renderApp, renderHistory } from "./ui.js"
import { state } from "./state.js"

const params = new URLSearchParams(window.location.search)
const id = params.get("id")
const query = params.get("q")

if (id && id !== "null") {
    handleSelectTitle(id)
}else if(query){
    searchTitles(query)
}
const savedHistory = localStorage.getItem("history")

if(savedHistory){
    state.history = JSON.parse(savedHistory)
    renderHistory(state.history)
}

const form = document.querySelector("#search-form")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const input = document.querySelector("#search-input")
    const query = input.value

    window.history.pushState(null, "", `?q=${query}`)

    await searchTitles(query)
    
    
})

const filters = document.querySelectorAll("#filters button")
    
    filters.forEach(btn => {
        btn.addEventListener("click", async () => {
            const type = btn.dataset.type
            
            state.type = type
            filters.forEach(b => {
                b.classList.toggle("active", b.dataset.type === state.type)

            })
            
            if(state.view === "favorites"){
                renderApp()
            }else if(state.query){
                await searchTitles(state.query)
            }
        })
    })

const savedFavorites = localStorage.getItem("favorites")

    if(savedFavorites) {
        state.favorites = JSON.parse(savedFavorites)
    }


document.querySelector("#favoritesBtn").addEventListener("click", () => {
    goToFavorites()
    console.log(state.favorites)
})

