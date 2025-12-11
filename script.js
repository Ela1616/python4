// Python курсы үшін негізгі JavaScript файлы

// Бет жүктелген кезде инициализация
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupSearch();
    setupProgressTracking();
    setupAnimations();
    updateCurrentTime();
    setupInteractiveElements();
}

// Іздеуді баптау
function setupSearch() {
    const searchBox = document.getElementById('searchBox');
    const buttons = document.querySelectorAll('button[data-search]');
    
    if (searchBox && buttons.length > 0) {
        searchBox.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            buttons.forEach(btn => {
                const text = btn.textContent.toLowerCase();
                if (query === '' || text.includes(query)) {
                    btn.style.display = 'inline-block';
                    btn.style.animation = 'fadeIn 0.3s ease';
                } else {
                    btn.style.display = 'none';
                }
            });
            
            // Іздеу нәтижелерін көрсету/жасыру
            const visibleButtons = Array.from(buttons).filter(btn => 
                btn.style.display !== 'none'
            ).length;
            
            showSearchResults(visibleButtons, query);
        });
    }
}

// Іздеу нәтижелерін көрсету
function showSearchResults(count, query) {
    let resultsDiv = document.getElementById('searchResults');
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'searchResults';
        resultsDiv.style.cssText = `
            text-align: center;
            margin: 20px 0;
            font-size: 16px;
            color: #666;
        `;
        const container = document.querySelector('.container');
        if (container) container.appendChild(resultsDiv);
    }
    
    if (query) {
        resultsDiv.innerHTML = count > 0 
            ? `Табылған бөлімдер: ${count}`
            : 'Ештеңе табылмады';
        resultsDiv.style.color = count > 0 ? '#27ae60' : '#e74c3c';
    } else {
        resultsDiv.innerHTML = '';
    }
}

// Прогресс қадағалауды баптау
function setupProgressTracking() {
    const progressData = getProgressData();
    updateProgressDisplay(progressData);
    
    // Аяқталған сабақтарды белгілеу
    markCompletedLessons();
}

// Прогресс деректерін алу
function getProgressData() {
    const saved = localStorage.getItem('pythonCourseProgress');
    return saved ? JSON.parse(saved) : {
        completedLessons: [],
        currentLesson: 0,
        totalLessons: 11,
        quizScores: {}
    };
}

// Прогресс сақтау
function saveProgress(progress) {
    localStorage.setItem('pythonCourseProgress', JSON.stringify(progress));
}

// Сабақты аяқталды деп белгілеу
function markLessonComplete(lessonId) {
    const progress = getProgressData();
    if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        saveProgress(progress);
        updateProgressDisplay(progress);
        showCompletionMessage();
    }
}

// Прогресс көрсеткішін жаңарту
function updateProgressDisplay(progress) {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        const percentage = Math.round((progress.completedLessons.length / progress.totalLessons) * 100);
        progressFill.style.width = percentage + '%';
        progressText.textContent = `Прогресс: ${progress.completedLessons.length}/${progress.totalLessons} сабақ (${percentage}%)`;
    }
}

// Аяқталған сабақтарды белгілеу
function markCompletedLessons() {
    const progress = getProgressData();
    const lessonButtons = document.querySelectorAll('[data-lesson-id]');
    
    lessonButtons.forEach(btn => {
        const lessonId = btn.getAttribute('data-lesson-id');
        if (progress.completedLessons.includes(lessonId)) {
            btn.classList.add('completed');
            btn.innerHTML += ' ✅';
        }
    });
}

