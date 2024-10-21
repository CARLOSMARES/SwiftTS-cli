const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
export const createProject = async (projectName: string) => {

    if (!projectName) {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Ingrese el nombre del proyecto:',
                validate: function (input) {
                    if (/^([A-Za-z\-\_\d])+$/.test(input)) {
                        return true;
                    } else {
                        return 'El nombre del proyecto solo puede contener letras, números, guiones y guiones bajos.';
                    }
                }
            }
        ]);
        projectName = answers.projectName;
    }

    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.error(chalk.red(`El directorio "${projectName}" ya existe.`));
        process.exit(1);
    }

    // Preguntamos al usuario si desea inicializar un repositorio Git
    const { gitInit } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'gitInit',
            message: '¿Desea inicializar un repositorio Git?',
            default: false
        }
    ]);

    fs.mkdirSync(projectPath);

    // Crear la estructura de carpetas
    const directories = [
        'src',
        'src/controllers',
        'src/middlewares',
        'src/router',
    ];

    directories.forEach((dir) => {
        fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });

    // Crear archivos iniciales
    fs.writeFileSync(
        path.join(projectPath, 'src', 'server.ts'),
        `// src/server.ts
import http from 'http';
import { router } from './router/router';

const server = http.createServer((req, res) => {
    router(req, res);
});

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});`
    );

    fs.writeFileSync(
        path.join(projectPath, 'src', 'controllers', 'hello.ts'),
        `// src/controllers/hello.ts
import { IncomingMessage, ServerResponse } from 'http';

export const hello = (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    res.end("Hello World!");
};`
    );

    fs.writeFileSync(
        path.join(projectPath, 'src', 'middlewares', 'index.ts'),
        `// src/middlewares/index.ts
import { IncomingMessage, ServerResponse } from 'http';

export type Middleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
) => void;

export const applyMiddlewares = (
    req: IncomingMessage,
    res: ServerResponse,
    middlewares: Middleware[],
    handler: () => void
) => {
    const stack = [...middlewares];

    const next = () => {
        if (stack.length > 0) {
            const middleware = stack.shift();
            middleware && middleware(req, res, next);
        } else {
            handler();
        }
    };

    next();
};`
    );

    fs.writeFileSync(
        path.join(projectPath, 'src', 'router', 'router.ts'),
        `// src/router/router.ts
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { applyMiddlewares, Middleware } from '../middlewares/index';
import { routes } from './routes';

const middlewares: Middleware[] = [
    // Añade middlewares aquí
];

export const router = (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    const path = parsedUrl.pathname || '/';
    const method = req.method || 'GET';

    const routeKey = \`\${method} \${path}\`;
    const handler = routes[routeKey];

    if (handler) {
        applyMiddlewares(req, res, middlewares, () => handler(req, res));
    } else {
        res.statusCode = 404;
        res.end('Ruta no encontrada');
    }
};`
    );

    fs.writeFileSync(
        path.join(projectPath, 'src', 'router', 'routes.ts'),
        `// src/router/routes.ts
import { IncomingMessage, ServerResponse } from 'http';
import { hello } from '../controllers/hello';

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

export const routes: { [key: string]: RouteHandler } = {
    'GET /': hello,
};`
    );

    // Crear package.json básico
    const packageJson = {
        name: projectName,
        version: '1.0.0',
        main: 'dist/server.js',
        scripts: {
            vercel: 'vercel --prod',
            build: 'swc src -d dist',
            start: 'node dist/server.js',
            dev: 'nodemon --watch src --exec "npm run build && npm start"',
            test: 'jest',
        },
        dependencies: {},
        devDependencies: {
            "@swc/cli": "^0.1.65",
            "@swc/core": "^1.7.36",
            "jest": "^27.5.1",
            "nodemon": "^3.1.7",
            "typescript": "^4.4.4"
        },
    };

    const swcrc = {
        jsc: {
            parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: true,
            },
            target: 'es2019',
        },
        module: {
            type: 'commonjs',
        },
    };

    fs.writeFileSync(
        path.join(projectPath, '.swcrc'),
        JSON.stringify(swcrc, null, 2)
    );

    fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );

    // Inicializar Git si el usuario lo desea
    if (gitInit) {
        const { execSync } = require('child_process');
        execSync('git init', { cwd: projectPath });
        console.log(chalk.blue('Repositorio Git inicializado.'));
    }

    console.log(chalk.green(`\nProyecto "${projectName}" creado exitosamente.`));
    console.log(chalk.green(`\nPasos siguientes:`));
    console.log(chalk.green(`\n1. cd ${projectName}`));
    console.log(chalk.green(`2. npm install`));
    console.log(chalk.green(`3. npm run dev\n`));
};
