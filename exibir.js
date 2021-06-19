const TMDB_ENDPOINT = 'https://api.themoviedb.org/3';
const API_KEY = '53ef64079e9ac440e77f2516ea1c1fcb';
const IMG_PREFIX = 'https://image.tmdb.org/t/p/w500';

let generos = {}

function carregarFilme (){
	carregaGeneros()
	
	let id = location.href.split('#')[1]
	
	enviarRequisicao(id, visualizarFilme)
}

function carregaGeneros(){
	let xhr = new XMLHttpRequest ()

    xhr.open ('GET','https://api.themoviedb.org/3/movie/550?api_key=53ef64079e9ac440e77f2516ea1c1fcb')
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

    xhr.open ('GET','https://api.themoviedb.org/3/movie/'+path+'?language=pt-BR&api_key=53ef64079e9ac440e77f2516ea1c1fcb')
    xhr.onload = callback
    xhr.send()
}

function formatarData(data){
	let [ year, month, day ] = data.split('-')
	
	return `${day}/${month}/${year}`
}

function genero(genre){
	return genre.map(genre => genre.name).join(', ')
}

function visualizarFilme () {	
    let filme = JSON.parse (this.responseText)
	
	let titulo = filme.title;
	let imagem = IMG_PREFIX + filme.backdrop_path;
	let sinopse = filme.overview.slice(0, 213);
	if(filme.overview.length > 216)
		sinopse += '...'
			
	let textoHTML = `<div class="carousel-item active">
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
				<p><b>Genero:</b> ${genero(filme.genres)} </p>
				<p><b>Estreia:</b> ${formatarData(filme.release_date)}</p>
				<p><b>Elenco:</b> Nao tem API</p>
				<p><b>Avaliação:</b> ${filme.vote_average} IMDb
				</p>
			</div>
		</div>
	</div>`;
	
    document.querySelector('.carousel-inner').innerHTML = textoHTML
}

function pesquisaFilmes (){
    let xhr = new XMLHttpRequest ()

    let query = document.getElementById ('inputPesquisa').value

    xhr.open ('GET', TMDB_ENDPOINT + '/search/movie?api_key=' + API_KEY + '&query=' + query)
    xhr.onload = exibeFilmes
    xhr.send()
}