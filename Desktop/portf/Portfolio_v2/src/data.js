// All site content lives here. Edit this file, not the components.
export const profile = {
  name: 'Shyam Hari',
  role: 'ML Engineer',
  role2: '& Data Scientist',
  email: 'shyamhwrk@gmail.com',
  linkedin: 'https://linkedin.com/in/shyam-hari-5389492b3',
  github: 'https://github.com/shyamhari1074',
  resume: '/resume.pdf',
};

export const nav = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'];

export const about = [
  "I'm Shyam Hari, an Artificial Intelligence and Data Science undergraduate at SJCET Palai, interested in building intelligent systems and extracting meaningful insights from data.",
  "I don't just train models, I ship them: reinforcement learning agents, multi-agent AI platforms and LLM pipelines that go from raw data to a working product.",
];
export const interests = ['Data Science', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Reinforcement Learning', 'Data Analytics'];
export const stats = [
  ['7', 'projects'],
  ['~80%', 'RL gain over baseline hedging'],
  ['3', 'AI agents live'],
];

// Placeholder services. Replace with real offers later.
export const services = [
  ['Machine learning models', 'Classification, regression and clustering, trained and evaluated end to end.'],
  ['Computer vision', 'Detection and recognition systems built with OpenCV and YOLO.'],
  ['NLP and LLM pipelines', 'Turn unstructured text into structured, usable output.'],
  ['Data analysis and dashboards', 'Exploratory analysis and interactive dashboards that answer real questions.'],
];

// `github` is only set where you've confirmed the repo. Candidates for the rest are in comments.
export const projects = [
  {
    name: 'LeafNetwork', mark: 'LN',
    desc: 'Multi-agent AI platform for farmers. Vision, Climate and Satellite agents handle real-time crop disease detection, live market signals and AI chat. Shipped independently to Vercel.',
    tags: ['React 19', 'FastAPI', 'PyTorch', 'LLaMA 3'],
    github: 'https://github.com/shyamhari1074/The_Leaf_Network',
  },
  {
    name: 'RL Financial Optimiser', mark: 'RL',
    desc: 'PPO agent on financial time-series with custom reward functions and domain-specific state features. Outperformed baseline statistical hedging by ~80%.',
    tags: ['PPO', 'Stable-Baselines3', 'Gymnasium'],
    // candidate: https://github.com/shyamhari1074/rl-option-hedging
  },
  {
    name: 'Neuromorphic Gesture Recognition', mark: 'NG',
    desc: 'Event-driven, bio-inspired hand gesture framework for controlling the desktop, built on spiking neural networks.',
    tags: ['Spiking neural networks', 'Event-driven', 'Gesture control'],
    github: 'https://github.com/shyamhari1074/NeuroGesture',
  },
  {
    name: 'Padik AI', mark: 'PA',
    desc: 'Agentic NLP pipeline that turns raw YouTube transcripts into structured study notes and Q&A pairs with LLaMA 3.1.',
    tags: ['LLaMA 3.1', 'Groq API', 'NLP'],
    // candidate: https://github.com/shyamhari1074/YouTube-transcript-chatbot
  },
  {
    name: 'Neuroevolution Agent', mark: 'NE',
    desc: 'Neural game agent trained with genetic algorithms: gradient-free optimisation and fitness-based selection across generations.',
    tags: ['PyTorch', 'NEAT', 'Genetic algorithms'],
    // candidate: https://github.com/shyamhari1074/Jetpack-Joyrider-GNN-RL (unconfirmed)
  },
  {
    name: 'Segmentation Platform', mark: 'SP',
    desc: 'K-Means clustering across 5 behavioural segments with a logistic regression churn classifier and a live Streamlit inference dashboard.',
    tags: ['Scikit-learn', 'Streamlit', 'Joblib'],
    github: 'https://github.com/shyamhari1074/Customer-segmentation-and-retention-analysis',
  },
  {
    name: 'E-commerce Analysis', mark: 'EA',
    desc: 'EDA and linear regression on 2,000+ customer records, surfacing coefficient-level drivers of annual spend per unit.',
    tags: ['Pandas', 'Scikit-learn', 'Seaborn'],
    // candidate: https://github.com/shyamhari1074/Linear-Regression--Ecommerce-Company-project
  },
];

export const skills = [
  ['Languages', ['Python', 'Java', 'SQL', 'JavaScript', 'C']],
  ['Data science', ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Statsmodels']],
  ['ML, DL and RL', ['PyTorch', 'TensorFlow', 'OpenCV', 'YOLO', 'Stable-Baselines3', 'Gymnasium', 'Transformers', 'NEAT']],
  ['LLMs and apps', ['LLaMA 3', 'Groq API', 'FastAPI', 'Streamlit', 'React']],
  ['Tools', ['Git', 'GitHub', 'Jupyter', 'VS Code', 'PyCharm', 'Vercel']],
];

export const journey = [
  { title: 'Vice Chairperson', place: 'CSI SB SJCET', note: 'Joined as a member, became event lead, then vice chairperson.', steps: ['Member', 'Event lead', 'Vice chairperson'] },
  { title: 'Curator', place: 'TEDxSJCET Palai 2026', note: 'Curator for the 2026 edition.' },
  { title: 'B.Tech, Artificial Intelligence & Data Science', place: 'SJCET Palai', note: 'Graduating 2026.' },
];
export const virtual = 'Also completed virtual experience programs with British Airways (data science) and Commonwealth Bank (intro to data science) on Forage.';
