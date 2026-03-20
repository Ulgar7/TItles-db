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