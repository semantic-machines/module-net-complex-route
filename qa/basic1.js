/**
 * You can specify OS/browsers in `drivers` method
 */
var webdriver = require('selenium-webdriver'),
    FAST_OPERATION = 2000, // ms time limit for fast operations
    SLOW_OPERATION = 9000, // ms time limit for slow operations
    EXTRA_SLOW_OPERATION = 16000, // ms time limit for extra slow operations
    SERVER_ADDRESS = (process.env.TRAVIS_BUILD_NUMBER === undefined)?'http://veda:8080/':'http://localhost:8080/';
    //SERVER_ADDRESS = (process.env.TRAVIS_BUILD_NUMBER === undefined)?'http://live.semantic-machines.com:8080/':'http://127.0.0.1:8080/';

webdriver.promise.controlFlow().on('uncaughtException', function(e) {
  console.trace(e, e.stack);
  process.exit(1);
});

function errrorHandlerFunction(e, message) {
  console.trace(message, e.message, e.stack);
  process.exit(1);
}

module.exports = {
    FAST_OPERATION: FAST_OPERATION,
    SLOW_OPERATION: SLOW_OPERATION,
    EXTRA_SLOW_OPERATION: EXTRA_SLOW_OPERATION,
    getDrivers: function () {
        if (process.env.TRAVIS_BUILD_NUMBER === undefined) {
            return [
                {'os': 'Windows 7', 'browser': 'chrome', 'version': '43.0'},
                //{'os': 'Windows 7', 'browser': 'firefox', 'version': '40.0'},
                //{'os': 'Windows 7', 'browser': 'opera', 'version': '32.0'},
                //{'os': 'Windows 7', 'browser': 'internet explorer', 'version': '11.0'}
            ];
        } else {
            return [
                //{'os': 'Windows 10', 'browser': 'chrome', 'version': '43.0'},
                //{'os': 'Windows 8.1', 'browser': 'chrome', 'version': '43.0'},
                {'os': 'Windows 7', 'browser': 'chrome', 'version': '43.0'},
                //{'os': 'Windows XP', 'browser': 'chrome', 'version': '43.0'},
                //{'os': 'Linux', 'browser': 'chrome', 'version': '43.0'},
                //{'os': 'Windows 10', 'browser': 'internet explorer',    'version': '11.0'},
                //{'os': 'Windows 8.1', 'browser': 'internet explorer',    'version': '11.0'},
                //{'os': 'Windows 7', 'browser': 'internet explorer',    'version': '11.0'},
                //{'os': 'Windows 7', 'browser': 'opera', 'version': '11.64'},
                //{'os': 'Windows XP', 'browser': 'opera', 'version': '11.64'},
                //{'os': 'Linux', 'browser': 'opera', 'version': '12.15'},
                //{'os': 'Windows 10', 'browser': 'firefox', 'version': '40.0'},
                //{'os': 'Windows 8.1', 'browser': 'firefox', 'version': '40.0'},
                //{'os': 'Windows 7', 'browser': 'firefox', 'version': '40.0'},
                //{'os': 'Windows XP', 'browser': 'firefox', 'version': '40.0'},
                //{'os': 'Linux', 'browser': 'firefox', 'version': '40.0'}
            ] ;
        }
    },
    getThreeDrivers: function () {
         if (process.env.TRAVIS_BUILD_NUMBER === undefined) {
              return [
                  {'os': 'Windows 7', 'browser': 'chrome', 'version': '43.0'},
                  {'os': 'Windows 7', 'browser': 'internet explorer', 'version': '11.0'},
                  //{'os': 'Windows 7', 'browser': 'firefox', 'version': '46.0'}
              ];
         } else {
              return [
                  {'os': 'Windows 7', 'browser': 'chrome', 'version': '43.0'},
                  //{'os': 'Windows 7', 'browser': 'firefox', 'version': '46.0'},
                  {'os': 'Windows 7', 'browser': 'internet explorer', 'version': '11.0'}
              ];
         }
    },
    getDriver: function (driver) {
        if (process.env.TRAVIS_BUILD_NUMBER === undefined)
        {
            // for remote tetsing via local selenium
            if (process.env.LOCAL === undefined)
            {
                return new webdriver.Builder().usingServer('http://selenium-local:4444/wd/hub').withCapabilities({
                //return new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities({
                    platform: driver.os,
                    browserName : driver.browser,
                    version : driver.version,
                    'screenResolution' : '1280x960',
                    ignoreZoomSetting : true,
                    proxy : {proxyType: 'direct'}
                }).build();
            } else {
                // for local testing in chrome
                return new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
            }
        } else {
            // for remote testing via Sauce Labs
            return new webdriver.Builder().usingServer('http://localhost:4445/wd/hub').withCapabilities({
                platform: driver.os,
                browserName : driver.browser,
                version : driver.version,
                'screenResolution' : '1280x960',
                'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER,
                build : process.env.TRAVIS_BUILD_NUMBER,
                username: process.env.SAUCE_USERNAME,
                accessKey: process.env.SAUCE_ACCESS_KEY
            }).build();
        }
    },
    openPage: function (driver, driverAbout, path) {
        if (path === undefined) {
            driver.get(SERVER_ADDRESS).then(function() {
                console.log('****** GET NEW PAGE. PLATFORM > '+driverAbout.os+' / '+driverAbout.browser+' / '+driverAbout.version);
            });
        } else {
            driver.get(SERVER_ADDRESS+path).then(function() {
                console.log('****** GET NEW PAGE. PLATFORM > '+driverAbout.os+' / '+driverAbout.browser+' / '+driverAbout.version);
            });
        }
        driver.manage().window().setSize(1280, 960);
        //driver.manage().window().maximize();
    },

//------------------------------------------------------
    /**
     * Заполнить ссылочный атрибут значением из выпадающего списка
     * @param driver
     * @param attribute - rdf:type атрибута, который будет заполнятся выбором из выпадающего списка
     * @param valueToSearch - значение, которое будет введено в строку поиска
     * @param valueToChoose - значение, которое будет выбрано как результат поиска (без учёта регистра; если не указано, будет использовано значение value)
     * @param phase - текущая фаза теста
     */
    chooseFromDropdown: function(driver, attribute, valueToSearch, valueToChoose, phase) {
        driver.findElement({css:'div[rel="'+attribute+'"] + veda-control input.fulltext.tt-input'}).sendKeys(valueToSearch)
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot find attribute `"+attribute+"`")});
        driver.sleep(FAST_OPERATION);
        // Проверяем что запрашивамый объект появился в выпадающем списке
        driver.wait
        (
            function () {
                return driver.findElements({css:'div[rel="'+attribute+'"] + veda-control.fulltext div.tt-suggestion>p'}).then(function (suggestions) {
                    return webdriver.promise.filter(suggestions, function(suggestion) {
                        return suggestion.getText().then(function(txt){return txt.toLowerCase() == valueToChoose.toLowerCase() });
                    }).then(function(x) { return x.length>0; });
                });
            },
            SLOW_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot find `"+valueToSearch+"` from dropdown")});
        // Кликаем на запрашиваемый тип в выпавшем списке
        driver.findElements({css:'div[rel="'+attribute+'"] + veda-control.fulltext div.tt-suggestion>p'}).then(function (suggestions) {
            webdriver.promise.filter(suggestions, function(suggestion) {
                return suggestion.getText().then(function(txt){
                    if (valueToChoose == undefined) {
                        return txt.toLowerCase() == valueToSearch.toLowerCase();
                    } else {
                        return txt.toLowerCase() == valueToChoose.toLowerCase();
                    }
                });
            }).then(function(x) { x[0].click();});
        }).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on `"+valueToChoose+"` from dropdown")});
    },

    /**
     * Клик по элементу
     * @param element - элемент
     */
    clickUp: function (element, message) {
        element.click()
            .thenCatch(function(e) {errrorHandlerFunction(e, message)})
    },

    /**
    * Обработчик ошибок
    */
    errorHandler: function(e, message) {
        errrorHandlerFunction(e, message)
    },

    /**
     * Выполнение задачи
     * @param driver
     * @param task - задача
     * @param selector
     * @param message - сообщение ошибки
     * @param something - данные для ввода в поле
     */
    execute: function(driver, task, selector, message, something) {
        if (task === 'click') {
            driver.findElement({css:'' + selector + ''}).click()
                .thenCatch(function (e) {errrorHandlerFunction(e, message);});
        }
        if (task === 'clear') {
            driver.findElement({css:'' + selector + ''}).clear()
                .thenCatch(function (e) {errrorHandlerFunction(e, message);});
        }
        if (task === 'sendKeys') {
            driver.findElement({css:'' + selector + ''}).sendKeys(something)
                .thenCatch(function (e) {errrorHandlerFunction(e, message);});
        }
    },

    /**
     * Поиск небходимого элемента среди всех таких элементов
     * @param driver
     * @param element - элемента
     * @param number - номер элемента
     * @param message - сообщение ошибки
     * @returns {!promise.Promise.<R>|!goog.Promise|*}
     */
    findUp: function (driver, element, number, message) {
        return driver.findElements({css:'' + element + ''}).then(function (result) {
            return result[number];
        }).thenCatch(function (e) {errrorHandlerFunction(e, message);});
    },

    /**
     * Проверка кнопки на активность
     * @param driver
     * @param element - элемент который проверяем.
     * @param time - промежуток времени, втечение которого проверяем.
     * @param phase - текущая фаза теста
     */
    isEnabled: function (driver, element, time, phase) {
        driver.wait
        (
            webdriver.until.elementIsEnabled(driver.findElement({css:''+ element +''})),
            time
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Seems `" + element + "` is not enabled");});
    },

    /**
     * Проверка элемента на видимость
     * @param driver
     * @param element - элемент который проверяем.
     * @param time - промежуток времени, втечение которого проверяем.
     * @param phase - текущая фаза теста
     */
    isVisible: function (driver, element, time, phase) {
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:''+ element +''})),
            time
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Seems `" + element + "` is not visible");});
    },

    /**
    * @param login - логин пользователя
    * @param password - пароль пользователя
    * @param assertUserFirstName - имя пользователя (для проверки коректности входа)
    * @param assertUserLastName - фамилия пользователя (для проверки коректности входа)
    * @param phase - текущая фаза теста
    */
    login: function (driver, login, password, assertUserFirstName, assertUserLastName, phase) {
        // Вводим логин и пароль
        //driver.sleep(FAST_OPERATION/10);
        driver.navigate().refresh();
        driver.sleep(SLOW_OPERATION/2);
        driver.findElement({css:'input#login'}).sendKeys(login).thenCatch(function (e) {
            errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot input login")});
        driver.findElement({css:'input#password'}).sendKeys(password).thenCatch(function (e) {
            errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot input password")});
        driver.findElement({css:'button#submit'}).click().thenCatch(function (e) {
            errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot submit login/password")});
        driver.findElement({css:'button#submit'}).sendKeys(webdriver.Key.ENTER).thenCatch(function (e) {})
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot press enter")});
        //driver.sleep(FAST_OPERATION/2);
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({id:'user-info'})),
            FAST_OPERATION/10
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Login:Seems 'user-info' is not visible");});

        // Проверям что мы залогинены корректно
        driver.wait
        (
            webdriver.until.elementTextContains(driver.findElement({id:'user-info'}), assertUserFirstName),
            FAST_OPERATION/10
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Login:Cannot find user first name")});

        driver.wait
        (
            webdriver.until.elementTextContains(driver.findElement({id:'user-info'}), assertUserLastName),
            FAST_OPERATION/10
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Login:Cannot find user last name")});
    },

    /**
     * logout
     * @param driver
     * @param phase - текущая фаза теста
     */
    logout: function(driver, phase) {
        driver.executeScript("document.querySelector('#menu').scrollIntoView(true)")
            .thenCatch(function(e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Logout:Cannot scroll to settings button");});
        driver.sleep(FAST_OPERATION * 2);
        driver.findElement({id:'menu'}).click()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Logout:Cannot click on settings button");});
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:'li[id="menu"] li[resource="v-l:Exit"]'})),
            FAST_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Logout:Seems there is no `exit` button inside menu");});
        driver.findElement({css:'li[id="menu"] li[resource="v-l:Exit"]'}).click()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Logout:Cannot click on `exit` button");});
        FAST_OPERATION;
        driver.findElement({css:'input[id="login"]'}).clear()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Logout:Cannot clear 'login' field");});
        driver.findElement({css:'input[id="password"]'}).clear()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Logout:Cannot clear 'password' field");});
    },

    /**
     * Открытие вкладки в меню
     * @param driver
     * @param submenu - вкладка
     * @param phase - текущая фаза теста
     */
    menu: function (driver, submenu, phase) {
        driver.findElement({id:'menu'}).click()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on settings button");});
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:'li[id="menu"] li[resource="v-l:' + submenu + '"]'})),
            SLOW_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Seems " + submenu + " is not visible");});
        driver.findElement({css:'li[id="menu"] li[resource="v-l:' + submenu + '"]'}).click()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on `" + submenu + "` button");});
    },

    /**
    * Открыть форму создания документа определённого шаблона
    * @param driver
    * @param templateName - имя шаблона, документ которого создается
    * @param templateRdfType - rdf:type шаблона, документ которого создается
    * @param phase - текущая фаза теста
    */
    openCreateDocumentForm: function (driver, templateName, templateRdfType, phase) {
        // Клик `Документ` в главном меню
        driver.findElement({id:'menu'}).click()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on settings button")});

        // Проверяем что открылось подменю
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:'li[id="menu"] li[resource="v-l:Create"]'})),
            FAST_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Seems there is no `create` button inside menu")});

        // Клик `Создать`
        driver.findElement({css:'li[id="menu"] li[resource="v-l:Create"]'}).click()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on `create` button")});

        // Проверяем что открылась страница создания документов
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:'div[resource="v-fc:Create"]'})),
            FAST_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Create template was not opened")});

        // Вводим запрашиваемый тип документа
        driver.findElement({css:'input.fulltext.tt-input'}).clear();
        driver.findElement({css:'input.fulltext.tt-input'}).sendKeys(templateName)
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot enter template name")});

        driver.sleep(FAST_OPERATION);
        // Проверяем что запрашиваемый тип появился в выпадающем списке
        driver.wait
        (
            function () {
                return driver.findElements({css:'veda-control.fulltext div.tt-suggestion>p'}).then(function (suggestions) {
                    return webdriver.promise.filter(suggestions, function(suggestion) {
                        return suggestion.getText().then(function(txt){ return txt == templateName });
                    }).then(function(x) { return x.length>0; });
                });
             },
            SLOW_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Dropdown doesnt contains value `"+templateName+"`")});

        // Кликаем на запрашиваемый тип в выпавшем списке
        driver.findElements({css:'veda-control.fulltext div.tt-suggestion>p'}).then(function (suggestions) {
            webdriver.promise.filter(suggestions, function(suggestion) {
                return suggestion.getText().then(function(txt){ return txt == templateName });
            }).then(function(x) { x[0].click();});
        }).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on `"+templateName+"` from dropdown")});

        // Проверяем что тип появился на экране
        if (templateRdfType === 'v-s:RequestDelegationUser' || templateRdfType === 'v-wf:Net' || templateRdfType === 'v-s:Person') {
            driver.wait
            (
                webdriver.until.elementIsVisible(driver.findElement({css:'div[typeof="'+templateRdfType+'"]'})),
                SLOW_OPERATION
            ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Seems that create operation not works properly")});
            return;
        } // Имеет нестандартный шаблон
         driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:'span[about="'+templateRdfType+'"]'})),
            FAST_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Seems that create operation not works properly")});
    },
    /**
    * Открыть форму полнотекстового поиска, при этом выбрать поиск внутри определённого шаблона
    *
    * @param templateName - имя шаблона, документ которого ищется
    * @param templateRdfType - rdf:type шаблона, документ которого ищется
    */
    openFulltextSearchDocumentForm: function (driver, templateName, templateRdfType, phase) {
        // Клик `Документ` в главном меню
        driver.findElement({css:'li[id="menu"]'}).click()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on settings button")});

        // Проверяем что открылось подменю
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:'li[id="menu"] li[resource="v-l:Find"]'})),
            FAST_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Seems there is no `search` button inside settings")});

        // Клик `Поиск`
        driver.findElement({css:'li[id="menu"] li[resource="v-l:Find"]'}).click()
            .thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on `search` button")});

        // Проверяем что открылась страница поиска
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:'div[resource="v-fs:Search"]'})),
            FAST_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Search template was not opened")});

        // Вводим запрашиваемый тип документа
        driver.findElement({css:'div[typeof="v-fs:FulltextRequest"] input.fulltext.tt-input'}).clear();
        driver.findElement({css:'div[typeof="v-fs:FulltextRequest"] input.fulltext.tt-input'}).sendKeys(templateName);

        driver.sleep(FAST_OPERATION);
        // Проверяем что запрашиваемый тип появился в выпадающем списке
        driver.wait
        (
            function () {
                return driver.findElements({css:'veda-control.fulltext div.tt-suggestion>p'}).then(function (suggestions) {
                    return webdriver.promise.filter(suggestions, function(suggestion) {
                        return suggestion.getText().then(function(txt){ return txt === templateName + " (" + templateRdfType + ")" });
                    }).then(function(x) { return x.length>0; });
                });
            },
          SLOW_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Dropdown doesnt contains value `"+templateName+"`")});

        // Кликаем на запрашиваемый тип в выпавшем списке
        driver.findElements({css:'veda-control.fulltext div.tt-suggestion>p'}).then(function (suggestions) {
            webdriver.promise.filter(suggestions, function(suggestion) {
                return suggestion.getText().then(function(txt){ return txt === templateName + " (" + templateRdfType + ")" });
            }).then(function(x) { x[0].click();});
        }).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on `"+templateName+"` from dropdown")});

        // Проверяем что тип появился на экране
        driver.wait
        (
            webdriver.until.elementIsVisible(driver.findElement({css:'div[rel="v-fs:typeToSearch"] span[about="'+templateRdfType+'"]'})),
            SLOW_OPERATION
        ).thenCatch(function (e) {errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Seems that find operation not works properly")});
    }
};
