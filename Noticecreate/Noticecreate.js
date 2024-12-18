document.addEventListener('DOMContentLoaded', function() {
    const noticeForm = document.getElementById('noticeForm');
    const cancelBtn = document.getElementById('cancelBtn');

    noticeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('noticeTitle').value;
        const content = document.getElementById('noticeContent').value;

        // 여기에서 실제로는 서버로 데이터를 전송해야 합니다.
        console.log('새 공지사항:', { title, content });

        alert('공지사항이 등록되었습니다.');
        window.location.href = '../Noticelist/Noticelist.html';
    });

    cancelBtn.addEventListener('click', function() {
        if (confirm('작성을 취소하시겠습니까? 입력한 내용은 저장되지 않습니다.')) {
            window.location.href = '../Noticelist/Noticelist.html';
        }
    });
});