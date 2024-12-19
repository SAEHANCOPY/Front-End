document.addEventListener('DOMContentLoaded', function() {
    const orderDetails = document.getElementById('orderDetails');
    const statusSelect = document.getElementById('statusSelect');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const backBtn = document.getElementById('backBtn');

    // URL에서 주문 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    const token = localStorage.getItem('authToken'); // 토큰 가져오기

    let deliveryId = null;

    if (!orderId) {
        orderDetails.innerHTML = '<p>주문 ID가 제공되지 않았습니다.</p>';
        return;
    }

    // 주문 단건 조회 함수
    async function fetchOrderDetails(orderId) {
        try {
            // API 호출
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/viewOrderManagement.php?id=${orderId}`, {
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
                deliveryId = data.order.delivery_id;
            } else {
                orderDetails.innerHTML = `<p>${data.message || '주문 데이터를 불러올 수 없습니다.'}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            orderDetails.innerHTML = '<p>주문 데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }

    // 파일 다운로드 함수 수정
    function downloadFile(base64String, filePath, mimeType) {
        // 파일명 추출: 경로 부분 제거
        const fileName = filePath.split('/').pop();

        // Base64 문자열 디코딩
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        // 가짜 링크 생성 및 클릭으로 다운로드 트리거
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName; // 파일명 설정
        link.click();

        // 메모리 해제
        window.URL.revokeObjectURL(link.href);
    }

    // 주문 정보 렌더링 함수
    function renderOrderDetails(orderDetailsData) {
        const shippingStatus =
            orderDetailsData.shipping_status === 'Pending' ? '입금 대기' :
            orderDetailsData.shipping_status === 'Shipped' ? '주문 접수' :
            orderDetailsData.shipping_status === 'Delivered' ? '배송 중' :
            orderDetailsData.shipping_status === 'Cancelled' ? '배송 완료' :
            '알 수 없음';

        orderDetails.innerHTML = `
            <div class="order-section">
                <h2>주문 정보</h2>
                <p><strong>주문번호:</strong> ${orderDetailsData.order_id}</p>
                <p><strong>고객명:</strong> ${orderDetailsData.username}</p>
                <p><strong>주문일:</strong> ${orderDetailsData.created_at}</p>
                <p><strong>총 금액:</strong> ${Number(orderDetailsData.total_amount).toLocaleString()}원</p>
                <p><strong>현재 상태:</strong> ${shippingStatus}</p>
            </div>
            <div class="order-section">
                <h2>주문 상품</h2>
                <p><strong>주문 번호:</strong> ${orderDetailsData.order_id}</p>
                <p><strong>주문 일자:</strong> ${orderDetailsData.created_at}</p>
                <p><strong>규격:</strong> ${orderDetailsData.paper_size}</p>
                <p><strong>편집 방법:</strong> ${orderDetailsData.edit_type}</p>
                <p><strong>수량:</strong> ${orderDetailsData.copies}</p>
                <p><strong>표지 용지:</strong> ${orderDetailsData.paper_type}</p>
                <p><strong>내지 용지:</strong> ${orderDetailsData.inside_type}</p>
                <p><strong>인쇄도수:</strong> ${orderDetailsData.color}</p>
                <p><strong>페이지 수:</strong> ${orderDetailsData.pages}</p>
                <p><strong>후가공:</strong> ${orderDetailsData.post_process}</p>
            </div>
            <div class="order-section">
                <h2>배송 정보</h2>
                <p><strong>받는 분:</strong> ${orderDetailsData.recipient_name}</p>
                <p><strong>연락처:</strong> ${orderDetailsData.contact_number}</p>
                <p><strong>우편번호:</strong> ${orderDetailsData.postcode}</p>
                <p><strong>기본 주소:</strong> ${orderDetailsData.base_address}</p>
                <p><strong>상세 주소:</strong> ${orderDetailsData.detail_address}</p>
                <p><strong>메모:</strong> ${orderDetailsData.memo}</p>
            </div>
            <div class="order-section">
                <h2>원고 파일</h2>
                <p>
                    <strong>파일명:</strong> ${orderDetailsData.manuscript_file}
                    <button id="downloadFileBtn">다운로드</button>
                </p>
            </div>
        `;

        // 다운로드 버튼 이벤트 리스너 추가
        document.getElementById('downloadFileBtn').addEventListener('click', function () {
            downloadFile(
                orderDetailsData.manuscript_file_encoded, // Base64 인코딩된 파일
                orderDetailsData.manuscript_file, // 파일 이름
                orderDetailsData.manuscript_file_mime // MIME 타입
            );
        });

        // 현재 상태 선택
        statusSelect.value = shippingStatus;
    }

    updateStatusBtn.addEventListener('click', async function() {
        const newStatus = statusSelect.value;
        const statusKey =
            newStatus === '입금 대기' ? 'Pending' :
            newStatus === '주문 접수' ? 'Shipped' :
            newStatus === '배송 중' ? 'Delivered' :
            newStatus === '배송 완료' ? 'Cancelled' :
            '알 수 없음';
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);
            formData.append('status', statusKey);
            formData.append('delivery_id', deliveryId);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/updateDelivery.php`, {
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
                alert(`주문 상태가 "${newStatus}"로 변경되었습니다.`);
                window.location.reload();
            } else {
                alert(data.message || '주문 상태를 변경할 수 없습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('주문 상태를 변경하는 중 오류가 발생했습니다.');
        }
    });

    backBtn.addEventListener('click', function() {
        window.location.href = '../Adminorderlist/Adminorderlist.html';
    });

    // 초기 주문 상세 정보 렌더링
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