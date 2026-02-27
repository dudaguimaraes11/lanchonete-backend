import ClienteModel from './models/ClienteModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, telefone, email ,cpf,cep,logradouro,bairro,localidade,uf,ativo} = req.body;

        if (!nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        if (!telefone === undefined || telefone === null) return res.status(400).json({ error: 'O campo "telefone" é obrigatório!' });
        if (!email === undefined || email === null)
            return res.status(400).json({ error: 'O campo "email" é obrigatório!' });
        if (!cpf === undefined || cpf === null)
            return res.status(400).json({ error: 'O campo "cpf" é obrigatório!' });
        if (!cep === undefined || cep === null)
            return res.status(400).json({ error: 'O campo "cep" é obrigatório!' });
        if (!logradouro === undefined || logradouro === null)
            return res.status(400).json({ error: 'O campo "logradouro" é obrigatório!' });
        if (!bairro === undefined || bairro === null)
            return res.status(400).json({ error: 'O campo "bairro" é obrigatório!' });
        if (!localidade === undefined || localidade === null)
            return res.status(400).json({ error: 'O campo "localidade" é obrigatório!' });
        if (!uf === undefined || uf === null)
            return res.status(400).json({ error: 'O campo "uf" é obrigatório!' });

        const cliente = new ClienteModel({
            nome,
            telefone,
            email,
            cpf,
            cep,
            logradouro,
            bairro,
            localidade,
            uf,
            ativo
        });
        const data = await cliente.criar();

        res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ClienteModel.buscarTodos(req.query);

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

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        res.json({ data: cliente });
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

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }
        // nome,
            telefone,
            email,
            cpf,
            cep,
            logradouro,
            bairro,
            localidade,
            uf,
            ativo

        if (req.body.nome !== undefined) cliente.nome = req.body.nome;
        if (req.body.telefone !== undefined) cliente.telefone = req.body.telefone;
        if (req.body.email !== undefined) cliente.email = req.body.email;
        if (req.body.cpf !== undefined) cliente.cpf = parseFloat(req.body.cpf);
        if (req.body.cep !== undefined) cliente.cep = req.body.cep;
        if (req.body.logradouro !== undefined) cliente.logradouro = req.body.logradouro;
        if (req.body.bairro !== undefined) cliente.bairro = req.body.bairro;
        if (req.body.localidade !== undefined) cliente.localidade = req.body.localidade;
        if (req.body.uf !== undefined) cliente.uf = req.body.uf;
        if (req.body.ativo !== undefined) cliente.ativo = req.body.ativo;


        const data = await cliente.atualizar();

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

        const exemplo = await ClienteModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await exemplo.deletar();

        res.json({ message: `O registro "${exemplo.nome}" foi deletado com sucesso!`, deletado: exemplo });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
