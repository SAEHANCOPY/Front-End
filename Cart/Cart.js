document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('loginLink');
    const restrictedLinks = document.querySelectorAll('.main-nav .nav-item'); // 모든 네비게이션 링크
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    // URL 파라미터에서 `cart_id` 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get('cart_id'); // 장바구니 ID

    let cartItemDetails = null;

    if (!cartId) {
        orderSummary.innerHTML = '<p>장바구니 ID가 제공되지 않았습니다.</p>';
        return;
    }

    // 장바구니 단건 조회 함수
    async function fetchCartItem(cartId) {
        try {
            const token = localStorage.getItem('authToken'); // 토큰 가져오기
            const formData = new URLSearchParams();
            formData.append('token', token);
            // API 호출
            const response = await fetch(`https://www.saehan-pulis-hing.com/public/viewCart.php?cart_id=${cartId}`, {
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

            if (data.status === 'error') {
                orderSummary.innerHTML = `<p>${data.message || '장바구니 데이터를 불러올 수 없습니다.'}</p>`;
                return;
            }

            // 데이터 렌더링
            cartItemDetails=mapOrderDetails(data.cart[0]);
            renderOrderSummary(data.cart[0]);
        } catch (error) {
            console.error('Error:', error);
            orderSummary.innerHTML = '<p>장바구니 데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }

    // 주문 요약 렌더링 함수
    function renderOrderSummary(orderDetails) {
        if (orderDetails) {
            const summaryHTML = `
                <p><strong>규격:</strong> ${orderDetails.paper_size}</p>
                <p><strong>편집 방법:</strong> ${orderDetails.edit_type}</p>
                <p><strong>수량:</strong> ${orderDetails.copies}부</p>
                <p><strong>페이지 수:</strong> ${orderDetails.pages}페이지</p>
                <p><strong>표지 종류:</strong> ${orderDetails.paper_type}</p>
                <p><strong>내지 종류:</strong> ${orderDetails.inside_type}</p>
                <p><strong>후가공:</strong> ${orderDetails.post_process}</p>
                <p><strong>색상:</strong> ${orderDetails.color}</p>
                <p><strong>총 금액:</strong> ${Number(orderDetails.total_amount).toLocaleString()}원</p>
                <p><strong>보관시작일:</strong> ${orderDetails.created_at}</p>
            `;
            orderSummary.innerHTML = summaryHTML;
        } else {
            orderSummary.innerHTML = '<p>주문 정보를 불러올 수 없습니다.</p>';
        }
    }

    // 주문 데이터 속성 이름 변환 함수
    function mapOrderDetails(apiData) {
        return {
            paperSize: apiData.paper_size || '정보 없음',
            paperEdit: apiData.edit_type || '정보 없음',
            quantity: apiData.copies || '정보 없음',
            paperType: apiData.paper_type || '정보 없음',
            innerPaperType: apiData.inner_paper_type || '정보 없음',
            frontColorType: apiData.color || '정보 없음',
            pages: apiData.pages || '정보 없음',
            process: apiData.post_process || '정보 없음',
            totalPrice: Number(apiData.total_amount || 0).toLocaleString() + '원',
            createdAt: apiData.created_at || '정보 없음',
        };
    }

    // 단건 조회 호출
    fetchCartItem(cartId);

    // 주문 화면 이동
    const shippingForm = document.getElementById('shippingForm');
    shippingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!cartItemDetails) {
            alert('장바구니 데이터를 불러오지 못했습니다. 다시 시도해 주세요.');
            return;
        }
    
        // URL 파라미터로 장바구니 데이터 전달
        const orderDetailsParam = encodeURIComponent(JSON.stringify(cartItemDetails));
        window.location.href = `../Orderpage/Order.html?orderDetails=${orderDetailsParam}`;
    });


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