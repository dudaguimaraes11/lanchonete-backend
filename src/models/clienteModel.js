import prisma from '../utils/prismaClient.js';

// Cliente
export default class Cliente {
    constructor({ id = null, nome = null, telefone = null, email = null, cpf = null, cep = null, logradouro = null, bairro = null, localidade = null, uf = null, ativo = true } = {}) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf ? String(cpf) : null;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

// Validações 

async validacao(isUpdate = false) {

    // Nome 

    if (!this.nome || this.nome.length < 3 || this.nome.length > 100) {
        throw new Error(`Nome deve ter entre 3 e 100 caracteres.`);
    }

    // CPF 
    if (!this.cpf || !/^\d{11}$/.test(this.cpf)) {
    throw new Error('CPF deve conter exatamente 11 dígitos numéricos.');
    }

    const cpfExistente = await prisma.cliente.findMany({
        where: {
            cpf: this.cpf,
            ...(isUpdate && { id: { not: this.id } }),
        },
    });

    if (cpfExistente.length > 0) {
        throw new Error('Este CPF já está cadastrado.');
    }

    // CEP 
if (this.cep && !/^\d{8}$/.test(this.cep)) {
    throw new Error('CEP deve conter exatamente 8 dígitos numéricos.');
}
    // Telefone 

    if (!this.telefone || !/^\d{10,11}$/.test(this.telefone)) {
            throw new Error('Telefone deve ter 10 ou 11 dígitos numéricos.');
        }

    const telExistente = await prisma.cliente.findMany({
        where: {
            telefone: this.telefone,
            ...(isUpdate && {id: {not: this.id}})
        }
    })
    if (telExistente.length > 0) {
        throw new Error('Este telefone já foi cadastrado.');
    }

    // Email 
   if (!this.email || !/^\S+@\S+\.\S+$/.test(this.email)) {
            throw new Error('Email inválido.');
        }

    const emailExistente = await prisma.cliente.findMany({
        where: {
            email: this.email, 
            ...(isUpdate && { id: { not: this.id} })
        }
    }); 

    if (emailExistente.length > 0) {
        throw new Error(`Este email já foi cadastrado.`)
        }
    }

    async criar() {

        await this.validacao(false); 

        return prisma.cliente.create({
            data: {
                nome: this.nome,
                telefone: this.telefone,
                email: this.email,
                cpf: this.cpf,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo
            },
        });
    }

    async atualizar() {

        await this.validacao(true);

        return prisma.cliente.update({
            where: { id: this.id },
            data: { 
                nome: this.nome,
                 telefone: this.telefone,
                 email: this.email,
                 cpf: this.cpf,
                 cep: this.cep,
                 logradouro: this.logradouro,
                 bairro: this.bairro,
                 localidade: this.localidade,
                 uf: this.uf,
                 ativo: this.ativo},
        });
    }

   async deletar() {

    if (!this.id) {
        throw new Error('ID necessário para deletar.');
    } 

    const pedidoAberto = await prisma.pedido.findFirst({
        where: {
            clienteId: this.id,
            status: "ABERTO"
        }
    });

    if (pedidoAberto) {
        throw new Error('Não é possível deletar um cliente que possui um pedido em aberto.');
    }

    await prisma.itemPedido.deleteMany({
        where: {
            pedido: { clienteId: this.id }
        }
    });

    await prisma.pedido.deleteMany({
        where: { clienteId: this.id }
    });

    return prisma.cliente.delete({
        where: { id: this.id }
    });
}

    // GetAll
    static async buscarTodos(filtros = {}) {

        const where = {};

        // Filtra por nome (case insensitive)
        if (filtros.nome) {
        where.nome = { 
            contains: filtros.nome, 
            mode: 'insensitive' 
    };
}

        // Filtra por CPF
        if (filtros.cpf) {
            where.cpf = filtros.cpf;
        } 

        // Filtra por ativo (true or false)
        if (filtros.ativo !== undefined) {
            where.ativo = filtros.ativo === 'true';
        } 

        return prisma.cliente.findMany({ where });
    }

    // GetById
    static async buscarPorId(id) {

        const data = await prisma.cliente.findUnique({ where: { id } });

        if (!data) return null;

        return new Cliente(data);
    }
}
