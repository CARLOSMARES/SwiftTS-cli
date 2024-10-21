#!/usr/bin/env node

const path = require('path');

const chalk = require('chalk');
const { exec } = require('child_process');
const { Command } = require('commander');
const { createProject } = require('./createProject');

const fs = require('fs');

const program = new Command();

program
    .name('SwiftTS')
    .description('CLI para generar proyectos con SwiftTS')
    .version('1.0.0');

program
    .command('new <project-name>')
    .description('Crea un nuevo proyecto con la estructura base')
    .action(async (projectName) => {
        try {
            await createProject(projectName);
        } catch (error) {
            console.error(chalk.red('Error al crear el proyecto:'), error);
            process.exit(1);
        }
    });

program
    .command('--version')
    .description('Imprime la versión de SwiftTS')
    .action(() => {
        console.log(chalk.green('SwiftTS version 1.0.0'));
    });

program
    .command('--help')
    .description('Imprime la ayuda')
    .action(() => {
        program.outputHelp();
    });

program
    .command('--help <command>')
    .description('Imprime la ayuda de un comando')
    .action((command) => {
        program.outputHelp(command);
    });

program
    .command('add <module-name>')
    .description('Añade un nuevo módulo al proyecto')
    .option('-D, --dev', 'Instalar como dependencia de desarrollo')
    .action((moduleName, options) => {
        const projectPath = process.cwd(); // Asume que se ejecuta desde el directorio del proyecto

        console.log(`Añadiendo módulo ${moduleName} al proyecto en ${projectPath}...`);

        // Determinar el tipo de instalación
        const installCommand = options.dev
            ? `npm install ${moduleName} --save-dev`
            : `npm install ${moduleName}`;

        // Ejecutar el comando en el directorio del proyecto
        exec(installCommand, { cwd: projectPath }, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error al instalar el módulo: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.red(`Error: ${stderr}`));
                return;
            }
            console.log(chalk.green(`Módulo ${moduleName} añadido con éxito.`));
            console.log(stdout);
        });
    });

program
    .command('remove <module-name>')
    .description('Elimina un módulo del proyecto')
    .option('-D, --dev', 'Eliminar como dependencia de desarrollo')
    .action((moduleName, options) => {
        const projectPath = process.cwd(); // Asume que se ejecuta desde el directorio del proyecto

        console.log(`Eliminando módulo ${moduleName} del proyecto en ${projectPath}...`);

        // Determinar el tipo de instalación
        const installCommand = options.dev
            ? `npm uninstall ${moduleName} --save-dev`
            : `npm uninstall ${moduleName}`;

        // Ejecutar el comando en el directorio del proyecto
        exec(installCommand, { cwd: projectPath }, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error al instalar el módulo: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.red(`Error: ${stderr}`));
                return;
            }
            console.log(chalk.green(`Módulo ${moduleName} eliminado con éxito.`));
            console.log(stdout);
        });
    });

program
    .command('build')
    .description('Compila el proyecto')
    .action(() => {
        console.log('Compilando el proyecto...');
        exec('npm run build', (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error al compilar el proyecto: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.red(`Error: ${stderr}`));
                return;
            }
            console.log(chalk.green('Proyecto compilado con éxito.'));
            console.log(stdout);
        });
    });

program
    .command('start')
    .description('Inicia el proyecto')
    .action(() => {
        console.log('Iniciando el proyecto...');
        exec('npm run start', (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error al iniciar el proyecto: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.red(`Error: ${stderr}`));
                return;
            }
            console.log(chalk.green('Proyecto iniciado con élida.'));
            console.log(stdout);
        });
    });

program
    .command('test')
    .description('Ejecuta las pruebas')
    .action(() => {
        console.log('Ejecutando las pruebas...');
        exec('npm run test', (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error al ejecutar las pruebas: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.red(`Error: ${stderr}`));
                return;
            }
            console.log(chalk.green('Pruebas ejecutadas conJEXEC.'));
            console.log(stdout);
        });
    });

program
    .command('dev')
    .description('Inicia el proyecto en modo de desarrollo')
    .action(() => {
        console.log('Iniciando el proyecto en modo de aplicación...');
        exec('npm run dev', (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error al iniciar el proyecto: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.red(`Error: ${stderr}`));
                return;
            }
            console.log(chalk.green('Proyecto iniciado en modo de aplicación.'));
            console.log(stdout);
        });
    });

program
    .command('vercel')
    .description('crea la configuración base para vercel')
    .action(() => {
        const vercelConfigPath = path.join(process.cwd(), 'vercel.json');

        // Comprobar si el archivo vercel.json ya existe
        if (fs.existsSync(vercelConfigPath)) {
            console.log(chalk.yellow('El archivo vercel.json ya existe. No se creará nuevamente.'));
        } else {
            // Crear la configuración básica para vercel.json
            const vercelConfig = {
                version: 2,
                builds: [
                    {
                        src: '/**/*.js',
                        use: '@vercel/node'
                    }
                ],
                routes: [
                    {
                        src: '/(.*)',
                        dest: '/$1'
                    }
                ]
            };

            // Escribir el archivo vercel.json
            fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
            console.log(chalk.green('Archivo vercel.json creado correctamente.'));
        }

        // Ejecutar el comando npm run vercel
        console.log('Ejecutando el despliegue en Vercel...');
        exec('npm run vercel', (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error al iniciar el proyecto: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.red(`Error: ${stderr}`));
                return;
            }
            console.log(chalk.green('Proyecto desplegado en Vercel.'));
            console.log(stdout);
        });
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);
