"use strict";
class Feedback {
    constructor() {
        this.feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    }
    renderFeedback() {
        const tbody = document.getElementById('feedbackList');
        if (tbody) {
            tbody.innerHTML = '';
            this.feedbacks.forEach((feedback, index) => {
                const row = document.createElement('tr');
                row.classList.add('feedback-item');
                row.innerHTML = `
                    <td>${feedback.score}</td>
                    <td>${feedback.name}</td>
                    <td>
                        <button class="edit-btn" onclick="editFeedback(${index})"><span class="material-symbols-outlined">edit_square</span></button>
                        <button class="delete-btn" onclick="deleteFeedback(${index})"><span class="material-symbols-outlined">close</span></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    createFeedback(newFeedback) {
        this.feedbacks.push(newFeedback);
        this.saveToLocalStorage();
        this.renderFeedback();
    }
    updateFeedback(index, updatedFeedback) {
        this.feedbacks[index] = updatedFeedback;
        this.saveToLocalStorage();
        this.renderFeedback();
    }
    deleteFeedback(index) {
        if (confirm('Bạn có chắc chắn muốn xoá feedback này không?')) {
            this.feedbacks.splice(index, 1);
            this.saveToLocalStorage();
            this.renderFeedback();
        }
    }
    saveToLocalStorage() {
        localStorage.setItem('feedbacks', JSON.stringify(this.feedbacks));
    }
}
let feedbackManager = new Feedback();
let submitButton = document.getElementById('submitButton');
let feedbackInput = document.getElementById('feedbackInput');
submitButton.addEventListener('click', () => {
    let feedbackText = feedbackInput.value;
    let scoreInput = document.querySelector('input[name="rating"]:checked');
    let score = scoreInput ? parseInt(scoreInput.value) : 0;
    if (score >= 1 && score <= 10 && feedbackText.trim() !== '') {
        let newFeedback = {
            id: Date.now(),
            name: feedbackText,
            score: score
        };
        feedbackManager.createFeedback(newFeedback);
        feedbackInput.value = '';
        scoreInput.checked = false;
    }
    else {
        alert('Vui lòng nhập đầy đủ thông tin đánh giá.');
    }
});
function deleteFeedback(index) {
    feedbackManager.deleteFeedback(index);
}
function editFeedback(index) {
    let feedback = feedbackManager.feedbacks[index];
    let feedbackInput = document.getElementById('feedbackInput');
    feedbackInput.value = feedback.name;
    let ratingInputs = document.querySelectorAll('input[name="rating"]');
    ratingInputs.forEach(input => {
        if (parseInt(input.value) === feedback.score) {
            input.checked = true;
        }
        else {
            input.checked = false;
        }
    });
    let submitButton = document.getElementById('submitButton');
    submitButton.textContent = 'Update';
    submitButton.onclick = () => {
        let updatedName = feedbackInput.value;
        let scoreInput = document.querySelector('input[name="rating"]:checked');
        if (updatedName.trim() !== '') {
            feedback.name = updatedName;
            feedback.score = parseInt(scoreInput.value);
            let tbody = document.getElementById('feedbackList');
            if (tbody) {
                let row = tbody.querySelector(`tr:nth-child(${index + 1})`);
                if (row) {
                    let cells = row.querySelectorAll('td');
                    cells[0].textContent = feedback.score.toString();
                    cells[1].textContent = feedback.name;
                }
            }
            submitButton.textContent = 'Send';
            submitButton.onclick = submitFeedback;
        }
    };
}
feedbackManager.renderFeedback();
