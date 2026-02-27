import express from 'express';
import * as controller from '../controllers/itemPedidosController.js';

const router = express.Router();

router.post('/itemPedidos', controller.criar);
router.get('/itemPedidos', controller.buscarTodos);
router.get('/itemPedidos/:id', controller.buscarPorId);
router.put('/itemPedidos/:id', controller.atualizar);
router.delete('/itemPedidos/:id', controller.deletar);

export default router;
