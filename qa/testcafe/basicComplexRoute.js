import { Selector, t } from 'testcafe';

export default class basic {
  async login(login, password) {
    await t
      .click('#login')
      .pressKey('ctrl+a delete')
      .typeText('#login', login)
      .click('#password')
      .pressKey('ctrl+a delete')
      .typeText('#password', password)
      .click('#submit-login-password')
  }

  async logout() {
    await t
      .click('#menu')
      .click('li[id="menu"] li[resource="v-s:Exit"]');
  }
  async checkInbox(eql) {
    await t
      .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
      .wait(5000)
      .click('button.search-button')
      .expect(Selector('div.result-heading small.stats-top.pull-right span.badge[property="v-fs:authorized"]').innerText).eql(eql);
  }
  async sendInbox() {
    await t
      .click('ul.nav.navbar-nav.navbar-right li[about="v-ft:Inbox"]')
      .wait(5000)
      .click('button.search-button')
      .click('table.table.table-striped.table-condensed tbody.result-container a.glyphicon.glyphicon-search')
      .click('button#send')
  }
}

