import { useState, type FormEvent } from 'react'

interface ProdutoFormProps {
  onCadastrar: (nome: string, preco: number) => Promise<boolean>
}

function ProdutoForm({ onCadastrar }: ProdutoFormProps) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cadastrou = await onCadastrar(nome, Number(preco))

    if (cadastrou) {
      setNome('')
      setPreco('')
    }
  }

  return (
    <form className="produto-form" onSubmit={handleSubmit}>
      <h2>Cadastrar produto</h2>

      <label>
        Nome
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </label>

      <label>
        Preço
        <input
          type="number"
          min="0"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
      </label>

      <button type="submit">Cadastrar</button>
    </form>
  )
}

export default ProdutoForm
