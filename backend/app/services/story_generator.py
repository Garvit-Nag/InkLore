import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel, GPT2Config
from app.core.config import settings

class StoryGenerator:
    def __init__(self, model_path=settings.MODEL_PATH):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {self.device}")
        
        self.tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
        self.tokenizer.pad_token = self.tokenizer.eos_token
        
        self.config = GPT2Config(
            vocab_size=self.tokenizer.vocab_size,
            n_positions=256,
            n_ctx=256,
            n_embd=256,
            n_layer=4,
            n_head=8
        )
        
        self.model = GPT2LMHeadModel(self.config)
        self.load_model(model_path)
        self.model.to(self.device)
        self.best_loss = float('inf')
    
    def load_model(self, path):
        checkpoint = torch.load(path, map_location=self.device)
        self.model.load_state_dict(checkpoint['model_state_dict'])

    def generate_story(self, prompt, max_length=200, temperature=0.7):
        self.model.eval()
        input_ids = self.tokenizer.encode(prompt, return_tensors='pt').to(self.device)
        
        with torch.no_grad():
            output_ids = self.model.generate(
                input_ids,
                max_length=max_length,
                num_return_sequences=1,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                num_beams=1,
                temperature=temperature,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
                length_penalty=1.0,
                no_repeat_ngram_size=3,
                early_stopping=True
            )[0]
        
        return self.tokenizer.decode(output_ids, skip_special_tokens=True)
