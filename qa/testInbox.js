var basic = require('./basic1.js'),
    complexRoute = require('./complexRoute.js'),
    timeStamp = ''+Math.round(+new Date()/1000);


/**
 * Отправка задачи
 * @param driver
 * @param valueToSearch - значение, которое будет введено в качестве получателя задачи
 * @param valueToChoose - значение, которое будет выбрано в качестве получателя задачи
 */

function sendTask(driver, valueToSearch, valueToChoose, phase) {
    basic.openCreateDocumentForm(driver, 'Тестовый шаблон комплексного маршурута', 's-wf:ComplexRouteTest', 1);
    driver.findElement({css:'#save.action'}).click().thenCatch(function (e) {
      errrorHandlerFunction(e, "****** PHASE#" + phase + " : ERROR = Cannot click on save button")});
    basic.isVisible(driver, 'span[about="v-s:SendTask"]', basic.FAST_OPERATION * 2, 1);
    basic.execute(driver, "click", 'span[about="v-s:SendTask"]', "****** PHASE#1 > Create task : ERROR = Cannot click on SendTask button");
    basic.isVisible(driver, 'a[about="v-wf:instructionRouteStartForm"]', basic.FAST_OPERATION * 2, 1);
    basic.execute(driver, "click", 'a[about="v-wf:instructionRouteStartForm"]', "****** PHASE#1 > Create task : ERROR = Cannot click on Instruction link");
    basic.isVisible(driver, 'div.modal-dialog.modal-lg', basic.FAST_OPERATION * 2, 1);
    basic.chooseFromDropdown(driver, 'v-s:responsible', valueToSearch, valueToChoose, 1);
    basic.execute(driver, "sendKeys", 'veda-control[property="rdfs:comment"] textarea.form-control',
        "****** PHASE#1 > Create task : ERROR = Cannot fill Comment field", timeStamp);
    basic.isEnabled(driver, 'div.modal-dialog.modal-lg button#send', basic.FAST_OPERATION * 2, 1);
    basic.execute(driver, "click", 'div.modal-dialog.modal-lg button#send', "****** PHASE#1 > Create task : ERROR = Cannot click on Send button");
    driver.sleep(basic.FAST_OPERATION * 3);
    basic.execute(driver, 'click', 'a[href="#/v-l:Welcome"]', "****** PHASE#1 > Create task : ERROR = Cannot click on 'Welcome' button");
}


/**
 * 0. Open Page -> login(as ivanovrt);
 * 1. Create task(bushenevvt - executor) -> Send task;
 * 2. Check tasks(as ivanovrt)(Inbox: 2, Outbox: 3, Completed: 0) -> Check tasks(as bushenevvt) (Inbox: 1, Outbox: 0, Completed: 0);
 * 3. Accept task(as bushenevvt) -> Check tasks(as bushenevvt)(Inbox: 0, Outbox: 0, Completed: 1) ->
 *    -> Check tasks(as kaprovrt) (Inbox: 2, Outbox: 2, Completed: 0) -> Accept task(as ivanovrt) -> Check tasks(as bushenevvt)(Inbox: 0, Outbox: 0, Completed: 1) ->
 *    -> Check tasks(as kaprovrt) (Inbox: 1, Outbox: 1, Completed: 1) -> Accept task(as bushenevvt) -> Check tasks(as bushenevvt)(Inbox: 0, Outbox: 0, Completed: 1) ->
 *    -> Check tasks(as kaprovrt) (Inbox: 0, Outbox: 0, Completed: 2)
 *
 * 0. Открываем страницу -> Входим в систему под ivanovrt;
 * 1. Создаем задачу(bushenevvt - исполнитель) -> Отправляем задачу;
 * 2. Проверяем количество задач(bushenevvt(1; 0; 0), ivanovrt(2; 3; 0))
 * 3. Исполняем задачу(за bushenevvt) -> Проверяем количество задач(bushenevvt(0; 0; 1), ivanovrt(2; 2; 0)) ->
 *    -> Исполняем задачу(за ivanovrt) -> Проверяем количество задач(bushenevvt(0; 0; 1), ivanovrt(1; 1; 1)) ->
 *    -> Исполняем задачу(за ivanovrt) -> Проверяем количество задач(bushenevvt(0; 0; 1), ivanovrt(0; 0; 2));
 */


basic.getDrivers().forEach(function (drv) {
    //PHASE#0: Login
    var driver = basic.getDriver(drv);
    basic.openPage(driver, drv);
    basic.login(driver, 'ivanovrt', '123', '5', 'Администратор5', 0);

    //PHASE#1: Create task
    sendTask(driver, 'Администратор3', 'Администратор3 : Программист', 1);
    sendTask(driver, 'Администратор5', 'Администратор5 : Аналитик', 1);
    sendTask(driver, 'Администратор5', 'Администратор5 : Коммерческий директор', 1);
    basic.logout(driver, 1);

    //PHASE#2: Check tasks
    complexRoute.checkTasks(driver, 1, 0, 0, 'bushenevvt', '123', '3', 'Администратор3', 2);
    complexRoute.checkTasks(driver, 2, 3, 0, 'ivanovrt', '123', '5', 'Администратор5', 2);

    //PHASE#3: Accept + Check
    complexRoute.acceptTask(driver, '0', '-', '-', 'bushenevvt', '123', '3', 'Администратор3', 3, 'Администратор4', 'Администратор4 : Аналитик');
    complexRoute.checkTasks(driver, 0, 0, 1, 'bushenevvt', '123', '3', 'Администратор3', 3);
    complexRoute.checkTasks(driver, 2, 2, 0, 'ivanovrt', '123', '5', 'Администратор5', 3);
    complexRoute.acceptTask(driver, '0', '-', '-', 'ivanovrt', '123', '5', 'Администратор5', 3, 'Администратор4', 'Администратор4 : Аналитик');
    complexRoute.checkTasks(driver, 0, 0, 1, 'bushenevvt', '123', '3', 'Администратор3', 3);
    complexRoute.checkTasks(driver, 1, 1, 1, 'ivanovrt', '123', '5', 'Администратор5', 3);
    complexRoute.acceptTask(driver, '0', '-', '-', 'ivanovrt', '123', '5', 'Администратор5', 3, 'Администратор4', 'Администратор4 : Аналитик');
    complexRoute.checkTasks(driver, 0, 0, 1, 'bushenevvt', '123', '3', 'Администратор3', 3);
    complexRoute.checkTasks(driver, 0, 0, 2, 'ivanovrt', '123', '5', 'Администратор5', 3);

    driver.quit();
});
