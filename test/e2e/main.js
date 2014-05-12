/*describe('Tripbox', function() {
    describe('sin estar logueado', function() {
        it('redirecciona a la pantalla de login al acceder a vista restringida sin estar logueado', function() {
            // Carga la vista de grupos
            browser.get('/#/groups');
            loginUrl = browser.getCurrentUrl();

            browser.get('/#/');
            expect(browser.getCurrentUrl()).toEqual(loginUrl);

        });

        it('permite el login con Facebook', function() {
            // Loguea usuario en facebook.com
            browser.driver.get('https://facebook.com/').then(function() {
                browser.driver.findElement(by.css('#email')).sendKeys('benito_gciywls_kamelas@tfbnw.net');
                browser.driver.findElement(by.css('#pass')).sendKeys('frontend');

                browser.driver.findElement(by.css('#loginbutton input')).click();


                // Va a la aplicacion y hace click en el boton de login.
                browser.get('/#/').then(function() {
                    element(by.css('.btn-facebook')).click();
                    browser.waitForAngular();

                    browser.driver.sleep(2000);

                    expect(browser.getCurrentUrl()).toEqual('http://localhost:9000/#/groups');
                });
            });
        });
    });


}); */

describe('estando logueado', function() {
    it('permite crear un grupo', function() {
        // Falla por que al navegar a groups retorna a / (BUG)
        browser.get('/#/groups').then(function() {
            expect(browser.getCurrentUrl()).toEqual('http://localhost:9000/#/groups');
            browser.waitForAngular();
            element(by.css('#addgroup button')).click().then(function() {
                // browser.wait(function() {
                //     return isElementPresent(by.css('.edit-group-name'));
                // }, 8000);
                element(by.css('.edit-group-name')).sendKeys('GenteGuapa');
                element(by.name('descripcion')).sendKeys('Pues eso');
                element(by.css('.modal-footer .btn-primary')).click().then(function() {
                    var groups = element.all(by.repeater('group in groups'));
                    expect(elems.count()).toBe(1);



                });
            });
        });
    });
});