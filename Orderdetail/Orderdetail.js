document.addEventListener('DOMContentLoaded', function() {
    // 서버에서 주문 정보를 가져오는 함수 (실제 구현 시 서버와 통신 필요)
    function fetchOrderDetails() {
        // 더미 데이터 (실제로는 서버에서 받아와야 함)
        return {
            orderNumber: "ORDER-2023-001",
            orderDate: "2023-05-30",
            items: [
                { name: "책자 인쇄 (A4, 100페이지)", quantity: 1, price: 50000 },
                { name: "포스터 인쇄 (A2, 100장)", quantity: 2, price: 60000 }
            ],
            totalPrice: 110000,
            manuscriptFile: "manuscript.pdf",
            shippingInfo: {
                name: "홍길동",
                phone: "010-1234-5678",
                address: "서울시 강남구 테헤란로 123",
                memo: "부재시 경비실에 맡겨주세요"
            },
            orderStatus: "제작 중",
            accountInfo: "국민은행 123-456-789012 (주)새한문화사"
        };
    }

    // 주문 정보 표시
    function displayOrderDetails() {
        const orderDetails = fetchOrderDetails();

        // 주문 내역
        let orderSummaryHTML = `
            <p><strong>주문 번호:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>주문 일자:</strong> ${orderDetails.orderDate}</p>
            <h4>주문 상품</h4>
            <ul>
        `;
        orderDetails.items.forEach(item => {
            orderSummaryHTML += `<li>${item.name} x ${item.quantity}: ${item.price.toLocaleString()}원</li>`;
        });
        orderSummaryHTML += `</ul>
            <p><strong>총 금액:</strong> ${orderDetails.totalPrice.toLocaleString()}원</p>
        `;
        document.getElementById('orderSummary').innerHTML = orderSummaryHTML;

        // 원고 파일 정보
        document.getElementById('manuscriptDetails').innerHTML = `
            <p><strong>파일명:</strong> ${orderDetails.manuscriptFile}</p>
        `;

        // 배송 정보
        document.getElementById('shippingDetails').innerHTML = `
            <p><strong>받는 분:</strong> ${orderDetails.shippingInfo.name}</p>
            <p><strong>연락처:</strong> ${orderDetails.shippingInfo.phone}</p>
            <p><strong>주소:</strong> ${orderDetails.shippingInfo.address}</p>
            <p><strong>배송 메모:</strong> ${orderDetails.shippingInfo.memo}</p>
        `;

        // 주문 상태
        document.getElementById('orderStatus').innerHTML = `
            <p>현재 상태: ${orderDetails.orderStatus}</p>
        `;

        // 입금 정보
        document.getElementById('accountDetails').innerHTML = `
            <p><strong>입금 계좌:</strong> ${orderDetails.accountInfo}</p>
        `;
    }

    // 페이지 로드 시 주문 정보 표시
    displayOrderDetails();
});