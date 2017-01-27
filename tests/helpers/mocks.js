export class MockGet {
  constructor (subject) {
    this.returnMap = {};
    this.originalGet = subject.get;

    subject.get = keyName => {
      if (this.returnMap.hasOwnProperty(keyName)) {
        return this.returnMap[keyName];
      }
      return this.originalGet.call(subject, keyName);
    };
  }

  mock (keyName, returnValue) {
    this.returnMap[keyName] = returnValue;
  }
}
