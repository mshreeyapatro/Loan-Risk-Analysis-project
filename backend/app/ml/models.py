import torch
import torch.nn as nn

class TabularAutoencoder(nn.Module):
    """
    Symmetric Deep Tabular Autoencoder for unsupervised anomaly detection.
    Bottleneck layer (8-dim) compresses the 33-dimensional standardized input.
    """
    def __init__(self, input_dim=33):
        super(TabularAutoencoder, self).__init__()
        # Encoder
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 8)  # 8-dim latent space
        )
        # Decoder
        self.decoder = nn.Sequential(
            nn.Linear(8, 16),
            nn.ReLU(),
            nn.Linear(16, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Linear(32, input_dim)
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded
