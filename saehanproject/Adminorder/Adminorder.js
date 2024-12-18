document.addEventListener('DOMContentLoaded', function() {
    const orderDetails = document.getElementById('orderDetails');
    const statusSelect = document.getElementById('statusSelect');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const backBtn = document.getElementById('backBtn');

    // URL에서 주문 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    // 더미 데이터 (실제로는 서버에서 가져와야 함)
    const order = {
        id: orderId,
        customerName: '홍길동',
        orderDate: '2023-05-30',
        totalAmount: 50000,
        status: '주문 접수',
        items: [
            { name: '책자 인쇄 (A4, 100페이지)', quantity: 1, price: 50000 }
        ],
        shippingInfo: {
            name: '홍길동',
            phone: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123'
        },
        manuscriptFile: 'manuscript.pdf'
    };

    function renderOrderDetails() {
        orderDetails.innerHTML = `
            <div class="order-section">
                <h2>주문 정보</h2>
                <p><strong>주문번호:</strong> ${order.id}</p>
                <p><strong>고객명:</strong> ${order.customerName}</p>
                <p><strong>주문일:</strong> ${order.orderDate}</p>
                <p><strong>총 금액:</strong> ${order.totalAmount.toLocaleString()}원</p>
                <p><strong>현재 상태:</strong> ${order.status}</p>
            </div>
            <div class="order-section">
                <h2>주문 상품</h2>
                ${order.items.map(item => `
                    <p>${item.name} x ${item.quantity}: ${item.price.toLocaleString()}원</p>
                `).join('')}
            </div>
            <div class="order-section">
                <h2>배송 정보</h2>
                <p><strong>받는 분:</strong> ${order.shippingInfo.name}</p>
                <p><strong>연락처:</strong> ${order.shippingInfo.phone}</p>
                <p><strong>주소:</strong> ${order.shippingInfo.address}</p>
            </div>
            <div class="order-section">
                <h2>원고 파일</h2>
                <p><strong>파일명:</strong> ${order.manuscriptFile}</p>
                <button id="downloadBtn">파일 다운로드</button>
            </div>
        `;

        // 현재 상태 선택
        statusSelect.value = order.status;
    }

    updateStatusBtn.addEventListener('click', function() {
        const newStatus = statusSelect.value;
        // 실제로는 서버에 상태 업데이트 요청을 보내야 함
        order.status = newStatus;
        alert(`주문 상태가 "${newStatus}"로 변경되었습니다.`);
        renderOrderDetails();
    });

    backBtn.addEventListener('click', function() {
        window.location.href = '../Adminorderlist/Adminorderlist.html';
    });

    // 초기 주문 상세 정보 렌더링
    renderOrderDetails();
});