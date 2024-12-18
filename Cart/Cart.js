document.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터에서 주문 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const orderDetails = JSON.parse(decodeURIComponent(urlParams.get('orderDetails')));

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

    // 주문 화면 이동
    const shippingForm = document.getElementById('shippingForm');
    shippingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = '../Orderpage/Order.html';
    });
});