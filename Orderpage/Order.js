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

    // 주문 완료 폼 제출 처리
    const shippingForm = document.getElementById('shippingForm');
    shippingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const manuscriptFile = document.getElementById('manuscriptFile').files[0];
        if (manuscriptFile) {
            console.log('원고 파일:', manuscriptFile.name);
        }
        
        const shippingInfo = {
            recipientName: document.getElementById('recipientName').value,
            recipientPhone: document.getElementById('recipientPhone').value,
            shippingAddress: document.getElementById('shippingAddress').value,
            manuscriptFileName: manuscriptFile ? manuscriptFile.name : 'No file uploaded'
        };

        // 여기에서 주문 정보와 배송 정보를 서버로 전송하는 로직을 구현해야 합니다.
        // 예를 들어, fetch API를 사용하여 서버에 데이터를 전송할 수 있습니다.

        console.log('주문 정보:', orderDetails);
        console.log('배송 정보:', shippingInfo);

        // 주문 완료 메시지 표시
        alert('주문이 완료되었습니다. 감사합니다!');
        // 주문 완료 후 홈페이지로 리다이렉트
        window.location.href = '../Orderlistpage/Orderlist.html';
    });
});