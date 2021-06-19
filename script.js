const TMDB_ENDPOINT = 'https://api.themoviedb.org/3';
const API_KEY = '53ef64079e9ac440e77f2516ea1c1fcb';
const IMG_PREFIX = 'https://image.tmdb.org/t/p/w500';

let generos = {}

function carregaFilmes (){
	carregaGeneros()
	
	enviarRequisicao('popular', filmesPopulares)
	
	enviarRequisicao('upcoming', filmesLancamentos)
}

function carregaGeneros(){
	let xhr = new XMLHttpRequest ()

    xhr.open ('GET', TMDB_ENDPOINT + '/genre/movie/list?language=pt-BR&api_key=' + API_KEY)
    xhr.onload = function(){
		let resultado = JSON.parse (this.responseText)
		
		resultado.genres.forEach(genero => {
			generos[genero.id] = genero.name
		})
	}
    xhr.send()
	
}

function enviarRequisicao(path, callback){
	let xhr = new XMLHttpRequest ()

    xhr.open ('GET', TMDB_ENDPOINT + '/movie/'+path+'?language=pt-BR&api_key=' + API_KEY)
    xhr.onload = callback
    xhr.send()
}

function formatarData(data){
	let [ year, month, day ] = data.split('-')
	
	return `${day}/${month}/${year}`
}

function genero(ids){
	return ids.map(id => generos[id]).join(', ')
}

function filmesPopulares () {
    let textoHTML = ''
	
    let filmes = JSON.parse (this.responseText)
	
	filmes.results.forEach(filme => {
		let titulo = filme.title;
		let imagem = IMG_PREFIX + filme.poster_path;
		let sinopse = filme.overview.slice(0, 433);
		if(filme.overview.length > 436)
			sinopse += '...'
		
        textoHTML += `<div class=" cardei col-12 col-sm-12 col-md-3 col-lg-3 ">
        <img class="carde" src="${imagem}"">
            <div class="card-body">
				<a href="exibir.html#${filme.id}">
					<h5 class="card-title">
						${titulo} <br>
						<a class="card-date">
							${formatarData(filme.release_date)}
						</a>
					</h5>
				</a>
                <p class="card-text">${sinopse}</p>
                <a href="exibir.html#${filme.id}" class="btn btn-primary">Abrir Filme</a>
            </div>
        </div>`
	})
	
    document.getElementById('tela').innerHTML = textoHTML
}

function filmesLancamentos () {
    let textoHTML = ''
	
    let filmes = JSON.parse (this.responseText)
	
	let i = 0;
	
	let indicators = document.querySelector('.carousel-indicators')
	
	indicators.innerHTML = ''
	
	filmes.results.forEach(filme => {
		let titulo = filme.title;
		let imagem = IMG_PREFIX + filme.backdrop_path;
		let sinopse = filme.overview.slice(0, 213);
		if(filme.overview.length > 216)
			sinopse += '...'
		
		let active = !i ? ' active' : ''
		
		textoHTML += `<div class="carousel-item${active}">
			<div class="row">
				<div class="col-12 col-sm-12 col-md-6 col-lg-6 div-l">
					<div class="carousel-img">
						<img class="carde" src="${imagem}"">
					</div>
				</div>
				<div id="filme" class="col-12 col-sm-12 col-md-6 col-lg-6 div-l filme-data">
					<a href="exibir.html#${filme.id}">
						<h2> ${titulo}</h2>
					</a>
					<p id="lancamentos"><b>Sinopse:</b> 
						${sinopse}
					</p>
					<p><b>Genero:</b> ${genero(filme.genre_ids)} </p>
					<p><b>Estreia:</b> ${formatarData(filme.release_date)}</p>
					<p><b>Elenco:</b> Nao tem API</p>
					<p><b>Avaliação:</b> ${filme.vote_average} IMDb
					</p>
				</div>
			</div>
		</div>`;
		
		let indicator = document.createElement('li')
		indicator.setAttribute('data-target', '#MiCarousel')
		indicator.className = 'carousel-pagination'
		indicator.setAttribute('data-slide-to', i)
		
		if(!i)
			indicator.classList.add('active')
		
		indicators.appendChild(indicator)
		
		i++
	})
	
    document.querySelector('.carousel-inner').innerHTML = textoHTML
}

function pesquisaFilmes (){
    let xhr = new XMLHttpRequest ()

    let query = document.getElementById ('inputPesquisa').value

    xhr.open ('GET', TMDB_ENDPOINT + '/search/movie?api_key=' + API_KEY + '&query=' + query)
    xhr.onload = exibeFilmes
    xhr.send()
}