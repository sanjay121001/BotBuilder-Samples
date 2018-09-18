// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

const Generator = require('yeoman-generator');
const _ = require("lodash");
const extend = require("deep-extend");

const p = require('../../components/prompts');
const t = require('../../components/templateWriter');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        // configure the commandline options
        p.configureCommandlineOptions(this);
    }
    prompting() {
        // if we're told to not prompt, then pick what we need and return
        if(this.options.noprompt) {
            this.props = _.pick(this.options, ["botName", "description", "language", "template"])

            // validate we have what we need, or we'll need to throw
            if(!this.props.botName) {
              throw new Error("Must specify a name for your bot when using --noprompt argument.  Use --botName or -N");
            }
            if(!this.props.description) {
                throw new Error("Must specify a description for your bot when using --noprompt argument.  Use --description or -D");
            }
            if(!this.props.language || (_.toLower(this.props.language) !== "javascript" && _.toLower(this.props.language) !== "typescript")) {
                throw new Error("Must specify a programming language when using --noprompt argument.  Use --language or -L");
            }
            if (!this.props.template || (_.toLower(this.props.template) !== "echo" && _.toLower(this.props.template) !== "basic")) {
              throw new Error("Must specify a template when using --noprompt argument.  Use --template or -T");
            }
            return;
        }

        // give the user some data before we start asking them questions
        const greetingMsg = `Welcome to the botbuilder generator.  \nMore detailed documentation can be found at https://aka.ms/botbuilder-generator`;
        this.log(greetingMsg);

        // let's ask the user for data before we generate the bot
        const prompts = p.getPrompts(this.options);

        return this.prompt(prompts).then((props) => {
            this.props = props;
            // this.log(JSON.stringify(this.props));
        });
    }

    writing() {
        if(_.toLower(this.props.template) === "echo") {
            t.writeEchoProjectFiles(this);
        } else {
            t.writeBasicProjectFiles(this);
        }
    }

    // install() {
    //     this.installDependencies({ bower: false });
    // }

    end() {
        const thankYouMsg = "------------------- \n" +
            "Your new bot is ready!  \n" +
            "Open the README.md file for more information. \n" +
            "Thank you for using the Microsoft Bot Framework. \n" +
            "\n< ** > The Bot Framework Team" ;
        this.log(thankYouMsg);
    }

};
