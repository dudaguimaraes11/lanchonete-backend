import ClienteModel from "../models/clienteModel.js";
import fetch from "node-fetch";

const buscarEnderecoPorCep = async (cep) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  return data.erro ? null : data;
};

// POST
export const criar = async (req, res) => {
  try {
    const { nome, telefone, email, cpf, cep, ativo } = req.body;

    if (!nome)
      return res.status(400).json({ erro: "O campo 'nome' é obrigatório." });

    if (!telefone)
      return res.status(400).json({ erro: "O campo 'telefone' é obrigatório." });

    if (!email)
      return res.status(400).json({ erro: "O campo 'email' é obrigatório." });

    if (!cpf)
      return res.status(400).json({ erro: "O campo 'cpf' é obrigatório." });

    let endereco = {};

    if (cep) {

      if (!/^\d{8}$/.test(cep)) {
        return res
          .status(400)
          .json({ erro: "CEP deve conter exatamente 8 dígitos numéricos." });
      }

      endereco = await buscarEnderecoPorCep(cep);

      if (!endereco) {
        return res.status(400).json({ erro: "CEP não encontrado." });
      }
    }

    const cliente = new ClienteModel({
      nome,
      telefone,
      email,
      cpf: String(cpf),
      cep: cep || null,
      logradouro: endereco?.logradouro || null,
      bairro: endereco?.bairro || null,
      localidade: endereco?.localidade || null,
      uf: endereco?.uf || null,
      ativo: ativo ?? true,
    });

    const data = await cliente.criar();

    return res.status(201).json(data);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Erro ao criar cliente." });
  }
};


// GET
export const buscarTodos = async (req, res) => {
  try {
    const registros = await ClienteModel.buscarTodos(req.query);

    if (!registros || registros.length === 0) {
      return res.status(200).json({ mensagem: "Nenhum cliente encontrado." });
    }

    return res.status(200).json(registros);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar clientes." });
  }
};

// GetById

export const buscarPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res
        .status(400)
        .json({ erro: "ID inválido. Informe um número válido." });

    const cliente = await ClienteModel.buscarPorId(id);

    if (!cliente)
      return res.status(404).json({ erro: "Cliente não encontrado." });

    return res.status(200).json(cliente);
} catch (e) {
  console.error(e);
  return res.status(400).json({ erro: e.message });
}
};

// UPDATE

export const atualizar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido." });

    const { nome, telefone, email, cpf, cep, ativo } = req.body;

    let endereco = null;

    if (cep) {
      if (!/^\d{8}$/.test(cep)) {
        return res.status(400).json({ erro: "CEP deve conter exatamente 8 dígitos numéricos." });
      }

      endereco = await buscarEnderecoPorCep(cep);

      if (!endereco)
        return res.status(400).json({ erro: "CEP não encontrado." });
    }

    const cliente = new ClienteModel({
      id,
      nome,
      telefone,
      email,
      cpf: String(cpf),
      cep: cep || null,
      logradouro: endereco?.logradouro || null,
      bairro: endereco?.bairro || null,
      localidade: endereco?.localidade || null,
      uf: endereco?.uf || null,
      ativo,
    });

    const data = await cliente.atualizar();

    if (!data) return res.status(404).json({ erro: "Cliente não encontrado." });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao atualizar cliente." });
  }
};

// DELETE
export const deletar = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ erro: "ID inválido. Informe um número válido." });
    }

    const cliente = await ClienteModel.buscarPorId(id);

    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado." });
    }

    const data = await cliente.deletar();

    return res.status(200).json({ mensagem: "Cliente deletado com sucesso.", data });

  } catch (error) {
    console.error(error);

    if (error.message) {
      return res.status(400).json({ erro: error.message });
    }

    return res.status(500).json({ erro: "Erro ao deletar cliente." });
  }
};