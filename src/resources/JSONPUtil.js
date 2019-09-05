// Borrowed gratefully from Shoefitr.com
export var JSONPUtil = {

    _oJsonpRequests: {},

    _iJsonpRequestCount: 0,

    // Note that query string variables 'callback' and 'echo' are appended to sUrl, so your request URL
    // must not contain either of these. Also be sure to append "?sid=" + Math.random() to the URL to avoid
    // cache hits.
    LoadJSONP: function(sUrl, f) {
        // sEcho contains the request id
        var sEcho = this._iJsonpRequestCount++;
        this._oJsonpRequests[sEcho] = f;

        var script = document.createElement('script');
        script.setAttribute('src', sUrl +
            '&callback=DispatchJsonpResponse' +
            '&echo=' + sEcho
        );

        document.body.appendChild(script);
    }
};

// Method wasn't accessible by the JSONP callback unless added to the window
window.DispatchJsonpResponse = function(oResponse, sEcho) {
    // sEcho contains the request id

    var callback = JSONPUtil._oJsonpRequests[sEcho];
    delete JSONPUtil._oJsonpRequests[sEcho];

    if (callback) {
        callback(oResponse);
    }
};