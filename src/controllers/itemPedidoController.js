import itemPedidoModel from '../models/itemPedidoModel.js';

export const criar = async (req, res) => {
    try {
        const pedidoId = parseInt(req.params.id);
        const { produtoId, quantidade } = req.body;

        if (!produtoId) {
            return res.status(400).json({ error: 'O campo "produtoId" é obrigatório!' });
        }
        if (!quantidade) {
            return res.status(400).json({ error: 'O campo "quantidade" é obrigatório!' });
        }

        const item = new itemPedidoModel(
            null,
            parseInt(pedidoId),
            parseInt(produtoId),
            parseInt(quantidade),
        );
        const data = await item.criar();

        res.status(201).json({ message: 'Item criado com sucesso!', data });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        const { itemId } = req.params;
        const idParaBuscar = itemId || req.params.id;

        
        const itemModel = new itemPedidoModel(parseInt(idParaBuscar));
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
        res.json({ message: `O registro "${data}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { itemId } = req.params;

        const itemModel= new itemPedidoModel(parseInt(itemId));
        const exists = await itemModel.buscarPorId();

        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }
        await itemModel.deletar();
        res.json({
            message: `O registro "${itemId}" foi deletado com sucesso!`,
            deletado: exists,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
