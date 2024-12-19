// Topbar.js
document.addEventListener('DOMContentLoaded', function () {
    const topbarContainer = document.getElementById('topbarContainer');

    // 공용 Topbar HTML 파일 로드
    fetch('../components/TopbarTemplate.html')
        .then(response => response.text())
        .then(data => {
            topbarContainer.innerHTML = data;

            // Topbar 스크립트 로직 초기화
            initTopbar();
        })
        .catch(error => console.error('Topbar를 로드하는 중 오류가 발생했습니다:', error));

    function initTopbar() {
        const loginLink = document.getElementById('loginLink');

        // 로그인 상태 확인
        const token = localStorage.getItem('authToken');

        if (token) {
            // 토큰이 존재하면 로그인 상태로 처리
            loginLink.textContent = '로그아웃';
            loginLink.href = '#';
            loginLink.addEventListener('click', function (e) {
                e.preventDefault();
                logout();
            });
        } else {
            // 토큰이 없으면 로그인 링크 유지
            redirectToLogin();
        }

        // 로그아웃 처리 함수
        function logout() {
            alert('로그아웃 되었습니다.');
            localStorage.removeItem('authToken');
            redirectToLogin();
        }

        // 로그인 페이지로 리디렉션
        function redirectToLogin() {
            loginLink.textContent = '로그인';
            loginLink.href = '../Login/Login.html';
        }
    }
});
