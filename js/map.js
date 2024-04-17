var container = document.getElementById("map");
var options = {
    center: new kakao.maps.LatLng(37.582336, 127.001844),
    level: 3,
};
var map = new kakao.maps.Map(container, options);

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 인포윈도우를 생성하고 초기화하지만, 아직은 지도에 표시하지 않습니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 초기 마커 위치 설정
var initialPosition = new kakao.maps.LatLng(37.582336, 127.001844);
var initialMarker = new kakao.maps.Marker({
    map: map,
    position: initialPosition,
});

// 초기 마커에 대한 인포윈도우 설정
kakao.maps.event.addListener(initialMarker, "click", function () {
    infowindow.setContent(
        '<div style="padding:5px;font-size:12px;">여기는 어디인가요?</div>'
    );
    infowindow.open(map, initialMarker);
});

// 검색 결과 목록과 마커를 표출하는 함수입니다
function searchPlaces() {
    var keyword = document.getElementById("keyword").value;

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
        alert("키워드를 입력해주세요!");
        return;
    }

    // 키워드로 장소를 검색합니다
    ps.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        var bounds = new kakao.maps.LatLngBounds();

        for (var i = 0; i < data.length; i++) {
            displayMarker(data[i]);
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        map.setBounds(bounds);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
    } else {
        alert("검색 결과를 가져오는 데 실패했습니다.");
    }
}

function displayMarker(place) {
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
    });

    kakao.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
            '<div style="padding:5px;font-size:12px;">' +
                place.place_name +
                "</div>"
        );
        infowindow.open(map, marker);
    });
}
