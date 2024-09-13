import tensorflow as tf

# Load MobileNetV2 with pre-trained weights
model = tf.keras.applications.MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Save the model
model.save('mobilenet_v2')
