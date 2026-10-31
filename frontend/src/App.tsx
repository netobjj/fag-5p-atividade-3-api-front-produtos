import { useEffect, useState } from 'react'
import ProdutoForm from './components/ProdutoForm'
import ProdutoLista from './components/ProdutoLista'
import type { Mensagem, Produto } from './types'

const API_URL = '/api/produtos'

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState<Mensagem | null>(null)

  async function carregarProdutos() {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`Erro ${response.status} ao listar produtos.`)
      }

      setProdutos(await response.json())
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: (erro as Error).message })
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function cadastrarProduto(nome: string, preco: number) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco }),
      })
      const dados = await response.json()

      if (!response.ok) {
        throw new Error(dados.erro ?? 'Erro ao cadastrar produto.')
      }

      setMensagem({ tipo: 'sucesso', texto: `Produto "${dados.nome}" cadastrado.` })
      await carregarProdutos()
      return true
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: (erro as Error).message })
      return false
    }
  }

  async function excluirProduto(id: number) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      const dados = await response.json()

      if (!response.ok) {
        throw new Error(dados.erro ?? 'Erro ao excluir produto.')
      }

      setMensagem({ tipo: 'sucesso', texto: dados.mensagem })
      await carregarProdutos()
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: (erro as Error).message })
    }
  }

  return (
    <main className="container">
      <h1>Produtos</h1>

      {mensagem && <p className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</p>}

      <ProdutoForm onCadastrar={cadastrarProduto} />

      <h2>Lista de produtos</h2>
      {carregando ? <p>Carregando...</p> : <ProdutoLista produtos={produtos} onExcluir={excluirProduto} />}
    </main>
  )
}

export default App
