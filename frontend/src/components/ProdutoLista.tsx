import type { Produto } from '../types'

interface ProdutoListaProps {
  produtos: Produto[]
  onExcluir: (id: number) => void
}

function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function ProdutoLista({ produtos, onExcluir }: ProdutoListaProps) {
  if (produtos.length === 0) {
    return <p>Nenhum produto cadastrado.</p>
  }

  return (
    <table className="produto-lista">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {produtos.map((produto) => (
          <tr key={produto.id}>
            <td>{produto.id}</td>
            <td>{produto.nome}</td>
            <td>{formatarPreco(produto.preco)}</td>
            <td>
              <button onClick={() => onExcluir(produto.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProdutoLista
