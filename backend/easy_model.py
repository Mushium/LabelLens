import tensorflow as tf
from keras import layers, models, utils, optimizers
import numpy as np
import os


class Easy_Model:

    def __init__(self,train_dir,epo,batch_size,model_name,save_path):
        self.train_dir = train_dir
        self.epo = epo
        self.save_path = save_path
        self.batch_size = batch_size
        self.model_name = model_name
        self._Train()
   

    def _Train(self):
        # Get class names
        class_names = sorted(os.listdir(self.train_dir))
        num_classes = len(class_names)

        # Load images
        train_data = utils.image_dataset_from_directory(
            self.train_dir,
            validation_split=0.3,            # reserve 30% for validation/test
            subset="training",               # specify training set
            seed=123,   # Same split
            image_size=(128,128),
            batch_size=self.batch_size,  # smaller batch size for better weight updates
            pad_to_aspect_ratio=True
        )

        test_data = utils.image_dataset_from_directory(
            self.train_dir,
            validation_split=0.3,
            subset="validation",             # specify validation set
            seed=123,
            image_size=(128,128),
            batch_size=self.batch_size,
            pad_to_aspect_ratio=True
        )

        # Data augmentation
        data_augmentation = models.Sequential([
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.2),
            layers.RandomZoom(0.2),
            layers.RandomBrightness(0.2),
        ])

        # CNN model
        model = models.Sequential([
            data_augmentation,
            layers.Rescaling(1./255, input_shape=(128, 128, 3)),

            layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D(2, 2),

            layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D(2, 2),

            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D(2, 2),

            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D(2, 2),

            layers.Flatten(),
            layers.Dense(128, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(num_classes, activation='softmax')
        ])

        # Compile
        model.compile(
            optimizer=optimizers.Adam(learning_rate=0.0005),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )

        # Train
        history = model.fit(
            train_data,
            epochs=self.epo,
            validation_data=test_data
        )

        # Save model
        model.save(os.path.join(self.save_path, f"{self.model_name}.keras"))


    def Predict(model_path,predict_path,data_dir):
        model = models.load_model(model_path)

        # Load and preprocess image
        img = utils.load_img(
            predict_path, 
            target_size=(128, 128)
        )
        img_array = utils.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions[0])
        confidence = np.max(predictions[0])

        # Get class names
        class_names = data_dir

        print("Classes: ",class_names)
        print("Probabilities:", predictions[0])
        print("Predicted Class:", class_names[predicted_class])
        print("Confidence:", confidence)

        return class_names[predicted_class]

