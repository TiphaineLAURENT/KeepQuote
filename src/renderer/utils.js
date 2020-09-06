'use strict';

String.prototype.title = function() {
    return this.replaceAll("_", " ").replace(/\b\w+/g, function(s) {
        return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
    });
};