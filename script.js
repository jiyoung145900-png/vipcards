document.addEventListener('DOMContentLoaded', () => {
    const cards = ['vip1', 'vip2', 'vip3'];

    // Local Storage에서 카드 설정 불러오기
    function loadCardSettings(cardId) {
        const settings = JSON.parse(localStorage.getItem(`cardSettings-${cardId}`)) || {
            name: '',
            number: '',
            isActive: true
        };
        document.getElementById(`${cardId}-name-input`).value = settings.name;
        document.getElementById(`${cardId}-number-input`).value = settings.number;
        updateCardDisplay(cardId, settings.name, settings.number, settings.isActive);
    }

    // 카드 설정 저장하기
    function saveCardSettings(cardId, name, number, isActive) {
        const settings = { name, number, isActive };
        localStorage.setItem(`cardSettings-${cardId}`, JSON.stringify(settings));
    }

    // 카드 디스플레이 업데이트
    function updateCardDisplay(cardId, name, number, isActive) {
        const nameDisplay = document.getElementById(`${cardId}-name-display`);
        const numberDisplay = document.getElementById(`${cardId}-number-display`);
        const statusDisplay = document.getElementById(`${cardId}-status-display`);

        nameDisplay.textContent = `이름: ${name || '[이름]'}`;
        numberDisplay.textContent = `카드번호: ${number || '[번호]'}`;
        statusDisplay.textContent = isActive ? '활성' : '비활성';
        statusDisplay.classList.toggle('active', isActive);
        statusDisplay.classList.toggle('inactive', !isActive);
    }

    // 각 카드에 대한 이벤트 리스너 설정
    cards.forEach(cardId => {
        const nameInput = document.getElementById(`${cardId}-name-input`);
        const numberInput = document.getElementById(`${cardId}-number-input`);
        const toggleButton = document.querySelector(`.toggle-status-btn[data-card="${cardId}"]`);
        const downloadButton = document.querySelector(`.download-btn[data-card="${cardId}"]`);

        // 페이지 로드 시 설정 불러오기
        loadCardSettings(cardId);

        // 이름 입력 변경 시
        nameInput.addEventListener('input', () => {
            const currentNumber = numberInput.value;
            const currentStatus = document.getElementById(`${cardId}-status-display`).classList.contains('active');
            updateCardDisplay(cardId, nameInput.value, currentNumber, currentStatus);
            saveCardSettings(cardId, nameInput.value, currentNumber, currentStatus);
        });

        // 카드 번호 입력 변경 시
        numberInput.addEventListener('input', () => {
            const currentName = nameInput.value;
            const currentStatus = document.getElementById(`${cardId}-status-display`).classList.contains('active');
            updateCardDisplay(cardId, currentName, numberInput.value, currentStatus);
            saveCardSettings(cardId, currentName, numberInput.value, currentStatus);
        });

        // 활성/비활성 토글 버튼 클릭 시
        toggleButton.addEventListener('click', () => {
            const currentName = nameInput.value;
            const currentNumber = numberInput.value;
            const currentStatusDisplay = document.getElementById(`${cardId}-status-display`);
            const newStatus = !currentStatusDisplay.classList.contains('active');
            updateCardDisplay(cardId, currentName, currentNumber, newStatus);
            saveCardSettings(cardId, currentName, currentNumber, newStatus);
        });

        // 다운로드 버튼 클릭 시
        downloadButton.addEventListener('click', () => {
            const cardImageArea = document.getElementById(`${cardId}-image-area`);
            html2canvas(cardImageArea, {
                scale: 2, // 고해상도 이미지를 위해 스케일 증가
                useCORS: true, // 외부 이미지 사용 시 필요
                allowTaint: true // 크로스 도메인 이미지 문제 해결 시도
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `${cardId}_card.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(error => {
                console.error("카드 다운로드 실패:", error);
                alert("카드 다운로드에 실패했습니다. 이미지 로딩 문제일 수 있습니다.");
            });
        });
    });
});
