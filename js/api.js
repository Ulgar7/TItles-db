import { API_KEY } from "./config.js"
const BASE_URL = "https://www.omdbapi.com"

export async function fetchTitles(query, type, page = 1){
    
    const typeParam = type !== "all" ? `&type=${type}` : ""

    const url = `${BASE_URL}?apikey=${API_KEY}&s=${query}${typeParam}&page=${page}`
    
    // const url = `${BASE_URL}?apikey=${API_KEY}&s=${query}`

    const response = await fetch(url)

    const data = await response.json()

    return data
}

export async function fetchTitleById(id) {
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${id}`

    const response = await fetch(url)
    const data = await response.json()

    return data
}

