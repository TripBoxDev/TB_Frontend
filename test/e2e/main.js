describe('Integration testing', function() {

    // start at root before every test is run
    beforeEach(function() {
        browser().navigateTo('/');
    });

    it('ensures user can log in', function() {

        element('.fa-facebook').click();
        it('ensures that user sees his/her groups after log in', function() {

        });

        it('ensures that user can log out after log in', function() {

        });
    });

    it('returns error if user log in wasn\'t successful', function() {
        it('returns an error if API has failed', function() {

        });

        it('returns an error if Facebook SDK has failed', function() {

        });
    });
});