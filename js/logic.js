import { fetchTitles, fetchTitleById } from "./api.js";
import { renderTitles, showLoading, showEmpty, clearStatus, renderDetail } from "./ui.js";
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

        state.titles = data.Search

        console.log(state)

        clearStatus()
        renderTitles(state.titles)
    } catch (error){

        state.loading = false
        state.error = error
    }
    // const data = await fetchTitles(query)

    // renderTitles(data.Search)
    // console.log(data)
}

export async function handleSelectTitle(id) {
    const data = await fetchTitleById(id)
    console.log(data)

    state.selectedTitle = data
    state.view = "detail"

    renderDetail(data)
}