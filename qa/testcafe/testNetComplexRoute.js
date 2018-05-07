import Basic from './basic';
import { Selector, t } from 'testcafe';
  fixture `test Delegation Task`
    .page `http://localhost:8080/`;
  const basic = new Basic();
  test('testDelegationTask', async t => {
    basic.login('karpovrt', '123');
      await t
        //создаём и отправляем тестовый маршрут
        .click('#menu')
        .click('li[id="menu"] li[resource="v-s:Create"]')
        .typeText('veda-control.fulltext.dropdown', 'Тестовый шаблон комплексного маршурута 0')
        .click('div.suggestion[resource="s-wf:ComplexRouteTest0"]')
        .click('.action#send')
        .click('div.actions.actions-fixed button#save_and_start_process')
    basic.logout();
    //согласование 1
    basic.login('karpovrt', '123');
    basic.sendInbox();
    basic.logout();
    basic.login('joeat', '123');
    basic.sendInbox();
    basic.logout();
    //согласование 2
    basic.login('karpovrt', '123');
    basic.sendInbox();
    basic.logout();
    //отклоняем
    basic.login('joeat', '123');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .wait(5000)
        .click('button.search-button')
        .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('div.possible-decisions.clearfix div[rel="v-wf:possibleDecisionClass"] div.radio[resource="v-wf:DecisionDeclined"] label input[name="decisionRadios"]')
        .typeText('veda-control[property="rdfs:comment"]', 'Отклонено')
        .click('button#send')
    basic.logout();
    //возвращаем на согласование 2
    basic.login('karpovrt', '123');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .wait(5000)
        .click('button.search-button')
        .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('div.possible-decisions.clearfix div[rel="v-wf:possibleDecisionClass"] div.radio[resource="v-wf:DecisionGoCoordination2"] label input[name="decisionRadios"]')
        .click('button#send')
    basic.logout();
    //согласование 2
    basic.login('joeat', '123');
    basic.sendInbox();
    basic.logout();
    basic.login('karpovrt', '123');
    basic.sendInbox();
    basic.logout();
    //проверяем задачи под joeat
    basic.login('joeat', '123');
    basic.checkInbox('2');
    basic.logout();
    //проверяем задачи под karpovrt
    basic.login('karpovrt', '123');
    basic.checkInbox('0');
    basic.logout();
    //отвечаем на задачу под joeat
    basic.login('joeat', '123');
    basic.sendInbox();
    basic.logout();
    //проверяем задачи под karpovrt
    basic.login('karpovrt', '123');
    basic.checkInbox('0');
    basic.logout();
    //отвечаем на задачу под joeat
    basic.login('joeat', '123');
    basic.sendInbox();
    basic.logout();
    //проверяем задачи под karpovrt
    basic.login('karpovrt', '123');
    basic.checkInbox('1');
    basic.logout();
    //Перенаправить -> Не мне -> Доработать -> Не выполнено -> Доработать -> Выполнено
    basic.login('karpovrt', '123');
    //basic.checkInbox('1');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .wait(5000)
        .click('button.search-button')
        .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('div.possible-decisions.clearfix div[rel="v-wf:possibleDecisionClass"] div.radio[resource="v-wf:DecisionRedirect"] label input[name="decisionRadios"]')
        .typeText('veda-control[rel="v-wf:to"]', 'АдминистраторJ')
        .click('div.suggestions div.suggestion[resource="td:AndreyJoe-Analyst2"]')
        .click('button#send')
    basic.logout();
    //не мне
    basic.login('joeat', '123');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .wait(5000)
        .click('button.search-button')
        .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('div.possible-decisions.clearfix div[rel="v-wf:possibleDecisionClass"] div.radio[resource="v-wf:DecisionNotForMe"]')
        .typeText('veda-control[property="rdfs:comment"]', 'Администратор2')
        .click('button#send')
    basic.logout();
    //доработать
    basic.login('karpovrt', '123');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .wait(5000)
        .click('button.search-button')
        .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('div.possible-decisions.clearfix div[rel="v-wf:possibleDecisionClass"] div.radio[resource="v-wf:DecisionRemake"] label input[name="decisionRadios"]')
        .typeText('veda-control[property="rdfs:comment"]', 'АдминистраторJ')
        .click('veda-control[property="v-s:dateTo"]')
        .click('button#send')
    basic.logout();
    //не выполнено
    basic.login('joeat', '123');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .wait(5000)
        .click('button.search-button')
        .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('div.possible-decisions.clearfix div[rel="v-wf:possibleDecisionClass"] div.radio[resource="v-wf:DecisionNotPerformed"] label input[name="decisionRadios"]')
        .typeText('veda-control[property="rdfs:comment"]', 'Администратор2')
        .click('button#send')
    basic.logout();
    //доработать
    basic.login('karpovrt', '123');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .wait(5000)
        .click('button.search-button')
        .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('div.possible-decisions.clearfix div[rel="v-wf:possibleDecisionClass"] div.radio[resource="v-wf:DecisionRemake"] label input[name="decisionRadios"]')
        .typeText('veda-control[property="rdfs:comment"]', 'Администратор2')
        .click('veda-control[property="v-s:dateTo"]')
        .click('button#send')
    basic.logout();
    //выполнено
    basic.login('joeat', '123');
    basic.sendInbox();
    basic.logout();
    //Контролирующий
    basic.login('karpovrt', '123');
    basic.sendInbox();
    basic.logout();
    basic.login('joeat', '123');
    basic.sendInbox();
    basic.logout();

});
