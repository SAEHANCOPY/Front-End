document.addEventListener('DOMContentLoaded', function() {
    const noticeForm = document.getElementById('noticeForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const apiUrl = 'https://www.saehan-pulis-hing.com/public/createPost.php'; // API URL
    const token = localStorage.getItem('authToken'); // 사용자 토큰
    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크
    const role = localStorage.getItem('role');

    noticeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('noticeTitle').value;
        const content = document.getElementById('noticeContent').value;

        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = '../Login/Login.html';
            return;
        }

        // POST 요청
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                title: title,
                content: content,
                token: token,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('공지사항이 등록되었습니다.');
                window.location.href = '../Noticelist/Noticelist.html';
            } else {
                alert('공지사항 등록에 실패했습니다: ' + data.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('서버와의 통신 중 문제가 발생했습니다.');
        });
    });

    cancelBtn.addEventListener('click', function() {
        if (confirm('작성을 취소하시겠습니까? 입력한 내용은 저장되지 않습니다.')) {
            window.location.href = '../Noticelist/Noticelist.html';
        }
    });

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
            const cartLink = document.querySelector('.main-nav a[href*="cartlist"]');
            const orderListLink = document.querySelector('.main-nav a[href*="orderlist"]');
        
            // 기존 링크를 숨기고 새로운 링크 추가
            if (cartLink) cartLink.remove();
            if (orderListLink) orderListLink.remove();
        
            const nav = document.querySelector('.main-nav');
            const orderConfirmLink = document.createElement('a');
            orderConfirmLink.href = '../Adminorderlist/Adminorderlist.html';
            orderConfirmLink.textContent = '주문 관리';
            orderConfirmLink.className = 'nav-item';
        
            // 공지 링크를 기준으로 이전에 추가
            const noticeLink = document.querySelector('.main-nav a[href*="noticelist"]');
            if (noticeLink) {
                nav.insertBefore(orderConfirmLink, noticeLink);
            }
        }        
    } else {
        // 토큰이 없으면 로그인 링크 유지
        redirectToLogin();

        // 로그인 필요한 링크에 경고 추가
        restrictedLinks.forEach(link => {
            if (link.id !== 'loginLink' && link.id !== 'HomeLink' ) { // 홈 및 로그인 제외
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