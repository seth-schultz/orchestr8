---
id: tensorflow-keras-multi-input
category: example
tags: [ml, tensorflow, keras, deep-learning, attention, multi-input]
capabilities:
  - Multi-input model with functional API
  - Custom attention layer implementation
  - Advanced training callbacks and optimizers
  - Model saving for TensorFlow Serving
useWhen:
  - Building models with multiple input types (text, numeric)
  - Implementing custom attention mechanisms
  - Need production-ready Keras models
  - Deploying models with TensorFlow Serving
estimatedTokens: 1400
relatedResources:
  - orchestr8://agents/ml-engineer
---

# TensorFlow/Keras Multi-Input Model

## Overview
Production-ready multi-input model using Keras Functional API with custom attention layer, combining text and numeric features.

## Implementation

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
import tensorflow_addons as tfa

# Custom layer
class AttentionLayer(layers.Layer):
    def __init__(self, units):
        super().__init__()
        self.W = layers.Dense(units)
        self.V = layers.Dense(1)

    def call(self, features):
        # features: [batch_size, seq_len, features_dim]
        score = tf.nn.tanh(self.W(features))
        attention_weights = tf.nn.softmax(self.V(score), axis=1)
        context_vector = attention_weights * features
        context_vector = tf.reduce_sum(context_vector, axis=1)
        return context_vector, attention_weights

# Model with functional API
def build_model(vocab_size, embedding_dim=128, max_len=100):
    # Inputs
    text_input = layers.Input(shape=(max_len,), name='text')
    numeric_input = layers.Input(shape=(10,), name='numeric_features')

    # Text branch
    embedding = layers.Embedding(vocab_size, embedding_dim)(text_input)
    lstm = layers.Bidirectional(layers.LSTM(128, return_sequences=True))(embedding)
    context, attention = AttentionLayer(128)(lstm)

    # Numeric branch
    numeric = layers.Dense(64, activation='relu')(numeric_input)
    numeric = layers.BatchNormalization()(numeric)
    numeric = layers.Dropout(0.3)(numeric)

    # Concatenate branches
    concat = layers.Concatenate()([context, numeric])

    # Classification head
    dense = layers.Dense(256, activation='relu')(concat)
    dense = layers.BatchNormalization()(dense)
    dense = layers.Dropout(0.5)(dense)
    output = layers.Dense(10, activation='softmax', name='output')(dense)

    # Model
    model = models.Model(
        inputs=[text_input, numeric_input],
        outputs=output
    )

    return model

# Compile with advanced optimizer
model = build_model(vocab_size=50000)

optimizer = tfa.optimizers.AdamW(
    learning_rate=1e-3,
    weight_decay=1e-4
)

model.compile(
    optimizer=optimizer,
    loss='sparse_categorical_crossentropy',
    metrics=[
        'accuracy',
        tf.keras.metrics.Precision(name='precision'),
        tf.keras.metrics.Recall(name='recall'),
        tfa.metrics.F1Score(num_classes=10, average='macro', name='f1')
    ]
)

# Callbacks
callbacks = [
    # Learning rate scheduling
    keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-7
    ),

    # Early stopping
    keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True
    ),

    # Model checkpointing
    keras.callbacks.ModelCheckpoint(
        'best_model.h5',
        monitor='val_f1',
        mode='max',
        save_best_only=True
    ),

    # TensorBoard
    keras.callbacks.TensorBoard(
        log_dir='logs/',
        histogram_freq=1,
        profile_batch='10,20'
    ),

    # Custom callback
    keras.callbacks.LambdaCallback(
        on_epoch_end=lambda epoch, logs: print(
            f"\nEpoch {epoch}: F1={logs['val_f1']:.3f}"
        )
    )
]

# Training
history = model.fit(
    {'text': X_train_text, 'numeric_features': X_train_numeric},
    y_train,
    validation_data=(
        {'text': X_val_text, 'numeric_features': X_val_numeric},
        y_val
    ),
    epochs=100,
    batch_size=64,
    callbacks=callbacks,
    class_weight={0: 1.0, 1: 2.0}  # Handle class imbalance
)

# Save for TensorFlow Serving
model.save('saved_model/', save_format='tf')
```

## Usage Notes

**Multi-Input Architecture:**
- Text input processed through embedding and BiLSTM
- Numeric features processed through dense layers
- Custom attention layer for text feature extraction
- Late fusion by concatenating processed features

**Custom Attention Layer:**
- Learns importance weights for sequence elements
- Returns context vector and attention weights
- Useful for interpreting model decisions

**Advanced Features:**
- AdamW optimizer with weight decay for regularization
- Multiple metrics (accuracy, precision, recall, F1)
- Class weights to handle imbalanced datasets
- Batch normalization for training stability

**Callbacks:**
- ReduceLROnPlateau: Adaptive learning rate reduction
- EarlyStopping: Prevent overfitting
- ModelCheckpoint: Save best model by F1 score
- TensorBoard: Visualize training metrics and profiling
- LambdaCallback: Custom epoch-end actions

**Production Deployment:**
- Save model in TensorFlow SavedModel format
- Compatible with TensorFlow Serving
- Supports versioning and A/B testing
