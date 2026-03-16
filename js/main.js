import { searchTitles } from "./logic.js"

const form = document.querySelector("#search-form")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const input = document.querySelector("#search-input")
    const query = input.value

    await searchTitles(query)
    
})