/*
 *
 * NUNCA EDITE ESTE ARQUIVO 💥
 *
 *
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { pacotesObrigatorios, pacotes, criarItens, apagar } = require('./support.js');

const log = {
    title: (msg) => console.log(`\n\x1b[36m\x1b[1m┌── ${msg} ──┐\x1b[0m`),
    action: (msg) => console.log(`\x1b[36m→ ${msg}\x1b[0m`),
    success: (msg) => console.log(`\x1b[32m✓ ${msg}\x1b[0m`),
    info: (msg) => console.log(`\x1b[90m• ${msg}\x1b[0m`),
    error: (msg) => console.log(`\x1b[31m✗ ${msg}\x1b[0m`),
    warning: (msg) => console.log(`\x1b[33m⚠ ${msg}\x1b[0m`),
};

function runCommand(command) {
    return new Promise((resolve, reject) => {
        log.action(`Executando: ${command}`);

        const proc = spawn(command, [], {
            cwd: __dirname,
            shell: true,
            stdio: 'inherit',
        });

        proc.on('exit', (code) => {
            if (code === 0) {
                log.success(`Comando finalizado: ${command}`);
                resolve();
            } else {
                log.error(`Comando falhou com código: ${code}`);
                reject(new Error(`Command failed with code ${code}`));
            }
        });

        proc.on('error', (err) => {
            log.error(`Erro ao executar comando: ${err.message}`);
            reject(err);
        });
    });
}

function criarEstrutura(basePath, estrutura) {
    for (const [nome, conteudo] of Object.entries(estrutura)) {
        const caminho = path.join(basePath, nome);

        if (typeof conteudo === 'object' && !('codigo' in conteudo)) {
            fs.mkdirSync(caminho, { recursive: true });
            log.info(`Pasta criada: ${caminho}`);
            criarEstrutura(caminho, conteudo);
        } else if ('codigo' in conteudo) {
            let codigoFinal = conteudo.codigo || '';

            if (nome === 'package.json') {
                const nomeDaPasta = path.basename(__dirname);
                codigoFinal = codigoFinal.replace('"NOME_DA_PASTA"', `"${nomeDaPasta}"`);
            }

            fs.writeFileSync(caminho, codigoFinal, 'utf8');
            log.success(`Arquivo criado: ${caminho}`);
        }
    }
}

async function instalarDependenciasBase() {
    if (!pacotesObrigatorios || pacotesObrigatorios.length === 0) {
        log.info('Nenhuma dependência base para instalar');
        return;
    }
    log.title('Instalando dependências base');
    for (const pacote of pacotesObrigatorios) {
        await runCommand(`npm install ${pacote}`);
    }
}

async function instalarPacotesExtras() {
    if (!pacotes || pacotes.length === 0) {
        log.info('Nenhum pacote extra para instalar');
        return;
    }
    log.title('Instalando pacotes extras');
    for (const pacote of pacotes) {
        await runCommand(`npm install ${pacote}`);
    }
}

async function corrigirPackageJson() {
    log.title('Corrigindo package.json');
    const packagePath = path.join(__dirname, 'package.json');

    try {
        let packageContent = { dependencies: {}, devDependencies: {} };

        if (fs.existsSync(packagePath)) {
            packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        }

        const nomeDaPasta = path.basename(__dirname);

        const packageJsonCorrigido = {
            name: nomeDaPasta,
            version: '1.0.0',
            description: '',
            main: 'server.js',
            type: 'module',
            private: true,
            scripts: {
                test: 'echo "Error: no test specified" && exit 1',
                dev: 'nodemon src/server.js',
            },
            keywords: [],
            author: '',
            license: 'MIT',
            dependencies: packageContent.dependencies || {},
            devDependencies: packageContent.devDependencies || {},
        };

        fs.writeFileSync(packagePath, JSON.stringify(packageJsonCorrigido, null, 2) + '\n', 'utf8');
        log.success('package.json corrigido com sucesso');
    } catch (erro) {
        log.error(`Erro ao corrigir package.json: ${erro.message}`);
    }
}

async function deletarPrimeiro() {
    log.title('Deletando arquivos/pastas da primeira etapa');

    if (!Array.isArray(apagar.primeiro)) {
        log.info('Nenhum item configurado em apagar.primeiro');
        return;
    }

    for (const item of apagar.primeiro) {
        const caminho = path.join(__dirname, item);
        try {
            if (fs.existsSync(caminho)) {
                const stats = fs.statSync(caminho);
                if (stats.isDirectory()) {
                    fs.rmSync(caminho, { recursive: true, force: true });
                    log.success(`Pasta removida: ${item}`);
                } else {
                    fs.unlinkSync(caminho);
                    log.success(`Arquivo removido: ${item}`);
                }
            } else {
                log.info(`Não encontrado: ${item}`);
            }
        } catch (erro) {
            log.error(`Erro ao deletar ${item}: ${erro.message}`);
        }
    }
}

async function main() {
    try {
        log.title('Iniciando SETUP INICIAL');
        criarEstrutura(__dirname, criarItens);
        await instalarDependenciasBase();
        await instalarPacotesExtras();
        await corrigirPackageJson();
        await deletarPrimeiro();

        log.success('Setup inicial concluído com sucesso!');
        log.info('➡ Ajuste o author em package.json');
        log.info('➡ Ajuste o prisma/schema.prisma para criar o modelo que desejar');
        log.info('➡ Ajuste o prisma/seed.js para criar os dados iniciais que desejar');
        log.info('➡ Execute: node amods.js');
    } catch (erro) {
        log.error(`Erro no setup inicial: ${erro.message}`);
        process.exit(1);
    }
}

main();
