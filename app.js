
        const exercises = [];
        let currentFilter = 'all';
        let currentSearch = '';

        document.addEventListener('DOMContentLoaded', function() {
            loadExercises();
            loadProgress();
            updateStats();
        });

        function loadExercises() {
            const exerciseElements = document.querySelectorAll('.exercise');
            exerciseElements.forEach(exercise => {
                const module = exercise.dataset.module;
                const difficulty = exercise.dataset.difficulty;
                const points = parseInt(exercise.dataset.points);
                const title = exercise.querySelector('.exercise-title').textContent;
                exercises.push({ element: exercise, module, difficulty, points, title });
            });
        }

        function showModule(moduleId) {
            const moduleElements = document.querySelectorAll('.module');
            const navBtns = document.querySelectorAll('.nav-btn');
            moduleElements.forEach(module => module.style.display = 'none');
            navBtns.forEach(btn => btn.classList.remove('active'));
            if (moduleId === 'all') {
                moduleElements.forEach(module => module.style.display = 'block');
                navBtns[0].classList.add('active');
            } else {
                const module = document.getElementById(moduleId);
                if (module) {
                    module.style.display = 'block';
                    document.querySelector(`[onclick="showModule('${moduleId}')"]`).classList.add('active');
                }
            }
            filterExercises();
        }

        function filterByDifficulty(difficulty) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[onclick="filterByDifficulty('${difficulty}')"]`).classList.add('active');
            currentFilter = difficulty;
            filterExercises();
        }

        function searchExercises() {
            currentSearch = document.getElementById('search-box').value.toLowerCase();
            filterExercises();
        }

        function filterExercises() {
            exercises.forEach(exercise => {
                const element = exercise.element;
                const title = exercise.title.toLowerCase();
                const description = element.querySelector('.exercise-description').textContent.toLowerCase();
                let show = true;
                if (currentFilter !== 'all') show = exercise.difficulty === currentFilter;
                if (show && currentSearch) show = title.includes(currentSearch) || description.includes(currentSearch);
                element.style.display = show ? 'block' : 'none';
            });
        }

        function checkAnswer(button) {
            const exerciseElement = button.closest('.exercise');
            const answerBox = exerciseElement.querySelector('.answer-box');
            const feedback = exerciseElement.querySelector('.answer-feedback');
            const answer = answerBox.value.trim();
            feedback.className = 'answer-feedback';
            feedback.textContent = '';
            if (!answer) {
                feedback.className = 'answer-feedback info';
                feedback.textContent = 'Por favor, escribe una respuesta.';
                return;
            }
            feedback.className = 'answer-feedback correct';
            feedback.textContent = '✅ Respuesta aceptada. ¡Buen trabajo!';
        }

        function toggleHint(button) {
            const exerciseElement = button.closest('.exercise');
            const hintContent = exerciseElement.querySelector('.hint-content');
            hintContent.classList.toggle('show');
            button.textContent = hintContent.classList.contains('show') ? '🔍 Ocultar pista' : '💡 Mostrar pista';
        }

        function updateProgress(checkbox) {
            const exerciseElement = checkbox.closest('.exercise');
            if (checkbox.checked) exerciseElement.classList.add('completed');
            else exerciseElement.classList.remove('completed');
            updateStats();
            saveProgress();
        }

        function updateStats() {
            let totalCompleted = 0, totalPoints = 0, easyCompleted = 0, mediumCompleted = 0, hardCompleted = 0;
            exercises.forEach(exercise => {
                const checkbox = exercise.element.querySelector('input[type="checkbox"]');
                if (checkbox.checked) {
                    totalCompleted++; totalPoints += exercise.points;
                    if (exercise.difficulty === 'easy') easyCompleted++;
                    if (exercise.difficulty === 'medium') mediumCompleted++;
                    if (exercise.difficulty === 'hard') hardCompleted++;
                }
            });
            document.getElementById('completed-count').textContent = totalCompleted;
            document.getElementById('completed-points').textContent = totalPoints;
            document.getElementById('progress-easy').textContent = easyCompleted;
            document.getElementById('progress-medium').textContent = mediumCompleted;
            document.getElementById('progress-hard').textContent = hardCompleted;
            const totalExercises = exercises.length;
            const percentage = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;
            document.getElementById('progress-percentage').textContent = percentage + '%';
            document.getElementById('progress-fill').style.width = percentage + '%';
        }

        function saveProgress() {
            const progress = exercises.map(exercise => ({
                module: exercise.module,
                title: exercise.title,
                completed: exercise.element.querySelector('input[type="checkbox"]').checked
            }));
            localStorage.setItem('ctfProgress', JSON.stringify(progress));
        }

        function loadProgress() {
            const savedProgress = localStorage.getItem('ctfProgress');
            if (savedProgress) {
                JSON.parse(savedProgress).forEach(item => {
                    const exercise = exercises.find(e => e.title === item.title && e.module === item.module);
                    if (exercise) {
                        const checkbox = exercise.element.querySelector('input[type="checkbox"]');
                        checkbox.checked = item.completed;
                        if (item.completed) exercise.element.classList.add('completed');
                    }
                });
            }
        }
    