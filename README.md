
# Code Iterator AI

Code Iterator AI is a full-stack application that lets users iterate over their code snippets using AI prompts. It provides a frontend for uploading, editing, iterating, and managing code, and a backend API to handle the AI generation.

---

## 🌟 Features

### Frontend

- Upload `.js`, `.ts`, `.py`, `.html`, or `.txt` code files.
- Input code manually into a beautiful textarea.
- Add a custom prompt to instruct the AI for code iteration.
- Animated code output typing effect for a smoother experience.
- Copy the output code to the clipboard easily.
- Restore any previous input and output from localStorage history.
- Edit past history items and re-iterate or save as new.
- Clear all history with one click.
- Responsive layout and mobile-ready.
- Dark mode default for a sleek UI (future light/dark mode toggle ready).

### Backend

- API built to accept code and prompt as input.
- Connects to an AI service (like OpenRouter or OpenAI) to generate iterations.
- Sends back iterated code and explanation.
- Handles error cases gracefully.

---

## 🛠️ Technology Stack

| Layer       | Tech Stack                                    |
| :---------- | :------------------------------------------- |
| Frontend    | React.js, TailwindCSS, Prism.js, Lucide Icons |
| Backend     | Express.js (Node.js)                         |
| AI Provider | OpenRouter (can be switched to OpenAI)       |
| Storage     | localStorage (for iteration history)         |

---

## ✨ Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   By default, it will run on:  

   ```
   http://localhost:5173
   ```

---

## 🚀 Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Configure your environment:
   - Create a `.env` file in the backend folder.
   - Add your OpenRouter (or OpenAI) API key:

     ```
     API_KEY=your_openrouter_or_openai_key_here
     ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

   By default, it will run on:  

   ```
   http://localhost:5000
   ```

---

## ⚙️ API Endpoint

**POST** `/iterate`

**Request Body:**

```json
{
  "code": "your code here",
  "prompt": "your prompt here"
}
```

**Response:**

```json
{
  "iterated_code": "modified code by AI",
  "explanation": "description of changes"
}
```

---

## 💻 Project Structure

```
code-iterator-ai/
├── backend/
│   ├── index.js (Express API)
│   ├── package.json
│   └── .env (your API key)
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🧠 Future Enhancements

- Light/Dark theme toggle with localStorage saving.
- Dynamic syntax highlighting based on current theme.
- Add a diff viewer between input and output versions.
- Full authentication system (optional if multi-user support added).
- Deploy frontend and backend on Vercel, Netlify, or Render.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

If you want to contribute:

- Fork the repository
- Create a feature branch (`git checkout -b feature-new`)
- Commit your changes (`git commit -m 'Add new feature'`)
- Push to the branch (`git push origin feature-new`)
- Create a Pull Request!

---

## 🔥 Author

Built with ❤️ by Sahil Kumar Sharma

---
