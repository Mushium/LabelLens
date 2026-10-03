![LabelLens — Your images. Your classes. Your classifier.](docs/readme-banner.svg)

<p align="center">
  <strong>A browser-based workspace for building custom image classifiers.</strong><br>
  Organize labeled images, train a neural network, and try predictions in one workflow.
</p>

<p align="center">
  <a href="https://lablelslens.netlify.app">Live Demo</a> ·
  <a href="https://labellens.onrender.com">Backend API</a> ·
  <a href="#what-you-can-do">Features</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#run-locally">Run locally</a>
</p>

---

## Why LabelLens?

Experimenting with image classification involves more than training a model: you need to organize examples, assign labels, and test the result. LabelLens brings those steps into a React interface backed by Flask, TensorFlow, and Google Cloud Storage.

For example, create a **Flowers** model, add **Daisy**, **Rose**, and **Sunflower** classes, upload your examples, and train a classifier. Then upload a new flower image to see its predicted class.

## How it works

1. **Create a model** from the dashboard.
2. **Add classes** representing the labels you want to recognize.
3. **Upload examples** for each class. Use JPG or PNG images for the clearest path through the current upload and counting logic.
4. **Select Generate** to train the model.
5. **Select Predict** and upload an image to classify it.

### Built with

| Layer | Technology |
| --- | --- |
| Interface | React 18, React Router, PrimeReact, PrimeFlex |
| Frontend tooling | Vite 7; Tailwind CSS plugin configured |
| API | Python, Flask, Flask-CORS |
| Machine learning | TensorFlow 2.20, Keras, NumPy, Pillow |
| Image and model storage | Google Cloud Storage |
| Account and session storage | SQLite |

## Project structure

```text
LabelLens/
├── backend/
│   ├── app.py                 # Flask routes and cloud-storage integration
│   ├── easy_model.py          # CNN training and image prediction
│   ├── easy_user.py           # SQLite account and session helpers
│   └── requirements.txt       # Pinned Python dependencies
├── docs/
│   └── readme-banner.svg      # Repository cover artwork
├── frontend/
│   ├── public/                # Branding assets and redirect configuration
│   ├── src/
│   │   ├── Pages/             # Home, account, dashboard, model, settings
│   │   ├── components/        # Shared page layout
│   │   └── main.jsx           # App entry point and routes
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Feedback

Found a bug or have an idea? [Open an issue](https://github.com/Mushium/LabelLens/issues) with the steps to reproduce it or a description of the proposed improvement.
