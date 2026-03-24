import { fetchTitles, fetchTitleById } from "./api.js";
import { renderTitles, showLoading, showEmpty, clearStatus, renderDetail, renderApp, renderHistory, } from "./ui.js";
import { state } from "./state.js";

export async function searchTitles(query) {
    try {
        state.query = query
        state.loading = true
        state.error = null
        
        
        showLoading()
        
        const data = await fetchTitles(query)
        
        state.loading = false
        
        if (data.Response === "False"){
            state.titles = []
            renderTitles([])
            console.log(state)
            showEmpty()
            return
        }
        
        // state.history.push(query)
        state.history = state.history.filter(item => item !== query)
        state.history.unshift(query)
        state.history = state.history.slice(0, 5)
        state.titles = data.Search
        
        console.log(state)
        console.log(state.history)
        
        clearStatus()
        renderTitles(state.titles)
        renderHistory(state.history)
        localStorage.setItem("history", JSON.stringify(state.history))
    } catch (error){

        state.loading = false
        state.error = error
    }
    
}

export async function handleSelectTitle(id) {
    const data = await fetchTitleById(id)
    console.log(data)

    state.view = "detail"
    state.selectedTitle = data

    console.log(state)

    renderApp()

}

export function removeFromHistory(query){
    state.history = state.history.filter(item => item !== query)

    localStorage.setItem("history", JSON.stringify(state.history))

    renderHistory(state.history)
}

export function clearHistory() {
    
    state.history = []

    localStorage.removeItem("history")

    renderHistory(state.history)
}