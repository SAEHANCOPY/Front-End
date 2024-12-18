document.addEventListener('DOMContentLoaded', function() {
    // 주문 목록 데이터 (실제로는 서버에서 가져와야 함)
    const orders = [
        {
            id: '1001',
            date: '2023-05-15',
            product: '책자 인쇄 (A4, 100페이지)',
            total: '₩500,000',
            address: '서울시 강남구 테헤란로 123',
            status: '배송 완료'
        },
        {
            id: '1002',
            date: '2023-05-20',
            product: '포스터 인쇄 (A2, 100장)',
            total: '₩300,000',
            address: '경기도 성남시 분당구 판교로 256번길 25',
            status: '제작 중'
        },
        {
            id: '1003',
            date: '2023-05-25',
            product: '명함 인쇄 (1000장)',
            total: '₩100,000',
            address: '서울시 마포구 와우산로 94',
            status: '배송 중'
        }
    ];

    const orderTableBody = document.getElementById('orderTableBody');

    // 주문 목록 표시
    function displayOrders() {
        orderTableBody.innerHTML = '';
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.product}</td>
                <td>${order.total}</td>
                <td><button class="detail-button" data-id="${order.id}">상세 보기</button></td>
            `;
            orderTableBody.appendChild(row);
        });
    }

    // 상세 보기 버튼 클릭 이벤트
    orderTableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('detail-button')) {
            const orderId = e.target.getAttribute('data-id');
            //alert(`주문 번호 ${orderId}의 상세 정보를 보여줍니다.`);
            // 여기에 상세 정보를 보여주는 로직을 구현할 수 있습니다.
            // 예: 모달 창을 열거나 새 페이지로 이동
            window.location.href = `../Cart/Cart.html`;
        }
    });

    // 초기 주문 목록 표시
    displayOrders();
});