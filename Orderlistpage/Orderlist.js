document.addEventListener('DOMContentLoaded', function() {
    const paginationContainer = document.getElementById('pagination');
    const orderTableBody = document.getElementById('orderTableBody');
    const token = localStorage.getItem('authToken');

    let currentPage = 1; // 현재 페이지 번호
    const rowsPerPage = 10; // 한 페이지에 표시할 행 수

    // 서버에서 주문 목록을 가져오는 함수
    async function fetchOrders(page) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/boardOrder.php?page=${page}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error(`네트워크 응답에 문제가 있습니다. 상태 코드: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                displayOrders(data.orders); // 주문 목록 표시
                updatePagination(data.currentPage, data.totalPages); // 페이지네이션 업데이트
            } else {
                alert(data.message || '주문 데이터를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        }
    }

    // 주문 목록 표시
    function displayOrders(orders) {
        orderTableBody.innerHTML = '';
        orders.forEach(order => {
            const formattedAmount = Number(order.total_amount).toLocaleString();
            const fileName = order.manuscript_file.split('/').pop();
            const shippingStatus = 
                order.shipping_status === 'Pending' ? '입금 대기' :
                order.shipping_status === 'Shipped' ? '주문 접수' :
                order.shipping_status === 'Delivered' ? '배송 중' :
                order.shipping_status === 'Cancelled' ? '배송 완료' :
                orderDetails.status;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.created_at}</td>
                <td>${fileName}</td>
                <td>${formattedAmount}원</td>
                <td>${order.base_address}</td>
                <td>${shippingStatus}</td>
                <td>
                    <button class="detail-button" data-id="${order.order_id}">상세 보기</button>
                </td>
            `;
            orderTableBody.appendChild(row);
        });
    }

    // 페이지네이션 업데이트
    function updatePagination(currentPage, totalPages) {
        paginationContainer.innerHTML = ''; // 기존 페이지네이션 초기화

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = 'page-button';
            if (i === currentPage) {
                pageButton.classList.add('active'); // 현재 페이지 강조
            }
            pageButton.addEventListener('click', function () {
                fetchOrders(i); // 선택된 페이지 데이터 가져오기
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    // 상세 보기 버튼 클릭 이벤트
    orderTableBody.addEventListener('click', function (e) {
        if (e.target.classList.contains('detail-button')) {
            const orderId = e.target.getAttribute('data-id');
            window.location.href = `../Orderdetail/Orderdetail.html?order_id=${orderId}`;
        }
    });

    // 초기 주문 목록 표시
    fetchOrders(currentPage);

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