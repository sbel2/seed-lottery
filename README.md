# The seed lottery

A narrated, animated explainer of Dodge et al. (2020), *Fine-Tuning Pretrained Language Models: Weight Initializations, Data Orders, and Early Stopping* ([arXiv:2002.06305](https://arxiv.org/abs/2002.06305)).

Open `index.html` (or the GitHub Pages site). It trains 100 tiny networks in your browser, then plays the film. Every number shown or spoken comes from that simulation, except the MRPC chart, which is from the paper's Table 1.

Narration clips live in `audio/`. To regenerate them, put `ELEVENLABS_API_KEY=...` in a `.env` file (never committed) and run `node make-narration.mjs`.
