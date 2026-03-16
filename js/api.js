const API_KEY = "95fb1230"
const BASE_URL = "https://www.omdbapi.com"

export async function fetchTitles(query){
    
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${query}`

    const response = await fetch(url)

    const data = await response.json()

    return data
}

