import express from 'express';
import * as pedidoController from '../controllers/pedidoController.js';
import * as itemPedidoController from '../controllers/itemPedidoController.js';

const router = express.Router();

router.post('/pedido', pedidoController.criar);
router.get('/pedido',pedidoController.buscarTodos);
router.get('/pedido/:id', pedidoController.buscarPorId);
router.put('/pedido/:id', pedidoController.atualizar);
router.delete('/pedido/:id', pedidoController.deletar);


// Rota (ItemPedido)
router.post('/pedidos/:id/itens', itemPedidoController.criar)
router.delete('/pedidos/:id/itens/:itemId', itemPedidoController.deletar);

export default router;
