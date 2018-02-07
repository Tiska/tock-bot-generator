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
        message: 'Your bot name (should be bot-name or bot_name format)',
        default: this.appname
      },
      {
        type: 'checkbox',
        name: 'connectors',
        message: 'What connectors do you need ?',
        choices: [
          {
            name: 'Facebook',
            value: 'facebook'
          },
          {
            name: 'Google',
            value: 'google'
          }
          //
        ]
      },
      {
        type: 'checkbox',
        name: 'sentences',
        message: 'What pre trained sentences do you need ?',
        choices: [
          {
            name: 'Goodbye',
            value: 'goodbye_sentences.json'
          },
          {
            name: 'Gratitude',
            value: 'gratitude_sentences.json'
          },
          {
            name: 'Greetings',
            value: 'greetings_sentences.json'
          },
          {
            name: 'Help',
            value: 'help_sentences.json'
          },
          {
            name: 'How are You',
            value: 'how_are_you_sentences.json'
          },
          {
            name: 'Jokes',
            value: 'joke_sentences.json'
          },
          {
            name: 'Select',
            value: 'select_sentences.json'
          },
          {
            name: 'Previous Trains',
            value: 'previous_trains_sentences.json'
          },
          {
            name: 'Not understood',
            value: 'not_understood_sentences.json'
          },
          {
            name: 'Reset',
            value: 'reset_sentences.json'
          },
          {
            name: 'Next trains',
            value: 'next_trains_sentences.json'
          },
          {
            name: 'Inspiration',
            value: 'inspiration_sentences.json'
          },
          {
            name: 'Repeat',
            value: 'repeat_sentences.json'
          },
          {
            name: 'Insult',
            value: 'insult_sentences.json'
          },
          {
            name: 'No',
            value: 'no_sentences.json'
          },
          {
            name: 'Perplexity',
            value: 'perplexity_sentences.json'
          },
          {
            name: 'Wrong Answer',
            value: 'wrong_answer_sentences.json'
          },
          {
            name: 'Yes',
            value: 'yes_sentences.json'
          },
          {
            name: 'Purchase',
            value: 'purchase_sentences.json'
          },
          {
            name: 'Sorry',
            value: 'sorry_sentences.json'
          },
          {
            name: 'Who are you',
            value: 'who_are_you_sentences.json'
          }
        ]
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
      execSync('rm -r ' + this.props.name + '/tock-bot-open-data/.git');
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
  cleanResources() {
    this.log('Clean Files Resources');
    execSync(
      'rm ' +
        this.props.name +
        '/bot-kotlin-client/src/main/resources/google_actions_fr.json'
    );
    execSync(
      'rm ' + this.props.name + '/bot-kotlin-client/src/main/resources/labels.json'
    );
    execSync(
      'rm ' +
        this.props.name +
        '/bot-kotlin-client/src/main/resources/google_actions_en.json'
    );
    execSync(
      'rm ' + this.props.name + '/bot-kotlin-client/src/main/resources/bot_open_data.json'
    );
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
    this.fs.copyTpl(
      this.templatePath('bot-init.json'),
      this.destinationPath(
        this.props.name + '/bot-kotlin-client/src/main/resources/bot-init.json'
      ),
      {
        name: this.props.name
      }
    );
    this.fs.copyTpl(
      this.templatePath('kotlin/**.kt'),
      this.destinationPath(
        this.props.name + '/bot-kotlin-client/src/main/kotlin/fr/vsct/tock/bot/open/data/'
      ),
      {
        connectors: this.props.connectors,
        name: this.props.name,
        sentences: this.props.sentences
      }
    );
    if (this.props.connectors.indexOf('google') > -1) {
      this.fs.copyTpl(
        this.templatePath('connectors/GoogleAssistantConfiguration.kt'),
        this.destinationPath(
          this.props.name +
            '/bot-kotlin-client/src/main/kotlin/fr/vsct/tock/bot/open/data/GoogleAssistantConfiguration.kt'
        ),
        {
          connectors: this.props.connectors,
          name: this.props.name
        }
      );
    }
    if (this.props.connectors.indexOf('facebook') > -1) {
      this.fs.copyTpl(
        this.templatePath('connectors/MessengerConfiguration.kt'),
        this.destinationPath(
          this.props.name +
            '/bot-kotlin-client/src/main/kotlin/fr/vsct/tock/bot/open/data/MessengerConfiguration.kt'
        ),
        {
          connectors: this.props.connectors,
          name: this.props.name
        }
      );
    }
    this.fs.copyTpl(
      this.templatePath('conf.properties'),
      this.destinationPath(
        this.props.name + '/bot-kotlin-client/src/main/resources/conf.properties'
      ),
      {
        connectors: this.props.connectors,
        name: this.props.name
      }
    );
    this.props.sentences.map(sentence => {
      this.fs.copyTpl(
        this.templatePath('sentences/' + sentence),
        this.destinationPath(
          this.props.name + '/bot-kotlin-client/src/main/resources/sentences/' + sentence
        ),
        {
          connectors: this.props.connectors,
          name: this.props.name,
          sentences: this.props.sentences
        }
      );
    });
  }
};
