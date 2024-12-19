document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('mypageForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const token = localStorage.getItem('authToken');
    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크
    const role = localStorage.getItem('role');

    // 사용자 정보 가져오기 함수
    async function fetchUserInfo() {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch('https://www.saehan-pulis-hing.com/public/findUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error(`네트워크 오류: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                populateUserForm(data); // 사용자 정보를 폼에 채움
            } else {
                alert(data.message || '사용자 정보를 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 문제가 발생했습니다.');
        }
    }

    // 폼에 사용자 정보 채우기
    function populateUserForm(user) {
        document.getElementById('username').value = user.user.user_id;
        document.getElementById('email').value = user.user.email;
        document.getElementById('name').value = user.user.username;
        document.getElementById('phone').value = user.user.phone_number;
        document.getElementById('postcode').value = user.user.postcode;
        document.getElementById('address').value = user.user.base_address;
        document.getElementById('detailAddress').value = user.user.detail_address;
    }

    // 회원정보 수정 API 호출 함수
    async function updateUserInfo(updatedInfo) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);
            formData.append('email', updatedInfo.email);
            formData.append('username', updatedInfo.name);
            formData.append('phone_number', updatedInfo.phone);
            formData.append('postcode', updatedInfo.postcode);
            formData.append('base_address', updatedInfo.address);
            formData.append('detail_address', updatedInfo.detailAddress);

            // 비밀번호가 변경된 경우
            if (updatedInfo.password) {
                formData.append('password', updatedInfo.password);
            }

            const response = await fetch('https://www.saehan-pulis-hing.com/public/editUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error(`네트워크 오류: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                alert('회원 정보가 성공적으로 수정되었습니다.');
            } else {
                alert(data.message || '회원 정보 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        }
    }

    // 폼 제출 이벤트 처리
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 기존 에러 메시지 제거
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        // 유효성 검사
        let isValid = true;
        const updatedInfo = {
            email: document.getElementById('email').value,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            postcode: document.getElementById('postcode').value,
            address: document.getElementById('address').value,
            detailAddress: document.getElementById('detailAddress').value,
            password: passwordInput.value,
        };

        // 비밀번호 변경 시 검사
        if (passwordInput.value || confirmPasswordInput.value) {
            if (passwordInput.value.length < 8) {
                showError('password', '비밀번호는 8자 이상이어야 합니다.');
                isValid = false;
            } else if (passwordInput.value !== confirmPasswordInput.value) {
                showError('confirmPassword', '비밀번호가 일치하지 않습니다.');
                isValid = false;
            }
        }

        // 이메일 검사
        if (!isValidEmail(updatedInfo.email)) {
            showError('email', '유효한 이메일 주소를 입력해주세요.');
            isValid = false;
        }

        // 유효성 검사 통과 시 API 호출
        if (isValid) {
            await updateUserInfo(updatedInfo);
            window.location.reload();
        }
    });

    // 에러 메시지 표시 함수
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    // 이메일 유효성 검사 함수
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // 초기 사용자 정보 가져오기
    await fetchUserInfo();

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