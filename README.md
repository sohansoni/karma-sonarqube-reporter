# karma-sonarqube-reporter
[![npm version](https://img.shields.io/npm/v/karma-sonarqube-reporter.svg?style=flat-square)](https://www.npmjs.com/package/karma-sonarqube-reporter)
[![Build Status](https://travis-ci.org/fadc80/karma-sonarqube-reporter.svg?branch=master)](https://travis-ci.org/fadc80/karma-sonarqube-reporter)
[![Coverage Status](https://coveralls.io/repos/github/fadc80/karma-sonarqube-reporter/badge.svg?branch=master)](https://coveralls.io/github/fadc80/karma-sonarqube-reporter?branch=master)  

> A [Karma][1] reporter plugin for generating [SonarQube][2] generic test reports.

## Installation

`npm install karma-sonarqube-reporter --save-dev`

## Configuration

Adjust your `karma.conf.js` file:

**Create a new plugin entry**

```typescript
plugins: [
  require('karma-sonarqube-reporter')
]
```

**Add configuration parameters**

```javascript
// Configuration example
sonarqubeReporter: {
  basePath: 'src/app',        // test files folder
  filePattern: '**/*spec.ts', // test files glob pattern
  outputFolder: 'reports',    // report destination
  encoding: 'utf-8',          // report encoding
  legacyMode: 'false',        //default value is false, 
	/**
   * legacyMode decides the root element name of the test execution report xml, 
   * legacyMode = true ==> root Element Name will be "testExecutions", legacyMode = false ==> root Element Name will be "unitTest"
   *
	 * For Sonarqube version prior to 6.2, it expects below format for test execution report
	 * 
	 *  <unitTest version='1'>
	 *      <file path='test/webapp/sample/simpleJunitSpec.ts'>
	 *          <testCase name='Simple Test' duration='2'/>
	 *      </file>
	 *  </unitTest>
	 *
	 *  From 6.2 onwards, Sonarqube expects below format for test execution report
	 *
	 *   <testExecutions version='1'>
	 *      <file path='test/webapp/sample/simpleJunitSpec.ts'>
	 *          <testCase name='Simple Test' duration='2'/>
	 *      </file>
	 *    </testExecutions>
	 *
	 *    To support both format, legacyMode property can be be used.
	 */ 
  reportName: (metadata) => { // report name callback
    /**
     * Report metadata array content:
     * - metadata[0] = browser name
     * - metadata[1] = browser version
     * - metadata[2] = plataform name
     * - metadata[3] = plataform version
     */
     return metadata.concat('xml').join('.');
  }
}
```

**Activate `sonarqube` reporter**

```typescript
reporters: ['sonarqube']
```

Click [here][3] to see a full example.


## Running

If your project uses [Angular CLI][4] run `ng test` and check the output folder.

```command
$ ls reports
firefox.54.0.0.linux.0.0.0.xml
chrome.65.0.3325.linux.0.0.0.xml
```
The report files' schema is defined on the [SonarQube Generic Test Data][5] page.

Add the following property to your `sonar-project.properties`: (For version 6.2 onwards)

```
sonar.testExecutionReportPaths= \
  reports/firefox.54.0.0.linux.0.0.0.xml, \
  reports/chrome.65.0.3325.linux.0.0.0.xml
```

Add the following property to your `sonar-project.properties`: (For version prior to 6.2)

```
sonar.genericcoverage.unitTestReportPaths= \
  reports/firefox.54.0.0.linux.0.0.0.xml, \
  reports/chrome.65.0.3325.linux.0.0.0.xml
```


Finally, start [SonarQube Scanner][6] on your project folder.

That's all!

[1]: https://karma-runner.github.io/2.0/index.html
[2]: https://www.sonarqube.org/
[3]: https://github.com/fadc80/karma-sonarqube-reporter/blob/master/karma.conf.js
[4]: https://github.com/angular/angular-cli
[5]: https://docs.sonarqube.org/display/SONAR/Generic+Test+Data#GenericTestData-GenericExecution
[6]: https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner
