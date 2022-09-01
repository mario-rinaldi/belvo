function getAccessToken() {
    return fetch(`../token`, {method: "GET"})
        .then((response) => response.json())
        .then((data) => data.access)
        .catch((error) => console.error("Error:",error));
}

function openBelvoWidget(accessToken) {
    belvoSDK.createWidget(accessToken, {
        access_mode: 'recurrent', //single or recurrent
        country_codes: ['BR'],
        locale: 'en',
        callback: (link, institution) => successCallbackFunction(link, institution),
        onExit: (event) => console.log(event),
        onEvent: (event) => console.log(event)
    }).build();
}

async function successCallbackFunction(link, institution) {
    var socket = io()
    data = {institution: institution, link: link}
    socket.emit('callbackBelvo', data)
    socket.on('redirect', (targetPath) => {
        console.log(encodeURI(window.location.origin + targetPath))
        let element = document.querySelector('#main');
        element.innerHTML = '<div class="d-flex justify-content-center"><div ' + 
                            'class="spinner-border text-primary m-5" style="width: ' + 
                            '3rem; height: 3rem;" role="status"><span class="sr-only">' + 
                            'Loading...</span></div></div>';
        setTimeout(continueButton, 5000)
        function continueButton() {
            console.log('esperei 5 segundos')
            element.innerHTML = '<div class="d-flex justify-content-center"><div class="my-2"></div>' +
                                '<a href="' + encodeURI(window.location.origin + targetPath) + '" class="btn btn-success btn-icon-split">' +
                                '<span class="icon text-white-50">' +
                                '<i class="fas fa-check"></i></span>' +
                                '<span class="text">Click here to see the data</span></a>' +
                                '<div class="my-2"></div></div>'
        }
    });
}

async function loadBelvo() {
    getAccessToken().then(openBelvoWidget);
}