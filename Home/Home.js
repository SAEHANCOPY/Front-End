document.addEventListener('DOMContentLoaded', function() {
    // 가격 계산 함수
    function calculatePrices() {
        // 기본 가격 설정
        const basePrice = {
            paper: 0,
            print: 0,
            process: 0,
            pan: 0,
            binding: 300000
        };
    
        //규격 별 가격
        let paperSize = document.getElementById('paperSize').value;
        let paperSizePrice = 0;
        let printPaperSizePrice= 0 ;

        if (paperSize === 'A4') {
            paperSizePrice = 16;
            printPaperSizePrice = 8;
        } else if (paperSize === 'A5') {
            paperSizePrice = 32;
            printPaperSizePrice = 8;
        } else if (paperSize === 'B6') {
            paperSizePrice = 32;
            printPaperSizePrice = 8;
        } else if (paperSize === 'B5') {
            paperSizePrice = 32;
            printPaperSizePrice = 16;
        }
        
        //수량
        let quantity = parseInt(document.getElementById('quantity').value);

        //용지 종류 별 가격
        let paperType = document.getElementById('paperType').value;
        let paperTypePrice = 0;

        if (paperType === '미색모조') {
            paperTypePrice = 63300;
        } else if (paperType === '모조지') {
            paperTypePrice = 56500;
        } else if (paperType === '스노우지') {
            paperTypePrice = 61460;
        } else if (paperType === '아르떼') {
            paperTypePrice = 155490;
        } else if (paperType === '랑데부') {
            paperTypePrice = 136860;
        }

        //내지 용지 종류 별 가격
        let innerPaperType = document.getElementById('innerPaperType').value;
        let innerPaperTypePrice = 0;

        if (innerPaperType === '미색모조') {
            innerPaperTypePrice = 63300;
        } else if (innerPaperType === '모조지') {
            innerPaperTypePrice = 56500;
        } else if (innerPaperType === '스노우지') {
            innerPaperTypePrice = 61460;
        } else if (innerPaperType === '아르떼') {
            innerPaperTypePrice = 155490;
        } else if (innerPaperType === '랑데부') {
            innerPaperTypePrice = 136860;
        }
        
        // 인쇄 도수 별 가격
        let frontColor = document.getElementById('frontColorType').value;

        let frontColorPrice = 0;

        if (frontColor === '양면 8도') {
            frontColorPrice = 8;
        }
        else if (frontColor === '양면 4도') {
            frontColorPrice = 4;
        }
        else if (frontColor === '2도 흑백') {
            frontColorPrice = 2;
        }
        
        // 페이지 양
        let pageNum = parseInt(document.getElementById('pages').value);
        if(isNaN(pageNum)){
            pageNum = 0;
        }


        // 용지대 가격 계산 
        let paperPrice = basePrice.paper;
        //1. 표지 계산: (부수/6 + 120) * 용지 종류
        paperPrice += (quantity / 6 + 120) * (223,830 / 500 * 0.75);
        //2. 내지 계산: {(부수 + 200)*페이지 수 / 규격 / 부수} * 용지 종류
        paperPrice += (((quantity + 200) * pageNum) / (paperSizePrice * quantity)) * innerPaperTypePrice;
   

        // 인쇄비 가격 계산
        let printPrice = basePrice.print;
        //1. 표지 계산: 8000 * 규격
        printPrice += 8000 * printPaperSizePrice;
        //2. 내지 계산: 5800 * 인쇄 도수 * (페이지 수 / 규격)
        printPrice += 5800 * frontColorPrice * (pageNum / printPaperSizePrice); 


        // 후가공 가격 계산
        let selectedProcess = document.querySelector('input[name="process"]:checked');
        let processPrice = basePrice.process;

        if (selectedProcess) {
            switch (selectedProcess.value) {
                case '무광 코팅':
                    processPrice += 70000;
                    break;
                case '에폭시':
                    processPrice += 150000;
                break;
            }
        }
        

        //판비 계산
        let panPrice = basePrice.pan;
        //1. 표지 계산: 6500 * (페이지 수 / 64)
        panPrice += 6500 * (pageNum / 64);
        //2. 내지 계산: 6500 * (페이지 수 / 규격) * 인쇄도수
        panPrice += 6500 * (pageNum / paperSizePrice) * frontColorPrice;
        

        // 가격 표시 업데이트
        document.getElementById('paperPrice').textContent = `₩${numberWithCommas(Math.round(paperPrice))}`;
        document.getElementById('printPrice').textContent = `₩${numberWithCommas(Math.round(printPrice))}`;
        document.getElementById('processPrice').textContent = `₩${numberWithCommas(Math.round(processPrice))}`;
        document.getElementById('panPrice').textContent = `₩${numberWithCommas(Math.round(panPrice))}`;
        document.getElementById('bookbindingPrice').textContent = `₩${numberWithCommas(Math.round(basePrice.binding))}`;
        document.getElementById('totalPrice').textContent = 
            `₩${numberWithCommas(Math.round(paperPrice + printPrice + processPrice + panPrice + basePrice.binding))}`;
    }

    // 숫자 포맷팅 함수
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // 모든 입력 요소에 이벤트 리스너 추가
    const inputs = document.querySelectorAll('select, input');
    inputs.forEach(input => {
        input.addEventListener('change', calculatePrices);
    });

    // 초기 가격 계산
    calculatePrices();

    // 로그인 상태 관리
    const loginLink = document.getElementById('loginLink');
    let isLoggedIn = false; // 초기 상태는 로그아웃 상태

    function updateLoginStatus() {
        if (isLoggedIn) {
            loginLink.textContent = '로그아웃';
            loginLink.href = '#';
            loginLink.addEventListener('click', logout);
        } else {
            loginLink.textContent = '로그인';
            loginLink.href = '../Login/Login.html';
            loginLink.removeEventListener('click', logout);
        }
    }

    function login() {
        isLoggedIn = true;
        updateLoginStatus();
        alert('로그인되었습니다.');
    }

    function logout(e) {
        e.preventDefault();
        isLoggedIn = false;
        updateLoginStatus();
        alert('로그아웃되었습니다.');
    }

    // 초기 로그인 상태 업데이트
    updateLoginStatus();

    // 로그인 페이지에서 돌아왔을 때 로그인 상태 확인
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        login();
    }

    // 로그인 링크 클릭 이벤트
    loginLink.addEventListener('click', function(e) {
        if (isLoggedIn) {
            e.preventDefault();
            logout(e);
        }
    });

    // 장바구니 버튼 클릭 이벤트 처리
    const quoteButton = document.querySelector('.quote-button');
    quoteButton.addEventListener('click', function () {
        // 장바구니에 전달할 데이터 준비
        const formData = new URLSearchParams();
        formData.append('pages', document.getElementById('pages').value); // 페이지 수
        formData.append('copies', document.getElementById('quantity').value); // 부수
        formData.append('paper_size', document.getElementById('paperSize').value); // 규격
        formData.append('paper_type', document.getElementById('paperType').value); // 용지 종류
        formData.append('post_process', document.querySelector('input[name="process"]:checked')?.value || ''); // 후가공
        formData.append('color', document.getElementById('frontColorType').value); // 색상
        formData.append('edit_type', document.getElementById('paperEdit').value); // 편집 타입
        formData.append('total_amount', document.getElementById('totalPrice').textContent.replace(/[^0-9]/g, '')); // 총 금액
        formData.append('action', 'cart'); // 장바구니 액션

        // API 요청
        fetch('http://43.202.235.179/public/cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString(),
            credentials: 'include' // 쿠키를 포함하여 세션 유지
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message || '장바구니에 성공적으로 추가되었습니다.');
            } else {
                alert(data.message || '장바구니 추가에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        });
    });


// 바로주문 버튼 클릭 이벤트 처리
    const orderButton = document.querySelector('.order-button');
    orderButton.addEventListener('click', function() {
        const orderDetails = {
            paperSize: document.getElementById('paperSize').value,
            paperEdit: document.getElementById('paperEdit').value,
            quantity: document.getElementById('quantity').value,
            paperType: document.getElementById('paperType').value,
            innerPaperType: document.getElementById('innerPaperType').value,
            frontColorType: document.getElementById('frontColorType').value,
            pages: document.getElementById('pages').value,
            process: document.querySelector('input[name="process"]:checked').value,
            totalPrice: document.getElementById('totalPrice').textContent
        };

        // 주문 정보를 URL 파라미터로 인코딩하여 주문 확인 페이지로 이동
        const orderDetailsParam = encodeURIComponent(JSON.stringify(orderDetails));
        window.location.href = `../Orderpage/Order.html?orderDetails=${orderDetailsParam}`;
        alert()
    });
});