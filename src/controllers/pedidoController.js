import pedidoModel from '../models/PedidoModel.js';
import prisma from '../utils/prismaClient.js';

export const criar = async (req, res) => {
    try {
        if (!req.body || !req.body.clienteId) {
            return res.status(400).json({ error: 'Dados insuficientes.' });
        }

        const { clienteId, criadoEm } = req.body;

        const cliente = await prisma.cliente.findUnique({
            where: { id: Number(clienteId) }
        });

        if (!cliente || cliente.ativo !== true) {
            return res.status(403).json({ error: 'Cliente inexistente ou inativo.' });
        }

        const pedido = new pedidoModel({ 
            clienteId: Number(clienteId), 
            total: 0, 
            status: 'ABERTO', 
            criadoEm: criadoEm ? new Date(criadoEm) : new Date() 
        });

        const data = await pedido.criar();

        res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
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
        res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }
        const pedido = await pedidoModel.buscarPorId(parseInt(id));
        if (!pedido) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }
        res.json({ data: pedido });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
       const { id } = req.params;
        const pedido = await pedidoModel.buscarPorId(parseInt(id));

        if (!pedido) return res.status(404).json({ error: 'Registro não encontrado.' });

        if (req.body.clienteId !== undefined) pedido.clienteId = req.body.clienteId;
        if (req.body.total !== undefined) pedido.total = req.body.total;
        if (req.body.status !== undefined) pedido.status = req.body.status;
        if (req.body.criadoEm !== undefined) pedido.criadoEm = new Date(req.body.criadoEm);

        const data = await pedido.atualizar();
        res.json({ message: `Pedido ID ${id} atualizado com sucesso!`, data });
    } catch (error) {
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