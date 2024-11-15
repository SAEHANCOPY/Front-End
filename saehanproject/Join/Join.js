document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

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

        // 유효성 검사 통과 시 폼 제출
        if (isValid) {
            // 여기서 실제로는 서버에 데이터를 전송하고 응답을 처리해야 합니다.
            // 이 예제에서는 간단히 로그인 페이지로 리다이렉트합니다.
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            window.location.href = 'login.html';
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