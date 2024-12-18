document.addEventListener('DOMContentLoaded', function() {
    const noticeTitle = document.getElementById('noticeTitle');
    const noticeDate = document.getElementById('noticeDate');
    const noticeContent = document.getElementById('noticeContent');
    const backBtn = document.getElementById('backBtn');

    // URL에서 공지사항 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const noticeId = urlParams.get('id');

    // 임시 공지사항 데이터 (실제로는 서버에서 가져와야 함)
    const notices = [
        { 
            id: 1, 
            title: "시스템 점검 안내", 
            date: "2024-11-17",
            content: "안녕하세요. 새한문화사입니다. 시스템 안정화를 위한 점검이 예정되어 있습니다. 점검 시간 동안 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.\n\n점검 일시: 2023년 6월 5일 오전 2시 ~ 오전 4시\n\n이용에 불편을 드려 죄송합니다. 더 나은 서비스로 보답하겠습니다."
        },
        { 
            id: 2, 
            title: "새로운 기능 업데이트", 
            date: "2024-11-10",
            content: "새한문화사 서비스에 새로운 기능이 추가되었습니다. 이번 업데이트에는 사용자 경험을 개선하기 위한 여러 가지 기능이 포함되어 있습니다. 자세한 내용은 공지사항을 참고해 주세요."
        },
        { 
            id: 3, 
            title: "휴무 안내", 
            date: "2024-11-01",
            content: "2024년 12월 25일은 성탄절로 당사 휴무입니다. 긴급한 문의사항은 고객센터 이메일(support@saehan.com)로 연락 주시기 바랍니다. "
        },
    ];

    // 공지사항 데이터 가져오기
    const notice = notices.find(n => n.id === parseInt(noticeId));

    if (notice) {
        noticeTitle.textContent = notice.title;
        noticeDate.textContent = notice.date;
        noticeContent.textContent = notice.content;
    } else {
        noticeTitle.textContent = "공지사항을 찾을 수 없습니다.";
    }

    backBtn.addEventListener('click', function() {
        window.location.href = '../Noticelist/Noticelist.html';
    });
});