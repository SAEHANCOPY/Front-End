document.addEventListener('DOMContentLoaded', async function() {
    const noticeTitle = document.getElementById('noticeTitle');
    const noticeDate = document.getElementById('noticeDate');
    const noticeContent = document.getElementById('noticeContent');
    const backBtn = document.getElementById('backBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    // URL에서 공지사항 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const noticeId = urlParams.get('id');

    if (!noticeId) {
        noticeTitle.textContent = "공지사항 ID가 제공되지 않았습니다.";
        return;
    }

    // 공지사항 데이터 가져오는 함수
    async function fetchNoticeDetails(id) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/viewPost.php?id=${id}`, {
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
                const post = data.post;
                noticeTitle.textContent = post.title;
                noticeDate.textContent = `작성일: ${post.created_at}`;
                noticeContent.textContent = post.content;
                // 관리자일 경우 삭제 버튼 활성화
                if (role === 'admin') {
                    deleteBtn.style.display = 'block'; // 삭제 버튼 보이기
                    deleteBtn.addEventListener('click', function () {
                        const confirmed = confirm("정말 이 공지사항을 삭제하시겠습니까?");
                        if (confirmed) {
                            deleteNotice(id);
                        }
                    });
                } else {
                    deleteBtn.style.display = 'none'; // 관리자가 아니면 삭제 버튼 숨기기
                }
            } else {
                noticeTitle.textContent = "공지사항을 불러오지 못했습니다.";
                alert(data.message || "공지사항 조회에 실패했습니다.");
            }
        } catch (error) {
            console.error('Error:', error);
            noticeTitle.textContent = "공지사항을 불러오는 중 오류가 발생했습니다.";
        }
    }

    // 공지사항 데이터 가져오기
    await fetchNoticeDetails(noticeId);

    // 뒤로가기 버튼 이벤트
    backBtn.addEventListener('click', function() {
        window.location.href = '../Noticelist/Noticelist.html';
    });    

    // 공지사항 삭제 함수
    async function deleteNotice(id) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/deletePost.php?id=${id}`, {
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
                alert("공지사항이 삭제되었습니다.");
                window.location.href = '../Noticelist/Noticelist.html';
            } else {
                alert(data.message || "공지사항 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("공지사항 삭제 중 오류가 발생했습니다.");
        }
    }


    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크

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