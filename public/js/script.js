document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".reg-text").forEach(el => {
        el.classList.remove("loaded"); // Xóa trạng thái cũ
        setTimeout(() => {
            el.classList.add("loaded"); // Kích hoạt hiệu ứng lại
        }, 100); // Đợi 100ms để đảm bảo hiệu ứng chạy lại
    });
});

//auto type text
document.addEventListener("DOMContentLoaded", function () {
    const keyElement = document.getElementById("typing-key");
    const colonElement = document.getElementById("colon");
    const valueElement = document.getElementById("typing-value");
    const cursor = document.querySelector(".cursor");

    const keyText = '"name"';
    const colonText = ": ";
    const valueText = '"DungNguyen"';
    
    let index = 0;

    function typeKey() {
        if (index < keyText.length) {
            keyElement.innerHTML += keyText[index];
            index++;
            setTimeout(typeKey, 100);
        } else {
            index = 0;
            setTimeout(typeColon, 100);
        }
    }

    function typeColon() {
        if (index < colonText.length) {
            colonElement.innerHTML += colonText[index];
            index++;
            setTimeout(typeColon, 100);
        } else {
            index = 0;
            setTimeout(typeValue, 100);
        }
    }

    function typeValue() {
        if (index < valueText.length) {
            valueElement.innerHTML += valueText[index];
            index++;
            setTimeout(typeValue, 100);
        } else {
            cursor.style.display = "none"; // Ẩn con trỏ khi gõ xong
        }
    }

    setTimeout(typeKey, 500);
});

const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

backToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

//
const jsonData = {
    "user": {
        "id": 101,
        "name": "John Doe",
        "email": "johndoe@example.com",
        "active": true
    },
    "settings": {
        "theme": "dark",
        "notifications": false
    },
    "logs": [
        {"event": "login", "timestamp": "2025-03-18T14:32:00Z"},
        {"event": "update_profile", "timestamp": "2025-03-18T15:05:10Z"}
    ],
    "last_seen": null,
    "description": "Everything looked normal… Just a normal JSON background until you see this description.",
};

// Hàm tô màu JSON
function syntaxHighlight(json) {
    json = JSON.stringify(json, null, 4); // Định dạng đẹp

    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?=\s*:))|(".*?")|(\b(true|false)\b)|(\bnull\b)|(\b\d+\b)/g,
        (match, key, _, string, boolean, nullValue, number) => {
            if (key) return `<span class="json-key">${match}</span>`; // Key màu xanh dương
            if (string) return `<span class="json-string">${match}</span>`; // String màu cam
            if (boolean) return `<span class="json-boolean">${match}</span>`; // Boolean màu xanh dương
            if (nullValue) return `<span class="json-null">${match}</span>`; // Null màu vàng
            if (number) return `<span class="json-number">${match}</span>`; // Number màu xanh lá
            return match;
        }
    );
}
// Render JSON có màu sắc
document.getElementById("json-code").innerHTML = syntaxHighlight(jsonData);


document.getElementById("contacts-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const emailInput = document.getElementById("email");
    const email = emailInput.value;
    const message = document.getElementById("message").value;
    const tooltipError = document.getElementById("tooltip-error");
    if (!isValidEmail(email)) {
        emailInput.classList.add("is-invalid");
        tooltipError.style.display = "block";
        setTimeout(() => {
            emailInput.classList.remove("is-invalid");
            tooltipError.style.display = "none";
        }, 3000);
        document.addEventListener("click", function hideTooltip(event) {
            if (!emailInput.contains(event.target) && event.target !== tooltipError) {
                emailInput.classList.remove("is-invalid");
                tooltipError.style.display = "none";
                clearTimeout(timeoutId); // Hủy timeout nếu đã click
                document.removeEventListener("click", hideTooltip); // Xóa sự kiện sau khi chạy
            }
        });
    } else {
        emailInput.classList.remove("is-invalid");
        tooltipError.style.display = "none";
        fetch("/contact", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Có lỗi khi gửi dữ liệu');
            }
            const successModal = new bootstrap.Modal(document.getElementById("contactSuccessModal"));
            successModal.show();
            this.reset();
            return response.text();
        })
        .then(data => console.log(data))
        .catch(error => console.error("Lỗi:", error));
    }
});

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}