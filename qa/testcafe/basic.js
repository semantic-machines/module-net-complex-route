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
      .click('#submit');
  }

  async logout() {
    await t
      .click('#menu')
      .click('li[id="menu"] li[resource="v-s:Exit"]');
  }
}

