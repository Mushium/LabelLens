![LabelLens — Your images. Your classes. Your classifier.](docs/readme-banner.svg)

<p align="center">
A browser-based workspace for building custom image classifiers. Organize labeled images, train a neural network, and try predictions in one workflow.
</p>

<p align="center">
  <a href="https://lablelslens.netlify.app">Live Demo</a>
  <a href="https://labellens.onrender.com">Backend API</a>
</p>

## Why LabelLens?

Experimenting with image classification involves more than training a model: you need to organize examples, assign labels, and test the result. LabelLens brings those steps into a React interface backed by Flask, TensorFlow, and Google Cloud Storage.

For example, create a Flowers model, add Daisy, Rose, and Sunflower classes, upload your examples, and train a classifier. Then upload a new flower image to see its predicted class.

## How it works

1. Create a model from the dashboard.
2. Add classes representing the labels you want to recognize.
3. Upload examples for each class. Use JPG or PNG images for best results.
4. Select Generate to train the model.
5. Select Predict and upload an image to classify it.

## Built with

1. Frontend: React
2. Backend: Flask
3. Machine Learning Library: TensorFlow and Keras
4. Storage: Google Cloud Storage and SQLite

## License and Copyrights

Copyrights (c) 2026 Abdulla Almehairbi. This package is licensed under the MIT license.
