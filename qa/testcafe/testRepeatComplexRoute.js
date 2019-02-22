import Basic from './basicComplexRoute';
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
        .typeText('veda-control[property="*"] input.form-control', 'Стартовая форма Комплексного маршрута')
        .click('small[about="v-fs:AdvancedSearchBundle"]')
        .click('span[about="v-s:UserThing"] button.btn.btn-default.button-delete')
        .click('button#custom-search-button')
        .click('table.table.table-bordered.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
        .click('h4#on-document a.label-template[typeof="s-wf:ComplexRouteTest3"]')
        .click('.action#send')
        .click('div.actions button#save_and_start_process')
    basic.logout();
    basic.login('sidorovat', '123');
    basic.checkInbox('1');
    basic.sendInbox();
      await t
        .expect(Selector('ul.nav.navbar-nav.navbar-right li#user-info').innerText).eql('Администратор7 7 ./n');
    basic.logout();

});
