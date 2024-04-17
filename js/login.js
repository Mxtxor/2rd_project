// 페이지 로드 시 실행
function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: (data) => {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      } else {
        document.getElementById("userAddress1").value = '';
      }

      document.getElementById('userZipCode').value = data.zonecode;
      document.getElementById("userAddress1").value = addr;
      document.getElementById("userAddress1").value += extraAddr;
      document.getElementById("userAddress2").focus();
    }
  }).open();
}

window.addEventListener('load', () => {
  fillFormWithStoredValues(); // 로컬 스토리지에 저장된 값으로 입력 필드 자동 채우기
  populateBirthdaySelectors(); // 생일 셀렉트 박스 동적 생성
  setGenderRadioButton(); // 성별 라디오 버튼 값 설정 추가
});

const fields = [
  'userName', 'userEmail', 'userId', 'userPwd',
  'userPhone', 'userZipCode', 'userAddress1', 'userAddress2',
  'userBirthdayYear', 'userBirthdayMonth', 'userBirthdayDay' // 생일 관련 필드 추가
];

function fillFormWithStoredValues() {
  fields.forEach(field => {
    const value = localStorage.getItem(field);
    if (value) {
      document.getElementById(field).value = value;
    }
  });
}

// 성별 라디오 버튼 값 설정 함수 추가
function setGenderRadioButton() {
  const gender = localStorage.getItem('Gender');
  if (gender) {
    document.querySelector(`input[name="Gender"][id="${gender}"]`).checked = true;
  }
}

function updateLocalStorageIfChanged(key, newValue) {
  const currentValue = localStorage.getItem(key);
  if (currentValue !== newValue) {
    localStorage.setItem(key, newValue);
  }
}

// 성별 라디오 버튼 값 저장
document.querySelectorAll('input[name="Gender"]').forEach(radio => {
  radio.addEventListener('change', (event) => {
    updateLocalStorageIfChanged('Gender', event.target.id); // value 대신 id 값 저장
  });
});

function redirectToUserPage(userName) {
  const userPages = {
    '안수현': 'ahn.html',
    '변현진': 'byun.html',
    '정승수': 'jeong.html',
    '구태호': 'koo.html'
  };

  const defaultPage = 'index.html';
  const userPage = userPages[userName] || defaultPage;
  alert(`${userName} 님 환영합니다.`);
  window.location.href = userPage;
}

function populateBirthdaySelectors() {
  // 년, 월, 일 셀렉트 박스 요소 찾기
  const yearSelect = document.getElementById('userBirthdayYear');
  const monthSelect = document.getElementById('userBirthdayMonth');
  const daySelect = document.getElementById('userBirthdayDay');

  // 현재 연도 가져오기
  const currentYear = new Date().getFullYear();

  // 년도 선택 항목 채우기 (예: 1900년부터 현재 연도까지)
  for (let year = currentYear; year >= 1900; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  // 월 선택 항목 채우기 (1월부터 12월까지)
  for (let month = 1; month <= 12; month++) {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = month;
    monthSelect.appendChild(option);
  }

  // 일 선택 항목을 채우는 함수
  function updateDays() {
    // 선택된 년도와 월 가져오기
    const selectedYear = yearSelect.value;
    const selectedMonth = monthSelect.value;

    // 선택된 년도와 월에 해당하는 일수 계산
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    // 일 선택 항목 초기화
    daySelect.innerHTML = '';

    // 일 선택 항목 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const option = document.createElement('option');
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }
  }

  // 월 또는 년도 선택 시 일 선택 항목 업데이트
  yearSelect.addEventListener('change', updateDays);
  monthSelect.addEventListener('change', updateDays);

  // 로컬 스토리지에서 저장된 생년월일 값 설정
  yearSelect.value = localStorage.getItem('userBirthdayYear') || '';
  monthSelect.value = localStorage.getItem('userBirthdayMonth') || '';
  daySelect.value = localStorage.getItem('userBirthdayDay') || '';

  // 초기 일 선택 항목 채우기
  updateDays();

  // 년도, 월, 일 선택 시 로컬 스토리지에 값 저장
  yearSelect.addEventListener('change', (event) => {
    localStorage.setItem('userBirthdayYear', event.target.value);
    updateDays(); // 일 선택 항목 업데이트
  });

  monthSelect.addEventListener('change', (event) => {
    localStorage.setItem('userBirthdayMonth', event.target.value);
    updateDays(); // 일 선택 항목 업데이트
  });

  daySelect.addEventListener('change', (event) => {
    localStorage.setItem('userBirthdayDay', event.target.value);
  });
}

// 폼 제출 이벤트 처리
document.querySelector('.ticket-form').addEventListener('submit', (event) => {
  event.preventDefault(); // 폼 제출 기본 동작 막기

  // 입력 필드 값 저장
  fields.forEach(field => {
    const value = document.getElementById(field).value;
    updateLocalStorageIfChanged(field, value);
  });

  // 성별 값 저장
  const gender = document.querySelector('input[name="Gender"]:checked').id; // value 대신 id 값 저장
  updateLocalStorageIfChanged('Gender', gender);

  // 사용자 이름에 따라 다른 페이지로 이동
  const userName = document.getElementById('userName').value;
  redirectToUserPage(userName);
});