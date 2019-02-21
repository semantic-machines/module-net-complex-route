import Basic from './basic';
import { Selector, t } from 'testcafe';
  fixture `test Inbox`
  .page `http://localhost:8080/`;
  const basic = new Basic();
test('testInbox', async t => {
  basic.login('ivanovrt', '123');
  var timeStamp = ''+Math.round(+new Date()/1000);
    await t
      .click('#menu')
      .click('li[id="menu"] li[resource="v-s:Create"]')
      .typeText('veda-control.fulltext.dropdown', 'Тестовый шаблон комплексного маршурута')
      .click('div.suggestion[resource="s-wf:ComplexRouteTest"]')
      .click('.action#save')
      .wait(1000)
      .click('.action#task-button')
      .click('ul#standard-tasks li a[about="v-wf:taskRouteStartForm"]')
      .typeText('veda-control.fulltext[rel="v-s:responsible"]', 'Администратор3')
      .click('div.suggestions div.suggestion[resource="td:ValeriyBushenev-Programmer1"]')
      .click('div.fulltext-menu small.actions.pull-right span.close-menu')
      .click('veda-control.fulltext[rel="v-s:responsible"]')
      .pressKey('ctrl+a delete')
      .typeText('veda-control.fulltext[rel="v-s:responsible"]', 'Администратор5')
      .click('div.suggestions div.suggestion[resource="td:RomanIvanov-CommercialDirector"]')
      .wait(2000)
      .click('div.suggestions div.suggestion[resource="td:RomanIvanov-Analyst1"]')
      .wait(2000)
      .click('div.fulltext-menu small.actions.pull-right span.close-menu')
      .typeText('veda-control[property="rdfs:comment"]', timeStamp)
      .click('div.modal-body button#send.action')
  basic.logout();
  basic.login('bushenevvt', '123');
  basic.checkInbox('1');
  basic.logout();
  basic.login('ivanovrt', '123');
  basic.checkInbox('2');
  basic.logout();
  basic.login('bushenevvt', '123');
    await t
      .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
      .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
      .click('button#send')
  basic.checkInbox('0');
  basic.logout();
  basic.login('ivanovrt', '123');
    await t
      .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
      .expect(Selector('div.result-heading small.stats-top.pull-right span.badge[property="v-fs:authorized"]').innerText).eql('2')
      .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
      .click('button#send')
  basic.checkInbox('1');
  basic.logout();
  basic.login('bushenevvt', '123');
  basic.checkInbox('0');
  basic.logout();
  basic.login('ivanovrt', '123');
    await t
      .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
      .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
      .click('button#send')
  basic.checkInbox('0');
    await t
      .expect(Selector('ul.nav.navbar-nav.navbar-right li#user-info').innerText).eql('Администратор5 5 .');
  basic.logout();
  basic.login('bushenevvt', '123');
  basic.checkInbox('0');
    await t
      .expect(Selector('ul.nav.navbar-nav.navbar-right li#user-info').innerText).eql('Администратор3 .\n');
  basic.logout();
});
