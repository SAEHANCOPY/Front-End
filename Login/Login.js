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
        credentials: 'include' // 서버가 설정한 세션 쿠키를 포함
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') { // 'status' 필드를 검사
            alert(`로그인 성공!`);
            sessionStorage.setItem('user_id', data.user.user_id);
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
