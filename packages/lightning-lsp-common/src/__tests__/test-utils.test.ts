import { readAsTextDocument } from './test-utils';

// This is used to distinguish the environment of the OS, otherwise we're going to have problems with windows os routes
const FORCE_APP_ROOT = process.env.OS.toLowerCase().includes("windows") ? '../../test-workspaces/sfdx-workspace/force-app/main/default' : 'test-workspaces/sfdx-workspace/force-app/main/default';
it('readAsTextDocument()', () => {
    // reads .js file
    let document = readAsTextDocument(FORCE_APP_ROOT + '/lwc/hello_world/hello_world.js');
    // expect(document.uri).toEndWith(FORCE_APP_ROOT + '/lwc/hello_world/hello_world.js');
    expect(document.languageId).toBe('javascript');
    expect(document.getText()).toContain('LwcHelloWorld');

    // reads .html file
    document = readAsTextDocument(FORCE_APP_ROOT + '/lwc/hello_world/hello_world.html');
    // expect(document.uri).toEndWith(FORCE_APP_ROOT + '/lwc/hello_world/hello_world.html');
    expect(document.languageId).toBe('html');
    expect(document.getText()).toContain('Hello From a Lightning Web Component');

    // aura components have the html languageId in the sfdx extentions
    document = readAsTextDocument(FORCE_APP_ROOT + '/aura/helloWorldApp/helloWorldApp.app');
    expect(document.languageId).toBe('html');
    document = readAsTextDocument(FORCE_APP_ROOT + '/aura/wireLdsCmp/wireLdsCmp.cmp');
    expect(document.languageId).toBe('html');
});
