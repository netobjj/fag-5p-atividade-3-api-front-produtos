export interface Produto {
  id: number
  nome: string
  preco: number
}

export interface Mensagem {
  tipo: 'sucesso' | 'erro'
  texto: string
}
