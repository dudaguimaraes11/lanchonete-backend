import pedidoModel from '../models/PedidoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { clienteId, total, status, criadoEm } = req.body;

        const pedido = new pedidoModel({ clienteId, total, status, criadoEm: Date(criadoEm) });
        const data = await pedido.criar();

        res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await pedidoModel.buscarTodos(req.query);

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

        const pedido = await pedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        res.json({ data: pedido });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
       const { id } = req.params;
        const pedido = await pedidoModel.buscarPorId(parseInt(id));

        if (!pedido) return res.status(404).json({ error: 'Registro não encontrado.' });

        // Correção das validações de campos
        if (req.body.clienteId !== undefined) pedido.clienteId = req.body.clienteId;
        if (req.body.total !== undefined) pedido.total = req.body.total;
        if (req.body.status !== undefined) pedido.status = req.body.status;
        if (req.body.criadoEm !== undefined) pedido.criadoEm = new Date(req.body.criadoEm);

        const data = await pedido.atualizar();

        res.json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidoModel.buscarPorId(parseInt(id));

        if (!pedido) return res.status(404).json({ error: 'Registro não encontrado.' });

        await pedido.deletar();

                res.json({ 
            message: `Pedido do cliente ${pedido.clienteId} deletado com sucesso!`,
            detalhes: { id, total: pedido.total, status: pedido.status }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};