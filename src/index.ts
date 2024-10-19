#!/usr/bin/env node

const chalk = require('chalk');
const { exec } = require('child_process');
const { Command } = require('commander');
const { createProject } = require('./createProject');

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




if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);
