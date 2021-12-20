class ReproValidator {
  constructor(issueBody, user) {
    this.issueBody = issueBody;
    this.user = user;
  }

  _hasSnackOrRepo() {
    // Code adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-repro.yml#L22
    const regexp = new RegExp(
      `https?:\\/\\/((github\\.com\\/${this.user}\\/[^/]+\\/?[\\s\\n]+)|(snack\\.expo\\.dev\\/.+))`,
      'gm'
    );
    return this.issueBody.search(regexp) !== -1;
  }

  // Heuristic way to guess with some confidence that a snippet has some JS/TS code
  _hasJavaScriptOrTypeScriptCode() {
    // This method is splitted into separate methods for easier testing
    const testConditionsArr = [
      this._hasFunctions(),
      this._hasVariables(),
      this._hasBackticks(),
      this._hasImports(),
      this._hasExports(),
      this._hasJSX(),
    ];
    // Code adopted from https://stackoverflow.com/a/42317235/9999202
    const percentOfConditionsMet =
      testConditionsArr.filter(Boolean).length / testConditionsArr.length;

    return percentOfConditionsMet >= 0.5;
  }

  _hasFunctions() {
    const functionsRegex = new RegExp(
      '(function\\s.*\\(.*\\)\\s?{.*)|(\\w+\\(.*\\))|(\\)\\s?=>\\s?)',
      'gm'
    );
    return this.issueBody.search(functionsRegex) !== -1;
  }

  _hasVariables() {
    const variablesRegex = new RegExp('(const|let|var)\\s\\w+\\s+=', 'gm');
    return this.issueBody.search(variablesRegex) !== -1;
  }

  _hasBackticks() {
    const backticksRegex = /```/gm;
    return this.issueBody.search(backticksRegex) !== -1;
  }

  _hasImports() {
    const importsRegex = new RegExp('import\\s.*from\\s(\'|").*(\'|")', 'gm');
    return this.issueBody.search(importsRegex) !== -1;
  }

  _hasExports() {
    const exportsRegex = new RegExp('export\\s(const|var|let|function|default)', 'gm');
    return this.issueBody.search(exportsRegex) !== -1;
  }

  _hasJSX() {
    const jsxRegex = new RegExp('(<\\w+)|(<\\/\\w+>)', 'gm');
    return this.issueBody.search(jsxRegex) !== -1;
  }

  isReproValid() {
    return this._hasJavaScriptOrTypeScriptCode() || this._hasSnackOrRepo();
  }
}

module.exports = ReproValidator;