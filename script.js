/* 1. VARIALES & DOM SELECTORS */
const themeToggleBtn = document.getElementById("themeToggle");
const body = document.body;

/* 2. DARK / LIGHT MODE TOGGLE */

function applyTheme(isDark) {
  if (isDark) {
    body.classList.add("dark-mode");
    themeToggleBtn.checked = true;
  } else {
    body.classList.remove("dark-mode");
    themeToggleBtn.checked = false;
  }
}

const savedTheme = localStorage.getItem("darkMode") === "true";
applyTheme(savedTheme);

themeToggleBtn.addEventListener("change", function () {
  const isDarkNow = themeToggleBtn.checked;

  applyTheme(isDarkNow);

  localStorage.setItem("darkMode", isDarkNow);
});

/*
   3. DYNAMIC GREETING SYSTEM (Date Object + Conditional)
*/

function showGreeting() {
  const now = new Date();

  const currentHour = now.getHours(); // number: 0-23
  let greeting = ""; // string

  // menentukan sapaan berdasarkan waktu
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 15) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 15 && currentHour < 18) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  // format waktu
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // format tanggal
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const currentDate = now.toLocaleDateString("en-US", options);

  // tampilkan ke HTML
  document.getElementById("greeting").innerText =
    `${greeting}, Welcome to My Website! 👋`;

  document.getElementById("currentDate").innerText =
    `📅 ${currentDate}`;

  document.getElementById("currentTime").innerText =
    `🕒 Current Time: ${hours}:${minutes}`;
}

showGreeting();

/*
   4. MOOD TRACKER (State + Object + DOM Manipulation + Event Handling)
*/

let selectedMood = null;

// mengambil semua tombol mood
const moodButtons = document.querySelectorAll(".mood-btn");
const moodResult = document.getElementById("moodResult");

// pesan untuk setiap mood
const moodMessages = {
  happy: "Keep smiling! I hope your day stays as bright as your mood. ✨",
  excited: "That's amazing! Keep your excitement and enjoy every moment. 🌟",
  neutral: "It's okay to have a normal day. Take things at your own pace. 🍃",
  sleepy: "Don't forget to get enough rest. Your body deserves a break. 💤",
  stressed: "Take a deep breath. I hope things get better and you find your calm again. 🤍",
  angry: "It's okay to feel angry. Take some time to relax and calm yourself down. 🌿"
};


// event ketika tombol mood ditekan
moodButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    // mengambil data mood dari HTML
    selectedMood = button.dataset.mood;

    // menampilkan pesan sesuai mood
    moodResult.innerText =
      `You're feeling ${selectedMood} today! ${moodMessages[selectedMood]}`;


    // menghapus class active dari semua tombol
    for (let i = 0; i < moodButtons.length; i++) {
      moodButtons[i].classList.remove("active");
    }


    // memberi efek active pada tombol yang dipilih
    button.classList.add("active");

  });

});

/*
   5. INTERACTIVE TO-DO LIST (Array of Objects + CRUD + localStorage)
*/

// mengambil data dari localStorage
let todos = JSON.parse(localStorage.getItem("todos")) || [];

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoEmpty = document.getElementById("todoEmpty");


// menyimpan data ke localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// menampilkan semua task
function renderTodos() {

  todoList.innerHTML = "";
  todos.forEach(function (todo) {
    const li = document.createElement("li");
    li.className = "todo-item";

// checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;


    checkbox.addEventListener("change", function () {
      toggleTodo(todo.id);
    });

// tulisan task
    const span = document.createElement("span");
    span.innerText = todo.text;

    if (todo.completed) {
      span.classList.add("completed");
    }

// tombol hapus
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";


    deleteBtn.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);

  });


// pesan kalau belum ada tugas
  todoEmpty.style.display =
    todos.length === 0 ? "block" : "none";
}

// tambah task baru
function addTodo(text) {

  if (text.trim() === "") return;
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

// mengubah status selesai/belum
function toggleTodo(id) {
  todos = todos.map(function (todo) {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }

    return todo;

  });

  saveTodos();
  renderTodos();
}

// menghapus task
function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });

  saveTodos();
  renderTodos();
}

// saat form dikirim
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = "";

});

// tampilkan data saat pertama membuka web
renderTodos();

/*
   6. RANDOM QUOTE GENERATOR (Async/Await + Fetch)
*/

const quoteBtn = document.getElementById("quoteBtn");
const quoteText = document.getElementById("quoteText");

// fallback quotes jika API gagal
const fallbackQuotes = [
  {
    content: "One is loved because one is loved. No reason is needed for loving.",
    author: "Paulo Coelho"
  },
  {
    content: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    content: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle"
  },
  {
    content: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius"
  },
  {
    content: "There is some good in this world, and it's worth fighting for.",
    author: "J.R.R. Tolkien"
  },
  {
    content: "To live is the rarest thing in the world. Most people exist, that is all.",
    author: "Oscar Wilde"
  },
  {
    content: "The mystery of human existence lies not in just staying alive, but in finding something to live for.",
    author: "Fyodor Dostoevsky"
  },
  {
    content: "And, when you want something, all the universe conspires in helping you to achieve it.",
    author: "Paulo Coelho"
  }
];

async function fetchQuote() {

  quoteText.innerText = "Loading...";
  quoteBtn.disabled = true;

  try {

    const response = await fetch("https://api.quotable.io/random");

    if (!response.ok) {
      throw new Error("Response was not OK");
    }

    const data = await response.json();

    quoteText.innerText = `"${data.content}" — ${data.author}`;

  } catch (error) {

    console.error(error);

    const random =
      fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

    quoteText.innerText = `"${random.content}" — ${random.author} (Offline Quote)`;

  } finally {

    quoteBtn.disabled = false;

  }

}

quoteBtn.addEventListener("click", fetchQuote);

/*
   7. VIRTUAL CAT
*/

const cat = document.getElementById("cat");

// Desktop / Laptop
cat.addEventListener("mouseenter", function () {
  cat.src = "cat-sleep.png";
});

cat.addEventListener("mouseleave", function () {
  cat.src = "cat-awake.png";
});

// Mobile / Touchscreen
cat.addEventListener("touchstart", function () {
  cat.src = "cat-sleep.png";
});

cat.addEventListener("touchend", function () {
  cat.src = "cat-awake.png";
});
