---
id: pytorch-transformer-classifier
category: example
tags: [ml, pytorch, transformer, classification, deep-learning]
capabilities:
  - Transformer model architecture with PyTorch Lightning
  - Custom datasets and data loaders
  - Training with callbacks and early stopping
  - Model checkpointing and TensorBoard logging
useWhen:
  - Building transformer-based classification models
  - Implementing attention mechanisms
  - Training deep learning models with PyTorch Lightning
  - Need production-ready training pipeline with monitoring
estimatedTokens: 1700
relatedResources:
  - orchestr8://agents/ml-engineer
---

# PyTorch Transformer Classifier

## Overview
Complete transformer-based classifier using PyTorch Lightning with attention layers, custom datasets, and production training features.

## Implementation

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import pytorch_lightning as pl
from torchmetrics import Accuracy, F1Score

# Custom dataset
class CustomDataset(Dataset):
    def __init__(self, data, labels, transform=None):
        self.data = data
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        sample = self.data[idx]
        label = self.labels[idx]

        if self.transform:
            sample = self.transform(sample)

        return sample, label

# Model architecture
class TransformerClassifier(pl.LightningModule):
    def __init__(self, vocab_size, embedding_dim=256, num_heads=8,
                 num_layers=6, num_classes=10, dropout=0.1):
        super().__init__()
        self.save_hyperparameters()

        # Embedding layer
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.pos_encoding = PositionalEncoding(embedding_dim, dropout)

        # Transformer encoder
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embedding_dim,
            nhead=num_heads,
            dim_feedforward=1024,
            dropout=dropout,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers)

        # Classification head
        self.classifier = nn.Sequential(
            nn.Linear(embedding_dim, 512),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(512, num_classes)
        )

        # Metrics
        self.train_acc = Accuracy(task='multiclass', num_classes=num_classes)
        self.val_acc = Accuracy(task='multiclass', num_classes=num_classes)
        self.val_f1 = F1Score(task='multiclass', num_classes=num_classes, average='macro')

    def forward(self, x, mask=None):
        # x: [batch_size, seq_len]
        embedded = self.embedding(x) * torch.sqrt(torch.tensor(self.hparams.embedding_dim))
        embedded = self.pos_encoding(embedded)

        # Transformer encoding
        encoded = self.transformer(embedded, src_key_padding_mask=mask)

        # Global average pooling
        pooled = encoded.mean(dim=1)

        # Classification
        logits = self.classifier(pooled)
        return logits

    def training_step(self, batch, batch_idx):
        x, y = batch
        logits = self(x)
        loss = nn.functional.cross_entropy(logits, y)

        # Metrics
        preds = torch.argmax(logits, dim=1)
        acc = self.train_acc(preds, y)

        self.log('train_loss', loss, prog_bar=True)
        self.log('train_acc', acc, prog_bar=True)
        return loss

    def validation_step(self, batch, batch_idx):
        x, y = batch
        logits = self(x)
        loss = nn.functional.cross_entropy(logits, y)

        preds = torch.argmax(logits, dim=1)
        acc = self.val_acc(preds, y)
        f1 = self.val_f1(preds, y)

        self.log('val_loss', loss, prog_bar=True)
        self.log('val_acc', acc, prog_bar=True)
        self.log('val_f1', f1, prog_bar=True)
        return loss

    def configure_optimizers(self):
        optimizer = optim.AdamW(
            self.parameters(),
            lr=1e-4,
            weight_decay=0.01
        )

        scheduler = optim.lr_scheduler.OneCycleLR(
            optimizer,
            max_lr=1e-3,
            total_steps=self.trainer.estimated_stepping_batches,
            pct_start=0.1
        )

        return {
            'optimizer': optimizer,
            'lr_scheduler': {
                'scheduler': scheduler,
                'interval': 'step'
            }
        }

# Training
from pytorch_lightning.callbacks import ModelCheckpoint, EarlyStopping
from pytorch_lightning.loggers import TensorBoardLogger

# Callbacks
checkpoint_callback = ModelCheckpoint(
    dirpath='checkpoints/',
    filename='model-{epoch:02d}-{val_acc:.3f}',
    monitor='val_acc',
    mode='max',
    save_top_k=3
)

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=5,
    mode='min'
)

# Logger
logger = TensorBoardLogger('logs/', name='transformer_classifier')

# Trainer
trainer = pl.Trainer(
    max_epochs=50,
    accelerator='auto',
    devices='auto',
    precision='16-mixed',
    callbacks=[checkpoint_callback, early_stop],
    logger=logger,
    gradient_clip_val=1.0,
    accumulate_grad_batches=4
)

model = TransformerClassifier(vocab_size=50000, num_classes=10)
trainer.fit(model, train_loader, val_loader)

# Inference
model.eval()
with torch.no_grad():
    predictions = model(test_data)
    probabilities = torch.softmax(predictions, dim=1)
```

## Usage Notes

**Architecture:**
- Embedding layer with positional encoding
- Multi-head self-attention via TransformerEncoder
- Global average pooling for sequence aggregation
- Classification head with dropout

**Training Features:**
- PyTorch Lightning for clean training loops
- Mixed precision (16-bit) for faster training
- Gradient clipping to prevent exploding gradients
- Gradient accumulation for large effective batch sizes

**Callbacks:**
- ModelCheckpoint: Save best models based on validation accuracy
- EarlyStopping: Stop training when validation loss plateaus
- TensorBoard: Monitor training progress with visualizations

**Optimization:**
- AdamW optimizer with weight decay
- OneCycleLR scheduler for super-convergence
- Learning rate warmup (10% of training)
