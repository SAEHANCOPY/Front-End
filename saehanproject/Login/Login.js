document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Simple validation (you should replace this with actual authentication)
    if (username === 'admin' && password === 'password') {
        errorMessage.textContent = '';
        alert('로그인 성공!');
        window.location.href = '../Home/Home.html';
    } else {
        errorMessage.textContent = '사용자 이름 또는 비밀번호가 잘못되었습니다.';
    }
});