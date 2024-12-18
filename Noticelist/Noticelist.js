document.addEventListener('DOMContentLoaded', function() {
    const noticeList = document.getElementById('noticeList');
    const adminControls = document.getElementById('adminControls');
    const createNoticeBtn = document.getElementById('createNoticeBtn');
    const loginLink = document.getElementById('loginLink');

    let isAdmin = localStorage.getItem('isAdmin') === 'true';

    // 임시 공지사항 데이터
    let notices = [
        { id: 1, title: "시스템 점검 안내", date: "2024-11-30" },
        { id: 2, title: "새로운 기능 업데이트", date: "2024-11-17" },
        { id: 3, title: "휴무 안내", date: "2024-11-01" },
    ];

    function renderNotices() {
        noticeList.innerHTML = '';
        notices.forEach(notice => {
            const noticeElement = document.createElement('div');
            noticeElement.className = 'notice-item';
            noticeElement.innerHTML = `
                <a href="../Noticedetail/Noticedetail.html?id=${notice.id}" class="notice-title">${notice.title}</a>
                <span class="notice-date">${notice.date}</span>
                ${isAdmin ? `<button class="delete-btn" data-id="${notice.id}">삭제</button>` : ''}
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

    function deleteNotice(id) {
        notices = notices.filter(notice => notice.id !== id);
        renderNotices();
    }

    createNoticeBtn.addEventListener('click', function() {
        window.location.href = '../Noticecreate/Noticecreate.html';
    });

    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        isAdmin = !isAdmin;
        localStorage.setItem('isAdmin', isAdmin);
        loginLink.textContent = isAdmin ? '로그아웃' : '로그인';
        renderNotices();
    });

    renderNotices();
});