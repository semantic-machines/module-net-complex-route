import Basic from './basic';
import { Selector, t } from 'testcafe';
  fixture `test Repeat Complex Route`
    .page `http://localhost:8080/`;
  const basic = new Basic();
  test('testRepeatComplexRoute', async t => {
    basic.login('petrovrt', '123');
      await t
        .click('#menu')
        .click('li[id="menu"] li[resource="v-s:Create"]')
        .typeText('veda-control.fulltext.dropdown', 'Тестовый шаблон комплексного маршурута 3')
        .click('div.suggestion[resource="s-wf:ComplexRouteTest3"]')
        .click('.action#send')
        .click('div.actions button#save_and_start_process')
    basic.logout();
    basic.login('sidorovat', '123');
    basic.checkInbox('1');
    basic.sendInbox();
    basic.logout();
    basic.login('petrovrt', '123');
      await t
        .click('#menu')
        .click('li[id="menu"] li[resource="v-s:Find"]')
        .typeText('veda-control[rel="v-fs:typeToSearch"]', 'Стартовая форма Комплексного маршрута')
        .click('div.suggestion[resource="s-wf:ComplexRouteStartForm"]')
        .click('div.input-group button#submit')
        .click('ul.nav.nav-tabs.nav-right li[role="presentation"] a#results-pill-ft')
        .click('div#results-ft div#search-results p[typeof="s-wf:ComplexRouteStartForm"] strong a[data-template="v-ui:ClassNameLabelTemplate"]')
        .click('h4#on-document a.label-template[typeof="s-wf:ComplexRouteTest3"]')
        .click('.action#send')
        .click('div.actions button#save_and_start_process')
    basic.logout();
    basic.login('sidorovat', '123');
    basic.checkInbox('1');
    basic.sendInbox();
      await t
        .expect(Selector('ul.nav.navbar-nav.navbar-right li#user-info').innerText).eql('7 Администратор7\n');
    basic.logout();

});
