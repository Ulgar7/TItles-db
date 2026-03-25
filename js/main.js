import { searchTitles } from "./logic.js"
import { renderHistory } from "./ui.js"
import { state } from "./state.js"

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
            
            if(state.query){
                await searchTitles(state.query)
            }
        })
    })
