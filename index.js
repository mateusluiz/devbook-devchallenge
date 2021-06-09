const cards = document.querySelector('.cards')

barraDeRolagem()
barraDePesquisa('search')
barraDePesquisa('meio-search')

let barraDeRolagemArray1 = []
let barraDeRolagemArray2 = []

let barraDePesquisa1 = []
let barraDePesquisa2 = []

async function barraDeRolagem() {
  const response = await pegaUsuariosStarGithub()
  const users = response.data

  for (const url of users) {
    const response = await pegaUrlGithub(url.url)
    barraDeRolagemArray1.push(response.data)
  }

  barraDeRolagemArray1.map(user => {
    barraDeRolagemArray2.push({avatar_url: user.avatar_url, login: user.login, name: user.name, bio: user.bio})
  })

  cards.innerHTML = barraDeRolagemArray2.map(user => {
    return `
    <div class="card">
      <img src="${user.avatar_url}" alt="">
      <div class="info">
        <div class="nome">
          <h3>${user.name}</h3>
          <p>@${user.login}</p>
        </div>
        <div class="descricao"><p>${user.bio || 'Sem descrição'}</p></div>
      </div>
    </div>
    `
  }).join('')
}

async function barraDePesquisa(tipoPesquisa) {
  const botao = document.querySelector(`.${tipoPesquisa} img`)
  const cardResultados = document.querySelector('.resultados')
  
  botao.addEventListener('click', async (e) => {

    const searchTopo = document.getElementById('pesquisa-topo').value
    const searchMeio = document.getElementById('pesquisa-meio').value
    const seVazio = searchTopo === '' || searchMeio === '' 

    if(seVazio) {
      alert('Informe um nome na pesquisa')

    } else {
    
      document.querySelector('.cabecalho').classList.add('pesquisa-on')
      document.querySelector('.container-meio').classList.add('pesquisa-on')
      document.querySelector('.pesquisa').classList.remove('off')
      document.querySelector('.pesquisa').classList.add('on')

      const parametroDaPesquisa = document.querySelector(`.${tipoPesquisa} input`).value
      document.querySelector('.nome-pesquisado').innerHTML = parametroDaPesquisa

      const response = await pesquisarUsuarioGithub(parametroDaPesquisa)
      const resultadoDaPesquisa = response.data.items
    
      for (const url of resultadoDaPesquisa) {
        const response = await pegaUrlGithub(url.url)
        barraDePesquisa1.push(response.data)
      }
    
      barraDePesquisa1.map(user => {
        barraDePesquisa2.push({avatar_url: user.avatar_url, login: user.login, name: user.name, bio: user.bio, html_url: user.html_url})
      })
    
      cardResultados.innerHTML = barraDePesquisa2.map(user => {
        return `
        <div class="card resultado-item">
          <a href="${user.html_url}">
            <img src="${user.avatar_url}" alt="">
            <div class="info">
              <div class="nome">
                <h3>${user.name || 'Sem nome'}</h3>
                <p>@${user.login}</p>
              </div>
              <div class="descricao"><p>${user.bio || 'Sem descrição'}</p></div>
            </div>
          </a>
        </div>
        `
      }).join('')

    }

  })
}

function pegaUsuariosStarGithub() {
  return axios.get(`https://api.github.com/users?sort=stars&order=desc&per_page=10`)
}

function pegaUrlGithub(url) {
  return axios.get(url)
}

function pesquisarUsuarioGithub(userName) {
  return axios.get(`https://api.github.com/search/users?q=${userName}&order=desc&per_page=9`)
}