document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    const isAdmin = username === '1102';

    const apiUrl = isAdmin 
        ? 'https://www.saehan-pulis-hing.com/public/loginAdmin.php' // 관리자 로그인 API
        : 'https://www.saehan-pulis-hing.com/public/login.php';     // 사용자 로그인 API

    const formData = new URLSearchParams();
    formData.append('id', username);
    formData.append('password', password);

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') { // 'status' 필드를 검사
            alert('로그인 성공!');

            // 토큰을 로컬 스토리지에 저장
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('role', data.role);

            // 이후 요청에 사용될 기본 Authorization 헤더 설정
            fetch.defaults = {
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            };

            // 홈 페이지로 리디렉션
            window.location.href = '../Home/Home.html';
        } else {
            errorMessage.textContent = data.message || '아이디 또는 비밀번호가 잘못되었습니다.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    });

});

document.addEventListener('DOMContentLoaded', function() {

    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (token) {
        // 토큰이 존재하면 로그인 상태로 처리
        loginLink.textContent = '로그아웃';
        loginLink.href = '#';
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });

        // 상단 바 수정: userId가 1102일 경우
        if (role === 'admin') {
            const cartLink = document.querySelector('.main-nav a[href*="Cartlist"]');
            const orderListLink = document.querySelector('.main-nav a[href*="Orderlist"]');
        
            // 기존 링크를 숨기고 새로운 링크 추가
            if (cartLink) cartLink.remove();
            if (orderListLink) orderListLink.remove();
        
            const nav = document.querySelector('.main-nav');
            const orderConfirmLink = document.createElement('a');
            orderConfirmLink.href = '../Adminorderlist/Adminorderlist.html';
            orderConfirmLink.textContent = '주문 관리';
            orderConfirmLink.className = 'nav-item';
        
            // 공지 링크를 기준으로 이전에 추가
            const noticeLink = document.querySelector('.main-nav a[href*="Noticelist"]');
            if (noticeLink) {
                nav.insertBefore(orderConfirmLink, noticeLink);
            }
        }        
    } else {
        // 토큰이 없으면 로그인 링크 유지
        redirectToLogin();

        // 로그인 필요한 링크에 경고 추가
        restrictedLinks.forEach(link => {
            if (link.id !== 'loginLink' && link.id !== 'HomeLink') { // 홈 및 로그인 제외
                link.addEventListener('click', function (e) {
                    e.preventDefault(); // 기본 동작 막기
                    alert('로그인이 필요합니다.');
                    window.location.href = '../Login/Login.html'; // 로그인 페이지로 리디렉션
                });
            }
        });
    }

    // 로그아웃 처리 함수
    function logout() {
        alert('로그아웃 되었습니다.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        redirectToLogin();
        window.location.href = '../Home/Home.html';
    }

    // 로그인 페이지로 리디렉션
    function redirectToLogin() {
        loginLink.textContent = '로그인';
        loginLink.href = '../Login/Login.html';
    }
});