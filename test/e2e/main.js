'use strict';
var util = require('util');
//describe('Tripbox', function() {
describe('sin estar logueado', function() {
    it('redirecciona a la pantalla de login al acceder a vista restringida sin estar logueado', function() {
        // Carga la vista de grupos
        browser.get('/#/groups');

        browser.driver.sleep(2000);

        var groupUrl = browser.getCurrentUrl();

        browser.get('/#/');

        browser.driver.sleep(2000);

        expect(browser.getCurrentUrl()).toEqual(groupUrl);


    });

    it('permite el login con Facebook', function() {
        // Loguea usuario en facebook.com
        browser.driver.get('https://facebook.com/').then(function() {
            browser.driver.findElement(by.css('#email')).sendKeys('benito_gciywls_kamelas@tfbnw.net');
            browser.driver.findElement(by.css('#pass')).sendKeys('frontend');

            browser.driver.findElement(by.css('#loginbutton input')).click();


            // Va a la aplicacion y hace click en el boton de login.
            browser.get('/#/');
            browser.driver.sleep(3000);

            browser.driver.findElement(by.css('.btn-facebook')).click();

            browser.driver.sleep(3000);

            expect(browser.getCurrentUrl()).toEqual('http://localhost:9000/#/groups');




        });
    });

    describe('estando logueado', function() {
        var groupName = 'GenteGuapa',
            groupDescription = 'Pues eso',
            ptor = protractor.getInstance();;
        it('permite crear un grupo', function() {



            browser.get('/#/groups');

            browser.driver.sleep(2000);
            expect(browser.getCurrentUrl()).toEqual('http://localhost:9000/#/groups');

            browser.driver.findElement(by.css('.add-group')).click();
            browser.driver.sleep(500);
            browser.driver.findElement(by.name('nombre')).sendKeys(groupName);
            browser.driver.findElement(by.name('descripcion')).sendKeys(groupDescription);
            browser.driver.findElement(by.css('.modal-footer .btn-primary')).click();
            browser.driver.sleep(2000);

            expect(ptor.isElementPresent(by.css('img[title=' + groupName + ']'))).toBe(true);
            //browser.driver.findElement(by.css('img[title='+groupName + ']'));
            //expect(elems.count()).toBe(1);
        });

        it('permite abandonar un grupo', function() {
            browser.get('/#/groups');
            browser.driver.sleep(2000);
            browser.driver.findElement(by.css('button[data-name=' + groupName + '].unfollow')).click();
            browser.driver.sleep(1000);
            browser.driver.findElement(by.css('.modal-footer .btn-danger')).click();
            browser.driver.sleep(1000);
            expect(ptor.isElementPresent(by.css('img[title=' + groupName + ']'))).toBe(false);



        })
    });

});