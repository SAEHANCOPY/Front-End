document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mypageForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // 사용자 정보 불러오기 (실제로는 서버에서 가져와야 함)
    const user = {
        username: 'user123',
        email: 'user@example.com',
        name: '홍길동',
        phone: '010-1234-5678',
        address: '서울시 강남구'
    };

    // 폼에 사용자 정보 채우기
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('name').value = user.name;
    document.getElementById('phone').value = user.phone;
    document.getElementById('address').value = user.address;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 기존 에러 메시지 제거
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        // 유효성 검사
        let isValid = true;

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
        const email = document.getElementById('email').value;
        if (!isValidEmail(email)) {
            showError('email', '유효한 이메일 주소를 입력해주세요.');
            isValid = false;
        }

        // 유효성 검사 통과 시 폼 제출
        if (isValid) {
            // 여기서 실제로는 서버에 데이터를 전송하고 응답을 처리해야 합니다.
            alert('회원 정보가 성공적으로 수정되었습니다.');
            // 수정된 정보를 화면에 반영 (실제로는 서버 응답 데이터를 사용해야 함)
            user.email = email;
            user.name = document.getElementById('name').value;
            user.phone = document.getElementById('phone').value;
            user.address = document.getElementById('address').value;
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
});