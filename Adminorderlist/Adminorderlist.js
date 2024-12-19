document.addEventListener('DOMContentLoaded', function() {
    const orderTableBody = document.getElementById('orderTableBody');
    const searchInput = document.getElementById('searchInput');
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크

    let orders = []; // 전역 변수 orders 선언
    let currentPage = 1; // 현재 페이지 번호

    // 서버에서 주문 목록을 가져오는 함수
    async function fetchOrders(page) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`https://www.saehan-pulis-hing.com/public/orderManagement.php?page=${page}`, {
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
                orders = data.orders; // 데이터를 전역 변수 orders에 저장
                renderOrders(orders); // 주문 목록 렌더링
                updatePagination(data.currentPage, data.totalPages);
            } else {
                alert(data.message || '주문 데이터를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        }
    }

    // 주문 상태를 한국어로 변환
    function getShippingStatus(status) {
        return status === 'Pending' ? '입금 대기' :
               status === 'Shipped' ? '주문 접수' :
               status === 'Delivered' ? '배송 중' :
               status === 'Cancelled' ? '배송 완료' : '알 수 없음';
    }

    // 주문 목록 렌더링
    function renderOrders(ordersToRender) {
        orderTableBody.innerHTML = '';
        ordersToRender.forEach(order => {
            const shippingStatus = getShippingStatus(order.shipping_status);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.username}(${order.user_id})</td>
                <td>${order.created_at}</td>
                <td>${Number(order.total_amount).toLocaleString()}원</td>
                <td>${shippingStatus}</td>
                <td><button class="detail-btn" data-id="${order.order_id}">상세보기</button></td>
            `;
            orderTableBody.appendChild(row);
        });
    }

    // 페이지네이션 업데이트
    function updatePagination(currentPage, totalPages) {
        const paginationContainer = document.getElementById('pagination');
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

    // 검색 필터 처리
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredOrders = orders.filter(order => 
            (order.username && order.username.toLowerCase().includes(searchTerm)) ||
            (order.order_id && order.order_id.toString().includes(searchTerm))
        );
        renderOrders(filteredOrders);
    }
    searchInput.addEventListener('input', handleSearch);

    // 상세보기 버튼 클릭 이벤트
    orderTableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('detail-btn')) {
            const orderId = e.target.getAttribute('data-id');
            window.location.href = `../Adminorder/Adminorder.html?order_id=${orderId}`;
        }
    });

    // 초기 주문 목록 가져오기
    fetchOrders();

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
            const cartLink = document.querySelector('.main-nav a[href*="cartlist"]');
            const orderListLink = document.querySelector('.main-nav a[href*="orderlist"]');
        
            // 기존 링크를 숨기고 새로운 링크 추가
            if (cartLink) cartLink.remove();
            if (orderListLink) orderListLink.remove();
        
            const nav = document.querySelector('.main-nav');
            const orderConfirmLink = document.createElement('a');
            orderConfirmLink.href = '../Adminorderlist/Adminorderlist.html';
            orderConfirmLink.textContent = '주문 관리';
            orderConfirmLink.className = 'nav-item';
        
            // 공지 링크를 기준으로 이전에 추가
            const noticeLink = document.querySelector('.main-nav a[href*="noticelist"]');
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