// Аяқтау хабарламасын көрсету
function showCompletionMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #27ae60, #2ecc71);
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.5s ease;
    `;
    message.textContent = '🎉 Сабақ аяқталды!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => document.body.removeChild(message), 500);
    }, 2000);
}

// Анимацияны баптау
function setupAnimations() {
    // Элементтердің пайда болу анимациясы
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideIn 0.6s ease-out';
            }
        });
    });
    
    document.querySelectorAll('.lesson-page, .content-box').forEach(el => {
        observer.observe(el);
    });
}

// Қазіргі уақытты жаңарту
function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        function updateTime() {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            };
            timeElement.textContent = now.toLocaleDateString('kk-KZ', options);
        }
        
        updateTime();
        setInterval(updateTime, 1000);
    }
}

// Интерактивті элементтерді баптау
function setupInteractiveElements() {
    setupCodeCopyButtons();
    setupInteractiveQuiz();
    setupPythonEditor();
}

// Код көшіру батырмаларын баптау
function setupCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        const container = document.createElement('div');
        container.className = 'code-example';
        block.parentNode.insertBefore(container, block);
        container.appendChild(block);
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Көшіру';
        copyBtn.onclick = () => copyCode(block.textContent, copyBtn);
        container.appendChild(copyBtn);
    });
}

// Код көшіру
function copyCode(code, button) {
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Көшірілді!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#27ae60';
        }, 2000);
    });
}

// Интерактивті квизды баптау
function setupInteractiveQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;
    
    const questions = [
        {
            question: "print() функциясы не шығарады?",
            options: [
                "Пайдаланушыдан деректерді сұрайды",
                "Мәтінді экранға шығарады", 
                "Айнымалы құрады",
                "Бағдарламаны тоқтатады"
            ],
            correct: 1
        },
        {
            question: "age = 25 айнымалысының типі қандай?",
            options: ["str", "float", "int", "bool"],
            correct: 2
        },
        {
            question: "if операторы не істейді?",
            options: [
                "Цикл құрады",
                "Шарт жасайды",
                "Функция анықтайды", 
                "Деректерді енгізеді"
            ],
            correct: 1
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion() {
        if (currentQuestion >= questions.length) {
            showQuizResults();
            return;
        }
        
        const q = questions[currentQuestion];
        quizContainer.innerHTML = `
            <h3>Сұрақ ${currentQuestion + 1} / ${questions.length}</h3>
            <div class="quiz-question">
                <p><strong>${q.question}</strong></p>
                ${q.options.map((option, index) => `
                    <button class="quiz-option" onclick="selectAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    window.selectAnswer = function(selectedIndex) {
        const q = questions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((btn, index) => {
            btn.disabled = true;
            if (index === q.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex) {
                btn.classList.add('incorrect');
            }
        });
        
        if (selectedIndex === q.correct) {
            score++;
        }
        
        setTimeout(() => {
            currentQuestion++;
            showQuestion();
        }, 2000);
    };
    
    function showQuizResults() {
        const percentage = Math.round((score / questions.length) * 100);
        quizContainer.innerHTML = `
            <h3>Квиз нәтижелері</h3>
            <div class="content-box">
                <h4>Сіздің нәтижеңіз: ${score}/${questions.length} (${percentage}%)</h4>
                <p>${percentage >= 80 ? 'Керемет! 🎉' : percentage >= 60 ? 'Жақсы! 👍' : 'Материалды қайта қараңыз 📚'}</p>
            </div>
        `;
        
        // Нәтижені сақтау
        const progress = getProgressData();
        progress.quizScores.quiz1 = percentage;
        saveProgress(progress);
    }
    
    showQuestion();
}

// Python редакторын баптау
function setupPythonEditor() {
    const editorContainer = document.querySelector('.python-editor');
    if (!editorContainer) return;
    
    // Pyodide инициализациясы
    loadPyodide().then(pyodide => {
        window.pyodide = pyodide;
        
        const runBtn = document.getElementById('runCodeBtn');
        const codeInput = document.getElementById('pythonCode');
        const output = document.getElementById('pythonOutput');
        
        if (runBtn && codeInput && output) {
            runBtn.onclick = async () => {
                try {
                    output.textContent = 'Орындалуда...';
                    const result = await pyodide.runPythonAsync(codeInput.value);
                    output.textContent = result || 'Код сәтті орындалды!';
                } catch (error) {
                    output.textContent = 'Қате: ' + error.message;
                }
            };
        }
    });
}

// Pyodide жүктеу
async function loadPyodide() {
    if (window.pyodide) return window.pyodide;
    
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
    document.head.appendChild(script);
    
    await new Promise(resolve => script.onload = resolve);
    return await loadPyodide();
}

// Қосымша утилиталар
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// CSS анимациялары JavaScript арқылы
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);