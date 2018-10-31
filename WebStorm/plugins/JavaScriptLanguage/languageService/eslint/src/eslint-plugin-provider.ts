import {ESLintPlugin} from "./eslint-plugin";

class ESLintPluginFactory implements LanguagePluginFactory {
    create(state: PluginState): { languagePlugin: LanguagePlugin; readyMessage?: any } {
        return {languagePlugin: new ESLintPlugin(state)};
    }
}

let factory = new ESLintPluginFactory();

export {factory};