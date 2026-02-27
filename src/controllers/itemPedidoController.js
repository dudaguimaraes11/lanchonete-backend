import { parse } from 'dotenv';
import itemPedidoModel from '../models/itemPedidoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados!',
            });
        }
        const { pedidoId, produtoId, quantidade, precoUnitario } = req.body;

        if (!pedidoId) return res.status(400).json({ error: 'O campo "pedidoId" é obrigatório!' });
        if (!produtoId) return res.status(400).json({ error: 'O campo "produtoId" é obrigatório!' });
        if (!precoUnitario)
            return res.status(400).json({ error: 'O campo "precoUnitario" é obrigatório!' });

        const item = new itemPedidoModel(
            null,
            parseInt(pedidoId),
            parseInt(produtoId),
            parseInt(quantidade),
            parseFloat(precoUnitario)
        );
        const data = await item.criar();

        res.status(201).json({ message: 'Item criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o item.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const itemModel= new itemPedidoModel();
        const registros = await itemModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({ message: 'Nenhum registro encontrado.' });
        }
        res.json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }
        const itemModel = new itemPedidoModel(parseInt(id));
        const data = await itemModel.buscarPorId();

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }
        res.json({ data });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }
        const itemModel= new itemPedidoModel(parseInt(id));
        const exists = await itemModel.buscarPorId();
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }
        if (req.body.pedidoId!== undefined) itemModel.pedidoId = req.body.pedidoId;
        if (req.body.produtoId !== undefined) itemModel.produtoId = req.body.produtoId;
        if (req.body.quantidade !== undefined) itemModel.quantidade = parseFloat(req.body.quantidade);
        if (req.body.precoUnitario !== undefined) itemModel.precoUnitario = req.body.precoUnitario;

        const data = await itemModel.atualizar();
        res.json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const itemModel= new itemPedidoModel(parseInt(id));
        const exists = await itemModel.buscarPorId();
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }
        await itemModel.deletar();
        res.json({
            message: `O registro "${exists.nome}" foi deletado com sucesso!`,
            deletado: exists,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
