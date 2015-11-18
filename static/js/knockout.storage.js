(function(ko) {

    // Don't crash on browsers that are missing sessionStorage
    if (typeof (sessionStorage) === "undefined") { return; }

    ko.extenders.persist = function(target, key) {

        var initialValue = target();

        // Load existing value from sessionStorage if set
        if (key && sessionStorage.getItem(key) !== null) {
            try {
                initialValue = JSON.parse(sessionStorage.getItem(key));
            } catch (e) {
            }
        }
        target(initialValue);

        // Subscribe to new values and add them to sessionStorage
        target.subscribe(function (newValue) {
            sessionStorage.setItem(key, ko.toJSON(newValue));
        });
        return target;

    };

})(ko);