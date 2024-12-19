document.addEventListener('DOMContentLoaded', function() {
    const noticeList = document.getElementById('noticeList');
    const adminControls = document.getElementById('adminControls');
    const createNoticeBtn = document.getElementById('createNoticeBtn');
    const token = localStorage.getItem('authToken');
    const isAdmin = localStorage.getItem('role') === 'admin';
    const role = localStorage.getItem('role');

    // 공지 데이터를 저장할 변수
    let notices = [];
    let currentPage = 1; // 현재 페이지 번호
    let totalPages = 1; // 전체 페이지 수

    // 공지 목록 API 호출 함수
    async function fetchNotices(page = 1) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/boardPost.php?page=${page}`, {
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
                notices = data.posts; // 공지 데이터 저장
                currentPage = data.currentPage; // 현재 페이지
                totalPages = data.totalPages; // 전체 페이지 수
                renderNotices(); // 공지사항 렌더링
                updatePagination(); // 페이지네이션 업데이트
            } else {
                alert(data.message || '공지사항 데이터를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 문제가 발생했습니다.');
        }
    }

    // 공지사항 렌더링 함수
    function renderNotices() {
        noticeList.innerHTML = '';
        notices.forEach(notice => {
            const noticeElement = document.createElement('div');
            noticeElement.className = 'notice-item';
            noticeElement.innerHTML = `
                <a href="../Noticedetail/Noticedetail.html?id=${notice.notice_id}" class="notice-title">${notice.title}</a>
                <div class="notice-info">
                    <span class="notice-date">${notice.created_at}</span>
                    ${isAdmin ? `<button class="delete-btn" data-id="${notice.notice_id}">삭제</button>` : ''}
                </div>
            `;
            noticeList.appendChild(noticeElement);
        });

        if (isAdmin) {
            adminControls.style.display = 'block';
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    deleteNotice(id);
                });
            });
        } else {
            adminControls.style.display = 'none';
        }
    }

    // 페이지네이션 버튼 업데이트
    function updatePagination() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = ''; // 기존 페이지네이션 초기화

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = 'page-button';
            if (i === currentPage) {
                pageButton.classList.add('active'); // 현재 페이지 강조
            }
            pageButton.addEventListener('click', function () {
                fetchNotices(i); // 선택된 페이지 데이터 가져오기
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    // 공지사항 삭제 API 호출 함수
    async function deleteNotice(noticeId) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/deletePost.php?id=${noticeId}`, {
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
                alert('공지사항이 삭제되었습니다.');
                fetchNotices(); // 공지 목록 새로고침
            } else {
                alert(data.message || '공지사항 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('공지사항 삭제 중 문제가 발생했습니다.');
        }
    }

    // 공지사항 생성 버튼 이벤트
    createNoticeBtn.addEventListener('click', function() {
        window.location.href = '../Noticecreate/Noticecreate.html';
    });

    // 초기 공지사항 가져오기
    fetchNotices();

    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item');

    if (token) {
        loginLink.textContent = '로그아웃';
        loginLink.href = '#';
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });

        if (role === 'admin') {
            const cartLink = document.querySelector('.main-nav a[href*="Cartlist"]');
            const orderListLink = document.querySelector('.main-nav a[href*="Orderlist"]');
        
            if (cartLink) cartLink.remove();
            if (orderListLink) orderListLink.remove();
        
            const nav = document.querySelector('.main-nav');
            const orderConfirmLink = document.createElement('a');
            orderConfirmLink.href = '../Adminorderlist/Adminorderlist.html';
            orderConfirmLink.textContent = '주문 관리';
            orderConfirmLink.className = 'nav-item';
        
            const noticeLink = document.querySelector('.main-nav a[href*="Noticelist"]');
            if (noticeLink) {
                nav.insertBefore(orderConfirmLink, noticeLink);
            }
        }        
    } else {
        redirectToLogin();

        restrictedLinks.forEach(link => {
            if (link.id !== 'loginLink' && link.id !== 'HomeLink' && !link.id.includes('Noticelist')) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    alert('로그인이 필요합니다.');
                    window.location.href = '../Login/Login.html';
                });
            }
        });
    }

    function logout() {
        alert('로그아웃 되었습니다.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        redirectToLogin();
        window.location.href = '../Home/Home.html';
    }

    function redirectToLogin() {
        loginLink.textContent = '로그인';
        loginLink.href = '../Login/Login.html';
    }
});