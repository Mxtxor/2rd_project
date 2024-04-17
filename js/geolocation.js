document.addEventListener("DOMContentLoaded", function () {
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerHTML =
            "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // OpenStreetMap Nominatim API를 호출하여 위치 정보를 가져옵니다. 'accept-language' 매개변수를 'en'으로 설정합니다.
    fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
    )
        .then((response) => response.json())
        .then((data) => {
            var city =
                data.address.city || data.address.town || data.address.village;
            var neighbourhood =
                data.address.neighbourhood || data.address.suburb;
            var country = data.address.country;
            document.getElementById("location").innerHTML = `${
                neighbourhood ? neighbourhood + ", " : ""
            }${city}`;
        })
        .catch((error) => {
            document.getElementById("location").innerHTML =
                "City information could not be retrieved.";
            console.error("Error:", error);
        });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("location").innerHTML =
                "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("location").innerHTML =
                "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("location").innerHTML =
                "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("location").innerHTML =
                "An unknown error occurred.";
            break;
    }
}
