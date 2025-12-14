document.addEventListener("DOMContentLoaded", () => {
  // Your code here
  const apiKey = "0dff6dd9b4de9b18c8a73f749e7e5144"
  // const movieTitle = "family"
  // const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
  // const URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
  const body = document.querySelector("body")
  const suggested = document.querySelector(".suggested")
  const popular = document.querySelector(".popular")
  const movieBackdrop = document.querySelector(".movie-backdrop__image")
  const movieBackTitle = document.querySelector(".movie-info__title")
  const movieDetails = document.querySelector(".movie-info__details")
  const movieBackYear = document.querySelector(".year")
  const movieBackRunTime = document.querySelector(".runtime")
  const movieOverview = document.querySelector(".movie-info__overview")
  const playButton = document.querySelector(".movie-info__button--play")
  const trailerButton = document.querySelector(".movie-info__button--trailer")
  const iframeDiv = document.querySelector(".iframe")
  const iframeOverlay = document.querySelector(".iframe-overlay")
  const search = document.querySelector(".movie-search")
  const searchInfo = document.querySelector(".movie-search-info")
  const input = document.querySelector("input")
  const searchMovie = document.querySelector(".search")
  let isPlaying = false
  let timeoutId = null

  searchMovie.addEventListener("click", () => {
    clearInterval(timeoutId)
    search.style.animationName = "animateFromTop"
    search.style.animationDuration = "1s"

    timeoutId = setTimeout(() => {
      iframeOverlay.style.opacity = "1"
    }, 100)
    iframeOverlay.style.display = "block"
    search.style.display = "flex"
    scrollToTop()
  })

  playButton.addEventListener("click", playFilm)

  trailerButton.addEventListener("click", playFilm)

  iframeOverlay.addEventListener("click", closefilm)

  search.addEventListener("input", (e) => searchInput(e))

  async function searchInput(e) {
    const movieTitle = input.value

    searchInfo.innerHTML = ""
    const searchURL = `https://imdb.iamidiotareyoutoo.com/justwatch?q=${movieTitle}`
    const data = await fetchMovie(searchURL)
    searchInfo.innerHTML = ""

    data.forEach(async (movie) => {
      // const videoURL = `https://api.themoviedb.org/3/movie/${movie.tmdbId}/videos?api_key=${apiKey}`
      // const fetchVideo = await fetchData(videoURL)
      // if (fetchVideo[0] === undefined) return
      if (movie.photo_url.length === 0) return
      const movieCon = createDivEl(movie, "movie-con")
      const id = movie.imdbId
      if (id === null) {
        movieCon.dataset.imdbid = `${movie.tmdbId}`
      } else {
        movieCon.dataset.imdbid = `${id}`
        // movieCon.dataset.videoKey = `${id}`
      }

      // movieCon.dataset.videoKey = `${fetchVideo[0].key}`

      updateMovieConInnerHTML(movie, movieCon)
      searchInfo.appendChild(movieCon)
    })

    console.log(data)
  }

  function updateMovieConInnerHTML(movie, movieCon) {
    movieCon.innerHTML = `
          <div class="movie-con__image">
            <img class="img"
              src="${movie.photo_url[1]}"
            />
          </div>
          <div class="movie-con__backdrop">${movie.backdrops[0]}</div>
          <div class="movie-con__title">${movie.title}</div>
          <div class="movie-con__details">
            <div class="movie-con__year">${movie.year}</div>
            <span>•</span>
            <div class="movie-con__runtime">${movie.runtime}m</div>
            <div class="movie-con__type">${movie.type}</div>
      `
  }

  search.addEventListener("click", (e) => {
    if (isTargetedClass(e, "img")) {
      const targetEvent = e.target.closest(".movie-con")
      console.log(targetEvent)
      console.log(targetEvent.dataset.imdbid)

      console.log(targetEvent)

      const imdbId = targetEvent.dataset.imdbid
      const key = targetEvent.dataset.videoKey
      const backdrop = targetEvent.querySelector(".movie-con__backdrop")
      const title = targetEvent.querySelector(".movie-con__title")
      const year = targetEvent.querySelector(".movie-con__year")
      const runtime = targetEvent.querySelector(".movie-con__runtime")
      const type = targetEvent.querySelector(".movie-con__type")
      movieDetails.innerHTML = `
      <div class="year">${year.textContent}</div>
          <span>•</span>
        <div class="runtime">${runtime.textContent}</div>
        <span>•</span>
        <div class="type">${type.textContent}</div>
        <div class="imdbId">${imdbId}</div>
        <div class="key">${key}</div>
        `
      movieBackdrop.src = backdrop.textContent
      movieBackTitle.textContent = title.textContent
      movieBackYear.textContent = year.textContent
      movieBackRunTime.textContent = runtime.textContent
      search.style.display = "none"
      // iframeOverlay.style.display = "none"
      closefilm()
    }
  })

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function playFilm(e) {
    scrollToTop()
    const target = e.target
    const targetEvent = e.target.closest(".movie-info")
    const imdbId = targetEvent.querySelector(".imdbId")
    // const key = targetEvent.querySelector(".key")
    // console.log(key);
    const type = targetEvent.querySelector(".type")
    iframeDiv.style.display = "block"
    iframeDiv.style.opacity = "1"
    iframeOverlay.style.display = "block"
    iframeOverlay.style.opacity = "1"
    body.style.overflow = "hidden"
    const iframe = document.createElement("iframe")
    iframe.addEventListener("click", (e) => {
      e.target
    })

    // Override console.clear in the parent page
    // const iframe = document.querySelector("iframe")

    // const innerbody = iframe.querySelector("body")
    iframe.setAttribute("allowfullscreen", "")

    if (type.textContent === "SHOW") {
      iframe.src = `https://www.2embed.cc/embedtvfull/${imdbId.textContent}`
    } else {
      iframe.src = `https://www.2embed.cc/embed/${imdbId.textContent}`
    }

    iframeDiv.appendChild(iframe)
    if (target.textContent.trim() === "TRAILER") {
      // console.log(key.textContent)
    }
  }

  function closefilm() {
    timeoutId = setTimeout(() => {
      iframeOverlay.style.display = "none"
      iframeDiv.style.display = "none"
      iframeDiv.style.display = "none"
      search.style.display = "none"
      iframeDiv.innerHTML = ""
    }, 900)

    search.style.animationName = "animateFromBottom"
    // iframeDiv.style.animationName = "animateFromBottom"
    iframeDiv.style.opacity = "0"
    iframeOverlay.style.opacity = "0"

    body.style.overflowY = "scroll"
  }

  async function createEl() {
    // const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
    const URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
    const data = await fetchData(URL)

    data.forEach(async (el) => {
      const movieId = el.id
      const URL3 = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
      const videoURL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
      const newData = await fetchNew(URL3)
      const fetchVideo = await fetchData(videoURL)
      if (fetchVideo[0] === undefined) return
      // console.log(fetchVideo[0].key);
      // console.log(fetchVideo);[1]

      const div = createDivEl(newData, "card")
      div.dataset.videoKey = `${fetchVideo[0].key}`
      // console.log(div);

      updateDivInnerHTML(el, div, newData)
      suggested.appendChild(div)
      // console.log(div);
    })
    suggested.addEventListener("click", (e) => renderOnPage(e))
  }

  function createDivEl(newData, className) {
    const div = document.createElement("div")
    div.classList = className
    div.dataset.imdbid = `${newData.imdb_id}`
    // if (fetchVideo[0] === undefined) return

    return div
  }

  function updateDivInnerHTML(el, div, newData) {
    div.innerHTML = `
            <div class="card-info">
            <div class="card-info__title">${el.title}</div>
            <div class="card-info-details"> 
            <div class="card-info__year">${newData.release_date.slice(
              0,
              -6
            )}</div>
            <span>•</span>
            <div class="card-info__runtime">${newData.runtime}m</div>
            <span>•</span>
            <div class="card-info__type">${newData.status}</div>
            <div class="card-info__overview">${newData.overview}m</div>
            </div>
            <button class="card-info__button">SELECT</button>
            </div>
            <img
            src="https://image.tmdb.org/t/p/original${el.backdrop_path}"
            alt="card"
            class="card__image"
            />
            <div class="card-overlay"></div>
            `
  }

  function renderOnPage(e) {
    if (!isTargetedClass(e, "card-info__button")) return

    const targetEvent = e.target.closest(".card")
    const movieData = extractMovieData(targetEvent)

    updateMovieDetails(movieData)
    updateMovieBackdrop(movieData)
    scrollToTop()
  }

  function isTargetedClass(e, className) {
    return e.target.classList.contains(className)
  }

  function extractMovieData(targetEvent) {
    const imdbId = targetEvent.dataset.imdbid
    const key = targetEvent.dataset.videoKey
    const backdrop = targetEvent.querySelector("img")
    const title = targetEvent.querySelector(".card-info__title")
    const year = targetEvent.querySelector(".card-info__year")
    const runtime = targetEvent.querySelector(".card-info__runtime")
    const type = targetEvent.querySelector(".card-info__type")
    const overview = targetEvent.querySelector(".card-info__overview")

    return {
      imdbId,
      key,
      backdropSrc: backdrop.src,
      title: title.textContent,
      year: year.textContent,
      runtime: runtime.textContent,
      type: type.textContent,
      overview: overview.textContent,
    }
  }

  function updateMovieDetails(movieData) {
    movieDetails.innerHTML = `
      <div class="year">${movieData.year}</div>
      <span>•</span>
      <div class="runtime">${movieData.runtime}</div>
      <span>•</span>
      <div class="type">${movieData.type}</div>
      <div class="imdbId">${movieData.imdbId}</div>
      <div class="key">${movieData.key}</div>
    `
  }

  function updateMovieBackdrop(movieData) {
    movieBackdrop.src = movieData.backdropSrc
    movieBackTitle.textContent = movieData.title
    movieBackYear.textContent = movieData.year
    movieBackRunTime.textContent = movieData.runtime
    movieOverview.textContent = movieData.overview
  }

  async function fetchData(URL) {
    const res = await fetch(URL)
    const data = await res.json()
    const results = data.results
    return results
  }

  async function fetchNew(URL3) {
    const res = await fetch(URL3)
    const data = await res.json()
    return data
  }

  async function fetchMovie(searchURL) {
    const res = await fetch(searchURL)
    const data = await res.json()
    const des = data.description
    return des
  }

  async function latest() {
    // const URL1 = `https://imdb.iamidiotareyoutoo.com/search?q=&tt=tt14846026`
    const URL1 = `https://api.themoviedb.org/3/movie/tt14846026/videos?api_key=${apiKey}`

    const res = await fetch(URL1)
    const data = await res.json()
    console.log(data)
  }
  // latest()
  createEl()
})
