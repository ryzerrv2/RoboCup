const form = document.getElementById('registry');
form.addEventListener('submit', function(e) {
	e.preventDefault();

	const url = `${window.location.href.replace("index.html", "")}/script.php`;
	let UserData = {}; 


	for(let i = 0; i < e.target.children.length - 2; i++) {
		let inputField = e.target.children[i];
		console.log(inputField);
		UserData[inputField.id] = inputField.value;
		inputField.value = "";
	}

	fetch(url, {
		method: 'post',
		mode: 'cors',
		headers: { 
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(UserData),
	})
	.then((response) => {
		if(response.status != 201) { 
			// In case of an error, throw.
			throw new Error("Something went wrong!");
		}
		return response.json();
	})
	.then((data) => {
		createToast("success");
	})
	.catch((error) => createToast("error") );
});

const notifications = document.querySelector(".notifications");

const toastDetails = {
    timer: 5000,
    success: {
        icon: 'fa-circle-check',
        text: 'Successo: Dati correttamente inviati.',
    },
	error: {
        icon: 'fa-circle-xmark',
        text: 'Errore: 409 Conflict.',
    },
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); 
    setTimeout(() => toast.remove(), 500);
}

const createToast = (id) => {
    const { icon, text } = toastDetails[id];
    const toast = document.createElement("li"); 
    toast.className = `toast ${id}`;
    toast.innerHTML = `<div class="column">
							<i class="fa-solid ${icon}"></i>
                         	<span>${text}</span>
                      	</div>
                      	<i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast);

	toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}