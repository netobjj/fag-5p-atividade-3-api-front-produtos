const express = require("express");

const app = express();
const PORT = 3000;

const DB_URL = "http://localhost:3001/produtos";

app.use(express.json());

// Valida nome e preço
function validarProduto(nome, preco) {
  if (!nome || typeof nome !== "string") {
    return "O campo 'nome' é obrigatório.";
  }
  if (typeof preco !== "number" || preco < 0) {
    return "O campo 'preco' deve ser um número maior ou igual a zero.";
  }
  return null;
}

async function buscarProduto(id) {
  const response = await fetch(`${DB_URL}/${id}`);

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Erro no banco de dados: ${response.status}`);
  }

  return response.json();
}

// GET ALL
app.get("/api/produtos", async (req, res) => {
  try {
    const response = await fetch(DB_URL);
    const produtos = await response.json();

    res.status(200).json(produtos);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível listar os produtos." });
  }
});

// GET:id
app.get("/api/produtos/:id", async (req, res) => {
  try {
    const produto = await buscarProduto(req.params.id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    res.status(200).json(produto);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível consultar o produto." });
  }
});

// CREATE
app.post("/api/produtos", async (req, res) => {
  const { nome, preco } = req.body;
  const erro = validarProduto(nome, preco);

  if (erro) {
    return res.status(400).json({ erro });
  }

  try {
    const response = await fetch(DB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco }),
    });
    const novoProduto = await response.json();

    res.status(201).json(novoProduto);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível cadastrar o produto." });
  }
});

// UPDATE
app.put("/api/produtos/:id", async (req, res) => {
  const { nome, preco } = req.body;
  const erro = validarProduto(nome, preco);

  if (erro) {
    return res.status(400).json({ erro });
  }

  try {
    const produto = await buscarProduto(req.params.id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    const response = await fetch(`${DB_URL}/${produto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco }),
    });
    const produtoAtualizado = await response.json();

    res.status(200).json(produtoAtualizado);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível atualizar o produto." });
  }
});

// delete
app.delete("/api/produtos/:id", async (req, res) => {
  try {
    const produto = await buscarProduto(req.params.id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    await fetch(`${DB_URL}/${produto.id}`, { method: "DELETE" });

    res.status(200).json({ mensagem: "Produto excluído com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível excluir o produto." });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
