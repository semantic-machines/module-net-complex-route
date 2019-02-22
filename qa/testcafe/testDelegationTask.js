import Basic from './basicComplexRoute';
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
        .typeText('veda-control.fulltext.dropdown', 'Тестовый шаблон комплексного маршурута')
        .click('div.suggestion[resource="s-wf:ComplexRouteTest"]')
        .click('.action#send')
        .click('div.actions.actions-fixed button#save_and_start_process')
        //проверяем задачу
    basic.logout();
    basic.login('karpovrt', '123');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .wait(5000)
        .click('button.search-button')
        .expect(Selector('div.result-heading small.stats-top.pull-right span.badge[property="v-fs:authorized"]').innerText).eql('1')
    basic.logout();
    basic.login('khvostiat', '123');
      await t
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .expect(Selector('div.result-heading small.stats-top.pull-right span.badge[property="v-fs:authorized"]').innerText).eql('0')
    basic.logout();
    basic.login('karpovrt', '123');
      await t
        //делаем делегирование
        .click('#menu')
        .click('li[id="menu"] li[resource="v-s:Create"]')
        .typeText('veda-control.fulltext.dropdown', 'Заявка на делегирование для пользователя')
        .click('div.suggestion[resource="v-s:RequestDelegationUser"]')
        .click('veda-control[property="v-s:dateFrom"]')
        .pressKey('ctrl+a delete')
        .typeText('veda-control[property="v-s:dateFrom"]', '01.01.2014')
        .click('veda-control[property="v-s:dateTo"]')
        .pressKey('ctrl+a delete')
        .typeText('veda-control[property="v-s:dateTo"]', '01.01.2034')
        .click('div#positions div.checkbox label span.position-label')
        .typeText('veda-control[rel="v-s:delegate"]', 'Администратор1')
        .click('div.suggestions div.suggestion[resource="td:AleksandraKhvostikova"]')
        .click('button#save')
    basic.logout();
    basic.login('khvostiat', '123');
      await t
        //проверяем появилась ли задача и отвечаем на неё
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .click('ul.nav.nav-pills li span.actor[about="td:Analyst1"]')
        .expect(Selector('div.result-heading small.stats-top.pull-right span.badge[property="v-fs:authorized"]').innerText).eql('1')
        .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('button#send')
        .wait(5000)
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .click('ul.nav.nav-pills li span.actor[about="td:Analyst1"]')
        .expect(Selector('div.result-heading small.stats-top.pull-right span.badge[property="v-fs:authorized"]').innerText).eql('0')
    basic.logout();
    basic.login('karpovrt', '123');
      await t
        //проверяем правильность ответа на задачу
        .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
        .expect(Selector('div.result-heading small.stats-top.pull-right span.badge[property="v-fs:authorized"]').innerText).eql('0')

});
