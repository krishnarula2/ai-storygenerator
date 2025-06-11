# ComicQuest 🦸‍♂️

An AI-powered comic story generator that creates dynamic superhero-style stories with generated visuals. Built with React (JavaScript), CSS, and FastAPI (Python).

## 🌟 Features

- **AI Story Generation**: Uses Azure OpenAI GPT-4 to create engaging comic book narratives
- **Dynamic Image Generation**: Generates comic-style visuals using HuggingFace API with Pollinations fallback
- **Interactive Comic Reader**: Full-screen comic reading experience with keyboard navigation
- **Cyberpunk UI**: Futuristic dark theme with terminal-style interface and neon effects
- **Sequential Storytelling**: Create multi-panel comic sequences that build on each other
- **Local Storage**: Automatically saves your comic panels so they persist between sessions
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Tech Stack

- **Frontend**: React (JavaScript), CSS, HTML
- **Backend**: FastAPI (Python)
- **AI Services**: Azure OpenAI API, HuggingFace API, Pollinations API
- **Styling**: Pure CSS with cyberpunk theme (no frameworks)

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- Azure OpenAI API Key and Endpoint
- HuggingFace API Key (optional, will fallback to Pollinations)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Create environment file**:
   ```bash
   # Create .env file in backend directory
   touch .env
   ```

4. **Add your API keys to `.env`**:
   ```env
   # Azure OpenAI Configuration (Required)
   AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
   AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
   AZURE_OPENAI_DEPLOYMENT_NAME=your_gpt4_deployment_name
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   
   # HuggingFace API (Optional - fallback to Pollinations)
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

5. **Run the backend server**:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## 🎮 How to Use

1. **Start the Application**: Make sure both backend and frontend servers are running
2. **Enter Story Concept**: Type your superhero story idea in the terminal input
3. **Generate Comic**: Click "EXECUTE COMIC GENERATION" or press Ctrl+Enter
4. **Continue Story**: Use "CONTINUE SEQUENCE" to add more panels to your comic
5. **View Results**: Each panel shows the AI-generated story text with a matching image

### Example Prompts

- "A superhero loses their memory and must rediscover their powers"
- "A team of heroes faces their greatest enemy in a final battle"
- "A young person discovers they have inherited incredible abilities"
- "Heroes from different dimensions must unite to save reality"

## 🔧 API Endpoints

### POST `/generate-story`
- **Input**: `{ "prompt": "story concept" }`
- **Output**: `{ "story": "generated story text" }`

### POST `/generate-image`
- **Input**: `{ "scene": "scene description" }`
- **Output**: `{ "image_url": "generated image URL" }`

## 🎨 Features Explained

### AI Story Generation
- Uses GPT-4 to create comic book style narratives
- Optimized prompts for action-packed, visual storytelling
- Maintains continuity across multiple panels

### Image Generation Pipeline
1. **Primary**: HuggingFace Stable Diffusion XL
2. **Fallback**: Pollinations API (always available)
3. **Enhancement**: Automatically adds comic book style prompts

### Cyberpunk UI Elements
- Terminal-style input interface
- Neon glow effects and gradients
- Animated backgrounds and loading states
- Responsive grid layout for comic panels

## 📁 Project Structure

```
comicquest/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── openai_client.py     # Story generation logic
│   ├── image_client.py      # Image generation with fallbacks
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html       # Main HTML file
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── index.js         # React entry point
│   │   ├── components/
│   │   │   └── ComicPanel.js # Individual panel component
│   │   └── styles/
│   │       └── styles.css   # Cyberpunk theme styles
│   └── package.json         # Node.js dependencies
├── README.md                # This file
└── .gitignore              # Git ignore rules
```

## 🔐 Security Notes

- API keys are stored securely in backend environment variables
- Frontend never directly accesses external APIs
- CORS properly configured for local development

## 🛠️ Development

### Running Tests
```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **Story generation fails**: Check your OpenAI API key in `.env`
2. **Images not loading**: HuggingFace API might be down, but Pollinations should work as fallback
3. **CORS errors**: Make sure backend is running on port 8000
4. **Panels not saving**: Check browser localStorage permissions

### Getting API Keys

- **Azure OpenAI**: Visit [Azure Portal](https://portal.azure.com) → Create OpenAI Resource → Keys and Endpoint
- **HuggingFace**: Visit [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)


## 📄 License

This project is licensed under the MIT License.

Created by Krish Narula

---

**ComicQuest** - Bringing your superhero stories to life with AI! 🚀 
