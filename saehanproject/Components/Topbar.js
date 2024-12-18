document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('loginLink');

    // 로그인 상태 확인 API 호출
    fetch('http://43.202.235.179/public/checkSession.php', {
        method: 'GET',
        credentials: 'include' // 세션 쿠키 전송
    })
    .then(response => response.json())
    .then(data => {
        if (data.logged_in) {
            // 로그인 상태: 로그아웃 링크로 변경
            loginLink.textContent = '로그아웃';
            loginLink.href = '#';
            loginLink.addEventListener('click', function (e) {
                e.preventDefault();
                logout();
            });
        } else {
            // 로그아웃 상태: 로그인 링크 유지
            loginLink.textContent = '로그인';
            loginLink.href = '../Login/Login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // 로그아웃 처리 함수
    function logout() {
        fetch('http://43.202.235.179/public/logout.php', {
            method: 'POST',
            credentials: 'include' // 세션 쿠키 전송
        })
        .then(() => {
            alert('로그아웃 되었습니다.');
            window.location.href = '../Login/Login.html';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
