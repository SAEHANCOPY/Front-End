document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 기존 에러 메시지 제거
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        // 유효성 검사
        let isValid = true;

        // 아이디 검사
        const username = document.getElementById('username').value;
        if (username.length < 4) {
            showError('username', '아이디는 4자 이상이어야 합니다.');
            isValid = false;
        }

        // 비밀번호 검사
        const password = passwordInput.value;
        if (password.length < 8) {
            showError('password', '비밀번호는 8자 이상이어야 합니다.');
            isValid = false;
        }

        // 비밀번호 확인
        if (password !== confirmPasswordInput.value) {
            showError('confirmPassword', '비밀번호가 일치하지 않습니다.');
            isValid = false;
        }

        // 이메일 검사
        const email = document.getElementById('email').value;
        if (!isValidEmail(email)) {
            showError('email', '유효한 이메일 주소를 입력해주세요.');
            isValid = false;
        }

        // 주소 관련 입력값 가져오기
        const postcode = document.getElementById('postcode').value;
        const address = document.getElementById('address').value;
        const detailAddress = document.getElementById('detailAddress').value;

        // 유효성 검사 통과 시 서버로 데이터 전송
        if (isValid) {
            const formData = new URLSearchParams();
            formData.append('name', document.getElementById('name').value);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirmedPassword', confirmPasswordInput.value);
            formData.append('phoneNumber', document.getElementById('phone').value);
            formData.append('id', username);
            formData.append('postcode', postcode);
            formData.append('address', address);
            formData.append('detailAddress', detailAddress);

            // fetch API를 사용하여 서버로 POST 요청 보내기
            fetch('https://www.saehan-pulis-hing.com/public/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            })
            .then(response => {
                if (response.ok) {
                    alert('회원가입이 성공적으로 완료되었습니다!');
                    window.location.href = '../Login/Login.html'; // 로그인 페이지로 이동
                } else {
                    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
            });
        }
    });

    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

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