document.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터에서 주문 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const orderDetails = JSON.parse(decodeURIComponent(urlParams.get('orderDetails')));
    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    // 주문 요약 표시
    const orderSummary = document.getElementById('orderSummary');
    if (orderDetails) {
        let summaryHTML = `
            <p><strong>규격:</strong> ${orderDetails.paperSize}</p>
            <p><strong>편집 방법:</strong> 1page씩 작업 사방 4mm여백(고정)</p>
            <p><strong>수량:</strong> ${orderDetails.quantity}부</p>
            <p><strong>표지:</strong> ${orderDetails.paperType}</p>
            <p><strong>내지:</strong> ${orderDetails.innerPaperType}</p>
            <p><strong>인쇄도수:</strong> ${orderDetails.frontColorType}</p>
            <p><strong>페이지 수:</strong> ${orderDetails.pages}페이지</p>
            <p><strong>후가공:</strong> ${orderDetails.process}</p>
            <p><strong>총 금액:</strong> ${orderDetails.totalPrice}</p>
        `;
        orderSummary.innerHTML = summaryHTML;
    } else {
        orderSummary.innerHTML = '<p>주문 정보를 불러올 수 없습니다.</p>';
    }

    // 주문 완료 폼 제출 처리
    const shippingForm = document.getElementById('shippingForm');
    shippingForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const manuscriptFile = document.getElementById('manuscriptFile').files[0]; // 업로드된 파일
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = '../Login/Login.html';
            return;
        }

        if (!manuscriptFile) {
            alert('파일을 업로드해주세요.');
            return;
        }

        const totalPriceString = orderDetails.totalPrice; // "₩644,373"
        const totalPrice = parseFloat(totalPriceString.replace(/[₩,]/g, '')); // ₩와 쉼표 제거

        // FormData 객체에 데이터 추가
        const formData = new FormData();
        formData.append('token', token); // 인증 토큰
        formData.append('uploaded_file', manuscriptFile); // 파일
        formData.append('recipient_name', document.getElementById('recipientName').value); // 수령인 이름
        formData.append('contact_number', document.getElementById('recipientPhone').value); // 수령인 전화번호
        formData.append('address', document.getElementById('address').value); // 주소
        formData.append('detailAddress', document.getElementById('detailAddress').value); // 상세 주소
        formData.append('pages', orderDetails.pages); // 페이지 수
        formData.append('copies', orderDetails.quantity); // 부수
        formData.append('paper_size', orderDetails.paperSize); // 규격
        formData.append('paper_type', orderDetails.paperType); // 용지 종류
        formData.append('inside_type', orderDetails.innerPaperType); // 용지 종류
        formData.append('post_process', orderDetails.process); // 후가공
        formData.append('color', orderDetails.frontColorType); // 색상
        formData.append('edit_type', '1page씩 작업 사방 4mm여백(고정)'); // 편집 타입
        formData.append('total_amount', totalPrice); // 총 금액
        formData.append('postcode', document.getElementById('postcode').value); // 우편번호
        formData.append('memo', document.getElementById('shippingAddress').value); // 메모

        try {
            // 서버에 데이터 전송
            const response = await fetch('https://www.saehan-pulis-hing.com/public/orderPage.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert(result.message || '주문이 성공적으로 접수되었습니다.');
                window.location.href = '../Orderlistpage/Orderlist.html'; // 주문 목록 페이지로 이동
            } else {
                alert(result.message || '주문에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    });


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