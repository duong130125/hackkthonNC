interface IFeedback {
    id: number;
    name: string;
    score: number;
}

class Feedback implements IFeedback {
    feedbacks: IFeedback[];

    constructor() {
        this.feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    }

    renderFeedback(): void {
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
    

    createFeedback(newFeedback: IFeedback): void {
        this.feedbacks.push(newFeedback);
        this.saveToLocalStorage();
        this.renderFeedback();
    }

    updateFeedback(index: number, updatedFeedback: IFeedback): void {
        this.feedbacks[index] = updatedFeedback;
        this.saveToLocalStorage();
        this.renderFeedback();
    }

    deleteFeedback(index: number): void {
        if (confirm('Bạn có chắc chắn muốn xoá feedback này không?')) {
            this.feedbacks.splice(index, 1);
            this.saveToLocalStorage();
            this.renderFeedback();
        }
    }

    private saveToLocalStorage(): void {
        localStorage.setItem('feedbacks', JSON.stringify(this.feedbacks));
    }
}


let feedbackManager = new Feedback();

let submitButton = document.getElementById('submitButton') as HTMLButtonElement;
let feedbackInput = document.getElementById('feedbackInput') as HTMLInputElement;

submitButton.addEventListener('click', () => {
    let feedbackText = feedbackInput.value;
    let scoreInput = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;
    let score = scoreInput ? parseInt(scoreInput.value) : 0;

    if (score >= 1 && score <= 10 && feedbackText.trim() !== '') {
        let newFeedback: IFeedback = {
            id: Date.now(),
            name: feedbackText,
            score: score
        };
        feedbackManager.createFeedback(newFeedback);
        feedbackInput.value = '';
        scoreInput.checked = false;
    } else {
        alert('Vui lòng nhập đầy đủ thông tin đánh giá.');
    }
});


function deleteFeedback(index: number) {
    feedbackManager.deleteFeedback(index);
}

function editFeedback(index: number) {
    let feedback = feedbackManager.feedbacks[index];

    let feedbackInput = document.getElementById('feedbackInput') as HTMLInputElement;
    feedbackInput.value = feedback.name;

    let ratingInputs = document.querySelectorAll('input[name="rating"]') as NodeListOf<HTMLInputElement>;
    ratingInputs.forEach(input => {
        if (parseInt(input.value) === feedback.score) {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });

    let submitButton = document.getElementById('submitButton') as HTMLButtonElement;
    submitButton.textContent = 'Update';


    submitButton.onclick = () => {
        let updatedName = feedbackInput.value;
        let scoreInput = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;

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
