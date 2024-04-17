function updateDateTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0시는 12로 표시
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var day = now.getDate();
    var month = now.toLocaleString("en-US", { month: "short" });
    var year = now.getFullYear();
    var daySuffix =
        day === 1 || day === 21 || day === 31
            ? "st"
            : day === 2 || day === 22
            ? "nd"
            : day === 3 || day === 23
            ? "rd"
            : "th";

    var dateString = `${month} ${day}<sup>${daySuffix}</sup>`;
    var timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

    document.getElementById(
        "current-date-time"
    ).innerHTML = `${dateString},  ${timeString}`;
}

document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    setInterval(updateDateTime, 1000);
});
