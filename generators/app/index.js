'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const simpleGit = require('simple-git/promise');
const execSync = require('child_process').execSync;

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay('Welcome to the impressive ' + chalk.red('generator-oui-bot') + ' generator!')
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'your bot name',
        default: this.appname
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }
  async createBotFolder() {
    this.log('Create Bot Folder');
    try {
      execSync('mkdir ' + this.props.name);
      console.log('Create Bot Folder ok.');
    } catch (error) {
      console.log('Create Bot Folder failed :', error);
    }
  }
  async downloadTock() {
    this.log('Downloading Tock Boilerplate Project');
    try {
      await simpleGit().clone(
        'git@github.com:voyages-sncf-technologies/tock-bot-open-data.git'
      );
      execSync('mv tock-bot-open-data ' + this.props.name);
      console.log('Git clone ok.');
    } catch (error) {
      console.log('Git clone failed :', error);
    }
  }
  downloadNlp() {
    this.log('Downloading Tock Nlp Docker File');
    try {
      execSync(
        'curl -o ' +
          this.props.name +
          '/docker-compose.yml https://raw.githubusercontent.com/voyages-sncf-technologies/tock-docker/master/docker-compose.yml'
      );
      console.log('Docker download ok.');
    } catch (error) {
      console.log('Docker download failed :', error);
    }
  }
  downloadTagVersion() {
    this.log('Downloading Tock Env File');
    try {
      execSync(
        'curl -o' +
          this.props.name +
          '/.env https://raw.githubusercontent.com/voyages-sncf-technologies/tock-docker/master/.env'
      );
      console.log('Env download ok.');
    } catch (error) {
      console.log('Env download failed :', error);
    }
  }
  renameFileBot() {
    this.log('Rename Bot');
    try {
      execSync(
        'mv ' +
          this.props.name +
          '/tock-bot-open-data ' +
          this.props.name +
          '/bot-kotlin-client'
      );
      console.log('Rename Bot ok.');
    } catch (error) {
      console.log('Rename Bot failed :', error);
    }
  }
  writing() {
    // Create README
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath(this.props.name + '/README.md'),
      {
        name: this.props.name
      }
    );
    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath(this.props.name + '/.gitignore'),
      {
        name: this.props.name
      }
    );
  }
};
