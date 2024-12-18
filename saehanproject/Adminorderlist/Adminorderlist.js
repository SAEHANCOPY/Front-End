document.addEventListener('DOMContentLoaded', function() {
    const orderTableBody = document.getElementById('orderTableBody');
    const searchInput = document.getElementById('searchInput');

    // 더미 데이터 (실제로는 서버에서 가져와야 함)
    const orders = [
        { id: '1', customerName: '홍길동', orderDate: '2023-05-30', totalAmount: 50000, status: '주문 접수' },
        { id: '2', customerName: '김철수', orderDate: '2023-05-29', totalAmount: 75000, status: '제작 중' },
        { id: '3', customerName: '이영희', orderDate: '2023-05-28', totalAmount: 100000, status: '배송 준비' },
    ];

    function renderOrders(ordersToRender) {
        orderTableBody.innerHTML = '';
        ordersToRender.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.orderDate}</td>
                <td>${order.totalAmount.toLocaleString()}원</td>
                <td>${order.status}</td>
                <td><button class="detail-btn" data-id="${order.id}">상세보기</button></td>
            `;
            orderTableBody.appendChild(row);
        });
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredOrders = orders.filter(order => 
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.id.includes(searchTerm)
        );
        renderOrders(filteredOrders);
    }

    searchInput.addEventListener('input', handleSearch);

    // 상세보기 버튼 클릭 이벤트
    orderTableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('detail-btn')) {
            const orderId = e.target.getAttribute('data-id');
            window.location.href = `../Adminorder/Adminorder.html`; //admin-order-detail.html?id=${orderId}
        }
    });

    // 초기 주문 목록 렌더링
    renderOrders(orders);
});