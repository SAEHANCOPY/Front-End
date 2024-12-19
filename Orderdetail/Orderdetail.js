document.addEventListener('DOMContentLoaded', function() {
    // URL에서 order_id 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id'); // 주문 ID
    const token = localStorage.getItem('authToken'); // 토큰 가져오기

    const orderSummary = document.getElementById('orderSummary');
    const manuscriptDetails = document.getElementById('manuscriptDetails');
    const shippingDetails = document.getElementById('shippingDetails');
    const orderStatus = document.getElementById('orderStatus');
    const accountDetails = document.getElementById('accountDetails');

    if (!orderId) {
        orderSummary.innerHTML = '<p>주문 ID가 제공되지 않았습니다.</p>';
        return;
    }
    
    // 주문 단건 조회 함수
    async function fetchOrderDetails(orderId) {
        try {
            // API 호출
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/viewOrder.php?order_id=${orderId}`, {
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
                renderOrderDetails(data.order); // 데이터 렌더링
            } else {
                orderSummary.innerHTML = `<p>${data.message || '주문 데이터를 불러올 수 없습니다.'}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            orderSummary.innerHTML = '<p>주문 데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }

    // 주문 정보 렌더링 함수
    function renderOrderDetails(orderDetails) {
        const shippingStatus =
            orderDetails.shipping_status === 'Pending' ? '입금 대기' :
            orderDetails.shipping_status === 'Shipped' ? '주문 접수' :
            orderDetails.shipping_status === 'Delivered' ? '배송 중' :
            orderDetails.shipping_status === 'Cancelled' ? '배송 완료' :
            '알 수 없음';
        // 주문 내역
        let orderSummaryHTML = `
            <p><strong>주문 번호:</strong> ${orderDetails.order_id}</p>
            <p><strong>주문 일자:</strong> ${orderDetails.created_at}</p>
            <p><strong>규격:</strong> ${orderDetails.paper_size}</p>
            <p><strong>편집 방법:</strong> ${orderDetails.edit_type}</p>
            <p><strong>수량:</strong> ${orderDetails.copies}</p>
            <p><strong>표지 용지:</strong> ${orderDetails.paper_type}</p>
            <p><strong>내지 용지:</strong> ${orderDetails.inside_type}</p>
            <p><strong>인쇄도수:</strong> ${orderDetails.color}</p>
            <p><strong>페이지 수:</strong> ${orderDetails.pages}</p>
            <p><strong>후가공:</strong> ${orderDetails.post_process}</p>
            <p><strong>총 금액:</strong> ${Number(orderDetails.total_amount).toLocaleString()}원</p>
        `;
        orderSummary.innerHTML = orderSummaryHTML;

        // 원고 파일 정보
        manuscriptDetails.innerHTML = `
            <p><strong>파일:</strong> <a href="${orderDetails.manuscript_file}" target="_blank">${orderDetails.manuscript_file}</a></p>
        `;

        // 배송 정보
        shippingDetails.innerHTML = `
            <p><strong>받는 분:</strong> ${orderDetails.recipient_name}</p>
            <p><strong>연락처:</strong> ${orderDetails.contact_number}</p>
            <p><strong>우편번호:</strong> ${orderDetails.postcode}</p>
            <p><strong>기본 주소:</strong> ${orderDetails.base_address}</p>
            <p><strong>상세 주소:</strong> ${orderDetails.detail_address}</p>
            <p><strong>메모:</strong> ${orderDetails.memo}</p>
        `;

        // 주문 상태
        orderStatus.innerHTML = `
            <p><strong>현재 상태:</strong> ${shippingStatus}</p>
        `;

        // 입금 정보
        accountDetails.innerHTML = `
            <p><strong>입금 계좌: 국민은행 938002-00-702841(예금주: 배기영)</strong></p>
        `;
    }

    // 주문 단건 조회 호출
    fetchOrderDetails(orderId);

    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크
    const role = localStorage.getItem('role');

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