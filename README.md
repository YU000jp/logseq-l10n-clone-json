# logseq-l10n-clone-json

Clone JSON files for all languages based on one translation file

## Dependencies

- Use **Microsoft Azure Cognitive Services Translation API**
- Use **[logseq-l10n](https://github.com/sethyuan/logseq-l10n)**: L10N framework for Logseq plugins

## Install

1. Clone this repo. Run command '`pnpm install`' for dependencies.
1. Edit config.js and change the API key etc. ([Azure Portal](https://portal.azure.com/))

## Usage

1. **First, set up "logseq-l10n". Then, create one translation file**.
1. Enter the file name and path in config.js.
1. Run “`node index.cjs`” command in terminal.
1. Files will be created.
   > If a file with the same name exists, it will not be updated.
1. The sample code for importing the created translation files is as follows.

```TypeScript
import { setup as l10nSetup } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import af from "./translations/af.json"
import de from "./translations/de.json"
import es from "./translations/es.json"
import fr from "./translations/fr.json"
import id from "./translations/id.json"
import it from "./translations/it.json"
import ja from "./translations/ja.json"
import ko from "./translations/ko.json"
import nbNO from "./translations/nb-NO.json"
import nl from "./translations/nl.json"
import pl from "./translations/pl.json"
import ptBR from "./translations/pt-BR.json"
import ptPT from "./translations/pt-PT.json"
import ru from "./translations/ru.json"
import sk from "./translations/sk.json"
import tr from "./translations/tr.json"
import uk from "./translations/uk.json"
import zhCN from "./translations/zh-CN.json"
import zhHant from "./translations/zh-Hant.json"

const main = async () => {
await l10nSetup({
    builtinTranslations: {//Full translations
    af, de, es, fr, id, it, ja, ko, "nb-NO": nbNO, nl, pl, "pt-BR": ptBR, "pt-PT": ptPT, ru, sk, tr, uk, "zh-CN": zhCN, "zh-Hant": zhHant
    }
})

}
```