import { fetchTitles, fetchTitleById } from "./api.js";
import { renderTitles, showLoading, showEmpty, clearStatus, renderDetail, renderApp, renderHistory, renderPagination } from "./ui.js";
import { state } from "./state.js";

export function normalizeTitle(title){
    return {
        imdbID: title.imdbID,
        Title: title.Title || "Sin título",
        Poster: title.Poster && title.Poster !== "N/A"
            ? title.Poster
            : "https://placehold.co/300x450",
        Year: title.Year || "Año desconocido",
        Type: title.Type || (title.totalSeasons ? "series" : "movie")    
    }
}

export async function searchTitles(query, page = 1) {
    

    try {
        const normalizedQuery = query.toLowerCase()

        state.view = "list"
        state.query = query
        state.page = page
        state.loading = true
        state.error = null
        
        
        showLoading()
        
        const data = await fetchTitles(query, state.type, page)
        
        state.loading = false
        
        if (data.Response === "False"){
            state.titles = []
            renderTitles([])
            console.log(state)
            showEmpty()
            return
        }
        
        // state.history.push(query)
        state.history = state.history.filter(item => item !== normalizedQuery)
        state.history.unshift(normalizedQuery)
        state.history = state.history.slice(0, 5)
        state.titles = data.Search.map(normalizeTitle)
        state.totalResults = Number(data.totalResults)
        
        console.log(state)
        console.log(state.history)
        
        clearStatus()
        renderTitles(state.titles)
        renderPagination()
        renderHistory(state.history)
        localStorage.setItem("history", JSON.stringify(state.history))
    } catch (error){

        state.loading = false
        state.error = error
    }
    
}

export async function handleSelectTitle(id) {
    await goToDetail(id)
    console.log(data)
    console.log(state)

    

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

export function toggleFavorite(title) {
    
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || []

    const exists = savedFavorites.some(f => f.imdbID === title.imdbID)

    let updatedFavorites

    if(exists) {
        updatedFavorites = savedFavorites.filter( f => f.imdbID !== title.imdbID)
    } else {
        updatedFavorites = [
            ...savedFavorites,
            {
                ...normalizeTitle(title),
                addedAt: Date.now()
            }
            
        ]
    }

    state.favorites = updatedFavorites
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
}



export function showFavorites() {
    state.view = "favorites"
    renderApp()
}

export function goToList() {
    state.view  = "list"
    renderApp()
}

export function goToFavorites() {
    state.view = "favorites"
    renderApp()
}

export async function goToDetail(id){
    const data = await fetchTitleById(id)

    state.view = "detail"

    state.selectedTitle = {
        ...normalizeTitle(data),
        ...data
    }

    renderApp()
}

export function toggleFavoriteAndRefresh(title) {
    toggleFavorite(title)
    renderApp()
}

export function sortFavorites(favorites, sortType) {
    const sorted = [...favorites]

    if (sortType === "recent") {
        return sorted.sort((a,b) => (b.addedAt || 0) - (a.addedAt || 0))
    }

    if (sortType === "title") {
        return sorted.sort((a,b) => a.Title.localeCompare(b.Title))
    }

    if (sortType === "year") {
        const getYear = (year) => {if (!year) return 0
        const match = year.match(/\d{4}/)
        return match ? Number(match[0]) : 0    
        }
        return sorted.sort((a,b) => getYear(b.Year) - getYear(a.Year))
    }

    return sorted
}

export async function getHotNowTitles() {
    
    const queries = [ "avengers" , "batman", "spider man", "star wars", "harry potter"]
    
    const shuffled = queries.sort(()=> 0.5 - Math.random())
    const selectedQueries = shuffled.slice(0,3)

    const results = await Promise.all(
        selectedQueries.map( q => fetchTitles(q, "all", 1))
    )

    const allTitles = results
    .flatMap(r => r.Search || [])
    .slice(0,15)

    const detailed = await Promise.all(
        allTitles.map( t => fetchTitleById(t.imdbID))
    )

    let filtered = detailed.filter( t => {
        const rating = Number(t.imdbRating)
        return !isNaN(rating) && rating >= 6
    })

    filtered = filtered.sort(() => 0.5 - Math.random())

    if(filtered.length < 5) {
        return detailed.slice(0,5)
    }

    return filtered.slice(0,5)
}

export async function getRecommendedTitles() {

    if (state.favorites.length === 0){
        return await getHotNowTitles()
    }

    const favQueries = state.favorites
        .map(f => f.Title.split( " ") [0])
        .filter(Boolean)

    const shuffled = favQueries.sort(() => 0.5 - Math.random())
    const selectedQueries = shuffled.slice(0, 3)

    const results = await Promise.all(
        selectedQueries.map(q => fetchTitles(q, "all", 1))
    )

    const allTitles = results
        .flatMap( r => r.Search || [])
        .slice(0, 15)

        const detailed = await Promise.all(
            allTitles.map(t => fetchTitleById(t.imdbID))
        )

        let filtered = detailed.filter(t => {
            const rating = Number(t.imdbRating)
            return !isNaN(rating) && rating >= 6
        })

        filtered = filtered.sort(() => 0.5 - Math.random())

        const favIds = new Set(state.favorites.map( f => f.imdbID))

        filtered = filtered.filter( t => !favIds.has(t.imdbID))

        if(filtered.length < 5) {
            return detailed.slice(0,5)
        }

        return filtered.slice(0,5)
}